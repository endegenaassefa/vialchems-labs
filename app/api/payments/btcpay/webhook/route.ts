/**
 * BTCPay webhook receiver. POST-only.
 *
 * Reads the raw body (needed for signature verification), forwards to the
 * BTCPay adapter, then runs reconciliation. Always returns a JSON body with
 * { ok, eventType, applied }. Returns 400 for invalid signatures so BTCPay
 * stops retrying obvious junk; 500 for internal failures so it does retry.
 */
import { NextResponse } from 'next/server';
import { getPaymentProviderById } from '@/lib/payments/config';
import { reconcile } from '@/lib/payments/reconciliation';
import { headersToRecord, readRawBody } from '@/lib/payments/server';

export const dynamic = 'force-dynamic';
export const runtime = 'nodejs'; // crypto.timingSafeEqual requires Node runtime

export async function POST(req: Request) {
  let raw: string;
  try {
    raw = await readRawBody(req);
  } catch {
    return NextResponse.json(
      { ok: false, error: 'invalid_body' },
      { status: 400 },
    );
  }

  const headers = headersToRecord(req);
  const adapter = getPaymentProviderById('btcpay');

  try {
    const result = await adapter.handleWebhook(raw, headers);
    if (!result.verified) {
      return NextResponse.json(
        { ok: false, error: 'invalid_signature' },
        { status: 400 },
      );
    }
    const reconciled = reconcile(result.intent);
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
      { ok: false, error: 'internal_error' },
      { status: 500 },
    );
  }
}
