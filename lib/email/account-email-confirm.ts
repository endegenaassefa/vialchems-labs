/**
 * Customer-accounts spec §10 — registration-confirmation email.
 *
 * Sent after POST /api/auth/register succeeds. The link lands at
 * /auth/confirm-email?token=... (HMAC, 24h TTL). On confirm, the
 * customer is dropped on /account?welcome=1 with a verified pill.
 *
 * Token is built by the caller (the registration route owns the
 * secret) so this module never touches HMAC; it just renders the
 * email body around a fully-formed URL.
 */
import { sendEmail, type SendEmailResult } from "@/lib/email/resend";
import { siteConfig } from "@/lib/content/site";

export interface SendAccountConfirmInput {
  email: string;
  fullName: string;
  confirmUrl: string;
}

function buildText(input: SendAccountConfirmInput): string {
  const supportLine =
    siteConfig.email.staff.length > 0
      ? `Support: ${siteConfig.email.staff.join(", ")}`
      : "";
  return [
    `Welcome to ${siteConfig.name}, ${input.fullName}.`,
    "",
    "Confirm your email to activate your account:",
    "",
    input.confirmUrl,
    "",
    "This link is valid for 24 hours. If you didn't create an account, you can ignore this email.",
    "",
    supportLine,
  ]
    .filter((line) => line !== "")
    .join("\n");
}

function buildHtml(input: SendAccountConfirmInput): string {
  const safeName = escapeHtml(input.fullName);
  const safeUrl = escapeAttr(input.confirmUrl);
  const supportLine =
    siteConfig.email.staff.length > 0
      ? `<p style="margin:24px 0 0;color:#5a6168;font-size:13px;">Support: ${escapeHtml(siteConfig.email.staff.join(", "))}</p>`
      : "";
  return `<!doctype html>
<html lang="en"><body style="margin:0;padding:24px;background:#f6f6f4;font-family:-apple-system,Segoe UI,Helvetica,Arial,sans-serif;color:#111;">
  <table cellpadding="0" cellspacing="0" border="0" width="100%" style="max-width:560px;margin:0 auto;background:#ffffff;border-radius:8px;padding:32px;">
    <tr><td>
      <h1 style="margin:0 0 12px;font-size:20px;line-height:1.3;">Confirm your ${escapeHtml(siteConfig.name)} account</h1>
      <p style="margin:0 0 16px;font-size:15px;line-height:1.55;">Welcome, ${safeName}. One last step: confirm your email so we can keep your research account secure.</p>
      <p style="margin:24px 0;">
        <a href="${safeUrl}" style="display:inline-block;background:#111;color:#ffffff;text-decoration:none;padding:12px 20px;border-radius:6px;font-weight:600;">Confirm email</a>
      </p>
      <p style="margin:0 0 8px;font-size:13px;color:#5a6168;">Or paste this link into your browser:</p>
      <p style="margin:0 0 16px;font-size:13px;word-break:break-all;color:#1a1a1a;"><a href="${safeUrl}" style="color:#1a1a1a;">${safeUrl}</a></p>
      <p style="margin:0;font-size:13px;color:#5a6168;">This link expires in 24 hours. If you didn't create an account, you can ignore this email.</p>
      ${supportLine}
    </td></tr>
  </table>
</body></html>`;
}

export async function sendAccountConfirmEmail(
  input: SendAccountConfirmInput,
): Promise<SendEmailResult> {
  return sendEmail({
    to: input.email,
    subject: `Confirm your ${siteConfig.name} account`,
    text: buildText(input),
    html: buildHtml(input),
    tag: "account-email-confirm",
  });
}

// ---------------------------------------------------------------------------
// Local HTML escape helpers — tiny + tree-shake friendly.
// ---------------------------------------------------------------------------

function escapeHtml(input: string): string {
  return input
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;")
    .replaceAll("'", "&#39;");
}

function escapeAttr(input: string): string {
  return escapeHtml(input);
}
