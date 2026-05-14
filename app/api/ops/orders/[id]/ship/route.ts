import { NextResponse } from "next/server";
import { z } from "zod";
import { assertOpsToken, getOpsActor, jsonError } from "@/lib/ops/auth";
import { attachTracking, getOrderById } from "@/lib/ops/orders";
import { sendShipmentEmail } from "@/lib/email/order-emails";
import { serviceSupabase } from "@/lib/supabase";

export const dynamic = "force-dynamic";
export const runtime = "nodejs";

// POST /api/ops/orders/[id]/ship
// Body (manual tracking):
//   { expectedStatus: "fulfilled", trackingNumber: "...", carrier: "usps" }
//
// Body (shippo label purchase — wired in commit 9):
//   { expectedStatus: "fulfilled", shippoPurchase: true, rateObjectId: "..." }
//
// Either path ends in: status='shipped', tracking_number set, audit logged,
// customer shipment email queued (or diverted to ORDER_TEST_INBOX if is_test).

const manualSchema = z.object({
  expectedStatus: z.literal("fulfilled"),
  trackingNumber: z.string().trim().min(1).max(80),
  carrier: z.enum(["usps", "ups", "fedex", "dhl", "other"]),
  shippoPurchase: z.literal(false).optional(),
});

// Shippo-purchase variant — actual label-buy wiring is added in commit 9.
// We accept the shape here so the API contract is stable from day one.
const shippoSchema = z.object({
  expectedStatus: z.literal("fulfilled"),
  shippoPurchase: z.literal(true),
  rateObjectId: z.string().trim().min(1),
});

const bodySchema = z.union([manualSchema, shippoSchema]);

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

  if ("shippoPurchase" in parsed.data && parsed.data.shippoPurchase === true) {
    // Wire actual Shippo label purchase in commit 9. For now return 501
    // so the API contract is documented but the path is unimplemented.
    return jsonError(
      "shippo_purchase_not_yet_wired",
      501,
      "Shippo label-buy lands in commit 9. Use manual tracking variant for now.",
    );
  }

  // Manual tracking path
  const data = parsed.data as z.infer<typeof manualSchema>;
  try {
    const order = await attachTracking(supabase, {
      orderId: id,
      expectedStatus: "fulfilled",
      trackingNumber: data.trackingNumber,
      carrier: data.carrier,
      actor,
    });

    // Auto-send shipment email per CEO plan D6. Email helper itself routes
    // to ORDER_TEST_INBOX if order.isTest=true. Failures here don't roll
    // back the ship — order is shipped, email is logged either way.
    try {
      await sendShipmentEmail(supabase, order);
    } catch (emailError) {
      // Log to console; surfaces in Sentry/Vercel logs. Order remains
      // shipped; ops can manually resend via the UI in a follow-up.
      console.error("shipment_email_failed", emailError);
    }

    return NextResponse.json({ ok: true, order });
  } catch (error) {
    const message = (error as Error).message;
    const status = message === "stale_status" ? 409 : 400;
    return jsonError("ship_failed", status, message);
  }
}
