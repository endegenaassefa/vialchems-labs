import { NextResponse } from "next/server";
import * as Sentry from "@sentry/nextjs";
import { z } from "zod";
import {
  getBitcoinDirectSigningSecret,
  verifyBitcoinDirectCheckoutSignature,
} from "@/lib/payments/bitcoin-direct";
import {
  assertOrderJurisdictionAllowed,
  JurisdictionalGuardError,
} from "@/lib/payments/reconciliation";
import { siteConfig } from "@/lib/content/site";
import { sendEmail } from "@/lib/email/resend";
import { isProductionRuntime } from "@/lib/runtime-env";
import { captureException, captureMessage } from "@/lib/sentry";

/**
 * Phase 3.3 (v5) — Layer 3 + Sentry per Iron Law 2.31 + 2.32. Bitcoin-direct
 * is buyer-attested + chain-verified via the receive address; the shipping
 * address rides on the signed receipt body. Layer 3 runs at handler entry
 * BEFORE we forward the staff-notification email.
 */

export const dynamic = "force-dynamic";
export const runtime = "nodejs";

const receiptSchema = z.object({
  order: z
    .string()
    .trim()
    .regex(/^[A-Za-z0-9_-]{1,64}$/),
  amountCents: z.number().int().min(1).max(500000),
  btcSats: z.number().int().min(1).max(2100000000000000),
  btcAmount: z
    .string()
    .trim()
    .regex(/^\d+(\.\d{1,8})?$/),
  btcUsdCents: z.number().int().min(1),
  address: z.string().trim().min(26).max(120),
  rateSource: z.string().trim().min(1).max(2048),
  quotedAt: z.string().trim().min(1).max(80),
  supportEmail: z.string().trim().email().max(160),
  sig: z
    .string()
    .trim()
    .regex(/^[a-f0-9]{64}$/i),
  txid: z
    .string()
    .trim()
    .regex(/^[a-f0-9]{64}$/i),
  customer: z.object({
    name: z.string().trim().min(1).max(120),
    email: z.string().trim().email().max(160),
    street: z.string().trim().min(1).max(180),
    street2: z.string().trim().max(120).optional(),
    city: z.string().trim().min(1).max(100),
    stateCode: z.string().trim().length(2),
    zip: z.string().trim().min(5).max(12),
    countryCode: z.literal("US"),
    attestation: z.literal(true),
  }),
});

function jsonError(error: string, status: number, message?: string): Response {
  return NextResponse.json({ ok: false, error, message }, { status });
}

function signedParams(input: z.infer<typeof receiptSchema>): URLSearchParams {
  const params = new URLSearchParams();
  params.set("order", input.order);
  params.set("amount_cents", String(input.amountCents));
  params.set("btc_sats", String(input.btcSats));
  params.set("btc_amount", input.btcAmount);
  params.set("btc_usd_cents", String(input.btcUsdCents));
  params.set("address", input.address);
  params.set("rate_source", input.rateSource);
  params.set("quoted_at", input.quotedAt);
  params.set("support_email", input.supportEmail);
  params.set("sig", input.sig);
  return params;
}

function formatUsd(cents: number): string {
  return `$${(cents / 100).toFixed(2)}`;
}

export async function POST(request: Request): Promise<Response> {
  Sentry.addBreadcrumb({
    category: "webhook",
    level: "info",
    message: "bitcoin_receipt_entry",
    data: { route: "bitcoin_receipt" },
  });

  let raw: unknown;
  try {
    raw = await request.json();
  } catch {
    return jsonError("invalid_json", 400);
  }

  const parsed = receiptSchema.safeParse(raw);
  if (!parsed.success) {
    return NextResponse.json(
      {
        ok: false,
        error: "invalid_receipt",
        issues: parsed.error.issues.map((issue) => ({
          field: issue.path.join("."),
          message: issue.message,
        })),
      },
      { status: 400 },
    );
  }

  const payload = parsed.data;
  if (
    !verifyBitcoinDirectCheckoutSignature(
      signedParams(payload),
      getBitcoinDirectSigningSecret(),
    )
  ) {
    return jsonError("invalid_signature", 400);
  }

  // Iron Law 2.31 — Layer 3 jurisdiction guard at signed-receipt entry.
  try {
    await assertOrderJurisdictionAllowed({
      countryCode: payload.customer.countryCode,
      stateCode: payload.customer.stateCode,
    });
  } catch (err) {
    if (err instanceof JurisdictionalGuardError) {
      captureMessage("bitcoin_receipt_jurisdiction_blocked", "warning", {
        route: "bitcoin_receipt",
        reason: err.message,
      });
      return jsonError("jurisdiction_blocked", 403, err.message);
    }
    captureException(err, {
      tags: { route: "bitcoin_receipt", provider: "bitcoin-direct" },
    });
    return jsonError("internal_error", 500);
  }

  const text = [
    "Bitcoin payment receipt submitted.",
    "",
    `Order: ${payload.order}`,
    `USD total: ${formatUsd(payload.amountCents)}`,
    `BTC amount: ${payload.btcAmount}`,
    `Satoshis: ${payload.btcSats}`,
    `Receive address: ${payload.address}`,
    `Transaction ID: ${payload.txid}`,
    "",
    "Buyer",
    `Name: ${payload.customer.name}`,
    `Email: ${payload.customer.email}`,
    "",
    "Shipping",
    payload.customer.street,
    payload.customer.street2 ?? "",
    `${payload.customer.city}, ${payload.customer.stateCode.toUpperCase()} ${payload.customer.zip}`,
    payload.customer.countryCode,
  ]
    .filter((line) => line !== "")
    .join("\n");

  try {
    await sendEmail({
      to: siteConfig.email.staff.map((value) => value.trim()),
      from: process.env.ORDER_EMAIL_FROM,
      replyTo: payload.customer.email,
      subject: `Bitcoin receipt: ${payload.order}`,
      text,
      tag: "order-confirmation",
    });
  } catch (error) {
    captureException(error, {
      tags: { route: "bitcoin_receipt", provider: "bitcoin-direct" },
    });
    if (isProductionRuntime()) {
      return jsonError(
        "bitcoin_receipt_dispatch_failed",
        502,
        (error as Error).message,
      );
    }
  }

  Sentry.addBreadcrumb({
    category: "webhook",
    level: "info",
    message: "bitcoin_receipt_exit",
    data: { route: "bitcoin_receipt", order: payload.order },
  });

  return NextResponse.json({ ok: true, order: payload.order });
}
