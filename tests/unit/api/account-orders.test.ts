/**
 * B2 — Customer order history API (P0-2 schema fix)
 * (Section 6 super-prompt 2026-05-22).
 *
 * The first B2 wiring SELECTed a bare `items` column from the
 * `orders` table. That column does not exist (per
 * `supabase/migrations/20260510000001_init.sql:197-225`); order
 * lines live in the dedicated `order_items` table. The fix embeds
 * order_items via PostgREST's FK relationship syntax and transforms
 * the response so the API contract (and the OrdersList client) stay
 * unchanged.
 */
import { describe, expect, it, beforeEach, afterEach, vi } from "vitest";

// Mocked Supabase client chain.
const ordersOrderMock = vi.fn();
const ordersEqMock = vi.fn(() => ({ order: ordersOrderMock }));
const ordersSelectMock = vi.fn(() => ({ eq: ordersEqMock }));

const authGetUserMock = vi.fn();
const fromMock = vi.fn((table: string) => {
  if (table === "orders") return { select: ordersSelectMock };
  throw new Error(`unexpected table: ${table}`);
});

const fakeSupabase = {
  from: fromMock,
  auth: { getUser: authGetUserMock },
};

let serviceClientReturn: typeof fakeSupabase | null = fakeSupabase;

vi.mock("@/lib/supabase", () => ({
  serviceSupabase: () => serviceClientReturn,
  browserSupabase: () => null,
  _resetSupabaseCachesForTests: () => {},
}));

// next/headers cookies() — return a fake store the route can read.
let cookieAccessToken: string | undefined = "fake-access-token";
vi.mock("next/headers", () => ({
  cookies: async () => ({
    get(name: string) {
      if (name === "sb-access-token") {
        return cookieAccessToken
          ? { value: cookieAccessToken, name }
          : undefined;
      }
      return undefined;
    },
  }),
}));

import { GET } from "@/app/api/account/orders/route";

function makeReq(): Request {
  return new Request("http://test/api/account/orders", { method: "GET" });
}

beforeEach(() => {
  ordersSelectMock.mockClear();
  ordersEqMock.mockClear();
  ordersOrderMock.mockReset();
  authGetUserMock.mockReset();
  fromMock.mockClear();
  serviceClientReturn = fakeSupabase;
  cookieAccessToken = "fake-access-token";

  // Default-happy: session resolves to a customer email.
  authGetUserMock.mockResolvedValue({
    data: { user: { email: "buyer@example.com" } },
    error: null,
  });

  // Default-happy: orders SELECT with .limit returns one order. The order
  // payload includes order_items as an embedded relationship per the new
  // wiring; the route handler is expected to transform that into the
  // OrdersList-friendly `items: [{name, qty}]` shape.
  ordersOrderMock.mockReturnValue({
    limit: vi.fn().mockResolvedValue({
      data: [
        {
          display_id: "VC-LIST0001",
          total_cents: 12300,
          status: "paid",
          payment_provider: "btcpay",
          placed_at: "2026-05-22T10:00:00Z",
          shipped_at: null,
          tracking_number: null,
          carrier: null,
          order_items: [
            { name_snapshot: "BPC-157, 5mg", quantity: 2 },
            { name_snapshot: "Reta, 5mg", quantity: 1 },
          ],
        },
      ],
      error: null,
    }),
  });
});

afterEach(() => {
  serviceClientReturn = fakeSupabase;
});

describe("GET /api/account/orders — P0-2 schema fix", () => {
  it("orders SELECT does NOT reference a bare 'items' column", async () => {
    const res = await GET(makeReq() as never);
    expect(res.status).toBe(200);

    expect(ordersSelectMock).toHaveBeenCalledTimes(1);
    const selectedColumns = ordersSelectMock.mock.calls[0]?.[0] as string;
    expect(selectedColumns).toBeDefined();
    // The bare 'items' column does not exist on orders. Forbid it.
    expect(selectedColumns).not.toMatch(/(^|,\s*)items(\s*,|\s*$)/);
    // The expected scalar columns must be present.
    expect(selectedColumns).toContain("display_id");
    expect(selectedColumns).toContain("total_cents");
    expect(selectedColumns).toContain("status");
    expect(selectedColumns).toContain("payment_provider");
    expect(selectedColumns).toContain("placed_at");
  });

  it("orders SELECT embeds order_items via the PostgREST FK relationship", async () => {
    await GET(makeReq() as never);

    const selectedColumns = ordersSelectMock.mock.calls[0]?.[0] as string;
    // PostgREST embed syntax: parent.select("col, child(child_col, ...)").
    // The route must request order_items so the response carries enough
    // data for the OrdersList badge ("3 items") without an N+1 fetch.
    expect(selectedColumns).toMatch(/order_items\s*\(/);
    expect(selectedColumns).toContain("name_snapshot");
    expect(selectedColumns).toContain("quantity");
  });

  it("transforms order_items rows into an items: [{name, qty}] response field", async () => {
    const res = await GET(makeReq() as never);
    expect(res.status).toBe(200);
    const body = (await res.json()) as {
      ok: boolean;
      orders: Array<{ items?: Array<{ name: string; qty: number }> }>;
    };
    expect(body.ok).toBe(true);
    expect(body.orders).toHaveLength(1);
    expect(body.orders[0]?.items).toEqual([
      { name: "BPC-157, 5mg", qty: 2 },
      { name: "Reta, 5mg", qty: 1 },
    ]);
  });

  it("returns 401 when sb-access-token cookie is missing", async () => {
    cookieAccessToken = undefined;
    const res = await GET(makeReq() as never);
    expect(res.status).toBe(401);
    const body = await res.json();
    expect(body.code).toBe("unauthorized");
  });

  it("returns 503 when Supabase is not configured (stub mode)", async () => {
    serviceClientReturn = null;
    const res = await GET(makeReq() as never);
    expect(res.status).toBe(503);
    const body = await res.json();
    expect(body.code).toBe("supabase_unavailable");
  });

  it("filters orders by the authenticated customer's email (not all orders)", async () => {
    await GET(makeReq() as never);

    // .eq("email", "buyer@example.com") must be invoked exactly once.
    expect(ordersEqMock).toHaveBeenCalledWith("email", "buyer@example.com");
  });
});
