import { NextResponse } from "next/server";
import { logAuditEvent, PAYMENT_EVENT } from "@/lib/ops/audit";
import { sendEmail } from "@/lib/email/resend";
import { serviceSupabase } from "@/lib/supabase";

export const dynamic = "force-dynamic";
export const runtime = "nodejs";

// Customer-facing endpoint behind the Zelle instruction screen's
// "I've sent the payment" button. It does NOT move the order to paid —
// only ops can do that after verifying the bank account. It writes an
// advisory audit event and emails ops so they have a work queue instead
// of polling. Idempotent: a repeat claim re-logs but does not re-email.

function jsonError(error: string, status: number, message?: string): Response {
  return NextResponse.json({ ok: false, error, message }, { status });
}

interface OrderRow {
  id: string;
  display_id: string;
  status: string;
  email: string;
  total_cents: number;
  payment_provider: string;
  is_test: boolean;
}

export async function POST(
  _request: Request,
  { params }: { params: Promise<{ id: string }> },
): Promise<Response> {
  const { id } = await params;
  const displayId = id?.trim();
  if (!displayId) {
    return jsonError("display_id_required", 400);
  }

  let supabase;
  try {
    supabase = serviceSupabase();
  } catch (error) {
    return jsonError("supabase_not_configured", 503, (error as Error).message);
  }
  if (!supabase) {
    return jsonError(
      "supabase_not_configured",
      503,
      "Payment-claim notifications require Supabase service-role access.",
    );
  }

  const orderQuery = await supabase
    .from("orders")
    .select(
      "id, display_id, status, email, total_cents, payment_provider, is_test",
    )
    .eq("display_id", displayId)
    .maybeSingle();

  if (orderQuery.error) {
    return jsonError("order_lookup_failed", 500, orderQuery.error.message);
  }
  const order = orderQuery.data as OrderRow | null;
  if (!order) {
    return jsonError("order_not_found", 404);
  }

  // This endpoint only makes sense for a real Zelle order still waiting on
  // payment. Reject anything else so a guessed display_id can't trigger an
  // ops notification for a crypto / cancelled / refunded / test order.
  if (
    order.payment_provider !== "zelle" ||
    order.status !== "awaiting_payment" ||
    order.is_test
  ) {
    return jsonError("claim_not_applicable", 409);
  }

  // Idempotent: only the first claim writes an audit row and notifies ops.
  // This endpoint is unauthenticated, so writing an audit row on EVERY call
  // would be an unbounded write-amplification vector — a repeat click (or a
  // script hammering a known display_id) must be a no-op, not N audit rows.
  const existing = await supabase
    .from("audit_log")
    .select("id")
    .eq("order_id", order.id)
    .eq("event_type", PAYMENT_EVENT.CLAIMED_SENT)
    .limit(1);
  const alreadyClaimed =
    !existing.error && Array.isArray(existing.data) && existing.data.length > 0;

  if (!alreadyClaimed) {
    await logAuditEvent(supabase, {
      eventType: PAYMENT_EVENT.CLAIMED_SENT,
      orderId: order.id,
      details: {
        provider: order.payment_provider,
        display_id: order.display_id,
        order_status: order.status,
      },
      actor: "customer",
    });

    const opsInbox =
      process.env.OPS_NOTIFICATION_INBOX?.trim() ||
      process.env.ORDER_TEST_INBOX?.trim() ||
      process.env.ORDER_EMAIL_FROM?.trim();
    if (opsInbox) {
      try {
        await sendEmail({
          to: opsInbox,
          subject: `Payment claimed sent — ${order.display_id}`,
          text: [
            `A customer says they sent payment for order ${order.display_id}.`,
            ``,
            `Provider: ${order.payment_provider}`,
            `Amount: $${(order.total_cents / 100).toFixed(2)}`,
            `Customer: ${order.email}`,
            `Current status: ${order.status}`,
            ``,
            `Check the bank account, then confirm the payment in the ops`,
            `panel: /ops/orders/${order.id}`,
          ].join("\n"),
        });
      } catch {
        // Best-effort: the audit event already landed and is the source of
        // truth. Don't fail the customer's request over a bounced email.
      }
    }
  }

  return NextResponse.json({ ok: true, alreadyClaimed });
}
