import { readdir, stat, writeFile } from "node:fs/promises";
import path from "node:path";
import { fileURLToPath } from "node:url";

import sharp from "sharp";

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const renderDir = path.join(
  root,
  "public",
  "visuals",
  "products",
  "mogtrix-vials-v2"
);

function parseArgs() {
  const onlyIndex = process.argv.indexOf("--only");
  return {
    only:
      onlyIndex === -1 || onlyIndex === process.argv.length - 1
        ? ""
        : process.argv[onlyIndex + 1]
  };
}

async function main() {
  const { only } = parseArgs();
  const files = (await readdir(renderDir))
    .filter((file) => file.endsWith(".png"))
    .filter((file) => !only || file === `${only}.png`);

  if (!files.length) {
    throw new Error(`No product render PNGs found${only ? ` for ${only}` : ""}.`);
  }

  for (const file of files) {
    const filePath = path.join(renderDir, file);
    const optimized = await sharp(filePath)
      .png({
        compressionLevel: 9,
        effort: 10,
        palette: true,
        quality: 92
      })
      .toBuffer();

    await writeFile(filePath, optimized);
    const { size } = await stat(filePath);
    console.log(`${file} ${(size / 1024).toFixed(0)}KB`);
  }
}

main().catch((error) => {
  console.error(error);
  process.exit(1);
});
