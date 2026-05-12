import { fireEvent, render, screen } from "@testing-library/react";
import { describe, expect, it, vi } from "vitest";
import { ProductDetailActions } from "@/components/product-detail-actions";
import { ProductCard } from "@/components/product-card";
import {
  getProductPreview,
  mergeProductWithStorefrontContent
} from "@/lib/content/products";
import type { Product } from "@/lib/types";

const addItem = vi.fn();

vi.mock("next/link", () => ({
  default: ({
    children,
    href,
    ...props
  }: React.AnchorHTMLAttributes<HTMLAnchorElement> & { href: string }) => <a href={href} {...props}>{children}</a>
}));

vi.mock("@/lib/cart-store", () => ({
  useCartStore: (selector: (state: { addItem: typeof addItem }) => unknown) =>
    selector({
      addItem
    })
}));

const product: Product = {
  id: "bpc-157-5mg",
  slug: "bpc-157-5mg",
  sku: "MGX-REC-BPC-005",
  name: "BPC-157 5mg",
  summary: "Recovery-line peptide record with visible lot context, quality framing, and signed-in catalog pricing.",
  category: "reference",
  format: "Lyophilized powder",
  priceCents: 4900,
  checkoutEnabled: true,
  researchUseOnly: true,
  storage: "2-8 C unopened. Controlled cold storage after intake."
};

describe("public pilot boundary", () => {
  it("keeps public teaser cards informational while signed-in storefront cards show pricing", () => {
    const preview = getProductPreview("bpc-157-5mg");
    const storefrontProduct = mergeProductWithStorefrontContent({
      ...product,
      slug: "bpc-157-5mg",
      sku: "MGX-REC-BPC-005",
      name: "BPC-157 5mg",
      summary: "Pentadecapeptide reference material with batch-level verification context.",
      priceCents: 4900
    });

    if (!preview || !storefrontProduct) {
      throw new Error("Expected storefront preview fixtures for BPC-157 5mg");
    }

    const { rerender } = render(<ProductCard product={preview} />);

    expect(screen.queryByText("$49.00")).not.toBeInTheDocument();
    expect(
      screen.getByRole("link", { name: /view product/i })
    ).toBeInTheDocument();
    expect(screen.getByText(/preview only/i)).toBeInTheDocument();
    expect(screen.getByText(/pricing after sign in/i)).toBeInTheDocument();
    expect(screen.getByRole("link", { name: /^sign in$/i })).toHaveAttribute(
      "href",
      "/login"
    );

    rerender(<ProductCard product={storefrontProduct} />);

    expect(screen.queryByText(/preview only/i)).not.toBeInTheDocument();
    expect(
      screen.getByRole("link", { name: /view bpc-157 5mg/i })
    ).toBeInTheDocument();
  });

  it("uses cart language for signed-in item collection", () => {
    render(<ProductDetailActions productId={product.id} />);

    fireEvent.click(screen.getByRole("button", { name: /add to cart/i }));

    expect(addItem).toHaveBeenCalledWith(product.id);
    expect(screen.getByRole("link", { name: /open cart/i })).toHaveAttribute(
      "href",
      "/cart"
    );
    expect(screen.getByText(/added to cart/i)).toBeInTheDocument();
  });
});
