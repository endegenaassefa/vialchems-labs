/**
 * Phase 3.2 (v5) — durable idempotency + JurisdictionalGuardError barrel export.
 *
 * Audit H2 STILL-APPLIES: lib/payments/reconciliation.ts ledger is a
 * `new Map<string, LedgerEntry>()` — in-memory only. In multi-instance
 * Vercel serverless two concurrent webhook deliveries to different instances
 * can both apply because they don't share the Map. The `payments` table at
 * supabase/migrations/20260510000001_init.sql:263-277 has
 * `unique (provider, provider_intent_id)`. THAT is the source-of-truth for
 * idempotency; the Map is now only a fast-path cache.
 *
 * Audit M23 STILL-APPLIES: JurisdictionalGuardError is defined in
 * lib/payments/reconciliation.ts but NOT re-exported via lib/payments/index.ts.
 * Webhook callers should be able to `import { JurisdictionalGuardError } from
 * "@/lib/payments"` and catch the typed error.
 */
import {
  afterEach,
  beforeEach,
  describe,
  expect,
  it,
  vi,
  type MockInstance,
} from "vitest";

// Mocked Supabase shape. The mock is hoisted by vi.mock so it must be set up
// before importing reconciliation.
const paymentsInsertMock = vi.fn();
const paymentsSelectMock = vi.fn();
const paymentsEqMock = vi.fn();
const paymentsMaybeSingleMock = vi.fn();
const paymentsUpdateMock = vi.fn();
const paymentsUpdateEqMock = vi.fn();
const orderHistoryInsertMock = vi.fn();
const ordersSelectMock = vi.fn();
const ordersEqMock = vi.fn();
const ordersMaybeSingleMock = vi.fn();

const fromMock = vi.fn((table: string) => {
  if (table === "payments") {
    return {
      insert: paymentsInsertMock,
      select: paymentsSelectMock,
      update: paymentsUpdateMock,
    };
  }
  if (table === "order_status_history") {
    return { insert: orderHistoryInsertMock };
  }
  if (table === "orders") {
    return { select: ordersSelectMock };
  }
  throw new Error(`unexpected table: ${table}`);
});

const fakeSupabase = { from: fromMock };
let serviceClientReturn: typeof fakeSupabase | null = fakeSupabase;
let lastUpdateResult: { error: unknown; data: unknown } = {
  error: null,
  data: null,
};

vi.mock("@/lib/supabase", () => ({
  serviceSupabase: () => serviceClientReturn,
  browserSupabase: () => null,
  _resetSupabaseCachesForTests: () => {},
}));

// C5 (Phase 14): reconcile() captures history-row failures to Sentry instead
// of throwing. Mock captureException so tests can assert the soft-fail path.
// vi.hoisted because vi.mock is hoisted above this file's top-level decls.
const { captureExceptionMock } = vi.hoisted(() => ({
  captureExceptionMock: vi.fn(),
}));
vi.mock("@/lib/sentry", () => ({
  captureException: captureExceptionMock,
  captureMessage: vi.fn(),
  beforeSend: vi.fn(),
}));

// Imports MUST be after the vi.mock call so the alias resolves to the mock.
import {
  reconcile,
  resetReconciliationLedger,
  getReconciliationLedger,
} from "@/lib/payments/reconciliation";
import { JurisdictionalGuardError as JGE_FromBarrel } from "@/lib/payments";
import type { PaymentIntent, PaymentStatus } from "@/lib/payments/types";

function makeIntent(
  id: string,
  status: PaymentStatus,
  overrides: Partial<PaymentIntent> = {},
): PaymentIntent {
  const ts = "2026-05-20T12:00:00.000Z";
  return {
    id,
    provider: "btcpay",
    method: "crypto",
    amountCents: 4590,
    currency: "USD",
    status,
    metadata: { order_id: "11111111-1111-1111-1111-111111111111" },
    createdAt: ts,
    updatedAt: ts,
    externalId: `inv_${id}`,
    ...overrides,
  };
}

function resetSupabaseMocks(): void {
  paymentsInsertMock.mockReset();
  paymentsSelectMock.mockReset();
  paymentsEqMock.mockReset();
  paymentsMaybeSingleMock.mockReset();
  paymentsUpdateMock.mockReset();
  paymentsUpdateEqMock.mockReset();
  orderHistoryInsertMock.mockReset();
  ordersSelectMock.mockReset();
  ordersEqMock.mockReset();
  ordersMaybeSingleMock.mockReset();
  captureExceptionMock.mockReset();
  fromMock.mockClear();

  // Default-happy: payments insert succeeds with no error; order_status_history
  // insert succeeds. Read paths return no existing row.
  paymentsInsertMock.mockResolvedValue({ error: null, data: null });
  orderHistoryInsertMock.mockResolvedValue({ error: null, data: null });
  paymentsMaybeSingleMock.mockResolvedValue({ data: null, error: null });
  paymentsEqMock.mockImplementation(() => ({
    eq: paymentsEqMock,
    maybeSingle: paymentsMaybeSingleMock,
  }));
  paymentsSelectMock.mockReturnValue({ eq: paymentsEqMock });

  // B2: update().eq().eq() chain. Each .eq() returns a thenable chain that
  // resolves to lastUpdateResult so a single test can override the resolved
  // value before invoking reconcile().
  lastUpdateResult = { error: null, data: null };
  const updateChain = {
    eq: paymentsUpdateEqMock,
    then(resolve: (v: typeof lastUpdateResult) => unknown) {
      return Promise.resolve(lastUpdateResult).then(resolve);
    },
  };
  paymentsUpdateEqMock.mockImplementation(() => updateChain);
  paymentsUpdateMock.mockReturnValue(updateChain);

  // B1: orders.select('total_cents').eq('id', uuid).maybeSingle() returns null
  // by default; tests opt in to hydration by setting ordersMaybeSingleMock
  // explicitly.
  ordersMaybeSingleMock.mockResolvedValue({ data: null, error: null });
  ordersEqMock.mockImplementation(() => ({
    maybeSingle: ordersMaybeSingleMock,
  }));
  ordersSelectMock.mockReturnValue({ eq: ordersEqMock });
}

describe("JurisdictionalGuardError barrel export (audit M23)", () => {
  it("re-exports JurisdictionalGuardError from @/lib/payments", () => {
    expect(JGE_FromBarrel).toBeDefined();
    const err = new JGE_FromBarrel("CA", "US", "test reason");
    expect(err).toBeInstanceOf(Error);
    expect(err.name).toBe("JurisdictionalGuardError");
    expect(err.message).toBe("test reason");
    expect(err.stateCode).toBe("CA");
    expect(err.countryCode).toBe("US");
  });
});

describe("reconcile() durable Supabase persistence (audit H2)", () => {
  beforeEach(() => {
    resetReconciliationLedger();
    resetSupabaseMocks();
    serviceClientReturn = fakeSupabase;
  });

  afterEach(() => {
    serviceClientReturn = fakeSupabase;
  });

  it("first reconcile inserts to payments and returns applied:true", async () => {
    const intent = makeIntent("pi_persist_1", "paid");
    const result = await reconcile(intent);

    expect(result.applied).toBe(true);
    expect(paymentsInsertMock).toHaveBeenCalledTimes(1);
    const inserted = paymentsInsertMock.mock.calls[0]?.[0] as Record<
      string,
      unknown
    >;
    expect(inserted.provider).toBe("btcpay");
    expect(inserted.provider_intent_id).toBe("inv_pi_persist_1");
    expect(inserted.amount_cents).toBe(4590);
    expect(inserted.currency).toBe("USD");
    expect(inserted.status).toBe("paid");
  });

  it("second reconcile with same intent: unique-violation (23505) returns applied:false, reason:already_processed", async () => {
    // Simulate cold-start: in-memory cache is empty, but another instance
    // already wrote the row, so the unique constraint trips.
    paymentsInsertMock.mockResolvedValueOnce({
      error: { code: "23505", message: "duplicate key value" },
      data: null,
    });

    const intent = makeIntent("pi_persist_2", "paid");
    const result = await reconcile(intent);

    expect(result.applied).toBe(false);
    expect(result.reason).toBe("already_processed");
    expect(paymentsInsertMock).toHaveBeenCalledTimes(1);
  });

  it("non-23505 Supabase errors surface to caller", async () => {
    paymentsInsertMock.mockResolvedValueOnce({
      error: { code: "08006", message: "connection_failure" },
      data: null,
    });

    const intent = makeIntent("pi_persist_3", "paid");
    await expect(reconcile(intent)).rejects.toThrow(/payments_persist_failed/);
  });

  it("on successful paid transition with order_id metadata, inserts to order_status_history", async () => {
    const intent = makeIntent("pi_persist_4", "paid");
    const result = await reconcile(intent);

    expect(result.applied).toBe(true);
    expect(orderHistoryInsertMock).toHaveBeenCalledTimes(1);
    const history = orderHistoryInsertMock.mock.calls[0]?.[0] as Record<
      string,
      unknown
    >;
    expect(history.order_id).toBe("11111111-1111-1111-1111-111111111111");
    expect(history.to_status).toBe("paid");
  });

  it("does not write order_status_history for non-paid statuses", async () => {
    const intent = makeIntent("pi_persist_5", "pending");
    await reconcile(intent);
    expect(orderHistoryInsertMock).not.toHaveBeenCalled();
  });

  it("does not write order_status_history when metadata.order_id is missing", async () => {
    const intent = makeIntent("pi_persist_6", "paid", { metadata: {} });
    await reconcile(intent);
    expect(orderHistoryInsertMock).not.toHaveBeenCalled();
  });

  it("falls back to in-memory-only when serviceSupabase() returns null (Day-1)", async () => {
    serviceClientReturn = null;
    const intent = makeIntent("pi_persist_7", "paid");
    const result = await reconcile(intent);
    expect(result.applied).toBe(true);
    // No Supabase calls at all.
    expect(paymentsInsertMock).not.toHaveBeenCalled();
    expect(orderHistoryInsertMock).not.toHaveBeenCalled();
    // Cache still populated for fast-path idempotency.
    expect(getReconciliationLedger().get("pi_persist_7")?.status).toBe("paid");
  });
});

describe("reconcile() in-memory cache is a fast-path (audit H2)", () => {
  beforeEach(() => {
    resetReconciliationLedger();
    resetSupabaseMocks();
    serviceClientReturn = fakeSupabase;
  });

  it("repeat reconcile within process hits cache without roundtripping Supabase a second time", async () => {
    const intent = makeIntent("pi_cache_1", "paid");
    await reconcile(intent);
    expect(paymentsInsertMock).toHaveBeenCalledTimes(1);

    // Second call with the same intent at the same status: cache says
    // already_at_status, no second Supabase write.
    const second = await reconcile(intent);
    expect(second.applied).toBe(false);
    expect(paymentsInsertMock).toHaveBeenCalledTimes(1);
  });

  it("forward transition within process writes a new payments row (paid is the credited state)", async () => {
    const pending = makeIntent("pi_cache_2", "pending");
    await reconcile(pending);
    expect(paymentsInsertMock).toHaveBeenCalledTimes(1);

    const paid = makeIntent("pi_cache_2", "paid");
    await reconcile(paid);
    // The transition is a state update — second insert attempted. Since the
    // mock returns no-error, it succeeds. The order_status_history row also
    // fires for the paid transition.
    expect(paymentsInsertMock).toHaveBeenCalledTimes(2);
    expect(orderHistoryInsertMock).toHaveBeenCalledTimes(1);
  });

  it("cold-start: empty cache + existing Supabase row hydrates idempotently", async () => {
    // Simulate a process that boots cold and receives a duplicate webhook
    // delivery — the row already exists in payments (peer instance wrote it).
    paymentsInsertMock.mockResolvedValueOnce({
      error: { code: "23505", message: "duplicate key value" },
      data: null,
    });

    const intent = makeIntent("pi_cold_1", "paid");
    const result = await reconcile(intent);
    expect(result.applied).toBe(false);
    expect(result.reason).toBe("already_processed");

    // Subsequent call within this process hits the in-memory cache.
    const second = await reconcile(intent);
    expect(second.applied).toBe(false);
    // No second Supabase write attempt — cache short-circuits.
    expect(paymentsInsertMock).toHaveBeenCalledTimes(1);
  });
});

describe("reconcile() preserves existing transition semantics", () => {
  beforeEach(() => {
    resetReconciliationLedger();
    resetSupabaseMocks();
    serviceClientReturn = null; // Use the pure cache path for these.
  });

  it("returns no_intent when payload is null", async () => {
    const result = await reconcile(null);
    expect(result.applied).toBe(false);
    expect(result.reason).toBe("no_intent");
  });

  it("rejects paid -> pending as invalid_transition (preserved)", async () => {
    await reconcile(makeIntent("pi_legacy_1", "paid"));
    const back = await reconcile(makeIntent("pi_legacy_1", "pending"));
    expect(back.applied).toBe(false);
    expect(back.reason).toBe("invalid_transition");
  });
});

describe("reconcile() durable layer guardrails", () => {
  beforeEach(() => {
    resetReconciliationLedger();
    resetSupabaseMocks();
    serviceClientReturn = fakeSupabase;
  });

  it("skips durable write for zelle provider (manual settlement, not in payments check constraint)", async () => {
    const intent = makeIntent("pi_zelle_1", "paid", {
      provider: "zelle",
      method: "zelle",
    });
    const result = await reconcile(intent);
    expect(result.applied).toBe(true);
    expect(paymentsInsertMock).not.toHaveBeenCalled();
    expect(orderHistoryInsertMock).not.toHaveBeenCalled();
  });

  it("B1: hydrates amountCents from orders.total_cents when intent.amountCents is 0", async () => {
    // BTCPay (btcpay.ts:350) and Plaid (plaid.ts:483) intentionally emit
    // amountCents=0 because the authoritative amount lives in the order row.
    // The reconciler MUST hydrate from orders.total_cents before persisting,
    // otherwise the durable layer is silently skipped and cross-instance
    // idempotency collapses to in-memory only.
    ordersMaybeSingleMock.mockResolvedValueOnce({
      data: { total_cents: 7250 },
      error: null,
    });

    const intent = makeIntent("pi_b1_hydrate_1", "paid", { amountCents: 0 });
    const result = await reconcile(intent);

    expect(result.applied).toBe(true);
    expect(paymentsInsertMock).toHaveBeenCalledTimes(1);
    const inserted = paymentsInsertMock.mock.calls[0]?.[0] as Record<
      string,
      unknown
    >;
    expect(inserted.amount_cents).toBe(7250);
  });

  it("B1: skips durable write when amountCents is 0 AND order row cannot be hydrated", async () => {
    // Defensive: if the orders row is missing or has zero total, we cannot
    // satisfy the payments.amount_cents check (> 0), so skip the durable
    // write rather than throw. Cache still tracks state.
    ordersMaybeSingleMock.mockResolvedValueOnce({ data: null, error: null });
    const intent = makeIntent("pi_b1_skip_1", "paid", { amountCents: 0 });
    const result = await reconcile(intent);
    expect(result.applied).toBe(true);
    expect(paymentsInsertMock).not.toHaveBeenCalled();
  });

  it("skips durable write when no externalId AND no intent.id (defensive)", async () => {
    // This is an artificial edge — intent.id is normally always populated by
    // the adapter. Construct it explicitly to exercise the guard.
    const intent = makeIntent("", "paid", { externalId: undefined });
    intent.id = "";
    const result = await reconcile(intent);
    expect(result.applied).toBe(true);
    expect(paymentsInsertMock).not.toHaveBeenCalled();
  });

  it("C5: order_status_history insert errors are captured to Sentry, NOT thrown (payment write preserved)", async () => {
    // Pre-Phase-14 bug: history-insert failure threw, causing webhook to
    // return 500. Provider retried; second delivery hit 23505 on payments
    // (already inserted), code returned "duplicate" without re-attempting
    // the history insert → permanent forensic gap. Phase 14 C5 fix: capture
    // to Sentry but do NOT throw; the payment row is the durable
    // correctness primitive, history is observability.
    orderHistoryInsertMock.mockResolvedValueOnce({
      error: { code: "08006", message: "history_db_down" },
      data: null,
    });
    const intent = makeIntent("pi_c5_hist_err", "paid");

    const result = await reconcile(intent);

    expect(result.applied).toBe(true);
    expect(captureExceptionMock).toHaveBeenCalledTimes(1);
    const [capturedErr, capturedCtx] = captureExceptionMock.mock.calls[0] ?? [];
    expect((capturedErr as Error).message).toMatch(
      /order_status_history_persist_failed/,
    );
    expect((capturedCtx as { tags?: Record<string, string> })?.tags).toEqual(
      expect.objectContaining({
        route: "payments_reconcile",
        provider: "btcpay",
      }),
    );
  });

  it("C5: history insert succeeds → captureException NOT called (happy path)", async () => {
    const intent = makeIntent("pi_c5_hist_ok", "paid");
    const result = await reconcile(intent);
    expect(result.applied).toBe(true);
    expect(captureExceptionMock).not.toHaveBeenCalled();
  });

  it("populates method_details.external_id as null when intent.externalId is undefined", async () => {
    // Edge: a future adapter could omit externalId. We fall back to intent.id
    // for the unique-constraint key and serialize null into method_details
    // so the row still satisfies the schema.
    const intent = makeIntent("pi_no_ext_1", "paid", {
      externalId: undefined,
    });
    const result = await reconcile(intent);
    expect(result.applied).toBe(true);
    expect(paymentsInsertMock).toHaveBeenCalledTimes(1);
    const inserted = paymentsInsertMock.mock.calls[0]?.[0] as {
      provider_intent_id: string;
      method_details: { external_id: string | null };
    };
    expect(inserted.provider_intent_id).toBe("pi_no_ext_1");
    expect(inserted.method_details.external_id).toBeNull();
  });

  it("forward transition (pending -> paid) returns already_processed when peer wrote credit row at the SAME target status", async () => {
    // First call (pending) succeeds normally.
    await reconcile(makeIntent("pi_race_1", "pending"));
    expect(paymentsInsertMock).toHaveBeenCalledTimes(1);

    // Forward transition to paid: simulate peer already wrote at status=paid.
    // Insert collides (23505); SELECT returns existing row already at "paid";
    // no UPDATE needed → reason="already_processed".
    paymentsInsertMock.mockResolvedValueOnce({
      error: { code: "23505", message: "duplicate key value" },
      data: null,
    });
    paymentsMaybeSingleMock.mockResolvedValueOnce({
      data: { status: "paid" },
      error: null,
    });
    const result = await reconcile(makeIntent("pi_race_1", "paid"));
    expect(result.applied).toBe(false);
    expect(result.reason).toBe("already_processed");
    expect(result.fromStatus).toBe("pending");
    expect(result.toStatus).toBe("paid");
    // No UPDATE should have fired — peer already had the row at the target.
    expect(paymentsUpdateMock).not.toHaveBeenCalled();
  });
});

describe("reconcile() — B2 update-on-conflict (paid orders must not stick in pending)", () => {
  beforeEach(() => {
    resetReconciliationLedger();
    resetSupabaseMocks();
    serviceClientReturn = fakeSupabase;
  });

  it("B2: when checkout already inserted the row at pending, reconcile(paid) UPDATES the row to paid", async () => {
    // Production scenario: app/api/checkout/orders/route.ts already wrote a
    // payments row with provider_intent_id at status='pending' (line 352).
    // When the webhook later reconciles with status='paid', the INSERT path
    // hits 23505 — the OLD code just returned "duplicate" and the pending
    // row stayed pending forever. The fix MUST follow up with an UPDATE
    // and report applied=true so the order actually transitions.
    paymentsInsertMock.mockResolvedValueOnce({
      error: { code: "23505", message: "duplicate key value" },
      data: null,
    });
    paymentsMaybeSingleMock.mockResolvedValueOnce({
      data: { status: "pending" },
      error: null,
    });

    const intent = makeIntent("pi_b2_pending_to_paid", "paid");
    const result = await reconcile(intent);

    expect(result.applied).toBe(true);
    expect(result.reason).toBe("applied_paid");
    expect(paymentsUpdateMock).toHaveBeenCalledTimes(1);
    const updatePayload = paymentsUpdateMock.mock.calls[0]?.[0] as Record<
      string,
      unknown
    >;
    expect(updatePayload.status).toBe("paid");
    expect(updatePayload.amount_cents).toBe(4590);
    expect(orderHistoryInsertMock).toHaveBeenCalledTimes(1);
  });

  it("B2: when row exists at authorized and intent is paid, reconcile UPDATES to paid", async () => {
    paymentsInsertMock.mockResolvedValueOnce({
      error: { code: "23505", message: "duplicate key value" },
      data: null,
    });
    paymentsMaybeSingleMock.mockResolvedValueOnce({
      data: { status: "authorized" },
      error: null,
    });

    const intent = makeIntent("pi_b2_auth_to_paid", "paid");
    const result = await reconcile(intent);

    expect(result.applied).toBe(true);
    expect(paymentsUpdateMock).toHaveBeenCalledTimes(1);
  });

  it("B2: surfaces UPDATE errors so Sentry can capture them", async () => {
    paymentsInsertMock.mockResolvedValueOnce({
      error: { code: "23505", message: "duplicate key value" },
      data: null,
    });
    paymentsMaybeSingleMock.mockResolvedValueOnce({
      data: { status: "pending" },
      error: null,
    });
    lastUpdateResult = {
      error: { code: "08006", message: "connection_failure" },
      data: null,
    };

    const intent = makeIntent("pi_b2_update_err", "paid");
    await expect(reconcile(intent)).rejects.toThrow(/payments_update_failed/);
  });

  /**
   * B2-followup (codex re-review of 5bb0e464): the 0f85c288 UPDATE path on
   * 23505 collision did NOT enforce canTransition(). On a cold-start Vercel
   * instance (empty in-memory ledger), a delayed `failed` or `pending`
   * webhook for an already-`paid` intent would slip past the in-memory
   * transition guard, hit the durable INSERT, get 23505, find the existing
   * `paid` row, see status differs, and UPDATE durable status from `paid`
   * to `failed`. Source-of-truth corruption. The fix: enforce
   * canTransition() on the durable-conflict path before UPDATEing.
   */
  it("B2-followup: rejects durable downgrade (cold-start + Supabase has paid + delayed failed webhook)", async () => {
    paymentsInsertMock.mockResolvedValueOnce({
      error: { code: "23505", message: "duplicate key value" },
      data: null,
    });
    paymentsMaybeSingleMock.mockResolvedValueOnce({
      data: { status: "paid" },
      error: null,
    });

    const intent = makeIntent("pi_b2_followup_downgrade", "failed");
    const result = await reconcile(intent);

    expect(result.applied).toBe(false);
    expect(result.reason).toBe("invalid_transition");
    expect(result.fromStatus).toBe("paid");
    expect(result.toStatus).toBe("failed");
    expect(paymentsUpdateMock).not.toHaveBeenCalled();
  });

  it("B2-followup: rejects durable downgrade paid → pending", async () => {
    paymentsInsertMock.mockResolvedValueOnce({
      error: { code: "23505", message: "duplicate key value" },
      data: null,
    });
    paymentsMaybeSingleMock.mockResolvedValueOnce({
      data: { status: "paid" },
      error: null,
    });

    const intent = makeIntent("pi_b2_followup_downgrade_pending", "pending");
    const result = await reconcile(intent);

    expect(result.applied).toBe(false);
    expect(result.reason).toBe("invalid_transition");
    expect(paymentsUpdateMock).not.toHaveBeenCalled();
  });

  it("B2-followup: rejects refunded → paid downgrade (terminal state)", async () => {
    paymentsInsertMock.mockResolvedValueOnce({
      error: { code: "23505", message: "duplicate key value" },
      data: null,
    });
    paymentsMaybeSingleMock.mockResolvedValueOnce({
      data: { status: "refunded" },
      error: null,
    });

    const intent = makeIntent("pi_b2_followup_refunded", "paid");
    const result = await reconcile(intent);

    expect(result.applied).toBe(false);
    expect(result.reason).toBe("invalid_transition");
    expect(paymentsUpdateMock).not.toHaveBeenCalled();
  });

  it("B2-followup: VALID transitions on cold-start still apply (pending → paid still works)", async () => {
    paymentsInsertMock.mockResolvedValueOnce({
      error: { code: "23505", message: "duplicate key value" },
      data: null,
    });
    paymentsMaybeSingleMock.mockResolvedValueOnce({
      data: { status: "pending" },
      error: null,
    });

    const intent = makeIntent("pi_b2_followup_valid_transition", "paid");
    const result = await reconcile(intent);

    expect(result.applied).toBe(true);
    expect(paymentsUpdateMock).toHaveBeenCalledTimes(1);
  });
});

// Reference the mock helper to keep TS happy.
type _Mock = MockInstance;
void (null as unknown as _Mock);
