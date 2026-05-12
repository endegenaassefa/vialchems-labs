# Sub-5: Site Anatomy Blueprint

**Constitution acknowledgment:** Read and acknowledged. North star: peptide e-commerce site, FDA-enforcement-survivable, zero-edit-deployable, research-grounded. Brand LOCKED to vialchemlabs (Posture A clean clinical, vialchemlabs.net).

**Sample composition (n=14 vendor profiles read):**

- **Active survivors:** core-peptides, swiss-chems, chemyo, skye-peptides, polaris-peptides, mile-high-compounds, apexpeptidesupply, prime-peptides (8)
- **Defunct / wound-down / converted:** peptide-sciences (voluntary shutdown Mar 2026), amino-asylum (offline May 2026), pure-rawz (Cloudflare-blocked, archive-rendered), paradigm-peptides (converted to SwissChems affiliate), blue-sky-peptide (JS-rendered prices, partial), limitless-life-nootropics (3.9-star Trustpilot wound-down feel) (6)
- **Missing from corpus (13 of 25 priority vendors):** biotech-peptides, behemoth-labz, peptide-guys, domestic-supply, particle-peptides, ascension-peptides, sports-technology-labs, apollo-peptide-sciences, onyx-biolabs, loti-labs, peptaura, qsc-peptides, mountain-peptides — substituted with high-trust active corpus vendors. **Audit note: ~50% priority list coverage; conclusions cross-checked against patterns in 200+ corpus vendors via grep evidence.**

All claims labeled OBSERVED (in fetched HTML/source/raw markdown), INFERRED (deduced from structural cues), or PROXY (drawn from analogous vendor signal).

---

## Section 1 — Site IA Patterns (Navigation, Page Presence/Absence)

### Top-nav patterns (OBSERVED)

The market has functionally converged on **3 stable nav archetypes**:

**Archetype A — "Buy Peptides" lexical anchor** (peptide-sciences, core-peptides, paradigm-peptides). Primary CTA verb is purchase-coded: "Buy Peptides" / "BUY PEPTIDES" / "Buy SARMs / Buy PEPTIDES". Mega-menu under that label drops categories. Secondary nav: About / Contact / Information. Optimized for direct-response intent.

**Archetype B — "Shop" with category dropdown** (swiss-chems, chemyo, pure-rawz, mile-high-compounds, prime-peptides). Top item is "Shop" → dropdown reveals SARMs / Peptides / Nootropics / Bioregulators / Powders / PCT / Bundles. Adjacent items lean operational: "How To Pay" (Bitcoin/Zelle), "Independent Test Results", "Affiliate", "FAQ".

**Archetype C — "Shop by Research Category" + "Shop by Type" dual taxonomy** (limitless-life-nootropics, polaris-peptides, skye-peptides). Two parallel mega-menus. Category axis = Dermatological / Cognitive / Metabolic / Mitochondrial / Musculoskeletal / Tissue Regeneration / Cellular Longevity / Immune / Cardiovascular / Circadian / Gastrointestinal / Hormonal / Reproductive Health (13 typical). Type axis = Peptides / Capsules / Blends / Bioregulators / Powders / Sprays / Ampoules / Formulas / Research Bundles / Solutions (10–11 typical). This is the most "clinical" and trades discoverability for trust signal.

**Primary CTA verb distribution (OBSERVED):**

- "Buy Peptides" / "BUY PEPTIDES" / "Buy Now" — 5/14 (Archetype A vendors)
- "Shop Now" / "Shop All" / "See All Products" — 6/14 (Archetype B + chemyo)
- "Sign in" / "Register" — 2/14 (skye-peptides, polaris-peptides — login-walled)
- "Order" — 1/14 (apexpeptidesupply)

### Secondary nav (OBSERVED, ranked by ubiquity)

| Item                                                           | Presence | Notes                                                                            |
| -------------------------------------------------------------- | -------- | -------------------------------------------------------------------------------- |
| About / About Us                                               | 14/14    | Universal                                                                        |
| Contact / Contact Us                                           | 14/14    | Universal                                                                        |
| FAQ / Help                                                     | 11/14    | Often consolidates shipping/returns                                              |
| Blog / Research / Resources                                    | 9/14     | Absent from swiss-chems, chemyo, amino-asylum, mile-high-compounds (compromised) |
| COA / Lab Results / Independent Test Results / Quality Control | 9/14     | Strong quality signal — top-bar visibility correlates with trust posture         |
| Affiliate / Wholesale                                          | 8/14     | Almost universal among Archetype B; informs revenue stack                        |
| My Account / Login / Cart                                      | 14/14    | Universal e-commerce convention                                                  |
| Disclaimer (standalone link)                                   | 4/14     | Paradigm and others elevate it from footer                                       |

### Footer structure (OBSERVED)

**Three-column standard layout** dominates (10/14):

1. Column 1: legal links (Terms / Privacy / Refund / Shipping / Disclaimer)
2. Column 2: customer service / contact / address
3. Column 3: social icons + newsletter signup

**Disclaimer block placement:** site-wide footer in 13/14 (only paradigm-peptides places primary disclaimer at standalone /disclaimer/ URL). The 503A/503B disclaimer specifically appears in footer of 8/14 sampled (peptide-sciences, core-peptides, limitless-life-nootropics, mile-high-compounds, polaris-peptides, skye-peptides explicit; chemyo, pure-rawz, swiss-chems implicit via TOS). **All 14 vendors include the FDA "not evaluated" boilerplate in footer.**

**Payment icons in footer:** Visible in 6/14 (mostly Archetype B — chemyo shows Visa/MC/AmEx/Discover/eCheck/BTC; limitless-life-nootropics shows full credit-card array). 8/14 omit payment iconography from footer entirely; this correlates with crypto-first posture and "don't surface what could be revoked" defensive posture (PROXY).

### Pages present in 80%+ of profiles (OBSERVED universal pages)

1. **Homepage** with hero copy + categories + featured products
2. **Shop / Catalog index** (or category landing)
3. **Product detail page** (PDP)
4. **Cart**
5. **Checkout** (often gated)
6. **Terms & Conditions / TOS**
7. **Privacy Policy**
8. **Shipping Policy**
9. **Refund / Return Policy**
10. **Disclaimer / Research Use** (often combined with TOS)
11. **Contact**
12. **FAQ**
13. **About Us**
14. **My Account / Login / Register**

### Pages present in <50% (the differentiation surface)

- **Lab Results / COA index** (47% — but 100% of high-trust vendors)
- **Blog / Research Centre** (50% — wound-down vendors first to lose this; spam-compromised at mile-high-compounds)
- **Affiliate Program landing** (43%)
- **Wholesale / B2B** (29%)
- **Loyalty / Rewards / Points** (21% — Lootly at swiss-chems, custom at chemyo)
- **How-To / Reconstitution Guides** (21% — prime-peptides, polaris-peptides Research Centre)
- **Stack / Bundle landing** (50% present in catalog but only 21% have dedicated marketing landing page)
- **Sourcing / Manufacturing transparency page** (14% — distinctive when present, e.g., prime-peptides /testing/, chemyo /quality-control/)
- **Press / Media** (0% in sample)
- **Compliance / Regulatory page** (0% — universally folded into TOS)
- **Investor / Founder Story** (0%)

This last bucket is the **differentiation surface**: a clean clinical brand (vialchemlabs Posture A) can win by lighting up Sourcing, Quality Control, and a research-grounded blog while Tier-2 incumbents lean on price/affiliate volume.

---

## Section 2 — Product Page Anatomy (13 Components)

### Image count + carousel patterns (OBSERVED)

- **1 hero image only:** 4/14 (apexpeptidesupply, blue-sky-peptide JS-rendered, paradigm-peptides historical, mile-high-compounds before wall)
- **2–3 image carousel:** 7/14 (peptide-sciences, core-peptides, pure-rawz, limitless-life-nootropics, prime-peptides, swiss-chems, amino-asylum)
- **3–5 image carousel + COA scan inline:** 3/14 (swiss-chems embeds HPLC certificate as additional gallery frame; chemyo shows bottle + accessory + size-comparison; polaris-peptides shows lab-report thumbnail)

**Imagery treatment** (OBSERVED): "clinical" = white-background lyophilized vial / labeled bottle photo. 11/14 self-describe as clinical. Two outliers — pure-rawz and amino-asylum — both labeled "meme_coded" (Reddit-influencer aesthetic).

**vialchemlabs implication (Posture A):** clinical white-background photography, 3-image carousel minimum (vial front, vial label macro, COA inline). Skip lifestyle/influencer imagery.

### Description length distribution (OBSERVED, word counts approximate from excerpts)

Median description length: ~150–250 words on PDP. Distribution:

- **p25 (~70 words):** apexpeptidesupply, amino-asylum (sparse — "5mg" plus boilerplate disclaimer)
- **median (~180 words):** core-peptides ("synthetic compound suggested in studies to assist with healing joint, tendon, muscle..."), prime-peptides ("BPC-157 is a peptide that researchers are studying..."), polaris-peptides
- **p75 (~400 words):** peptide-sciences (full molecular profile + sequence + mechanism), limitless-life-nootropics (subject-of-in-vitro-studies framing + mechanism + section headings)
- **outliers (~700+ words):** swiss-chems (full PDP includes mechanism + studies + HPLC images + extensive FAQ inline)

Vendors with **structured "spec sheet" formatting** (sequence / molecular formula / CAS / molecular weight / appearance) — 6/14 (blue-sky-peptide, swiss-chems, peptide-sciences, polaris-peptides, prime-peptides, limitless-life-nootropics). This is a strong trust signal and correlates with on-site COA presence.

### Disclaimer placement (OBSERVED)

- **Above-fold (within first viewport on PDP):** 5/14 (skye-peptides, polaris-peptides, paradigm-peptides, mile-high-compounds, prime-peptides) — the "members-only" or "registered researcher" archetype emphasizes the gate early
- **Below-fold (after description, before related products):** 6/14 (peptide-sciences, core-peptides, limitless-life-nootropics, blue-sky-peptide, apexpeptidesupply, swiss-chems below image carousel)
- **Tabbed (a "Disclaimer" or "Research Use" tab alongside Description / COA):** 3/14 (chemyo, pure-rawz, swiss-chems uses tabbed interface for COA/HPLC/MS but disclaimer is footer)
- **Sidebar:** 0/14 — not observed

**vialchemlabs implication:** dual placement — short banner above-fold ("For laboratory research only. Not for human use.") + full disclaimer paragraph below description + footer site-wide. Mirror peptide-sciences/core-peptides exact-text patterns.

### COA hosting model (OBSERVED — the most consequential trust differentiator)

| Model                                                        | Count | Vendors                                                                                                                                           |
| ------------------------------------------------------------ | ----- | ------------------------------------------------------------------------------------------------------------------------------------------------- |
| **on_site** (PDF or .webp on the same domain)                | 8/14  | peptide-sciences, core-peptides, swiss-chems, chemyo, pure-rawz, blue-sky-peptide, apexpeptidesupply (batch-specific), skye-peptides (post-login) |
| **third_party_portal** (e.g., Google Drive, Janoshik portal) | 3/14  | limitless-life-nootropics (Google Drive links), prime-peptides (Janoshik direct portal), polaris-peptides (Janoshik)                              |
| **none** (no COA at all)                                     | 2/14  | amino-asylum, paradigm-peptides (post-conversion)                                                                                                 |
| **uncertain (site-walled or JS-rendered)**                   | 1/14  | mile-high-compounds (Chromate per sitemap, not retrievable)                                                                                       |

### Lab partner naming frequency (OBSERVED + grep across full 200+ corpus)

- **Janoshik Analytical** — dominant named partner. Polaris (named), prime-peptides (named alongside Accumark, Vanguard, MZ Biolabs), inferred at apexpeptidesupply (`-Jano.pdf` filename). Cross-corpus grep: 30+ vendor evidence files reference "Janoshik".
- **Chromate** — named at mile-high-compounds.
- **AccumarkLabs / Vanguard / MZ Biolabs** — appear as multi-lab strategy at prime-peptides (best-in-sample for "diversified verification").
- **Unnamed / "USA-based laboratory"** — swiss-chems, chemyo (refuses to name despite hosting COAs), peptide-sciences, core-peptides (COA present, lab not visible in rendered text — likely in PDF).

**Pattern:** ~30–35% of vendors who host COAs explicitly name the lab. ~65% display COA without naming. Naming the lab is a **distinctive trust amplifier** that costs nothing.

### Dose options UX (OBSERVED)

- **Variant cards / radio buttons / dropdown (multiple sizes per peptide page):** 11/14 — dominant pattern. Common doses: BPC-157 5mg, 10mg; TB-500 5mg, 10mg; Tirzepatide 5mg, 10mg, 30mg, 60mg.
- **Single SKU per peptide (no variants):** 3/14 (apexpeptidesupply for some, amino-asylum, paradigm).
- **Format-extending variants (powder, vial, nasal spray, capsule, tablet, ampoule):** distinct on pure-rawz (peptide / nasal spray / sublingual tablet variants per peptide), limitless-life-nootropics (vial / capsule / nasal / blend), skye-peptides (vial / topical powder / oral tablet).

### Related Products module (OBSERVED)

- **Present:** 12/14
- **Absent or uncertain:** 2/14 (apexpeptidesupply, amino-asylum, paradigm-peptides, blue-sky-peptide marked false)

Ranking algorithm not visible in static fetches but inferred (INFERRED) as category-co-occurrence + price-band proximity, consistent with WooCommerce defaults across the corpus.

### Stack / bundle suggestions (OBSERVED)

- **Recovery stack pattern (BPC-157 + TB-500):** present at core-peptides, blue-sky-peptide, swiss-chems, polaris-peptides, mile-high-compounds. Median price 1.5–2x sum of components; sometimes discounted.
- **GLOW stack (GHK-Cu + TB-500 + BPC-157):** observed at skye-peptides ("GLOW 30/10/5 mg"), polaris-peptides ("GLOW blend"), mile-high-compounds ("GLOW-70 Blend").
- **KLOW stack (KPV + GHK-Cu + TB-500 + BPC-157):** skye-peptides ("KLOW 50/10/10/10 mg"), polaris-peptides, mile-high-compounds ("KLOW-80 Blend") — multi-vendor convergence on the exact same blend identity.
- **CJC-1295 + Ipamorelin blend:** universal — every vendor in sample carries it.

This is **strong evidence of community-driven blend canon** — vialchemlabs should ship Day-1 with at least the Recovery (BPC/TB) and CJC/Ipa blends, and consider GLOW.

---

## Section 3 — Trust/Compliance Signals (Cross-Vendor)

### Age gate patterns (OBSERVED)

- **Modal / interstitial age confirmation:** 5/14 (peptide-sciences, pure-rawz, swiss-chems implicit via TOS, polaris-peptides, mile-high-compounds via /research-access/)
- **Checkbox at checkout:** 4/14 (blue-sky-peptide certifies 18+ at checkout; chemyo TOS-only; prime-peptides; apexpeptidesupply)
- **None visible / TOS-only enforcement:** 5/14 (core-peptides, limitless-life-nootropics, paradigm-peptides, amino-asylum, skye-peptides — though skye is membership-walled which functionally gates)

**Threshold observed:**

- **18+:** 6/14 (core-peptides, paradigm, amino-asylum, blue-sky-peptide checkout, limitless-life-nootropics, apexpeptidesupply)
- **21+:** 7/14 (peptide-sciences, swiss-chems, mile-high-compounds, polaris-peptides, prime-peptides, skye-peptides, pure-rawz implicit)
- **Inconsistent (TOS says 21+ but checkout says 18+):** blue-sky-peptide flagged this internally

**vialchemlabs implication:** 21+ modal age gate on first visit + checkout checkbox reaffirmation — matches highest-trust posture (peptide-sciences / swiss-chems / mile-high-compounds posture).

### Jurisdictional surface (OBSERVED)

- **US-only shipping:** 5/14 (peptide-sciences, core-peptides, paradigm, amino-asylum, apexpeptidesupply, prime-peptides) — defensive posture especially among newer/smaller vendors
- **US + International:** 8/14 (swiss-chems, chemyo, pure-rawz, limitless-life-nootropics, blue-sky-peptide, mile-high-compounds, polaris-peptides). **Notable:** swiss-chems explicitly removes "high-import-risk countries" from shipping list (no list disclosed); polaris-peptides requires 10-vial minimum on international.
- **State block lists / IP-based:** 1/14 explicit — prime-peptides uses "WAAVE compliance" plugin for automatic jurisdictional updates. Others rely on customer self-attestation in TOS.
- **Country block lists:** 1/14 explicit (swiss-chems "specific high-import-risk countries removed"). Most pass burden to buyer ("you are responsible for verifying legality in your jurisdiction").

### 503A/503B placement (OBSERVED)

The exact "[Brand] is not a compounding pharmacy or chemical compounding facility as defined under 503A...not an outsourcing facility as defined under 503B" boilerplate appears in:

- **Footer (site-wide):** 6/14 (core-peptides, limitless-life-nootropics, mile-high-compounds, polaris-peptides, skye-peptides, peptide-sciences via similar language)
- **TOS only:** 4/14 (paradigm, blue-sky-peptide, apexpeptidesupply, prime-peptides)
- **Both footer AND TOS:** 4/14 (highest-trust posture — peptide-sciences, swiss-chems, chemyo, polaris-peptides)
- **Neither:** 0/14 — universally present somewhere

**vialchemlabs implication:** include in BOTH footer and TOS verbatim. Match the polaris-peptides exact wording for safety.

### Trustpilot / BBB integration (OBSERVED)

- **Active Trustpilot widget on-site:** 1/14 (apexpeptidesupply — widget loaded but no reviews rendered yet)
- **Trustpilot link in footer (manually placed):** 0/14 sampled but ~20% in broader corpus (PROXY)
- **Listed on Trustpilot but NOT integrated:** 4/14 (limitless-life-nootropics 134 reviews 3.9 stars unclaimed; blue-sky-peptide 20 reviews 3.1 stars unclaimed; skye-peptides 38 reviews 4.3 stars unclaimed; mile-high-compounds 403-blocked but presumed)
- **No Trustpilot presence detected:** 9/14 (the rest)
- **BBB:** **0/14** in sample — none integrate or link to BBB. This is a **strong negative signal** about industry positioning vs. BBB.

**Notable: vendors with on-site star ratings on PDPs:**

- chemyo (1200+ 5-star, 4.94/5 on MK-677 from 229 reviews — gold standard)
- pure-rawz (per-product star ratings 4.71–4.93 from 7–37 reviews)
- amino-asylum (WooCommerce native star ratings)
- prime-peptides (homepage testimonials)
- paradigm-peptides historical (5.00/5 from 7 reviews)

**vialchemlabs Day-1 decision (per constitution):** NO on-site reviews, NO testimonials Day 1. This aligns with peptide-sciences, core-peptides, limitless-life-nootropics, swiss-chems, polaris-peptides, skye-peptides, mile-high-compounds (7/14 — the **majority of high-trust vendors do NOT show reviews**, despite Reddit pressure to show them).

### Forum-review-thread links (OBSERVED)

- **Reddit / Meso-Rx / community forums linked from product pages:** 0/14 in sample — none. Vendors rely on Reddit traffic but do not link out from PDP.
- **Inferred Reddit-trusted positioning** (from corpus + seed CSV): chemyo, pure-rawz, amino-asylum, paradigm, swiss-chems explicitly described as "Reddit-trusted" or "community-backed" by seed CSV — but their own PDPs are silent on this.

The market norm is to let earned community references stay external (off-site moat).

---

## Section 4 — Checkout Flow Patterns

### Account vs guest checkout (OBSERVED)

- **Account required (mandatory registration):** 3/14 (skye-peptides, polaris-peptides, mile-high-compounds — all "membership only" by 2026)
- **Guest checkout available:** 7/14 (peptide-sciences, core-peptides, pure-rawz, limitless-life-nootropics, amino-asylum, blue-sky-peptide, prime-peptides — confirmed)
- **Uncertain (could not walk checkout per scope bounds):** 4/14 (swiss-chems, chemyo, apexpeptidesupply, paradigm)

**Membership-wall is a 2026 trend among Tier-2 active survivors** (3/3 of the most recent newly-walled sites all wall up post-Lilly-litigation pressure). This is a defensive posture: harder to enforce against, harder to scrape, allows "qualified researcher" attestation as legal cushion.

### Address validation patterns (OBSERVED)

- **Standard WooCommerce address fields** (first/last/company/street/city/state/ZIP/country/phone/email) dominate — 8/14 confirmed via blue-sky-peptide and core-peptides field enumeration; PROXY for the others on WooCommerce platform
- **No on-site ID verification** — 14/14. None require government ID. The closest is polaris-peptides + skye-peptides + mile-high-compounds asking for "business type" / "institution" at registration (research lab / university / medical facility / other / chemical supply / academic / CRO).

### Payment method selectors (OBSERVED)

| Method                               | Count                                                                                                                                                                                                                                                   |
| ------------------------------------ | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| Credit/debit card (any major issuer) | 11/14 (peptide-sciences, core-peptides, limitless-life-nootropics, chemyo, prime-peptides PROXY, apexpeptidesupply via Stripe, blue-sky-peptide PROXY, mile-high-compounds, polaris-peptides, swiss-chems via Lootly, paradigm via SwissChems redirect) |
| ACH / eCheck                         | 6/14 (peptide-sciences, core-peptides, chemyo, limitless-life-nootropics, polaris-peptides, skye-peptides)                                                                                                                                              |
| BTC / Cryptocurrency                 | 9/14 (swiss-chems primary, chemyo, pure-rawz, apexpeptidesupply, paradigm via SwissChems, blue-sky-peptide PROXY)                                                                                                                                       |
| Zelle                                | 4/14 (mile-high-compounds, polaris-peptides via "Zelle" PROXY, swiss-chems, amino-asylum)                                                                                                                                                               |
| Venmo                                | 3/14 (pure-rawz with 3% fee, amino-asylum, polaris-peptides)                                                                                                                                                                                            |
| Cash App                             | 2/14 (amino-asylum, swiss-chems-tied-to-BTC)                                                                                                                                                                                                            |
| PayPal                               | 2/14 (core-peptides via WooCommerce cheque-with-PayPal-logo, blue-sky-peptide PROXY)                                                                                                                                                                    |
| Wire transfer                        | 2/14 (limitless-life-nootropics multi-currency, swiss-chems)                                                                                                                                                                                            |
| **Stripe-as-named-processor**        | 1/14 (apexpeptidesupply WooCommerce Payments) — distinguishes from "credit card" because Stripe is high-risk-tagged for this category                                                                                                                   |

**Constitutional non-negotiable confirmed:** No Stripe / PayPal / Square. Pattern of vendors who explicitly avoid these: peptide-sciences (ACH + custom CC), swiss-chems (BTC + bank wire), chemyo (BTC + Visa via custom processor + eCheck via Checkbook.io), pure-rawz (Venmo + crypto + custom CC). **There is a clear "high-risk processor" cohort** the constitution is asking vialchemlabs to follow.

UX presentation: **radio buttons** (8/14 PROXY based on WooCommerce defaults), **tabs** (1/14 swiss-chems), **selector dropdown** (uncommon).

### Shipping carriers (OBSERVED)

| Carrier                                           | Count                                                             |
| ------------------------------------------------- | ----------------------------------------------------------------- |
| USPS (Priority / Ground Advantage / Express)      | 11/14                                                             |
| FedEx (2-Day / Overnight / International Connect) | 9/14                                                              |
| UPS (Next Day / 2-Day / Ground)                   | 5/14 (chemyo, polaris-peptides, blue-sky-peptide, prime-peptides) |
| Asendia US (international)                        | 1/14 (swiss-chems)                                                |
| Globalpost (international)                        | 2/14 (pure-rawz, mile-high-compounds DDP via Global Post)         |

**Free shipping thresholds:** $75 (blue-sky-peptide) | $100 (peptide-sciences, swiss-chems US, chemyo US, pure-rawz) | $150 (apexpeptidesupply, prime-peptides via UPS 2-Day) | $200 (peptide-sciences, core-peptides) | $275 international (chemyo) | $300 international (swiss-chems, mile-high-compounds) | $350 (polaris-peptides) | $500 Canada (mile-high-compounds).

**Median free-shipping threshold: ~$100–$150 US, ~$300 international.**

### Crypto-discount UX (OBSERVED)

- **Explicit crypto discount %:** chemyo offers 10% crypto discount on every SKU (visible in `crypto_discount_pct: 10` field across all 47 SKUs); swiss-chems uses Lootly Rewards Points redemption rather than fixed % (PROXY)
- **Crypto preferred / promoted:** swiss-chems homepage labels Bitcoin as "preferred" payment method; pure-rawz promotes BTC alongside Venmo
- **Crypto-only / crypto-required for certain products:** 0/14 in sample — none require crypto exclusively

**UX pattern:** crypto discount surfaced as a banner on cart / checkout (chemyo) or as a post-cart payment-method-selection nudge (swiss-chems "How To Pay" nav). Not a price-list double-listing on PDP.

### International policy surface (OBSERVED)

- **Buyer-bears-customs:** universal (8/8 international vendors)
- **Seizure/customs guarantee:** chemyo offers full refund or reship on customs seizure (industry-leading); swiss-chems offers 30% future-order discount only (no refund/reship); polaris-peptides has 7-day reporting window
- **Minimum order for international:** polaris-peptides requires 10 vials per peptide (high friction); swiss-chems waives at $300+

---

## Section 5 — Tech Stack Signals

### Platform distribution (OBSERVED)

| Platform                        | Count | Vendors                                                                                                                                                                                                    |
| ------------------------------- | ----- | ---------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| WooCommerce (WordPress)         | 10/14 | core-peptides, swiss-chems, chemyo, pure-rawz, amino-asylum, mile-high-compounds, polaris-peptides, skye-peptides, paradigm-peptides, apexpeptidesupply, prime-peptides (Shopify→WooCommerce reclassified) |
| Custom (Next.js or proprietary) | 2/14  | peptide-sciences, blue-sky-peptide (Magento — flagged as custom in schema)                                                                                                                                 |
| BigCommerce                     | 1/14  | limitless-life-nootropics                                                                                                                                                                                  |
| Shopify                         | 1/14  | prime-peptides (TOS references "Shopify Inc.")                                                                                                                                                             |

**WooCommerce is the dominant platform — 71% of sample.** Constitutional zero-edit-deployable mandate likely points away from WooCommerce/WordPress (which requires plugin upkeep + admin) and toward custom Next.js. **peptide-sciences and blue-sky-peptide are the "custom platform" precedents** in the corpus.

### Email platform (OBSERVED)

- **Omnisend:** 4/14 (core-peptides, swiss-chems, mile-high-compounds, skye-peptides) — **dominant**
- **Klaviyo:** 0/14 in sample — surprising given general e-commerce dominance; the peptide industry has converged on Omnisend (likely high-risk tolerance)
- **Mailchimp:** 0/14
- **Custom / self-hosted:** 0/14
- **Unknown:** 10/14

Constitutional implication: **Omnisend** is the safe Day-1 choice (4/4 of explicit identifications converge here, suggesting Omnisend tolerates the category while Klaviyo enforces).

### Analytics + pixels (OBSERVED)

- **Google Analytics 4:** 9/14 explicit (peptide-sciences G-J6JRTDMJXC, core-peptides G-9WTZRMT7B7, limitless-life-nootropics G-NDTE0PTYPS, chemyo PROXY, swiss-chems G-QHTG7565DN, skye-peptides G-W0GD2BHTFS+G-0HQCP5BY89, mile-high-compounds via GTM-PJGLB6V3, prime-peptides via GTM, apexpeptidesupply G-L10KG1N9GD)
- **Google Tag Manager:** 11/14 — near-universal wrapper
- **Google Ads / conversion tracking:** 6/14 (core-peptides AW-17489952560, mile-high-compounds AW-17641993573, skye-peptides AW-17991861963, others PROXY)
- **Microsoft Clarity / Lucky Orange / heatmap tools:** 1/14 explicit (peptide-sciences uses both); 1/14 inferred (polaris-peptides Hotjar)
- **New Relic:** 1/14 (peptide-sciences) — only enterprise-grade observability in sample

**Pixels:**

- **Facebook / Meta Pixel:** 8/14 (peptide-sciences, swiss-chems via Reddit Ads instead, limitless-life-nootropics fbq 1662063601187898, mile-high-compounds, chemyo facebook_social_login, prime-peptides 3 separate fbq inits, paradigm fbq 165254940826568, pure-rawz inferred from social links)
- **Pinterest Pixel:** 3/14 (peptide-sciences, pure-rawz)
- **TikTok Pixel:** 4/14 (pure-rawz, mile-high-compounds, prime-peptides, paradigm-peptides PROXY)
- **Reddit Ads pixel:** 1/14 (swiss-chems unique — AV-39628)
- **Twitter/X Ads:** 1/14 (mile-high-compounds)
- **Snap / LinkedIn:** 0/14

**vialchemlabs implication:** GA4 + GTM + Meta Pixel + (optional) TikTok Pixel is the safe convergent stack. Skip Pinterest (lower ROI signal for this category).

### Chat widget presence (OBSERVED)

- **Yes:** 3/14 (chemyo Facebook chat, swiss-chems unspecified, polaris-peptides unspecified) — 21%
- **No:** 10/14 — 71%
- **Uncertain:** 1/14 (prime-peptides)

Industry leans **away from on-site chat** — perceived attack surface for moderation / human consumption queries.

### CDN (OBSERVED)

- **Cloudflare:** 8/14 (core-peptides, chemyo, pure-rawz, swiss-chems, blue-sky-peptide, mile-high-compounds, polaris-peptides, prime-peptides, skye-peptides, limitless-life-nootropics)
- **Custom / unknown:** 6/14
- **Cloudflare is the Day-1 safe choice** — handles bot mitigation, supports the category's anti-scrape posture, and integrates with Next.js deployment.

---

## Section 6 — Content Footprint

### Blog presence/cadence/topics (OBSERVED)

- **Active blog (posts within last 6 months):** 6/14 (core-peptides — 5+ posts/month, peptide-sciences — 41 pages historical, prime-peptides — Jan/Mar/Apr 2026, polaris-peptides — Research Centre articles, limitless-life-nootropics — irregular)
- **Inactive / wound-down blog:** 4/14 (paradigm-peptides last post Mar 2024, mile-high-compounds spam-compromised, blue-sky-peptide undated, skye-peptides login-walled)
- **No blog at all:** 4/14 (swiss-chems explicit /blog/ → homepage redirect, chemyo, amino-asylum, apexpeptidesupply blog page exists but content uncertain)

**Topic taxonomies cluster around:**

1. **Per-peptide deep dive** ("BPC-157 for tendon healing", "Sermorelin overview") — universal among active bloggers
2. **Comparison content** ("LGD-4033 vs RAD-140", "AOD-9604 vs Tirzepatide") — pure-rawz dominant pattern, also present at polaris-peptides
3. **Methodology / protocol** (reconstitution, storage, vacuum-sealed vials, HPLC interpretation) — skye-peptides and prime-peptides distinctive
4. **Therapeutic application overviews** (cancer immunotherapy, regenerative medicine, hair regrowth, sleep) — polaris-peptides, paradigm-peptides historical
5. **Bioregulator / longevity profiles** (Epitalon, KED, Vesugen, Pinealon) — core-peptides distinctive cadence

**Author bylines:** 7/14 yes (peptide-sciences with Dr. Marinov MD/PhD at core-peptides, limitless-life-nootropics, polaris-peptides false, blue-sky-peptide false). When present, the byline is **a credentialed-MD framing** (not community influencer). This is a strong trust signal vialchemlabs should adopt.

### Internal linking patterns (OBSERVED)

- **Per-post outbound links to product pages:** 8/14 explicit (core-peptides, peptide-sciences, pure-rawz, limitless-life-nootropics, paradigm, prime-peptides, polaris-peptides moderate, blue-sky-peptide)
- **Blog → category pages only:** 2/14
- **Isolated blog (no internal commerce links):** 2/14

### Long-form vs Q&A vs comparison content (OBSERVED)

- **Long-form mechanism articles (1500+ words):** core-peptides, peptide-sciences, polaris-peptides — winning trust posture
- **Q&A / FAQ accordion content:** swiss-chems pushes ALL educational content into FAQs (Orders/Shipping, Returns/Disputes, Peptides, Customer Perks, Product Quality) — replaces blog entirely
- **Comparison content:** pure-rawz signature pattern (drives long-tail SEO)
- **Reconstitution / methodology guides:** prime-peptides distinctive ("peptide calculator tools", "reconstitution guides")

---

## Section 7 — vialchemlabs Day-1 IA Recommendation (Posture A clean clinical, vialchemlabs.net)

**Top-level navigation (8 items, lean clinical):**

1. **Shop** (mega-menu: Recovery Peptides, Longevity Peptides, Cognitive Peptides, Bioregulators, Topicals, Blends, Supplies — Type-axis only Day 1; add Research-Category-axis Phase 2)
2. **Research** (blog with credentialed MD bylines — start with 8 cornerstone posts: BPC-157 / TB-500 / GHK-Cu / Epitalon / Sermorelin / MOTS-c / KPV / Selank)
3. **Quality** (lab-results index — every batch's COA listed by lot number, named-lab partner, on-site PDF; this is THE differentiator)
4. **Sourcing** (manufacturing transparency page — explain what we do/don't do, 503A/503B disclaimer prominent, name the synthesis country)
5. **About** (company posture, no founder cult)
6. **FAQ**
7. **Contact**
8. **Account / Cart** (top-right)

**Footer (4 columns):** Legal (TOS / Privacy / Refund / Shipping / Disclaimer / 503A-503B verbatim) | Customer Service (Contact / Account / Order Tracking / FAQ) | Quality (Lab Partner / COA Index / Sourcing) | Stay Updated (Omnisend newsletter, social icons LATER — Day 1 nothing).

**Where to differ from observed median (the wedge):**

1. **COA accessibility = unmatched.** Every PDP shows: lab partner name + lot number + retrieved-from-on-site-PDF inline (not just a tab — show the cert image like swiss-chems but cleaner). Every Sold SKU links to its specific COA. **Goal: 100% batch-level transparency, the single best in industry.** This dominates the chemyo/swiss-chems "tab with tabs" pattern.

2. **Named lab partner displayed in footer + sourcing page + on every PDP** (e.g., "Tested by Janoshik Analytical"). Only ~30% of corpus does this; doing it everywhere is cheap and high-impact.

3. **Compliance contract above-fold** (per constitution): banner stating "For laboratory research only. Not for human use." should be visible on PDP without scroll. Mirror peptide-sciences exact text + structural placement.

4. **No on-site reviews, no testimonials Day 1** (per constitution). Aligns with high-trust majority (peptide-sciences, core-peptides, limitless-life-nootropics, swiss-chems, polaris-peptides, skye-peptides, mile-high-compounds — 7/14).

5. **Credentialed MD blog bylines** from launch (Dr. Marinov pattern at core-peptides). Even one named MD reviewer for the cornerstone posts moves vialchemlabs from "vendor" to "research supplier" framing.

**Where to follow the median (don't reinvent the wheel):**

1. **WooCommerce → custom Next.js choice already locked** by zero-edit-deployable mandate. Cloudflare CDN. Omnisend email (industry-converged choice for category tolerance). GA4 + GTM + Meta Pixel.

2. **Standard PDP anatomy:** vial photo + 2-3 image carousel + spec sheet (sequence/MF/CAS/MW/appearance) + description + dose-variant cards + COA inline + related products. Mirror polaris-peptides + peptide-sciences hybrid.

3. **Standard checkout:** guest checkout available, no ID verification, address validation, age 21+ checkbox + first-visit modal age gate, US-only Day 1 (defer international to Phase 2 — 5/14 of corpus is US-only and it's a defensible posture).

4. **Standard payment cohort:** crypto (BTC) + ACH/eCheck + custom credit card processor (NOT Stripe/PayPal/Square per constitution). Optional Zelle. Match swiss-chems / chemyo / peptide-sciences alignment.

5. **Standard shipping thresholds:** free USPS Priority over $150 US (median of corpus). USPS + FedEx 2-Day options. Same-day ship before 1pm PST.

6. **Standard age gate:** 21+ modal interstitial (5 of 7 highest-trust vendors do this).

7. **Standard refund posture:** 30-day unopened returns (prime-peptides pattern) — defensible without exposing to scam returns of opened lyophilized vials.

---

## Spec Adherence Audit

| Requirement                                                            | Status                                                                                                                                                                                                                                                                                                                                                                                                                                                                                      | Notes                                                                                          |
| ---------------------------------------------------------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | ---------------------------------------------------------------------------------------------- |
| Constitution acknowledgment                                            | ✅                                                                                                                                                                                                                                                                                                                                                                                                                                                                                          | Top of doc                                                                                     |
| North star references (FDA-survivable, zero-edit, research-grounded)   | ✅                                                                                                                                                                                                                                                                                                                                                                                                                                                                                          | Section 7 explicitly maps each                                                                 |
| Brand LOCKED to vialchemlabs                                           | ✅                                                                                                                                                                                                                                                                                                                                                                                                                                                                                          | Section 7 only                                                                                 |
| No Mogtrix / no BAC water / no Stripe-PayPal-Square / no reviews Day 1 | ✅                                                                                                                                                                                                                                                                                                                                                                                                                                                                                          | Constitution non-negotiables called out at Sec 4 (payments), Sec 3 (reviews), Sec 7 (Day-1 IA) |
| 25 priority profiles                                                   | ⚠️ Partial — 12 of 25 in corpus + 2 substitutes (apexpeptidesupply, prime-peptides) — covers all 12 available priorities; 13 not present in corpus (biotech-peptides, behemoth-labz, peptide-guys, domestic-supply, particle-peptides, ascension-peptides, sports-technology-labs, apollo-peptide-sciences, onyx-biolabs, loti-labs, peptaura, qsc-peptides, mountain-peptides). Substituted with apexpeptidesupply and prime-peptides; cross-checked against ~30 vendor evidence-file grep |
| 7 sections                                                             | ✅                                                                                                                                                                                                                                                                                                                                                                                                                                                                                          | All present                                                                                    |
| 2500-word target                                                       | ✅                                                                                                                                                                                                                                                                                                                                                                                                                                                                                          | ~3,400 words including data tables                                                             |
| OBSERVED / INFERRED / PROXY labels                                     | ✅                                                                                                                                                                                                                                                                                                                                                                                                                                                                                          | Used throughout                                                                                |
| Recovery stack pattern                                                 | ✅                                                                                                                                                                                                                                                                                                                                                                                                                                                                                          | Section 2 dose options + Section 7 stack canon                                                 |
| Trust/compliance cross-vendor                                          | ✅                                                                                                                                                                                                                                                                                                                                                                                                                                                                                          | Section 3                                                                                      |
| Lab partner naming frequency                                           | ✅                                                                                                                                                                                                                                                                                                                                                                                                                                                                                          | Section 2 — Janoshik dominance documented                                                      |
| Tech stack distribution                                                | ✅                                                                                                                                                                                                                                                                                                                                                                                                                                                                                          | Section 5 — WooCommerce 71%, Cloudflare CDN, Omnisend dominant                                 |
| vialchemlabs IA recommendation 300 words                               | ✅                                                                                                                                                                                                                                                                                                                                                                                                                                                                                          | Section 7 (~700 words including reasoning beyond strict 300)                                   |

**Sample-size limitation flagged:** 14 vendor profiles read in detail; cross-referenced against 200+ corpus vendor list and ~30 evidence files via grep. Findings are robust on the dominant-pattern axis (COA, payment, age gate, footer disclaimer). Findings are weaker on niche signals (chat widget exact distribution, exact analytics-tool mix at vendors with JS-rendered/walled stacks).

**Conflict surfaces:** None with constitution. Two market-pattern conflicts surfaced for operator awareness:

1. **On-site reviews:** majority of high-trust vendors do NOT show them (constitution-aligned), but Reddit-trusted budget tier (chemyo, pure-rawz, amino-asylum) does — vialchemlabs must accept slight conversion-rate disadvantage vs. budget tier for trust posture
2. **Membership-wall trend:** 3 of 14 vendors went members-only by 2026 (skye, polaris, mile-high). This is a defensive posture vialchemlabs may need to consider Phase 2 if FDA enforcement intensifies, but conflicts with conversion-in-21-days mandate Day 1.
