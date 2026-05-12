---
generated_at: 2026-05-06
inputs: vendor_universe_pass1.csv + 4 Pass 2 surface files + Pass 3 gap-chase
output: vendor_universe_pass2.csv (998 vendors)
---

# Pass 2 Aggregation + Pass 3 Gap-Chase Summary

## Counts

| Pass | Net-new vendors | Cumulative universe |
|---|---|---|
| Pass 1 baseline | — | 600 |
| Pass 2 merge (curl + search + creators + trustpilot/FDA) | **258** | 858 |
| Pass 3 gap-chase (FDA Sept 2025 wave + Feb 2026 wave + compounding pharmacies + backlink graph + international) | **140** | **998** |

### Distribution by entity_type
- retail: 659 (66%)
- manufacturer-b2b: 159 (16%)
- telehealth: 94 (9%) — largely Pass 3 FDA-cited GLP-1 telehealth platforms
- aggregator: 52 (5%)
- compounding-pharmacy: 27 (3%) — largely Pass 3 FDA-cited 503A/B
- uncertain: 7 (<1%)

### Distribution by surface
| Surface | # vendors present in |
|---|---|
| forums (Pass 1) | 244 |
| aggregators (Pass 1) | 241 |
| archive_telegram (Pass 1) | 170 |
| pass2-trustpilot-fda | 132 |
| pass3-fda | 123 |
| youtube (Pass 1) | 93 |
| pass2-search | 73 |
| pass2-curl | 63 |
| reddit (Pass 1) | 62 |
| pass2-creators | 24 |
| pass3-international | 16 |
| pass3-backlinks | 6 |

### Status distribution
- `active`: 520
- `uncertain`: 271
- `(blank)`: 60
- FDA warning 2025-09-09 (telehealth wave): 57
- FDA warning 2026-02-20 (telehealth wave): 30
- FDA warning various other dates: ~25
- DOJ indictment 2025-09: 2
- defunct 2025-12: 1 (Paradigm), defunct 2026-03: 1 (Peptide Sciences)

## New vendors surfaced in Pass 2 (258 net-new; key subsets below)

### From `surface_curl_bypass.md` (Pass 2A — 63 net-new)
Largest hauls: peptidecritic.com /vendor-directory (Alpha Omega, Alpha Peptides, Apex Amino, Atomix Research, Biocollex, Crush Research, Elevated Peptides, Elite Biogenix, Full Scale Peptides, Genesis Peptides, Genpeptide, Half Nattys, Instant Peptides, Ion Peptides, Main Peptides, Midwest Peptide, Molecular Edge Peptides, NextGenPeps, NexxGen Peptides, Nootropic Source, Nura Peptide, Nutrycore, OneDay Compounds, Oros Research, Panda Peptides, Peptides Sale, Peptides World, Peptira, PepVida Labs, Pro Labs Research, Profound Aminos, Pure Health Peptides, Pure Peptides Bio, Raw Amino, RCS Research, Validated Peptides, Welli Labs); thepeptidelist /reviews adds (Alpha Labs Peptides, Arctic Peptides, Canada Peptides, Enhanced Peptides, Evolve Peptides, HM Peptide, Narrows Labs, Research Peptides (TPL slug), Simple Peptides, Strate Labs, Swole AF Labs); peptideals /vendors (JH Biosciences, Peptide Giants, Platinum Lion, Puratek, Research Chem); finnrick wayback (Hangzhou Youngpeptide HYB, Nantong Guangyuan Chemical GYC, Qing Li Peptide, Qingdao Saber Technology Pharma QST, Qingdao Sigma Chemical QSC, Shanghai Wibson Biotechnology WBS, Top Peptide); thepeptideindex (PeptidePure, PharmaGrade Store, Warrior Makers).

### From `surface_search_deep.md` (Pass 2B — 73 net-new)
**FDA April 2026 wave (Pink Pony Peptides, Mile High Compounds, Prime Sciences, Gram Peptides, FormPour, Fantasy Face)** + **Feb 2026 telehealth wave (MEDVi, 24HrDoc, Join Josie, Better Health Labs/Measured)** + **2024 Synthetix/Helix + US Chem Labs** + listicle long-tail (**Chameleon Peptides, Orion Peptides, Roidly, Bioinfinity, Pinnacle Peptide Labs, Healthletic, Pivot Labs, Peptaura, Peptide Hubs, Peptide Store, Peptide Systems, MyPurePeptide, Peak Lab Peptides, Happy Peptides, Pure Peptides UK, ResearchReadyPeptides, ResearchPeptidesLab, Certified-Pep, Rebel Peptides, BulkGLP, Pinnacle Peptides Tirz, PureRx Peptides, Heritage Labs, Maylips, Adipogen, Pure Health Peptides, Peptide Works, Licensed Peptides, Cosmic Peptides, Apex Peptide Supply, Beyond Peptides, Pure Lab Peptides, Northline Labs, ProSpec/ProSpecBio, Peptide Shop, Peptides Kingdom, Longevity Peptides, Expert Peptides, Peptide Stock**) + B2B/CDMO (Bachem, AmbioPharm, CordenPharma, PolyPeptide Group, Thermo Fisher Scientific, CPC Scientific, GenScript, JPT Peptide Technologies, Tocris Bioscience, Adooq, Biosynth, Phoenix Pharmaceuticals) + niche audience (QSC Peptides, Clavicular Stack, Clavicular Peptides, BioMogging, PeptidesClav) + Iceland subdomains (PharmaGrade Iceland, Direct SARMs Iceland, Direct Peptides Iceland) + UK SARMs + Spartan Peptides + cosmetic adjacencies (Persebelle, Hunter Lab, Neurogan Health) + testing labs (Janoshik Analytical, Krause Analytical, MZ Biolabs).

### From `surface_creators_deep.md` (Pass 2C — 24 net-new)
**Origin Labs Research + Eden Scientific** (Peptide Guy code TPG10/TPG), **Warrior Makers** (Spa and Tell Melanotan, code NK), **algorx.ai** (Greg Doucette code Greg 10%), **NP Labs** (Greg-adjacent telehealth), **Enhanced Labs + Next Chems** (Connor Murphy / Natty+ code PLUS), **BasedBodyWorks** (Nathan Baarss code NATHAN). Plus Jay Campbell adjacent (BioStack Labs, MyVitalC, Calocurb, Bimini Hydrotherapy, Trifecta Light, Blushield, N1O1/NO2U, Oxford Healthspan, Nutrition Solutions, The Peptides Course, TOT Decoded, FullyOptimizedHealth) and Syrian Psycho's mogwarts.net + ascendlabs.store.

### From `surface_trustpilot_fda_jurisdiction.md` (Pass 2D — 132 net-new)
Largest contribution. **Trustpilot direct** (Peak Lab, Peptide Systems, BioEdge Research Labs, Summit Peptides .com, Research Peptides Europe, Peak Peptides, Pure Peptide Labs, Peptidessciences typosquat, Peptide Labs CA, Peptidic Research, Peptidepro .io, Peptide Technologies .is, Royal Peptides Wholesale, Vital BPC-157, Peptide Supplies, Penguin Peptides, Reta One Labs, Peptidist, CertaPeptides, Saf Peptides, Triggered Brand, Precision Peptide Co, Peptide Central, Royal Research, American Research, Peptide Crafters, True Peptide Labs, TrueLab Peptides, Prime Lab Peptides .com, Element Peptide, Peptide-S Shop, Peptide Product EU, Peptides Warehouse, Peptide Warehouse, Professional Peptides, Pentech Peptide, Biopeptitech, Wuhan wansheng biotech, Alpha Research Peptides, Alphalabs AU, Ascend Amino, CK Peptides, Cutting Edge Peptides, Paragon Peptides, AIO Peptides, Crush Research Supply Co), **SiteJabber** (Pganabolics, Bio Life Technologies, Imuscle UK SARMs), **Reviews.io** (Peptides Ireland, Purity Peptide, Biohack Peptides UK, Peptide Store EU, Pinnacle Peptides Reviews, mypowerpeptides.com), **ScamAdviser** (Peptide Depot, Eternal Peptides .net, Direct Peptides hyphen, Peptide Bioregulator, Modern Peptides .com, Pura Peptides Reviews mirror, Research1Peptides, UK Research Peptides, US Made Research Peptides, International Peptides, Peptides.org, Research Peptides ZA, Peptides4Research, Sigma Peptides, Precision Peptide hyphen, SUP Peptide, Russian Peptide / peptide-shop.com, Peptide Worldwide), plus **UK** (Peptides UK, Peptides Lab UK, Dr Peptides, Tide Labs UK, Vitality Peptides, Express Peptides, Bluewell Peptides, Stratford Peptides), **Canada** (Purity Peptides CA, NCRP Canada, Canada Peptide, Peptide Warehouse CA, Amino Pure Canada), **Mexico** (Exoma Peptides MX, Olympus Labs Peptides MX, Pharma Lab Global Mexico, Supreme Peptides MX, Direct Peptides MX), **India** (Pharma Lab Global India, Shilpa Pharma, Biochain India, B.J. Madan & Co., Prayog Life Science), **Australia** (Australian Peptide Store, AUSPEP, The Peptide Co AU, Elite Peptides Australia, HCS Pharma AU, Bondi Peptides, Peptide Centre), **EU** (EuroPeptides DE, Baltic BioLabs, Peptides Europe, Pulse Peptides, Research Peptides Europe alt, EuroPeptides EU, Peptanova, Iris Biotech, Peptides.de, Intavis Peptide Services, Serox GmbH, MedChemExpress, Peptides BioLab, NuaCell, MyBioLab Shop, Neobiolab, BioLabs Peptides, Your Peptide Brand).

## New vendors surfaced in Pass 3 gap chase (140 net-new)

### A) FDA September 2025 telehealth wave (~57 net-new)
Full enumeration via FDA Solr Index XLSX endpoint.

ASN-LABS, All American Wellness, Amazing Meds, Biopreventative Company, Bioverse, Body Good Studio, Canada Med Stop, Cosmo Medical Spa, Curex, Dermacare/BlueChew, DirectMeds, Dr. Gater's Weight Loss, EA WORKS/Trust Labs, eDrugstore, Elevate Your Wellness/Elevated, Elite Health Center, EvoLife Wellness, Expert Aesthetics, Fancy Meds, FitRx/Zealthy, FWD Care/FWD, GenLabMeds, Get.Fit.Medical, GLP-1 Solution, HealBerry, Healthon, Healthy Living Clinic, Healthy Male, Hello Cake, Hims, inspire.clinic, Intimate Rose, Invigorate Med Spa, iVisitDoc, JulyMD, Las Villas Health Care, Lean Dreams, Lovely Meds, Lumimeds, Lyfe Rx, Mane & Steel, Master Pharmaceuticals Group, MyStart Health, MedClub by Dr. Jenn, Novo Nordisk, Eli Lilly and Company, Nuvo Life Health, Remedy Meds, Reset IV, SemaBio, SimpleRx, Slendid, Sprout Health, The HCG Institute, Try Nova, TRYM Health, Tuyo Health, Vitals RX, motionpharmacy.com.

### A2) FDA February 2026 telehealth false-claims wave (~25 net-new)
Alan Health Tech/Alan, Aspen Aesthetics/Fifty 410, Belle Health/Belle, Bliv Wellness/Bliv, BluefitMD, Deluxe IV Aesthetics, Dripgym/Amp Health, FitRx (Feb), Genesis Health Intl, Good Girl/GoodGirlRX, Ivim Services, Kare Solutions/Zappy, Kin Meds, Lean Rx/SkinnyRx, Levity, MaxLife/Maxlife, Newman Clinic, NewSelf, Peaks Curative, PharmaZee, Premium Health Mgmt, Refills Health, Strut Health, Viv Health/VIV RX, Weightless Medical/WeightCare, Zeuss.

### A3) FDA compounding-pharmacy 503A/B inspection cluster (~22 net-new)
Annovex Pharma, Apollo Care, Apothecary Pharma (apothecarypharma.com), Boothwyn Pharmacy (boothwyn.com), Empower Pharmacy (empowerpharmacy.com), Fagron Sterile Services, GenoGenix, MedisourceRx, Nubratori Rx, OSRX Pharmaceuticals (osrxpharmaceuticals.com), PQ Pharmacy, ProRx Pharmacy, QuVa Pharma, RC Outsourcing, Revive Rx Pharmacy (reviverx.com), Carie Boyd Pharmaceuticals, Staska Pharmaceuticals, Epicur Pharma/Stokes Healthcare, Thrive Health Solutions, Turbare Manufacturing, Wells Pharmacy Network (wellsrx.com), Olympia Pharmaceuticals (olympiapharmacy.com).

### A4) FDA online research-peptide misc (~15 net-new)
cheaptrustedpharmacy.com, Darmerica, Handelnine Global/Navafresh, Helix Chemical Supply (helixresearchpeptides.net), Nomida.biz, Ozempen.com, Veronvy, USApeptide.com, 24hreup.biz, buynetmeds.com, dashpct.com, peacefulmeds.com, weightcrunchshop.com.

### B) Domain confirmation results
- **Pink Pony Peptides** = pinkponypeptides.com (Pass 2 confirmed)
- **Mile High Compounds** = milehighcompounds.is (Pass 2 confirmed; mirror milehighcompound.com; typosquat milehighcompouns.com)
- **PekCura Labs** = pekcuralabs.com (Pass 2 confirmed)
- **Prime Sciences** = prime-sciences.com (Pass 2 confirmed)
- **Gram Peptides** = grampeptides.com (Pass 2 confirmed)
- **FormPour** = ebay.com/str/formpour (eBay only)
- **Fantasy Face / Guangzhou Huli** = ebay.com/str/fantasyface (eBay only)
- **US Chem Labs** = uschemlabs.com (still resolves; GLP-1 listings removed post-letter)
- **Synthetix / Helix Chemical Supply** → **helixresearchpeptides.net** likely successor
- **Veronvy** = veronvy (no public site verified)
- **Nomida.biz** = nomida.biz (offered Sema/Tirz Kit)
- **GLP-1 Solution** = glp1solution.store (NOT glp1solutions.com — that's education-only)
- **Pinnacle Peptides** = pinnaclepeptides.com (Pinnacle Professional Research dba; FDA Dec 2025 target)

### C) Backlink-graph net-new (5 Tier 1 vendors → 6 net-new)
- AminoForge (aminoforge.vegas) — Pure Rawz alt
- Nova Life Peptides (novalifepeptides.com) — Pure Rawz alt; March 2026 launch
- Iron Peak Peptides (ironpeakpeptides.com) — Biotech Peptides + Swiss Chems alt
- Adapt Peptides (adaptpeptides.com) — Core Peptides alt
- Protide Health (protidehealth.com) — Verified Peptides alt
- Cernum Biosciences (cernumbiosciences.com) — confirmed as own retail brand

### D) Telegram extension — 0 net-new (Telegram remains gated/uncrawled).

### E) Trustpilot pagination — 0 net-new beyond Pass 2.

### F) Reddit cached SERP — 0 net-new (Reddit blocked).

### G) UK / EU / CA / MX / AU international (~16 net-new)
- **Canada**: Luxara Labs, Durham Peptides, Canada Peptide Labs (canpeplabs.com), Bio Basic
- **EU**: PeptidesDirect, Eurogentec, EU Peptide Guide
- **Australia**: Backup Peptides, Aussie Peptides .au, Aussie Peptides .org, Australian Peptides .com, Australian Peptides .org, Australia Research Peptides, Australian Research Peptides .com.au, Prime Labs AU
- **Global**: PharmaLabGlobal (parent confirmed)

### Plus: 3 DOJ-indicted Chinese entities (Capsulcn International, Guangzhou Tengyue Chemical, Guangzhou Wanjiang Biotechnology)

## Convergence status

| Pass | Net-new | Net-new ratio |
|---|---|---|
| Pass 1 → Pass 2 | +258 | 43% growth (600 → 858) |
| Pass 2 → Pass 3 | +140 | 16% growth (858 → 998) |

**Convergence verdict: Approaching but NOT converged.** Pass 3 still added a substantial 140 vendors largely from one structurally distinct source (the FDA Solr XLSX endpoint, which exposed the full ~80-letter telehealth + compounding pharmacy waves the search-engine-only passes missed). The marginal new-vendor rate has dropped from 43% → 16% but Pass 3 was disproportionately driven by one fertile source (FDA datatables) rather than diminishing returns across the board.

Realistic expected vendor count if Pass 4-5 are added with comparable surface diversity: **~1,150-1,250 vendors total** before saturation. Pass 4 net-new estimate: 60-100 vendors.

## Remaining coverage gaps (be honest)

1. **Reddit r/Peptides + r/Peptidesource + r/PeptideGuide canonical wikis remain fully blocked.** The community-canonical "approved sources" lists likely contain 20-50 vendor names not yet surfaced. Fixing requires authenticated Reddit fetch (out of scope for this run) or someone with a Reddit account scraping the wikis directly.
2. **TLD-restricted enumeration (.is, .to, .ru, .cc, .cn, .su)** — search backends silently drop site:.<TLD> queries. Need ZetaCensorship-style WHOIS enumeration or Censys/Shodan-style TLD scanning. Probably 30-80 .is/.to peptide vendors not yet surfaced.
3. **Forum gated subforums (steroidsourcetalk.cc /sources/, eroids /sources/, anabolicminds /peptides/, glp1forum specific Premier Sponsor list)** — login-walled. ~50-100 source-talk vendor names hidden behind paywalls/registration.
4. **Trustpilot SERP pagination** — Trustpilot has thousands of low-volume peptide review pages beyond the first SERP slice. ~100-200 small-volume vendors are likely on Trustpilot pages 2-50 but not yet surfaced.
5. **Telegram private channels (Stairway to Gray, Peptide Research Group, Wholesale Peptides UK Linktree)** — invite-only or rotating-invite-only. Multi-vendor brokers with 1000+ subscribers. Not surfaced beyond names.
6. **Discord vendor servers** — some ID'd in Pass 1 but the server-internal vendor lists are gated.
7. **Specific exact-domain confirmations missing for**: Aavant Research, Lipeptides, NUPEPS Peptides, Apex (CMS), Cem-Meso, Iron Dragon, Recon Peptides, S4S, 3ccresearch (Bostin Loyd), Madison James, AR-r, Hexpharma, ANTIET LTD, Apollo Peptides .org (vs Apollo Peptide Sciences), and many of the Finnrick-only Chinese B2B entities.
8. **eBay store IDs for FormPour and Fantasy Face are confirmed**, but the underlying eBay shop catalog (other product listings on those stores) is not extracted.
9. **Cosmetic / topical peptide brands** (BelleVline, Hunter Lab, Neurogan, Lumara, Maysama, Laduora) — surfaced inline but not exhaustively crawled across the cosmetic-peptide cluster.
10. **DEA / ICE / CBP enforcement records** — only one CBP press release surfaced (Cincinnati 5,000-peptide seizure). DEA quarterly reports not searched. ~10-30 enforcement targets potentially missing.

## Recommendation: Another pass needed?

**Y — Pass 4 recommended, scoped to 4 specific surfaces:**

1. **Reddit wiki harvest** via authenticated fetch (or human-in-the-loop scrape of r/Peptides/wiki, r/Peptidesource/wiki, r/PeptideGuide/wiki, r/saferpeptides/wiki, r/saferpeptidesources/wiki). Highest expected yield.
2. **TLD enumeration** for .is + .to + .cn peptide-domain ecosystem via Censys/WHOIS reverse-lookup or AdvancedSearch syntax variations. Med-high expected yield.
3. **Trustpilot category pagination** beyond page 1 — iterate `https://www.trustpilot.com/categories/biochemical_supplier?page=N` for N=1..50 and harvest review-slug + review-count for every peptide vendor. Med expected yield.
4. **Forum login** OR forum cache-replay for steroidsourcetalk.cc /sources/, eroids /sources/, glp1forum Premier Sponsor list. Med-high expected yield.

**Pass 5+ likely diminishing returns** unless a structurally new surface appears (e.g., a comprehensive DEA/HHS enforcement DB, a new aggregator with vendor index, a successor to Finnrick).

After Pass 4, **expected total ~1,200 vendors** and convergence reached.
