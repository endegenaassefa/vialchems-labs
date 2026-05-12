---
batch: C
batch_label: PEPPAL secondary-tier
prepared_at: 2026-05-06T23:00Z
vendors_in_batch: 10
verbatim_capture_complete: 7
verbatim_capture_failed_anti_bot: 3
defunct_or_redirected_inputs: 2
raw_fetches_saved: 18
---

# Batch C — Compliance / Disclaimer / Legal-Posture Capture (PEPPAL secondary-tier)

This batch captures verbatim compliance language from 10 named secondary-tier
research-peptide vendors. The same per-vendor fields used in Batch A/B are
applied here: footer disclaimer, hero compliance, product-page disclaimer
(BPC-157 where available), ToS highlights, age gate, jurisdictional notice,
refund and shipping policy, COA hosting model, lab partner, batch/lot
transparency, payment methods, ID verification, tech-stack signal.

Anti-cheat note: per spec, only verbatim quotes are presented as compliance
language. Three vendors (Peptide Tech, Nuscience Peptides, Peptide Warehouse)
sit fully behind a Cloudflare managed-challenge gate that returns HTTP 403 to
non-JS clients. Per evidence rule 5 ("no anti-bot bypass"), no further attempts
were made; SERP-snippet intel for those three is summarized in raw fetches but
NOT presented here as verbatim compliance language. One additional vendor
(Skye Peptides) keeps its homepage and shop fully behind a login gate; the
public /test-reports/ page exposes the site footer disclaimer, which is
captured verbatim. Paradigm Peptides is captured but with strong status
caveats per the input directive.

---

## 1. Paradigm Peptides — paradigm-peptide.com

**Status:** **Live, but explicitly NOT the indicted entity.** Site states it has
no affiliation with paradigmpeptides.com / Paradigm Peptides LLC (the entity
whose owners Matthew Kawa and Jennifer Stechkober pled guilty Dec 10 2025 in
the Northern District of Indiana). DOJ source:
https://www.justice.gov/usao-ndin/united-states-v-matthew-kawa

Wayback fetch attempted but blocked at the environment level
("Claude Code is unable to fetch from web.archive.org"); pre-plea snapshot
not retrievable in this run.

### Footer / Homepage disclaimer (Verbatim)

> "*All products offered are solely for research and development purposes,
> not for human or animal consumption, medical, or therapeutic applications."

> "Our products should not be misconstrued or substituted as prescription drugs."

> "We do not dispense any prescription medications and are not a pharmacy."

> "The US Food and Drug Administration has not assessed the assertions made
> on our website."

> "Products are not intended to diagnose, treat, cure, or prevent any medical
> conditions or diseases."

### Affiliation disclaimer (Verbatim)

> "We have no affiliation with paradigm peptides LLC, paradigmpeptides.com or
> paradigmpeptidesllc.com"

> "They closed down two years ago and their website is still active but ghost."

### Hero compliance language

Same lines as homepage disclaimer; hero is the same block.

### Product page disclaimer (BPC-157)

`uncertain` — product page (e.g. /product/bpc-157) returned HTTP 404; product
links not exposed via the homepage path tried. Three attempts exhausted.

### ToS highlights re: research-use-only / age / jurisdictional / medical-claim / indemnification

`uncertain` — /policies/terms-of-service and other ToS-style paths returned
404. The homepage references "Terms and conditions" in nav but the page was
not reachable through the URLs probed. Capture FAILED for ToS.

### Age gate

`uncertain` — no age gate observed on the homepage; no terms page reached.

### Jurisdictional restriction notice

`uncertain` — none on homepage; no terms page reached.

### Refund policy

`uncertain` — /refund_policy 404.

### Shipping policy

`uncertain` — not surfaced on the homepage; no shipping page reached.

### COA hosting model

`uncertain` — not surfaced on homepage.

### Lab partner named

`uncertain` — none surfaced.

### Batch / lot transparency

`uncertain`.

### Payment methods

`uncertain`.

### ID verification

`uncertain`.

### Tech-stack signal

`uncertain` — no platform indicators on the homepage. The "Terms and conditions"
nav was the only policy-style link surfaced.

### Notes

- The currently-fetched paradigm-peptide.com (with hyphen) is a separate
  operator. The DOJ-indicted entity used paradigmpeptides.com (no hyphen).
- Wayback unreachable from this environment; pre-plea snapshot not captured.
  Per spec, this is documented as an attempt but not a fail of the three-attempt
  rule for the live site (which IS captured).

Raw artifacts:
- 03_raw_fetches/compliance_slice/paradigm-peptide__homepage.md

---

## 2. Peptide Partners — peptide.partners (vendor's actual TLD-as-name)

**Status:** Live. The input domain peptide-partners.com is a Squarespace
"under construction" placeholder. PepPal and search results confirm the
operating vendor uses peptide.partners.

### Footer / Homepage compliance (Verbatim)

> "FOR RESEARCH USE ONLY. NOT FOR USE IN DIAGNOSTIC PROCEDURES."

> "For research use only. Not for human or veterinary use."

> "For research use only. Checkout, payment, and account workflows are
> managed by WooCommerce."

### Hero compliance language

The two RUO lines above appear at hero and again at footer.

### Product page disclaimer (BPC-157)

> "For research use only. Not for human or veterinary use."

(BPC-157 product card on /shop/: "BPC-157 (10mg vials)" — "$106.00 – $780.00"
— "Sale!" — "Select options".)

### ToS highlights (Verbatim, from /terms-of-service/)

Research-use-only:
> "All products and product information provided by Peptide Partners are
> offered solely for lawful laboratory and in-vitro research use."

Permitted use:
> Products explicitly cannot be used for "therapeutic, diagnostic, food, drug,
> medical-device, cosmetic, commercial, or recreational purposes."

Age:
> "You must be at least 21 years old to place an order."

Buyer qualifications:
> Purchasers must be "qualified, properly trained research or laboratory
> professionals". Peptide Partners reserves authority to verify credentials
> and refuse sales.

Jurisdictional governance:
> Terms are "governed by Wyoming law, without giving effect to conflict-of-law
> principles."

Indemnification:
> "The purchaser agrees to indemnify and hold Peptide Partners harmless from
> claims, expenses, losses, and liabilities arising from the purchaser's
> handling, possession, or use of products."

Order finality:
> "All orders are final once submitted. No cancellations, returns, or refunds
> are available after submission unless required by law or expressly approved
> by Peptide Partners."

Medical-claim disclaimer (verbatim from source's negative construction):
> products are not "medicines or drugs and are not approved to diagnose,
> treat, cure, mitigate, or prevent any disease or medical condition."

### Age gate

Stated **21+ purchase requirement** in ToS. No age modal observed on homepage.

### Jurisdictional restriction notice

Wyoming choice-of-law (above). No explicit list of restricted jurisdictions
captured in the fetched content.

### Refund policy (Verbatim where quoted)

Final-sale clause:
> "Products are sold strictly for laboratory research, forensic analysis, or
> other qualifying non-human/non-veterinary purposes."

Damaged/incorrect: photo evidence within 48 hours; one-time replacement only,
no monetary refunds. EU exception: laboratory chemicals exempt from EU
Directive 2011/83/EU 14-day cooling-off period. Chargeback warning for
non-merit chargebacks (paraphrased in WebFetch summary; raw quoted text
above).

### Shipping policy

"Shipping: Monday through Friday only" (from contact block). Detailed
shipping page not separately captured in this run.

### COA hosting model (Verbatim)

> "All of the certificates that we provide can be validated on the third-party
> laboratory's website."

(Implication: dual-host model — PDFs on Peptide Partners' servers, validation
at the lab's site.)

### Lab partner named

**Four labs named verbatim:** Kovera, TrustPointe Analytics, Chromate, BioRegen.

### Batch / lot transparency

Per-batch certs across: purity (peptide name + batch ID + manufacturer + date
+ purity %), endotoxin (USP conformance), heavy metals (USP conformance),
sterility (USP + rapid). Manufacturer IDs visible in batch records (WF03,
VI32, SH07).

### Payment methods

Per footer: "Checkout, payment, and account workflows are managed by
WooCommerce." Specific card brands / crypto support not enumerated on the
pages captured.

### ID verification

Reserves right to "verify credentials and refuse sales" per ToS. No ID-upload
flow observed; gate is policy-level not technical.

### Tech-stack signal

**WooCommerce** — explicit footer attribution.

Raw artifacts:
- 03_raw_fetches/compliance_slice/peptide-partners__homepage.md
- 03_raw_fetches/compliance_slice/peptide-partners__terms.md
- 03_raw_fetches/compliance_slice/peptide-partners__refund.md
- 03_raw_fetches/compliance_slice/peptide-partners__certifications.md
- 03_raw_fetches/compliance_slice/peptide-partners__bpc157.md

---

## 3. Pivot Labs — pivotlabsglobal.com (input pivot-labs.com is wrong — redirects to unrelated SaaS)

**Status:** Live. Input "pivot-labs.com" 301-redirects to pivotpricing.com
(an unrelated pricing-software company). The peptide vendor's canonical domain
is pivotlabsglobal.com — confirmed via PepPal affiliate redirect
(peppal.app/go/pivot-labs → pivotlabsglobal.com).

### Footer / Homepage disclaimer (Verbatim)

> "All products offered by Pivot Labs are intended strictly for research and
> development purposes only."

> "These products are not approved for human consumption, medical use, or
> therapeutic application of any kind."

> "The statements on this website have not been evaluated by the U.S. Food
> and Drug Administration (FDA), and none of our products are intended to
> diagnose, treat, cure, or prevent any disease."

> "Pivot Labs is not a compounding pharmacy, chemical compounding facility,
> or outsourcing facility as defined under Sections 503A and 503B of the
> Federal Food, Drug, and Cosmetic Act."

> "All products are sold exclusively for laboratory, research, or analytical
> use."

### Hero compliance language

Same as above (homepage block).

### User-acknowledgment language (Verbatim)

> "By purchasing or using products from Pivot Labs, you acknowledge and agree
> that they will be used solely for lawful research purposes and in compliance
> with all applicable regulations. You also accept full responsibility for
> the handling, storage, and use of these materials."

### Product page disclaimer (BPC-157)

`uncertain` — individual product page not retrieved in this batch.

### ToS highlights re: research-use-only / age / jurisdictional / medical-claim / indemnification

ToS page not separately captured. The homepage's user-acknowledgment block
and the 503A/503B classification serve as the principal compliance posture.

### Age gate

`uncertain` — no age statement observed on the homepage.

### Jurisdictional restriction notice

`uncertain` — none observed on the homepage. The user-acknowledgment block
shifts responsibility to the buyer ("compliance with all applicable
regulations") without enumerating restricted jurisdictions.

### Refund policy

`uncertain`.

### Shipping policy

`uncertain`.

### COA hosting model

`uncertain` from homepage capture.

### Lab partner named

`uncertain`.

### Batch / lot transparency

`uncertain`.

### Payment methods

`uncertain`.

### ID verification

`uncertain`.

### Tech-stack signal

`uncertain` — homepage not deep-probed for platform fingerprints.

### Footer (Verbatim)

> "Pivot Labs Global | 20200 W Dixie Hwy Miami, FL 33180 |
> transform@pivotlabsglobal.com | (786) 321-2494"

Raw artifacts:
- 03_raw_fetches/compliance_slice/pivot-labs__homepage.md

---

## 4. Orbitrex Peptides — orbiitrexpeptides.com (note: double-i)

**Status:** Live. Input "orbitrex-peptides.com" returned ECONNREFUSED (does
not resolve). Multiple satellite/copycat domains exist (orbitrexspeptide.com,
orbitrexpeptideslabs.com, orbitrexpeptidesco.com, orbitrexpeptide.is). Selected
orbiitrexpeptides.com as the canonical vendor — full T&Cs, shipping policy,
and product pages reachable; consistent footer.

### Footer / Homepage compliance (Verbatim)

> "All products are manufactured for research use only."

> "Every batch undergoes independent testing by certified labs. No exceptions."

> "Every research peptide from Orbitrex Peptides Shop Online includes a
> Certificate of Analysis (COA) from trusted third-party analytical labs,
> verifying both purity and content accuracy."

> "Synthesized in USA-registered facilities following Good Manufacturing
> Practices. Full chain of custody documentation base in the USA."

> "Research-grade peptides with verified potency. Each product includes
> certificates of analysis."

Footer copyright: > "Copyright © 2026 Orbitrex Peptides"
Phone: > 605 801-0723; Email: > sales@orbiitrexpeptides.com

### Hero compliance language

The "research use only" line appears at hero level alongside the
"Synthesized in USA-registered facilities…" claim.

### Product page disclaimer (BPC-157, /product/bpc-157/)

> "For research use only"

> "Not for human consumption, medical, or veterinary use"

Intended for: > "Licensed researchers, laboratories, and scientific institutions"

Quality block: > "Each vial of BPC-157 10mg undergoes rigorous testing and
validation, with 3rd-Party Certificates of Analysis (COAs) provided for
transparency and assurance."

BPC-157 10mg list price: $39.99. Three batches displayed publicly with purity
98.83%–99.49% and endotoxin <0.05 EU/ml. Storage: > "Store at -20°C for
long-term stability; refrigerate at 2–8°C after reconstitution."

### ToS highlights (Verbatim, from /terms-conditions/)

Research-use:
> "All products available on this Website are sold strictly for research and
> laboratory purposes only."

Age:
> "By using this Website, you confirm that you are at least 18 years old."

Non-medical:
> Products are "Not for human consumption" and "Not for medical, diagnostic,
> or therapeutic use."

Jurisdictional:
> Governed by "the laws of the United States." Customers must ensure
> products can be legally imported to their location.

Indemnification:
> Users agree to "indemnify and hold harmless Orbitrex Peptides Lab from any
> claims, damages, or expenses arising from" product misuse, term violations,
> or legal breaches.

FDA:
> Products are "Not approved by the FDA unless explicitly stated."

### Age gate

Stated **18+ purchase requirement** in T&Cs. No modal age gate observed.

### Jurisdictional restriction notice

Buyer-responsibility model — buyer must ensure legal-import compliance.

### Refund policy (Verbatim where quoted)

> "Orders may be canceled within 1 hour of placement" via email only.

Damaged/Defective: contact within 72 hours with order number and photos;
replacements / partial refunds / store credit at company discretion.

Refund eligibility: products must be > "unused, unopened, untampered, and
in its original packaging" — request within 30 calendar days of delivery.

Non-refundable: opened, used, improperly stored; ordering errors; claims
after 30 days.

### Shipping policy (Verbatim)

> "Orders are typically packed and handed off to the selected carrier within
> 36 hours"

> "UPS 2nd Day Air … typically arrive within two business days after shipment"
> (free over $200)

> "FedEx 2Day … typically arriving within two business days after shipment"
> (free over $200)

> USPS Priority Mail used only for customers outside UPS service areas or
> with PO Boxes.

Route package protection at checkout.

### COA hosting model

Per-product, per-batch COAs displayed inline on product pages, links to
third-party labs (specific lab not named on the BPC-157 page captured).

### Lab partner named

`uncertain` — Orbitrex states "third-party analytical labs" generically; no
specific lab brand surfaced on the pages captured.

### Batch / lot transparency

Per-batch purity and endotoxin numbers visible publicly per product (e.g.,
three BPC-157 batches at 98.83%-99.49% with <0.05 EU/ml endotoxin).

### Payment methods

`uncertain` from the captures (checkout-only).

### ID verification

`uncertain` — none surfaced.

### Tech-stack signal

WooCommerce-style URL patterns (/product/, /shop/, /terms-conditions/,
/shipping-and-return-policy/) suggest WordPress + WooCommerce; not
explicitly attributed in footer.

Raw artifacts:
- 03_raw_fetches/compliance_slice/orbitrex-peptides__homepage.md
- 03_raw_fetches/compliance_slice/orbitrex-peptides__terms.md
- 03_raw_fetches/compliance_slice/orbitrex-peptides__shipping_returns.md
- 03_raw_fetches/compliance_slice/orbitrex-peptides__bpc157.md

---

## 5. Peptide Tech — peptidetech.co (input peptide-tech.com is dead)

**Status:** Cloudflare-gated. Input "peptide-tech.com" returned ECONNREFUSED.
The actual peptide vendor is at **peptidetech.co**. All three attempts
(WebFetch homepage, WebFetch /privacy-policy/, curl direct) returned a
Cloudflare managed-challenge HTTP 403 ("Just a moment…" interstitial). Per
spec rule 5 (no anti-bot bypass), no further attempts. **Verbatim capture
FAILED.**

### Footer / Homepage / Product disclaimer

`fetch_status: failed` — Cloudflare managed challenge blocks non-JS clients.
SERP-snippet phrases (paraphrased, NOT verbatim) are noted in the raw
artifact but cannot be cited as compliance language here.

### ToS highlights / Age / Jurisdictional / Indemnification / Refund / Shipping / COA / Labs / Payment / ID / Tech

`uncertain` — content gated. Snippet-level inferences exist but per the
verbatim-only rule are not promoted into this section.

Raw artifacts:
- 03_raw_fetches/compliance_slice/peptide-tech__homepage.md (failure log + snippet intel)

---

## 6. Polaris Peptides — polarispeptides.com

**Status:** Live. Members-only model — full shop access requires registration,
but the homepage compliance copy and registration interstitial are public.

### Footer / Homepage compliance (Verbatim)

> "all products are sold purely for research purposes only"

> "Our chemicals are crafted for research and/or investigative purposes and
> are not suitable for direct human consumption."

> "Our chemicals are crafted for research and/or investigative purposes and
> are not suitable for direct human consumption or consumers, nor are they
> intended for clinical or therapeutic use."

> "The information and statements provided by Polaris Peptides have not been
> assessed by the US Food and Drug Administration."

> "Products listed on this website are not intended to diagnose, treat, cure,
> or prevent any disease."

> "The statements and chemicals listed on this website are not intended to
> diagnose, treat, cure, or prevent any disease."

> "Polaris Peptides is a chemical supplier. Polaris Peptides is not a
> compounding pharmacy or chemical compounding facility as defined under
> 503A of the Federal Food, Drug, and Cosmetic act."

Footer: > "© 2026 Polaris Peptides. All Rights Reserved."

### Hero compliance language

Same lines (research-use, FDA non-assessment, 503A clause).

### Membership / access gate (Verbatim)

> "Polaris Peptides is now members only. Please sign in to your account or
> sign up for a new account to enter the site."

### Age gate (Verbatim)

> "You must be 21 years old or older in order to access our website."

### Product page disclaimer (BPC-157)

`uncertain` — shop is gated behind login; product pages not retrievable
without account.

### ToS highlights re: research-use-only / age / jurisdictional / medical-claim / indemnification

The homepage and registration interstitial enumerate the research-use,
age (21+), FDA, and 503A clauses verbatim above. Buyer registration
requires confirmation: > "understand that all products are sold purely for
research purposes only."

Standalone /terms-of-service/ page not surfaced from the public-facing path
captured.

### Jurisdictional restriction notice

`uncertain` — not surfaced from public pages.

### Refund policy

Money-back guarantee referenced; details on a separate (gated) page,
not captured.

### Shipping policy

`uncertain`.

### COA hosting model

`uncertain` — gated.

### Lab partner named

`uncertain`.

### Batch / lot transparency

`uncertain` — gated.

### Payment methods

`uncertain` — checkout gated.

### ID verification

Registration includes business-type categorization (verbatim categories):
- Research Lab/Institution
- University
- Medical Facility
- Other

This is a self-attested classification, not a documentary ID step.

### Tech-stack signal

`uncertain` — public surface has no obvious platform fingerprint.

Raw artifacts:
- 03_raw_fetches/compliance_slice/polaris-peptides__homepage.md

---

## 7. Skye Peptides — skyepeptides.com

**Status:** Live, but **shop and homepage are fully gated behind WooCommerce
login.** A shop browse / age gate is not visible because the entry page is the
login form. The public **/test-reports/** page does render and includes the
site's footer disclaimer block — that is the verbatim capture below.

### Footer disclaimer (Verbatim, from /test-reports/)

> "Please note that all products featured on this website are intended
> exclusively for research and development purposes. They are not designed
> for any form of human consumption. The claims made on this website have
> not undergone evaluation by the U.S. Food and Drug Administration. Neither
> the statements nor the products of this company aim to diagnose, treat,
> cure, or ward off any disease. Skye Peptides is a chemical supplier. Skye
> Peptides is not a compounding pharmacy or chemical compounding facility as
> defined under 503A of the Federal Food, Drug, and Cosmetic act. Skye
> Peptides is not an outsourcing facility as defined under 503B of the
> Federal Food, Drug, and Cosmetic act."

Footer address (Verbatim):
> "Skye Research, 11400 West Olympic Blvd, Los Angeles, CA 90064
> +1 424-294-0603"

Footer copyright (Verbatim):
> "© Skye Peptides 2026. All rights reserved"

Footer link sections (Verbatim labels):
- "Useful links": Homepage, About Us, Shop Peptides, Lab Results, Contact Us, Wholesale
- "Legal obligations": Shipping and Payments, Terms and Conditions, Refund and Returns Policy, Privacy Policy

### Hero compliance language

`uncertain` — homepage is the login form. No hero section visible publicly.

### Test-Reports page header (Verbatim)

> "We send every batch of peptide to a third party lab for testing. Testing
> includes peptide validation, purity, and quantification. Analysis is done
> by HPLC. All manufacturers are tested for sterility."

### Product page disclaimer (BPC-157)

`uncertain` — product page gated behind login. Multiple BPC-157 batches
visible on /test-reports/ (BPC25-10-001 99.9% / 0.016 EU/mg; BPC25-20-003
99.9% / 0.005 EU/mg; BPC25-05-002 99.7% / 0.100 EU/mg).

### ToS highlights / Age / Jurisdictional / Indemnification

`uncertain` — Terms and Conditions page returns the gated login HTML
(HTTP 200 but content is the login screen, 65,459 bytes consistent across
the gated paths).

### Age gate

`uncertain` from the public surface (login form is the gate).

### Refund policy / Shipping policy

`uncertain` — gated.

### COA hosting model

**Public per-batch test reports on the vendor's own /test-reports/ page.**
External "Test Report | HPLC" / "Endotoxin" / "Sterility" / "Heavy Metal"
links per batch, with verify.janoshik.com referenced for verification.

### Lab partner named

**Janoshik Analytical** — verify.janoshik.com referenced for batch
verification across the test-reports page.

### Batch / lot transparency

**Strong public batch-level transparency** even though shop is gated.
Examples observed: "GLOW" GHK-Cu/TB-500/BPC-157, "KLOW" KPV/GHK-Cu/TB-500/
BPC-157, "2X"/"3X"/"4X" Tesamorelin-based blends, Adamax, AOD-9604, ARA-290,
5-Amino-1-MQ, AHK-Cu, MOTS-c, Retatrutide, plus per-batch endotoxin numbers.

### Payment methods

`uncertain` — checkout gated.

### ID verification

`uncertain` — registration flow not exercised. Login form is public; ID-flow
is post-registration.

### Tech-stack signal

**WordPress + WooCommerce-compatible theme** — wp-json schema URLs visible;
"xoo-wsc-footer" cart side-cart plugin observed; UpSolution / "us-global-
settings" theme indicator present.

Raw artifacts:
- 03_raw_fetches/compliance_slice/skye-peptides__homepage.md

---

## 8. Nuscience Peptides — nusciencepeptides.com

**Status:** Cloudflare-gated. Three direct fetch attempts (WebFetch homepage,
WebFetch /terms-and-conditions/, curl direct) all returned a Cloudflare
managed-challenge HTTP 403. Per spec rule 5, no further attempts. **Verbatim
capture FAILED.**

A near-twin domain "nusciencepeptide.com" (singular) also exists in PepPal/
SERP results and may be a separate operator or a reseller — not selected.

### Footer / Homepage / ToS / Refund / Shipping / Product disclaimer

`fetch_status: failed` — content gated. SERP-snippet intel exists but per
the verbatim-only rule is not promoted into this section.

Raw artifacts:
- 03_raw_fetches/compliance_slice/nuscience-peptides__homepage.md (failure log + snippet intel)

---

## 9. Peptide Warehouse — peptideswarehouse.com (input peptidewarehouse.com is wrong)

**Status:** Cloudflare-gated. Input "peptidewarehouse.com" (no "s") is not the
operator. The live US peptide vendor is at **peptideswarehouse.com** (with "s").
Three fetch attempts (WebFetch homepage, WebFetch /terms-service/, curl direct)
all returned a Cloudflare managed-challenge HTTP 403. Per spec rule 5, no
further attempts. **Verbatim capture FAILED.**

### Footer / Homepage / ToS / Refund / Shipping / Product disclaimer

`fetch_status: failed`. SERP snippets reference standard RUO + 18-or-jurisdiction
language but cannot be cited verbatim.

Raw artifacts:
- 03_raw_fetches/compliance_slice/peptide-warehouse__homepage.md (failure log + snippet intel)

---

## 10. ResearchChemical — researchchemical.com

**Status:** Live and accessible.

### Footer (Verbatim)

> "1145 N Colony Rd, Ste 3 #1010, Wallingford, CT 06492, United States"
> "959-333-0983"
Footer links: Terms of Service, Privacy Policy, Legal
Copyright: > "©2026 Research Chemical Ltd."

### Hero / Homepage compliance (Verbatim)

> "The peptides for sale are for laboratory developmental research use only.
> Products are not for human consumption."

> "One characteristic of a research chemical is that it is for laboratory
> research use only; the Peptides for sale on this website are not dietary
> supplements or muscle growth supplements for fitness enthusiasts and are
> not for consumer use."

> "The statements made within this website have not been evaluated by the US
> Food and Drug Administration. The statements and the products of this
> company are not intended to diagnose, treat, cure or prevent any disease."

> "All products offered by Research Chemical are intended strictly for
> laboratory research use and are not for human or animal consumption.
> These compounds are not approved by the FDA for dietary, cosmetic, or
> therapeutic use."

### Product page disclaimer (BPC-157, /products/bpc-157)

> "not intended for human or animal consumption"

> "not for human consumption"

> "not intended to diagnose, treat, cure or prevent any disease"

> Supplied "exclusively for scientific and analytical research use"

Price: $54.99 ("Big Winter Deal"). 5mg lyophilized vial. Purity claim:
"98% Purity, Lab-Tested, USA Bottled". Third-party tester named:
**MZ Biolabs** ("99.85%" purity, dated 07/03/2025).

### ToS highlights (Verbatim, from /pages/terms-of-service)

Research-use:
> "The products we offer are intended for laboratory research use only."
> "for RESEARCH purposes ONLY"
> "NOT for use as food additives, drugs, cosmetic, household chemicals, or
> other inappropriate applications."

Age:
> "All customers MUST be at least 18 years of age to purchase our products."

Medical-claim:
> "Under NO circumstances shall/should ANY of these materials be used for
> therapeutic or diagnostic purposes."
> "The peptides for sale are for laboratory developmental research use only.
> Products are not for human consumption."

Indemnification:
> "agrees to indemnify and hold Research Chemical harmless from all claims,
> expenses, losses and liability of any nature whatsoever arising out of
> purchasers handling and/or use of purchased product."

Jurisdictional:
> "This site is international and has international visitors. Research
> Chemical relies on each client to know the requirements of their own
> region and purchase accordingly," — including VAT, taxes, import
> certifications, licenses.

Institutional warranty:
> Purchasers warrant affiliation "with a laboratory, institution, university
> or other research based facility" — purchasing without such affiliation is
> "a fraudulent act."

### Age gate

Stated **18+ purchase requirement** in ToS. No modal age gate observed on
homepage.

### Jurisdictional restriction notice

Buyer-responsibility model (verbatim above) — buyer responsible for VAT,
taxes, import certifications, licenses.

### Refund policy

Per BPC-157 product page: "free returns and 60-day refund/replacement
policy". Standalone /pages/refund-policy not separately fetched in this run.

### Shipping policy (Verbatim where quoted)

> "Next day shipping available" from US fulfillment center.
> "Processing within 24 business hours."
> Free shipping on orders $149+.
> Temperature-controlled packaging with ice packs.

### COA hosting model

Per-product COAs available via /products/bpc-157 page (third-party COA cited:
MZ Biolabs, dated 07/03/2025, 99.85%).

### Lab partner named

**MZ Biolabs** (named on the BPC-157 product page).

### Batch / lot transparency

Per-product third-party COA cited inline; specific lot identifier not surfaced
on the captured page.

### Payment methods

> Credit/debit cards via secure gateway
> E-Check payments
> Cash App transfers
> Cryptocurrency (mentioned)

### ID verification

`uncertain` — Terms require institutional affiliation by warranty, but no
documentary verification step is described.

### Tech-stack signal

URL pattern `/pages/terms-of-service` and `/products/bpc-157` is **Shopify**-
style. NitroCDN observed for image optimization. No explicit Shopify badge,
but URL structure is consistent with Shopify storefront.

Raw artifacts:
- 03_raw_fetches/compliance_slice/researchchemical__homepage.md
- 03_raw_fetches/compliance_slice/researchchemical__terms.md
- 03_raw_fetches/compliance_slice/researchchemical__bpc157.md

---

# Summary

## Capture status table

| # | Vendor | Domain (resolved) | Status | Verbatim home | Verbatim ToS | Verbatim BPC-157 | COA host | Lab partner |
|---|---|---|---|---|---|---|---|---|
| 1 | Paradigm Peptides | paradigm-peptide.com | live, NOT the indicted entity | yes | no (404) | no (404) | uncertain | none surfaced |
| 2 | Peptide Partners | peptide.partners | live | yes | yes | partial | dual-host | Kovera, TrustPointe Analytics, Chromate, BioRegen |
| 3 | Pivot Labs | pivotlabsglobal.com | live | yes | partial (homepage acknowledgment block only) | not retrieved | uncertain | none surfaced |
| 4 | Orbitrex Peptides | orbiitrexpeptides.com (note double-i) | live | yes | yes | yes | per-product COA | none named (generic "third-party") |
| 5 | Peptide Tech | peptidetech.co | Cloudflare-gated, FAIL | no | no | no | uncertain | uncertain |
| 6 | Polaris Peptides | polarispeptides.com | live, members-only | yes | partial (homepage interstitial only) | gated | gated | uncertain |
| 7 | Skye Peptides | skyepeptides.com | live, login-gated | footer only (via /test-reports/) | gated | gated | own-site batch reports | Janoshik Analytical |
| 8 | Nuscience Peptides | nusciencepeptides.com | Cloudflare-gated, FAIL | no | no | no | uncertain | uncertain |
| 9 | Peptide Warehouse | peptideswarehouse.com | Cloudflare-gated, FAIL | no | no | no | uncertain | uncertain |
| 10 | ResearchChemical | researchchemical.com | live | yes | yes | yes | per-product COA | MZ Biolabs |

## Vendors that failed all 3 attempts (verbatim capture)

- **Peptide Tech** (peptidetech.co) — Cloudflare managed challenge.
- **Nuscience Peptides** (nusciencepeptides.com) — Cloudflare managed challenge.
- **Peptide Warehouse** (peptideswarehouse.com) — Cloudflare managed challenge.

For all three, fetch_status: failed. SERP-snippet intel logged in raw
fetches but explicitly not promoted as verbatim per spec.

## Vendors confirmed defunct or not the input entity

- **Paradigm Peptides input domain**: paradigmpeptides.com (the DOJ-indicted
  entity per US v. Matthew Kawa, NDIN, Dec 10 2025 guilty plea). The current
  paradigm-peptide.com (with hyphen) is a *separate* operator that explicitly
  states it has no affiliation with paradigmpeptides.com. Wayback snapshot
  from before the plea was attempted but Claude Code is unable to fetch from
  web.archive.org in this environment; not retrievable here.
- **peptide-partners.com** (input domain) → Squarespace "under construction"
  placeholder. The live vendor is at peptide.partners.
- **pivot-labs.com** (input domain) → 301-redirects to pivotpricing.com (an
  unrelated SaaS). The live vendor is at pivotlabsglobal.com.
- **orbitrex-peptides.com** (input domain) → ECONNREFUSED (does not resolve).
  The live vendor is at orbiitrexpeptides.com (note double-i).
- **peptide-tech.com** (input domain) → ECONNREFUSED. The vendor is at
  peptidetech.co (but Cloudflare-gated, see above).
- **peptidewarehouse.com** (input domain, no "s") → not the operator. The
  vendor is at peptideswarehouse.com.

## Cross-vendor pattern observations

1. **503A/503B disclaimer is near-universal** across the vendors that could
   be captured: Polaris, Pivot Labs, Skye all use it; ResearchChemical does
   not on the homepage but adopts the equivalent "for RESEARCH purposes
   ONLY" framing. (Peptide Partners doesn't surface a 503A clause on the
   pages captured.)
2. **Age threshold splits 18 vs 21.** 21+: Peptide Partners (ToS), Polaris
   (homepage gate). 18+: Orbitrex (T&Cs), ResearchChemical (ToS). Three
   vendors gated/failed: unknown. Pivot Labs and Paradigm: no age statement
   surfaced.
3. **Three of ten vendors (30%) sit fully behind Cloudflare managed
   challenges** that block non-JS, non-headless clients. This is a notable
   shift from Batch A/B's bigger-name vendors and suggests a defensive
   posture against compliance-style scraping.
4. **Two of ten (20%) gate the entire shop behind login or membership**
   (Polaris, Skye). Skye's compliance footer is the only public verbatim
   item retrievable.
5. **Lab partner naming is uneven.** Peptide Partners names four labs
   verbatim (Kovera, TrustPointe Analytics, Chromate, BioRegen); Skye names
   Janoshik Analytical via verify.janoshik.com; ResearchChemical names MZ
   Biolabs on the BPC-157 page; Orbitrex says "third-party analytical labs"
   without naming.
6. **Tech-stack splits by URL pattern:** WooCommerce explicit (Peptide
   Partners footer; Skye theme + plugin signals); Shopify-pattern URLs
   (ResearchChemical /pages/, /products/); WordPress + WooCommerce
   structural patterns (Orbitrex /product/, /shop/). Pivot Labs, Polaris,
   Paradigm, and the three Cloudflare-gated vendors not classified.
7. **Domain-twin / look-alike risk is high in this batch.** Six of the ten
   input domains were either dead, unrelated, or one character off the
   actual operator. This is consistent with a rapidly churning grey-market
   landscape.

## File path index

- Output (this file):
  /mnt/c/Users/endeg/Documents/peptide-research/peptide-research_cli/02_claude_code_outputs/compliance_disclaimers/batch_c__disclaimers.md
- Raw fetches directory:
  /mnt/c/Users/endeg/Documents/peptide-research/peptide-research_cli/03_raw_fetches/compliance_slice/
- Raw fetches saved (18):
  - paradigm-peptide__homepage.md
  - peptide-partners__homepage.md
  - peptide-partners__terms.md
  - peptide-partners__refund.md
  - peptide-partners__certifications.md
  - peptide-partners__bpc157.md
  - pivot-labs__homepage.md
  - orbitrex-peptides__homepage.md
  - orbitrex-peptides__terms.md
  - orbitrex-peptides__shipping_returns.md
  - orbitrex-peptides__bpc157.md
  - peptide-tech__homepage.md (failure log)
  - polaris-peptides__homepage.md
  - skye-peptides__homepage.md
  - nuscience-peptides__homepage.md (failure log)
  - peptide-warehouse__homepage.md (failure log)
  - researchchemical__homepage.md
  - researchchemical__terms.md
  - researchchemical__bpc157.md
