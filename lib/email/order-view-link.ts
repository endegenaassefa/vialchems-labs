/**
 * Auth-flow redesign — sends a fresh "view your order" link to the email
 * on file for a given order. Used by /api/track-order when a customer
 * has lost their confirmation email.
 *
 * The token is generated here so the API route never touches the secret.
 */
import { sendEmail, type SendEmailResult } from "@/lib/email/resend";
import { buildOrderViewUrl } from "@/lib/auth/order-token";
import { siteConfig } from "@/lib/content/site";

export interface SendOrderViewLinkInput {
  displayId: string;
  email: string;
}

export async function sendOrderViewLink(
  input: SendOrderViewLinkInput,
): Promise<SendEmailResult> {
  const url = buildOrderViewUrl(siteConfig.url, input.displayId, input.email);
  const text = [
    `Here is a fresh link to your order ${input.displayId}:`,
    "",
    url,
    "",
    "This link works for 90 days and doesn't require a password.",
    "",
    `If you didn't request this, you can ignore it — only the inbox at ${input.email} ever receives it.`,
    "",
    `Support: ${siteConfig.email.staff.join(", ")}`,
  ].join("\n");

  return sendEmail({
    to: input.email,
    subject: `${siteConfig.name} order ${input.displayId} — your tracking link`,
    text,
    tag: "order-view-link",
  });
}
