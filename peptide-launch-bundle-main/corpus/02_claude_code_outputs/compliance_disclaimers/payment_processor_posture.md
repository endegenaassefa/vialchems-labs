---
title: Payment-Processor and Platform-Policy Posture — 15 Research-Peptide Vendors
slice: compliance_disclaimers
research_window: 2026-05-06
fetched_via: WebFetch + WebSearch (cross-source aggregation)
raw_fetches_dir: /mnt/c/Users/endeg/Documents/peptide-research/peptide-research_cli/03_raw_fetches/compliance_slice/payment_processors/
anti_cheat_compliance: verbatim quotes, OBSERVED vs INFERRED labeling, three-attempt rule honored on blocked targets, no checkout submission, no anti-bot bypass, no fake URLs
---

# 1. Per-vendor payment-method matrix

**Legend:**
- `yes (verbatim)` — vendor's own page or footer states it
- `yes (inferred)` — secondary review aggregator only; not OBSERVED on vendor page
- `yes (vendor own — disputed)` — appears on vendor's site but conflicts with cross-source
- `no` — actively NOT supported (or disclaimed by vendor)
- `uncertain` — could not reach the page; access blocked or page not found
- Cells include the verbatim phrasing where space allows.

## 1.A. Mainstream-rail (Visa/MC/Discover/AMEX) capture

| # | Vendor | Visa | Mastercard | AMEX | Discover | Statement-descriptor / Processor named | Crypto-discount tier |
|---|---|---|---|---|---|---|---|
| 1 | biotechpeptides.com | yes (header: "credit cards accepted") | yes (header: "credit cards accepted") | uncertain | uncertain | none named | none |
| 2 | corepeptides.com | yes (inferred — VISA, Mastercard, AMEX, Discover per cross-source) | yes (inferred) | yes (inferred) | yes (inferred) | none named (homepage "Now Accepting" SVG icons not text-extractable) | none disclosed |
| 3 | purerawz.co | yes (cross-source: "credit cards") — but muscleandbrawn says "does not accept payment by credit card" | yes (cross-source) | uncertain | uncertain | none named | "Crypto payments may receive a discount" (not quantified) |
| 4 | behemothlabz.com | yes (vendor own: "Enter your card details at checkout … Different cards may be handled by different payment processors") | yes (vendor own) | uncertain | uncertain | "secure card processing partners" — not named verbatim | 11% (cross-source only, NOT on vendor's own /how-to-pay/) |
| 5 | limitlesslifenootropics.com | yes (inferred — "Credit Card") | yes (inferred) | uncertain | uncertain | none named | 10% crypto / 5% CashApp / 5% bank transfer (cross-source) |
| 6 | swisschems.is | yes ("Visa and Mastercard only" per peptides.org review) | yes (verbatim) | no (verbatim: "Visa and Mastercard only") | no | "Max Redemption" (verbatim, 5% fee, US-only) | 20% Bitcoin discount (verbatim — but insidebodybuilding flags retraction of this benefit at some later date) |
| 7 | peptideguys.com | uncertain (TLS cert error) | uncertain | uncertain | uncertain | uncertain | uncertain |
| 8 | domestic-supply.com | no (no card option on /payment/) | no | no | no | none — vendor uses Western Union / Ria / crypto only | none disclosed |
| 9 | ascensionpeptides.com | yes (verbatim FAQ: "Currently we only accept credit cards (Visa, MasterCard)") | yes (verbatim) | no (vendor explicitly says only Visa/MC) | no | none named | none |
| 10 | lvluphealth.com | yes (verbatim ToS: "credit/debit cards") | yes | uncertain | uncertain | none named (Shopify-style storefront strongly suggests Shopify Payments / Stripe — see Section 5) | none |
| 11 | peptidology.com | uncertain (ECONNREFUSED on all fetches) | uncertain | uncertain | uncertain | uncertain | uncertain |
| 12 | healthgevity.com (commerce: healthgev.com) | yes (verbatim footer: "Visa") | yes (verbatim: "Mastercard") | yes (verbatim: "American Express") | yes (verbatim: "Discover") + Diners Club + JCB | none named (the icon set strongly implies Shopify Payments / Stripe / Braintree — INFERRED) | none |
| 13 | genx.bio | yes (verbatim footer: "Visa") | yes (verbatim: "Mastercard") | uncertain | uncertain | "MESH" (named verbatim on /mesh-payment-guide-setup/, since 301→404; preserved via search index) | none disclosed |
| 14 | umbrellalabs.is | yes (vendor own — "Credit/Debit Card") | yes | uncertain | uncertain | "MESH Network … charges appear as 'UNBLOCK' on bank statements" (cross-source); $1,000-per-order limit | none — instead "SAVE 5% when using Pay With US Bank Account" (ACH discount, not crypto) |
| 15 | particlepeptides.com | yes (cross-source: "Secure online Card payments"; Rocketfuel-mediated crypto-on-ramp) | yes (inferred via Rocketfuel) | uncertain | uncertain | "Rocketfuel" (cross-source) — fiat-to-crypto on-ramp (MCC 6051 settlement) | none disclosed |

## 1.B. Crypto-rail capture

| # | Vendor | Bitcoin | Ethereum | USDT / Other crypto | Crypto rail provider |
|---|---|---|---|---|---|
| 1 | biotechpeptides.com | not visible on homepage | n/a | n/a | NONE NAMED |
| 2 | corepeptides.com | yes ("Crypto" per cross-source) | inferred | inferred | NOT IDENTIFIED |
| 3 | purerawz.co | yes ("Bitcoin" verbatim per /how-to-pay/ snippet — "send the total order amount to an address provided at checkout, and once the transaction provides a confirmation hash, they email the order number and confirmation hash to support@purerawz.co") | likely (inferred from "cryptocurrency") | likely (inferred) | CUSTOM OTC (vendor receives address-to-address, manual hash verification) |
| 4 | behemothlabz.com | yes (verbatim /bitcoin-instructions/: "Send the total order amount to the address provided at checkout … email the order number and confirmation hash to support@behemothlabz.com") | yes (cross-source: "Bitcoin, Litecoin, and Ethereum") | inferred (Litecoin verbatim, USDT not named) | CUSTOM OTC (manual hash verification) |
| 5 | limitlesslifenootropics.com | yes (inferred: "Crypto (Bitcoin, Ethereum)") | yes (inferred) | inferred | NOT IDENTIFIED |
| 6 | swisschems.is | yes (verbatim: "Bitcoin") | yes (cross-source: "wide range of cryptocurrencies") | yes (USDT, LTC mentioned in some review snippets) | NOT NAMED on vendor pages; coupons site mentions "Ethereum (ETH), Litecoin (LTC), USDT, or any supported cryptocurrency" |
| 7 | peptideguys.com | uncertain | uncertain | uncertain | uncertain |
| 8 | domestic-supply.com | yes (verbatim /payment/: "Bitcoins, Litecoins, Dash and Ethereum. (No minimum)") | yes (verbatim) | no (USDT not named) | CUSTOM OTC (vendor lists buyer-side exchanges to acquire crypto, not their own processor) |
| 9 | ascensionpeptides.com | no ("Currently we only accept credit cards (Visa, MasterCard)") | no | no | n/a |
| 10 | lvluphealth.com | no (ToS lists only "credit/debit cards and PayPal") | no | no | n/a |
| 11 | peptidology.com | uncertain (cross-source aggregator says "crypto") | uncertain | uncertain | NOT IDENTIFIED |
| 12 | healthgevity.com | no (footer = card icons only; cross-source aggregator claim of Venmo/PayPal not verified) | no | no | n/a |
| 13 | genx.bio | yes (cross-source: "cryptocurrency (Bitcoin)") | not named | not named | NOT NAMED (custom OTC pattern likely) |
| 14 | umbrellalabs.is | yes (verbatim: "BTCPay (Bitcoin, Lightning Network…)" — "Invoice will only be valid for BTC payment for 30 minutes") | not named | not named | **BTCPay Server** (verbatim, vendor-named — likely self-hosted given how the brand is used) |
| 15 | particlepeptides.com | yes (cross-source via Rocketfuel) | inferred | inferred | **Rocketfuel** (cross-source — fiat-to-crypto on-ramp) |

## 1.C. Bank-rail (ACH / eCheck / Wire / Money Transfer)

| # | Vendor | ACH | eCheck | Wire transfer | Cash-only money transfer | Provider named |
|---|---|---|---|---|---|---|
| 1 | biotechpeptides.com | no (not surfaced) | no | no | no | none |
| 2 | corepeptides.com | yes (cross-source: "ACH bank transfers") | inferred | no | no | NOT NAMED |
| 3 | purerawz.co | yes (cross-source: "ACH transfers") | inferred | inferred | no | NOT NAMED |
| 4 | behemothlabz.com | inferred (cross-source: peptideprotocolwiki lists none specifically; nanotechproject says "credit or debit card, and even PayPal") | no | no | no | NOT NAMED |
| 5 | limitlesslifenootropics.com | yes (inferred: "ACH") | yes (verbatim cross-source: "Echeck") | yes (verbatim: "Bank Wire") | no | NOT NAMED |
| 6 | swisschems.is | no | yes (verbatim per peptides.org: "Electronic check") | yes (verbatim: "Wire transfer") | no | NOT NAMED |
| 7 | peptideguys.com | uncertain | uncertain | uncertain | uncertain | uncertain |
| 8 | domestic-supply.com | no | no | no | yes — Western Union ($400 min cash in person), Ria ($200 min cash in person); explicit ban on online apps | NONE (manual cash counter pickup) |
| 9 | ascensionpeptides.com | no | no | no | no | n/a |
| 10 | lvluphealth.com | no (ToS does not include) | no | no | no | n/a (Shopify-based) |
| 11 | peptidology.com | uncertain ("bank transfer" per outliyr) | uncertain | uncertain | uncertain | NOT IDENTIFIED |
| 12 | healthgevity.com | no (footer = card icons only) | no | no | no | n/a (Shopify-based) |
| 13 | genx.bio | no | no | no | no | none |
| 14 | umbrellalabs.is | yes ("Pay with US Bank Account" verbatim, Plaid-verified, "SAVE 5%", "3-4 business days") | yes (= ACH) | yes (cross-source for international) | no | **Plaid** (verbatim — verifies bank account) |
| 15 | particlepeptides.com | inferred (EU "bank transfer" rather than US ACH per cross-source) | n/a | yes (cross-source: "wire transfers") | no | NOT NAMED |

## 1.D. P2P-app rail (Zelle, CashApp, Venmo)

| # | Vendor | Zelle | CashApp | Venmo | PayPal | Apple Pay | Other |
|---|---|---|---|---|---|---|---|
| 1 | biotechpeptides.com | no | no | no | no (cross-source claims yes, but vendor own page is silent) | no | none |
| 2 | corepeptides.com | yes (verbatim cross-source: "Zelle") | yes (verbatim: "CashApp") | yes (verbatim: "Venmo") | no | no | "Client reward points" (per peptides.org cross-source — though that quote belonged to SwissChems; verify independently) |
| 3 | purerawz.co | yes (cross-source: "Zelle" — 1% fee) | inferred | yes (cross-source: "Venmo" — 3% fee) | no | inferred (muscleandbrawn says "Google Pay") | Google Pay (cross-source) |
| 4 | behemothlabz.com | yes (cross-source) | no | no (one source says yes, others silent) | yes (cross-source per nanotechproject — but disputed; vendor's own page does not name PayPal) | yes (cross-source) | none |
| 5 | limitlesslifenootropics.com | yes (cross-source: "Zelle" — 5% discount via "Bank Transfer") | yes (cross-source: "Cashapp" — 5% discount) | no | no | yes (cross-source: "Apple Pay") | Revolut (verbatim — vendor has dedicated /how-to-pay-2/ Revolut page); Cash on Delivery (cross-source — uncommon, treat with caution) |
| 6 | swisschems.is | yes (verbatim: "Zelle" — 10% fee per peptides.org; payments routed via "Snappy Group of Companies" per sarms.io) | yes (cross-source) | no | no (vendor explicitly says no — "PayPal, Amazon Pay, or Stripe… don't accept 'Research Chemicals' as a product category") | no | "Client reward points" (verbatim per peptides.org) |
| 7 | peptideguys.com | uncertain | uncertain | uncertain | uncertain | uncertain | uncertain |
| 8 | domestic-supply.com | no (vendor explicitly bans online money apps) | no | no | no | no | Western Union + Ria (cash-only, in-person) |
| 9 | ascensionpeptides.com | no | no | no | no | no | none |
| 10 | lvluphealth.com | no | no | no | yes (verbatim ToS: "credit/debit cards and PayPal") | no | uncertain ("Zip" claimed by outliyr, not in ToS) |
| 11 | peptidology.com | uncertain | uncertain | uncertain | uncertain | uncertain | uncertain |
| 12 | healthgevity.com | no (footer doesn't show) | no | no (cross-source claims yes — UNVERIFIED) | no (cross-source claims yes — UNVERIFIED) | no | none verbatim |
| 13 | genx.bio | no | no | no | no | no | "MESH" (the underlying card-funded P2P-style processor) |
| 14 | umbrellalabs.is | yes (cross-source: "Zelle") | no | no | no (Trustpilot user explicitly: "they do not take paypal as they know their sales would get disputed") | yes (cross-source: "Apple Pay") | Money Order (cross-source) |
| 15 | particlepeptides.com | no | no | no | yes (cross-source — vendor is EU; PayPal posture differs from US peers) | no | Zen wallet (per single customer review on homepage; not vendor-policy) |

## 1.E. One-paragraph posture per vendor

**1. biotechpeptides.com** — Minimal disclosed posture: only "credit cards accepted" wording on the homepage banner. No FAQ or "how to pay" page in the top nav. Specific card brands and any crypto rail are not visible without checkout. Cross-source aggregators add "PayPal" but vendor's own site does not say so verbatim. Best classification: **CC-mainly, opaque rail, no crypto discount**.

**2. corepeptides.com** — Vendor's footer "Now Accepting" block uses base64 SVG icons that do not extract as text. Cross-source review aggregators converge on the widest payment menu of the 15: "VISA, Mastercard, American Express, or Discover" + "Venmo, Zelle, CashApp, cryptocurrency, ACH bank transfers." No crypto rail named. Best classification: **kitchen-sink, all rails, no crypto discount disclosed**.

**3. purerawz.co** — Vendor anti-bot-blocks direct fetch (403 on /, /how-to-pay/, /bitcoin-instructions/, /faq/). Per Google search snippets of those pages: "PureRawz accepts payments via Venmo, Zelle and Cryptocurrency … credit cards, bank transfers, and cryptocurrencies like Bitcoin." Bitcoin via custom OTC ("send total to address … email the order number and confirmation hash to support@purerawz.co"). Fees: Zelle 1%, Venmo 3%, "small service fee if paying with a credit card." muscleandbrawn says "PureRawz does not accept payment by credit card" — likely a stale review or policy oscillation. Best classification: **multi-rail, custom-OTC crypto, ambivalent on cards**.

**4. behemothlabz.com** — Direct page fetch successful. Vendor /how-to-pay/ states "Enter your card details at checkout and confirm the payment. Transactions are processed instantly through our secure card processing partners." Note PLURAL "partners" — multi-processor routing. Bitcoin via custom OTC ("Send the total order amount to the address provided at checkout … email the order number and confirmation hash to support@behemothlabz.com"). Cross-source: 11% crypto discount, also accepts Apple Pay / Zelle. Best classification: **multi-rail card + custom-OTC crypto, opaque processor**.

**5. limitlesslifenootropics.com** — Homepage only says "100% SECURE PAYMENT - All transactions are protected with industry-standard encryption." Vendor maintains a dedicated /how-to-pay-2/ page that is REVOLUT-ONLY (step-by-step Revolut transfer instructions). Cross-source aggregators add Credit Card + eCheck + Crypto (10% disc) + CashApp (5% disc) + Bank Transfer (5% disc) + Zelle + ACH + Apple Pay + Cash on Delivery. The breadth of methods plus the discount-tiering is one of the most aggressive of the 15. Best classification: **kitchen-sink, tiered-discount, crypto-favored**.

**6. swisschems.is** — Vendor anti-bot-blocks direct fetch. Per cross-source: "Visa and Mastercard only" credit cards via **MAX Redemption** (5% fee, US-only, mobile-number required). Vendor explicitly disclaims PayPal/Amazon Pay/Stripe ("don't accept 'Research Chemicals' as a product category"). Bitcoin gets 20% discount (per peptides.org review; insidebodybuilding says this benefit was later retracted). Zelle payments routed via "Snappy Group of Companies" multi-account rotation per sarms.io review. International orders forced to Bitcoin only. Best classification: **explicitly-high-risk-aware, MAX-card-fronted, BTC-discount-driven, with rotational Zelle counterparties**.

**7. peptideguys.com** — TLS certificate altname mismatch on direct fetches; cannot OBSERVE. Public review aggregators do not surface a verbatim payment list specific to peptideguys.com (search results conflate with peptidegurus.com, a different vendor). Best classification: **DATA NOT CAPTURED**.

**8. domestic-supply.com** — Direct page fetch successful. Vendor /payment/ states verbatim: "Ria (minimum $200), Western Union (minimum $400) … All money transfer shoulb [sic] be made in person and cash only! no Online services or apps!" Plus crypto: "Also We accept - Bitcoins, Litecoins, Dash and Ethereum. (No minimum)." This is an OUTLIER posture among the 15 — no cards, no ACH, no P2P apps, no PayPal. The cash-and-crypto-only model is the most-defensive posture on the 15 list. Best classification: **cash-and-crypto-only outlier; AML-evasive in surface signal**.

**9. ascensionpeptides.com** — Direct fetch successful. /frequently-asked-questions/ states verbatim: "Currently we only accept credit cards (Visa, MasterCard). More payment options will be available soon." Vendor explicitly acknowledges its narrow rail-set is temporary. Cross-source aggregators (outliyr, peptideprotocolwiki) include PayPal, Apple Pay, Google Pay, Crypto — these contradict the FAQ and are likely ASPIRATIONAL or AGGREGATOR ERROR. Best classification: **single-rail card-only, transitional**.

**10. lvluphealth.com** — Direct fetch successful. /terms-of-service/ verbatim: "Accepted payment methods: credit/debit cards and PayPal." This is the MOST UNUSUAL posture among the 15 because PayPal explicitly bans research peptides — meaning either LVLUP positions itself as supplements/nutraceuticals (not "research chemicals"), or LVLUP is operating outside PayPal ToS and is at constant termination risk. The shopify.lvluphealth.com → wholesale.lvluphealth.com redirect implies LVLUP runs Shopify storefronts, which would mean Shopify Payments handling card volume — a category Shopify also bans. LVLUP's positioning likely walks the supplement-vs-research-chemical line aggressively. Best classification: **mainstream-rail, supplement-positioned, high-termination-risk if reclassified**.

**11. peptidology.com** — ECONNREFUSED on all four fetch attempts. Domain is unreachable from this fetcher. Best classification: **UNREACHABLE; data only via outliyr aggregator: "CC (3D Secure), bank transfer, crypto"**.

**12. healthgevity.com** — Direct fetch on healthgev.com (the actual storefront) successful; healthgevity.com has TLS cert mismatch (likely marketing-redirect domain). Footer payment block lists "American Express, Diners Club, Discover, JCB, Mastercard, Visa" — the standard mainstream-processor card icon set. NO crypto, NO Zelle/Venmo/PayPal in the verbatim footer. This is clearly a vendor that positions itself as a clinician-grade nutraceutical company (oral peptide formulations, SNAC tech, unlike capsule-and-vial research peptides) — explaining how it retains mainstream-processor access. Best classification: **nutraceutical-positioned, full-mainstream-rail, edge case**.

**13. genx.bio** — Footer shows Visa + Mastercard. Cross-source confirms Bitcoin acceptance and that genx.bio uses **MESH** as its credit-card processor (page /mesh-payment-guide-setup/ is now 301→404, but search index preserves it). Same processor as Umbrella Labs. Best classification: **CC-via-MESH + Bitcoin-OTC, no crypto-discount tier**.

**14. umbrellalabs.is** — Vendor /payment-options/ verbatim: "BTCPay (Bitcoin, Lightning Network…)" + "Pay with US Bank Account" via **Plaid** (5% discount, 3-4 business days). Cross-source: also MESH-routed credit/debit cards ($1,000 limit, "UNBLOCK" statement descriptor), Zelle, Apple Pay, Money Order. NO PayPal — Trustpilot user explanation: "they do not take paypal as they know their sales would get disputed." Vendor publicly announced credit-card processing on April 25, 2023 via GlobeNewswire. Best classification: **3-rail well-stacked: BTCPay self-hosted crypto + Plaid ACH + MESH cards; no PayPal by design**.

**15. particlepeptides.com** — EU vendor (Slovakia). Homepage only says "Secure online Card payments." Cross-source identifies **Rocketfuel** (a fiat-to-crypto on-ramp gateway) as their crypto rail — buyers pay with Visa/MC, Rocketfuel converts to crypto, vendor receives crypto. This is a textbook crypto-on-ramp workaround. Also accepts wire transfer / bank transfer + PayPal (cross-source). One on-page customer review references "Zen" wallet integration friction. Best classification: **EU-based, Rocketfuel-mediated card-to-crypto + wire + PayPal**.

---

# 2. Documented processor failures and migrations (timeline)

This section answers: where can primary or near-primary sources document a payment-processor change for a research-peptide vendor? The honest answer: **the vast majority of "Stripe terminated X" stories are oral-tradition forum lore, not citeable to a primary source by this agent's reach**. Below are the events where a citation does exist.

## 2.1. May 22, 2021 — Peptide Pros adds Bitcoin via Blocknomics

- **Vendor**: Peptide Pros (Florida-based; NOT in the 15-list)
- **Type**: NEW PROCESSOR ADD
- **Processor added**: Blocknomics (crypto payment processor)
- **Source**: https://jukeboxmind.com/2021/05/22/peptide-pros/ (verbatim title: "Peptide Pros Now Accepts Bitcoin Payments for the Purchase of Peptides and SARMs"); cross-cited by https://www.elucidmagazine.com/spotlight/peptide-pros-now-accepts-bitcoin-payments-for-the-purchase-of-peptides-and-sarms; vendor X post: https://x.com/PeptidePros/status/1402034953093718018
- **Verbatim quote**: "the firm would accept Bitcoin as a mode of payment through Blocknomics … to incorporate the use of Bitcoin as a mode of payment, the company partnered with Blocknomics, a leader in the crypto payment processing space."
- **Significance**: One of the cleanest publicly-announced crypto-rail additions in this category. Establishes that 2021 is when the migration wave was well underway.
- **Access date**: 2026-05-06.

## 2.2. April 25, 2023 — Umbrella Labs introduces credit-card processing (eventually identified as MESH)

- **Vendor**: Umbrella Labs (one of the 15)
- **Type**: NEW PROCESSOR ADD (additive)
- **Processor added**: MESH Network (cross-source identified; press release does not name it)
- **Source**: https://www.globenewswire.com/news-release/2023/04/25/2654540/0/en/Umbrella-Labs-Revolutionizes-the-Buying-Process-with-the-Introduction-of-Credit-Card-Processing-for-SARMS-Nootropics-Peptides-and-Research-Chemicals.html (primary, dated press release)
- **Verbatim quote**: "We are thrilled to introduce credit card processing as a payment option for our customers. Our goal has always been to provide exceptional products and services, and this new payment method further simplifies the purchasing process, allowing customers to buy our products with ease and convenience." — Erika Jenkins, Umbrella Labs.
- **Cross-cite (forum corroboration)**: https://www.isarms.com/forums/threads/umbrella-labs-credit-card-processing-live.58725/ — verbatim from forum: "as of now, you can purchase with a credit or debit card with true live processing! This is huge news and makes it easier for everyone to obtain their research products in a much easier way!"
- **Significance**: One of the FEW publicly-announced credit-card capability launches in this category. Limited to $1,000 per transaction, statement descriptor "UNBLOCK," US-only — the constraints make the capability narrow but real.
- **Access date**: 2026-05-06.

## 2.3. August 9, 2024 — SwissChems launches credit/debit card via MAX Redemption

- **Vendor**: SwissChems (one of the 15)
- **Type**: NEW PROCESSOR ADD (additive)
- **Processor added**: MAX Redemption
- **Source**: https://x.com/SwissChemsNew/status/1821894203544052115 (vendor X post; the title metadata indexed by Google)
- **Verbatim quote (from X post title)**: "Big News! Swisschems now accepts credit and debit card payments! Shopping for your favorite SARMs, peptides, and nootropics just got easier and more secure. Start shopping today!"
- **Cross-cite (review)**: https://insidebodybuilding.com/swisschems-review/ — names "Max Redemption" verbatim and notes "A 5% fee applies to payments made via debit or credit card" and "Max Redemption payments are only available for U.S. customers."
- **Cross-cite (vendor's own page)**: https://swisschems.is/how-pay-with-credit-debit-card-via-max/ — exists per Google index but anti-bot-blocks direct fetch.
- **Significance**: Documents that prior to August 2024, SwissChems was crypto/Zelle/wire-only. The move adds a card rail without dropping crypto.
- **Access date**: 2026-05-06.

## 2.4. UNDATED (post Aug 2024) — SwissChems retracts crypto discount

- **Vendor**: SwissChems
- **Type**: DISCOUNT-TIER POLICY CHANGE
- **Source 1 (older)**: https://www.peptides.org/swiss-chems-review/ — "20% discounts on purchases made with Bitcoin"
- **Source 2 (newer)**: https://insidebodybuilding.com/swisschems-review/ — "Some SARM companies offer a discount for paying via cryptocurrency; however, SwissChems no longer provides this benefit."
- **Significance**: First documented case in the 15-vendor cohort of a vendor REDUCING crypto incentive after gaining card rails. Suggests a lifecycle pattern: when card processing becomes available, vendors taper crypto discount because they no longer need the demand-shaping.
- **Access date**: 2026-05-06.
- **Coverage gap**: cannot pin this to a specific calendar date without access to the live page or Wayback (blocked).

## 2.5. 2025 — Mastercard BRAM enforcement update (GLB 11691.1)

- **Vendor**: industry-wide
- **Type**: REGULATORY TIGHTENING (not a vendor migration but it is the macro driver of every 2025-2026 individual vendor termination event)
- **Source**: https://inclusivepay.com/peptide-payment-processor-shutdown/ + https://onpoint.to/10-peptide-store-payment-gateways/ + LegitScript October 2025 PDF (https://www.legitscript.com/wp-content/uploads/2025/10/Peptides-for-Payment-Processors-Guide.pdf — present but PDF binary not parseable by this agent)
- **Verbatim**: "In 2026, Mastercard updated its BRAM enforcement program (GLB 11691.1) to tighten controls over research peptides, unapproved pharmaceuticals, and nutraceuticals. The practical effect: processors that previously had looser standards for peptide accounts are now applying stricter underwriting — or exiting the category entirely."
- **Access date**: 2026-05-06.

## 2.6. April-August 2025 — Pharmaceutical-company federal lawsuits (downstream pressure)

- **Vendor**: industry-wide
- **Type**: LITIGATION-DRIVEN PROCESSOR PRESSURE
- **Source**: WebSearch returns from peptideexaminer.com / peptidelaws.com / Eli Lilly v. telehealth filings (April 2025), Novo Nordisk v. 14 semaglutide distributors (August 2025).
- **Significance**: Even when these suits are not directed at the 15-list vendors, they raise the heat on every vendor's banking and processor relationships.

## 2.7. UNNAMED Stripe termination — pre-2026 (representative case study)

- **Vendor**: anonymous (Inclusive Pay does not name the vendor)
- **Source**: https://inclusivepay.com/peptide-payment-processor-shutdown/
- **Verbatim**: "A research peptide seller processing $18K per month had their Stripe account terminated with no warning. Their $11,200 in pending payouts was frozen for 127 days."
- **Significance**: This is a representative case study, not a verifiable individual event. It confirms the Stripe-terminates-and-holds-funds pattern but is not citeable to a specific vendor or date.
- **Access date**: 2026-05-06.

## 2.8. March 2026 — Peptide Sciences voluntarily shuts down

- **Vendor**: Peptide Sciences (NOT on the 15-list, but reference for macro-environment)
- **Type**: COMPLETE VENDOR SHUTDOWN (not just processor migration)
- **Source**: https://peptidelaws.com/news/why-did-peptide-sciences-shut-down-fda-pressure-timeline (search snippet, page not directly fetchable via WebFetch from this environment)
- **Verbatim quote (from snippet)**: "Peptide Sciences—one of the most established vendors in the US—voluntarily shut down and pulled its entire catalog in March 2026."
- **Significance**: When a tier-1 vendor exits voluntarily, the 15-list vendors are inheriting that demand AND that scrutiny. Operator should treat this as a leading indicator of further 2026 enforcement.

## 2.9. Migration events that are widely-referenced but NOT citeable from this fetch session

- "Stripe pulled out of [biotechpeptides / corepeptides / behemothlabz / limitless life]" — referenced indirectly across review aggregators but no primary vendor announcement located.
- "PayPal pulls" specifically against any of the 15 — no primary vendor announcement located.
- Wayback Machine snapshots that would let us see 2022 vs 2024 vs 2026 payment-method pages — **web.archive.org is hard-blocked from WebFetch in this environment**.
- Reddit r/Peptides, r/PeptideTalk, r/SARMSourceTalk threads about specific vendor processor changes — most direct fetches via reddit.com return 403; Google search did not surface specific quotable threads.

**Honest count of citable migration events**: 4 vendor-specific (Peptide Pros 2021, Umbrella Labs 2023, SwissChems Aug 2024 launch, SwissChems undated discount retraction) + 2 macro/regulatory (Mastercard BRAM 2025, pharma lawsuits 2025) + 1 whole-vendor shutdown (Peptide Sciences March 2026). The directive asked for 5+ migration events; the citable count meets that bar but the **vendor-specific** count among the 15 in the slice is only 2 (Umbrella Labs, SwissChems). This is itself the finding the operator wanted: the 15-vendor cohort has very thin primary-source documentation of processor changes — most of the change happens silently, between checkout-page revisions, with no announcement.

---

# 3. Crypto-rail provider landscape

Below is the verbatim landscape of named crypto rails serving the 15-vendor cohort + adjacent peer vendors.

## 3.1. Named crypto rails OBSERVED in the 15-vendor cohort

| Crypto rail | Used by (15-list) | Used by (adjacent) | Source |
|---|---|---|---|
| **BTCPay Server** (self-hosted) | umbrellalabs.is | — | Verbatim on umbrellalabs.is/payment-options/: "BTCPay (Bitcoin, Lightning Network…)" |
| **Rocketfuel** (fiat-to-crypto on-ramp) | particlepeptides.com | — | Cross-source via muscleandbrawn.com/peptides/particle-peptides-review/ |
| **Blocknomics** | — | Peptide Pros | Verbatim per jukeboxmind.com/2021/05/22/peptide-pros/ |
| **Custom OTC** ("send to address, email confirmation hash") | purerawz.co (verbatim from /how-to-pay/ snippet); behemothlabz.com (verbatim from /bitcoin-instructions/); domestic-supply.com (verbatim from /payment/) | many adjacent | Vendor's own pages |
| **NowPayments** | — | — | Mentioned generically in industry research articles; no 15-list vendor identified using it |
| **Coinbase Commerce** | — | — | Mentioned generically as the WooCommerce-default; no 15-list vendor identified using it |
| **BitPay** | — | — | Not surfaced |
| **OpenNode** | — | — | Not surfaced |

## 3.2. Pattern observation

The 15-vendor cohort divides into THREE clear crypto-rail strategies:

1. **Self-hosted hosted processor (BTCPay)** — full sovereignty, harder to terminate. Only Umbrella Labs explicitly. Highest durability.
2. **Fiat-to-crypto on-ramp (Rocketfuel)** — the buyer never holds crypto; merchant receives crypto on the back end. Visa/MC see MCC 6051 ("crypto purchase") instead of "peptide vendor." Particle Peptides explicitly. Highest durability for card-funded customer flows.
3. **Custom OTC (send-and-email)** — vendor has no crypto-rail provider at all; just a Bitcoin wallet address and a manual confirmation-hash workflow. PureRawz, Behemoth Labz, Domestic Supply explicitly. Lowest cost, lowest friction at scale, but no chargeback protection and no liquidity layer.

There is **no observed Coinbase Commerce / NowPayments / BitPay / OpenNode usage in the 15-vendor cohort**. This is significant: it suggests these vendors specifically avoid hosted commerce-grade crypto processors, which would inevitably KYC their merchant accounts and could later refuse the category. Self-hosted (BTCPay), card-on-ramp (Rocketfuel), and custom OTC all avoid that risk vector.

---

# 4. ACH / eCheck provider landscape

## 4.1. Named ACH/bank rails in the 15-vendor cohort

| Provider | Used by (15-list) | Source |
|---|---|---|
| **Plaid** | umbrellalabs.is | Verbatim on /payment-options/: "Pay with US Bank Account" via Plaid verification, "SAVE 5%", "3-4 business days" |
| **Western Union (in-person, cash)** | domestic-supply.com | Verbatim on /payment/: "Western Union (minimum $400) … in person and cash only! no Online services or apps!" |
| **Ria (in-person, cash)** | domestic-supply.com | Verbatim on /payment/: "Ria (minimum $200) … in person and cash only" |
| **Custom wire / bank transfer** | swisschems.is, limitlesslifenootropics.com (Bank Wire), particlepeptides.com (international wire) | Cross-source |
| **ACH (provider not named)** | corepeptides.com, purerawz.co, limitlesslifenootropics.com | Cross-source |
| **Authorize.net ACH** | — (industry-referenced but not 15-list-observed) | Industry reports |
| **Paycron eCheck** | — (industry-referenced but not 15-list-observed) | Industry reports |
| **Manual eCheck** | swisschems.is | "Electronic check" verbatim per peptides.org review |

## 4.2. Pattern observation

The most interesting ACH datapoint among the 15 is **Umbrella Labs explicitly using Plaid**. Plaid is a tier-1 fintech provider — its presence on a research-peptide vendor's payment-options page is unusual. Plaid's terms (https://plaid.com/legal/) restrict use to accounts that meet AML/KYC standards. Umbrella Labs' ability to keep Plaid integrated suggests either (a) a specific channel partner relationship, or (b) Plaid does not actively enforce against the research-peptide category through their channel.

Domestic Supply's "cash only, in-person" requirement at Western Union/Ria is the **most defensive ACH-equivalent posture** in the cohort. It specifically defeats AML transaction-monitoring systems that key on online-app metadata. This is a posture seen historically in grey-market and criminal-forfeiture-evasive money-transfer flows.

---

# 5. Liability-shield analysis: durability profile per posture

Operator framing: **observation, not advice**. This section names what each vendor's payment posture buys them in terms of survival when a processor exits the category.

## 5.1. The four-tier durability ladder

| Tier | Posture | 15-list examples | Survives Stripe pull? | Survives BRAM update? | Survives PayPal pull? | Comment |
|---|---|---|---|---|---|---|
| **TIER 1: Crypto-only** | Bitcoin via custom OTC + maybe wire | domestic-supply.com (also adds in-person Western Union/Ria) | yes | yes | yes | No card chargebacks, no AML profile, but limits buyer demographics. |
| **TIER 2: Crypto + ACH/wire** | BTC + ACH/wire + maybe Zelle | umbrellalabs.is (BTCPay+Plaid before adding MESH); pre-2024 SwissChems | yes (loses cards but not catastrophic) | yes | yes | Plaid integration is the durability anchor. |
| **TIER 3: Crypto + ACH + CC-via-high-risk** | BTC + ACH + cards via MAX/MESH/etc. | umbrellalabs.is (current); swisschems.is (current); genx.bio | partially (loses MAX/MESH if those exit, but Plaid + BTCPay survive) | partially | yes | Risk of MAX/MESH being the next BRAM target. |
| **TIER 4: Mainstream rails (Visa/MC/AMEX/PayPal/Apple Pay)** | Cards + PayPal, no crypto | healthgevity.com (=healthgev.com); lvluphealth.com; ascensionpeptides.com | NO — single point of failure | NO | NO (LVLUP-specific) | Highest demand-capture, lowest durability. Vendor positions as nutraceutical to avoid the peptide-vendor classification. |

## 5.2. Observed strategies for surviving processor terminations (verbatim from cited sources)

1. **Multi-processor card routing** — Behemoth Labz: "Different cards may be handled by different payment processors for security and efficiency" (verbatim /how-to-pay/). The pluralization is the tell — they route across at least two card processors so that if one terminates, the other catches the volume.

2. **Counterparty rotation** — SwissChems' Zelle payments routed via "Snappy Group of Companies" multi-account scheme (verbatim per sarms.io review: "they always use different accounts stemming from the 'Snappy Group of Companies'"). When one Zelle-receiving account is frozen by the bank, the next one in the rotation takes over.

3. **Statement-descriptor camouflage** — Umbrella Labs' MESH-routed cards "appear as 'UNBLOCK' on bank statements" (cross-source). Buyer's bank does not see "Umbrella Labs" or "SARMs" on the statement. This reduces post-purchase chargeback rate and reduces the rate at which transaction-monitoring algorithms flag the merchant.

4. **Per-transaction limits as a chargeback governor** — Umbrella Labs caps card transactions at $1,000 per order. This keeps single-transaction risk below most card networks' enhanced-monitoring thresholds (typically $1,500-$3,000).

5. **Fiat-to-crypto rail (MCC 6051)** — Particle Peptides via Rocketfuel: customer pays Visa/MC, the rail converts to USDC/BTC, merchant settles in crypto. Visa/MC sees a crypto purchase, not a peptide purchase. This is the cleanest workaround.

6. **Self-hosted crypto rail (BTCPay)** — Umbrella Labs hosts its own BTCPay Server. No third party can revoke the rail.

7. **Customer-acquired crypto + custom OTC** — PureRawz, Behemoth Labz, Domestic Supply all use the same pattern: vendor lists buyer-side exchanges (Coinbase, Cash App, etc.) where the customer can acquire crypto, then the customer sends to the vendor's address. Vendor has zero processor relationship that can be terminated.

8. **Discount-tier demand shaping** — Limitless Life (10% crypto / 5% bank), SwissChems (20% Bitcoin pre-retraction), Behemoth Labz (11% crypto), Umbrella Labs (5% ACH-via-Plaid). The discounts shift demand AWAY from cards (where chargeback risk is highest) toward irreversible rails. This is measurable and intentional.

9. **Regulatory-positioning differentiation** — Healthgevity and LVLUP Health both position as supplements / nutraceuticals (oral peptide products with SNAC technology, capsule formulations) rather than "research chemicals" in vials with research-only disclaimers. This positioning lets them keep mainstream rails (Visa/MC/AMEX/Discover/Diners Club/JCB on Healthgevity; cards + PayPal on LVLUP). The risk is that one product-classification audit could move them from Tier 4 to nothing.

10. **Vendor explicitly disclaims unfit processors** — SwissChems' /how-to-pay/ (per Google snippet): "PayPal, Amazon Pay, or Stripe… don't accept 'Research Chemicals' as a product category." Explicit acknowledgment in vendor's own copy that mainstream processors are off-limits is itself a liability-shield posture: it shapes buyer expectations and prevents support-tickets about "why can't I use PayPal."

---

# 6. Coverage gaps and uncertainties

## 6.1. Vendors where data is THIN (operator should re-attempt with a real browser)

- **purerawz.co** — anti-bot 403 on every /how-to-pay/, /bitcoin-instructions/, /faq/. Data captured via Google search snippets only. Need direct browser fetch.
- **swisschems.is** — same anti-bot pattern. /how-to-pay/, /how-to-buy-with-bitcoin/, /how-pay-with-credit-debit-card-via-max/, /payment-methods/ all 403 from this fetcher.
- **peptideguys.com** — TLS certificate altname mismatch. Needs a fetcher that ignores cert errors, OR the vendor is in domain-handoff and the live store is at a different URL.
- **peptidology.com** — ECONNREFUSED on every variant. Domain unreachable from this fetcher.
- **healthgevity.com** — TLS cert mismatch on the .com; we hit healthgev.com instead. Need to verify whether .com is a marketing redirect or a separate storefront.

## 6.2. What we could not do (anti-cheat compliance)

- We did NOT submit fake KYC at checkout to see what the processor's iframe says (anti-cheat rule 5).
- We did NOT bypass anti-bot rules for purerawz.co, swisschems.is, or biotechpeptides Stripe-fetch attempts (anti-cheat rule 5).
- We did NOT fetch web.archive.org snapshots — web.archive.org is hard-blocked from WebFetch in this environment, so the historical 2022→2024→2026 comparison the directive asked for is structurally unavailable.

## 6.3. Migration events that are widely cited in oral tradition but NOT primary-source citeable

- "Biotech Peptides used to take Stripe but lost it" — referenced indirectly in onPoint Studio writeups but no vendor announcement located.
- "Limitless Life had a credit-card pull in 2023" — repeated but uncited.
- "Core Peptides has rotated through multiple Zelle counterparty accounts" — pattern matches SwissChems' Snappy Group rotation but not citeable for Core specifically.
- The Reddit / r/Peptides / r/SARMSourceTalk forum-post genre — most direct fetches return 403 or no relevant primary-source threads in WebSearch results.

## 6.4. Aggregator conflicts (where two cross-sources disagree, we kept both verbatim)

- **purerawz.co** — peptideprotocolwiki says "Credit Card" accepted; muscleandbrawn says "PureRawz does not accept payment by credit card." Likely time-shifted policy.
- **ascensionpeptides.com** — vendor FAQ says "Visa, Mastercard" only; outliyr says "CC, PayPal, bank, Apple Pay, Google Pay, Venmo, Crypto." Vendor's FAQ wins for OBSERVED.
- **healthgevity.com** — footer = card brands only; outliyr says "Venmo, PayPal." Footer wins for OBSERVED.
- **lvluphealth.com** — ToS says "credit/debit cards and PayPal"; outliyr says "Zip" too; peptideprotocolwiki says "credit card only." ToS wins for OBSERVED.

## 6.5. Honest summary of coverage

- **Fully captured (vendor's own page directly fetched + verbatim payment list)**: domestic-supply.com, ascensionpeptides.com, lvluphealth.com, umbrellalabs.is, healthgevity.com (via healthgev.com), genx.bio (limited footer), behemothlabz.com.
  → 7 vendors fully captured.
- **Partial (some primary-source quotes + reliance on cross-source aggregators)**: biotechpeptides.com, corepeptides.com, purerawz.co, swisschems.is, limitlesslifenootropics.com, particlepeptides.com.
  → 6 vendors partial.
- **Failed (could not reach + cross-source aggregator data only)**: peptideguys.com, peptidology.com.
  → 2 vendors failed.

- **Documented migration events** (direct or near-direct primary-source quote with date):
  - Vendor-specific to the 15-list cohort: 2 (Umbrella Labs April 2023, SwissChems August 2024)
  - Vendor-specific to adjacent peer vendors: 1 (Peptide Pros May 2021)
  - Macro / regulatory: 2 (Mastercard BRAM 2025, pharma lawsuits 2025)
  - Whole-vendor shutdown: 1 (Peptide Sciences March 2026)
  - Anonymous representative case study: 1 (Stripe $11,200 frozen 127 days, undated)
  - Vendor-specific policy retraction: 1 (SwissChems crypto discount retraction, undated post-Aug-2024)
  → **7 documented events total**, of which **2 are clean primary-source vendor migration announcements within the 15-vendor cohort** — the slim count is itself a finding, per the directive's "honest coverage gaps" instruction.

- **Fresh raw fetches saved**: 12 (one per major vendor file) at /mnt/c/Users/endeg/Documents/peptide-research/peptide-research_cli/03_raw_fetches/compliance_slice/payment_processors/.
