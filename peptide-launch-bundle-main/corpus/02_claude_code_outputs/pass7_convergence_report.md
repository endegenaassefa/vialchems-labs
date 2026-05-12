# Pass 7 Convergence Report

## Summary

| Metric | Value |
|---|---|
| Universe entering Pass 7 | 1509 |
| Pass 7 net-new vendors | 32 |
| Universe exiting Pass 7 | 1541 |
| Net-new ratio (Pass 7) | 32/~270 candidates ≈ 11.9% |
| Net-new ratio trend | 1509→1541 = +2.1% growth (down from Pass 6's ~14%) |

## Pass 7 surface scope (NOVEL only — no Pass 1-6 redo)

| # | Surface | Probed | Net-new | Notes |
|---|---|---|---|---|
| A | Naming-stem direct domain probing | yes | **24** | Highest-yield surface; ~50% collision with already-known vendors |
| B | B2B chemical/pharma aggregators (LookChem, GuideChem, Made-in-China, Alibaba, Sigma-Aldrich, Bachem, PubChem) | yes | 0 | Predominantly non-US-shipping Chinese B2B raw-powder manufacturers |
| C | Substack / Beehiiv / newsletter ecosystem | yes | 0 | All vendor mentions already in universe |
| D | Twitter / X profile harvesting | yes | 0 | All active accounts already known |
| E | Instagram via Google index | yes | 0 | Instagram non-indexed for research peptide queries |
| F | LinkedIn B2B | yes | 0 | All surfaced companies already known |
| G | Quora / Medium / Q&A | yes | 0 | All vendor mentions already in universe |
| H | Government / state procurement / patent (USPTO, SAM.gov) | yes | 0 | No research-peptide retailers in federal procurement / patent surfaces |
| I | Crypto-native vendor search ("crypto only", "monero", "lightning") | yes | 0 | Vendors found already known |
| J | SimilarWeb / Ahrefs sweep (peptaura, peptide-partners, lotilabs, peptidology) | yes | 1 | Peptora Labs surfaced from peptaura.com competitor list. peptide-partners and peptidology had no Similarweb profile. |
| K | peptideals.com coupon directory (bonus surface) | yes | 7 | High-value vendor index |
| L | GLP-1 Forum / Telegram / gray.guide | yes | 0 | All surfaced names already known |

**Total surfaces hit:** 12 / 11 originally planned (peptideals.com added as bonus K-surface)
**Surfaces with yield:** A, J, K (3 productive surfaces)
**Surfaces with zero yield:** B, C, D, E, F, G, H, I, L (9 saturated surfaces)

## Convergence threshold analysis

Per Pass 7 protocol:
- **<30 net-new** → declare effective convergence
- **30-100 net-new** → recommend Pass 8 if single surface produced yield
- **>100 net-new** → mandatory Pass 8

Pass 7 produced **32 net-new** (just above the 30 threshold).

A **single surface (A — naming-stem direct probing)** produced **24/32 = 75%** of the net-new yield. This satisfies the "single surface produced yield" criterion.

### Verdict: **Pass 8 RECOMMENDED (not mandatory)**

The other 8 surfaces in Pass 7 returned 0 net-new each, indicating those surfaces are now saturated. Pass 8 should focus narrowly on:
1. Extended naming-stem permutations not yet probed:
   - Suffix patterns: `<stem>chem`, `<stem>research`, `<stem>scientific`, `<stem>USA`, `<stem>store`
   - Multi-word stems: "Lone Star Peptides", "Black Diamond Peptides", "Iron Lab", "Steel City", etc.
   - State-prefix patterns: "Texas Peptides", "Florida Peptides", "California Peptides", "Nevada Peptides", "Arizona Peptides"
2. Direct visit to peptideals.com listing pages for individual vendor URLs not yet captured (Step One Ventures s1research.net is in universe; Hacker Peptides, JH Biosciences, LA Peptides need direct domain resolution)
3. peptidecritic.com vendor-directory (403-blocked in Pass 7) via alternative auth path
4. peptideprice.store and peptideprotocolwiki.com vendor catalogues for any not-yet-captured names

## Net-new ratio trajectory

| Pass | Net-new ratio | Universe end |
|---|---|---|
| Pass 1 | n/a | ~1100 |
| Pass 2 | ~25% | ~1280 |
| Pass 4 | ~17% | ~1370 |
| Pass 5 | ~14% | ~1430 |
| Pass 6 | ~14% | 1509 |
| Pass 7 | ~12% | 1541 |

Net-new ratio plateaued from Pass 5 onward, now starting a gentle decline. Stem-exhaustion remains the dominant productive surface; everything else has saturated.

## Notable Pass 7 observations

- **Forge** as a stem yielded 4 distinct US peptide retailers (Forge Peptides, Forged Peptides, IronForgePeptide, Forge Bio) PLUS 5 already-captured Forge-named entities (Forge Performance Co, Forge Biolab, Forge Lab Peptides, Forge Science, CellForge Labs). The "Forge" naming cluster is one of the densest brand-stems in the research peptide market.
- **Vertex** stem also yielded a multi-domain matrix (vertexpeptides.com, vertex-peptides.com, vertexpeptide.com, vertexlab.store all owned by Vertex Peptides plus the distinct Vertex Research Labs).
- **Olympus**, **Pinnacle**, **Vanguard**, **Anchor**, **Catalyst**, **Premier**, **Eternal** — each yielded 1 net-new active retail vendor.
- **Quantum**, **Apex Labs (top-level)**, **Atlas Labs (top-level)**, **Nova Peptides**, **Helix Peptide**, **Pure Peptides** — already in universe (Pass 1-6 caught them).
- Multiple stem-suffix permutations resolved to NON-peptide companies: Apex Labs (psilocybin), Anchor Labs (crypto bank), Quantum Labs (dental supplies), Genesis Labs (pest control), Pure Bio (food hygiene), Vital Labs (Riva Health). This is meaningful **negative-evidence** that fully-generic compound nouns are taken by other industries.
- Domain parking / for-sale: forgelabs.com, quantumpeptide.com, apexpeptide.com, atlasllabs.com, atlanticlabs.com, vanguardbio.com, olympusbio.com — many lapsed-or-parked desirable peptide-stem domains visible.
- The **Norwegian** Arctic Peptide (arcticpeptide.com) is a non-USA-targeted but English-discoverable vendor — flagged with `uncertain` US-shipping status.
- Canadian vendor cohort came primarily from peptidedeck/peptideprotocolwiki cross-references; many already in universe.

## Top 3 surprising finds

1. **peptideals.com coupon directory** (37-vendor index) is a high-value undiscovered aggregator surface. Should be re-probed in Pass 8 for individual vendor domain resolution.
2. **Peptide Hackers** ($25M valuation, Shawn Younai-founded LA-based) — one of the few research peptide vendors with public valuation press coverage and a brick-and-mortar address (2029 Century Park East Suite 400, Los Angeles 90067).
3. **The Olympus Labs (theolympuslabs.com)** openly carries Retatrutide, Tirzepatide, Semaglutide as research-only — the full GLP-1 trio. After Peptide Sciences shutdown (March 2026) and the FDA's heightened enforcement on the same exact catalog, this vendor's risk profile is notable and merits dedicated dossier coverage.

## Output files

- `/mnt/c/Users/endeg/Documents/peptide-research/peptide-research_cli/03_raw_fetches/discovery_pass_4/surface_pass7_novel.md`
- `/mnt/c/Users/endeg/Documents/peptide-research/peptide-research_cli/02_claude_code_outputs/vendor_universe_final.csv` (REPLACED — 1509 + 32 = 1541 rows)
- `/mnt/c/Users/endeg/Documents/peptide-research/peptide-research_cli/02_claude_code_outputs/pass7_convergence_report.md` (this file)
- `/mnt/c/Users/endeg/Documents/peptide-research/peptide-research_cli/02_claude_code_outputs/vendor_universe_pass6_backup.csv` (backup of pre-Pass-7 state)
- Raw artifacts under `/mnt/c/Users/endeg/Documents/peptide-research/peptide-research_cli/03_raw_fetches/discovery_pass_4/raw/pass7/`
