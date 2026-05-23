import { cookies } from "next/headers";
import { NextResponse } from "next/server";
import type { SupabaseClient } from "@supabase/supabase-js";
import { z } from "zod";
import {
  AGE_VERIFICATION_COOKIE,
  isSignedAgeVerificationCurrent,
} from "@/lib/age-verification";
import { validateShippingAddress } from "@/lib/compliance/jurisdictions";
import {
  ATTESTATIONS,
  qualificationSchema,
} from "@/lib/customer-qualification";
import { siteConfig } from "@/lib/content/site";
import { getBundleBySlug, getProductBySlug } from "@/lib/content/products";
import { calculatePromoDiscount } from "@/lib/content/promo-codes";
import { getPaymentProvider } from "@/lib/payments/config";
import {
  applyPaymentMethodDiscount,
  type PaymentIntent,
} from "@/lib/payments/types";
import { serviceSupabase } from "@/lib/supabase";
import { sendOrderConfirmation } from "@/lib/email/order-confirmation";
import { sendOperatorOrderNotification } from "@/lib/email/operator-notification";
import { captureException } from "@/lib/sentry";
import { trackServerEvent } from "@/lib/analytics/server-track";
import { FUNNEL_EVENTS } from "@/lib/analytics/events";

export const dynamic = "force-dynamic";
export const runtime = "nodejs";

const addressSchema = z.object({
  name: z.string().trim().min(1),
  email: z.string().trim().email(),
  street: z.string().trim().min(1),
  street2: z.string().trim(),
  city: z.string().trim().min(1),
  stateCode: z.string().trim().min(2).max(2),
  zip: z.string().trim().min(5),
  countryCode: z.string().trim().min(2).max(2),
});

const lineSchema = z.object({
  sku: z.string().trim().min(1),
  slug: z.string().trim().min(1),
  qty: z.number().int().min(1).max(10),
});

const createOrderSchema = z.object({
  address: addressSchema,
  method: z.enum(["crypto", "ach"]),
  lines: z.array(lineSchema).min(1).max(50),
  qualification: qualificationSchema,
  promoCode: z.string().trim().min(1).max(64).nullable().optional(),
});

type CreateOrderPayload = z.infer<typeof createOrderSchema>;

interface PricedLine {
  sku: string;
  slug: string;
  name: string;
  unitPriceCents: number;
  qty: number;
}

function jsonError(error: string, status: number, message?: string): Response {
  return NextResponse.json({ ok: false, error, message }, { status });
}

async function sha256Hex(input: string): Promise<string> {
  const data = new TextEncoder().encode(input);
  const buf = await crypto.subtle.digest("SHA-256", data);
  return Array.from(new Uint8Array(buf))
    .map((b) => b.toString(16).padStart(2, "0"))
    .join("");
}

function resolveCatalogLines(
  lines: CreateOrderPayload["lines"],
): { ok: true; lines: PricedLine[] } | { ok: false; message: string } {
  const priced: PricedLine[] = [];

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

    priced.push({
      sku: item.sku,
      slug: item.slug,
      name: item.name,
      unitPriceCents: item.listPriceCents,
      qty: line.qty,
    });
  }

  return { ok: true, lines: priced };
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
      "Complete age and research-use verification before checkout.",
    );
  }

  let raw: unknown;
  try {
    raw = await request.json();
  } catch {
    return jsonError("invalid_json", 400);
  }

  const parsed = createOrderSchema.safeParse(raw);
  if (!parsed.success) {
    return NextResponse.json(
      {
        ok: false,
        error: "invalid_order",
        issues: parsed.error.issues.map((issue) => ({
          field: issue.path.join("."),
          message: issue.message,
        })),
      },
      { status: 400 },
    );
  }

  const payload = parsed.data;
  const shippingValidation = validateShippingAddress(payload.address);
  if (!shippingValidation.ok) {
    return jsonError(
      "jurisdiction_not_allowed",
      400,
      shippingValidation.reason,
    );
  }

  if (payload.method === "ach") {
    return jsonError(
      "ach_not_enabled",
      400,
      "ACH checkout is not enabled for live orders yet.",
    );
  }

  const resolvedLines = resolveCatalogLines(payload.lines);
  if (!resolvedLines.ok) {
    return jsonError("catalog_line_invalid", 400, resolvedLines.message);
  }

  let provider;
  try {
    provider = getPaymentProvider();
  } catch (error) {
    return jsonError(
      "payment_provider_not_configured",
      503,
      (error as Error).message,
    );
  }

  if (provider.id === "plaid") {
    return jsonError(
      "payment_provider_method_mismatch",
      503,
      "Plaid ACH is not enabled for live checkout.",
    );
  }

  const lines = resolvedLines.lines;
  const subtotalCents = lines.reduce(
    (sum, line) => sum + line.unitPriceCents * line.qty,
    0,
  );
  const methodDiscount = applyPaymentMethodDiscount(
    subtotalCents,
    payload.method,
  );

  let promoCode: string | null = null;
  let promoDiscountCents = 0;
  if (payload.promoCode) {
    const promo = calculatePromoDiscount(payload.promoCode, subtotalCents);
    if (!promo) {
      return jsonError("promo_invalid", 400, "Promo code is not recognized.");
    }
    promoCode = promo.promo.code;
    promoDiscountCents = promo.discountCents;
  }

  const shippingCents =
    subtotalCents >= siteConfig.shipping.freeShippingThresholdCents
      ? 0
      : siteConfig.shipping.pilotUSCents;
  const discountCents = methodDiscount.discountCents + promoDiscountCents;
  const totalCents = subtotalCents - discountCents + shippingCents;
  const displayId = `VC-${crypto.randomUUID().slice(0, 8).toUpperCase()}`;
  const placedAt = new Date().toISOString();
  const attestationHash = await sha256Hex(ATTESTATIONS.join("\n"));

  let supabase: SupabaseClient | null = null;
  try {
    supabase = serviceSupabase();
  } catch (error) {
    return jsonError("supabase_not_configured", 503, (error as Error).message);
  }

  let databaseOrderId: string | null = null;
  let qualificationId: string | null = null;

  if (supabase) {
    const ipAddress =
      request.headers.get("x-forwarded-for")?.split(",")[0]?.trim() ?? null;
    const userAgent = request.headers.get("user-agent") ?? null;

    const qualificationInsert = await supabase
      .from("customer_qualifications")
      .insert({
        email: payload.qualification.email,
        payload: payload.qualification,
        attestation_text_sha256: attestationHash,
        ip_address: ipAddress,
        user_agent: userAgent,
      })
      .select("id")
      .single();

    if (qualificationInsert.error) {
      return jsonError(
        "qualification_persist_failed",
        500,
        qualificationInsert.error.message,
      );
    }
    qualificationId = qualificationInsert.data.id;

    const attestationInsert = await supabase.from("attestations_audit").insert({
      qualification_id: qualificationId,
      email: payload.qualification.email,
      attestations: {
        age_21_plus: payload.qualification.ageAcknowledgment,
        ruo_acknowledged: payload.qualification.ruoAcknowledgment,
        jurisdictional_acknowledged:
          payload.qualification.jurisdictionAcknowledgment,
        attestations_block_acknowledged:
          payload.qualification.attestationsAcknowledged,
      },
      legal_text_sha256: attestationHash,
      ip_address: ipAddress,
      user_agent: userAgent,
    });
    if (attestationInsert.error) {
      return jsonError(
        "attestation_persist_failed",
        500,
        attestationInsert.error.message,
      );
    }

    const orderInsert = await supabase
      .from("orders")
      .insert({
        display_id: displayId,
        email: payload.address.email,
        shipping_address_snapshot: payload.address,
        status: "awaiting_payment",
        payment_provider: provider.id,
        promo_code: promoCode,
        subtotal_cents: subtotalCents,
        discount_cents: discountCents,
        shipping_cents: shippingCents,
        total_cents: totalCents,
        placed_at: placedAt,
      })
      .select("id")
      .single();

    if (orderInsert.error) {
      return jsonError("order_persist_failed", 500, orderInsert.error.message);
    }
    databaseOrderId = orderInsert.data.id;

    const itemsInsert = await supabase.from("order_items").insert(
      lines.map((line) => ({
        order_id: databaseOrderId,
        sku: line.sku,
        slug: line.slug,
        name_snapshot: line.name,
        unit_price_cents: line.unitPriceCents,
        quantity: line.qty,
      })),
    );
    if (itemsInsert.error) {
      return jsonError(
        "order_items_persist_failed",
        500,
        itemsInsert.error.message,
      );
    }

    const statusInsert = await supabase.from("order_status_history").insert({
      order_id: databaseOrderId,
      to_status: "awaiting_payment",
      reason: "checkout.created",
    });
    if (statusInsert.error) {
      return jsonError(
        "order_status_persist_failed",
        500,
        statusInsert.error.message,
      );
    }
  }

  let paymentIntent: PaymentIntent;
  try {
    paymentIntent = await provider.createIntent({
      amountCents: totalCents,
      method: payload.method,
      orderId: displayId,
      customerEmail: payload.address.email,
      metadata: {
        displayId,
        // B3: `order_id` is the canonical key the reconciliation resolver +
        // persistence layer read (lib/payments/reconciliation.ts:154, :376).
        // `databaseOrderId` is retained for backward-compat with any code that
        // grew up reading the legacy key, but `order_id` is what makes Layer
        // 3 jurisdictional guard + durable payments write find the order.
        ...(databaseOrderId
          ? { order_id: databaseOrderId, databaseOrderId }
          : {}),
        ...(qualificationId ? { qualificationId } : {}),
        promoCode: promoCode ?? "",
      },
    });
  } catch (error) {
    if (supabase && databaseOrderId) {
      await supabase
        .from("orders")
        .update({ status: "cancelled", cancelled_at: new Date().toISOString() })
        .eq("id", databaseOrderId);
    }
    return jsonError("payment_intent_failed", 502, (error as Error).message);
  }

  if (supabase && databaseOrderId) {
    const paymentInsert = await supabase.from("payments").insert({
      order_id: databaseOrderId,
      provider: paymentIntent.provider,
      provider_intent_id: paymentIntent.id,
      status: paymentIntent.status,
      amount_cents: paymentIntent.amountCents,
      currency: paymentIntent.currency,
      method_details: {
        method: payload.method,
        external_id: paymentIntent.externalId,
        redirect_url: paymentIntent.redirectUrl,
      },
    });

    if (paymentInsert.error) {
      return jsonError(
        "payment_persist_failed",
        500,
        paymentInsert.error.message,
      );
    }

    const auditInsert = await supabase.from("audit_log").insert({
      event_type: "order.placed",
      order_id: databaseOrderId,
      details: {
        display_id: displayId,
        payment_provider: paymentIntent.provider,
        payment_intent_id: paymentIntent.id,
        qualification_id: qualificationId,
      },
    });
    if (auditInsert.error) {
      return jsonError("audit_persist_failed", 500, auditInsert.error.message);
    }
  }

  // B3 + C4 — order-created notifications. Both helpers stay
  // stub-safe when REQUIRE_RESEND=false. Best-effort: failures
  // are reported to Sentry but never fail the order response,
  // because the order is already persisted and the customer
  // saw it. The operator notification surfaces order-events
  // even if the customer ack failed.
  // Iron Law 2.20 freezes PaymentProviderId to
  // 'stub' | 'btcpay' | 'plaid' | 'zelle'. bitcoin-direct is
  // a routing fallback within the BTCPay rail, not a member of
  // the union; it never appears as paymentIntent.provider here.
  const railTag: "btcpay" | "plaid" | "zelle" | "bitcoin-direct" | "stub" =
    paymentIntent.provider;

  try {
    await sendOrderConfirmation({
      displayId,
      customerEmail: payload.qualification.email,
      totalCents,
      rail: railTag,
      status: "awaiting_payment",
      items: lines.map((l) => ({
        name: l.name,
        qty: l.qty,
        unitPriceCents: l.unitPriceCents,
      })),
    });
  } catch (error) {
    captureException(error, {
      tags: {
        route: "checkout/orders",
        provider: "resend",
        phase: "customer_ack",
      },
    });
  }

  try {
    await sendOperatorOrderNotification({
      event: "placed",
      displayId,
      totalCents,
      rail: railTag,
      customerEmail: payload.qualification.email,
    });
  } catch (error) {
    captureException(error, {
      tags: {
        route: "checkout/orders",
        provider: "resend",
        phase: "operator_notify",
      },
    });
  }

  // D4 funnel event — order_placed. Fires server-side because the
  // total + rail come from server-validated state; the client-side
  // track() call wouldn't have authoritative values. Visitor IP +
  // User-Agent are forwarded so Plausible attributes the event to
  // the correct visitor (not the server).
  void trackServerEvent({
    event: FUNNEL_EVENTS.ORDER_PLACED,
    props: { provider: paymentIntent.provider, total_cents: totalCents },
    visitorIp:
      request.headers.get("x-forwarded-for")?.split(",")[0]?.trim() ?? undefined,
    userAgent: request.headers.get("user-agent") ?? undefined,
  });

  return NextResponse.json({
    ok: true,
    order: {
      id: displayId,
      databaseId: databaseOrderId,
      placedAt,
      method: payload.method,
      lines,
      subtotalCents,
      methodDiscountCents: methodDiscount.discountCents,
      promoDiscountCents,
      discountCents,
      shippingCents,
      totalCents,
      address: payload.address,
      qualification: {
        email: payload.qualification.email,
        role: payload.qualification.role,
      },
      appliedPromo: promoCode,
      persisted: Boolean(databaseOrderId),
      paymentProvider: paymentIntent.provider,
      paymentIntentId: paymentIntent.id,
      paymentStatus: paymentIntent.status,
    },
    paymentIntent: {
      id: paymentIntent.id,
      provider: paymentIntent.provider,
      status: paymentIntent.status,
      redirectUrl: paymentIntent.redirectUrl,
    },
  });
}
