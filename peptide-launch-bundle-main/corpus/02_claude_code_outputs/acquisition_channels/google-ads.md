---
channel_slug: google-ads
channel_name: Google Ads (paid search)
channel_category: search
captured_at: 2026-05-06
captured_by: claude-code-subagent
evidence_file: acquisition_channels/evidence/google-ads.evidence.txt
---

# Google Ads (paid search)

## How the channel works for this category

Google's policy stack effectively closes paid search to research-peptide e-commerce. The relevant policies are layered. The top-level Healthcare and Medicines policy (https://support.google.com/adspolicy/answer/176031) prohibits "the promotion of services related to the online prescribing, dispensing, and sale of prescription drugs" and "Herbal and dietary supplements with active pharmaceutical or dangerous ingredients." The Pharmaceutical Manufacturers sub-policy (https://support.google.com/adspolicy/answer/15597836) is the only Google Ads policy slot that uses the word "peptides" by name — and it does so to permit them in a narrow channel: "Bulk drug manufacturers, medical professional suppliers, and suppliers of antibodies, peptides, and compounds for commercial labs may advertise in the following locations only" (Canada and US, with certification at the child-account level). That pathway is structurally not available to a "research peptide" e-commerce vendor selling RUO single vials to individual purchasers — it is a B2B-to-lab carve-out. Source [E-GA-001, E-GA-002].

The classic research-peptide catalog (BPC-157, TB-500, melanotan, sermorelin, ipamorelin, CJC-1295, GHK/GHK-Cu, thymosin variants) is NOT explicitly enumerated on the Google Ads-monitored prescription-drug reference list (https://support.google.com/adspolicy/answer/2430794) — only semaglutide and tirzepatide appear. That asymmetry matters: GLP-1 vendor terms trip automatic prescription-drug certification gating, while the rest of the catalog is enforced via the catch-all "non-exhaustive list of unapproved pharmaceuticals and supplements" plus the "active pharmaceutical or dangerous ingredients" clause in the Unapproved Substances policy (https://support.google.com/adspolicy/answer/15595718). The practical effect is identical — research-peptide ads get disapproved or accounts get suspended — but the enforcement happens by reviewer judgment of landing-page intent, not by trigger-word lookup. This is consistent with practitioner reports that the most common detection mechanism is the landing-page crawl: "if the landing page you send traffic to discusses peptides in any way, they will crawl that page, identify what you're doing, and ban your account" [E-GA-012]. Sources [E-GA-003, E-GA-004, E-GA-012].

OBSERVED evidence of paid-Google activity in the broader peptide space exists but is concentrated in two narrow lanes that anchor research-peptide vendors do NOT occupy. Lane one: compounded-GLP-1 telehealth. The peer-reviewed Chetty et al. study (JAMA Health Forum, January 2025) used Google Shopping searches and identified 98 unique websites selling GLP-1 RAs — 79 of them compounded — appearing in Google's sponsored results, "most" reporting LegitScript certification [E-GA-008]. Lane two: approved-pharma brand pages. The companion JAMA paper (PMC12579337) found Ozempic.com alone "spent on more than 15 000 paid keywords" generating "2.4 million paid visits" between April 2022 and March 2024 — $7.5M of paid search by the brand manufacturer, including bidding on competitor terms ($302K on "Ozempic for weight loss," $113K on Mounjaro-related terms, $204K on Trulicity-related terms) [E-GA-009]. Neither lane describes the brick-stack research-peptide vendor: Lane 1 requires LegitScript + 503A/503B compounding pharmacy registration + state pharmacy license + Google certification; Lane 2 requires being Novo Nordisk or Eli Lilly. Sources [E-GA-008, E-GA-009].

INFERRED: the Similarweb + Semrush "Organic vs Paid" keyword-share view across the anchor vendor universe is consistent with the policy-driven lockout. Seven of the eight anchor vendors with available Similarweb data show paid-search keyword share at or below 1%: Peptide Sciences 0% (also Semrush "Paid Search Traffic: 0"); Swiss Chems 0.12%; Pure Rawz 0%; Biotech Peptides 0%; Behemoth Labz 0%; Core Peptides has paid not surfaced in top channels; Amino Asylum has Display / Direct / Mail in top three with no Paid Search. The single exception is Limitless Life Nootropics / Limitless Biotech at 79.61% organic / 20.39% paid — but the surfaced top paid keywords are almost all branded ("limitless life nootropics," "limitless biotech," "limitless life," "limitless peptides") with one non-branded compound term ("semax"). The reading most consistent with the policy environment is that this is branded-defensive bidding (or affiliate / competitor bidding) rather than a category-keyword Google Ads campaign. None of these signals are conclusive without direct SERP observation, but together they triangulate against any anchor vendor running meaningful "buy peptides" / "BPC-157" paid Google search at present. Sources [E-GA-015 through E-GA-022].

The Google Ads Transparency Center (https://adstransparency.google.com/) is the canonical observation tool for verified-advertiser status, but it is a JavaScript-rendered SPA that the available WebFetch tool cannot read; per-domain queries returned only navigation chrome. This is a documented methodology gap; the Similarweb / Semrush triangulation is the workaround used here. A real-browser observation pass should be executed to confirm zero-results state for each anchor vendor before final claims about Transparency Center findings are made with high confidence [E-GA-026].

The OBSERVED industry-level signal is real and rising. LegitScript reported "In 2024, LegitScript observed 308% more ads related to problematic peptides than in 2023, and 678% more compared to 2022" with the most-flagged compounds being "Melanotan, BPC-157, TB-500, PT-141, and GLP-1" [E-GA-010]. The press release does NOT break this number out by platform — it covers "online advertisements, social media channels, and e-commerce marketplaces" combined. So while the category is clearly experiencing a paid-promotion surge, the share attributable specifically to Google paid search vs. Meta/TikTok display vs. native programmatic vs. e-commerce listings is not separable from the LegitScript data alone [E-GA-010, E-GA-011].

Pivot-page / cloaking tactics are theoretically available but explicitly listed in Google's Circumventing Systems policy (https://support.google.com/adspolicy/answer/15938075) as a class of violation that triggers account-level termination, not just individual ad disapproval. The verbatim definition: "Showing Google a landing page or an ad's destination that complies with Google Ads' policies while showing people different content," and "Tricking people into clicking on your ad by promoting a topic they're interested in and then leading them to a website for an entirely different topic" [E-GA-005]. Combined with FDA's April 2026 enforcement action piercing the "Research Use Only" disclaimer in seven research-peptide vendor warning letters [E-GA-023], the cost-of-failure profile of the cloaking pivot is now substantially higher than 2023-vintage practitioner advice acknowledges.

## Named vendor examples

| vendor_slug | brand_name | usage_pattern_excerpt | url | evidence_entry_id |
|-------------|------------|------------------------|-----|--------------------|
| peptide-sciences | Peptide Sciences | Similarweb "Organic 100% / Paid 0%"; Semrush "Paid Search Traffic: 0" — zero paid Google search activity (also voluntarily shut down operations early 2026) | https://www.similarweb.com/website/peptidesciences.com/ | E-GA-015 |
| swiss-chems | Swiss Chems | Similarweb "Organic 99.88% / Paid 0.12%" — effectively zero paid search; the 0.12% likely random branded-defensive bidding noise | https://www.similarweb.com/website/swisschems.is/ | E-GA-016 |
| pure-rawz | Pure Rawz | Similarweb "Organic 100% / Paid 0%" keyword split; top channels Organic/Direct/Mail | https://www.similarweb.com/website/purerawz.co/ | E-GA-018 |
| biotech-peptides | Biotech Peptides | Similarweb "Organic vs. Paid - Organic 100%, Paid 0%"; Organic Search 74.92% of all visits | https://www.similarweb.com/website/biotechpeptides.com/ | E-GA-019 |
| behemoth-labz | Behemoth Labz | Similarweb "Organic 100% / Paid 0%" keyword split; top channels Organic/Direct/Mail | https://www.similarweb.com/website/behemothlabz.com/ | E-GA-020 |
| core-peptides | Core Peptides | Similarweb top channels Organic Search 64.77% / Direct; no paid search in surfaced top channels | https://www.similarweb.com/website/corepeptides.com/ | E-GA-017 |
| amino-asylum | Amino Asylum | Similarweb top three channels: Display / Direct / Mail — Display dominance suggests programmatic or affiliate banner ads, NOT Google Search Ads | https://www.similarweb.com/website/aminoasylum.shop/ | E-GA-022 |
| limitless-life-nootropics | Limitless Life Nootropics / Limitless Biotech | OUTLIER: Similarweb "Organic 79.61% / Paid 20.39%" — but top paid keywords are all branded vendor-name queries plus one non-branded compound ("semax"). Strongly suggests branded-defensive bidding rather than category-term peptide ads; warrants direct SERP verification | https://www.similarweb.com/website/limitlesslifenootropics.com/ | E-GA-021 |
| compounded-glp-1-telehealth-cohort | (cohort, n=79) | Per JAMA Health Forum 2025: 79 websites selling compounded GLP-1 RAs DID appear in Google Sponsored results during July-September 2024 search window; "most" reported LegitScript certification. This is the ONLY documented vendor cohort verified to actively run paid Google search ads in the peptide adjacency, and it requires LegitScript + 503A/503B compounding pharmacy registration | https://pmc.ncbi.nlm.nih.gov/articles/PMC11742527/ | E-GA-008 |
| ozempic-novo-nordisk | Ozempic.com (Novo Nordisk) | Per JAMA / Semrush: $7.5M spent on >15,000 paid keywords for Ozempic alone, 2.4M paid visits (Apr 2022–Mar 2024). Demonstrates the only verified large-scale Google paid-search spend on a peptide compound is by the approved-pharma brand manufacturer, not by a research-peptide vendor | https://pmc.ncbi.nlm.nih.gov/articles/PMC12579337/ | E-GA-009 |

## Cost structure for a new entrant

- **Setup cost (Google Ads account + LP build):** $0–500 to open an account; $1,000–5,000 to build a "research only / GMP supplier" landing page that has any chance of passing review. Optional but effectively-required: LegitScript Healthcare Merchant Certification ~$2,000–6,000 application + annual fees if pursuing the compounded/pharmacy pathway.
- **Monthly recurring (ad spend at minimum useful levels):** Effectively unbounded above zero, but irrelevant — the binding constraint is approval, not spend ceiling. An anchor-vendor-style "research peptides for sale" campaign will be disapproved at submission or have the account suspended within days/weeks of going live; sunk spend is the LP build + agency fees, not media.
- **Per-unit CPC for any term that is approvable:** Truly approvable terms are vendor's own brand name (low single-digit dollars at most — Limitless Life Nootropics' branded keyword cost estimates are $1.00–$4.37 per Similarweb modeling). Category terms ("buy peptides", "BPC-157 buy") cannot be reliably purchased at any CPC because the underlying landing page will not be approved. For the GLP-1 lane (where ads do clear), the JAMA Semrush data implies a blended CPC around $3 ($7.5M / 2.4M paid visits = ~$3.13 average, dominated by branded queries — non-branded competitive terms run materially higher).
- **Time investment:** Highly variable. For the failed-attempt research-peptide path, expect 5–20 hours/week for 2–6 weeks of LP iteration + appeals before abandoning. For the LegitScript-certified compounded-pharmacy path, expect 3–9 months and meaningful legal counsel before first approved click.

## Time horizon to traction

Conditional on approval, Google paid search is immediate (clicks within hours of launch). The binding question is approval friction. For a low-capital throwaway-brand research-peptide launch the realistic horizon is "never" via direct campaigns; possibly weeks via cloaking or pivot-page tactics before account termination. The compounded-pharmacy + telehealth pathway requires months of pharmacy + LegitScript + Google certification before serving a single ad, which is incompatible with the throwaway-brand posture.

## Risk profile

- **Platform-policy risk: critical.** Per Google's Healthcare and Medicines policy: "Herbal and dietary supplements with active pharmaceutical or dangerous ingredients" prohibited; per Pharmaceutical Manufacturers policy, peptides are advertisable only by "suppliers of antibodies, peptides, and compounds for commercial labs" with certification — not by direct-to-individual e-commerce. Cloaking is explicitly enumerated in the Circumventing Systems policy as an account-termination class violation. Real-world reports of "ad account had been fully suspended twice in six months" pre-engagement are typical [E-GA-014]. Sources [E-GA-001, E-GA-002, E-GA-005].
- **Regulatory risk: high.** April 2026 FDA warning letters to seven research-peptide vendors specifically pierce the "Research Use Only" disclaimer language that vendor-side compliance frameworks (yourpeptidebrand.com / Nexamed) treat as the magic word for ad approval [E-GA-023]. Paid-acquisition copy is explicit promotional speech; FDA can and does treat it as evidence of intended use, independent of disclaimer language.
- **Reputational risk: moderate.** "Sponsored" badges in research-peptide community subreddits are read as a sketchy-vendor signal (consistent with the LegitScript "red flags include marketing cues resembling supplement or lifestyle-product positioning despite unapproved status") [E-GA-010]. The Posture A "Clean Clinical Labs" target audience is technical and skeptical of paid-acquisition framing; the Posture B "Meme-Coded Community" target audience treats paid as fundamentally uncool / cringe. Both postures lose on a paid-search lead.
- **Capital-loss risk: low if execution is disciplined.** Sunk cost is bounded by LP build + 1–2 weeks of low-spend testing before disapproval. The high-loss scenarios are (a) committing to LegitScript + pharmacy compliance build-out before validating the throwaway brand can survive FDA attention, or (b) committing to a cloaking infrastructure that gets terminated before recouping its build cost.

## Posture-specific fit

### Posture A — Clean Clinical Labs

Worst-fit channel for this posture by every dimension. The "biohacker, technical, COA-led" target buyer responds to detail-density signals — third-party testing pages, batch COAs, GMP-source attestations, peer/forum recommendations. Paid-search "Sponsored" placements are read as the OPPOSITE signal (fly-by-night promo). Even if a clean-clinical-lab vendor could clear Google review (it cannot, per the policy stack), paying to acquire a Posture A buyer through a "Sponsored" SERP slot would damage the credibility positioning the brand is built on. Recommendation: do not invest in Google Ads for Posture A at any tier; budget belongs in SEO, COA-publication infrastructure, and trust-graph placement (forum vendor lists, PeptideRecon-style aggregator reviews).

### Posture B — Meme-Coded Community

Equally bad fit but for different reasons. The "Gen Z mogging/looksmaxxing/post-ironic" target buyer's attention is on TikTok / Looksmax forums / Discord — not Google Search. Google paid search converts intent already in motion; Posture B's value loop is creating intent through community spectacle. Spending on Google paid acquisition for a Jester-Labs-coded brand is thematically wrong (paid promo = corporate cringe), distributionally wrong (audience isn't searching), and policy-wrong (same Google policy block). Recommendation: do not invest. Budget belongs in TikTok creator seeding, looksmax forum sponsorship, and meme-format programmatic placement.

## Channel-specific data captured

### Google Ads policy excerpts (verbatim)

See raw fetches in `03_raw_fetches/google-ads/`:
- `google-policy-healthcare-medicines.md` — top-level policy
- `google-policy-pharma-manufacturers.md` — only slot mentioning "peptides" by name
- `google-policy-unapproved-substances.md` — catch-all enforcement clauses
- `google-policy-prescription-drugs-list.md` — semaglutide/tirzepatide present, classic research-peptide compounds absent
- `google-policy-prescription-drug-terms.md`
- `google-policy-circumventing-systems.md` — cloaking definition

### Ads Transparency Center results for each anchor vendor (advertiser found / not found, last seen date if found)

DIRECT TRANSPARENCY CENTER LOOKUPS — gap. The Ads Transparency Center is a JS-rendered SPA that WebFetch cannot read; per-domain attempts (peptidesciences.com, swisschems.is, corepeptides.com, domesticsupply.org) returned only navigation chrome. SUBSTITUTE TRIANGULATION via Similarweb + Semrush "Organic vs Paid" share is summarized in the Named-vendor table above. Net pattern: paid search share is at or near 0% for 7 of 8 anchor vendors with surfaced data; Limitless Life Nootropics is the lone outlier at ~20% paid keyword share, dominated by branded-defensive bidding terms.

### Pivot-page tactics observed

None directly observed for any named anchor vendor. Cloaking is enumerated in Google's Circumventing Systems policy (E-GA-005); practitioner sources describe the pattern but do not publicly tie it to any specific surviving anchor vendor (and tying it would functionally end that vendor's account).

The closest publicly-observed adjacent pattern is the compounded-GLP-1 telehealth cohort (JAMA / Chetty 2025, n=79 websites in Google Sponsored results during July–September 2024). These vendors DO use legitimately-certified prescription-drug pages as the funnel destination — not a cloaking workaround. They are upstream of FDA enforcement waves (March 2026 warning letters to 30 telehealth vendors; September 2025 letters to ~55) and are the wrong template for a low-capital throwaway-brand launch.

### Comparison to Microsoft Advertising / Bing Ads policy if it differs

Microsoft Advertising's Disapproved Healthcare Products and Supplements policy page exists (https://about.ads.microsoft.com/en-us/resources/policies/disapproved-healthcare-products-and-supplements) but is JS-rendered and could not be fully captured. Industry-summary sources indicate Microsoft applies similar restrictions to Google and "removed over one billion policy-violating advertisements in 2024." No surfaced evidence positions Bing as a meaningfully more permissive alternative for research-peptide vendors. The general pattern in adjacent industries (gambling, supplements) is that Bing's enforcement lags Google's by months, not that the policies materially differ. UNCERTAIN — direct policy-text capture should be re-attempted with a real-browser tool. [E-GA-024]

## Newly discovered vendors

- **Pink Pony Peptides** (Lovega LLC, Wellington FL) — FDA April 2026 warning letter
- **Mile High Compounds LLC** (Clifton CO) — FDA April 2026 warning letter
- **Prime Sciences** (Scottsdale AZ) — FDA April 2026 warning letter
- **Gram Peptides** (Rancho Santa Fe CA) — FDA April 2026 warning letter
- **PekCura Labs** (Pensacola FL) — FDA April 2026 warning letter
- **FormPour** (Canton MI) — FDA April 2026 warning letter; eBay storefront
- **Guangzhou Huli Technology dba Fantasy Face** (Chicago IL) — FDA April 2026 warning letter; eBay storefront

(All discovered via E-GA-023; none observed running paid Google search — they were caught via website + marketplace evidence.)

## Uncertainty notes

1. **Direct Ads Transparency Center observation gap.** Could not capture per-vendor verified-advertiser status because the ATC is a JS-rendered SPA that WebFetch cannot read. Substituted Similarweb / Semrush "Organic vs Paid" triangulation; conclusions about anchor-vendor paid-search activity should be confirmed with a real-browser pass before being treated as definitive.
2. **Limitless Life Nootropics 20.39% paid-keyword share is anomalous.** Most consistent with branded-defensive bidding (vendor or affiliates buying branded queries to control SERP position) but cannot rule out non-trivial category-keyword activity without direct SERP observation. Worth a 30-minute direct-browser check.
3. **LegitScript "208% / 308% / 678% peptide ad surge" is real but unattributed by platform.** Could be Google paid search, Meta paid social, TikTok paid social, e-commerce marketplaces, or native programmatic — LegitScript does not break it out.
4. **Posture-reference vendors (Hunter Eyes Labs, NZT Peptides, LAR Labs, Adam Labs, Land Bio, Structure Labs, Jester Labs, Psycho Labs, Chad Labs, LARP Labs) are substantially hypothetical.** None verified as real research-peptide vendors via WebSearch. Closest hits ("Hunter Lab" Australian skincare, "NZT-48" Amazon nootropic) are unrelated. Posture-reference set was excluded from the named-vendor evidence rows on this basis.
5. **Microsoft / Bing Ads policy text could not be directly captured.** Substituted with industry-summary sources; if the operator wants to seriously consider Bing as an alternative, direct policy-text capture should be re-attempted with a real-browser tool.
6. **Compounded-GLP-1 telehealth pathway is in active regulatory contraction.** September 2025 FDA letters to ~55 telehealth GLP-1 sellers + March 2026 letters to 30 more + April 2026 letters to 7 research-peptide vendors all hit the same disclaimer-as-cover legal logic. This is moving fast; numbers in this report are accurate as of 2026-05-06 and may be obsolete within months.
