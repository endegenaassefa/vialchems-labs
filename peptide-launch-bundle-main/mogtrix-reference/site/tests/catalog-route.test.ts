import { beforeEach, describe, expect, it, vi } from "vitest";
import { GET } from "@/app/api/catalog/route";

const { getCustomerAccessState, getCatalogProductsByIds, listCatalogProducts } = vi.hoisted(() => ({
  getCustomerAccessState: vi.fn(),
  getCatalogProductsByIds: vi.fn(),
  listCatalogProducts: vi.fn()
}));

vi.mock("@/lib/customer", () => ({
  getCustomerAccessState
}));

vi.mock("@/lib/catalog.server", () => ({
  getCatalogProductsByIds,
  listCatalogProducts
}));

describe("catalog route", () => {
  beforeEach(() => {
    getCustomerAccessState.mockReset();
    getCatalogProductsByIds.mockReset();
    listCatalogProducts.mockReset();
  });

  it("rejects anonymous catalog reads", async () => {
    getCustomerAccessState.mockResolvedValue({
      kind: "anonymous",
      supabase: {}
    });

    const response = await GET(new Request("https://mogtrix.test/api/catalog"));

    expect(response.status).toBe(401);
    await expect(response.json()).resolves.toEqual({
      error: "Sign in to view the Mogtrix catalog."
    });
    expect(listCatalogProducts).not.toHaveBeenCalled();
  });

  it("rejects unqualified sessions before reading catalog data", async () => {
    getCustomerAccessState.mockResolvedValue({
      kind: "unqualified",
      user: { id: "customer_1" },
      profile: { id: "customer_1" },
      supabase: {}
    });

    const response = await GET(new Request("https://mogtrix.test/api/catalog"));

    expect(response.status).toBe(403);
    await expect(response.json()).resolves.toEqual({
      error: "Complete the qualification step before viewing the Mogtrix catalog."
    });
    expect(listCatalogProducts).not.toHaveBeenCalled();
  });

  it("returns products for qualified customers", async () => {
    getCustomerAccessState.mockResolvedValue({
      kind: "ready",
      user: { id: "customer_1" },
      profile: { id: "customer_1" },
      supabase: {}
    });
    listCatalogProducts.mockResolvedValue([{ id: "bpc-157-5mg", name: "BPC-157 5mg" }]);

    const response = await GET(new Request("https://mogtrix.test/api/catalog"));

    expect(response.status).toBe(200);
    await expect(response.json()).resolves.toEqual({
      products: [{ id: "bpc-157-5mg", name: "BPC-157 5mg" }],
      missingIds: []
    });
  });

  it("fails closed when canonical catalog reads error", async () => {
    getCustomerAccessState.mockResolvedValue({
      kind: "ready",
      user: { id: "customer_1" },
      profile: { id: "customer_1" },
      supabase: {}
    });
    listCatalogProducts.mockRejectedValue(new Error("catalog unavailable"));

    const response = await GET(new Request("https://mogtrix.test/api/catalog"));

    expect(response.status).toBe(503);
    await expect(response.json()).resolves.toEqual({
      error: "The Mogtrix catalog is unavailable right now."
    });
  });
});
