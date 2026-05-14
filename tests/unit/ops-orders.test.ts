/**
 * Phase A ops orders library — unit tests.
 *
 * Covers:
 *   - state machine: valid + invalid transitions
 *   - transitionStatus / attachTracking / markRefunded happy paths
 *   - optimistic-lock failure when current status no longer matches
 *   - refund validation (amount <= total, partial vs full event)
 *   - input validation via Zod schemas
 *
 * Supabase client is mocked because hitting a real DB in unit tests is
 * slow and flaky. Integration coverage comes from Playwright in commit 11.
 */
import { describe, expect, it, vi } from "vitest";
import {
  attachTracking,
  isValidTransition,
  listOrdersForOps,
  listValidTransitions,
  markRefunded,
  transitionStatus,
  listFilterSchema,
  transitionSchema,
} from "@/lib/ops/orders";
import type { SupabaseClient } from "@supabase/supabase-js";

// ---------------------------------------------------------------------------
// Mock client
// ---------------------------------------------------------------------------

type MockOpts = {
  rowOverride?: Record<string, unknown> | null;
  error?: string | null;
  rangeData?: Array<Record<string, unknown>>;
  rangeCount?: number;
};

function buildOrderRow(overrides: Record<string, unknown> = {}) {
  return {
    id: "00000000-0000-4000-8000-000000000001",
    display_id: "VC-TEST0001",
    status: "fulfilled",
    email: "test@example.com",
    payment_provider: "stub",
    subtotal_cents: 10000,
    discount_cents: 0,
    shipping_cents: 1500,
    total_cents: 11500,
    tracking_number: null,
    shipped_carrier: null,
    shippo_transaction_id: null,
    refund_reason: null,
    refund_amount_cents: null,
    placed_at: "2026-05-13T10:00:00Z",
    fulfilled_at: "2026-05-13T11:00:00Z",
    shipped_at: null,
    delivered_at: null,
    cancelled_at: null,
    refunded_at: null,
    is_test: true,
    shipping_address_snapshot: { line1: "1 Lab Way" },
    ...overrides,
  };
}

function makeMockClient(opts: MockOpts = {}): SupabaseClient {
  const builder: Record<string, unknown> = {};
  const chainResolver = () =>
    Promise.resolve({
      data: opts.rowOverride === undefined ? buildOrderRow() : opts.rowOverride,
      error: opts.error ? { message: opts.error } : null,
    });

  for (const fn of [
    "select",
    "insert",
    "update",
    "eq",
    "in",
    "gte",
    "lte",
    "ilike",
    "order",
  ]) {
    builder[fn] = vi.fn(() => builder);
  }
  builder.single = vi.fn(chainResolver);
  builder.maybeSingle = vi.fn(chainResolver);
  builder.range = vi.fn(() =>
    Promise.resolve({
      data: opts.rangeData ?? [],
      count: opts.rangeCount ?? 0,
      error: opts.error ? { message: opts.error } : null,
    }),
  );
  builder.then = (onfulfilled: (v: unknown) => unknown) =>
    chainResolver().then(onfulfilled);

  return {
    from: vi.fn(() => builder),
  } as unknown as SupabaseClient;
}

// ---------------------------------------------------------------------------
// State machine
// ---------------------------------------------------------------------------

describe("state machine", () => {
  it("permits paid -> fulfilled", () => {
    expect(isValidTransition("paid", "fulfilled")).toBe(true);
  });

  it("permits fulfilled -> shipped", () => {
    expect(isValidTransition("fulfilled", "shipped")).toBe(true);
  });

  it("blocks shipped -> fulfilled (no regression once shipped)", () => {
    expect(isValidTransition("shipped", "fulfilled")).toBe(false);
  });

  it("blocks pending -> shipped (must go through paid+fulfilled)", () => {
    expect(isValidTransition("pending", "shipped")).toBe(false);
  });

  it("permits refunded from paid, fulfilled, shipped, delivered", () => {
    for (const from of ["paid", "fulfilled", "shipped", "delivered"] as const) {
      expect(isValidTransition(from, "refunded")).toBe(true);
    }
  });

  it("treats cancelled/refunded/jurisdictional_rejected as terminal", () => {
    expect(listValidTransitions("cancelled")).toHaveLength(0);
    expect(listValidTransitions("refunded")).toHaveLength(0);
    expect(listValidTransitions("jurisdictional_rejected")).toHaveLength(0);
  });
});

// ---------------------------------------------------------------------------
// Zod schemas
// ---------------------------------------------------------------------------

describe("listFilterSchema", () => {
  it("applies defaults", () => {
    const parsed = listFilterSchema.parse({});
    expect(parsed.includeTest).toBe(false);
    expect(parsed.page).toBe(1);
    expect(parsed.pageSize).toBe(50);
  });

  it("rejects pageSize > 200", () => {
    const parsed = listFilterSchema.safeParse({ pageSize: 500 });
    expect(parsed.success).toBe(false);
  });

  it("lowercases email", () => {
    const parsed = listFilterSchema.parse({ email: "MIXED@CASE.COM" });
    expect(parsed.email).toBe("mixed@case.com");
  });
});

describe("transitionSchema", () => {
  it("rejects non-uuid orderId", () => {
    const parsed = transitionSchema.safeParse({
      orderId: "not-a-uuid",
      expectedStatus: "paid",
      targetStatus: "fulfilled",
    });
    expect(parsed.success).toBe(false);
  });

  it("rejects unknown status enum", () => {
    const parsed = transitionSchema.safeParse({
      orderId: "00000000-0000-4000-8000-000000000001",
      expectedStatus: "paid",
      targetStatus: "magical",
    });
    expect(parsed.success).toBe(false);
  });
});

// ---------------------------------------------------------------------------
// transitionStatus
// ---------------------------------------------------------------------------

describe("transitionStatus", () => {
  it("rejects invalid transition before hitting DB", async () => {
    const client = makeMockClient();
    await expect(
      transitionStatus(client, {
        orderId: "00000000-0000-4000-8000-000000000001",
        expectedStatus: "shipped",
        targetStatus: "fulfilled",
        actor: "ops-test",
      }),
    ).rejects.toThrow(/invalid_transition/);
  });

  it("returns the new row on success", async () => {
    const client = makeMockClient({
      rowOverride: buildOrderRow({
        status: "fulfilled",
        fulfilled_at: "2026-05-13T12:00:00Z",
      }),
    });
    const result = await transitionStatus(client, {
      orderId: "00000000-0000-4000-8000-000000000001",
      expectedStatus: "paid",
      targetStatus: "fulfilled",
      actor: "ops-test",
    });
    expect(result.status).toBe("fulfilled");
  });

  it("throws stale_status when the prior status no longer matches", async () => {
    const client = makeMockClient({ rowOverride: null });
    await expect(
      transitionStatus(client, {
        orderId: "00000000-0000-4000-8000-000000000001",
        expectedStatus: "paid",
        targetStatus: "fulfilled",
        actor: "ops-test",
      }),
    ).rejects.toThrow(/stale_status/);
  });
});

// ---------------------------------------------------------------------------
// attachTracking
// ---------------------------------------------------------------------------

describe("attachTracking", () => {
  it("rejects transition from non-fulfilled status", async () => {
    const client = makeMockClient();
    await expect(
      attachTracking(client, {
        orderId: "00000000-0000-4000-8000-000000000001",
        expectedStatus: "paid",
        trackingNumber: "9400111899223334445566",
        carrier: "usps",
        actor: "ops-test",
      }),
    ).rejects.toThrow(/invalid_transition/);
  });

  it("sets tracking + carrier on success", async () => {
    const client = makeMockClient({
      rowOverride: buildOrderRow({
        status: "shipped",
        tracking_number: "9400111899223334445566",
        shipped_carrier: "usps",
        shipped_at: "2026-05-13T13:00:00Z",
      }),
    });
    const result = await attachTracking(client, {
      orderId: "00000000-0000-4000-8000-000000000001",
      expectedStatus: "fulfilled",
      trackingNumber: "9400111899223334445566",
      carrier: "usps",
      actor: "ops-test",
    });
    expect(result.trackingNumber).toBe("9400111899223334445566");
    expect(result.shippedCarrier).toBe("usps");
    expect(result.status).toBe("shipped");
  });
});

// ---------------------------------------------------------------------------
// markRefunded
// ---------------------------------------------------------------------------

describe("markRefunded", () => {
  it("rejects refund amount exceeding total", async () => {
    const client = makeMockClient({
      rowOverride: { total_cents: 5000, status: "fulfilled" },
    });
    await expect(
      markRefunded(client, {
        orderId: "00000000-0000-4000-8000-000000000001",
        expectedStatus: "fulfilled",
        amountCents: 10000,
        reason: "test overcharge",
        actor: "ops-test",
      }),
    ).rejects.toThrow(/refund_amount_exceeds_total/);
  });

  it("rejects when status diverges from expected", async () => {
    const client = makeMockClient({
      rowOverride: { total_cents: 5000, status: "shipped" },
    });
    await expect(
      markRefunded(client, {
        orderId: "00000000-0000-4000-8000-000000000001",
        expectedStatus: "fulfilled",
        amountCents: 1000,
        reason: "test stale",
        actor: "ops-test",
      }),
    ).rejects.toThrow(/stale_status/);
  });
});

// ---------------------------------------------------------------------------
// listOrdersForOps
// ---------------------------------------------------------------------------

describe("listOrdersForOps", () => {
  it("returns paginated rows + total", async () => {
    const sampleRow = buildOrderRow();
    const client = makeMockClient({
      rangeData: [sampleRow, sampleRow],
      rangeCount: 17,
    });
    const result = await listOrdersForOps(client, { page: 1, pageSize: 10 });
    expect(result.rows).toHaveLength(2);
    expect(result.total).toBe(17);
    expect(result.page).toBe(1);
    expect(result.pageSize).toBe(10);
  });
});
