/**
 * COA (Certificate of Analysis) library — placeholder index.
 *
 * Each opening SKU has one placeholder COA so the route table is in shape
 * before real PDFs land. The PDFs themselves do not exist yet; the COA detail
 * page links to /coa/<peptide>-<batch>.pdf with a clearly-labeled
 * "EXAMPLE COA — REPLACE BEFORE LAUNCH" notice (Iron Law 2.10: zero-edit
 * deployable means routes exist; placeholder content is explicitly flagged).
 */

import { products } from './products';

export interface CoaRecord {
  peptide: string;
  peptideName: string;
  batch: string;
  testDate: string;
  lab: string;
  hplcPurityPct: number;
  sterilityResult: 'PASS' | 'FAIL';
  endotoxinEU_per_mg: string;
  pdfPath: string;
}

const PLACEHOLDER_BATCH = 'BATCH-2026-PLACEHOLDER';
const PLACEHOLDER_DATE = '2026-04-15';

/* v1.3 — operator override per Iron Law 2.26: lab name removed from records;
 * COA library now displays "Independent Lab" without specific affiliation.
 * The contractual relationship is operator-side / private. */
export const coaRecords: CoaRecord[] = products.map((p) => ({
  peptide: p.slug,
  peptideName: p.name,
  batch: PLACEHOLDER_BATCH,
  testDate: PLACEHOLDER_DATE,
  lab: 'Independent Lab',
  hplcPurityPct: 99.1,
  sterilityResult: 'PASS',
  endotoxinEU_per_mg: '< 0.5 EU/mg',
  pdfPath: `/coa/${p.slug}-${PLACEHOLDER_BATCH}.pdf`,
}));

export function getCoa(peptide: string, batch: string): CoaRecord | undefined {
  return coaRecords.find(
    (r) => r.peptide === peptide && r.batch === batch,
  );
}
