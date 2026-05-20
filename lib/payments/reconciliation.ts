/**
 * Webhook reconciliation. Idempotent by (provider, provider_intent_id).
 *
 * DUAL-PATH DESIGN (Phase 3.2 v5 — closes audit H2):
 *   - Source of truth: Supabase `payments` table, with unique constraint on
 *     (provider, provider_intent_id) at
 *     supabase/migrations/20260510000001_init.sql:276. Two concurrent
 *     webhook deliveries to different Vercel instances can both attempt the
 *     insert; exactly one wins and the other observes Postgres error code
 *     23505 (unique_violation) and exits with reason="already_processed".
 *   - Fast-path cache: in-process `Map<intentId, LedgerEntry>` so that
 *     consecutive webhooks to the SAME warm instance short-circuit before
 *     roundtripping Supabase. The cache is best-effort and may be empty on
 *     cold-start; that's fine — the durable layer catches it.
 *
 * Iron Law 2.5: reconciliation must be idempotent. A duplicate webhook
 * delivery (Plaid retries on non-2xx; BTCPay retries on non-2xx) must produce
 * the same end state and a no-op signal so we don't double-credit.
 *
 * Iron Law 2.8 (Phase 10.1 v4 / D15): post-payment Layer 3 jurisdictional
 * guard. assertOrderJurisdictionAllowed() is the final gate before an intent
 * reconciles to a credited state. If the order's shipping address resolves
 * outside the configured shipping jurisdictions, we throw rather than credit.
 *
 * Iron Law 2.31 (durable reconciliation): cache is a fast-path hint, not a
 * source of truth. Day-1, when REQUIRE_SUPABASE=false, serviceSupabase()
 * returns null and we degrade to cache-only — the same way orders, access,
 * and welcome-sequence degrade.
 */
import { validateShippingAddress } from "@/lib/compliance/jurisdictions";
import { serviceSupabase } from "@/lib/supabase";
import type { PaymentIntent, PaymentProviderId, PaymentStatus } from "./types";

export interface ReconcileResult {
  applied: boolean;
  reason?:
    | "no_intent"
    | "already_at_status"
    | "already_processed"
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
  // VALID_TRANSITIONS is a complete Record<PaymentStatus,...> so the lookup
  // is total — no defensive ?? needed.
  return VALID_TRANSITIONS[from].includes(to);
}

/**
 * Providers allowed by the Supabase payments table check constraint at
 * migration line 266: `provider in ('stub', 'btcpay', 'plaid')`. Zelle is
 * intentionally excluded — Zelle settles manually via staff workflow, not via
 * webhook reconciliation. If a zelle intent ever lands here we skip the
 * durable write rather than synthesize an invalid row.
 */
const SUPABASE_PROVIDER_ALLOWLIST: ReadonlySet<PaymentProviderId> = new Set([
  "stub",
  "btcpay",
  "plaid",
]);

type PersistOutcome =
  | { kind: "applied" }
  | { kind: "duplicate" }
  | { kind: "skipped" };

/**
 * Attempt to insert the reconciled state into Supabase `payments`. The
 * unique constraint on (provider, provider_intent_id) is the cross-instance
 * idempotency primitive. On 23505 we report "duplicate" so the caller can
 * return a no-op without mutating the cache.
 *
 * Returns "skipped" when serviceSupabase() returns null (Day-1
 * REQUIRE_SUPABASE=false) or when required fields are missing — callers
 * fall back to cache-only behavior.
 */
async function persistToSupabase(
  intent: PaymentIntent,
): Promise<PersistOutcome> {
  const sb = serviceSupabase();
  if (!sb) {
    // Day-1 / test default: Supabase not configured. Cache-only path.
    return { kind: "skipped" };
  }

  if (!SUPABASE_PROVIDER_ALLOWLIST.has(intent.provider)) {
    // zelle (or any future non-webhook provider) — durable layer not
    // applicable. Cache-only.
    return { kind: "skipped" };
  }

  // The unique constraint is on (provider, provider_intent_id). The intent
  // model carries externalId (the provider's own invoice/transfer id) and
  // intent.id (our local intent id). Prefer externalId so the constraint
  // dedupes against the provider's actual delivery semantics; fall back to
  // intent.id when no externalId is provided.
  const providerIntentId = intent.externalId ?? intent.id;
  if (!providerIntentId) {
    return { kind: "skipped" };
  }

  // amount_cents has a check (> 0) — adapters that produce zero-amount
  // intents (e.g. some BTCPay events populate amountCents from the order
  // row, not the event itself) would violate the check. Skip durable write
  // rather than throw; the cache still tracks state.
  if (!intent.amountCents || intent.amountCents <= 0) {
    return { kind: "skipped" };
  }

  // order_id is `not null references orders(id)` in the schema. Without it
  // we can't write a payments row. Skip durable write — Phase 3 C3 will
  // wire metadata.order_id on the upstream side.
  const orderUuid = intent.metadata?.order_id;
  if (!orderUuid) {
    return { kind: "skipped" };
  }

  const row = {
    order_id: orderUuid,
    provider: intent.provider,
    provider_intent_id: providerIntentId,
    status: intent.status,
    amount_cents: intent.amountCents,
    currency: intent.currency,
    method_details: {
      method: intent.method,
      external_id: intent.externalId ?? null,
      intent_id: intent.id,
      metadata: intent.metadata,
    },
  };

  const { error } = await sb.from("payments").insert(row);

  if (error) {
    if (error.code === "23505") {
      // Cross-instance duplicate. Another worker already credited this
      // payment. Return without mutating the cache so observable state
      // (applied=false, reason="already_processed") matches reality.
      return { kind: "duplicate" };
    }
    throw new Error(`payments_persist_failed: ${error.message}`);
  }

  // On the credit-bearing transition (paid), also write a row to
  // order_status_history so the order's lifecycle is auditable end-to-end.
  if (intent.status === "paid") {
    const { error: historyError } = await sb
      .from("order_status_history")
      .insert({
        order_id: orderUuid,
        to_status: "paid",
        reason: "payment.reconciled.applied",
      });
    if (historyError) {
      // The payment row is already written — that's the durable
      // idempotency primitive. A history-row failure is observability
      // loss, not a correctness loss. Surface to caller so Sentry (C3)
      // can capture it, but don't unwind the payment write.
      throw new Error(
        `order_status_history_persist_failed: ${historyError.message}`,
      );
    }
  }

  return { kind: "applied" };
}

/**
 * Reconcile an intent against the durable store + cache. Idempotent by
 * (provider, provider_intent_id) for the durable layer and by intent.id for
 * the in-process cache.
 *
 *   - First time we see an intent in this process AND in Supabase: persist
 *     + cache + return applied=true.
 *   - First time in this process but durable layer reports duplicate
 *     (peer instance won the race): return applied=false,
 *     reason="already_processed".
 *   - Same status already in cache: short-circuit with
 *     reason="already_at_status".
 *   - Forward transition: persist new status + update cache.
 *   - Backward transition: reject with reason="invalid_transition".
 */
export async function reconcile(
  intent: PaymentIntent | null,
): Promise<ReconcileResult> {
  if (!intent) {
    return { applied: false, reason: "no_intent" };
  }

  const existing = ledger.get(intent.id);
  if (!existing) {
    // Fresh intent in this process — go to durable layer first so we can
    // distinguish "this is the first credit ever" from "a peer beat us".
    const persisted = await persistToSupabase(intent);
    if (persisted.kind === "duplicate") {
      // Cold-start hydration: a peer instance wrote this payment row.
      // Mirror its state into the cache so subsequent in-process webhooks
      // short-circuit without re-querying Supabase. This keeps the cache
      // consistent with the durable source-of-truth.
      ledger.set(intent.id, {
        intentId: intent.id,
        status: intent.status,
        updatedAt: intent.updatedAt,
        applied: 1,
      });
      return { applied: false, reason: "already_processed" };
    }
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

  // Valid forward transition — persist + apply.
  const persisted = await persistToSupabase(intent);
  if (persisted.kind === "duplicate") {
    return {
      applied: false,
      reason: "already_processed",
      fromStatus: existing.status,
      toStatus: intent.status,
    };
  }
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
 *
 * Phase 3.3 (v5) — extended to accept a PaymentIntent. When passed an intent
 * the guard:
 *   1. Reads intent.metadata.shipping_country + shipping_state if present
 *      (test injection + cases where the adapter has already enriched the
 *      intent with address fields).
 *   2. Else looks up the order_id from intent.metadata (orderId or
 *      order_id) via serviceSupabase() and reads shipping_address_snapshot.
 *   3. Else degrades gracefully (no-op) — Supabase off in Day-1 means we
 *      cannot resolve the address; Layer 1 + 2 are the primary defenses
 *      and the cache-only path stays consistent with that posture per
 *      Iron Law 2.31.
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

/** Address-like shape accepted by the synchronous-equivalent code path. */
interface JurisdictionAddressLike {
  countryCode: string;
  stateCode?: string;
}

function isAddressLike(
  value: PaymentIntent | JurisdictionAddressLike,
): value is JurisdictionAddressLike {
  // PaymentIntent has provider + method + id — addresses do not.
  return (
    typeof (value as JurisdictionAddressLike).countryCode === "string" &&
    typeof (value as PaymentIntent).provider !== "string"
  );
}

async function resolveAddressFromIntent(
  intent: PaymentIntent,
): Promise<JurisdictionAddressLike | null> {
  // Cheap path: adapter already populated intent.metadata.shipping_country
  // and shipping_state. Use those directly so tests don't need Supabase.
  const metaCountry =
    intent.metadata?.shipping_country ?? intent.metadata?.shippingCountry;
  const metaState =
    intent.metadata?.shipping_state ?? intent.metadata?.shippingState;
  if (typeof metaCountry === "string" && metaCountry.length > 0) {
    return {
      countryCode: metaCountry,
      stateCode: typeof metaState === "string" ? metaState : "",
    };
  }

  // Durable path: look up the order in Supabase and read its snapshot.
  const orderUuid =
    intent.metadata?.order_id ??
    intent.metadata?.orderId ??
    intent.metadata?.orderUuid ??
    null;
  if (!orderUuid) return null;

  const sb = serviceSupabase();
  if (!sb) {
    // Day-1: REQUIRE_SUPABASE=false. Cannot resolve address; degrade.
    return null;
  }

  const { data, error } = await sb
    .from("orders")
    .select("shipping_address_snapshot")
    .eq("id", orderUuid)
    .maybeSingle();
  if (error || !data) return null;

  const snap = data.shipping_address_snapshot as Record<string, unknown> | null;
  if (!snap || typeof snap !== "object") return null;

  const country =
    (snap.country_code as string | undefined) ??
    (snap.countryCode as string | undefined);
  const state =
    (snap.state_code as string | undefined) ??
    (snap.stateCode as string | undefined);
  if (typeof country !== "string" || country.length === 0) return null;
  return {
    countryCode: country,
    stateCode: typeof state === "string" ? state : "",
  };
}

export async function assertOrderJurisdictionAllowed(
  input: PaymentIntent | JurisdictionAddressLike,
): Promise<void> {
  // Address-like inputs validate inline (legacy + Zelle/Bitcoin receipts
  // which carry the address in the request payload).
  if (isAddressLike(input)) {
    const result = validateShippingAddress({
      countryCode: input.countryCode,
      stateCode: input.stateCode,
    });
    if (!result.ok) {
      throw new JurisdictionalGuardError(
        input.stateCode ?? "",
        input.countryCode,
        result.reason,
      );
    }
    return;
  }

  // PaymentIntent path: derive address from intent metadata or Supabase.
  const resolved = await resolveAddressFromIntent(input);
  if (!resolved) {
    // Could not resolve — graceful degradation. Layers 1+2 remain the
    // primary defense.
    return;
  }
  const result = validateShippingAddress(resolved);
  if (!result.ok) {
    throw new JurisdictionalGuardError(
      resolved.stateCode ?? "",
      resolved.countryCode,
      result.reason,
    );
  }
}
