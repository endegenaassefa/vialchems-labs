/**
 * B3 — Order-confirmation email
 * (Section 6 super-prompt 2026-05-22).
 *
 * Sent to the customer when a new order is created OR when it
 * transitions to `paid` via the reconciliation flow. Stays
 * stub-safe (no real send) when REQUIRE_RESEND=false; the
 * underlying `sendEmail()` returns a synthetic ID.
 */
import { sendEmail, type SendEmailResult } from "@/lib/email/resend";
import { buildOrderViewUrl } from "@/lib/auth/order-token";
import { siteConfig } from "@/lib/content/site";

export interface OrderConfirmationInput {
  displayId: string;
  customerEmail: string;
  totalCents: number;
  rail: "btcpay" | "plaid" | "zelle" | "bitcoin-direct" | "stub";
  status: "awaiting_payment" | "paid";
  items: Array<{ name: string; qty: number; unitPriceCents: number }>;
  paymentInstructions?: string;
  shippingEtaDays?: number;
}

function safeBuildOrderViewUrl(
  displayId: string,
  email: string,
): string | null {
  try {
    return buildOrderViewUrl(siteConfig.url, displayId, email);
  } catch {
    // ORDER_TOKEN_SECRET unset (stub mode / misconfig) — omit the link
    // rather than crashing the email send. The operator notification
    // path catches the alarm separately.
    return null;
  }
}

function formatPrice(cents: number): string {
  return `$${(cents / 100).toFixed(2)}`;
}

function renderText(input: OrderConfirmationInput): string {
  const lines: string[] = [];
  lines.push(
    input.status === "paid"
      ? `Order ${input.displayId} is paid — thank you.`
      : `Order ${input.displayId} received — awaiting payment confirmation.`,
  );
  lines.push("");
  lines.push("Items:");
  for (const item of input.items) {
    lines.push(
      `  - ${item.name} x${item.qty} (${formatPrice(item.unitPriceCents * item.qty)})`,
    );
  }
  lines.push("");
  lines.push(`Total: ${formatPrice(input.totalCents)}`);
  if (input.status === "awaiting_payment" && input.paymentInstructions) {
    lines.push("");
    lines.push(input.paymentInstructions);
  }
  if (input.status === "paid" && input.shippingEtaDays) {
    lines.push("");
    lines.push(
      `Expected ship date: within ${input.shippingEtaDays} business days.`,
    );
  }
  lines.push("");
  const viewUrl = safeBuildOrderViewUrl(input.displayId, input.customerEmail);
  if (viewUrl) {
    lines.push(`Track your order: ${viewUrl}`);
    lines.push("");
  }
  lines.push(
    `View the full test panel for every item: ${siteConfig.url}/verify`,
  );
  lines.push("");
  lines.push(`Reach support: ${siteConfig.email.staff.join(", ")}`);
  return lines.join("\n");
}

export async function sendOrderConfirmation(
  input: OrderConfirmationInput,
): Promise<SendEmailResult> {
  const subjectVerb = input.status === "paid" ? "paid" : "received";
  return sendEmail({
    to: input.customerEmail,
    subject: `${siteConfig.name} order ${input.displayId} ${subjectVerb}`,
    text: renderText(input),
    tag: "order-confirmation",
  });
}
