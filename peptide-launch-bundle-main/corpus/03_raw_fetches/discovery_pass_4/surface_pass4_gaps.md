---
generated_at: 2026-05-06
inputs:
  - vendor_universe_pass2.csv (998 baseline rows from Pass 1+2+3)
  - Live web search + WebFetch + wget across Trustpilot, FDA, listicles, vendor aggregator directories, Wayback CDX
output: surface_pass4_gaps.md
net_new_vendors: 162
---

# Pass 4 Gap-Chase Surface

Pass 4 of the iterated peptide-vendor discovery loop. Pass 1+2+3 surfaced 998
unique vendors. Pass 4 chases the remaining unblocked gaps from the Pass 3
summary recommendation list.

## Sources fetched

### A) Trustpilot deep pagination (search-based, since direct category pages
return HTTP 403 to both WebFetch and wget)
- `site:trustpilot.com/review peptide` (10 results)
- `site:trustpilot.com/review research peptide` (10 results)
- `site:trustpilot.com/review BPC-157` (10 results)
- `site:trustpilot.com/review semaglutide research` (10 results)
- `site:trustpilot.com peptide tirzepatide research` (10 results)
- `site:trustpilot.com peptide retatrutide research` (10 results)
- `site:trustpilot.com peptide TB-500` (10 results)
- `site:trustpilot.com peptide CJC-1295 ipamorelin` (10 results)

  **Outcome:** Surfaced ~25 Trustpilot review URLs; new domains harvested
  include: retaonelabs.com (Reta One Labs), cellpeptides.com (CellPeptides),
  cellpeptidess.com, tridentpeptide.com (Trident Peptide UK),
  peptidicresearch.com (Peptidic Research), atomiklabz.com (Atomik Labz),
  hydroresearchpeptides.com, oralabs.net (ORA Labs Research Peptide),
  oxfordpeptides.com (OP Labs/Oxford Peptides), samualshealth.com (CA),
  royalresearch.co (Royal Research), pective.com, ezpeps.com,
  lotinlab.com, ascendpeptidesuk.com, getascensionpeptides.com (mirror),
  cosmicpeptides.com.

  Trustpilot category pages (`/categories/biochemical_supplier`,
  `/categories/medical_supply_store`) returned **HTTP 403 Forbidden** to both
  WebFetch and wget — even with full Chrome user-agent. The category-page
  enumeration gap noted in Pass 3 remains unsolved.

### B) Listicle long-tail "X alternative" queries on Pass 3 vendors
- "Apollo Peptide Sciences" alternative
- "Ascension Peptides" alternative
- "Polaris Peptides" alternative
- "Skye Peptides" alternative
- "Loti Labs" alternative
- "Peptidology" alternative peptide vendor
- "Verified Peptides" alternative
- "Peptide Partners" alternative
- "Pinnacle Peptides" alternative research

  **Plus follow-up reviews on every newly-named vendor:**
  - Ignite Peptides, EZ Peptides, Glacier Aminos / Glacier BioLabs / mirrors,
    Triumphant Labs, BioLongevity Labs, Tydes (tydes.is + tydes-research.com
    + lkpeptide), AmoPure / AmoPeptide / Amolist, Skyetides (cosmetic),
    Particle Peptides, Iron Peak Peptides / Iron Peptides, Adapt Peptides /
    Adaptive Peptides, LeoLab RX / LeoLab.io, Felix Chemical Supply
    (felixchem.is), PepVida / PepVida Labs, Peptide Tech (peptidetech.co
    distinct from .is), Pivot Labs (pivotlabsglobal.com — appears on
    PepPal.app vendor list), Peptide Partners (peptide.partners), Veltrix
    Peptides (veltrixpeptides.com), Elite Research Lab (eliteresearchlab.com),
    Cernum Biosciences confirmation, Astro Peptides USA, Onyx Biolabs / Onyx
    Research / Onyx Peptide Research, Sunday Peptides (sunday-usa.com).

  **Listicle aggregator pages fetched/extracted:**
  - muscleandbrawn.com/blog/peptide-sciences-alternatives
  - muscleandbrawn.com/peptides/best-peptide-vendors
  - muscleandbrawn.com/peptides/best-peptide-companies
  - outliyr.com/best-online-peptide-companies-websites-sources
  - thepeptidecatalog.com/articles/peptide-sciences-shut-down-alternatives
  - thepeptidecatalog.com/articles/best-peptide-vendors-2026
  - sarmguide.com/best-peptide-sciences-alternatives
  - peptidesexplorer.com/blog/peptide-sciences-alternatives
  - peptidecompared.com/news/peptide-sciences-alternatives
  - vocal.media/journal/with-peptide-sciences-gone-researchers-rebuilding
  - protidehealth.com/top-10-peptide-companies-usa
  - peppal.app + peppal.app/blog/best-grey-market-peptide-supplier
  - magellanrx.com (LeoLab RX, Simple Peptide, Nexaph review pages)
  - peptideprotocolwiki.com/vendors (108-vendor directory; ~95 vendor URL
    slugs extracted via wget)
  - pickpeptides.com (76-vendor curated list extracted via wget)
  - finnrick.com/vendors (~205-vendor list extracted via WebFetch)
  - gray.guide/sourcing-details/verified-vendors

### C) State AG / DEA / CBP enforcement
- WebSearch: state attorney general peptide vendor enforcement 2025-2026
- WebSearch: Alabama attorney general peptide TRO November 2025
- WebSearch: Connecticut attorney general peptide cease operations
- WebSearch: California attorney general peptide vendor
- WebSearch: Texas attorney general peptide GLP-1
- WebSearch: New York attorney general research peptide enforcement
- WebSearch: DEA seizure peptide research chemical 2025-2026
- WebSearch: CBP seizure peptide research chemical port

  **New surfacing:**
  - **CT AG (Tong) v. Triggered Brand** — settled, $300k judgment ($18.5k
    paid). Triggered Brand (Sam Stolt CEO) ceases all GLP-1 sales. Already
    in Pass 2 dataset.
  - **CT AG v. Made-in-China** — separate settlement, $300k penalty
    ($30k paid). Made-in-China platform ceases "research-grade GLP-1"
    sales into US. **Net-new aggregator entry.**
  - **Alabama AG TRO Nov 2025** — vendor name not disclosed publicly.
    Gap: cannot map TRO to specific vendor.
  - **ITC Section 337-TA-1377 (Lilly v. tirzepatide importers)** —
    Cease and Desist orders against Arctic Peptides, Triggered Brand, and
    **Strate Labs** (stratelabs.com, Spring TX). All in Pass 2 already.
    Strate Labs sourced from **Semathin Ltd (Ontario, Canada)** — net-new
    manufacturer-b2b.
  - **CBP Cincinnati seizure** — already in Pass 3 dataset; reconfirmed
    300+ master-carton seizures Dec 2025 - Mar 2026. No new vendor names
    extracted (importer identities sealed).

### D) Wayback Machine via wget
- **CDX queries:**
  - `https://web.archive.org/cdx/search/cdx?url=peptidedeck.com&output=json&limit=200` → empty
  - `https://web.archive.org/cdx/search/cdx?url=peppal.com&output=json&limit=200` → 60+ snapshots, peppal home page captured
  - `https://web.archive.org/cdx/search/cdx?url=thepeptidelist.com&output=json&limit=200` → empty (site never indexed by Wayback)
  - `https://web.archive.org/cdx/search/cdx?url=finnrick.com/vendors&output=json&limit=200` → not retrievable (timeout)
  
  **Outcome:** peppal home Wayback snapshot retrieved but contained no
  vendor names (peppal.com is the Florida PEP scholarship system, NOT
  peppal.app — distinct entities). Wayback yielded 0 net-new vendors in
  Pass 4 (vs 0 in Pass 3 — same outcome).

### E) Domain confirmation for FDA-cited entities
- **Xcel Research LLC** (FDA Sep 2025 warning) → xcelpeptides.com
  *confirmed* via Pass 2 / Outliyr listicle alignment.
- **Prime Vitality Inc dba Prime Peptides** (FDA Dec 2024) → primepeptides.co
  confirmed.
- **Synthetix Inc dba Helix Chemical Supply** → helixresearchpeptides.net
  reconfirmed (was in Pass 2).
- **Lovega LLC dba Pink Pony Peptides** → pinkponypeptides.com (Pass 2).
- **Pinnacle Professional Research dba Pinnacle Peptides** →
  pinnaclepeptides.com (Pass 2).
- **Mile High Compounds LLC** → milehighcompounds.is (Pass 2).
- **Gram Peptides** → grampeptides.com (Pass 2).

  Plus FDA Solr Index XLSX downloaded and parsed for full company list:
  Surfaced **Biomedical Research Laboratories LLC**, **Orphic Nutrition**,
  **Proper Nutrition Inc**, **gorillahealing.com**, **buynetmeds.com**,
  **ybycmeds**, **Quicksilver Scientific**, **Great Lakes Gelatin**,
  **Saffron Health Sciences**, **Clarke Pharmaceutical Manufacturing**,
  **Ostar Beauty Sci-Tech** (CN cosmetic peptide), **Foshan Miwei Cosmetics**
  (CN), **Aqualex Co**, **Plantacea LLC dba Kahm**, **Chengdu Brilliant
  Biopharmaceutical**, **Warrior Labz SARMS**.

### F) International "ships to US" enumeration
- UK: **xlpeptides.com** (XL Peptides) net-new beyond Pass 2's UK cluster.
- Russia: **cytomed.ru**, **russianpeptide.com**, **peptide-shop.com**
  (RU bridge), **e-peptide.com**, **peptide-products.com**,
  **peptideproduct.com**.
- EU: **peptidesdirect.io** (PeptidesDirect — confirmed B2B EU vendor),
  **pepspan.com**.
- Canada: **luxaralabs.com** (Luxara Labs), **exolabz.ca** (ExoLabz, Ontario),
  **canpeplabs.com** (already in Pass 3 / Canada Peptide Labs),
  Canadian-mirror cluster from peptideprotocolwiki: maplepep.com,
  androbolics.com, canadapep.ca, canadiananabolics.com,
  canadianmedicalsupplies.com, canadianpeptidesupply.com,
  canadianpeptides.com, cdnonlinelab.com, corepeptidesca.com,
  apexpeptidescanada.com, directpeptidescanada.com, sarmsrevolutionlab.com,
  trustedsarms.ca, vpeptide.ca, peptideshopcanada.com,
  performancepeptidescanada.com, particlepeptidescanada.com,
  peptideprocanada.com, peptidesourcecanada.com, pharmalabglobalcanada.com,
  growthguys.ca (Growth Guys Canada), greatnorthernpeptides.com,
  pgenabolics, torontopeptides.com, pacificpeptides.com.
- Australia: **AUSPEP** (auspep.com.au, Australia's only GMP peptide API
  manufacturer), **Bondi Peptides** (bondipeptides.com),
  **Australian Peptide Store** (australianpeptidestore.com.au).
- China (manufacturer-b2b): **pengtingpeptide.com** (Sichuan Pengting),
  **polypeptide.ltd** (Phcoker), **lkpeptide.com** (Tydes parent),
  **retatrutidesupplier.com / retatrutideonlineshop.com /
  retatrutidepenbulk.com / retatrutidebulk.com** (ShiLai Healthcare —
  4-domain mirror cluster), plus the Finnrick-cited cluster of ~50 small
  Chinese B2B traders (most without confirmed domain — listed as
  uncertain).

### G) Discord / Telegram supplemental
- **Discord servers** (top.gg + disboard.org enumeration):
  - JP Peptides, SRY Peptides, Peptide Research Lab, Nova Peptide Research,
    Peptides Deals, Royal British Peptides, Peptide Hub (Discord variant),
    Biomaxxing.
- **Telegram**:
  - `t.me/wholesalepeptidesupplies1` — Wholesale Peptide Supplies channel
    (active, public).
  - `t.me/polypeptideltdcompany` — Phcoker Polypeptide.ltd manufacturer.
  - **Stairway to Gray** (stairwaytogray.com + STG Telegram, gated 24h
    rotating invites) — confirmed structurally, but vendor list inside
    remains gated.
  - **Peptide Research Group / PRG** (`t.me/PRGassistant_bot`) —
    confirmed as the gateway bot for STG. Not directly enumerated.
  - **Wholesale Peptides UK Linktree** (linktr.ee/wholesalepeptidesuk).
  
  **Gray Guide (gray.guide) verified-vendors page** disclosed three
  Telegram-only vendors:
  - Alex Wu / Noble Dragons (`buy.nobledragons.com` + Telegram)
  - Guangzhou Jeep Biotechnology (JEEP)
  - Baohua Dongnuo Biotechnology (BDB / BHD)
  
  All three appear in Finnrick vendor index also. **Net-new contribution:
  Noble Dragons primary domain confirmed.**

### H) Alternative-aggregator long tail
- "underrated peptide vendor" → Dynamic Peptide, Penguin Peptides, Felix
  Chemical Supply (already covered).
- "lesser known peptide vendor" → Miracle Supplements, Particle Peptides
  (already covered).
- "newcomer peptide vendor 2026" → Felix Chemical Supply, Core Peptides
  (already covered).
- "best peptide vendor 2026 small batch" → Ascension, Felix Chem, Protide
  Health (already covered).

## Vendor candidates with URL evidence

162 net-new vendors are written into `vendor_universe_pass4.csv` rows
999-1160 with full evidence URLs and entity_type classification.

**Highest-yield surfaces:**
1. Peptide Protocol Wiki vendor enumeration (43 net-new) — biggest single
   contribution; confirms the "directory of vendor reviews" pattern as
   highest-leverage discovery surface.
2. Listicle alternatives (46 net-new combined across "alt" + alt2 surfaces).
3. Finnrick aggregator (20 net-new — many uncertain Chinese B2B without
   confirmed domain).
4. International / Canada cluster (12 net-new, dominated by .ca branded
   regional storefronts).
5. FDA Solr index XLSX (15 net-new, mostly historical 2021-2024 warnings
   for cosmetic / dietary-supplement entities adjacent to the peptide
   regulatory perimeter).

## Gaps remaining

1. **Trustpilot category pagination still 403-walled.** Every direct fetch
   (curl, wget, WebFetch) of `/categories/biochemical_supplier?page=N`
   returned 403. The 100-200 estimated long-tail vendors on pages 2-50
   remain inaccessible without browser-automation or paid scraping.
2. **Reddit r/Peptides + r/Peptidesource + r/PeptideGuide canonical wikis
   still fully blocked** (not attempted in Pass 4 — requires authenticated
   session). Estimated 20-50 vendor names hidden.
3. **TLD-restricted enumeration (.is, .to, .ru, .cc, .cn, .su)** — Pass 4
   surfaced .is and .ru clusters via search, but no comprehensive WHOIS or
   Censys-style scan was performed. Estimated 30-80 .is/.to/.cn vendors
   not yet surfaced.
4. **Forum gated subforums (steroidsourcetalk.cc /sources/, eroids
   /sources/, anabolicminds /peptides/, glp1forum Premier Sponsor list)**
   — Pass 4 did not attempt; Pass 3 confirmed gating still in place.
5. **Telegram private channels (Stairway to Gray, PRG, Wholesale Peptides
   UK)** — invite-only or rotating-invite-only. Multi-vendor brokers with
   1000+ subscribers each.
6. **Many Finnrick-cited Chinese B2B entities lack confirmed domains** —
   they're tracked by Finnrick as code/abbrev (XHT, ABC, BDB, GYC, QSC,
   QYC) without verifiable storefronts. Likely real but require Alibaba /
   Made-in-China cross-reference.
7. **Pivot Labs** (pivotlabsglobal.com referenced on PepPal as a vetted
   alt) returns no Google / search hits for its peptide product page —
   the PepPal review URL is the only public reference. Needs direct
   visit which will likely require account creation.
8. **Specific exact-domain confirmations missing** for: Aavant Research,
   Lipeptides, NUPEPS Peptides, Peptilab Research, M-Peptides, Bio Pepz,
   PeptiSlim, NextGen Health, HK Peptides — Finnrick lists them by name
   only.
9. **Apollo Peptide Sciences vs. Apollo Peptides .org** still unresolved —
   apollopeptidesciences.com is the recommended-by-listicles brand; an
   .org variant referenced in Pass 3 may be a separate entity.

