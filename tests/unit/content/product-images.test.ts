import { existsSync } from "node:fs";
import { join } from "node:path";
import sharp from "sharp";
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

  it("uses white-label vial artwork for every catalog SKU", async () => {
    for (const product of products) {
      const { data, info } = await sharp(
        join(process.cwd(), "public", "product-shots", `${product.slug}.png`),
      )
        .extract({ left: 220, top: 405, width: 235, height: 250 })
        .raw()
        .toBuffer({ resolveWithObject: true });

      let luminance = 0;
      const pixels = data.length / info.channels;
      for (let index = 0; index < data.length; index += info.channels) {
        luminance +=
          0.2126 * data[index] +
          0.7152 * data[index + 1] +
          0.0722 * data[index + 2];
      }

      expect(luminance / pixels, product.slug).toBeGreaterThan(180);
    }
  });
});
