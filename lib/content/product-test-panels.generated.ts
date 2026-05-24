/**
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

export const productTestPanels: Record<string, ProductTestPanel> = {};
