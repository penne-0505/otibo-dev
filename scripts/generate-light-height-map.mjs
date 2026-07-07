import { deflateSync } from "node:zlib";
import { existsSync, mkdirSync, readFileSync, writeFileSync } from "node:fs";
import { dirname, resolve } from "node:path";
import { fileURLToPath } from "node:url";

// intent: INV-006 (Site/first-view-light-shader) — generate relief at build time, never during initial paint.
// The prototype used 1024x2048. Half resolution preserves the shader's macro relief while
// avoiding a 2 MB above-the-fold asset; the runtime never synthesizes this texture.
const WIDTH = 512;
const HEIGHT = 1024;
const OUTPUT_PATH = resolve(
  dirname(fileURLToPath(import.meta.url)),
  "../public/first-view/light-height-map.png",
);

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

function createHeightMap() {
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

  let mean = 0;
  for (const value of values) mean += value;
  mean /= values.length;

  let variance = 0;
  for (const value of values) variance += (value - mean) ** 2;
  const scale = 0.195 / Math.max(0.0001, Math.sqrt(variance / values.length));
  const pixels = Buffer.alloc(values.length);

  for (let index = 0; index < values.length; index += 1) {
    const compressed = 0.5 + (values[index] - mean) * scale;
    pixels[index] = Math.round(Math.min(1, Math.max(0, compressed)) * 255);
  }

  return pixels;
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

const png = encodePng(createHeightMap());
mkdirSync(dirname(OUTPUT_PATH), { recursive: true });

if (!existsSync(OUTPUT_PATH) || !readFileSync(OUTPUT_PATH).equals(png)) {
  writeFileSync(OUTPUT_PATH, png);
  console.log(`Generated ${OUTPUT_PATH} (${png.length} bytes)`);
} else {
  console.log(`Height map is current (${png.length} bytes)`);
}
