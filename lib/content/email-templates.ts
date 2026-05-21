/**
 * Email welcome sequence per SUPER_PROMPT_v3 Appendix K (verbatim).
 *
 * 4 emails sent at signup / day 3 / day 7 / day 14. Plain-text first.
 * Every email carries the Appendix A.1 footer disclaimer block.
 *
 * Phase 10 wires the actual Resend send + scheduling. This file holds the
 * static template data for that wiring.
 */

import { siteConfig } from "./site";

const FOOTER = `
---

All products are sold for research, laboratory, or analytical purposes only, and are not for human consumption.
${siteConfig.llcName}, ${siteConfig.llcJurisdiction} limited liability company.
You received this because you subscribed at ${siteConfig.url}/newsletter. Unsubscribe at ${siteConfig.url}/unsubscribe.`;

export interface EmailTemplate {
  id: string;
  delayDays: number;
  subject: string;
  body: string;
}

export const emailWelcomeSequence: EmailTemplate[] = [
  {
    id: "welcome-lead-magnet",
    delayDays: 0,
    subject: `Your Reconstitution and Storage Guide is ready`,
    body: `Thank you for joining the ${siteConfig.name} research community.

Your free PDF, the ${siteConfig.name} Reconstitution and Storage Guide, is attached. This 5-page document covers:

  - Sterile reconstitution technique
  - Bacteriostatic saline vs distilled water selection
  - Lyophilized peptide stability and storage
  - Vial handling for analytical-quality work

If you have questions, reply to this email and our research-support team will respond within 1 business day.

For our Certificates of Analysis library, see ${siteConfig.url}/coa.

${siteConfig.name} Team
${FOOTER}`,
  },
  {
    id: "reading-coa",
    delayDays: 3,
    subject: `How to read a Certificate of Analysis`,
    body: `A Certificate of Analysis (COA) is the primary document confirming what you ordered.

A complete COA includes:

  - Purity (HPLC, expressed as % of total peptide content)
  - Sterility (USP General Chapter <71> compliance, expressed as pass/fail)
  - Endotoxin (LAL test, expressed in EU/mg)
  - Mass spectrometry confirmation of molecular weight
  - Batch / lot number traceable to a specific production run
  - Lab name and accreditation reference
  - Test date

When you read a COA, check the lab name. ${siteConfig.name} partners with ${siteConfig.labPartner.name} for per-batch independent testing. We publish every COA on our public test-reports page at ${siteConfig.url}/test-reports.

For more on our testing methodology, see our blog post: "Reading a Certificate of Analysis: A Researcher's Guide" at ${siteConfig.url}/blog/reading-a-coa.

${siteConfig.name} Team
${FOOTER}`,
  },
  {
    id: "bpc-157-research",
    delayDays: 7,
    subject: `BPC-157 research applications: 2024-2025 literature`,
    body: `The peer-reviewed research on BPC-157 has expanded substantially in 2024-2025. Three studies worth bookmarking:

  1. Sikiric et al., 2024 — animal-model evidence of tissue repair acceleration
  2. Chen et al., 2025 — in vitro VEGF axis signaling
  3. Vukojevic et al., 2024 — gastroprotective mechanism review

These studies are consistent with the broader BPC-157 research literature in animal and cell-culture models. For background on BPC-157 mechanisms, see our blog post: "BPC-157: Mechanism, Research, and In-Vitro Findings" at ${siteConfig.url}/blog/bpc-157-research.

If your research uses BPC-157, ${siteConfig.name} offers BPC-157 10mg vials with per-batch COA. Reference at ${siteConfig.url}/products/bpc-157-10mg.

${siteConfig.name} Team
${FOOTER}`,
  },
  {
    id: "welcome-discount",
    delayDays: 14,
    subject: `15% off your first ${siteConfig.name} research order`,
    body: `You have been part of the ${siteConfig.name} research community for two weeks. As a thank-you for joining us, here is a 15% discount on your first order.

Discount code: WELCOME15
Valid for 30 days from this email.
Applies to: any single first-order purchase.
Restrictions: research-use-only acknowledgment + age verification at checkout. US shipping addresses only; buyer is responsible for jurisdiction-specific compliance.

Browse our research peptide catalog at ${siteConfig.url}/shop.

Each product page includes:
  - Per-batch Certificate of Analysis
  - Research-context description with animal-model and in-vitro citations
  - Storage and reconstitution guidance

If your research focus is structural-model materials, our BPC-157 10mg + TB-500 10mg + KPV 10mg Structural Model Set is bundled at $129 (36.1% effective discount).

${siteConfig.name} Team
${FOOTER}`,
  },
];

export const customerServiceAutoReplies = {
  dosingQuestion: `Thank you for contacting ${siteConfig.name}.

We are not able to provide dosing recommendations or research protocols. Our products are sold for in-vitro laboratory research and analytical purposes only. Recommended values for laboratory experimental design are at the discretion of the qualified researcher per their study protocol and regulatory framework.

For Certificate of Analysis information or product specifications, please reference the COA library at ${siteConfig.url}/coa.

Best regards,
${siteConfig.name} Support`,
  lostPackage: (
    orderId: string,
  ) => `Thank you for contacting ${siteConfig.name}.

We have logged your inquiry regarding order ${orderId}. Our shipping team will investigate and respond within 1 business day. Please retain your tracking number and any photos of the delivery location for our review.

If your shipment shows "delivered" but is not at your address, please file a claim with USPS / FedEx / UPS using the tracking number while we investigate from our end.

Best regards,
${siteConfig.name} Support`,
} as const;
