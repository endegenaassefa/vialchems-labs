import { describe, expect, it } from "vitest";
import { coaRecords, getCoa } from "@/lib/content/coa";
import { products } from "@/lib/content/products";

describe("COA content", () => {
  it("renders one placeholder COA per opening SKU", () => {
    expect(coaRecords).toHaveLength(products.length);
  });

  it("every record uses the generic lab-agnostic label per v1.3 override", () => {
    // Iron Law 2.26 v1.3 override — operator removed specific lab affiliation
    // from public UI. The records carry "Independent Lab" rather than a named
    // partner. The contractual relationship is operator-side / private.
    for (const r of coaRecords) {
      expect(r.lab).toBe("Independent Lab");
      expect(r.lab).not.toContain("Janoshik");
    }
  });

  it("every record has placeholder batch and ISO test date", () => {
    for (const r of coaRecords) {
      expect(r.batch).toBe("BATCH-2026-PLACEHOLDER");
      expect(r.testDate).toMatch(/^\d{4}-\d{2}-\d{2}$/);
      expect(r.status).toBe("sample");
    }
  });

  it("every record links to a /coa/<peptide>-<batch>.pdf placeholder", () => {
    for (const r of coaRecords) {
      expect(r.pdfPath).toMatch(/^\/coa\/[\w-]+-BATCH-2026-PLACEHOLDER\.pdf$/);
    }
  });

  it("getCoa resolves an existing peptide+batch pair", () => {
    const r = getCoa("bpc-157-10mg", "BATCH-2026-PLACEHOLDER");
    expect(r).toBeDefined();
    expect(r?.peptideName).toBe("BPC-157, 10mg vial");
  });

  it("getCoa returns undefined for unknown pair", () => {
    expect(getCoa("bpc-157-10mg", "BATCH-NONEXISTENT")).toBeUndefined();
    expect(
      getCoa("nonexistent-peptide", "BATCH-2026-PLACEHOLDER"),
    ).toBeUndefined();
  });
});
