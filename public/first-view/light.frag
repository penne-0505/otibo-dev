#version 300 es
precision highp float;

uniform vec2 u_resolution;
uniform float u_scroll_progress;
uniform float u_exit_wash;
uniform sampler2D u_height_map;
uniform vec2 u_height_map_size;
uniform int u_debug_mode;

out vec4 outColor;

float hash(vec2 p) {
  p = fract(p * vec2(123.34, 456.21));
  p += dot(p, p + 45.32);
  return fract(p.x * p.y);
}

float noise(vec2 p) {
  vec2 i = floor(p);
  vec2 f = fract(p);
  vec2 u = f * f * (3.0 - 2.0 * f);
  float a = hash(i);
  float b = hash(i + vec2(1.0, 0.0));
  float c = hash(i + vec2(0.0, 1.0));
  float d = hash(i + vec2(1.0));
  return mix(mix(a, b, u.x), mix(c, d, u.x), u.y);
}

float fbm(vec2 p) {
  float value = 0.0;
  float amplitude = 0.5;
  mat2 rotate = mat2(0.82, -0.57, 0.57, 0.82);
  for (int i = 0; i < 6; i++) {
    value += amplitude * noise(p);
    p = rotate * p * 2.03 + vec2(7.13, 3.71);
    amplitude *= 0.52;
  }
  return value;
}

vec2 materialCoord(vec2 uv) {
  vec2 centered = uv - 0.5;
  centered.x *= u_resolution.x / u_resolution.y;
  return centered + 0.5;
}

float materialHeight(vec2 uv) {
  vec2 q = materialCoord(uv) * 0.72 + vec2(0.13, 0.04);
  float h0 = texture(u_height_map, q).r;
  float h1 = texture(u_height_map, q * 1.83 + vec2(0.29, 0.41)).r;
  float h2 = texture(u_height_map, q * 0.53 + vec2(0.08, 0.22)).r;
  return h0 * 0.74 + h1 * 0.17 + h2 * 0.09;
}

vec2 materialTexelStep() {
  float aspect = u_resolution.x / u_resolution.y;
  return 1.0 / (u_height_map_size * vec2(aspect, 1.0) * 0.72);
}

vec3 materialNormal(vec2 uv) {
  // intent: DEC-007 (Site/first-view-light-shader) — texel-space relief remains stable when the drawing buffer changes.
  vec2 e = materialTexelStep();
  float h = materialHeight(uv);
  float hx = materialHeight(uv + vec2(e.x, 0.0));
  float hy = materialHeight(uv + vec2(0.0, e.y));
  vec2 slope = vec2(h - hx, h - hy) / e * 0.026;
  return normalize(vec3(slope, 1.0));
}

float materialCurvature(vec2 uv) {
  vec2 e = materialTexelStep();
  float h = materialHeight(uv);
  float hL = materialHeight(uv - vec2(e.x, 0.0));
  float hR = materialHeight(uv + vec2(e.x, 0.0));
  float hU = materialHeight(uv + vec2(0.0, e.y));
  float hD = materialHeight(uv - vec2(0.0, e.y));
  vec2 secondDerivative = vec2(
    hL + hR - h * 2.0,
    hU + hD - h * 2.0
  ) / (e * e);
  float referenceStep = 0.72 / 1024.0;
  return (secondDerivative.x + secondDerivative.y) * referenceStep * referenceStep;
}

float materialRoughness(vec3 normal, float curvature) {
  float slope = length(normal.xy);
  float bend = smoothstep(0.004, 0.065, abs(curvature));
  return clamp(0.755 + slope * 0.135 + bend * 0.085, 0.72, 0.94);
}

float materialAmbientVisibility(vec3 normal, float curvature) {
  float cavity = smoothstep(0.000, 0.038, max(curvature, 0.0));
  float steepPocket = smoothstep(0.18, 0.74, length(normal.xy));
  return clamp(0.998 - cavity * 0.058 - steepPocket * 0.017, 0.89, 1.0);
}

float ggxSpecular(
  vec3 normal,
  vec3 viewDirection,
  vec3 lightDirection,
  float roughness
) {
  vec3 halfVector = normalize(viewDirection + lightDirection);
  float noV = max(dot(normal, viewDirection), 0.0001);
  float noL = max(dot(normal, lightDirection), 0.0001);
  float noH = max(dot(normal, halfVector), 0.0001);
  float voH = max(dot(viewDirection, halfVector), 0.0);
  float alpha = roughness * roughness;
  float alphaSquared = alpha * alpha;
  float denominator = noH * noH * (alphaSquared - 1.0) + 1.0;
  float distribution = alphaSquared /
    max(3.141592653589793 * denominator * denominator, 0.0001);
  float geometryK = pow(roughness + 1.0, 2.0) * 0.125;
  float geometryView = noV / mix(noV, 1.0, geometryK);
  float geometryLight = noL / mix(noL, 1.0, geometryK);
  float fresnel = 0.018 + (1.0 - 0.018) * pow(1.0 - voH, 5.0);
  return distribution * geometryView * geometryLight * fresnel /
    max(4.0 * noV * noL, 0.0001);
}

float beamCenter(vec2 uv) {
  float x = uv.x;
  float slow = fbm(vec2(x * 1.25, 1.8));
  float local = fbm(vec2(x * 3.55, 9.4));
  float base = 0.135 + 0.525 * x;
  float belly = 0.060 * exp(-pow((x - 0.31) / 0.28, 2.0));
  float rise = 0.035 * exp(-pow((x - 0.88) / 0.20, 2.0));
  return base + belly + rise + (slow - 0.5) * 0.052 + (local - 0.5) * 0.020;
}

void main() {
  vec2 uv = gl_FragCoord.xy / u_resolution.xy;
  vec2 p = uv - 0.5;
  p.x *= u_resolution.x / u_resolution.y;

  float incidence = smoothstep(0.0, 1.0, u_scroll_progress);
  float center = beamCenter(uv);
  float d = uv.y - center;
  float edgeNoise = fbm(vec2(uv.x * 5.9, 4.8));
  float fineEdge = fbm(p * 9.5);
  float upperEdge = 0.112 + (edgeNoise - 0.5) * 0.026 + (fineEdge - 0.5) * 0.010;
  float lowerEdge = -0.430 + (fbm(vec2(uv.x * 2.1, 13.0)) - 0.5) * 0.040;
  upperEdge += incidence * 0.220;
  lowerEdge -= incidence * 0.130;
  float upperSoft = mix(0.010, 0.030, smoothstep(0.25, 0.70, edgeNoise)) + incidence * 0.050;
  float lowerSoft = 0.285 + incidence * 0.080;
  float topCut = 1.0 - smoothstep(upperEdge - upperSoft, upperEdge + upperSoft * 1.55, d);
  float bottomCut = smoothstep(lowerEdge - lowerSoft, lowerEdge + lowerSoft * 1.35, d);
  float beamMask = topCut * bottomCut;

  float core = exp(-pow((d + 0.095) / mix(0.245, 0.405, incidence), 2.0));
  float centerLift = exp(-pow((uv.x - 0.56) / 0.52, 2.0));
  float obliqueLift = 0.82 + 0.18 * smoothstep(0.05, 0.92, uv.x);
  float frontalFill = incidence * (0.16 + 0.34 * exp(-pow((d + 0.080) / 0.680, 2.0)));
  float lightField = clamp(beamMask * (0.10 + 1.08 * core * centerLift) * obliqueLift + frontalFill, 0.0, 1.0);
  float hotCore = beamMask * exp(-pow((d + 0.092) / mix(0.132, 0.235, incidence), 2.0)) * exp(-pow((uv.x - 0.66) / 0.48, 2.0)) * mix(1.0, 0.52, incidence);
  float apertureSpark = beamMask * exp(-pow((d + 0.126) / mix(0.070, 0.145, incidence), 2.0)) * exp(-pow((uv.x - 0.60) / 0.38, 2.0)) * mix(1.0, 0.34, incidence);
  float opticalHaloOuter = beamMask * exp(-pow((d + 0.094) / mix(0.360, 0.480, incidence), 2.0)) * exp(-pow((uv.x - 0.60) / 0.72, 2.0));
  float opticalHaloInner = beamMask * exp(-pow((d + 0.094) / mix(0.185, 0.270, incidence), 2.0)) * exp(-pow((uv.x - 0.62) / 0.54, 2.0));
  float opticalHaloCore = beamMask * exp(-pow((d + 0.094) / mix(0.092, 0.145, incidence), 2.0)) * exp(-pow((uv.x - 0.64) / 0.43, 2.0));
  float warmVeil = beamMask * exp(-pow((d + 0.058) / mix(0.215, 0.420, incidence), 2.0)) * exp(-pow((uv.x - 0.58) / 0.64, 2.0));
  float upperApertureSkin = beamMask * exp(-pow((d - upperEdge + 0.018) / 0.046, 2.0)) * smoothstep(0.10, 0.82, uv.x);
  float upperShadow = smoothstep(upperEdge - 0.012, upperEdge + 0.108, d);
  float innerWarmShelf = beamMask * exp(-pow((d - upperEdge + 0.112) / 0.124, 2.0)) * smoothstep(0.08, 0.86, uv.x);
  float lowerBlueVeil = beamMask * exp(-pow((d + 0.318) / 0.205, 2.0)) * (0.72 + 0.28 * fbm(p * 2.7 + vec2(5.4, 1.1)));
  float edgeOcclusion = exp(-pow((d - upperEdge) / 0.034, 2.0)) * upperShadow;
  float contactShadow = exp(-pow((d - upperEdge - 0.014) / 0.060, 2.0)) * upperShadow;
  float apertureBite = exp(-pow((d - upperEdge - 0.030) / 0.032, 2.0)) * smoothstep(0.10, 0.78, uv.x) * smoothstep(0.98, 0.20, uv.y);
  float lowerCoolReturn = 1.0 - smoothstep(lowerEdge - 0.16, lowerEdge + 0.42, d);

  // intent: DEC-004 (Site/first-view-light-shader) — static material coordinates make scroll read as changing illumination.
  // intent why-not: DEC-002 (Site/first-view-light-shader) — excluding time preserves a deterministic image at each scroll position.
  vec2 materialUv = uv;
  vec3 normal = materialNormal(materialUv);
  float curvature = materialCurvature(materialUv);
  vec3 frontalLight = normalize(vec3(-0.04, 0.07, 1.0));
  vec3 grazingLight = normalize(mix(normalize(vec3(-0.24, 0.44, 0.86)), frontalLight, incidence));
  vec3 warmBeamLight = normalize(mix(normalize(vec3(-0.18, -0.18, 0.97)), frontalLight, incidence));
  // intent: DEC-011 (Site/first-view-light-shader) — height changes material parameters, never final RGB directly.
  float normalStrength = mix(0.52, 0.18, smoothstep(0.08, 0.72, incidence));
  vec3 shadingNormal = normalize(mix(vec3(0.0, 0.0, 1.0), normal, normalStrength));
  vec3 directDirection = normalize(mix(grazingLight, warmBeamLight, smoothstep(0.08, 0.86, lightField)));
  vec3 skyDirection = normalize(vec3(-0.34, 0.52, 0.78));
  vec3 bounceDirection = normalize(vec3(0.24, -0.42, 0.88));
  float directNoL = max(dot(shadingNormal, directDirection), 0.0);
  float skyNoL = max(dot(shadingNormal, skyDirection), 0.0);
  float bounceNoL = max(dot(shadingNormal, bounceDirection), 0.0);
  float ambientDiffuse = mix(skyNoL, bounceNoL, 0.28);
  float roughness = materialRoughness(normal, curvature);
  float ambientVisibility = materialAmbientVisibility(normal, curvature);
  float specularBrdf = ggxSpecular(
    shadingNormal,
    vec3(0.0, 0.0, 1.0),
    directDirection,
    roughness
  );

  // The preserved composition is now a field of incident energy and visibility,
  // not a pair of finished RGB paintings.
  float penumbraVisibility = clamp(beamMask, 0.0, 1.0);
  float edgeVisibility = 1.0 - clamp(
    edgeOcclusion * 0.46 + contactShadow * 0.34 + apertureBite * 0.22,
    0.0,
    0.82
  );
  float directVisibility = clamp(
    penumbraVisibility * edgeVisibility + frontalFill * 0.42,
    0.0,
    1.0
  );
  float beamEnergy = 0.10 + core * 0.76 + warmVeil * 0.22;
  float layeredEnergy = opticalHaloOuter * 0.12 +
    opticalHaloInner * 0.24 +
    opticalHaloCore * 0.66 +
    hotCore * 0.54 +
    apertureSpark * 0.32 +
    upperApertureSkin * 0.12 +
    innerWarmShelf * 0.10;
  float directIrradiance = directVisibility *
    (beamEnergy + layeredEnergy) *
    (0.74 + 0.34 * smoothstep(0.05, 0.92, uv.x));

  float environmentOcclusion = 1.0 - clamp(
    upperShadow * 0.48 + edgeOcclusion * 0.14 + contactShadow * 0.10,
    0.0,
    0.64
  );
  float ambientLevel = mix(0.88, 1.12, lowerCoolReturn * 0.52) *
    environmentOcclusion * mix(1.0, 1.68, incidence);
  float portraitResponse = 1.0 - smoothstep(
    0.68,
    1.05,
    u_resolution.x / u_resolution.y
  );
  float aoWeight = (1.0 - portraitResponse) *
    mix(0.72, 0.20, smoothstep(0.08, 0.70, incidence));
  float materialAmbientVisibility = mix(1.0, ambientVisibility, aoWeight);

  if (u_debug_mode == 1) {
    outColor = vec4(shadingNormal * 0.5 + 0.5, 1.0);
    return;
  }
  if (u_debug_mode == 2) {
    outColor = vec4(
      clamp(directIrradiance * 0.42, 0.0, 1.0),
      directVisibility,
      ambientLevel * materialAmbientVisibility,
      1.0
    );
    return;
  }

  float albedoVariation = 0.92 + 0.13 * fbm(p * 2.2 + vec2(0.7, 1.9));
  vec3 baseAlbedo = vec3(0.205, 0.355, 0.405) * albedoVariation;
  vec3 obliqueAmbientSpectrum = mix(
    vec3(0.34, 0.61, 0.72),
    vec3(0.48, 0.68, 0.72),
    lowerCoolReturn * 0.34
  );
  vec3 ambientSpectrum = mix(
    obliqueAmbientSpectrum,
    vec3(0.54, 0.69, 0.70),
    smoothstep(0.14, 0.78, incidence) * 0.58
  );
  float coreHeat = smoothstep(
    0.18,
    0.92,
    opticalHaloCore + hotCore * 0.72 + apertureSpark * 0.42
  );
  vec3 obliqueDirectSpectrum = mix(
    vec3(4.46, 1.52, 0.44),
    vec3(4.58, 2.36, 1.62),
    coreHeat
  );
  vec3 frontalDirectSpectrum = mix(
    vec3(3.00, 2.10, 1.36),
    vec3(3.72, 2.66, 2.08),
    coreHeat
  );
  vec3 directSpectrum = mix(
    obliqueDirectSpectrum,
    frontalDirectSpectrum,
    smoothstep(0.12, 0.68, incidence) * 0.72
  );

  // intent: DEC-011 (Site/first-view-light-shader) — one radiance path keeps diffuse, specular, shadow, and saturation causally connected.
  vec3 ambientRadiance = baseAlbedo * ambientSpectrum * ambientDiffuse *
    ambientLevel * materialAmbientVisibility;
  vec3 diffuseRadiance = baseAlbedo * directSpectrum * directNoL *
    directIrradiance * mix(1.0, 0.82, incidence);
  vec3 specularRadiance = directSpectrum * specularBrdf * directNoL *
    directIrradiance * mix(1.0, 0.82, incidence) * 0.42;
  vec3 sceneRadiance = ambientRadiance + diffuseRadiance + specularRadiance;

  // A broad, low-energy cool return is environmental fill, not a painted overlay.
  sceneRadiance += baseAlbedo * vec3(0.10, 0.20, 0.24) * lowerBlueVeil * 0.24;
  float vignette = smoothstep(1.05, 0.16, length((uv - 0.5) * vec2(0.82, 1.04)));
  sceneRadiance *= mix(0.88, 1.04, vignette);

  // The scene stays above display white until this sensor-like shoulder and clip.
  // Bloom remains a later, separate stage so it cannot disguise transport errors.
  vec3 exposed = max(sceneRadiance, 0.0) * vec3(1.08, 1.01, 0.90);
  vec3 shouldered = exposed / (vec3(1.0) + exposed * 0.28);
  vec3 color = pow(clamp(shouldered, 0.0, 1.0), vec3(1.0 / 2.2));
  // intent: DEC-005 (Site/first-view-light-shader) — the shared white surface connects the First View to Principle.
  // intent: DEC-005 (Site/first-view-light-shader) — scroll-synchronous wash keeps reverse navigation deterministic.
  color = mix(color, vec3(1.0), u_exit_wash);
  outColor = vec4(color, 1.0);
}
