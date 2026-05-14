import { NextResponse } from "next/server";
import { logAuditEvent, SHIPPO_EVENT } from "@/lib/ops/audit";
import {
  shippoStatusToOrderStatus,
  trackingWebhookSchema,
  verifyWebhookSignature,
} from "@/lib/shipping/shippo";
import { transitionStatus, type OrderStatus } from "@/lib/ops/orders";
import { jsonError } from "@/lib/ops/auth";
import { serviceSupabase } from "@/lib/supabase";

export const dynamic = "force-dynamic";
export const runtime = "nodejs";

// POST /api/ops/webhooks/shippo
//
// Shippo sends webhooks signed with HMAC-SHA256(body, SHIPPO_WEBHOOK_SECRET)
// in the X-Shippo-Signature header. We:
//
//   1. Verify the signature in constant time — reject 401 on mismatch.
//   2. Look up the order by tracking_number (partial index in migration).
//   3. If the event is DELIVERED, transition shipped → delivered.
//   4. Log the webhook to audit_log regardless of whether we acted on it.
//
// Intermediate carrier scans (TRANSIT, PRE_TRANSIT) are recorded but don't
// trigger a state transition v1 — they're not reliable enough.

interface OrderLookupRow {
  id: string;
  status: OrderStatus;
}

interface OrderLookupResult {
  data: OrderLookupRow | null;
  error: { message: string } | null;
}

interface OrdersDb {
  from(table: "orders"): {
    select(cols: string): {
      eq(
        col: string,
        value: string,
      ): {
        maybeSingle(): PromiseLike<OrderLookupResult>;
      };
    };
  };
}

export async function POST(request: Request): Promise<Response> {
  const secret = process.env.SHIPPO_WEBHOOK_SECRET?.trim();
  if (!secret) {
    return jsonError(
      "shippo_webhook_secret_not_configured",
      503,
      "SHIPPO_WEBHOOK_SECRET must be set before accepting webhooks.",
    );
  }

  const rawBody = await request.text();
  const signature = request.headers.get("x-shippo-signature");

  if (!verifyWebhookSignature(rawBody, signature, secret)) {
    // Log the rejection but don't reveal which check failed.
    let supabase;
    try {
      supabase = serviceSupabase();
    } catch {
      // Audit log unavailable — still return 401 to caller.
      return jsonError("unauthorized", 401);
    }
    if (supabase) {
      await logAuditEvent(supabase, {
        eventType: SHIPPO_EVENT.WEBHOOK_REJECTED,
        details: {
          reason: "signature_mismatch",
          had_signature: Boolean(signature),
        },
      }).catch(() => undefined);
    }
    return jsonError("unauthorized", 401);
  }

  let parsedBody: unknown;
  try {
    parsedBody = JSON.parse(rawBody);
  } catch {
    return jsonError("invalid_json", 400);
  }
  const payload = trackingWebhookSchema.safeParse(parsedBody);
  if (!payload.success) {
    return jsonError("invalid_payload", 400, payload.error.message);
  }

  let supabase;
  try {
    supabase = serviceSupabase();
  } catch (error) {
    return jsonError("supabase_not_configured", 503, (error as Error).message);
  }
  if (!supabase) return jsonError("supabase_not_configured", 503);

  const trackingNumber = payload.data.data.tracking_number;
  const shippoStatus = payload.data.data.tracking_status?.status ?? "UNKNOWN";

  // Look up the order by tracking number.
  const db = supabase as unknown as OrdersDb;
  const lookup = await db
    .from("orders")
    .select("id,status")
    .eq("tracking_number", trackingNumber)
    .maybeSingle();

  // Always record the webhook receipt, even if we don't recognize the order
  // (could be a duplicate after refund or a Shippo replay).
  await logAuditEvent(supabase, {
    eventType: SHIPPO_EVENT.WEBHOOK_RECEIVED,
    orderId: lookup.data?.id ?? null,
    details: {
      tracking_number: trackingNumber,
      shippo_status: shippoStatus,
      event: payload.data.event,
      order_known: Boolean(lookup.data),
    },
  });

  if (!lookup.data) {
    // Acknowledge — Shippo will stop retrying.
    return NextResponse.json({ ok: true, action: "no_matching_order" });
  }

  // Only DELIVERED triggers a transition in v1.
  const targetStatus = shippoStatusToOrderStatus(shippoStatus);
  if (!targetStatus) {
    return NextResponse.json({ ok: true, action: "logged_only" });
  }

  // If already delivered, idempotent no-op.
  if (lookup.data.status === "delivered") {
    return NextResponse.json({ ok: true, action: "already_delivered" });
  }

  // Only transition from shipped → delivered. Any other prior state is
  // weird (e.g. already refunded) — log and skip.
  if (lookup.data.status !== "shipped") {
    await logAuditEvent(supabase, {
      eventType: SHIPPO_EVENT.WEBHOOK_RECEIVED,
      orderId: lookup.data.id,
      details: {
        skipped_transition: true,
        reason: `cannot transition from ${lookup.data.status} to delivered`,
      },
    });
    return NextResponse.json({ ok: true, action: "skipped_transition" });
  }

  try {
    const order = await transitionStatus(supabase, {
      orderId: lookup.data.id,
      expectedStatus: "shipped",
      targetStatus: "delivered",
      actor: "shippo-webhook",
      reason: "shippo_tracking_delivered",
    });
    return NextResponse.json({ ok: true, action: "delivered", order });
  } catch (error) {
    return jsonError(
      "webhook_transition_failed",
      400,
      (error as Error).message,
    );
  }
}
