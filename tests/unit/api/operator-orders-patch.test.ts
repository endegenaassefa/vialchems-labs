/**
 * C2 — Operator order PATCH route (P0-3 + P0-4 + P0-5 + P0-6 fixes)
 * (Section 6 super-prompt 2026-05-22).
 *
 * The first C2 wiring (PR #33) shipped four schema/contract bugs that
 * would surface the moment Supabase env vars are provisioned:
 *
 *   P0-3: `payment_verified_at` is written into the mark_paid UPDATE,
 *     but no such column exists on the orders table. UPDATE 500s.
 *
 *   P0-4: audit_log insert uses
 *     { action, actor_email, target_kind, target_id, payload }
 *     but the schema (init.sql:284-298) is
 *     { event_type, customer_id, order_id, details, ip_address,
 *       user_agent }. Insert 500s; Iron Law 2.33 audit lineage gap.
 *
 *   P0-5: mark_paid promises the customer email in the UI ("Triggers
 *     customer + operator 'paid' emails.") but the route never calls
 *     sendOrderConfirmation. The Zelle/bitcoin-direct paid customer
 *     never receives a paid email. Per spec §6 C2 the operator-side
 *     notification IS skipped (operator IS the actor), but the
 *     customer-side MUST fire.
 *
 *   P0-6: mark_paid and mark_shipped don't write order_status_history
 *     rows. Iron Law 2.33 audit lineage requires every state
 *     transition be recorded in the append-only history table.
 *
 * This file owns its own vi.mock boundary for `@/lib/supabase`,
 * `@/lib/operator/auth-guard`, and the three email helpers so we can
 * assert exact call shapes against the live schema.
 */
import { describe, expect, it, beforeEach, vi } from "vitest";

const { sendOrderConfirmationMock, sendOperatorOrderNotificationMock, sendOrderShippedMock } =
  vi.hoisted(() => ({
    sendOrderConfirmationMock: vi.fn(),
    sendOperatorOrderNotificationMock: vi.fn(),
    sendOrderShippedMock: vi.fn(),
  }));

vi.mock("@/lib/email/order-confirmation", () => ({
  sendOrderConfirmation: sendOrderConfirmationMock,
}));
vi.mock("@/lib/email/operator-notification", () => ({
  sendOperatorOrderNotification: sendOperatorOrderNotificationMock,
}));
vi.mock("@/lib/email/order-shipped", () => ({
  sendOrderShipped: sendOrderShippedMock,
}));

const checkOperatorAuthMock = vi.hoisted(() => vi.fn());
vi.mock("@/lib/operator/auth-guard", () => ({
  checkOperatorAuth: checkOperatorAuthMock,
}));

const captureExceptionMock = vi.hoisted(() => vi.fn());
vi.mock("@/lib/sentry", () => ({
  captureException: captureExceptionMock,
  captureMessage: vi.fn(),
  beforeSend: vi.fn(),
}));

// Supabase mock — track every insert + update payload by table.
// PR #36 codex follow-up: the UPDATE chain now applies an atomic
// status filter (eq for mark_paid, neq for mark_shipped) and uses
// .maybeSingle() so a 0-row outcome resolves to data:null without
// throwing. The mock chain returns the same builder for .eq() and
// .neq() so chained filters resolve at .maybeSingle().
const ordersUpdateSingleMock = vi.fn();
const ordersUpdateSelectMock = vi.fn((_cols: string) => ({
  single: ordersUpdateSingleMock,
  maybeSingle: ordersUpdateSingleMock,
}));
const ordersUpdateEqMock: ReturnType<typeof vi.fn> = vi.fn(
  (_col: string, _val: string) => ({
    eq: ordersUpdateEqMock,
    neq: ordersUpdateEqMock,
    select: ordersUpdateSelectMock,
  }),
);
const ordersUpdateMock = vi.fn(
  (_row: Record<string, unknown>) => ({
    eq: ordersUpdateEqMock,
  }),
);
// Separate read-only SELECT chain for the "disambiguate after 0-row
// CAS" path: select("status").eq("display_id", id).maybeSingle().
const ordersReadMaybeSingleMock = vi.fn();
const ordersReadEqMock = vi.fn((_col: string, _val: string) => ({
  maybeSingle: ordersReadMaybeSingleMock,
}));
const ordersReadSelectMock = vi.fn((_cols: string) => ({
  eq: ordersReadEqMock,
}));

const orderItemsEqMock = vi.fn();
const orderItemsSelectMock = vi.fn((_cols: string) => ({ eq: orderItemsEqMock }));

const historyInsertMock = vi.fn();
const auditInsertMock = vi.fn();

const fromMock = vi.fn((table: string) => {
  if (table === "orders") {
    return { update: ordersUpdateMock, select: ordersReadSelectMock };
  }
  if (table === "order_items") return { select: orderItemsSelectMock };
  if (table === "order_status_history") return { insert: historyInsertMock };
  if (table === "audit_log") return { insert: auditInsertMock };
  throw new Error(`unexpected supabase table: ${table}`);
});

const fakeSupabase = { from: fromMock };
let serviceClientReturn: typeof fakeSupabase | null = fakeSupabase;

vi.mock("@/lib/supabase", () => ({
  serviceSupabase: () => serviceClientReturn,
  browserSupabase: () => null,
  _resetSupabaseCachesForTests: () => {},
}));

import { PATCH } from "@/app/api/operator/orders/[id]/route";

const ORDER_UUID = "33333333-3333-3333-3333-333333333333";
const DISPLAY_ID = "VC-OP123456";

function makeReq(body: unknown, headers: Record<string, string> = {}): Request {
  return new Request(`http://test/api/operator/orders/${DISPLAY_ID}`, {
    method: "PATCH",
    headers: { "Content-Type": "application/json", ...headers },
    body: typeof body === "string" ? body : JSON.stringify(body),
  });
}

function makeParams() {
  return { params: Promise.resolve({ id: DISPLAY_ID }) };
}

beforeEach(() => {
  ordersUpdateMock.mockClear();
  ordersUpdateEqMock.mockClear();
  ordersUpdateSelectMock.mockClear();
  ordersUpdateSingleMock.mockReset();
  ordersReadSelectMock.mockClear();
  ordersReadEqMock.mockClear();
  ordersReadMaybeSingleMock.mockReset();
  orderItemsSelectMock.mockClear();
  orderItemsEqMock.mockReset();
  historyInsertMock.mockReset();
  auditInsertMock.mockReset();
  fromMock.mockClear();
  sendOrderConfirmationMock.mockReset();
  sendOperatorOrderNotificationMock.mockReset();
  sendOrderShippedMock.mockReset();
  checkOperatorAuthMock.mockReset();
  captureExceptionMock.mockReset();
  serviceClientReturn = fakeSupabase;

  checkOperatorAuthMock.mockResolvedValue({
    state: "authorized",
    email: "endegenaassefa2@gmail.com",
  });
  // Default-happy: UPDATE returns the order row with id (UUID) + email
  // + total_cents + payment_provider so the side-effects can address
  // them.
  ordersUpdateSingleMock.mockResolvedValue({
    data: {
      id: ORDER_UUID,
      display_id: DISPLAY_ID,
      email: "buyer@example.com",
      total_cents: 12300,
      payment_provider: "zelle",
      carrier: null,
      tracking_number: null,
    },
    error: null,
  });
  historyInsertMock.mockResolvedValue({ error: null, data: null });
  auditInsertMock.mockResolvedValue({ error: null, data: null });
  orderItemsEqMock.mockResolvedValue({
    data: [
      { name_snapshot: "BPC-157, 5mg", quantity: 2, unit_price_cents: 4500 },
    ],
    error: null,
  });
  sendOrderConfirmationMock.mockResolvedValue({
    ok: true,
    id: "stub:order-confirmation:fake",
    stub: true,
  });
  sendOrderShippedMock.mockResolvedValue({
    ok: true,
    id: "stub:order-shipped:fake",
    stub: true,
  });
});

describe("PATCH /api/operator/orders/[id] — P0-3: payment_verified_at column gone", () => {
  it("mark_paid UPDATE body does NOT include payment_verified_at", async () => {
    const res = await PATCH(makeReq({ action: "mark_paid" }) as never, makeParams() as never);
    expect(res.status).toBe(200);

    expect(ordersUpdateMock).toHaveBeenCalledTimes(1);
    const update = ordersUpdateMock.mock.calls[0]?.[0] as Record<string, unknown>;
    // P0-3: payment_verified_at column does not exist on orders.
    expect(update).not.toHaveProperty("payment_verified_at");
    // Status flip and operator_notes are the valid fields.
    expect(update.status).toBe("paid");
  });
});

describe("PATCH /api/operator/orders/[id] — P0-4: audit_log schema mismatch", () => {
  it("audit_log insert uses event_type + order_id + details (the real schema)", async () => {
    await PATCH(makeReq({ action: "mark_paid" }) as never, makeParams() as never);

    expect(auditInsertMock).toHaveBeenCalledTimes(1);
    const audit = auditInsertMock.mock.calls[0]?.[0] as Record<string, unknown>;
    // Real schema columns (init.sql:284-298)
    expect(audit).toHaveProperty("event_type");
    expect(audit).toHaveProperty("order_id");
    expect(audit).toHaveProperty("details");
    // Old broken columns must NOT appear
    expect(audit).not.toHaveProperty("action");
    expect(audit).not.toHaveProperty("actor_email");
    expect(audit).not.toHaveProperty("target_kind");
    expect(audit).not.toHaveProperty("target_id");
    expect(audit).not.toHaveProperty("payload");

    expect(audit.event_type).toBe("operator.mark_paid");
    expect(audit.order_id).toBe(ORDER_UUID);
    // The operator's email + the action body live inside the details JSON.
    expect((audit.details as Record<string, unknown>).actor_email).toBe(
      "endegenaassefa2@gmail.com",
    );
    expect((audit.details as Record<string, unknown>).action).toBe("mark_paid");
  });
});

describe("PATCH /api/operator/orders/[id] — P0-5: mark_paid fires customer paid email", () => {
  it("calls sendOrderConfirmation with status='paid' and the order header", async () => {
    await PATCH(makeReq({ action: "mark_paid" }) as never, makeParams() as never);

    expect(sendOrderConfirmationMock).toHaveBeenCalledTimes(1);
    const arg = sendOrderConfirmationMock.mock.calls[0]?.[0];
    expect(arg).toEqual(
      expect.objectContaining({
        displayId: DISPLAY_ID,
        customerEmail: "buyer@example.com",
        totalCents: 12300,
        rail: "zelle",
        status: "paid",
      }),
    );
  });

  it("does NOT call sendOperatorOrderNotification on mark_paid (operator is the actor)", async () => {
    // Per super-prompt §6 C2: "operator notification email (item C4)
    // — no, it's the operator doing this; skip".
    await PATCH(makeReq({ action: "mark_paid" }) as never, makeParams() as never);
    expect(sendOperatorOrderNotificationMock).not.toHaveBeenCalled();
  });
});

describe("PATCH /api/operator/orders/[id] — P0-6: order_status_history rows on transitions", () => {
  it("mark_paid inserts order_status_history with to_status='paid'", async () => {
    await PATCH(makeReq({ action: "mark_paid" }) as never, makeParams() as never);

    expect(historyInsertMock).toHaveBeenCalledTimes(1);
    const hist = historyInsertMock.mock.calls[0]?.[0] as Record<string, unknown>;
    expect(hist.order_id).toBe(ORDER_UUID);
    expect(hist.to_status).toBe("paid");
    expect(hist.reason).toMatch(/operator\.mark_paid/);
  });

  it("mark_shipped inserts order_status_history with to_status='shipped'", async () => {
    await PATCH(
      makeReq({
        action: "mark_shipped",
        carrier: "USPS",
        trackingNumber: "9400111202555842710018",
      }) as never,
      makeParams() as never,
    );

    expect(historyInsertMock).toHaveBeenCalledTimes(1);
    const hist = historyInsertMock.mock.calls[0]?.[0] as Record<string, unknown>;
    expect(hist.order_id).toBe(ORDER_UUID);
    expect(hist.to_status).toBe("shipped");
    expect(hist.reason).toMatch(/operator\.mark_shipped/);
  });

  it("add_note does NOT insert a history row (not a state transition)", async () => {
    await PATCH(
      makeReq({ action: "add_note", note: "Lab batch verified" }) as never,
      makeParams() as never,
    );

    expect(historyInsertMock).not.toHaveBeenCalled();
  });
});

describe("PATCH /api/operator/orders/[id] — regression: mark_shipped still fires sendOrderShipped", () => {
  it("mark_shipped sends order-shipped email with tracking", async () => {
    await PATCH(
      makeReq({
        action: "mark_shipped",
        carrier: "FedEx",
        trackingNumber: "775566123344",
      }) as never,
      makeParams() as never,
    );

    expect(sendOrderShippedMock).toHaveBeenCalledTimes(1);
    const arg = sendOrderShippedMock.mock.calls[0]?.[0];
    expect(arg).toEqual(
      expect.objectContaining({
        displayId: DISPLAY_ID,
        customerEmail: "buyer@example.com",
        carrier: "FedEx",
        trackingNumber: "775566123344",
      }),
    );
  });
});

describe("PATCH /api/operator/orders/[id] — codex P2: idempotency + audit error capture", () => {
  it("mark_paid on an already-paid order (0-row CAS) does NOT fire sendOrderConfirmation a second time", async () => {
    // Codex finding: a retried/stale mark_paid click would otherwise
    // pass the display_id .eq() filter and re-fire the customer email.
    // The atomic .eq("status", "awaiting_payment") filter prevents the
    // UPDATE from matching when status is already paid; the route then
    // returns 200 with a skipped signal.
    ordersUpdateSingleMock.mockResolvedValueOnce({ data: null, error: null });
    ordersReadMaybeSingleMock.mockResolvedValueOnce({
      data: { status: "paid" },
      error: null,
    });

    const res = await PATCH(
      makeReq({ action: "mark_paid" }) as never,
      makeParams() as never,
    );
    expect(res.status).toBe(200);
    const body = await res.json();
    expect(body.ok).toBe(true);
    expect(body.skipped).toBe(true);

    expect(sendOrderConfirmationMock).not.toHaveBeenCalled();
    expect(historyInsertMock).not.toHaveBeenCalled();
  });

  it("mark_shipped on an already-shipped order (0-row CAS) does NOT fire sendOrderShipped a second time", async () => {
    ordersUpdateSingleMock.mockResolvedValueOnce({ data: null, error: null });
    ordersReadMaybeSingleMock.mockResolvedValueOnce({
      data: { status: "shipped" },
      error: null,
    });

    const res = await PATCH(
      makeReq({
        action: "mark_shipped",
        carrier: "USPS",
        trackingNumber: "9400111202555842710018",
      }) as never,
      makeParams() as never,
    );
    expect(res.status).toBe(200);
    const body = await res.json();
    expect(body.skipped).toBe(true);

    expect(sendOrderShippedMock).not.toHaveBeenCalled();
    expect(historyInsertMock).not.toHaveBeenCalled();
  });

  it("0-row CAS where the order does not exist at all returns 404", async () => {
    ordersUpdateSingleMock.mockResolvedValueOnce({ data: null, error: null });
    ordersReadMaybeSingleMock.mockResolvedValueOnce({
      data: null,
      error: null,
    });

    const res = await PATCH(
      makeReq({ action: "mark_paid" }) as never,
      makeParams() as never,
    );
    expect(res.status).toBe(404);
  });

  it("captures audit_log INSERT errors (.insert() resolves with {error}, not throw)", async () => {
    auditInsertMock.mockResolvedValueOnce({
      data: null,
      error: { message: "rls_violation_or_invalid_payload" },
    });

    const res = await PATCH(
      makeReq({ action: "mark_paid" }) as never,
      makeParams() as never,
    );
    // The route returns 200 — audit failure must not fail the user's
    // action — but the error must surface to Sentry so we don't
    // silently lose audit rows.
    expect(res.status).toBe(200);
    expect(captureExceptionMock).toHaveBeenCalled();
    const capturedTags = captureExceptionMock.mock.calls
      .map((call) => (call[1] as { tags?: { phase?: string } })?.tags)
      .filter((tags) => tags?.phase === "audit_log");
    expect(capturedTags.length).toBeGreaterThan(0);
  });
});

describe("PATCH /api/operator/orders/[id] — auth-guard contract preserved", () => {
  it("returns 401 when checkOperatorAuth says unauthenticated", async () => {
    checkOperatorAuthMock.mockResolvedValueOnce({ state: "unauthenticated" });
    const res = await PATCH(
      makeReq({ action: "mark_paid" }) as never,
      makeParams() as never,
    );
    expect(res.status).toBe(401);
  });

  it("returns 403 when checkOperatorAuth says forbidden", async () => {
    checkOperatorAuthMock.mockResolvedValueOnce({
      state: "forbidden",
      email: "stranger@example.com",
    });
    const res = await PATCH(
      makeReq({ action: "mark_paid" }) as never,
      makeParams() as never,
    );
    expect(res.status).toBe(403);
  });

  it("returns 503 when Supabase is not configured", async () => {
    serviceClientReturn = null;
    const res = await PATCH(
      makeReq({ action: "mark_paid" }) as never,
      makeParams() as never,
    );
    expect(res.status).toBe(503);
  });
});
