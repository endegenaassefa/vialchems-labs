/**
 * C4 — Operator-notification email
 * (Section 6 super-prompt 2026-05-22).
 *
 * Pings the operator inbox (default endegenaassefa2@gmail.com per
 * the user_operator_identity memory; overridable via the
 * OPERATOR_EMAIL env var) on two events:
 *   - "placed": new order created in /api/checkout/orders. Used to
 *     reduce time-to-first-look (Zelle orders especially need
 *     manual verification).
 *   - "paid": reconciliation transitioned the order to status=paid.
 *     The operator can immediately move to fulfillment.
 *
 * Stays stub-safe when REQUIRE_RESEND=false.
 */
import { sendEmail, type SendEmailResult } from "@/lib/email/resend";
import { siteConfig } from "@/lib/content/site";

export type OperatorNotificationEvent = "placed" | "paid";

export interface OperatorNotificationInput {
  event: OperatorNotificationEvent;
  displayId: string;
  totalCents: number;
  rail: "btcpay" | "plaid" | "zelle" | "bitcoin-direct" | "stub";
  customerEmail: string;
}

function operatorRecipient(): string[] {
  const value = process.env.OPERATOR_EMAIL?.trim();
  if (value) {
    return value
      .split(",")
      .map((s) => s.trim())
      .filter(Boolean);
  }
  // Default per user_operator_identity memory + super-prompt §2.
  return ["endegenaassefa2@gmail.com"];
}

function formatPrice(cents: number): string {
  return `$${(cents / 100).toFixed(2)}`;
}

export async function sendOperatorOrderNotification(
  input: OperatorNotificationInput,
): Promise<SendEmailResult> {
  const verb = input.event === "paid" ? "PAID" : "PLACED";
  const subject = `[VC] Order ${input.displayId} ${verb} — ${formatPrice(input.totalCents)} via ${input.rail}`;
  const text = [
    `${siteConfig.name} order ${input.displayId} — ${verb}`,
    "",
    `Total: ${formatPrice(input.totalCents)}`,
    `Rail: ${input.rail}`,
    `Customer: ${input.customerEmail}`,
    "",
    `Open in dashboard: ${siteConfig.url}/operator/orders/${encodeURIComponent(input.displayId)}`,
  ].join("\n");
  return sendEmail({
    to: operatorRecipient(),
    subject,
    text,
    tag:
      input.event === "paid" ? "operator-order-paid" : "operator-order-placed",
  });
}
