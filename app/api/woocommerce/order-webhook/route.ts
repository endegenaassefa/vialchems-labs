import { NextResponse } from "next/server";
import {
  parseWooOrderWebhook,
  verifyWooWebhookSignature,
} from "@/lib/woocommerce/webhook";

export const dynamic = "force-dynamic";
export const runtime = "nodejs";

function jsonError(error: string, status: number, message?: string): Response {
  return NextResponse.json({ ok: false, error, message }, { status });
}

export async function POST(request: Request): Promise<Response> {
  const rawBody = await request.text();
  const secret = process.env.WOOCOMMERCE_WEBHOOK_SECRET?.trim();

  if (!secret) {
    return jsonError(
      "woo_webhook_secret_missing",
      503,
      "Missing required credential: WOOCOMMERCE_WEBHOOK_SECRET",
    );
  }

  const signature = request.headers.get("x-wc-webhook-signature");
  if (!verifyWooWebhookSignature(rawBody, signature, secret)) {
    return jsonError("invalid_signature", 401);
  }

  const order = parseWooOrderWebhook(rawBody);
  if (!order) {
    return jsonError("invalid_order_payload", 400);
  }

  return NextResponse.json({
    ok: true,
    received: {
      id: order.id,
      status: order.status,
      orderKey: order.orderKey,
      topic: request.headers.get("x-wc-webhook-topic"),
      resource: request.headers.get("x-wc-webhook-resource"),
      event: request.headers.get("x-wc-webhook-event"),
      deliveryId: request.headers.get("x-wc-delivery-id"),
    },
  });
}
