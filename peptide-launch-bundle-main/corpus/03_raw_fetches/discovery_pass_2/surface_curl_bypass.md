---
fetched_at: 2026-05-06
fetch_method: curl + wget bash
surface: pass2a-curl-bypass
---

# Pass 2A — Curl/Wget Bypass of Blocked URLs

## Successful fetches

All raw HTML/JSON artifacts saved at `/mnt/c/Users/endeg/Documents/peptide-research/peptide-research_cli/03_raw_fetches/discovery_pass_2/raw/`.

| Target URL | Tool | Status | Bytes | Artifact | Vendors harvested |
|---|---|---|---|---|---|
| https://thepeptidelist.com/where-to-buy | wget | 200 | 375,988 | `live_thepeptidelist_wget.html` | 0 (server-rendered shell only; vendor data is React-hydrated) |
| https://thepeptidelist.com/ | wget | 200 | 88,270 | `live_thepeptidelist_home_wget.html` | 0 (homepage now sells DNA kit) |
| https://thepeptidelist.com/reviews | wget | 200 | 454,648 | `tpl_reviews.html` | **62 vendor slugs** |
| https://thepeptidelist.com/providers | wget | 200 | 229,921 | `tpl_providers.html` | 21 (clinics/MDs, not retail vendors) |
| https://thepeptidelist.com/where-to-buy/bpc-157 | wget | 200 | 121,728 | `tpl_wtb_bpc157.html` | 0 ("0 verified vendors" message) |
| https://peptidecritic.com/ | wget | 200 | 122,619 | `live_peptidecritic_wget.html` | 5 in homepage (Genpeptide, Mile High Compounds, EZ Peptides, Instant Peptides, Southern Aminos) |
| https://peptidecritic.com/vendor-directory | wget | 200 | 383,589 | `live_peptidecritic_directory.html` | **100 vendor slugs** ("Showing 100 vendors" — site cap) |
| https://peptidedeck.com/blog/best-legit-peptide-vendors-2026 | curl | 200 | 185,650 | `live_peptidedeck_2026.html` | 1 (Ascension Peptides — entire article promotes one vendor) |
| https://peptidedossier.com/guides/peptide-sciences-shutdown/ | curl | 200 | 114,198 | `live_peptidedossier_psci.html` | 0 unique grey-market (article is about FDA shutdown + Hims) |
| https://www.peptidedossier.com/ | curl | 200 | 219,754 | `live_peptidedossier_home.html` | 0 (peptide encyclopedia, not vendor list) |
| https://peptideals.com/ | curl | 200 | 1,879,840 | `live_peptideals_home.html` | **34 vendor slugs** via `/vendors/<slug>` URLs |
| https://thepeptideindex.org/vendors/ | curl | 200 | 158,041 | `live_thepeptideindex_v.html` | **34 vendor h2/h3 names** (no outbound URLs — internal only) |
| https://thepeptidereport.com/ | curl | 200 | 572,456 | `live_thepeptidereport.html` | 0 (peptide-protocol blog, not vendor index) |
| https://peptidescores.com/ | curl | 200 | 328,119 | `live_peptidescores_home.html` | **15 vendor slugs** via `/vendor/<slug>` URLs |
| https://www.peppal.app/blog/best-grey-market-peptide-supplier | curl | 200 | 489,470 | `live_peppal_grey.html` | 13 brand mentions (Peptide Partners, Pivot Labs, Orbitrex, Paradigm, Peptide Tech, Limitless Life, Core Peptides, Biotech Peptides, Polaris, Nuscience, Skye, **Peptaura**, **Aavant Research**) |
| https://crowncounseling.com/best-peptide-vendors/ | curl | 200 | 190,450 | `live_crowncounseling_v.html` | 0 — page is 404 (Crown Counseling is a Brooklyn therapy clinic, not a peptide blog) |
| https://www.crowncounseling.com/ | curl | 200 | 539,841 | `live_crowncounseling_home.html` | 0 — therapy clinic |
| https://web.archive.org/web/2025/https://www.finnrick.com/vendors | curl | 200 | 805,467 | `wb_finnrick_2025.html` | **140 vendor slugs** via `/vendors/<slug>` URLs |
| https://web.archive.org/web/2024/https://www.finnrick.com/vendors | curl | 200 | 278,662 | `wb_finnrick_2024.html` | 42 vendor slugs (subset of 2025) |
| https://web.archive.org/web/2025/https://peptidesciences.com/ | curl | 200 | 769,531 | `wb_peptidesciences_2025.html` | 0 (own product catalog — no competitor mentions) |
| https://web.archive.org/web/2025/https://science.bio/ | curl | 200 | 859,187 | `wb_sciencebio_2025.html` | 0 (own catalog — no competitor mentions) |
| https://web.archive.org/web/2025/https://www.aminoasylum.com/ | curl | 200 | 13,009 | `wb_aminoasylum_2025.html` | 0 (own catalog) |
| https://web.archive.org/cdx/search/cdx?url=peptidesciences.com&limit=10 | curl | 200 | 1,224 | `wb_cdx_text.txt` | confirms peptidesciences.com archived since 2011-02-07 |
| https://www.eroids.com/sourcetalk/ | wget | 200 | 94,859 | `forum_eroids_wget.html` | 43 source domains, 3 peptide-relevant (powerpeptides.top, blueskypeptide.com, kits4less.com) |
| https://www.steroidsourcetalk.cc/ | curl | 200 | 120,644 | `forum_sst_root.html` | 1 inline mention (Growth Guys / growthguys.is); peptide subforum is empty (US Domestic = "no threads") |
| https://www.steroidsourcetalk.cc/index.php?forums/human-growth-hormone-insulin-and-peptides.40/ | wget | 200 | 146,965 | `forum_sst_peptide_general.html` | 0 (forum titles only; no source URLs visible without login) |

## Vendor candidates net-new vs Pass 1

63 candidates not present in Pass 1's 600-vendor universe. Sorted alphabetically.

- **Alpha Labs Peptides** — alpha-labs-peptides — https://thepeptidelist.com/reviews/alpha-labs-peptides — surfaced via: thepeptidelist /reviews
- **Alpha Omega Peptide** — alpha-omega-peptide — https://peptidecritic.com/vendor/alpha-omega-peptide — surfaced via: peptidecritic vendor directory
- **Alpha Peptides** — alpha-peptides — https://peptidecritic.com/vendor/alpha-peptides — surfaced via: peptidecritic + thepeptidelist /reviews
- **Apex Amino** — apex-amino — https://peptidecritic.com/vendor/apex-amino — surfaced via: peptidecritic
- **Arctic Peptides** — arctic-peptides — https://thepeptidelist.com/reviews/arctic-peptides — surfaced via: thepeptidelist /reviews
- **Atomix Research** — atomix-research — https://peptidecritic.com/vendor/atomix-research — surfaced via: peptidecritic
- **Biocollex** — biocollex — https://peptidecritic.com/vendor/biocollex — surfaced via: peptidecritic + thepeptidelist /reviews
- **Canada Peptides** — canada-peptides — https://thepeptidelist.com/reviews/canada-peptides — surfaced via: thepeptidelist /reviews
- **Crush Research** — crush-research — https://peptidecritic.com/vendor/crush-research — surfaced via: peptidecritic
- **Elevated Peptides** — elevated-peptides — https://peptidecritic.com/vendor/elevated-peptides — surfaced via: peptidecritic
- **Elite Biogenix** — elite-biogenix — https://peptidecritic.com/vendor/elite-biogenix — surfaced via: peptidecritic + thepeptideindex
- **Enhanced Peptides** — enhanced-peptides — https://thepeptidelist.com/reviews/enhanced-peptides — surfaced via: thepeptideindex + thepeptidelist /reviews
- **Evolve Peptides** — evolve-peptides — https://thepeptidelist.com/reviews/evolve-peptides — surfaced via: thepeptidelist /reviews
- **Full Scale Peptides** — full-scale-peptides — https://peptidecritic.com/vendor/full-scale-peptides — surfaced via: peptidecritic
- **Genesis Peptides** — genesis-peptides — https://peptidecritic.com/vendor/genesis-peptides — surfaced via: peptidecritic
- **Genpeptide** — genpeptide — https://peptidecritic.com/vendor/genpeptide — surfaced via: peptidecritic (featured "Premium" vendor)
- **Half Nattys** — half-nattys — https://peptidecritic.com/vendor/half-nattys — surfaced via: peptidecritic
- **Hangzhou Youngpeptide Biotechnology (HYB)** — hangzhou-youngpeptide-biotechnology-hyb — https://www.finnrick.com/vendors/hangzhou-youngpeptide-biotechnology-hyb — surfaced via: finnrick wayback 2025 (Chinese mfg)
- **HM Peptide** — hm-peptide — https://thepeptidelist.com/reviews/hm-peptide — surfaced via: thepeptidelist /reviews
- **Instant Peptides** — instant-peptides — https://peptidecritic.com/vendor/instant-peptides — surfaced via: peptidecritic
- **Ion Peptides** — ion-peptides — https://peptidecritic.com/vendor/ion-peptides — surfaced via: peptidecritic + peptidescores
- **JH Biosciences** — jh-biosciences — https://peptideals.com/vendors/jh-biosciences — surfaced via: peptideals
- **Main Peptides** — main-peptides — https://peptidecritic.com/vendor/main-peptides — surfaced via: peptidecritic
- **Midwest Peptide** — midwest-peptide — https://peptidecritic.com/vendor/midwest-peptide — surfaced via: peptidecritic
- **Molecular Edge Peptides** — molecular-edge-peptides — https://peptidecritic.com/vendor/molecular-edge-peptides — surfaced via: peptidecritic
- **Nantong Guangyuan Chemical (GYC)** — nantong-guangyuan-chemical-gyc — https://www.finnrick.com/vendors/nantong-guangyuan-chemical-gyc — surfaced via: finnrick wayback 2025 (Chinese mfg)
- **Narrows Labs** — narrows-labs — https://thepeptidelist.com/reviews/narrows-labs — surfaced via: thepeptidelist /reviews
- **NextGenPeps** — nextgenpeps — https://peptidecritic.com/vendor/nextgenpeps — surfaced via: peptidecritic
- **NexxGen Peptides** — nexxgen-peptides — https://peptidecritic.com/vendor/nexxgen-peptides — surfaced via: peptidecritic
- **Nootropic Source** — nootropic-source — https://peptidecritic.com/vendor/nootropic-source — surfaced via: peptidecritic + thepeptideindex
- **Nura Peptide** — nura-peptide — https://peptidecritic.com/vendor/nura-peptide — surfaced via: peptidecritic
- **Nutrycore** — nutrycore — https://peptidecritic.com/vendor/nutrycore — surfaced via: peptidecritic
- **OneDay Compounds** — oneday-compounds — https://peptidecritic.com/vendor/oneday-compounds — surfaced via: peptidecritic
- **Oros Research** — oros-research — https://peptidecritic.com/vendor/oros-research — surfaced via: peptidecritic
- **Panda Peptides** — panda-peptides — https://peptidecritic.com/vendor/panda-peptides — surfaced via: peptidecritic
- **Peptide Giants** — peptide-giants — https://peptideals.com/vendors/peptide-giants — surfaced via: peptideals
- **PeptidePure** — peptidepure — https://thepeptideindex.org/vendors/ — surfaced via: thepeptideindex
- **Peptides Sale** — peptides-sale — https://peptidecritic.com/vendor/peptides-sale — surfaced via: peptidecritic
- **Peptides World** — peptides-world — https://peptidecritic.com/vendor/peptides-world — surfaced via: peptidecritic
- **Peptira** — peptira — https://peptidecritic.com/vendor/peptira — surfaced via: peptidecritic
- **PepVida Labs** — pepvida-labs — https://peptidecritic.com/vendor/pepvida-labs — surfaced via: peptidecritic
- **PharmaGrade Store** — pharmagrade-store — https://thepeptideindex.org/vendors/ — surfaced via: thepeptideindex
- **Platinum Lion** — platinum-lion — https://peptideals.com/vendors/platinum-lion — surfaced via: peptideals
- **Pro Labs Research** — pro-labs-research — https://peptidecritic.com/vendor/pro-labs-research — surfaced via: peptidecritic
- **Profound Aminos** — profound-aminos — https://peptidecritic.com/vendor/profound-aminos — surfaced via: peptidecritic
- **Puratek** — puratek — https://peptideals.com/vendors/puratek — surfaced via: peptideals
- **Pure Health Peptides** — pure-health-peptides — https://peptidecritic.com/vendor/pure-health-peptides — surfaced via: peptidecritic
- **Pure Peptides Bio** — pure-peptides-bio — https://peptidecritic.com/vendor/pure-peptides-bio — surfaced via: peptidecritic
- **Qing Li Peptide** — qing-li-peptide — https://www.finnrick.com/vendors/qing-li-peptide — surfaced via: finnrick wayback 2025 (Chinese mfg)
- **Qingdao Saber Technology Pharma (QST)** — qingdao-saber-technology-pharma-qst — https://www.finnrick.com/vendors/qingdao-saber-technology-pharma-qst — surfaced via: finnrick wayback 2025 (Chinese mfg)
- **Qingdao Sigma Chemical (QSC)** — quingdao-sigma-chemical-qsc — https://www.finnrick.com/vendors/quingdao-sigma-chemical-qsc — surfaced via: finnrick wayback 2025 (Chinese mfg)
- **Raw Amino** — raw-amino — https://peptidecritic.com/vendor/raw-amino — surfaced via: peptidecritic
- **RCS Research** — rcs-research — https://peptidecritic.com/vendor/rcs-research — surfaced via: peptidecritic
- **Research Chem** — research-chem — https://peptideals.com/vendors/research-chem — surfaced via: peptideals
- **Research Peptides** — research-peptides — https://thepeptidelist.com/reviews/research-peptides — surfaced via: thepeptidelist /reviews
- **Shanghai Wibson Biotechnology (WBS)** — shanghai-wibson-biotechnology-wbs — https://www.finnrick.com/vendors/shanghai-wibson-biotechnology-wbs — surfaced via: finnrick wayback 2025 (Chinese mfg)
- **Simple Peptides** — simple-peptides — https://thepeptidelist.com/reviews/simple-peptides — surfaced via: thepeptidelist /reviews (note: pass1 has "Simple Peptide" singular; this is plural-spelling variant)
- **Strate Labs** — strate-labs — https://thepeptidelist.com/reviews/strate-labs — surfaced via: thepeptidelist /reviews
- **Swole AF Labs** — swole-af-labs — https://thepeptidelist.com/reviews/swole-af-labs — surfaced via: thepeptidelist /reviews
- **Top Peptide** — top-peptide — https://www.finnrick.com/vendors/top-peptide — surfaced via: finnrick wayback 2025
- **Validated Peptides** — validated-peptides — https://peptidecritic.com/vendor/validated-peptides — surfaced via: peptidecritic
- **Warrior Makers** — warrior-makers — https://thepeptideindex.org/vendors/ — surfaced via: thepeptideindex
- **Welli Labs** — welli-labs — https://peptidecritic.com/vendor/welli-labs — surfaced via: peptidecritic

## Vendor candidates re-confirmed (already in Pass 1)

216 candidates from the harvested aggregator/forum/Wayback surfaces matched Pass 1's 600-vendor universe. Distribution by surface (a vendor can appear in multiple):

- finnrick wayback 2025: 133 reconfirmed
- peptidecritic directory: 63 reconfirmed
- thepeptidelist /reviews: 49 reconfirmed
- peptideals home: 29 reconfirmed
- thepeptideindex /vendors: 28 reconfirmed
- peptidescores home: 14 reconfirmed
- peppal grey-market article: 13 reconfirmed
- eroids sourcetalk (peptide-relevant): 3 reconfirmed (Power Peptides, Blue Sky Peptide, Kits4Less)

Notable Pass-1-confirmed vendors that surfaced multiple times across Pass 2 surfaces (cross-corroborated):
- **Core Peptides** (5 surfaces: peppal, peptidecritic, peptidescores, thepeptideindex, thepeptidelist)
- **Biotech Peptides** (4 surfaces)
- **Blue Sky Peptide** (4 surfaces)
- **Direct Peptides** (4 surfaces)
- **Atomik Labz, Eternal Peptides, Pure Rawz, Swiss Chems, Limitless Life Nootropics, Paradigm Peptides** (3-4 surfaces each)

Full reconfirm list saved at `/tmp/dedup/pass2_results.json` (`reconfirm[]`).

## Failed fetches

| Target URL | Status / Error | Notes |
|---|---|---|
| https://web.archive.org/web/2025/https://thepeptidelist.com/where-to-buy | 404 | thepeptidelist.com has zero Wayback archives — confirmed via timemap (`[]`) and "The Wayback Machine has not archived that URL" message. All four Wayback years (2022/23/24/25) returned the same 151,560-byte 404 page. |
| https://web.archive.org/web/2024/https://www.provenpeptides.com/ | 403 (9 bytes "Forbidden") | Wayback rate-limit / domain block on this specific snapshot |
| https://web.archive.org/cdx/search/cdx?url=...&output=json | 503 (intermittent) | First two calls returned 503; eventually succeeded for `peptidesciences.com&limit=10` (text format). JSON output flag combined with rate-limit. |
| https://peptidecritic.com/peptide-vendors/ | 403 via curl, FAIL via wget | URL slug doesn't exist; peptidecritic uses `/vendor-directory` instead (200 OK with wget) |
| https://peptidecritic.com/best-peptides-vendors/ | 403 / FAIL | Same — URL slug not present on the site |
| https://anabolicminds.com/forums/peptides.117/ | 403 (curl), 0 bytes (wget) | Cloudflare blocks both curl and wget UAs; no anti-bot bypass attempted per directive |
| https://www.steroidsourcetalk.cc/peptides/ | 404 | Wrong slug — actual peptide subforum is `/index.php?forums/human-growth-hormone-insulin-and-peptides.40/` (200 OK) but vendor names hidden behind login (XenForo) |
| https://crowncounseling.com/best-peptide-vendors/ | 200 but page-not-found body | Crown Counseling is a Brooklyn therapy clinic, not a peptide vendor blog. URL was a misdirect; their homepage confirms therapy/teletherapy services only. |
| Wayback CDX with limit=20-50 | 503 | API rate-limited under repeated calls; smaller `limit=10` text-format eventually returned 200 |

## Notes / blockers

- **wget vs curl: different network fingerprints.** Several sites that returned 403 to curl returned 200 to wget — most notably thepeptidelist.com, peptidecritic.com, eroids.com. wget's HTTP/1.1 default and absence of TLS ALPN may pass simple Cloudflare WAF rules that flag curl's TLS handshake. Both tools used identical UA strings, so the differentiator is at a lower layer. This is UA-spoofing equivalent (allowed) — not cookie/captcha bypass.
- **thepeptidelist.com has zero Wayback Machine captures.** Confirmed via timemap returning `[]`. The site is younger than 2022 or its `robots.txt` excludes archive bots. CDX confirms.
- **thepeptidelist /where-to-buy and product pages are React-hydrated** — the server renders only the navigation shell + peptide categories. Vendor names ("2145+ Vendors" claim) are loaded client-side from `/api/v2/providers/export` which returns JSON but is presumably auth-gated (returned 0 bytes on direct fetch). The /reviews page is the *only* server-rendered surface that exposes vendor slugs (62 of them).
- **peptidecritic.com hard-caps vendor directory at 100** — pagination params (`?page=N`, `?items=N`, `/2`) all return the same 100-vendor alphabetical slice ending at "welli-labs". The site advertises "50+ Vendors Reviewed" but rendered listing is 100. There may be ~zero vendors after letter W in their directory, or the site is intentionally capping.
- **peptideals.com is high-value** — 34 vendor logos under `/vendor-logos/` and 34 unique `/vendors/<slug>` URLs cross-referenced with peptide product params. Several net-new finds (Peptide Giants, Platinum Lion, JH Biosciences, Puratek, Research Chem) are exclusive to this surface.
- **finnrick.com (defunct/Wayback only) is the largest single source** — 140 vendor slugs from the Jan 2026 snapshot, including 30+ Chinese manufacturer codes (Hangzhou Youngpeptide, Nantong Guangyuan, Qingdao Saber, Shanghai Wibson, etc.) that are not retail brands. Pass 1 already has the major US/EU retailers, so finnrick mostly reconfirmed (133 hits) but added the Chinese mfg layer.
- **peppal.app's grey-market 2026 article reveals two notable inline brands** that are NOT in their h2/h3: **Peptaura** (international Chinese marketplace platform) and **Aavant Research** (BPC-157 vendor cited as Finnrick category leader). Aavant is already in Pass 1; Peptaura is in Pass 1 mirror domains.
- **eroids.com source-talk has 43 active source domains**, but only 3 are explicitly peptide-flagged (Power Peptides at powerpeptides.top, Blue Sky Peptide at blueskypeptide.com, Kits4Less). The remaining ~40 are AAS/HGH-focused (titans.to, osgear.to, napsgear.org, dragonpharma.net, etc.) — adjacent but out-of-scope for peptide-only research.
- **Forum vendor extraction from logged-in subforums is impossible without auth.** SST, eroids /sources/, anabolicminds all gate the actual source-list threads. The /sourcetalk root page on eroids does expose 43 domain names in recent activity feed (current data), so that surface is partially harvestable.
- **Peptidecritic blog post mentions Modern Aminos in shutdown context** — confirming Pass 1 entry, no new vendor surfaced.
- **No anti-bot/captcha bypass attempted.** UA spoofing only. Cookie injection, TLS fingerprint spoofing, and JS-execution were all skipped per directive.

Raw artifacts directory listing: 365 files at `/mnt/c/Users/endeg/Documents/peptide-research/peptide-research_cli/03_raw_fetches/discovery_pass_2/raw/` (includes Pass 1 carry-overs from earlier runs; this Pass 2A added ~30 new HTML/JSON files).
