import { describe, expect, it } from "vitest";
import { assertMarketingCopySafe } from "@/lib/compliance";
import { filterProducts, getProductBySlug, mapCatalogProductRow } from "@/lib/catalog";

describe("catalog content", () => {
  const products = [
    mapCatalogProductRow({
      id: "bpc-157-5mg",
      slug: "bpc-157-5mg",
      sku: "MGX-REC-BPC-005",
      name: "BPC-157 5mg",
      summary: "Recovery-line peptide record with visible lot context, quality framing, and signed-in catalog pricing.",
      category: "reference",
      format: "Lyophilized powder",
      storage: "2-8 C unopened. Controlled cold storage after intake.",
      price_cents: 4900,
      checkout_enabled: true,
      research_use_only: true
    }),
    mapCatalogProductRow({
      id: "cjc-1295-no-dac-5mg",
      slug: "cjc-1295-no-dac-5mg",
      sku: "MGX-GH-CJC-005",
      name: "CJC-1295 No DAC 5mg",
      summary: "GH-pathway peptide listing with visible pricing, batch code, and conservative research framing.",
      category: "analytical",
      format: "Lyophilized powder",
      storage: "2-8 C unopened. Protect from heat and uncontrolled rehandling.",
      price_cents: 6900,
      checkout_enabled: true,
      research_use_only: true
    }),
    mapCatalogProductRow({
      id: "ghk-cu-50mg-100mg",
      slug: "ghk-cu-50mg-100mg",
      sku: "MGX-COP-GHK-050100",
      name: "GHK-Cu 50mg / 100mg",
      summary: "Copper-complex record with handling emphasis, private pricing, and document-gated transfer framing.",
      category: "handling",
      format: "Lyophilized powder",
      storage: "2-8 C unopened. Copper-complex storage controls required after intake.",
      price_cents: 9600,
      checkout_enabled: false,
      research_use_only: true
    })
  ];

  it("maps RUO catalog rows without unsafe marketing claims", () => {
    for (const product of products) {
      expect(product.sku).toMatch(/^MGX-/);
      expect(product.priceCents).toBeGreaterThan(0);
      expect(() => assertMarketingCopySafe(product.name)).not.toThrow();
      expect(() => assertMarketingCopySafe(product.summary)).not.toThrow();
      expect(product.researchUseOnly).toBe(true);
    }
  });

  it("filters by name, category, and empty state", () => {
    expect(filterProducts(products, { query: "recovery" }).length).toBeGreaterThan(0);
    expect(filterProducts(products, { category: "analytical" }).every((item) => item.category === "analytical")).toBe(true);
    expect(filterProducts(products, { query: "no-match-value" })).toEqual([]);
  });

  it("finds products by slug", () => {
    const first = products[0];
    expect(getProductBySlug(products, first.slug)?.sku).toBe(first.sku);
    expect(getProductBySlug(products, "missing")).toBeUndefined();
  });
});
