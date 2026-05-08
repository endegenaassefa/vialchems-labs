/**
 * Webhook reconciliation. Idempotent by intent.id. Persists state transitions
 * to a domain log; Phase 10 wires this to Supabase order_status_history. For
 * now: in-memory ledger so tests assert determinism.
 *
 * Iron Law 2.5: reconciliation must be idempotent. A duplicate webhook
 * delivery (Plaid retries on non-2xx; BTCPay retries on non-2xx) must
 * produce the same end state and a no-op signal so we don't double-credit.
 */
import type { PaymentIntent, PaymentStatus } from './types';

export interface ReconcileResult {
  applied: boolean;
  reason?:
    | 'no_intent'
    | 'already_at_status'
    | 'invalid_transition'
    | 'applied_paid'
    | 'applied_failed'
    | 'applied_authorized'
    | 'applied_pending'
    | 'applied_refunded';
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

const TERMINAL: PaymentStatus[] = ['paid', 'failed', 'refunded'];

function isTerminal(s: PaymentStatus): boolean {
  return TERMINAL.includes(s);
}

const VALID_TRANSITIONS: Record<PaymentStatus, PaymentStatus[]> = {
  pending: ['pending', 'authorized', 'paid', 'failed'],
  authorized: ['authorized', 'paid', 'failed'],
  paid: ['paid', 'refunded'],
  failed: ['failed'],
  refunded: ['refunded'],
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
    return { applied: false, reason: 'no_intent' };
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
      reason: `applied_${intent.status}` as ReconcileResult['reason'],
      toStatus: intent.status,
    };
  }

  if (existing.status === intent.status) {
    return {
      applied: false,
      reason: 'already_at_status',
      fromStatus: existing.status,
      toStatus: intent.status,
    };
  }

  if (!canTransition(existing.status, intent.status)) {
    return {
      applied: false,
      reason: 'invalid_transition',
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
    reason: `applied_${intent.status}` as ReconcileResult['reason'],
    fromStatus: existing.status,
    toStatus: intent.status,
  };
}

export function isTerminalStatus(s: PaymentStatus): boolean {
  return isTerminal(s);
}
