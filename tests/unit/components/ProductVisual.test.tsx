/**
 * M0i — ProductVisual srcset regression guard
 * (Section 6 super-prompt 2026-05-22).
 *
 * The catalog grid + PDP + home-page featured shelf all render
 * vial product photos through `ProductVisual`. M0i pre-generates
 * responsive variants at 256/384/512/768 widths and adds `srcset`
 * + `sizes` attributes to the underlying `<img>` so the browser
 * picks the smallest variant that covers the rendered pixel width.
 *
 * On iPhone SE the 256-width variant is ~37KB vs ~370KB for the
 * 1024×1024 source PNG — the /shop page weight drops from ~5MB
 * for the 13-SKU above-fold area to ~480KB.
 *
 * This spec locks the contract by inspecting the rendered DOM.
 */
import { describe, expect, it } from "vitest";
import { render } from "@testing-library/react";
import { ProductVisual } from "@/components/v2/Visuals";

const ITEM = {
  image: "/product-shots/bpc-157-10mg.png",
  shortName: "BPC-157, 10mg",
};

describe("ProductVisual srcset (M0i)", () => {
  it("emits a srcset that points at the 4 responsive variants", () => {
    const { container } = render(<ProductVisual item={ITEM} />);
    const img = container.querySelector("img");
    expect(img).not.toBeNull();
    const srcset = img!.getAttribute("srcset") ?? "";

    // All four widths land in the srcset string.
    expect(srcset).toContain(
      "/product-shots/responsive/bpc-157-10mg-256.png 256w",
    );
    expect(srcset).toContain(
      "/product-shots/responsive/bpc-157-10mg-384.png 384w",
    );
    expect(srcset).toContain(
      "/product-shots/responsive/bpc-157-10mg-512.png 512w",
    );
    expect(srcset).toContain(
      "/product-shots/responsive/bpc-157-10mg-768.png 768w",
    );
  });

  it("emits a sizes attribute matching the M0d catalog breakpoints", () => {
    const { container } = render(<ProductVisual item={ITEM} />);
    const img = container.querySelector("img");
    const sizes = img!.getAttribute("sizes") ?? "";
    expect(sizes).toMatch(/max-width:\s*639px/);
    expect(sizes).toMatch(/max-width:\s*1023px/);
    expect(sizes).toMatch(/33vw/);
  });

  it("keeps the original src as the fallback for browsers that ignore srcset", () => {
    const { container } = render(<ProductVisual item={ITEM} />);
    const img = container.querySelector("img");
    expect(img!.getAttribute("src")).toBe("/product-shots/bpc-157-10mg.png");
  });

  it("falls back to no srcset for non-catalog image paths", () => {
    // ProductVisual is sometimes called with arbitrary image paths
    // (e.g. brand placeholders or future bundle composites). The
    // helper returns null for any path that doesn't match the
    // `/product-shots/<slug>.png` convention, and the component
    // must not emit a broken srcset in that case.
    const { container } = render(
      <ProductVisual
        item={{
          image: "/v2-assets/some-brand-placeholder.png",
          shortName: "x",
        }}
      />,
    );
    const img = container.querySelector("img");
    expect(img!.hasAttribute("srcset")).toBe(false);
    expect(img!.hasAttribute("sizes")).toBe(false);
  });
});
