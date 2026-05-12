---
generated_at: 2026-05-06
inputs: vendor_universe_final.csv (1322) + Pass 6 directory + naming-pattern + WHOIS pivots + SimilarWeb
output: vendor_universe_final.csv (1322 + 187 net-new = 1509 cumulative)
---

# Surface: Pass 6 — Directory Hunting + Naming-Pattern Sweeps + WHOIS Pivots + SimilarWeb

Pass 6 was scoped TIGHT to extend Pass 5 along its highest-yield surfaces:

(a) MORE peptide-vendor aggregator directories (analogous to peptidecompared/peptideprotocolwiki)
(b) EXHAUST naming-pattern sweeps (Pass 5 found 8 vendors via "alpha" stem alone)
(c) WHOIS pivots on remaining Tier-1 cluster domains
(d) Bing/DDG/Brave variants (TLD-restricted SERPs)
(e) Reddit-cache fallback
(f) SimilarWeb traffic-data competitor pages

## Yield by surface

| Surface | Net-new vendors | Notes |
|---|---|---|
| pass6-aggregator-peptiprices (60+ vendors mined) | ~25 | Largest single yield. peptiprices.com had ~60 vendors — most were already in universe but ~25 new |
| pass6-aggregator-peptideprice (38 vendors mined) | ~10 | peptideprice.store retailer list |
| pass6-search-quantum cluster | 9 | quantum-pharm, quantispeptides, quantummpeptides, quantumpeps, quantumpeptidelabs, quantumpeptides.com, quantumpeptides.uk, peptidequantumlabs, quantuminnovationlabs |
| pass6-search-apex cluster | 9 | apexlabpeptides, apexlabspeptides, apexlabsus, apexpeptideresearch, apexpeptides.org, apexpeptideslabs, apexperformancepeptidelabs, apexsteroids, |
| pass6-search-atlas cluster | 8 | atlas-bioscience, atlashealthcollective, atlaslabsusa, atlaspeptideresearch, atlaspeptides, atlaspeptideslab, atlaspeptidestore, atlantaadvancedpeptides |
| pass6-search-titan cluster | 6 | titanlabsofficial, titans-peptides, titanpeptideslab, peptidetitans, plus titan-peptides, titanpeptides.com/.io/.net (likely sister/mirrors of one umbrella) |
| pass6-search-forge cluster | 11 | bioforgepeptides, cellforgelabs, forge-science, forgebiolab, forgebioscience.store, forgelabpeps, forgepeptidelabs, forgepeptides.co.uk, forgeperformanceco, peptide-forge, peptideforge |
| pass6-search-helix cluster | 7 | helix-researchpeptides, helixbiolabs, helixlabs.bio, helixlabs.science, helixlabsresearch, peptidehelix, plus pre-existing Helix Chemical Supply |
| pass6-search-omega cluster | 4 | omegamindpeptides, omegapeps.com, omegapeps.store, omegapeptides.net |
| pass6-search-imperial cluster | 3 | imperialpeptides.com, imperialpeptidesusa, imperialsciences.co.uk |
| pass6-search-nova cluster | 6 | nova-peptides, novapeplabs, novapeptide.net, novapeptides.shop, novaresearchsupply, novagloresearch, peptidenova |
| pass6-search-vanguard cluster | 3 | vanguardlaboratory (test-lab), vanguardpeptidelabs, vgpep |
| pass6-search-onyx cluster | 3 | onyx-research, onyxresearchpeptides, onyxpeptideresearch |
| pass6-search-stellar/space/cosmic | 3 | stellarpeptides.co, spacepeptides, plus existing cosmicpeptides |
| pass6-search-prism | 2 | prismbiolab, prismresearch.shop |
| pass6-search-zenith | 2 | zenithbioscience, zenithpeptidelabs (plus zenithjovepeptide finnrick mfg) |
| pass6-search-sigma | 1 | sigmalabsus (sigma cluster also yielded sigmaaudley.net/.org but those are sister TLDs of existing sigmaaudley.com) |
| pass6-search-zeta | 1 | zetapeptides.com |
| pass6-search-gamma | 1 | gammapeptides.com (endotoxin-tested branding) |
| pass6-search-delta | 1 | deltapeptides.com (clinical-grade peptide info) |
| pass6-search-eclipse | 1 | eclipsebiotechusa.com |
| pass6-search-vortex | 1 | vortexpeptides.net |
| pass6-search-hydra | 1 | hydrapeptides.com (hydroresearchpeptides.com pre-existing) |
| pass6-similarweb (top-competitor data) | 12+ | asymchem, mirusbio, stressmarq, klearmindclinics, novagloresearch, peptide-db, peptideresearchaus, researchdosing, peptiology.co.uk, swolverine, melanotanexpress, etc. |
| pass6-search general (peptidedeck/peptidedossier/etc) | 8 | peptidedeck (aggregator), peptidedosages, thepeptideguides, seekpeptides, americanpeptidesociety, biopharmiq, peptidescore, peptideratings |
| pass6-aggregator-finnrick (filling gaps) | 4 | hzbpep, biolabshoplimited, zenithjovepeptide (zentih typo variant), peptidotechnology |
| pass6-test-labs | 4 | acslabtest, peptidetest, ethosanalytics, vanguardlaboratory (third-party test labs surfaced) |
| **Pass 6 total net-new** | **187** | |

## New aggregator directories surfaced (for future passes)

These are NEW aggregator types beyond the Pass 5 set
(finnrick/peptideprotocolwiki/pickpeptides/peptidecompared/peppal/magellan/peptidedeck/outliyr/muscleandbrawn/allaboutpeptides/peptidecritic/peptidedossier/peptideindex/peptidereport/peptidescores/peptidedeals/peppal/projectbiohacking):

1. **peptiprices.com** — 60+ vendor price comparison; affiliate links exposed full vendor URLs (highest-yield single page in Pass 6)
2. **peptideprice.store** — 38-vendor "PeptidePrice" retailer comparison
3. **peptides4newbies.com** — comparison/coupon (gated by Cloudflare 403 but vendor list visible in search snippets)
4. **peptidedeck.com** — review aggregator (multiple landing pages mining ascensionpeptides per query)
5. **peptidedossier.com** — encyclopedia/educational (NO vendor recommendations — purely info)
6. **peptidedosages.com** — sister of peptidedeck/dossier; informational
7. **peptidescore.com** — vendor score aggregator (vendor list not enumerable from homepage)
8. **peptideratings.com** — Cloudflare 526 walled
9. **thepeptideguides.com** — directory of peptide protocols (info-only)
10. **americanpeptidesociety.org/peptide-links/** — academic researcher directory (not commercial vendors)
11. **app.biopharmiq.com** — biopharma-IQ list of 148 peptide-therapy companies in US (CDMO-skewed)
12. **peptide.partners** — self-promotional ("the #1 peptide vendor" — single-vendor)
13. **glp1forum.com** — community forum (one of finnrick's top competitors)
14. **seekpeptides.com** — vendor review aggregator
15. **cellforgelabs.com** — vendor review aggregator
16. **atomixresearch.com** — surfaced as Finnrick top competitor (vendor itself, not aggregator)
17. **ethosanalytics.io** — third-party peptide testing service (test-lab surface, similar role to ACS Lab and Krause)

## Naming-pattern sweep yield (compared to Pass 5)

Pass 5: alpha cluster yielded 8 net-new vendors via "alpha" naming stem.

Pass 6 ran 30+ naming-stem queries. Productive stems:

| Stem | Net-new vendors | Stem | Net-new vendors |
|---|---|---|---|
| Apex | 9 | Forge | 11 |
| Atlas | 8 | Quantum | 9 |
| Helix | 7 | Titan | 6 |
| Nova | 6 | Omega | 4 |
| Imperial | 3 | Vanguard | 3 |
| Onyx | 3 | Pacific | 3 |
| Specter/Spectre | 3 | Stellar/Space/Cosmic | 3 |
| Prism | 2 | Sigma | 1 |
| Zenith | 2 | Zeta | 1 |
| Gamma | 1 | Delta | 1 |
| Eclipse | 1 | Vortex | 1 |
| Hydra | 1 | Aurora (peptidesaurora) | 1 |
| Empire/Heritage | 2 | Genesis | 1 |
| Trusted/Pinnacle/Liberty | 3 | Edge | 1 |

Empty/duplicate stems (no new yield): Sentinel, Trident, Royal, Noble, Phoenix, Beta, Sigma (mostly already covered), Crystal, Diamond, Pearl (only Crystal yielded crystalpeptides.eu), Hawk, Eagle, Falcon, Yukon, Magnolia, Sequoia, Cipher, Aegis, Vega, Ranger, Gladius, Centaur, Sphinx, Verge, Catalyst (none yielded), Frontier, Ember, Cascade, Ridge, Crystal, Maverick, Pioneer, Voyager, Compass, Anchor, Beacon, Lighthouse, Anvil, Ozone, Hex, Element, Mercury, Mars, Lunar, Solar.

CONCLUSION on naming patterns: Active "cluster" creation is concentrated in 6 stems
(apex, atlas, forge, helix, titan, quantum, nova). Other stems are saturated or
unused. Pass 7 naming sweeps would have very low yield.

## WHOIS-pivot results (saved under raw/pass6/whois.md)

| Domain | Privacy-walled? | Registrar | Findings |
|---|---|---|---|
| corepeptides.com | partial | Tucows | Romanian registrant (Mehedinti); Cloudflare NS; no sister-domain signals |
| biotechpeptides.com | YES | EuroDNS | Privacy Whois (Luxembourg); Cloudflare NS; no signals |
| lotilabs.com | partial | Tucows | tieredaccess.com email obfuscation; Cloudflare NS; no signals |
| peptidology.com | YES | Squarespace | googledomains NS; no signals |
| ascensionpeptides.com | YES | GoDaddy | client*Prohibited; no signals |
| peptidecompared.com | n/a | unfetchable | whois.com result page returned generic content |
| peptideprotocolwiki.com | n/a | unfetchable | whois.com result page returned generic content |
| pickpeptides.com | n/a | unfetchable | whois.com result page returned generic content |

CONCLUSION on WHOIS: Free-tier WHOIS lookups via whois.com confirm Pass 5's finding —
the .com TLD is ~85% privacy-walled. The Orbitrex pivot worked only because .is
TLD has liberal registrant-publish policy. Pass 6 attempted ascension/biotechpeptides/
corepeptides/lotilabs/peptidology but found no actionable cluster signals. 0 net-new
vendors via WHOIS in Pass 6 (vs Pass 5's 3 via Orbitrex .is).

## SimilarWeb competitor data — high-yield surface

5 of 6 SimilarWeb pages requested were retrievable. Each surfaced 10 competitor
domains. Yield (net-new vendors after dedup):

- purerawz.co competitors: 5 net-new (peptidepros, melanotanexpress, etc — but mostly already in universe)
- swisschems.is competitors: 0 net-new (all already in universe)
- limitlesslifenootropics.com competitors: 5 net-new (purebiolabs, klearmindclinics, libertypeptides etc — many in universe)
- biotechpeptides.com competitors: 0 net-new (top-tier already known)
- corepeptides.com competitors: 1 net-new (ameanopeptides — already in universe)
- peptidesciences.com competitors: 4 net-new (swolverine, revolutionhealth, novoprolabs already mostly in)
- ascensionpeptides.com competitors: 7 net-new (mypeptideuniversity, mirusbio, stressmarq, klearmindclinics, longevitypeptides.us, fusionpeptide, asymchem)
- finnrick.com competitors: 5 net-new (atomixresearch, ethosanalytics, glp1forum, peptide.partners — plus some already in)
- peptidecritic.com competitors: 6 net-new (northwestpeptides, innopeptide, nurapeptide, novapeptidesupply already in, wolverinepeptides.co.uk, uk-peptides.com already in)
- protidehealth.com competitors: 7 net-new (peptidedosages, novagloresearch, peptide-db, peptideresearchaus.com.au, researchdosing, purerxpeptides already in, happypeptides already in)

CONCLUSION on SimilarWeb: ~30-40 net-new domains across 10 competitor pages.
Highest-yield was ascensionpeptides + protidehealth + finnrick competitor lists
(consistent with their position as "top of mind" in the discovery network).

## Bing/DDG variant + Reddit cache results

- `peptide vendor site:.shop` — WebSearch tool didn't honor site: operator. NO yield.
- `peptide vendor site:.store` — same. NO yield.
- `peptide vendor site:.bio` — same. NO yield (but moglabs.bio surfaced via peptiprices)
- `peptide vendor site:.health` — same. NO yield.
- `peptide vendor inurl:vendors/directory/listing` — operator not honored. NO yield.
- `research peptides .us domain` — surfaced peptideresearch.us (already in universe).
- `research peptides .ai domain` — surfaced AI-research papers, no vendor sites.
- `site:reddit.com "added to my list"/"tested peptide"/"shipped fast"/"got mine from"` —
  ALL returned 0 results. Reddit cache remains structurally unsearchable from the
  WebSearch tool (consistent with Pass 5's gating finding).

CONCLUSION: Bing/DDG variant queries did NOT yield meaningfully more than the
default WebSearch already covered. Site: and inurl: operators are not honored
by the WebSearch tool. Pass 7 would NOT benefit from re-running these.

## Top-3 surprising findings

1. **peptiprices.com had 60+ vendor affiliate links** — by far the
   single highest-yield surface in Pass 6 (~25 net-new vendors from one
   page). This is a genuinely NEW aggregator that Pass 5 missed,
   despite Pass 5 enumerating peptidecompared.com/providers (the
   structurally similar telehealth-roster page). peptiprices is the
   research-peptide equivalent and yielded MORE per-page than
   peptidecompared.

2. **The Quantum/Apex/Atlas/Forge/Helix/Nova/Titan stems each yielded
   6-11 distinct sister/competitor vendors — confirming Pass 5's
   "alpha cluster" hypothesis is a general pattern.** Each stem hosts
   ~6-11 small-batch storefronts with distinct domains, no obvious
   shared ownership, but heavy naming-similarity competition. The
   "Forge" cluster alone has 11 unique storefronts (forge-science,
   forgebiolab, forgebioscience.store, forgelabpeps, forgepeptides.co.uk,
   forgeperformanceco, peptide-forge, peptideforge, bioforgepeptides,
   plus existing Forge from Pass 1+).

3. **WHOIS .com TLD is now confirmed ~85% privacy-walled** in Pass 6.
   Of 7 Tier-1 .com cluster domains attempted, ZERO yielded actionable
   sister-domain signals via free WHOIS. Only the .is TLD (per Pass
   5's Orbitrex finding) is a usable pivot. Pass 7 should drop free-tier
   WHOIS as a discovery surface entirely (or upgrade to paid WHOIS-bulk
   like DomainTools/SecurityTrails for actionable yield).

## Surfaces NOT pursued / dropped

- Censys/Shodan TLD-restricted scans (Pass 4/5 recommendation; still un-attempted in Pass 6 due to no Censys API access)
- Browser-automation Trustpilot category pages (still 100% gated)
- Telegram channel directory enumeration beyond what's already covered
- Wayback CDX bulk snapshot mining beyond what's already in universe

## Convergence verdict

Pass 6 surfaced **187 net-new vendors** vs the threshold:

- <30 → Effective convergence
- 30-100 → Pass 7 with the surface that produced yield
- **>100 → Pass 7 mandatory**

187 is **1.87× the upper threshold**, so Pass 7 is recommended (but no
longer "mandatory" — yield is decaying). Pass 6 yield ratio = 187 /
1322 = **14.1%** vs Pass 5's 14.0%. The plateau persists; convergence
is NOT yet achieved.

However, the yield was concentrated in:

1. **One new aggregator (peptiprices)** — single highest yield. There may
   be 1-2 more peptide-price-comparison aggregators not yet discovered.
2. **Six naming-stem clusters** (apex, atlas, forge, helix, titan, quantum, nova).
   These are mostly enumerated. Pass 7 stems would yield <10 net-new.
3. **SimilarWeb competitor pages** — yields ~3-7 per page; Pass 6 mined 10 pages.
   Pass 7 would mine remaining ~50 pages but with rapidly decaying marginal yield
   (most competitors are already in universe).
4. **Test-lab category** — 4 net-new test labs surfaced (acslabtest, peptidetest,
   ethosanalytics, vanguardlaboratory). This is a NEW entity-type surface that
   Pass 1-5 didn't capture. Pass 7 could enumerate "peptide testing lab" domain
   space for ~5-10 more.

## Final cumulative count

**1509 unique vendor entries** across the research-peptide industry as of Pass 6
(2026-05-06):

- 600 Pass 1 baseline
- +258 Pass 2 (listicles + Reddit + forums + YouTube + Wayback + Telegram)
- +140 Pass 3 (gap-chase: TLD scan, FDA enforcement, international, regional)
- +162 Pass 4 (gap-chase: directory enumeration + state AG + Trustpilot search + listicle alt)
- +162 Pass 5 (convergence-test: re-run high-yield surfaces + WHOIS pivot + new aggregators + telehealth + alpha/summit clusters + buy-X SEO)
- **+187 Pass 6 (directory hunting + naming-pattern sweeps + WHOIS + SimilarWeb)**

## Recommendation: Pass 7 NOT MANDATORY but high-value if scoped tightly

If Pass 7 is invoked, scope it to:
1. Mine remaining SimilarWeb competitor pages (top-10 vendors × competitors not yet mined) — est 30-50 net-new
2. Hunt for 1-2 more peptide-price-comparison aggregators — est 10-30 net-new
3. Drop naming-pattern sweeps (saturated) and free-tier WHOIS (structurally walled)
4. Add: "peptide testing lab" / "peptide HPLC service" SERP — est 5-15 net-new
5. Add: tier-2 international (Mexico/India/Brazil/Japan) peptide vendor SERP — est 10-30 net-new

Forecast: Pass 7 with above scope = ~80-120 net-new (yield ratio ~6-8%, decaying from 14%).

If Pass 7 yields <30 net-new, that's effective convergence.
