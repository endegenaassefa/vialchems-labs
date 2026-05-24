/**
 * Phase 4.1 — KLOW composition disclosure (super-prompt §9.1).
 *
 * Regression guard: the klow-80mg SKU MUST carry a populated
 * ProductComposition referencing the 4 canonical peptides at the
 * 50/10/10/10 mg ratio. A future PR that re-nulls the composition
 * (returning the "Composition disclosure pending" PDP notice)
 * would re-open the Iron Law 2.41 + 2.42 customer-visible gap that
 * §9.1 closure resolved.
 */
import { describe, expect, it } from "vitest";

import { getProductBySlug } from "@/lib/content/products";

describe("KLOW-80mg composition (Phase 4.1 H1 closure)", () => {
  it("klow-80mg exists in the catalog", () => {
    const product = getProductBySlug("klow-80mg");
    expect(product).toBeDefined();
  });

  it("carries a populated ProductComposition (no longer null)", () => {
    const product = getProductBySlug("klow-80mg");
    expect(product?.composition).toBeDefined();
    expect(product?.composition).not.toBeNull();
  });

  it("declares the 4 canonical peptides at the 50/10/10/10 mg ratio", () => {
    const product = getProductBySlug("klow-80mg");
    const peptides = product?.composition?.peptides ?? [];
    expect(peptides).toHaveLength(4);
    const lookup = new Map(peptides.map((p) => [p.name, p.mgPerVial]));
    expect(lookup.get("GHK-Cu")).toBe(50);
    expect(lookup.get("BPC-157")).toBe(10);
    expect(lookup.get("TB-500")).toBe(10);
    expect(lookup.get("KPV")).toBe(10);
  });

  it("the total mg sums to the labeled 80mg vial dose", () => {
    const product = getProductBySlug("klow-80mg");
    const total = (product?.composition?.peptides ?? []).reduce(
      (acc, p) => acc + p.mgPerVial,
      0,
    );
    expect(total).toBe(80);
  });

  it("perBatchCoaUrl points at /verify/klow-80mg", () => {
    const product = getProductBySlug("klow-80mg");
    expect(product?.composition?.perBatchCoaUrl).toBe("/verify/klow-80mg");
  });

  it("shortDescription mentions all four peptide names + the 50/10/10/10 ratio", () => {
    const product = getProductBySlug("klow-80mg");
    const desc = product?.shortDescription ?? "";
    for (const peptide of ["GHK-Cu", "BPC-157", "TB-500", "KPV"]) {
      expect(desc, `description mentions ${peptide}`).toContain(peptide);
    }
    expect(desc).toMatch(/50\/10\/10\/10/);
  });
});
