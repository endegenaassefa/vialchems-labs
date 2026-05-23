/**
 * C2 — Operator order PATCH endpoint
 * (Section 6 super-prompt 2026-05-22).
 *
 * PATCH /api/operator/orders/[id] with one of three actions:
 *   - { action: "mark_paid", note? } — Zelle/bitcoin-direct
 *     operators verify the deposit landed in their bank/wallet
 *     and flip the order from `awaiting_payment` → `paid`.
 *   - { action: "mark_shipped", carrier, trackingNumber, note? }
 *     — operator enters tracking + carrier + flips status to
 *     `shipped`. Fires sendOrderShipped() to the customer.
 *   - { action: "add_note", note } — append to operator_notes
 *     (free-text working memory; not a status transition).
 *
 * Auth: requires an authorized operator session (same guard as
 * the dashboard layout). Returns 403 for non-operator sessions,
 * 401 for no session, 503 when Supabase isn't configured.
 *
 * Every successful action writes an audit_log entry so the
 * forensic trail of operator actions is preserved per Iron Law
 * 2.33 append-only triggers.
 */
import { NextResponse, type NextRequest } from "next/server";
import { z } from "zod";
import { serviceSupabase } from "@/lib/supabase";
import { checkOperatorAuth } from "@/lib/operator/auth-guard";
import { sendOrderShipped } from "@/lib/email/order-shipped";
import { sendOrderConfirmation } from "@/lib/email/order-confirmation";
import { captureException } from "@/lib/sentry";
import { scheduleServerEvent } from "@/lib/analytics/server-track";
import { FUNNEL_EVENTS } from "@/lib/analytics/events";

type PaymentRail = "btcpay" | "plaid" | "zelle" | "bitcoin-direct" | "stub";

function normalizeRail(raw: string | null | undefined): PaymentRail {
  if (
    raw === "btcpay" ||
    raw === "plaid" ||
    raw === "zelle" ||
    raw === "bitcoin-direct" ||
    raw === "stub"
  ) {
    return raw;
  }
  return "stub";
}

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

const markPaidSchema = z.object({
  action: z.literal("mark_paid"),
  note: z.string().trim().max(500).optional(),
});

const markShippedSchema = z.object({
  action: z.literal("mark_shipped"),
  carrier: z.enum(["USPS", "UPS", "FedEx", "DHL", "Other"]),
  trackingNumber: z.string().trim().min(4).max(80),
  note: z.string().trim().max(500).optional(),
});

const addNoteSchema = z.object({
  action: z.literal("add_note"),
  note: z.string().trim().min(1).max(2000),
});

const bodySchema = z.discriminatedUnion("action", [
  markPaidSchema,
  markShippedSchema,
  addNoteSchema,
]);

function jsonError(code: string, status: number, message?: string) {
  return NextResponse.json({ ok: false, code, message }, { status });
}

export async function PATCH(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> },
) {
  const { id } = await params;
  if (!id || !/^[A-Za-z0-9_-]{1,80}$/.test(id)) {
    return jsonError("invalid_id", 400);
  }

  const auth = await checkOperatorAuth();
  if (auth.state === "unauthenticated") {
    return jsonError("unauthorized", 401);
  }
  if (auth.state === "forbidden") {
    return jsonError("forbidden", 403, "Not on operator allow-list");
  }

  let raw: unknown;
  try {
    raw = await request.json();
  } catch {
    return jsonError("invalid_json", 400);
  }
  const parsed = bodySchema.safeParse(raw);
  if (!parsed.success) {
    return NextResponse.json(
      {
        ok: false,
        code: "invalid_body",
        issues: parsed.error.issues.map((i) => ({
          field: i.path.join("."),
          message: i.message,
        })),
      },
      { status: 400 },
    );
  }
  const body = parsed.data;

  const supabase = serviceSupabase();
  if (!supabase) {
    return jsonError("supabase_unavailable", 503);
  }

  const operatorEmail = auth.email ?? "unknown";
  const now = new Date().toISOString();
  const ipAddress =
    request.headers.get("x-forwarded-for")?.split(",")[0]?.trim() ?? null;
  const userAgent = request.headers.get("user-agent") ?? null;

  let update: Record<string, unknown> = {};
  // P0-6 (PR #36 codex finding): each status-transition action writes
  // an order_status_history row (Iron Law 2.33 append-only audit
  // lineage). `newStatus = null` for non-transitions (add_note).
  let newStatus: "paid" | "shipped" | null = null;
  // P0-4 (PR #36 codex finding): the actual audit_log schema is
  // { event_type, customer_id, order_id, details, ip_address,
  // user_agent } — not { action, actor_email, target_kind, target_id,
  // payload }. Build the typed payload below.
  let auditEventType: string;

  if (body.action === "mark_paid") {
    // P0-3 (PR #36 codex finding): orders has NO payment_verified_at
    // column. The transition timing is captured by the
    // order_status_history row + the audit_log row below; no schema
    // change required.
    update = {
      status: "paid",
      operator_notes: body.note ?? undefined,
    };
    newStatus = "paid";
    auditEventType = "operator.mark_paid";
  } else if (body.action === "mark_shipped") {
    update = {
      status: "shipped",
      carrier: body.carrier,
      tracking_number: body.trackingNumber,
      shipped_at: now,
      operator_notes: body.note ?? undefined,
    };
    newStatus = "shipped";
    auditEventType = "operator.mark_shipped";
  } else {
    update = { operator_notes: body.note };
    auditEventType = "operator.add_note";
  }

  // Apply the update + select the order UUID (needed for the FK on
  // order_status_history + audit_log) + the customer-facing fields the
  // side-effect emails address.
  //
  // PR #36 codex follow-up: atomic compare-and-swap on the from-status
  // makes the action idempotent. A retried mark_paid or stale-page
  // mark_shipped click no longer triggers duplicate emails / history
  // rows; the .eq/.neq filter prevents the UPDATE from matching when
  // the order is already at the target state.
  let updateBuilder = supabase
    .from("orders")
    .update(update)
    .eq("display_id", id);
  if (body.action === "mark_paid") {
    updateBuilder = updateBuilder.eq("status", "awaiting_payment");
  } else if (body.action === "mark_shipped") {
    updateBuilder = updateBuilder.neq("status", "shipped");
  }
  const { data, error } = await updateBuilder
    .select(
      "id, display_id, email, total_cents, payment_provider, carrier, tracking_number",
    )
    .maybeSingle();

  if (error) {
    return jsonError("db_error", 500, error.message);
  }
  if (!data) {
    // 0-row outcome — disambiguate: was the order missing, or did its
    // status not match the action's expected from-state?
    const { data: existing, error: readError } = await supabase
      .from("orders")
      .select("status")
      .eq("display_id", id)
      .maybeSingle();
    if (readError) {
      return jsonError("db_error", 500, readError.message);
    }
    if (!existing) {
      return jsonError("not_found", 404);
    }
    // Idempotent skip: order exists but isn't in the expected state.
    // 200 with skipped=true so the UI refreshes to the current truth
    // and the operator sees the actual status.
    return NextResponse.json(
      {
        ok: true,
        skipped: true,
        code: "no_transition",
        currentStatus: (existing as { status?: string } | null)?.status,
      },
      { status: 200 },
    );
  }

  // P0-6: write a status-history row on state transitions. Best-effort
  // via Sentry capture — append-only trigger means a write failure
  // signals a real integrity issue, but the operator needs the response
  // to confirm their click landed; we don't want to leave the orders
  // row mutated while the response 500s.
  if (newStatus) {
    const { error: historyError } = await supabase
      .from("order_status_history")
      .insert({
        order_id: data.id,
        to_status: newStatus,
        reason: auditEventType,
      });
    if (historyError) {
      captureException(
        new Error(
          `order_status_history_persist_failed: ${historyError.message}`,
        ),
        { tags: { route: "operator_patch", phase: "history" } },
      );
    }
  }

  // P0-4: audit_log insert against the real schema. `details` carries
  // the action + operator identity + request body so a forensic replay
  // can reconstruct the operator's intent without joining other tables.
  //
  // PR #36 codex follow-up: Supabase .insert() resolves with
  // { error: PostgrestError } on failure rather than throwing. A bare
  // try/catch would silently drop those errors (e.g., RLS violation,
  // invalid ip_address value). Explicitly inspect the returned error.
  try {
    const { error: auditError } = await supabase.from("audit_log").insert({
      event_type: auditEventType,
      order_id: data.id,
      details: {
        action: body.action,
        actor_email: operatorEmail,
        display_id: id,
        body,
      },
      ip_address: ipAddress,
      user_agent: userAgent,
    });
    if (auditError) {
      captureException(
        new Error(`audit_log_insert_failed: ${auditError.message}`),
        { tags: { route: "operator_patch", phase: "audit_log" } },
      );
    }
  } catch (e) {
    captureException(e, {
      tags: { route: "operator_patch", phase: "audit_log" },
    });
  }

  // P0-5: mark_paid fires the customer paid confirmation. Per super-
  // prompt §6 C2 the operator-side paid notification is SKIPPED here
  // because the operator IS the actor — they just clicked the button.
  // Items are fetched separately from order_items so the email body
  // renders the breakdown the customer paid for.
  if (body.action === "mark_paid" && data.email) {
    let items: Array<{ name: string; qty: number; unitPriceCents: number }> =
      [];
    try {
      const { data: itemRows, error: itemsError } = await supabase
        .from("order_items")
        .select("name_snapshot, quantity, unit_price_cents")
        .eq("order_id", data.id);
      if (itemsError) {
        captureException(
          new Error(`paid_email_items_lookup: ${itemsError.message}`),
          {
            tags: { route: "operator_patch", phase: "paid_email_items_lookup" },
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
    } catch (e) {
      captureException(e, {
        tags: { route: "operator_patch", phase: "paid_email_items_lookup" },
      });
    }

    try {
      await sendOrderConfirmation({
        displayId: id,
        customerEmail: data.email,
        totalCents: data.total_cents,
        rail: normalizeRail(data.payment_provider),
        status: "paid",
        items,
        shippingEtaDays: 3,
      });
    } catch (e) {
      captureException(e, {
        tags: { route: "operator_patch", phase: "paid_customer_email" },
      });
    }

    // D4 funnel event — order_paid on the operator-driven mark-paid
    // path. Visitor IP is the OPERATOR's, not the customer's; we omit
    // it so Plausible attributes the event to "unknown" rather than
    // mis-attributing to the operator's location.
    scheduleServerEvent({
      event: FUNNEL_EVENTS.ORDER_PAID,
      props: {
        provider: data.payment_provider,
        total_cents: data.total_cents,
      },
    });
  }

  // F2 — shipped email on the shipped transition (unchanged).
  if (body.action === "mark_shipped" && data.email) {
    try {
      await sendOrderShipped({
        displayId: id,
        customerEmail: data.email,
        carrier: data.carrier ?? body.carrier,
        trackingNumber: data.tracking_number ?? body.trackingNumber,
      });
    } catch (e) {
      captureException(e, {
        tags: { route: "operator_patch", phase: "shipped_email" },
      });
    }
  }

  return NextResponse.json({ ok: true, order: data }, { status: 200 });
}
