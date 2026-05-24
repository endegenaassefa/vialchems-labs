/**
 * COA redaction library — pure JS module shared by the ingest script
 * and the unit tests.
 *
 * Iron Law 2.45 enforcement: every PDF that lands in public/coa/ must
 * have the upstream lab branding (Janoshik logo, manufacturer cell,
 * verification footer + key, QR code) opaque-white-overlay'd before
 * shipping. This module exposes the redaction primitives.
 *
 * Strategy: defense-in-depth.
 *   1) ALWAYS-REDACT the top-right corner (Janoshik wordmark zone)
 *      and the bottom strip (verify URL + verification key + QR).
 *   2) OCR-DRIVEN redaction of any "wuhanwansheng" / "janoshik" /
 *      "janoshike" tokens found inside the body of the page — covers
 *      the per-SKU manufacturer cell whose Y position varies.
 *
 * The OCR step is performed externally (tesseract --tsv) by the
 * orchestrator; this module accepts the parsed TSV row array as input
 * so the pdf-lib operations are pure + testable.
 */
import { PDFDocument, rgb } from "pdf-lib";

/**
 * Forbidden tokens we redact whenever they appear in OCR output.
 * Iron Law 2.45 + Section 5.4.
 */
export const FORBIDDEN_OCR_TOKENS = [
  /wuhan/i,
  /wansheng/i,
  /wuhanwansheng/i,
  /jano[a-z]+ik[a-z]?/i, // catches "janoshik", "janoshike", and OCR misreads ("Janosnik")
];

/**
 * Synthetic OCR row shape (matches tesseract TSV column layout we
 * care about). Only `left/top/width/height` (pixel space) and `text`
 * are required for the redaction lookup.
 */
/** @typedef {{ left: number, top: number, width: number, height: number, text: string }} OcrRow */

/**
 * Always-redact PDF regions, expressed in PDF points (origin
 * bottom-left). Tuned for the Janoshik Analytical template observed
 * on the 13 SKU drop (2026-05).
 *
 * - Top-right zone: covers the Janoshik wordmark + brand strip without
 *   obscuring the "TEST REPORT" header on the left of the same band
 *   (verified by OCR at 200 DPI: "TEST REPORT" ends near x=175pt;
 *    Janoshik wordmark starts near x=196pt).
 * - Bottom strip: covers the "Verify this test at www.janoshike.com/
 *   verify/" footer line, the all-caps verification key, and the QR
 *   code (if present).
 *
 * The page-size argument lets us scale to slightly different page
 * dimensions across the template versions.
 */
export function computeAlwaysRedactRegions(pageSize) {
  const { width, height } = pageSize;
  return [
    // Top-right corner: Janoshik logo + brand strip.
    {
      x: 180,
      y: height - 110,
      width: width - 180,
      height: 110,
      reason: "always:janoshik-header",
    },
    // Bottom strip: verify URL + verification key + QR.
    {
      x: 0,
      y: 0,
      width,
      height: 110,
      reason: "always:janoshik-footer",
    },
  ];
}

/**
 * Build OCR-driven redaction rectangles from a tesseract TSV row set.
 *
 * Each forbidden-token hit becomes a single rectangle covering that
 * word's bbox + a small padding. Coordinates are translated from
 * tesseract pixel space (origin top-left) to PDF point space (origin
 * bottom-left).
 *
 * @param {OcrRow[]} rows - parsed tesseract --tsv data rows
 * @param {{ widthPx: number, heightPx: number, dpi: number }} renderInfo
 * @param {{ width: number, height: number }} pageSize - PDF page size in points
 */
export function computeOcrRedactionRegions(rows, renderInfo, pageSize) {
  const { dpi, heightPx } = renderInfo;
  const scale = 72 / dpi; // px → pt
  const padPx = 4 * (dpi / 72); // 4pt padding
  /** @type {Array<{x:number,y:number,width:number,height:number,reason:string}>} */
  const out = [];
  for (const row of rows) {
    if (!row.text) continue;
    const matched = FORBIDDEN_OCR_TOKENS.find((re) => re.test(row.text));
    if (!matched) continue;
    const xPx = Math.max(0, row.left - padPx);
    const yPxTop = Math.max(0, row.top - padPx);
    const wPx = row.width + 2 * padPx;
    const hPx = row.height + 2 * padPx;
    out.push({
      x: xPx * scale,
      // Y-flip: tesseract origin is top-left; PDF origin is bottom-left.
      y: (heightPx - yPxTop - hPx) * scale,
      width: wPx * scale,
      height: hPx * scale,
      reason: `ocr:${matched.source}=${row.text}`,
    });
  }
  // Clamp to page bounds so we never overflow off-page (no-op in pdf-lib
  // but cleaner for diagnostics).
  return out.map((r) => ({
    ...r,
    x: Math.max(0, Math.min(r.x, pageSize.width)),
    y: Math.max(0, Math.min(r.y, pageSize.height)),
    width: Math.min(r.width, pageSize.width - r.x),
    height: Math.min(r.height, pageSize.height - r.y),
  }));
}

/**
 * Apply a list of redaction rectangles to a pdf-lib PDFDocument's
 * page 0. Returns the same document for chaining. Each rectangle is
 * drawn as opaque white (rgb(1,1,1)) over the existing page content.
 *
 * @param {import("pdf-lib").PDFDocument} pdf
 * @param {Array<{x:number,y:number,width:number,height:number,reason?:string}>} regions
 */
export function applyRedactionRectangles(pdf, regions) {
  const page = pdf.getPage(0);
  for (const r of regions) {
    page.drawRectangle({
      x: r.x,
      y: r.y,
      width: r.width,
      height: r.height,
      color: rgb(1, 1, 1),
      borderWidth: 0,
    });
  }
  return pdf;
}

/**
 * Parse tesseract --tsv output into OcrRow objects. Tesseract's TSV
 * is tab-separated with a header row + per-level rows; we only care
 * about level=5 (words) where `text` is set.
 *
 * @param {string} tsv
 * @returns {OcrRow[]}
 */
export function parseTesseractTsv(tsv) {
  const lines = tsv.split(/\r?\n/);
  if (lines.length === 0) return [];
  const header = lines[0].split("\t");
  const colIndex = (name) => header.indexOf(name);
  const idxLevel = colIndex("level");
  const idxLeft = colIndex("left");
  const idxTop = colIndex("top");
  const idxWidth = colIndex("width");
  const idxHeight = colIndex("height");
  const idxText = colIndex("text");
  /** @type {OcrRow[]} */
  const rows = [];
  for (let i = 1; i < lines.length; i++) {
    const cols = lines[i].split("\t");
    if (cols.length < header.length) continue;
    if (cols[idxLevel] !== "5") continue; // word level only
    const text = (cols[idxText] ?? "").trim();
    if (!text) continue;
    rows.push({
      left: Number(cols[idxLeft]),
      top: Number(cols[idxTop]),
      width: Number(cols[idxWidth]),
      height: Number(cols[idxHeight]),
      text,
    });
  }
  return rows;
}

/**
 * End-to-end: load source PDF, apply always-redact + OCR-driven
 * redaction, return saved PDF bytes.
 *
 * The orchestrator (scripts/ingest-coa-pdfs.mjs) handles rendering
 * the source PDF to PNG and running tesseract --tsv; the parsed TSV
 * rows + render metadata flow in via `ocrInput`.
 *
 * @param {Uint8Array} srcBytes
 * @param {{ rows: OcrRow[], widthPx: number, heightPx: number, dpi: number }} ocrInput
 */
export async function redactJanoshikCOA(srcBytes, ocrInput) {
  const pdf = await PDFDocument.load(srcBytes);
  const page = pdf.getPage(0);
  const pageSize = page.getSize();
  const always = computeAlwaysRedactRegions(pageSize);
  const ocrDriven = computeOcrRedactionRegions(
    ocrInput.rows,
    { dpi: ocrInput.dpi, widthPx: ocrInput.widthPx, heightPx: ocrInput.heightPx },
    pageSize,
  );
  applyRedactionRectangles(pdf, [...always, ...ocrDriven]);
  return await pdf.save();
}
