import { existsSync } from "node:fs";
import { join } from "node:path";
import { describe, expect, it } from "vitest";
import { getBundleStudioImage } from "@/lib/content/bundle-images";
import { bundles } from "@/lib/content/products";

describe("bundle studio images", () => {
  it("maps every catalog bundle to its own generated bundle asset", () => {
    for (const bundle of bundles) {
      const image = getBundleStudioImage(bundle.slug);
      const fileName = `${bundle.slug}-single-vial.png`;

      expect(image, `${bundle.slug} is missing a bundle image`).toBeDefined();
      expect(image?.src).toBe(`/bundle-shots/${fileName}`);
      expect(
        existsSync(join(process.cwd(), "public", "bundle-shots", fileName)),
        `${bundle.slug} bundle-shot file is missing`,
      ).toBe(true);
    }
  });
});
