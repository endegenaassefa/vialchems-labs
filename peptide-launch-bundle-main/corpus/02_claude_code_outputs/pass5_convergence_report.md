---
generated_at: 2026-05-06
inputs: vendor_universe_pass4.csv (1160) + Pass 5 convergence-test surface chase
output: vendor_universe_final.csv (1322 vendors)
---

# Pass 5 Convergence Report

## Counts

| Pass | Net-new vendors | Cumulative universe | Net-new ratio |
|---|---|---|---|
| Pass 1 baseline | — | 600 | — |
| Pass 2 merge | +258 | 858 | 43% |
| Pass 3 gap-chase | +140 | 998 | 16.3% |
| Pass 4 gap-chase | +162 | 1160 | 16.2% |
| **Pass 5 convergence-test** | **+162** | **1322** | **14.0%** |

### Distribution of Pass 5 net-new by entity_type

| entity_type | count |
|---|---|
| retail | 81 |
| aggregator | 26 |
| telehealth | 22 |
| manufacturer-b2b | 18 |
| retail-info | 6 |
| compounding-pharmacy | 5 |
| other (medspa, telegram, b2b) | 4 |
| **Total** | **162** |

### Distribution of Pass 5 net-new by surface

| surface | count |
|---|---|
| pass5-search (alpha + summit clusters + generic) | 35 |
| pass5-longtail (buy-X SEO) | 23 |
| pass5-pickpeptides (78-slug re-enum) | 23 |
| pass5-peptidecompared (telehealth roster) | 19 |
| pass5-pwiki (108-slug re-enum) | 13 |
| pass5-listicle (alt sweep on Tier-1) | 13 |
| pass5-trustpilot (search-based) | 8 |
| pass5-biotechcareers (77-company directory) | 8 |
| pass5-aggregator (new directories) | 8 |
| pass5-international (UK/EU/CA) | 3 |
| pass5-whois (Orbitrex matrix) | 3 |
| pass5-projectbiohacking | 2 |
| pass5-telegram | 2 |
| pass5-forum (steroidology) | 1 |
| pass5-axios (Noho Labs) | 1 |

## Convergence threshold reasoning

The Pass 5 harness threshold was:

| Pass 5 net-new | Verdict |
|---|---|
| <20 | Effective convergence — STOP |
| 20–50 | Recommend Pass 6, document new yield surface |
| **>50** | **Recommend Pass 6 mandatory** |

**Pass 5 surfaced 162 net-new vendors. 162 > 50. Verdict: Pass 6 MANDATORY.**

This is **3.24× the upper threshold** for "Pass 6 mandatory." The discovery
loop has NOT converged.

### Why the universe grew by another 162

1. **Pass 4's "highest-yield = directory enumeration" thesis was correct
   but incomplete.** Pass 4 enumerated 3 directories (PeptideProtocolWiki
   108, PickPeptides 76, Finnrick 205). Pass 5 found **14 more aggregators**
   beyond those, several with their own distinct vendor rosters. The
   highest-yield was peptidecompared.com/providers (19 net-new telehealth
   storefronts that no other surface had).

2. **Long-tail "buy-X" SEO produced 23 net-new retail vendors** that don't
   show up on aggregator directories. These are small-batch single-product
   storefronts (heritagelabsusa, peptideskingdom, purerxpeptides, maylips,
   tirzepatides.us, peptideware) that Pass 1-4's listicle / FDA / community
   surfaces never captured.

3. **The "Alpha cluster" alone produced 8 net-new retail vendors**
   (alphabiomedlabs, alpha-peptides.com, alphalabspeptidesusa, livealphalabs,
   alphapeptidesupply, alphacarbonlabs, peptidesalpha, goalphalabs). These
   are all distinct storefronts with separate domains and no obvious shared
   ownership. The "Alpha-cluster" branding pattern is real and reproducible.

4. **WHOIS pivot succeeded ON ONE cluster** (Orbitrex) yielding 3+1
   sister/typosquat domains. The other 5 cluster pivots returned 0 (all
   privacy-walled). WHOIS-pivot has structurally low yield under
   free-tier tooling but produced exactly the kind of "same-owner sister
   domain" finding Pass 5 was scoped to test for.

5. **Telehealth cluster (19 vendors)** is genuinely net-new market
   segment. Pass 1-4 implicitly excluded telehealth providers; Pass 5 via
   peptidecompared.com/providers captured them.

### Net-new ratio decay path

| Transition | Net-new | Ratio | Trend |
|---|---|---|---|
| Pass 1 → 2 | 258 | 43.0% | high |
| Pass 2 → 3 | 140 | 16.3% | sharp drop |
| Pass 3 → 4 | 162 | 16.2% | plateau |
| **Pass 4 → 5** | **162** | **14.0%** | **slight decay** |

The ratio has decayed from 16.2% → 14.0% — finally beginning a decline.
Pass 5 likely added ~80% of what Pass 6 with similar scope could add.
Under the standard diminishing-returns assumption, Pass 6 should yield
~80–130 net-new vendors (10–12% ratio).

**Forecast for Pass 6**: ~80–130 net-new under same tooling scope, with
yield concentrated in:
1. peptibase.dev/vendors enumeration (gated to homepage in Pass 5)
2. peptipedia.io/vendors enumeration (same)
3. biotech-careers.org pagination (60 of 77 companies enumerated)
4. ensun.io (100+ Italy peptide therapeutics list)
5. usetorg.com 15-best directory + EU expansion

## Convergence verdict: NOT YET CONVERGED. Pass 6 mandatory.

Pass 5's 162 net-new (3.24× threshold) demonstrates the universe is still
materially expanding. Continuing to Pass 6 is justified.

However, the **structural** picture is shifting:

- The aggregator graph keeps producing new directories even after 4
  aggregator-focused passes. peptidecompared, peptibase, peptipedia,
  peptidedeck, peptideverdict, biotech-careers, ensun, usetorg — these
  are all fundamentally NEW aggregator surfaces beyond Pass 4's
  PPW+Pickpeptides+Finnrick.
- The Trustpilot category gating (5 attempts across Pass 2/3/4/5) is now
  100% structural — confirmed unbreakable without browser automation.
  Search-based discovery is the only feasible channel.
- The WHOIS-pivot-yielding cluster (Orbitrex) is the FIRST cluster across
  4 passes to expose sister-domain enumeration via free WHOIS. ISNIC's
  publishing-policy on .is registrants is the unique enabler. Other TLDs
  (.com / .co / .us) are privacy-walled.
- The telehealth segment (19 vendors via peptidecompared) is genuinely
  separate from the research-peptide retail segment. Whether to include
  it in the universe is a scope question (we did, marked entity_type=telehealth).

## Highest-leverage scope for Pass 6 (if invoked)

1. **peptibase.dev/vendors** + **peptipedia.io/vendors** — both are
   directory pages that exist but require client-side render or auth.
   Estimated 50-100 net-new each.
2. **biotech-careers.org peptides directory pagination** — 17 of 77
   companies un-enumerated in Pass 5.
3. **ensun.io / usetorg.com / 360quadrants.com** — 3 industrial directory
   sites with 50-150 companies each, mostly pharma B2B but including
   some research-grade vendors.
4. **WHOIS-bulk on remaining 70 Pass 4 cluster domains** — likely yields
   2-5 more sister-domain expansions like Orbitrex (specifically:
   look for .is, .to, .ws TLD registrations where registry policy is
   liberal).
5. **finnrick.com vendor pagination** — 135 of 205 vendors un-enumerated.
6. **TLD-restricted Censys / Shodan scan for .is + .to + .cn peptide
   ecosystem** — same Pass 4 recommendation, still un-attempted.

## Recommendation: Pass 6, then re-evaluate

Pass 6 with the above scope is likely to add ~80-130 net-new (yield
ratio ~9-11%, decaying from 14%). If Pass 6 yields <30 net-new, that
would be effective convergence.

If Pass 6 lands above 50 net-new, declare provisional convergence anyway
because the marginal utility per discovery hour is dropping below the
"actionable insight per row" threshold for the downstream use case
(competitive analysis / regulatory mapping).

## Final cumulative count

**1322 unique vendors** across the research-peptide industry as of Pass 5
(2026-05-06):

- 600 Pass 1 baseline
- +258 Pass 2 (listicles + Reddit + forums + YouTube + Wayback + Telegram)
- +140 Pass 3 (gap-chase: TLD scan, FDA enforcement, international, regional)
- +162 Pass 4 (gap-chase: directory enumeration + state AG + Trustpilot search + listicle alt)
- +162 Pass 5 (convergence-test: re-run high-yield surfaces + WHOIS pivot + new aggregators + telehealth + alpha/summit clusters + buy-X SEO)
