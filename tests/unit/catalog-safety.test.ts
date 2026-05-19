/**
 * Catalog content safety tests.
 *
 * Iron Law 2.4 + 2.13: every shortDescription rendered on PDP / shop / cart
 * must pass assertMarketingCopySafe. The dispatch instructs that all
 * product/copy content passes assertMarketingCopySafe. This guards drift if
 * future operator-edited catalog metadata sneaks in a forbidden phrase.
 */
import { describe, expect, it } from "vitest";
import { existsSync } from "node:fs";
import { join } from "node:path";
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
    expect(siteConfig.name).toBe("VialChem Labs");
    expect(siteConfig.brandStem).toBe("vialchemlabs");
    expect(siteConfig.llcName).toBe("VialChem Labs LLC");
    expect(siteConfig.domain).toBe("vialchemlabs.net");
  });

  it("preserves v2 catalog artwork while pinning KLOW and Reta to correct shots", () => {
    const renderedPaths = [
      productImagePath("bpc-157-10mg"),
      productImagePath("tb-500-10mg"),
      productImagePath("ghk-cu-50mg"),
      productImagePath("klow-80mg"),
      productImagePath("reta-10mg"),
    ].join("\n");

    expect(renderedPaths).toContain("/v2-assets/vialchemlabs-products/");
    expect(renderedPaths).toContain(
      "vialchemlabs_bpc-157_5-mg_suggested-59.png",
    );
    expect(renderedPaths).toContain(
      "vialchemlabs_tb-500_5-mg_suggested-69.png",
    );
    expect(renderedPaths).toContain("/product-shots/klow-80mg.png");
    expect(renderedPaths).toContain("/product-shots/reta-10mg.png");
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

  it("resolves every live product image to an existing asset", () => {
    for (const slug of publicLaunchProductSlugs) {
      const imagePath = productImagePath(slug);
      const publicPath = imagePath.startsWith("/product-shots/")
        ? imagePath.replace(/^\//, "")
        : imagePath.replace(/^\//, "");
      expect(existsSync(join(process.cwd(), "public", publicPath)), slug).toBe(
        true,
      );
    }
    expect(productImagePath("klow-80mg")).toBe("/product-shots/klow-80mg.png");
    expect(productImagePath("reta-10mg")).toBe("/product-shots/reta-10mg.png");
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

  it("keeps Reta as one $99 live product listing", () => {
    const visibleNames = catalogDisplayItems.map((item) => item.shortName);
    const reta = catalogDisplayItems.find((item) => item.shortName === "Reta");

    expect(visibleNames.filter((name) => name === "Reta")).toHaveLength(1);
    expect(catalogDisplayItems).toHaveLength(12);
    expect(reta?.priceCents).toBe(9900);
    expect(reta?.variants).toHaveLength(1);
    expect(reta?.variants[0]?.sku).toBe("RETA-10MG");
  });

  it("renders KLOW as one live product with the KLOW image and title casing", () => {
    const klow = catalogDisplayItems.find((item) => item.slug === "klow-80mg");

    expect(klow?.shortName).toBe("KLOW");
    expect(klow?.name).toBe("KLOW · 80mg vial");
    expect(klow?.image).toBe("/product-shots/klow-80mg.png");
    expect(klow?.priceCents).toBe(10000);
  });

  it("treats non-launch products as custom request only", () => {
    const oldProduct = getProductBySlug("tb-500-5mg");
    expect(oldProduct).toBeDefined();
    expect(getProductAvailability(oldProduct!)).toBe("request-only");
    expect(isPurchasableProduct(oldProduct!)).toBe(false);
  });
});
