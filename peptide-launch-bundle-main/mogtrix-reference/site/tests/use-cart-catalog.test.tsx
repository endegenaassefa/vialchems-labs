import { render, screen, waitFor } from "@testing-library/react";
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";

import { getCartCatalogNotice, useCartCatalogRows } from "@/lib/use-cart-catalog";
import type { CartItem } from "@/lib/types";

function Harness({ items }: { items: CartItem[] }) {
  const state = useCartCatalogRows(items);

  return (
    <div>
      <div data-testid="rows">{state.rows.length}</div>
      <div data-testid="missing">{state.missingIds.join(",")}</div>
      <div data-testid="error">{state.error ?? ""}</div>
      <div data-testid="notice">{getCartCatalogNotice(state) ?? ""}</div>
    </div>
  );
}

describe("useCartCatalogRows", () => {
  const originalFetch = global.fetch;

  beforeEach(() => {
    global.fetch = vi.fn();
  });

  afterEach(() => {
    global.fetch = originalFetch;
  });

  it("resolves canonical cart rows from the catalog route", async () => {
    vi.mocked(global.fetch).mockResolvedValue(
      new Response(
        JSON.stringify({
          products: [
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
          ],
          missingIds: []
        })
      )
    );

    render(<Harness items={[{ productId: "bpc-157-5mg", quantity: 1 }]} />);

    await waitFor(() => {
      expect(screen.getByTestId("rows")).toHaveTextContent("1");
    });
    expect(screen.getByTestId("missing")).toHaveTextContent("");
    expect(screen.getByTestId("notice")).toHaveTextContent("");
  });

  it("surfaces orphaned cart ids from the canonical catalog route", async () => {
    vi.mocked(global.fetch).mockResolvedValue(
      new Response(
        JSON.stringify({
          products: [],
          missingIds: ["bpc-157-5mg"]
        })
      )
    );

    render(<Harness items={[{ productId: "bpc-157-5mg", quantity: 1 }]} />);

    await waitFor(() => {
      expect(screen.getByTestId("missing")).toHaveTextContent("bpc-157-5mg");
    });
    expect(screen.getByTestId("rows")).toHaveTextContent("0");
    expect(screen.getByTestId("notice")).toHaveTextContent(
      /no longer available in the canonical catalog/i
    );
  });

  it("surfaces canonical catalog failures without fabricating cart rows", async () => {
    vi.mocked(global.fetch).mockResolvedValue(
      new Response(
        JSON.stringify({
          error: "The Mogtrix catalog is unavailable right now."
        }),
        { status: 503 }
      )
    );

    render(<Harness items={[{ productId: "bpc-157-5mg", quantity: 1 }]} />);

    await waitFor(() => {
      expect(screen.getByTestId("error")).toHaveTextContent(
        "The Mogtrix catalog is unavailable right now."
      );
    });
    expect(screen.getByTestId("rows")).toHaveTextContent("0");
    expect(screen.getByTestId("notice")).toHaveTextContent(
      "The Mogtrix catalog is unavailable right now."
    );
  });
});
