import { describe, expect, it } from "vitest";
import { listCustomerOrders } from "@/lib/account/orders";

function makeSupabase(rows: unknown[]) {
  const builder = {
    select: () => builder,
    eq: () => builder,
    order: () => builder,
    limit: () => builder,
    then: (
      resolve: (value: { data: unknown[]; error: null }) => void,
      reject: (reason?: unknown) => void,
    ) => {
      try {
        resolve({ data: rows, error: null });
      } catch (error) {
        reject(error);
      }
    },
  };
  return {
    from: () => builder,
  } as never;
}

describe("listCustomerOrders", () => {
  it("returns persisted order summaries for a customer email", async () => {
    const orders = await listCustomerOrders(
      makeSupabase([
        {
          id: "order-db-1",
          display_id: "VC-ABCD1234",
          status: "paid",
          payment_provider: "zelle",
          total_cents: 5400,
          placed_at: "2026-05-12T12:00:00.000Z",
        },
      ]),
      "Researcher@Example.com",
    );

    expect(orders).toEqual([
      {
        id: "order-db-1",
        displayId: "VC-ABCD1234",
        status: "paid",
        paymentProvider: "zelle",
        totalCents: 5400,
        placedAt: "2026-05-12T12:00:00.000Z",
      },
    ]);
  });

  it("rejects invalid customer email input", async () => {
    await expect(
      listCustomerOrders(makeSupabase([]), "not-an-email"),
    ).rejects.toThrow(/invalid_customer_email/);
  });
});
