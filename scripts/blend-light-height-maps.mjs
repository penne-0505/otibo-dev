import { createHash } from "node:crypto";
import { existsSync, mkdirSync, readFileSync, writeFileSync } from "node:fs";
import { dirname, resolve } from "node:path";
import { deflateSync, inflateSync } from "node:zlib";

const WEIGHTS = Object.freeze({ cloth: 0.6, paper: 0.1, sand: 0.3 });
const NEUTRAL_WEIGHTS = Object.freeze({
  lowSurface: 0.22,
  clothInteraction: 0.22,
  paperInteraction: 0.16,
  sandDetail: 0.4,
});
const FREQUENCY_SPREAD = 0.165;
const NEUTRAL_SPREAD = 0.17;
const MICRO_PARTICLE_WEIGHT = 0.085;
const MICROSTRUCTURE_WEIGHT = 0.2;
const PNG_SIGNATURE = Buffer.from([137, 80, 78, 71, 13, 10, 26, 10]);
const DIRECTIONAL_MODES = new Set([
  "phase-soft",
  "phase-medium",
  "phase-strong",
  "phase-particle",
  "phase-microstructure",
]);

function readOption(name) {
  const index = process.argv.indexOf(name);
  if (index === -1) return undefined;
  const value = process.argv[index + 1];
  if (!value || value.startsWith("--")) {
    throw new Error(`${name} requires a value`);
  }
  return value;
}

const mode = readOption("--mode");
const outputOption = readOption("--output");
const inputOptions = {
  cloth: readOption("--cloth"),
  paper: readOption("--paper"),
  sand: readOption("--sand"),
};

if (
  mode !== "frequency" && mode !== "frequency-strong" &&
  mode !== "average" && mode !== "neutral" &&
  !DIRECTIONAL_MODES.has(mode)
) {
  throw new Error(
    "--mode must be frequency, frequency-strong, average, neutral, phase-soft, phase-medium, phase-strong, phase-particle, or phase-microstructure",
  );
}
if (!outputOption) throw new Error("--output is required");
for (const [material, input] of Object.entries(inputOptions)) {
  if (!input) throw new Error(`--${material} is required`);
}

function crc32(buffer) {
  let crc = 0xffffffff;
  for (const byte of buffer) {
    crc ^= byte;
    for (let bit = 0; bit < 8; bit += 1) {
      crc = (crc >>> 1) ^ (0xedb88320 & -(crc & 1));
    }
  }
  return (crc ^ 0xffffffff) >>> 0;
}

function chunk(type, data) {
  const typeBuffer = Buffer.from(type, "ascii");
  const length = Buffer.alloc(4);
  const checksum = Buffer.alloc(4);
  length.writeUInt32BE(data.length);
  checksum.writeUInt32BE(crc32(Buffer.concat([typeBuffer, data])));
  return Buffer.concat([length, typeBuffer, data, checksum]);
}

function encodeGrayscalePng(pixels, width, height) {
  const header = Buffer.alloc(13);
  header.writeUInt32BE(width, 0);
  header.writeUInt32BE(height, 4);
  header[8] = 8;
  header[9] = 0;

  const scanlines = Buffer.alloc((width + 1) * height);
  for (let y = 0; y < height; y += 1) {
    const rowOffset = y * (width + 1);
    scanlines[rowOffset] = 0;
    pixels.copy(scanlines, rowOffset + 1, y * width, (y + 1) * width);
  }

  return Buffer.concat([
    PNG_SIGNATURE,
    chunk("IHDR", header),
    chunk("IDAT", deflateSync(scanlines, { level: 9 })),
    chunk("IEND", Buffer.alloc(0)),
  ]);
}

function decodeGrayscalePng(path) {
  const png = readFileSync(path);
  if (!png.subarray(0, PNG_SIGNATURE.length).equals(PNG_SIGNATURE)) {
    throw new Error(`${path} is not a PNG`);
  }

  let offset = PNG_SIGNATURE.length;
  let width;
  let height;
  const compressed = [];

  while (offset < png.length) {
    const length = png.readUInt32BE(offset);
    const type = png.toString("ascii", offset + 4, offset + 8);
    const data = png.subarray(offset + 8, offset + 8 + length);
    offset += 12 + length;

    if (type === "IHDR") {
      width = data.readUInt32BE(0);
      height = data.readUInt32BE(4);
      const bitDepth = data[8];
      const colorType = data[9];
      const interlace = data[12];
      if (bitDepth !== 8 || colorType !== 0 || interlace !== 0) {
        throw new Error(
          `${path} must be non-interlaced 8-bit grayscale (received bitDepth=${bitDepth}, colorType=${colorType}, interlace=${interlace})`,
        );
      }
    } else if (type === "IDAT") {
      compressed.push(data);
    } else if (type === "IEND") {
      break;
    }
  }

  if (!width || !height || compressed.length === 0) {
    throw new Error(`${path} is missing required PNG chunks`);
  }

  const scanlines = inflateSync(Buffer.concat(compressed));
  const stride = width + 1;
  if (scanlines.length !== stride * height) {
    throw new Error(`${path} has an unexpected decoded length`);
  }

  const pixels = Buffer.alloc(width * height);
  for (let y = 0; y < height; y += 1) {
    const rowOffset = y * stride;
    if (scanlines[rowOffset] !== 0) {
      throw new Error(`${path} uses an unsupported PNG row filter`);
    }
    scanlines.copy(pixels, y * width, rowOffset + 1, rowOffset + stride);
  }

  return {
    path,
    width,
    height,
    pixels,
    sha256: createHash("sha256").update(png).digest("hex"),
  };
}

function clamp(value, minimum, maximum) {
  return Math.max(minimum, Math.min(maximum, value));
}

function boxBlur(source, width, height, radius, edgeMode = "clamp") {
  const windowSize = radius * 2 + 1;
  const horizontal = new Float32Array(source.length);
  const output = new Float32Array(source.length);
  const resolveX = edgeMode === "wrap"
    ? (value) => positiveModulo(value, width)
    : (value) => clamp(value, 0, width - 1);
  const resolveY = edgeMode === "wrap"
    ? (value) => positiveModulo(value, height)
    : (value) => clamp(value, 0, height - 1);

  for (let y = 0; y < height; y += 1) {
    const rowOffset = y * width;
    let sum = 0;
    for (let sample = -radius; sample <= radius; sample += 1) {
      sum += source[rowOffset + resolveX(sample)];
    }
    for (let x = 0; x < width; x += 1) {
      horizontal[rowOffset + x] = sum / windowSize;
      sum -= source[rowOffset + resolveX(x - radius)];
      sum += source[rowOffset + resolveX(x + radius + 1)];
    }
  }

  for (let x = 0; x < width; x += 1) {
    let sum = 0;
    for (let sample = -radius; sample <= radius; sample += 1) {
      sum += horizontal[resolveY(sample) * width + x];
    }
    for (let y = 0; y < height; y += 1) {
      output[y * width + x] = sum / windowSize;
      sum -= horizontal[resolveY(y - radius) * width + x];
      sum += horizontal[resolveY(y + radius + 1) * width + x];
    }
  }

  return output;
}

function signalStats(length, readSignal) {
  let mean = 0;
  for (let index = 0; index < length; index += 1) {
    mean += readSignal(index);
  }
  mean /= length;

  let variance = 0;
  for (let index = 0; index < length; index += 1) {
    variance += (readSignal(index) - mean) ** 2;
  }
  return {
    mean,
    rms: Math.max(0.0001, Math.sqrt(variance / length)),
  };
}

function createAverageBlend(inputs) {
  const output = Buffer.alloc(inputs.cloth.pixels.length);
  for (let index = 0; index < output.length; index += 1) {
    output[index] = Math.round(
      inputs.cloth.pixels[index] * WEIGHTS.cloth +
        inputs.paper.pixels[index] * WEIGHTS.paper +
        inputs.sand.pixels[index] * WEIGHTS.sand,
    );
  }
  return output;
}

function createFrequencyBlend(inputs) {
  const { width, height } = inputs.cloth;
  // AC-021: isolate the blend method by keeping the source assets and 60/10/30 weights fixed.
  const paperBlur = boxBlur(inputs.paper.pixels, width, height, 2);
  const sandBlur = boxBlur(inputs.sand.pixels, width, height, 18);
  const clothSignal = (index) => inputs.cloth.pixels[index];
  const paperSignal = (index) => inputs.paper.pixels[index] - paperBlur[index];
  const sandSignal = (index) => inputs.sand.pixels[index] - sandBlur[index];
  const clothStats = signalStats(inputs.cloth.pixels.length, clothSignal);
  const paperStats = signalStats(inputs.paper.pixels.length, paperSignal);
  const sandStats = signalStats(inputs.sand.pixels.length, sandSignal);

  const mixedSignal = (index) =>
    ((clothSignal(index) - clothStats.mean) / clothStats.rms) * WEIGHTS.cloth +
    ((paperSignal(index) - paperStats.mean) / paperStats.rms) * WEIGHTS.paper +
    ((sandSignal(index) - sandStats.mean) / sandStats.rms) * WEIGHTS.sand;
  const mixedStats = signalStats(inputs.cloth.pixels.length, mixedSignal);
  const spreadScale = FREQUENCY_SPREAD / mixedStats.rms;
  const output = Buffer.alloc(inputs.cloth.pixels.length);

  for (let index = 0; index < output.length; index += 1) {
    const normalized = 0.5 +
      (mixedSignal(index) - mixedStats.mean) * spreadScale;
    output[index] = Math.round(clamp(normalized, 0, 1) * 255);
  }
  return output;
}

function createStrongFrequencyBlend(inputs) {
  const { width, height } = inputs.cloth;
  // AC-023: preserve the comparison weights and spread while narrowing only the material frequency bands.
  const clothLow = boxBlur(inputs.cloth.pixels, width, height, 18, "wrap");
  const sandFineCut = boxBlur(inputs.sand.pixels, width, height, 2, "wrap");
  const sandBroadCut = boxBlur(inputs.sand.pixels, width, height, 18, "wrap");
  const paperLowCut = boxBlur(inputs.paper.pixels, width, height, 1, "wrap");
  const clothSignal = (index) => clothLow[index];
  const sandSignal = (index) => sandFineCut[index] - sandBroadCut[index];
  const paperSignal = (index) =>
    inputs.paper.pixels[index] - paperLowCut[index];
  const clothStats = signalStats(inputs.cloth.pixels.length, clothSignal);
  const sandStats = signalStats(inputs.sand.pixels.length, sandSignal);
  const paperStats = signalStats(inputs.paper.pixels.length, paperSignal);

  const mixedSignal = (index) =>
    ((clothSignal(index) - clothStats.mean) / clothStats.rms) * WEIGHTS.cloth +
    ((paperSignal(index) - paperStats.mean) / paperStats.rms) * WEIGHTS.paper +
    ((sandSignal(index) - sandStats.mean) / sandStats.rms) * WEIGHTS.sand;
  const mixedStats = signalStats(inputs.cloth.pixels.length, mixedSignal);
  const spreadScale = FREQUENCY_SPREAD / mixedStats.rms;
  const output = Buffer.alloc(inputs.cloth.pixels.length);

  for (let index = 0; index < output.length; index += 1) {
    const normalized = 0.5 +
      (mixedSignal(index) - mixedStats.mean) * spreadScale;
    output[index] = Math.round(clamp(normalized, 0, 1) * 255);
  }
  return output;
}

function positiveModulo(value, divisor) {
  return ((value % divisor) + divisor) % divisor;
}

function createAffineSampler(source, width, height, transform) {
  const { xx, xy, yx, yy, offsetX, offsetY } = transform;
  return (index) => {
    const x = index % width;
    const y = Math.floor(index / width);
    const sourceX = positiveModulo(xx * x + xy * y + offsetX, width);
    const sourceY = positiveModulo(yx * x + yy * y + offsetY, height);
    return source[sourceY * width + sourceX];
  };
}

function averageSignals(signals, index) {
  let sum = 0;
  for (const signal of signals) sum += signal(index);
  return sum / signals.length;
}

function normalizeWeightedSignals(length, weightedSignals, spread) {
  const prepared = weightedSignals.map(({ signal, weight }) => ({
    signal,
    weight,
    stats: signalStats(length, signal),
  }));
  const mixedSignal = (index) => {
    let value = 0;
    for (const { signal, weight, stats } of prepared) {
      value += ((signal(index) - stats.mean) / stats.rms) * weight;
    }
    return value;
  };
  const mixedStats = signalStats(length, mixedSignal);
  const spreadScale = spread / mixedStats.rms;
  const output = Buffer.alloc(length);

  for (let index = 0; index < length; index += 1) {
    const normalized = 0.5 +
      (mixedSignal(index) - mixedStats.mean) * spreadScale;
    output[index] = Math.round(clamp(normalized, 0, 1) * 255);
  }
  return output;
}

function quintic(value) {
  return value * value * value * (value * (value * 6 - 15) + 10);
}

function latticeValue(x, y, seed) {
  let value = Math.imul(x ^ seed, 0x45d9f3b);
  value = Math.imul(value ^ y, 0x45d9f3b);
  value ^= value >>> 16;
  value = Math.imul(value, 0x45d9f3b);
  value ^= value >>> 16;
  return (value >>> 0) / 0xffffffff;
}

function addTileableValueNoise(
  target,
  width,
  height,
  gridWidth,
  gridHeight,
  amplitude,
  seed,
) {
  const lattice = new Float32Array(gridWidth * gridHeight);
  for (let y = 0; y < gridHeight; y += 1) {
    for (let x = 0; x < gridWidth; x += 1) {
      lattice[y * gridWidth + x] = latticeValue(x, y, seed);
    }
  }

  for (let y = 0; y < height; y += 1) {
    const sourceY = y * gridHeight / height;
    const y0 = Math.floor(sourceY);
    const y1 = (y0 + 1) % gridHeight;
    const ty = quintic(sourceY - y0);
    const rowOffset = y * width;
    for (let x = 0; x < width; x += 1) {
      const sourceX = x * gridWidth / width;
      const x0 = Math.floor(sourceX);
      const x1 = (x0 + 1) % gridWidth;
      const tx = quintic(sourceX - x0);
      const top = lattice[y0 * gridWidth + x0] * (1 - tx) +
        lattice[y0 * gridWidth + x1] * tx;
      const bottom = lattice[y1 * gridWidth + x0] * (1 - tx) +
        lattice[y1 * gridWidth + x1] * tx;
      target[rowOffset + x] += (top * (1 - ty) + bottom * ty) * amplitude;
    }
  }
}

function createIsotropicCarrier(width, height) {
  const carrier = new Float32Array(width * height);
  addTileableValueNoise(carrier, width, height, 8, 16, 0.15, 1709);
  addTileableValueNoise(carrier, width, height, 16, 32, 0.15, 3253);
  addTileableValueNoise(carrier, width, height, 32, 64, 0.15, 7919);
  addTileableValueNoise(carrier, width, height, 64, 128, 0.14, 12547);
  addTileableValueNoise(carrier, width, height, 128, 256, 0.13, 17389);
  addTileableValueNoise(carrier, width, height, 256, 512, 0.11, 23063);
  addTileableValueNoise(carrier, width, height, 512, 1024, 0.10, 30187);
  addTileableValueNoise(carrier, width, height, 1024, 2048, 0.07, 37813);
  return carrier;
}

function createMicroParticleCarrier(width, height) {
  const carrier = new Float32Array(width * height);
  addTileableValueNoise(carrier, width, height, 512, 1024, 0.48, 41843);
  addTileableValueNoise(carrier, width, height, 1024, 2048, 0.34, 53993);
  addTileableValueNoise(carrier, width, height, 1536, 3072, 0.18, 65537);
  return carrier;
}

function createMicrostructureCarrier(width, height) {
  const length = width * height;
  const density = new Float32Array(length);
  const broadRidges = new Float32Array(length);
  const fineRidges = new Float32Array(length);
  const granules = new Float32Array(length);
  const output = new Float32Array(length);

  addTileableValueNoise(density, width, height, 10, 20, 0.68, 70423);
  addTileableValueNoise(density, width, height, 28, 56, 0.32, 81173);
  addTileableValueNoise(broadRidges, width, height, 256, 512, 1.0, 92821);
  addTileableValueNoise(fineRidges, width, height, 512, 1024, 1.0, 104729);
  addTileableValueNoise(granules, width, height, 1024, 2048, 1.0, 116731);

  for (let index = 0; index < length; index += 1) {
    const densityT = clamp((density[index] - 0.24) / 0.62, 0, 1);
    const densityEase = densityT * densityT * (3 - 2 * densityT);
    const envelope = 0.16 + densityEase * 0.84;
    const broad = Math.max(0, 1 - Math.abs(broadRidges[index] * 2 - 1));
    const fine = Math.max(0, 1 - Math.abs(fineRidges[index] * 2 - 1));
    const broadFilament = broad ** 5 - 0.31;
    const fineFilament = fine ** 3.2 - 0.39;
    const granularRelief = granules[index] - 0.5;
    output[index] = envelope *
      (broadFilament * 0.58 + fineFilament * 0.30 + granularRelief * 0.12);
  }

  return output;
}

function createDirectionalVariant(inputs, variantMode) {
  const { width, height } = inputs.cloth;
  const length = inputs.cloth.pixels.length;
  // AC-025: preserve band energy and output spread while replacing only the cloth carrier phase.
  const clothLow = boxBlur(
    inputs.cloth.pixels,
    width,
    height,
    18,
    "wrap",
  );
  const sandFineCut = boxBlur(
    inputs.sand.pixels,
    width,
    height,
    2,
    "wrap",
  );
  const sandBroadCut = boxBlur(
    inputs.sand.pixels,
    width,
    height,
    18,
    "wrap",
  );
  const paperLowCut = boxBlur(
    inputs.paper.pixels,
    width,
    height,
    1,
    "wrap",
  );
  const isotropicCarrier = createIsotropicCarrier(width, height);
  const clothStats = signalStats(length, (index) => clothLow[index]);
  const carrierStats = signalStats(length, (index) => isotropicCarrier[index]);
  const phaseReplacement = {
    "phase-soft": 0.25,
    "phase-medium": 0.45,
    "phase-strong": 0.6,
    "phase-particle": 0.25,
    "phase-microstructure": 0.4,
  }[variantMode];
  const signals = {
    cloth: (index) =>
      ((clothLow[index] - clothStats.mean) / clothStats.rms) *
        (1 - phaseReplacement) +
      ((isotropicCarrier[index] - carrierStats.mean) / carrierStats.rms) *
        phaseReplacement,
    paper: (index) => inputs.paper.pixels[index] - paperLowCut[index],
    sand: (index) => sandFineCut[index] - sandBroadCut[index],
  };

  const weightedSignals = [
    { signal: signals.cloth, weight: WEIGHTS.cloth },
    { signal: signals.paper, weight: WEIGHTS.paper },
    { signal: signals.sand, weight: WEIGHTS.sand },
  ];
  if (variantMode === "phase-particle") {
    // AC-026: add sub-thread relief without replacing the retained cloth-derived carrier.
    const particles = createMicroParticleCarrier(width, height);
    weightedSignals.push({
      signal: (index) => particles[index],
      weight: MICRO_PARTICLE_WEIGHT,
    });
  }
  if (variantMode === "phase-microstructure") {
    const microstructure = createMicrostructureCarrier(width, height);
    weightedSignals.push({
      signal: (index) => microstructure[index],
      weight: MICROSTRUCTURE_WEIGHT,
    });
  }

  return normalizeWeightedSignals(
    length,
    weightedSignals,
    FREQUENCY_SPREAD,
  );
}

function createFeatureNeutralBlend(inputs) {
  const { width, height } = inputs.cloth;
  const length = inputs.cloth.pixels.length;
  // AC-022: redistribute material-identifying directionality without smoothing away local information.
  const clothBlur = boxBlur(inputs.cloth.pixels, width, height, 18);
  const paperBlur = boxBlur(inputs.paper.pixels, width, height, 3);
  const sandBlur = boxBlur(inputs.sand.pixels, width, height, 18);
  const lowSurface = new Float32Array(length);
  const clothDetail = new Float32Array(length);
  const paperDetail = new Float32Array(length);
  const sandDetail = new Float32Array(length);

  for (let index = 0; index < length; index += 1) {
    lowSurface[index] = clothBlur[index] * 0.45 +
      paperBlur[index] * 0.25 + sandBlur[index] * 0.30;
    clothDetail[index] = inputs.cloth.pixels[index] - clothBlur[index];
    paperDetail[index] = inputs.paper.pixels[index] - paperBlur[index];
    sandDetail[index] = inputs.sand.pixels[index] - sandBlur[index];
  }

  const transforms = [
    { xx: 1, xy: 1, yx: 0, yy: 1, offsetX: 191, offsetY: 877 },
    { xx: 1, xy: -1, yx: 1, yy: 0, offsetX: 1237, offsetY: 431 },
    { xx: 0, xy: 1, yx: -1, yy: 1, offsetX: 719, offsetY: 2711 },
  ];
  const lowSamplers = transforms.slice(0, 2).map((transform) =>
    createAffineSampler(lowSurface, width, height, transform)
  );
  const clothSamplers = transforms.map((transform) =>
    createAffineSampler(clothDetail, width, height, transform)
  );
  const paperSamplers = transforms.map((transform, index) =>
    createAffineSampler(paperDetail, width, height, {
      ...transform,
      offsetX: transform.offsetX + 257 * (index + 1),
      offsetY: transform.offsetY + 613 * (index + 1),
    })
  );
  const sandSamplers = transforms.map((transform, index) =>
    createAffineSampler(sandDetail, width, height, {
      ...transform,
      offsetX: transform.offsetX + 421 * (index + 1),
      offsetY: transform.offsetY + 947 * (index + 1),
    })
  );
  const signals = {
    low: (index) => averageSignals(lowSamplers, index),
    cloth: (index) => {
      const a = clothSamplers[0](index);
      const b = clothSamplers[1](index);
      const c = clothSamplers[2](index);
      return (a * b + b * c + c * a) / 3;
    },
    paper: (index) => {
      const a = paperSamplers[0](index);
      const b = paperSamplers[1](index);
      const c = paperSamplers[2](index);
      return (a * b + b * c + c * a) / 3;
    },
    sand: (index) => averageSignals(sandSamplers, index),
  };
  const stats = Object.fromEntries(
    Object.entries(signals).map(([name, signal]) => [
      name,
      signalStats(length, signal),
    ]),
  );
  const neutralSignal = (index) =>
    ((signals.low(index) - stats.low.mean) / stats.low.rms) *
      NEUTRAL_WEIGHTS.lowSurface +
    ((signals.cloth(index) - stats.cloth.mean) / stats.cloth.rms) *
      NEUTRAL_WEIGHTS.clothInteraction +
    ((signals.paper(index) - stats.paper.mean) / stats.paper.rms) *
      NEUTRAL_WEIGHTS.paperInteraction +
    ((signals.sand(index) - stats.sand.mean) / stats.sand.rms) *
      NEUTRAL_WEIGHTS.sandDetail;
  const neutralStats = signalStats(length, neutralSignal);
  const spreadScale = NEUTRAL_SPREAD / neutralStats.rms;
  const output = Buffer.alloc(length);

  for (let index = 0; index < length; index += 1) {
    const normalized = 0.5 +
      (neutralSignal(index) - neutralStats.mean) * spreadScale;
    output[index] = Math.round(clamp(normalized, 0, 1) * 255);
  }
  return output;
}

const inputs = Object.fromEntries(
  Object.entries(inputOptions).map(([material, path]) => [
    material,
    decodeGrayscalePng(resolve(process.cwd(), path)),
  ]),
);
const reference = inputs.cloth;
for (const [material, input] of Object.entries(inputs)) {
  if (input.width !== reference.width || input.height !== reference.height) {
    throw new Error(
      `${material} is ${input.width}x${input.height}; expected ${reference.width}x${reference.height}`,
    );
  }
}

const pixels = mode === "frequency"
  ? createFrequencyBlend(inputs)
  : mode === "frequency-strong"
  ? createStrongFrequencyBlend(inputs)
  : mode === "neutral"
  ? createFeatureNeutralBlend(inputs)
  : DIRECTIONAL_MODES.has(mode)
  ? createDirectionalVariant(inputs, mode)
  : createAverageBlend(inputs);
const png = encodeGrayscalePng(pixels, reference.width, reference.height);
const outputPath = resolve(process.cwd(), outputOption);
mkdirSync(dirname(outputPath), { recursive: true });

if (!existsSync(outputPath) || !readFileSync(outputPath).equals(png)) {
  writeFileSync(outputPath, png);
}

console.log(JSON.stringify(
  {
    mode,
    dimensions: `${reference.width}x${reference.height}`,
    weights: mode === "neutral"
      ? NEUTRAL_WEIGHTS
      : mode === "phase-particle"
      ? { ...WEIGHTS, particles: MICRO_PARTICLE_WEIGHT }
      : mode === "phase-microstructure"
      ? { ...WEIGHTS, microstructure: MICROSTRUCTURE_WEIGHT }
      : WEIGHTS,
    inputs: Object.fromEntries(
      Object.entries(inputs).map((
        [material, input],
      ) => [material, input.sha256]),
    ),
    output: {
      path: outputPath,
      sha256: createHash("sha256").update(png).digest("hex"),
      bytes: png.length,
    },
  },
  null,
  2,
));
