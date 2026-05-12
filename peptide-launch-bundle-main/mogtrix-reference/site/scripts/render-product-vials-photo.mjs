import { mkdir, readdir, stat, writeFile } from "node:fs/promises";
import path from "node:path";
import { fileURLToPath } from "node:url";

import sharp from "sharp";

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const productsFile = path.join(root, "lib", "content", "products.ts");
const vialSource = path.join(
  root,
  "assets",
  "source",
  "mogtrix",
  "vial-three-up-source.png"
);
const labelSource = path.join(
  root,
  "assets",
  "source",
  "mogtrix",
  "label-tirzepatide-source.png"
);
const outDir = path.join(
  root,
  "public",
  "visuals",
  "products",
  "mogtrix-vials-photo-v1"
);

const outputWidth = 1200;
const outputHeight = 1600;
const lime = "#97c90f";

function parseArgs() {
  const onlyIndex = process.argv.indexOf("--only");
  return {
    only:
      onlyIndex === -1 || onlyIndex === process.argv.length - 1
        ? ""
        : process.argv[onlyIndex + 1]
  };
}

async function extractProducts() {
  const text = await import("node:fs/promises").then((fs) =>
    fs.readFile(productsFile, "utf8")
  );
  const products = [];

  for (const block of text.matchAll(/\{\s*slug:\s*"[^"]+".*?\n\s*\}/gs)) {
    const slug = block[0].match(/slug:\s*"([^"]+)"/);
    const name = block[0].match(/name:\s*"([^"]+)"/);
    const vialSize = block[0].match(/vialSize:\s*"([^"]+)"/);
    if (slug && name && vialSize) {
      products.push({
        slug: slug[1],
        name: name[1],
        vialSize: vialSize[1]
      });
    }
  }

  return products;
}

function escapeSvg(text) {
  return text
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;");
}

function normalizeDose(vialSize) {
  return vialSize
    .replace(/\bmg\b/gi, "MG")
    .replace(/\s*\/\s*/g, " / ")
    .toUpperCase();
}

function stripDose(name, vialSize) {
  const escaped = vialSize.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
  return name
    .replace(new RegExp(`\\s+${escaped}$`, "i"), "")
    .replace(/\s+\d+(?:mg)(?:\s*\/\s*\d+mg)?$/i, "")
    .trim();
}

function labelLines(productName) {
  const name = productName.toUpperCase();
  if (name.length <= 18) return [name];

  if (name.includes("+")) {
    return name
      .split(/\s*\+\s*/)
      .map((part, index, parts) => (index < parts.length - 1 ? `${part} +` : part))
      .slice(0, 3);
  }

  const words = name.split(/\s+/);
  const lines = [];
  let current = "";
  for (const word of words) {
    const next = current ? `${current} ${word}` : word;
    if (next.length > 18 && current) {
      lines.push(current);
      current = word;
    } else {
      current = next;
    }
  }
  if (current) lines.push(current);
  return lines.slice(0, 3);
}

async function makeVialCutout() {
  const image = sharp(vialSource)
    .extract({ left: 565, top: 90, width: 420, height: 800 })
    .ensureAlpha();
  const { data, info } = await image.raw().toBuffer({ resolveWithObject: true });

  for (let index = 0; index < data.length; index += 4) {
    const pixel = index / 4;
    const x = pixel % info.width;
    const y = Math.floor(pixel / info.width);
    const r = data[index];
    const g = data[index + 1];
    const b = data[index + 2];
    const max = Math.max(r, g, b);
    const min = Math.min(r, g, b);
    const average = (r + g + b) / 3;
    const saturation = max - min;

    let alpha = data[index + 3];
    if (average > 226 && saturation < 18) alpha = 0;
    if (y > 238 && average > 202 && saturation < 24) alpha = 0;
    if (y > 255 && x > 82 && x < 338 && average > 168 && saturation < 22) {
      alpha = 0;
    }
    if (y > 690 && average > 205 && saturation < 22) alpha = 0;

    data[index + 3] = alpha;
  }

  return sharp(data, { raw: info }).png().toBuffer();
}

async function makeLabel(product) {
  const base = await sharp(labelSource)
    .extract({ left: 30, top: 52, width: 1208, height: 805 })
    .resize({ width: 1160, height: 773, fit: "fill" })
    .toBuffer();
  const productName = stripDose(product.name, product.vialSize);
  const lines = labelLines(productName);
  const fontSize =
    lines.length === 1 ? (lines[0].length > 16 ? 76 : 92) : lines.length === 2 ? 56 : 48;
  const startY = lines.length === 1 ? 335 : lines.length === 2 ? 305 : 285;
  const gap = lines.length === 1 ? 0 : 62;
  const nameSvg = lines
    .map(
      (line, index) =>
        `<text x="580" y="${startY + index * gap}" text-anchor="middle" font-family="Arial Black, Impact, sans-serif" font-size="${fontSize}" font-weight="900" fill="#f4f4f0" letter-spacing="2">${escapeSvg(
          line
        )}</text>`
    )
    .join("");

  const overlay = `<svg width="1160" height="773" xmlns="http://www.w3.org/2000/svg">
    <rect x="245" y="245" width="700" height="145" fill="#050605" opacity=".97"/>
    <rect x="425" y="382" width="340" height="100" fill="#050605" opacity=".97"/>
    <rect x="325" y="500" width="560" height="120" fill="#050605" opacity=".97"/>
    ${nameSvg}
    <rect x="430" y="392" width="330" height="85" rx="7" fill="none" stroke="${lime}" stroke-width="5"/>
    <text x="595" y="456" text-anchor="middle" font-family="Arial Black, Impact, sans-serif" font-size="66" font-weight="900" fill="${lime}">${escapeSvg(
      normalizeDose(product.vialSize)
    )}</text>
    <text x="580" y="548" text-anchor="middle" font-family="Arial Narrow, Arial, sans-serif" font-size="50" font-weight="800" fill="#f4f4f0">RESEARCH USE ONLY</text>
    <text x="580" y="605" text-anchor="middle" font-family="Arial Narrow, Arial, sans-serif" font-size="42" font-weight="700" fill="#f4f4f0">NOT FOR HUMAN CONSUMPTION</text>
  </svg>`;

  return sharp(base)
    .composite([{ input: Buffer.from(overlay), left: 0, top: 0 }])
    .png()
    .toBuffer();
}

async function renderProduct(product, vialCutout) {
  const label = await makeLabel(product);
  const vialHeight = 1450;
  const vialWidth = Math.round((420 / 800) * vialHeight);
  const vialLeft = Math.round((outputWidth - vialWidth) / 2);
  const vialTop = 70;
  const labelWidth = Math.round(vialWidth * 0.69);
  const labelHeight = Math.round((labelWidth * 773) / 1160);
  const labelLeft = vialLeft + Math.round(vialWidth * 0.155);
  const labelTop = vialTop + Math.round(vialHeight * 0.435);

  const labelLayer = await sharp(label)
    .resize({ width: labelWidth, height: labelHeight, fit: "fill" })
    .png()
    .toBuffer();
  const vialLayer = await sharp(vialCutout).resize({ height: vialHeight }).png().toBuffer();

  const png = await sharp({
    create: {
      width: outputWidth,
      height: outputHeight,
      channels: 4,
      background: { r: 0, g: 0, b: 0, alpha: 0 }
    }
  })
    .composite([
      { input: labelLayer, left: labelLeft, top: labelTop },
      { input: vialLayer, left: vialLeft, top: vialTop }
    ])
    .png({
      compressionLevel: 9,
      effort: 10,
      palette: true,
      quality: 92
    })
    .toBuffer();

  const outPath = path.join(outDir, `${product.slug}.png`);
  await writeFile(outPath, png);
  const { size } = await stat(outPath);
  console.log(`${product.slug}.png ${(size / 1024).toFixed(0)}KB`);
}

async function main() {
  const { only } = parseArgs();
  await mkdir(outDir, { recursive: true });
  let products = await extractProducts();
  if (only) products = products.filter((product) => product.slug === only);
  if (!products.length) throw new Error(`No products found${only ? ` for ${only}` : ""}.`);

  const vialCutout = await makeVialCutout();
  for (const product of products) {
    await renderProduct(product, vialCutout);
  }

  const rendered = (await readdir(outDir)).filter((file) => file.endsWith(".png"));
  console.log(`Rendered ${rendered.length} photo-based vial PNGs.`);
}

main().catch((error) => {
  console.error(error);
  process.exit(1);
});
