import { describe, expect, it } from "vitest";

import {
  getProductPreview,
  getStorefrontProductContent,
  mergeProductWithStorefrontContent,
  storefrontProducts
} from "@/lib/content/products";
import type { Product } from "@/lib/types";

describe("storefront product content", () => {
  const baseProduct: Product = {
    id: "product_bpc",
    slug: "bpc-157-5mg",
    sku: "MGX-REC-BPC-005",
    name: "BPC-157 5mg",
    summary:
      "Pentadecapeptide reference material with batch-level verification context.",
    category: "reference",
    format: "Lyophilized powder",
    priceCents: 4900,
    checkoutEnabled: true,
    researchUseOnly: true,
    storage: "2-8 C unopened. Controlled cold storage after intake."
  };

  it("merges active catalog rows into the storefront model by slug", () => {
    const product = mergeProductWithStorefrontContent(baseProduct);

    expect(product).toMatchObject({
      slug: "bpc-157-5mg",
      displayPrice: "$49.00 / vial",
      batchId: "MGX-BPC-2604",
      categoryTitle: "Recovery Research References"
    });
    expect(product?.specifications.length).toBeGreaterThanOrEqual(4);
    expect(product?.trustBadges).toContain("Third-party record review");
    expect(product?.panels.map((panel) => panel.id)).toEqual([
      "description",
      "specifications",
      "coa-testing",
      "shipping"
    ]);
  });

  it("fails closed when a basic catalog row has no storefront content match", () => {
    expect(
      mergeProductWithStorefrontContent({
        ...baseProduct,
        slug: "unknown-product",
        name: "Unknown Product"
      })
    ).toBeNull();
  });

  it("keeps public preview cards price-free while the signed-in storefront keeps prices", () => {
    const preview = getProductPreview("bpc-157-5mg");
    const storefront = mergeProductWithStorefrontContent(baseProduct);

    expect(preview).toBeTruthy();
    expect(preview).not.toHaveProperty("displayPrice");
    expect(storefront?.displayPrice).toBe("$49.00 / vial");
  });

  it("defines full storefront content for every current peptide record", () => {
    expect(storefrontProducts.length).toBeGreaterThanOrEqual(15);

    for (const product of storefrontProducts) {
      expect(getStorefrontProductContent(product.slug)).toEqual(product);
      expect(product.supportingDocuments.length).toBeGreaterThan(0);
      expect(product.relatedSlugs.length).toBeGreaterThan(0);
      expect(product.productLine).toBeTruthy();
    }
  });
});
