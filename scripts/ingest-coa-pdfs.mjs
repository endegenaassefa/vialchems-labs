#!/usr/bin/env node
/**
 * scripts/ingest-coa-pdfs.mjs
 *
 * Ingest real Janoshik COAs from the operator's download folder, apply
 * Iron Law 2.45 redaction (opaque-white-overlay of all upstream lab
 * branding), and write the per-SKU ProductTestPanel data to
 * lib/content/product-test-panels.generated.ts.
 *
 * Run locally (not in CI):
 *   node scripts/ingest-coa-pdfs.mjs
 *
 * Optional env:
 *   COA_SOURCE_DIR=/path/to/folder    override the default operator folder
 *   COA_DRY_RUN=1                     skip writing outputs; report only
 *
 * Requires: pdftoppm (poppler-utils), tesseract (tesseract-ocr).
 *
 * See docs/operator-runbook.md § "H3 COA ingest" for the operator-side
 * workflow (extracting from the lab's portal → dropping in the source
 * folder → re-running this script → reviewing the generated diff).
 */
import { promises as fs } from "node:fs";
import { execSync } from "node:child_process";
import { tmpdir } from "node:os";
import path from "node:path";

import sharp from "sharp";

import {
  normalizeSkuFolder,
  parseCoaFilename,
} from "./coa-redaction/slug-normalize.mjs";
import { parseTesseractTsv, redactJanoshikCOA } from "./coa-redaction/lib.mjs";
import {
  deriveBrandNeutralBatch,
  extractEndotoxinResult,
  extractOriginalBatch,
  extractPassFailResult,
  extractPurityResult,
  extractTestDate,
} from "./coa-redaction/extract-metadata.mjs";

const REPO_ROOT = path.resolve(new URL("..", import.meta.url).pathname);
const DEFAULT_SOURCE = "/mnt/c/Users/endeg/Downloads/vialchemlabs_coas";
const SOURCE_DIR = process.env.COA_SOURCE_DIR ?? DEFAULT_SOURCE;
const PUBLIC_COA_DIR = path.join(REPO_ROOT, "public", "coa");
const PUBLIC_THUMB_DIR = path.join(REPO_ROOT, "public", "coa-thumbnails");
const GENERATED_PATH = path.join(
  REPO_ROOT,
  "lib",
  "content",
  "product-test-panels.generated.ts",
);
const DRY_RUN = process.env.COA_DRY_RUN === "1";
const RENDER_DPI = 200;
const THUMB_WIDTH = 600;
const THUMB_HEIGHT = 800;
const THUMB_RENDER_DPI = 150;

function check(bin) {
  try {
    execSync(`which ${bin}`, { stdio: "pipe" });
  } catch {
    console.error(`[ingest-coa] Missing required binary: ${bin}`);
    console.error("Install poppler-utils + tesseract-ocr to run this script.");
    process.exit(1);
  }
}

function tmpPath(suffix) {
  return path.join(
    tmpdir(),
    `coa-ingest-${process.pid}-${Date.now()}-${Math.random()
      .toString(36)
      .slice(2, 8)}-${suffix}`,
  );
}

/**
 * Rasterize page 0 of a PDF to a PNG file via pdftoppm.
 * Returns the PNG path. Caller is responsible for unlinking.
 */
function rasterize(pdfPath, dpi) {
  const base = tmpPath("page");
  execSync(
    `pdftoppm -png -r ${dpi} -singlefile ${JSON.stringify(pdfPath)} ${JSON.stringify(base)}`,
    { stdio: "pipe" },
  );
  return base + ".png";
}

/** Read PNG dimensions via the IHDR chunk (no extra deps). */
async function readPngSize(pngPath) {
  const buf = await fs.readFile(pngPath);
  // PNG signature is 8 bytes; IHDR chunk follows at offset 8 (length 4) + type "IHDR" 4 = data at 16.
  const width = buf.readUInt32BE(16);
  const height = buf.readUInt32BE(20);
  return { width, height };
}

function runTesseract(pngPath, mode) {
  if (mode === "tsv") {
    const out = tmpPath("ocr");
    execSync(
      `tesseract ${JSON.stringify(pngPath)} ${JSON.stringify(out)} tsv`,
      {
        stdio: "pipe",
      },
    );
    return out + ".tsv";
  }
  return execSync(
    `tesseract ${JSON.stringify(pngPath)} stdout -l eng 2>/dev/null`,
  ).toString("utf8");
}

/**
 * Generate a 600x800 PNG thumbnail of the redacted PDF's page 0.
 * Rasterizes via pdftoppm, then sharp-resizes "cover" anchored to top
 * (preserves the "TEST REPORT" header band that survived redaction).
 */
async function generateThumbnail(redactedPdfPath, outPngPath) {
  const renderBase = tmpPath("thumb-src");
  execSync(
    `pdftoppm -png -r ${THUMB_RENDER_DPI} -singlefile ${JSON.stringify(redactedPdfPath)} ${JSON.stringify(renderBase)}`,
    { stdio: "pipe" },
  );
  const renderedPath = renderBase + ".png";
  try {
    await sharp(renderedPath)
      .resize(THUMB_WIDTH, THUMB_HEIGHT, { fit: "cover", position: "top" })
      .png({ quality: 90 })
      .toFile(outPngPath);
  } finally {
    await fs.unlink(renderedPath).catch(() => {});
  }
}

function summaryFor(test, ocrText) {
  switch (test) {
    case "purity":
      return extractPurityResult(ocrText) ?? null;
    case "sterility":
    case "heavymetals":
      return extractPassFailResult(ocrText) ?? null;
    case "endotoxin":
      return extractEndotoxinResult(ocrText) ?? null;
    default:
      return null;
  }
}

const PANEL_TEST_KEY = {
  purity: "purity",
  sterility: "sterility",
  endotoxin: "endotoxin",
  heavymetals: "heavyMetals",
};

function thumbPathFor(slug, test) {
  return `/coa-thumbnails/${slug}-${test}.png`;
}

function pdfPathFor(slug, test) {
  return `/coa/${slug}-${test}.pdf`;
}

async function processOnePdf(srcPdf, slug, test, perPanelAcc) {
  console.log(`  • ${slug}/${test} ← ${path.basename(srcPdf)}`);
  const pngPath = rasterize(srcPdf, RENDER_DPI);
  try {
    const { width: widthPx, height: heightPx } = await readPngSize(pngPath);
    const tsvPath = runTesseract(pngPath, "tsv");
    const tsv = await fs.readFile(tsvPath, "utf8");
    await fs.unlink(tsvPath).catch(() => {});
    const rows = parseTesseractTsv(tsv);
    const ocrText = runTesseract(pngPath, "text");

    const origBatch = extractOriginalBatch(ocrText);
    const testDate = extractTestDate(ocrText);
    const resultSummary = summaryFor(test, ocrText);

    const srcBytes = await fs.readFile(srcPdf);
    const redacted = await redactJanoshikCOA(srcBytes, {
      rows,
      widthPx,
      heightPx,
      dpi: RENDER_DPI,
    });

    const destPath = path.join(PUBLIC_COA_DIR, `${slug}-${test}.pdf`);
    const thumbPath = path.join(PUBLIC_THUMB_DIR, `${slug}-${test}.png`);
    if (!DRY_RUN) {
      await fs.writeFile(destPath, redacted);
      await generateThumbnail(destPath, thumbPath);
    }

    // Stash for the panel write-out.
    if (!perPanelAcc.has(slug)) {
      perPanelAcc.set(slug, { origBatches: new Set(), tests: {} });
    }
    const acc = perPanelAcc.get(slug);
    if (origBatch) acc.origBatches.add(origBatch);

    const panelKey = PANEL_TEST_KEY[test];
    acc.tests[panelKey] = {
      available: true,
      testDate: testDate ?? undefined,
      pdfPath: pdfPathFor(slug, test),
      thumbPath: thumbPathFor(slug, test),
      resultSummary: resultSummary ?? undefined,
    };
  } finally {
    await fs.unlink(pngPath).catch(() => {});
  }
}

function panelToTs(slug, acc) {
  // Use the first observed original batch (most reliable) to derive
  // the brand-neutral identifier. Hash includes testDate for additional
  // determinism within the same SKU across re-ingests.
  const origBatch = acc.origBatches.values().next().value ?? null;
  const firstDate = Object.values(acc.tests)[0]?.testDate ?? null;
  const batch = deriveBrandNeutralBatch(slug, origBatch, firstDate);
  const fields = [
    `    batch: ${JSON.stringify(batch)}`,
    ...["purity", "sterility", "endotoxin", "heavyMetals"].map((key) => {
      const t = acc.tests[key] ?? { available: false };
      const inner = Object.entries(t)
        .filter(([, v]) => v !== undefined)
        .map(([k, v]) => `      ${k}: ${JSON.stringify(v)}`)
        .join(",\n");
      return `    ${key}: {\n${inner}\n    }`;
    }),
  ];
  return `  ${JSON.stringify(slug)}: {\n${fields.join(",\n")}\n  }`;
}

function renderGeneratedTs(perPanel) {
  const entries = Array.from(perPanel.entries())
    .sort(([a], [b]) => a.localeCompare(b))
    .map(([slug, acc]) => panelToTs(slug, acc))
    .join(",\n");
  return `/**
 * AUTO-GENERATED — written by scripts/ingest-coa-pdfs.mjs.
 *
 * Do NOT hand-edit. Re-run the ingest script when COAs change.
 * See docs/operator-runbook.md § "H3 COA ingest" for the workflow.
 *
 * The map is mutable (plain object) so tests can seed + clean up
 * per the same pattern coa.ts uses for coaRecords.splice().
 *
 * Iron Law 2.45: no lab/manufacturer/janoshik fields per ProductTestPanel
 * type definition in lib/content/coa.ts. The ingest script enforces this.
 */
import type { ProductTestPanel } from "./coa";

export const productTestPanels: Record<string, ProductTestPanel> = {
${entries}
};
`;
}

async function main() {
  check("pdftoppm");
  check("tesseract");

  // Ensure output dirs exist (PUBLIC_COA_DIR already exists from
  // placeholders; PUBLIC_THUMB_DIR is created here on first run).
  if (!DRY_RUN) {
    await fs.mkdir(PUBLIC_THUMB_DIR, { recursive: true });
  }

  const stat = await fs.stat(SOURCE_DIR).catch(() => null);
  if (!stat?.isDirectory()) {
    console.error(`[ingest-coa] Source folder not found: ${SOURCE_DIR}`);
    console.error(
      "Set COA_SOURCE_DIR or drop the lab folder at the default path.",
    );
    process.exit(1);
  }

  console.log(`[ingest-coa] Source: ${SOURCE_DIR}`);
  console.log(`[ingest-coa] Output: ${PUBLIC_COA_DIR}`);
  if (DRY_RUN) console.log("[ingest-coa] DRY RUN — no files will be written.");

  const subdirs = (await fs.readdir(SOURCE_DIR, { withFileTypes: true }))
    .filter((d) => d.isDirectory())
    .map((d) => d.name);

  const perPanel = new Map();
  let total = 0;
  let skipped = 0;

  for (const sub of subdirs) {
    const slug = normalizeSkuFolder(sub);
    console.log(`\n— ${sub} → ${slug}`);
    const subPath = path.join(SOURCE_DIR, sub);
    const files = (await fs.readdir(subPath)).filter((f) =>
      f.toLowerCase().endsWith(".pdf"),
    );
    for (const file of files) {
      const parsed = parseCoaFilename(file);
      if (!parsed) {
        console.log(`  ? skipped (unparseable): ${file}`);
        skipped++;
        continue;
      }
      try {
        await processOnePdf(
          path.join(subPath, file),
          parsed.sku,
          parsed.test,
          perPanel,
        );
        total++;
      } catch (err) {
        console.error(`  ✗ failed: ${file}: ${err.message}`);
        skipped++;
      }
    }
  }

  const generated = renderGeneratedTs(perPanel);
  if (!DRY_RUN) {
    await fs.writeFile(GENERATED_PATH, generated);
    console.log(`\n[ingest-coa] Wrote ${GENERATED_PATH}`);
  }
  console.log(
    `\n[ingest-coa] Done. ${total} PDFs ingested across ${perPanel.size} SKUs (${skipped} skipped).`,
  );
}

main().catch((err) => {
  console.error("[ingest-coa] Fatal:", err);
  process.exit(1);
});
