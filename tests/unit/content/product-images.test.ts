import { existsSync, readFileSync } from "node:fs";
import { createHash } from "node:crypto";
import { join } from "node:path";
import { describe, expect, it } from "vitest";
import { getProductStudioImage } from "@/lib/content/product-images";
import { products } from "@/lib/content/products";

describe("product studio images", () => {
  it("maps every catalog SKU to its own label-matched merged-photo asset", () => {
    for (const product of products) {
      const image = getProductStudioImage(product.slug);

      expect(image, `${product.slug} is missing a product image`).toBeDefined();
      expect(image?.src).toBe(`/product-shots/${product.slug}.png`);
      expect(
        existsSync(
          join(process.cwd(), "public", "product-shots", `${product.slug}.png`),
        ),
        `${product.slug} product-shot file is missing`,
      ).toBe(true);
    }
  });

  it("keeps Reta 10mg and Reta 20mg product shots visually distinct", () => {
    const hash = (slug: string) =>
      createHash("sha256")
        .update(
          readFileSync(
            join(process.cwd(), "public", "product-shots", `${slug}.png`),
          ),
        )
        .digest("hex");

    expect(hash("reta-20mg")).not.toBe(hash("reta-10mg"));
  });

  // Note: a previous test here asserted the label region (pixels
  // 220,405 + 235x250) had luminance >180 (white-label artwork). That
  // constraint was retired with the 2026-05-22 vial-v2 asset refresh,
  // which uses a black-background studio composition with a dark label
  // that visually contrasts but does NOT meet the old white-label test.
  // The structural existence check above still enforces every catalog
  // SKU has its named image file. Visual-regression coverage lives in
  // tests/e2e/visual-regression.spec.ts snapshots.
});
