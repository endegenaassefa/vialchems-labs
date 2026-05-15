import { cookies } from "next/headers";
import { NextResponse } from "next/server";
import { z } from "zod";
import {
  AGE_VERIFICATION_COOKIE,
  isSignedAgeVerificationCurrent,
} from "@/lib/age-verification";
import { siteConfig } from "@/lib/content/site";
import { getBundleBySlug, getProductBySlug } from "@/lib/content/products";
import {
  buildWooOrderPayload,
  createWooOrder,
  getWooConfigFromEnv,
  WooHandoffError,
  type WooHandoffLine,
} from "@/lib/woocommerce/handoff";

export const dynamic = "force-dynamic";
export const runtime = "nodejs";

const checkoutPaymentMethodSchema = z.enum([
  "link_money",
  "bitcoin",
  "card",
  "apple_pay",
  "google_pay",
  "paypal",
]);

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

type CreateWooOrderPayload = z.infer<typeof createWooOrderSchema>;

function jsonError(error: string, status: number, message?: string): Response {
  return NextResponse.json({ ok: false, error, message }, { status });
}

function resolveCatalogLines(
  lines: CreateWooOrderPayload["lines"],
): { ok: true; lines: WooHandoffLine[] } | { ok: false; message: string } {
  const resolved: WooHandoffLine[] = [];

  for (const line of lines) {
    const product = getProductBySlug(line.slug);
    const bundle = product ? undefined : getBundleBySlug(line.slug);
    const item = product ?? bundle;

    if (!item || item.sku !== line.sku) {
      return {
        ok: false,
        message: `Unknown or mismatched catalog line: ${line.sku}`,
      };
    }

    resolved.push({
      sku: item.sku,
      slug: item.slug,
      name: item.name,
      unitPriceCents: item.listPriceCents,
      qty: line.qty,
    });
  }

  return { ok: true, lines: resolved };
}

function safeReturnPath(path: string | undefined): string {
  if (!path?.startsWith("/")) return "/cart";
  if (path.startsWith("//")) return "/cart";
  return path;
}

export async function POST(request: Request): Promise<Response> {
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

  const resolvedLines = resolveCatalogLines(parsed.data.lines);
  if (!resolvedLines.ok) {
    return jsonError("catalog_line_invalid", 400, resolvedLines.message);
  }

  const subtotalCents = resolvedLines.lines.reduce(
    (sum, line) => sum + line.unitPriceCents * line.qty,
    0,
  );
  const shippingCents =
    subtotalCents >= siteConfig.shipping.freeShippingThresholdCents
      ? 0
      : siteConfig.shipping.pilotUSCents;

  let wooConfig: ReturnType<typeof getWooConfigFromEnv>;
  try {
    wooConfig = getWooConfigFromEnv();
  } catch (error) {
    if (error instanceof WooHandoffError) {
      return jsonError("woo_not_configured", error.status, error.message);
    }
    return jsonError("woo_not_configured", 503, (error as Error).message);
  }

  const siteUrl = siteConfig.url.replace(/\/+$/, "");
  const sourceUrl = `${siteUrl}${safeReturnPath(parsed.data.returnPath)}`;
  const returnUrl = `${siteUrl}/order-confirmed`;
  const orderPayload = buildWooOrderPayload({
    lines: resolvedLines.lines,
    shippingCents,
    preferredPaymentMethod: parsed.data.preferredPaymentMethod,
    sourceUrl,
    returnUrl,
  });

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
