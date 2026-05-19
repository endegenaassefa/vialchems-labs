import { describe, expect, it } from "vitest";
import { coaRecords, getCoa } from "@/lib/content/coa";

describe("COA content", () => {
  it("does not publish unverified COA records", () => {
    expect(coaRecords).toHaveLength(0);
  });

  it("only allows verified uploaded records when records exist", () => {
    for (const r of coaRecords) {
      expect(r.status).toBe("verified");
      expect(r.testDate).toMatch(/^\d{4}-\d{2}-\d{2}$/);
      expect(r.pdfPath).toMatch(/^\/coa\/[\w-]+-[\w-]+\.pdf$/);
    }
  });

  it("getCoa returns undefined for unknown pair", () => {
    expect(getCoa("bpc-157-10mg", "BATCH-NONEXISTENT")).toBeUndefined();
    expect(getCoa("nonexistent-peptide", "BATCH-2026")).toBeUndefined();
  });
});
