import { cookies } from "next/headers";
import { NextResponse } from "next/server";
import { z } from "zod";
import {
  AGE_VERIFICATION_COOKIE,
  isSignedAgeVerificationCurrent,
} from "@/lib/age-verification";
import {
  buildZelleCheckoutUrl,
  getMissingZelleCredentials,
  getZelleCheckoutSigningSecret,
  getZelleDetails,
  shouldUseDirectPaymentPlaceholder,
} from "@/lib/checkout/direct-payment";
import {
  calculateCheckoutTotals,
  generateMainSiteOrderReference,
  getLocalPreviewSiteUrl,
  resolveCheckoutCartLines,
} from "@/lib/checkout/cart";
import { siteConfig } from "@/lib/content/site";
import { createZelleAdapter } from "@/lib/payments/zelle";
import { isProductionRuntime } from "@/lib/runtime-env";
import { isAllowedHandoffOrigin } from "@/lib/woocommerce/security";

export const dynamic = "force-dynamic";
export const runtime = "nodejs";

const cartLineSchema = z.object({
  sku: z.string().trim().min(1),
  slug: z.string().trim().min(1),
  qty: z.number().int().min(1).max(10),
});

const createZelleOrderSchema = z.object({
  lines: z.array(cartLineSchema).min(1).max(50),
  returnPath: z.string().trim().max(256).optional(),
});

function jsonError(error: string, status: number, message?: string): Response {
  return NextResponse.json({ ok: false, error, message }, { status });
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
      "Checkout is only available from vialchemlabs.net.",
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
      "Complete age and research-use verification before Zelle checkout.",
    );
  }

  return null;
}

export async function POST(request: Request): Promise<Response> {
  const verificationError = await verifyCheckoutRequest(request);
  if (verificationError) return verificationError;

  let raw: unknown;
  try {
    raw = await request.json();
  } catch {
    return jsonError("invalid_json", 400);
  }

  const parsed = createZelleOrderSchema.safeParse(raw);
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
  const missing = getMissingZelleCredentials();
  const allowPlaceholder = shouldUseDirectPaymentPlaceholder();
  const signingSecret = getZelleCheckoutSigningSecret();

  if (missing.length > 0 && isProductionRuntime() && !allowPlaceholder) {
    return jsonError(
      "missing_credential",
      503,
      `Missing required credential: ${missing[0]}`,
    );
  }

  if (!signingSecret && isProductionRuntime()) {
    return jsonError(
      "missing_credential",
      503,
      "Missing required credential: ZELLE_CHECKOUT_SIGNING_SECRET or AGE_GATE_SECRET",
    );
  }

  try {
    const adapter = createZelleAdapter({
      allowPlaceholders: allowPlaceholder,
    });
    await adapter.createIntent({
      amountCents: totals.totalCents,
      method: "zelle",
      orderId,
      customerEmail: siteConfig.email.staff[0] ?? `ops@${siteConfig.domain}`,
      metadata: {
        source: "vialchemlabs-main-site",
        skus: resolvedLines.lines.map((line) => line.sku).join(","),
        itemCount: String(
          resolvedLines.lines.reduce((sum, line) => sum + line.qty, 0),
        ),
      },
    });

    return NextResponse.json({
      ok: true,
      mode: missing.length > 0 ? "local-preview" : "live",
      orderId,
      checkoutUrl: buildZelleCheckoutUrl({
        siteUrl: previewSiteUrl,
        orderId,
        amountCents: totals.totalCents,
        details: getZelleDetails(process.env, {
          allowPlaceholders: allowPlaceholder,
        }),
        signingSecret,
      }),
    });
  } catch (error) {
    return jsonError(
      "zelle_order_create_failed",
      502,
      (error as Error).message,
    );
  }
}
