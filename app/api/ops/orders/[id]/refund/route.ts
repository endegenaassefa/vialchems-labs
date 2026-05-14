import { NextResponse } from "next/server";
import { z } from "zod";
import { assertOpsToken, getOpsActor, jsonError } from "@/lib/ops/auth";
import { markRefunded, type OrderStatus } from "@/lib/ops/orders";
import { sendRefundEmail } from "@/lib/email/order-emails";
import { serviceSupabase } from "@/lib/supabase";

export const dynamic = "force-dynamic";
export const runtime = "nodejs";

// POST /api/ops/orders/[id]/refund
// Body: { expectedStatus, amountCents, reason }
//
// Marks an order refunded (full OR partial per D17). Side effect: customer
// refund email (routed to ORDER_TEST_INBOX for test orders). Note: this
// records the refund decision in our DB but does NOT push money back via
// the payment provider — operator handles that manually in v1.

const bodySchema = z.object({
  expectedStatus: z.enum(["paid", "fulfilled", "shipped", "delivered"]),
  amountCents: z.number().int().min(1),
  reason: z.string().trim().min(1).max(500),
});

export async function POST(
  request: Request,
  context: { params: Promise<{ id: string }> },
): Promise<Response> {
  const authError = assertOpsToken(request);
  if (authError) return authError;
  const { id } = await context.params;
  const actor = getOpsActor(request);

  let raw: unknown;
  try {
    raw = await request.json();
  } catch {
    return jsonError("invalid_json", 400);
  }
  const parsed = bodySchema.safeParse(raw);
  if (!parsed.success) {
    return jsonError("invalid_body", 400, parsed.error.message);
  }

  let supabase;
  try {
    supabase = serviceSupabase();
  } catch (error) {
    return jsonError("supabase_not_configured", 503, (error as Error).message);
  }
  if (!supabase) return jsonError("supabase_not_configured", 503);

  try {
    const order = await markRefunded(supabase, {
      orderId: id,
      expectedStatus: parsed.data.expectedStatus as OrderStatus,
      amountCents: parsed.data.amountCents,
      reason: parsed.data.reason,
      actor,
    });

    try {
      await sendRefundEmail(supabase, order);
    } catch (emailError) {
      console.error("refund_email_failed", emailError);
    }

    return NextResponse.json({ ok: true, order });
  } catch (error) {
    const message = (error as Error).message;
    const status =
      message === "stale_status"
        ? 409
        : message === "refund_amount_exceeds_total" ||
            message === "order_not_found"
          ? 400
          : 400;
    return jsonError("refund_failed", status, message);
  }
}
