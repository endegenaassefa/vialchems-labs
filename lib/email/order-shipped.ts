/**
 * F2 — Order-shipped email
 * (Section 6 super-prompt 2026-05-22).
 *
 * Sent to the customer when the operator marks an order as
 * shipped via the operator dashboard (item C1). Includes the
 * carrier name + tracking number; the operator picks the carrier
 * from a small allow-list (USPS, UPS, FedEx, DHL) at dashboard
 * time. Stays stub-safe when REQUIRE_RESEND=false.
 */
import { sendEmail, type SendEmailResult } from "@/lib/email/resend";
import { siteConfig } from "@/lib/content/site";

export interface OrderShippedInput {
  displayId: string;
  customerEmail: string;
  carrier: string;
  trackingNumber: string;
  trackingUrl?: string;
}

function defaultTrackingUrl(carrier: string, trackingNumber: string): string {
  const carrierLower = carrier.toLowerCase();
  if (carrierLower.includes("usps")) {
    return `https://tools.usps.com/go/TrackConfirmAction?tLabels=${encodeURIComponent(trackingNumber)}`;
  }
  if (carrierLower.includes("ups")) {
    return `https://www.ups.com/track?loc=en_US&tracknum=${encodeURIComponent(trackingNumber)}`;
  }
  if (carrierLower.includes("fedex")) {
    return `https://www.fedex.com/fedextrack/?trknbr=${encodeURIComponent(trackingNumber)}`;
  }
  if (carrierLower.includes("dhl")) {
    return `https://www.dhl.com/us-en/home/tracking.html?tracking-id=${encodeURIComponent(trackingNumber)}`;
  }
  return `https://www.google.com/search?q=${encodeURIComponent(carrier + " tracking " + trackingNumber)}`;
}

function renderText(input: OrderShippedInput): string {
  const url =
    input.trackingUrl ??
    defaultTrackingUrl(input.carrier, input.trackingNumber);
  return [
    `Your ${siteConfig.name} order ${input.displayId} has shipped.`,
    "",
    `Carrier: ${input.carrier}`,
    `Tracking: ${input.trackingNumber}`,
    `Track it here: ${url}`,
    "",
    `Reach support: ${siteConfig.email.staff.join(", ")}`,
  ].join("\n");
}

export async function sendOrderShipped(
  input: OrderShippedInput,
): Promise<SendEmailResult> {
  return sendEmail({
    to: input.customerEmail,
    subject: `${siteConfig.name} order ${input.displayId} shipped — ${input.carrier} ${input.trackingNumber}`,
    text: renderText(input),
    tag: "order-shipped",
  });
}
