import { NextResponse } from "next/server";
import * as Sentry from "@sentry/nextjs";
import {
  assertOrderJurisdictionAllowed,
  JurisdictionalGuardError,
} from "@/lib/payments/reconciliation";
import { captureException, captureMessage } from "@/lib/sentry";
import {
  parseWooOrderWebhook,
  verifyWooWebhookSignature,
} from "@/lib/woocommerce/webhook";

/**
 * Phase 3.3 (v5) — WooCommerce order webhook receiver.
 *
 * Iron Law 2.30 (signature verification) — HMAC-SHA256 base64 signature
 * using WOOCOMMERCE_WEBHOOK_SECRET. Iron Law 2.31 (Layer 3 jurisdiction
 * guard) — refuses to credit orders whose shipping address resolves
 * outside allowed jurisdictions. Iron Law 2.32 (Sentry instrumentation) —
 * every internal error tagged { route: 'woocommerce_webhook' }.
 *
 * Closes audit C13 + H3 + H7 + S5 + S6 + S12 for the WooCommerce surface.
 */

export const dynamic = "force-dynamic";
export const runtime = "nodejs";

function jsonError(error: string, status: number, message?: string): Response {
  return NextResponse.json({ ok: false, error, message }, { status });
}

export async function POST(request: Request): Promise<Response> {
  Sentry.addBreadcrumb({
    category: "webhook",
    level: "info",
    message: "woocommerce_webhook_entry",
    data: { route: "woocommerce_webhook" },
  });

  try {
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
      captureMessage("woocommerce_webhook_invalid_signature", "warning", {
        route: "woocommerce_webhook",
      });
      return jsonError("invalid_signature", 401);
    }

    const order = parseWooOrderWebhook(rawBody);
    if (!order) {
      return jsonError("invalid_order_payload", 400);
    }

    // Iron Law 2.31 — Layer 3 jurisdiction guard. Use the address embedded
    // in the WC webhook payload (shipping > billing). When the payload does
    // not include an address (e.g. a status-only update), degrade gracefully
    // — Layers 1 + 2 + WooCommerce's own checkout flow remain authoritative.
    if (order.shippingAddress) {
      try {
        await assertOrderJurisdictionAllowed({
          countryCode: order.shippingAddress.countryCode,
          stateCode: order.shippingAddress.stateCode,
        });
      } catch (err) {
        if (err instanceof JurisdictionalGuardError) {
          captureMessage(
            "woocommerce_webhook_jurisdiction_blocked",
            "warning",
            { route: "woocommerce_webhook", reason: err.message },
          );
          return NextResponse.json(
            { ok: false, error: "jurisdiction_blocked" },
            { status: 403 },
          );
        }
        throw err;
      }
    }

    Sentry.addBreadcrumb({
      category: "webhook",
      level: "info",
      message: "woocommerce_webhook_exit",
      data: {
        route: "woocommerce_webhook",
        id: order.id,
        status: order.status,
      },
    });

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
  } catch (err) {
    captureException(err, {
      tags: { route: "woocommerce_webhook", provider: "woocommerce" },
    });
    return jsonError("internal_error", 500);
  }
}
