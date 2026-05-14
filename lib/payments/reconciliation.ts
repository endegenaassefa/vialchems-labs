/**
 * Webhook reconciliation. Idempotent by intent.id. Persists state transitions
 * to a domain log; Phase 10 wires this to Supabase order_status_history. For
 * now: in-memory ledger so tests assert determinism.
 *
 * Iron Law 2.5: reconciliation must be idempotent. A duplicate webhook
 * delivery (Plaid retries on non-2xx; BTCPay retries on non-2xx) must
 * produce the same end state and a no-op signal so we don't double-credit.
 *
 * Iron Law 2.8 (Phase 10.1 v4 / D15): post-payment Layer 3 jurisdictional
 * guard. assertOrderJurisdictionAllowed() is the final gate before an intent
 * reconciles to a credited state. If the order's shipping address resolves
 * outside the configured shipping jurisdictions, we throw rather than credit.
 */
import { validateShippingAddress } from "@/lib/compliance/jurisdictions";
import type { PaymentIntent, PaymentStatus } from "./types";

export interface ReconcileResult {
  applied: boolean;
  reason?:
    | "no_intent"
    | "already_at_status"
    | "invalid_transition"
    | "applied_paid"
    | "applied_failed"
    | "applied_authorized"
    | "applied_pending"
    | "applied_refunded";
  fromStatus?: PaymentStatus;
  toStatus?: PaymentStatus;
}

interface LedgerEntry {
  intentId: string;
  status: PaymentStatus;
  updatedAt: string;
  applied: number; // monotonic counter for tests
}

const ledger = new Map<string, LedgerEntry>();

/**
 * Test-only: drop the ledger so suites don't bleed state.
 */
export function resetReconciliationLedger(): void {
  ledger.clear();
}

export function getReconciliationLedger(): ReadonlyMap<string, LedgerEntry> {
  return ledger;
}

const TERMINAL: PaymentStatus[] = ["paid", "failed", "refunded"];

function isTerminal(s: PaymentStatus): boolean {
  return TERMINAL.includes(s);
}

const VALID_TRANSITIONS: Record<PaymentStatus, PaymentStatus[]> = {
  pending: ["pending", "authorized", "paid", "failed"],
  authorized: ["authorized", "paid", "failed"],
  paid: ["paid", "refunded"],
  failed: ["failed"],
  refunded: ["refunded"],
};

function canTransition(from: PaymentStatus, to: PaymentStatus): boolean {
  return VALID_TRANSITIONS[from]?.includes(to) ?? false;
}

/**
 * Reconcile an intent against the ledger. Idempotent by intent.id.
 *
 *   - First time we see an intent, record + apply.
 *   - If the new status matches the recorded one, no-op.
 *   - If the new status is a forward transition, apply.
 *   - If the new status is a backward transition (e.g. paid → pending,
 *     duplicate retry of an earlier event), no-op with reason.
 */
export function reconcile(intent: PaymentIntent | null): ReconcileResult {
  if (!intent) {
    return { applied: false, reason: "no_intent" };
  }

  const existing = ledger.get(intent.id);
  if (!existing) {
    ledger.set(intent.id, {
      intentId: intent.id,
      status: intent.status,
      updatedAt: intent.updatedAt,
      applied: 1,
    });
    return {
      applied: true,
      reason: `applied_${intent.status}` as ReconcileResult["reason"],
      toStatus: intent.status,
    };
  }

  if (existing.status === intent.status) {
    return {
      applied: false,
      reason: "already_at_status",
      fromStatus: existing.status,
      toStatus: intent.status,
    };
  }

  if (!canTransition(existing.status, intent.status)) {
    return {
      applied: false,
      reason: "invalid_transition",
      fromStatus: existing.status,
      toStatus: intent.status,
    };
  }

  // Apply: terminal states freeze the ledger entry beyond their own kind.
  ledger.set(intent.id, {
    intentId: intent.id,
    status: intent.status,
    updatedAt: intent.updatedAt,
    applied: existing.applied + 1,
  });
  return {
    applied: true,
    reason: `applied_${intent.status}` as ReconcileResult["reason"],
    fromStatus: existing.status,
    toStatus: intent.status,
  };
}

export function isTerminalStatus(s: PaymentStatus): boolean {
  return isTerminal(s);
}

/**
 * D15 Layer 3 jurisdictional guard. Webhook handlers MUST call this before
 * reconcile() when the intent has reached a credit-bearing status (paid /
 * authorized). If validateShippingAddress rejects the address, throw —
 * the webhook should respond 4xx and the operator should investigate.
 *
 * Layer 3 catches the case where Layers 1 and 2 were spoofed or buggy:
 * an ineligible shipping address that Layer 1 did not gate still hits this
 * guard at credit time.
 */
export class JurisdictionalGuardError extends Error {
  readonly stateCode: string;
  readonly countryCode: string;
  constructor(stateCode: string, countryCode: string, reason: string) {
    super(reason);
    this.name = "JurisdictionalGuardError";
    this.stateCode = stateCode;
    this.countryCode = countryCode;
  }
}

export function assertOrderJurisdictionAllowed(address: {
  countryCode: string;
  stateCode: string;
}): void {
  const result = validateShippingAddress(address);
  if (!result.ok) {
    throw new JurisdictionalGuardError(
      address.stateCode,
      address.countryCode,
      result.reason,
    );
  }
}
