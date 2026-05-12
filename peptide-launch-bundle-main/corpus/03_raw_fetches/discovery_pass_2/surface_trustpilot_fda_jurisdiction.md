---
fetched_at: 2026-05-06
surface: pass2d-trustpilot-fda-jurisdiction
---

# Pass 2D — Trustpilot, FDA Enforcement, Jurisdiction-Flag TLDs

## Methodology
- WebSearch with `site:trustpilot.com|sitejabber.com|reviews.io|scamadviser.com|fda.gov` operator combos for peptide / research-peptide / GLP-1 / BPC-157 / tirzepatide / retatrutide / semaglutide queries.
- WebFetch on FDA warning-letter index pages (the underlying `fda.gov/...warning-letters/...` slugs return HTTP 404 to this fetch sandbox; relied on search-engine summaries + secondary news outlets that quote the letter URL fields).
- Cross-reference: every domain harvested below was diffed against `02_claude_code_outputs/vendor_universe_pass1.csv` (271 unique primary domains).

Search operator caveat: the WebSearch backend ignores raw `site:.is` / `site:.to` / `site:.cc` / `site:.ru` / `site:.su` queries (returns "no links found"). Workaround used: descriptive queries ("peptide vendor iceland", "research peptides Canada .ca", "swisschems.is", etc.) that surfaced TLD-specific vendors via secondary references.

---

## Trustpilot enumeration

Unique peptide-vendor Trustpilot review pages surfaced this pass: 60. Format: vendor name | domain (Trustpilot slug) | review-count signal where visible | Trustpilot URL.

- Research Peptide Labs | researchpeptidelabs.com | active reviews | https://www.trustpilot.com/review/researchpeptidelabs.com
- Researchpeptideslab | researchpeptideslab.com | active | https://www.trustpilot.com/review/researchpeptideslab.com
- Research Peptides (UK) | www.researchpeptides.co.uk | active | https://www.trustpilot.com/review/www.researchpeptides.co.uk
- Ora Labs | oralabs.net | active | https://ca.trustpilot.com/review/oralabs.net
- Peak Lab Peptides | peaklabpeptides.com | 54 reviews | https://www.trustpilot.com/review/peaklabpeptides.com
- Pura Peptides | purapeptides.com | active | https://www.trustpilot.com/review/purapeptides.com
- Peptide Systems | peptidesystems.com | 85 reviews | https://www.trustpilot.com/review/peptidesystems.com
- BioEdge Research Labs | bioedgeresearchlabs.com | active | https://www.trustpilot.com/review/bioedgeresearchlabs.com
- Summit Research | summitpeptides.com | active | https://www.trustpilot.com/review/summitpeptides.com
- Researchpeptideseurope | researchpeptideseurope.com | active | https://www.trustpilot.com/review/researchpeptideseurope.com
- Peak Peptides | peakpeptides.shop | active | https://www.trustpilot.com/review/peakpeptides.shop
- Pure Peptide Labs | purepeptidelabs.com | 1,520 reviews | https://www.trustpilot.com/review/purepeptidelabs.com
- Peptidessciences | peptidessciences.com | active | https://www.trustpilot.com/review/peptidessciences.com
- The Peptide Labs (CA) | thepeptidelabs.ca | active | https://www.trustpilot.com/review/thepeptidelabs.ca
- Peptidic | peptidicresearch.com | active | https://www.trustpilot.com/review/peptidicresearch.com
- Midwest Peptide | midwestpeptide.com | 54 reviews | https://www.trustpilot.com/review/midwestpeptide.com
- Peptidepro | peptidepro.io | active | https://www.trustpilot.com/review/peptidepro.io
- Peptide Technologies | peptidetech.is | 174 reviews | https://www.trustpilot.com/review/peptidetech.is
- Pure Lab Peptides | purelabpeptides.com | active (≥5 pages) | https://www.trustpilot.com/review/purelabpeptides.com
- Certified Peptides | certified-pep.com | 62 pages of reviews | https://www.trustpilot.com/review/certified-pep.com
- Polarispeptides | polarispeptides.com | active | https://www.trustpilot.com/review/polarispeptides.com
- Mypurepeptide | mypurepeptide.com | active | https://www.trustpilot.com/review/mypurepeptide.com
- Royal Peptides Wholesale | royal-peptides.com | active | https://www.trustpilot.com/review/royal-peptides.com
- Licensed Peptides | licensedpeptides.com | 9–10 pages | https://www.trustpilot.com/review/licensedpeptides.com
- Vitalbpc157 | vitalbpc157.com | 15 reviews | https://ca.trustpilot.com/review/vitalbpc157.com
- Peptide Supplies | peptide-supplies.com | 28 reviews | https://uk.trustpilot.com/review/peptide-supplies.com
- UK Peptides | www.uk-peptides.com | 401 reviews / 18+ pages | https://www.trustpilot.com/review/www.uk-peptides.com
- Prime Peptides | primepeptides.co | 42 reviews | https://www.trustpilot.com/review/primepeptides.co
- Base Peptides | basepeptide.com | 79 reviews | https://www.trustpilot.com/review/basepeptide.com
- Infiniwell | infiniwell.com | 62 reviews | https://uk.trustpilot.com/review/infiniwell.com
- Peptidist | peptidist.com | 28 reviews | https://www.trustpilot.com/review/peptidist.com
- CertaPeptides | certapeptides.com | active | https://www.trustpilot.com/review/certapeptides.com
- Saf Peptides | saf-peptides.com | active | https://www.trustpilot.com/review/www.saf-peptides.com
- Triggeredbrand | triggeredbrand.store | 8 pages | https://www.trustpilot.com/review/triggeredbrand.store
- Precision Peptide Co | precisionpeptideco.com | 10 pages | https://www.trustpilot.com/review/precisionpeptideco.com
- Peptidecentral | peptidecentral.net | active | https://www.trustpilot.com/review/peptidecentral.net
- Royalresearch | royalresearch.co | active | https://www.trustpilot.com/review/royalresearch.co
- Americanresearch | americanresearch.net | active | https://www.trustpilot.com/review/americanresearch.net
- Peptira | peptira.com | 246 reviews | https://www.trustpilot.com/review/peptira.com
- Peptidecrafters | peptidecrafters.com | active | https://www.trustpilot.com/review/peptidecrafters.com
- NuRev Peptides | nurevpeptides.com | active | https://www.trustpilot.com/review/nurevpeptides.com
- True Peptide Labs | truepeptidelabs.com | active | https://www.trustpilot.com/review/truepeptidelabs.com
- Prime Lab Peptides | primelab-peptides.com | 860 reviews | https://www.trustpilot.com/review/primelab-peptides.com
- TrueLab Peptides | truelabpeptides.com | active | https://www.trustpilot.com/review/truelabpeptides.com
- Researchready Peptides | researchreadypeptides.com | active | https://www.trustpilot.com/review/researchreadypeptides.com
- Element Peptide | elementpeptide.com | active | https://www.trustpilot.com/review/elementpeptide.com
- Peptide-shop.com | peptide-shop.com | 3 reviews | https://www.trustpilot.com/review/peptide-shop.com
- Peptide S | peptide-s.shop | active (incl FDA seizure complaint) | https://www.trustpilot.com/review/peptide-s.shop
- Peptides (peptideproduct.eu) | peptideproduct.eu | active | https://www.trustpilot.com/review/peptideproduct.eu
- Peptideswarehouse | peptideswarehouse.com | active (scam complaints) | https://www.trustpilot.com/review/www.peptideswarehouse.com
- Peptide Warehouse | peptide-warehouse.com | active | https://www.trustpilot.com/review/peptide-warehouse.com
- Professional Peptides | professionalpeptides.shop | active | https://www.trustpilot.com/review/professionalpeptides.shop
- Penguin Peptides | penguinpeptides.com | 1,275 reviews / 51 pages | https://www.trustpilot.com/review/penguinpeptides.com
- Reta One Labs | retaonelabs.com | active | https://www.trustpilot.com/review/retaonelabs.com
- Peptide Partners | peptide.partners | 4 pages | https://www.trustpilot.com/review/peptide.partners
- Crush Research Supply | crushresearch.com | active | https://www.trustpilot.com/review/crushresearch.com
- Mile High Compounds | milehighcompounds.is | 16 pages | https://www.trustpilot.com/review/milehighcompounds.is
- Limitlesslifenootropics | limitlesslifenootropics.com | active | https://www.trustpilot.com/review/limitlesslifenootropics.com
- Pentech Peptide | pentechpeptide.com | 25 reviews | https://www.trustpilot.com/review/pentechpeptide.com
- Biotech Peptides | biotechpeptides.com | 334 reviews / 15 pages | https://www.trustpilot.com/review/biotechpeptides.com
- Biopeptitech | biopeptitech.com | active | https://www.trustpilot.com/review/biopeptitech.com
- Wuhan wansheng biotechnology (WWB) | wuhanwanshengbiotechnology.com | active | https://www.trustpilot.com/review/wuhanwanshengbiotechnology.com
- Evolve Peptides | evolvepeptides.com | active | https://www.trustpilot.com/review/evolvepeptides.com
- Alpha Peptides | alpha-peptides.com | active | https://www.trustpilot.com/review/alpha-peptides.com
- Alphaomegapeptide | alphaomegapeptide.com | active | https://www.trustpilot.com/review/alphaomegapeptide.com
- Alpha Research Peptides | alpharesearchpeptides.com | 2 reviews | https://www.trustpilot.com/review/alpharesearchpeptides.com
- Alphalabs (AU) | alphalabs.au | active | https://www.trustpilot.com/review/alphalabs.au
- Ascend Amino | ascendamino.net | active | https://www.trustpilot.com/review/ascendamino.net
- CK Peptides | ck-peptides.com | active | https://www.trustpilot.com/review/ck-peptides.com
- Particle Peptides | particlepeptides.com | active | https://www.trustpilot.com/review/particlepeptides.com
- Instant Peptides | instantpeptides.com | active | https://www.trustpilot.com/review/instantpeptides.com
- Happy Peptides | happypeptides.com | active | https://www.trustpilot.com/review/happypeptides.com
- Cutting Edge Peptides | cuttingedgepeptides.com | active | https://www.trustpilot.com/review/cuttingedgepeptides.com
- Paragon Peptides | paragonpeptides.net | active | https://www.trustpilot.com/review/paragonpeptides.net
- AIO Peptides | (Trustpilot category listing — 4.9★, 549 reviews) | https://www.trustpilot.com/categories/biochemical_supplier
- Royal Peptides Wholesale | royal-peptides.com | active | https://www.trustpilot.com/review/royal-peptides.com

Trustpilot category index pages also surface dozens more listings; the above are the unique vendor-domain hits we visually confirmed in this pass.

---

## SiteJabber / Reviews.io / ScamAdviser

### SiteJabber
- Peptide Sciences | peptidesciences.com | 3 reviews, 3.8★ | https://www.sitejabber.com/reviews/peptidesciences.com
- Limitless Life Nootropics | limitlesslifenootropics.com | 55 reviews | https://www.sitejabber.com/reviews/limitlesslifenootropics.com/site.webmanifest?page=2
- Pganabolics | pganabolics.com | 35 reviews | https://www.sitejabber.com/reviews/pganabolics.com
- Bio Life Technologies | biolifetechnologies.com | 30 reviews | https://www.sitejabber.com/reviews/biolifetechnologies.com
- Imuscle UK (SARMs) | imuscle-sarms.co.uk | 4 reviews, 2★ — reportedly shut down | https://www.sitejabber.com/reviews/imuscle-sarms.co.uk

### Reviews.io
- Direct Peptides | directpeptides.com | active | https://www.reviews.io/company-reviews/store/directpeptides.com
- Peptides Ireland | peptidesireland.com | 16 reviews, 4.25 avg | https://www.reviews.io/company-reviews/store/peptidesireland-com
- Purity Peptide | puritypeptide.com | 5 reviews, 2.40 avg | https://www.reviews.io/company-reviews/store/puritypeptide-com
- Biohack Peptides | biohackpeptides.co.uk | active | https://www.reviews.io/company-reviews/store/www.biohackpeptides.co.uk
- Pure Peptides UK | purepeptidesuk.com | 112 reviews, 4.91 avg | https://www.reviews.io/company-reviews/store/purepeptidesuk.com
- Peptide Pros | peptidepros.net | "yet to start collecting" | https://www.reviews.io/company-reviews/store/peptidepros-net
- Paradigm Peptides | paradigmpeptides.com | 7 reviews, 2.71 avg | https://www.reviews.io/company-reviews/store/paradigmpeptides-com
- Power Peptides | mypowerpeptides.com / powerpeptides.com | 547 reviews, 4.75 avg | https://www.reviews.io/company-reviews/store/powerpeptides.com
- Peptide-store.eu | peptide-store.eu | active | https://www.reviews.io/company-reviews/store/peptide-store-eu
- Pinnacle Peptides | pinnaclepeptides.com | active | https://www.reviews.io/company-reviews/store/pinnaclepeptides-com
- Certified Pep | certified-pep.com | 1,041 reviews, 4.90 avg | https://www.reviews.io/company-reviews/store/certified-pep.com
- Rebel Peptides | rebelpeptides.com | 47 reviews, 4.26 avg | https://www.reviews.io/company-reviews/store/rebelpeptides.com-WWVe6pN
- Peptide Sciences | peptidesciences.com | active | https://www.reviews.io/company-reviews/store/peptidesciences-com
- Core Peptides | corepeptides.com | active | https://www.reviews.io/company-reviews/store/corepeptides-com
- Proven Peptides | provenpeptides.com | active | https://www.reviews.io/company-reviews/store/provenpeptides-com
- Uk-peptides.com | uk-peptides.com | 1 review, 2.0 | https://www.reviews.io/company-reviews/store/uk-peptides-com

### ScamAdviser
- peptide.shop | peptide.shop | very low trust score | https://www.scamadviser.com/check-website/peptide.shop
- Pura Peptides Reviews | purapeptides.reviews | listed | https://www.scamadviser.com/check-website/purapeptides.reviews
- Modern Peptides | modernpeptides.com | listed | https://www.scamadviser.com/check-website/modernpeptides.com
- Peptide Warehouse | peptide-warehouse.com | 76% legit | https://www.scamadviser.com/check-website-old/peptide-warehouse.com
- Peptide Store EU | peptide-store.eu | "very likely legit" | https://www.scamadviser.com/check-website/peptide-store.eu
- Peptide Sciences | peptidesciences.com | "legit & safe" | https://www.scamadviser.com/check-website/peptidesciences.com
- Peptide Depot | peptide-depot.com | 71% legit | https://www.scamadviser.com/check-website/peptide-depot.com
- Eternal Peptides | eternalpeptides.net | listed | https://www.scamadviser.com/check-website/eternalpeptides.net
- Direct Peptides (.com hyphen variant) | direct-peptides.com | low trust score | https://www.scamadviser.com/check-website/direct-peptides.com
- Peptide Bioregulator | peptide-bioregulator.com | listed | https://www.scamadviser.com/check-website/peptide-bioregulator.com
- Research1Peptides | research1peptides.com | 65% trust | https://www.scamadviser.com/check-website/research1peptides.com
- Royal Peptides | royal-peptides.com | listed (uncertain) | https://www.scamadviser.com/check-website/royal-peptides.com
- UK Research Peptides | uk-research-peptides.co.uk | "very likely legit" | https://www.scamadviser.com/check-website/uk-research-peptides.co.uk
- US Made Research Peptides | usmaderesearchpeptides.com | listed | https://www.scamadviser.com/check-website/usmaderesearchpeptides.com
- International Peptides | international-peptides.com | 61 trust score | https://www.scamadviser.com/check-website/international-peptides.com
- Peptides.org | peptides.org | "very likely legit" | https://www.scamadviser.com/check-website/peptides.org
- Research Peptides ZA | researchpeptides.co.za | listed | https://www.scamadviser.com/check-website/researchpeptides.co.za
- Peptides4Research | peptides4research.com | "very likely legit" | https://www.scamadviser.com/check-website-old/peptides4research.com
- Sigma Peptides | sigmapeptides.com | very low trust (likely scam) | https://www.scamadviser.com/check-website/sigmapeptides.com
- Precision-Peptide | precision-peptide.com | listed | https://www.scamadviser.com/check-website-old/precision-peptide.com
- SUP Peptide | suppeptide.com | listed | https://www.scamadviser.com/check-website/suppeptide.com
- Peptide Source | peptidesource.net | listed | https://www.scamadviser.com/check-website/peptidesource.net
- Peptide Worldwide | peptideworldwide.com | listed | https://www.scamadviser.com/check-website-old/peptideworldwide.com

---

## FDA / DOJ enforcement targets

Format: company | action type | date | URL/source. **Bold = website domain referenced inside the actual FDA letter or DOJ filing.**

### FDA Warning Letters — peptide / research-chem vendors

- **US Chem Labs** | FDA warning letter (research-chemical labeling fail; semaglutide / tirzepatide / thymalin) | 2024-02-07 | https://www.fda.gov/inspections-compliance-enforcement-and-criminal-investigations/warning-letters/us-chem-labs-669074-02072024
- **Synthetix Inc.** | FDA warning letter (semaglutide / tirzepatide) | 2024-02-07 | co-issued with US Chem Labs (Healio summary: https://www.healio.com/news/endocrinology/20240214/fda-issues-warnings-to-two-companies-for-unapproved-semaglutide-tirzepatide)
- **Summit Research Peptides — summitpeptides.shop** | FDA warning letter (semaglutide, retatrutide, cagrilintide, tirzepatide, mazdutide) | 2024-12-10 | https://www.fda.gov/inspections-compliance-enforcement-and-criminal-investigations/warning-letters/summit-research-peptides-695607-12102024
- **Xcel Research LLC — xcelpeptides.com** | FDA warning letter (retatrutide, semaglutide) | 2024-12-10 | https://www.fda.gov/inspections-compliance-enforcement-and-criminal-investigations/warning-letters/xcel-research-llc-694608-12102024
- **Tailstorm Health Inc. dba Medivant Health** | FDA warning letter (compounding-facility violations) | 2025-04-08; corrective-action close-out 2026-03-23 | https://www.fda.gov/inspections-compliance-enforcement-and-criminal-investigations/warning-letters/tailstorm-health-inc-dba-medivant-health-703497-04082025
- **ybycmeds — ybycmeds.com** | FDA warning letter (compounded semaglutide / tirzepatide) | 2025-09-09 | https://www.fda.gov/inspections-compliance-enforcement-and-criminal-investigations/warning-letters/ybycmeds-09092025
- **September 2025 GLP-1 wave** — 50+ FDA warning letters to compounders / outsourcing facilities (semaglutide, tirzepatide, retatrutide, BPC-157, SARMs/trendione mentioned) | 2025-09-09 | overview: https://www.wsgr.com/en/insights/fda-sends-warning-letters-to-more-than-50-glp-1-compounders-and-manufacturers.html ; named therein: Expert Aesthetics, The HCG Institute, Bioverse Inc.
- **Lovega LLC dba Pink Pony Peptides — pinkponypeptides.com** | FDA warning letter (GLP-2 TZ, GLP-3 RT, BAC water) | 2026-03-31 (published 2026-04-07) | https://www.fda.gov/inspections-compliance-enforcement-and-criminal-investigations/warning-letters/lovega-llc-dba-pink-pony-peptides-721088-03312026
- **Mile High Compounds LLC — milehighcompounds.is** | FDA warning letter (GLP-1 SM, GLP-2 TRZ, GLP-3 RT, BAC water) | 2026-03-31 | https://www.fda.gov/inspections-compliance-enforcement-and-criminal-investigations/warning-letters/mile-high-compounds-llc-721600-03312026
- **PekCura Labs — pekcuralabs.com** | FDA warning letter (GLP-1-S, GLP-2-T, GLP-3-R, BAC water) | 2026-03-31 | https://www.fda.gov/inspections-compliance-enforcement-and-criminal-investigations/warning-letters/pekcura-labs-721709-03312026
- **Prime Sciences — prime-sciences.com** | FDA warning letter (Cagrilintide, GLP1-R/S/T, Mazdutide, BAC water) | 2026-03-31 | https://www.fda.gov/inspections-compliance-enforcement-and-criminal-investigations/warning-letters/prime-sciences-721805-03312026
- **Gram Peptides — grampeptides.com** | FDA warning letter (Retatrutide, Tirzepatide, BAC water for injection) | 2026-03-31 | https://www.fda.gov/inspections-compliance-enforcement-and-criminal-investigations/warning-letters/gram-peptides-721806-03312026
- **FormPour — ebay.com/str/formpour** | FDA warning letter (SMGT-GLT-1 nano microneedle patch) | 2026-03-31 | https://www.fda.gov/inspections-compliance-enforcement-and-criminal-investigations/warning-letters/formpour-722215-03312026
- **Guangzhou Huli Technology dba Fantasy Face — ebay.com/str/fantasyface** | FDA warning letter (Googeer GLP-1 oral solution) | 2026-03-31 | https://www.fda.gov/inspections-compliance-enforcement-and-criminal-investigations/warning-letters/guangzhou-huli-technology-co-ltd-dba-fantasy-face-722228-03312026

### DOJ / criminal enforcement

- **All American Peptide (Sylvia & Keith Kovaleski)** | guilty plea, conspiracy to distribute misbranded / unapproved drugs; >$3M forfeiture; AAP website used 2014–2019 | pleas 2022-03-21/22 | https://www.justice.gov/usao-nj/pr/new-jersey-husband-and-wife-admit-selling-misbranded-and-unapproved-new-drugs ; FDA mirror: https://www.fda.gov/inspections-compliance-enforcement-and-criminal-investigations/doj-press-releases-involving-fda-oci/middlesex-county-couple-charged-selling-misbranded-and-unapproved-new-drugs-and-running-drug
- **Tailor Made Compounding LLC + Jeremy Delk** | guilty plea, distribution of unapproved peptides (BPC-157, CJC-1295, GW-501516, Ipamorelin, Selank, Semax, MK-677, LL-37, etc.); $1,788,906.82 forfeiture | guilty plea filing | https://www.fda.gov/inspections-compliance-enforcement-and-criminal-investigations/doj-press-releases-involving-fda-oci/nicholasville-compounding-pharmacy-and-its-owner-plead-guilty-unlawful-distribution-prescription
- **Paradigm Peptides — paradigmpeptides.com (Matthew Kawa & Jennifer Stechkober)** | guilty plea (peptides / hCG / SARMs that were actually testosterone) | 2025-12-10 | https://www.justice.gov/usao-ndin/united-states-v-matthew-kawa
- **Amino Asylum** | FDA Memphis warehouse raid, site forced offline | 2025-06 | summarized: https://muscleandbrawn.com/reviews/amino-asylum-raided-in-2025/
- **Peptide Sciences (peptidesciences.com)** | voluntary shutdown amid FDA pressure | 2026-03-06 | https://allaboutpeptides.com/peptide-sciences-shuts-down/
- **Utah osteopathic physician (Dr. Watkins)** | indicted for selling unapproved peptides (tirzepatide / semaglutide / retatrutide / cagrilintide / NAD+) to >200 patients | indictment 2026-04 | https://www.safemedicines.org/2026/04/april-6-2026.html
- **Tengyue Chemical Co. Ltd. + Guangzhou Wanjiang Biotechnology Co. Ltd. (and named individuals)** | DOJ indictment, peptide / GLP-1 smuggling | 2025-09 | https://www.safemedicines.org/wp-content/uploads/2025/09/GUANGZHOU-TENGYUE-indictment-sept-2025.pdf
- **Massachusetts man** | plea — botulism-causing peptide injections | 2025-12 | https://www.safemedicines.org/2025/12/dec-15-2025.html
- **Pennsylvania pharmacy owner** | indicted; 14 OH licenses revoked | 2025-08-04 | https://www.safemedicines.org/2025/08/august-04-2025.html
- **Capsulcn International Co. Ltd. et al.** | DOJ indictment (pill-press / chem source chain) | filed 2025-04-23 | https://www.safemedicines.org/wp-content/uploads/2019/09/US-v-Capsulcn-et-al-Indictment.pl_.pdf
- **DeFranco (W.D. Pa.)** | criminal charges + sentence, illegal peptide / HGH website with bogus "research only" disclaimer | 2013 (precedent) | https://www.justice.gov/usao-wdpa/pr/illinois-man-sentenced-prison-selling-peptides-hgh-china-over-internet
- **CBP Cincinnati** | seizure of 5,000+ GLP-1 shipments (retatrutide / semaglutide / tirzepatide) across 300+ cartons | 2024-12 → 2025-03 | https://www.safemedicines.org/2026/04/april-6-2026.html (cited)

(Aggregate count of distinct FDA/DOJ enforcement targets surfaced this pass: 17 named entities + the 50-letter Sept 2025 wave summary. Confidence: high on the named ones; the 50-wave roster is not fully publicly enumerated in any one source we located.)

---

## Jurisdiction-flag TLD vendors

### .is (Iceland — gray-market favorite)
- **swisschems.is** — SwissChems (US-based but registered .is) — already in Pass 1 universe
- **milehighcompounds.is** — Mile High Compounds (Colorado entity, FDA warning letter target 2026-03-31) — Pass 1: NO (Pass 1 has `aethelcore.is` and `swisschems.is` but not Mile High)
- **peptidetech.is** — Peptide Technologies — net new
- **aethelcore.is** — Aethelcore (EU domestic) — already in Pass 1
- **milehighcompounds.site** — discovered as mirror — net new
- (Note: searches for `peptide.is`, `peptides.is`, `biolab.is`, `research.is` returned no live vendors at this pass.)

### .to (Tonga — bypass jurisdiction)
- **anabolicpharmacist.to** — already in Pass 1; no additional .to peptide vendors confirmed this pass.

### .cc (Cocos Islands — gray TLD)
- No live peptide vendor on `.cc` confirmed by our queries. Search backend ignored `site:.cc`. Pass 1 has none either. Status: uncertain (likely sparse).

### .ru (Russia)
- **peptide-shop.com** + **russian-peptide** brand — Russian Peptide (manufacturer brand surfaced via peptide-shop.com/en) — net new (the parent peptide-shop.com is a .com but explicitly Russia-shipping)
- (Direct .ru domains not surfaced at English-language search depth this pass.)

### .su (former Soviet)
- No active peptide vendor on .su located. The TLD is mostly inactive post-1991. Status: confirmed-empty.

### .eu
- **balticbiolabs.eu** — Baltic BioLabs (Schengen ship)
- **europeptides.eu** — EuroPeptides
- **peptide-store.eu** — Peptide Store EU
- **peptideproduct.eu** — Peptides (EU)
- **researchpeptides-europe.com** — Research Peptides Europe (variant)
- **researchpeptideseurope.com** — Research Peptides Europe (alt)

### .uk / .co.uk
- peptidesuk.com, www.uk-peptides.com, peptideslabuk.com, www.researchpeptides.co.uk, drpeptides.co.uk, tidelabs.co.uk, xlpeptides.com, vitalitypeptides.co.uk, expresspeptides.co.uk, purepeptidesuk.com, biohackpeptides.co.uk, uk-research-peptides.co.uk, bluewellpeptides.com, stratfordpeptides.com, imuscle-sarms.co.uk

### .ca
- puritypeptides.ca, ncrpcanada.com, canadapeptide.com, revicolabs.com, peptidewarehouse.ca, aminopurecanada.ca, canadianpeptides.ca, polarpeptides.ca, thepeptidelabs.ca

### .mx
- exomapeptides.mx, olympuslabspeptidesmx.com, mexico.pharmalabglobal.com, supremepeptides.com (operates in MX), mexico.direct-peptides.com

### .in (India / Asia)
- shilpapharma.com, biochain.in, bjmadan.com, prayoglife.com, india.pharmalabglobal.com (mostly B2B / API-grade; consumer-vendor presence weaker)

### .au (Australia)
- australianpeptidestore.com.au, auspep.com.au, thepeptideco.com, elitepeptidesaustralia.com, hcs-pharma.com, bondipeptides.com, peptidecentre.com, alphalabs.au

### .de (Germany — for completeness)
- europeptides.de, peptides.de, peptanova.de, iris-biotech.de

---

## Vendor candidates net-new vs Pass 1

143 unique domains harvested this pass do not appear in the 271-domain Pass 1 primary-domain index. Listed here with the strongest single piece of evidence per domain. Several are likely the same brand under variant slugs (flagged inline).

### FDA / DOJ enforcement-named, net-new
- **Pink Pony Peptides** — pinkponypeptides.com — https://www.fda.gov/inspections-compliance-enforcement-and-criminal-investigations/warning-letters/lovega-llc-dba-pink-pony-peptides-721088-03312026
- **Mile High Compounds (LLC)** — milehighcompounds.is — https://www.fda.gov/inspections-compliance-enforcement-and-criminal-investigations/warning-letters/mile-high-compounds-llc-721600-03312026
- **PekCura Labs** — pekcuralabs.com — https://www.fda.gov/inspections-compliance-enforcement-and-criminal-investigations/warning-letters/pekcura-labs-721709-03312026
- **Prime Sciences** — prime-sciences.com — https://www.fda.gov/inspections-compliance-enforcement-and-criminal-investigations/warning-letters/prime-sciences-721805-03312026
- **Gram Peptides** — grampeptides.com — https://www.fda.gov/inspections-compliance-enforcement-and-criminal-investigations/warning-letters/gram-peptides-721806-03312026
- **Xcel Research / Xcel Peptides** — xcelpeptides.com — https://www.fda.gov/inspections-compliance-enforcement-and-criminal-investigations/warning-letters/xcel-research-llc-694608-12102024
- **Summit Research Peptides** — summitpeptides.shop (and review-page slug summitpeptides.com) — https://www.fda.gov/inspections-compliance-enforcement-and-criminal-investigations/warning-letters/summit-research-peptides-695607-12102024
- **ybycmeds** — ybycmeds.com — https://www.fda.gov/inspections-compliance-enforcement-and-criminal-investigations/warning-letters/ybycmeds-09092025
- **Tailstorm Health / Medivant Health** — medivanthealth.com — https://www.fda.gov/inspections-compliance-enforcement-and-criminal-investigations/warning-letters/tailstorm-health-inc-dba-medivant-health-703497-04082025

### Trustpilot / Reviews.io / SiteJabber / ScamAdviser-confirmed, net-new
- **Research Peptide Labs** — researchpeptidelabs.com — https://www.trustpilot.com/review/researchpeptidelabs.com
- **Researchpeptideslab** — researchpeptideslab.com — https://www.trustpilot.com/review/researchpeptideslab.com
- **Research Peptides UK** — researchpeptides.co.uk — https://www.trustpilot.com/review/www.researchpeptides.co.uk
- **Ora Labs** — oralabs.net — https://ca.trustpilot.com/review/oralabs.net
- **Peak Lab Peptides** — peaklabpeptides.com — https://www.trustpilot.com/review/peaklabpeptides.com
- **Pura Peptides** — purapeptides.com — https://www.trustpilot.com/review/purapeptides.com
- **Peptide Systems** — peptidesystems.com — https://www.trustpilot.com/review/peptidesystems.com
- **BioEdge Research Labs** — bioedgeresearchlabs.com — https://www.trustpilot.com/review/bioedgeresearchlabs.com
- **Summit Peptides (review-page brand)** — summitpeptides.com — https://www.trustpilot.com/review/summitpeptides.com
- **Research Peptides Europe** — researchpeptideseurope.com — https://www.trustpilot.com/review/researchpeptideseurope.com
- **Peak Peptides** — peakpeptides.shop — https://www.trustpilot.com/review/peakpeptides.shop
- **Pure Peptide Labs** — purepeptidelabs.com — https://www.trustpilot.com/review/purepeptidelabs.com
- **Peptidessciences** (likely typo-squat of Pass 1 peptidesciences.com) — peptidessciences.com — https://www.trustpilot.com/review/peptidessciences.com
- **The Peptide Labs (CA)** — thepeptidelabs.ca — https://www.trustpilot.com/review/thepeptidelabs.ca
- **Peptidic** — peptidicresearch.com — https://www.trustpilot.com/review/peptidicresearch.com
- **Midwest Peptide** — midwestpeptide.com — https://www.trustpilot.com/review/midwestpeptide.com
- **Peptidepro** — peptidepro.io — https://www.trustpilot.com/review/peptidepro.io
- **Peptide Technologies** — peptidetech.is — https://www.trustpilot.com/review/peptidetech.is
- **Peptide.shop** — peptide.shop — https://www.trustpilot.com/review/peptide-shop.com
- **Pura Peptides Reviews mirror** — purapeptides.reviews — https://www.scamadviser.com/check-website/purapeptides.reviews
- **Modern Peptides** — modernpeptides.com — https://www.scamadviser.com/check-website/modernpeptides.com
- **Peptide Warehouse** — peptide-warehouse.com — https://www.scamadviser.com/check-website-old/peptide-warehouse.com
- **Peptide Store EU** — peptide-store.eu — https://www.scamadviser.com/check-website/peptide-store.eu
- **Peptide Depot** — peptide-depot.com — https://www.scamadviser.com/check-website/peptide-depot.com
- **Eternal Peptides** — eternalpeptides.net — https://www.scamadviser.com/check-website/eternalpeptides.net
- **Direct Peptides (hyphen variant)** — direct-peptides.com — https://www.scamadviser.com/check-website/direct-peptides.com
- **Peptide Bioregulator** — peptide-bioregulator.com — https://www.scamadviser.com/check-website/peptide-bioregulator.com
- **Peptides Ireland** — peptidesireland.com — https://www.reviews.io/company-reviews/store/peptidesireland-com
- **Purity Peptide** — puritypeptide.com — https://www.reviews.io/company-reviews/store/puritypeptide-com
- **Biohack Peptides** — biohackpeptides.co.uk — https://www.reviews.io/company-reviews/store/www.biohackpeptides.co.uk
- **Pure Peptides UK** — purepeptidesuk.com — https://www.reviews.io/company-reviews/store/purepeptidesuk.com
- **Peptide Pros** — peptidepros.net — https://www.reviews.io/company-reviews/store/peptidepros-net
- **Power Peptides** — powerpeptides.com (and mypowerpeptides.com mirror; Pass 1 has powerpeptides.top) — https://www.reviews.io/company-reviews/store/powerpeptides.com
- **My Power Peptides** — mypowerpeptides.com — https://reviews.io/company-reviews/store/powerpeptides.com?language=
- **Pinnacle Peptides** — pinnaclepeptides.com — https://www.reviews.io/company-reviews/store/pinnaclepeptides-com
- **Pganabolics** — pganabolics.com — https://www.sitejabber.com/reviews/pganabolics.com
- **Bio Life Technologies** — biolifetechnologies.com — https://www.sitejabber.com/reviews/biolifetechnologies.com
- **PharmaGrade Iceland (ice.pharmagrade.store / iceland.pharmagrade.store)** — ice.pharmagrade.store — https://ice.pharmagrade.store/
- **Direct Peptides Iceland subdomain** — iceland.direct-peptides.com — https://iceland.direct-peptides.com/
- **Direct SARMs Iceland** — iceland.direct-sarms.com — https://iceland.direct-sarms.com/
- **Peptides UK** — peptidesuk.com — https://peptidesuk.com/
- **UK Peptides** — uk-peptides.com — https://www.uk-peptides.com/
- **Peptides Lab UK** — peptideslabuk.com — https://peptideslabuk.com/
- **Dr Peptides** — drpeptides.co.uk — https://www.drpeptides.co.uk/
- **Tide Labs** — tidelabs.co.uk — https://tidelabs.co.uk/
- **XL Peptides** — xlpeptides.com — https://xlpeptides.com/
- **Vitality Peptides** — vitalitypeptides.co.uk — https://vitalitypeptides.co.uk/
- **Express Peptides** — expresspeptides.co.uk — https://www.expresspeptides.co.uk/
- **UK Research Peptides** — uk-research-peptides.co.uk — https://www.scamadviser.com/check-website/uk-research-peptides.co.uk
- **Bluewell Peptides** — bluewellpeptides.com — https://bluewellpeptides.com/
- **Stratford Peptides** — stratfordpeptides.com — https://www.stratfordpeptides.com/
- **Imuscle UK (SARMs vendor)** — imuscle-sarms.co.uk — https://www.sitejabber.com/reviews/imuscle-sarms.co.uk
- **Purity Peptides (.ca)** — puritypeptides.ca — https://puritypeptides.ca/
- **NCRP Canada** — ncrpcanada.com — https://ncrpcanada.com/
- **Canada Peptide** — canadapeptide.com — https://canadapeptide.com/
- **Revico Labs** — revicolabs.com — https://revicolabs.com/
- **Peptide Warehouse CA** — peptidewarehouse.ca — https://www.peptidewarehouse.ca/
- **Amino Pure Canada** — aminopurecanada.ca — https://www.aminopurecanada.ca/
- **Canadian Peptides** — canadianpeptides.ca — https://canadianpeptides.ca/
- **Exoma Peptides MX** — exomapeptides.mx — https://exomapeptides.mx/
- **Olympus Labs Peptides MX** — olympuslabspeptidesmx.com — https://www.olympuslabspeptidesmx.com/
- **Pharma Lab Global Mexico** — mexico.pharmalabglobal.com — https://mexico.pharmalabglobal.com/
- **Supreme Peptides MX** — supremepeptides.com — https://www.supremepeptides.com/
- **Direct Peptides MX subdomain** — mexico.direct-peptides.com — https://mexico.direct-peptides.com/
- **Pharma Lab Global India** — india.pharmalabglobal.com — https://india.pharmalabglobal.com/
- **Shilpa Pharma** — shilpapharma.com — https://shilpapharma.com/peptide-manufacturers/
- **Biochain India** — biochain.in — https://www.biochain.in/products/peptide-synthesis
- **B.J. Madan & Co.** — bjmadan.com — https://www.bjmadan.com/peptides.html
- **Prayog Life Science** — prayoglife.com — https://www.prayoglife.com/services/peptides/
- **Australian Peptide Store** — australianpeptidestore.com.au — https://australianpeptidestore.com.au/
- **AUSPEP** — auspep.com.au — https://auspep.com.au/
- **The Peptide Co (AU)** — thepeptideco.com — https://thepeptideco.com/
- **Elite Peptides Australia** — elitepeptidesaustralia.com — https://elitepeptidesaustralia.com/
- **HCS Pharma AU** — hcs-pharma.com — https://hcs-pharma.com/en-au/
- **Bondi Peptides** — bondipeptides.com — https://bondipeptides.com/
- **Peptide Centre** — peptidecentre.com — https://peptidecentre.com/
- **Alphalabs AU** — alphalabs.au — https://www.trustpilot.com/review/alphalabs.au
- **EuroPeptides DE** — europeptides.de — https://europeptides.de/
- **Baltic BioLabs** — balticbiolabs.eu — https://balticbiolabs.eu/
- **Peptides Europe** — peptides-eu.com — https://www.peptides-eu.com
- **Pulse Peptides** — pulsepeptides.com — https://pulsepeptides.com/
- **Research Peptides Europe (alt)** — researchpeptides-europe.com — https://researchpeptides-europe.com/
- **EuroPeptides EU** — europeptides.eu — https://europeptides.eu/
- **Peptanova** — peptanova.de — https://peptanova.de/
- **Iris Biotech** — iris-biotech.de — https://iris-biotech.de/en/peptides.html
- **Peptides.de** — peptides.de — https://www.peptides.de/
- **JPT Peptide Catalog** — jpt.com — https://www.jpt.com/peptide-catalog/
- **Intavis Peptide Services** — intavispeptides.com — https://intavispeptides.com/en/
- **Serox GmbH** — serox.com — https://serox.com/
- **MedChemExpress** — medchemexpress.com — https://www.medchemexpress.com/peptides.html
- **Biosynth** — biosynth.com — https://www.biosynth.com/peptides
- **Bachem** — bachem.com — https://www.bachem.com/
- **Phoenix Pharmaceuticals (peptide)** — phoenixpeptide.com — https://phoenixpeptide.com/
- **Peptides BioLab** — peptides-biolab.com — https://peptides-biolab.com/
- **NuaCell** — nuacell.com — https://nuacell.com/peptides-products/
- **MyBioLab Shop** — mybiolabshop.com — https://mybiolabshop.com/3-peptides
- **Neobiolab** — neobiolab.com — https://neobiolab.com/
- **BioLabs Peptides** — biolabspeptides.com — https://biolabspeptides.com/
- **BioLongevity Labs** — biolongevitylabs.com — https://biolongevitylabs.com/
- **MyBioSource** — mybiosource.com — https://www.mybiosource.com/peptide
- **Pentech Peptide** — pentechpeptide.com — https://www.trustpilot.com/review/pentechpeptide.com
- **Reta One Labs** — retaonelabs.com — https://www.trustpilot.com/review/retaonelabs.com
- **Penguin Peptides** — penguinpeptides.com — https://www.trustpilot.com/review/penguinpeptides.com
- **Crush Research Supply Co.** — crushresearch.com — https://www.trustpilot.com/review/crushresearch.com
- **Peptide Partners** — peptide.partners — https://www.trustpilot.com/review/peptide.partners
- **Peptira** — peptira.com — https://www.trustpilot.com/review/peptira.com
- **Royal Peptides Wholesale** — royal-peptides.com — https://www.trustpilot.com/review/royal-peptides.com
- **Royal Research** — royalresearch.co — https://www.trustpilot.com/review/royalresearch.co
- **American Research** — americanresearch.net — https://www.trustpilot.com/review/americanresearch.net
- **Polaris Peptides** — polarispeptides.com — https://www.trustpilot.com/review/polarispeptides.com
- **My Pure Peptide** — mypurepeptide.com — https://www.trustpilot.com/review/mypurepeptide.com
- **Licensed Peptides** — licensedpeptides.com — https://www.trustpilot.com/review/licensedpeptides.com
- **Peptide Crafters** — peptidecrafters.com — https://www.trustpilot.com/review/peptidecrafters.com
- **NuRev Peptides** — nurevpeptides.com — https://www.trustpilot.com/review/nurevpeptides.com
- **True Peptide Labs** — truepeptidelabs.com — https://www.trustpilot.com/review/truepeptidelabs.com
- **TrueLab Peptides** — truelabpeptides.com — https://www.trustpilot.com/review/truelabpeptides.com
- **Prime Lab Peptides** — primelab-peptides.com — https://www.trustpilot.com/review/primelab-peptides.com
- **Research Ready Peptides** — researchreadypeptides.com — https://www.trustpilot.com/review/researchreadypeptides.com
- **Element Peptide** — elementpeptide.com — https://www.trustpilot.com/review/elementpeptide.com
- **Vital BPC-157** — vitalbpc157.com — https://ca.trustpilot.com/review/vitalbpc157.com
- **Peptide Supplies** — peptide-supplies.com — https://uk.trustpilot.com/review/peptide-supplies.com
- **Prime Peptides** — primepeptides.co — https://www.trustpilot.com/review/primepeptides.co
- **Base Peptides** — basepeptide.com — https://www.trustpilot.com/review/basepeptide.com
- **Infiniwell** — infiniwell.com — https://uk.trustpilot.com/review/infiniwell.com
- **Peptidist** — peptidist.com — https://www.trustpilot.com/review/peptidist.com
- **CertaPeptides** — certapeptides.com — https://www.trustpilot.com/review/certapeptides.com
- **Saf Peptides** — saf-peptides.com — https://www.trustpilot.com/review/www.saf-peptides.com
- **Triggered Brand** — triggeredbrand.store — https://www.trustpilot.com/review/triggeredbrand.store
- **Precision Peptide Co** — precisionpeptideco.com — https://www.trustpilot.com/review/precisionpeptideco.com
- **Peptide Central** — peptidecentral.net — https://www.trustpilot.com/review/peptidecentral.net
- **Peptide Product EU** — peptideproduct.eu — https://www.trustpilot.com/review/peptideproduct.eu
- **Peptide S Shop** — peptide-s.shop — https://www.trustpilot.com/review/peptide-s.shop
- **Peptides Warehouse (.com slug)** — peptideswarehouse.com — https://www.trustpilot.com/review/www.peptideswarehouse.com
- **Professional Peptides** — professionalpeptides.shop — https://www.trustpilot.com/review/professionalpeptides.shop
- **Biotech Peptides** — biotechpeptides.com — https://www.trustpilot.com/review/biotechpeptides.com
- **Biopeptitech** — biopeptitech.com — https://www.trustpilot.com/review/biopeptitech.com
- **Wuhan wansheng biotechnology (WWB)** — wuhanwanshengbiotechnology.com — https://www.trustpilot.com/review/wuhanwanshengbiotechnology.com
- **Evolve Peptides** — evolvepeptides.com — https://www.trustpilot.com/review/evolvepeptides.com
- **Alpha Peptides** — alpha-peptides.com — https://www.trustpilot.com/review/alpha-peptides.com
- **Alpha Omega Peptide** — alphaomegapeptide.com — https://www.trustpilot.com/review/alphaomegapeptide.com
- **Alpha Research Peptides** — alpharesearchpeptides.com — https://www.trustpilot.com/review/alpharesearchpeptides.com
- **Ascend Amino** — ascendamino.net — https://www.trustpilot.com/review/ascendamino.net
- **CK Peptides** — ck-peptides.com — https://www.trustpilot.com/review/ck-peptides.com
- **Particle Peptides** — particlepeptides.com — https://www.trustpilot.com/review/particlepeptides.com
- **Instant Peptides** — instantpeptides.com — https://www.trustpilot.com/review/instantpeptides.com
- **Happy Peptides** — happypeptides.com — https://www.trustpilot.com/review/happypeptides.com
- **Cutting Edge Peptides** — cuttingedgepeptides.com — https://www.trustpilot.com/review/cuttingedgepeptides.com
- **Paragon Peptides** — paragonpeptides.net — https://www.trustpilot.com/review/paragonpeptides.net
- **Rebel Peptides** — rebelpeptides.com — https://www.reviews.io/company-reviews/store/rebelpeptides.com-WWVe6pN
- **Sigma Peptides** — sigmapeptides.com — https://www.scamadviser.com/check-website/sigmapeptides.com
- **Peptide Source** — peptidesource.net — https://www.scamadviser.com/check-website/peptidesource.net
- **SUP Peptide** — suppeptide.com — https://www.scamadviser.com/check-website/suppeptide.com
- **Precision Peptide (hyphen variant)** — precision-peptide.com — https://www.scamadviser.com/check-website-old/precision-peptide.com
- **Peptide Worldwide** — peptideworldwide.com — https://www.scamadviser.com/check-website-old/peptideworldwide.com
- **Research1Peptides** — research1peptides.com — https://www.scamadviser.com/check-website/research1peptides.com
- **US Made Research Peptides** — usmaderesearchpeptides.com — https://www.scamadviser.com/check-website/usmaderesearchpeptides.com
- **International Peptides** — international-peptides.com — https://www.scamadviser.com/check-website/international-peptides.com
- **Research Peptides ZA** — researchpeptides.co.za — https://www.scamadviser.com/check-website/researchpeptides.co.za
- **Peptides4Research** — peptides4research.com — https://www.scamadviser.com/check-website-old/peptides4research.com
- **Your Peptide Brand** (white-label B2B) — yourpeptidebrand.com — https://yourpeptidebrand.com/

### Likely Pass-1 alias / variant (flag for dedupe, not net-new)
- `certified-pep.com` ↔ Pass 1 `certifiedpep.com`
- `paradigmpeptides.com` ↔ Pass 1 `paradigm-peptide.com`
- `powerpeptides.com` / `mypowerpeptides.com` ↔ Pass 1 `powerpeptides.top` (likely same brand, different infra)
- `peptidessciences.com` (double-S) ↔ Pass 1 `peptidesciences.com` (single-S; classic typo-squat candidate)
- `directpeptides.com` already in Pass 1 — so `direct-peptides.com` likely a hyphenated mirror

---

## Notes / blockers
- WebSearch backend silently drops bare `site:.is`/`.to`/`.cc`/`.ru`/`.su` queries — had to substitute descriptive queries plus brand probes (e.g., `"swisschems.is" OR "peptidetech.is"`) to surface .is hits. Future passes may need a different SERP source for raw TLD enumeration.
- WebFetch on every direct `fda.gov/...warning-letters/...` URL returned HTTP 404 from this sandbox (probably User-Agent / Cloudflare blocking). Search-engine summaries used as proxy — domain-mappings (e.g., `pinkponypeptides.com`, `milehighcompounds.is`, `xcelpeptides.com`) confirmed via FDA letter quotes embedded in third-party news/legal-blog re-publications + the FDA URL slug itself.
- The September 2025 GLP-1 wave includes 50+ FDA letters whose full roster I did not enumerate to individual domain level — only Expert Aesthetics, The HCG Institute, Bioverse Inc. surfaced by name. Suggest a Pass 3 dedicated to scraping `fda.gov/...warning-letters/datatables-data?search_api_fulltext=Peptide` (XLSX endpoint).
- Trustpilot category index (`trustpilot.com/categories/biochemical_supplier`) referenced more vendors (e.g., AIO Peptides, Verified Peptides, Mile High Compounds, Thrive Peptides) without per-page slugs we could verify — flagging Thrive Peptides as an open thread for Pass 3.
