/**
 * Reconciliation idempotency tests. Iron Law 2.5: webhook handlers must be
 * idempotent. A duplicate delivery cannot double-apply.
 *
 * Phase 3.2 (v5): reconcile() is async now (durable Supabase write before
 * cache mutate). When serviceSupabase() returns null (Day-1 default), these
 * tests exercise the pure-cache path.
 */
import { beforeEach, describe, expect, it, vi } from "vitest";

vi.mock("@/lib/supabase", () => ({
  serviceSupabase: () => null,
  browserSupabase: () => null,
  _resetSupabaseCachesForTests: () => {},
}));

import {
  getReconciliationLedger,
  isTerminalStatus,
  reconcile,
  resetReconciliationLedger,
} from "@/lib/payments/reconciliation";
import type { PaymentIntent, PaymentStatus } from "@/lib/payments/types";

function makeIntent(
  id: string,
  status: PaymentStatus,
  overrides: Partial<PaymentIntent> = {},
): PaymentIntent {
  const ts = "2026-05-08T12:00:00.000Z";
  return {
    id,
    provider: "btcpay",
    method: "crypto",
    amountCents: 4590,
    currency: "USD",
    status,
    metadata: {},
    createdAt: ts,
    updatedAt: ts,
    ...overrides,
  };
}

describe("reconcile", () => {
  beforeEach(() => resetReconciliationLedger());

  it("returns no_intent when payload is null", async () => {
    const result = await reconcile(null);
    expect(result.applied).toBe(false);
    expect(result.reason).toBe("no_intent");
  });

  it("applies the first sighting of an intent", async () => {
    const result = await reconcile(makeIntent("pi_1", "pending"));
    expect(result.applied).toBe(true);
    expect(result.toStatus).toBe("pending");
    expect(getReconciliationLedger().get("pi_1")?.applied).toBe(1);
  });

  it("is idempotent on duplicate-status delivery", async () => {
    await reconcile(makeIntent("pi_1", "paid"));
    const second = await reconcile(makeIntent("pi_1", "paid"));
    expect(second.applied).toBe(false);
    expect(second.reason).toBe("already_at_status");
    expect(getReconciliationLedger().get("pi_1")?.applied).toBe(1);
  });

  it("applies forward transitions: pending → paid", async () => {
    await reconcile(makeIntent("pi_1", "pending"));
    const second = await reconcile(makeIntent("pi_1", "paid"));
    expect(second.applied).toBe(true);
    expect(second.fromStatus).toBe("pending");
    expect(second.toStatus).toBe("paid");
  });

  it("applies pending → authorized → paid sequence", async () => {
    await reconcile(makeIntent("pi_1", "pending"));
    await reconcile(makeIntent("pi_1", "authorized"));
    const final = await reconcile(makeIntent("pi_1", "paid"));
    expect(final.applied).toBe(true);
    expect(getReconciliationLedger().get("pi_1")?.status).toBe("paid");
    expect(getReconciliationLedger().get("pi_1")?.applied).toBe(3);
  });

  it("rejects invalid backward transition: paid → pending", async () => {
    await reconcile(makeIntent("pi_1", "paid"));
    const back = await reconcile(makeIntent("pi_1", "pending"));
    expect(back.applied).toBe(false);
    expect(back.reason).toBe("invalid_transition");
    // Ledger state should remain at paid.
    expect(getReconciliationLedger().get("pi_1")?.status).toBe("paid");
  });

  it("rejects invalid backward transition: failed → pending", async () => {
    await reconcile(makeIntent("pi_1", "failed"));
    const back = await reconcile(makeIntent("pi_1", "pending"));
    expect(back.applied).toBe(false);
    expect(back.reason).toBe("invalid_transition");
  });

  it("allows paid → refunded", async () => {
    await reconcile(makeIntent("pi_1", "paid"));
    const refunded = await reconcile(makeIntent("pi_1", "refunded"));
    expect(refunded.applied).toBe(true);
    expect(refunded.toStatus).toBe("refunded");
  });

  it("isolates intents by id", async () => {
    await reconcile(makeIntent("pi_1", "paid"));
    const second = await reconcile(makeIntent("pi_2", "pending"));
    expect(second.applied).toBe(true);
    expect(getReconciliationLedger().get("pi_1")?.status).toBe("paid");
    expect(getReconciliationLedger().get("pi_2")?.status).toBe("pending");
  });

  it("isTerminalStatus identifies terminal states", () => {
    expect(isTerminalStatus("paid")).toBe(true);
    expect(isTerminalStatus("failed")).toBe(true);
    expect(isTerminalStatus("refunded")).toBe(true);
    expect(isTerminalStatus("pending")).toBe(false);
    expect(isTerminalStatus("authorized")).toBe(false);
  });
});
