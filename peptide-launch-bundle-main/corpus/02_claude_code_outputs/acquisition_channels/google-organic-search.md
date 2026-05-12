---
channel_slug: google-organic-search
channel_name: Google organic search
channel_category: search
captured_at: 2026-05-06
captured_by: claude-code-subagent
evidence_file: acquisition_channels/evidence/google-organic-search.evidence.txt
---

# Google organic search

## How the channel works for this category

Google organic is the de facto primary acquisition channel for research-peptide vendors because the alternatives are largely unavailable. Both major paid platforms (Google Ads and Meta) actively block peptide-related campaigns under their unapproved-pharmaceutical policies, with crawler-level enforcement that bans accounts even when the landing page only mentions peptides tangentially [evidence: lanternsol-seo-channel; nexamed]. As the Nexamed agency post puts it, "Meta and Google don't want anything to do with peptides," with the explicit rationale that paid platforms refuse to be "the channel that let companies promote it" if regulators later move against the category. The result is an industry that has converged on SEO as the only scalable acquisition lane: agencies cite "10.1 million monthly US peptide-related searches by January 2026" as the addressable surface [evidence: lanternsol-for-peptides].

The query taxonomy splits sharply by intent type, and Google rewards different page types in each:

- **Generic category terms** ("buy peptides", "research peptides for sale") are dominated by older B2B-coded scientific brands — Phoenix Pharmaceuticals, Aapptec, Biosynth, JPT, MyBioSource — alongside biohacker-leaning vendors that have invested in commercial intent (Biotech Peptides, Core Peptides, rPeptide, Pure Health Peptides, Direct Peptides). Notably, several anchor biohacker brands (Limitless Life Nootropics, Pure Rawz, Behemoth Labz, Swiss Chems, Peptide Guys, Amino Asylum, Domestic Supply) DO NOT crack the top 10 for the bare head term [evidence: serp-buy-peptides; serp-buy-research-peptides-online-vendor]. This is the head-term moat: Phoenix-style B2B vendors win on domain age and academic-coded E-A-T; grey-market vendors win narrower compound-name terms instead.

- **Compound-name terms** ("BPC-157 buy", "TB-500", "GHK-Cu", "Ipamorelin") are dominated by vendor PDPs — typically 8 of the top 10 results are e-commerce product pages, with one regulator/anti-doping page (USADA) and one academic/PMC reference [evidence: serp-bpc-157]. Limitless Biotech, Biotech Peptides, Verified Peptides, Pure Health Peptides, Core Peptides, BioLongevity Labs, ProSpec, and (until March 2026) Peptide Sciences anchor these SERPs. Long-form, citation-heavy PDPs win — Biotech Peptides' BPC-157 page carries 10 peer-reviewed references; Core Peptides' GHK-Cu page carries 15 [evidence: biotechpeptides-bpc157-pdp; corepeptides-ghkcu-pdp]. Schema markup is heavily used: Product + Offer JSON-LD on Limitless Biotech, Product + Review (AggregateRating "4.93/5 from 67 ratings") on Biotech Peptides, AggregateRating ("4.85/5") on Behemoth Labz [evidence: limitlesslifenootropics-bpc157-pdp; biotechpeptides-bpc157-pdp; behemothlabz-homepage].

- **Review/comparison terms** ("best peptide vendor 2026 review") are owned by a tightly clustered listicle ecosystem — Cernum Biosciences, Outliyr, Protide Health, The Peptide Catalog, SubQ Protocol, Healthletic, PeptideDeck, Finnrick, Trustpilot, EU Peptide Guide [evidence: serp-best-peptide-vendor]. At least 6 of the 10 are vendor-owned blogs or affiliate sites that rank themselves or their preferred vendor at #1: Protide Health ranks Protide Health #1, PeptideDeck recommends only Ascension Peptides via affiliate links, Outliyr ranks Limitless Biotech #1 with discount-code monetization [evidence: outliyr; protidehealth; peptidedeck]. Only Finnrick (independent third-party testing, 7,164 samples / 205 vendors) and Trustpilot (review platform) read as truly neutral.

- **Reddit/forum-style validation** queries that users want to ask Reddit instead get caught by 2nd-order content. Reddit URLs themselves do NOT appear in any top 10 we captured for the major commercial terms; instead, articles ABOUT Reddit ("Top 5 Peptide Injections Reddit Guide", "Best Place in USA to Buy Peptides Reddit") rank in their place [evidence: search returned no reddit URLs for the source-list query]. This is a key arbitrage opportunity for new entrants — community sentiment is high-value but Google demands a domain to host it.

E-A-T tension is structural. YMYL classification means Google "demands expert review" and "PubMed-backed content," per The SEO Clinic's pitch [evidence: theseoclinic]. Vendors that lack medical credentials hedge with a uniform disclaimer formula ("for research, laboratory, or analytical purposes only, and are not for human consumption") that appears nearly verbatim across Core Peptides, Biotech Peptides, Limitless Biotech, and others [evidence: corepeptides-homepage; biotechpeptides-homepage]. The disclaimer is doing dual work: it satisfies Google's "no medical claim" requirement while preserving plausible legal posture as a research-supply business — which is also the FDA-warning-letter avoidance strategy.

The visibility gap is severe. swisschems.is, with global Similarweb rank #97,158, is one of the larger biohacker vendors and still ranks in the bottom 4% of all websites; its top-5 competitors (umbrellalabs.is, science.bio, peptidesciences.com, kimerachems.co, behemothlabz.com) cluster in a narrow grey-market band, and 2 of those 5 (science.bio, peptidesciences.com) shut down in early 2026 [evidence: similarweb]. Below that band is a long tail of small vendors with effectively zero discoverable Google presence — the category is concentrated at the top and undiscoverable below it.

## Named vendor examples

| vendor_slug | brand_name | usage_pattern_excerpt | url | evidence_entry_id |
|-------------|------------|------------------------|-----|--------------------|
| biotech-peptides | Biotech Peptides | "Buy Peptides Online - CREDIT CARDS ACCEPTED (USA Made)" — top-3 ranker for both "buy peptides" head term and "BPC-157 buy" compound term, Product + Review schema with "Rated 4.93 out of 5 based on 67 customer ratings" | https://biotechpeptides.com/product/bpc-157/ | biotechpeptides-bpc157-pdp |
| limitless-life-nootropics | Limitless Biotech (Limitless Life Nootropics) | Top compound-name ranker (BPC-157, Ipamorelin, MOTS-C, GHK-Cu, TB-500); Product schema with full Offer JSON-LD ($99.99/InStock/Price valid through 2027); research-application taxonomy (Cognitive/Immune/Metabolic/Mitochondrial...) | https://limitlesslifenootropics.com/product/bpc-157/ | limitlesslifenootropics-bpc157-pdp |
| core-peptides | Core Peptides | "Peptides for Sale Online - USA Made" — long-form compound PDP with 15 academic refs, Product schema, prominent COA image; ranks for "GHK-Cu", "MOTS-c", and category brand terms | https://www.corepeptides.com/peptides/ghk-cu-50mg-copper/ | corepeptides-ghkcu-pdp |
| peptide-sciences | Peptide Sciences | Decade-long top-3 ranker for nearly every compound-name term until "voluntarily shut down operations" March 6, 2026; ~$7.4M/mo revenue at peak; vacated SERP slots now contested by replacements | https://www.peptidesciences.com/bpc-157 | peptide-sciences-shutdown |
| swisschems | Swiss Chems | Despite ".is" TLD, US-operated; Similarweb global rank #97,158, US #26,399; "Health > Nutrition Diets and Fitness" category #122; received Dec 2024 FDA warning letter; ranks for SARMs and peptide blends | https://swisschems.is/ | similarweb-swisschems-competitors |
| behemoth-labz | Behemoth Labz | "#1 Trusted Compound Vendor" — Product schema + AggregateRating ("Rated 4.85 out of 5") visible; SARMs-first positioning, peptides secondary; likely common ownership with Pure Rawz | https://behemothlabz.com/ | behemothlabz-homepage |
| pure-rawz | Pure Rawz | swisschems.is competitor cluster member; ranks for SARMs and CJC-1295/Ipamorelin/BPC-157 PDPs; mixed Reddit reputation, COAs available for "majority" of products | https://purerawz.co/ | similarweb-swisschems-competitors |
| domestic-supply | Domestic Supply | "Buy Steroids Online USA" — explicitly steroid-coded title; ranks primarily on steroid terms; secondary peptide visibility (Semaglutide/Tirzepatide/Retatrutide/Melanotan); cites bodybuilding-forum approval badges | https://domestic-supply.com/ | domestic-supply-homepage |
| phoenix-pharmaceuticals | Phoenix Pharmaceuticals | B2B wholesaler, decades-old, owns the "buy peptides"/"research peptides for sale" head terms; serves "academic labs, biotech/pharma" — the E-A-T moat play | https://phoenixpeptide.com/ | serp-buy-peptides |

## Cost structure for a new entrant

- **Setup cost (site build + content infra):** $5K-$25K for a credible vendor site. Shopify/WooCommerce + custom theme + research-graded PDP template + Product/Review/FAQ schema infrastructure. The minimum-viable site needs ~30-50 long-form compound PDPs (800-2000 words each, with peer-reviewed citations) to be competitive on compound-name terms. PDP content runs $200-$600 each from a freelance medical writer; in-house production is faster but harder to scale. Citation-heavy long-form is non-negotiable per E-E-A-T signals. [INFERENCE — extrapolated from agency descriptions of expected page architecture; no vendor has published their build cost]

- **Monthly recurring (content production, SEO tooling):** $3K-$8K for paid agency engagement at the low end (The SEO Clinic flat $3K/mo), $5K-$15K for in-house team. Tools: Ahrefs/SEMrush ($200-$500/mo), schema validation, technical SEO monitoring. Add 5-10 net-new PDPs or supporting content pieces per month to keep ranking velocity. Backlink acquisition is the largest variable cost — "wellness blogs and clinical research forums" require negotiation, content swaps, or paid placements. [evidence: theseoclinic-peptide-seo: "$3,000 monthly fee with no long-term contracts"]

- **Per-unit (cost per ranked piece):** $200-$1,500 per ranking-grade PDP (writing + medical review + technical refs + schema implementation + internal linking). For long-tail compound pages with low competition, the lower bound; for head terms competing against Phoenix Pharmaceuticals or surviving against Peptide Sciences-replacement traffic, the upper bound or higher.

- **Time investment:** 20-40 hours/week from one full-time SEO+content owner if going in-house, dropping to 5-10 hours/week of vendor management with agency. Initial site build typically 4-12 weeks before first rankable content goes live. [INFERENCE — combining agency timeline statements; no vendor has published actual hours]

## Time horizon to traction

- **Lower bound: 28 days** — Nexamed cites a case study of "40,600% growth in peptide keyword clicks" within 28 days, but this is an extreme outlier requiring an existing site with prior authority being repositioned, not a cold start [evidence: nexamed-peptide-seo]. Treat as marketing puffery rather than a planning baseline.

- **Median expectation: 3-6 months** — Both Lantern Sol ("Typically 3–6 months for traction") and The SEO Clinic ("$10k+ increase in organic monthly revenue within 3-6 months") triangulate on this band [evidence: lanternsol-seo-channel; theseoclinic-peptide-seo]. The InfiniWell case study shows what 6 months of execution can deliver: 1,343 keyword rankings, 20 top-3 positions, +$367K attributed revenue [evidence: lanternsol-seo-channel].

- **Upper bound: 12-18 months** — to challenge for head-term rankings ("buy peptides", "research peptides for sale") against Phoenix Pharmaceuticals and Biosynth, who have decades of authority. New entrants almost universally win compound-name long-tail first and never reach the head term. [INFERENCE based on the observed B2B-vs-grey-market split in head SERPs]

- **Basis:** Limitless Biotech, Biotech Peptides, Core Peptides — all visible mid-curve domains with mature compound-PDP libraries and 1-3 year ranking history per Similarweb proxies. Phoenix Pharmaceuticals — the >10-year domain that owns the head term. Peptide Sciences — was at the curve apex (~$7.4M/mo) before shutdown, demonstrating the ceiling.

## Risk profile

- **Platform-policy risk (Google manual action, deindex): MODERATE-HIGH** — YMYL classification means Google scrutinizes peptide pages for medical claims; The SEO Clinic explicitly markets "fix the technical leaks that cause 'gray-area' sites to get de-indexed" [evidence: theseoclinic-peptide-seo]. The Nexamed crawler-detection observation ("they will crawl that page, identify what you're doing, and ban your account") applies equally to organic indexing decisions, not just paid [evidence: nexamed-peptide-seo].

- **Regulatory risk (FDA/FTC scrutiny if site over-claims): HIGH-CRITICAL** — FDA issued 50+ warning letters to GLP-1 compounders in a single month (Sept 2025), with explicit citation of website language as the violation [evidence: WSGR / peptide-sciences-shutdown]. Vendors selling Tirzepatide/Semaglutide/Retatrutide face the highest exposure; the Gram Peptides warning letter (March 2026) was triggered by the FDA reviewing the website itself. Vendors selling only compound-name peptides (BPC-157, GHK-Cu, MOTS-C) face lower but non-trivial exposure.

- **Reputational risk (community detection of cheap SEO play): MODERATE** — Reddit and Finnrick are the watchdog layers. Finnrick has tested 205 vendors / 7,164 samples and assigns A-F grades — being graded D or F is materially damaging to organic conversion even if rankings hold [evidence: finnrick]. Listicle-detection by community members (e.g. "PeptideDeck only recommends Ascension Peptides via affiliate links") creates Reddit threads that themselves de-trust the listicle ecosystem.

- **Capital-loss risk (sunk content cost with no rankings): MODERATE** — A throwaway brand with no domain authority faces a 3-6 month delay before rankings materialize, during which content investment is unrecovered. If the brand pulls a flag-trigger (FDA letter, Finnrick failing grade, viral negative Reddit thread) within that window, sunk cost is total. Mitigation: launch on an aged domain or acquire one of the partially-deindexed vacant slots (peptidesciences.com-replacement traffic is being competed for actively).

## Posture-specific fit

### Posture A — Clean Clinical Labs
- **Recommendation:** PURSUE
- **Reasoning:** Google's E-E-A-T machinery rewards exactly the surface area Posture A is built to project. The ranking PDP template is already "long-form, citation-heavy, COA-prominent, schema-marked" — Limitless Biotech, Biotech Peptides, Core Peptides all execute this and rank well [evidence: limitlesslifenootropics-bpc157-pdp; biotechpeptides-bpc157-pdp; corepeptides-ghkcu-pdp]. The disclaimer-formula compliance ("research, laboratory, or analytical purposes only") is universally adopted [evidence: corepeptides-homepage; biotechpeptides-homepage]. The most successful incumbent is essentially Posture A executed competently, and the Peptide Sciences shutdown vacates ranking slots that Posture A is best-positioned to capture.
- **Creative/copy adjustments required:**
  - Implement Product + AggregateRating schema (table-stakes), add FAQ schema for AI Overview eligibility
  - Build per-compound PDPs with peer-reviewed citations (10+ refs minimum, mirroring Biotech Peptides)
  - Visible batch-numbered COA images on every PDP (matching Limitless Biotech's batch pattern)
  - Author bylines with credentials for blog content (E-E-A-T signal)
  - Avoid GLP-1-brand-name comparisons (Ozempic/Wegovy/Mounjaro) to dodge FDA warning-letter pattern
- **Specific vendors to study:** limitless-life-nootropics, biotech-peptides, core-peptides, ascension-peptides (for affiliate-driven listicle wins)

### Posture B — Meme-Coded Community
- **Recommendation:** DEFER (selectively pursue narrow long-tail only)
- **Reasoning:** Meme/community brand voice is structurally penalized by Google's YMYL evaluation — it reads as the opposite of "expert," "credentialed," "PubMed-backed" content that ranking pages all carry [evidence: theseoclinic-peptide-seo]. Behemoth Labz uses an aggressive "#1 Trusted Compound Vendor" posture and ranks well, but the Behemoth example actually proves the limit: it ranks for SARMs (a tighter community niche) better than for the open peptide head terms, and it leans on Product+Review schema and lab-test trust signals as much as on community vibes [evidence: behemothlabz-homepage]. The meme posture also accelerates community-detection risk on Reddit, where "feels like a marketing op" sentiment forms quickly and shows up on the SERP via the Reddit-aggregator articles. Brand authority on Google = boring, slow, credentialed; brand authority on community = funny, fast, shitposty. The two postures fight each other.
- **Creative/copy adjustments required if pursued:**
  - Bifurcate site into two voice registers: serious-research voice on PDPs (for ranking), brand-meme voice on social/email (for retention)
  - Schema markup MUST still be clinical-style; meme can live in product names but never in PDP body
  - Avoid Tirzepatide/Semaglutide entirely under this posture (FDA risk × meme detection)
  - Lean into compound long-tail with under-served terms (e.g. "SLU-PP-332 for sale", "KPV peptide buy")
- **Specific vendors to study:** behemoth-labz (most aggressive meme vendor that still ranks), pure-rawz (mixed clinical/community), domestic-supply (full grey-market, but ranks on steroid terms not peptide terms)

## Channel-specific data captured

- **Top-ranking domains for "buy peptides"** (top 10 SERP, May 2026): phoenixpeptide.com, biotechpeptides.com, rpeptide.com, peptide.com (Aapptec), biosynth.com, mybiosource.com, jpt.com, peptidepros.net, purehealthpeptides.com, directpeptides.com [evidence: serp-buy-peptides]
- **Top-ranking domains for "buy research peptides online vendor":** biotechpeptides.com, rpeptide.com, phoenixpeptide.com, limitlesslifenootropics.com, directpeptides.com, mybiosource.com, corepeptides.com, peptidepros.net, nusciencepeptides.com, peptide.com [evidence: serp-buy-research-peptides-online-vendor]
- **Top-ranking domains for "BPC-157 buy" (compound term):** biotechpeptides.com, verifiedpeptides.com, usada.org (regulator), peptidesciences.com (stale post-shutdown), limitlesslifenootropics.com, purehealthpeptides.com, biolongevitylabs.com, pmc.ncbi.nlm.nih.gov (academic), compoundingrxusa.com, prospecbio.com [evidence: serp-bpc-157]
- **Top-ranking domains for "best peptide vendor 2026 review":** cernumbiosciences.com, outliyr.com, protidehealth.com, thepeptidecatalog.com, subqprotocol.com, healthletic.io, finnrick.com, peptidedeck.com, trustpilot.com, eupeptideguide.com [evidence: serp-best-peptide-vendor]

- **Schema markup observed on vendor product pages:**
  - Limitless Biotech BPC-157 PDP: Product (JSON-LD) + Offer (price/availability/condition) + price validity dates [evidence: limitlesslifenootropics-bpc157-pdp]
  - Biotech Peptides BPC-157 PDP: Product + Review (AggregateRating "4.93/5 from 67 ratings") [evidence: biotechpeptides-bpc157-pdp]
  - Core Peptides GHK-Cu PDP: Product (no Review/FAQ schema visible) [evidence: corepeptides-ghkcu-pdp]
  - Behemoth Labz site: Product + AggregateRating ("4.85/5") visible [evidence: behemothlabz-homepage]
  - FAQ schema NOT consistently observed on the PDPs we sampled — opportunity gap

- **Indexed-page counts for anchor vendors (`site:` operator approximations):** site:peptidesciences.com returned at least: Research Peptides info, account create, reviews page, featured products, Peptides-all, Cerebrolysin research page, Peptide Research, ebook download, Peptides and Stem Cell Research — confirming a deep content footprint despite the shutdown notice. Other anchor `site:` queries (e.g. limitlesslifenootropics.com excluding /product) returned product-category pages, formulas, and individual nasal-spray PDPs, indicating a layered category/product taxonomy. [Note: WebSearch does not reliably return Google's total indexed-result count; precise indexed-page counts are uncertain]

- **Notable absences (anchor vendors with no detectable ranking on head term "buy peptides"):**
  - peptide-guys (peptideguys.com) — search did not return this domain in any peptide-related query attempted; likely low-authority or inactive
  - amino-asylum (aminoasylum.shop) — domain redirects to peptidecoupons.com, suggesting brand winddown post-FDA-raid (June 2025)
  - The four hypothetical Posture A operator brand-name brainstorms (Hunter Eyes Labs, NZT Peptides, LAR Labs, Adam Labs, Land Bio, Structure Labs) and the four Posture B brainstorms (Jester Labs, Psycho Labs, Chad Labs, LARP Labs) were searched and confirmed NOT to be active peptide vendors at this time; "Hunter Lab" returns an Australian skincare brand; "LABRAT PEPTIDES" exists separately from "LAR Labs"

- **Patterns: which content types Google favors here:**
  - Compound-name SERPs: 70-80% vendor PDPs, 10-20% regulator/academic, 0-10% other
  - Head category SERPs: 90%+ vendor category/home pages, B2B-coded brands favored over grey-market
  - Review/comparison SERPs: 80%+ listicle/affiliate, of which majority are vendor-owned
  - Reddit-style community queries: ZERO Reddit URLs in top 10; instead, articles ABOUT Reddit win the slot — major arbitrage signal

## Newly discovered vendors

Vendors surfaced during research that are NOT on the original anchor list:

- **Verified Peptides** (verifiedpeptides.com) — top-3 ranker for BPC-157, MOTS-C; "third party lab tested and verified"; GMP-claimed
- **Pure Health Peptides** (purehealthpeptides.com) — top-10 for "buy peptides", strong PDP coverage
- **BioLongevity Labs** (biolongevitylabs.com) — newer vendor, ranks compound-name PDPs (BPC-157, GHK-Cu, MOTS-c, TB-500)
- **Direct Peptides** (directpeptides.com) — top-10 for "buy research peptides"
- **Ascension Peptides** — repeatedly named #1 by PeptideDeck (likely affiliate); third-party COAs claimed
- **Protide Health** (protidehealth.com) — runs the "Top 10 Peptide Companies in USA" listicle and ranks itself #1
- **Cernum Biosciences** (cernumbiosciences.com) — runs "Best Peptide Sources 2026" comparison guide, top-1 for that query
- **The Peptide Catalog** (thepeptidecatalog.com) — runs vendor-comparison content, also runs "Peptide Sciences Is Gone: 7 Vendors Still Shipping" piece
- **Peptide Dossier** (peptidedossier.com) — guides + reviews ecosystem, captures shutdown-related traffic
- **Limitless Biotech / Limitless Life Nootropics** (limitlesslifenootropics.com) — anchor vendor confirmed; also brands itself as "Limitless Biotech"
- **Polaris Peptides, Heritage Labs USA, Royal Peptides, Onyx Biolabs, BulkGLP, NuRev Peptides** — all rank for tirzepatide/retatrutide/semaglutide compound terms; smaller but visible
- **Peptidology, Healthgevity, LVLUP Health, Felix Chemical Supply, Triumphant Labs, Xcel Peptides, Sports Technology Labs, Spectre Labs, Bioinfinity, Pinnacle Peptide Labs, Particle Peptides** — all named in 2026 listicles, some with confirmed independent presence
- **Umbrella Labs** (umbrellalabs.is) — top Similarweb competitor to Swiss Chems (100% similarity), but received FDA warning letter
- **Paradigm Peptides** — Finnrick A grade (8.9 across 16 products); founders pleaded guilty to federal charges Dec 2025
- **NorthPeptide, AdaptPeptides, Pure US Peptides, BioStrata Research, PeptidesExplorer** — opportunistic content sites that emerged around the Peptide Sciences shutdown

## Uncertainty notes

- **"Indexed page count" precision** — uncertain; WebSearch does not reliably return Google's total result counts. We confirmed indexed pages exist on each anchor domain but cannot give exact counts without direct browser SERP screenshots, which we did not capture.
- **Schema markup detection** — the Limitless Biotech, Biotech Peptides, Core Peptides, and Behemoth Labz schema findings are based on WebFetch's content interpretation; we did NOT inspect raw HTML or run schema validators. JSON-LD presence is described in the WebFetch summary but not directly quoted at the source-code level. Confidence is high but not source-code-verified.
- **Peptide Sciences SERP status** — uncertain whether peptidesciences.com PDPs are still ranking weeks after the March 2026 shutdown, or whether they have been deindexed. The site still returns 403 to direct fetches but appears in WebSearch results. INFERRED: Google has not yet fully demoted the domain, creating an arbitrage window for replacement-content sites.
- **"PureRawz and Behemoth Labz are the same company"** — INFERRED from a single source (nanotechproject.org) describing it as "very likely to be the truth"; would need corporate-records verification. SUPPORT_QUOTE count: 1.
- **Posture-reference vendor verification** — Hunter Eyes Labs, NZT Peptides, LAR Labs, Adam Labs, Land Bio, Structure Labs, Jester Labs, Psycho Labs, Chad Labs, LARP Labs returned NO matches as active peptide vendors in 2026; most likely operator brainstorms. "Hunter Lab" returns Australian skincare; "LABRAT PEPTIDES" is unrelated; "Planet Peptide" emerges from a forum thread suggesting maybe Lucas Weber is involved with a "Chad" memorial page. Treat as confirmed-hypothetical.
- **Time-to-rank case studies** — the 28-day, 4-month, and 6-month claims come from agency marketing pages and likely select for best outcomes; median brand should expect 6+ months for material traction.
- **"$7.4M monthly revenue" for Peptide Sciences** — single source (peptidedossier.com); plausible but unverified.
- **FDA enforcement statistics** — well-triangulated (WSGR, peptidedossier, peptide-sciences shutdown coverage all cite the 50+ September 2025 letters); confidence high.
- **Reddit ranking absence** — confirmed via search-with-no-results, but reddit IS searchable on Google more broadly; the absence is specific to commercial-intent peptide queries, not universal.
