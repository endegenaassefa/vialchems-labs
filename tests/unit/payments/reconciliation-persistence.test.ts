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
const orderHistoryInsertMock = vi.fn();

const fromMock = vi.fn((table: string) => {
  if (table === "payments") {
    return {
      insert: paymentsInsertMock,
      select: paymentsSelectMock,
    };
  }
  if (table === "order_status_history") {
    return { insert: orderHistoryInsertMock };
  }
  throw new Error(`unexpected table: ${table}`);
});

const fakeSupabase = { from: fromMock };
let serviceClientReturn: typeof fakeSupabase | null = fakeSupabase;

vi.mock("@/lib/supabase", () => ({
  serviceSupabase: () => serviceClientReturn,
  browserSupabase: () => null,
  _resetSupabaseCachesForTests: () => {},
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
  orderHistoryInsertMock.mockReset();
  fromMock.mockClear();

  // Default-happy: payments insert succeeds with no error; order_status_history
  // insert succeeds. Read path returns no existing row.
  paymentsInsertMock.mockResolvedValue({ error: null, data: null });
  orderHistoryInsertMock.mockResolvedValue({ error: null, data: null });
  paymentsMaybeSingleMock.mockResolvedValue({ data: null, error: null });
  paymentsEqMock.mockImplementation(() => ({
    eq: paymentsEqMock,
    maybeSingle: paymentsMaybeSingleMock,
  }));
  paymentsSelectMock.mockReturnValue({ eq: paymentsEqMock });
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

// Reference the mock helper to keep TS happy.
type _Mock = MockInstance;
void (null as unknown as _Mock);
