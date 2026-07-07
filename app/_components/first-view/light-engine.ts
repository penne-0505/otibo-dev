import { type LightDebugMode, shouldRunLightAnimation } from "./light-policy";

const VERTEX_SHADER = `#version 300 es
precision highp float;
in vec2 position;
void main() {
  gl_Position = vec4(position, 0.0, 1.0);
}`;

type Resources = {
  buffer: WebGLBuffer;
  heightTexture: WebGLTexture;
  position: number;
  program: WebGLProgram;
  uniforms: {
    debugMode: WebGLUniformLocation;
    heightMap: WebGLUniformLocation;
    resolution: WebGLUniformLocation;
    time: WebGLUniformLocation;
  };
  vertexArray: WebGLVertexArrayObject;
};

type LightEngineOptions = {
  canvas: HTMLCanvasElement;
  debugMode: LightDebugMode;
  onFailure: (error: unknown) => void;
  onFirstFrame: () => void;
  onUnavailable: () => void;
};

function assertResource<T>(resource: T | null, label: string): T {
  if (resource === null)
    throw new Error(`Unable to create WebGL resource: ${label}.`);
  return resource;
}

function compileShader(
  gl: WebGL2RenderingContext,
  type: number,
  source: string,
) {
  const shader = assertResource(gl.createShader(type), "shader");
  gl.shaderSource(shader, source);
  gl.compileShader(shader);

  if (!gl.getShaderParameter(shader, gl.COMPILE_STATUS)) {
    const message = gl.getShaderInfoLog(shader) || "Shader compilation failed.";
    gl.deleteShader(shader);
    throw new Error(message);
  }

  return shader;
}

async function loadAsset(url: string) {
  const response = await fetch(url);
  if (!response.ok)
    throw new Error(`Unable to load ${url}: ${response.status}.`);
  return response;
}

class LightEngine {
  readonly #canvas: HTMLCanvasElement;
  readonly #debugMode: LightDebugMode;
  readonly #fragmentSource: string;
  readonly #gl: WebGL2RenderingContext;
  readonly #heightMap: ImageBitmap;
  readonly #motionQuery = window.matchMedia("(prefers-reduced-motion: reduce)");
  readonly #onFailure: (error: unknown) => void;
  readonly #onFirstFrame: () => void;
  readonly #resizeObserver: ResizeObserver;
  #contextLost = false;
  #disposed = false;
  #elapsedSeconds = 0;
  #firstFrameRendered = false;
  #frameId: number | null = null;
  #lastFrameTime: number | null = null;
  #resources: Resources | null = null;

  constructor(
    options: LightEngineOptions,
    gl: WebGL2RenderingContext,
    fragmentSource: string,
    heightMap: ImageBitmap,
  ) {
    this.#canvas = options.canvas;
    this.#debugMode = options.debugMode;
    this.#fragmentSource = fragmentSource;
    this.#gl = gl;
    this.#heightMap = heightMap;
    this.#onFailure = options.onFailure;
    this.#onFirstFrame = options.onFirstFrame;
    this.#resizeObserver = new ResizeObserver(this.#handleResize);
  }

  start() {
    this.#resources = this.#createResources();
    this.#canvas.addEventListener("webglcontextlost", this.#handleContextLost);
    this.#canvas.addEventListener(
      "webglcontextrestored",
      this.#handleContextRestored,
    );
    this.#motionQuery.addEventListener("change", this.#handleMotionChange);
    document.addEventListener("visibilitychange", this.#handleVisibilityChange);
    this.#resizeObserver.observe(this.#canvas);
    this.#scheduleFrame();
  }

  dispose() {
    if (this.#disposed) return;
    this.#disposed = true;
    this.#cancelFrame();
    this.#resizeObserver.disconnect();
    this.#canvas.removeEventListener(
      "webglcontextlost",
      this.#handleContextLost,
    );
    this.#canvas.removeEventListener(
      "webglcontextrestored",
      this.#handleContextRestored,
    );
    this.#motionQuery.removeEventListener("change", this.#handleMotionChange);
    document.removeEventListener(
      "visibilitychange",
      this.#handleVisibilityChange,
    );
    this.#deleteResources();
    this.#heightMap.close();
  }

  #createResources(): Resources {
    const gl = this.#gl;
    const vertexShader = compileShader(gl, gl.VERTEX_SHADER, VERTEX_SHADER);
    const fragmentShader = compileShader(
      gl,
      gl.FRAGMENT_SHADER,
      this.#fragmentSource,
    );
    const program = assertResource(gl.createProgram(), "program");
    gl.attachShader(program, vertexShader);
    gl.attachShader(program, fragmentShader);
    gl.linkProgram(program);
    gl.deleteShader(vertexShader);
    gl.deleteShader(fragmentShader);

    if (!gl.getProgramParameter(program, gl.LINK_STATUS)) {
      const message = gl.getProgramInfoLog(program) || "Shader link failed.";
      gl.deleteProgram(program);
      throw new Error(message);
    }

    const buffer = assertResource(gl.createBuffer(), "buffer");
    gl.bindBuffer(gl.ARRAY_BUFFER, buffer);
    gl.bufferData(
      gl.ARRAY_BUFFER,
      new Float32Array([-1, -1, 3, -1, -1, 3]),
      gl.STATIC_DRAW,
    );

    const vertexArray = assertResource(gl.createVertexArray(), "vertex array");
    const position = gl.getAttribLocation(program, "position");
    if (position < 0)
      throw new Error("Shader position attribute is unavailable.");
    gl.bindVertexArray(vertexArray);
    gl.enableVertexAttribArray(position);
    gl.vertexAttribPointer(position, 2, gl.FLOAT, false, 0, 0);

    const heightTexture = assertResource(gl.createTexture(), "height texture");
    gl.bindTexture(gl.TEXTURE_2D, heightTexture);
    gl.pixelStorei(gl.UNPACK_FLIP_Y_WEBGL, true);
    gl.texImage2D(
      gl.TEXTURE_2D,
      0,
      gl.RGBA8,
      gl.RGBA,
      gl.UNSIGNED_BYTE,
      this.#heightMap,
    );
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_S, gl.REPEAT);
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_T, gl.REPEAT);
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.LINEAR);
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.LINEAR);

    return {
      buffer,
      heightTexture,
      position,
      program,
      uniforms: {
        debugMode: assertResource(
          gl.getUniformLocation(program, "u_debug_mode"),
          "u_debug_mode",
        ),
        heightMap: assertResource(
          gl.getUniformLocation(program, "u_height_map"),
          "u_height_map",
        ),
        resolution: assertResource(
          gl.getUniformLocation(program, "u_resolution"),
          "u_resolution",
        ),
        time: assertResource(
          gl.getUniformLocation(program, "u_time"),
          "u_time",
        ),
      },
      vertexArray,
    };
  }

  #deleteResources() {
    if (!this.#resources || this.#contextLost) {
      this.#resources = null;
      return;
    }
    const { buffer, heightTexture, program, vertexArray } = this.#resources;
    this.#gl.deleteBuffer(buffer);
    this.#gl.deleteTexture(heightTexture);
    this.#gl.deleteProgram(program);
    this.#gl.deleteVertexArray(vertexArray);
    this.#resources = null;
  }

  #cancelFrame() {
    if (this.#frameId !== null) cancelAnimationFrame(this.#frameId);
    this.#frameId = null;
    this.#lastFrameTime = null;
  }

  #scheduleFrame() {
    if (
      this.#disposed ||
      this.#contextLost ||
      document.visibilityState === "hidden" ||
      this.#frameId !== null
    ) {
      return;
    }
    this.#frameId = requestAnimationFrame(this.#renderFrame);
  }

  #renderFrame = (now: number) => {
    this.#frameId = null;
    const resources = this.#resources;
    if (this.#disposed || this.#contextLost || !resources) return;

    const runsContinuously = shouldRunLightAnimation({
      contextLost: this.#contextLost,
      documentHidden: document.visibilityState === "hidden",
      reducedMotion: this.#motionQuery.matches,
    });
    if (runsContinuously && this.#lastFrameTime !== null) {
      this.#elapsedSeconds += Math.min(
        0.05,
        (now - this.#lastFrameTime) * 0.001,
      );
    }
    this.#lastFrameTime = now;
    this.#resizeCanvas();

    const gl = this.#gl;
    // biome-ignore lint/correctness/useHookAtTopLevel: WebGLRenderingContext.useProgram is not a React hook.
    gl.useProgram(resources.program);
    gl.bindVertexArray(resources.vertexArray);
    gl.activeTexture(gl.TEXTURE0);
    gl.bindTexture(gl.TEXTURE_2D, resources.heightTexture);
    gl.uniform1i(resources.uniforms.heightMap, 0);
    gl.uniform1i(resources.uniforms.debugMode, this.#debugMode);
    gl.uniform2f(
      resources.uniforms.resolution,
      this.#canvas.width,
      this.#canvas.height,
    );
    gl.uniform1f(resources.uniforms.time, this.#elapsedSeconds);
    gl.drawArrays(gl.TRIANGLES, 0, 3);

    if (!this.#firstFrameRendered) {
      this.#firstFrameRendered = true;
      this.#onFirstFrame();
    }
    if (runsContinuously) this.#scheduleFrame();
  };

  #resizeCanvas() {
    const dpr = Math.min(window.devicePixelRatio || 1, 2);
    const width = Math.max(1, Math.floor(this.#canvas.clientWidth * dpr));
    const height = Math.max(1, Math.floor(this.#canvas.clientHeight * dpr));
    if (this.#canvas.width === width && this.#canvas.height === height) return;
    this.#canvas.width = width;
    this.#canvas.height = height;
    this.#gl.viewport(0, 0, width, height);
  }

  #handleResize = () => this.#scheduleFrame();

  #handleMotionChange = () => {
    this.#cancelFrame();
    this.#scheduleFrame();
  };

  #handleVisibilityChange = () => {
    if (document.visibilityState === "hidden") this.#cancelFrame();
    else this.#scheduleFrame();
  };

  #handleContextLost = (event: Event) => {
    event.preventDefault();
    this.#contextLost = true;
    this.#resources = null;
    this.#cancelFrame();
    this.#canvas.dataset.ready = "false";
    this.#canvas.dataset.status = "context-lost";
  };

  #handleContextRestored = () => {
    if (this.#disposed) return;
    this.#contextLost = false;
    this.#firstFrameRendered = false;
    this.#canvas.dataset.status = "loading";
    try {
      this.#resources = this.#createResources();
      this.#scheduleFrame();
    } catch (error) {
      this.#onFailure(error);
    }
  };
}

export async function startLightEngine(options: LightEngineOptions) {
  // intent why-not: INV-004 (Site/first-view-light-shader) — background animation does not request a discrete high-performance GPU.
  const gl = options.canvas.getContext("webgl2", {
    alpha: false,
    antialias: false,
    depth: false,
    powerPreference: "default",
    stencil: false,
  });
  if (!gl) {
    options.onUnavailable();
    return null;
  }

  const [fragmentResponse, heightMapResponse] = await Promise.all([
    loadAsset("/first-view/light.frag"),
    loadAsset("/first-view/light-height-map.png"),
  ]);
  const [fragmentSource, heightMapBlob] = await Promise.all([
    fragmentResponse.text(),
    heightMapResponse.blob(),
  ]);
  const heightMap = await createImageBitmap(heightMapBlob);
  const engine = new LightEngine(options, gl, fragmentSource, heightMap);
  try {
    engine.start();
  } catch (error) {
    engine.dispose();
    throw error;
  }
  return engine;
}
