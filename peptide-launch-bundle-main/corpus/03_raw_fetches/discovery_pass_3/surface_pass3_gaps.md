---
fetched_at: 2026-05-06
fetch_method: WebSearch + WebFetch + curl (FDA datatables endpoint)
surface: pass3-gap-chase
---

# Pass 3 — Gap Chase Findings

## A) FDA September 2025 50-letter GLP-1 wave + adjacent enforcement

### Methodology
- Pass 2D enumerated only ~3 of the September 2025 50-letter wave by name. The fdacgov sandbox returned 404 to direct WebFetch on the warning-letter index page, but the **datatables XLSX endpoint** is publicly accessible:
  ```
  https://www.fda.gov/inspections-compliance-enforcement-and-criminal-investigations/compliance-actions-and-activities/warning-letters/datatables-data?search_api_fulltext=<term>&_format=xlsx
  ```
- Fetched 5 XLSX exports for: `peptide`, `semaglutide`, `tirzepatide`, `GLP-1`, `compounded`. Aggregated and deduped to 255 unique companies → 163 recent (2024-2026) + peptide/compound/unapproved-relevant. All raw XLSX persisted at `/mnt/c/Users/endeg/Documents/peptide-research/peptide-research_cli/03_raw_fetches/discovery_pass_3/raw/fda_wl_*.xlsx` and aggregated JSON at `fda_warning_letters_aggregated.json`.

### September 9, 2025 — telehealth GLP-1 wave (~30+ companies)
All cited for "Unlawful Sale of Unapproved and Misbranded Drugs to United States Consumers Over the Internet (Telehealth)". Full enumeration from FDA datatables:

| Company | Date | URL slug |
|---|---|---|
| ASN-LABS | 09/09/2025 | asn-labs-716459-09092025 |
| All American Wellness | 09/09/2025 | all-american-wellness |
| Amazing Meds | 09/09/2025 | amazing-meds |
| Biopreventative Company LLC dba Biopreventative | 09/09/2025 | biopreventative |
| Bioverse, Inc. dba Bioverse | 09/09/2025 | bioverse-inc-dba-bioverse-716508-09092025 |
| Body Good Studio | 09/09/2025 | body-good-studio |
| Canada Med Stop | 09/09/2025 | canada-med-stop |
| Cosmo Medical Spa dba Cosmo Med Spa | 09/09/2025 | cosmo-medical-spa |
| Curex | 09/09/2025 | curex-716821-09092025 |
| Dermacare LLC dba BlueChew | 09/09/2025 | dermacare-bluechew |
| directmeds.com, Inc. dba DirectMeds | 09/09/2025 | directmedscom-inc-dba-directmeds-716822-09092025 |
| Dr. Gater's Weight Loss & Wellness | 09/09/2025 | dr-gater |
| EA WORKS Limited Liability Company dba Trust Labs | 09/09/2025 | ea-works-trust-labs |
| eDrugstore | 09/09/2025 | edrugstore-716505-09092025 |
| Elevate Your Wellness LLC dba Elevated | 09/09/2025 | elevate-your-wellness |
| Eli Lilly and Company | 09/09/2025 | eli-lilly-and-company-716485-09092025 |
| Elite Health Center | 09/09/2025 | elite-health-center |
| EvoLife Wellness | 09/09/2025 | evolife-wellness |
| Expert Aesthetics | 09/09/2025 | expert-aesthetics |
| Fancy Meds, LLC dba Fancy Meds | 09/09/2025 | fancy-meds-llc-dba-fancy-meds-716487-09092025 |
| FitRX, LLC dba Zealthy | 09/09/2025 | fitrx-zealthy |
| FWD Care, Inc. dba FWD | 09/09/2025 | fwd-care-inc-dba-fwd-716696-09092025 |
| GenLabMeds | 09/09/2025 | genlabmeds-09092025, genlabmeds-713650-09092025 |
| Get.Fit.Medical, LLC dba Get.Fit.Medical | 09/09/2025 | get-fit-medical |
| GLP-1 Solution | 09/09/2025 | glp-1-solution-715883-09092025 (domain: glp1solution.store) |
| HealBerry | 09/09/2025 | healberry |
| Healthon Inc. dba Healthon | 09/09/2025 | healthon |
| Healthy Living Clinic | 09/09/2025 | healthy-living-clinic |
| Healthy Male | 09/09/2025 | healthy-male-09092025 |
| Hello Cake, Inc. dba Hello Cake | 09/09/2025 | hello-cake |
| Hims & Hers Health, Inc. dba Hers | 09/09/2025 | hims-hers-health-inc-dba-hers-716825-09092025 |
| Hims & Hers Health, Inc. dba Hims | 09/09/2025 | hims-hers-health-inc-dba-hims |
| inspire.clinic | 09/09/2025 | inspire-clinic |
| Intimate Rose | 09/09/2025 | intimate-rose |
| Invigorate Med Spa | 09/09/2025 | invigorate-med-spa |
| iVisitDoc, Inc. dba iVisitDoc | 09/09/2025 | ivisitdoc |
| JulyMD | 09/09/2025 | julymd-09092025, julymd-716828-09092025 (domain: julymd.com) |
| Las Villas Health Care LLC dba Villas Health | 09/09/2025 | las-villas |
| Lean Dreams LLC dba LeanDreams | 09/09/2025 | lean-dreams |
| Lovely Meds, Inc. dba Lovely Meds | 09/09/2025 | lovely-meds |
| Lumimeds | 09/09/2025 | lumimeds |
| Lyfe Rx | 09/09/2025 | lyfe-rx |
| Mane & Steel, LLC dba Mane & Steel | 09/09/2025 | mane-steel |
| Master Pharmaceuticals Group | 09/09/2025 | master-pharmaceuticals-group |
| MedClub by Dr. Jenn | 09/09/2025 | medclub-dr-jenn |
| Matthew Stern, CEO MyStart Health LLC. | 09/09/2025 | mystart-health |
| Novo Nordisk Inc. | 09/09/2025 | novo-nordisk |
| Nuvo Life Health Inc. dba Nuvo Life Health | 09/09/2025 | nuvo-life-health |
| Remedy Meds | 09/09/2025 | remedy-meds |
| Reset IV, LLC dba Reset IV | 09/09/2025 | reset-iv |
| SemaBio | 09/09/2025 | semabio |
| SimpleRx | 09/09/2025 | simplerx |
| Slendid | 09/09/2025 | slendid-716700-09092025 |
| Sprout Health Partners LLC dba Sprout Health | 09/09/2025 | sprout-health |
| The HCG Institute | 09/09/2025 | hcg-institute |
| Try Nova | 09/09/2025 | try-nova |
| TRYM Health, Inc. dba TRYM Health | 09/09/2025 | trym-health |
| Tuyo Health, Inc. dba Tuyo Health | 09/09/2025 | tuyo-health |
| Vitals RX | 09/09/2025 | vitals-rx |
| ybycmeds | 09/09/2025 | ybycmeds-09092025 (domain: ybycmeds.com) |
| motionpharmacy.com | 09/10/2025 | motionpharmacy.com |

### February 20, 2026 — telehealth false-claims wave (~25 companies, "False & Misleading Claims/Misbranded (Telehealth)")
| Company | Date |
|---|---|
| 24HrDoc, Inc. dba 24HrDoc | 02/20/2026 |
| Alan Health Technologies Inc. dba Alan | 02/20/2026 |
| Aspen Aesthetics dba Fifty 410 | 02/20/2026 |
| Belle Health LLC dba Belle | 02/20/2026 |
| Better Health Labs, Inc. dba Measured | 02/20/2026 |
| Bliv Wellness LLC dba Bliv | 02/20/2026 |
| BluefitMD | 02/20/2026 |
| Deluxe IV Aesthetics PLLC dba Deluxe IV and Aesthetics | 02/20/2026 |
| Dripgym Mobile Parent, LLC dba Amp Health | 02/20/2026 |
| FitRX, LLC dba FitRx | 02/20/2026 |
| Genesis Health International Inc. dba Genesis | 02/20/2026 |
| Good Girl LLC dba GoodGirlRX | 02/20/2026 |
| Ivim Services LLC dba Ivim | 02/20/2026 |
| Join Josie | 02/20/2026 |
| Kare Solutions, LLC dba Zappy | 02/20/2026 |
| Kin Meds | 02/20/2026 |
| Lean Rx, Inc. dba SkinnyRx | 02/20/2026 |
| Levity Inc. dba Levity | 02/20/2026 |
| MaxLife Technologies Inc. dba Maxlife | 02/20/2026 |
| MEDVi, LLC dba MEDVi | 02/20/2026 |
| Newman Clinic, PLLC dba Newman Clinic | 02/20/2026 |
| NewSelf Limited dba NewSelf | 02/20/2026 |
| Peaks Curative, LLC dba Peaks | 02/20/2026 |
| PharmaZee | 02/20/2026 |
| Premium Health Management Inc. dba Premium Health | 02/20/2026 |
| Refills Health, LLC dba Refills Health | 02/20/2026 |
| Strut Health, LLC dba Strut | 02/20/2026 |
| Viv Health, Inc. dba VIV RX | 02/20/2026 |
| Weightless Medical LLC dba WeightCare | 02/20/2026 |
| Zeuss LLC dba Zeuss | 02/20/2026 |

### Compounding pharmacy 503A/503B inspection cluster (2024-2026)
| Company | Date |
|---|---|
| Annovex Pharma, Inc. | 03/05/2025 |
| Apollo Care, LLC | 02/02/2026 |
| Apothecary Pharma, LLC | 12/01/2025 |
| Boothwyn Pharmacy LLC | 06/09/2025, 01/16/2026 |
| Empower Clinic Services, LLC dba Empower Pharma / Pharmacy | 04/02/2025, 10/15/2021 |
| Fagron Compounding Services, LLC dba Fagron Sterile Service | 12/19/2024 |
| GenoGenix LLC | 01/20/2026 |
| MedisourceRx | 12/12/2025 |
| Nubratori, Inc. dba Nubratori Rx | 01/22/2025 |
| OSRX, Inc. | 04/23/2025 |
| PQ Pharmacy, LLC | 10/10/2025 |
| ProRx, LLC | 03/04/2025 |
| QuVa Pharma, Inc. | 01/26/2024 |
| RC Outsourcing, LLC | 03/20/2026 |
| Revive Rx LLC dba Revive Rx Pharmacy | 09/22/2025 |
| Right Value Drug Stores, LLC dba Carie Boyd Pharmaceuticals | 12/17/2024 |
| Staska Pharmaceuticals, Inc. | 05/05/2025 |
| Stokes Healthcare Inc. dba Epicur Pharma | 04/02/2024 |
| Tailstorm Health Inc. dba Medivant Health | 04/08/2025 |
| Thrive Health and Wellness, LLC dba Thrive Health Solutions | 02/09/2026 |
| Turbare Manufacturing | 09/16/2025 |
| Wells Pharma of Houston, LLC | 11/07/2025 |

### Internet-only "research peptide" / online pharmacy enforcement (2024-2026, all "Unapproved New Drugs" or "Unlawful Sale")
| Company | Date | Domain (where extracted) |
|---|---|---|
| cheaptrustedpharmacy.com | 07/29/2025 | cheaptrustedpharmacy.com |
| Darmerica, LLC | 12/08/2025 | (API supplier) |
| FormPour | 03/31/2026 | ebay.com/str/formpour |
| Fantasy Face / Guangzhou Huli Technology | 03/31/2026 | ebay.com/str/fantasyface |
| Gram Peptides | 03/31/2026 | grampeptides.com |
| Handelnine Global, LLC dba Navafresh | 11/17/2025 | navafresh.com (likely) |
| Helix Chemical Supply / Synthetix Inc. | 02/07/2024 | (Bronx NY) |
| Lovega LLC dba Pink Pony Peptides | 03/31/2026 | pinkponypeptides.com |
| Mile High Compounds LLC | 03/31/2026 | milehighcompounds.is |
| New Life Pharma LLC | 04/14/2026 | (manufacturer) |
| Nomida.biz | 09/12/2024 | nomida.biz |
| Ozempen.com | 06/24/2024 | ozempen.com |
| PekCura Labs | 03/31/2026 | pekcuralabs.com |
| Pinnacle Professional Research dba Pinnacle Peptides | 12/12/2025 | pinnaclepeptides.com |
| Prime Sciences | 03/31/2026 | prime-sciences.com |
| Prime Vitality, Inc. dba Prime Peptides | 12/10/2024 | primepeptides.co |
| Summit Research Peptides | 12/10/2024 | summitpeptides.shop |
| Swisschems | 12/10/2024 | swisschems.is |
| Synthetix Inc. dba Helix Chemical Supply | 02/07/2024 | helix-chemical-supply.com (helixresearchpeptides.net likely successor) |
| US Chem Labs | 02/07/2024 | uschemlabs.com |
| USApeptide.com | 02/26/2025 | usapeptide.com |
| Veronvy | 12/10/2024 | veronvy.com |
| Xcel Research LLC | 12/10/2024 | xcelpeptides.com |
| ybycmeds | 09/09/2025 | ybycmeds.com |
| www.24hreup.biz | 04/23/2025 | 24hreup.biz |
| www.buynetmeds.com | 06/12/2025 | buynetmeds.com |
| www.dashpct.com | 04/24/2024 | dashpct.com |
| www.peacefulmeds.com | 05/05/2025 | peacefulmeds.com |
| www.weightcrunchshop.com | 01/13/2025 | weightcrunchshop.com |
| inspire.clinic | 09/09/2025 | inspire.clinic |

### B) Domain confirmation for FDA-cited entities
- **Pink Pony Peptides** = pinkponypeptides.com (confirmed via search; Lovega LLC dba; Wellington FL)
- **Mile High Compounds** = milehighcompounds.is (Pass 2 confirmed; CEO Max Radovanic per LinkedIn; mirror milehighcompound.com + typosquat milehighcompouns.com)
- **PekCura Labs** = pekcuralabs.com (Pass 2 confirmed)
- **Prime Sciences** = prime-sciences.com (Pass 2 confirmed; Scottsdale AZ; FDA letter 721805-03312026)
- **Gram Peptides** = grampeptides.com (Pass 2 confirmed; Rancho Santa Fe CA)
- **FormPour** = ebay.com/str/formpour (eBay store only; Canton MI)
- **Fantasy Face / Guangzhou Huli** = ebay.com/str/fantasyface (eBay store only; Chicago IL)
- **US Chem Labs** = uschemlabs.com (still resolves; GLP-1 listings removed post-letter; Bronx NY)
- **Synthetix / Helix Chemical Supply** = (original domain not extracted; helixresearchpeptides.net is a likely successor at "Premium Synthetic Peptides for Research" tagline)
- **Veronvy** = veronvy (no public site verified; "Elily Veronvy 40+" oral drops)
- **Nomida.biz** = nomida.biz (offered Semaglutide Kit + Tirzepatide Kit)
- **GLP-1 Solution** = glp1solution.store (FDA-cited compounder shell; distinct from glp1solutions.com which is education-only)
- **Pinnacle Professional Research** = pinnaclepeptides.com (Pinnacle Peptides retail brand was FDA target in Dec 2025)
- **MEDVi** = (telehealth platform; medvi.com likely)
- **24HrDoc** = 24hrdoc.com
- **Join Josie** = joinjosie.com
- **Better Health Labs / Measured** = joinmeasured.com (likely)

## C) Backlink graph for Tier 1 vendors

### Pure Rawz alternatives surfaced
- **AminoForge** — aminoforge.vegas (Henderson NV; ≥99% purity; HPLC + COA; 48-hour fulfillment)
- **Nova Life Peptides** — novalifepeptides.com (US-based; ISO 9001; March 2026 launch)
- **Amino USA** — already in Pass 1
- Limitless Biotech (Pass 1), Swiss Chems (Pass 1), Felix Chemical Supply (Pass 1) — reconfirmed

### Limitless Life Nootropics alternatives surfaced
- All recurring Tier 1 names; no net-new beyond Pass 2.

### Biotech Peptides alternatives surfaced
- **Iron Peak Peptides** — ironpeakpeptides.com (Maine; 28+ peptides; ≥99% purity)
- **Protide Health** — protidehealth.com (Top10 listicle host; itself promotes its own brand)
- Others reconfirm Pass 1

### Core Peptides alternatives surfaced
- **Adapt Peptides** — adaptpeptides.com (60-day Results-or-Refund; explicitly compares vs Core)
- Reconfirms Ascension, Swiss Chems, Limitless, Pure Rawz, ResearchChemical.com (all Pass 1)

### Swiss Chems alternatives surfaced
- **Iron Peak Peptides** — ironpeakpeptides.com (re-surfaced)
- **Orion Peptides** — orionpeptides.org (Pass 2 already; reconfirmed via Skool community link)
- Reconfirms Felix Chemical, NextChems, Chemyo, Particle Peptides, Pure Rawz, Science.bio, Amino Asylum, Umbrella Labs, Sports Tech Labs

### Backlink-graph net-new from these 5 queries
- **AminoForge** — aminoforge.vegas
- **Nova Life Peptides** — novalifepeptides.com
- **Iron Peak Peptides** — ironpeakpeptides.com
- **Adapt Peptides** — adaptpeptides.com (mentioned in Pass 1 cells but not as own row; confirmed retail vendor)
- **Protide Health** — protidehealth.com (also a Pass 1 listicle host but verified as own retail brand)
- **Cernum Biosciences** — cernumbiosciences.com (already in Pass 1)
- **Healthletic** — healthletic.io (already in Pass 2 search_deep)

## D) Telegram extension — no new public channels surfaced; Telegram remains gated/uncrawled.

## E) Trustpilot pagination (limited)
- Reconfirms Pass 2D vendors. No NET new vendors found via page=2 SERP probe (Trustpilot SERP capped per query).

## F) Reddit cached SERP — Reddit-blocked from SERP. No net-new from cache:reddit.com queries.

## G) UK / EU / Canada / Mexico / AU vendors confirmed
### UK research peptide vendors that ship internationally (or to USA)
- **UK Peptides** — uk-peptides.com (Pass 1; ships worldwide)
- **Bluewell Peptides** — bluewellpeptides.com (Pass 2; international tracked)
- **Tide Labs** — tidelabs.co.uk (Pass 2; UKAS HPLC; ISO 9001)
- **Peptides Lab UK** — peptideslabuk.com (Pass 2)
- **PharmaLabGlobal** — pharmalabglobal.com (Pass 1 nodes; UK + USA + worldwide; 99% purity)

### Canadian peptide vendors that ship to US
- **NCRP Canada** — ncrpcanada.com (Pass 2)
- **Amino Pure Canada** — aminopurecanada.ca (Pass 2)
- **Canada Peptide** — canadapeptide.com (Pass 2)
- **Luxara Labs** — luxaralabs.com (NET-NEW; Canadian B2B + research; tested COAs)
- **Durham Peptides** — durhampeptides.ca (NET-NEW; Ontario research peptide supplier; Janoshik tested)
- **Canada Peptide Labs** — canpeplabs.com (NET-NEW; premium research-grade)
- **Bio Basic** — biobasic.com (NET-NEW; Markham ON + Amherst NY USA office)

### EU / DACH peptide vendors
- **PeptidesDirect** — peptidesdirect.io (NET-NEW; Janoshik-verified; DHL premium EU)
- **Eurogentec** — eurogentec.com (NET-NEW B2B; Belgian CDMO; 1000+ catalog peptides; ISO 9001)
- **EU Peptide Guide** — eupeptideguide.com (NET-NEW aggregator; Particle Peptides reviewer)
- Pass 2 confirms: Particle Peptides, Baltic BioLabs, EuroPeptides DE, Peptanova, Iris Biotech

### Mexico
- **PharmaLabGlobal Mexico** — mexico.pharmalabglobal.com (Pass 2)
- **Exoma Peptides MX** — exomapeptides.mx (Pass 2)
- **Olympus Labs Peptides MX** — olympuslabspeptidesmx.com (Pass 2)
- **Direct Peptides MX** — mexico.direct-peptides.com (Pass 2)
- No new Pass 3 finds.

### Australia
- **Backup Peptides** — backuppeptides.com (NET-NEW; ships USA, CA, UK, AU, NZ; HPLC-tested; freeze-dried research peptides)
- **Aussie Peptides** — aussiepeptides.au (NET-NEW; HPLC-verified; AU domestic only)
- **Aussie Peptides .org** — aussiepeptides.org (NET-NEW; sister/copycat domain)
- **Australian Peptides .com** — australianpeptides.com (Pass 2 already)
- **Australian Peptides .org** — australianpeptides.org (NET-NEW; alternate domain)
- **Australia Research Peptides** — australiaresearchpeptides.com (NET-NEW)
- **Australian Research Peptides .com.au** — australianresearchpeptides.com.au (NET-NEW)
- **Prime Labs AU** — primelabsau.com (NET-NEW)

## Compounding-pharmacy / 503A/B specific (FDA citations + research peptide adjacencies)
- **Wells Pharmacy Network** — wellsrx.com (NET-NEW; Ocala FL; nationwide compounding)
- **Olympia Pharmaceuticals** — olympiapharmacy.com / olympiameds.com (NET-NEW; 503A+503B; Orlando FL; sermorelin/liraglutide/GHK-Cu)
- **Boothwyn Pharmacy** — boothwyn.com / boothwynapothecary.com (NET-NEW; FDA cited; Kennett Square PA; $1M fine + probation Pa state)
- **Apothecary Pharma** — apothecarypharma.com (NET-NEW; FDA cited; Boca Raton FL; sterile injectable + GLP-1)
- **GenoGenix** — genogenix.com (NET-NEW; FDA cited; produced 5-Amino-1MQ + NAD+; ceased July 2025)
- **Empower Pharmacy** — empowerpharmacy.com (NET-NEW; 503A+503B; tirzepatide/niacinamide compounded)
- **OSRX Pharmaceuticals** — osrxpharmaceuticals.com (NET-NEW; FDA cited; ophthalmic-focused)
- **Apollo Care** — (FDA cited; domain not surfaced)
- **Annovex Pharma** — annovex.com (NET-NEW; 503B outsourcer; FDA cited)
- **Compound Rx** — compoundrx.net (NET-NEW; sister/aggregator)
- **Wells Pharma Houston** — (FDA-cited 11/2025)
- **Carie Boyd Pharmaceuticals** — careboyd.com (NET-NEW; FDA cited 12/2024)
- **Staska Pharmaceuticals** — staskapharma.com (NET-NEW; FDA cited 5/2025)
- **Epicur Pharma / Stokes Healthcare** — epicurpharma.com (NET-NEW; FDA cited 4/2024)
- **Fagron Sterile Services** — fagronsterileservices.com (NET-NEW; FDA cited 12/2024)
- **MedisourceRx** — medisourcerx.com (NET-NEW; FDA cited 12/2025)
- **Nubratori Rx** — nubratorirx.com (NET-NEW; FDA cited 1/2025)
- **PQ Pharmacy** — pqpharmacy.com (NET-NEW; FDA cited 10/2025)
- **QuVa Pharma** — quvapharma.com (NET-NEW; FDA cited 1/2024)
- **RC Outsourcing** — (FDA-cited 3/2026)
- **Revive Rx Pharmacy** — reviverx.com (NET-NEW; FDA cited 9/2025)
- **Tailstorm Health / Medivant Health** — medivanthealth.com (Pass 2 confirmed)
- **Thrive Health Solutions** — thrivehealthsolutions.com (NET-NEW; FDA cited 2/2026)
- **Turbare Manufacturing** — turbare.com (NET-NEW; FDA cited 9/2025)
- **ProRx LLC** — prorxpharmacy.com (NET-NEW; FDA cited 3/2025)

### China-based DOJ indicted entities
- **Guangzhou Tengyue Chemical Co. Ltd.** — Pass 2 confirmed
- **Guangzhou Wanjiang Biotechnology Co. Ltd.** — Pass 2 confirmed
- **Capsulcn International** — Pass 2 confirmed

## Notes / blockers
- FDA Solr Index XLSX endpoint is the most reliable bulk-fetch surface for FDA enforcement data. Search-term-keyed; combining 5 search terms gave 255 unique companies, 163 peptide-relevant.
- Direct fetches of `fda.gov/inspections-compliance-enforcement-and-criminal-investigations/warning-letters/<slug>` consistently return 404 from the WebFetch sandbox. Search engine snippets + the XLSX index fields are the working extraction path.
- Trustpilot pagination beyond page=2 returns the same first-page SERP slice; Trustpilot's SERP cap is the bottleneck.
- Reddit r/Peptides wiki is fully blocked from any indexing route this session attempted.
- Telegram public channel SERP returned zero new vendor channels beyond Pass 1+2.
