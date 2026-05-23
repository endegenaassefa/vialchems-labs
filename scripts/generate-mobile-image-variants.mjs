#!/usr/bin/env node
/**
 * M0i — Generate responsive image variants for the product-shots
 * catalog (Section 6 super-prompt 2026-05-22).
 *
 * Reads every PNG in `public/product-shots/` and emits 256/384/512/768
 * width variants into `public/product-shots/responsive/<slug>-<width>.png`,
 * preserving the square aspect ratio of the 1024x1024 source files.
 *
 * Why pre-generated variants instead of next/image runtime optimization:
 *   - The pages that render this catalog (Home, Catalog, ProductPage)
 *     are SSR-friendly and the optimizer is on the network path; on a
 *     paid-ad mobile click the first-paint cost matters more than
 *     a runtime-flexible transform.
 *   - Variants are static assets served straight from /public — no
 *     edge-function quota burn, no cold-start hit on the first viewer.
 *
 * Usage:
 *   node scripts/generate-mobile-image-variants.mjs           # all PNGs
 *   node scripts/generate-mobile-image-variants.mjs <slug>    # one slug
 *
 * Idempotent — re-running overwrites the existing variants.
 */
import { mkdir, readdir, stat } from "node:fs/promises";
import { join, basename, extname } from "node:path";
import { existsSync } from "node:fs";
import sharp from "sharp";

const SOURCE_DIR = "public/product-shots";
const OUTPUT_DIR = "public/product-shots/responsive";
const VARIANT_WIDTHS = [256, 384, 512, 768];

async function ensureDir(dir) {
  if (!existsSync(dir)) {
    await mkdir(dir, { recursive: true });
  }
}

async function generateVariantsForFile(sourcePath) {
  const file = basename(sourcePath);
  const slug = file.replace(extname(file), "");
  const sizes = [];
  for (const width of VARIANT_WIDTHS) {
    const outPath = join(OUTPUT_DIR, `${slug}-${width}.png`);
    await sharp(sourcePath)
      .resize({ width, withoutEnlargement: true, fit: "inside" })
      .png({ compressionLevel: 9, adaptiveFiltering: true })
      .toFile(outPath);
    const { size } = await stat(outPath);
    sizes.push({ width, bytes: size });
  }
  return { slug, sizes };
}

async function main() {
  await ensureDir(OUTPUT_DIR);

  const filter = process.argv[2];
  const all = await readdir(SOURCE_DIR);
  const targets = all
    .filter((f) => f.endsWith(".png"))
    .filter((f) => (filter ? f.replace(/\.png$/, "") === filter : true));

  if (targets.length === 0) {
    console.error(`no PNGs matched ${filter ?? "*"} in ${SOURCE_DIR}/`);
    process.exit(1);
  }

  console.log(
    `Generating ${VARIANT_WIDTHS.join("/")} variants for ${targets.length} file(s)...`,
  );
  let totalBytes = 0;
  let totalVariants = 0;
  for (const file of targets) {
    const sourcePath = join(SOURCE_DIR, file);
    const { slug, sizes } = await generateVariantsForFile(sourcePath);
    const bytes = sizes.reduce((sum, s) => sum + s.bytes, 0);
    totalBytes += bytes;
    totalVariants += sizes.length;
    const parts = sizes
      .map((s) => `${s.width}w=${Math.round(s.bytes / 1024)}KB`)
      .join("  ");
    console.log(`  ${slug.padEnd(36)} ${parts}`);
  }
  console.log(
    `\nWrote ${totalVariants} variants (${Math.round(totalBytes / 1024)} KB total) to ${OUTPUT_DIR}/`,
  );
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
