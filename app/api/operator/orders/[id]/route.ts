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
import { captureException } from "@/lib/sentry";

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
  let update: Record<string, unknown> = {};
  let auditAction: string;

  if (body.action === "mark_paid") {
    update = {
      status: "paid",
      payment_verified_at: now,
      operator_notes: body.note ?? undefined,
    };
    auditAction = "operator_mark_paid";
  } else if (body.action === "mark_shipped") {
    update = {
      status: "shipped",
      carrier: body.carrier,
      tracking_number: body.trackingNumber,
      shipped_at: now,
      operator_notes: body.note ?? undefined,
    };
    auditAction = "operator_mark_shipped";
  } else {
    update = { operator_notes: body.note };
    auditAction = "operator_add_note";
  }

  // Apply the update + select the email so the side-effect email
  // (shipped notification) can address it.
  const { data, error } = await supabase
    .from("orders")
    .update(update)
    .eq("display_id", id)
    .select(
      "display_id, email, total_cents, payment_provider, carrier, tracking_number",
    )
    .single();

  if (error) {
    return jsonError("db_error", 500, error.message);
  }
  if (!data) {
    return jsonError("not_found", 404);
  }

  // Best-effort audit entry. The audit_log table has an
  // append-only trigger (Iron Law 2.33) so a failure here means
  // a real data-integrity problem — surface to Sentry but don't
  // fail the operator action; they need the response to confirm
  // their click landed.
  try {
    await supabase.from("audit_log").insert({
      action: auditAction,
      actor_email: operatorEmail,
      target_kind: "order",
      target_id: id,
      payload: body,
    });
  } catch (e) {
    captureException(e, {
      tags: { route: "operator_patch", phase: "audit_log" },
    });
  }

  // F2 — shipped email on the shipped transition.
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
