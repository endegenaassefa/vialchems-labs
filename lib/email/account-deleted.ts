/**
 * Customer-accounts spec §10 — "your account has been deleted"
 * notification. Sent best-effort from POST /api/account/delete.
 */
import { sendEmail, type SendEmailResult } from "@/lib/email/resend";
import { siteConfig } from "@/lib/content/site";

export interface SendAccountDeletedInput {
  email: string;
  fullName: string;
}

function escapeHtml(input: string): string {
  return input
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;")
    .replaceAll("'", "&#39;");
}

function buildText(input: SendAccountDeletedInput): string {
  const supportLine =
    siteConfig.email.staff.length > 0
      ? `Support: ${siteConfig.email.staff.join(", ")}`
      : "";
  return [
    `Hi ${input.fullName},`,
    "",
    `Your ${siteConfig.name} account has been deleted.`,
    "",
    "Your profile + addresses have been removed. Past orders remain on file for tax + warranty purposes, but they're no longer associated with a login.",
    "",
    "If this wasn't you, contact support immediately — we may still be able to restore your account.",
    "",
    supportLine,
  ]
    .filter((line) => line !== "")
    .join("\n");
}

function buildHtml(input: SendAccountDeletedInput): string {
  const safeName = escapeHtml(input.fullName);
  const supportLine =
    siteConfig.email.staff.length > 0
      ? `<p style="margin:16px 0 0;color:#5a6168;font-size:13px;">Support: ${escapeHtml(siteConfig.email.staff.join(", "))}</p>`
      : "";
  return `<!doctype html>
<html lang="en"><body style="margin:0;padding:24px;background:#f6f6f4;font-family:-apple-system,Segoe UI,Helvetica,Arial,sans-serif;color:#111;">
  <table cellpadding="0" cellspacing="0" border="0" width="100%" style="max-width:560px;margin:0 auto;background:#ffffff;border-radius:8px;padding:32px;">
    <tr><td>
      <h1 style="margin:0 0 12px;font-size:20px;line-height:1.3;">Your ${escapeHtml(siteConfig.name)} account has been deleted</h1>
      <p style="margin:0 0 12px;font-size:15px;line-height:1.55;">Hi ${safeName},</p>
      <p style="margin:0 0 12px;font-size:15px;line-height:1.55;">Your profile + addresses have been removed. Past orders remain on file for tax + warranty purposes, but they&rsquo;re no longer associated with a login.</p>
      <p style="margin:0;font-size:13px;color:#5a6168;">If this wasn&rsquo;t you, contact support immediately — we may still be able to restore your account.</p>
      ${supportLine}
    </td></tr>
  </table>
</body></html>`;
}

export async function sendAccountDeletedEmail(
  input: SendAccountDeletedInput,
): Promise<SendEmailResult> {
  return sendEmail({
    to: input.email,
    subject: `Your ${siteConfig.name} account has been deleted`,
    text: buildText(input),
    html: buildHtml(input),
    tag: "account-deleted",
  });
}
