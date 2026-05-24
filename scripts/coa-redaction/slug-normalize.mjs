/**
 * Operator-folder name → repo slug normalization. Maintains parity with
 * lib/content/products.ts. See super-prompt §6.2 inventory table.
 *
 * Known explicit mappings (precedence over the generic algorithm):
 *   - NADplus_500mg   → nad-500mg
 *   - CJC-1295_plus_Ipamorelin_5mg → cjc-1295-ipamorelin-5mg
 *
 * All other folders follow: lowercase, "_" → "-", collapse dashes.
 */

const EXPLICIT_MAP = new Map([
  ["nadplus_500mg", "nad-500mg"],
  ["cjc-1295_plus_ipamorelin_5mg", "cjc-1295-ipamorelin-5mg"],
]);

export function normalizeSkuFolder(folderName) {
  const lower = folderName.toLowerCase();
  if (EXPLICIT_MAP.has(lower)) return EXPLICIT_MAP.get(lower);
  return lower
    .replace(/_plus_/g, "-")
    .replace(/_/g, "-")
    .replace(/-{2,}/g, "-");
}

const TEST_NAME_MAP = new Map([
  ["purity", "purity"],
  ["microbial", "sterility"], // Janoshik labels sterility as "Microbial"
  ["endotoxin", "endotoxin"],
  ["heavymetals", "heavymetals"],
  ["heavy-metals", "heavymetals"],
]);

export function normalizeTestName(rawTest) {
  const key = rawTest.toLowerCase().replace(/[_-]/g, "");
  // Try direct, then try with strip of any dash/underscore.
  return TEST_NAME_MAP.get(rawTest.toLowerCase()) ?? TEST_NAME_MAP.get(key) ?? null;
}

/**
 * Parse a Janoshik COA filename like "BPC-157_10mg_Purity.pdf" into
 * { sku, test }. Returns null when the pattern doesn't match.
 */
export function parseCoaFilename(filename) {
  const base = filename.replace(/\.pdf$/i, "");
  // Strip trailing _Purity / _Microbial / _Endotoxin / _HeavyMetals
  const match = base.match(/^(.+?)_(Purity|Microbial|Endotoxin|HeavyMetals)$/i);
  if (!match) return null;
  const sku = normalizeSkuFolder(match[1]);
  const test = normalizeTestName(match[2]);
  if (!sku || !test) return null;
  return { sku, test };
}
