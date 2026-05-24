/** Public COA records. Only verified, uploaded certificates are listed here. */

import { productTestPanels } from "./product-test-panels.generated";

export interface CoaRecord {
  peptide: string;
  peptideName: string;
  batch: string;
  testDate: string;
  lab: string;
  hplcPurityPct: number;
  sterilityResult: "PASS" | "FAIL";
  endotoxinEU_per_mg: string;
  pdfPath: string;
  status: "verified";
}

export const coaRecords: CoaRecord[] = [];

export function getCoa(peptide: string, batch: string): CoaRecord | undefined {
  return coaRecords.find((r) => r.peptide === peptide && r.batch === batch);
}

/**
 * Phase 1A — Per-SKU lab-test panel for the /verify/[slug] WWB-style
 * 2x2 grid (super-prompt §6.1).
 *
 * Iron Law 2.45 (no external-lab identifiers in customer-facing schema):
 * the type intentionally carries ONLY a brand-neutral `batch` identifier
 * plus the 4 test slots. There is no `janoshikKey`, no `manufacturer`,
 * no `lab`, no `taskNumber`, no `verificationUrl`. The disabled
 * "external verification — coming soon" CTA on each test card is the
 * same for every test, so no per-test identifier is needed.
 *
 * The `batch` field is a Vialchems-namespaced short code (e.g.
 * `vc-bpc157-7e3a91`) derived deterministically in the ingest script
 * so the operator can still reverse-map for audit via the unredacted
 * archive (Section 5.4.A).
 */
export interface ProductTest {
  /** true if a redacted COA exists in public/coa/ for this test slot. */
  available: boolean;
  /** YYYY-MM-DD; required when available. */
  testDate?: string;
  /** /coa/[slug]-[test].pdf (REDACTED per Iron Law 2.45). */
  pdfPath?: string;
  /** /coa-thumbnails/[slug]-[test].png (generated from REDACTED PDF). */
  thumbPath?: string;
  /**
   * Customer-friendly summary (e.g. "99.245%" for purity, "PASS" for
   * sterility, "<0.5 EU/mg" for endotoxin, "PASS" for heavy-metals).
   * For blend SKUs the purity summary may encode either the lowest
   * floor across components or the range; see super-prompt §6.1.
   */
  resultSummary?: string;
}

export interface ProductTestPanel {
  /**
   * Brand-neutral batch identifier (vc-... namespaced). Iron Law 2.45
   * forbids surfacing the upstream Janoshik/manufacturer batch verbatim.
   */
  batch: string;
  purity: ProductTest; // HPLC
  sterility: ProductTest; // USP <71>
  endotoxin: ProductTest; // LAL endotoxin assay
  heavyMetals: ProductTest; // ICP-MS
}

export { productTestPanels };

/**
 * Look up the per-SKU test panel by product slug. Returns null when no
 * panel has been ingested for the SKU. Per Iron Law 2.42 a SKU with no
 * panel should be filtered out of the public catalog (Phase 1F), but
 * defensive callers should still tolerate null.
 */
export function getProductTestPanel(slug: string): ProductTestPanel | null {
  return productTestPanels[slug] ?? null;
}

/**
 * Convenience helper for legacy single-PDF callsites (e.g. the
 * ProductTabs COA tab) that only need the Purity COA. Returns null
 * when no panel exists or purity is unavailable.
 */
export function getPurityCoa(slug: string): ProductTest | null {
  const panel = productTestPanels[slug];
  if (!panel) return null;
  return panel.purity.available ? panel.purity : null;
}
