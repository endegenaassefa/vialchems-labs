import { afterEach, describe, expect, it } from "vitest";
import { type CoaRecord, coaRecords, getCoa } from "@/lib/content/coa";

describe("COA content", () => {
  it("publishes one CoaRecord per ingested productTestPanel (Phase 1G)", () => {
    // Post-P1G the legacy flat-record list is DERIVED from the panel
    // data at module load. The previous assertion locked the empty
    // state from before P1D ingest; that was an Iron Law 2.41 hazard
    // because /coa rendered "Awaiting release records" forever.
    // Coverage: at least the 13 publicLaunchProductSlugs have panels
    // ingested by P1D, so the table is non-empty in production.
    expect(coaRecords.length).toBeGreaterThan(0);
  });

  it("only allows verified records (status='verified' on every entry)", () => {
    for (const r of coaRecords) {
      expect(r.status).toBe("verified");
      // Accept full ISO date OR YYYY-MM fallback (when OCR dropped the day).
      expect(r.testDate).toMatch(/^\d{4}-\d{2}(-\d{2})?$/);
      expect(r.pdfPath).toMatch(/^\/coa\/[\w-]+-[\w-]+\.pdf$/);
    }
  });

  it("uses lab-agnostic public copy on every record (Iron Law 2.45)", () => {
    for (const r of coaRecords) {
      expect(r.lab).not.toMatch(/janoshik|wuhanwansheng/i);
    }
  });

  it("uses Vialchems-namespaced batch identifiers (Iron Law 2.45)", () => {
    for (const r of coaRecords) {
      expect(r.batch).toMatch(/^vc-/);
    }
  });

  it("getCoa returns undefined for unknown pair", () => {
    expect(getCoa("bpc-157-10mg", "BATCH-NONEXISTENT")).toBeUndefined();
    expect(getCoa("nonexistent-peptide", "BATCH-2026")).toBeUndefined();
  });
});

/**
 * Phase 10 J2 — branch coverage for getCoa.
 *
 * Production keeps coaRecords as a frozen-by-policy empty array (Iron Law:
 * only verified, uploaded certificates are listed). To exercise the
 * predicate branches in `getCoa`, this suite mutates the exported array
 * for the duration of each case, then restores it. We use `splice` (not
 * reassignment) so the live module reference stays intact, and afterEach
 * restores the empty state so the publication invariant above still
 * passes in this same file.
 */
describe("getCoa — branch coverage with seeded records", () => {
  const seedRecord: CoaRecord = {
    peptide: "bpc-157-10mg",
    peptideName: "BPC-157, 10mg vial",
    batch: "BATCH-2026-001",
    testDate: "2026-05-01",
    lab: "Independent Lab",
    hplcPurityPct: 99.4,
    sterilityResult: "PASS",
    endotoxinEU_per_mg: "<0.5",
    pdfPath: "/coa/bpc-157-batch-2026-001.pdf",
    status: "verified",
  };

  const secondRecord: CoaRecord = {
    peptide: "tb-500-10mg",
    peptideName: "TB-500, 10mg vial",
    batch: "BATCH-2026-002",
    testDate: "2026-05-02",
    lab: "Independent Lab",
    hplcPurityPct: 99.1,
    sterilityResult: "PASS",
    endotoxinEU_per_mg: "<0.5",
    pdfPath: "/coa/tb-500-batch-2026-002.pdf",
    status: "verified",
  };

  afterEach(() => {
    // Restore empty state so other suites' invariants still hold.
    coaRecords.splice(0, coaRecords.length);
  });

  it("returns the seeded record when both peptide and batch match", () => {
    coaRecords.push(seedRecord);
    const result = getCoa("bpc-157-10mg", "BATCH-2026-001");
    expect(result).toBe(seedRecord);
  });

  it("returns undefined when peptide matches but batch does not", () => {
    coaRecords.push(seedRecord);
    const result = getCoa("bpc-157-10mg", "BATCH-WRONG");
    expect(result).toBeUndefined();
  });

  it("returns undefined when batch matches but peptide does not", () => {
    coaRecords.push(seedRecord);
    const result = getCoa("wrong-peptide", "BATCH-2026-001");
    expect(result).toBeUndefined();
  });

  it("returns undefined when neither peptide nor batch match", () => {
    coaRecords.push(seedRecord);
    const result = getCoa("wrong-peptide", "BATCH-WRONG");
    expect(result).toBeUndefined();
  });

  it("returns the first match when multiple records share a peptide slug", () => {
    coaRecords.push(seedRecord, secondRecord);
    expect(getCoa("bpc-157-10mg", "BATCH-2026-001")).toBe(seedRecord);
    expect(getCoa("tb-500-10mg", "BATCH-2026-002")).toBe(secondRecord);
  });

  it("is case-sensitive on the peptide slug (exact match required)", () => {
    coaRecords.push(seedRecord);
    expect(getCoa("BPC-157-10MG", "BATCH-2026-001")).toBeUndefined();
  });

  it("is case-sensitive on the batch identifier (exact match required)", () => {
    coaRecords.push(seedRecord);
    expect(getCoa("bpc-157-10mg", "batch-2026-001")).toBeUndefined();
  });
});
