/**
 * Customer-accounts spec §10 — password-reset email.
 *
 * Sent in response to POST /api/auth/forgot-password. Contains a
 * 1-hour HMAC-tokenised link to /reset-password?token=...
 */
import { sendEmail, type SendEmailResult } from "@/lib/email/resend";
import { siteConfig } from "@/lib/content/site";

export interface SendPasswordResetInput {
  email: string;
  fullName?: string;
  resetUrl: string;
}

function escapeHtml(input: string): string {
  return input
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;")
    .replaceAll("'", "&#39;");
}

function buildText(input: SendPasswordResetInput): string {
  const supportLine =
    siteConfig.email.staff.length > 0
      ? `Support: ${siteConfig.email.staff.join(", ")}`
      : "";
  const greeting = input.fullName ? `Hi ${input.fullName},` : "Hi,";
  return [
    greeting,
    "",
    `Use the link below to reset your ${siteConfig.name} password:`,
    "",
    input.resetUrl,
    "",
    "This link is valid for 1 hour. If you didn't request a reset, ignore this email — your password stays the same.",
    "",
    supportLine,
  ]
    .filter((line) => line !== "")
    .join("\n");
}

function buildHtml(input: SendPasswordResetInput): string {
  const safeName = input.fullName ? escapeHtml(input.fullName) : "researcher";
  const safeUrl = escapeHtml(input.resetUrl);
  const supportLine =
    siteConfig.email.staff.length > 0
      ? `<p style="margin:24px 0 0;color:#5a6168;font-size:13px;">Support: ${escapeHtml(siteConfig.email.staff.join(", "))}</p>`
      : "";
  return `<!doctype html>
<html lang="en"><body style="margin:0;padding:24px;background:#f6f6f4;font-family:-apple-system,Segoe UI,Helvetica,Arial,sans-serif;color:#111;">
  <table cellpadding="0" cellspacing="0" border="0" width="100%" style="max-width:560px;margin:0 auto;background:#ffffff;border-radius:8px;padding:32px;">
    <tr><td>
      <h1 style="margin:0 0 12px;font-size:20px;line-height:1.3;">Reset your ${escapeHtml(siteConfig.name)} password</h1>
      <p style="margin:0 0 16px;font-size:15px;line-height:1.55;">Hi ${safeName}. Click the button below to set a new password.</p>
      <p style="margin:24px 0;">
        <a href="${safeUrl}" style="display:inline-block;background:#111;color:#ffffff;text-decoration:none;padding:12px 20px;border-radius:6px;font-weight:600;">Reset password</a>
      </p>
      <p style="margin:0 0 8px;font-size:13px;color:#5a6168;">Or paste this link into your browser:</p>
      <p style="margin:0 0 16px;font-size:13px;word-break:break-all;color:#1a1a1a;"><a href="${safeUrl}" style="color:#1a1a1a;">${safeUrl}</a></p>
      <p style="margin:0;font-size:13px;color:#5a6168;">This link expires in 1 hour. If you didn&rsquo;t request a reset, ignore this email — your password stays the same.</p>
      ${supportLine}
    </td></tr>
  </table>
</body></html>`;
}

export async function sendPasswordResetEmail(
  input: SendPasswordResetInput,
): Promise<SendEmailResult> {
  return sendEmail({
    to: input.email,
    subject: `Reset your ${siteConfig.name} password`,
    text: buildText(input),
    html: buildHtml(input),
    tag: "account-password-reset",
  });
}
