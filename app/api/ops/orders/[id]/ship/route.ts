import { NextResponse } from "next/server";
import { z } from "zod";
import { assertOpsToken, getOpsActor, jsonError } from "@/lib/ops/auth";
import { attachTracking, getOrderById } from "@/lib/ops/orders";
import { sendShipmentEmail } from "@/lib/email/order-emails";
import { serviceSupabase } from "@/lib/supabase";
import { createShipment, purchaseLabel, refundLabel } from "@/lib/shipping/shippo";
import {
  getDefaultParcel,
  getFromAddress,
  pickCheapestRate,
  snapshotToShippoAddress,
} from "@/lib/shipping/config";
import { logAuditEvent, SHIPPO_EVENT } from "@/lib/ops/audit";

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

// Shippo-purchase variant — one-click flow: pick cheapest USPS rate and
// buy the label. rateObjectId is optional; when omitted we auto-pick.
const shippoSchema = z.object({
  expectedStatus: z.literal("fulfilled"),
  shippoPurchase: z.literal(true),
  rateObjectId: z.string().trim().min(1).optional(),
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
    // One-click Shippo flow: load order → compute rates → pick cheapest
    // USPS → buy label → attach tracking → email customer.
    let order;
    try {
      order = await getOrderById(supabase, id);
    } catch (error) {
      return jsonError("order_lookup_failed", 400, (error as Error).message);
    }
    if (!order) return jsonError("order_not_found", 404);
    if (order.status !== "fulfilled") {
      return jsonError(
        "ship_failed",
        409,
        `order is in status ${order.status}, expected fulfilled`,
      );
    }
    // Refuse to buy a second label if one is already attached. Combined
    // with the void-on-failure path below, this keeps a concurrent
    // double-click from leaving a paid-for orphan label.
    if (order.shippoTransactionId) {
      return jsonError(
        "ship_failed",
        409,
        "order already has a Shippo label; refusing to buy a second",
      );
    }

    let fromAddress;
    let parcel;
    try {
      fromAddress = getFromAddress();
      parcel = getDefaultParcel();
    } catch (error) {
      return jsonError("shippo_config_incomplete", 503, (error as Error).message);
    }
    const toAddress = snapshotToShippoAddress(
      order.shippingAddressSnapshot,
      order.email,
    );

    let chosenRateId: string;
    let carrier = "usps";
    try {
      if (parsed.data.rateObjectId) {
        chosenRateId = parsed.data.rateObjectId;
      } else {
        const shipment = await createShipment(fromAddress, toAddress, parcel);
        const cheapest = pickCheapestRate(shipment.rates);
        if (!cheapest) {
          return jsonError(
            "shippo_no_rates",
            502,
            "Shippo returned 0 rates for this address",
          );
        }
        chosenRateId = cheapest.objectId;
        carrier = cheapest.provider.toLowerCase().includes("usps")
          ? "usps"
          : cheapest.provider.toLowerCase().includes("ups")
            ? "ups"
            : cheapest.provider.toLowerCase().includes("fedex")
              ? "fedex"
              : "other";
      }
    } catch (error) {
      return jsonError("shippo_rate_lookup_failed", 502, (error as Error).message);
    }

    let transaction;
    try {
      transaction = await purchaseLabel(chosenRateId, carrier);
    } catch (error) {
      return jsonError("shippo_label_purchase_failed", 502, (error as Error).message);
    }

    await logAuditEvent(supabase, {
      eventType: SHIPPO_EVENT.LABEL_PURCHASED,
      orderId: order.id,
      details: {
        shippo_transaction_id: transaction.objectId,
        tracking_number: transaction.trackingNumber,
        carrier,
        label_url: transaction.labelUrl,
        rate_object_id: chosenRateId,
      },
      actor,
    });

    try {
      const shipped = await attachTracking(supabase, {
        orderId: id,
        expectedStatus: "fulfilled",
        trackingNumber: transaction.trackingNumber,
        carrier: carrier as "usps" | "ups" | "fedex" | "dhl" | "other",
        shippoTransactionId: transaction.objectId,
        actor,
      });

      try {
        await sendShipmentEmail(supabase, shipped);
      } catch (emailError) {
        console.error("shipment_email_failed", emailError);
      }

      return NextResponse.json({
        ok: true,
        order: shipped,
        labelUrl: transaction.labelUrl,
      });
    } catch (error) {
      // The label was purchased but the order could not be advanced to
      // 'shipped' (most commonly a concurrent ship request won the
      // optimistic lock). Void the orphan label so it isn't paid-for and
      // unused, then surface the original failure.
      let voidStatus = "not_attempted";
      try {
        const refund = await refundLabel(transaction.objectId);
        voidStatus = refund.status;
      } catch (voidError) {
        voidStatus = `void_failed: ${(voidError as Error).message}`;
      }
      await logAuditEvent(supabase, {
        eventType: SHIPPO_EVENT.LABEL_VOIDED,
        orderId: order.id,
        details: {
          shippo_transaction_id: transaction.objectId,
          tracking_number: transaction.trackingNumber,
          void_status: voidStatus,
          reason: (error as Error).message,
        },
        actor,
      });
      const message = (error as Error).message;
      const status = message === "stale_status" ? 409 : 400;
      return jsonError("ship_failed", status, message);
    }
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
