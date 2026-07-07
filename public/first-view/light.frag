#version 300 es
precision highp float;

uniform vec2 u_resolution;
uniform float u_time;
uniform sampler2D u_height_map;
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

vec3 materialNormal(vec2 uv) {
  vec2 e = 0.72 / u_resolution.xy;
  float h = materialHeight(uv);
  float hx = materialHeight(uv + vec2(e.x, 0.0));
  float hy = materialHeight(uv + vec2(0.0, e.y));
  return normalize(vec3((h - hx) * 38.0, (h - hy) * 38.0, 1.0));
}

float materialCurvature(vec2 uv) {
  vec2 e = 0.98 / u_resolution.xy;
  float h = materialHeight(uv);
  float hL = materialHeight(uv - vec2(e.x, 0.0));
  float hR = materialHeight(uv + vec2(e.x, 0.0));
  float hU = materialHeight(uv + vec2(0.0, e.y));
  float hD = materialHeight(uv - vec2(0.0, e.y));
  return hL + hR + hU + hD - h * 4.0;
}

float beamCenter(vec2 uv, float time) {
  float x = uv.x;
  float slow = fbm(vec2(x * 1.25 + time * 0.055, 1.8));
  float local = fbm(vec2(x * 3.55 - time * 0.035, 9.4));
  float base = 0.135 + 0.525 * x;
  float belly = 0.060 * exp(-pow((x - 0.31) / 0.28, 2.0));
  float rise = 0.035 * exp(-pow((x - 0.88) / 0.20, 2.0));
  return base + belly + rise + (slow - 0.5) * 0.052 + (local - 0.5) * 0.020;
}

void main() {
  vec2 uv = gl_FragCoord.xy / u_resolution.xy;
  vec2 p = uv - 0.5;
  p.x *= u_resolution.x / u_resolution.y;

  float time = u_time * 0.28;
  float center = beamCenter(uv, time);
  float d = uv.y - center;
  float edgeNoise = fbm(vec2(uv.x * 5.9, 4.8) + vec2(time * 0.04, -time * 0.03));
  float fineEdge = fbm(p * 9.5 + vec2(time * 0.035, -time * 0.025));
  float upperEdge = 0.112 + (edgeNoise - 0.5) * 0.026 + (fineEdge - 0.5) * 0.010;
  float lowerEdge = -0.430 + (fbm(vec2(uv.x * 2.1, 13.0)) - 0.5) * 0.040;
  float upperSoft = mix(0.010, 0.030, smoothstep(0.25, 0.70, edgeNoise));
  float lowerSoft = 0.285;
  float topCut = 1.0 - smoothstep(upperEdge - upperSoft, upperEdge + upperSoft * 1.55, d);
  float bottomCut = smoothstep(lowerEdge - lowerSoft, lowerEdge + lowerSoft * 1.35, d);
  float beamMask = topCut * bottomCut;

  float core = exp(-pow((d + 0.095) / 0.245, 2.0));
  float centerLift = exp(-pow((uv.x - 0.56) / 0.52, 2.0));
  float obliqueLift = 0.82 + 0.18 * smoothstep(0.05, 0.92, uv.x);
  float lightField = clamp(beamMask * (0.10 + 1.08 * core * centerLift) * obliqueLift, 0.0, 1.0);
  float hotCore = beamMask * exp(-pow((d + 0.092) / 0.132, 2.0)) * exp(-pow((uv.x - 0.66) / 0.48, 2.0));
  float apertureSpark = beamMask * exp(-pow((d + 0.126) / 0.070, 2.0)) * exp(-pow((uv.x - 0.60) / 0.38, 2.0));
  float warmVeil = beamMask * exp(-pow((d + 0.058) / 0.215, 2.0)) * exp(-pow((uv.x - 0.58) / 0.64, 2.0));
  float upperApertureSkin = beamMask * exp(-pow((d - upperEdge + 0.018) / 0.046, 2.0)) * smoothstep(0.10, 0.82, uv.x);
  float upperShadow = smoothstep(upperEdge - 0.012, upperEdge + 0.108, d);
  float outerContactSkin = exp(-pow((d - upperEdge - 0.020) / 0.078, 2.0)) * upperShadow * smoothstep(0.06, 0.78, uv.x);
  float coolRim = beamMask * exp(-pow((d - upperEdge + 0.078) / 0.086, 2.0)) * smoothstep(0.02, 0.70, uv.x);
  float innerWarmShelf = beamMask * exp(-pow((d - upperEdge + 0.112) / 0.124, 2.0)) * smoothstep(0.08, 0.86, uv.x);
  float lowerBlueVeil = beamMask * exp(-pow((d + 0.318) / 0.205, 2.0)) * (0.72 + 0.28 * fbm(p * 2.7 + vec2(5.4, 1.1)));
  float closeLight = smoothstep(0.10, 0.88, lightField + hotCore * 0.20 + apertureSpark * 0.08);

  float edgeOcclusion = exp(-pow((d - upperEdge) / 0.034, 2.0)) * upperShadow;
  float contactShadow = exp(-pow((d - upperEdge - 0.014) / 0.060, 2.0)) * upperShadow;
  float closeOccluder = smoothstep(upperEdge + 0.026, upperEdge + 0.270, d);
  float occluderBody = closeOccluder * smoothstep(0.02, 0.44, uv.x) * (0.76 + 0.24 * fbm(p * 1.8 + vec2(1.2, 4.1)));
  float apertureBite = exp(-pow((d - upperEdge - 0.030) / 0.032, 2.0)) * smoothstep(0.10, 0.78, uv.x) * smoothstep(0.98, 0.20, uv.y);
  float lowerCoolReturn = 1.0 - smoothstep(lowerEdge - 0.16, lowerEdge + 0.42, d);

  vec2 materialUv = uv + vec2(time * 0.0012, -time * 0.0008);
  float height = materialHeight(materialUv);
  float fineHeight = texture(u_height_map, materialUv * vec2(1.65, 1.82) + vec2(0.37, 0.19)).r;
  vec3 normal = materialNormal(materialUv);
  float curvature = materialCurvature(materialUv);
  vec3 grazingLight = normalize(vec3(-0.24, 0.44, 0.86));
  vec3 warmBeamLight = normalize(vec3(-0.18, -0.18, 0.97));
  float relief = clamp(dot(normal, mix(grazingLight, warmBeamLight, lightField)) * 0.5 + 0.5, 0.0, 1.0);
  float grain = noise(gl_FragCoord.xy * 0.92 + time * 3.0);

  if (u_debug_mode == 1) {
    outColor = vec4(vec3(clamp(height * 0.72 + relief * 0.28, 0.0, 1.0)), 1.0);
    return;
  }
  if (u_debug_mode == 2) {
    outColor = vec4(lightField, hotCore + apertureSpark * 0.5, lowerBlueVeil, 1.0);
    return;
  }

  vec3 coolBase = vec3(0.330, 0.445, 0.480);
  vec3 coolDeep = vec3(0.105, 0.235, 0.285);
  vec3 coolPale = vec3(0.555, 0.625, 0.610);
  vec3 warmLight = vec3(0.815, 0.760, 0.650);
  vec3 warmPeak = vec3(0.925, 0.850, 0.715);
  vec3 hotWhite = vec3(1.030, 0.970, 0.830);
  vec3 penumbraHeat = vec3(0.840, 0.680, 0.470);
  vec3 veilCream = vec3(0.900, 0.835, 0.680);
  vec3 apertureWarm = vec3(0.960, 0.780, 0.510);
  vec3 veilBlue = vec3(0.475, 0.600, 0.600);

  vec3 cool = mix(coolBase, coolDeep, upperShadow * 0.82 + edgeOcclusion * 0.42 + contactShadow * 0.26 + occluderBody * 0.02);
  cool = mix(cool, coolPale, lowerCoolReturn * 0.32);
  cool *= 0.95 + 0.10 * fbm(p * 2.2 + vec2(0.7, 1.9));
  vec3 lit = mix(coolPale, warmLight, smoothstep(0.12, 0.78, lightField));
  lit = mix(lit, warmPeak, 0.235 * smoothstep(0.54, 1.0, core * beamMask));
  lit = mix(lit, veilCream, 0.145 * smoothstep(0.18, 0.82, warmVeil));
  lit = mix(lit, apertureWarm, 0.132 * smoothstep(0.10, 0.86, upperApertureSkin + apertureSpark * 0.38));
  lit = mix(lit, apertureWarm, 0.092 * smoothstep(0.10, 0.88, innerWarmShelf));
  lit = mix(lit, penumbraHeat, 0.045 * smoothstep(0.14, 0.74, contactShadow + apertureBite));
  lit = mix(lit, hotWhite, 0.350 * smoothstep(0.34, 0.98, hotCore + apertureSpark * 0.72));

  vec3 color = mix(cool, lit, closeLight);
  color = mix(color, veilBlue, 0.092 * smoothstep(0.16, 0.76, lowerBlueVeil));
  color = mix(color, coolDeep, 0.068 * smoothstep(0.14, 0.78, coolRim));
  color = mix(color, coolDeep, 0.088 * smoothstep(0.08, 0.74, outerContactSkin));
  color -= edgeOcclusion * vec3(0.018, 0.034, 0.040);
  color -= contactShadow * vec3(0.022, 0.040, 0.046);
  color -= apertureBite * vec3(0.014, 0.022, 0.024);
  color -= occluderBody * vec3(0.006, 0.010, 0.010);

  float materialStrength = mix(0.115, 0.340, lightField);
  color += (relief - 0.52) * materialStrength;
  color += (height - 0.52) * mix(0.038, 0.132, lightField);
  color += (fineHeight - 0.50) * mix(0.022, 0.050, lightField);
  color += clamp(curvature * 18.0, -0.18, 0.18) * mix(0.052, 0.160, lightField);
  color += (grain - 0.50) * 0.006;
  float lightRevealsSurface = smoothstep(0.18, 0.86, lightField);
  color += pow(max(relief - 0.55, 0.0), 1.65) * lightRevealsSurface * 0.062;
  color += hotCore * vec3(0.040, 0.031, 0.014);
  color += apertureSpark * vec3(0.030, 0.023, 0.010);
  color += warmVeil * vec3(0.014, 0.009, 0.001);
  color += upperApertureSkin * vec3(0.018, 0.010, -0.002);
  color += innerWarmShelf * vec3(0.016, 0.010, 0.001);
  color -= outerContactSkin * vec3(0.006, 0.010, 0.010);
  color -= coolRim * vec3(0.004, 0.007, 0.006);
  float vignette = smoothstep(1.05, 0.16, length((uv - 0.5) * vec2(0.82, 1.04)));
  color *= mix(0.86, 1.04, vignette);
  color = pow(max(color, 0.0), vec3(0.94));
  outColor = vec4(color, 1.0);
}
