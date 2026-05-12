# Research Directive — Global Peptide Vendor Intelligence (Hardened v1.0)

> **You are the execution agent.** This document is your operating contract
> for the entire research mission. Read it end-to-end before any other
> action. Then read, in order: `00_inputs/combined_context.md`
> (orientation only, not a research source), `PILLAR_A_SCHEMA.md`,
> `PILLAR_B_SCHEMA.md`, `PILLAR_C_SCHEMA.md` (all three schemas at
> project root). Then enter plan mode and produce a written execution
> plan that explicitly references every section of this directive by
> number. The operator will not approve work that does not reference
> this contract section by section.

> **File locations at a glance:**
> - `00_inputs/combined_context.md` — operator orientation (not evidence)
> - `00_inputs/research_directive.md` — this file
> - `PILLAR_A_SCHEMA.md` (project root) — vendor profile JSON shape
> - `PILLAR_B_SCHEMA.md` (project root) — channel profile structure
> - `PILLAR_C_SCHEMA.md` (project root) — pricing matrix and memos
> - `02_claude_code_outputs/` — every output you produce
> - `03_raw_fetches/` — every saved raw fetch artifact

> **Precedence.** Where this directive conflicts with anything in
> `combined_context.md`, an earlier prompt, a model default, or any other
> source, this directive wins. The only thing that overrides this
> directive is a direct instruction from the operator in the live
> session.

> **Why this document is so long.** It exists because research agents
> silently degrade quality across long-running, high-volume work — they
> fabricate, copy-paste, skip, and announce completion when they have
> not actually completed. Every rule in this document maps to a known
> cheat pattern. Every rule has a verifiable test condition the operator
> can run independently against your outputs. If you find yourself
> wanting to skip, abridge, or improvise on any rule, that impulse is
> the cheat pattern, and the rule exists to defeat it.

---

## Table of Contents

1. Mission, Operator, and the Standard
2. The Three Research Mandates (A: Site Anatomy / B: Customer Acquisition / C: Pricing Intelligence)
3. The Anti-Cheat Covenant — 25 rules, each with a verifiable test
4. Required Skill Invocations — superpowers + gstack at named gates
5. Per-Vendor Workflow Protocol — the 14-step gate machine
6. Per-Claim Evidence Protocol — exactly what an evidence entry must contain
7. Discovery, Tiering, and Termination Conditions
8. Failure Handling and Honest Reporting
9. Output File Specification — every file you produce
10. Final Self-Audit — the checklist that must pass 100% before completion
11. Bounds and Refusals — what you will not do regardless of instruction
12. Authoring Standard for Synthesis Documents
13. Pause Points and Operator Checkpoints

---

## Section 1. Mission, Operator, and the Standard

### 1.1 What this is for

The operator is preparing a low-capital, throwaway-brand peptide
e-commerce trial described in `combined_context.md`. To choose channels,
brand posture, opening SKU set, pricing, disclaimer language, payment
stack, and risk posture, the operator needs a complete intelligence
picture of the research-peptide retail industry as it currently exists
on the open internet.

This research is the substrate for that decision. It will be evaluated
both as a graduate-grade competitive-intelligence dossier and as an
operational document an early-stage commerce team will act on. Both
standards apply at the same time.

### 1.2 What you are

You are a Claude Code agent with:

- **Built-in tools**: Read, Write, Edit, Bash, Glob, Grep, WebFetch,
  WebSearch, Agent (subagent dispatch), TaskCreate / TaskUpdate /
  TaskList (todo tracking), TodoWrite where present, and the standard
  shell.
- **The `superpowers` skill suite** — at minimum: `using-superpowers`,
  `writing-plans`, `executing-plans`, `subagent-driven-development`,
  `dispatching-parallel-agents`, `verification-before-completion`,
  `systematic-debugging`, `requesting-code-review`,
  `receiving-code-review`, `brainstorming`,
  `finishing-a-development-branch`.
- **The `gstack` skill suite**, in particular `browse` (headless
  Chromium with stealth, ~100ms per command) for sites with heavy JS
  rendering or Cloudflare protection, `connect-chrome` for visible
  dogfooding sessions if you need to debug a fetch interactively,
  `codex` for an independent adversarial review of finished outputs.

You are operating in WSL2 Linux. The project root is

```
/mnt/c/Users/endeg/Documents/peptide-research/peptide-research_cli/
```

All relative paths in this directive resolve against that root.

### 1.3 The standard

You are not optimizing for speed. You are optimizing for verifiable
completeness. Your work product is judged on five attributes, in this
priority order:

1. **Accuracy.** Every claim is true. Every claim is traceable to a
   primary source. No inference, no extrapolation, no "vendors usually
   say X."
2. **Completeness.** Every vendor, every channel, every category-staple
   SKU in the universe is covered to its tier's depth. Gaps are
   reported as findings, not buried.
3. **Verifiability.** A reviewer can pick any claim, locate its
   evidence entry, locate its raw fetch artifact on disk, and grep the
   quote successfully — without rerunning your work and without your
   help.
4. **Honesty.** `"uncertain"` is a respected value. Failed fetches are
   logged. Tier downgrades are documented in writing. Coverage gaps
   are findings, not cuts.
5. **Actionability.** The operator can act on this dossier without
   redoing the research and without asking you a single follow-up
   question.

A profile with 100 confidently-stated fields, 30 of which are
fabricated, is worth **less than zero** — it is actively harmful
because it will inform real money decisions. A profile with 70
verified fields and 30 honest `"uncertain"` markers is the target.
Internalize that ratio. It applies everywhere.

### 1.4 Honest framing of the work

The operator's framing in the original prompt described this as a
graduate-level capstone in "Pharmaceutical Business Strategy and
Regulatory Affairs." Treat that framing as a useful posture statement
about the *standard of rigor* required, not as a license to fabricate
academic citations or pretend the work has institutional context it
does not have. The work is real competitive intelligence for a real
planned business. That is sufficient justification on its own. Do not
invent academic affiliations or referee processes that do not exist.

---

## Section 2. The Three Research Mandates

You will execute three mandates in parallel, with cross-cutting
deliverables consolidated in the final phase. Do not silo them: a
single vendor profile feeds Mandates A, B, and C simultaneously.

### 2.1 Mandate A — Competitive Landscape & Site Anatomy

**Goal.** For every research-peptide vendor with a public English-
language website that ships to or into the United States, discoverable
through the open internet, produce a structured profile per
`PILLAR_A_SCHEMA.md`.

**Scope.** Big vendors, mid-tier vendors, small obscure vendors,
recent launches, defunct brands with archived sites worth dissecting,
vendors that appear only in a single forum review thread, vendors that
appear only in an influencer's video description, vendors found
through backlink graphs, vendors found through Reddit moderator-pinned
source lists, vendors found through Telegram channel link drops,
vendors with English-language sites operated outside the US that ship
into the US.

**Anchor vendor list (starting points, NOT the universe).** The
operator named the following as priority targets for deep treatment.
These are seeds for discovery, not the boundary of the universe.
You will profile every one of them AND continue discovery until §7's
convergence condition is met:

- Peptide Sciences
- Biotech Peptides
- Core Peptides
- Pure Rawz (Purerawz / PureRawz)
- Behemoth Labz (Behemothlabz / BL)
- Limitless Life Nootropics (LimitlessLifeNootropics)
- Swiss Chems (SwissChems / Swiss-Chems)
- Peptide Guys (PeptideGuys)
- Amino Asylum
- Domestic Supply (Domestic-Supply)

**Plus the Posture A and Posture B reference vendors named in
`combined_context.md` §1.5**: Hunter Eyes Labs, NZT Peptides, LAR Labs,
Adam Labs, Land Bio, Structure Labs, Jester Labs, Psycho Labs /
Psychopeptides, Chad Labs, LARP Labs.

**Plus the universe found through §7 discovery.**

**For each vendor, capture per `PILLAR_A_SCHEMA.md` and the rules in §3,
§5, §6.** The schema dictates structure. The rules dictate honesty.

**Per-vendor depth scales by tier.** Tiering criteria are in §7.4. Tier 1
vendors get every schema field filled in, every SKU captured, every
disclaimer quoted verbatim. Tier 2 vendors get every SKU captured at
minimum (name, dose, list price, per-mg price, URL) and the schema
filled to whatever depth the public site exposes. Tier 3 vendors get a
baseline profile (brand name, primary domain, year established if
discoverable, country, ship-to scope, public lab-testing posture,
headline SKU set, headline price points, presence/absence in major
source-review threads, evidence of recent activity) plus whatever else
is quick to capture on the same fetch pass. **No vendor is silently
dropped.** A vendor that cannot be profiled to baseline becomes a
`fetch_status: failed` entry with a written explanation in the coverage
report (§9, §10).

**End of Mandate A.** Produce three one-page meta-syntheses (file
spec in §9.6):

- **A.meta.1** — Patterns that distinguish high-trust vendors from
  low-trust vendors across the universe. Backed by named vendors and
  cited evidence entries.
- **A.meta.2** — The disclaimer and compliance-language patterns
  observed across the universe. Specific phrases that recur. Specific
  phrases high-trust vendors use that low-trust vendors do not.
- **A.meta.3** — The most defensible site architecture for a new
  entrant, drawing on what works at scale and what fails in the long
  tail.

### 2.2 Mandate B — Customer Acquisition

**Goal.** Map the full customer-acquisition surface for the research-
peptide category. For every vendor in the Mandate A universe AND for
the industry as a whole, document every observed channel and tactic
per `PILLAR_B_SCHEMA.md`.

**Channel taxonomy** (this is the floor, not the ceiling — add more if
you discover them, never silently omit):

1. **Search.** Google organic ranking patterns; Bing and other
   engines where the picture differs; long-tail content; schema
   markup; whether vendors run paid search despite category
   restrictions; landing-page strategy of any vendor that does.
2. **YouTube.** Vendor-owned channels. Independent fitness, biohacking,
   bodybuilding, longevity, anti-aging, TRT/HRT creators. Disclosed
   sponsorships vs undisclosed brand affiliations. Common content
   formats (cycle logs, product reviews, comparisons, "research" deep-
   dives).
3. **TikTok / Instagram.** Vendor-owned accounts. Compliance-language
   patterns. "Education" or "review" pivot accounts that funnel to
   vendors. Hashtag taxonomy actually used (looksmaxxing, mogging,
   mewing, hardmaxxing, jestermaxxing, biohacking, gym/fitness
   adjacent — derive from observed posts, do not assume).
4. **X (Twitter).** Use compared to other platforms.
5. **Reddit.** Subreddit map: r/Peptides, r/PeptideTalk,
   r/PeptidesForSale, r/Steroids, r/Sarms, r/Nootropics,
   r/MoreNutrition, r/MorePlatesMoreDates, r/SARMSourceTalk,
   looksmaxxing subs, biohacking subs, and any others surfaced. For
   each: member count, weekly active post volume, source-review
   thread structure, how trust is established and lost, moderator
   stance on vendor self-promotion, ban patterns, role of pinned
   source lists.
6. **Specialized forums.** Meso-Rx, Anabolic Steroid Forums, Anabolic
   Minds, EliteFitness, Evolutionary.org, MuscleGurus, Peptide
   Underground, longevity forums. Source-review subforums, vendor
   sponsorship structures, paid forum advertising slots.
7. **Telegram, Discord, private groups.** Public-facing entry points;
   role of private channels; how vendors get introduced; flash-sale
   and promo patterns.
8. **Influencer / creator economy.** Named tiers of relevant creators
   in fitness, looksmaxxing, biohacking, and alpha Gen Z mogging.
   Sponsorship structures, ranges of compensation where discoverable,
   discount-code economics, whitelisting/content-licensing,
   affiliate-program structures, FTC-disclosure handling.
9. **Podcasts and newsletters.** Niche shows accepting category-
   adjacent sponsorships. Pricing where discoverable.
10. **Email and SMS.** Capture mechanics, welcome sequences,
    educational drips, promotional cadence, abandoned cart, platform
    choice (Klaviyo/Mailchimp/SendGrid/self-hosted/etc.),
    deliverability posture, observable subject-line and CTA
    patterns.
11. **SEO content marketing.** "Research peptide education" content
    economy. Sites that rank for category terms and how they
    monetize.
12. **Adjacent paid platforms.** Crypto-adjacent ad networks, fitness-
    vertical programmatic, harm-reduction-adjacent placements, any
    network that takes the category. Native ad networks. Sponsored
    placements on review aggregators.
13. **Word of mouth and community embedding.** How brand reputation
    actually spreads. Lifecycle from launch to first organic forum
    mention. Behaviors that accelerate or kill it.
14. **In-person.** Bodybuilding expos, biohacking conferences, gym-
    scene marketing, sponsored athletes.
15. **Indirect / gray-channel framing.** "For research use only" and
    educational framing. Nootropics/biohacking adjacency as funnel
    entry. Longevity/anti-aging communities (Attia, Bryan Johnson,
    Huberman audiences). Compounding-pharmacy and clinical-adjacent
    legitimacy plays.

**For each channel produce per `PILLAR_B_SCHEMA.md`.** Two parallel
postures must be tracked separately throughout: **Posture A "Clean
Clinical Labs"** and **Posture B "Meme-Coded Community"** (defined in
`combined_context.md` §1.5). A channel may be a fit for one and not
the other.

**End of Mandate B.** Produce a ranked recommendation of the three to
five channels a new throwaway-brand entrant should focus on first,
**separately for Posture A and Posture B**, with explicit reasoning
grounded in captured evidence. File spec in §9.7.

### 2.3 Mandate C — Pricing Intelligence & Product Catalog Benchmarking

**Goal.** Build a complete reference dataset of every SKU at every
vendor in the universe, with per-mg pricing comparison, per
`PILLAR_C_SCHEMA.md`.

**Required peptide coverage at minimum** (expand as discovery
surfaces commercially significant additions): BPC-157, TB-500,
Selank, Semax, Epithalon, GHK-Cu, KPV, Thymosin Alpha-1, PT-141
(Bremelanotide), Ipamorelin, CJC-1295 (with and without DAC),
GHRP-2, GHRP-6, Hexarelin, MK-677 (Ibutamoren), IGF-1 LR3, MGF
(PEG-MGF), AOD-9604, Fragment 176-191, Follistatin 344, DSIP, Dihexa,
NAD+ peptide variants, LL-37, MOTS-c, SS-31, Humanin, 5-Amino-1MQ,
FGL, Pinealon, Cerebrolysin (where available), Semaglutide,
Tirzepatide, Retatrutide.

**For each peptide, capture per vendor:** every form (vial
lyophilized, pre-mixed, nasal spray, oral, topical), every
concentration and size, list price, sale price if any, per-mg price
calculated, volume discount tiers, bundle pricing, sale-frequency
observations, cryptocurrency discount rate, auto-ship/subscription
pricing.

**Additionally document:**

- Which peptides are persistently out of stock across multiple vendors
  (demand/supply signal).
- Which peptides are exclusive or rare among vendors.
- Which combinations are marketed as stacks and at what price points.
- How vendor pricing correlates with quality indicators (COA
  availability, lab testing, brand reputation captured in Mandate A).
- Any observable price collusion, cartel-like uniformity, or
  aggressive undercutting — present as observation, not accusation,
  with supporting evidence.

**End of Mandate C.** Produce two artifacts:

- **C.dist** — `sku_distributions.md`. For every category-staple
  peptide (the named list above plus any others appearing in ≥3
  vendors), price distribution: lowest, median, highest, names of
  vendors at each end, identified outliers and explanations. File
  spec in §9.8.
- **C.memo** — `opening_sku_recommendation.md`. A 1-page memo to the
  operator: which 5–10 SKUs to launch with, what dose, what to price
  each at to land at competitive median or slightly below (with
  explicit per-mg numbers), what bundle to offer at launch, what
  introductory promotion to offer. Backed by the data, not opinion.
  File spec in §9.9.

### 2.4 Cross-mandate deliverables

- **`coverage_report.md`** (§9.10) — every vendor's status, every
  failed fetch with reason, fields with the highest uncertainty rate
  and why, follow-ups for hand investigation.
- **`executive_summary.md`** (§9.11) — ≤600 words, top 10 actionable
  findings ranked by impact relative to the operator's small capital
  and short timeline. Each finding cites the artifact that supports
  it.

---

## Section 3. The Anti-Cheat Covenant

These rules are non-negotiable. Each rule has a written test
condition. If you produce work that fails any test, the work is
rejected and re-done — including if you have to throw away days of
output.

### Rule 1 — No fabrication, ever.

If you cannot fetch a vendor's page, the profile gets
`fetch_status: "failed"` and the affected fields get `"uncertain"`. You
do not infer a vendor's disclaimer language from "what vendors
usually say." You do not infer prices from "typical market prices."
You do not invent SKUs. You do not write a plausible URL and treat it
as fetched. You do not paraphrase the gist of a forum thread you did
not actually read.

**Test.** For any field with a non-`"uncertain"` value, run:

```bash
grep -F -- "<the captured value>" 03_raw_fetches/<slug>/*.md
```

If the verbatim value (or the verbatim source string from which the
value was extracted) does not appear in any saved raw fetch, the
field is fabricated. **Failure mode**: vendor profile rejected,
re-do from scratch, and append the incident to
`coverage_report.md` § "Audit Findings".

### Rule 2 — Verbatim evidence for every non-trivial claim.

Every non-trivial claim in a profile (and every paragraph in a
synthesis document) has a corresponding entry in the evidence file
with a verbatim quoted excerpt from the actual fetched page, the URL,
the timestamp, the path to the saved raw artifact, and the line range
within that artifact (per §6).

If you cannot produce a verbatim excerpt, you cannot make the claim.
Mark the field `"uncertain"` and explain in `uncertainty_notes`.

**Test.** `tools/audit_evidence.sh` (the operator may write this; you
must produce outputs structured to make it trivial). Spec: for each
non-uncertain field, the field's evidence entry's `[QUOTE]` block must
grep successfully against the file at `[RAW_ARTIFACT]`. Zero false
positives.

### Rule 3 — No copy-paste between vendors.

Each vendor's hero copy, footer disclaimers, product descriptions,
disclaimer language, and policy text must be captured fresh from that
vendor's actual pages. If you find yourself about to copy a claim
from one profile into another, **stop and re-fetch** the second
vendor.

**Test.** Run a 5-gram overlap check across `homepage.hero_copy_excerpt`,
`homepage.footer_disclaimers`, `product_page_anatomy.exact_disclaimer_language`,
and `product_page_anatomy.description_copy_excerpt` between every pair
of profiles. Overlap > 20% on any pair = re-fetch the vendor with the
later `fetched_at` and confirm. **Failure mode**: silent overlap above
threshold = both profiles flagged for re-do.

### Rule 4 — Honesty over helpfulness.

If a field cannot be determined without fabrication, write
`"uncertain"` and continue. "I don't know" is a valid output. A
profile with 30% `"uncertain"` fields and 70% verified fields is more
valuable than a profile with 100% confident fields where 30% are
made up.

**Test.** Profile-level audit: do all `"uncertain"` values have a
matching reason in `uncertainty_notes`? If not, the profile is
incomplete.

### Rule 5 — Verification spot-check every 10 vendors.

After every batch of 10 vendors profiled, pick 2 vendors at random
from that batch. Re-fetch their homepage and one product page each.
Compare what you re-fetched against what you saved. If anything
differs (allowing for minor changes like pricing rotation), the
original profile is compromised: log the discrepancy in
`coverage_report.md`, **re-do the profile from scratch**.

**Test.** `discovery_pass_log.md` records every spot-check run, the
two vendors selected, and the diff outcome. Missing log entry =
covenant violation.

### Rule 6 — No summarizer-script shortcut.

You do not write a script that fetches HTML and pipes it to a model
to "summarize" the page, then treat the summary as your reading. You
read the actual rendered text yourself for every claim you make.
Saved raw markdown is canonical; quotes come from it.

**Test.** Every `[QUOTE]` block must be byte-identical to a substring
of its `[RAW_ARTIFACT]` file. A "summary that captures the gist" will
not byte-match.

### Rule 7 — No premature termination of the vendor universe.

Tier 3 vendors get a baseline profile. The vendor list is the vendor
list. You do not get to "skip the small ones" or "focus on the
important ones." If you cannot reach baseline coverage on a vendor,
that is `fetch_status: "failed"` plus a written reason in coverage
report — it is not a "this one isn't important" decision.

**Test.** For every vendor name appearing anywhere in
`discovery_log.jsonl` or `vendor_universe.csv`, there must be either a
profile JSON (any status) or a documented exclusion in
`coverage_report.md` with reason. No silent omissions.

### Rule 8 — No completion claims without verification.

Before announcing any vendor done, run §10's per-vendor self-audit
checklist. If any item fails, the vendor is not done. Before
announcing the mission done, run §10's mission self-audit. 100% pass
required.

**Test.** §10 is the test.

### Rule 9 — Don't bypass anti-bot, captcha, or paywalls.

If a vendor's site has technical characteristics that prevent
reliable fetching — heavy JS that survives `browse` skill, cloudflare
challenges that don't yield to stealth, region-locked content, login
walls — document the obstacle in `uncertainty_notes`, mark affected
fields `"uncertain"`, and move on. Do not write workaround scripts
that bypass anti-scraping protections. That crosses into territory
this project will not be in.

**Test.** No file in the project executes against a target site
unauthenticated header injection, captcha-solver API calls, or
purchased session cookies. Code review looks for these.

### Rule 10 — Stop and report when stuck.

If you have attempted a vendor 3 times with different approaches
(WebFetch → `gstack browse` → Wayback Machine /
archive.org) and cannot produce a baseline profile, log
`fetch_status: "failed"`, append a NOTE entry to `coverage_report.md`
explaining what you tried and what blocked you, and proceed to the
next vendor. Do not loop forever.

**Test.** `coverage_report.md` has one NOTE entry per `failed`
profile. Failed profiles count > 0 with no NOTEs = covenant
violation.

### Rule 11 — Mandatory raw-fetch artifact retention.

Every fetched page is saved to `03_raw_fetches/<slug>/<page_id>.md`.
Filename pattern: `homepage.md`, `product_<n>__<sku-slug>.md`,
`tos.md`, `refund.md`, `shipping.md`, `coa_<n>.md`, `blog_<n>.md`,
`checkout_step_<n>.md`. Each file's first 5 lines are a YAML
front-matter block:

```
---
url: https://...
fetched_at: 2026-05-06T12:34:56Z
fetch_method: webfetch | gstack-browse | archive-org
sha256: <hash of the body below>
---
```

The body below the front matter is the rendered markdown / text the
agent actually read. Profiles cite line numbers within these files.

**Test.** Every URL in any profile or evidence entry must appear in
exactly one raw artifact's `url:` front-matter, and the recorded
sha256 must match the body. A mismatch = the artifact was edited
after fetch, treat as compromised.

### Rule 12 — Quotes must be findable.

Every `[QUOTE]` block in evidence must be reproducible by grepping
its `[RAW_ARTIFACT]` file. Run a verification grep on every claim
before declaring a vendor done.

**Test.** For each evidence entry:

```bash
grep -F -- "$(extract_quote evidence/<slug>.txt <claim_id>)" \
  03_raw_fetches/<slug>/<page_id>.md
```

Exit code must be 0. Zero false positives across the dataset.

### Rule 13 — No fake URLs.

Every URL written into a profile or synthesis document must have a
corresponding successful fetch entry in `discovery_log.jsonl` with
`status: "ok"` and a saved raw artifact (per Rule 11).

**Test.** Set-difference: URLs cited in profiles minus URLs in
discovery log with status ok = empty set.

### Rule 14 — No fabricated vendor names.

Every vendor name in `vendor_universe.csv` traces to ≥1 discovery
source logged in `discovery_log.jsonl` with provenance: which search
engine + query, or which forum thread URL, or which influencer
description URL, or which backlink page surfaced this vendor.

**Test.** For each vendor row in `vendor_universe.csv`, at least one
discovery_log entry exists with a `discovery_source_url` field
pointing to the page where the vendor name was first observed.

### Rule 15 — 5-gram cross-vendor overlap check.

Hero copy, footer disclaimers, and product description excerpts must
have <20% 5-gram overlap with already-completed vendors. Above
threshold = re-fetch flag.

**Test.** Operator runs:

```bash
python tools/ngram_overlap.py 02_claude_code_outputs/vendors/
```

Pairs with overlap >20% on any of (hero_copy_excerpt,
footer_disclaimers, exact_disclaimer_language,
description_copy_excerpt) = covenant violation.

### Rule 16 — Zero-tolerance placeholder text.

Profiles containing any of: `"TBD"`, `"TODO"`, `"...."`, `"placeholder"`,
`"lorem"`, `"[insert]"`, `"fill in"`, empty strings (`""`) in any non-
uncertain field = auto-failed. Either a verbatim value or
`"uncertain"` with reason. Nothing else.

**Test.**

```bash
grep -E '"(TBD|TODO|placeholder|lorem|\[insert\]|fill in)"' \
  02_claude_code_outputs/vendors/*.json
```

Exit code 1 (no matches) is required.

### Rule 17 — Field-completion ratio gate.

A profile is `fetch_status: "ok"` only if ≥70% of schema fields
have non-uncertain values.

- 70-100% → `ok`
- 40-69% → `partial`
- <40% → `failed` (use baseline profile only)

The ratio is computed over the union of (a) required schema fields
for the vendor's tier and (b) any optional fields you populated.

**Test.** Tooling computes per-profile ratio and compares declared
status. Mismatch = correct the status.

### Rule 18 — One quote per claim, not one quote per profile.

Don't load-bear a single fetched page for 30 fields. Every claim
cites the page that actually contains the source for that claim. If
your evidence entries reference the same `[RAW_ARTIFACT]` 30 times in
a row, audit yourself: are 30 distinct claims really sourced from
the same page, or are you over-extending one fetch?

**Test.** Per-vendor evidence entries / per-vendor raw artifacts
should yield a ratio reasonable for the schema. Outliers (>10
claims from one artifact for a Tier 1 vendor) trigger manual review.

### Rule 19 — Inferred fields require [INFERENCE] block, not [QUOTE].

If you cannot capture a field with a verbatim quote but can
reasonably infer it from multiple supporting quotes, record it with
an `[INFERENCE]` block (per §6.4) instead of a `[QUOTE]`. Inference
requires:

- ≥2 supporting quotes from saved raw artifacts.
- Explicit reasoning: why these quotes support this inference.
- Mark the field `"<inferred value>"` and add an entry in
  `uncertainty_notes` describing the inference and its support.

Inferred fields count toward the uncertainty pool, not the verified
pool, for Rule 17 ratio purposes.

**Test.** Each `[INFERENCE]` block has ≥2 supporting `[SUPPORT_QUOTE]`
sub-blocks. Each sub-block grep-matches its raw artifact (Rule 12).

### Rule 20 — Honest tier downgrades.

If a vendor's evidence falls short of intended tier, document the
downgrade reason in the profile's `tier_rationale` field and in
`coverage_report.md`. Don't silently lower tier.

**Test.** Profiles where `tier` differs from the operator's seed
list assignment must have a non-empty `tier_rationale`.

### Rule 21 — Independent re-verification.

Every 10 vendors profiled, dispatch a fresh `Explore` subagent to
re-profile ONE random vendor with no access to your original
profile. Compare the fresh profile to the original field by field.
Discrepancies → flag both versions, adjudicate against the saved
raw artifacts, log the adjudication in `coverage_report.md` § "Re-
Verification Adjudications".

**Test.** Per 10 completed profiles, exactly one entry in the
re-verification log. Missing entries = covenant violation.

### Rule 22 — TaskCreate task per vendor.

Every vendor in `vendor_universe.csv` gets an explicit task created
via `TaskCreate`. Status is `in_progress` while profiling,
`completed` only after §5 step 14 passes for that vendor. No task =
vendor not yet profiled.

**Test.** `TaskList` count of completed tasks matches count of
completed profile JSONs (any status `ok`/`partial`/`failed` counts
as profiled). Missing tasks = vendor wasn't tracked.

### Rule 23 — Discovery convergence proof.

The vendor universe is "complete" only after ≥5 full discovery
passes AND a final pass surfaced zero new vendors. The cumulative
count curve is recorded in `discovery_pass_log.md`.

**Test.** `discovery_pass_log.md` shows ≥6 passes (5 + the
zero-add proof pass), with monotonic non-decreasing cumulative
count, last delta = 0.

### Rule 24 — Inputs are not evidence.

No claim in any output cites `combined_context.md`,
`research_directive.md`, `PILLAR_*_SCHEMA.md`, or any other input
file as evidence. Inputs are orientation. Citing an input = covenant
violation.

**Test.** `grep` evidence files for input filenames; zero hits
required.

### Rule 25 — Pre-completion audit.

§10's mission audit must pass 100% before announcing "mission
complete." Failing the audit = work continues. Posting completion
without the audit log attached = covenant violation.

**Test.** `final_audit_log.md` exists, has 100% green checkmarks
across §10's checklist, was generated *after* the last profile
update (timestamp comparison).

---

## Section 4. Required Skill Invocations

You **must** invoke the following superpowers and gstack skills at
the named gates. Skipping a required invocation is a covenant
violation. Announce each invocation in your output ("Using <skill>
to <purpose>") so the operator can verify.

| Gate | Required skill | Purpose |
|------|----------------|---------|
| Session start | `superpowers:using-superpowers` | Onboarding; loaded automatically |
| Before scoping the discovery strategy | `superpowers:brainstorming` | Make sure the discovery approach is broad enough; surface forum, backlink, archive sources you might miss |
| Before Phase 1 begins | `superpowers:writing-plans` | Produce the formal execution plan saved to `docs/superpowers/plans/<date>-peptide-vendor-research.md`. Operator approval gates Phase 1. |
| Per-batch (every 10 vendors) | `superpowers:subagent-driven-development` | Dispatch a per-vendor profiling subagent per vendor in the batch; review subagent output before accepting |
| For Rule 21 re-verification | `superpowers:dispatching-parallel-agents` | Independent verifier subagent for one random vendor per batch |
| Before declaring any vendor done | `superpowers:verification-before-completion` | Run §5 step 14 and §10's per-vendor checklist; collect evidence |
| On any 3-attempt fetch failure | `superpowers:systematic-debugging` | Root-cause the failure (DNS? geofence? bot wall? site dead?) before logging `failed` |
| Before final dataset publish | `superpowers:requesting-code-review` | Treat the dataset as code; request a review-grade pass |
| When the operator returns review feedback | `superpowers:receiving-code-review` | Receive corrections rigorously; do not perform agreement |
| For JS-rendered or Cloudflare-protected vendor sites | `gstack:browse` | Real headless Chromium with stealth |
| For visible dogfooding of a checkout flow if WebFetch and browse both fail | `gstack:connect-chrome` | Watchable browser; manual verification |
| For independent adversarial review of finished outputs | `gstack:codex` | Codex-as-second-opinion on a sampled set of profiles before final publish |
| At final completion | `superpowers:finishing-a-development-branch` | Decide how to hand the dataset back (commit / PR / archive) |

If a gate's skill is unavailable in your environment, document that
gap in `coverage_report.md` § "Skill Gaps" with the alternative path
you took.

---

## Section 5. Per-Vendor Workflow Protocol

For each vendor, execute the following 14 steps in order. Do not
skip steps. Do not parallelize within a single vendor — parallelize
*across* vendors via subagent dispatch (§4).

### Step 1 — Discovery entry & tier assignment

Vendor surfaces in §7's discovery loop. Add to
`vendor_universe.csv` with provenance. Assign initial tier per §7.4.
Open a TaskCreate task (Rule 22).

### Step 2 — Approach selection

Choose initial fetch tooling: WebFetch is the default. Switch to
`gstack:browse` if the site is React/Vue/Angular SPA, has a
Cloudflare interstitial, or has anti-bot detection that breaks
WebFetch. Switch to archive.org if the live site is dead or
unreachable.

### Step 3 — Homepage fetch

Fetch the homepage. Save the raw rendered text to
`03_raw_fetches/<slug>/homepage.md` per Rule 11's front-matter
format. Append entry to `discovery_log.jsonl`:

```json
{"vendor_slug": "<slug>", "url": "...", "ts": "...",
 "fetch_method": "webfetch|gstack-browse|archive-org",
 "status": "ok|partial|failed", "raw_artifact": "...",
 "notes": "..."}
```

If `failed` after 3 attempts (different methods), follow Rule 10:
log a NOTE in coverage report and stop on this vendor.

### Step 4 — Catalog walk

From the homepage, locate the catalog/shop URL. Fetch it. Enumerate
SKU URLs (a flat list of every product page on the site). Save the
catalog page itself as
`03_raw_fetches/<slug>/catalog_<n>.md` (paginated → multiple files).
Build an internal SKU URL list.

### Step 5 — Product page fetch

For Tier 1: fetch every SKU URL. For Tier 2: fetch every SKU URL
(same depth — see §2.3 — pricing matters for Pillar C). For Tier 3:
fetch the headline SKUs (the named peptides in §2.3 if present, plus
any others that come for free in the same fetch pass).

Save each as `03_raw_fetches/<slug>/product_<n>__<sku-slug>.md`.
Extract `product_page_anatomy` for the representative product (one
per category) per §6's evidence protocol.

### Step 6 — Compliance pages

Fetch TOS, refund policy, shipping policy, COA index page (if
present), age-gate page (if present), jurisdictional restriction
page (if present). Save each. Extract `trust_compliance` fields
with verbatim disclaimer quotes per §6.

### Step 7 — Checkout walk (no purchase, no account, no fake KYC)

Add a representative SKU to cart. Walk to the payment-method
selection screen. Capture: account-required vs guest checkout,
fields collected, ID-verification screens if any, named payment
methods, named shipping carriers, cost structure as displayed,
international policy as displayed.

**You will not** create an account, submit fake payment info,
submit fake KYC documents, or bypass any platform check. If the
checkout requires account creation to view payment methods, log
that fact and capture what you can.

If you used `gstack:browse`, save a screenshot of the payment
screen as `03_raw_fetches/<slug>/checkout_payment.png` (the .md
front-matter for that step references the screenshot).

### Step 8 — Tech stack signals

`view-source:` the homepage and one product page. Read the response
headers. Note: platform signal (Shopify? WooCommerce? custom?), CDN,
analytics scripts loaded (GA, GTM, Plausible, Fathom, Heap, etc.),
marketing pixels (FB, TikTok, Pinterest, Twitter), chat widget
(Intercom, Drift, Crisp, Tawk, etc.). Save the source/headers
output as `03_raw_fetches/<slug>/source_homepage.md`. Extract
`tech_stack` per schema.

### Step 9 — Content footprint

Locate the blog or "education" section. Walk it. Count posts,
estimate cadence, capture topic taxonomy, note author bylines,
note internal-link density to product pages. Save up to 5
representative posts as `blog_<n>.md`.

### Step 10 — Social proof

Off-site review aggregators (Trustpilot, niche aggregators), forum
review threads (link to specific threads cited by the vendor or
referenced in discovery), testimonial usage on-site, visible
influencer endorsements on-site. Save linked-out aggregator pages
as `social_<n>.md` if accessible.

### Step 11 — SKU enumeration with full pricing (Mandate C)

For every SKU captured: name, peptide(s), dose (mg or mcg), format,
list price, sale price (null if none), per-mg price (compute),
volume tiers, bundle membership, crypto-discount rate, sub/auto-
ship pricing, URL. Save into the profile's `skus` array per the
schema.

### Step 12 — Profile JSON assembly

Assemble `02_claude_code_outputs/vendors/<slug>.json` per
`PILLAR_A_SCHEMA.md` (with the §6 evidence-link extensions from
this directive). Include `tier_rationale`, `field_completion_ratio`,
`fetch_status`, and full `uncertainty_notes`.

### Step 13 — Evidence file assembly

Assemble `02_claude_code_outputs/evidence/<slug>.txt` per §6's
format. One entry per non-trivial claim. Each entry contains
`[CLAIM] [URL] [FETCHED_AT] [RAW_ARTIFACT] [LINE_RANGE] [QUOTE]` (or
`[INFERENCE]` per §6.4).

### Step 14 — Per-vendor self-audit (gate to "completed")

Run all of the following. Mark the TaskCreate task
`completed` only if 100% pass:

- [ ] Profile JSON parses (`python -m json.tool < <slug>.json`).
- [ ] Evidence file exists.
- [ ] Every non-`"uncertain"` field has ≥1 evidence entry.
- [ ] Every `[QUOTE]` block grep-matches its `[RAW_ARTIFACT]`.
- [ ] Every URL in the profile appears in `discovery_log.jsonl`
      with `status: "ok"`.
- [ ] No placeholder strings (Rule 16).
- [ ] Every `"uncertain"` field has a reason in `uncertainty_notes`.
- [ ] Field-completion ratio computed and matches declared
      `fetch_status` (Rule 17).
- [ ] 5-gram overlap check vs already-completed vendors (Rule 15)
      — if >20%, re-fetch.
- [ ] Every `[INFERENCE]` block has ≥2 grep-matching support quotes
      (Rule 19).
- [ ] Tier rationale documented if downgraded (Rule 20).

If anything fails, **the vendor is not done.** Fix or roll back.

After every 10 completed vendors, run Rule 5 spot-check and Rule 21
re-verification.

---

## Section 6. Per-Claim Evidence Protocol

The evidence file at `02_claude_code_outputs/evidence/<slug>.txt`
contains one **entry** per non-trivial claim in the profile.
Entries are separated by blank lines. The format is strict.

### 6.1 Entry format (verbatim quote)

```
[CLAIM] <field path in JSON, e.g. homepage.hero_copy_excerpt>
[URL] <full URL fetched>
[FETCHED_AT] <ISO 8601 timestamp>
[FETCH_METHOD] <webfetch | gstack-browse | archive-org>
[RAW_ARTIFACT] 03_raw_fetches/<slug>/<page_id>.md
[LINE_RANGE] <start_line>-<end_line>
[QUOTE]
"<verbatim text from the page, ≤500 chars, including any quotation
marks or punctuation present in source>"
[/QUOTE]
```

### 6.2 Multiple-source claims

If a claim is supported by multiple sources, repeat the
`[URL] [FETCHED_AT] [FETCH_METHOD] [RAW_ARTIFACT] [LINE_RANGE]
[QUOTE]/[/QUOTE]` block within the same `[CLAIM]` entry. Do not
collapse multiple sources into a single quote.

### 6.3 Claims about catalog-wide attributes

Claims like `catalog.sku_count: 47` cite the URL where the count
was derived (catalog index page) and a quote showing the pagination
or count indicator. If the count was derived by enumerating saved
artifacts, the `[QUOTE]` block reads:

```
[QUOTE]
[ENUMERATION] Counted from 03_raw_fetches/<slug>/product_*.md:
47 saved artifacts (filenames listed below).
[FILES]
product_001__bpc-157-5mg.md
product_002__tb-500-10mg.md
...
[/QUOTE]
```

### 6.4 Inferred-field block (per Rule 19)

```
[CLAIM] <field path>
[INFERENCE] <inferred value, exactly as stored in the profile>
[REASONING]
<one to three sentences explaining the inference>
[/REASONING]
[SUPPORT_QUOTE]
[URL] ...
[FETCHED_AT] ...
[RAW_ARTIFACT] ...
[LINE_RANGE] ...
"<verbatim quote 1>"
[/SUPPORT_QUOTE]
[SUPPORT_QUOTE]
[URL] ...
[FETCHED_AT] ...
[RAW_ARTIFACT] ...
[LINE_RANGE] ...
"<verbatim quote 2>"
[/SUPPORT_QUOTE]
```

Inferred fields count toward the uncertainty pool for Rule 17.

### 6.5 What counts as "non-trivial"

Trivial (no evidence entry needed):

- `vendor_slug`, `brand_name` (already stored as identifiers).
- `fetched_at`, `fetched_url` (the entry itself is the evidence).

Everything else is non-trivial and needs an entry.

---

## Section 7. Discovery, Tiering, and Termination

### 7.1 The discovery loop

Discovery is iterative. A pass consists of running every discovery
source below once and adding any new vendor names found to
`vendor_universe.csv` with provenance.

**Discovery sources (each pass runs all of these):**

1. **Search engines.** Google, Bing, DuckDuckGo, Brave, Yandex.
   Queries: `"research peptides" buy`, `"BPC-157" site:reddit.com`,
   `"peptide source" review`, `"<peptide name>" vial`,
   `peptide vendor list`, `peptide source list`,
   `intitle:"peptides" -clinical -trial`, plus brand-name probes
   for any vendor surfaced.
2. **Forum source-list mining.** Walk pinned/locked source-list
   threads in: r/Peptides, r/PeptideTalk, r/PeptidesForSale,
   r/Steroids, r/Sarms, r/Nootropics, r/MoreNutrition,
   r/MorePlatesMoreDates, r/SARMSourceTalk; Meso-Rx; Anabolic
   Steroid Forums; Anabolic Minds; EliteFitness; Evolutionary.org;
   MuscleGurus; Peptide Underground; longevity forums.
3. **Backlink graphs.** For every vendor identified, run a
   "<vendor brand> competitors" query and a "<vendor brand>
   alternatives" query. Mine outbound links and "related vendor"
   citations.
4. **Influencer description mining.** YouTube descriptions, TikTok
   bios, Instagram bios, podcast show notes for fitness /
   biohacking / longevity creators surfaced via Pillar B.
5. **Telegram and Discord public link aggregators.** Public
   directories that index links to peptide-adjacent communities.
6. **Wayback Machine archives.** archive.org for known-defunct
   vendors and for "competitor" sections of major vendor sites
   that have been edited down.
7. **Niche aggregators / Google Shopping.** Peptide-specific
   directories and review aggregators (Trustpilot category pages,
   etc.).
8. **Foreign-language probes.** English-named brands that operate
   via non-English satellite sites (`<brand> español`, `<brand>
   deutsch`, etc.) — discovery only; profile only if the satellite
   ships into the US per scope.

Each source's pass output is appended to `discovery_pass_log.md`
with: pass number, source name, queries run, count of new vendors
added.

### 7.2 Convergence

The universe is "complete" only when:

- ≥5 full discovery passes have run, AND
- A final pass surfaces 0 new vendors (zero-add pass).

**Cumulative count curve recorded in `discovery_pass_log.md`** with
a row per pass: `pass_num, ts, total_universe, delta_added`.

### 7.3 Vendor universe file

`02_claude_code_outputs/vendor_universe.csv` columns:

```
slug,brand_name,primary_domain,first_seen_pass,
discovery_source_url,discovery_source_quote,assigned_tier,
tier_rationale,profile_status
```

Updated after every pass. Never overwritten in place — each update
is a new file commit (or in non-git environments, a backup at
`vendor_universe_pass<n>.csv`).

### 7.4 Tier assignment criteria

Tier 1 (deepest treatment, full schema, every SKU):
- Recognizable brand mentioned by ≥3 independent forum threads
  (r/Peptides, MesoRx, EliteFitness equivalent), OR
- Top-100 Alexa/SimilarWeb ranking in the category if available, OR
- Listed in any subreddit's pinned source list, OR
- Currently appears in r/Peptides "trusted vendors" sidebar /
  community-maintained list, OR
- Operator's seed list (§2.1's anchor vendors).

Tier 2 (every SKU minimum-fields, schema as deep as site exposes):
- Mentioned by ≥1 forum thread with positive or mixed reputation, OR
- Active on Trustpilot or similar with ≥10 reviews, OR
- Has visible influencer endorsements / sponsorships in Pillar B.

Tier 3 (baseline profile minimum):
- Discoverable but no forum trail, no review aggregator presence,
  appears only in backlink graphs or single-mention citations.

**Tier may be downgraded** if profiling reveals less than the seed
indicated. Per Rule 20, every downgrade has a written rationale.

### 7.5 Mission termination

The mission is complete only when **every** condition holds:

- Discovery converged (§7.2).
- Every vendor in `vendor_universe.csv` has a profile JSON (any
  status) or a documented exclusion in `coverage_report.md`.
- Every Pillar A profile passes §5 step 14's audit.
- Pillar B has every channel from §2.2's taxonomy filled per
  `PILLAR_B_SCHEMA.md`, both Posture A and Posture B threads.
- Pillar C's `pricing_matrix.csv` exists with every SKU from every
  profile, plus `sku_distributions.md` and
  `opening_sku_recommendation.md`.
- §10's mission audit passes 100%.

---

## Section 8. Failure Handling and Honest Reporting

### 8.1 Three-attempt rule

Per vendor, per page, you get three fetch attempts using different
methods:

1. WebFetch (default).
2. `gstack browse` (real Chromium with stealth).
3. archive.org Wayback Machine, latest snapshot.

If all three fail for the homepage, the vendor profile is
`fetch_status: "failed"` with a baseline-only attempt. If the
homepage succeeds but a specific subpage fails after three
attempts, that subpage's fields are `"uncertain"` with reason.

### 8.2 What "fail" looks like

- HTTP non-2xx response on all three attempts.
- Captcha/anti-bot wall that browse skill cannot pass without
  bypass.
- Geoblock from your egress IP.
- Site dead (no DNS, no archive.org snapshot).

### 8.3 What is NOT a fail

- Page loaded but you didn't have time → keep working.
- Page loaded but the data wasn't where you expected → re-read.
- Page loaded but the format is unfamiliar → that's a research
  finding, not a failure.

### 8.4 Reporting failures

Every `failed` profile gets a NOTE entry in
`coverage_report.md` § "Failed Fetches":

```markdown
### <slug> (<brand_name>) — failed

- Discovered via: <source_url>
- Attempts:
  - 2026-05-06T10:14Z — WebFetch — HTTP 403
  - 2026-05-06T10:18Z — gstack browse — Cloudflare interstitial,
    challenge unsolved
  - 2026-05-06T10:24Z — archive.org — no snapshot indexed
- Conclusion: live site unreachable from current egress; no
  archived snapshot. Vendor known via <forum_url> as of
  <date>. Recommend manual investigation by operator.
```

### 8.5 Operator-visible coverage gaps

The coverage report (§9.10) tracks aggregate uncertainty: which
schema fields most often hit `"uncertain"` across the universe and
why (lack of public TOS pages? Missing COA hosting? No checkout
without account?). This is itself a finding.

---

## Section 9. Output File Specification

Everything below is produced inside the project root.

### 9.1 `02_claude_code_outputs/vendors/<slug>.json`

One JSON file per vendor in the universe. Schema:
`PILLAR_A_SCHEMA.md` plus the extensions defined in this directive
(`tier_rationale`, `field_completion_ratio`, `evidence_file`,
`raw_fetches_dir`).

### 9.2 `02_claude_code_outputs/evidence/<slug>.txt`

One evidence file per vendor. Format: §6.

### 9.3 `03_raw_fetches/<slug>/`

Per-vendor directory of saved raw fetch artifacts. File naming and
front-matter format: Rule 11.

### 9.4 `02_claude_code_outputs/discovery_log.jsonl`

One JSON line per fetch operation. Schema:

```json
{
  "vendor_slug": "...",
  "url": "...",
  "ts": "ISO 8601",
  "fetch_method": "webfetch|gstack-browse|archive-org",
  "status": "ok|partial|failed",
  "raw_artifact": "03_raw_fetches/<slug>/<page_id>.md",
  "discovery_source_url": "...",
  "discovery_source_quote": "...",
  "notes": "..."
}
```

Append-only. Never edit prior lines.

### 9.5 `02_claude_code_outputs/discovery_pass_log.md` and `vendor_universe.csv`

Per §7.2, §7.3.

### 9.6 `02_claude_code_outputs/meta_synthesis_pillar_a.md`

Three one-pagers per §2.1 endnote (A.meta.1, A.meta.2, A.meta.3).

### 9.7 `02_claude_code_outputs/acquisition_channels/<channel-slug>.md` and `02_claude_code_outputs/acquisition_synthesis.md`

Per `PILLAR_B_SCHEMA.md`. Synthesis ranks 3–5 channels for Posture
A and Posture B separately.

### 9.8 `02_claude_code_outputs/sku_distributions.md`

Per §2.3 endnote C.dist.

### 9.9 `02_claude_code_outputs/opening_sku_recommendation.md`

1-page memo per §2.3 endnote C.memo.

### 9.10 `02_claude_code_outputs/coverage_report.md`

Sections required:

- **Header** — generation timestamp, run id, agent identity.
- **Universe summary** — total vendors discovered, per-tier
  counts, per-status counts (`ok`/`partial`/`failed`).
- **Per-vendor status table** — slug, brand, tier, status, one-line
  note.
- **Failed Fetches** — per §8.4.
- **Audit Findings** — Rule 1, Rule 3, Rule 15, Rule 21
  discrepancies and how they were resolved.
- **Re-Verification Adjudications** — per Rule 21.
- **Skill Gaps** — per §4 last paragraph.
- **Aggregate Uncertainty** — schema fields most often
  `"uncertain"` and why.
- **Identified Follow-Ups** — vendors worth re-attempting later;
  channels not exposed by web fetches that the operator should
  investigate by hand.

### 9.11 `02_claude_code_outputs/executive_summary.md`

≤600 words. Top 10 actionable findings ranked by impact relative
to the operator's small capital and short timeline. Each finding
cites the supporting artifact (profile JSON or synthesis section).

### 9.12 `02_claude_code_outputs/final_audit_log.md`

Generated last, immutable thereafter. The §10 mission audit
checklist with every item marked pass/fail and the timestamp of the
check. If any item is fail, the mission is not complete.

---

## Section 10. Final Self-Audit Checklist

### 10.1 Per-vendor audit (run at §5 step 14)

See §5 step 14.

### 10.2 Mission audit (run before announcing completion)

The following must all pass. Failures = work continues.

- [ ] Discovery converged: `discovery_pass_log.md` shows ≥6 passes,
      last delta = 0.
- [ ] `vendor_universe.csv` ≥ N (where N is whatever the discovery
      loop produced; never lower).
- [ ] Every vendor universe row has either a profile JSON or a
      coverage-report exclusion entry.
- [ ] Every profile JSON parses with `json.tool`.
- [ ] Every non-uncertain claim has an evidence entry (Rule 2).
- [ ] Random sample of 20 evidence quotes greps successfully
      against their raw artifacts (Rule 12).
- [ ] 5-gram overlap check across all profiles: zero pairs above
      20% (Rule 15).
- [ ] No placeholder text (Rule 16).
- [ ] Field-completion ratios match declared statuses (Rule 17).
- [ ] All inference blocks have ≥2 grep-matching support quotes
      (Rule 19).
- [ ] Tier rationales present for every tier change (Rule 20).
- [ ] Per-batch re-verification done at every 10-vendor mark
      (Rule 21).
- [ ] TaskCreate count of completed tasks matches profile count
      (Rule 22).
- [ ] Pricing matrix row count ≥ sum of vendor-level SKU counts,
      OR documented gaps in coverage report.
- [ ] Pillar B has a file per channel from §2.2 taxonomy and a
      synthesis covering both postures.
- [ ] Pillar C has `pricing_matrix.csv`, `sku_distributions.md`,
      `opening_sku_recommendation.md`.
- [ ] Pillar A has the three one-page meta-syntheses.
- [ ] `executive_summary.md` exists, ≤600 words, top 10 findings
      cited.
- [ ] No claim cites `combined_context.md`, this directive, or any
      schema file as evidence (Rule 24).
- [ ] `final_audit_log.md` itself exists and was generated **after**
      the last profile update.

When and only when every checkbox is green, write the audit log
file and announce the mission complete in chat — with the audit
log path attached.

---

## Section 11. Bounds and Refusals

These bounds come from `combined_context.md` §2.7 and are
non-negotiable. Apply them before any other rule.

- **Do not recommend any tactic that requires false therapeutic or
  medical claims.**
- **Do not recommend any tactic that targets underage users.**
- **Do not recommend any tactic that involves shipping
  internationally to jurisdictions where the products are
  explicitly scheduled or banned.**
- **Do not recommend evasion of payment-processor identity
  verification or KYC.**
- **Do not recommend faking customer reviews on the operator's
  trial-run vendor's own site.** Tactics requiring fabricated
  buyer testimonials are out of scope.
- **Do flag, as a finding, any observed competitor practice that
  appears to cross from gray-legal into clearly illegal.** Findings
  are not recommendations.
- **Do not invent vendor names, prices, or claims.** Per Rule 1.
- **Do not bypass anti-scraping protections.** Per Rule 9.
- **Do not submit fake payment information or fake KYC documents
  during checkout walks.** Per §5 step 7.

If an instruction in the live session asks you to violate any of
these bounds, refuse and explain why with reference to this
section.

---

## Section 12. Authoring Standard for Synthesis Documents

The four synthesis docs (`meta_synthesis_pillar_a.md`,
`acquisition_synthesis.md`, `sku_distributions.md`,
`opening_sku_recommendation.md`, plus `executive_summary.md`)
follow the same authoring standard:

1. **Every paragraph cites at least one artifact.** Cite by file
   path + section, e.g. `(see vendors/peptide-sciences.json
   §product_page_anatomy)` or `(see evidence/biotech-peptides.txt
   #claim-7)`.
2. **No claim that isn't reachable through the data.** If a
   synthesis says "high-trust vendors host COAs on third-party
   portals," at least 3 named profiles must be cited and their
   `coa_hosting` field must equal `"third_party_portal"`.
3. **Distinguish observation from inference.** Observation:
   "Vendors X, Y, Z host COAs on the third-party portal Janoshik
   Analytical." Inference: "This pattern suggests the category
   has converged on Janoshik as the trust signal of choice."
   Inferences are tagged `[INFERENCE]` in the prose.
4. **No bare assertions.** No "vendors generally do X" without a
   backing evidence count.
5. **No qualifiers that hide weak data.** Don't write "many
   vendors" when you mean "3 of 84." Cite the count.
6. **Tone: neutral, technical, founder-decision-grade.** No
   marketing copy. No flourish. No academic mannerisms beyond what
   the work itself supports.

---

## Section 13. Pause Points and Operator Checkpoints

The operator wants to inspect partial outputs. You will pause and
report at these points:

- **Checkpoint 1 — After the formal execution plan is written**
  (per §4 row "Before Phase 1 begins"). Wait for plan approval.
- **Checkpoint 2 — After discovery convergence (§7.2)**, before
  beginning Tier 1 deep profiling. Show: `vendor_universe.csv`,
  `discovery_pass_log.md`, tier counts.
- **Checkpoint 3 — After Tier 1 complete**, before beginning Tier
  2. Show: count of Tier 1 profiles, audit pass rate, sample
  profile, sample evidence file.
- **Checkpoint 4 — After Tier 2 complete**, before Tier 3.
- **Checkpoint 5 — After all profiles complete, before
  cross-mandate consolidation** (Pillar B synthesis, Pillar C
  recommendations, executive summary).
- **Checkpoint 6 — Final.** Ship `final_audit_log.md` and the
  one-page summary.

At each checkpoint, post:

1. What completed since the previous checkpoint (counts).
2. What audits ran and their pass rates.
3. Any anomalies (failed fetches concentration, re-verification
   discrepancies, suspect 5-gram overlap pairs).
4. The next phase you are about to enter.
5. An explicit ask for permission to proceed.

Auto mode does not override these checkpoint pauses. They exist
because the work compounds: a quality failure in Tier 1 makes Tier
2 work worth less. The operator inspects at each gate.

---

## End of Directive

This document is your contract. If anything here is ambiguous,
**stop and ask the operator** rather than improvising. The cost of
a question is a few minutes. The cost of fabrication is the entire
mission.
