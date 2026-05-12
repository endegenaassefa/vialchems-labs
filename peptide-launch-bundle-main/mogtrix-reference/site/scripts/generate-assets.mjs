import { writeFileSync } from "node:fs";
import { join } from "node:path";
import { deflateSync } from "node:zlib";

const outDir = new URL("../public/visuals/", import.meta.url);

const crcTable = new Uint32Array(256);
for (let n = 0; n < 256; n += 1) {
  let c = n;
  for (let k = 0; k < 8; k += 1) {
    c = c & 1 ? 0xedb88320 ^ (c >>> 1) : c >>> 1;
  }
  crcTable[n] = c >>> 0;
}

function crc32(buffer) {
  let c = 0xffffffff;
  for (const byte of buffer) {
    c = crcTable[(c ^ byte) & 0xff] ^ (c >>> 8);
  }
  return (c ^ 0xffffffff) >>> 0;
}

function chunk(type, data) {
  const typeBuffer = Buffer.from(type);
  const length = Buffer.alloc(4);
  const crc = Buffer.alloc(4);
  length.writeUInt32BE(data.length);
  crc.writeUInt32BE(crc32(Buffer.concat([typeBuffer, data])));
  return Buffer.concat([length, typeBuffer, data, crc]);
}

function png(width, height, draw) {
  const raw = Buffer.alloc((width * 4 + 1) * height);

  for (let y = 0; y < height; y += 1) {
    const rowStart = y * (width * 4 + 1);
    raw[rowStart] = 0;

    for (let x = 0; x < width; x += 1) {
      const offset = rowStart + 1 + x * 4;
      const [r, g, b, a] = draw(x, y, width, height);
      raw[offset] = r;
      raw[offset + 1] = g;
      raw[offset + 2] = b;
      raw[offset + 3] = a;
    }
  }

  const header = Buffer.alloc(13);
  header.writeUInt32BE(width, 0);
  header.writeUInt32BE(height, 4);
  header[8] = 8;
  header[9] = 6;
  header[10] = 0;
  header[11] = 0;
  header[12] = 0;

  return Buffer.concat([
    Buffer.from([0x89, 0x50, 0x4e, 0x47, 0x0d, 0x0a, 0x1a, 0x0a]),
    chunk("IHDR", header),
    chunk("IDAT", deflateSync(raw, { level: 9 })),
    chunk("IEND", Buffer.alloc(0))
  ]);
}

function noise(x, y, seed) {
  const value = Math.sin(x * 12.9898 + y * 78.233 + seed * 37.719) * 43758.5453;
  return value - Math.floor(value);
}

function clamp(value) {
  return Math.max(0, Math.min(255, Math.round(value)));
}

function gridGlow(x, y, width, height, seed) {
  const nx = x / width;
  const ny = y / height;
  const grid =
    (x % 72 < 1 || y % 72 < 1 ? 18 : 0) +
    (x % 216 < 2 || y % 216 < 2 ? 14 : 0);
  const sweep = Math.max(0, 1 - Math.abs(nx - 0.68) * 3) * Math.max(0, 1 - ny);
  const vialBand = Math.max(0, 1 - Math.abs(nx - 0.72) * 18) * Math.max(0, 1 - Math.abs(ny - 0.52) * 2.4);
  const panel = nx > 0.52 && nx < 0.9 && ny > 0.19 && ny < 0.84 ? 22 : 0;
  const texture = noise(x, y, seed) * 12;
  return { grid, sweep, vialBand, panel, texture };
}

function heroPixel(x, y, width, height) {
  const nx = x / width;
  const ny = y / height;
  const { grid, sweep, vialBand, panel, texture } = gridGlow(x, y, width, height, 4);
  const diagonal = Math.max(0, 1 - Math.abs(nx + ny - 1.08) * 2.2) * 42;
  const base = 8 + ny * 18 + texture;
  return [
    clamp(base + grid + panel + diagonal * 0.25),
    clamp(base + 24 + grid + sweep * 62 + vialBand * 70 + diagonal * 0.4),
    clamp(base + 30 + grid + sweep * 78 + vialBand * 96 + diagonal),
    255
  ];
}

function categoryPixel(seed, accent, mode) {
  return (x, y, width, height) => {
    const nx = x / width;
    const ny = y / height;
    const grid = x % 54 < 1 || y % 54 < 1 ? 16 : 0;
    const card = nx > 0.13 && nx < 0.87 && ny > 0.16 && ny < 0.82 ? 18 : 0;
    const line = Math.max(0, 1 - Math.abs(ny - 0.36) * 18) * 24;
    let instrument = 0;

    if (mode === "reference") {
      const wellX = Math.abs(((x + 24) % 120) - 60);
      const wellY = Math.abs(((y + 12) % 92) - 46);
      instrument =
        wellX < 17 &&
        wellY < 17 &&
        nx > 0.18 &&
        nx < 0.82 &&
        ny > 0.22 &&
        ny < 0.74
          ? 58
          : 0;
    }

    if (mode === "control") {
      const wave = Math.sin(nx * 34 + seed) * 0.055 + 0.48;
      instrument = Math.max(0, 1 - Math.abs(ny - wave) * 38) * 62;
      instrument += nx > 0.2 && nx < 0.8 && ny > 0.62 && ny < 0.66 ? 36 : 0;
    }

    if (mode === "records") {
      const sheetA = nx > 0.22 && nx < 0.66 && ny > 0.22 && ny < 0.7 ? 38 : 0;
      const sheetB = nx > 0.33 && nx < 0.78 && ny > 0.3 && ny < 0.78 ? 46 : 0;
      const rowLines =
        y % 34 < 2 && nx > 0.4 && nx < 0.72 && ny > 0.38 && ny < 0.66 ? 28 : 0;
      instrument = sheetA + sheetB + rowLines;
    }

    const texture = noise(x, y, seed) * 10;
    const glow = Math.max(0, 1 - Math.hypot(nx - 0.72, ny - 0.34) * 2.2) * 74;
    return [
      clamp(9 + card + grid + texture + accent[0] * glow),
      clamp(16 + card + grid + texture + line + instrument + accent[1] * glow),
      clamp(20 + card + grid + texture + line + instrument + accent[2] * glow),
      255
    ];
  };
}

const assets = [
  ["hero-lab.png", 1400, 900, heroPixel],
  [
    "category-reference-v2.png",
    900,
    540,
    categoryPixel(7, [0.1, 0.75, 0.95], "reference")
  ],
  [
    "category-control-v2.png",
    900,
    540,
    categoryPixel(11, [0.65, 0.85, 0.35], "control")
  ],
  [
    "category-records-v2.png",
    900,
    540,
    categoryPixel(19, [0.9, 0.65, 0.2], "records")
  ]
];

for (const [name, width, height, draw] of assets) {
  writeFileSync(join(outDir.pathname, name), png(width, height, draw));
  console.log(`generated ${name}`);
}
