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
import { captureException } from "@/lib/sentry";
import { sendOrderConfirmation } from "@/lib/email/order-confirmation";
import { sendOperatorOrderNotification } from "@/lib/email/operator-notification";
import { trackServerEvent } from "@/lib/analytics/server-track";
import { FUNNEL_EVENTS } from "@/lib/analytics/events";
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
  | { kind: "skipped" }
  | {
      kind: "invalid_transition";
      fromStatus: PaymentStatus;
      toStatus: PaymentStatus;
    };

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

  // order_id is `not null references orders(id)` in the schema. Without it
  // we can't write a payments row.
  const orderUuid = intent.metadata?.order_id;
  if (!orderUuid) {
    return { kind: "skipped" };
  }

  // B1: BTCPay (lib/payments/btcpay.ts:350) and Plaid (lib/payments/plaid.ts:483)
  // intentionally emit amountCents=0 because the authoritative amount lives
  // in the order row. Hydrate from orders.total_cents before persisting,
  // otherwise the durable layer is silently skipped and cross-instance
  // idempotency collapses to in-memory-only.
  let amountCents = intent.amountCents;
  if (!amountCents || amountCents <= 0) {
    const { data: orderRow } = await sb
      .from("orders")
      .select("total_cents")
      .eq("id", orderUuid)
      .maybeSingle();
    const hydrated = (orderRow as { total_cents?: number } | null)?.total_cents;
    if (typeof hydrated === "number" && hydrated > 0) {
      amountCents = hydrated;
    } else {
      // Genuine zero or missing order row — skip durable write. Cache still
      // tracks state; surface via observability rather than throw.
      return { kind: "skipped" };
    }
  }

  const row = {
    order_id: orderUuid,
    provider: intent.provider,
    provider_intent_id: providerIntentId,
    status: intent.status,
    amount_cents: amountCents,
    currency: intent.currency,
    method_details: {
      method: intent.method,
      external_id: intent.externalId ?? null,
      intent_id: intent.id,
      metadata: intent.metadata,
    },
  };

  const { error } = await sb.from("payments").insert(row);

  // `applied` tracks whether THIS instance actually transitioned the row.
  // A fresh insert → applied. A 23505 → CAS UPDATE → applied iff the
  // returned rowset is non-empty. The gate matters for paid-event side
  // effects (B3 + C4): only the winner of the race may fire emails, or we
  // get duplicate customer/operator notifications.
  let applied = !error;

  if (error) {
    if (error.code === "23505") {
      // B2: row already exists. The OLD code returned "duplicate" here,
      // which silently left checkout's pending row unchanged when the
      // webhook tried to credit it. The fix: read the existing status; if
      // it's already at the target, true duplicate (peer beat us or retry);
      // otherwise UPDATE to apply the transition.
      const { data: existing } = await sb
        .from("payments")
        .select("status")
        .eq("provider", intent.provider)
        .eq("provider_intent_id", providerIntentId)
        .maybeSingle();

      const currentStatus = (existing as { status?: PaymentStatus } | null)
        ?.status;
      if (!currentStatus || currentStatus === intent.status) {
        // True duplicate — row at target status (or we can't read it back).
        return { kind: "duplicate" };
      }

      // B2-followup (codex re-review): enforce the same transition graph
      // the in-process path uses. A cold-started instance with an empty
      // ledger would otherwise let a delayed `failed` / `pending` webhook
      // downgrade an already-`paid` durable row via this UPDATE path.
      // Reject invalid transitions here too — durable source of truth must
      // not regress.
      if (!canTransition(currentStatus, intent.status)) {
        return {
          kind: "invalid_transition",
          fromStatus: currentStatus,
          toStatus: intent.status,
        };
      }

      // P1-7 (PR #34 codex re-review): atomic compare-and-swap UPDATE.
      // Two cold-started instances racing on the same `pending → paid`
      // transition could both observe pending and both UPDATE without
      // conflict if the filter didn't include the prior status — both
      // would then fall through to firePaidEmails, yielding duplicate
      // paid emails. Gate the UPDATE on `.eq("status", currentStatus)`
      // and `.select("id")` so a 0-row result identifies the loser of
      // the race; the loser short-circuits as duplicate without firing
      // history rows or emails.
      const { data: updatedRows, error: updateError } = await sb
        .from("payments")
        .update({
          status: intent.status,
          amount_cents: amountCents,
          method_details: row.method_details,
        })
        .eq("provider", intent.provider)
        .eq("provider_intent_id", providerIntentId)
        .eq("status", currentStatus)
        .select("id");

      if (updateError) {
        throw new Error(`payments_update_failed: ${updateError.message}`);
      }

      applied = Array.isArray(updatedRows) && updatedRows.length > 0;
      if (!applied) {
        // Codex P2 (PR #34 follow-up): 0-row CAS does NOT always mean a
        // true duplicate. A different valid forward transition could have
        // won the race — e.g., peer instance applied `pending → authorized`
        // while we were trying `pending → paid`. Treating that as duplicate
        // strands the durable row at `authorized` with no paid email
        // ever firing. Re-read the row; classify:
        //   - newStatus missing or equal to intent.status: true duplicate
        //   - intent.status still a valid forward from newStatus: retry CAS
        //     with newStatus in the filter
        //   - otherwise: invalid_transition (peer applied something we
        //     can no longer chain from)
        const { data: latest } = await sb
          .from("payments")
          .select("status")
          .eq("provider", intent.provider)
          .eq("provider_intent_id", providerIntentId)
          .maybeSingle();
        const newStatus = (latest as { status?: PaymentStatus } | null)
          ?.status;

        if (!newStatus || newStatus === intent.status) {
          return { kind: "duplicate" };
        }

        if (!canTransition(newStatus, intent.status)) {
          return {
            kind: "invalid_transition",
            fromStatus: newStatus,
            toStatus: intent.status,
          };
        }

        // Retry CAS exactly once with the freshly-observed status. A
        // second loss after retry is accepted as duplicate: another race
        // happened during the re-read, the durable row is in some valid
        // state per its history, and a missing paid email is recoverable
        // from /operator/orders. Unbounded retry would let a hot loop in
        // the provider hold the webhook open indefinitely.
        const { data: retryRows, error: retryError } = await sb
          .from("payments")
          .update({
            status: intent.status,
            amount_cents: amountCents,
            method_details: row.method_details,
          })
          .eq("provider", intent.provider)
          .eq("provider_intent_id", providerIntentId)
          .eq("status", newStatus)
          .select("id");

        if (retryError) {
          throw new Error(`payments_update_failed: ${retryError.message}`);
        }

        applied = Array.isArray(retryRows) && retryRows.length > 0;
        if (!applied) {
          return { kind: "duplicate" };
        }
      }
    } else {
      throw new Error(`payments_persist_failed: ${error.message}`);
    }
  }

  // History row + paid-email side effects fire ONLY when this instance
  // actually applied the transition (fresh insert OR CAS UPDATE with rows
  // affected). The previous structure ran them unconditionally inside the
  // `intent.status === "paid"` block, which let the race-loser duplicate
  // both the order_status_history row AND the customer/operator emails.
  if (intent.status === "paid" && applied) {
    const { error: historyError } = await sb
      .from("order_status_history")
      .insert({
        order_id: orderUuid,
        to_status: "paid",
        reason: "payment.reconciled.applied",
      });
    if (historyError) {
      // C5 (Phase 14, codex review): the payment row is the durable
      // correctness primitive; the history row is observability. If history
      // insert fails and we throw here, the webhook returns 500 → provider
      // retries → second delivery hits 23505 on payments → returns
      // "duplicate" → caller never re-attempts the history insert. Result:
      // permanent forensic gap. Capture to Sentry and continue — the
      // payment write is preserved, the observability gap is tracked.
      captureException(
        new Error(
          `order_status_history_persist_failed: ${historyError.message}`,
        ),
        { tags: { route: "payments_reconcile", provider: intent.provider } },
      );
    }

    // B3 + C4 paid-event side effect. Fires AFTER the durable payments
    // + order_status_history writes so the email cannot land before
    // the credit is recorded. Best-effort: any send failure → Sentry
    // capture + continue. The webhook caller must still return 2xx so
    // the provider doesn't retry indefinitely; a missed paid-email is
    // recoverable (operator can re-send from /operator/orders/[id]);
    // a duplicate credit is not.
    await firePaidEmails(sb, orderUuid, intent.provider, amountCents);

    // D4 funnel event — order_paid on the webhook-driven path. No
    // visitor request to forward; Plausible treats as anonymous.
    // Fire-and-forget so analytics never blocks the webhook 2xx.
    void trackServerEvent({
      event: FUNNEL_EVENTS.ORDER_PAID,
      props: { provider: intent.provider, total_cents: amountCents },
    });
  }

  return { kind: "applied" };
}

/**
 * Best-effort customer + operator paid emails. Pulls display_id +
 * email + items from the orders row, then fires both helpers. Never
 * throws — the durable payments row is already written and the
 * webhook caller needs a clean 2xx so the provider stops retrying.
 *
 * Iron Law 2.20: paymentIntent.provider is restricted to the locked
 * union ('stub' | 'btcpay' | 'plaid' | 'zelle') so the rail tag
 * carries through to the email helpers without widening.
 */
async function firePaidEmails(
  sb: NonNullable<ReturnType<typeof serviceSupabase>>,
  orderUuid: string,
  provider: PaymentProviderId,
  amountCents: number,
): Promise<void> {
  try {
    // P0-1 (PR #34 codex review): the orders table has NO `items` column.
    // Order lines live in the dedicated `order_items` table per the init
    // migration (`supabase/migrations/20260510000001_init.sql:229`). The
    // header lookup carries only display_id + email + total_cents; the
    // line items are fetched separately so the SELECT doesn't error
    // against the live schema.
    const { data: orderRow, error } = await sb
      .from("orders")
      .select("display_id, email, total_cents")
      .eq("id", orderUuid)
      .maybeSingle();
    if (error) {
      captureException(
        new Error(`paid_email_order_lookup_failed: ${error.message}`),
        {
          tags: { route: "payments_reconcile", provider, phase: "paid_email" },
        },
      );
      return;
    }
    if (!orderRow) {
      // No order row to look up — possible when test harnesses stub out
      // the orders table or when an upstream race removed it. Silent
      // skip: payments + history rows are already persisted (this code
      // path only runs after the applied gate), so credit-correctness
      // is preserved. Emails are observability.
      return;
    }
    const header = orderRow as {
      display_id: string;
      email: string;
      total_cents: number;
    };

    // Load the line items from the dedicated table. Failures here are
    // captured to Sentry but do NOT block the email — the customer still
    // gets a paid confirmation; items section just renders empty.
    let items: Array<{ name: string; qty: number; unitPriceCents: number }> =
      [];
    const { data: itemRows, error: itemsError } = await sb
      .from("order_items")
      .select("name_snapshot, quantity, unit_price_cents")
      .eq("order_id", orderUuid);
    if (itemsError) {
      captureException(
        new Error(`paid_email_items_lookup: ${itemsError.message}`),
        {
          tags: {
            route: "payments_reconcile",
            provider,
            phase: "paid_email_items_lookup",
          },
        },
      );
    } else if (Array.isArray(itemRows)) {
      items = itemRows.map((row) => {
        const r = row as {
          name_snapshot: string;
          quantity: number;
          unit_price_cents: number;
        };
        return {
          name: r.name_snapshot,
          qty: r.quantity,
          unitPriceCents: r.unit_price_cents,
        };
      });
    }

    const totalCents =
      header.total_cents && header.total_cents > 0
        ? header.total_cents
        : amountCents;

    try {
      await sendOrderConfirmation({
        displayId: header.display_id,
        customerEmail: header.email,
        totalCents,
        rail: provider,
        status: "paid",
        items,
        shippingEtaDays: 3,
      });
    } catch (sendError) {
      captureException(sendError, {
        tags: {
          route: "payments_reconcile",
          provider,
          phase: "customer_paid_email",
        },
      });
    }

    try {
      await sendOperatorOrderNotification({
        event: "paid",
        displayId: header.display_id,
        totalCents,
        rail: provider,
        customerEmail: header.email,
      });
    } catch (sendError) {
      captureException(sendError, {
        tags: {
          route: "payments_reconcile",
          provider,
          phase: "operator_paid_email",
        },
      });
    }
  } catch (outerError) {
    // Defense in depth — any unanticipated throw must not bubble into
    // the webhook caller. Reconcile is the credit primitive; email is
    // observability.
    captureException(outerError, {
      tags: { route: "payments_reconcile", provider, phase: "paid_email" },
    });
  }
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
    if (persisted.kind === "invalid_transition") {
      // B2-followup: durable row exists at a status that does not permit
      // intent.status as a forward transition (e.g. cold-start instance
      // receives a delayed `failed` webhook for a `paid` durable row).
      // Hydrate the cache with the true durable status so subsequent
      // in-process webhooks short-circuit correctly, then return the
      // invalid_transition signal upstream.
      ledger.set(intent.id, {
        intentId: intent.id,
        status: persisted.fromStatus,
        updatedAt: intent.updatedAt,
        applied: 1,
      });
      return {
        applied: false,
        reason: "invalid_transition",
        fromStatus: persisted.fromStatus,
        toStatus: persisted.toStatus,
      };
    }
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
  if (persisted.kind === "invalid_transition") {
    // Durable layer disagrees with the in-process transition graph:
    // Supabase has the row at a status that doesn't permit intent.status.
    // Hydrate the cache with the durable truth and surface the rejection.
    ledger.set(intent.id, {
      intentId: intent.id,
      status: persisted.fromStatus,
      updatedAt: intent.updatedAt,
      applied: existing.applied + 1,
    });
    return {
      applied: false,
      reason: "invalid_transition",
      fromStatus: persisted.fromStatus,
      toStatus: persisted.toStatus,
    };
  }
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

const CREDIT_BEARING_STATUSES: ReadonlySet<PaymentStatus> = new Set([
  "paid",
  "authorized",
]);

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

  // B3-followup: bitcoin-direct fallback (`/api/create-bitcoin-order`) creates
  // BTCPay invoices BEFORE a database orders row exists — shipping address
  // is captured at the `/bitcoin/receipt` step, which fires its own Layer 3
  // check with an address-like input. Such intents mark themselves with
  // `address_capture_deferred: "true"` so this guard skips with a Sentry
  // breadcrumb instead of fail-closing legitimate Settled events. The
  // marker is set server-side at invoice creation and flows through the
  // signed BTCPay webhook — an attacker who could forge it has already
  // compromised the application.
  if (input.metadata?.address_capture_deferred === "true") {
    return;
  }

  // PaymentIntent path: derive address from intent metadata or Supabase.
  const resolved = await resolveAddressFromIntent(input);
  if (!resolved) {
    // B3: fail closed for credit-bearing statuses (paid, authorized). If we
    // cannot prove the address is allowed at the moment we are about to
    // credit, we MUST reject — Layers 1+2 may have been spoofed or buggy,
    // and Layer 3 silently passing was the exact failure mode codex flagged
    // (metadata-key mismatch made Layer 3 dead-coded for checkout flows).
    // Non-credit statuses (pending, failed, refunded) still degrade
    // gracefully because they do not move money.
    if (CREDIT_BEARING_STATUSES.has(input.status)) {
      throw new JurisdictionalGuardError(
        "",
        "",
        "jurisdiction_unresolvable: cannot validate shipping address for credit-bearing intent",
      );
    }
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
