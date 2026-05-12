---
fetched_at: 2026-05-06
source: aggregation of pass-1 surface fetches
inputs:
  - 03_raw_fetches/discovery_pass_1/surface_aggregators.md
  - 03_raw_fetches/discovery_pass_1/surface_reddit.md
  - 03_raw_fetches/discovery_pass_1/surface_forums.md
  - 03_raw_fetches/discovery_pass_1/surface_youtube_influencer.md
  - 03_raw_fetches/discovery_pass_1/surface_archive_telegram.md
output: 02_claude_code_outputs/vendor_universe_pass1.csv
---

# Pass 1 Vendor Aggregation Summary

## Counts

- **Total unique vendors (deduped, canonical names):** 600
- **Per-surface vendor counts:**
  - aggregators: 241
  - reddit: 62
  - forums: 244
  - youtube: 93
  - archive_telegram: 170
- **Pairwise surface intersections (vendors appearing in BOTH surfaces):**
  - aggregators AND reddit: 40
  - aggregators AND forums: 49
  - aggregators AND youtube: 32
  - aggregators AND archive_telegram: 51
  - reddit AND forums: 26
  - reddit AND youtube: 25
  - reddit AND archive_telegram: 38
  - forums AND youtube: 22
  - forums AND archive_telegram: 29
  - youtube AND archive_telegram: 35
- **Vendors present in ALL 5 surfaces:** 11
- **Tier distribution:**
  - Tier 1 (4+ surfaces): 25 vendors
  - Tier 2 (2-3 surfaces): 95 vendors
  - Tier 3 (1 surface only): 480 vendors

Notes on counts: Reddit count is conservative because subreddit wikis and the highest-signal threads were login-walled (see Coverage Gaps below); the true Reddit footprint is almost certainly higher and would lift many Tier 3 entries up. Forum count is inflated by VialTalk's 25-vendor directory and ProfessionalMuscle's full sponsor banner roster; many forum-tier-3 entries are sponsor banners rather than community-validated vendors.

## Tier-1 candidates (mentioned in 4+ surfaces)

Sorted by surface count desc, then alphabetically. Domains marked "unknown" mean no surface surfaced a clear public web frontend (Telegram-only or B2B-only).

Present in all 5 surfaces:
- Amino Asylum — aminoasylum.shop (raided 2025-06; successors Researchem + Amino Asylum LLC)
- BioLongevity Labs — biolongevitylabs.com (Jay Campbell co-founded)
- Biotech Peptides — biotechpeptides.com
- Core Peptides — corepeptides.com
- Felix Chemical Supply — felixchem.is
- GenX Bio — genx.bio
- Limitless Life Nootropics — limitlesslifenootropics.com (heavy multi-domain)
- Particle Peptides — particlepeptides.com (Slovakia/EU; ships US)
- Peptide Sciences — peptidesciences.com (defunct 2026-03)
- Pure Rawz — purerawz.co
- Swiss Chems — swisschems.is (FDA warning 2024-12)

Present in 4 surfaces:
- Apollo Peptide Sciences — apollopeptidesciences.com
- Ascension Peptides — ascensionpeptides.com
- Blue Sky Peptide — blueskypeptide.com
- Canlab Research — canlabresearch.com (Health Canada suspended)
- ELV Bioscience — elvbio.com
- Loti Labs — lotilabs.com
- Paradigm Peptides — paradigm-peptide.com (defunct 2025-12 guilty plea)
- Peptide Partners — peptide.partners
- Peptidology — peptidology.com
- Polaris Peptides — polarispeptides.com
- Qingdao Sigma Chemical — qsc-usa.com (5-domain China-B2B ecosystem)
- Skye Peptides — skyepeptides.com
- Verified Peptides — verifiedpeptides.com
- Wholesale Peptide — wholesalepeptide.com

## Tier-2 candidates (mentioned in 2-3 surfaces)

Sorted by surface count desc, then alphabetically.

3 surfaces:
- Astro Peptides (astropeptidesusa.com)
- Chemyo (chemyo.com)
- DeusChem (deuschem.com)
- Evolution Peptides (evolutionpeptides.com — flagged FAKE on iSARMS but still live)
- Glacier Aminos (glacieraminos.com)
- Healthgevity (healthgevity.com)
- Ion Peptide (ionpeptide.com)
- LVLUP Health (lvluphealth.com)
- Modern Aminos (modernaminos.eu)
- Nuscience Peptides (nusciencepeptides.com)
- Oasis Labs Peptides (myoasislabs.com)
- Patriot Peptides (patriotpeptides.com — 5-domain Patriot cluster)
- Peptide Crafters (peptidecrafters.com)
- Peptide Source forum (peptidesource.net)
- Peptide Warehouse (unknown)
- Pinnacle Peptides (pinnaclepeptides.com — FDA warning)
- Precision Peptides (precisionpeptidesusa.com)
- Prime Peptides (primepeptides.co — FDA warning)
- Pura Peptides (purapeptides.com)
- ResearchChemical.com (researchchemical.com)
- Royal Peptides (royal-peptides.com)
- Science.bio (science.bio — defunct 2026-01)
- Simple Peptide (simplepeptide.com)
- Sports Technology Labs (sportstechnologylabs.com)
- Suaway Lab Research (suaway.com)
- Triumphant Labs (triumphantlabs.com)
- UK Peptides (uk-peptides.com)
- Umbrella Labs (umbrellalabs.is — FDA warning)
- Xcel Peptides (xcelpeptides.com — FDA warning)

2 surfaces:
- Aavant Research (unknown)
- Adapt Peptides (adaptpeptides.com)
- All About Peptides (allaboutpeptides.com — aggregator)
- Alpha Labs (alphalabspeptidesusa.com)
- American Research Lab (americanresearchlab.com)
- Amino Club (aminoclub.com)
- Amino Lair (unknown)
- Amino USA (aminousa.com)
- Bulk Peptide Wholesale (bulkpeptidewholesale.com)
- Direct Peptides (directpeptides.com)
- Disguised Research (disguisedresearch.shop)
- Dragon Pharma (dragonpharmastore.com)
- Elite Research USA (eliteresearchusa.com)
- Eternal Peptides (unknown)
- GYC Peptides (unknown)
- Great Northern Peptides (greatnorthernpeptides.com)
- Growth Guys (growthguys.ca)
- Hangzhou Mandy Biotechnology (unknown)
- Hangzhou Youngpeptide Biotechnology (unknown)
- JEEP (unknown)
- KR Kerui Peptide HongKong (unknown)
- Laikang Biotechnology (unknown)
- Lipeptides (unknown)
- MIX Peptides (unknown)
- Marvel Peptide (marvel-peptide.com)
- NUPEPS Peptides (unknown)
- NextChems (nextchems.com)
- Noble Dragons (buy.nobledragons.com)
- Omegamino (omegamino.net)
- Orbitrex Peptides (orbitrexpeptide.is)
- Peak Wellness Peptides (unknown — cross-listed; possible duplicate of forum-only entry)
- Penguin Peptides (penguinpeptides.com)
- Pep-USA (kits4less.com)
- PepPal (peppal.app — aggregator)
- Peptaura (peptaura.com)
- Peptide Critic (peptidecritic.com — aggregator)
- Peptide Index (unknown — aggregator)
- Peptide Pros (peptidepros.net)
- Peptide Tech (peptide-tech.com)
- Peptide Worldwide (unknown)
- Pharma Grade Peptides (pharmagradepeptides.com)
- Phoenix Pharmaceuticals (phoenixpeptide.com)
- Pivot Labs (pivot-labs.com)
- Platinum Lion Peptides (platinumlionpeptides.com)
- Proven Peptides (provenpeptides.com — defunct pre-2020)
- Pure Peptide Labs (purelabpeptides.com)
- QST / Qingdao Saber Technology Pharma (unknown — flagged for cross-ref to QSC parent)
- QYC / Shanxi Qianyecao (unknown)
- Rasa Research (unknown)
- Receptorchems (receptorchems.com)
- SRY Lab (unknown)
- Shanghai ERP Biotechnology (unknown)
- Sigma Audley Inc (unknown — banned glp1forum)
- Southern Sarms (southernsarms.com)
- Steady Meds (unknown)
- SubQ Protocol (subqprotocol.com)
- Summit Research (summitresearch.com — FDA warning)
- Superior Peptides (superiorpeptide.com)
- Tailor Made Compounding (tailormadecompounding.com — guilty plea)
- The Peptide Haven (unknown)
- ThePeptideList (thepeptidelist.com — directory)
- Top Peptides (unknown)
- Tydes Peptides (tydespeptides.com)
- WBS / Shanghai Wibson (unknown)
- Wuhan Wansheng Biotechnology (unknown)
- ezPeps (unknown)

## Tier-3 candidates (mentioned in 1 surface only)

480 vendors. Full enumeration is in vendor_universe_pass1.csv (filter where surfaces_present_in contains exactly one comma-free token). Highlights of the Tier-3 sub-clusters:

- **Finnrick China B2B long-tail (~155 entries):** Huaian Hanyou Peptide, Zhengzhou Lanyun, Tianjin Ruiwang, Hunan GoodPeptides, Shandong Shengyuan, Shanghai JinBei Chemical, Yongkang Nuoao Trading, Wuhan Newtop Biotech, Tianjin Eleli, Shaanxi Dideu Medichem, etc. Most are raw-API manufacturers with English-language sites that ship US per the operator brief.
- **VialTalk full directory (25 entries):** American Aminos and Peptides, Ion Peptide, Peptide RUO LLC, RemedyX Labs, Glacier Aminos, ezPeps, Labsourced, TriVial BioWorks, ChoicePeps, Peptipura, Sunrise BioResearch, Direct Vision Labs, Peptinexia, Primal peptides, Guardian Metabolics, Primal King Peptides, Trulixir Peptides, TM Research, Triton Research Peptides, Avara, Peptide Papi, Aigil Research, Double R Labs, Rock Compounds LLC, Ramp Peptides — many appear ONLY on vialtalk.com so far.
- **Pass-1 archive_telegram domain harvest (~80 net-new):** Patriot Peptides cluster (5 domains), QSC ecosystem (5 domains), Glacier/Step One cluster, Polaris/Orbitrex/Trident multi-mirror sets, PeptideScores top-3 (Flawless/Glow/Mile High), the Discord-vendor cluster, Telegram-only China-direct (Phcoker, Factory Peptides, Wholesale Peptide Supplies, Atomic Peptides), and the Amino Asylum successor pair.
- **MESO-Rx + EliteFitness + ProfessionalMuscle sponsor banners:** Synthetek, Sciroxx, Sunrise Pharma, Ace Labs, Dragon Pharma, GenLabs, Pharma Q Labs, Clearsky Pharmacy, Geneza Pharmaceuticals, NapsGear, UGFreak, Domestic-Supply, US-Pharmacies.To, etc. — many are AAS-first with peptide cross-sell.
- **YouTube/influencer creator-brands:** Peptual (Gary Brecka), Blueprint (Bryan Johnson), Marek Health/Diagnostics (Derek MPMD), LVLUP Health (Kyal Van Der Leest), BioLongevity (Jay Campbell), the Natty+ Plus ecosystem (Coach Greg / Connor Murphy), Transcend Company (Mind Pump partner), Ways2Well (Joe Rogan endorsed).
- **Defunct / regulatory action vendors logged:** Peptide Sciences (defunct 2026-03), Science.bio (defunct 2026-01), Amino Asylum (raided 2025-06), Paradigm Peptides (guilty plea 2025-12), Tailor Made Compounding (guilty plea), Proven Peptides (defunct pre-2020), Canlab Research (Health Canada suspended), PuritySourceLabs (suspended Apr 2026). FDA warning recipients (2024-12 batch): Swiss Chems, Prime Peptides, Xcel Peptides, Summit Research, Pinnacle Peptides, Modern Peptides, Umbrella Labs.

## Coverage gaps observed in pass 1

Surfaces with hard auth/anti-bot blockers — vendor lists almost certainly understate the true universe:

1. **Reddit subreddit wikis** — `/r/Peptides/wiki/index`, `/r/Peptidesource/wiki/index`, and `/r/PeptideGuide/comments/12xx98d/rpeptideguide_approved_vendor_list/` all login-walled. The `r.jina.ai` proxy returns 403 with Reddit network-security message. These wikis almost certainly contain the canonical "approved sources" list with verbatim domains. Highest-priority gap.
2. **Reddit body content for high-signal threads** — `r/PeptideSupport /1rpq7lj/` (post-shutdown Top 10), `r/Biohack_Blueprint /1p5kfr2/` (Nov 2025 vendor spotlight), `r/PeptideProgress /1qwp647/` (Trusted Vendors) — title-only confirmation, body fetch blocked.
3. **Wayback Machine entirely blocked** — `web.archive.org` returns "Claude Code is unable to fetch from web.archive.org" for every URL including the CDX API. Lost: archived Peptide Sciences catalog, archived Science.bio catalog, archived Amino Asylum catalog, archived Proven Peptides catalog, archived thepeptidelist.com/where-to-buy 823+ provider directory.
4. **Forums returning 403/Cloudflare to direct fetch** — AnabolicMinds, Eroids sourcetalk pages, Steroidology, SteroidSourceTalk.cc, TMuscle.co.uk, UGBodyBuilding (ECONNREFUSED). Drove via search-engine cache; vendor names recovered but full thread bodies missed.
5. **Dead forum URLs** — anabolicsteroidforums.com (404), peptideunderground.com (ECONNREFUSED), promusclepharmaceuticals.net (ECONNREFUSED), musclegurus.com (under-construction WordPress placeholder).
6. **Telegram private invite-only / bot-mediated** — Stairway-to-Gray (STG) ecosystem, Peptide Research Group (PRG) bot onboarding, Moleculon Research Peptides — flagged but per task scope NOT infiltrated.
7. **Discord server contents not enumerated** — server descriptions logged from public listings (DISBOARD/top.gg/discadia partial 403); message-channel contents require joining and were not pulled per scope.
8. **YouTube watch-page descriptions not extractable** — WebFetch returns only YouTube footer chrome; vendor + code mappings recovered exclusively from search-snippet quotes of descriptions.
9. **Linktree pages 403** — Derek MPMD's linktr.ee 403; could not enumerate full creator discount-code list.
10. **DuckDuckGo HTML CAPTCHA after ~5-10 queries; Brave search 429 after ~3-4 queries** — limits SERP-based vendor harvesting throughput.
11. **Multiple aggregator sites 403** — peptidecritic.com, peptidedeck.com, crowncounseling.com, glp1forum.com (thread bodies), top.gg/tag pages, disboard.org, stairwaytogray.com, peptidescores.com partial, peptidedossier.com — each potentially contains net-new vendor data not yet captured.
12. **TikTok deep handle profiling deferred** — Nathan Baarss, Misha Tsoi, Clavicular, Noah Jay, garybreckaofficial named in news coverage but description/code harvest not yet completed; this surface overlaps the YouTube/influencer remit and was deferred.

Subreddits explicitly checked but yielding no peptide-vendor signal: r/SARMSSourceTalk (low-traffic), r/Steroids/r/SteroidSourceTalk (AAS-focused), r/Roids, r/MoreNutrition (German), r/Looksmaxxing/r/AlphaMaxxing/r/Mewing/r/HardMaxxing/r/Mogging/r/jestermaxxing (anecdotal mentions, no vendor lists), r/Truerateme, r/Longevity (clinical-only), r/PeptideStacks (does not appear to exist), r/PeptidesForSale (named in primary target list but no SERP — possibly deleted/banned).

Forum sites with low or no peptide-vendor signal: AnabolicLab forums (no peptide forum index), Biohacker.io community (only blog posts), Longevitynews.com (clinics not forum).

## Pass 2 recommendations

Concrete next-pass actions, prioritized:

1. **Reddit-authenticated retrieval pass.** Fetch with valid Reddit OAuth/session: `/r/Peptides/wiki/index`, `/r/Peptidesource/wiki/index`, `/r/PeptideGuide/comments/12xx98d/`, `/r/PeptideSupport/comments/1rpq7lj/`, `/r/Biohack_Blueprint/comments/1p5kfr2/`, `/r/PeptideProgress/comments/1qwp647/`. Will likely surface 30-80 net-new domains and verify Tier-1 community-approved vendor lists.
2. **Wayback bypass pass.** Run agent with `curl` / `wget` / direct http2 client (no WebFetch domain restriction) against `https://web.archive.org/web/*/peptidesciences.com/*`, `https://web.archive.org/web/*/science.bio/*`, `https://web.archive.org/web/*/aminoasylum.com/*`, `https://web.archive.org/web/*/provenpeptides.com/*`, `https://web.archive.org/web/*/thepeptidelist.com/where-to-buy`, plus CDX API for `https://web.archive.org/cdx/search/cdx?url=finnrick.com/vendors&output=json`. Recovers archived catalog snapshots with verbatim product/vendor lists.
3. **YouTube Data API v3 (or yt-dlp) pull.** Use `videos.list?part=snippet,description` for every video URL listed in surface_youtube_influencer.md to extract full descriptions. Specifically target Vigorous Steve / Derek MPMD / Connor Murphy / Greg Doucette / Jay Campbell / Ben Greenfield / The Peptide Guy / Peptide Critic videos. Will resolve most "(URL TBD)" / "(inferred)" markers.
4. **Forum-cache deep crawl with Cloudflare-friendly client.** Use a residential-proxy or session-warmed browser to fetch AnabolicMinds, Eroids sourcetalk, Steroidology, SteroidSourceTalk.cc, TMuscle, UGBodyBuilding thread bodies. Each likely 5-15 net-new vendor names beyond what cache surfaced.
5. **Targeted curl fetches** for known-blocked URLs:
   - `curl -H 'User-Agent: Mozilla/5.0' https://www.thepeptidelist.com/where-to-buy` (823+ provider directory)
   - `curl https://peptidedeck.com/blog/best-legit-peptide-vendors-2026`
   - `curl https://peptidecritic.com/`
   - `curl https://peptidedossier.com/guides/peptide-sciences-shutdown/`
   - `curl https://peptideals.com/` (vendor coupon directory)
   - `curl https://thepeptideindex.org/vendors/` (full vendor index)
   - `curl https://thepeptidereport.com/` (review-blog index)
6. **Search queries to run in pass 2:**
   - `site:reddit.com "approved vendor" peptide` (cached SERP)
   - `site:reddit.com "tested by Janoshik" peptide`
   - `site:reddit.com r/Peptidesource "trusted source"`
   - `site:trustpilot.com peptide review`
   - `"peptide vendor" "FDA warning letter" 2024..2026`
   - `site:fda.gov warning letter peptide`
   - `site:reddit.com "shut down" "peptide sciences" alternative`
   - `"Janoshik testing" peptide site:thinksteroids.com OR site:elitefitness.com OR site:glp1forum.com`
   - `site:eroids.com sourcetalk peptide` (full slug enumeration — ~30 more slugs likely)
   - `inurl:peptide-review` (cross-aggregator long tail)
   - `"buy peptides" site:.is OR site:.to OR site:.ru OR site:.cc` (jurisdiction-flag domains)
7. **Domain WHOIS / registrar dedup pass** for the multi-domain clusters: Patriot {peptides,pep,peptide,researchlabs,chems}, Limitless {lifenootropics,biotech.us,biotech.mx,lifepeptides,peptides}, QSC {qsc-usa,qscpeptidelab,qscpeptide,qingdaosigmachem,qsc-peptides}, Polaris {peptides,peptidesusa,polaris-peptide,peptidez}, Orbitrex {peptide.is, peptideslab, speptide, peptidesco, peptides}, Trident {peptides,tridentpeptides,tridentpeptide,tridentpeptidesuk}, Alpha Labs {alphalabspeptidesusa, goalphalabs, livealphalabs, alphabiomedlabs}, ResearchChemHQ {.co,.com,.net, rchq.info}, Swiss Chems {.is,.com,.co,-us,labs}, Pure Rawz {.co,.com}, Loti Labs {.com,.shop}, Glacier Aminos {.com,.shop, gblpeptides}, Limitless successor pair (Researchem at aminoasylum.us + Amino Asylum LLC at aminoasylum-llc.com), Patriot triple, Deus {chem,buydeus,medical}, Felix {chem.is, chempeptides}. Confirm same-operator vs imitator-cluster status before vendor-tier scoring.
8. **TikTok pass** for handles named in the YouTube/influencer surface but not yet profiled: @nathanbaarss, Misha Tsoi, Clavicular, @noahjay, @garybreckaofficial — extract bio links + video description discount codes. Likely surfaces 5-15 looksmaxxing-targeted vendors not yet seen.
9. **Trustpilot enumeration pass** — `site:trustpilot.com inurl:review/ peptide` will surface dozens of vendor profiles with review counts; cross-ref with this CSV to identify single-mention obscure vendors that are in fact mid-volume operators.
10. **Telegram pass 2** — fetch `t.me/s/<channel>` for any new channels that show up in pass-1 search snippets but were not yet pulled (Beyond Peptides, Wholesale Peptides UK linktree retry via different IP, plus any new channels surfaced from Discord listings).
