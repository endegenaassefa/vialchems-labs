---
slug: marketing-language-compliance
captured_at: 2026-05-06T23:45:00Z
captured_by: claude-opus-4-7-1m (deep-research subagent)
scope: marketing-text compliance signals across research-peptide vendor industry
sources_used:
  - 02_claude_code_outputs/acquisition_channels/email-marketing.md
  - 02_claude_code_outputs/acquisition_channels/vendor-instagram.md
  - 02_claude_code_outputs/acquisition_channels/vendor-x.md
  - 02_claude_code_outputs/acquisition_channels/vendor-tiktok.md
  - 02_claude_code_outputs/acquisition_channels/vendor-youtube.md
  - 02_claude_code_outputs/acquisition_channels/google-ads.md
  - 02_claude_code_outputs/acquisition_channels/seo-content-marketing.md
  - 02_claude_code_outputs/acquisition_channels/vendor-blogs.md
  - 03_raw_fetches/vendor-blogs/* (existing)
  - 03_raw_fetches/google-organic-search/* (existing)
  - 03_raw_fetches/compliance_slice/marketing_lang/* (fresh, this slice)
fresh_fetches_saved: 11
---

# Marketing-language compliance signals — research-peptide vendor industry

This document maps the MARKETING COPY (product descriptions, ad copy, email/SMS, social captions) used by US research-peptide vendors to remain discoverable to buyers while AVOIDING explicit medical claims. Sister artifacts cover per-vendor disclaimer boilerplate, payment processors, and enforcement events; this slice is restricted to the marketing voice.

## Methodology and evidence rules

- All quotes are byte-identical excerpts from observed marketing copy. Where a quote was sourced via Google SERP snippet indexing of a Cloudflare-blocked page, the source method is labeled `WebSearch SERP`.
- "OBSERVED" = directly captured. "INFERRED" = derived from corroborating evidence with named provenance.
- Where a vendor's live page is anti-bot-blocked (Cloudflare on Pure Rawz, Swiss Chems, Peptide Sciences, PureRawz blog), per the operator's anti-cheat rules I did NOT bypass — I substituted Google site:vendor.tld search snippet evidence. Each instance is documented in `03_raw_fetches/compliance_slice/marketing_lang/`.
- ≥6 vendors covered for product descriptions: Biotech Peptides, Core Peptides, Limitless Life Nootropics / Limitless Biotech, Swiss Chems, Pure Rawz, Peptide Sciences. PASS.
- ≥3 vendors per channel for ad/email/social: documented inline below.

---

## 1. Product description language

### 1.1 Biotech Peptides — BPC-157 PDP

**URL:** https://biotechpeptides.com/product/bpc-157/  
**Access date:** 2026-05-06 (fresh fetch)

**Verbatim opening sentence (hero):**
> "BPC-157, Body Protection Compound-157, is obtained from the parent protein Body Protection Compound (BPC). BPC is a naturally occurring protein in the digestive tract."

**Verbatim "Description" prose (max 3 sentences):**
> "BPC is a naturally occurring protein in the digestive tract. BPC -57 is a penta-decapeptide made up of 15 amino acids, and is derived from a stretch of endogenous BPC identified and isolated from gastric juice."

**Benefit / mechanism phrases used (verbatim):**
- "Animal studies have suggested its potential in supporting tissue repair processes"
- "It may further protect organs and potentially prevent gastric ulcer development"
- "enhance the function of the digestive tract and prevent against irritable bowel syndrome (IBS), gastrointestinal cramps, and Crohn's disease"  ← **OBSERVED CROSSOVER**
- "possible analgesic characteristics"
- "promote vascular growth through activation of VEGFR2 pathway"
- "research has suggested positive outcomes"
- "studies suggest it may enhance endothelial cells' growth"
- "Research in rats has observed that the peptide may substantially increase"

**Phrases AVOIDED (observation by absence):**
- No "treats X" / "cures Y" / "prescribed for"
- No human dosage recommendations (no mg/kg, no daily protocols)
- No before/after imagery referenced in description
- No "recommended for athletes" / "recommended for patients"
- No comparison to approved pharmaceuticals
- No prices framed as "course pricing"

### 1.2 Core Peptides — BPC-157 PDP

**URL:** https://www.corepeptides.com/peptides/bpc-157/  
**Access date:** 2026-05-06 (fresh fetch)

**Verbatim opening sentence (hero):**
> "The BPC-157 peptide, also known as Pentadecapeptide BPC 157 or Body Protection Compound 157, is a synthetic compound that has been suggested in various studies to assist with healing joint, tendon, and muscle tissue, as well as nerve tissue."

**Verbatim "Description" prose (max 3 sentences):**
> "BPC-157 is a peptide composed of 15 amino acids with potential protective properties. As the name suggests, Body Protection Compound (BPC) is an amino acid fragment isolated from gastric juice. BPC-157 is also commonly known as pentadecapeptide due to the 15 amino acids it is comprised of."

**Benefit / mechanism phrases used (verbatim):**
- "has been steadily researched for its potential in wound healing"
- "appears to bind with growth hormone receptors"
- "has been studied in correlation to gastrointestinal function"
- "may stimulate," "may lead to," "may counteract," "appears to have"
- "Studies have suggested," "appeared to exhibit," "researchers reported"
- "researchers explored the theory that the peptide BPC-157 might potentially hasten wound healing compared to a control group"
- "the BPC-157 murine models appeared to exhibit higher numbers of collagen, reticulin, and blood vessel development"
- "it was suggested that the peptide may impact tendon healing"

**Phrases AVOIDED:**
- No named-disease "treats X" claims (no "for IBS" / "for ulcer" / "for fibromyalgia")
- No human dosing
- No "buy for your X condition"
- No comparison to FDA-approved drugs

**Comparison note:** Core Peptides leans heavier on "may" / "appears to" / "suggested" hedges than Biotech Peptides, and AVOIDS named-disease language.

### 1.3 Limitless Life Nootropics / Limitless Biotech — BPC-157 PDP

**URL:** https://limitlesslifenootropics.com/product/bpc-157/  
**Access date:** 2026-05-06 (fresh fetch)

**Verbatim opening sentence (hero):**
> "BPC-157 is a synthetic peptide chain comprised of 15 amino acids, derived from a sequence of Body Protection Compound (BPC) found in gastric juice."

**Verbatim "Description" prose (max 3 sentences):**
> "This stable pentadecapeptide has been the subject of in vitro studies exploring its biological properties in tissue repair and regeneration. Its structural stability allows it to remain intact in various experimental conditions. BPC-157 is a synthetic peptide fragment currently under scientific investigation for its observed effects in non-human biological systems."

**Benefit / mechanism phrases used (verbatim):**
- "in vitro studies exploring its biological properties"
- "tissue repair and regeneration"
- "studies have reported its influence on tissue repair processes in various animal models"
- "The spray format bypasses first-pass metabolism, offering researchers improved compound delivery for in vitro studies examining wound healing, angiogenesis, and tissue repair mechanisms"
- "Every Limitless Biotech compound undergoes independent testing for endotoxins and sterility, meeting rigorous research standards"

**Phrases AVOIDED:**
- No "treats X" / "for human use"
- No human dosage
- No "biohacker" or "longevity" branding in the description body itself

**Notable absence at vendor level:** Limitless Life homepage does NOT carry a traditional footer compliance disclaimer block (per `03_raw_fetches/compliance_slice/limitless-life-nootropics__homepage.md`). This is the only major vendor in the anchor set without one.

### 1.4 Swiss Chems — BPC-157 PDP

**URL:** https://swisschems.is/product/bpc-157/  (live fetch 403; substituted SERP-indexed verbatim)  
**Access date:** 2026-05-06

**Verbatim opening sentence (hero):**
> "BPC-157 is a peptide chain derived from a naturally occurring protein in the human stomach and is thought to interact with growth factors and cytokines, which are important signaling molecules that regulate cell growth, differentiation, and inflammation."

**Verbatim "Description" prose (max 3 sentences):**
> "It has been shown to stimulate the production of extracellular matrix proteins and promote the growth of new blood vessels, both essential in tissue repair and regeneration. BPC-157 is currently being studied for its potential therapeutic effects on a variety of conditions, including gastrointestinal disorders, musculoskeletal injuries, and other inflammatory conditions."  ← **OBSERVED CROSSOVER (\"potential therapeutic effects on a variety of conditions\")**

**Benefit / mechanism phrases used (verbatim):**
- "has been shown to stimulate the production of extracellular matrix proteins and promote the growth of new blood vessels"
- "currently being studied for its potential therapeutic effects on a variety of conditions"  ← therapeutic framing
- "the unique composition of BPC-157 makes it shine as a probable agent of accelerated wound healing and vascular development"
- "Laboratory research demonstrates interactions with specific molecular pathways in experimental models"

**Phrases AVOIDED:**
- "treats" / "cures" (still avoided despite "therapeutic effects" hedge)
- Specific human dosing
- Direct prescription-drug comparisons

**Note:** Swiss Chems received an FDA warning letter in December 2024. The "potential therapeutic effects on a variety of conditions" language in PDPs likely contributed to enforcement.

### 1.5 Pure Rawz — BPC-157 PDP

**URL:** https://purerawz.co/product/bpc-157/  (live fetch 403; substituted SERP-indexed verbatim)  
**Access date:** 2026-05-06

**Verbatim hero / opening prose:**
> "Research on BPC-157 suggests that this peptide may support tissue repair mechanisms in research models."

**Verbatim "Description" prose (3 sentences across SKU variants):**
> "BPC-157 Arg is a synthetic peptide from a protein found in gastric juice. It is studied for possible effects on healing, blood vessel growth, and reducing inflammation in research models. BPC-157 Arg is primarily researched for its potential to promote tissue repair. It also helps in inflammation and joint pain reduction."  ← **OBSERVED CROSSOVER (the unhedged "It also helps in inflammation and joint pain reduction" sentence drops the research-frame entirely)**

**Benefit / mechanism phrases used (verbatim):**
- "In different research subjects, BPC-157 has appeared to work by upregulating growth factors like VEGF (vascular endothelial growth factor)"
- "it has been shown to influence the nitric oxide (NO) pathway in preclinical models"
- "A few studies have indicated that BPC-157 may play an important role in controlling blood flow in research subjects"
- "Researchers have also observed that BPC-157 may reduce inflammation, protect cells from oxidative stress, and promote cell migration"
- "long-term research is required to understand the full safety profile of this compound"
- "The following are a few of the side effects observed in research subjects" (KP-10 PDP)

**Distinctive vocabulary:**
- "research subjects" (substitutes for "users" / "people")
- "research models" (substitutes for "patients")
- "preclinical models"

**Phrases AVOIDED:**
- "for athletes" / "for bodybuilders"
- Direct human dosing
- Named-disease "for X disease" claims

### 1.6 Peptide Sciences — BPC-157 PDP

**URL:** https://www.peptidesciences.com/bpc-157  (live fetch 403; Wayback also blocked from environment; substituted SERP-indexed verbatim)  
**Access date:** 2026-05-06

**Verbatim hero / opening prose:**
> "BPC 157 (Body Protection Compound 157) is a synthetic pentadecapeptide derived from a naturally occurring gastric peptide originally isolated from mammalian gastrointestinal tissue. BPC was initially isolated from gastric juice and later identified in additional tissues, including skin and liver, prompting scientific interest in its molecular stability and biological activity."

**Verbatim "Description" prose (max 3 sentences):**
> "Experimental research has primarily focused on its biochemical stability and its interactions with molecular signaling pathways relevant to cellular organization, vascular biology, and tissue response models under laboratory conditions. Laboratory studies examining BPC 157 have focused on its molecular interactions within connective tissue, gastrointestinal, vascular, and neural-associated experimental models. In vitro and animal research suggests that BPC 157 interacts with pathways associated with collagen organization, endothelial signaling, nitric oxide modulation, and cytoskeletal dynamics."

**Benefit / mechanism phrases used (verbatim — strongest clinical hedge in corpus):**
- "Experimental research has primarily focused on..."
- "Laboratory studies examining BPC 157 have focused on..."
- "In vitro and animal research suggests..."
- "Within laboratory research environments, BPC-157 is used as a molecular probe to investigate..."
- "Experimental observations indicate that fibroblasts exposed to BPC-157 demonstrate altered survival dynamics..."

**Compliance language (verbatim — strongest in corpus):**
> "All articles and product information provided on the website are for informational and educational purposes only. The products offered are furnished for in-vitro studies only. These products are not medicines or drugs and have not been approved by the FDA to prevent, treat or cure any medical condition, ailment or disease. Bodily introduction of any kind into humans or animals is strictly forbidden by law."

**Phrases AVOIDED:**
- ALL named-disease language ("for IBS," "for Crohn's," "for inflammation" — all absent)
- ALL human dosing
- ALL therapeutic framing ("therapeutic effects" — absent)
- ALL "may help" — vendor uses "research suggests... interacts with pathways" exclusively

**Comparison note:** Peptide Sciences is the canonical clean-clinical exemplar in the corpus. It uses "molecular probe to investigate" — vocabulary so technical it borders on intentional unsearchability. The brand voluntarily shut down March 6, 2026 anyway, suggesting the maximally-defensive marketing posture did not protect the operator from the converging FDA / payment processor / ITC pressure.

### 1.7 Cross-vendor comparison: hero opening voice

| Vendor | Hero voice | Hedge density | Named-disease language | Human dosing | Crossover risk |
|---|---|---|---|---|---|
| Peptide Sciences | "synthetic pentadecapeptide derived from..." (molecular pathway) | extreme (every claim hedged) | NONE | NONE | very low |
| Limitless Life / Biotech | "synthetic peptide chain comprised of 15 amino acids" (technical) | high (every claim hedged) | NONE in PDP | NONE | low (PDP) — but press-release crossover, see §6 |
| Core Peptides | "synthetic compound that has been suggested in various studies" (research-frame) | high | NONE | NONE | low |
| Pure Rawz | "Research on BPC-157 suggests that this peptide may support tissue repair" + occasional UNHEDGED "helps in" | mixed (some unhedged) | NONE direct | NONE | moderate (one PDP variant drops the hedge) |
| Biotech Peptides | "obtained from the parent protein..." (technical) | mixed | "prevent against IBS / Crohn's disease" | NONE | high (named diseases in PDP body) |
| Swiss Chems | "thought to interact with growth factors and cytokines" | low-to-medium | "potential therapeutic effects on a variety of conditions" | NONE | high (therapeutic framing in PDP body); FDA warning letter Dec 2024 |

### 1.8 Universal "research-frame" vocabulary (verbatim, observed across ≥4 vendors)

The following words/phrases form the cross-vendor "research compound" dialect:

- **"may"** — universal; the single most-used hedge across the corpus
- **"studies have suggested"** / **"research has suggested"** — Biotech Peptides, Core Peptides, Limitless Life
- **"in vitro"** / **"in-vitro studies"** — Peptide Sciences (every page), Biotech Peptides (every blog), Limitless Life
- **"animal studies"** / **"animal models"** / **"murine models"** — Biotech Peptides, Core Peptides, Behemoth Labz blogs
- **"preclinical models"** — Pure Rawz, Behemoth Labz
- **"research subjects"** / **"research models"** — Pure Rawz, Limitless Life
- **"experimental models"** — Peptide Sciences (every page)
- **"appears to"** / **"appeared to exhibit"** — Core Peptides, Pure Rawz
- **"investigational formulation"** — Biotech Peptides blogs
- **"molecular probe to investigate"** — Peptide Sciences (vendor-leading clinical hedge)

---

## 2. Ad copy compliance signals

Per the existing `acquisition_channels/google-ads.md` slice and direct evidence here:

### 2.1 Anchor-vendor paid ad activity is functionally zero

Google Ads paid-search policy (Healthcare and Medicines + Pharmaceutical Manufacturers + Unapproved Substances + Circumventing Systems policies, all per `google-ads.md`) effectively closes the channel to research-peptide e-commerce. Similarweb / Semrush triangulation across the anchor universe shows paid-search keyword share at or below 1% for 7 of 8 anchor vendors. Source: `google-ads.md` claims `E-GA-015` through `E-GA-022`.

Therefore, **no anchor vendor was observed running compliant Google paid-search creative for category terms.** The closest documented observation is the JAMA Health Forum study (Chetty et al. 2025) finding 79 compounded-GLP-1 telehealth vendors in Google Sponsored — but those are LegitScript-certified compounding pharmacies, NOT research-peptide e-commerce vendors.

### 2.2 Limitless Life — the lone observed paid keyword exposure

Limitless Life Nootropics / Limitless Biotech is the only anchor vendor with non-trivial paid-search share (~20.39% per Similarweb), but the surfaced paid keywords are dominated by branded-defensive terms:
- "limitless life nootropics"
- "limitless biotech"
- "limitless life"
- "limitless peptides"
- One non-branded compound term: "semax"

Source: `google-ads.md` claim `E-GA-021`.

Branded-defensive paid-search creative softens the compliance risk because the landing page is the vendor's own homepage, and the keyword phrase contains no medical claim. No verbatim paid-search ad text was captured.

### 2.3 Industry signal of paid-promotion surge

LegitScript reports: "In 2024, LegitScript observed 308% more ads related to problematic peptides than in 2023, and 678% more compared to 2022" with the most-flagged compounds being "Melanotan, BPC-157, TB-500, PT-141, and GLP-1." The press release does NOT break this out by platform — it covers "online advertisements, social media channels, and e-commerce marketplaces" combined. Source: `google-ads.md` claim `E-GA-010`. URL: https://www.legitscript.com/2025/04/16/legitscript-2024-trends-report-finds-an-increase-in-illicit-prescription-drug-and-ai-generated-fake-online-pharmacy-activity/ (referenced via `google-ads.md`)

### 2.4 Compliance vs. PDP softening

Because anchor vendors do NOT run paid-search ads, the comparison "ad copy vs PDP copy" is largely unobservable for this segment. Where vendors DO advertise paid syndicated press releases, the softening goes the OTHER direction — see the Limitless Biotech "Peptides for Weight Loss" press release at §6.

---

## 3. Email and SMS compliance language

### 3.1 Welcome email language — direct evidence absent

Per the operator-briefing ethical rule across the existing `email-marketing.md` slice, sister researchers did NOT perform sign-ups across vendors to harvest welcome flows. Direct welcome-email content is therefore documented as uncertainty.

What IS captured verbatim from public surfaces:

### 3.2 Footer-form copy (verbatim, observed across Omnisend-on-WooCommerce vendors)

**Biotech Peptides** (https://biotechpeptides.com/):  
> "SUBSCRIBE TO OUR NEWSLETTER / Enjoy promotions and discounts."  
(Source: `email-marketing.md` claim `claim-eml-004`; the verbatim copy is the Omnisend / Divi default template.)

**Core Peptides** (https://www.corepeptides.com/):  
> "SUBSCRIBE TO OUR NEWSLETTER / ENJOY PROMOTIONS AND DISCOUNTS"  
(Source: `email-marketing.md` claim `claim-eml-005`.)

**Behemoth Labz** (https://behemothlabz.com/newsletter/) — fresh fetch:  
> "Join & Receive 15% Off + FREE Hand Strengthener"  
> "You will be the first to learn about new products, updates, and promotions if you subscribe to our newsletter. You will receive a free hand strengthener and 15% off your order with us."  
> "No purchase required to get a free hand strengthener. Submit a valid email address in the form below. Your email will never be shared because we detest spam!"

**Pure Rawz eBook lead-magnet** (https://purerawz.co/prz-library/):  
- Form fields: Name + Surname + Email (3 fields, all required)
- CTA verbatim: **"Submit to Get Your Free Download"**
- Lead magnet description: **"Choose a book, fill out the form, and get instant access to your download"**
(Source: `email-marketing.md` claim `claim-eml-007`.)

**Peptide Sciences** (Magento exit-intent popup, observed via April 2026 Wayback snapshot):  
- Lead magnet: **"Account Credit"** (10%)
- Compliance hedge phrase: **"Account credit applies to eligible research products at checkout. Credit availability may be limited to one per registered account."**  
(Source: `email-marketing.md` claim `claim-eml-001`.)

### 3.3 Subject-line patterns — observed via Trustpilot review evidence

Direct subject-line content is gated behind sign-ups. Indirect evidence captured:

- **Behemoth Labz**: "I receive emails on a regular basis offering better discounts" (Trustpilot reviewer); "15% off your next order after reporting a product quality issue" (Trustpilot reviewer). Source: `email-marketing.md` claim `claim-eml-021`.
- **Core Peptides**: "promotional emails approximately twice monthly, with higher frequency during major sales events" (third-party reviewer). Source: `email-marketing.md` claim `claim-eml-022`.
- **Pure Rawz**: "offered a discount on a subsequent order without providing a discount code" (Trustpilot reviewer). Source: `email-marketing.md`.
- **Limitless Life Nootropics**: "25% off coupon for honest reviews on Trustpilot and SiteJabber" (Trustpilot evidence) — review-incentive flow violating Trustpilot terms. Source: `email-marketing.md` claim `claim-eml-022`.

### 3.4 "Educational" framing in marketing emails

Pattern observation: the dominant lead-magnet ON-PAGE copy across Omnisend-on-WooCommerce vendors is the bare "Enjoy promotions and discounts." The two outliers are:

1. **Behemoth Labz** novelty-gift framing ("FREE Hand Strengthener") — converts the email-capture from a "deal subscription" to a "no-purchase reward" — gives the operator a marketing-incentive defense if the email-capture ever surfaces in enforcement evidence.
2. **Pure Rawz** PDF eBook framing ("Submit to Get Your Free Download") — treats the email capture as an EDUCATIONAL transaction (download a research-context document) rather than a discount transaction. This is the strongest "educational" framing in the corpus. It is also the rarest — only Pure Rawz uses it.

**Peptide Sciences** uses an "Account Credit" framing — explicitly distancing the lead magnet from "10% off" couponing toward "registered-research-customer benefit." Source: `email-marketing.md` claim `claim-eml-001`.

### 3.5 Disclaimer footers in emails

Direct email-footer verbatim is not extractable from public surfaces. By inference from vendor on-site footers (which the email templates likely echo):

- **Biotech Peptides / Core Peptides** likely repeat: "All products are sold for research, laboratory, or analytical purposes only, and are not for human consumption."
- **Behemoth Labz** likely repeats: "All products sold on this website are intended for research and identification purposes only. These products are not intended for human dosing, injection, or ingestion."
- **Limitless Life Nootropics** has NO traditional footer disclaimer block on its homepage and so the email-footer language is uncertain.

### 3.6 SMS marketing observation

Per existing `03_raw_fetches/sms-marketing/` directory existence, there is sister-agent evidence for SMS but it is not in scope for this slice. Cross-reference: `03_raw_fetches/sms-marketing/`.

---

## 4. Social-media compliance language

### 4.1 Instagram — verbatim bio language (≥4 vendors)

Captured from `vendor-instagram.md` and SERP confirmation (live IG fetches return base64 image placeholders to non-authenticated user-agents):

| Vendor | Handle | Verbatim bio |
|---|---|---|
| Peptide Sciences | @peptide.sciences | "Peptides, proteins & amino acid derivatives" |
| Limitless Life / Limitless Biotech | @limitless_biotech | "Premium USA-made peptides for advanced science. Third-party tested for purity and accuracy. Supporting diverse research areas." |
| Behemoth Labz | @behemothlabz | "Elite research-grade formulas. Engineered for power, precision & progress. Behemothlabz \| Built Different" |
| Behemoth Labz (satellite) | @behemothlabz_research | "Supplying Highest Quality Kick-Ass Research Compounds 🧪 Worldwide Shipping 🛩️" |
| Pure Rawz | @purerawzrevolution | "Stars, Stripes, and Science Top-Quality Compounds" / "PURE. RAW. AWESOME" |
| Swiss Chems | @swisschemsofficial | "The Future of Research with Innovation & Quality." |
| The Peptide Guy | @thepeptideguyy | "THE PEPTIDE GUY — Helping you heal & live longer with peptides. DM 'HEAL' to begin. Peptides & 30min Consultations" ← **OBSERVED CROSSOVER (drops research-only framing entirely)** |
| Domestic Peptides | @domesticpeptides | "the distributor of USA made Research Peptides and Chemicals with a Purity of 98.8% or better!" |
| Amino Asylum | @aminoasylum | "Preworkout & Intra 👇🏼" (post-FDA-raid wipe; this is the post-wipe placeholder bio) |

Sources: `vendor-instagram.md` claims `claim-001`–`claim-010`.

### 4.2 Instagram — verbatim caption compliance language (≥3 vendors)

From `vendor-instagram.md` evidence (caption tail-pattern):

- **Pure Rawz** (Enclomiphene Citrate post): **"for research purposes only. Not intended for human consumption."** Source: `vendor-instagram.md` claim `claim-019`.
- **Behemoth Labz @behemothlabz_research** SARMs caption: **"All compounds listed are intended for research purposes only and are not for human consumption."** Source: `vendor-instagram.md` claim `claim-020`.
- **Behemoth Labz** vendor-website footer (echoed in IG): **"All products sold on this website are intended for research and identification purposes only. These products are not intended for human dosing, injection, or ingestion."** Source: `vendor-instagram.md` claim `claim-005`.

**Indirect-language pattern observed in captions** (from `vendor-instagram.md` "Tactical evasion patterns" section):
> "Word substitution at the captioning level: 'research' replaces 'use', 'compound' replaces 'drug', 'study' replaces 'cycle', 'researchers' replaces 'customers'."

**Discount codes appear in AFFILIATE captions, not vendor-account captions** — a deliberate liability-distribution architecture. The vendor account stays "clean" while affiliate creators carry the conversion language. Source: `vendor-instagram.md` claim `claim-007`.

### 4.3 X (Twitter) — verbatim bio language

From `vendor-x.md`:

| Vendor | Handle | Verbatim bio |
|---|---|---|
| Peptide Sciences | @PeptideScience | "Peptide Sciences specializes in the synthesis of highly purified peptides, proteins and amino acid derivatives for scientific research and development." |
| Peptide Sciences (legacy) | @PeptideSciences | "USA Made Peptide Supplier, GHRP-2, GHRP-6, Melanotan 2, PT-141, Hexarelin, Sermorelin Acetate, IGF-1 Long R3, AOD9604, Buy Peptides, Peptide Labs" |
| Swiss Chems | @SwissChemsNew | "The largest research chemical catalogue online!" |
| Pure Rawz | @PureRawzsome | "The World's #1 SARMs Research Compound Supplier PURE \| RAW \| AWESOME" |
| Amino Asylum | @aminoasylums | "premium research: the highest quality research materials in the market" |

Sources: `vendor-x.md` evidence entries.

### 4.4 Hashtag taxonomy actually used (verbatim from observed posts)

From `vendor-instagram.md`:

**Vendor-account research-frame hashtags:**
- `#SARMsResearch`
- `#Top5SARMs`
- `#BehemothLabz`
- `#ResearchChemicals`
- `#LabTested`
- `#PureRawz`
- `#ScienceDriven`
- `#research2026`

**Affiliate / fitness-frame hashtags** (observed on @tristenescolastico → Swiss Chems and PureRawz satellite/affiliate posts):
- `#sarms`
- `#peptides`
- `#trt`
- `#hrt`
- `#gains`
- `#bodybuilding`
- `#Purerawz`
- `#Supplements`
- `#gymlife`
- `#usareel`
- `#proteinshakes`
- `#viralpost`
- `#trending`

**Influencer / longevity-frame hashtags** (Ben Greenfield → Limitless Life Nootropics):
- `#bengreenfield`
- `#longevity`
- `#peptides`
- `#antiaging`
- `#nootropics`
- `#nootropicsupplements`

Source: `vendor-instagram.md` "Verbatim hashtag taxonomy observed" section.

### 4.5 TikTok — verbatim bio and platform exclusion

From `vendor-tiktok.md`:

- **TikTok Shop policy** (verbatim): "peptide hormones, SARMs, and other agents used to enhance athletic performance or alter body composition beyond natural limits ... whether these substances are marketed as supplements, wellness products, or any other form" — universal exclusion of the research-peptide category. Source: `vendor-tiktok.md` claim `E-VTT-001`.
- **Pure Rawz** (@purerawz, the only confirmed-with-followers vendor TikTok): bio verbatim: **"The World's #1 SARMs Research Compound Supplier"**. 135 followers, 749 likes. Source: `vendor-tiktok.md` claim `E-VTT-015`.
- **Behemoth Labz** (@behemothlabzofficial, footer-linked): follower count blocked, but vendor footer disclaimer (which the bio likely echoes) is **"All products sold on this website are intended for research and identification purposes only. These products are not intended for human dosing, injection, or ingestion."** Source: `vendor-tiktok.md` claim `E-VTT-006`.
- **Affiliate / discount-code economy carries the conversion**: `ANABOLIC20` (Amino Asylum), `swole` (PureRawz), `SAM10`/`colby1`/`nattyplus`/`PLUS` (Swiss Chems variants — per-creator partitioning), `BioHackedBo` (Limitless Life), `INSIDE10` (Behemoth Labz). Source: `vendor-tiktok.md` claim `E-VTT-025`.

**Looksmaxxing hashtag cluster** (NOT vendor-owned; community-owned, but where peptide content lives): `#looksmaxxing`, `#mogging`, `#mewing`, `#hardmaxxing`, `#softmaxxing`, `#clavicular`, `#NoFap`, `#Y-pilled`. Source: `vendor-tiktok.md` claim `E-VTT-022`.

### 4.6 YouTube — verbatim disclaimer language

From `vendor-youtube.md`:

- **Peptide Sciences** (every video description, verbatim): "ALL ARTICLES AND PRODUCT INFORMATION PROVIDED IN THIS VIDEO OR WEBSITE ARE FOR INFORMATIONAL AND EDUCATIONAL PURPOSES ONLY. The products offered on this website are furnished for in-vitro studies only. In-vitro studies (Latin: in glass) are performed outside of the body. These products are not medicines or drugs and have not been approved by the FDA to prevent, treat or cure any medical condition, ailment or disease. Bodily introduction of any kind into humans or animals is strictly forbidden by law." Source: `vendor-youtube.md`.
- **Amino Asylum** (long-form video descriptions): literally the string "No description has been added to this video"; only hashtags (#massagetherapy #killit #neverquit). Source: `vendor-youtube.md`.

The Peptide Sciences disclaimer is the gold-standard YouTube template; the Sports Technology Labs channel was nonetheless TERMINATED ("This channel was removed because it violated our Community Guidelines") despite running similarly clean clinical posture, which is the strongest available evidence that disclaimer language alone does not protect against platform removal. Source: `vendor-youtube.md` claim `E-VY-023`.

---

## 5. The "actively avoided" pattern

Compiled by absence-observation across the corpus. Each entry: (a) what mainstream vendors AVOID, (b) ≥2 vendor URLs where the formulation is conspicuously absent or hedged, (c) ≥1 example URL where a HEDGED version IS used.

### 5.1 Therapeutic disease claims ("treats X", "cures Y", "for Z disease")

**Avoided in:**
- https://www.peptidesciences.com/bpc-157 (NO disease names anywhere in description; vendor uses "molecular probe to investigate" instead)
- https://www.corepeptides.com/peptides/bpc-157/ (NO disease names; uses "may stimulate" / "may impact tendon healing" instead)
- https://limitlesslifenootropics.com/product/bpc-157/ (NO disease names; "in vitro studies exploring its biological properties")

**Hedged-version usage observed at:**
- https://biotechpeptides.com/product/bpc-157/ — verbatim "**enhance the function of the digestive tract and prevent against irritable bowel syndrome (IBS), gastrointestinal cramps, and Crohn's disease**" — uses "prevent against" (mild hedge) rather than "treats" but the named-disease language is present and is the kind of claim FDA enforcement reviewers cite.
- https://swisschems.is/product/bpc-157/ — verbatim "**currently being studied for its potential therapeutic effects on a variety of conditions, including gastrointestinal disorders, musculoskeletal injuries, and other inflammatory conditions**" — uses "potential therapeutic effects" (hedge) rather than "treats" but "therapeutic" is the medical-product framing the vendor's own footer disclaimer (boilerplate research-only) is meant to negate.

### 5.2 Specific human dosing recommendations (mg/kg, daily protocols)

**Avoided in:**
- All 6 anchor PDPs surveyed (BPC-157 pages at biotechpeptides.com, corepeptides.com, limitlesslifenootropics.com, swisschems.is, purerawz.co, peptidesciences.com) — none publish a "research-subject dosing protocol" or "daily mg/kg" recommendation in the product description.
- https://behemothlabz.com/cortagen-peptide-uses-benefits-side-effects-and-dosage/ — TITLE invokes "Dosage" but BODY explicitly states: "**There is no established human dosage for Cortagen.**" — the vendor pre-empts the FDA reading by inserting a defensive denial.

**Hedged-version usage observed at:**
- Behemoth Labz Cortagen blog (above) — title contains "Dosage" but body provides only animal-study dosages. This is the closest the corpus comes to dosing language; even here the vendor disowns human dosage explicitly.
- INFERRED: vendor blog posts likely contain animal-study dosages presented as "researchers report 10 μg/kg in rat models." This is the line the vendors do walk; published direct-to-consumer human dosing is absent.

### 5.3 Comparative drug claims ("better than [pharma drug]")

**Avoided in:**
- https://biotechpeptides.com/product/bpc-157/ (no comparison to ibuprofen / NSAIDs / approved IBD drugs)
- https://www.corepeptides.com/peptides/bpc-157/ (no comparison to corticosteroids or approved healing agents)

**Hedged-version usage observed at:**
- https://behemothlabz.com/is-retatrutide-the-same-as-ozempic-a-detailed-comparison/ — full blog post title is **"Is Retatrutide The Same As Ozempic? A Detailed Comparison"** — direct comparison to a named approved pharmaceutical (Ozempic / semaglutide). Source: WebSearch SERP indexing 2026-05-06.
- The "Ozempic vs Retatrutide" comparison framing is also implied across listicles and aggregator content per `seo-content-marketing.md` "best alternatives" cluster.

### 5.4 Direct-to-consumer wellness positioning ("for your health")

**Avoided in:**
- https://www.peptidesciences.com/bpc-157 ("molecular probe to investigate" — anti-wellness vocabulary by design)
- https://biotechpeptides.com/product/bpc-157/ (despite weak crossover, never uses "for your wellness")
- https://www.corepeptides.com/peptides/bpc-157/ (no wellness framing)

**Hedged-version usage observed at:**
- https://www.fintechfutures.com/press-releases/peptides-for-weight-loss-limitless-biotech-s-best-solution-for-effective-weight-management — paid press release headline: **"Peptides for Weight Loss: Limitless Biotech's Best Solution for Effective Weight Management"** — direct wellness positioning in the press-release HEADLINE.
- @thepeptideguyy IG bio: **"Helping you heal & live longer with peptides. DM 'HEAL' to begin"** — direct-to-consumer wellness framing.

### 5.5 Recovery / longevity / anti-aging direct claims (vs. "research suggests" hedges)

**Avoided in:**
- https://www.peptidesciences.com/bpc-157 (no "anti-aging" claim — even where vendor publishes an "Ageless" eBook, the on-page claims hedge)
- https://www.corepeptides.com/peptides/bpc-157/ (no anti-aging language)
- https://biotechpeptides.com/product/bpc-157/ (no anti-aging language)

**Hedged-version usage observed at:**
- Limitless Biotech Instagram bio: "**Premium USA-made peptides for advanced science. Third-party tested for purity and accuracy. Supporting diverse research areas.**" — "advanced science" is the hedged version; "Supporting diverse research areas" sidesteps wellness while implying breadth.
- Ben Greenfield → Limitless Life Nootropics influencer captions hashtag-cluster includes `#longevity`, `#antiaging` — affiliate creator carries the un-hedged language; vendor account does not. Source: `vendor-instagram.md`.
- @thepeptideguyy IG bio (above) uses "live longer" — un-hedged vendor-side longevity claim from the influencer-vendor hybrid.

### 5.6 Before/after photography

**Universally avoided in vendor-owned PDP imagery** across all 6 surveyed BPC-157 pages. Product images are vial photography, COA images, and molecular structure renderings. No surveyed vendor PDP includes patient-style before/after photography on the BPC-157 product page itself.

**Where it appears:** affiliate / influencer accounts on Instagram and TikTok carry before/after physique transformations; vendors do not. This is structurally important — it means the vendor-side liability shield assumes that before/after content is a third-party (affiliate creator) phenomenon. Source: `vendor-tiktok.md` and `vendor-instagram.md`.

### 5.7 Testimonials phrased as health outcomes

**Avoided on all 6 surveyed PDPs.** Where review schema exists (Biotech Peptides "Rated 4.93 out of 5 based on 67 customer ratings"), the surfaced reviews appear to be product-quality reviews (purity, packaging, shipping) rather than health-outcome testimonials.

**Where it appears:** Trustpilot reviews collected by aggregator services and influencer affiliate captions on TikTok ("I absolutely love this stuff!" — Noah Jay BPC-157 quote per `vendor-tiktok.md` claim `E-VTT-028`).

### 5.8 The "operate-as-chemical-supplier" defensive posture

**Universally used across:**
- https://biotechpeptides.com/ (footer): **"Biotech Peptides is a chemical supplier. Biotech Peptides is not a compounding pharmacy or chemical compounding facility as defined under 503A of the Federal Food, Drug, and Cosmetic act. Biotech Peptides is not an outsourcing facility as defined under 503B of the Federal Food, Drug, and Cosmetic act."**
- https://corepeptides.com/ (footer): identical structure with vendor-name substitution.

This is observed boilerplate — the strongest single defensive marketing claim in the category. By disclaiming compounding-pharmacy / outsourcing-facility status, the vendor is signaling that they are claiming the chemical-supplier-to-laboratory regulatory category instead.

---

## 6. The "OBSERVED CROSSOVER" findings

Where a vendor crosses into clearly therapeutic / medical territory. Documented as findings, not endorsements.

### 6.1 Biotech Peptides — named-disease therapeutic claim in PDP

**URL:** https://biotechpeptides.com/product/bpc-157/  
**Access date:** 2026-05-06  
**Verbatim quote:**  
> "It may further protect organs and potentially prevent gastric ulcer development. **enhance the function of the digestive tract and prevent against irritable bowel syndrome (IBS), gastrointestinal cramps, and Crohn's disease**."

**Why it's a crossover:** Names three specific human diseases (IBS, gastric ulcer, Crohn's) and uses "prevent against" — therapeutic-action verb. The vendor's own footer disclaimer ("All products are sold for research, laboratory, or analytical purposes only, and are not for human consumption") would be cited as inconsistent with body-of-page claims under FDA's intended-use doctrine.

**Liability-shield WEAKNESS observation:** The sister `compliance_disclaimers/` corpus is documenting the disclaimer; the body-of-page named-disease claims directly weaken that disclaimer.

### 6.2 Swiss Chems — "potential therapeutic effects" on PDP

**URL:** https://swisschems.is/product/bpc-157/ (live 403; SERP-indexed)  
**Access date:** 2026-05-06  
**Verbatim quote:**  
> "**BPC-157 is currently being studied for its potential therapeutic effects on a variety of conditions, including gastrointestinal disorders, musculoskeletal injuries, and other inflammatory conditions.**"

**Why it's a crossover:** Uses "therapeutic effects" — an explicit medicinal-product framing — and lists three condition categories ("gastrointestinal disorders, musculoskeletal injuries, and other inflammatory conditions"). The hedge "potential therapeutic effects" / "currently being studied" is the legal cover; the framing remains medicinal.

**Real-world consequence:** Swiss Chems received an FDA warning letter December 2024 (per `vendor-tiktok.md` claim `E-VTT-032`). FDA enforcement reviewers do not appear to credit "currently being studied" hedges that name target conditions.

### 6.3 Pure Rawz — unhedged "helps in inflammation and joint pain reduction"

**URL:** https://purerawz.co/product/bpc-157-arg/ (live 403; SERP-indexed)  
**Access date:** 2026-05-06  
**Verbatim quote:**  
> "BPC-157 Arg is primarily researched for its potential to promote tissue repair. **It also helps in inflammation and joint pain reduction.**"

**Why it's a crossover:** The second sentence drops the research-frame hedge entirely. "It helps in inflammation" is a direct claim of action; "joint pain reduction" is a direct outcome claim. No "may," no "research suggests," no "in animal models."

This is the cleanest example of a vendor inadvertently dropping out of the research-frame voice for one sentence. Most likely a copywriting failure rather than a deliberate posture; either way, it is the kind of evidence FDA cites.

### 6.4 Limitless Biotech — paid press release with un-hedged weight-loss framing

**URL:** https://www.fintechfutures.com/press-releases/peptides-for-weight-loss-limitless-biotech-s-best-solution-for-effective-weight-management  
**Other distribution URLs:**  
- https://finance.yahoo.com/news/peptides-weight-loss-limitless-biotech-140000573.html  
- https://www.globenewswire.com/news-release/2024/12/16/2997587/0/en/Peptides-for-Weight-Loss-Limitless-Biotech-s-Best-Solution-for-Effective-Weight-Management.html  
**Access date:** 2026-05-06 (release date Dec 16, 2024)

**Verbatim title:** "Peptides for Weight Loss: Limitless Biotech's Best Solution for Effective Weight Management"  
**Verbatim body quotes:**
- "**Peptides like Retatrutide have been shown to work by targeting multiple biological pathways to promote fat loss and regulate appetite.**"
- "**Recent clinical studies have also shown that peptides such as CJC 1295 & Ipamorelin can lead to significant reductions in body fat.**"
- COO Cody Whitten quote: "Peptides are truly at the forefront of weight loss research"

**Why it's a crossover:** The title alone — "Peptides for Weight Loss" — is direct consumer-marketing language with no hedge. "Promote fat loss" / "significant reductions in body fat" are direct claims. Distribution targets non-research audiences (Yahoo Finance, fintechfutures.com).

This is the **strongest observed crossover in the corpus**. It is also the most enforcement-exposing because press releases are public, syndicated, dated, and traceable to the vendor as authorized speech (paid distribution requires vendor sign-off).

### 6.5 The Peptide Guy (Noah Sailer) — IG bio drops research-only framing entirely

**URL:** https://www.instagram.com/thepeptideguyy/  
**Access date:** 2026-05-06 (per `vendor-instagram.md` claim `claim-008`)  
**Verbatim bio:**  
> "**THE PEPTIDE GUY — Helping you heal & live longer with peptides. DM 'HEAL' to begin. Peptides & 30min Consultations**"

**Why it's a crossover:** "Helping you heal" / "live longer" / "30min Consultations" abandons all research framing. Treats the IG funnel as a direct-to-consumer wellness consultation business. The DM-routing pivot ("DM 'HEAL' to begin") moves the actual sales conversation off public-scannable IG into 1:1 chat where Meta classifiers don't intervene — a tactical evasion.

This is an **influencer-vendor hybrid** model and structurally different from the chemical-supplier vendors. But the IG bio is unambiguously consumer-wellness. Account at 40K followers.

### 6.6 Behemoth Labz — Cortagen blog post title invokes "Dosage" while body denies human dosage

**URL:** https://behemothlabz.com/cortagen-peptide-uses-benefits-side-effects-and-dosage/  
**Access date:** 2026-05-06 (fresh fetch)  
**Title (verbatim):** "Cortagen Peptide: Uses, Benefits, Side Effects, and Dosage"  
**Body quote (verbatim):** "**There is no established human dosage for Cortagen.**"

**Why it's a partial crossover (or a defensive workaround):** The TITLE invokes consumer-medication SEO vocabulary ("Uses, Benefits, Side Effects, and Dosage") — which captures buyers searching for those concepts. The BODY then defensively denies human dosage. This is a hybrid — the vendor wants both the SEO discoverability and the legal defense.

The "no established human dosage" insertion is interesting because it pre-empts the FDA enforcement reading: if a reviewer reads the title and assumes the post offers human dosing, the body explicitly denies it. The vendor is reading FDA enforcement playbooks and adapting copywriting.

### 6.7 Behemoth Labz — "Is Retatrutide The Same As Ozempic?" — direct pharma comparison

**URL:** https://behemothlabz.com/is-retatrutide-the-same-as-ozempic-a-detailed-comparison/  
**Access date:** 2026-05-06 (SERP-indexed)  
**Title (verbatim):** "Is Retatrutide The Same As Ozempic? A Detailed Comparison"

**Why it's a crossover:** Direct comparison framing to a named approved pharmaceutical. The title alone implies a buyer-decision-relevant comparison ("which should I buy?"). Even with a research-frame body, the title and SEO posture are pharma-comparator framing — directly disallowed by Google Ads policy and likely citable as FDA evidence of intended use.

### 6.8 Limitless Life — review-incentive program (Trustpilot terms violation)

**URL:** Trustpilot reviewer evidence per `email-marketing.md` claim `claim-eml-022`  
**Access date:** Per existing slice  
**Verbatim:** "**25% off coupon for honest reviews on Trustpilot and SiteJabber**"

**Why it matters:** Not strictly a medical-claim crossover, but a marketing-compliance crossover. The practice is a Trustpilot terms-of-service violation (Trustpilot policy prohibits incentivized reviews). FTC also has guidance on disclosed-incentive practices. The pattern indicates the vendor uses email/discount infrastructure as a review-acquisition channel — the kind of pattern that surfaces in adverse press and supports FDA's "marketing cues resembling consumer product" framing.

### 6.9 Cortagen blog "Animal studies show that cortagen boasts" — un-hedged research summary

**URL:** https://behemothlabz.com/cortagen-peptide-uses-benefits-side-effects-and-dosage/  
**Access date:** 2026-05-06 (fresh fetch)  
**Verbatim:** "**Animal studies show that cortagen boasts**"

**Why it's a partial crossover:** "Cortagen boasts" is direct claim-framing (the verb "boasts" implies impressive demonstrated capabilities). The vendor mitigates with "animal studies" qualifier and the explicit "None of these effects has been established through controlled human clinical trials" clause later in the post. But the verb choice ("boasts" rather than "is observed to have") slips the research-tone briefly.

---

## Cross-references

- Disclaimer boilerplate per vendor: `compliance_disclaimers/` (sister-agent territory; not duplicated here)
- Payment processors and per-vendor enforcement events: `compliance_disclaimers/` sister artifacts
- Vendor profile JSON: `vendors/<slug>.json` (per existing schema in `PILLAR_*.md`)
- Acquisition channel evidence (parent slices): `02_claude_code_outputs/acquisition_channels/*.md`

## Fresh fetches saved this slice

In `03_raw_fetches/compliance_slice/marketing_lang/`:

1. `biotech-peptides__bpc157-pdp.md` — direct fetch BPC-157 PDP
2. `biotech-peptides__bpc157-pdp-followup.md` — extended benefit-phrase pass; named-disease crossover finding
3. `biotech-peptides__blog-glow-blend.md` — verbatim 17+ "may" hedge inventory
4. `core-peptides__bpc157-pdp.md` — direct fetch BPC-157 PDP
5. `core-peptides__blog-ghkcu.md` — clinical-hedge blog exemplar
6. `core-peptides__pt141-pdp.md` — sexual-function compound clinical-hedge dialect
7. `limitless-life__bpc157-pdp.md` — direct fetch BPC-157 PDP
8. `limitless-life__retatrutide-press-release.md` — paid-syndicated press-release crossover finding
9. `swisschems__bpc157-pdp.md` — SERP-substituted (Cloudflare 403); "therapeutic effects" crossover
10. `purerawz__bpc157-pdp.md` — SERP-substituted (Cloudflare 403); unhedged "helps in" crossover
11. `peptide-sciences__bpc157-pdp.md` — SERP-substituted (Cloudflare 403); strongest clinical-hedge corpus exemplar
12. `behemoth-labz__blog-cortagen.md` — title-vs-body crossover pattern, "no established human dosage" insertion
13. `behemoth-labz__newsletter-page.md` — verbatim novelty-gift lead-magnet copy

Total fresh fetches: 13.

## Source quality and uncertainty

- Three of the six target vendor product pages (Swiss Chems, Pure Rawz, Peptide Sciences) returned HTTP 403 to direct WebFetch. Per the operator's anti-cheat rules I did NOT bypass — I substituted Google site:vendor.tld SERP snippet evidence, which captures live-page text as Google indexed it. This evidence is byte-identical to the live page at the indexing time, with the caveat that Google's index may lag.
- Wayback Machine (web.archive.org) is also blocked from this environment ("Claude Code is unable to fetch from web.archive.org"), preventing the supplementary archive read for Peptide Sciences. The Peptide Sciences brand voluntarily shut down March 6, 2026, so live access is rapidly degrading.
- Welcome-email content is not directly captured anywhere in the corpus — the operator-briefing rule prohibits sign-ups across vendors. Subject-line content is gated behind sign-up; reported via Trustpilot reviewer evidence only.
- TikTok and Instagram numeric counts come from Google search-result snippets, not from direct authenticated fetches. Marked uncertain in source slices.
