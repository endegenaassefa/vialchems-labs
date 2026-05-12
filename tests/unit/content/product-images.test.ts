import { existsSync } from "node:fs";
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
});
