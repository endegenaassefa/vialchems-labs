/**
 * Plaid webhook receiver. POST-only.
 *
 * Identical shape to the BTCPay receiver — verify signature, dispatch to the
 * adapter, reconcile, return JSON. Returns 400 for bad signatures (stops
 * retries) and 500 for internal errors (allows retries).
 */
import { NextResponse } from "next/server";
import { getPaymentProviderById } from "@/lib/payments/config";
import { reconcile } from "@/lib/payments/reconciliation";
import { headersToRecord, readRawBody } from "@/lib/payments/server";

export const dynamic = "force-dynamic";
export const runtime = "nodejs";

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
  const adapter = getPaymentProviderById("plaid");

  try {
    const result = await adapter.handleWebhook(raw, headers);
    if (!result.verified) {
      return NextResponse.json(
        { ok: false, error: "invalid_signature" },
        { status: 400 },
      );
    }
    const reconciled = await reconcile(result.intent);
    return NextResponse.json(
      {
        ok: true,
        eventType: result.eventType,
        applied: reconciled.applied,
        reason: reconciled.reason,
      },
      { status: 200 },
    );
  } catch {
    return NextResponse.json(
      { ok: false, error: "internal_error" },
      { status: 500 },
    );
  }
}
