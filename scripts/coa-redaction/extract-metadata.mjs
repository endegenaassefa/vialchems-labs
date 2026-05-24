/**
 * Extract test metadata (date + result summary + original batch) from
 * Janoshik COA OCR text. Used by the ingest script to populate
 * ProductTestPanel entries.
 *
 * Iron Law 2.45: the original Janoshik batch string is one-way-hashed
 * into a Vialchems-namespaced short code so the customer-visible
 * identifier carries no upstream traceability, while the operator can
 * still reverse-map via the unredacted archive.
 */
import { createHash } from "node:crypto";

const MONTHS = {
  JAN: "01", FEB: "02", MAR: "03", APR: "04", MAY: "05", JUN: "06",
  JUL: "07", AUG: "08", SEP: "09", OCT: "10", NOV: "11", DEC: "12",
};

/**
 * Find a "DD MMM YYYY" date in the OCR text and return YYYY-MM-DD.
 * Prefers "Analysis conducted" date if present; falls back to "Testing
 * ordered" or "Sample received".
 */
export function extractTestDate(ocrText) {
  const preferOrder = [
    /analy(?:sis|sed|zed)\s+conducted\s*[>]?\s*(\d{1,2})\s+([A-Z]{3})\s+(\d{4})/i,
    /testing\s+ordered\s*[>]?\s*(\d{1,2})\s+([A-Z]{3})\s+(\d{4})/i,
    /sample\s+received\s*[>]?\s*(\d{1,2})\s+([A-Z]{3})\s+(\d{4})/i,
    /(\d{1,2})\s+([A-Z]{3})\s+(\d{4})/, // any date as last resort
  ];
  for (const re of preferOrder) {
    const m = ocrText.match(re);
    if (m) {
      const day = m[1].padStart(2, "0");
      const month = MONTHS[m[2].toUpperCase()];
      const year = m[3];
      if (month) return `${year}-${month}-${day}`;
    }
  }
  return null;
}

/**
 * Extract a purity percent from OCR text (e.g. "99.245%" or "Purity 99.245").
 * Returns the matched string with trailing % (e.g. "99.245%").
 */
export function extractPurityResult(ocrText) {
  // OCR often mangles the % sign; accept the number with optional %.
  const re = /purity[^\d]{0,20}(\d{2}\.\d{1,3})\s*%?/i;
  const m = ocrText.match(re);
  if (m) return `${m[1]}%`;
  // Standalone percentage near "Results"
  const alt = ocrText.match(/results[^\n]*?\n[\s\S]{0,200}?(\d{2}\.\d{1,3})\s*%?/i);
  if (alt) return `${alt[1]}%`;
  return null;
}

/**
 * Detect PASS/FAIL for sterility / heavy metals.
 */
export function extractPassFailResult(ocrText) {
  if (/\bPASS\b/i.test(ocrText)) return "PASS";
  if (/\bFAIL\b/i.test(ocrText)) return "FAIL";
  return null;
}

/**
 * Extract endotoxin reading (e.g. "<0.5 EU/mg").
 */
export function extractEndotoxinResult(ocrText) {
  const re = /(<\s*[\d.]+\s*EU\s*\/\s*mg)/i;
  const m = ocrText.match(re);
  if (m) return m[1].replace(/\s+/g, "");
  // Fallback: any "< X EU/mg" pattern
  const re2 = /(<\s*[\d.]+\s*EU)/i;
  const m2 = ocrText.match(re2);
  if (m2) return `${m2[1].replace(/\s+/g, "")}/mg`;
  return null;
}

/**
 * Extract the original Janoshik batch identifier from OCR text.
 * Returns null if not found. The string MUST NOT be surfaced to
 * customers (Iron Law 2.45); it's used only to derive a deterministic
 * brand-neutral batch hash.
 */
export function extractOriginalBatch(ocrText) {
  // "Batch wwk7U082" pattern (OCR often joins surrounding words)
  const re = /\bBatch\s+([A-Za-z0-9]{5,16})\b/;
  const m = ocrText.match(re);
  return m ? m[1] : null;
}

/**
 * Derive a brand-neutral Vialchems batch identifier from the original
 * Janoshik batch string. Format: vc-[slugStem]-[8hex].
 *
 * If origBatch is null (OCR failed to capture), we hash the slug +
 * test date instead so the identifier is still deterministic per
 * SKU + per ingest run.
 */
export function deriveBrandNeutralBatch(slug, origBatch, testDate) {
  const stem = slug.replace(/-\d+m[cg]g?$/, "").slice(0, 12);
  const seed = `${slug}|${origBatch ?? ""}|${testDate ?? ""}`;
  const hash = createHash("sha256").update(seed).digest("hex").slice(0, 8);
  return `vc-${stem}-${hash}`;
}
