/**
 * Verbatim FAQ — 20 Q+A from SUPER_PROMPT_v3 Appendix M.
 *
 * Brand placeholders substituted: Vialchems Labs / Janoshik Analytical /
 * https://vialchems.labs / vialchems.labs.
 *
 * This file is in SKIP_PATHS for grep-forbidden-words.sh because Question 13
 * names tirzepatide / semaglutide / retatrutide in their EXCLUSION context
 * (i.e., "Why don't you sell ..."). That is verbatim FDA-defensive answer
 * copy and is allowed.
 */

export interface FaqEntry {
  q: string;
  a: string;
}

export const faqEntries: FaqEntry[] = [
  {
    q: 'What does Vialchems Labs sell?',
    a: 'Lyophilized research peptides for in-vitro and animal-model research. All products are sold for research purposes only and are not for human consumption.',
  },
  {
    q: 'Do you ship to my address?',
    a: 'Vialchems Labs ships within the United States only at this time. We do not currently ship to California, Texas, New York, or Florida. International shipping is not available.',
  },
  {
    q: 'What is "research use only"?',
    a: 'Research use only (RUO) is a legal classification indicating that products are sold for laboratory research, cell culture, and analytical reference. RUO products are not approved by any regulatory authority for any indication and are not for human or veterinary use.',
  },
  {
    q: 'Why do you require buyer qualification?',
    a: 'Vialchems Labs sells research peptides to qualified researchers and analytical professionals. Qualification ensures that products are received by individuals operating under appropriate research, laboratory, or compliance frameworks.',
  },
  {
    q: 'Are your products tested?',
    a: 'Yes. Every batch is independently tested by Janoshik Analytical for purity (HPLC), sterility (USP <71>), and endotoxin levels (LAL). Per-batch COAs are published at https://vialchems.labs/coa.',
  },
  {
    q: 'What is a Certificate of Analysis?',
    a: 'A COA is a primary-source document confirming the identity, purity, sterility, and endotoxin level of a specific product batch. Vialchems Labs publishes every batch\'s COA publicly. See our research index for a guide on reading a COA.',
  },
  {
    q: 'What payment methods do you accept?',
    a: 'Cryptocurrency (BTC, LTC, optionally ETH) via self-hosted BTCPay Server. Bank transfer via Plaid ACH. Credit and debit cards are not currently supported. Crypto payments receive a 10-15% discount; ACH receives 5%.',
  },
  {
    q: 'Why don\'t you accept credit cards?',
    a: 'Major credit-card networks (Visa, Mastercard, AMEX, Discover) and processors do not currently support research-peptide categories. Vialchems Labs routes payments through self-hosted infrastructure to maintain operational continuity.',
  },
  {
    q: 'How long does shipping take?',
    a: 'USPS Priority: 1-3 business days. FedEx 2-Day: 2 business days. FedEx Overnight: next business day. Same-business-day shipping on orders placed before 3pm Mon-Fri.',
  },
  {
    q: 'What happens if my package is lost?',
    a: 'Contact Vialchems Labs support with your order ID. We will work with USPS or FedEx to investigate. Replacement is provided at our discretion based on evidence (tracking, delivery confirmation, photo if applicable).',
  },
  {
    q: 'What is your refund policy?',
    a: 'All sales final on opened vials. Replacement is provided for shipping damage with photo evidence within 7 days of delivery. See full policy at https://vialchems.labs/legal/refunds.',
  },
  {
    q: 'Why is the catalog smaller than competitors?',
    a: 'Vialchems Labs launches with a focused 7-SKU catalog to maintain compliance simplicity, COA pipeline integrity, and operational reliability. The 7 openers cover canonical recovery (BPC-157, TB-500), GH-axis (Ipamorelin, CJC-1295 no DAC), cosmetic-pathway (GHK-Cu), metabolic (MOTS-c), and nootropic (Selank) research areas. Catalog expansion follows community demand and regulatory clarity.',
  },
  {
    q: 'Why don\'t you sell semaglutide, tirzepatide, or retatrutide?',
    a: 'These compounds are subject to active FDA enforcement and (for tirzepatide) an ITC General Exclusion Order at the US border. Vialchems Labs excludes them for compliance reasons.',
  },
  {
    q: 'Why don\'t you sell bacteriostatic water?',
    a: 'Recent FDA enforcement has classified bacteriostatic water sold alongside peptides as drug intent. Vialchems Labs sells peptides only. Buyers source bacteriostatic water separately.',
  },
  {
    q: 'Do you offer dosing recommendations?',
    a: 'No. Vialchems Labs does not provide dosing recommendations or research protocols. Dosing for laboratory experimental design is at the discretion of the qualified researcher per their study protocol.',
  },
  {
    q: 'Can I store products at room temperature?',
    a: 'Lyophilized peptide vials are stable at 2-8°C in sealed conditions. Once reconstituted in solution, peptides should be used or refrigerated per the storage guide.',
  },
  {
    q: 'Do you offer bulk discounts?',
    a: 'Volume discounts are not currently offered. Bundle pricing is available on the Recovery Stack (BPC-157 10mg + TB-500 5mg) at $77 (12.5% effective discount).',
  },
  {
    q: 'What is the affiliate program?',
    a: 'Researchers and content creators in adjacent fields can apply to the Vialchems Labs affiliate program. Commissions: 10% min / 15% median / 20% max with 90-day cookie. Apply at https://vialchems.labs/affiliate.',
  },
  {
    q: 'How do I unsubscribe from emails?',
    a: 'Click the unsubscribe link in any email or visit https://vialchems.labs/unsubscribe.',
  },
  {
    q: 'How do I contact support?',
    a: 'Email research@vialchems.labs or use the contact form at https://vialchems.labs/contact. Response within 1 business day.',
  },
];
