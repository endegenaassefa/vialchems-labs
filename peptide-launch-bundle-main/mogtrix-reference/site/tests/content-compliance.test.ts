import { describe, expect, it } from "vitest";
import { existsSync, statSync } from "node:fs";
import { join } from "node:path";

import { categories, publicClaimGuardTerms } from "@/lib/content/categories";
import { legalPages } from "@/lib/content/legal";
import {
  getProductPreview,
  getStorefrontProductContent,
  getProductVialVisual,
  mergeProductWithStorefrontContent,
  productPreviews
} from "@/lib/content/products";
import { products as fallbackProducts } from "@/lib/products";
import { siteConfig } from "@/lib/content/site";

describe("public content boundaries", () => {
  const expectedProductNames = [
    "BPC-157 5mg",
    "BPC-157 + TB-500 5mg/5mg",
    "CJC-1295 No DAC 5mg",
    "CJC-1295 + Ipamorelin 5mg/5mg",
    "Ipamorelin 5mg",
    "Semax 5mg",
    "Selank 5mg",
    "Dihexa 5mg",
    "GHK-Cu 50mg / 100mg",
    "GHK-Cu + BPC-157 + TB-500 Blend",
    "HGH Frag 176-191 5mg",
    "Mazdutide 10mg",
    "MOTS-c 10mg / 40mg",
    "FOXO4-DRI 10mg",
    "Humanin 10mg"
  ];

  it("keeps public category copy away from medical or dosing claims", () => {
    const publicCategoryCopy = categories
      .map((category) =>
        [
          category.eyebrow,
          category.title,
          category.summary,
          category.detail,
          ...category.controls
        ].join(" ")
      )
      .join(" ")
      .toLowerCase();

    for (const term of publicClaimGuardTerms) {
      expect(publicCategoryCopy).not.toContain(term);
    }
  });

  it("marks every legal page as draft language requiring attorney review", () => {
    for (const page of legalPages) {
      const body = page.sections
        .flatMap((section) => section.body)
        .join(" ");
      expect(body).toContain(siteConfig.attorneyNotice);
    }
  });

  it("keeps public product previews request-only and without prices", () => {
    expect(productPreviews.map((product) => product.name)).toEqual(
      expectedProductNames
    );

    const categorySlugs = new Set(categories.map((category) => category.slug));

    for (const product of productPreviews) {
      expect(product.catalogCode).toMatch(/^MGX-/);
      expect(getProductPreview(product.slug)).toEqual(product);
      expect(categorySlugs.has(product.categorySlug)).toBe(true);

      const publicProductCopy = [
        product.name,
        product.descriptor,
        product.short,
        product.researchFocus,
        product.handlingNote,
        ...product.description
      ].join(" ");

      expect(
        publicProductCopy
      ).not.toMatch(/\$\d|buy now|add to cart|place order/i);

      for (const term of publicClaimGuardTerms) {
        expect(publicProductCopy.toLowerCase()).not.toContain(term);
      }
    }
  });

  it("maps every product preview to a local optimized vial visual", () => {
    for (const product of productPreviews) {
      const visual = getProductVialVisual(product);
      const visualPath = join(process.cwd(), "public", visual);

      expect(visual).toMatch(/^\/visuals\/products\/.+\.png$/);
      expect(existsSync(visualPath), `${product.name} visual missing`).toBe(true);
      expect(statSync(visualPath).size).toBeLessThan(310_000);
    }
  });

  it("builds signed-in storefront products with pricing, specs, and valid content matches", () => {
    for (const product of fallbackProducts) {
      const storefront = mergeProductWithStorefrontContent(product);

      expect(storefront, `${product.slug} missing storefront content`).toBeTruthy();
      expect(getStorefrontProductContent(product.slug)).toBeTruthy();
      expect(storefront?.displayPrice).toMatch(/^\$\d/);
      expect(storefront?.specifications.length).toBeGreaterThan(0);
      expect(storefront?.panels.length).toBeGreaterThanOrEqual(4);
    }
  });
});
