/**
 * BTCPay webhook receiver. POST-only.
 *
 * Reads the raw body (needed for signature verification), forwards to the
 * BTCPay adapter, then runs reconciliation. Always returns a JSON body with
 * { ok, eventType, applied }. Returns 400 for invalid signatures so BTCPay
 * stops retrying obvious junk; 500 for internal failures so it does retry.
 *
 * Phase 3.3 (v5) — Iron Law 2.31 (Layer 3 jurisdictional guard) and Iron
 * Law 2.32 (Sentry instrumentation). assertOrderJurisdictionAllowed is
 * invoked BEFORE reconcile() so a blocked address cannot reach a credited
 * status even if Layers 1+2 were bypassed. captureException tags every
 * internal error with { route, provider }.
 *
 * Closes audit C13 + H3 + H7 + S5 + S6 + S12.
 */
import { NextResponse } from "next/server";
import * as Sentry from "@sentry/nextjs";
import { getPaymentProviderById } from "@/lib/payments/config";
import {
  assertOrderJurisdictionAllowed,
  JurisdictionalGuardError,
  reconcile,
} from "@/lib/payments/reconciliation";
import { headersToRecord, readRawBody } from "@/lib/payments/server";
import { captureException, captureMessage } from "@/lib/sentry";

export const dynamic = "force-dynamic";
export const runtime = "nodejs"; // crypto.timingSafeEqual requires Node runtime

export async function POST(req: Request) {
  let raw: string;
  try {
    raw = await readRawBody(req);
  } catch {
    return NextResponse.json(
      { ok: false, error: "invalid_body" },
      { status: 400 },
    );
  }

  const headers = headersToRecord(req);
  const adapter = getPaymentProviderById("btcpay");

  try {
    Sentry.addBreadcrumb({
      category: "webhook",
      level: "info",
      message: "btcpay_webhook_entry",
      data: { route: "btcpay_webhook" },
    });

    const result = await adapter.handleWebhook(raw, headers);
    if (!result.verified) {
      captureMessage("btcpay_webhook_invalid_signature", "warning", {
        route: "btcpay_webhook",
      });
      return NextResponse.json(
        { ok: false, error: "invalid_signature" },
        { status: 400 },
      );
    }

    // Layer 3 jurisdiction guard — Iron Law 2.31. Refuse to credit when
    // the order's shipping address resolves outside allowed jurisdictions.
    if (result.intent) {
      try {
        await assertOrderJurisdictionAllowed(result.intent);
      } catch (err) {
        if (err instanceof JurisdictionalGuardError) {
          captureMessage("btcpay_webhook_jurisdiction_blocked", "warning", {
            route: "btcpay_webhook",
            reason: err.message,
          });
          return NextResponse.json(
            { ok: false, error: "jurisdiction_blocked" },
            { status: 403 },
          );
        }
        throw err;
      }
    }

    const reconciled = await reconcile(result.intent);

    Sentry.addBreadcrumb({
      category: "webhook",
      level: "info",
      message: "btcpay_webhook_reconciled",
      data: {
        applied: reconciled.applied,
        reason: reconciled.reason ?? "n/a",
      },
    });

    return NextResponse.json(
      {
        ok: true,
        eventType: result.eventType,
        applied: reconciled.applied,
        reason: reconciled.reason,
      },
      { status: 200 },
    );
  } catch (err) {
    captureException(err, {
      tags: { route: "btcpay_webhook", provider: "btcpay" },
    });
    return NextResponse.json(
      { ok: false, error: "internal_error" },
      { status: 500 },
    );
  }
}
