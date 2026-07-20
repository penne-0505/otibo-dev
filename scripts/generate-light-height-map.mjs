import { deflateSync } from "node:zlib";
import { createHash } from "node:crypto";
import { existsSync, mkdirSync, readFileSync, writeFileSync } from "node:fs";
import { dirname, resolve } from "node:path";
import { fileURLToPath } from "node:url";

// intent: DEC-003 (Site/first-view-light-shader) — build-time relief keeps GPU preparation out of the initial paint contract.
// Keep the selected high-resolution source geometry available for deterministic baseline composition.
// intent: DEC-007 (Site/first-view-light-shader) — the canonical representation must be reproducible without temporary assets.
// The runtime never synthesizes this texture.
const WIDTH = readDimensionOption("--width", 3072);
const HEIGHT = readDimensionOption("--height", 6144);
const BASELINE_BLEND_WEIGHTS = Object.freeze({
  cloth: 0.6,
  paper: 0.1,
  sand: 0.3,
});
const BASELINE_SPREAD = 0.165;
const MICROSTRUCTURE_WEIGHT = 0.2;
const CANONICAL_SHA256 =
  "48d0637db927bbf1da36db2f80e8a07ec33358fb1344a077a4384797d79b6f5e";
const DEFAULT_OUTPUT_PATH = resolve(
  dirname(fileURLToPath(import.meta.url)),
  "../public/first-view/light-height-map.png",
);
const MATERIALS = new Set([
  "baseline",
  "paper",
  "stone",
  "cloth",
  "sand",
  "gravel",
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

function readDimensionOption(name, fallback) {
  const raw = readOption(name);
  if (raw === undefined) return fallback;
  const value = Number(raw);
  if (!Number.isSafeInteger(value) || value < 1) {
    throw new Error(`${name} must be a positive integer`);
  }
  return value;
}

const MATERIAL = readOption("--material") ?? "baseline";
if (!MATERIALS.has(MATERIAL)) {
  throw new Error(`Unknown material: ${MATERIAL}`);
}
const outputOption = readOption("--output");
const OUTPUT_PATH = outputOption
  ? resolve(process.cwd(), outputOption)
  : DEFAULT_OUTPUT_PATH;

function hash2(x, y) {
  const value = Math.sin(x * 127.1 + y * 311.7) * 43758.5453123;
  return value - Math.floor(value);
}

function smoothstep(value) {
  return value * value * (3 - 2 * value);
}

function valueNoise(x, y) {
  const ix = Math.floor(x);
  const iy = Math.floor(y);
  const fx = x - ix;
  const fy = y - iy;
  const ux = smoothstep(fx);
  const uy = smoothstep(fy);
  const a = hash2(ix, iy);
  const b = hash2(ix + 1, iy);
  const c = hash2(ix, iy + 1);
  const d = hash2(ix + 1, iy + 1);
  const ab = a + (b - a) * ux;
  const cd = c + (d - c) * ux;
  return ab + (cd - ab) * uy;
}

function fbm2(x, y) {
  let value = 0;
  let amplitude = 0.5;
  let frequency = 1;
  for (let octave = 0; octave < 5; octave += 1) {
    value += valueNoise(x * frequency, y * frequency) * amplitude;
    frequency *= 2.07;
    amplitude *= 0.52;
  }
  return value;
}

function cellularEdge(x, y) {
  const ix = Math.floor(x);
  const iy = Math.floor(y);
  let nearest = 99;
  let nextNearest = 99;

  for (let oy = -1; oy <= 1; oy += 1) {
    for (let ox = -1; ox <= 1; ox += 1) {
      const px = ix + ox;
      const py = iy + oy;
      const cx = px + hash2(px, py);
      const cy = py + hash2(px + 37.2, py - 19.8);
      const dx = x - cx;
      const dy = y - cy;
      const distance = Math.sqrt(dx * dx + dy * dy);

      if (distance < nearest) {
        nextNearest = nearest;
        nearest = distance;
      } else if (distance < nextNearest) {
        nextNearest = distance;
      }
    }
  }

  return Math.max(0, 1 - (nextNearest - nearest) * 2.7);
}

function stamp(values, x, y, radius, strength) {
  const minX = Math.max(0, Math.floor(x - radius * 2));
  const maxX = Math.min(WIDTH - 1, Math.ceil(x + radius * 2));
  const minY = Math.max(0, Math.floor(y - radius * 2));
  const maxY = Math.min(HEIGHT - 1, Math.ceil(y + radius * 2));

  for (let yy = minY; yy <= maxY; yy += 1) {
    for (let xx = minX; xx <= maxX; xx += 1) {
      const dx = xx - x;
      const dy = yy - y;
      const falloff = Math.exp(-(dx * dx + dy * dy) / (radius * radius));
      values[yy * WIDTH + xx] += strength * falloff;
    }
  }
}

function ovalStamp(values, x, y, radiusX, radiusY, angle, strength) {
  const reach = Math.max(radiusX, radiusY) * 2.4;
  const minX = Math.max(0, Math.floor(x - reach));
  const maxX = Math.min(WIDTH - 1, Math.ceil(x + reach));
  const minY = Math.max(0, Math.floor(y - reach));
  const maxY = Math.min(HEIGHT - 1, Math.ceil(y + reach));
  const cos = Math.cos(angle);
  const sin = Math.sin(angle);

  for (let yy = minY; yy <= maxY; yy += 1) {
    for (let xx = minX; xx <= maxX; xx += 1) {
      const dx = xx - x;
      const dy = yy - y;
      const rx = (dx * cos + dy * sin) / radiusX;
      const ry = (-dx * sin + dy * cos) / radiusY;
      const distanceSquared = rx * rx + ry * ry;
      const mound = Math.exp(-distanceSquared * 1.25);
      const shoulder = Math.exp(
        -((Math.sqrt(distanceSquared) - 1.05) ** 2) * 9,
      );
      values[yy * WIDTH + xx] += strength * (mound - shoulder * 0.22);
    }
  }
}

function pebbleStamp(
  values,
  x,
  y,
  radiusX,
  radiusY,
  angle,
  strength,
  seed,
) {
  const reach = Math.max(radiusX, radiusY) * 1.7;
  const minX = Math.max(0, Math.floor(x - reach));
  const maxX = Math.min(WIDTH - 1, Math.ceil(x + reach));
  const minY = Math.max(0, Math.floor(y - reach));
  const maxY = Math.min(HEIGHT - 1, Math.ceil(y + reach));
  const cos = Math.cos(angle);
  const sin = Math.sin(angle);

  for (let yy = minY; yy <= maxY; yy += 1) {
    for (let xx = minX; xx <= maxX; xx += 1) {
      const dx = xx - x;
      const dy = yy - y;
      const rx = (dx * cos + dy * sin) / radiusX;
      const ry = (-dx * sin + dy * cos) / radiusY;
      const theta = Math.atan2(ry, rx);
      const irregularity = 0.88 +
        valueNoise(
            Math.cos(theta) * 2.4 + seed,
            Math.sin(theta) * 2.4 - seed,
          ) *
          0.24;
      const distance = Math.sqrt(rx * rx + ry * ry) / irregularity;
      const dome = Math.max(0, 1 - distance * distance) ** 0.72;
      const contact = Math.exp(-((distance - 1.04) ** 2) * 38);
      values[yy * WIDTH + xx] += strength * (dome - contact * 0.13);
    }
  }
}

function pore(values, x, y, radius, strength) {
  const minX = Math.max(0, Math.floor(x - radius * 2.8));
  const maxX = Math.min(WIDTH - 1, Math.ceil(x + radius * 2.8));
  const minY = Math.max(0, Math.floor(y - radius * 2.8));
  const maxY = Math.min(HEIGHT - 1, Math.ceil(y + radius * 2.8));

  for (let yy = minY; yy <= maxY; yy += 1) {
    for (let xx = minX; xx <= maxX; xx += 1) {
      const dx = (xx - x) / radius;
      const dy = (yy - y) / radius;
      const distance = Math.sqrt(dx * dx + dy * dy);
      const pit = Math.exp(-distance * distance * 1.7);
      const rim = Math.exp(-((distance - 1.15) ** 2) * 12);
      values[yy * WIDTH + xx] += strength * (rim * 0.55 - pit);
    }
  }
}

function stroke(values, x, y, angle, length, radius, strength, bend) {
  const steps = Math.max(3, Math.floor(length));
  let px = x;
  let py = y;
  let theta = angle;

  for (let step = 0; step < steps; step += 1) {
    const progress = step / Math.max(1, steps - 1);
    const taper = Math.sin(Math.PI * progress);
    theta += (hash2(x + step * 13.1, y - step * 7.7) - 0.5) * bend;
    px += Math.cos(theta);
    py += Math.sin(theta);
    stamp(values, px, py, radius, strength * taper);
  }
}

function normalizeHeightValues(values, spread) {
  let mean = 0;
  for (const value of values) mean += value;
  mean /= values.length;

  let variance = 0;
  for (const value of values) variance += (value - mean) ** 2;
  const scale = spread / Math.max(0.0001, Math.sqrt(variance / values.length));
  const pixels = Buffer.alloc(values.length);

  for (let index = 0; index < values.length; index += 1) {
    const compressed = 0.5 + (values[index] - mean) * scale;
    pixels[index] = Math.round(Math.min(1, Math.max(0, compressed)) * 255);
  }

  return pixels;
}

function createBaselineHeightMap() {
  const values = new Float32Array(WIDTH * HEIGHT);

  for (let y = 0; y < HEIGHT; y += 1) {
    for (let x = 0; x < WIDTH; x += 1) {
      const nx = x / WIDTH;
      const ny = y / HEIGHT;
      const warpX = (fbm2(nx * 5.8 + 2.4, ny * 6.2 - 0.7) - 0.5) * 0.07;
      const warpY = (fbm2(nx * 6.1 - 8.1, ny * 5.4 + 3.6) - 0.5) * 0.06;
      const mx = nx + warpX;
      const my = ny + warpY;
      const granularEdge = cellularEdge(mx * 64, my * 84) ** 2.6;
      const hairlineEdge = cellularEdge(mx * 146 + 9, my * 132 - 4) ** 3.4;
      const erodedGrain = Math.max(0, fbm2(mx * 74 + 11, my * 88 - 5)) ** 1.55;
      const baseSurface = 0.5 +
        (fbm2(mx * 3.8, my * 4.1) - 0.5) * 0.03 +
        (fbm2(mx * 15 + 12.8, my * 17 + 4.6) - 0.5) * 0.034;
      const mineralGrain = (fbm2(mx * 46 + 5.1, my * 52 + 9.7) - 0.5) * 0.05;
      const mineralRidge = (granularEdge * 0.03 + hairlineEdge * 0.02) *
        (0.58 + erodedGrain * 0.62);
      const scrapedPlane =
        (valueNoise(mx * 26 + my * 5, my * 62 - mx * 3) - 0.5) * 0.02;
      const grit = (hash2(x, y) - 0.5) * 0.034;
      values[y * WIDTH + x] = baseSurface + mineralGrain + mineralRidge +
        scrapedPlane + grit;
    }
  }

  for (let index = 0; index < 360; index += 1) {
    const sign = hash2(index, 97.4) > 0.45 ? 1 : -1;
    ovalStamp(
      values,
      hash2(index, 11.3) * WIDTH,
      hash2(index, 19.7) * HEIGHT,
      1.15 + hash2(index, 53.9) * 3.8,
      0.45 + hash2(index, 71.2) * 1.45,
      hash2(index, 37.1) * Math.PI * 2,
      sign * (0.002 + hash2(index, 113.8) * 0.007),
    );
  }

  for (let index = 0; index < 1750; index += 1) {
    const x = hash2(index, 811.4) * WIDTH;
    const y = hash2(index, 947.2) * HEIGHT;
    const angle = hash2(index, 1019.8) * Math.PI * 2;
    const length = 4 + hash2(index, 1201.5) * 15;
    const radius = 0.55 + hash2(index, 1307.8) * 0.85;
    const strength = 0.008 + hash2(index, 1451.6) * 0.018;
    const bend = 0.085 + hash2(index, 1603.2) * 0.18;
    const side = hash2(index, 1733.6) > 0.5 ? 1 : -1;
    const normalX = Math.cos(angle + Math.PI * 0.5) * radius * 0.8 * side;
    const normalY = Math.sin(angle + Math.PI * 0.5) * radius * 0.8 * side;
    stroke(
      values,
      x + normalX,
      y + normalY,
      angle,
      length,
      radius,
      strength,
      bend,
    );
    stroke(
      values,
      x - normalX,
      y - normalY,
      angle,
      length,
      radius * 0.86,
      -strength * 0.56,
      bend,
    );
  }

  for (let index = 0; index < 8200; index += 1) {
    pore(
      values,
      hash2(index, 201.1) * WIDTH,
      hash2(index, 307.7) * HEIGHT,
      0.45 + hash2(index, 401.3) * 1.45,
      0.006 + hash2(index, 503.9) * 0.026,
    );
  }

  for (let index = 0; index < 11000; index += 1) {
    stamp(
      values,
      hash2(index, 607.1) * WIDTH,
      hash2(index, 709.3) * HEIGHT,
      0.34 + hash2(index, 811.9) * 0.95,
      (hash2(index, 919.4) - 0.5) * 0.02,
    );
  }

  return normalizeHeightValues(values, 0.195);
}

function createPaperHeightMap() {
  const values = new Float32Array(WIDTH * HEIGHT);

  for (let y = 0; y < HEIGHT; y += 1) {
    for (let x = 0; x < WIDTH; x += 1) {
      const nx = x / WIDTH;
      const ny = y / HEIGHT;
      const broad = fbm2(nx * 4.1 + 2.7, ny * 4.8 - 1.3) - 0.5;
      const pulp = fbm2(nx * 23 + 7.2, ny * 27 + 9.1) - 0.5;
      const floc = fbm2(nx * 61 - 5.8, ny * 67 + 11.6) - 0.5;
      const tooth = valueNoise(nx * 156 + 17.3, ny * 168 - 8.4) - 0.5;
      const dust = hash2(x + 31.7, y - 19.4) - 0.5;
      values[y * WIDTH + x] = 0.5 + broad * 0.018 + pulp * 0.026 +
        floc * 0.018 + tooth * 0.009 + dust * 0.005;
    }
  }

  for (let index = 0; index < 48000; index += 1) {
    const x = hash2(index, 2101.7) * WIDTH;
    const y = hash2(index, 2203.1) * HEIGHT;
    const angle = hash2(index, 2309.4) * Math.PI * 2;
    const length = 9 + hash2(index, 2411.8) * 42;
    const radius = 0.44 + hash2(index, 2521.2) * 0.88;
    const sign = hash2(index, 2633.9) > 0.30 ? 1 : -0.38;
    const strength = (0.004 + hash2(index, 2741.6) * 0.014) * sign;
    stroke(
      values,
      x,
      y,
      angle,
      length,
      radius,
      strength,
      0.08 + hash2(index, 2851.3) * 0.24,
    );
  }

  for (let index = 0; index < 8200; index += 1) {
    const angle = hash2(index, 2917.5) * Math.PI * 2;
    stroke(
      values,
      hash2(index, 3001.4) * WIDTH,
      hash2(index, 3109.8) * HEIGHT,
      angle,
      24 + hash2(index, 3203.7) * 72,
      0.72 + hash2(index, 3307.1) * 1.10,
      0.003 + hash2(index, 3413.9) * 0.010,
      0.05 + hash2(index, 3511.4) * 0.16,
    );
  }

  return normalizeHeightValues(values, 0.108);
}

function createStoneHeightMap() {
  // intent why-not: DEC-006 (Site/first-view-light-shader) — rimmed pits read as independent objects before they read as surface relief.
  const values = new Float32Array(WIDTH * HEIGHT);

  for (let y = 0; y < HEIGHT; y += 1) {
    for (let x = 0; x < WIDTH; x += 1) {
      const nx = x / WIDTH;
      const ny = y / HEIGHT;
      const warpX = (fbm2(nx * 4.2 + 8.1, ny * 4.5 - 3.4) - 0.5) * 0.045;
      const warpY = (fbm2(nx * 4.7 - 1.6, ny * 4.1 + 6.2) - 0.5) * 0.045;
      const mx = nx + warpX;
      const my = ny + warpY;
      const fracturedPlane = valueNoise(
        mx * 13 + my * 2,
        my * 17 - mx * 1.5,
      );
      const sediment = fbm2(mx * 7 + 2.8, my * 10 - 4.1) - 0.5;
      const aggregate = fbm2(mx * 39 - 7.3, my * 46 + 13.7) - 0.5;
      const mineral = valueNoise(mx * 118 + 17.4, my * 132 - 9.8);
      const quartz = Math.max(0, mineral - 0.62) ** 1.35;
      const grit = hash2(x - 4.7, y + 9.3) - 0.5;
      values[y * WIDTH + x] = 0.5 +
        (fracturedPlane - 0.5) * 0.062 +
        sediment * 0.050 +
        aggregate * 0.060 +
        quartz * 0.055 +
        grit * 0.018;
    }
  }

  for (let index = 0; index < 5200; index += 1) {
    const sign = hash2(index, 4411.5) > 0.38 ? 1 : -0.48;
    ovalStamp(
      values,
      hash2(index, 4513.7) * WIDTH,
      hash2(index, 4621.4) * HEIGHT,
      2.4 + hash2(index, 4723.9) * 11.0,
      0.8 + hash2(index, 4831.6) * 3.8,
      hash2(index, 4933.2) * Math.PI * 2,
      sign * (0.006 + hash2(index, 5039.8) * 0.024),
    );
  }

  for (let index = 0; index < 680; index += 1) {
    stroke(
      values,
      hash2(index, 5147.3) * WIDTH,
      hash2(index, 5231.9) * HEIGHT,
      hash2(index, 5347.1) * Math.PI * 2,
      26 + hash2(index, 5441.8) * 132,
      0.44 + hash2(index, 5527.4) * 0.74,
      -(0.010 + hash2(index, 5639.6) * 0.025),
      0.035 + hash2(index, 5741.2) * 0.12,
    );
  }

  return normalizeHeightValues(values, 0.175);
}

function createSandHeightMap() {
  const values = new Float32Array(WIDTH * HEIGHT);

  for (let y = 0; y < HEIGHT; y += 1) {
    for (let x = 0; x < WIDTH; x += 1) {
      const nx = x / WIDTH;
      const ny = y / HEIGHT;
      const broad = fbm2(nx * 5.2 + 4.1, ny * 5.8 - 7.3) - 0.5;
      const packed = fbm2(nx * 38 + 9.4, ny * 43 + 2.8) - 0.5;
      const fine = fbm2(nx * 164 - 5.7, ny * 181 + 13.1) - 0.5;
      const grain = hash2(x + 79.1, y - 41.7) - 0.5;
      values[y * WIDTH + x] = 0.5 + broad * 0.012 + packed * 0.028 +
        fine * 0.026 + grain * 0.022;
    }
  }

  for (let index = 0; index < 92000; index += 1) {
    stamp(
      values,
      hash2(index, 6803.1) * WIDTH,
      hash2(index, 6911.7) * HEIGHT,
      0.55 + hash2(index, 7013.4) * 1.35,
      0.018 + hash2(index, 7121.8) * 0.060,
    );
  }

  return normalizeHeightValues(values, 0.168);
}

function createGravelHeightMap() {
  // intent why-not: DEC-006 (Site/first-view-light-shader) — dark-centered holes assert a repeated object shape instead of continuous relief.
  const values = new Float32Array(WIDTH * HEIGHT);

  for (let y = 0; y < HEIGHT; y += 1) {
    for (let x = 0; x < WIDTH; x += 1) {
      const nx = x / WIDTH;
      const ny = y / HEIGHT;
      const bed = fbm2(nx * 19 + 3.4, ny * 23 - 5.1) - 0.5;
      const grit = fbm2(nx * 83 - 7.2, ny * 91 + 12.6) - 0.5;
      values[y * WIDTH + x] = 0.42 + bed * 0.040 + grit * 0.025;
    }
  }

  for (let index = 0; index < 7200; index += 1) {
    pebbleStamp(
      values,
      hash2(index, 7307.4) * WIDTH,
      hash2(index, 7411.8) * HEIGHT,
      3.5 + hash2(index, 7523.1) * 11.5,
      2.8 + hash2(index, 7639.7) * 8.2,
      hash2(index, 7753.2) * Math.PI * 2,
      0.045 + hash2(index, 7841.9) * 0.105,
      index * 0.017 + 8.3,
    );
  }

  for (let index = 0; index < 820; index += 1) {
    pebbleStamp(
      values,
      hash2(index, 7951.6) * WIDTH,
      hash2(index, 8053.4) * HEIGHT,
      11 + hash2(index, 8167.8) * 24,
      8 + hash2(index, 8273.1) * 17,
      hash2(index, 8363.7) * Math.PI * 2,
      0.070 + hash2(index, 8461.5) * 0.130,
      index * 0.031 + 19.7,
    );
  }

  return normalizeHeightValues(values, 0.185);
}

function createClothHeightMap() {
  const values = new Float32Array(WIDTH * HEIGHT);
  const warpPitch = 12;
  const weftPitch = 14;

  for (let y = 0; y < HEIGHT; y += 1) {
    const rowDrift = (valueNoise(y * 0.012, 3.7) - 0.5) * 4.4;
    for (let x = 0; x < WIDTH; x += 1) {
      const columnDrift = (valueNoise(x * 0.010, 19.1) - 0.5) * 4.0;
      const wx = x + rowDrift;
      const wy = y + columnDrift;
      const warpCell = Math.floor(wx / warpPitch);
      const weftCell = Math.floor(wy / weftPitch);
      const warpDistance = Math.abs(
        ((wx % warpPitch) + warpPitch) % warpPitch - warpPitch * 0.5,
      ) / (warpPitch * 0.5);
      const weftDistance = Math.abs(
        ((wy % weftPitch) + weftPitch) % weftPitch - weftPitch * 0.5,
      ) / (weftPitch * 0.5);
      const warpThread = Math.exp(-warpDistance * warpDistance * 7.6);
      const weftThread = Math.exp(-weftDistance * weftDistance * 7.1);
      const warpOver = (warpCell + weftCell) % 2 === 0;
      const warpHeight = warpThread * (warpOver ? 0.118 : 0.043);
      const weftHeight = weftThread * (warpOver ? 0.043 : 0.112);
      const threadTwist =
        Math.sin(y * 0.47 + warpCell * 1.7) * warpThread * 0.010 +
        Math.sin(x * 0.43 - weftCell * 1.3) * weftThread * 0.009;
      const slub = (fbm2(x * 0.018 + 4.2, y * 0.020 - 6.1) - 0.5) * 0.025;
      const fuzz = (hash2(x + 51.1, y - 27.8) - 0.5) * 0.010;
      values[y * WIDTH + x] = 0.43 + warpHeight + weftHeight + threadTwist +
        slub + fuzz;
    }
  }

  for (let index = 0; index < 7200; index += 1) {
    const alongWarp = hash2(index, 5903.4) > 0.5;
    const baseAngle = alongWarp ? Math.PI * 0.5 : 0;
    stroke(
      values,
      hash2(index, 6011.9) * WIDTH,
      hash2(index, 6121.6) * HEIGHT,
      baseAngle + (hash2(index, 6229.3) - 0.5) * 0.18,
      3 + hash2(index, 6337.8) * 12,
      0.26 + hash2(index, 6421.5) * 0.46,
      0.008 + hash2(index, 6529.1) * 0.020,
      0.03 + hash2(index, 6637.4) * 0.08,
    );
  }

  return normalizeHeightValues(values, 0.165);
}

function clamp(value, minimum, maximum) {
  return Math.max(minimum, Math.min(maximum, value));
}

function positiveModulo(value, divisor) {
  return ((value % divisor) + divisor) % divisor;
}

function boxBlurWrapped(source, radius) {
  const windowSize = radius * 2 + 1;
  const horizontal = new Float32Array(source.length);
  const output = new Float32Array(source.length);

  for (let y = 0; y < HEIGHT; y += 1) {
    const rowOffset = y * WIDTH;
    let sum = 0;
    for (let sample = -radius; sample <= radius; sample += 1) {
      sum += source[rowOffset + positiveModulo(sample, WIDTH)];
    }
    for (let x = 0; x < WIDTH; x += 1) {
      horizontal[rowOffset + x] = sum / windowSize;
      sum -= source[rowOffset + positiveModulo(x - radius, WIDTH)];
      sum += source[
        rowOffset + positiveModulo(x + radius + 1, WIDTH)
      ];
    }
  }

  for (let x = 0; x < WIDTH; x += 1) {
    let sum = 0;
    for (let sample = -radius; sample <= radius; sample += 1) {
      sum += horizontal[positiveModulo(sample, HEIGHT) * WIDTH + x];
    }
    for (let y = 0; y < HEIGHT; y += 1) {
      output[y * WIDTH + x] = sum / windowSize;
      sum -= horizontal[positiveModulo(y - radius, HEIGHT) * WIDTH + x];
      sum += horizontal[
        positiveModulo(y + radius + 1, HEIGHT) * WIDTH + x
      ];
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

  for (let y = 0; y < HEIGHT; y += 1) {
    const sourceY = y * gridHeight / HEIGHT;
    const y0 = Math.floor(sourceY);
    const y1 = (y0 + 1) % gridHeight;
    const ty = quintic(sourceY - y0);
    const rowOffset = y * WIDTH;
    for (let x = 0; x < WIDTH; x += 1) {
      const sourceX = x * gridWidth / WIDTH;
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

function createIsotropicCarrier() {
  const carrier = new Float32Array(WIDTH * HEIGHT);
  addTileableValueNoise(carrier, 8, 16, 0.15, 1709);
  addTileableValueNoise(carrier, 16, 32, 0.15, 3253);
  addTileableValueNoise(carrier, 32, 64, 0.15, 7919);
  addTileableValueNoise(carrier, 64, 128, 0.14, 12547);
  addTileableValueNoise(carrier, 128, 256, 0.13, 17389);
  addTileableValueNoise(carrier, 256, 512, 0.11, 23063);
  addTileableValueNoise(carrier, 512, 1024, 0.10, 30187);
  addTileableValueNoise(carrier, 1024, 2048, 0.07, 37813);
  return carrier;
}

function createMicrostructureCarrier() {
  const length = WIDTH * HEIGHT;
  const density = new Float32Array(length);
  const broadRidges = new Float32Array(length);
  const fineRidges = new Float32Array(length);
  const granules = new Float32Array(length);
  const output = new Float32Array(length);

  addTileableValueNoise(density, 10, 20, 0.68, 70423);
  addTileableValueNoise(density, 28, 56, 0.32, 81173);
  addTileableValueNoise(broadRidges, 256, 512, 1.0, 92821);
  addTileableValueNoise(fineRidges, 512, 1024, 1.0, 104729);
  addTileableValueNoise(granules, 1024, 2048, 1.0, 116731);

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

function createMicrostructureBaseline() {
  // intent: DEC-007 (Site/first-view-light-shader) — canonical generation stays independent of temporary comparison assets.
  const cloth = createClothHeightMap();
  const paper = createPaperHeightMap();
  const sand = createSandHeightMap();
  const clothLow = boxBlurWrapped(cloth, 18);
  const sandFineCut = boxBlurWrapped(sand, 2);
  const sandBroadCut = boxBlurWrapped(sand, 18);
  const paperLowCut = boxBlurWrapped(paper, 1);
  const isotropicCarrier = createIsotropicCarrier();
  const microstructure = createMicrostructureCarrier();
  const clothLowStats = signalStats(cloth.length, (index) => clothLow[index]);
  const carrierStats = signalStats(
    cloth.length,
    (index) => isotropicCarrier[index],
  );
  const clothSignal = (index) =>
    ((clothLow[index] - clothLowStats.mean) / clothLowStats.rms) * 0.6 +
    ((isotropicCarrier[index] - carrierStats.mean) / carrierStats.rms) * 0.4;
  const sandSignal = (index) => sandFineCut[index] - sandBroadCut[index];
  const paperSignal = (index) => paper[index] - paperLowCut[index];
  const clothStats = signalStats(cloth.length, clothSignal);
  const paperStats = signalStats(paper.length, paperSignal);
  const sandStats = signalStats(sand.length, sandSignal);
  const microstructureStats = signalStats(
    microstructure.length,
    (index) => microstructure[index],
  );

  const mixedSignal = (index) =>
    ((clothSignal(index) - clothStats.mean) / clothStats.rms) *
      BASELINE_BLEND_WEIGHTS.cloth +
    ((paperSignal(index) - paperStats.mean) / paperStats.rms) *
      BASELINE_BLEND_WEIGHTS.paper +
    ((sandSignal(index) - sandStats.mean) / sandStats.rms) *
      BASELINE_BLEND_WEIGHTS.sand +
    ((microstructure[index] - microstructureStats.mean) /
        microstructureStats.rms) *
      MICROSTRUCTURE_WEIGHT;
  const mixedStats = signalStats(cloth.length, mixedSignal);
  const spreadScale = BASELINE_SPREAD / mixedStats.rms;
  const output = Buffer.alloc(cloth.length);

  for (let index = 0; index < output.length; index += 1) {
    const normalized = 0.5 +
      (mixedSignal(index) - mixedStats.mean) * spreadScale;
    output[index] = Math.round(clamp(normalized, 0, 1) * 255);
  }

  return output;
}

function createHeightMap(material) {
  // AC-018 / AC-019: material trials isolate height geometry while production keeps the selected baseline.
  switch (material) {
    case "paper":
      return createPaperHeightMap();
    case "stone":
      return createStoneHeightMap();
    case "cloth":
      return createClothHeightMap();
    case "sand":
      return createSandHeightMap();
    case "gravel":
      return createGravelHeightMap();
    default:
      return createMicrostructureBaseline();
  }
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

function encodePng(pixels) {
  const header = Buffer.alloc(13);
  header.writeUInt32BE(WIDTH, 0);
  header.writeUInt32BE(HEIGHT, 4);
  header[8] = 8;
  header[9] = 0;

  const scanlines = Buffer.alloc((WIDTH + 1) * HEIGHT);
  for (let y = 0; y < HEIGHT; y += 1) {
    const rowOffset = y * (WIDTH + 1);
    scanlines[rowOffset] = 0;
    pixels.copy(scanlines, rowOffset + 1, y * WIDTH, (y + 1) * WIDTH);
  }

  return Buffer.concat([
    Buffer.from([137, 80, 78, 71, 13, 10, 26, 10]),
    chunk("IHDR", header),
    chunk("IDAT", deflateSync(scanlines, { level: 9 })),
    chunk("IEND", Buffer.alloc(0)),
  ]);
}

const isCanonicalDefault = MATERIAL === "baseline" &&
  WIDTH === 3072 && HEIGHT === 6144 && OUTPUT_PATH === DEFAULT_OUTPUT_PATH;
const forceGeneration = process.argv.includes("--force");

if (isCanonicalDefault && existsSync(OUTPUT_PATH) && !forceGeneration) {
  const current = readFileSync(OUTPUT_PATH);
  const currentHash = createHash("sha256").update(current).digest("hex");
  if (currentHash !== CANONICAL_SHA256) {
    throw new Error(
      `Canonical height map hash mismatch: ${currentHash}. Run with --force after reviewing the generator change.`,
    );
  }
  console.log(
    `Canonical height map is current (${WIDTH}x${HEIGHT}, ${current.length} bytes)`,
  );
} else {
  const png = encodePng(createHeightMap(MATERIAL));
  mkdirSync(dirname(OUTPUT_PATH), { recursive: true });
  if (!existsSync(OUTPUT_PATH) || !readFileSync(OUTPUT_PATH).equals(png)) {
    writeFileSync(OUTPUT_PATH, png);
    console.log(`Generated ${MATERIAL}: ${OUTPUT_PATH} (${png.length} bytes)`);
  } else {
    console.log(`Height map is current for ${MATERIAL} (${png.length} bytes)`);
  }
}
