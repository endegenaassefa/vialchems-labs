import { cookies } from "next/headers";
import { NextResponse } from "next/server";
import { z } from "zod";
import {
  AGE_VERIFICATION_COOKIE,
  isSignedAgeVerificationCurrent,
} from "@/lib/age-verification";
import {
  calculateCheckoutTotals,
  getLocalPreviewSiteUrl,
  resolveCheckoutCartLines,
  safeCheckoutReturnPath,
} from "@/lib/checkout/cart";
import {
  CHECKOUT_PAYMENT_METHODS,
  isWooCheckoutMethod,
} from "@/lib/checkout/payment-routing";
import { siteConfig } from "@/lib/content/site";
import {
  buildWooOrderPayload,
  createWooOrder,
  createMockWooOrder,
  getWooConfigFromEnv,
  isMockWooHandoffEnabled,
  WooHandoffError,
  type WooHandoffLine,
} from "@/lib/woocommerce/handoff";
import { isAllowedHandoffOrigin } from "@/lib/woocommerce/security";

export const dynamic = "force-dynamic";
export const runtime = "nodejs";

const checkoutPaymentMethodSchema = z.enum(CHECKOUT_PAYMENT_METHODS);

const cartLineSchema = z.object({
  sku: z.string().trim().min(1),
  slug: z.string().trim().min(1),
  qty: z.number().int().min(1).max(10),
});

const createWooOrderSchema = z.object({
  lines: z.array(cartLineSchema).min(1).max(50),
  preferredPaymentMethod: checkoutPaymentMethodSchema.default("link_money"),
  returnPath: z.string().trim().max(256).optional(),
});

function jsonError(error: string, status: number, message?: string): Response {
  return NextResponse.json({ ok: false, error, message }, { status });
}

export async function POST(request: Request): Promise<Response> {
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
      "Checkout handoff is only available from vialchemlabs.net.",
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
      "Complete age and research-use verification before secure checkout.",
    );
  }

  let raw: unknown;
  try {
    raw = await request.json();
  } catch {
    return jsonError("invalid_json", 400);
  }

  const parsed = createWooOrderSchema.safeParse(raw);
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

  if (!isWooCheckoutMethod(parsed.data.preferredPaymentMethod)) {
    return jsonError(
      "payment_method_not_woocommerce",
      400,
      "Bitcoin and Zelle are handled directly on vialchemlabs.net.",
    );
  }

  if (process.env.ENABLE_WOO_CHECKOUT_METHODS !== "true") {
    return jsonError(
      "payment_method_coming_soon",
      503,
      "This secure checkout payment method is coming soon. Use Zelle or Bitcoin.",
    );
  }

  const resolvedLines = resolveCheckoutCartLines(parsed.data.lines);
  if (!resolvedLines.ok) {
    return jsonError("catalog_line_invalid", 400, resolvedLines.message);
  }

  const totals = calculateCheckoutTotals(resolvedLines.lines);

  const siteUrl = siteConfig.url.replace(/\/+$/, "");
  const sourceUrl = `${siteUrl}${safeCheckoutReturnPath(parsed.data.returnPath)}`;
  const returnUrl = `${siteUrl}/order-confirmed`;
  const orderPayload = buildWooOrderPayload({
    lines: resolvedLines.lines as WooHandoffLine[],
    shippingCents: totals.shippingCents,
    preferredPaymentMethod: parsed.data.preferredPaymentMethod,
    sourceUrl,
    returnUrl,
  });

  let wooConfig: ReturnType<typeof getWooConfigFromEnv>;
  try {
    wooConfig = getWooConfigFromEnv();
  } catch (error) {
    if (isMockWooHandoffEnabled()) {
      const previewSiteUrl = getLocalPreviewSiteUrl(requestOrigin, siteUrl);
      const created = createMockWooOrder({
        storeUrl:
          process.env.WOO_MOCK_CHECKOUT_URL?.trim() || "http://localhost:3002",
        lines: resolvedLines.lines as WooHandoffLine[],
        shippingCents: totals.shippingCents,
        preferredPaymentMethod: parsed.data.preferredPaymentMethod,
        returnUrl: `${previewSiteUrl}/order-confirmed`,
      });
      return NextResponse.json({
        ok: true,
        mode: "local-preview",
        orderId: created.id,
        orderKey: created.orderKey,
        checkoutUrl: created.checkoutUrl,
      });
    }

    if (error instanceof WooHandoffError) {
      return jsonError("woo_not_configured", error.status, error.message);
    }
    return jsonError("woo_not_configured", 503, (error as Error).message);
  }

  try {
    const created = await createWooOrder({
      ...wooConfig,
      order: orderPayload,
    });

    return NextResponse.json({
      ok: true,
      orderId: created.id,
      orderKey: created.orderKey,
      checkoutUrl: created.checkoutUrl,
    });
  } catch (error) {
    if (error instanceof WooHandoffError) {
      return jsonError("woo_order_create_failed", error.status, error.message);
    }
    return jsonError("woo_order_create_failed", 502, (error as Error).message);
  }
}
