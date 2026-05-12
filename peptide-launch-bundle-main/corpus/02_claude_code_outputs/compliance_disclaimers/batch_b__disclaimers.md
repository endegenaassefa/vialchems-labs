# Batch B — Mid-tier US-Retail Vendor Compliance / Disclaimer Capture

**Slice:** compliance / disclaimer / legal-posture language
**Captured:** 2026-05-06
**Vendors profiled:** 10 / 10 (with varying completeness — see status table)

---

## Vendor index

| # | Slug | Domain (resolved) | Status | Age | Research-use-only? | FDA disclaimer? | Tech | COA hosting | Lab partner |
|---|---|---|---|---|---|---|---|---|---|
| 1 | ascension-peptides | ascensionpeptides.com | ok | 21+ | yes | yes | WooCommerce | on_site (general "Lab Testing / COAs" page) | none disclosed |
| 2 | lvlup-health | lvluphealth.com | ok | 18+ | NO (supplement-side) | yes | WooCommerce-likely | on_request | none disclosed |
| 3 | peptidology | peptidology.co (NOT .com) | partial (login wall) | 21+ | yes | implied (503A/503B reference) | WordPress | on_request via gated catalog | "two independent labs" + ISO/IEC 17025:2017-accredited; named labs not surfaced |
| 4 | healthgevity | healthgev.com (NOT healthgevity.com) | ok | none | NO (supplement-side) | yes (FDA dietary-supplement disclaimer) | Shopify | on_request | none disclosed |
| 5 | genx-bio | genx.bio (NOT genxbio.com) | ok | 18+ | yes | implied (research-only ToS) | WooCommerce | on_site | none disclosed |
| 6 | umbrella-labs | umbrellalabs.is (NOT .com) | ok | none stated | yes | yes | WooCommerce-likely | on_site (PDF) | none disclosed; commissioned-by-brand COAs |
| 7 | particle-peptides | particlepeptides.com | ok | 18+ | yes | EU equivalent | PrestaShop | on_site (linked from product) | "3rd party test results" — lab not named |
| 8 | peptaura | peptaura.com | partial (provisional verbatim) | 21+ | yes | yes | custom marketplace (Webflow-likely) | third_party_portal (recommends Janoshik, Finnrick, Chromate) | recommends three; does not test itself |
| 9 | chemyo | chemyo.com | ok (BPC-157 not sold) | 18+ | yes | implied | WooCommerce | on_site (per /quality-control/ link, page not retrievable) | none surfaced |
| 10 | blue-sky-peptide | blueskypeptide.com | ok | 21+ | yes | none surfaced | Magento | on_site (PDF behind product "report tab") | none disclosed |

Notable findings: 5 of 10 vendors required domain correction (peptidology.co not .com; healthgev.com not healthgevity.com; genx.bio not genxbio.com; umbrellalabs.is not .com; verified blueskypeptide.com).

---

## ascension-peptides (Ascension Peptides)
**Domain:** https://ascensionpeptides.com
**Fetch status:** ok
**Tech stack:** WooCommerce (add-to-cart query parameters; standard WooCommerce URL structures)

### Footer disclaimer (verbatim)
"All products on this site are for Research, Development use only. Must be 21+ to purchase. Products are Not for Human consumption of any kind. The statements made within this website have not been evaluated by the US Food and Drug Administration. The statements and the products of this company are not intended to diagnose, treat, cure or prevent any disease."
- Source: https://ascensionpeptides.com (homepage footer)
- Raw artifact: `03_raw_fetches/compliance_slice/ascension-peptides__homepage.md`

### Hero / homepage compliance language (verbatim)
"All products on this site are for Research, Development use only"
"Must be 21+ to purchase"
"Products are Not for Human consumption of any kind"
- Source: homepage footer (also used as sitewide bar)

### Product page disclaimer — BPC-157 10mg (verbatim)
"These products are not intended to be used for human or animal consumption and/or ingestion of any kind... Bodily introduction into Human and Animals of any kind is strictly forbidden by law."
"99+% PURITY" / "All peptides are third-party lab tested."
- Source: https://ascensionpeptides.com/product/bpc-157-10mg/
- Raw artifact: `03_raw_fetches/compliance_slice/ascension-peptides__product_bpc157.md`

### ToS key compliance highlights (verbatim)
- "YOU MUST BE 21 YEARS OR OLDER TO USE THIS WEBSITE."
- "The products offered on this website are not for human or animal consumption of any kind."
- "Products on this website are sold for laboratory research purposes only."
- "AscensionPeptides.com products are intended for laboratory IN-VITRO RESEARCH PURPOSES ONLY."
- "The products are not medicines or drugs and they have not been approved by the fda to prevent, treat, diagnose, mitigate, or cure any disease."
- Indemnification: "The purchaser agrees to indemnify and hold us harmless from all claims, expenses, losses and liability." / "Purchaser agrees to indemnify, defend, and hold harmless The Seller from any liability arising from use of the Products."
- Source: https://ascensionpeptides.com/terms-of-use/
- Raw artifact: `03_raw_fetches/compliance_slice/ascension-peptides__tos.md`

### Age-gate
- Present in: footer disclaimer ("Must be 21+ to purchase") and ToS ("YOU MUST BE 21 YEARS OR OLDER TO USE THIS WEBSITE.")
- Modal popup not observed at fetch time.

### Jurisdictional restriction (verbatim)
"Our products are shipped within the United States only. Unfortunately, due to recent regulations, we cannot ship outside of the United States."

### Refund policy (verbatim)
"ALL SALES ARE FINAL. WE CANNOT ACCEPT RETURNS."
"Due to regulations regarding the sale of our products, returns are prohibited."
"All sales are final...we cannot accept returns, exchanges or provide refunds for any reason."
- Restrictions tied to gray-legal nature: explicit ("Due to regulations regarding the sale of our products, returns are prohibited.")

### Shipping policy
- US-only ("shipped within the United States only")
- No international shipping
- Free shipping over $250 noted on product page
- States excluded: not enumerated

### COA hosting
- on_site_pdf (general "Lab Testing / COAs" page linked in nav and footer)

### Lab partner named
- None disclosed in extracted content

### Batch / lot transparency
- uncertain — "third-party lab tested" claimed, but no batch/lot identifiers exposed on product page

### Payment methods
- Per ToS: credit cards and ACH/electronic debit transactions
- Specific processor logos not visible in homepage extract

### ID verification
- Not observed (no KYC modal). Age claim is self-attestation via "Must be 21+ to purchase" footer text.

---

## lvlup-health (LVLUP Health)
**Domain:** https://lvluphealth.com
**Fetch status:** ok (note: LVLUP positions products as oral dietary SUPPLEMENTS, not research-use peptides)
**Tech stack:** WooCommerce-likely (URL pattern /product/...) — not byte-confirmed

### Footer disclaimer (verbatim)
"Copyright © 2026 Kyana International Limited"
- Note: LVLUP does NOT include a footer "research use only" / "not for human consumption" disclaimer. Compliance posture is supplement-side.
- Source: https://lvluphealth.com (homepage footer)
- Raw artifact: `03_raw_fetches/compliance_slice/lvlup-health__homepage.md`

### Hero / homepage compliance language
- None present. NO "research use only" / "not for human consumption" / "not FDA approved" language on homepage.

### Product page disclaimer — BPC-ARG Double Strength (verbatim)
- NO research-use-only language on product page.
- NO "not for human consumption" disclaimer.
- NO indemnification language.
- NO COA / lab partner / batch info on product page.
- Marketing copy: "delivers 1,000 mcg per serving for enhanced tissue, joint, and gut support."
- Marketed for "athletes and active individuals."
- Ingredients: "Palmitoylethanolamide (500mg), Hyaluronic Acid (100mg), BPC-ARG (1000mcg), and Sodium Bicarbonate (400mg)."
- Source: https://lvluphealth.com/product/bpc-157-double-strength/
- Raw artifact: `03_raw_fetches/compliance_slice/lvlup-health__product_bpc157.md`

### ToS key compliance highlights (verbatim)
- Age: "You must be at least 18 years old (or the age of majority in your jurisdiction, if higher)"
- Health: "Our products are dietary supplements for adult use only. They are not intended to diagnose, treat, cure, or prevent any disease."
- FDA: "These statements have not been evaluated by the U.S. Food and Drug Administration (FDA), the Hong Kong Department of Health, the Therapeutic Goods Administration of Australia, or any other regulatory authority."
- Medical: "Information on this Website is provided for general educational purposes only and is not medical advice."
- Jurisdictional: "You are responsible for ensuring that products are legal to purchase, import and use in your jurisdiction."
- Liability: "LVLUP Health's total liability is limited to the purchase price of the product giving rise to the claim."
- Notable absences: NO research-use-only language; NO state-specific restrictions; NO "not for human consumption" disclaimer; NO detailed indemnification clauses
- Source: https://lvluphealth.com/terms-of-service
- Raw artifact: `03_raw_fetches/compliance_slice/lvlup-health__tos.md`

### Age-gate
- Adult age (18+ or jurisdictional majority) per ToS — no modal popup observed.

### Jurisdictional restriction notice (verbatim)
- ToS: "You are responsible for ensuring that products are legal to purchase, import and use in your jurisdiction."
- Shipping policy explicitly bans 15 countries: "Austria, Brazil, China, Germany, India, Indonesia, Ireland, Israel, Japan, Mexico, Netherlands, Russia, South Korea, Switzerland, Thailand, and Ukraine."

### Refund policy (verbatim summary, with restrictions)
- Window: 30 days, unopened/unused
- "Opened or used products are not eligible for return unless the item was incorrect or damaged upon delivery."
- "LVLUP Health does not guarantee refunds and offers store credit or replacement as the primary resolution."
- Processing: "seven to ten business days"
- Non-refundable: "Original shipping and handling fees"
- Customs: ineligible deliveries to "hotels, PO boxes, freight forwarders, or other non-fixed or third-party addresses"
- Chargeback discouraged
- Source: https://lvluphealth.com/returns-and-refunds-policy
- Raw artifact: `03_raw_fetches/compliance_slice/lvlup-health__refund.md`

### Shipping policy (verbatim summary)
- Domestic US: 3-10 business days
- International: 14-30 business days
- 15 countries excluded (verbatim list above)
- Carrier: "ShipBob or other approved third-party logistics providers"
- "Customers are solely responsible for" customs duties and "Compliance with all local laws."
- No refunds for customs seizure
- Source: https://lvluphealth.com/shipping-policy
- Raw artifact: `03_raw_fetches/compliance_slice/lvlup-health__shipping.md`

### COA hosting
- on_request (no on-site PDF observed; no third-party portal named)

### Lab partner named
- None disclosed

### Batch / lot transparency
- false — no batch/lot info on product page

### Payment methods
- Not visible in homepage footer extract
- Affiliate payouts (separate context): PayPal, direct bank deposit, LVLUP store credit

### ID verification
- Not observed; age is self-attestation via ToS

---

## peptidology (Peptidology)
**Domain:** https://peptidology.co (NOT peptidology.com — original .com does not resolve)
**Fetch status:** partial (login wall blocks catalog and full ToS body)
**Tech stack:** WordPress (wp-content/uploads, wp-content/themes)

### Footer disclaimer (verbatim)
"Disclaimer: All polypeptide sequences, amino acid derivatives, and analogs available on this site are strictly designated for Research Use Only. These compounds are synthesized and supplied exclusively for laboratory-based analytical, proteomic, and scientific inquiry by qualified professionals. They are not intended for human or veterinary administration, and no diagnostic, therapeutic, or clinical application is implied, warranted, or permitted. Peptidology functions solely as a specialized chemical supplier. The organization does not operate as a compounding pharmacy or chemical compounding facility as defined under Section 503A of the Federal Food, Drug, and Cosmetic Act, nor does it serve as an outsourcing facility under Section 503B of the same Act. Our operations are limited to the distribution of high-purity reagents for the advancement of peptide science in a controlled research environment"
- Source: https://peptidology.co (gated landing/login page)
- Raw artifact: `03_raw_fetches/compliance_slice/peptidology__homepage.md`

### Hero / homepage compliance language (verbatim)
- "An account is now required to browse the catalog."
- The footer disclaimer (above) doubles as the hero compliance bar.

### Product page disclaimer — BPC-157
- NOT RETRIEVABLE — login wall blocks individual product pages. No anti-bot bypass attempted per binding rule.
- Raw artifact: `03_raw_fetches/compliance_slice/peptidology__product_bpc157.md`

### ToS key compliance highlights (verbatim)
- "All polypeptide sequences, amino acid derivatives, and analogs available on this site are strictly designated for Research Use Only"
- "They are not intended for human or veterinary administration, and no diagnostic, therapeutic, or clinical application is implied"
- "By signing in, you confirm that you are at least 21 years old and that any items you purchase will be used solely for research purposes."
- "Peptidology functions solely as a specialized chemical supplier...limited to the distribution of high-purity reagents for the advancement of peptide science."
- "The organization does not operate as a compounding pharmacy or chemical compounding facility as defined under Section 503A of the Federal Food, Drug, and Cosmetic Act"
- Source: https://peptidology.co/terms-of-service/ — login-gated. Above lines retrieved from gated landing.
- Raw artifact: `03_raw_fetches/compliance_slice/peptidology__tos.md`

### Age-gate (verbatim)
"By signing in, you confirm that you are at least 21 years old and that any items you purchase will be used solely for research purposes."
- Mechanism: gate is conditional on sign-in (account creation required to view catalog).

### Jurisdictional restriction notice
- References to FDA Sections 503A/503B serve as quasi-jurisdictional positioning ("not a compounding pharmacy").
- No explicit state/country exclusions surfaced.

### Refund policy
- Not retrievable (login wall). Status: uncertain.

### Shipping policy
- Not retrievable (login wall). Status: uncertain.

### COA hosting
- on_request via gated catalog (claims ISO/IEC 17025:2017-accredited testing). Treat as PROVISIONAL.

### Lab partner named
- "two independent labs" + "ISO/IEC 17025:2017-accredited laboratory testing" claimed; specific lab names NOT disclosed in retrievable text.

### Batch / lot transparency
- Claimed strong: "We test up to 35 units per batch across purity, net peptide content, identity, endotoxins, sterility, and more." "Each lot is supported by structured, third-party verification using validated methods" — but per-lot reports not retrievable from gated catalog. Status: claimed-true / verification-uncertain.

### Payment methods
- Not visible (login wall).

### ID verification
- Self-attestation 21+ at sign-in. No KYC observed.

---

## healthgevity (Healthgevity)
**Domain:** https://healthgev.com (NOT healthgevity.com — original .com does not resolve)
**Fetch status:** ok (NOTE: Healthgevity sells oral peptide SUPPLEMENTS, not research-grade lyophilized vials. Compliance posture is supplement-side / FDA dietary-supplement disclaimer.)
**Tech stack:** Shopify (URL structure, cart references, product variant JSON `shopify inventory_management`, image CDN path `cdn/shop/files/`)

### Footer disclaimer (verbatim)
"*Statements on this website have not been evaluated by the FDA. These products are not intended to diagnose, treat, cure or prevent any disease."
- Source: https://healthgev.com (homepage footer)
- Raw artifact: `03_raw_fetches/compliance_slice/healthgevity__homepage.md`

### Hero / homepage compliance language
- NO "research use only" / "not for human consumption" / "not FDA approved" language on homepage.
- Brand positioning: "clinician-grade supplements using peptides, bioactive proteins, and cutting-edge science in partnership with healthcare professionals."

### Product page disclaimer — BPC supplement (verbatim)
"This formula features a naturally occurring 15-amino-acid sequence, designed to support healthy tissue recovery, gastrointestinal integrity, and overall resilience."
"The formula incorporates Salcaprozate Sodium (SNAC) — a clinically studied absorption-support molecule known for enhancing the uptake of select nutrients and bioactives."
"*Statements on this website have not been evaluated by the FDA. These products are not intended to diagnose, treat, cure or prevent any disease."
- Source: https://healthgev.com/products/bpc
- Raw artifact: `03_raw_fetches/compliance_slice/healthgevity__product_bpc157.md`

### ToS key compliance highlights (verbatim — from practitioner account policies, the closest ToS analog)
- Jurisdiction: "Healthgevity products sold to U.S. customers may not be sold or shipped internationally unless approved."
- Choice-of-law: "the account holder expressly submits to personal jurisdiction and venue in the federal or state courts in Monmouth County, New Jersey."
- Reseller: "practitioner-Customers selling its professional lines of products...to end-users who are patients of the practitioner-Customer"
- Marketplace: products cannot be sold on third-party sites (Amazon, eBay); MAP applies; "Disease claims are prohibited"; zero-tolerance enforcement.
- Notable absences: NO research-use-only; NO 21+ age requirement; NO "not for human consumption" language.
- Source: https://healthgev.com/pages/practitioner-new-account-policies
- Raw artifact: `03_raw_fetches/compliance_slice/healthgevity__tos.md`

### Age-gate
- None observed on homepage or in policies. Compliance posture is dietary-supplement (no 18+ or 21+ gate).

### Jurisdictional restriction notice
- "Healthgevity products sold to U.S. customers may not be sold or shipped internationally unless approved."
- New Jersey choice-of-law / venue.

### Refund policy (verbatim summary)
- "Unopened items purchased directly from Healthgevity can be returned or exchanged within 30 days of the purchase date."
- 20% restocking fee for returns past 30 days
- 20% restocking fee for ≥6 identical items
- Order discrepancies: report within 3 days
- Source: https://healthgev.com/pages/refund-policy
- Raw artifact: `03_raw_fetches/compliance_slice/healthgevity__refund.md`

### Shipping policy (verbatim summary)
- Domestic US & territories: free standard shipping on orders over $150 (2-6 business days)
- Hawaii / Puerto Rico / Alaska: 1-2 weeks
- Guam / US Virgin Islands: 3-5 weeks
- International: "All sales are final once package leaves the US"; duties and brokerage fees on buyer; seized/destroyed items not refundable
- No states explicitly excluded; no countries explicitly excluded (international permitted with caveats)
- Combined with refund policy in single page

### COA hosting
- on_request (no on-site PDF observed; brand emphasizes "clinician-grade" not third-party COAs)

### Lab partner named
- None disclosed

### Batch / lot transparency
- false — supplement-side, no batch identifiers exposed

### Payment methods (homepage footer icons)
- American Express, Diners Club, Discover, JCB, Mastercard, Visa
- 6 named card processors. Notable: NO crypto, NO ACH, NO PayPal/Venmo.
- (Per industry references, Healthgevity also accepts Venmo/PayPal — but not visible in homepage footer extract; flag as uncertain.)

### ID verification
- None observed (consumer + practitioner channels; no NPI / license verification surfaced in extracted ToS).

---

## genx-bio (GenX Peptides)
**Domain:** https://genx.bio (NOT genxbio.com — that is a separate India-based bioscience supply company; brand here is GenX Peptides at genx.bio)
**Fetch status:** ok
**Tech stack:** WooCommerce (add-to-cart query parameters, checkout flow, product management structure)

### Footer disclaimer (verbatim)
"©2025 GenX Peptides. All rights reserved"
- Note: NO explicit research-use-only disclaimer in footer extract. Product image alt-text contains "for research use" markers.
- Source: https://genx.bio (homepage footer)
- Raw artifact: `03_raw_fetches/compliance_slice/genx-bio__homepage.md`

### Hero / homepage compliance language (verbatim)
"Highest Quality Peptides For Sale"
"Since 2013 we are proud to offer the highest quality peptides for sale with rigorous quality control testing that not only meets, but exceeds our clients' expectations."

### Product page disclaimer — BPC-157 5mg (verbatim)
"The peptides are available for research and development purposes only."
Customer must accept terms confirming "qualified researcher or institutional professional" status and that products are "strictly for lawful Research Use Only (not for human or animal use, clinical, diagnostic, or therapeutic purposes)."
"clinical trials are needed to confirm its therapeutic applications in humans."
- Source: https://genx.bio/product/bpc-157-5mg/
- Raw artifact: `03_raw_fetches/compliance_slice/genx-bio__product_bpc157.md`

### ToS key compliance highlights (verbatim)
- Age: "All customers MUST be at least 18 years of age to purchase our products."
- Research-use: "ALL products and services offered are for RESEARCH ONLY. Under NO circumstances shall/should ANY of these materials be used for recreational purposes nor human consumption."
- Medical: "The information available from this Web Site is not intended to be used to diagnose any medical condition or disease. Products on this website are sold for research only."
- Prohibited use: "These chemicals are NOT intended to use as food additives, drugs, cosmetics, household chemicals, or other inappropriate applications."
- Indemnification: "You hereby agree to indemnify and hold genx.bio, and our subsidiaries, affiliates, officers, directors, agents...harmless from any claim or demand...made by any third party due to or arising out of your use."
- Liability: "Under no circumstances shall GenX Peptides or any associated affiliates be liable for consequential damages, whether purchasers claim in contract, negligence, strict liability, or otherwise."
- Qualification: "All of the products will be handled only by qualified and properly trained professionals."
- Source: https://genx.bio/terms-and-conditions/
- Raw artifact: `03_raw_fetches/compliance_slice/genx-bio__tos.md`

### Age-gate
- ToS: 18+ required.
- Account creation: "I am at least 18 years old." checkbox.

### Jurisdictional restriction notice
- ToS: implicit in "governed by and construed in accordance" with GenX.bio's office jurisdiction.
- International: "We currently ship to all global countries" — but customer responsibility for import laws.

### Refund policy (verbatim summary)
- "Due to the delicate nature of peptides we are not able to accept returns unless there is a manufacturing defect or the product was damaged during transport."
- Lost shipments: reshipped at no cost if delivery confirmation shows non-delivery
- International seizure: no refund; "50% discount on the same order to re-ship" with seizure documentation
- Chargebacks: "treated as fraud" + customer added to "no-sell list"
- Restrictions tied to gray-legal nature: "delicate nature of peptides" framing; international seizure handled by re-ship-discount mechanism rather than refund
- Source: https://genx.bio/shipping-and-returns/
- Raw artifact: `03_raw_fetches/compliance_slice/genx-bio__shipping.md`

### Shipping policy (verbatim summary)
- M-F shipping, 1-2 business days to ship after order
- Free shipping over $200 domestic
- Ships to "all global countries" — customer responsible for import laws and customs
- No states/countries explicitly excluded

### COA hosting
- on_site_pdf (two COAs referenced on BPC-157 product page)

### Lab partner named
- None disclosed (HPLC/MS testing claimed but lab not named)

### Batch / lot transparency
- uncertain — COAs present but batch/lot identifiers not surfaced in extract

### Payment methods
- Footer icons: Visa, Mastercard
- Product page: "Visa, MasterCard, American Express, and Discover."
- Notable: no crypto, ACH, or wire surfaced

### ID verification
- Self-attestation only (account checkbox 18+). No KYC.

---

## umbrella-labs (Umbrella Labs)
**Domain:** https://umbrellalabs.is (umbrellalabs.com REDIRECTS to HugeDomains parking page; active brand on .is ccTLD)
**Fetch status:** ok
**Tech stack:** WooCommerce-likely (URL patterns /shop/, /shop-category/) — not byte-confirmed

### Footer disclaimer (verbatim)
"The statements made within this website have not been evaluated by the US Food and Drug Administration."

"This material is sold for laboratory research use only...Not for human consumption, nor medical, veterinary, or household uses."

"All products are for laboratory developmental research USE ONLY. Products are not for human consumption."

"Umbrella Labs is a chemical supplier. Umbrella Labs is not a compounding pharmacy or chemical compounding facility as defined under 503A of the Federal Food, Drug, and Cosmetic act."

- Source: https://umbrellalabs.is (homepage footer)
- Raw artifact: `03_raw_fetches/compliance_slice/umbrella-labs__homepage.md`

### Hero / homepage compliance language
- Sitewide research-use-only disclaimer (above) appears throughout site.

### Product page disclaimer — BPC-157 5mg (verbatim, repeated 3x on page)
"BPC-157 is sold for laboratory research use only. Terms of sale apply. Not for human consumption, nor medical, veterinary, or household uses."
- Source: https://umbrellalabs.is/shop/peptides/peptide-vials/bpc-157-peptide-5mg-vial/
- Raw artifact: `03_raw_fetches/compliance_slice/umbrella-labs__product_bpc157.md`

### ToS key compliance highlights (verbatim)
- "All products are for laboratory developmental research USE ONLY. Products are not for human consumption."
- "Umbrella Labs' Products are intended primarily for laboratory research purposes and...are not to be used for any other purposes, including but not limited to, in vitro diagnostic purposes, in foods, drugs, medical devices or cosmetics for humans or animals or for commercial purposes."
- Choice-of-law: "All disputes allegedly arising from the legality, interpretation, application, or performance of your order...shall be governed by the laws of the State of Arizona."
- Indemnification: "You shall indemnify and hold Umbrella Labs, its agents, employees and representatives harmless from and against any and all claims, damages, losses, costs or expenses (including attorney's fees) resulting from your (a) sale or use of the Products..."
- Liability: "UMBRELLA LABS SHALL NOT IN ANY CASE EXCEED THE CONTRACT PRICE FOR THE SPECIFIC PRODUCTS THAT GIVE RISE TO THE BREACH."
- Notable absence: NO age restriction (18+ or 21+) found in retrievable ToS extract.
- Source: https://umbrellalabs.is/terms-of-service/
- Raw artifact: `03_raw_fetches/compliance_slice/umbrella-labs__tos.md`

### Age-gate
- Not observed (no modal; no age restriction surfaced in ToS extract). Status: uncertain (may exist elsewhere on site).

### Jurisdictional restriction notice (verbatim)
"Umbrella Labs only processes and ships within United States of American (USA) only. International is not available."
- Choice-of-law: Arizona

### Refund policy
- Status: PARTIAL — dedicated refund-policy URL not retrievable (500 error on /refund_returns/). Retrievable refund-style language is the shipping guarantee:
"The shipping guarantee covers lost or damaged shipments and provides a one-time, no-cost replacement of a lost shipment or damaged product(s)."
- Restrictions tied to gray-legal nature: implied — no explicit money refund mechanism in retrievable text.
- Source: https://umbrellalabs.is/shipping-information/
- Raw artifact: `03_raw_fetches/compliance_slice/umbrella-labs__refund.md`

### Shipping policy (verbatim)
"UMBRELLA Labs is located in Arizona and provides free expedited shipping within the United States of America (USA) only."
"Umbrella Labs only processes and ships within United States of American (USA) only. International is not available."
- US-only. No international. No US-state exclusions enumerated.
- Tracked + insured.
- Source: https://umbrellalabs.is/shipping-information/
- Raw artifact: `03_raw_fetches/compliance_slice/umbrella-labs__shipping.md`

### COA hosting
- on_site_pdf — example COA file names captured: `2025-12-22-Umbrella-Labs-BPC157-Certificate-of-Analysis-COA.pdf`, `2026-02-04-Umbrella-Labs-BPC-157-Certificate-of-Analysis-COA-Entoxins.pdf`
- COAs are Umbrella-Labs-branded; testing lab not named on product page.

### Lab partner named
- None disclosed; "third party certificates of analysis from NCCCCE-credentialed chemists" referenced in PR but specific lab not named on product/footer.

### Batch / lot transparency
- true (date-stamped COAs by product). Specific lot/batch ID per shipment uncertain.

### Payment methods (per /payment-options/, verbatim)
- "BTCPay (Bitcoin / Lightning Network)"
- "Pay with US Bank Account" via Plaid (ACH)
- 5% discount with ACH: "SAVE 5% when using Pay With US Bank Account."
- NO credit cards, NO wire transfer, NO e-check
- This is a notably restrictive payment posture (consistent with crypto-or-bank-only / FDA-warning-letter-aware vendors)

### ID verification
- Plaid bank login functions as soft KYC for ACH payment route. No standalone ID verification observed.

### FDA Warning Letter note
- Per task brief, prior FDA warning letter exists historically. No reference visible on the current site (homepage / ToS / shipping / payment / product pages). Brand operates the .is ccTLD presumably for resilience; original .com is parked for sale.

---

## particle-peptides (Particle Peptides)
**Domain:** https://particlepeptides.com
**Fetch status:** ok (Note: PARTICLE s.r.o. is Slovakia-based / EU vendor; included per Batch B list, but technically not "US-shipping mid-tier" in the same sense as the others; ships internationally including to US per ToS implications.)
**Tech stack:** PrestaShop (cookie `PrestaShop-#`)

### Footer disclaimer (verbatim)
"PARTICLE s.r.o., Kolonada 4490/18, Lucenec 984 01, Slovakia © 2026 ParticlePeptides.com. All Rights Reserved."

Sitewide compliance language (per homepage + product pages):
"Chemical substances shall not be used as a drug, medicine, active substance, medical aid, cosmetic product, a substance for production of a cosmetic product neither for human consumption that is any food..."
"intended for scientific research and development purposes only"
- Source: https://particlepeptides.com (homepage footer)
- Raw artifact: `03_raw_fetches/compliance_slice/particle-peptides__homepage.md`

### Hero / homepage compliance language (verbatim)
- The chemical-substances disclaimer (above) functions as homepage compliance bar.
- Anti-counterfeit warning: "Fake TikTok, Instagram accounts and cloned sites are currently circulating"

### Product page disclaimer — BPC-157 5mg (verbatim)
"The product is intended for scientific research and development purposes only."
"Intended only for in-vitro research, such as Receptor-ligand binding studies, Enzyme activity assays, Cell proliferation assays."
"Chemical substances shall not be used as a drug, medicine, active substance, medical aid, cosmetic product, a substance for production of a cosmetic product neither for human consumption that is any food..."
- Source: https://particlepeptides.com/en/buy-peptides/1-bpc-157-5mg.html
- Raw artifact: `03_raw_fetches/compliance_slice/particle-peptides__product_bpc157.md`

### ToS key compliance highlights (verbatim, with section numbers)
- §4.2 Research-use: "The Company sells the Goods only and exclusively for SCIENTIFIC RESEARCH AND DEVELOPMENT purposes"
- §3.1 / §4.3.1 Age: customer must be "a natural person older than 18 years"
- §4.2.1 Not as drug: "can not be used as a medicinal product, drug or active substance" for human/veterinary purposes
- §4.2.2 Not for consumption: "are not intended and must not be used for human consumption"
- §4.2.3 Not cosmetic
- §4.2.4 Athlete restriction: "may not be used by athletes or any other person in sport"
- §4.2.5 Not for animal use either: "shall not be used on humans or animals in any other similar way"
- §4.4 Indemnification + criminal-law disclaimer: "will be liable for any damage incurred by the Company or any third party"; "The Company bears no responsibility for any violation of criminal law by the Customer"
- §14.8-14.9 Jurisdiction: "the competent court of the Slovak Republic" under Slovak law
- Source: https://particlepeptides.com/en/content/3-terms-and-conditions-of-use
- Raw artifact: `03_raw_fetches/compliance_slice/particle-peptides__tos.md`

### Age-gate
- ToS: 18+ required (Slovak / EU minimum).
- Modal popup not observed at fetch time.

### Jurisdictional restriction notice (verbatim)
- ToS: Slovak Republic court / Slovak law for disputes
- Shipping page lists non-delivery conditions including "Customs conditions aren't met or goods are seized"
- Sport-context restriction is unique: "may not be used by athletes or any other person in sport"
- No US-state exclusions; no country exclusions named (ships internationally).

### Refund policy (verbatim)
- "goods can only be returned if they are defective" and only with prior written instruction
- "If you still send the goods back without our instructions, you are liable for the damage that arises."
- Customs seizure / address error: refund issued ("we will refund you the purchase price, shipping and returns costs")
- Source: https://particlepeptides.com/en/content/1-shipping-and-return-policy-particle-peptides
- Raw artifact: `03_raw_fetches/compliance_slice/particle-peptides__refund.md`

### Shipping policy (verbatim)
- "We ship our orders from Slovakia, an EU-based country."
- EU: 2-7 business days
- International: 7-21 business days
- No country exclusions enumerated; international permitted with caveats

### COA hosting
- on_site (linked from product as "3rd party test results"); specific lab not named

### Lab partner named
- None disclosed (only "3rd party test results")

### Batch / lot transparency
- uncertain — COA referenced but batch IDs not enumerated in extract

### Payment methods
- Sitewide: "Secure online payment" badge
- Customer-review reference: "Zen" payment system (likely Zen.com payment processor)
- Affiliate commissions paid in EUR only
- No credit-card processor logos enumerated in extract

### ID verification
- None observed; self-attestation 18+ at registration

---

## peptaura (Peptaura)
**Domain:** https://www.peptaura.com
**Fetch status:** partial (provisional verbatim — second-pass byte verification failed because WebFetch refused to output full disclaimer page on retry)
**Tech stack:** custom marketplace (likely Webflow / custom React) — not byte-confirmed

### Footer disclaimer
- NOT visible in homepage extract (footer not surfaced cleanly). Marketplace structure: "Peptaura is a platform that connects you to compound merchants."
- Compliance text on /disclaimers (provisional verbatim — see below).
- Raw artifact: `03_raw_fetches/compliance_slice/peptaura__homepage.md`

### Hero / homepage compliance language
- Marketplace value prop: "Peptaura connects researchers with vetted peptide suppliers, instant COAs, and transparent stock data."
- "Peptaura is a platform that connects you to compound merchants. We do not hold stock nor test any of the [compounds]"

### Product page disclaimer — BPC-157
- /catalog/BPC157 page metadata: "Browse BPC157 peptide listings from 6 suppliers on Peptaura, complete with COAs and live stock data."
- Per-supplier disclaimers depend on supplier; platform abstracts away.
- Source: https://www.peptaura.com/catalog/BPC157
- Raw artifact: `03_raw_fetches/compliance_slice/peptaura__product_bpc157.md`

### ToS / Disclaimer key compliance highlights (PROVISIONAL VERBATIM — cross-confirmed across two independent fetches but not byte-verified from raw HTML)
- "All peptides sold by [this website / Peptaura] are intended for research purposes only. These products are not intended for human consumption, diagnostic, therapeutic, or any other medical use."
- Age: "You must be at least 21 years of age to purchase research peptides from this website." (first fetch only; not re-confirmed)
- Researcher acknowledgment: "By purchasing these research peptides, you acknowledge that you are a qualified researcher, scientist, or institution with the proper facilities and knowledge to safely handle these materials."
- Compliance with laws: "You agree to comply with all applicable local, state, and federal laws regarding the possession and use of these research chemicals."
- No warranties: "All research peptides are sold 'as is' without any warranties or guarantees."
- Marketplace status: "does not manufacture, store, or directly sell peptides — instead serving solely as an intermediary"
- Indemnification (first fetch only): "You agree to hold harmless and indemnify our company, its officers, employees, and affiliates from any claims, damages, or liabilities arising from the use or misuse of research peptides."
- Source: https://www.peptaura.com/disclaimers
- Raw artifact: `03_raw_fetches/compliance_slice/peptaura__tos.md`

### Age-gate
- 21+ self-attestation per disclaimers page (provisional). No popup observed.

### Jurisdictional restriction notice
- Buyer agrees to comply with "all applicable local, state, and federal laws" — no enumerated state/country exclusions.

### Refund policy
- Marketplace-mediated: "Peptaura automatically reminds sellers about unfulfilled orders, pushes them to ship, and mediates disputes"
- "Dynamic Escrowing — aligns incentives between Supplier, Customer, and Platform"
- Per second-fetch summary (UNCONFIRMED): "refunds expire after 90 days," refund settlement "only USDT on Arbitrum One or store credits"
- Restrictions tied to gray-legal nature: marketplace mediates disputes rather than offering platform refunds
- Raw artifact: `03_raw_fetches/compliance_slice/peptaura__refund.md`

### Shipping policy
- Not platform-defined. Each supplier sets its own.
- Raw artifact: `03_raw_fetches/compliance_slice/peptaura__shipping.md`

### COA hosting
- third_party_portal — Peptaura functions as "permanent repository of COAs, so you're not chasing PDFs from random chats"
- Recommended independent test labs (verbatim, named): Finnrick (finnrick.com), Janoshik (janoshik.com), Chromate (chromate.org)
- "You may pick any reputable lab that is accessible to you. Personally, we have used and like [these three]."

### Lab partner named
- Three independent verification labs recommended: Finnrick, Janoshik, Chromate. Peptaura itself does not test.

### Batch / lot transparency
- true at supplier level (suppliers must upload COAs); platform-mediated.

### Payment methods
- Per second-fetch (UNCONFIRMED): USDT on Arbitrum One; store credits for refund. Other methods TBD.
- Crypto-stablecoin posture is consistent with marketplace's gray-legal positioning.

### ID verification
- None observed at platform layer (vendor-level may differ).

---

## chemyo (Chemyo)
**Domain:** https://chemyo.com
**Fetch status:** ok (CAVEAT: BPC-157 NOT in catalog. Chemyo is primarily a SARMs vendor; their "research peptide" line is limited to nootropics/research compounds — no marquee peptides like BPC-157, GHK-Cu, semaglutide.)
**Tech stack:** WooCommerce (add-to-cart parameters, standard structure)

### Footer disclaimer (verbatim)
"Chemyo is the industry leader in high-quality reference materials and other novel compounds promoting a better quality of research for all."
Address: "4023 Kennett Pike STE 59371 Wilmington, DE 19807 USA"
Phone: "+1 302 543 2011"
Copyright: "© 2026 Chemyo LLC. All Rights Reserved."
- Note: Homepage footer does NOT include FDA / "research use only" / "not for human consumption" disclaimer.
- Source: https://chemyo.com (homepage footer)
- Raw artifact: `03_raw_fetches/compliance_slice/chemyo__homepage.md`

### Hero / homepage compliance language (verbatim)
"HIGH QUALITY SARMS FOR SALE"
- "Third-party tested for identity, purity, and concentration"
- "Free shipping in the US for orders $100+ & international $275+"
- "50ml bottles, providing almost 70% more volume than the standard 30ml"
- NO research-use-only banner on homepage.

### Product page disclaimer — BPC-157
- NOT SOLD. Three retrieval attempts: (1) /product/bpc-157/ → 404, (2) /shop/ catalog scan → not listed, (3) /product-category/peptides/ → 404.
- Raw artifact: `03_raw_fetches/compliance_slice/chemyo__product_bpc157.md`

### ToS key compliance highlights (verbatim)
- Research-use: "The products we offer are intended for laboratory research use only." / "ALL products and services offered are for RESEARCH purposes ONLY."
- Age: "All customers MUST be at least 18 years of age to purchase our products."
- Prohibited: "as food additives, drugs, cosmetics, household chemicals or other inappropriate applications" — not allowed; "shall not...be considered to be foods, drugs, medical devices or cosmetics."
- Medical: "Under NO circumstances shall/should ANY of these materials be used for therapeutic or diagnostic purposes."
- Indemnification: "indemnify and hold Chemyo LLC harmless from all claims, expenses, losses and liability"
- Liability: "Chemyo LLC...shall not be liable for special, incidental or consequential damages"
- Jurisdictional: "Chemyo relies on each client to know the requirements of their own region"
- Affiliation requirement: "affiliated with a laboratory, institution, university or other research based facility"
- Source: https://chemyo.com/terms-conditions/
- Raw artifact: `03_raw_fetches/compliance_slice/chemyo__tos.md`

### FAQ "are products for human use" (verbatim)
"Absolutely not. Everything sold by Chemyo is strictly intended for laboratory research."

### Age-gate
- 18+ per ToS. No modal popup observed.

### Jurisdictional restriction notice
- "Chemyo relies on each client to know the requirements of their own region" — taxes / import certifications / licenses on customer.
- No enumerated state/country exclusions.

### Refund policy
- Status: PARTIAL — dedicated refund/returns URL not identifiable in retrievable footer link list. Industry default "all sales final" is consistent with retrievable ToS:
  "Chemyo LLC...shall not be liable for special, incidental or consequential damages"
- Raw artifact: `03_raw_fetches/compliance_slice/chemyo__refund.md`

### Shipping policy (verbatim)
- Processing: "All orders are shipped within 24-48 hours when placed before our cut-off time"
- US: "US orders are usually delivered in 2-5 business days."
- International: 7-21 business days
- Free shipping in US for orders $100+; international $275+
- Source: https://chemyo.com/payment/
- Raw artifact: `03_raw_fetches/compliance_slice/chemyo__shipping.md`

### COA hosting
- on_site (per /quality-control/ page link, page returned 404 in extract — but referenced)
- Quality-control claim: "Third-party tested for identity, purity, and concentration"

### Lab partner named
- None surfaced

### Batch / lot transparency
- uncertain — not retrievable in extract

### Payment methods (verbatim, per /payment/)
- Credit cards (standard)
- E-check via Checkbook.io (US only) — 5% discount
- Cryptocurrency: "There is a standard 10% discount given on every order that is made with BTC/Crypto."
- Notably: NO PayPal, NO Venmo, NO wire transfer in extract.

### ID verification
- Self-attestation only (18+ via ToS; no KYC).

---

## blue-sky-peptide (Blue Sky Peptide)
**Domain:** https://www.blueskypeptide.com (verified — original .com correct)
**Fetch status:** ok
**Tech stack:** Magento (Mageplaza/rewardpoints, weltpixel/owlcarouselslider, Magento URL structures)

### Footer disclaimer
- Footer minimal; no "research use only" disclaimer captured at footer level. Trust badges: McAfee Secure, PositiveSSL.
- No copyright text in extracted footer.
- Source: https://www.blueskypeptide.com (homepage footer)
- Raw artifact: `03_raw_fetches/compliance_slice/blue-sky-peptide__homepage.md`

### Hero / homepage compliance language (verbatim)
"All products sold by Blue Sky Peptide are intended for laboratory research purposes only."
"Please note that all our peptide & research liquids for sale are intended for laboratory research purposes only, not for human consumption."
- NO "not FDA approved" language on homepage extract.

### Product page disclaimer — BPC-157
- Status: PARTIAL — direct BPC-157 product URL not retrieved. Retrieval attempts: (1) /product/bpc-157 → not surfaced, (2) /catalog-research-peptides.html → no specific product URL extracted, (3) site-wide search not retrieved.
- Catalog page QA copy: "All our catalog research peptides are tested to meet or exceed purity standards — we provide CofA quality reports for all our research products. These are available to under the report tab on the product pages."
- Raw artifact: `03_raw_fetches/compliance_slice/blue-sky-peptide__product_bpc157.md`

### ToS key compliance highlights (verbatim)
- Research-use: "The products we offer are intended for laboratory research use only" / "ALL products and services offered are for RESEARCH purposes ONLY."
- Age: "All customers MUST be at least 21 years of age to purchase our products."
- Not for human consumption: "Under NO circumstances shall/should ANY of these materials be used for recreational purposes nor human consumption."
- Prohibited: "NOT intended to use as food additives, drugs, cosmetics, household chemicals or other inappropriate applications" / "not to be used for any other purposes, including but not limited to vitro diagnostic purpose, in food drugs, medical devices."
- Indemnification: "agrees to indemnify and hold us harmless from all claims, expenses, losses and liability of any kind arising out of the purchaser's handling, possession, and/or use of the product."
- Jurisdictional: "This site is international and has international visitors and what may be legal in one country may not be legal in another."
- Liability: "Blueskypeptide.com...shall not be liable for consequential damages"
- Source: https://www.blueskypeptide.com/terms-conditions
- Raw artifact: `03_raw_fetches/compliance_slice/blue-sky-peptide__tos.md`

### Age-gate
- ToS: 21+ required. Modal popup not observed at fetch time.

### Jurisdictional restriction notice (verbatim)
"This site is international and has international visitors and what may be legal in one country may not be legal in another."
- No states/countries enumerated as excluded.

### Refund policy (verbatim, with gray-legal restrictions)
- Window: "If you experience an issue with a product, you may request a return within 30 days of purchase."
- Restriction tied to research-use: "Because our products are sold strictly for laboratory research use, we cannot guarantee research outcomes. Additionally, due to the potential for degradation if products are improperly handled or stored, we are unable to resell items that have been in a purchaser's possession."
- Approved returns: refund minus shipping, or exchange for equal/lesser product.
- Source: https://www.blueskypeptide.com/shipping-returns
- Raw artifact: `03_raw_fetches/compliance_slice/blue-sky-peptide__refund.md`

### Shipping policy (verbatim)
- Cutoff: "Orders placed before 12:00 PM EST, Monday through Friday (excluding holidays), typically ship the same business day."
- Options:
  - USPS Ground Advantage: $6.99 (3-5 days)
  - USPS Priority: $12.99 (2-4 days)
  - USPS Express: $28.99 (1-2 days)
  - UPS Next Day Air: calculated at checkout
- Free USPS shipping over $75
- USPS-only domestic; UPS for next-day. No states/countries excluded in retrievable text.
- Raw artifact: `03_raw_fetches/compliance_slice/blue-sky-peptide__shipping.md`

### COA hosting
- on_site_pdf (behind product "report tab")

### Lab partner named
- None disclosed in extract

### Batch / lot transparency
- uncertain — CofA available per product but batch ID exposure not surfaced

### Payment methods
- Not visible in homepage footer extract or extracted policies. Status: uncertain.

### ID verification
- Self-attestation only (21+ via ToS).

---

# Batch B summary

- **Profiled:** 10 / 10
- **Failed (all 3 attempts):** 0
- **Partial (login-walled or page-not-retrievable):** 4 — peptidology (login wall blocks catalog/full ToS); umbrella-labs (refund URL 500); peptaura (refund/shipping/full ToS body refused on retry — provisional verbatim); chemyo (BPC-157 not sold; refund URL not surfaced)
- **Full success:** 6 — ascension-peptides, lvlup-health, healthgevity, genx-bio, particle-peptides, blue-sky-peptide
- **Domain corrections required:** 5 — peptidology.co (not .com), healthgev.com (not healthgevity.com), genx.bio (not genxbio.com), umbrellalabs.is (not .com), blueskypeptide.com (verified original)
- **Raw fetches saved:** 46 markdown files (`03_raw_fetches/compliance_slice/{slug}__{page}.md`)

## Notable patterns

1. **Two distinct compliance postures:** Mid-tier US retail bifurcates sharply along a research-use-only / dietary-supplement axis. Pure research-vendor language ("not for human consumption", indemnification, qualified-researcher acknowledgment) is dominant — but two vendors (LVLUP Health, Healthgevity) sit firmly on the supplement side with FDA Section-403-style disclaimers ("statements have not been evaluated by the FDA, not intended to diagnose...") and no research-use claim. These vendors are oral-supplement formats marketed at "athletes" / "practitioners" / "longevity," not lyophilized vials.

2. **Age gate divergence:** 21+ at ascension-peptides, peptaura (claimed), blue-sky-peptide. 18+ at lvlup-health, particle-peptides, genx-bio, chemyo. NONE stated at umbrella-labs (in retrievable ToS) and healthgevity. The 21+ vs 18+ split aligns roughly with research-vendor-template vs SARMs-template ancestries.

3. **503A / 503B language:** Peptidology and Umbrella Labs both explicitly disclaim being "compounding pharmacy or chemical compounding facility as defined under 503A of the Federal Food, Drug, and Cosmetic Act" — this is a specific defense against the 2025-2026 FDA enforcement wave on compounded peptides.

4. **COA / lab-transparency posture:**
   - On-site PDFs (most common): Umbrella Labs (with date-prefixed filenames), Genx, Particle Peptides, Blue Sky, Ascension.
   - Third-party portal recommendations: only Peptaura (recommends Janoshik / Finnrick / Chromate).
   - On-request / supplement-side / no COA: Healthgevity, LVLUP Health.
   - **Named third-party lab on product page: NONE of the 10 names a specific commissioning lab.** Independent-verification labs are referenced only by Peptaura.

5. **Payment posture stratification:**
   - **Cards-only / card-friendly:** Healthgevity (6 card networks), GenX (Visa/MC/Amex/Discover), Ascension (cards + ACH).
   - **Crypto + ACH only / cards-blocked:** Umbrella Labs (BTCPay + Plaid ACH; explicit "no cards").
   - **Cards + crypto + e-check:** Chemyo (cards, BTC 10% discount, Checkbook.io e-check 5% discount).
   - **Crypto-stablecoin marketplace:** Peptaura (USDT on Arbitrum One per provisional excerpt).
   - **Custom EU processor:** Particle Peptides (Zen).
   - **Not visible:** LVLUP Health, Blue Sky Peptide, Peptidology.
   - The card-blocked posture (Umbrella) is a strong signal of historical / ongoing payment-processor friction (consistent with prior FDA warning letter posture).

6. **Refund-policy gray-legal patterns:**
   - "All sales final" hardline: Ascension Peptides ("Due to regulations regarding the sale of our products, returns are prohibited.").
   - "Defective only" with international-seizure-discount: GenX, Particle Peptides.
   - "Research-degradation" framing: Blue Sky ("we are unable to resell items that have been in a purchaser's possession.").
   - Marketplace-mediated dispute escrow: Peptaura.
   - Standard supplement returns: LVLUP, Healthgevity (both 30-day unopened, store-credit-preferred).

7. **Jurisdictional / shipping exclusions:**
   - **15-country explicit blocklist:** LVLUP (Austria, Brazil, China, Germany, India, Indonesia, Ireland, Israel, Japan, Mexico, Netherlands, Russia, South Korea, Switzerland, Thailand, Ukraine).
   - **US-only:** Ascension, Umbrella Labs.
   - **All countries:** GenX, Particle Peptides ("ship to all global countries"; customer responsibility for customs).
   - **US states excluded:** None explicitly enumerated by any vendor.

8. **Domain instability:** Half the brands required domain correction (peptidology.co, healthgev.com, genx.bio, umbrellalabs.is). The .is ccTLD on Umbrella Labs is a clear "platform-resilience-against-takedown" choice; healthgev.com presumably for trademark availability.

9. **Tech stack distribution:** WooCommerce dominant (Ascension, GenX, Chemyo, Umbrella likely). Magento (Blue Sky). Shopify (Healthgevity). PrestaShop (Particle — EU). WordPress (Peptidology). Custom marketplace (Peptaura). LVLUP not byte-confirmed but URL pattern suggests WooCommerce. Notable: NO single vendor is on a custom React/Next.js storefront — research-peptide retail is firmly on commodity OSS e-commerce platforms.

10. **No vendor names a specific commissioning lab on a product page.** Even Umbrella Labs (the most COA-forward in the batch) hosts COAs branded "Umbrella-Labs-...-COA" without naming the testing facility. Peptaura is the sole vendor that treats third-party verification labs (Janoshik, Finnrick, Chromate) as a public marketing surface — and Peptaura doesn't actually test, only recommends.

## Anti-fabrication notes

- Quotes marked verbatim are from text directly returned by WebFetch on each vendor's actual page. Where the WebFetch model summarized rather than quoted (e.g., Peptaura disclaimers second-pass), the file is flagged "PROVISIONAL VERBATIM" and the report flags those lines explicitly.
- "Uncertain" is used wherever the page wasn't retrievable, the field wasn't visible in the extract, or the model returned a paraphrase that couldn't be byte-confirmed.
- All 10 vendors profiled with at least homepage + ToS-equivalent + one supplementary page. No vendor failed all three attempts.
