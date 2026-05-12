# Batch D — Additional Retail + Posture-Reference Verification

Access date for all entries: **2026-05-06**

---

## Part A — Additional retail vendors

### nextchems (NextChems)

- **Domain:** nextchems.com (HTTP 200, WordPress)
- **Status:** Active retail vendor

**Footer disclaimer (verbatim):**
"© NextChems. All rights reserved"
(Footer is minimal — copyright only; substantive compliance language lives in the homepage testing block, ToS, and product pages.)

**Hero compliance:**
No "research use only," "not for human consumption," or "not FDA approved" language appears in the homepage hero/banner. Compliance is pushed to ToS and product pages.

**Product page disclaimer (BPC-157, /product/bpc-157/) — verbatim:**
"The content presented above is not meant to replace professional medical advice, diagnosis, or treatment. If you have inquiries regarding a medical condition, it is recommended that you seek guidance from a qualified healthcare provider or physician. Under no circumstances should medical advice be ignored or postponed due to what you have read or observed. We hold no responsibility or liability for the utilization of our research compounds and products. Please note that our products are exclusively intended for research purposes, and we do not condone personal use."

**ToS compliance highlights (verbatim):**
- "Products on the website are sold for research and laboratory use only and should not be used for cosmetic, food additive, chemical, drug, or other applications"
- Prohibits oral consumption, human/animal injections, drugs/food/cosmetics use, athletic competition, and any use violating local laws
- "Customers must be at least 21 years old"
- Customers are "responsible for being knowledgeable about government regulations regarding product use"
- "Next Chems shall not be held responsible for any special, incidental, or consequential damages arising from the purchase of their products"

**Age gate:** 21+ (in ToS, not a hard splash gate)

**Jurisdictional restriction:** None explicit on homepage. ToS punts compliance responsibility to customer.

**Refund / shipping policy:**
- 7-day return window (unopened items)
- 15% restocking fee
- Customer pays return shipping
- $25 processing fee for cancellations
- No refunds for wrong customer-supplied addresses
- Once handed to logistics, "company has no control over it"
- Quality guarantee: HPLC-test-and-refund offer

**COA hosting model:** Public PDF hosted on own WordPress media library. Inline link on product page: "Independent Test Results: Click Here" → `nextchems.com/wp-content/uploads/2025/09/NC-Lab-Results-BPC-157-min.pdf`

**Lab partner named:** No. Vague "any HPLC licensed testing laboratory" + own internal HPLC.

**Batch / lot transparency:** Implied via per-SKU PDF, but batch IDs not surfaced on the public BPC-157 product page.

**Payment methods:** "We Accept:" image asset (`Nextchems-Payment-Option.webp`); specific card brands not enumerated in returned markup.

**ID verification:** None mentioned. Just self-attested 21+ in ToS.

**Tech stack signal:** WordPress (paths like `/wp-content/uploads/...`); no Shopify/WooCommerce/Next.js indicators in returned markup.

**Notable:** BPC-157 sold in **capsule form** (60 caps × 0.5mg), price $85.95 (down from $114.95). The capsule format is a strong posture signal — most peer vendors sell only lyophilized vials.

**Raw fetches:**
- `03_raw_fetches/compliance_slice/nextchems__homepage.md`
- `03_raw_fetches/compliance_slice/nextchems__bpc157_product.md`
- `03_raw_fetches/compliance_slice/nextchems__terms.md`

---

### felix-chem (Felix Chemical Supply, dba Chem-LLC)

- **Domain:** felixchem.is (HTTP 200, WordPress)
- **Status:** Active retail vendor; **gated behind 21+ login wall** before any product/policy content

**Footer disclaimer:** Not visible on public-facing pages (login wall blocks).

**Hero / pre-login splash compliance (verbatim):**
- "You Must Be 21 To Login"
- "By accessing our site, you confirm you are 21+ years old."

**Compliance language (verbatim, search-surfaced from pre-gate-hardening Google index of site pages):**
- "ALL PRODUCTS ARE INTENDED AS RESEARCH CHEMICALS ONLY FOR AGES 21+ AND I AM OVER 21 YEARS OLD"
- "BY PURCHASING FROM FELIXCHEM YOU AGREE THAT YOU ARE PURCHASING RESEARCH CHEMICALS. FELIXCHEM PRODUCTS ARE FURNISHED FOR LABORATORY RESEARCH USE ONLY. THIS PRODUCT SHOULD ONLY BE HANDLED BY QUALIFIED, AND LICENSED PROFESSIONALS."
- "NOT FOR HUMAN CONSUMPTION, NOR MEDICAL, VETERINARY, OR HOUSEHOLD USES."
- "The products may not be used as a drug, agricultural or pesticidal product, food additive or household chemical, and bodily introduction of any kind into humans and/or animals is strictly forbidden by law."
- "This distinction is required on the labels of research chemicals, and is what exempts them from regulation under Parts 100-740 in Title 21 of the Code of Federal Regulations (21CFR)."
- "In compliance with federal, state, and local laws, [we] cannot provide any information or instructions regarding their products."

**Product page disclaimer (BPC-157):** Inaccessible without login. Not captured.

**ToS:** /terms-of-service and /privacy-policy paths return 404; ToS likely lives only behind login.

**Age gate:** **Hard splash gate at 21+ AND mandatory account login** before any catalog, policy, or compliance page is reachable. This is the most aggressive gating posture in the batch.

**Jurisdictional restriction:** "USA only" per third-party reviews.

**Refund / shipping policy:** Inaccessible.

**COA hosting model:** Per third-party reviews, "All products are independently tested by a US-based third party laboratory." "Quantitative and qualitative analysis provided on all products" — and "as of November 2025, endotoxin testing is also included." Specific lab partner not named in surfaced excerpts.

**Lab partner named:** Not surfaced.

**Batch / lot transparency:** Per third-party reviews: "send randomized blind samples to an independent third-party laboratory for testing." Suggests blind-sample model, not per-batch.

**Payment methods:** Not surfaced.

**ID verification:** Account creation required; depth of verification unknown without bypassing the gate (which we will not do per anti-cheat rule #5).

**Tech stack signal:** WordPress (`/wp-content/uploads/`).

**Notable:**
- DBA: **Chem-LLC** (legal entity)
- Founded: 2022
- 100% American-owned and operated; partners with international synthesis labs
- Aggressive gating (21+ splash + login wall) is the most distinctive posture in this batch

**Raw fetches:**
- `03_raw_fetches/compliance_slice/felix-chem__homepage.md`
- `03_raw_fetches/compliance_slice/felix-chem__search_disclosure.md`

---

### apollo-peptide-sciences (Apollo Peptide Sciences)

- **Domain:** apollopeptidesciences.com (HTTP 200, WordPress)
- **Status:** Active retail vendor
- **Legal entity:** Apollo Peptide Sciences LLC, 1000 Town Center Drive, Suite 300 #1043, Oxnard CA 93036

**Footer disclaimer (verbatim):**
- "The statements made within this website have not been evaluated by the US Food and Drug Administration. The statements and the products of this company are not intended to diagnose, treat, cure or prevent any disease."
- "All products are sold for research, laboratory, or analytical purposes only, and are not for human consumption."

**Hero compliance (verbatim):**
- "Not for Human Consumption"
- "For Research Use Only"
- "All products are intended strictly for laboratory research purposes only"

**Product page disclaimer (BPC-157 10mg, /product/bpc157-10mg/) — verbatim:**
- "All products currently listed on this site are for research purposes ONLY."
- "All products sold on this website are intended for research and identification purposes only. These products are not intended for human dosing, injection, or ingestion."
- "All products are sold for research, laboratory, or analytical purposes only, and are not for human consumption. Strictly forbidden for bodily introduction into humans or animals."

Price: **$59.99** for 10mg lyophilized powder.

**ToS compliance highlights (verbatim):**
- "All products sold by Apollo Peptide Sciences are intended strictly for laboratory research purposes only."
- "any suggestion, statement, or implication — written, verbal, or visual — of human consumption, self-administration, or dosing." (this is what they prohibit)
- "Access to Apollo Peptide Sciences is strictly limited to qualified professionals, research institutions, laboratories, and organizations."
- "All products are sold 'as is' without any guarantees of purity, efficacy, or suitability for any specific research application."
- Liability: "any direct, indirect, incidental, or consequential damages resulting from the use, misuse, or misinterpretation of our products" disclaimed
- Apollo "reserves the right to revoke or suspend membership without prior notice" for violations

**Age gate (verbatim):** "By accessing this website, you certify that you are at least 21 years of age and agree to the following terms"

**Jurisdictional restriction:** Terms "governed by the laws of the State of California" with jurisdiction in Oxnard, CA. Shipping is **USA only**.

**Refund / shipping policy:**
- Returns within 30 days of order placement; beyond 30 days no refund or exchange
- Products must be unused, in original packaging, with proof of purchase
- "Opened or used product is unable to be returned due to the nature of research peptides"
- No restocking fees mentioned; return shipping cost responsibility not specified
- Shipping: USA only; USPS Priority (standard, $9.99 flat) / UPS expedited; FREE shipping over $200; orders ship within 24 hours of cleared payment, Mon–Sat, 2pm EST cutoff

**COA hosting model:** Per About Us: "Certificate of Analysis (COA) and Endotoxin Reports for every product." "All products undergo thorough testing by an independent third-party laboratory to ensure purity and quantity." Footer: "Our products are routinely tested by the most trusted labs. You can see our COA's here." (link not visible in returned markup)

**Lab partner named:** No.

**Batch / lot transparency:** Page displays an image labeled "Test Report BPC157 10mg" on the product page but no batch ID surfaced. About Us mentions COAs per product but not per batch.

**Payment methods:** "We accept Visa, Discover and American Express" (caption text). No crypto, ACH, or eCheck mentioned.

**ID verification:** Self-attestation in age gate. ToS claims "strictly limited to qualified professionals, research institutions, laboratories, and organizations" but enforcement model not specified.

**Tech stack signal:** WordPress (paths like `/wp-content/uploads/`); no Shopify/WooCommerce/Next.js indicators.

**Notable:**
- Carries a deep GLP product line with cryptic naming convention (GLP-1 S, GLP-2 T, GLP-3 R, GLP-1 C+GLP-1 S) — a posture choice that obfuscates the underlying API while remaining navigable
- The GLP cryptic-letter convention is the most distinctive posture signal in this batch
- BPC-157 at $59.99/10mg is mid-market

**Raw fetches:**
- `03_raw_fetches/compliance_slice/apollo-peptide-sciences__homepage.md`
- `03_raw_fetches/compliance_slice/apollo-peptide-sciences__bpc157_product.md`
- `03_raw_fetches/compliance_slice/apollo-peptide-sciences__terms.md`

---

### science-bio (Science.bio)

- **Domain:** science.bio (HTTP 403 to direct fetch as of 2026-05-06)
- **Status:** **DEFUNCT — permanently closed January 27, 2026**
- **Capture method:** Direct fetches blocked (403); web.archive.org blocked by environment ("Claude Code is unable to fetch from web.archive.org"). Compliance language captured via search-surfaced verbatim quotes from Google's pre-shutdown crawl of science.bio pages.

**Closure notice (search-surfaced verbatim):**
- Current page `<title>`: "Science Bio — Permanently Closed"
- Closure announcement (Facebook excerpt): "It is with a heavy heart that we announce sciencebio will be closing permanently"
- Closure email subject (sent 2026-01-27): "Science.bio is permanently closing."
- Closing message: "We are deeply grateful for your ongoing support and advocacy. We are humbled and wishing you the very best."
- Stated rationale: "regulatory compliance reasons"
- Order-handling commitment: "all outstanding orders to be either fulfilled or fully refunded"

**Pre-shutdown ToS compliance highlights (verbatim, from search excerpts of science.bio/terms-and-conditions/):**
- "No products here are to be used for recreational purposes nor human consumption."
- "All buyers are assumed and expected to be qualified researchers"
- "The chemicals/materials for sale are intended for laboratory and research use only, unless otherwise explicitly stated, and are not intended for human ingestion or for use in products that may be ingested."
- "The company delivers research chemicals for utilization in well-equipped laboratory environments, and the consumption of any of these products is strictly forbidden by their Terms & Conditions."
- "Many of their products lack sufficient research regarding potential adverse effects from human consumption."

**Approval / identity vetting program:**
- Page existed at science.bio/approval-program/ — direct fetch returned 403; search-surfaced description: program required customers to identify as qualified researchers. **Approval Program was a notable distinguishing posture vs. peer vendors** — Science.bio operated a customer-vetting program rather than relying solely on a 21+ self-attestation gate.

**Age gate:** Not surfaced as a hard splash gate; vetting was Approval-Program-driven.

**Jurisdictional restriction:** "No international shipping" per third-party review (Muscle and Brawn).

**Refund / shipping (third-party-cited, NOT verbatim from science.bio):**
- Shipping: "Free 2-3 day FedEx for domestic US"; no international
- Closure handling: "all outstanding orders to be either fulfilled or fully refunded" (verbatim from closure messaging)

**COA hosting model:** "Third-party lab testing with COAs (certificates of analysis)" per third-party review. Lab partner not named in surfaced excerpts.

**Lab partner named:** Not surfaced.

**Batch / lot transparency:** Not surfaced.

**Payment methods (third-party-cited):**
- Crypto (5% off)
- eCheck
- Debit card
- Credit card (10% fee)

**ID verification:** Approval Program enforced (vetting customers as researchers) — distinct posture from peer vendors that rely only on age gate.

**Tech stack signal:** Not capturable post-shutdown.

**Notable:**
- The Approval Program posture is rare in the industry — most retail peptide vendors rely on simple 21+ self-attestation
- The 10% surcharge on credit cards (vs. crypto discount) signals a deliberate financial nudge toward harder-to-charge-back rails
- The "regulatory compliance reasons" closure rationale, paired with the order-fulfillment commitment, distinguishes Science.bio from vendors that closed mid-pivot or after FDA action

**Raw fetches:**
- `03_raw_fetches/compliance_slice/science-bio__shutdown_and_archive.md`

---

### proven-peptides (Proven Peptides)

- **Domain:** provenpeptides.com (HTTP 522 to direct fetch as of 2026-05-06)
- **Status:** **DEFUNCT — ceased operations 2021**; legal page slugs still indexed by Google but origin returns 522 (Cloudflare → upstream timeout)
- **Legal entity:** Based in North Carolina; operated 2015–2021; owner Josh Fulton reportedly indicted for "conspiring to defraud the United States" over false health claims and unregistered manufacturing
- **Capture method:** Direct fetches all returned HTTP 522; web.archive.org blocked. Compliance text captured via Google search-surfaced verbatim excerpts of provenpeptides.com pages.

**Legal disclaimer (search-surfaced verbatim, from /legal-disclaimer/):**
- "Information available from this website is not intended to be used to diagnose any medical condition or disease. Products on this website are sold for research purposes only."
- "The content of this website, the website server that makes it available, and the services and products www.provenpeptides.com provides on this web site, are provided on an 'as is' and 'as available' basis without warranty of any kind, whether express, implied or statutory."
- "www.provenpeptides.com expressly disclaims liability for technical failures (including hardware or software failures), incomplete, scrambled or delayed computer transmissions, and/or technical inaccuracies, as well as unauthorized access of user transmissions by third parties. Further, www.provenpeptides.com does not represent or warrant that no viruses or other contaminating or destructive properties will be transmitted, or that no damage will occur to your computer system."
- "Research peptides and SARMs are for research purposes only, and not for human consumption. Products sold on this website are for research purposes only."
- "Products are intended solely for laboratory research purposes and unless otherwise stated are not to be used for any other purposes, including but not limited to vitro diagnostic purpose, in food drugs, medical devices, or cosmetics for humans or animals or for commercial purposes."
- "All products and services offered are for research purposes only, and under no circumstances shall any of these materials be used for recreational purposes nor human consumption."
- **"Replies regarding animals using personal pronouns refer to tissue samples and test subjects, and that such replies do not imply human use."** (this is a notably specific anti-prosecution clause — explicitly anticipates customer-service screenshots being used as evidence of human-use intent)
- **"Purchasers are affiliated with a laboratory, institution, university or other research-based facility, which justifies the purchase and use of products sold for research purposes only."**
- **"Anyone purchasing without such affiliations would be committing a fraudulent act for which they could be held liable."** (this is unusually aggressive — pushes legal liability onto the customer for any non-research purchase)

**Hero compliance:** Not capturable.

**Age gate:** Not capturable from search excerpts.

**Jurisdictional restriction:** Shipped both domestic (USPS) and international (per third-party).

**Refund / shipping (third-party-cited):**
- Shipping: USPS First Class or Priority; ~3 business days domestic, ~2 weeks international (customs caveats)
- Refunds: issued through original payment method

**COA hosting model:** Not surfaced.

**Lab partner named:** Not surfaced.

**Batch / lot transparency:** Not surfaced.

**Payment methods (third-party-cited):**
- Zelle Pay (described as "the easiest")
- Bitcoin
- Credit card (1 business day handling)
- eCheck (~3 days handling)

**ID verification:** Self-attestation via the legal disclaimer's "Purchasers are affiliated with a laboratory…" clause.

**Tech stack signal:** Cloudflare (522 origin error). Underlying CMS not capturable post-defunct.

**Notable:**
- **The "personal pronouns refer to tissue samples and test subjects" clause is the most defensive language in any vendor capture this batch.** It explicitly anticipates evidentiary use of conversational artifacts.
- The "fraudulent act … held liable" clause inverts standard liability flow — pushes responsibility for misuse back onto the customer.
- The 2021 closure followed an indictment over false health claims and unregistered manufacturing — a clear regulatory-enforcement endpoint, distinct from Science.bio's voluntary "regulatory compliance" closure.

**Raw fetches:**
- `03_raw_fetches/compliance_slice/proven-peptides__shutdown_and_archive.md`

---

## Part B — Posture-reference verification

### hunter-eyes-labs — VERIFICATION FINDING

- **Search query used:** `"hunter eyes labs" peptides research vendor` (and 2 variants)
- **Search results summary:**
  - All "Hunter Lab" hits resolve to **hunterlab.com.au**, an Australian topical-cosmetic skincare brand selling "Peptide Eye Renewal" cream — different category, different name
  - "Hunter eyes" exists in looksmaxxing forums as an **eye-shape aesthetic concept** (positive canthal tilt, almond shape, hooded eyelids), not a vendor
  - ZERO results for a research-peptide retailer named "Hunter Eyes Labs"
- **Domain probes:**
  - huntereyeslabs.com → DNS does not resolve
  - hunter-eyes-labs.com → DNS does not resolve
  - huntereyeslabs.io → DNS does not resolve
  - huntereyeslab.com → DNS does not resolve
  - huntereyes.com → resolves; **HugeDomains parking page (for sale)**
  - hunter-eyes.com → resolves; **Squarespace "Coming Soon / under construction" placeholder**, no peptide content
  - huntereyes.io → connection timed out
  - huntereyes.shop → SSL handshake failure
- **Verification outcome:** **OPERATOR_BRAINSTORM** — appears to be operator brand-name brainstorm; no public vendor located via web search on 2026-05-06.
- **Evidence:**
  - https://hunterlab.com.au/products/peptide-eye-renewal (skincare — different category)
  - https://forum.looksmaxxing.com/threads/hunter-eyes.9008/ (aesthetic concept thread)
  - https://hunter-eyes.com/ (Squarespace parking — under construction)
  - https://www.hugedomains.com/domain_profile.cfm?d=huntereyes.com (domain for sale)
- **Raw fetch:** `03_raw_fetches/compliance_slice/hunter-eyes-labs__verification.md`

---

### nzt-peptides — VERIFICATION FINDING

- **Search query used:** `"NZT peptides" research vendor brand` (and `"NZT" peptides vendor brand "NZT-48" research peptide store`)
- **Search results summary:**
  - All "NZ" hits resolve to **NZ Peptides** (nzpeptides.net, nzpeptide.com, nzpeptides.co.nz) — namesake vendors using "NZ" (New Zealand), NOT "NZT"
  - "NZT-48" is a **Limitless-movie-themed nootropic supplement** (Lions Mane / Phosphatidylserine etc.) sold on Amazon/Walmart/eBay — finished consumer supplement, NOT a research peptide and NOT a vendor brand
  - ZERO results for a research-peptide retailer named "NZT Peptides"
- **Domain probes (all NXDOMAIN):**
  - nztpeptides.com → DNS does not resolve
  - nzt-peptides.com → DNS does not resolve
  - nztpeptide.com → DNS does not resolve
  - nzt.shop → DNS does not resolve
  - nztpeptides.shop → DNS does not resolve
  - nzt-peptides.shop → DNS does not resolve
  - nzt-peptide.com → DNS does not resolve
  - nzt-labs.com → DNS does not resolve
  - nztlabs.com → DNS does not resolve
  - nzt-pharma.com → DNS does not resolve
- **Verification outcome:** **OPERATOR_BRAINSTORM** — appears to be operator brand-name brainstorm (likely a Limitless-movie reference, in keeping with the operator's meme-coded posture spec); no public vendor located via web search on 2026-05-06.
- **Evidence:**
  - https://nzpeptides.net/ (NZ Peptides — different brand name, NZ ≠ NZT)
  - https://nzpeptide.com/ (NZ Peptide — different brand name)
  - https://www.amazon.com/NZT-48-Premium-Brain-Booster-Phosphatidylserine/dp/B0CJB19TR4 (NZT-48 nootropic — different category)
- **Raw fetch:** `03_raw_fetches/compliance_slice/nzt-peptides__verification.md`

---

### jester-labs — VERIFICATION FINDING

- **Search query used:** `"jester labs" peptides research vendor` (and 2 variants including "jestermaxxing" cross-reference)
- **Search results summary:**
  - ZERO peptide-vendor "Jester Labs" results
  - Adjacent: "jestermaxxing" looksmaxxing meme exists ("Jestermaxxing is an incel and looksmaxxing slang term…"; popularized 2021 → 2025-2026), but is NOT associated with any operating peptide brand
- **Domain probes:**
  - jesterlabs.com → resolves; **redirects to HugeDomains** (`<title>: "JesterLabs.com is for sale | HugeDomains"`); listed price $8,895 or $370.63/month × 24
  - jester-labs.com → DNS does not resolve
  - jesterlabs.io → DNS does not resolve
  - jesterlabs.shop → DNS does not resolve
  - jesterpeptides.com → DNS does not resolve
- **Verification outcome:** **OPERATOR_BRAINSTORM** — appears to be operator brand-name brainstorm (in keeping with the "jestermaxxing" looksmaxxing-meme posture); the .com domain is parked for sale; no public vendor located via web search on 2026-05-06.
- **Evidence:**
  - https://www.hugedomains.com/domain_profile.cfm?d=JesterLabs.com (parked, for sale)
  - https://knowyourmeme.com/memes/jestermaxxing (looksmaxxing meme — no associated vendor)
- **Raw fetch:** `03_raw_fetches/compliance_slice/jester-labs__verification.md`

---

### larp-labs — VERIFICATION FINDING

- **Search query used:** `"larp labs" peptides research vendor brand` (and 2 variants)
- **Search results summary:**
  - ZERO peptide-vendor "LARP Labs" results
  - Adjacent: "LAPeptides" (laresearchlabs.com) — different brand ("LA" not "LARP")
- **Domain probes:**
  - **larplabs.com → resolves; HTTP 200 OK; running a real Shopify storefront** (cdn/shop/, shopify-checkout-api-token, Apple Pay merchant config, shop ID 60888121525)
    - `<title>`: "larplabs"
    - **Sells:** vinyl wraps for tactical equipment (Aimpoint Pro/T1/T2 sights, AGM night-vision wraps, PMag mag labels, Cloud Defensive, Eotech, Holosun, Modlite, Sig, Streamlight)
    - Tagline: "Do cool things, make cool friends"
    - **ZERO peptide products, ZERO medical disclaimers, ZERO research-use language**
  - larp-labs.com → DNS does not resolve
  - larplabs.shop → DNS does not resolve
  - larppeptides.com → DNS does not resolve
- **Verification outcome:** **OPERATOR_BRAINSTORM** (in the peptide-vendor sense) — name-collision with a real Shopify e-commerce business in the **tactical-equipment vinyl-wrap** category, NOT peptides. No research-peptide retailer named "LARP Labs" located on 2026-05-06.
- **Evidence:**
  - https://larplabs.com/ (real Shopify storefront — vinyl wraps for tactical gear, not peptides)
- **Raw fetch:** `03_raw_fetches/compliance_slice/larp-labs__verification.md`

---

### structure-labs — VERIFICATION FINDING

- **Search query used:** `"structure labs" peptides research vendor` (and 3 variants)
- **Search results summary:**
  - ZERO mainstream search hits for "Structure Labs" as a peptide vendor
  - ZERO Trustpilot, TikTok, Instagram, Reddit, Looksmax.org, or Finnrick Analytics mentions
- **Domain probes:**
  - structure-labs.com → **HTTP 200; REAL research-peptide SPA**
  - structure-labs.shop → **HTTP 200; mirror of the same SPA** (identical static HTML)
  - structurelabs.com (no hyphen) → resolves; **GoDaddy parked-lander page** — unrelated parked domain, not the same business
  - structurepeptides.com → resolves; **same GoDaddy parked-lander pattern** — unrelated parked domain
- **Verification outcome:** **REAL_VENDOR** (limited-disclosure)

**Static-HTML capture (verbatim from `curl` 200 OK on structure-labs.com and structure-labs.shop):**
- `<title>`: "Structure Labs Peptide Store"
- `<meta name="description">`: "Your trusted online source for high-quality research peptides, compliant with all regulations for laboratory use only."
- Same string repeated as og:description and twitter:description
- og:url: "https://structure-labs.com" (and mirror "https://structure-labs.shop")
- **`<meta name="robots">`: "noindex, nofollow"** ← deliberately hidden from search engines
- Built on **Base44** (low-code SPA app builder) — asset paths reference `qtrypzzcjebvfcihiynt.supabase.co/storage/v1/object/public/base44-prod/...`
- Backend: **Supabase** (project `qtrypzzcjebvfcihiynt`)
- Frontend: Vite-bundled React SPA (`/assets/index-BfZUgYtu.js`, `/assets/index-Bn0o0M98.css`)
- PWA-capable; manifest at `/manifest.json`
- NO Shopify, NO WooCommerce, NO Next.js, NO standalone WordPress
- structure-labs.shop is an exact static-HTML mirror — same project ID, same asset hashes, same noindex tag

**Confirmed page slugs (200 OK; `<title>` populated, body JS-rendered):**
- /, /products, /shop, /about, /disclaimer, /policies, /terms

**Compliance language (verbatim, from meta description):**
"Your trusted online source for high-quality research peptides, compliant with all regulations for laboratory use only."

**Footer disclaimer / hero compliance / ToS / refund / shipping / age gate / payment methods / lab partner / batch transparency:**
NOT retrievable from static HTML (JS-rendered, body asynchronous). Pages exist (200 OK with populated `<title>`) but body content is not visible to WebFetch and is not rendered by `curl`. Per anti-cheat rule #5 (no anti-bot bypass), no headless-browser bypass attempted.

**Lab partner named:** NOT obtainable from static HTML.

**Tech stack signal (definitive):** **Base44 (low-code SPA builder) + Supabase backend.** This is a noteworthy posture finding — the operator's master plan currently considers building on Supabase, and the existence of a competitor running production on Base44 + Supabase is direct prior-art evidence the stack is workable for this category.

- **Evidence:**
  - https://structure-labs.com/ (real SPA, noindex)
  - https://structure-labs.shop/ (mirror — same SPA, identical static HTML)
  - https://structurelabs.com/ (parked GoDaddy domain — unrelated)
  - https://structurepeptides.com/ (parked GoDaddy domain — unrelated)
- **Raw fetch:** `03_raw_fetches/compliance_slice/structure-labs__verification_and_homepage.md`

---

## Batch D summary

- **Part A profiled:** 5 / 5
  - Active retail (full capture): 3 — NextChems, Apollo Peptide Sciences, (partial) Felix Chemical Supply
  - Active retail (login-walled, partial via search-surfaced excerpts): 1 — Felix Chemical Supply
  - Defunct vendors (search-surfaced verbatim only): 2 — Science.bio (closed Jan 2026), Proven Peptides (closed 2021)
- **Part B real vendors:** 1 / 5 — **Structure Labs** (structure-labs.com / structure-labs.shop) — REAL but noindex/limited-disclosure SPA on Base44 + Supabase
- **Part B verified-as-brainstorm:** 4 / 5 — Hunter Eyes Labs, NZT Peptides, Jester Labs, LARP Labs
- **Part B unverified:** 0 / 5

### Notable findings

1. **Operator-brand-name list is largely brainstorm.** Of the five posture-reference names supplied, four (Hunter Eyes Labs, NZT Peptides, Jester Labs, LARP Labs) have no operating research-peptide vendor and the obvious .com / .shop / .io variants either don't resolve, are parked for sale, or run unrelated businesses (LARP Labs sells Shopify vinyl wraps for tactical equipment). These are operator-brainstormed brand names rooted in looksmaxxing meme culture.

2. **Structure Labs is real and tactically interesting.** structure-labs.com (and mirror structure-labs.shop) is a real, currently-operating research-peptide SPA. It is **deliberately noindexed** (`<meta name="robots" content="noindex, nofollow">`), runs on **Base44 + Supabase**, and has **zero discoverable third-party reviews / social presence / vendor-list inclusion**. This is a posture worth careful attention: it's prior-art for the operator's own Supabase-leaning stack, and it demonstrates a "stealth retail" posture (no SEO, no Trustpilot, no reviews — likely customer-acquisition via private channels only).

3. **Felix Chemical Supply (felixchem.is) operates the most aggressive gating posture in the batch** — 21+ splash gate AND mandatory account login before any product, policy, payment, or compliance content is accessible. Compliance language captured only via Google search-cached excerpts of pre-gate-hardening crawls.

4. **NextChems sells BPC-157 in capsule form** (60 caps × 0.5mg) — a notable departure from peer vendors who sell only lyophilized vials. This is a posture / product-form choice worth flagging.

5. **Apollo Peptide Sciences uses a cryptic GLP naming convention** (GLP-1 S, GLP-2 T, GLP-3 R, GLP-1 C+GLP-1 S) — a posture choice that obfuscates the underlying API while remaining navigable to informed buyers.

6. **Proven Peptides' "personal pronouns refer to tissue samples" disclaimer is the most defensive in the batch** — explicitly anticipates customer-service-conversation screenshots being used as evidence of human-use intent. Paired with the "fraudulent act … held liable" clause, it inverts liability onto the customer.

7. **Science.bio's Approval Program** (customer-vetting program rather than 21+ self-attestation) is a posture distinguisher worth noting; the company closed January 27, 2026 citing "regulatory compliance reasons" while committing to fulfill or refund all outstanding orders — a clean voluntary-exit pattern distinct from Proven Peptides' indictment-driven 2021 closure.

8. **Three-attempt rule and anti-bot rule observed.** All defunct or gated vendors (Felix Chem login wall, Science.bio 403, Proven Peptides 522) had their compliance language captured via Google search-surfaced verbatim excerpts rather than any anti-bot bypass. web.archive.org direct fetch is blocked in this environment ("Claude Code is unable to fetch from web.archive.org"); search-surfaced verbatim quotes from the live indexes serve as the documented Wayback substitute.
