import { beforeEach, describe, expect, it, vi } from "vitest";

import { POST } from "@/app/api/orders/route";

const {
  createServerSupabaseClient,
  requireQualifiedCustomer,
  rpcMock
} = vi.hoisted(() => ({
  createServerSupabaseClient: vi.fn(),
  requireQualifiedCustomer: vi.fn(),
  rpcMock: vi.fn()
}));

vi.mock("@/lib/auth/customer", () => ({
  requireQualifiedCustomer
}));

vi.mock("@/lib/supabase/server", () => ({
  createServerSupabaseClient
}));

describe("orders route", () => {
  beforeEach(() => {
    createServerSupabaseClient.mockReset();
    requireQualifiedCustomer.mockReset();
    rpcMock.mockReset();
  });

  it("maps cart items into the snake_case payload expected by the checkout RPC", async () => {
    requireQualifiedCustomer.mockResolvedValue({
      customerId: "customer_1"
    });
    createServerSupabaseClient.mockResolvedValue({
      rpc: rpcMock
    });
    rpcMock.mockResolvedValue({
      data: [
        {
          id: "ord_test",
          status: "draft",
          payment_status: "pending",
          total_cents: 12800,
          duplicate: false
        }
      ],
      error: null
    });

    const response = await POST(
      new Request("https://mogtrix.test/api/orders", {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify({
          items: [{ productId: "bpc-157-5mg", quantity: 1 }],
          shippingName: "Research Lead",
          shippingAddressLine1: "100 Lab Way",
          shippingAddressLine2: "Suite 4",
          shippingCity: "Boston",
          shippingState: "MA",
          shippingPostalCode: "02110",
          shippingCountry: "US",
          idempotencyKey: "49356ae0-f1a7-4601-b54d-a33d5f80ab70"
        })
      })
    );

    expect(response.status).toBe(201);
    expect(rpcMock).toHaveBeenCalledWith("create_checkout_order_draft", {
      p_items: [{ product_id: "bpc-157-5mg", quantity: 1 }],
      p_shipping: {
        shippingName: "Research Lead",
        shippingAddressLine1: "100 Lab Way",
        shippingAddressLine2: "Suite 4",
        shippingCity: "Boston",
        shippingState: "MA",
        shippingPostalCode: "02110",
        shippingCountry: "US"
      },
      p_idempotency_key: "49356ae0-f1a7-4601-b54d-a33d5f80ab70"
    });
    await expect(response.json()).resolves.toEqual({
      id: "ord_test",
      status: "draft",
      paymentStatus: "pending",
      totalCents: 12800,
      duplicate: false
    });
  });
});
