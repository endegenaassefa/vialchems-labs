#!/usr/bin/env node
/**
 * Iron Law 2.42 — every catalog SKU has a placeholder COA on disk.
 *
 * Generates a 1-page A4 PDF for every product slug (and every bundle slug)
 * defined in `lib/content/products.ts`. Each PDF is clearly marked as a
 * placeholder so it cannot be mistaken for a real Certificate of Analysis:
 *
 *   - red header banner: "EXAMPLE COA — REPLACE BEFORE LAUNCH"
 *   - red footer banner with the same warning
 *   - diagonal "PLACEHOLDER" watermark across the page body
 *   - every data field tagged "(PLACEHOLDER)"
 *   - file path: public/coa/<slug>-BATCH-2026-PLACEHOLDER.pdf
 *
 * Iron Law 2.10: no false credibility. Iron Law 2.42: no /coa/<slug>/<batch>
 * route may 404 for a published catalog SKU; ship a clearly-marked placeholder
 * until the real lab-issued PDF replaces it.
 *
 * Run:  npm run generate:coa-placeholders
 */

import { PDFDocument, rgb, StandardFonts, degrees } from "pdf-lib";
import fs from "node:fs/promises";
import path from "node:path";
import { fileURLToPath } from "node:url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const REPO_ROOT = path.resolve(__dirname, "..");
const PRODUCTS_FILE = path.join(REPO_ROOT, "lib", "content", "products.ts");
const OUT_DIR = path.join(REPO_ROOT, "public", "coa");
const BATCH_TOKEN = "BATCH-2026-PLACEHOLDER";

/**
 * pdf-lib runs in plain Node, so we cannot `import` a .ts module. Instead we
 * parse `lib/content/products.ts` as text and pull every `slug: "..."` from
 * the two array literals (`products` and `bundles`). The Product/Bundle
 * `interface` declarations at the top of the file also contain `slug: string`
 * — we filter those out because they are followed by `string` (the type),
 * not a string literal.
 *
 * Returns: [{ slug, shortName | null, kind: "product" | "bundle" }, ...]
 */
async function readSkuEntries() {
  const file = await fs.readFile(PRODUCTS_FILE, "utf8");

  // Find the array bounds so we know whether each slug is a product or bundle.
  const productsStart = file.indexOf("export const products: Product[]");
  const bundlesStart = file.indexOf("export const bundles: Bundle[]");
  if (productsStart < 0 || bundlesStart < 0) {
    throw new Error(
      `Could not locate products[] or bundles[] in ${PRODUCTS_FILE}`,
    );
  }
  // bundles[] terminates at the next top-level `export` declaration.
  const afterBundles = file.indexOf("\nexport ", bundlesStart + 1);
  const bundlesEnd = afterBundles > 0 ? afterBundles : file.length;

  // Capture each `slug: "..."` together with the optional sibling `shortName: "..."`.
  // pdf-lib's standard Helvetica supports only WinAnsi/Latin-1, so we keep
  // shortName plain ASCII when we render it.
  const slugRe = /slug:\s*["']([a-z0-9-]+)["']/g;
  const shortNameRe = /shortName:\s*["']([^"']+)["']/;

  const entries = [];
  let m;
  while ((m = slugRe.exec(file)) !== null) {
    const slug = m[1];
    const offset = m.index;

    // The two `interface` declarations have `slug: string;` not `slug: "..."`,
    // so the regex (which requires quotes) already excludes them. Safe.

    let kind;
    if (offset >= productsStart && offset < bundlesStart) {
      kind = "product";
    } else if (offset >= bundlesStart && offset < bundlesEnd) {
      kind = "bundle";
    } else {
      // The publicLaunchProductSlugs array contains slugs without the `slug:`
      // key prefix, so the regex skips it. Anything outside both array bodies
      // is a stray match we ignore.
      continue;
    }

    // Look ahead ~400 chars for a sibling shortName inside the same object.
    const window = file.slice(offset, offset + 400);
    const shortMatch = window.match(shortNameRe);
    const shortName = shortMatch ? shortMatch[1] : null;

    entries.push({ slug, shortName, kind });
  }

  return entries;
}

/**
 * pdf-lib's built-in Helvetica/HelveticaBold are WinAnsi-only (Latin-1).
 * Greek letters ("α") and other extended unicode in shortName values (e.g.
 * "Thymosin-α1") will throw. We replace the handful of letters we know
 * appear in product names with safe ASCII spellings; anything else falls
 * back to ASCII transliteration.
 */
function asciiSafe(text) {
  if (!text) return text;
  return text
    .replace(/α/g, "alpha")
    .replace(/β/g, "beta")
    .replace(/γ/g, "gamma")
    .replace(/δ/g, "delta")
    .replace(/μ/g, "u") // micro -> u
    .replace(/–/g, "-") // en dash
    .replace(/—/g, "-") // em dash
    .replace(/[^\x00-\x7F]/g, "?"); // anything else still non-ASCII
}

/**
 * Builds a single-page A4 PDF with prominent placeholder markings.
 * Returns a Uint8Array of the PDF bytes.
 */
async function buildPlaceholderPdf(entry) {
  const { slug, shortName, kind } = entry;
  const safeShortName = asciiSafe(shortName);

  const pdf = await PDFDocument.create();
  pdf.setTitle(`EXAMPLE COA placeholder -- ${slug}`);
  pdf.setAuthor("Vialchems Labs (placeholder)");
  pdf.setSubject(
    "Iron Law 2.42 placeholder COA -- replace with real batch COA before launch.",
  );
  pdf.setKeywords(["placeholder", "example", "coa", "iron-law-2.42"]);

  const page = pdf.addPage([595, 842]); // A4 portrait
  const helvetica = await pdf.embedFont(StandardFonts.Helvetica);
  const helveticaBold = await pdf.embedFont(StandardFonts.HelveticaBold);

  const red = rgb(0.9, 0.1, 0.1);
  const white = rgb(1, 1, 1);
  const black = rgb(0, 0, 0);
  const gray = rgb(0.2, 0.2, 0.2);
  const dimGray = rgb(0.1, 0.1, 0.1);
  const lightGray = rgb(0.92, 0.92, 0.92);

  // --- Top banner (red) -----------------------------------------------------
  page.drawRectangle({
    x: 0,
    y: 792,
    width: 595,
    height: 50,
    color: red,
  });
  page.drawText("EXAMPLE COA -- REPLACE BEFORE LAUNCH", {
    x: 30,
    y: 810,
    size: 16,
    font: helveticaBold,
    color: white,
  });

  // --- Slug + name ----------------------------------------------------------
  const compoundLabel = safeShortName ?? slug;
  page.drawText(`Compound: ${compoundLabel}`, {
    x: 50,
    y: 750,
    size: 14,
    font: helveticaBold,
    color: black,
  });
  page.drawText(`Slug: ${slug}`, {
    x: 50,
    y: 730,
    size: 12,
    font: helvetica,
    color: gray,
  });
  page.drawText(`Catalog entry kind: ${kind}`, {
    x: 50,
    y: 712,
    size: 11,
    font: helvetica,
    color: gray,
  });

  // --- Diagonal PLACEHOLDER watermark (drawn behind the body fields).
  // pdf-lib paints later text on top, so we draw the watermark first then
  // overlay the fields. Both are on the same page, so the order of draw calls
  // determines z-order.
  page.drawText("PLACEHOLDER", {
    x: 60,
    y: 380,
    size: 96,
    font: helveticaBold,
    color: lightGray,
    rotate: degrees(-30),
  });

  // --- Body fields (placeholder values) -------------------------------------
  const fields = [
    ["Batch", `${BATCH_TOKEN}`],
    ["Manufactured", "2026-04-15 (PLACEHOLDER)"],
    ["Tested", "2026-04-22 (PLACEHOLDER)"],
    ["HPLC Purity", "99.1% (PLACEHOLDER)"],
    ["Endotoxin", "< 0.5 EU/mg (PLACEHOLDER)"],
    ["Lab", "Independent Lab (PLACEHOLDER)"],
    ["Method", "HPLC + USP <71> + LAL (PLACEHOLDER)"],
    ["Storage", "Lyophilized 2-8C sealed; reconstituted refrigerated"],
    [
      "Iron Law 2.42",
      "Placeholder COA -- replace with real batch COA before launch",
    ],
    ["Iron Law 2.10", "Do not present this file as a verified test record"],
  ];

  let y = 680;
  for (const [k, v] of fields) {
    page.drawText(`${k}:`, {
      x: 50,
      y,
      size: 12,
      font: helveticaBold,
      color: black,
    });
    page.drawText(v, {
      x: 200,
      y,
      size: 12,
      font: helvetica,
      color: dimGray,
    });
    y -= 28;
  }

  // --- Footer banner (red) --------------------------------------------------
  page.drawRectangle({
    x: 0,
    y: 0,
    width: 595,
    height: 30,
    color: red,
  });
  page.drawText("EXAMPLE COA -- REPLACE BEFORE LAUNCH", {
    x: 30,
    y: 10,
    size: 12,
    font: helveticaBold,
    color: white,
  });

  return pdf.save();
}

async function main() {
  await fs.mkdir(OUT_DIR, { recursive: true });

  const entries = await readSkuEntries();
  if (entries.length === 0) {
    throw new Error(
      `Parsed zero slugs from ${PRODUCTS_FILE}. Aborting; refusing to ship an empty COA dir.`,
    );
  }

  const summary = { products: 0, bundles: 0 };
  for (const e of entries) {
    summary[e.kind === "product" ? "products" : "bundles"] += 1;
  }
  console.log(
    `Generating COA placeholders: ${entries.length} entries (${summary.products} products, ${summary.bundles} bundles)...`,
  );

  for (const entry of entries) {
    const bytes = await buildPlaceholderPdf(entry);
    const file = path.join(OUT_DIR, `${entry.slug}-${BATCH_TOKEN}.pdf`);
    await fs.writeFile(file, bytes);
    process.stdout.write(`  wrote ${path.relative(REPO_ROOT, file)}\n`);
  }

  console.log(
    `Done. ${entries.length} placeholder PDFs written to ${path.relative(REPO_ROOT, OUT_DIR)}/`,
  );
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
