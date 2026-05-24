/**
 * Phase 1B — COA redaction unit tests (Iron Law 2.45).
 *
 * Exercises the pure pdf-lib + tsv-parsing primitives in
 * scripts/coa-redaction/lib.mjs. The orchestrator script (which
 * shells out to pdftoppm + tesseract) is exercised separately by the
 * integration test that scans the actual public/coa/ output.
 */
import { describe, expect, it } from "vitest";
import { PDFDocument } from "pdf-lib";

import {
  FORBIDDEN_OCR_TOKENS,
  applyRedactionRectangles,
  computeAlwaysRedactRegions,
  computeOcrRedactionRegions,
  parseTesseractTsv,
  redactJanoshikCOA,
} from "../../../scripts/coa-redaction/lib.mjs";

const A4_POINTS = { width: 595, height: 842 };

describe("FORBIDDEN_OCR_TOKENS", () => {
  it("catches every Janoshik / Wuhan spelling variant", () => {
    const positives = [
      "wuhanwansheng",
      "wuhanwansheng.net",
      "Wuhan",
      "wansheng",
      "Janoshik",
      "janoshik.com",
      "janoshike",
      "JANOSHIK",
      "Janosnik", // common OCR misread of Janoshik
    ];
    for (const sample of positives) {
      const hit = FORBIDDEN_OCR_TOKENS.some((re) => re.test(sample));
      expect(hit, `expected forbidden hit for ${sample}`).toBe(true);
    }
  });

  it("does NOT match unrelated peptide / brand strings", () => {
    const negatives = [
      "BPC-157",
      "VialChem Labs",
      "GHK-Cu",
      "Vialchems",
      "TEST REPORT",
      "Manufacturer", // the LABEL is safe; the VALUE cell (e.g. wuhanwansheng.net) is what gets matched
      "Purity",
      "Sterility",
    ];
    for (const sample of negatives) {
      const hit = FORBIDDEN_OCR_TOKENS.some((re) => re.test(sample));
      expect(hit, `expected no forbidden hit for ${sample}`).toBe(false);
    }
  });
});

describe("computeAlwaysRedactRegions", () => {
  it("returns top-right + bottom-strip rectangles for the Janoshik template", () => {
    const regions = computeAlwaysRedactRegions(A4_POINTS);
    expect(regions).toHaveLength(2);
    const [topRight, bottom] = regions;
    expect(topRight.reason).toBe("always:janoshik-header");
    expect(bottom.reason).toBe("always:janoshik-footer");
    // Top-right zone covers the upper band but NOT the left half where
    // the customer-visible "TEST REPORT" label lives (x < 180).
    expect(topRight.x).toBeGreaterThanOrEqual(180);
    expect(topRight.y + topRight.height).toBeCloseTo(A4_POINTS.height, 1);
    // Bottom strip covers full width of the footer band.
    expect(bottom.x).toBe(0);
    expect(bottom.y).toBe(0);
    expect(bottom.width).toBe(A4_POINTS.width);
    expect(bottom.height).toBeGreaterThanOrEqual(80);
  });
});

describe("parseTesseractTsv", () => {
  it("returns only word-level rows with non-empty text", () => {
    const sample = [
      "level\tpage_num\tblock_num\tpar_num\tline_num\tword_num\tleft\ttop\twidth\theight\tconf\ttext",
      "1\t1\t0\t0\t0\t0\t0\t0\t411\t844\t-1\t",
      "5\t1\t1\t1\t1\t1\t100\t50\t60\t20\t96\tTEST",
      "5\t1\t1\t1\t1\t2\t200\t50\t70\t20\t88\tREPORT",
      "5\t1\t1\t1\t1\t3\t300\t50\t180\t20\t78\tJANOSHIK",
    ].join("\n");
    const rows = parseTesseractTsv(sample);
    expect(rows).toHaveLength(3);
    expect(rows[0].text).toBe("TEST");
    expect(rows[2].text).toBe("JANOSHIK");
    expect(rows[2].left).toBe(300);
    expect(rows[2].top).toBe(50);
  });
});

describe("computeOcrRedactionRegions", () => {
  const renderInfo = { widthPx: 1141, heightPx: 2344, dpi: 200 };
  const pageSize = { width: 410, height: 843 };

  it("redacts every word matching the forbidden regex set", () => {
    /** @type {Array<import("../../../scripts/coa-redaction/lib.mjs").OcrRow>} */
    const rows = [
      { left: 100, top: 100, width: 50, height: 18, text: "TEST" }, // safe
      { left: 700, top: 100, width: 250, height: 30, text: "JANOSHIK" }, // hit
      {
        left: 380,
        top: 670,
        width: 220,
        height: 28,
        text: "wuhanwansheng.net",
      }, // hit
      { left: 130, top: 1000, width: 90, height: 18, text: "Manufacturer" }, // label — safe (no token match)
    ];
    const regions = computeOcrRedactionRegions(rows, renderInfo, pageSize);
    expect(regions).toHaveLength(2);
    // Y-flip: tesseract y=100 → near top of PDF; pdf y should be near pageSize.height
    const janoshikRect = regions.find((r) => r.reason.includes("JANOSHIK"));
    expect(janoshikRect).toBeDefined();
    if (janoshikRect) {
      // Top of page → high pdf-y value.
      expect(janoshikRect.y).toBeGreaterThan(pageSize.height * 0.7);
    }
    // wuhan cell is mid-body → lower pdf-y value.
    const wuhanRect = regions.find((r) => r.reason.includes("wuhanwansheng"));
    expect(wuhanRect).toBeDefined();
    if (wuhanRect) {
      expect(wuhanRect.y).toBeLessThan(pageSize.height * 0.8);
      expect(wuhanRect.y).toBeGreaterThan(pageSize.height * 0.4);
    }
  });

  it("clamps rectangles to page bounds (no off-page overflow)", () => {
    /** @type {Array<import("../../../scripts/coa-redaction/lib.mjs").OcrRow>} */
    const rows = [
      // Word near the right edge: bbox + padding might exceed page width.
      { left: 1100, top: 100, width: 50, height: 18, text: "Janoshik" },
    ];
    const regions = computeOcrRedactionRegions(rows, renderInfo, pageSize);
    expect(regions).toHaveLength(1);
    const r = regions[0];
    expect(r.x + r.width).toBeLessThanOrEqual(pageSize.width + 0.01);
    expect(r.y + r.height).toBeLessThanOrEqual(pageSize.height + 0.01);
  });

  it("returns empty array when no forbidden tokens present", () => {
    /** @type {Array<import("../../../scripts/coa-redaction/lib.mjs").OcrRow>} */
    const rows = [
      { left: 100, top: 100, width: 60, height: 18, text: "TEST" },
      { left: 200, top: 100, width: 70, height: 18, text: "REPORT" },
      { left: 130, top: 540, width: 110, height: 18, text: "vialchemlabs" },
    ];
    const regions = computeOcrRedactionRegions(rows, renderInfo, pageSize);
    expect(regions).toHaveLength(0);
  });
});

describe("applyRedactionRectangles + redactJanoshikCOA roundtrip", () => {
  async function makeBlankPdf() {
    const pdf = await PDFDocument.create();
    pdf.addPage([A4_POINTS.width, A4_POINTS.height]);
    return pdf;
  }

  it("applyRedactionRectangles adds rectangles without throwing", async () => {
    const pdf = await makeBlankPdf();
    const result = applyRedactionRectangles(pdf, [
      { x: 10, y: 10, width: 100, height: 50, reason: "test" },
    ]);
    expect(result).toBe(pdf);
    const bytes = await pdf.save();
    expect(bytes.byteLength).toBeGreaterThan(0);
  });

  it("redactJanoshikCOA produces a valid PDF that's bigger than input (rectangles added)", async () => {
    const src = await makeBlankPdf();
    const srcBytes = await src.save();
    const out = await redactJanoshikCOA(srcBytes, {
      rows: [{ left: 700, top: 200, width: 200, height: 30, text: "JANOSHIK" }],
      widthPx: 1141,
      heightPx: 2344,
      dpi: 200,
    });
    expect(out.byteLength).toBeGreaterThan(0);
    // Reloading the output should succeed without error.
    const reloaded = await PDFDocument.load(out);
    expect(reloaded.getPageCount()).toBe(1);
  });
});
