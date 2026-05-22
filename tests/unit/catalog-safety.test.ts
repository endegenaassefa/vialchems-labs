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
import { isBannedCompound } from "@/lib/compliance/banned-compounds";
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

  it("uses exact matching product-shot images for rendered product artwork", () => {
    const renderedPaths = [
      productImagePath("bpc-157-10mg"),
      productImagePath("tb-500-10mg"),
      productImagePath("ghk-cu-50mg"),
      productImagePath("kpv-500mcg"),
      productImagePath("mots-c-10mg"),
    ].join("\n");

    expect(renderedPaths).toContain("/product-shots/bpc-157-10mg.png");
    expect(renderedPaths).toContain("/product-shots/tb-500-10mg.png");
    expect(renderedPaths).toContain("/product-shots/ghk-cu-50mg.png");
    expect(renderedPaths).toContain("/product-shots/kpv-500mcg.png");
    expect(renderedPaths).toContain("/product-shots/mots-c-10mg.png");
    expect(renderedPaths).not.toContain("/v2-assets/");
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
    // v5.0.0: 12 -> 9 launch SKUs after removing 3 banned (klow, reta, tirz).
    // 2026-05-22 override re-added klow-80mg + reta-10mg + reta-20mg + tirz-25mg
    // per docs/DECISIONS/iron_law_2_7_override_2026-05-22.md (13 SKUs total).
    const expected = [
      ["bpc-157-10mg", "BPC-157-10MG", 4200],
      ["tb-500-10mg", "TB-500-10MG", 4800],
      ["ghk-cu-50mg", "GHK-CU-50MG", 5000],
      ["cjc-1295-ipamorelin-5mg", "CJC-1295-IPAMORELIN-5MG", 8000],
      ["kpv-500mcg", "KPV-500MCG", 4800],
      ["mots-c-10mg", "MOTS-C-10MG", 6500],
      ["semax-10mg", "SEMAX-10MG", 6500],
      ["selank-10mg", "SELANK-10MG", 6500],
      ["nad-500mg", "NAD-500MG", 7500],
      // Operator-override SKUs (2026-05-22)
      ["klow-80mg", "KLOW-80MG", 10000],
      ["reta-10mg", "RETA-10MG", 9900],
      ["reta-20mg", "RETA-20MG", 15000],
      ["tirz-25mg", "TIRZ-25MG", 10000],
    ] as const;

    expect(publicLaunchProductSlugs).toEqual(expected.map(([slug]) => slug));

    for (const [slug, sku, listPriceCents] of expected) {
      const product = getProductBySlug(slug);
      expect(product, slug).toMatchObject({ sku, listPriceCents });
      expect(getProductAvailability(product!)).toBe("in-stock");
      expect(isPurchasableProduct(product!)).toBe(true);
    }
  });

  it("resolves every live product image to its exact product-shot asset", () => {
    for (const slug of publicLaunchProductSlugs) {
      const imagePath = productImagePath(slug);
      expect(imagePath).toBe(`/product-shots/${slug}.png`);
      const publicPath = imagePath.replace(/^\//, "");
      expect(existsSync(join(process.cwd(), "public", publicPath)), slug).toBe(
        true,
      );
    }
  });

  it("resolves every product record image to an exact product-shot asset", () => {
    for (const product of products) {
      const imagePath = productImagePath(product.slug);
      expect(imagePath).toBe(`/product-shots/${product.slug}.png`);
      expect(
        existsSync(
          join(process.cwd(), "public", "product-shots", `${product.slug}.png`),
        ),
        product.slug,
      ).toBe(true);
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

  it("renders the v5.0.0 + 2026-05-22-override launch SKUs (KLOW + Reta + Tirz re-introduced)", () => {
    // v5.0.0: 9 launch products. Operator override 2026-05-22 added 4
    // SKUs (klow-80mg, reta-10mg, reta-20mg, tirz-25mg). catalogDisplayItems
    // groups by shortName so Reta 10mg + Reta 20mg collapse into 1 display
    // item with 2 variants → 12 display items total, 13 underlying SKUs.
    expect(catalogDisplayItems).toHaveLength(12);
    expect(
      catalogDisplayItems.find((item) => item.slug === "klow-80mg"),
    ).toBeDefined();
    const retaDisplay = catalogDisplayItems.find(
      (item) => item.slug === "reta-10mg",
    );
    expect(retaDisplay).toBeDefined();
    expect(retaDisplay?.variants).toHaveLength(2);
    expect(
      catalogDisplayItems.find((item) => item.slug === "tirz-25mg"),
    ).toBeDefined();
  });

  it("treats non-launch products as custom request only", () => {
    const oldProduct = getProductBySlug("tb-500-5mg");
    expect(oldProduct).toBeDefined();
    expect(getProductAvailability(oldProduct!)).toBe("request-only");
    expect(isPurchasableProduct(oldProduct!)).toBe(false);
  });
});

describe("Iron Law 2.7 — banned-compound catalog enforcement (post-2026-05-22 override)", () => {
  // Per docs/DECISIONS/iron_law_2_7_override_2026-05-22.md, the operator
  // re-introduced klow-80mg, reta-10mg, reta-20mg, tirz-25mg. The
  // remaining banned slugs (tesamorelin, pt-141, melanotan-ii) stay banned.
  const BANNED_SLUGS = ["tesamorelin-5mg", "pt-141-10mg", "melanotan-ii-10mg"];

  for (const slug of BANNED_SLUGS) {
    it(`catalog does not contain banned slug '${slug}'`, () => {
      const found = products.find((p) => p.slug === slug);
      expect(
        found,
        `Iron Law 2.7 violation: banned slug '${slug}' present at index ${
          found ? products.indexOf(found) : "n/a"
        }`,
      ).toBeUndefined();
    });

    it(`publicLaunchProductSlugs does not contain '${slug}'`, () => {
      expect(publicLaunchProductSlugs).not.toContain(slug);
    });
  }

  it("no product shortName matches a banned compound (Iron Law 2.29 cross-check)", () => {
    for (const product of products) {
      expect(
        isBannedCompound(product.shortName),
        `Iron Law 2.29 violation: product shortName='${product.shortName}' (slug='${product.slug}') matches BANNED_COMPOUNDS`,
      ).toBe(false);
    }
  });

  it("no product name matches a banned compound (Iron Law 2.29 cross-check)", () => {
    for (const product of products) {
      expect(
        isBannedCompound(product.name),
        `Iron Law 2.29 violation: product name='${product.name}' (slug='${product.slug}') matches BANNED_COMPOUNDS`,
      ).toBe(false);
    }
  });

  it("no product shortDescription matches a banned compound", () => {
    for (const product of products) {
      expect(
        isBannedCompound(product.shortDescription),
        `Iron Law 2.29 violation: product shortDescription mentions banned compound. slug='${product.slug}'`,
      ).toBe(false);
    }
  });

  it("no bundle name or constituents reference banned compounds", () => {
    for (const bundle of bundles) {
      expect(
        isBannedCompound(bundle.name),
        `Iron Law 2.29 violation: bundle name='${bundle.name}' (slug='${bundle.slug}') matches BANNED_COMPOUNDS`,
      ).toBe(false);
      for (const constituent of bundle.constituents) {
        expect(
          isBannedCompound(constituent),
          `Iron Law 2.29 violation: bundle '${bundle.slug}' constituent='${constituent}' matches BANNED_COMPOUNDS`,
        ).toBe(false);
      }
    }
  });
});

describe("Iron Law 2.29 — bundle research register renaming (v5.0.0)", () => {
  it("bundle 'wolverine-stack' has been renamed to 'recovery-pair'", () => {
    expect(bundles.find((b) => b.slug === "wolverine-stack")).toBeUndefined();
    expect(bundles.find((b) => b.slug === "recovery-pair")).toBeDefined();
  });

  it("bundle 'glow-stack' has been renamed to 'dermal-research-triple'", () => {
    expect(bundles.find((b) => b.slug === "glow-stack")).toBeUndefined();
    expect(
      bundles.find((b) => b.slug === "dermal-research-triple"),
    ).toBeDefined();
  });

  it("bundle 'neuro-stack' has been renamed to 'nootropic-pair'", () => {
    expect(bundles.find((b) => b.slug === "neuro-stack")).toBeUndefined();
    expect(bundles.find((b) => b.slug === "nootropic-pair")).toBeDefined();
  });

  it("bundle 'longevity-stack' has been renamed to 'longevity-triple'", () => {
    expect(bundles.find((b) => b.slug === "longevity-stack")).toBeUndefined();
    expect(bundles.find((b) => b.slug === "longevity-triple")).toBeDefined();
  });

  it("bundle 'recovery-stack' is retained (no rename)", () => {
    expect(bundles.find((b) => b.slug === "recovery-stack")).toBeDefined();
  });
});
