---
url: multiple
fetched_at: 2026-05-06T22:52Z
fetch_method: webfetch + websearch (cross-source aggregation)
status: documented
notes: Documented payment-processor-related migration events across the 15-vendor list and broader research-peptide industry, with primary or near-primary citations.
---

# Documented Migration Events (chronological)

## 1. Peptide Pros adds Bitcoin via Blocknomics — May 22, 2021

URL: https://jukeboxmind.com/2021/05/22/peptide-pros/
Verbatim: "Peptide Pros Now Accepts Bitcoin Payments for the Purchase of Peptides and SARMs"
Verbatim: "the firm would accept Bitcoin as a mode of payment through Blocknomics"
Cross-cite: https://x.com/PeptidePros/status/1402034953093718018 (Twitter post by @PeptidePros, June 2021, with link to influencive.com article)
Vendor: Peptide Pros (NOT in the 15-list, but a relevant industry data point)
Type: NEW PROCESSOR ADD
Processor added: Blocknomics

## 2. Umbrella Labs introduces credit card processing — April 25, 2023

URL: https://www.globenewswire.com/news-release/2023/04/25/2654540/0/en/Umbrella-Labs-Revolutionizes-the-Buying-Process-with-the-Introduction-of-Credit-Card-Processing-for-SARMS-Nootropics-Peptides-and-Research-Chemicals.html
Verbatim headline: "Umbrella Labs Revolutionizes the Buying Process with the Introduction of Credit Card Processing for SARMS, Nootropics, Peptides, and Research Chemicals"
Verbatim quote: "We are thrilled to introduce credit card processing as a payment option for our customers. Our goal has always been to provide exceptional products and services, and this new payment method further simplifies the purchasing process, allowing customers to buy our products with ease and convenience." — Erika Jenkins, Umbrella Labs
Cross-cite: https://www.isarms.com/forums/threads/umbrella-labs-credit-card-processing-live.58725/ — forum thread celebrating the launch
Vendor: Umbrella Labs (one of the 15)
Type: NEW PROCESSOR ADD (additive)
Processor added: MESH Network (per peptideprotocolwiki and muscleandbrawn cross-cites; press release does not name the processor by name, but the rail is observable on the live /payment-options/ page as supplementing BTCPay+Plaid)
Significance: One of the FEW research-peptide vendors that publicly announced credit-card capability. Limited to $1,000 per transaction, statement descriptor "UNBLOCK," US-only.

## 3. SwissChems launches credit/debit card via MAX Redemption — August 9, 2024

URL: https://x.com/SwissChemsNew/status/1821894203544052115
Verbatim X post (per X title metadata): "Big News! Swisschems now accepts credit and debit card payments! Shopping for your favorite SARMs, peptides, and nootropics just got easier and more secure. Start shopping today!"
Cross-cite: https://swisschems.is/how-pay-with-credit-debit-card-via-max/ (page exists but anti-bot-blocks direct fetch); /how-to-pay/ also blocks
Cross-cite: https://insidebodybuilding.com/swisschems-review/ — names "Max Redemption" as the processor and 5% fee.
Vendor: SwissChems (one of the 15)
Type: NEW PROCESSOR ADD (additive)
Processor added: MAX Redemption (5% fee, US-only, mobile-number gated)
Significance: Vendor was Bitcoin/Zelle/wire-only prior to this. SwissChems explicitly states (per /how-to-pay/ snippets) that "PayPal, Amazon Pay, or Stripe" do NOT accept research chemicals — making MAX an explicit workaround.

## 4. SwissChems crypto-discount tier change

Cross-cite: https://insidebodybuilding.com/swisschems-review/ — "Some SARM companies offer a discount for paying via cryptocurrency; however, SwissChems no longer provides this benefit."
Cross-cite: https://www.peptides.org/swiss-chems-review/ — earlier snapshot describes "20% discounts on purchases made with Bitcoin"
Cross-cite: https://swisschems.is/how-to-buy-with-bitcoin/ (search snippet) — "Swiss Chems offers a 20% discount for those orders"
Vendor: SwissChems
Type: DISCOUNT-TIER POLICY CHANGE (likely tied to MAX adoption or crypto-payment-volume reduction)
Date: UNCERTAIN — appears to be sometime after August 2024 launch.

## 5. Mastercard BRAM enforcement update — 2025-2026

URL (paywall/blocked): https://onpoint.to/10-peptide-store-payment-gateways/ + https://inclusivepay.com/peptide-payment-processor-shutdown/
Verbatim (cross-source): "In 2026, Mastercard updated its BRAM enforcement program (GLB 11691.1) to tighten controls over research peptides, unapproved pharmaceuticals, and nutraceuticals. The practical effect: processors that previously had looser standards for peptide accounts are now applying stricter underwriting — or exiting the category entirely."
Cross-cite: legitscript.com hosts a 2025-10 PDF guide for payment processors covering peptides as a category.
Vendor: industry-wide
Type: REGULATORY TIGHTENING that triggers downstream processor terminations. Operator should treat this as the macro driver for any 2025-2026 vendor processor migrations.

## 6. Documented Stripe termination (anonymized) — pre-2026

URL: https://inclusivepay.com/peptide-payment-processor-shutdown/
Verbatim: "A research peptide seller processing $18K per month had their Stripe account terminated with no warning. Their $11,200 in pending payouts was frozen for 127 days."
Vendor: anonymous (Inclusive Pay does not name)
Type: ACCOUNT TERMINATION + funds freeze
Date: not specified
Significance: This is a representative case study, not a verifiable individual event. Operator should treat as INDICATIVE, not as a sourced specific incident.

## 7. Peptide Sciences (different vendor) shut down — March 2026

URL: https://peptidelaws.com/news/why-did-peptide-sciences-shut-down-fda-pressure-timeline (search snippet only)
Verbatim summary: "Peptide Sciences—one of the most established vendors in the US—voluntarily shut down and pulled its entire catalog in March 2026."
Vendor: Peptide Sciences (NOT in the 15-list, but represents the macro-environment)
Type: COMPLETE VENDOR SHUTDOWN (not just processor migration)
Significance: When a top-tier vendor shuts down voluntarily, the surviving 15-list vendors are inheriting that demand AND that scrutiny.

## 8. Pharmaceutical company federal lawsuits — April-August 2025

Verbatim summary: "Eli Lilly filed against telehealth companies distributing tirzepatide in April 2025, and Novo Nordisk followed with suits against 14 semaglutide distributors in August 2025."
Vendor: industry-wide
Type: LITIGATION-DRIVEN ENFORCEMENT
Significance: This is a downstream pressure on payment processors to drop vendors carrying GLP-1 / tirzepatide / semaglutide lines.

## Coverage Gaps in the migration timeline

- Reddit / MesoRx / EliteFitness threads are largely behind-bot-block / 403-block from this fetcher; only Compoundtalk thread t49666 surfaced in plain text.
- The "Stripe pulled out of [specific vendor X]" forum-post genre, while widely referenced in vendor reviews, is not directly citeable to a primary-source thread that this agent could fetch.
- Wayback Machine (web.archive.org) is hard-blocked by this Claude Code WebFetch instance — no historical snapshots could be accessed to compare 2022 vs 2024 vs 2026 payment-method pages.
- Vendor newsletter / email-archive evidence is not surfaceable at this discovery depth.
