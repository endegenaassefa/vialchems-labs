import { NextResponse } from "next/server";
import { z } from "zod";
import {
  getZelleCheckoutSigningSecret,
  verifyZelleCheckoutSignature,
} from "@/lib/checkout/direct-payment";
import { validateShippingAddress } from "@/lib/compliance/jurisdictions";
import { siteConfig } from "@/lib/content/site";
import { sendEmail } from "@/lib/email/resend";
import { isProductionRuntime } from "@/lib/runtime-env";

export const dynamic = "force-dynamic";
export const runtime = "nodejs";

const receiptSchema = z.object({
  order: z
    .string()
    .trim()
    .regex(/^[A-Za-z0-9_-]{1,64}$/),
  amountCents: z.number().int().min(1).max(500000),
  recipientName: z.string().trim().min(1).max(120),
  recipientHandle: z.string().trim().min(1).max(120),
  memo: z.string().trim().min(1).max(140),
  zelleEmail: z.string().trim().email().or(z.literal("")).optional(),
  supportEmail: z.string().trim().email().or(z.literal("")).optional(),
  sig: z
    .string()
    .trim()
    .regex(/^[a-f0-9]{64}$/i),
  customer: z.object({
    name: z.string().trim().min(1).max(120),
    email: z.string().trim().email().max(160),
    senderName: z.string().trim().max(120).optional(),
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
  params.set("recipient_name", input.recipientName);
  params.set("recipient_handle", input.recipientHandle);
  params.set("memo", input.memo);
  if (input.zelleEmail) params.set("zelle_email", input.zelleEmail);
  if (input.supportEmail) params.set("support_email", input.supportEmail);
  params.set("sig", input.sig);
  return params;
}

function formatPrice(cents: number): string {
  return `$${(cents / 100).toFixed(2)}`;
}

export async function POST(request: Request): Promise<Response> {
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
    !verifyZelleCheckoutSignature(
      signedParams(payload),
      getZelleCheckoutSigningSecret(),
    )
  ) {
    return jsonError("invalid_signature", 400);
  }

  const shippingValidation = validateShippingAddress({
    countryCode: payload.customer.countryCode,
    stateCode: payload.customer.stateCode,
  });
  if (!shippingValidation.ok) {
    return jsonError(
      "jurisdiction_not_allowed",
      400,
      shippingValidation.reason,
    );
  }

  const staffRecipients = siteConfig.email.staff.map((value) => value.trim());
  const text = [
    "Zelle payment receipt submitted.",
    "",
    `Order: ${payload.order}`,
    `Amount: ${formatPrice(payload.amountCents)}`,
    `Memo: ${payload.memo}`,
    `Zelle ID: ${payload.recipientHandle}`,
    `Expected recipient: ${payload.recipientName}`,
    "",
    "Buyer",
    `Name: ${payload.customer.name}`,
    `Email: ${payload.customer.email}`,
    `Bank sender name: ${payload.customer.senderName || "Not provided"}`,
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
      to: staffRecipients,
      from: process.env.ORDER_EMAIL_FROM,
      replyTo: payload.customer.email,
      subject: `Zelle receipt: ${payload.order}`,
      text,
      tag: "order-confirmation",
    });
  } catch (error) {
    if (isProductionRuntime()) {
      return jsonError(
        "zelle_receipt_dispatch_failed",
        502,
        (error as Error).message,
      );
    }
  }

  return NextResponse.json({ ok: true, order: payload.order });
}
