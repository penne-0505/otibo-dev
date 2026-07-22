#version 300 es
precision highp float;

uniform vec2 u_resolution;
uniform float u_scroll_progress;
uniform float u_exit_wash;
uniform sampler2D u_height_map;
uniform vec2 u_height_map_size;
uniform int u_debug_mode;

out vec4 outColor;

const float GOLDEN_ANGLE = 2.399963229728653;
const float PI = 3.141592653589793;
const int MATERIAL_SOURCE_SAMPLE_COUNT = 32;

struct MaterialSurface {
  float height;
  vec3 diffuseNormal;
  vec3 specularNormal;
  float crest;
  float valley;
  float localVariation;
  float roughness;
  vec3 tangent;
  float anisotropy;
  float ambientVisibility;
};

float luminance(vec3 color) {
  return dot(color, vec3(0.2126, 0.7152, 0.0722));
}

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

float materialPrimaryHeight(vec2 uv) {
  vec2 q = materialCoord(uv) * 0.72 + vec2(0.13, 0.04);
  return texture(u_height_map, q).r;
}

float materialHeight(vec2 uv) {
  // intent: DEC-013 (Site/first-view-light-shader) — one canonical sample is one physical surface; rotated, scaled, or procedurally generated copies cannot become visible relief.
  return materialPrimaryHeight(uv);
}

float materialDirectHeight(vec2 uv) {
  return materialHeight(uv);
}

vec2 materialTexelStep() {
  float aspect = u_resolution.x / u_resolution.y;
  return 1.0 / (u_height_map_size * vec2(aspect, 1.0) * 0.72);
}

MaterialSurface sampleMaterialSurface(vec2 uv) {
  MaterialSurface surface;
  vec2 fineStep = max(
    vec2(1.08) / u_resolution,
    materialTexelStep() * 1.35
  );
  float h = materialHeight(uv);
  float hL = materialHeight(uv - vec2(fineStep.x, 0.0));
  float hR = materialHeight(uv + vec2(fineStep.x, 0.0));
  float hD = materialHeight(uv - vec2(0.0, fineStep.y));
  float hU = materialHeight(uv + vec2(0.0, fineStep.y));
  float hLD = materialHeight(uv - fineStep);
  float hLU = materialHeight(uv + vec2(-fineStep.x, fineStep.y));
  float hRD = materialHeight(uv + vec2(fineStep.x, -fineStep.y));
  float hRU = materialHeight(uv + fineStep);
  float fineMean = (hL + hR + hD + hU) * 0.25;
  vec2 fineSlope = vec2(
    hLD + hL * 2.0 + hLU - hRD - hR * 2.0 - hRU,
    hLD + hD * 2.0 + hRD - hLU - hU * 2.0 - hRU
  ) / (fineStep * 8.0) * 0.020;
  vec2 coarseStep = max(
    vec2(4.8) / u_resolution,
    materialTexelStep() * 6.0
  );
  float hCoarseL = materialHeight(uv - vec2(coarseStep.x, 0.0));
  float hCoarseR = materialHeight(uv + vec2(coarseStep.x, 0.0));
  float hCoarseD = materialHeight(uv - vec2(0.0, coarseStep.y));
  float hCoarseU = materialHeight(uv + vec2(0.0, coarseStep.y));
  vec2 coarseSlope = vec2(
    hCoarseL - hCoarseR,
    hCoarseD - hCoarseU
  ) / (coarseStep * 2.0) * 0.020;
  // intent-invariant: INV-034 (Site/first-view-light-shader) — subtract the canonical surface's broad slope before forming the optical micro-normal. Feeding it back at comparable strength recreates the rejected wave / crack relief and hides the weave accepted in checkpoint 69.
  vec2 microSlope = fineSlope - coarseSlope * 0.78;
  float localVariation = sqrt((
    pow(h - hL, 2.0) + pow(h - hR, 2.0) +
    pow(h - hD, 2.0) + pow(h - hU, 2.0)
  ) * 0.25);
  float localRelief = h - fineMean;
  float crest = smoothstep(0.003, 0.034, localRelief);
  float valley = smoothstep(0.003, 0.034, -localRelief);
  float variationClass = smoothstep(0.012, 0.072, localVariation);

  surface.height = h;
  surface.diffuseNormal = normalize(vec3(
    microSlope * 0.70 + coarseSlope * 0.10,
    1.0
  ));
  surface.specularNormal = normalize(vec3(
    microSlope * 1.04 + coarseSlope * 0.14,
    1.0
  ));
  vec2 orientationGradient = microSlope;
  float orientationLength = length(orientationGradient);
  vec2 gradientDirection = orientationLength > 0.0001 ?
    orientationGradient / orientationLength : vec2(0.0, 1.0);
  vec3 tangentSeed = vec3(-gradientDirection.y, gradientDirection.x, 0.0);
  surface.tangent = normalize(
    tangentSeed - surface.specularNormal *
      dot(tangentSeed, surface.specularNormal)
  );
  surface.crest = crest;
  surface.valley = valley;
  surface.localVariation = localVariation;
  surface.roughness = clamp(
    0.078 + valley * 0.055 + variationClass * 0.038 - crest * 0.014,
    0.055,
    0.18
  );
  surface.anisotropy = 0.58;
  surface.ambientVisibility = clamp(
    0.995 - valley * 0.230 -
      smoothstep(0.34, 0.86, length(surface.diffuseNormal.xy)) * 0.025,
    0.72,
    1.0
  );
  // intent: DEC-015 (Site/first-view-light-shader) — diffuse and specular normals share one band-separated canonical neighborhood: restrained broad relief establishes the receiver, while the surviving fine slope carries the optically resolved weave.
  return surface;
}

float materialSelfVisibility(vec2 uv, vec3 lightDirection) {
  float horizontalLength = length(lightDirection.xy);
  if (horizontalLength < 0.04) {
    return 1.0;
  }

  vec2 e = max(
    vec2(1.15) / u_resolution,
    materialTexelStep() * 1.75
  );
  vec2 rayDirection = normalize(lightDirection.xy);
  float centerHeight = (materialDirectHeight(uv) - 0.5) * 0.0145;
  float blocked = 0.0;
  // Three local samples resolve a short height-field horizon without inventing
  // a second relief layer.
  for (int stepIndex = 1; stepIndex <= 3; stepIndex++) {
    float stepDistance = float(stepIndex) * 1.55;
    vec2 offset = rayDirection * e * stepDistance;
    float planarDistance = length(offset);
    float rayRise = planarDistance * lightDirection.z / horizontalLength;
    float neighborHeight = (materialDirectHeight(uv + offset) - 0.5) *
      0.0145;
    float excessHeight = neighborHeight - centerHeight - rayRise;
    blocked = max(blocked, smoothstep(0.00010, 0.00075, excessHeight));
  }
  // intent: DEC-013 (Site/first-view-light-shader) — direct-only occlusion traces the same canonical surface used by both normals and BRDF.
  return mix(0.58, 1.0, 1.0 - blocked);
}

float diskSourceVisibility(float normalizedDistance) {
  float x = clamp(normalizedDistance, -1.0, 1.0);
  float segment = asin(x) + x * sqrt(max(0.0, 1.0 - x * x));
  return clamp(0.5 + segment / 3.141592653589793, 0.0, 1.0);
}

float ggxSpecular(
  vec3 normal,
  vec3 tangent,
  vec3 viewDirection,
  vec3 lightDirection,
  float roughness,
  float anisotropy,
  float dielectricF0
) {
  vec3 halfVector = normalize(viewDirection + lightDirection);
  float noV = max(dot(normal, viewDirection), 0.0001);
  float noL = max(dot(normal, lightDirection), 0.0001);
  float noH = max(dot(normal, halfVector), 0.0001);
  float voH = max(dot(viewDirection, halfVector), 0.0);
  vec3 bitangent = normalize(cross(normal, tangent));
  float alpha = max(roughness * roughness, 0.035);
  float aspect = sqrt(max(1.0 - anisotropy * 0.76, 0.24));
  float alphaTangent = max(alpha / aspect, 0.035);
  float alphaBitangent = max(alpha * aspect, 0.035);
  float hTangent = dot(halfVector, tangent);
  float hBitangent = dot(halfVector, bitangent);
  float anisotropicDenominator =
    hTangent * hTangent / (alphaTangent * alphaTangent) +
    hBitangent * hBitangent / (alphaBitangent * alphaBitangent) +
    noH * noH;
  float distribution = 1.0 / max(
    3.141592653589793 * alphaTangent * alphaBitangent *
      anisotropicDenominator * anisotropicDenominator,
    0.0001
  );
  float geometryK = pow(roughness + 1.0, 2.0) * 0.125;
  float geometryView = noV / mix(noV, 1.0, geometryK);
  float geometryLight = noL / mix(noL, 1.0, geometryK);
  float fresnel = dielectricF0 +
    (1.0 - dielectricF0) * pow(1.0 - voH, 5.0);
  return distribution * geometryView * geometryLight * fresnel /
    max(4.0 * noV * noL, 0.0001);
}

vec3 integrateAreaMaterial(
  vec2 materialUv,
  vec3 viewDirection,
  vec3 sourceVector,
  float sourceRadius,
  float sourceDiskCut,
  float roughness,
  float dielectricF0
) {
  vec3 integral = vec3(0.0);
  MaterialSurface surface = sampleMaterialSurface(materialUv);
  vec3 diffuseNormal = normalize(mix(
    vec3(0.0, 0.0, 1.0),
    surface.diffuseNormal,
    0.82
  ));
  vec3 specularNormal = surface.specularNormal;
  float localRoughness = clamp(
    0.340 + surface.valley * 0.090 - surface.crest * 0.080 +
      smoothstep(0.020, 0.070, surface.localVariation) * 0.040,
    0.220,
    0.48
  );
  // intent: DEC-015 (Site/first-view-light-shader) — integrate the finite source against the measured local facet itself. Pixel-footprint covariance is intentionally not substituted: checkpoints 58–61 preserved energy but blurred away the local contrast accepted in checkpoint 69.
  for (int i = 0; i < MATERIAL_SOURCE_SAMPLE_COUNT; i++) {
    float sampleIndex = float(i) + 0.5;
    float diskRadius = sqrt(
      sampleIndex / float(MATERIAL_SOURCE_SAMPLE_COUNT)
    );
    float angle = sampleIndex * GOLDEN_ANGLE;
    vec2 diskSample = vec2(cos(angle), sin(angle)) * diskRadius;
    float visibility = 1.0;
    vec3 sampleVector = sourceVector + vec3(diskSample * sourceRadius, 0.0);
    float distanceSquared = max(dot(sampleVector, sampleVector), 0.0001);
    vec3 lightDirection = sampleVector * inversesqrt(distanceSquared);
    float emitterCosine = max(lightDirection.z, 0.0);
    float sampleWeight = visibility * emitterCosine / distanceSquared;
    float flatNoL = emitterCosine;
    float diffuseNoL = max(dot(diffuseNormal, lightDirection), 0.0);
    float specularNoL = max(dot(specularNormal, lightDirection), 0.0);
    float localSpecular = ggxSpecular(
      specularNormal,
      surface.tangent,
      viewDirection,
      lightDirection,
      localRoughness,
      surface.anisotropy,
      dielectricF0
    ) * specularNoL;
    integral.x += sampleWeight * mix(flatNoL, diffuseNoL, 0.60);
    integral.y += sampleWeight * flatNoL;
    integral.z += sampleWeight * localSpecular * 0.26;
  }
  float sourceArea = PI * sourceRadius * sourceRadius;
  float sourceCoverage = diskSourceVisibility(sourceDiskCut);
  // intent: DEC-013 (Site/first-view-light-shader) — fixed emitter radiance is multiplied by the unnormalized visible solid-angle integral; source area, distance loss, and occlusion cannot be divided away and rebuilt by a separate mask.
  return integral * sourceArea * sourceCoverage /
    float(MATERIAL_SOURCE_SAMPLE_COUNT);
}

vec3 sensorResponse(vec3 sceneRadiance) {
  vec3 sensorLinear = max(sceneRadiance, 0.0) * vec3(1.025, 1.000, 0.975);
  float sceneLuminance = luminance(sensorLinear);
  vec3 chromaticity = sensorLinear / max(sceneLuminance, 0.0001);

  vec3 warmSensorWhite = vec3(1.165457, 0.988264, 0.629046);
  float warmAdaptation = smoothstep(0.24, 1.18, sceneLuminance) *
    (1.0 - smoothstep(1.12, 2.85, sceneLuminance));
  chromaticity = mix(chromaticity, warmSensorWhite, warmAdaptation * 0.66);

  // intent: DEC-012 (Site/first-view-light-shader) — sensor crosstalk makes the brightest radiance approach display white continuously instead of switching palettes.
  float highRadianceCrosstalk = smoothstep(1.65, 3.60, sceneLuminance);
  chromaticity = mix(chromaticity, vec3(1.0), highRadianceCrosstalk * 0.55);

  float mappedLuminance = sceneLuminance *
    (1.16 + sceneLuminance * 0.12) /
    (1.0 + sceneLuminance * 0.32);
  float midtoneWindow = smoothstep(0.12, 0.44, sceneLuminance) *
    (1.0 - smoothstep(0.72, 1.12, sceneLuminance));
  mappedLuminance *= 1.0 + midtoneWindow * 0.03;
  vec3 sensorSignal = chromaticity * mappedLuminance;
  return pow(clamp(sensorSignal, 0.0, 1.0), vec3(1.0 / 2.2));
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
  float occluderDistance = upperEdge - d + upperSoft * 0.18;
  float sourceProjectionRadius = upperSoft * mix(1.62, 1.72, incidence);
  // intent: DEC-013 (Site/first-view-light-shader) — the upper transition is the visible area of one finite source crossing one occluder edge.
  float topCut = diskSourceVisibility(
    occluderDistance / max(sourceProjectionRadius, 0.0001)
  );
  float bottomCut = smoothstep(lowerEdge - lowerSoft, lowerEdge + lowerSoft * 1.35, d);
  float beamMask = topCut * bottomCut;

  float core = exp(-pow((d + 0.095) / mix(0.245, 0.405, incidence), 2.0));
  float centerLift = exp(-pow((uv.x - 0.56) / 0.52, 2.0));
  float obliqueLift = 0.82 + 0.18 * smoothstep(0.05, 0.92, uv.x);
  float frontalFill = incidence * (0.16 + 0.34 * exp(-pow((d + 0.080) / 0.680, 2.0)));
  float lightField = clamp(beamMask * (0.10 + 1.08 * core * centerLift) * obliqueLift + frontalFill, 0.0, 1.0);
  float hotCoreProfile = exp(-pow((d + 0.092) / mix(0.130, 0.210, incidence), 2.0)) *
    exp(-pow((uv.x - 0.64) / 0.50, 2.0));
  float apertureProfile = exp(-pow((d + 0.126) / mix(0.070, 0.145, incidence), 2.0)) *
    exp(-pow((uv.x - 0.60) / 0.38, 2.0));
  float opticalHaloOuterProfile = exp(-pow((d + 0.094) / mix(0.360, 0.480, incidence), 2.0)) * exp(-pow((uv.x - 0.60) / 0.72, 2.0));
  float opticalHaloInnerProfile = exp(-pow((d + 0.094) / mix(0.185, 0.270, incidence), 2.0)) * exp(-pow((uv.x - 0.62) / 0.54, 2.0));
  float opticalHaloCoreProfile = exp(-pow((d + 0.094) / mix(0.080, 0.132, incidence), 2.0)) * exp(-pow((uv.x - 0.64) / 0.38, 2.0));
  float warmVeilProfile = exp(-pow((d + 0.058) / mix(0.215, 0.420, incidence), 2.0)) * exp(-pow((uv.x - 0.58) / 0.64, 2.0));
  float upperApertureSkinProfile = exp(-pow((d - upperEdge + 0.018) / 0.046, 2.0)) * smoothstep(0.10, 0.82, uv.x);
  float innerWarmShelfProfile = exp(-pow((d - upperEdge + 0.112) / 0.124, 2.0)) * smoothstep(0.08, 0.86, uv.x);
  float hotCore = beamMask * hotCoreProfile * mix(1.0, 0.52, incidence);
  float apertureSpark = beamMask * apertureProfile * mix(1.0, 0.34, incidence);
  float opticalHaloOuter = beamMask * opticalHaloOuterProfile;
  float opticalHaloInner = beamMask * opticalHaloInnerProfile;
  float opticalHaloCore = beamMask * opticalHaloCoreProfile;
  float warmVeil = beamMask * warmVeilProfile;
  float upperApertureSkin = beamMask * upperApertureSkinProfile;
  float upperShadow = 1.0 - topCut;
  float innerWarmShelf = beamMask * innerWarmShelfProfile;
  float lowerBlueVeil = beamMask * exp(-pow((d + 0.318) / 0.205, 2.0)) * (0.72 + 0.28 * fbm(p * 2.7 + vec2(5.4, 1.1)));
  float penumbraDensity = 4.0 * topCut * (1.0 - topCut);
  float edgeOcclusion = penumbraDensity * upperShadow * 0.58;
  float contactShadow = penumbraDensity * upperShadow * upperShadow * 0.42;
  float apertureBite = exp(-pow((d - upperEdge - 0.030) / 0.032, 2.0)) * smoothstep(0.10, 0.78, uv.x) * smoothstep(0.98, 0.20, uv.y);
  float lowerCoolReturn = 1.0 - smoothstep(lowerEdge - 0.16, lowerEdge + 0.42, d);

  // intent: DEC-004 (Site/first-view-light-shader) — static material coordinates make scroll read as changing illumination.
  // intent why-not: DEC-002 (Site/first-view-light-shader) — excluding time preserves a deterministic image at each scroll position.
  vec2 materialUv = uv;
  MaterialSurface materialSurface = sampleMaterialSurface(materialUv);
  float height = materialSurface.height;
  vec3 normal = materialSurface.diffuseNormal;
  vec3 specularNormal = materialSurface.specularNormal;
  vec2 reliefClass = vec2(materialSurface.crest, materialSurface.valley);
  vec3 sourcePosition = mix(
    vec3(0.32, 0.10, 0.62),
    vec3(-0.02, 0.08, 1.85),
    smoothstep(0.0, 1.0, incidence)
  );
  vec3 receiverPosition = vec3(p, (height - 0.5) * 0.020);
  receiverPosition.z = 0.0;
  vec3 sourceVector = sourcePosition - receiverPosition;
  // intent: DEC-013 (Site/first-view-light-shader) — direction, distance response, BRDF, and self-visibility share this finite source position.
  vec3 directDirection = normalize(sourceVector);
  float sourceRadius = mix(0.22, 0.34, incidence);
  // intent: DEC-011 (Site/first-view-light-shader) — height changes material parameters, never final RGB directly.
  float directNormalStrength = 0.80;
  float ambientNormalStrength = 0.36;
  // intent: DEC-013 (Site/first-view-light-shader) — moving the shared source changes incident direction; it must not flatten the canonical surface before radiance and sensor saturation do so naturally.
  vec3 directNormal = normalize(mix(
    vec3(0.0, 0.0, 1.0),
    normal,
    directNormalStrength
  ));
  vec3 ambientNormal = normalize(mix(
    vec3(0.0, 0.0, 1.0),
    normalize(mix(normal, specularNormal, 0.24)),
    ambientNormalStrength
  ));
  vec3 skyDirection = normalize(vec3(-0.34, 0.52, 0.78));
  vec3 bounceDirection = normalize(vec3(0.24, -0.42, 0.88));
  float skyNoL = max(dot(ambientNormal, skyDirection), 0.0);
  float bounceNoL = max(dot(ambientNormal, bounceDirection), 0.0);
  float ambientDiffuse = mix(skyNoL, bounceNoL, 0.28);
  float specularRoughness = materialSurface.roughness;
  float ambientVisibility = materialSurface.ambientVisibility;
  float selfVisibility = 1.0;
  vec3 viewDirection = normalize(vec3(-p.x * 0.12, -p.y * 0.08, 1.0));
  vec3 areaMaterial = integrateAreaMaterial(
    materialUv,
    viewDirection,
    sourceVector,
    sourceRadius,
    clamp(
      occluderDistance / max(sourceProjectionRadius, 0.0001),
      -1.0,
      1.0
    ),
    specularRoughness,
    0.035
  );
  float coreSourceRadius = sourceRadius * 0.14;
  float normalizedCoreOccluderDistance = clamp(
    occluderDistance / max(sourceProjectionRadius * 0.14, 0.0001),
    -1.0,
    1.0
  );
  vec3 coreAreaMaterial = integrateAreaMaterial(
    materialUv,
    viewDirection,
    sourceVector,
    coreSourceRadius,
    normalizedCoreOccluderDistance,
    specularRoughness,
    0.035
  );
  // intent: DEC-013 (Site/first-view-light-shader) — broad and core transport remain unnormalized solid-angle integrals; the smaller core is sharp because of emitter size and radiance, not altered material roughness or a post-normalization gain.

  // The preserved composition is now a field of incident energy and visibility,
  // not a pair of finished RGB paintings.
  float penumbraVisibility = clamp(beamMask, 0.0, 1.0);
  float edgeVisibility = 1.0 - clamp(
    penumbraDensity * 0.10 + apertureBite * 0.05,
    0.0,
    0.24
  );
  float directVisibility = clamp(bottomCut * edgeVisibility, 0.0, 1.0);
  float localVisibilityWeight = smoothstep(0.10, 0.82, lightField) *
    mix(0.82, 0.38, incidence);
  // intent: DEC-012 (Site/first-view-light-shader) — short-range height visibility attenuates direct irradiance only and cannot redraw the macro beam.
  float materialDirectVisibility = mix(
    1.0,
    selfVisibility,
    localVisibilityWeight
  );

  float environmentOcclusion = 1.0 - clamp(
    upperShadow * 0.48 + edgeOcclusion * 0.14 + contactShadow * 0.10,
    0.0,
    0.64
  );
  float ambientLevel = mix(0.74, 1.12, lowerCoolReturn * 0.52) *
    environmentOcclusion * mix(1.0, 2.15, incidence);
  ambientLevel *= 1.0 + lowerCoolReturn * 0.24 *
    pow(1.0 - incidence, 2.0);
  float portraitResponse = 1.0 - smoothstep(
    0.68,
    1.05,
    u_resolution.x / u_resolution.y
  );
  float aoWeight = (1.0 - portraitResponse) *
    mix(0.72, 0.20, smoothstep(0.08, 0.70, incidence));
  float materialAmbientVisibility = mix(1.0, ambientVisibility, aoWeight);
  materialAmbientVisibility *= 1.0 - reliefClass.y *
    mix(0.070, 0.270, smoothstep(0.08, 0.74, lightField));

  if (u_debug_mode == 1) {
    outColor = vec4(directNormal * 0.5 + 0.5, 1.0);
    return;
  }
  if (u_debug_mode == 2) {
    outColor = vec4(
      directVisibility,
      directVisibility,
      selfVisibility,
      1.0
    );
    return;
  }

  vec3 baseAlbedo = vec3(0.108, 0.115, 0.117);

  // Layered's palette is interpreted as incident chromaticity. Scalar fields
  // carry all energy, so no palette anchor is a finished output color.
  vec3 coolBaseSource = vec3(0.568858, 1.098159, 1.297191);
  vec3 coolDeepSource = vec3(0.197203, 1.160502, 1.774007);
  vec3 coolPaleSource = vec3(0.812826, 1.055575, 1.000642);
  vec3 veilBlueSource = vec3(0.654004, 1.093420, 1.093420);
  vec3 lowerReturnSource = coolDeepSource;
  float ambientDepth = clamp(
    upperShadow * 0.72 + edgeOcclusion * 0.18 + contactShadow * 0.10,
    0.0,
    0.90
  );
  vec3 ambientChromaticity = mix(coolBaseSource, coolDeepSource, ambientDepth);
  float ambientPaleWeight = clamp(
    lowerCoolReturn * 0.25 + incidence * 0.42,
    0.0,
    0.48
  );
  ambientChromaticity = mix(
    ambientChromaticity,
    coolPaleSource,
    ambientPaleWeight
  );
  ambientChromaticity = mix(
    ambientChromaticity,
    veilBlueSource,
    smoothstep(0.12, 0.82, lowerBlueVeil) * 0.08
  );

  vec3 warmLightSource = vec3(1.149703, 0.985890, 0.698953);
  vec3 warmPeakSource = vec3(1.180123, 0.979799, 0.669713);
  vec3 veilCreamSource = vec3(1.165457, 0.988264, 0.629046);
  vec3 apertureWarmSource = vec3(1.463072, 0.926567, 0.363851);
  vec3 hotWhiteSource = vec3(1.130919, 0.991032, 0.703334);
  vec3 frontalWarmSource = mix(veilCreamSource, apertureWarmSource, 0.18);
  vec3 broadEmitterSpectrum = mix(
    warmLightSource * 0.58 + veilCreamSource * 0.27 +
      apertureWarmSource * 0.15,
    frontalWarmSource,
    incidence * 0.36
  );
  vec3 broadEmitterChromaticity = broadEmitterSpectrum /
    max(luminance(broadEmitterSpectrum), 0.0001);
  vec3 coreEmitterSpectrum = hotWhiteSource * 0.68 +
    warmPeakSource * 0.32;
  vec3 coreEmitterChromaticity = coreEmitterSpectrum /
    max(luminance(coreEmitterSpectrum), 0.0001);
  float broadEmitterLuminance = 24.0;
  float coreEmitterLuminance = 7600.0;
  vec3 broadEmitterRadiance = broadEmitterChromaticity *
    broadEmitterLuminance;
  vec3 coreEmitterRadiance = coreEmitterChromaticity *
    coreEmitterLuminance;
  // intent: DEC-015 (Site/first-view-light-shader) — broad warm radiance exposes the band-limited weave, while the concentric high-radiance core saturates it through the shared sensor path; no independent detail or focus mask chooses where texture appears.
  float coreApertureTransmission = smoothstep(
    0.080,
    0.88,
    pow(max(hotCoreProfile, 0.0), 1.60)
  );

  // intent: DEC-011 (Site/first-view-light-shader) — one radiance path keeps diffuse, specular, shadow, and saturation causally connected.
  // intent: DEC-013 (Site/first-view-light-shader) — the broad disk carries base radiance and the concentric core carries a fixed radiance increment; neither path compensates energy lost to occlusion.
  float frontalBounceEnergy = incidence * incidence *
    (0.08 + core * 0.16 + frontalFill * 0.10 +
      upperApertureSkin * 0.08 + innerWarmShelf * 0.06);
  vec3 frontalBounceSource = mix(
    veilCreamSource,
    apertureWarmSource,
    0.18
  );
  vec3 ambientIncident = ambientChromaticity * ambientLevel +
    frontalBounceSource * frontalBounceEnergy;
  vec3 ambientRadiance = baseAlbedo * ambientIncident * ambientDiffuse *
    materialAmbientVisibility * 1.30;
  vec3 broadDiffuseRadiance = baseAlbedo / PI * materialDirectVisibility *
    broadEmitterRadiance * areaMaterial.x;
  vec3 coreDiffuseRadiance = baseAlbedo / PI * materialDirectVisibility *
    coreEmitterRadiance * coreAreaMaterial.x * coreApertureTransmission;
  vec3 diffuseRadiance = broadDiffuseRadiance + coreDiffuseRadiance;
  vec3 broadSpecularRadiance = materialDirectVisibility *
    broadEmitterRadiance * areaMaterial.z;
  vec3 coreSpecularRadiance = materialDirectVisibility *
    coreEmitterRadiance * coreAreaMaterial.z * coreApertureTransmission;
  vec3 specularRadiance = broadSpecularRadiance + coreSpecularRadiance;
  vec3 sceneRadiance = ambientRadiance + diffuseRadiance + specularRadiance;

  // A broad, low-energy cool return is environmental fill, not a painted overlay.
  sceneRadiance += baseAlbedo * lowerReturnSource * lowerBlueVeil *
    mix(0.230, 0.020, incidence);
  float vignette = smoothstep(1.05, 0.16, length((uv - 0.5) * vec2(0.82, 1.04)));
  sceneRadiance *= mix(0.88, 1.04, vignette);

  // Bloom remains a later, separate stage so it cannot disguise transport errors.
  float sensorExposure = exp2(pow(u_exit_wash, 1.50) * 5.0);
  vec3 color = sensorResponse(sceneRadiance * sensorExposure * 0.82);
  // intent: DEC-005 (Site/first-view-light-shader) — the shared white surface connects the First View to Principle.
  // intent: DEC-012 (Site/first-view-light-shader) — exit white is reached by scroll-synchronous sensor overexposure, preserving scene contrast until each channel actually saturates.
  outColor = vec4(color, 1.0);
}
