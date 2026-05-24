/**
 * Iron Law 2.45 integration gate — every PDF in public/coa/ must be
 * stripped of upstream lab branding (Janoshik header, wuhanwansheng.net
 * manufacturer cell, verification footer + key, QR code).
 *
 * Mechanism: rasterize each PDF via `pdftoppm`, OCR via `tesseract`,
 * then grep the OCR text for the FORBIDDEN regex set. Any hit fails
 * the test with a clear pointer at the offending file.
 *
 * CI portability: the suite checks for tesseract + pdftoppm at start.
 * If either is missing, the whole suite SKIPS with a clear warning.
 * This keeps Iron Law 2.45 enforced locally + on CI runners that have
 * the poppler-utils + tesseract packages installed, while still
 * letting bare CI environments run the rest of the test suite.
 *
 * The test currently scans the post-ingest output (after P1D the 46
 * placeholders are replaced with redacted real PDFs). Before ingest,
 * placeholders contain no Janoshik text so the test passes vacuously
 * — but the gate stays armed for every subsequent PR that touches
 * public/coa/.
 */
import { describe, expect, it } from "vitest";
import { promises as fs } from "node:fs";
import { execSync } from "node:child_process";
import { tmpdir } from "node:os";
import path from "node:path";

import { FORBIDDEN_OCR_TOKENS } from "../../scripts/coa-redaction/lib.mjs";

const COA_DIR = path.join(process.cwd(), "public", "coa");

function hasBinary(bin: string): boolean {
  try {
    execSync(`which ${bin}`, { stdio: "pipe" });
    return true;
  } catch {
    return false;
  }
}

const tessAvailable = hasBinary("tesseract");
const pdftoppmAvailable = hasBinary("pdftoppm");
const tooling = tessAvailable && pdftoppmAvailable;

if (!tooling) {
  // eslint-disable-next-line no-console
  console.warn(
    `[coa-redaction.test] SKIPPING — tesseract=${tessAvailable} pdftoppm=${pdftoppmAvailable}. ` +
      "Install poppler-utils + tesseract-ocr to run Iron Law 2.45 visual-redaction enforcement locally.",
  );
}

(tooling ? describe : describe.skip)(
  "Iron Law 2.45 — public/coa/ redaction gate",
  () => {
    it("OCRs every PDF in public/coa/ and confirms no forbidden lab branding survives", async () => {
      const files = (await fs.readdir(COA_DIR)).filter((f) =>
        f.endsWith(".pdf"),
      );
      if (files.length === 0) {
        // Nothing on disk yet — vacuously passes; the existence test in
        // coa-placeholders.test.ts catches the "no PDFs" case.
        return;
      }
      const failures: Array<{ file: string; hit: string; token: string }> = [];

      for (const file of files) {
        const pdfPath = path.join(COA_DIR, file);
        const tmpBase = path.join(
          tmpdir(),
          `coa-ocr-${process.pid}-${Date.now()}-${Math.random().toString(36).slice(2, 8)}`,
        );
        try {
          execSync(
            `pdftoppm -png -r 200 -singlefile ${JSON.stringify(pdfPath)} ${JSON.stringify(tmpBase)}`,
            {
              stdio: "pipe",
            },
          );
          const ocrText = execSync(
            `tesseract ${JSON.stringify(tmpBase + ".png")} stdout -l eng 2>/dev/null`,
          ).toString("utf8");
          for (const re of FORBIDDEN_OCR_TOKENS) {
            const m = ocrText.match(re);
            if (m) {
              failures.push({ file, hit: m[0], token: re.source });
            }
          }
        } finally {
          // Clean up tmp PNG
          try {
            await fs.unlink(tmpBase + ".png");
          } catch {
            /* ignore */
          }
        }
      }

      if (failures.length > 0) {
        const msg = failures
          .map((f) => `  - ${f.file}: matched /${f.token}/ → "${f.hit}"`)
          .join("\n");
        throw new Error(
          `Iron Law 2.45 violation — forbidden lab branding detected in ${failures.length} COA(s):\n${msg}\n` +
            "Re-run scripts/ingest-coa-pdfs.mjs to refresh the redaction.",
        );
      }
      expect(failures).toHaveLength(0);
    }, 120_000); // 120s — scans up to 52 PDFs × ~1s OCR each
  },
);
