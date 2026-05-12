---
generated_at: 2026-05-06
inputs:
  - vendor_universe_pass4.csv (1160 baseline rows from Pass 1+2+3+4)
  - Live web search + WebFetch + wget + WHOIS / reverse-WHOIS
output: surface_pass5_convergence.md
net_new_vendors: 162
verdict: NOT-CONVERGED — recommend Pass 6
---

# Pass 5 Convergence-Test Surface

Pass 5 of the iterated peptide-vendor discovery loop. Pass 1+2+3+4 surfaced 1160
unique vendors. Pass 5 was scoped as a TIGHT convergence test — re-run the
highest-yield Pass 4 surfaces, plus six narrow new probes (other directories,
WHOIS, long-tail buy-X SEO, Trustpilot final pass, alternative listicles,
WHOIS-pivot on the cluster domains).

## Sources fetched

### A) Other peptide-vendor directory aggregators

WebSearch enumerated NEW directory aggregators not present in Pass 4:

- `peptidedeck.com` — peptide review hub w/ retailers
- `peptideverdict.com/compare` — comparison aggregator (79 compounds tracked)
- `peptibase.dev` — verified peptide suppliers directory (gated to /vendors page)
- `peptipedia.io` — 100+ evidence-based peptide profiles + vendor directory (gated)
- `peptidesindex.com` — peptide vendor info hub
- `peptidecompared.com/providers` — **HIGH YIELD: 19 telehealth + 11 retail vendors**
- `peptidecritic.com/peptides-index` — 403 (gated)
- `seekpeptides.com/blog/articles/complete-peptide-list` — 403 (gated)
- `peptidesinstitute.org/peptide-market-2026` — 3 vendors named (Sigma Compounds, Peptide Shop, Peptide Sciences)
- `medgepeptides.com` — single-vendor self-host
- `americanpeptidesociety.org/peptide-links` — academic only (no commercial)
- `biotech-careers.org/business-area/peptides` — **77-company list (60 visible per page)**
- `peptidejournal.org/news/top-peptide-companies-to-watch-in-2026` — pharma giants only
- `biolongevitylabs.com/research/peptide-industry-report-2026` — 9 named vendors w/ domains
- `crowncounseling.com/reviews/best-peptide-companies` — 9 named (mostly known)
- `peptideauthority.co.uk/blog/most-popular-peptides-reddit-2026` — UK info hub
- `subqprotocol.com/reviews/peptide-vendor-review-2026` — 10-vendor review aggregator
- `eupeptideguide.com/best-peptide-suppliers-europe` — EU peptide aggregator
- `bariatricreports.org/listing/summit-research-peptides` — GLP-1 listing aggregator
- `usetorg.com/category/peptide` — 15 best peptide manufacturers
- `ensun.io/search/peptide-therapeutics/italy` — 100+ Italian peptide therapeutics directory

**Outcome: 14 NEW aggregator surfaces beyond what Pass 4 enumerated. None of
the new directories enumerated >50 vendor slugs the way Peptide Protocol Wiki
(108) / Pickpeptides (78) / Finnrick (205) did in Pass 4. The aggregator
graph is genuinely showing diminishing returns.**

### B) WHOIS / reverse-WHOIS pivot on cluster domains

(Free public APIs: whois.com, viewdns.info)

| Domain | Registrar | Registrant | Created | NS | Reverse-WHOIS hits |
|---|---|---|---|---|---|
| swisschems.is | ISNIC | AC387-IS (BZ) | 2020-06-25 | Cloudflare | 0 (privacy-walled) |
| purerawz.co | Cloudflare | privacy-redacted | 2019-02-07 | Cloudflare | n/a (privacy) |
| limitlesslifenootropics.com | GoDaddy | Domains By Proxy | 2015-06-09 | Cloudflare | 37 unrelated (privacy) |
| patriotpeptides.com | GoDaddy | not displayed | 2022-10-24 | HostGator | 0 |
| polarispeptides.com | Tucows | Contact Privacy Inc | 2024-01-07 | Cloudflare | n/a (privacy) |
| **orbitrexpeptide.is** | **ISNIC** | **FAST FISSION STREET HOLDING LLC** (Highland Village, TX) | **2025-09-09** | siteground.net | **3 sister domains** |

**Material finding: Orbitrex is a 4-domain matrix.** Reverse-WHOIS on Fast
Fission Street Holding LLC turned up:
- `orbitrexlab.com` — Squarespace 2026-03-10
- `orbitrexlabs.com` — Squarespace 2026-03-10
- `orbitrexresearch.com` — Squarespace 2026-03-10

Pass 4 captured only orbitrexpeptide.is. Three sister domains are net-new for
Pass 5. Plus orbiitrexpeptides.com (typosquat double-i variant) showed in
search. **Patriot cluster also expanded**: patriotresearchlabs.com (Patriot
Research Labs) is a fourth Patriot brand storefront not previously captured.

Most other clusters are Cloudflare/GoDaddy/Tucows privacy-walled, yielding
no actionable WHOIS-graph data. WHOIS pivot remains structurally limited
under free-tier tooling. Full details in `raw/pass5/whois_pivot_notes.md`.

### C) Re-running Pass 4 highest-yield surfaces

- **peptideprotocolwiki.com/vendors**: wget with realistic UA succeeded.
  Extracted exactly **108 vendor slugs** — confirms Pass 4 count (no
  pagination missed). 13 PPW slugs not present in Pass 4 universe were
  re-cross-referenced and added (e.g., aminovault, accelpharm, healthgevity,
  nextchems, oath-peptides, qsc-peptides, raw-amino, receptor-chem, revico-labs,
  titan-x-research, xcel-peptides confirmed).
- **pickpeptides.com/vendors**: wget succeeded. Extracted **78 vendor slugs**
  (vs Pass 4's "76" — a +2 differential). 23 pickpeptides slugs not present
  in Pass 4 universe were added (atomic-labz [pre-existing match],
  apex-amino, biocollex-research, blue-sky-peptide, eros-peptides,
  evolve-biopep, genesis-peptides, gen-peptide, liberty-peptides,
  midwest-peptide, nextech-labs, nextgenpeps, nexxgen-peptides, nura-peptide,
  oasis-labs, omegamino, oros, peptilab, profound-aminos, pura-peptide,
  pure-peptide-labs, peptides-world, peptidesforsale, welli-labs).
- **borenhealth.com/peptide-vendors**: 404 (page restructured).
- **magellan / peppal / peptidecritic /vendors**: re-fetched; 0 net-new
  beyond Pass 4 (all enumerated).

### D) "Buy <peptide>" SEO long-tail (different angles from Pass 4)

WebSearch ran for `retatrutide research only`, `NAD+ research peptide vendor`,
`oxytocin research peptide vendor`, `Selank Semax research peptide`,
`Kisspeptin research peptide`, `Cerebrolysin research peptide`,
plus `tirzepatide buy USA vendor 2026 list`,
`buy retatrutide research`, `peptide source warehouse`, `Wegovy Mounjaro research compound`.

**New retail vendors surfaced** (23 net-new under pass5-longtail):

bulkglp, transformapeptides, sunday-usa, onyxbiolabs, bluumpeptides,
cosmicpeptides, purehealthpeptides, nusciencepeptides, modernaminos,
biolongevitylabs, nootropicsource, pharmalabglobal, regenpracticesolutions,
primepeptides.co, purebiolabs, paramountpeptides, alphaomegapeptide,
nationwidepeptides, peptide-works, apexbt, prospecbio, mybiosource,
purelabpeptides, everpharma, rxeli, livvnatural, cenexalabs, royal-peptides
(distinct from royalpeptides.com), heritagelabsusa, peptideskingdom,
purerxpeptides, maylips, syspharma, astropeptidesusa (re-confirmed),
puretestedpeptides, peptidessource, directpeptides, warehousepeptides,
phoenixpeptide, nurevpeptides, ameanopeptides, peptidegurus, gurupeptides,
verifiedpeptides, peptideware, tirzepatides.us, summit-peptides,
summitpeptides.com, summitpeptides.shop, prpeps (Premier Research),
uschemlabs, semalabs.org / semaspace, rcs-research.is, kimerachems.co,
perfectedpeptides, pp-researchlab, plus medspa-adjacent (medicadepot,
nextdaypeptides, neuronmedical, bhrcenter, houstonmensclinic).

### E) Trustpilot final pass

Direct fetches of `/categories/biochemical_supplier`,
`/categories/biotechnology_company`, `/categories/medical_supply_store`
remained **403-walled** to wget (zero-byte responses) — confirms Pass 3+4
finding that Trustpilot category pages cannot be fetched without browser
automation.

**Pivoted to search-based Trustpilot discovery.** Searches for
`"trustpilot.com/review" peptide`, `trustpilot peptide labs`, `trustpilot
peptide shop`, etc. surfaced 23 NEW Trustpilot review pages — domains
extracted from review URLs:

| Domain | Trustpilot rating | Surface |
|---|---|---|
| peptidicresearch.com | 4.5/5 (132 rev) | pass5-trustpilot |
| trustedpeptides.store | 4.5/5 (21 rev) | pass5-trustpilot |
| peptide-supplies.com | 4.5/5 (31 rev) UK | pass5-trustpilot |
| peptidesystems.com | 4.8/5 (85 rev) | pass5-trustpilot |
| aiopeptides.com | 4.95 (549 rev) | pass5-trustpilot |
| thrivepeptides.us | 4.9/5 (86 rev) | pass5-trustpilot |
| peptide-shop.com | mixed | pass5-trustpilot |
| professionalpeptides.shop | reviewed | pass5-trustpilot |
| peptide-s.shop | FDA-letter customer | pass5-trustpilot |
| mypurepeptide.com | reviewed | pass5-trustpilot |
| peptidesinc.com (PeptidesRx) | reviewed | pass5-trustpilot |
| peptidessciences.com | mixed (typosquat?) | pass5-trustpilot |
| peaklabpeptides.com | 5/5 (54 rev) | pass5-trustpilot |
| primelab-peptides.com | reviewed | pass5-trustpilot |
| truepeptidelabs.com | mixed | pass5-trustpilot |
| researchpeptideslab.com | 4.6/5 | pass5-trustpilot |
| researchpeptidelabs.com | 99%+ | pass5-trustpilot |
| thepeptidelabs.ca | reviewed (CA) | pass5-trustpilot |
| purepeptidelabs.com | 5/5 (1520 rev) | pass5-trustpilot |
| peptira.com | 4.6/5 (246 rev) | pass5-trustpilot |
| vantyxresearch.com | reviewed | pass5-trustpilot |
| affordablepeptides.life | reviewed | pass5-trustpilot |
| apexpeptidesupply.com | reviewed | pass5-trustpilot |
| peptidetech.is | 4.2/5 (174 rev) | pass5-trustpilot |
| peptidology.co | reviewed (.co confirm) | pass5-trustpilot |
| licensedpeptides.com | 5/5 (591 rev) | pass5-trustpilot |
| peptide-warehouse.com | reviewed | pass5-trustpilot |
| biopeptitech.com | reviewed | pass5-trustpilot |
| rcpeptides.com | reviewed | pass5-trustpilot |
| peptidesupply.org | reviewed | pass5-trustpilot |
| instantpeptides.com | reviewed | pass5-trustpilot |
| polarispeptides.com | reviewed | pass5-trustpilot (re-confirm) |
| alpha-peptides.com | reviewed | pass5-trustpilot |

8 of these are net-new vendors after dedupe against Pass 4 (others were
already in Pass 4 by name); see vendor_universe_final.csv rows 1161–1322.

### F) Alternative listicle on Tier-1 vendors

WebSearch ran:
- `"Pure Rawz" review vs alternative` → outliyr, peptides.org, sarmguide,
  sarms.io, knoji, impactwealth, nootropicszone listicles harvested
- `"Limitless Life Nootropics" review vs alternative` → mynucleus,
  drugsbanks, knoji, BBB.org, peptideprotocolwiki listicle harvested
- `"Biotech Peptides" review vs alternative` → ironpeakpeptides,
  biopeptitech (separate brand!), peptidestack.io listicle harvested

13 net-new under pass5-listicle — including the **structural finding** that
**outliyr.com names 12 specific vendors** (Limitless Biotech, LVLUP Health,
Peptidology, Healthgevity, PureRawz, SwissChems, Felix Chem, Apollo, Ascension,
Core, Biotech Peptides, GenX Bio) AND a 7-vendor "avoid" cluster (CanLab
Research, American Research Lab, Paradigm, Blue Sky, Peptide Warehouse,
Umbrella Labs, Chemyo) — most already in Pass 4 universe but new domain
confirmations.

### G) International / EU sweep (small)

Italian, German, UK long-tail SEO searches. Net-new EU/UK vendors:
balticbiolabs.eu, peptanova.de, peptides.de, tidelabs.co.uk, peptideslabuk.com,
purepeptidesuk.com, peptidesuk.com, bluewellpeptides.com, imperialpeptides.co.uk,
durhampeptides.ca.

## Vendor candidates with URL evidence

**162 net-new vendors** are written into `vendor_universe_final.csv` rows
1161–1322 with full evidence URLs and entity_type classification.

### Distribution of Pass 5 net-new by entity_type

| entity_type | count |
|---|---|
| retail | 81 |
| aggregator | 26 |
| telehealth | 22 |
| manufacturer-b2b | 18 |
| retail-info | 6 |
| compounding-pharmacy | 5 |
| retail-medspa | 1 |
| retail-telegram | 1 |
| aggregator-telegram | 1 |
| retail-b2b | 1 |
| **Total** | **162** |

### Distribution of Pass 5 net-new by surface

| surface | count | description |
|---|---|---|
| pass5-search | 35 | General Google search expansion (alpha-cluster, summit-cluster, generic) |
| pass5-longtail | 23 | "Buy retatrutide / NAD+ / Selank / kisspeptin / cerebrolysin" SEO |
| pass5-pickpeptides | 23 | PickPeptides directory enumeration (78 → 23 net-new vs Pass 4) |
| pass5-peptidecompared | 19 | peptidecompared.com/providers telehealth + retail |
| pass5-pwiki | 13 | PeptideProtocolWiki re-enumeration (108 → 13 net-new) |
| pass5-listicle | 13 | Tier-1 alternative listicle sweeps |
| pass5-trustpilot | 8 | Trustpilot search-based discovery (final pass) |
| pass5-biotechcareers | 8 | biotech-careers.org 77-company directory |
| pass5-aggregator | 8 | New aggregator surface (peptibase, peptipedia, peptidedeck, etc.) |
| pass5-international | 3 | Baltic + DE/UK/CA cluster expansion |
| pass5-whois | 3 | Reverse-WHOIS pivot (Orbitrex 3-sister cluster) |
| pass5-projectbiohacking | 2 | Project Biohacking vendor + coupon directory |
| pass5-telegram | 2 | Atomic Peptides + Sophia Fillers Telegram |
| pass5-forum | 1 | Steroidology forum thread vendor |
| pass5-axios | 1 | Noho Labs ($16M peptide startup, Axios) |

## Highest-yield Pass 5 surfaces

1. **pass5-search (35)**: Mostly generic searches surfacing the
   "Alpha-cluster" (alphabiomedlabs, alpha-peptides, alphalabspeptidesusa,
   livealphalabs, alphapeptidesupply, alphacarbonlabs, peptidesalpha,
   goalphalabs) and "Summit-cluster" (summit-peptides, summitpeptides.com,
   summitpeptides.shop, prpeps Premier Research). These are
   small-volume retail brands with dedicated domains.
2. **pass5-longtail (23)**: "Buy <peptide>" long-tail SEO produced
   research-grade-only retail vendors that don't appear on listicles.
3. **pass5-pickpeptides (23)**: PickPeptides directory's vendor slug list
   (78 total slugs) yielded 23 brand names not seen in Pass 4 (Pass 4
   captured only the ~76 visible without scraping JS).
4. **pass5-peptidecompared (19)**: Net-new TELEHEALTH vendors —
   peptidecompared.com/providers exposes a 19-clinic telehealth vendor
   roster (Enhance MD, Embody, SHED, Synergy Rx, Eden Health, Breeze Meds,
   Yucca Health, BraveRX, TMates, Sprout Health, Quad/MEDVi, Peter MD,
   Strut, MyDrHank, Winona, DudeMeds, Sesame Care, MangoRx) that no other
   surface in Pass 1-4 captured.

## Surprising finds

1. **Orbitrex 4-domain matrix** (orbitrexlab.com, orbitrexlabs.com,
   orbitrexresearch.com) registered same-day 2026-03-10 by Fast Fission
   Street Holding LLC, in addition to the .is brand. WHOIS pivot
   succeeded HERE because ISNIC publishes the registrant org for .is
   even when other registries privacy-protect.
2. **Telehealth cluster (19 vendors)**. Pass 4 captured 0 telehealth
   storefronts. peptidecompared.com is the surface that exposes this
   cluster. Telehealth is a separate market segment from research-peptide
   retail but is partially adjacent (some clinics will compound for
   research customers).
3. **`peptidessciences.com` typosquat**. Trustpilot has a separate review
   page from peptidesciences.com (defunct as of 2026-03-06). The .com
   double-s variant is a separate active site; identity uncertain.
4. **Patriot cluster expanded to 4 brands**. Pass 4 captured 2
   (patriotpeptides + patriotpep). Pass 5 adds patriotpeptide.com (singular)
   and patriotresearchlabs.com.
5. **Noho Labs** ($16M Coatue-led peptide startup, May 2026) —
   personalized peptides B2B / clinical, Axios reported May 2026; not on
   any other discovery surface.

## Gaps remaining (post-Pass 5)

1. **Trustpilot category pages still 403-walled** to all command-line
   tooling. ~50-200 long-tail vendors estimated unreachable without
   browser automation. Same as Pass 4.
2. **finnrick.com/vendors full list (205 vendors total)** — Pass 4
   harvested ~70 of them; Pass 5 did not re-attempt. Many remain
   abbreviation-only (XHT, ABC, BHD, GYC, QSC, QYC) without confirmed
   domains.
3. **Reddit r/Peptides + r/PeptidesSource + r/saferpeptidesources canonical
   wikis**. Auth-gated, not attempted in Pass 5.
4. **Forum gated subforums** (eroids /sources/, steroidsourcetalk.cc
   /sources/, anabolicminds /peptides/) — same as Pass 4.
5. **Telegram private channels** (Stairway to Gray, PRG bot, Wholesale
   Peptides UK Linktree). Same as Pass 4 — gated invitations.
6. **`peptibase.dev/vendors` and `peptipedia.io/vendors`** — both
   subpages exist per the homepages but were not directly fetchable
   (homepage navigation only showed link target; vendor body required
   client-side rendering). These are NEW directory surfaces that Pass 5
   did not exhaust.
7. **`biotech-careers.org/business-area/peptides` (77 companies, only 60
   visible)** — pagination yields the remaining 17 companies. Not
   enumerated in Pass 5.
8. **WHOIS-bulk on the remaining 70+ Pass 4 cluster domains**. Pass 5
   sampled 6 cluster domains; the remaining cluster could yield more
   sister-domain reverse-WHOIS hits but the cost/yield ratio is poor
   given Cloudflare/GoDaddy privacy proxies dominate.
9. **eBay + Alibaba seller enumeration** — not attempted (same as Pass 4).
10. **Italian (ensun.io 100+ companies) and Italian/Spanish small-vendor
    enumeration** — surfaced but not exhaustively crawled.
