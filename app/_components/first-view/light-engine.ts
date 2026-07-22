import {
  type LightDebugMode,
  resolveFirstViewWordmarkOpacity,
  resolveLightExitWash,
  resolveLightScrollProgress,
} from "./light-policy";

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
    exitWash: WebGLUniformLocation;
    heightMap: WebGLUniformLocation;
    heightMapSize: WebGLUniformLocation;
    resolution: WebGLUniformLocation;
    scrollProgress: WebGLUniformLocation;
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

export const HEIGHT_TEXTURE_BYTES_PER_TEXEL = 1;

export function estimateHeightTextureBytes(width: number, height: number) {
  return width * height * HEIGHT_TEXTURE_BYTES_PER_TEXEL;
}

export function resolveHeightTextureFormat(
  gl: Pick<WebGL2RenderingContext, "R8" | "RED" | "UNSIGNED_BYTE">,
) {
  return {
    format: gl.RED,
    internalFormat: gl.R8,
    type: gl.UNSIGNED_BYTE,
  } as const;
}

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
  readonly #section: HTMLElement | null;
  #contextLost = false;
  #disposed = false;
  #firstFrameRendered = false;
  #frameId: number | null = null;
  #renderCount = 0;
  #resources: Resources | null = null;
  #scrollProgress = 0;

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
    this.#section = options.canvas.closest("section");
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
    window.addEventListener("scroll", this.#handleScroll, { passive: true });
    this.#resizeObserver.observe(this.#canvas);
    this.#canvas.dataset.scrollEffect = "incidence-00";
    this.#handleScroll();
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
    window.removeEventListener("scroll", this.#handleScroll);
    this.#section?.style.removeProperty("--first-view-wordmark-opacity");
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
    const maximumTextureSize = gl.getParameter(gl.MAX_TEXTURE_SIZE) as number;
    if (
      this.#heightMap.width > maximumTextureSize ||
      this.#heightMap.height > maximumTextureSize
    ) {
      throw new Error(
        `Height map ${this.#heightMap.width}x${this.#heightMap.height} exceeds MAX_TEXTURE_SIZE ${maximumTextureSize}.`,
      );
    }
    gl.bindTexture(gl.TEXTURE_2D, heightTexture);
    gl.pixelStorei(gl.UNPACK_FLIP_Y_WEBGL, true);
    const heightTextureFormat = resolveHeightTextureFormat(gl);
    // intent: DEC-007 (Site/first-view-light-shader) — retaining only sampled height avoids unused GPU channels.
    gl.texImage2D(
      gl.TEXTURE_2D,
      0,
      heightTextureFormat.internalFormat,
      heightTextureFormat.format,
      heightTextureFormat.type,
      this.#heightMap,
    );
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_S, gl.REPEAT);
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_T, gl.REPEAT);
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.LINEAR);
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.LINEAR);
    const textureBytes = estimateHeightTextureBytes(
      this.#heightMap.width,
      this.#heightMap.height,
    );
    this.#canvas.dataset.heightMapSize = `${this.#heightMap.width}x${this.#heightMap.height}`;
    this.#canvas.dataset.heightTextureBytes = String(textureBytes);
    this.#canvas.dataset.heightTextureFormat = "R8";
    this.#canvas.dataset.maxTextureSize = String(maximumTextureSize);

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
        exitWash: assertResource(
          gl.getUniformLocation(program, "u_exit_wash"),
          "u_exit_wash",
        ),
        heightMap: assertResource(
          gl.getUniformLocation(program, "u_height_map"),
          "u_height_map",
        ),
        heightMapSize: assertResource(
          gl.getUniformLocation(program, "u_height_map_size"),
          "u_height_map_size",
        ),
        resolution: assertResource(
          gl.getUniformLocation(program, "u_resolution"),
          "u_resolution",
        ),
        scrollProgress: assertResource(
          gl.getUniformLocation(program, "u_scroll_progress"),
          "u_scroll_progress",
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

  #renderFrame = () => {
    this.#frameId = null;
    const resources = this.#resources;
    if (this.#disposed || this.#contextLost || !resources) return;

    this.#resizeCanvas();
    const exitWash = resolveLightExitWash(this.#scrollProgress);
    const wordmarkOpacity = resolveFirstViewWordmarkOpacity(exitWash);

    const gl = this.#gl;
    // biome-ignore suppressions/unused: The targeted rule suppression below prevents a WebGL API false positive.
    // biome-ignore lint/correctness/useHookAtTopLevel: WebGLRenderingContext.useProgram is not a React hook.
    gl.useProgram(resources.program);
    gl.bindVertexArray(resources.vertexArray);
    gl.activeTexture(gl.TEXTURE0);
    gl.bindTexture(gl.TEXTURE_2D, resources.heightTexture);
    gl.uniform1i(resources.uniforms.heightMap, 0);
    gl.uniform2f(
      resources.uniforms.heightMapSize,
      this.#heightMap.width,
      this.#heightMap.height,
    );
    gl.uniform1i(resources.uniforms.debugMode, this.#debugMode);
    gl.uniform1f(resources.uniforms.exitWash, exitWash);
    gl.uniform2f(
      resources.uniforms.resolution,
      this.#canvas.width,
      this.#canvas.height,
    );
    gl.uniform1f(resources.uniforms.scrollProgress, this.#scrollProgress);
    this.#canvas.dataset.scrollValue = this.#scrollProgress.toFixed(3);
    this.#canvas.dataset.exitWash = exitWash.toFixed(3);
    this.#section?.style.setProperty(
      "--first-view-wordmark-opacity",
      wordmarkOpacity.toFixed(4),
    );
    gl.drawArrays(gl.TRIANGLES, 0, 3);
    this.#renderCount += 1;
    this.#canvas.dataset.renderCount = String(this.#renderCount);

    if (!this.#firstFrameRendered) {
      this.#firstFrameRendered = true;
      this.#onFirstFrame();
    }
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

  #handleResize = () => {
    this.#handleScroll();
    this.#scheduleFrame();
  };

  #handleMotionChange = () => {
    this.#cancelFrame();
    this.#handleScroll();
    this.#scheduleFrame();
  };

  #handleScroll = () => {
    const study = this.#canvas.closest("section")?.parentElement;
    const rect = study?.getBoundingClientRect();
    const range = Math.max(
      1,
      (rect?.height ?? window.innerHeight) - window.innerHeight,
    );
    const next = resolveLightScrollProgress({
      containerTop: rect?.top ?? 0,
      pinnedTravel: range,
      reducedMotion: this.#motionQuery.matches,
    });
    if (Math.abs(next - this.#scrollProgress) < 0.0005) return;
    this.#scrollProgress = next;
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
  // intent why-not: DEC-002 (Site/first-view-light-shader) — event-driven rendering has no measured need for a discrete high-performance GPU.
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
