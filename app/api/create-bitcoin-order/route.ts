import { cookies } from "next/headers";
import { NextResponse } from "next/server";
import * as Sentry from "@sentry/nextjs";
import { z } from "zod";
import {
  AGE_VERIFICATION_COOKIE,
  isSignedAgeVerificationCurrent,
} from "@/lib/age-verification";
import {
  buildBitcoinCheckoutUrl,
  getBtcpayAdapterEnv,
  getMissingBtcpayCredentials,
  shouldUseDirectPaymentPlaceholder,
} from "@/lib/checkout/direct-payment";
import {
  buildBitcoinDirectCheckoutUrl,
  fetchBitcoinQuote,
  getBitcoinDirectDetails,
  getBitcoinDirectSigningSecret,
  isBitcoinDirectConfigured,
} from "@/lib/payments/bitcoin-direct";
import {
  calculateCheckoutTotals,
  generateMainSiteOrderReference,
  getLocalPreviewSiteUrl,
  resolveCheckoutCartLines,
} from "@/lib/checkout/cart";
import { siteConfig } from "@/lib/content/site";
import { createBtcpayAdapter } from "@/lib/payments/btcpay";
import { isProductionRuntime } from "@/lib/runtime-env";
import { captureException } from "@/lib/sentry";
import { isAllowedHandoffOrigin } from "@/lib/woocommerce/security";

/**
 * Phase 3.3 (v5) — Sentry instrumentation per Iron Law 2.32. Layer 3 not
 * invoked here: shipping address is captured at /bitcoin/receipt, so this
 * create-intent surface has no address. Layer 1 + 2 + receipt-level Layer
 * 3 remain authoritative.
 */

export const dynamic = "force-dynamic";
export const runtime = "nodejs";

const cartLineSchema = z.object({
  sku: z.string().trim().min(1),
  slug: z.string().trim().min(1),
  qty: z.number().int().min(1).max(10),
});

const createBitcoinOrderSchema = z.object({
  lines: z.array(cartLineSchema).min(1).max(50),
  returnPath: z.string().trim().max(256).optional(),
});

function jsonError(error: string, status: number, message?: string): Response {
  return NextResponse.json({ ok: false, error, message }, { status });
}

async function createDirectBitcoinCheckout({
  siteUrl,
  orderId,
  amountCents,
}: {
  siteUrl: string;
  orderId: string;
  amountCents: number;
}): Promise<Response> {
  const details = getBitcoinDirectDetails();
  const quote = await fetchBitcoinQuote({ amountCents, details });
  return NextResponse.json({
    ok: true,
    mode: "direct-bitcoin",
    orderId,
    checkoutUrl: buildBitcoinDirectCheckoutUrl({
      siteUrl,
      orderId,
      amountCents,
      details,
      quote,
      signingSecret: getBitcoinDirectSigningSecret(),
    }),
  });
}

async function verifyCheckoutRequest(
  request: Request,
): Promise<Response | null> {
  const requestOrigin = request.headers.get("origin");
  const originAllowed = isAllowedHandoffOrigin(
    requestOrigin,
    siteConfig.url,
    process.env.CHECKOUT_ALLOWED_ORIGINS ?? "",
    { allowLocalhost: process.env.NODE_ENV !== "production" },
  );

  if (!originAllowed) {
    return jsonError(
      "checkout_origin_forbidden",
      403,
      "Checkout is only available from VialChem Labs.",
    );
  }

  const cookieStore = await cookies();
  const ageCookie = cookieStore.get(AGE_VERIFICATION_COOKIE)?.value;
  const ageVerified = await isSignedAgeVerificationCurrent(ageCookie).catch(
    () => false,
  );

  if (!ageVerified) {
    return jsonError(
      "age_gate_required",
      403,
      "Complete age and research-use verification before Bitcoin checkout.",
    );
  }

  return null;
}

export async function POST(request: Request): Promise<Response> {
  Sentry.addBreadcrumb({
    category: "webhook",
    level: "info",
    message: "create_bitcoin_order_entry",
    data: { route: "create_bitcoin_order" },
  });

  const verificationError = await verifyCheckoutRequest(request);
  if (verificationError) return verificationError;

  let raw: unknown;
  try {
    raw = await request.json();
  } catch {
    return jsonError("invalid_json", 400);
  }

  const parsed = createBitcoinOrderSchema.safeParse(raw);
  if (!parsed.success) {
    return NextResponse.json(
      {
        ok: false,
        error: "invalid_cart",
        issues: parsed.error.issues.map((issue) => ({
          field: issue.path.join("."),
          message: issue.message,
        })),
      },
      { status: 400 },
    );
  }

  const resolvedLines = resolveCheckoutCartLines(parsed.data.lines);
  if (!resolvedLines.ok) {
    return jsonError("catalog_line_invalid", 400, resolvedLines.message);
  }

  const totals = calculateCheckoutTotals(resolvedLines.lines);
  const siteUrl = siteConfig.url.replace(/\/+$/, "");
  const requestOrigin = request.headers.get("origin");
  const previewSiteUrl = getLocalPreviewSiteUrl(requestOrigin, siteUrl);
  const orderId = generateMainSiteOrderReference();
  const returnUrl = `${previewSiteUrl}/order-confirmed?order=${encodeURIComponent(orderId)}`;
  const missing = getMissingBtcpayCredentials();
  const allowPlaceholder = shouldUseDirectPaymentPlaceholder();

  if (missing.length > 0) {
    if (isBitcoinDirectConfigured()) {
      try {
        return await createDirectBitcoinCheckout({
          siteUrl: previewSiteUrl,
          orderId,
          amountCents: totals.totalCents,
        });
      } catch (error) {
        captureException(error, {
          tags: {
            route: "create_bitcoin_order",
            provider: "bitcoin-direct",
          },
        });
        if (isProductionRuntime()) {
          return jsonError(
            "bitcoin_direct_quote_failed",
            502,
            (error as Error).message,
          );
        }
      }
    }

    if (isProductionRuntime() && !allowPlaceholder) {
      return jsonError(
        "missing_credential",
        503,
        `Missing required credential: ${missing[0]}`,
      );
    }

    return NextResponse.json({
      ok: true,
      mode: "local-preview",
      orderId,
      checkoutUrl: buildBitcoinCheckoutUrl({
        siteUrl: previewSiteUrl,
        orderId,
        amountCents: totals.totalCents,
        invoiceId: "btcpay_local_preview",
        placeholder: true,
      }),
    });
  }

  try {
    const provider = createBtcpayAdapter({ env: getBtcpayAdapterEnv() });
    const intent = await provider.createIntent({
      amountCents: totals.totalCents,
      method: "crypto",
      orderId,
      customerEmail: siteConfig.email.staff[0] ?? `ops@${siteConfig.domain}`,
      metadata: {
        source: "vialchemlabs-main-site",
        returnUrl,
        skus: resolvedLines.lines.map((line) => line.sku).join(","),
        itemCount: String(
          resolvedLines.lines.reduce((sum, line) => sum + line.qty, 0),
        ),
        // B3-followup: shipping address is captured at `/bitcoin/receipt`,
        // not at invoice creation. Mark the intent so the Layer 3 guard at
        // the BTCPay webhook does not fail-close on the missing order_id /
        // unresolvable address — the receipt route is the authoritative
        // jurisdiction enforcement point for this flow.
        address_capture_deferred: "true",
      },
    });

    return NextResponse.json({
      ok: true,
      orderId,
      paymentIntentId: intent.id,
      checkoutUrl: buildBitcoinCheckoutUrl({
        siteUrl: previewSiteUrl,
        orderId,
        amountCents: totals.totalCents,
        invoiceId: intent.id,
        invoiceUrl: intent.redirectUrl,
      }),
    });
  } catch (error) {
    captureException(error, {
      tags: { route: "create_bitcoin_order", provider: "btcpay" },
    });
    if (isBitcoinDirectConfigured()) {
      try {
        return await createDirectBitcoinCheckout({
          siteUrl: previewSiteUrl,
          orderId,
          amountCents: totals.totalCents,
        });
      } catch (fallbackError) {
        captureException(fallbackError, {
          tags: {
            route: "create_bitcoin_order",
            provider: "bitcoin-direct",
          },
        });
        return jsonError(
          "bitcoin_direct_quote_failed",
          502,
          (fallbackError as Error).message,
        );
      }
    }

    return jsonError(
      "bitcoin_order_create_failed",
      502,
      (error as Error).message,
    );
  }
}
