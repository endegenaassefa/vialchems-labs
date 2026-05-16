/**
 * Catalog content safety tests.
 *
 * Iron Law 2.4 + 2.13: every shortDescription rendered on PDP / shop / cart
 * must pass assertMarketingCopySafe. The dispatch instructs that all
 * product/copy content passes assertMarketingCopySafe. This guards drift if
 * future operator-edited catalog metadata sneaks in a forbidden phrase.
 */
import { describe, expect, it } from "vitest";
import { assertMarketingCopySafe } from "@/lib/compliance";
import { bundles, getProductBySlug, products } from "@/lib/content/products";

describe("catalog content compliance", () => {
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
  });
});
