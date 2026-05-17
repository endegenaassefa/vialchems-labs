/**
 * Catalog content safety tests.
 *
 * Iron Law 2.4 + 2.13: every shortDescription rendered on PDP / shop / cart
 * must pass assertMarketingCopySafe. The dispatch instructs that all
 * product/copy content passes assertMarketingCopySafe. This guards drift if
 * future operator-edited catalog metadata sneaks in a forbidden phrase.
 */
import { describe, expect, it } from "vitest";
import {
  catalogDisplayItems,
  catalogItems,
  productImagePath,
} from "@/components/v2/data";
import { assertMarketingCopySafe } from "@/lib/compliance";
import {
  bundles,
  getProductAvailability,
  getProductBySlug,
  isPurchasableProduct,
  products,
  publicLaunchProductSlugs,
} from "@/lib/content/products";
import { siteConfig } from "@/lib/content/site";

describe("catalog content compliance", () => {
  it("uses the public brand that matches the visible domain styling", () => {
    expect(siteConfig.name).toBe("vialchemlabs.net");
    expect(siteConfig.llcName).toBe("VialChem Labs LLC");
    expect(siteConfig.domain).toBe("vialchemlabs.net");
  });

  it("uses production-domain image paths without legacy brand typos", () => {
    const renderedPaths = [
      productImagePath("bpc-157-10mg"),
      productImagePath("tb-500-10mg"),
      productImagePath("ghk-cu-50mg"),
    ].join("\n");

    expect(renderedPaths).toContain("/v2-assets/vialchemlabs-products/");
    expect(renderedPaths).toContain("vialchemlabs_");
    expect(renderedPaths).not.toMatch(
      new RegExp(`${"vai"}${"lchem"}|vialchem\\.labs`, "i"),
    );
  });

  it.each(products.map((p) => [p.slug, p]))(
    "product %s shortDescription is safe",
    (_slug, product) => {
      expect(() =>
        assertMarketingCopySafe(product.shortDescription),
      ).not.toThrow();
    },
  );

  it.each(products.map((p) => [p.slug, p]))(
    "product %s name is safe",
    (_slug, product) => {
      expect(() => assertMarketingCopySafe(product.name)).not.toThrow();
    },
  );

  it.each(bundles.map((b) => [b.slug, b]))(
    "bundle %s description is safe",
    (_slug, bundle) => {
      expect(() => assertMarketingCopySafe(bundle.description)).not.toThrow();
    },
  );

  it("includes a $1 checkout verification SKU for live Zelle testing", () => {
    expect(getProductBySlug("checkout-verification-1usd")).toMatchObject({
      sku: "CHECKOUT-VERIFY-1USD",
      listPriceCents: 100,
    });
    expect(
      getProductAvailability(getProductBySlug("checkout-verification-1usd")!),
    ).toBe("test-only");
  });

  it("matches the operator-approved live launch catalog and prices", () => {
    const expected = [
      ["bpc-157-10mg", "BPC-157-10MG", 4200],
      ["tb-500-10mg", "TB-500-10MG", 4800],
      ["ghk-cu-50mg", "GHK-CU-50MG", 5000],
      ["cjc-1295-ipamorelin-5mg", "CJC-1295-IPAMORELIN-5MG", 8000],
      ["klow-80mg", "KLOW-80MG", 10000],
      ["kpv-500mcg", "KPV-500MCG", 4800],
      ["mots-c-10mg", "MOTS-C-10MG", 6500],
      ["semax-10mg", "SEMAX-10MG", 6500],
      ["selank-10mg", "SELANK-10MG", 6500],
      ["reta-10mg", "RETA-10MG", 9900],
      ["reta-20mg", "RETA-20MG", 15000],
      ["tirz-25mg", "TIRZ-25MG", 10000],
      ["nad-500mg", "NAD-500MG", 7500],
    ] as const;

    expect(publicLaunchProductSlugs).toEqual(expected.map(([slug]) => slug));

    for (const [slug, sku, listPriceCents] of expected) {
      const product = getProductBySlug(slug);
      expect(product, slug).toMatchObject({ sku, listPriceCents });
      expect(getProductAvailability(product!)).toBe("in-stock");
      expect(isPurchasableProduct(product!)).toBe(true);
    }
  });

  it("keeps the public catalog grid limited to approved live products", () => {
    expect(catalogItems.map((item) => item.slug)).toEqual([
      ...publicLaunchProductSlugs,
    ]);
    expect(catalogItems.every((item) => item.availability === "in-stock")).toBe(
      true,
    );
    expect(
      catalogItems.some((item) => item.availability === "request-only"),
    ).toBe(false);
  });

  it("groups duplicate live variants into one visible product listing", () => {
    const visibleNames = catalogDisplayItems.map((item) => item.shortName);

    expect(visibleNames.filter((name) => name === "Reta")).toHaveLength(1);
    expect(catalogDisplayItems).toHaveLength(12);
    expect(
      catalogDisplayItems.find((item) => item.shortName === "Reta")?.variants,
    ).toHaveLength(2);
  });

  it("treats non-launch products as custom request only", () => {
    const oldProduct = getProductBySlug("tb-500-5mg");
    expect(oldProduct).toBeDefined();
    expect(getProductAvailability(oldProduct!)).toBe("request-only");
    expect(isPurchasableProduct(oldProduct!)).toBe(false);
  });
});
