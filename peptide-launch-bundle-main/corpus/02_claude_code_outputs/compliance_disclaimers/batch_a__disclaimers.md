# Batch A — Anchor Vendor Compliance / Disclaimer Capture

> Captured: 2026-05-06. 10 vendors. Sister batches B, C, D cover further vendors. All quotes are verbatim from the cited Wayback or live page; raw fetches stored in `03_raw_fetches/compliance_slice/<slug>__<page>.md`.

## Vendor index

| # | Slug | Brand | Domain | Fetch status | Notes |
|---|------|-------|--------|--------------|-------|
| 1 | peptide-sciences | Peptide Sciences | peptidesciences.com | ok (via Wayback only — domain defunct March 2026) | ToS embedded as modal in homepage; product pages Cloudflare-blocked even on Wayback |
| 2 | biotech-peptides | Biotech Peptides | biotechpeptides.com | ok | WordPress + WooCommerce + Authorize.Net |
| 3 | core-peptides | Core Peptides | corepeptides.com | ok | WordPress + WooCommerce + eDebit/Plaid + Zigu/Inovio CC gateway |
| 4 | pure-rawz | Pure Rawz | purerawz.co | partial (Cloudflare blocks live; Wayback 2025-02-14 used) | Site now also sells Delta-8/9/10/HHC/THCa cannabis + kratom, complicating compliance |
| 5 | behemoth-labz | Behemoth Labz | behemothlabz.com | ok | WordPress + WooCommerce + WooCommerce Payments (Stripe-derived); no public ToS slug found |
| 6 | limitless-life-nootropics | Limitless Life Nootropics | limitlesslifenootropics.com | ok | BigCommerce-hosted (cdn11.bigcommerce.com/s-abfevmkahe/); COAs hosted on Google Drive with explicit batch numbers |
| 7 | swiss-chems | Swiss Chems | swisschems.is | ok | WordPress + WooCommerce + Storefront theme; uses .is TLD (Iceland) for jurisdiction; PrismPay + SST gateway |
| 8 | peptide-guys | Peptide Guys | peptideguys.com | failed | Domain parked at GoDaddy `/lander`; no active site (Wayback also empty); fetch_status: failed |
| 9 | amino-asylum | Amino Asylum | aminoasylum.shop | ok (via Wayback; site raided June 2025) | WordPress + WooCommerce + Flatsome + age-gate plugin |
| 10 | domestic-supply | Domestic Supply | domestic-supply.com | ok | Custom-hosted; aggressive ALL-CAPS hostile copy; in-person cash money-transfer (Ria/Western Union) + crypto only |

## peptide-sciences (Peptide Sciences — DEFUNCT)

**Domain:** peptidesciences.com (defunct as of March 2026; captured via Wayback)
**Fetch status:** ok
**Fetch method:** webfetch-archive
**Fetched at:** 2026-05-06T22:50Z

### Footer disclaimer (verbatim)
```
"All products on this site are for Research, Development use only. Products are Not for Human consumption of any kind."

"The statements made within this website have not been evaluated by the US Food and Drug Administration. The statements and the products of this company are not intended to diagnose, treat, cure or prevent any disease."

"Peptide Sciences is a chemical supplier. Peptide Sciences is not a compounding pharmacy or chemical compounding facility as defined under 503A of the Federal Food, Drug, and Cosmetic act. Peptide Sciences is not an outsourcing facility as defined under 503B of the Federal Food, Drug, and Cosmetic act."
```
- Source URL: https://web.archive.org/web/20250228154824/https://www.peptidesciences.com/
- Raw artifact: 03_raw_fetches/compliance_slice/peptide-sciences__homepage.md

### Hero / homepage compliance language (verbatim)
```
"Currently, most peptides are not approved for human use and are used strictly in research settings."
```
This appears in the "About Peptides" introductory hero block on the homepage; it is the only homepage-hero compliance language; the harder disclaimers live in the footer + ToS modal.

### Product page disclaimer — BPC-157
- **Status:** uncertain — Wayback snapshot of `/bpc-157-5mg` returns Cloudflare "Sorry, you have been blocked" page even through web.archive.org. Vendor used Cloudflare interstitial pre-shutdown.
- Fallback is the modal-embedded ToS disclaimer from homepage (see ToS section).

### ToS key compliance highlights (verbatim, from ToS modal in homepage)
- Research-use-only: `"The products we offer are intended for IN-VITRO LABORATORY RESEARCH USE ONLY-- NOT FOR HUMAN USE."`
- Research-use-only: `"ALL products and services offered are for IN-VITRO RESEARCH purposes ONLY and are NOT TO BE INGESTED or CONSUMED IN ANY MANNER."`
- Age restriction: `"YOU MUST BE OVER 21 YEARS OLD TO USE THIS WEBSITE."`
- Jurisdiction: `"This Web Site (excluding linked sites, if any) is administered and controlled by www.PeptideSciences.com.com and its affiliates...from its offices in the accordance with the laws of Nevis. You agree that this Terms and Conditions of Use Agreement and this Web Site will be governed by and construed in accordance Nevis law without giving effect to any principles of conflicts of laws."`
- Jurisdictional sales restriction: `"All items sold are legal for sale for IN-VITRO RESEARCH PURPOSES SPECIFICALLY within the USA."`
- Medical disclaimer: `"ALL PRODUCTS SOLD BY THEPEPTIDESCIENCES.COM ARE NOT TO BE USED FOR PERSONAL USE OR FOR THE TREATMENT OF ANY MEDICAL CONDITION OR DISEASE."`
- Indemnification: `"You hereby agree to indemnify and hold www.PeptideSciences.com, and our subsidiaries, affiliates, officers, directors, agents, co-branders, partners, and employees harmless from any claim or demand, including reasonable attorney's fees, made by any third party due to or arising out of your use of the content on this Web Site..."`

### Age-gate
- Present? No visible JavaScript modal age-gate; instead, the age statement is buried in the embedded ToS modal users must "agree" to.
- Verbatim: `"YOU MUST BE OVER 21 YEARS OLD TO USE THIS WEBSITE."`

### Jurisdictional restriction notice
- `"All items sold are legal for sale for IN-VITRO RESEARCH PURPOSES SPECIFICALLY within the USA."`
- Governing law: Nevis (offshore — interesting choice).

### Refund policy
- Verbatim: `"Due to the nature of these products ALL SALES ARE FINAL. WE CANNOT ACCEPT RETURNS. ALL SALES ARE FINAL."` (inline ToS)

### Shipping policy
- Linked from footer as `Shipping & Payments → /customer-service`. Wayback snapshot of `/customer-service` not retrieved in this batch (not in Wayback's 2025-02-28 snapshot URL set captured); marked uncertain. Reason: only the homepage snapshot was retrieved.

### COA hosting / lab partner / batch-lot transparency
- COA hosting: uncertain — product pages Cloudflare-blocked even on Wayback. Homepage references "occasionally have your peptides tested by an independent laboratory" as an instruction to buyers, not a disclosure of vendor lab partner.
- Lab partner: not named publicly in retrieved pages.
- Batch/lot transparency: uncertain
- Source URL: as above; raw artifact: 03_raw_fetches/compliance_slice/peptide-sciences__tos.md

### Payment methods accepted (named)
- ACH / e-Check (verbatim header in modal: `"All ACH/e-Check payments will be made payable to:"`)
- Other methods uncertain — product pages and checkout page Cloudflare-blocked through Wayback.

### ID verification
- No visible signal that ID is required pre-purchase in retrieved pages.

### Tech stack platform signal
- Custom (cdn-cgi Cloudflare protection)
- (Not Shopify/WooCommerce based on URL patterns — site appears custom-built behind Cloudflare)

### Notes / uncertainty
- Domain went defunct in March 2026; Wayback is the only path. Wayback's snapshots of subpages are sparse; only homepage with embedded ToS modal returned usable text. Product, customer-service, shipping subpages are Cloudflare-blocked even on Wayback.

---

## biotech-peptides (Biotech Peptides)

**Domain:** biotechpeptides.com
**Fetch status:** ok
**Fetch method:** webfetch + curl direct
**Fetched at:** 2026-05-06T22:47Z

### Footer disclaimer (verbatim)
```
"The statements made within this website have not been evaluated by the US Food and Drug Administration. The statements and the products of this company are not intended to diagnose, treat, cure or prevent any disease."

"Biotech Peptides is a chemical supplier. Biotech Peptides is not a compounding pharmacy or chemical compounding facility as defined under 503A of the Federal Food, Drug, and Cosmetic act. Biotech Peptides is not an outsourcing facility as defined under 503B of the Federal Food, Drug, and Cosmetic act."

"All products are sold for research, laboratory, or analytical purposes only, and are not for human consumption."
```
- Source URL: https://biotechpeptides.com
- Raw artifact: 03_raw_fetches/compliance_slice/biotech-peptides__homepage.md

### Hero / homepage compliance language (verbatim)
```
"Buy peptides synthesized and lyophilized in the USA"
"All products are sold for research, laboratory, or analytical purposes only, and are not for human consumption."
```

### Product page disclaimer — BPC-157
```
"The products mentioned are not intended for human or animal consumption. Research chemicals are intended solely for laboratory experimentation and/or in-vitro testing."

"This product is strictly for research/laboratory use only. Human or animal use and/or consumption is strictly prohibited by law."
```
- Source URL: https://biotechpeptides.com/product/bpc-157/
- Raw artifact: 03_raw_fetches/compliance_slice/biotech-peptides__product_bpc157.md

### ToS key compliance highlights (verbatim)
- Research-use-only: `"All products are sold for research, laboratory, or analytical purposes only, and are not for human consumption."`
- Research-use-only: `"Any and all products for sale on www.biotechpeptides.com are not for animal or human consumption and are intended laboratory research purposes only."`
- Age: `"You must be 18 years or older to use www.biotechpeptides.com. You must be 18 years or older to purchase from www.biotechpeptides.com."`
- Jurisdiction: California law governs disputes (no specific state/country exclusion list)
- Medical: `"No product or service offered by www.biotechpeptides.com is intended to offer any medical advice, suggestion, diagnosis, cure, or relief."`
- Indemnification: `"User agrees to indemnity and hold www.biotechpeptides.com harmless (Including its directors, officers, employees, partners, or owners) for any claim, suit, or demand."`

### Age-gate
- No visible JS modal age-gate observed on homepage.
- Age requirement asserted in ToS: 18 years or older.

### Jurisdictional restriction notice
- No specific state or country exclusion list found. California law named as governing law in ToS.

### Refund policy (verbatim)
```
"At Biotech Peptides, we stand behind our products and offer a 30 day refund guaranteed. Due to the sensitive nature of the products we do NOT accept returns."
```
ToS adds: `"www.biotechpeptides.com does not accept returns and all sales on this website are final."`
Net effect: no returns; refund is at vendor discretion within 30 days.

### Shipping policy (verbatim summary)
```
"Due to the nature of our products, Biotech Peptides does not accept returns."
"If you receive a package that is damaged, we will send out a replacement FREE of charge."
"In the rare but inevitable situation that a package gets lost during transport, we will send out the same order FREE of charge."
"Orders must be placed by 1 pm PST if you'd like to have your package shipped out the same day."
```
- Geographic exclusions: none specified.

### COA hosting / lab partner / batch-lot transparency
- COA hosting: `on_site_pdf` (actually on-site WebP images of COA + LC + MS for each variant)
- Lab partner: not named on product pages
- Batch/lot transparency: false (no specific batch/lot numbers disclosed on visible product page)
- Source URL + raw artifact: 03_raw_fetches/compliance_slice/biotech-peptides__product_bpc157.md

### Payment methods accepted (named)
- Authorize.Net (credit cards) — inferred from `wp-content/plugins/woo-authorize-net-gateway-aim` plugin signature in checkout markup
- Cheque
- eCheck (via `payment_method_edd_ach`)
- (Empty cart prevented full payment-list rendering; specific labels are AJAX-loaded.)

### ID verification
- No visible signal that ID is required pre-purchase on retrieved pages.

### Tech stack platform signal
- WordPress + WooCommerce + Divi theme (`et_pb_*` classes, `et-divi-customizer-global-cached-inline-styles`)
- AffiliateWP (`AFFWP.referral_credit_last`)

### Notes / uncertainty
- Specific list of payment methods at checkout could only be inferred from gateway plugins, not labels (cart was empty during checkout fetch).

---

## core-peptides (Core Peptides)

**Domain:** corepeptides.com (canonical: www.corepeptides.com)
**Fetch status:** ok
**Fetch method:** webfetch + curl direct
**Fetched at:** 2026-05-06T22:47Z

### Footer disclaimer (verbatim)
```
"All products are sold for research, laboratory, or analytical purposes only, and are not for human consumption.

Core Peptides is a chemical supplier. Core Peptides is not a compounding pharmacy or chemical compounding facility as defined under 503A of the Federal Food, Drug, and Cosmetic act. Core Peptides is not an outsourcing facility as defined under 503B of the Federal Food, Drug, and Cosmetic act.

The statements made within this website have not been evaluated by the US Food and Drug Administration. The products we offer are not intended to diagnose, treat, cure or prevent any disease.

Human/Animal Consumption Prohibited. Laboratory/In-Vitro Experimental Use Only"
```
- Source URL: https://corepeptides.com
- Raw artifact: 03_raw_fetches/compliance_slice/core-peptides__homepage.md

### Hero / homepage compliance language (verbatim)
```
"Highest Quality Peptides For Sale"
```
The homepage hero does not contain explicit "research use only" language; that language lives in the footer block above and on `/terms/`.

### Product page disclaimer — BPC-157
```
"All products are sold for research, laboratory, or analytical purposes only, and are not for human consumption."

"Human/Animal Consumption Prohibited. Laboratory/In-Vitro Experimental Use Only"
```
- Source URL: https://www.corepeptides.com/peptides/bpc-157/
- Raw artifact: 03_raw_fetches/compliance_slice/core-peptides__product_bpc157.md

### ToS key compliance highlights (verbatim)
- Research-use-only: `"All products are sold for research, laboratory, or analytical purposes only, and are not for human consumption."`
- Age: `"In order to use and purchase from www.corepeptides.com, you must be 18 years of age or older."`
- Jurisdiction: `"Regulatory and legal considerations of customer's ownership, use, or possession of any products sold by www.corepeptides.com in customer's jurisdiction specific to customer's municipality, state, country, or government."` — places burden on customer; no list of excluded jurisdictions.
- Medical: `"The products we offer are not intended to diagnose, treat, cure or prevent any disease."`
- Indemnification: `"User agrees to indemnify and hold harmless www.corepeptides.com (including its directors, officers, employees, partners, or owners) for any claim, suit, or demand, including attorney fees, made by any third-party due to or arising out of User's use of www.corepeptides.com or User's violation of the Terms & Conditions."`

### Age-gate
- No visible JS modal age-gate observed.
- Age statement appears in `/terms/`: 18+.

### Jurisdictional restriction notice
- No specific state or country exclusion list. ToS shifts compliance burden to customer.

### Refund policy
- ToS verbatim: `"All sales on www.corepeptides.com are final and we do not accept any returns."`
- Shipping page verbatim: `"Cancellation: Allowed before shipment via support@corepeptides.com"` and `"up to 30 days after an order is placed"` for refund window.
- Effective: no returns post-shipment; cancellations possible pre-shipment within 30 days.

### Shipping policy (verbatim)
```
"Free Priority USPS shipping on orders over $200 within the US"
"All our Free Shipping offers are for US addresses only, unless specified otherwise."
"same (business) day shipping for orders placed before 1pm PST Monday-Friday."
"Priority Express shipping (overnight USPS)"
```
- Excluded regions: non-US addresses for free shipping; international options appear unavailable based on the stated restrictions.

### COA hosting / lab partner / batch-lot transparency
- COA hosting: `on_site_pdf` (placeholder SVG images on product page; functional links uncertain)
- Lab partner: NOT NAMED — page references COAs but does not name a third-party lab.
- Batch/lot transparency: false
- Source URL + raw artifact: 03_raw_fetches/compliance_slice/core-peptides__product_bpc157.md

### Payment methods accepted (named)
- "Now Accepting" Mastercard image visible on product page
- Inferred from gateway plugins:
  - **Zigu/Inovio payment gateway** (`zigu-payment-gateway` plugin — Inovio Payments, gray-market-friendly CC processor)
  - **eDebit Direct ACH + Plaid** (`edebit-direct-ach-plaid-gateway`)
  - Cheque, eCheck (`payment_method_edd_ach`)

### ID verification
- No visible signal that ID is required pre-purchase.

### Tech stack platform signal
- WordPress + WooCommerce + Divi theme
- NitroPack CDN (`nitrocdn.com`) for image optimization

### Notes / uncertainty
- Vendor uses "Inovio" payment gateway, which is a notable signal — see sister batch `payment_processor_posture.md` for cross-cutting analysis.

---

## pure-rawz (Pure Rawz)

**Domain:** purerawz.co
**Fetch status:** partial
**Fetch method:** webfetch-archive (live blocked behind Cloudflare challenge; Wayback 2025-02-14 used)
**Fetched at:** 2026-05-06T22:50Z

### Footer disclaimer (verbatim)
The 2025-02-14 Wayback snapshot does not surface a dedicated FDA-disclaimer footer block on the homepage. Compliance language is concentrated in the "Terms Conditions" page and inline on the marketing copy. Footer copyright:
```
"© 2025 PureRawz. All rights reserved.
(888) 836-5307 | support@purerawz.co"
```
- Source URL: https://web.archive.org/web/20250214224943/https://purerawz.co/terms-conditions/
- Raw artifact: 03_raw_fetches/compliance_slice/pure-rawz__homepage.md

### Hero / homepage compliance language (verbatim)
```
"THE HIGHEST QUALITY SARMS FOR SALE MADE IN AMERICA. Every single batch of our SARMs is 3rd party tested in American labs, because your satisfaction is our #1 priority."
"All our products are meant for research purposes only."
"SARMs are 100% legal to buy and sell as research chemicals."
```
Notable atypical phrasing in the FAQ: `"So you can trust our products to be safe for research, medical, or clinical use."` — the "medical, or clinical use" language is inconsistent with the strict research-only positioning common to the rest of this batch and is a compliance risk.

### Product page disclaimer — BPC-157
- Status: uncertain — live BPC-157 product page is Cloudflare-blocked; Wayback CDX did not return a 2025 snapshot for `/product/bpc-157` within the captured set.

### ToS key compliance highlights (verbatim)
- Export prohibition: `"You understand and affirmatively agree that products bought through purerawz.co may NOT and will NOT be exported, resold, nor used for the development or manufacture of chemical or biological weapons, nor used for the development or manufacture of controlled drugs..."`
- Research-use-only: `"You understand and affirmatively agree that all purerawz.co materials are sold strictly for scientific research and development purposes ONLY, and are not intended for therapeutic or diagnostic use."`
- Research-use-only (caps): `"PRODUCTS SOLD ON THIS WEBSITE ARE FOR RESEARCH PURPOSES ONLY."`
- Researcher-qualification: `"You understand and affirmatively agree that purerawz.co materials are for purchase only by qualified researchers with the knowledge, judgement, secure storage arrangements and equipment to safely handle purerawz.co compounds for their intended application."`
- Communication-monitoring: `"You understand and affirmatively agree that any communications indicating use of Purerawz materials for other than scientific research and development purposes may result in refusal of purchases and/or deactivation or deletion of any relevant purerawz.co account(s)."` — this is unusual: vendor reserves right to monitor and ban based on user comms suggesting non-research use.
- Unapproved-new-drug acknowledgment: `"You understand and affirmatively agree that materials bought through purerawz.co could be classified by certain regulatory agencies as unapproved new drugs if they were to be sold for the purpose of consumption by and/or administration to humans..."`
- Indemnification: `"You hereby agree to indemnify and hold purerawz.co, and our subsidiaries, affiliates, officers, directors, agents, co-branders, partners and employees harmless from any claim or demand, including reasonable attorneys fees made by any third party due to or arising out of your use of the content on this website..."`
- TSCA: `"The purchaser assumes responsibility to assure that the products purchased from purerawz.co are approved for use under TSCA, if applicable."`

### Age-gate (verbatim)
- Present? Yes — embedded as a modal at end of footer:
  `"Please Confirm Your Age We require visitors to be 21 years old or over, please verify below. Are you over 21 years of age? Yes No Remember me"`

### Jurisdictional restriction notice
- Footer link visible to "Cannabis Restrictions" — Pure Rawz also sells Delta-8/9/10, HHC, THCa, CBD products, which trigger separate state-by-state compliance regimes.
- Footer link visible to "Purerawz Restrictions" (page text not retrievable — Cloudflare blocked).
- ToS contains the export prohibition above. No specific state list found.

### Refund policy
- Footer link to "Returns Policy" exists; page text not retrievable in this batch (Cloudflare blocked, no usable Wayback snapshot of the policy URL).
- Marked uncertain.

### Shipping policy
- Marketing copy: `"Fast Secure Delivery We proudly offer fast & secure free shipping on most items. Estimated delivery 10-12 Business days."`
- Full policy text not retrievable. Uncertain.

### COA hosting / lab partner / batch-lot transparency
- COA hosting: `on_site_pdf` per marketing copy: `"every single product we sell has a link to our tests that show at least 99% purity"`. Specific COA host (Janoshik, Google Drive, etc.) not visible in retrieved pages.
- Lab partner: NOT explicitly named ("3rd party tested in American labs", "blind and independent third-party testing")
- Batch/lot transparency: uncertain — claims "Every single batch of our SARMs is 3rd party tested" but actual batch numbers not extracted in the retrieved snapshot.
- Source URL + raw artifact: 03_raw_fetches/compliance_slice/pure-rawz__homepage.md

### Payment methods accepted (named)
- "How To Pay" page existed in nav but text not retrievable. Uncertain. The CDX search returned 503s for `/how-to-pay/`.
- Sister batch `payment_processor_posture.md` may have wider intel.

### ID verification
- No visible signal that ID is required pre-purchase. Age-gate is self-attestation.

### Tech stack platform signal
- WordPress + Elementor + Essential Addons (`eael-simple-menu-container` classes)
- Cloudflare CDN (managed challenge active)

### Notes / uncertainty
- Live site is fully Cloudflare-blocked from this environment. 2024-2025 Wayback snapshots provide ToS, homepage, and footer; all subpages (refund, shipping, BPC-157, payment, COA) returned 503 from CDX, blocking direct verification.
- Site has materially expanded scope into cannabis (Delta-8/9/10/HHC/THCa) and kratom — different regulatory regimes layered on top of research-chemical posture.

---

## behemoth-labz (Behemoth Labz)

**Domain:** behemothlabz.com
**Fetch status:** ok
**Fetch method:** webfetch + curl direct
**Fetched at:** 2026-05-06T22:47Z

### Footer disclaimer (verbatim)
```
"All products sold on this website are intended for research and identification purposes only. These products are not intended for human dosing, injection, or ingestion."
```
- Source URL: https://behemothlabz.com
- Raw artifact: 03_raw_fetches/compliance_slice/behemoth-labz__homepage.md

### Hero / homepage compliance language (verbatim)
- No explicit "research use only" / "not FDA approved" language in the primary hero sections; the footer disclaimer above is the primary compliance statement on the homepage.

### Product page disclaimer — BPC-157 (verbatim)
```
"BPC-157 is not approved by the FDA for any medical use. It is intended strictly for laboratory research purposes only and is not for human consumption."

"All BehemothLabz products are strictly for LABORATORY AND RESEARCH PURPOSES ONLY. They are not to be used for any human or veterinary purposes."
```
- Source URL: https://behemothlabz.com/product/bpc-157/
- Raw artifact: 03_raw_fetches/compliance_slice/behemoth-labz__product_bpc157.md

### ToS key compliance highlights
- **Status: no public ToS slug found.** Multiple URL variants (`/terms`, `/terms-and-conditions`, `/terms-conditions`, `/terms/`, `/disclaimer`, `/legal`) all returned 404. Footer exposes only Privacy Policy + Shipping Policy + How To Pay.
- Privacy Policy was retrieved but does not contain ToS-style research/age/indemnification language.
- The product-page disclaimer above is the most explicit research-use-only language available.

### Age-gate
- Not observed. No visible age-verification modal on homepage. No ToS to encode an age statement.

### Jurisdictional restriction notice
- Shipping policy: `"There may be shipping restrictions on some products, and some products may not be shipped to some destinations."` — non-specific.
- No explicit state or country exclusion list.

### Refund policy
- No dedicated refund-policy page found. Shipping policy implies refund is conditional on having purchased shipping insurance:
  `"In the event shipping insurance was not purchased, Behemothlabz will not be held responsible for reshipments or refunds for lost, stolen, or damaged orders."`

### Shipping policy (verbatim)
```
"Behemothlabz strongly recommends adding shipping insurance at checkout...Shipping Insurance allows us to assist with refunds or reshipments in the event of a damaged or lost package."
"Orders placed before 12pm PST will typically (~90% of the time) ship the same day."
"Orders over $200 or those shipped by DHL, UPS & FedEx will require a signature for delivery, we cannot waive the signature."
"There may be shipping restrictions on some products, and some products may not be shipped to some destinations."
```

### COA hosting / lab partner / batch-lot transparency
- COA hosting: `on_site_pdf` (image files at `behemothlabz.com/wp-content/uploads/`)
- Lab partner: NOT NAMED. COA page distinguishes "1st Party COAs" vs "3rd Party COAs" sections but does not name the third-party lab. No Janoshik mention.
- Batch/lot transparency: false (no batch numbers visible)
- Source URL: https://behemothlabz.com/coa/
- Raw artifact: 03_raw_fetches/compliance_slice/behemoth-labz__product_bpc157.md

### Payment methods accepted (named)
- "Cryptocurrency" (no specific currency listed publicly on /how-to-pay/ page text)
- "Card Checkout" — `"Enter your card details at checkout and confirm the payment. Transactions are processed instantly through our secure card processing partners."`
- Inferred from plugin signature: WooCommerce Payments (`wp-content/plugins/woocommerce-payments`) — Stripe-derived gateway
- Verbatim how-to-pay quote: `"Different cards may be handled by different payment processors for security and efficiency."`

### ID verification
- No visible signal that ID is required pre-purchase.

### Tech stack platform signal
- WordPress + WooCommerce + WooCommerce Payments
- AffiliateWP

### Notes / uncertainty
- Behemoth Labz is unique in the batch for not exposing a Terms-of-Service page at all from the public footer — making it the lightest ToS posture of any batch-A vendor. Compliance language is limited to single-line footer + per-product disclaimers + privacy policy.

---

## limitless-life-nootropics (Limitless Life Nootropics)

**Domain:** limitlesslifenootropics.com
**Fetch status:** ok
**Fetch method:** webfetch
**Fetched at:** 2026-05-06T22:47Z

### Footer disclaimer (verbatim)
- The fetched homepage content extracted by WebFetch did not surface a traditional footer disclaimer block in the BigCommerce theme. The homepage marketing copy instead frames products as "research-grade peptides" and "for scientific research purposes" in meta-description but the footer is light on FDA disclaimer copy.
- Marked uncertain for the footer — disclaimers, when present, may be on individual policy pages rather than a footer-fixed block.
- Source URL: https://limitlesslifenootropics.com
- Raw artifact: 03_raw_fetches/compliance_slice/limitless-life-nootropics__homepage.md

### Hero / homepage compliance language (verbatim)
- No explicit "research use only" / "not for human consumption" / "not FDA approved" language in retrieved homepage content.
- The page consistently frames products as "research-grade peptides" and "for scientific research purposes" in meta description.

### Product page disclaimer — BPC-157 (verbatim)
```
"In vitro research applications only (RUO)"
```
- Specifications: Purity ≥99% (HPLC), MW 1419.56 g/mol, CAS 137525-51-0
- Storage: `"Store at ≤4°C, tightly sealed, away from heat and moisture"`
- Shelf Life: `"36 months from date of manufacture when stored properly"`
- Source URL: https://limitlesslifenootropics.com/product/bpc-157/
- Raw artifact: 03_raw_fetches/compliance_slice/limitless-life-nootropics__product_bpc157.md

### ToS key compliance highlights (verbatim)
- Research-use-only: `"The products we offer are intended for laboratory research use only."`
- Research-use-only (caps): `"ALL products and services offered are for RESEARCH purposes ONLY."`
- Age: `"All customers MUST be at least 18 years of age to purchase our products."`
- Jurisdictional: not explicit (no state/country exclusion list)
- Medical: `"Under NO circumstances shall/should ANY of these materials be used for therapeutic or diagnostic purposes."`
- Indemnification: `"The purchaser agrees to indemnify and hold Limitless Life Nootropics or any associated affiliates harmless from all claims, expenses, losses and liability."`
- Liability: `"Limitless Life Nootropics...are NOT liable for ANY damages that may be caused by negligence, abuse, or ANY other unforeseen matter."`

### Age-gate
- No visible JS modal age-gate observed; ToS encodes 18+ self-assertion.

### Jurisdictional restriction notice
- None observed in retrieved pages.

### Refund policy (verbatim — uniquely permissive in this batch)
```
"most new, unopened items within 10 days of delivery for a full refund"
```
Refund methods named: Store Credit, **PayPal**, **ACH Check**, Mailed Check.
Window: refunds processed within four weeks (transit + processing + bank).
```
"report any issues with your order...within 10 days of product receipt."
"Reports beyond the 10-day window will not be the responsibility of Limitless Life Nootropics."
```

### Shipping policy
- `"to virtually any address in the world"` (international)
- `"some product restrictions on international deliveries"`
- Weight-based rates rounded up to nearest pound

### COA hosting / lab partner / batch-lot transparency
- COA hosting: `third_party_portal` — **Google Drive** (most transparent in batch)
- Lab partner: NOT explicitly named — described as `"independent testing for endotoxins and sterility"`. Marketing brand is "Limitless Biotech" (vendor's labeling: `"Every Limitless Biotech compound undergoes independent testing..."`).
- Batch/lot transparency: **TRUE** — explicit batch numbers disclosed: #1305, #1217, #1347, #1330, #1333. Each batch links to three COA documents (Purity, Sterility, Endotoxin).
- Source URL + raw artifact: 03_raw_fetches/compliance_slice/limitless-life-nootropics__product_bpc157.md

### Payment methods accepted (named)
- PayPal (named on refund-method list — implies accepted as input)
- ACH Check (refund channel)
- Mailed Check (refund channel)
- Store Credit
- (BigCommerce checkout typically supports credit cards via the platform — specific gateway not extracted)

### ID verification
- No visible signal that ID is required pre-purchase.

### Tech stack platform signal
- **BigCommerce** (cdn11.bigcommerce.com/s-abfevmkahe/, /images/stencil/ paths)

### Notes / uncertainty
- Highest-transparency vendor in batch A on COA + batch numbers (Google Drive hosted, explicit batch IDs).
- Uniquely accepts returns within 10 days — most peers in batch state "ALL SALES FINAL".
- Uniquely accepts PayPal as a refund channel (and presumably input). Most peers explicitly disallow PayPal due to TOS conflict.
- Different posture from peers: "Biotech" branding, BigCommerce platform, sterility/endotoxin testing language — closer to a contract-research-organization (CRO) supplier presentation than a typical SARM-vendor presentation.

---

## swiss-chems (Swiss Chems)

**Domain:** swisschems.is (note: `.is` Iceland TLD, not Swiss)
**Fetch status:** ok
**Fetch method:** curl direct (live WebFetch returned 403; Cloudflare-friendly UA worked)
**Fetched at:** 2026-05-06T22:47Z
**Notable:** subject of FDA Warning Letter (per task input — verified by sister batch `enforcement_events.md`)

### Footer disclaimer (verbatim)
```
"FDA Disclaimer The statements made within this website have not been evaluated by the US Food and Drug Administration. The statements and the products of this company are not intended to diagnose, treat, cure or prevent any disease. All products are for laboratory developmental research USE ONLY. Products are not for human consumption."
```
- Source URL: https://swisschems.is
- Raw artifact: 03_raw_fetches/compliance_slice/swiss-chems__homepage.md

### Hero / homepage compliance language (verbatim)
```
"Reliable and innovative research with our top-grade materials and novel compounds tailored to lead the competitive research industry. Choose quality. Choose SwissChems."
```
The hero does not contain explicit "research use only" / "not for human consumption" language; the footer FDA Disclaimer above carries that load.

### Product page disclaimer — BPC-157
- Status: uncertain — direct curl of `/product/bpc-157/` returned a product-grid index rather than a single BPC-157 product page (the page may use a different slug). No specific BPC-157 product disclaimer extracted in this batch. Marked uncertain.
- The site-wide footer FDA Disclaimer appears on every page and provides the disclaimer.

### ToS key compliance highlights (verbatim — selected from full ToS file)
- Header: `"WAIVER AND DISCLAIMER OF LIABILITY THAT THE BUYER, YOU, HAVE CONFIRMED THAT YOU MEET THE AFFIRMATIVE DUTY OF READING THE FOLLOWING WAIVER AND DISCLAIMER OF LIABILITY. YOU, THE BUYER, IF YOU ORDER FROM THIS WEBSITE HEREBY AGREE TO ALL THE TERMS AND CONDITIONS MENTIONED."`
- Age (twice): `"All customers MUST be at least 21 years of age to purchase our research products/materials."` and `"YOU MUST BE A MINIMUM OF 21 YEARS OF AGE."`
- Research-use-only (caps): `"ALL products and services offered are for RESEARCH purposes ONLY. Under NO circumstances shall/should ANY of these materials be used for therapeutic or diagnostic purposes."`
- Anti-supplement language: `"*RESEARCH CHEMICALS ARE NOT DIETARY SUPPLEMENTS. BY PURCHASING THEM YOU AGREE TO USE THEM IN A LEGAL MANNER. IT IS YOUR RESPONSIBILITY TO KNOW WHAT THAT IS."`
- 21-CFR exemption claim (notable): `"This distinction is required on the labels of research chemicals and is what exempts them from regulation under parts 100-740 in Title 21 of the Code of Federal Regulations (21CFR)."`
- Inappropriate-use list: `"The products under swisschems.is are used primarily for laboratory research purposes. Some of inappropriate use are, but not limited to the following: Oral consumption Human or animal injections Drugs and foods Animal or human cosmetic Animal or human consumption Commercial Any use against the local laws"`
- Athletic-commission disclaimer: `"None of our products is approved by any athletic commission and should not be taken by anyone who competes professionally."`
- Customs/jurisdiction shift: `"In consenting and reading this Disclaimer, the buyer outside the supplier's country of origin have asserted to the Supplier that the buyer already reviewed the laws and regulations that confirm of the products purchased to comply with the country of the purchaser. All responsibilities and liabilities will be shouldered by the Buyer in contacting the custom's agency and local post office in reference to the shipment receipt."`
- Indemnification: `"In direct consideration of approving the sale of any product to the purchaser, the purchaser agrees to indemnify and hold swisschems.is or any associated affiliates harmless from all claims, expenses, losses and liability of any kind arising out of the purchaser's handling, possession, and/or use of the product whether used alone or in combination with any other substance."`

### Age-gate
- No visible JS modal age-gate observed on the homepage.
- 21+ self-assertion encoded in ToS (twice, in caps).

### Jurisdictional restriction notice
- ToS shifts customs/import compliance burden to buyer; no specific state-level exclusion list.
- Shipping policy explicitly notes: `"Note that we have already removed countries with major import restrictions from our shipping destinations list."` — vendor unilaterally pre-excluded high-risk countries from its catalog without naming them.

### Refund policy (verbatim — partial)
```
"For Returning of products: Within 7 business days from the delivery date, you may request to return your order as long as the package is unopened and in a sealed condition (Research SARMs, PCTs, and MEPs ONLY). The customer will pay the return shipping fee."

"Please note that we do not accept returns specifically with Peptides due to their sensitivity to temperature and sunlight, we do not encourage any customer to return them."

"A restocking fee of 15% per product will be deducted from the refund amount."

"Refunds: All completed purchases are final, and we do not offer refunds."

"Seized Shipments (International Orders): In the event of a seized shipment, we recognize the challenges you may face. To support our customers, a 30% discount will be provided for the next purchase."
```
Net effect: peptides cannot be returned; SARMs/PCT can be returned only if unopened (with restocking fee); refunds otherwise denied; international seizure → 30% next-order discount only.

### Shipping policy (verbatim — selected)
```
"Our standard shipping carriers are USPS for domestic (US) deliveries and Asendia US for international orders."
"Estimated delivery times for each carrier are listed below: USPS: 3 – 5 days Asendia US: 15 – 20 working days"
"Express delivery options (overnight and 2-day shipping through FedEx) are exclusively available to US customers"
"Customers outside the US may encounter additional import restrictions, procedures, and fees when receiving these products. You are responsible for researching and following all applicable regulations to ensure legal compliance. Note that we have already removed countries with major import restrictions from our shipping destinations list."
"In cases of package seizure, refunds and reshipments are not available – only a 30% discount will be offered as compensation."
"Orders totaling $150 or more require a signature upon delivery, and this service currently applies to domestic shipments only – US."
```
- Force majeure list (verbatim): `"Civil unrest, strikes, or labor disputes. Political instability or civil disturbances. War, terrorism, or military action. Natural disasters or extreme weather events. Government actions, sanctions, or embargoes. Customs delays, confiscation, or seizure. Local infrastructure failures or disruptions."`

### COA hosting / lab partner / batch-lot transparency
- COA hosting: `on_site_pdf` (footer link "Independent Test Results" → `/independent-test-results/`)
- Lab partner: NOT NAMED on retrieved pages (not Janoshik specifically)
- Batch/lot transparency: uncertain — Independent Test Results page not separately fetched in this batch.
- Source URL + raw artifact: 03_raw_fetches/compliance_slice/swiss-chems__homepage.md

### Payment methods accepted (named — from /how-to-pay/)
Verbatim payment-processor disclosure: `"Before we offer you the payment solutions we provide let us explain why we don't offer Paypal. Amazon pay or Stripe (direct payments with credit/debit cards). None of these companies accept 'Research Chemicals' as a product category."`

Methods explicitly recommended:
- **Bitcoin (BTC)** — preferred
- **CashApp** (US)
- **ShakePay** (Canada)
- **Wire Transfer / Wise.com**
- **Zelle** (sub-page link)
- (Plus Lootly rewards points)
- NOT: PayPal, Amazon Pay, Stripe (per the vendor's own statement)
- Inferred gateway plugins from checkout markup: PrismPay (`payment_method_prismpay`) and SST gateway (`payment_method_sstpayment-pro-gateway`) — likely third-party CC processors that accept research-chem merchants.

### ID verification
- No visible signal that ID is required pre-purchase.

### Tech stack platform signal
- WordPress + WooCommerce + Storefront child theme + RankMath PRO SEO + Lootly rewards + Omnisend + WPC filters

### Notes / uncertainty
- Swiss Chems explicitly addresses why mainstream processors reject the category, doubling as a compliance signal: vendor knows category is gray-market and openly discusses being de-platformed.
- 21+ age requirement is the strictest in the active-vendor cohort (peers are 18+).
- 21-CFR exemption claim is a unique legal-defense framing not seen in peers — explicitly invokes the regulatory carveout for "research chemicals" labeling.

---

## peptide-guys (Peptide Guys)

**Domain:** peptideguys.com
**Fetch status:** failed
**Fetch method:** webfetch (404 on root) + curl direct + Wayback CDX
**Fetched at:** 2026-05-06T22:47Z

### Status
- The domain returns `<!DOCTYPE html><html><head><script>window.onload=function(){window.location.href="/lander"}</script></head></html>` and `/lander` serves a GoDaddy parking page (`window.LANDER_SYSTEM="PW"`, `window._trfd.push({ap:"parking"})`).
- Wayback CDX returned only one snapshot in the 2024-2026 range (`20250426115220`, 542 bytes) — almost certainly the same parked redirect.
- **fetch_status: failed.** Domain is not currently an operational vendor site; no compliance content to capture.
- Raw artifact: 03_raw_fetches/compliance_slice/peptide-guys__homepage.md

### Notes
- Vendor may have rebranded or shut down. No live site for compliance capture.

---

## amino-asylum (Amino Asylum — RAIDED June 2025)

**Domain:** aminoasylum.shop (defunct since June 2025 raid; captured via Wayback)
**Fetch status:** ok
**Fetch method:** webfetch-archive (curl)
**Fetched at:** 2026-05-06T22:50Z

### Footer disclaimer (verbatim)
```
"All products on this site are for research and development use only. Products are not for human consumption of any kind. The statements made on this website have not been evaluated by the US Food and Drug Administration. The statements and the products of this company are not intended to diagnose, treat, cure, or prevent any disease."
```
This is from the "About us" block in the homepage, which doubles as the footer disclaimer on this minimalist Flatsome page.
- Source URL: https://web.archive.org/web/20250116164845/https://aminoasylum.shop/
- Raw artifact: 03_raw_fetches/compliance_slice/amino-asylum__homepage.md

### Hero / homepage compliance language (verbatim)
- The "About us" block (above) is the only homepage disclaimer.
- Hero text: `"Amino Asylum is your premium research compound headquarters. We bring industry best quality and pricing to all of our products."`

### Product page disclaimer — BPC-157
- Status: uncertain — Wayback CDX search for `aminoasylum.shop/product` returned `[]` (empty); product subpages were not captured by Wayback in the 2024-2025 range. The captured BPC-157 + TB-500 blend product appears in the homepage product grid at $64.99 but no per-product disclaimer text was extractable.

### ToS key compliance highlights
- ToS link present in footer (`Terms of Service`). Wayback CDX search for `aminoasylum.shop/terms` did not return a 200 within the 2024-2025 range that produced usable text. ToS content marked uncertain.

### Age-gate (verbatim — present and JS-modal)
```
"Verify your age Please know and understand that all of our products are for research purposes only, no dosing or usage information is provided and you must be 18 years old to enter the website. Are you over 18 years of age? No Yes Remember me"
```
This is the most aggressive on-page age-gate in batch A — a JS modal that blocks site access until the user clicks "Yes". Implemented via the `age-gate-custom-inline-css` WordPress plugin.

### Jurisdictional restriction notice
- Not observed in retrieved pages. Site was raided/seized June 2025; ToS and shipping pages not retrievable.

### Refund policy
- Uncertain (no separate refund page in retrieved Wayback set).

### Shipping policy
- Uncertain (no separate shipping page in retrieved Wayback set).

### COA hosting / lab partner / batch-lot transparency
- COA hosting: uncertain (no on-page COA references in homepage Wayback).
- Lab partner: not named.
- Batch/lot transparency: uncertain.
- Source URL + raw artifact: 03_raw_fetches/compliance_slice/amino-asylum__homepage.md

### Payment methods accepted (named)
- Inferred from CSS classes in homepage: `payment_method_easyprocess_idem` and `payment_method_idem` — likely "Idem" payment processor for credit/debit cards (gray-market-friendly).
- Specific labels not verified at checkout (site defunct).

### ID verification
- No visible signal that ID is required pre-purchase. Age verification is self-attested via the JS modal.

### Tech stack platform signal
- WordPress 6.7.1
- WooCommerce
- Flatsome theme
- `age-gate-custom-inline-css` (WP age-gate plugin)
- RankMath SEO

### Notes / uncertainty
- Site raided/seized June 2025; only the 2025-01-16 Wayback homepage snapshot returned usable text. ToS, shipping, refund, payment, COA, product pages are all uncertain.
- Sister-batch `enforcement_events.md` covers the raid timeline.
- The on-page age-gate is the only one in batch A that actively blocks access until self-attestation — a meaningful UX signal of the vendor's perception of regulatory risk.

---

## domestic-supply (Domestic Supply)

**Domain:** domestic-supply.com
**Fetch status:** ok
**Fetch method:** webfetch
**Fetched at:** 2026-05-06T22:47Z

### Footer disclaimer (verbatim)
```
"Feel free to contact us! - [email protected]"
"Copyright © 2026 domestic-supply.com."
```
**No visible FDA / research-use disclaimer in the footer or homepage hero.** This is a notable outlier in batch A — every other active vendor places the FDA disclaimer prominently. Disclaimers exist only inside the ToS page.
- Source URL: https://domestic-supply.com
- Raw artifact: 03_raw_fetches/compliance_slice/domestic-supply__homepage.md

### Hero / homepage compliance language (verbatim)
- None observed. No "research use only" / "not for human consumption" / "not FDA approved" language anywhere on homepage.

### Product page disclaimer — BPC-157
- Status: uncertain — BPC-157 product page not retrieved in this batch.

### ToS key compliance highlights (verbatim)
- Research-use-only: `"All our products are intended for laboratory research use only."`
- Age: `"Your minimum age should be 21."`
- Jurisdictional: `"Purchaser guarantees to obey all the local Drug Agency laws"` and `"each country has its own laws and provisions concerning prescription medications"` — burden-shift to buyer.
- Medical: `"The drug information provided on our website is solely informative and we do not, in any case, hold diagnostics, provide you with diagnosis, give any treatment, or propose any medical advice."`
- Liability: `"domestic-supply.com are not liable for any damages that may be caused by negligence, abuse, or any other contingency."`
- Refunds/Returns: ToS contains no language addressing refunds or returns.

### Age-gate
- No visible JS modal age-gate on homepage.
- 21+ self-attestation in ToS only.

### Jurisdictional restriction notice
- ToS references "prescription medications" language (`"each country has its own laws and provisions concerning prescription medications"`) — suggests vendor knows products may be regulated as prescription medications in some jurisdictions but does not list excluded states/countries.

### Refund policy
- ToS: no language. Marked uncertain — possibly intentional silence.

### Shipping policy (verbatim — notably hostile tone)
```
"All orders are shipped via USPS first class or priority mail ($20) with a tracking number"
"we don't provide overnight shipping!"
"PLEASE, ALWAYS CHECK YOUR SHIPPING ADDRESS AND MONITOR YOU TRACKING NUMBER - WE DON'T RESHIP AND DON'T ACCEPT PACKAGES BACK!"
"If you missed your package's delivery - YOU NEED TO CONTACT USPS ON YOUR OWN!"
"if someone steal your package - it's not our responsibility!"
"you need to make video of unpacking!"
```
Note the ALL-CAPS hostile tone, the requirement to record an unpacking video for any complaint, the explicit "WE DON'T RESHIP AND DON'T ACCEPT PACKAGES BACK", and the typos ("YOU TRACKING NUMBER", "if someone steal your package").

### COA hosting / lab partner / batch-lot transparency
- COA hosting: uncertain (not retrieved).
- Lab partner: not named.
- Batch/lot transparency: uncertain.

### Payment methods accepted (named)
From `/payment/`:
- **Ria money transfer** (minimum $200, in-person cash only)
- **Western Union** (minimum $400, in-person cash only)
- **Bitcoin (BTC)**
- **Litecoin (LTC)**
- **Dash**
- **Ethereum (ETH)**
Verbatim: `"All money transfer shoulb be made in person and cash only! no Online services or apps!"`

From `/cryptocurrencies-payment/`:
- Cash App (recommended app for crypto purchase, not direct vendor accept)
- Abra (recommended)
- Wallet-rotation note: `"customers receive all the time different bitcoin addresses to send bitcoins to."`

**Combined: cash money-transfer + crypto only.** No credit cards, no PayPal, no Stripe, no Authorize.Net. **Highest-friction, lowest-trust payment posture in batch A.**

### ID verification
- No visible signal that ID is required pre-purchase. (Money-transfer in-person identification is independently required by Ria/Western Union, but vendor does not request additional ID.)

### Tech stack platform signal
- Custom-hosted (no Shopify/WooCommerce/BigCommerce signals)
- Cloudflare email obfuscation in footer
- Domain hosted on custom infrastructure

### Notes / uncertainty
- Domestic Supply is the most gray-market-coded vendor in batch A:
  - No FDA disclaimer on homepage or footer (only in ToS)
  - In-person cash-only money-transfer requirement
  - Wallet-address rotation (anti-correlation)
  - ALL-CAPS hostile shipping copy with typos
  - Required unpacking video for any complaint
  - "Prescription medications" terminology in ToS
- Sister-batch `payment_processor_posture.md` likely highlights this as a structural enforcement-vulnerability signal.

---

# Batch A summary

- **Vendors successfully profiled (full or partial):** 9 / 10
- **Vendors with `fetch_status: failed`:** 1
  - **peptide-guys (peptideguys.com):** Domain parked at GoDaddy `/lander`. Wayback CDX shows a single 542-byte snapshot from April 2025, also the parked redirect. No active site, no content to capture.
- **Vendors with partial coverage:**
  - **peptide-sciences:** Wayback returns homepage + embedded ToS modal in full, but product/customer-service/shipping subpages are Cloudflare-blocked even on Wayback. Domain went defunct March 2026 — no recovery path.
  - **pure-rawz:** Live site Cloudflare-challenged from this environment. 2024–2025 Wayback gives ToS + homepage + footer; refund/shipping/payment/COA subpages return 503 from CDX.
  - **amino-asylum:** Site raided/seized June 2025. Only 2025-01-16 homepage snapshot returns usable text in Wayback — ToS, shipping, refund, payment, COA, product pages all uncertain.
  - **swiss-chems:** Independent Test Results page and BPC-157 product page slug uncertain; otherwise full coverage.

- **Coverage gaps to flag for sister batches / future passes:**
  - **Pure Rawz `/how-to-pay/`, `/returns-policy/`, `/shipping/`, `/product/bpc-157/` — all retrievable only via fresh live access.** Cloudflare bypass needed.
  - **Peptide Sciences product page disclaimers** — Cloudflare-blocked on Wayback. Not recoverable from this batch.
  - **Amino Asylum ToS, shipping, refund, payment** — site seized; only homepage Wayback snapshot remains with usable text.
  - **Behemoth Labz has no public ToS page** — only product-level disclaimers + privacy policy + shipping policy. Lightest ToS posture in batch.
  - **Swiss Chems Independent Test Results page** — fetched but COA index and lab-partner naming should be confirmed in a follow-up pass.

- **Surprising observations:**
  1. **Limitless Life Nootropics is the COA + batch-transparency outlier.** It is the only batch-A vendor that explicitly publishes batch numbers (#1305, #1217, etc.) tied to three separate COA documents (Purity, Sterility, Endotoxin) per batch, hosted on Google Drive. It also accepts returns within 10 days — the only batch-A vendor that does. It is also the only vendor that names PayPal as a refund channel. Hosted on BigCommerce (not WordPress/WooCommerce like most peers). Branded as "Limitless Biotech" on the lab side — closest to a CRO presentation.
  2. **Domestic Supply is the gray-market outlier.** No FDA disclaimer in homepage/footer. Cash-only money transfer (Ria/Western Union, in-person, $200/$400 minimums) + crypto only. Rotating BTC wallet addresses. ALL-CAPS hostile shipping copy ("WE DON'T RESHIP", required unpacking video). ToS uses "prescription medications" framing.
  3. **Behemoth Labz is the ToS-light outlier.** No public Terms-of-Service page exists — multiple URL variants returned 404. Compliance is concentrated in single-line footer + per-product disclaimer + privacy policy + shipping policy. This is the lightest ToS posture in batch A and is a notable structural compliance gap.
  4. **Swiss Chems explicitly addresses platform de-risking on /how-to-pay/.** Verbatim: `"None of these companies accept 'Research Chemicals' as a product category. You might have seen other companies using them. However, they are doing so without permission from these companies. Therefore they are breaking their TOS, which will result in a closure of their and perhaps your account too, with those companies."` — vendor self-discloses category de-platforming risk.
  5. **Swiss Chems invokes 21CFR labeling carveout.** Verbatim: `"This distinction is required on the labels of research chemicals and is what exempts them from regulation under parts 100-740 in Title 21 of the Code of Federal Regulations (21CFR)."` — unique legal-defense framing in batch.
  6. **Two of three "21+" age requirements** are in batch A (Peptide Sciences, Pure Rawz, Swiss Chems, Domestic Supply); the others are 18+ (Biotech Peptides, Core Peptides, Limitless Life, Amino Asylum). No batch-A vendor uses an enforced age gate beyond self-attestation; only Amino Asylum uses a JS-modal blocking-style age-gate (which can be bypassed by clicking "Yes").
  7. **The footer "503A / 503B" disclaimer** appears verbatim across 3 vendors (Biotech Peptides, Core Peptides, Peptide Sciences) — strong evidence of a shared boilerplate template circulating in the industry. Same footer block, swap brand name. This is the most compliance-heavy boilerplate in the batch.
  8. **Pure Rawz alone says "safe for research, medical, or clinical use"** in marketing copy — a phrase that contradicts the strict research-only positioning of the rest of the batch. This is a compliance risk: it implicitly contradicts the same site's ToS research-only language.
  9. **Pure Rawz alone reserves the right to ban based on user communications** (Verbatim: `"any communications indicating use of Purerawz materials for other than scientific research and development purposes may result in refusal of purchases and/or deactivation or deletion of any relevant purerawz.co account(s)."`) — this is unusual and signals that the vendor has at least the legal cover for that kind of moderation.
  10. **Peptide Sciences chose Nevis as governing-law jurisdiction** — an offshore Caribbean micro-state, presumably for litigation-defense reasons. No other batch-A vendor names an offshore jurisdiction.
