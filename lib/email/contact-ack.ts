/**
 * J2 — Contact-form acknowledgment email
 * (Section 6 super-prompt 2026-05-22).
 *
 * Sent to the customer when they submit /contact. The current
 * /api/contact/route.ts already pings the operator inbox; this
 * helper ALSO acks the customer so the form doesn't feel like
 * it ate their message. Stays stub-safe when REQUIRE_RESEND=false.
 */
import { sendEmail, type SendEmailResult } from "@/lib/email/resend";
import { siteConfig } from "@/lib/content/site";

export interface ContactAckInput {
  customerEmail: string;
  customerName?: string;
  subject?: string;
  body: string;
}

export async function sendContactAck(
  input: ContactAckInput,
): Promise<SendEmailResult> {
  const name = input.customerName?.trim() || "researcher";
  const reSubject = input.subject?.trim() || "your message";
  const text = [
    `Hi ${name},`,
    "",
    `Thanks for reaching ${siteConfig.name}. We received "${reSubject}" and a member of the research team will respond within one business day.`,
    "",
    "For reference, here's the message you sent:",
    "",
    input.body
      .split("\n")
      .map((line) => `  ${line}`)
      .join("\n"),
    "",
    `Reach support: ${siteConfig.email.staff.join(", ")}`,
  ].join("\n");
  return sendEmail({
    to: input.customerEmail,
    subject: `Received: ${reSubject}`,
    text,
    tag: "contact-ack",
  });
}
