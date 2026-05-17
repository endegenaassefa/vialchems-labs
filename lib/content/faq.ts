/**
 * Verbatim FAQ — 20 Q+A from SUPER_PROMPT_v3 Appendix M.
 *
 * Brand placeholders substituted: vialchemlabs.net / independent third-party lab /
 * https://vialchemlabs.net / vialchemlabs.net.
 */

export interface FaqEntry {
  q: string;
  a: string;
}

export const faqEntries: FaqEntry[] = [
  {
    q: "What does vialchemlabs.net sell?",
    a: "Lyophilized research peptides for in-vitro and animal-model research. All products are sold for research purposes only and are not for human consumption.",
  },
  {
    q: "Do you ship to my address?",
    a: "vialchemlabs.net ships within the United States only at this time. International shipping is not available, and buyers remain responsible for jurisdiction-specific compliance.",
  },
  {
    q: 'What is "research use only"?',
    a: "Research use only (RUO) is a legal classification indicating that products are sold for laboratory research, cell culture, and analytical reference. RUO products are not approved by any regulatory authority for any indication and are not for human or veterinary use.",
  },
  {
    q: "Why do you require buyer qualification?",
    a: "vialchemlabs.net sells research peptides to qualified researchers and analytical professionals. Qualification ensures that products are received by individuals operating under appropriate research, laboratory, or compliance frameworks.",
  },
  {
    q: "Are your products tested?",
    a: "Yes. Independent third-party laboratory testing covers purity (HPLC), sterility (USP <71>), and endotoxin levels (LAL). Certificates of Analysis are published at https://vialchemlabs.net/coa.",
  },
  {
    q: "What is a Certificate of Analysis?",
    a: "A COA is a primary-source document confirming the identity, purity, sterility, and endotoxin level of a specific product batch. vialchemlabs.net publishes Certificates of Analysis on a public library so the data is on file. See our research index for a guide on reading a COA.",
  },
  {
    q: "What payment methods do you accept?",
    a: "Cryptocurrency (BTC, LTC, optionally ETH) via self-hosted BTCPay Server. Bank transfer via Plaid ACH. Credit and debit cards are not currently supported. Crypto payments receive a 10-15% discount; ACH receives 5%.",
  },
  {
    q: "Why don't you accept credit cards?",
    a: "Major credit-card networks (Visa, Mastercard, AMEX, Discover) and processors do not currently support research-peptide categories. vialchemlabs.net routes payments through self-hosted infrastructure to maintain operational continuity.",
  },
  {
    q: "How long does shipping take?",
    a: "USPS Priority: 1-3 business days. FedEx 2-Day: 2 business days. FedEx Overnight: next business day. Same-business-day shipping on orders placed before 3pm Mon-Fri.",
  },
  {
    q: "What happens if my package is lost?",
    a: "Contact vialchemlabs.net support with your order ID. We will work with USPS or FedEx to investigate. Replacement is provided at our discretion based on evidence (tracking, delivery confirmation, photo if applicable).",
  },
  {
    q: "What is your refund policy?",
    a: "All sales final on opened vials. Replacement is provided for shipping damage with photo evidence within 7 days of delivery. See full policy at https://vialchemlabs.net/legal/refunds.",
  },
  {
    q: "Why is the catalog smaller than competitors?",
    a: "vialchemlabs.net keeps a focused live catalog to maintain compliance simplicity, COA pipeline integrity, and operational reliability. Current live records include BPC-157 10mg, TB-500 10mg, GHK-Cu 50mg, CJC-1295 + Ipamorelin 5mg, Klow 80mg, KPV 500mcg, MOTS-c 10mg, Semax 10mg, Selank 10mg, Reta 10mg, Tirz 25mg, and NAD+ 500mg. Non-live materials are handled by custom request.",
  },
  {
    q: "Can I request a material that is not in stock?",
    a: "Yes. Materials outside the live catalog are not instant-checkout items. Use the custom-request path on the product page or contact support with the SKU and intended laboratory context.",
  },
  {
    q: "Why don't you sell bacteriostatic water?",
    a: "Recent FDA enforcement has classified bacteriostatic water sold alongside peptides as drug intent. vialchemlabs.net sells peptides only. Buyers source bacteriostatic water separately.",
  },
  {
    q: "Do you offer dosing recommendations?",
    a: "No. vialchemlabs.net does not provide dosing recommendations or research protocols. Dosing for laboratory experimental design is at the discretion of the qualified researcher per their study protocol.",
  },
  {
    q: "Can I store products at room temperature?",
    a: "Lyophilized peptide vials are stable at 2-8°C in sealed conditions. Once reconstituted in solution, peptides should be used or refrigerated per the storage guide.",
  },
  {
    q: "Do you offer bulk discounts?",
    a: "Volume discounts are not currently offered. Bundle pricing is available on the BPC/TB Reference Set at $77 (12.5% effective discount).",
  },
  {
    q: "What is the affiliate program?",
    a: "Researchers and content creators in adjacent fields can apply to the vialchemlabs.net affiliate program. Commissions: 5% min / 10% median / 15% max with a 90-day cookie. Apply at https://vialchemlabs.net/affiliate.",
  },
  {
    q: "How do I unsubscribe from emails?",
    a: "Click the unsubscribe link in any email or visit https://vialchemlabs.net/unsubscribe.",
  },
  {
    q: "How do I contact support?",
    a: "Email research@vialchemlabs.net or use the contact form at https://vialchemlabs.net/contact. Response within 1 business day.",
  },
];
