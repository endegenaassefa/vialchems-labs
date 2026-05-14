import type { SupabaseClient } from "@supabase/supabase-js";
import { sendEmail, type SendEmailResult } from "@/lib/email/resend";
import { logAuditEvent, EMAIL_EVENT } from "@/lib/ops/audit";
import type { OpsOrder } from "@/lib/ops/orders";

// Phase A guardrail #3 (CEO plan D18): when the order is_test flag is true,
// shipment + refund emails do NOT go to the real customer. They're diverted
// to ORDER_TEST_INBOX (the staff/dev address) and a separate audit event
// records the diversion. This is the email kill-switch that lets us safely
// seed test orders into the same Supabase project as production.
//
// Email templates here are plain-text-first with a minimal HTML mirror.
// Brand polish lives in lib/content/email-templates.ts (Phase 10.2);
// these are transactional templates owned by ops.

interface ResolvedRecipient {
  to: string;
  diverted: boolean;
  originalEmail: string;
}

// Routes the recipient through the is_test kill-switch. Test orders go to
// ORDER_TEST_INBOX (defaults to the email-from address). Production orders
// go to the customer's email on the order. Returns metadata so the caller
// can log the diversion to audit_log.
function resolveRecipient(order: OpsOrder): ResolvedRecipient {
  if (order.isTest) {
    const testInbox =
      process.env.ORDER_TEST_INBOX?.trim() ||
      process.env.ORDER_EMAIL_FROM?.trim() ||
      "ops@vialchemlabs.net";
    return {
      to: testInbox,
      diverted: true,
      originalEmail: order.email,
    };
  }
  return {
    to: order.email,
    diverted: false,
    originalEmail: order.email,
  };
}

function trackingUrl(order: OpsOrder): string | null {
  if (!order.trackingNumber || !order.shippedCarrier) return null;
  switch (order.shippedCarrier) {
    case "usps":
      return `https://tools.usps.com/go/TrackConfirmAction?tLabels=${order.trackingNumber}`;
    case "ups":
      return `https://www.ups.com/track?tracknum=${order.trackingNumber}`;
    case "fedex":
      return `https://www.fedex.com/fedextrack/?trknbr=${order.trackingNumber}`;
    case "dhl":
      return `https://www.dhl.com/en/express/tracking.html?AWB=${order.trackingNumber}`;
    default:
      return null;
  }
}

function brandName(): string {
  return process.env.NEXT_PUBLIC_BRAND_NAME ?? "Vialchems Labs";
}

// ---------------------------------------------------------------------------
// Shipment notification
// ---------------------------------------------------------------------------

export async function sendShipmentEmail(
  supabase: SupabaseClient,
  order: OpsOrder,
): Promise<SendEmailResult> {
  if (!order.trackingNumber || !order.shippedCarrier) {
    throw new Error("shipment_email_missing_tracking");
  }

  const recipient = resolveRecipient(order);
  const url = trackingUrl(order);
  const brand = brandName();
  const carrier = order.shippedCarrier.toUpperCase();

  const subject = recipient.diverted
    ? `[TEST] Order ${order.displayId} shipped`
    : `Your ${brand} order has shipped (${order.displayId})`;

  const text = [
    `Your order ${order.displayId} is on its way.`,
    "",
    `Carrier: ${carrier}`,
    `Tracking number: ${order.trackingNumber}`,
    url ? `Track: ${url}` : null,
    "",
    "Questions? Reply to this email.",
    `— ${brand} team`,
  ]
    .filter(Boolean)
    .join("\n");

  const html = `
    <p>Your order <strong>${order.displayId}</strong> is on its way.</p>
    <ul>
      <li>Carrier: ${carrier}</li>
      <li>Tracking number: <code>${order.trackingNumber}</code></li>
      ${url ? `<li><a href="${url}">Track your package</a></li>` : ""}
    </ul>
    <p>Questions? Reply to this email.<br/>— ${brand} team</p>
  `.trim();

  const result = await sendEmail({
    to: recipient.to,
    subject,
    text,
    html,
    tag: "order-shipped",
  });

  await logAuditEvent(supabase, {
    eventType: recipient.diverted
      ? EMAIL_EVENT.TEST_DIVERTED
      : EMAIL_EVENT.SHIPMENT_SENT,
    orderId: order.id,
    details: {
      sent_to: recipient.to,
      original_recipient: recipient.originalEmail,
      diverted_for_test: recipient.diverted,
      tracking_number: order.trackingNumber,
      carrier: order.shippedCarrier,
      resend_id: result.id,
      stub: result.stub ?? false,
    },
  });

  return result;
}

// ---------------------------------------------------------------------------
// Refund notification
// ---------------------------------------------------------------------------

export async function sendRefundEmail(
  supabase: SupabaseClient,
  order: OpsOrder,
): Promise<SendEmailResult> {
  if (order.refundAmountCents === null) {
    throw new Error("refund_email_missing_amount");
  }

  const recipient = resolveRecipient(order);
  const brand = brandName();
  const amountUsd = (order.refundAmountCents / 100).toFixed(2);
  const totalUsd = (order.totalCents / 100).toFixed(2);
  const isPartial = order.refundAmountCents < order.totalCents;

  const subject = recipient.diverted
    ? `[TEST] Refund approved for order ${order.displayId}`
    : isPartial
      ? `Partial refund approved for your ${brand} order`
      : `Refund approved for your ${brand} order`;

  const lines = [
    `We've approved ${isPartial ? "a partial " : "a "}refund for order ${order.displayId} and it is being processed.`,
    "",
    `Refund amount: $${amountUsd} USD`,
    isPartial ? `Order total: $${totalUsd} USD` : null,
    order.refundReason ? `Reason: ${order.refundReason}` : null,
    "",
    "Refunds typically appear in your account within 3-7 business days",
    "once processed, depending on your payment method.",
    "",
    "Questions? Reply to this email.",
    `— ${brand} team`,
  ].filter(Boolean);

  const text = lines.join("\n");
  const html = `
    <p>We've approved ${isPartial ? "a partial" : "a"} refund for order <strong>${order.displayId}</strong> and it is being processed.</p>
    <ul>
      <li>Refund amount: <strong>$${amountUsd}</strong> USD</li>
      ${isPartial ? `<li>Order total: $${totalUsd} USD</li>` : ""}
      ${order.refundReason ? `<li>Reason: ${order.refundReason}</li>` : ""}
    </ul>
    <p>Refunds typically appear in your account within 3-7 business days once processed.</p>
    <p>Questions? Reply to this email.<br/>— ${brand} team</p>
  `.trim();

  const result = await sendEmail({
    to: recipient.to,
    subject,
    text,
    html,
    tag: "refund-confirmation",
  });

  await logAuditEvent(supabase, {
    eventType: recipient.diverted
      ? EMAIL_EVENT.TEST_DIVERTED
      : EMAIL_EVENT.REFUND_SENT,
    orderId: order.id,
    details: {
      sent_to: recipient.to,
      original_recipient: recipient.originalEmail,
      diverted_for_test: recipient.diverted,
      refund_amount_cents: order.refundAmountCents,
      partial: isPartial,
      resend_id: result.id,
      stub: result.stub ?? false,
    },
  });

  return result;
}
