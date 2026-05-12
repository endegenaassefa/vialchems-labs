import { render, screen } from "@testing-library/react";
import { describe, expect, it, vi } from "vitest";

import { CatalogUnavailableError } from "@/lib/catalog";
import ShopPage from "@/app/shop/page";

const {
  getCustomerAccessState,
  customerCanViewPrivatePricing,
  getCatalogAccessAction,
  listCatalogProducts
} = vi.hoisted(() => ({
  getCustomerAccessState: vi.fn(),
  customerCanViewPrivatePricing: vi.fn(),
  getCatalogAccessAction: vi.fn(),
  listCatalogProducts: vi.fn()
}));

vi.mock("@/lib/customer", () => ({
  getCustomerAccessState,
  customerCanViewPrivatePricing,
  getCatalogAccessAction
}));

vi.mock("@/lib/catalog.server", () => ({
  listCatalogProducts
}));

vi.mock("@/components/product-card", () => ({
  ProductCard: ({ product }: { product: { name: string } }) => (
    <div data-testid="product-card">{product.name}</div>
  )
}));

describe("/shop page", () => {
  it("renders canonical storefront products for qualified customers", async () => {
    getCustomerAccessState.mockResolvedValue({ kind: "ready" });
    customerCanViewPrivatePricing.mockReturnValue(true);
    getCatalogAccessAction.mockReturnValue({
      href: "/login",
      label: "Sign in",
      note: "Sign in"
    });
    listCatalogProducts.mockResolvedValue([
      {
        id: "bpc-157-5mg",
        slug: "bpc-157-5mg",
        sku: "MGX-REC-BPC-005",
        name: "BPC-157 5mg",
        summary:
          "Recovery-line peptide record with visible lot context, quality framing, and signed-in catalog pricing.",
        category: "reference",
        format: "Lyophilized powder",
        priceCents: 4900,
        checkoutEnabled: true,
        researchUseOnly: true,
        storage: "2-8 C unopened. Controlled cold storage after intake."
      }
    ]);

    render(await ShopPage({ searchParams: Promise.resolve({}) }));

    expect(screen.getByTestId("product-card")).toHaveTextContent(
      "BPC-157 5mg"
    );
    expect(
      screen.getByRole("heading", { name: /^catalog$/i })
    ).toBeInTheDocument();
    expect(screen.getByText(/1 product/i)).toBeInTheDocument();
    expect(
      screen.queryByText(/no products are available right now/i)
    ).not.toBeInTheDocument();
    expect(screen.queryByText(/browse by category/i)).not.toBeInTheDocument();
  });

  it("shows an explicit unavailable state when the canonical catalog read fails", async () => {
    getCustomerAccessState.mockResolvedValue({ kind: "ready" });
    customerCanViewPrivatePricing.mockReturnValue(true);
    getCatalogAccessAction.mockReturnValue({
      href: "/login",
      label: "Sign in",
      note: "Sign in"
    });
    listCatalogProducts.mockRejectedValue(new CatalogUnavailableError());

    render(await ShopPage({ searchParams: Promise.resolve({}) }));

    expect(
      screen.getByText(/we couldn't load the full catalog right now/i)
    ).toBeInTheDocument();
  });

  it("keeps the public preview product-first and moves filters into a support rail", async () => {
    getCustomerAccessState.mockResolvedValue({ kind: "anonymous" });
    customerCanViewPrivatePricing.mockReturnValue(false);
    getCatalogAccessAction.mockReturnValue({
      href: "/login",
      label: "Sign in",
      note: "Sign in to view pricing."
    });

    render(await ShopPage({ searchParams: Promise.resolve({}) }));

    expect(
      screen.getByRole("heading", { name: /^research products$/i })
    ).toBeInTheDocument();
    expect(screen.getByText(/pricing appears after sign in\./i)).toBeInTheDocument();
    expect(screen.getByText(/filter by category/i)).toBeInTheDocument();
    expect(screen.queryByText(/unlock pricing and checkout/i)).not.toBeInTheDocument();
  });
});
