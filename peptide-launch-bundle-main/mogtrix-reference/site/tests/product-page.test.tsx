import { render, screen } from "@testing-library/react";
import { describe, expect, it, vi } from "vitest";

import { CatalogUnavailableError } from "@/lib/catalog";
import ProductPage from "@/app/products/[slug]/page";

const {
  getCustomerAccessState,
  customerCanViewPrivatePricing,
  getCatalogAccessAction,
  getCatalogProductBySlug
} = vi.hoisted(() => ({
  getCustomerAccessState: vi.fn(),
  customerCanViewPrivatePricing: vi.fn(),
  getCatalogAccessAction: vi.fn(),
  getCatalogProductBySlug: vi.fn()
}));

vi.mock("@/lib/customer", () => ({
  getCustomerAccessState,
  customerCanViewPrivatePricing,
  getCatalogAccessAction
}));

vi.mock("@/lib/catalog.server", () => ({
  getCatalogProductBySlug
}));

vi.mock("@/components/product-detail-actions", () => ({
  ProductDetailActions: () => <div>Product actions</div>
}));

vi.mock("@/components/product-detail-panels", () => ({
  ProductDetailPanels: () => <div>Panels</div>
}));

vi.mock("@/components/product-vial-visual", () => ({
  ProductVialVisual: () => <div>Visual</div>
}));

describe("/products/[slug] page", () => {
  it("keeps the public product content visible when canonical pricing cannot be loaded", async () => {
    getCustomerAccessState.mockResolvedValue({ kind: "ready" });
    customerCanViewPrivatePricing.mockReturnValue(true);
    getCatalogAccessAction.mockReturnValue({
      href: "/login",
      label: "Sign in",
      note: "Sign in"
    });
    getCatalogProductBySlug.mockRejectedValue(new CatalogUnavailableError());

    render(
      await ProductPage({
        params: Promise.resolve({ slug: "bpc-157-5mg" })
      })
    );

    expect(
      screen.getByText(/pricing is temporarily unavailable because we couldn't load the full catalog/i)
    ).toBeInTheDocument();
    expect(
      screen.getByText(/BPC-157 5mg/i)
    ).toBeInTheDocument();
    expect(
      screen.getByText(/Recovery-line peptide record/i)
    ).toBeInTheDocument();
  });
});
