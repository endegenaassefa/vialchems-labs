/**
 * PR #34 — Paid-event email side-effects for reconciliation
 * (Section 6 super-prompt 2026-05-22, items B3 + C4 paid-event closure).
 *
 * Two known codex findings against the previous-session WIP that this
 * file pins down as RED tests:
 *
 *   P0-1 (codex-tagged P2 but actually P0): the order header SELECT in
 *   `firePaidEmails` previously asked for `items` — a column that does
 *   NOT exist on the `orders` table (per init migration `orders` schema;
 *   order lines live in the separate `order_items` table). Result: the
 *   query silently errors via Sentry capture, no paid email fires, the
 *   customer never knows their order is paid. Stub-mode hides it; the
 *   moment REQUIRE_SUPABASE=true the entire paid-email path goes dark.
 *
 *   P1-7 (codex-tagged P2 but actually mid-priority): the UPDATE-path
 *   inside the 23505 unique-violation branch of `persistToSupabase`
 *   used to apply unconditionally. Two cold-started instances that both
 *   observed an existing pending row could both UPDATE without conflict
 *   (no atomic compare-and-swap) and both fall through to
 *   `firePaidEmails`, yielding duplicate paid emails. The fix: gate the
 *   UPDATE on the prior status (`.eq("status", currentStatus)`) and
 *   `.select()` the updated rows so a 0-row outcome short-circuits the
 *   email side-effects.
 *
 * Test shape: this file owns its own `vi.mock` boundary for
 * `@/lib/supabase`, `@/lib/email/order-confirmation`, and
 * `@/lib/email/operator-notification` so we can assert against the
 * exact arguments + call counts. The existing
 * `reconciliation-persistence.test.ts` exercises the durable-write
 * layer; this file exercises the paid-event side-effects layer
 * sitting on top of it.
 */
import {
  afterEach,
  beforeEach,
  describe,
  expect,
  it,
  vi,
} from "vitest";

// Hoisted so vi.mock can reach them.
const { sendOrderConfirmationMock, sendOperatorOrderNotificationMock } =
  vi.hoisted(() => ({
    sendOrderConfirmationMock: vi.fn(),
    sendOperatorOrderNotificationMock: vi.fn(),
  }));

vi.mock("@/lib/email/order-confirmation", () => ({
  sendOrderConfirmation: sendOrderConfirmationMock,
}));
vi.mock("@/lib/email/operator-notification", () => ({
  sendOperatorOrderNotification: sendOperatorOrderNotificationMock,
}));

// Per-table mock chains. The Supabase JS client exposes a fluent
// builder; tests need to follow that shape so the impl's call sites
// hit the mocks transparently.
interface MaybeSingleResult<T> {
  data: T | null;
  error: { code?: string; message: string } | null;
}

// Orders header lookup chain: from("orders").select(cols).eq(col, val).maybeSingle()
const ordersHeaderMaybeSingle = vi.fn();
const ordersHeaderEq = vi.fn((_col: string, _val: string) => ({
  maybeSingle: ordersHeaderMaybeSingle,
}));
const ordersSelect = vi.fn((_cols: string) => ({ eq: ordersHeaderEq }));

// Order_items chain: from("order_items").select(cols).eq(col, val) → resolves
const orderItemsEq = vi.fn();
const orderItemsSelect = vi.fn((_cols: string) => ({ eq: orderItemsEq }));

// Payments insert chain: from("payments").insert(row) → resolves
const paymentsInsert = vi.fn();

// Payments select-after-23505 chain: from("payments").select("status").eq(...).eq(...).maybeSingle()
const paymentsReadMaybeSingle = vi.fn();
const paymentsReadEq = vi.fn((_col: string, _val: string) => ({
  eq: paymentsReadEq,
  maybeSingle: paymentsReadMaybeSingle,
}));
const paymentsReadSelect = vi.fn((_cols: string) => ({ eq: paymentsReadEq }));

// Payments UPDATE chain: from("payments").update(row).eq(provider).eq(intent_id).eq(status).select("id")
const paymentsUpdateSelect = vi.fn();
const paymentsUpdateEq = vi.fn((_col: string, _val: string) => ({
  eq: paymentsUpdateEq,
  select: paymentsUpdateSelect,
}));
const paymentsUpdate = vi.fn((_row: Record<string, unknown>) => ({
  eq: paymentsUpdateEq,
}));

// Order_status_history insert chain.
const orderStatusHistoryInsert = vi.fn();

const fromMock = vi.fn((table: string) => {
  if (table === "orders") return { select: ordersSelect };
  if (table === "order_items") return { select: orderItemsSelect };
  if (table === "payments") {
    return {
      insert: paymentsInsert,
      select: paymentsReadSelect,
      update: paymentsUpdate,
    };
  }
  if (table === "order_status_history") {
    return { insert: orderStatusHistoryInsert };
  }
  throw new Error(`unexpected supabase table: ${table}`);
});

const fakeSupabase = { from: fromMock };

vi.mock("@/lib/supabase", () => ({
  serviceSupabase: () => fakeSupabase,
  browserSupabase: () => null,
  _resetSupabaseCachesForTests: () => {},
}));

const captureExceptionMock = vi.hoisted(() => vi.fn());
vi.mock("@/lib/sentry", () => ({
  captureException: captureExceptionMock,
  captureMessage: vi.fn(),
  beforeSend: vi.fn(),
}));

import {
  reconcile,
  resetReconciliationLedger,
} from "@/lib/payments/reconciliation";
import type { PaymentIntent, PaymentStatus } from "@/lib/payments/types";

const ORDER_UUID = "22222222-2222-2222-2222-222222222222";

function makeIntent(
  id: string,
  status: PaymentStatus,
  overrides: Partial<PaymentIntent> = {},
): PaymentIntent {
  const ts = "2026-05-23T12:00:00.000Z";
  return {
    id,
    provider: "btcpay",
    method: "crypto",
    amountCents: 4590,
    currency: "USD",
    status,
    metadata: { order_id: ORDER_UUID },
    createdAt: ts,
    updatedAt: ts,
    externalId: `inv_${id}`,
    ...overrides,
  };
}

function resetAllMocks(): void {
  sendOrderConfirmationMock.mockReset();
  sendOperatorOrderNotificationMock.mockReset();
  captureExceptionMock.mockReset();
  ordersSelect.mockClear();
  ordersHeaderEq.mockClear();
  ordersHeaderMaybeSingle.mockReset();
  orderItemsSelect.mockClear();
  orderItemsEq.mockReset();
  paymentsInsert.mockReset();
  paymentsReadSelect.mockClear();
  paymentsReadEq.mockClear();
  paymentsReadMaybeSingle.mockReset();
  paymentsUpdate.mockClear();
  paymentsUpdateEq.mockClear();
  paymentsUpdateSelect.mockReset();
  orderStatusHistoryInsert.mockReset();
  fromMock.mockClear();

  // Default-happy: insert succeeds, history insert succeeds.
  paymentsInsert.mockResolvedValue({ error: null, data: null });
  orderStatusHistoryInsert.mockResolvedValue({ error: null, data: null });
  // Order header default: returns a customer + total
  ordersHeaderMaybeSingle.mockResolvedValue({
    data: {
      display_id: "VC-DEFAULT0",
      email: "buyer@example.com",
      total_cents: 4590,
    } as Record<string, unknown>,
    error: null,
  });
  // Order items default: 1 line so the email has something to render
  orderItemsEq.mockResolvedValue({
    data: [
      {
        name_snapshot: "Default Item",
        quantity: 1,
        unit_price_cents: 4590,
      },
    ] as Array<Record<string, unknown>>,
    error: null,
  });
  // Send helpers default to ok
  sendOrderConfirmationMock.mockResolvedValue({
    ok: true,
    id: "stub:order-confirmation:fake",
    stub: true,
  });
  sendOperatorOrderNotificationMock.mockResolvedValue({
    ok: true,
    id: "stub:operator-order-paid:fake",
    stub: true,
  });
}

describe("firePaidEmails — P0-1: items live on order_items, not orders", () => {
  beforeEach(() => {
    resetReconciliationLedger();
    resetAllMocks();
  });

  afterEach(() => {
    resetReconciliationLedger();
  });

  it("does NOT reference an 'items' column on the orders SELECT", async () => {
    await reconcile(makeIntent("pi_items_1", "paid"));

    // The orders header select MUST be invoked.
    expect(ordersSelect).toHaveBeenCalledTimes(1);
    const selectedColumns = ordersSelect.mock.calls[0]?.[0] as string;
    expect(selectedColumns).toBeDefined();
    // Items column does not exist on orders — must not be requested.
    expect(selectedColumns).not.toMatch(/\bitems\b/);
    // The three columns we DO need for the paid email.
    expect(selectedColumns).toContain("display_id");
    expect(selectedColumns).toContain("email");
    expect(selectedColumns).toContain("total_cents");
  });

  it("queries the order_items table separately, scoped to order_id", async () => {
    await reconcile(makeIntent("pi_items_2", "paid"));

    expect(orderItemsSelect).toHaveBeenCalledTimes(1);
    const itemColumns = orderItemsSelect.mock.calls[0]?.[0] as string;
    expect(itemColumns).toContain("name_snapshot");
    expect(itemColumns).toContain("quantity");
    expect(itemColumns).toContain("unit_price_cents");

    // The .eq() must scope by order_id = ORDER_UUID
    expect(orderItemsEq).toHaveBeenCalledWith("order_id", ORDER_UUID);
  });

  it("maps order_items rows into the sendOrderConfirmation items payload", async () => {
    ordersHeaderMaybeSingle.mockResolvedValueOnce({
      data: {
        display_id: "VC-MAPCASE",
        email: "buyer@example.com",
        total_cents: 14000,
      },
      error: null,
    });
    orderItemsEq.mockResolvedValueOnce({
      data: [
        { name_snapshot: "BPC-157, 5mg", quantity: 2, unit_price_cents: 4500 },
        { name_snapshot: "Retatrutide, 5mg", quantity: 1, unit_price_cents: 5000 },
      ],
      error: null,
    });

    await reconcile(makeIntent("pi_items_3", "paid"));

    expect(sendOrderConfirmationMock).toHaveBeenCalledTimes(1);
    const arg = sendOrderConfirmationMock.mock.calls[0]?.[0];
    expect(arg).toEqual(
      expect.objectContaining({
        displayId: "VC-MAPCASE",
        customerEmail: "buyer@example.com",
        totalCents: 14000,
        rail: "btcpay",
        status: "paid",
        items: [
          { name: "BPC-157, 5mg", qty: 2, unitPriceCents: 4500 },
          { name: "Retatrutide, 5mg", qty: 1, unitPriceCents: 5000 },
        ],
      }),
    );
  });

  it("still fires the paid email even when order_items returns an empty array", async () => {
    orderItemsEq.mockResolvedValueOnce({ data: [], error: null });

    await reconcile(makeIntent("pi_items_4", "paid"));

    expect(sendOrderConfirmationMock).toHaveBeenCalledTimes(1);
    const arg = sendOrderConfirmationMock.mock.calls[0]?.[0];
    expect(arg.items).toEqual([]);
  });

  it("captures a Sentry breadcrumb but still fires emails (with empty items) when order_items lookup errors", async () => {
    orderItemsEq.mockResolvedValueOnce({
      data: null,
      error: { code: "08006", message: "items_db_down" },
    });

    await reconcile(makeIntent("pi_items_5", "paid"));

    // Emails still fire — items lookup is observability, not a blocker.
    expect(sendOrderConfirmationMock).toHaveBeenCalledTimes(1);
    expect(sendOrderConfirmationMock.mock.calls[0]?.[0].items).toEqual([]);
    // The error must surface to Sentry for observability.
    expect(captureExceptionMock).toHaveBeenCalledWith(
      expect.any(Error),
      expect.objectContaining({
        tags: expect.objectContaining({ phase: "paid_email_items_lookup" }),
      }),
    );
  });
});

describe("firePaidEmails + persistToSupabase — P1-7: UPDATE-path concurrency race", () => {
  beforeEach(() => {
    resetReconciliationLedger();
    resetAllMocks();
  });

  afterEach(() => {
    resetReconciliationLedger();
  });

  it("does NOT fire paid emails when the conditional UPDATE returns 0 rows (peer instance won the race)", async () => {
    // Race scenario: checkout already inserted the row at pending; two
    // cold-started webhook instances both observe pending + try to
    // transition to paid. The first one's UPDATE applies (filtered on
    // status='pending'). The second one's UPDATE matches 0 rows because
    // the status is now 'paid'. The second must NOT fire a duplicate
    // paid email.

    // Insert collides with the existing pending row.
    paymentsInsert.mockResolvedValueOnce({
      error: { code: "23505", message: "duplicate key value" },
      data: null,
    });
    // SELECT sees the pending row (current status at read time).
    paymentsReadMaybeSingle.mockResolvedValueOnce({
      data: { status: "pending" },
      error: null,
    });
    // UPDATE filtered on status='pending' affects 0 rows (peer beat us).
    paymentsUpdateSelect.mockResolvedValueOnce({ data: [], error: null });

    await reconcile(makeIntent("pi_race_loser", "paid"));

    // The losing branch must short-circuit before any email side-effect.
    expect(sendOrderConfirmationMock).not.toHaveBeenCalled();
    expect(sendOperatorOrderNotificationMock).not.toHaveBeenCalled();
    // No history row written either — credit was applied by the peer.
    expect(orderStatusHistoryInsert).not.toHaveBeenCalled();
  });

  it("fires paid emails exactly once when the conditional UPDATE returns 1 row (we won the race)", async () => {
    // Same race, but THIS instance's UPDATE went through.
    paymentsInsert.mockResolvedValueOnce({
      error: { code: "23505", message: "duplicate key value" },
      data: null,
    });
    paymentsReadMaybeSingle.mockResolvedValueOnce({
      data: { status: "pending" },
      error: null,
    });
    paymentsUpdateSelect.mockResolvedValueOnce({
      data: [{ id: "payment-uuid-1" }],
      error: null,
    });

    await reconcile(makeIntent("pi_race_winner", "paid"));

    expect(sendOrderConfirmationMock).toHaveBeenCalledTimes(1);
    expect(sendOperatorOrderNotificationMock).toHaveBeenCalledTimes(1);
    // History row WAS written for the winning UPDATE.
    expect(orderStatusHistoryInsert).toHaveBeenCalledTimes(1);
  });

  it("UPDATE chain includes .eq('status', currentStatus) so the CAS is atomic at the SQL layer", async () => {
    paymentsInsert.mockResolvedValueOnce({
      error: { code: "23505", message: "duplicate key value" },
      data: null,
    });
    paymentsReadMaybeSingle.mockResolvedValueOnce({
      data: { status: "pending" },
      error: null,
    });
    paymentsUpdateSelect.mockResolvedValueOnce({
      data: [{ id: "payment-uuid-2" }],
      error: null,
    });

    await reconcile(makeIntent("pi_cas_atom", "paid"));

    // The .eq() builder should be called with ("status", "pending") at
    // least once on the UPDATE chain. The first two .eq() calls scope
    // to (provider, provider_intent_id); the third is the CAS gate.
    const eqCalls = paymentsUpdateEq.mock.calls;
    const statusEq = eqCalls.find(
      ([col, val]) => col === "status" && val === "pending",
    );
    expect(statusEq).toBeDefined();
  });
});

describe("firePaidEmails — fresh-insert happy path (regression guard)", () => {
  beforeEach(() => {
    resetReconciliationLedger();
    resetAllMocks();
  });

  it("fires both customer + operator paid emails after a successful fresh insert", async () => {
    ordersHeaderMaybeSingle.mockResolvedValueOnce({
      data: {
        display_id: "VC-FRESH001",
        email: "fresh@example.com",
        total_cents: 9999,
      },
      error: null,
    });
    orderItemsEq.mockResolvedValueOnce({
      data: [
        { name_snapshot: "Cagrisema Bundle", quantity: 1, unit_price_cents: 9999 },
      ],
      error: null,
    });

    await reconcile(makeIntent("pi_fresh_1", "paid"));

    expect(sendOrderConfirmationMock).toHaveBeenCalledTimes(1);
    expect(sendOperatorOrderNotificationMock).toHaveBeenCalledTimes(1);
    expect(sendOperatorOrderNotificationMock.mock.calls[0]?.[0]).toEqual(
      expect.objectContaining({
        event: "paid",
        displayId: "VC-FRESH001",
        totalCents: 9999,
        rail: "btcpay",
        customerEmail: "fresh@example.com",
      }),
    );
  });
});
