/**
 * P2B — Affiliate application emails.
 *
 * Sent in pairs from POST /api/affiliate:
 *   - sendAffiliateApplicantAck: confirms receipt to the applicant.
 *   - sendAffiliateOperatorNotification: alerts the operator with
 *     the full submission payload so they can review without logging
 *     into the dashboard.
 *
 * Both stay stub-safe when REQUIRE_RESEND=false; sendEmail() returns
 * a synthetic ID without contacting Resend.
 */
import { sendEmail, type SendEmailResult } from "@/lib/email/resend";
import { siteConfig } from "@/lib/content/site";

export interface AffiliateApplicationPayload {
  name: string;
  email: string;
  audience?: string;
  views?: string;
  handles?: string;
  focus?: string;
}

export async function sendAffiliateApplicantAck(
  payload: AffiliateApplicationPayload,
): Promise<SendEmailResult> {
  const body = [
    `Thank you for applying to the ${siteConfig.name} affiliate program.`,
    "",
    "We received your application and our team will review it within five business days. If you're a fit for the program, we'll follow up with onboarding details + your tracking link.",
    "",
    "While you wait, take a look at the program terms at " +
      `${siteConfig.url}/affiliate. FTC disclosure is required on every link and video.`,
    "",
    `Reach support: ${siteConfig.email.staff.join(", ")}`,
  ].join("\n");
  return sendEmail({
    to: payload.email,
    subject: `${siteConfig.name} affiliate application received`,
    text: body,
    tag: "affiliate-applicant-ack",
  });
}

export async function sendAffiliateOperatorNotification(
  payload: AffiliateApplicationPayload,
): Promise<SendEmailResult> {
  const lines = [
    `New affiliate application:`,
    "",
    `Name: ${payload.name}`,
    `Email: ${payload.email}`,
  ];
  if (payload.audience) lines.push(`Audience size: ${payload.audience}`);
  if (payload.views) lines.push(`Typical views: ${payload.views}`);
  if (payload.handles) lines.push(`Social handles: ${payload.handles}`);
  if (payload.focus) {
    lines.push("", `Content focus:`, payload.focus);
  }
  lines.push("", `Review queue: ${siteConfig.url}/operator/affiliates`);
  return sendEmail({
    to: siteConfig.email.staff[0] ?? siteConfig.email.from,
    subject: `Affiliate application: ${payload.name}`,
    text: lines.join("\n"),
    tag: "affiliate-operator-notification",
  });
}
