markdown

# Research Operations Playbook (v3)

> Single source of truth for executing the three-mandate peptide-market research
> project. This is a graduate-level academic market analysis of the global peptide
> retail and research supply industry, for a medical school research project requiring
> maximum scientific accuracy, depth of sourcing, and exhaustive coverage. The standard
> of rigor expected throughout is that of a pharmaceutical market entry analysis or a
> graduate thesis literature review. No stone should be left unturned.
>
> Read this overview once in full. Then for each step, copy the verbatim prompt from
> the fenced block below it, attach the listed files to the listed model, and run.

---

## CRITICAL: Model Selection for This Research Mission

Read and internalize this section before touching anything else. The model you choose
is the most consequential decision in this entire operation, and the answer depends
on tradeoffs across five dimensions: autonomous web browsing capability, tool-calling
depth, context window, cost, and output structure. This section researches and compares
every credible option before making a recommendation.

### The five dimensions that matter

**1. Autonomous web browsing capability.** This mission requires a model that can
fetch and read live web pages, forum threads, Reddit posts, Telegram channel pages,
YouTube descriptions, Wayback Machine archives, and regulatory databases without a
human in the loop for each fetch. A model that can only read documents you paste in
cannot do this job.

**2. Tool-calling depth and limits.** Deep Research agents use tools internally
(web search, click-to-read, pagination) and most platforms impose a hard or soft
cap on how many tool calls one session can make. A vendor-universe discovery pass
across hundreds of forum threads will hit single-session tool limits quickly if
they are low. This is the most underappreciated constraint.

**3. Context window.** The synthesis phase needs to hold all prior research outputs
simultaneously. The extraction phase needs to hold a full vendor site's HTML plus
prior schema context. These require different window sizes. More is always safer.

**4. Cost.** The mission is long. Per-token billing on a 100-vendor extraction pass
at premium model rates can be substantial. Monthly flat-rate plans change the math.

**5. Output structure.** Track 2 requires the model to write structured JSON and
CSV files to a local file system. No browser-only chat model can do this.

### Comparative analysis of every credible option

The following candidates were considered. Each is assessed against the five dimensions.

---

**OPTION A: ChatGPT Pro with Deep Research (OpenAI)**

Capability: OpenAI's full Deep Research agent is the current strongest available
tool for autonomous multi-step open-web research. It can browse live pages, follow
links, read forum threads, iterate across passes, and synthesize across hundreds of
sources in a single session.

Tool-calling limits: The Deep Research agent does not publish a per-session tool-call
count, but each Deep Research run is effectively unlimited within the session. It runs
until the agent declares convergence, which typically takes 20 to 45 minutes of
compute per run. The binding constraint is not per-session tool calls but the monthly
query cap: the Pro plan at $200/month provides approximately 125 full Deep Research
runs per month. NOTE: OpenAI adjusts these caps periodically. Verify the current cap
at openai.com/chatgpt/pricing before committing. Do not rely on the 125-run figure
as guaranteed.

Context window: ChatGPT's context is not user-visible during Deep Research. The
agent manages its own context internally. For the synthesis use case, the user-facing
context window is currently 128K tokens, which is insufficient to hold all research
inputs simultaneously. This makes ChatGPT a poor choice for the final synthesis step.

Cost: $200/month flat. No per-token billing on the Pro plan.

Output structure: Deep Research produces document outputs (Markdown or formatted
text) that you save manually. It cannot write files to your local file system.

Verdict: Best-in-class for broad autonomous web discovery (Track 1). Not suitable
for systematic local-file extraction (Track 2) or large-context synthesis (Step 3).

---

**OPTION B: Claude with Native Web Research (Anthropic)**

Capability: Claude's native web search capability allows web lookups during a
conversation. However, as of mid-2025, this is a tool-call-per-message model, not
a fully autonomous multi-step agent like Deep Research. The model can search and
read pages but does not autonomously iterate across dozens of passes without user
re-prompting.

Tool-calling limits: No published per-session limit, but the lack of full autonomous
iteration means it is not equivalent to a Deep Research agent for the discovery phase.
Claude's Deep Research feature (available on higher-tier plans) provides more
autonomous behavior, but it is generally considered less powerful than ChatGPT's
Deep Research on forum and community surface coverage as of 2025.

Context window: Claude Opus 4 (current as of mid-2025, verify current version at
docs.claude.com) has a 200K-token context window, making it the best available
option for the synthesis phase by a significant margin.

Cost: Claude Pro at approximately $20/month or Claude Max at approximately $100/month,
depending on usage tier. Claude Code (CLI) is billed per token on the API or included
in Max plans.

Output structure: Via Claude Code CLI, Claude can write structured JSON and CSV files
directly to a local file system, making it the best option for Track 2 extraction.

Verdict: Not the first choice for autonomous discovery (Track 1). Best available
option for systematic structured extraction with file output (Track 2) and
long-context synthesis (Step 3).

---

**OPTION C: Gemini 2.5 Pro with Deep Research (Google)**

Capability: Google's Deep Research agent is a genuine autonomous multi-step web
research tool, meaningfully capable of iterative discovery. Its coverage of general
web sources is strong. Its coverage of niche forum communities (Meso-Rx,
Evolutionary.org, bodybuilding subforums) is weaker than OpenAI's as of 2025
comparative benchmarks.

Tool-calling limits: Google does not publish a per-session tool-call limit. The
binding constraint is similar to OpenAI: a monthly query cap on the Google One AI
Premium plan. Verify the current cap at one.google.com before committing.

Context window: Gemini 2.5 Pro has a 1-million-token context window, which is
substantially larger than any competitor. This is its primary advantage.

Cost: Google One AI Premium at approximately $20/month, making it significantly
cheaper than ChatGPT Pro for equivalent Deep Research capability.

Output structure: Produces document outputs manually saved. Cannot write to local
file system.

Verdict: A credible alternative to ChatGPT Pro for Track 1 if cost is a constraint.
Weaker on niche forum surfaces. The 1M-token context window makes it worth
considering as an alternative synthesis model if Claude's 200K window proves
insufficient for large input sets.

---

**OPTION D: Perplexity Pro with Deep Research (Perplexity AI)**

Capability: Perplexity's Deep Research mode is a multi-step autonomous agent that
produces cited research reports. It is strong on general-web synthesis with inline
citations. It is weaker on niche community surfaces and iterative discovery passes
compared to OpenAI's implementation.

Tool-calling limits: Perplexity Pro offers approximately 300 Deep Research queries
per month at approximately $20/month. The higher query count at lower price makes it
attractive for volume, though per-run depth is shallower than ChatGPT Pro.

Context window: Not publicly specified at the level of detail needed for this
mission planning.

Cost: Approximately $20/month.

Output structure: Document outputs, manual save. No local file system access.

Verdict: Useful as a supplementary discovery tool or as a cheaper fallback for
lower-stakes slices. Not the first choice for the primary discovery pass given its
weaker niche-community coverage.

---

**OPTION E: Grok with DeepSearch (xAI)**

Capability: xAI's Grok with DeepSearch provides autonomous web research with
integration into X (Twitter) native content, which is a genuine advantage for
researching the X-based marketing channel. Its general-web discovery is less proven
at this mission's depth as of 2025.

Tool-calling limits: Not publicly specified in sufficient detail for mission planning.

Context window: 128K tokens as of the latest available information.

Cost: Part of the X Premium subscription or xAI standalone plan. Verify current
pricing at x.ai.

Verdict: Worth running specifically for the X (Twitter) channel slice of Mandate 2,
where its native platform access is an advantage. Not the primary discovery tool.

---

**OPTION F: Single CLI model (Claude Code only) for everything**

This option is directly addressed because the original research question raised the
web-chat-vs-CLI tradeoff explicitly.

The case for a single Claude Code CLI model: no model-switching overhead, consistent
output structure, file system access throughout, no subscription juggling.

Why it fails at this mission's scope: A Claude Code agent crawling 50 to 150 vendor
pages in a single run will exhaust its context window mid-run and begin silently
degrading quality, hallucinating details from earlier fetches, or producing fields
marked confident that are actually inferred from priors. More critically, the
autonomous iterative discovery that Deep Research agents do natively (run 8 passes
across Reddit, forums, Telegram, YouTube until convergence) requires many hours of
sequential tool calls. A CLI model doing this without Deep Research scaffolding will
hit rate limits before convergence, and the user must restart and re-orient the model
manually each time.

The conclusion: CLI is essential for structured extraction (Track 2) but should not
be the discovery engine (Track 1).

---

### Web chat model vs. CLI model: the direct tradeoff

You asked for explicit reasoning on this.

**Web chat models (ChatGPT Deep Research, Gemini Deep Research, Perplexity):**
- Pro: Fully autonomous, no setup, no environment management.
- Pro: Optimized for iterative open-web discovery.
- Pro: Produce narrative research reports naturally.
- Con: Cannot write structured files to your local system.
- Con: Context window fills during long sessions, then the agent summarizes or
  drops earlier findings.
- Con: Monthly query caps create a hard limit on how many runs you can do.
- Con: You cannot inspect mid-run state; the agent runs and you see results at end.

**CLI models (Claude Code):**
- Pro: Persistent file system access. Writes per-vendor JSON, CSVs, logs in real time.
- Pro: You can inspect output mid-run, correct errors, and resume.
- Pro: No per-run cap on the Max plan; billed per token.
- Pro: Full programming and shell capability for aggregations (pricing matrix
  assembly, OOS cross-vendor analysis, etc.).
- Con: Not a Deep Research agent. Does not autonomously run 8-pass iterative
  discovery without explicit prompting.
- Con: Context fills with per-vendor HTML; systematic quality degrades without
  explicit context management.

**The answer:** use both in sequence. Web chat (ChatGPT Pro) for discovery and
channel analysis (Track 1). CLI (Claude Code) for per-vendor extraction and pricing
matrix assembly (Track 2). Web chat (Claude via claude.ai Projects) for synthesis
(Step 3). Each tool is doing the one thing it is built for.

---

### Tool-calling limits: what to actually expect

| Platform | Tool-call model | Known limit | Binding constraint |
|---|---|---|---|
| ChatGPT Pro Deep Research | Autonomous agent, unlimited internal tool calls per run | ~125 full runs/month | Monthly run cap |
| Gemini Deep Research | Autonomous agent | ~50 runs/month (verify) | Monthly run cap |
| Perplexity Deep Research | Autonomous agent | ~300 runs/month | Per-run depth, not count |
| Claude Code (Max plan) | Per-tool-call, billed | No hard call cap | Context window and rate limits |
| Grok DeepSearch | Autonomous agent | Not publicly specified | Unknown |

NOTE: Every one of these figures is subject to change. Verify all caps and pricing
at the official platform documentation pages before starting. The table above reflects
the best available information as of mid-2025.

---

### Model recommendation by role

**TRACK 1 (Broad Web Discovery): ChatGPT Pro with full Deep Research**
- Plan: OpenAI Pro at $200/month.
- Setting: In the composer, click the tools button and select Deep Research
  (the full agentic version, not the lightweight one).
- This mission uses 6 of your monthly Deep Research runs.
- Alternative if cost is a constraint: Gemini 2.5 Pro Deep Research via Google
  One AI Premium ($20/month). Weaker on niche forum surfaces; stronger context
  window for synthesis.
- Alternative for the X/Twitter channel slice only: Grok DeepSearch, for its
  native X platform access.

**TRACK 2 (Systematic Extraction): Claude Code CLI**
- Plan: Claude Max plan for unlimited-ish Claude Code usage, or Claude Pro
  if vendor count is under 50.
- Start Claude Code in your terminal with `claude` and paste the Track 2 driver
  prompt verbatim.
- Model used inside Claude Code: the current frontier Opus model. As of mid-2025,
  this is Claude Opus 4. IMPORTANT: Anthropic updates model strings with each
  release. Before running, verify the current model string at docs.claude.com.
  If you configure a model string manually, do not hardcode a specific version;
  use the alias `claude-opus-4-latest` if that alias is available at the time
  you run. If not, check docs.claude.com for the current Opus 4 model string.
  If Opus 4 is rate-limited, fall back to the current Sonnet model, which
  maintains strong extraction accuracy at higher throughput.

**STEP 3 (Final Synthesis): Claude in claude.ai Projects feature**
- Plan: Claude Pro or Max.
- Create a new Project called "Peptide Market Research Synthesis."
- Upload all Track 1 and Track 2 outputs into the Project context before
  starting the synthesis conversation.
- The Projects feature keeps uploaded files in context across messages in the
  same session.
- Claude Opus 4's 200K-token context window accommodates the full input set
  for a 50 to 100 vendor universe. For larger universes, consolidate Track 2
  outputs before uploading.

---

## Overview: How the steps connect

This mission has three tracks that run in sequence:

```
Three-Mandate Research Prompt (research_mandate.md)
                    |
                    v
       STEP 0 (Claude, claude.ai chat)
       Build Combined Context Document
                    |
          combined_context.md
                    |
    +---------------+---------------+
    |                               |
    v                               v
TRACK 1                         TRACK 2
ChatGPT Pro Deep Research       Claude Code CLI
6 sliced runs (Slices 1-5):     Per-vendor crawl:
  Slice 1: Vendor Universe       - Mandate 1 full profiles
  Slice 2: Search + Owned        - Mandate 3 pricing matrix
  Slice 3: Community channels    - Discovery log
  Slice 4: Influencer + Paid     - Coverage report
  Slice 5: Compliance + Legal
    |                               |
    |  (Slices 1-5 complete)        | (Track 2 complete)
    +---------------+---------------+
                    |
           Slice 6 (Cross-Mandate Synthesis)
           NOW RUNS WITH TRACK 2 OUTPUTS ATTACHED
           All five prior slices + pricing_matrix.csv
                    |
                    v
              STEP 3 (Claude, claude.ai Projects)
              Final Academic Synthesis Report
                    |
                    v
         unified_report.md
         (Three-mandate academic deliverable)
```

IMPORTANT WORKFLOW ORDERING NOTE: Slice 6 runs AFTER Track 2 is complete. Slice 6
attaches the pricing_matrix.csv from Track 2 so that its Mandate 3 synthesis section
is grounded in actual pricing data rather than the thin pricing signals from Slices
1-5. Do not run Slice 6 before Track 2 has produced pricing_matrix.csv. This ordering
is enforced by design.

Tracks 1 (Slices 1-5) and Track 2 can run in parallel once Slice 1 has produced
vendor_list.csv.

---

### Plans and infrastructure required

- ChatGPT Pro ($200/month) for 125 full Deep Research runs per month.
  Verify current pricing at openai.com/chatgpt/pricing.
- Claude Max plan (approximately $100/month) for Claude Code CLI and the
  synthesis chat. Claude Pro ($20/month) is sufficient if vendor count is under 50.
- Claude Code installed locally. Installation guide at docs.claude.com.

---

### One-time folder setup

Create this working directory structure before starting:

```
~/peptide-research/
+-- 00_inputs/
|   +-- research_mandate.md       (the three-mandate prompt, verbatim)
|   +-- combined_context.md       (output of Step 0)
+-- 01_chatgpt_outputs/
|   +-- slice_1_vendor_universe.md
|   +-- vendor_list.csv           (extracted from slice_1 output; columns defined below)
|   +-- slice_2_search_owned.md
|   +-- slice_3_community.md
|   +-- slice_4_influencer_paid.md
|   +-- slice_5_compliance.md
|   +-- slice_6_channel_synthesis.md
+-- 02_claude_code_outputs/
|   +-- vendors/                  (one .json per vendor)
|   +-- evidence/                 (one .txt per vendor with verbatim quoted excerpts)
|   +-- pricing_matrix.csv
|   +-- discovery_log.jsonl
|   +-- coverage_report.md
+-- 03_final/
    +-- unified_report.md         (output of Step 3)
```

Save the three-mandate research prompt verbatim as `00_inputs/research_mandate.md`.
That file is the permanent source of truth for what this research is trying to
accomplish. Every model you run is oriented against it.

**vendor_list.csv column specification.** When you extract the vendor table from
Slice 1 into CSV, use exactly these column headers so Track 2 can parse without
error:

```
brand_name, primary_domain, apparent_country, fulfillment_country,
ship_to_scope, year_established, activity_status, lab_testing_posture,
stated_legal_structure, product_categories, price_range_observed,
source_review_presence, source_review_communities, last_activity_date, tier
```

No spaces around commas. No spaces in column header names. Use snake_case exactly
as written above.

---

## STEP 0: Produce the Combined Context Document

**Model:** Claude, in a claude.ai chat session.

**File to attach:** `00_inputs/research_mandate.md`.

**Prompt (copy verbatim):**

```
I am attaching a three-mandate academic research prompt. Read it fully.

This is a graduate-level academic market analysis of the global peptide
retail and research supply industry, for a medical school research project
requiring maximum scientific accuracy, exhaustive sourcing, and full
verifiability. The standard of rigor is that of a pharmaceutical market
entry analysis or a graduate thesis literature review.

Produce a Combined Context Document with the following two sections.

SECTION 1: MANDATE SUMMARY
Summarize each of the three research mandates in plain language. For
each mandate, list: the core research question, the specific data points
required, the named entities that must be covered (specific vendor names,
specific forum names, specific tool names, specific influencer names,
specific peptide names), the output format expected, and the sources that
should be prioritized. Be exhaustive in capturing the detail of what the
prompt is asking for. This section is the orientation briefing for every
AI model running research tasks downstream.

For Mandate 1, explicitly list the priority vendor names from the prompt.
For Mandate 2, explicitly list the named tools (SEO tools), named email
platforms, named influencers, named forums and communities, and named
tactics the prompt calls out. For Mandate 3, explicitly reproduce the
full peptide list including Cerebrolysin and MK-677 (Ibutamoren).

SECTION 2: RESEARCH INSTRUCTION BLOCK
Produce a condensed, numbered instruction set that a research agent can
reference mid-task to verify it is still on mission. Cover:
(1) Academic framing: this is a graduate-level analysis for a medical
    school research project. Standard: pharmaceutical market entry
    analysis or graduate thesis literature review.
(2) Citation and sourcing requirements: every claim traceable to a
    specific identifiable source. Where conflicting data exists between
    sources, report both and analyze the discrepancy. Do not speculate
    without labeling it as inference. Use OBSERVED: and INFERRED: labels.
(3) Proxy sourcing: where data is unavailable through direct observation
    (e.g., internal email metrics, private affiliate commission rates),
    use forum discussions, affiliate marketing disclosures, and marketing
    industry analyses as proxies. Label all proxy-sourced claims as
    PROXY (forum-reported) or PROXY (affiliate disclosure) or
    PROXY (industry analysis) as appropriate.
(4) Exhaustiveness standard for vendor discovery: the entire internet,
    not 3 or 10 or any fixed number of vendors. Every discoverable
    vendor, including small, obscure, recently launched, recently
    rebranded, defunct-but-archived, and vendors mentioned in a single
    forum thread.
(5) Equal rigor across all three mandates: Mandate 1, Mandate 2, and
    Mandate 3 must receive equal research depth. No mandate is a
    secondary pass.
(6) Source spectrum: company websites, regulatory filings, academic
    publications, forums, social media communities, and trade data.
    All six classes are in scope.
(7) Conflicting data: where two sources report different facts, report
    both, cite both, and state which you took and why.
(8) No em-dashes in any output. Use commas, periods, colons, or
    parentheses instead.

Do not add anything not present in the attached prompt. Do not add
business strategy, go-to-market framing, or editorial commentary. The
research is purely analytical and academic in purpose.
```

**Output:** save as `00_inputs/combined_context.md`. Every prompt below references
this file as the canonical orientation.

---

## TRACK 1: ChatGPT Pro Deep Research (six sliced runs)

**Model and settings for every slice below:**

- ChatGPT Pro plan. In the composer, click the tools button and select Deep Research
  (the full agentic version, not the lightweight one).
- Each slice is a fresh Deep Research session. Do not chain slices in one
  conversation. Start a new chat for each slice.
- For each slice, attach `00_inputs/combined_context.md` to the conversation before
  submitting the prompt. Attach prior slice outputs where noted.
- Recommended: in the composer, click Sites and Manage Sites, select "Prioritize
  these sites but allow full-web search," then enter:
  `reddit.com, meso-rx.com, anabolicsteroidforums.com, anabolicminds.com,
  evolutionary.org, thinksteroids.com, elitefitness.com, musclegurusforum.com,
  peptideunderground.com, youtube.com, archive.org`. Add more as you discover them.
- When ChatGPT presents its auto-generated research plan and asks for confirmation,
  read it carefully. If the plan is aligned with the slice objective, approve it.
  If it looks shallow, too narrow, or missing surfaces, type "Expand the plan:
  [specific gap]" and let it regenerate before approving.
- If ChatGPT asks a clarifying question, the standing answer is: "Proceed with the
  most exhaustive interpretation possible. Do not narrow scope."

---

### Slice 1: Vendor Universe Discovery (Mandate 1)

**File to attach:** `00_inputs/combined_context.md`.

**Prompt (copy verbatim):**

```
ROLE
You are a deep research agent running an exhaustive academic
market-mapping mission. The attached file combined_context.md is your
orientation briefing. Read it fully before planning. Do not cite it
as a research source. Cite only the open internet.

ACADEMIC FRAMING
This research is a graduate-level academic market analysis of the global
peptide retail and research supply industry, produced for a medical school
research project. The standard of rigor is that of a pharmaceutical market
entry analysis or a graduate thesis literature review. Every claim must be
traceable to a specific, identifiable source. Where exact data is
unavailable, provide the best available estimate with methodology
disclosed. Use OBSERVED: and INFERRED: labels wherever the distinction
matters. Where conflicting data exists between sources, report both and
analyze the discrepancy. Do not speculate without labeling it as
inference. Where data is unavailable through direct observation, use
forum discussions or other observable proxies and label them as
PROXY (forum-reported) or the appropriate proxy type. No em-dashes in
any output.

OBJECTIVE
Identify and document every active research-peptide vendor with any
public-facing presence: website, Telegram channel, Discord server, or
social media profile. This is the discovery run. The goal is exhaustive
identification. Deep per-vendor profiling is handled in Track 2.

PRIORITY TARGETS
The following vendors must be found and documented regardless of how
obscure or hard to locate they are. They are named in the research mandate
and must appear in the output:
Peptide Sciences, Biotech Peptides, Core Peptides, Pure Rawz, Behemoth
Labz, Limitless Life Nootropics, Swiss Chems, Peptide Guys, Amino Asylum,
Domestic Supply.
For each of these priority targets, document every available field in
the output format below, not just discovery-level data.

EXHAUSTIVENESS STANDARD
The target is not "major players" or "well-known vendors." The target is
every vendor the open internet can surface: large, mid-tier, small,
obscure, recently launched, recently rebranded, defunct-but-archived, and
vendors mentioned in a single forum thread, a single video description, or
a single Telegram link drop. All of them. There is no minimum count and
no maximum count. The scope is the entire internet.

SOURCES IN SCOPE
Company websites, regulatory filings (FDA warning letters, DEA records,
FTC actions), academic publications that reference vendors, forums, social
media communities, and trade data. All six source classes are in scope.

DISCOVERY METHOD
Run iterative passes. Each pass uses a different surface.

Pass 1: Direct search engine queries across Google and DuckDuckGo using
diverse query formulations: "buy BPC-157 research," "peptide supplier USA,"
"research chemical peptides," "GLP-1 peptide vendor," and hundreds of
product-specific and category-specific variations.

Pass 2: Reddit source-review threads and pinned source lists across every
relevant subreddit you can surface. Priority subreddits named in the
research mandate: r/Peptides, r/PeptidesForSale, r/Nootropics, r/Sarms.
Additionally search for: r/Steroids, r/Biohackers, r/longevity,
r/bodybuilding, r/moreplatesmoredates, r/looksmaxxing, r/mewing,
r/researchchemicals, and any others you surface. IMPORTANT: Before
exhausting a subreddit, verify it currently exists and is active. If a
subreddit appears banned or inactive, note its status and search for
successor or mirror subreddits under similar names. r/PeptidesForSale in
particular may have banned and re-spawned under different names: search
for successor communities and archived versions via Wayback Machine.

Pass 3: Specialized forums: Meso-Rx, Anabolic Steroid Forums, Anabolic
Minds, Evolutionary.org, ThinkSteroids, EliteFitness, MuscleGurus, Peptide
Underground, and every other forum you surface. Within each forum, read
source-review subforums, vendor feedback threads, pinned source lists, and
any thread containing vendor discussion.

Pass 4: Backlink and outbound-link analysis from already-identified vendor
sites. Footer links, banner ads, and "related resources" sections often
point to competitors.

Pass 5: YouTube creator descriptions and pinned comments on channels in
fitness, biohacking, looksmaxxing, longevity, TRT, and peptide education.
Creators often link to sponsors or vendors they discuss.

Pass 6: Wayback Machine pulls on domains that appear defunct to capture
historical vendor presence and rebrand chains.

Pass 7: Telegram public channel search for peptide, sarms, BPC-157, and
related terms. Many vendors operate Telegram-primary or Telegram-
supplementary presences.

Pass 8: Niche aggregator and review sites, peptide-specific directories,
and source-rating aggregators.

Pass 9: Regulatory databases. Search FDA.gov for warning letters mentioning
peptide vendors. Search FTC.gov for enforcement actions. Search DEA
databases. These sources often name vendors not discoverable through
marketing channels.

Pass 10: Academic publications and trade journals that reference specific
vendors or the peptide supply industry.

Continue running passes until a complete new pass surfaces zero new vendors.
Convergence is the only acceptable termination signal. Do not stop on a
round number.

OUTPUT FORMAT

(A) Discovery log table: pass number, surface used, queries run, new
vendors surfaced, cumulative total count.

(B) Master vendor table with these columns for every vendor:
- Brand name
- Primary domain or channel URL
- Apparent country of operation
- Apparent fulfillment country
- Ship-to scope (US only, US+international, international excluding US)
- Year established (if discoverable, else "unknown")
- Stated legal structure: research chemical supplier, pharmaceutical grade,
  compounding pharmacy, licensed distributor, other, or unknown
- Apparent activity status: active, dormant, or defunct
- Public lab-testing posture: none, on-site COAs, or third-party portal
- Complete product category list (not a headline: every category listed)
- Full observed price range (not a headline: lowest to highest observed)
- Payment methods observed
- Source-review presence: Y/N and which forums or communities
- Last evidence of activity: date of last review, post, or update
- Tier classification: Tier 1 (market leader with significant documented
  presence), Tier 2 (established mid-tier vendor), Tier 3 (small, obscure,
  or long-tail), with one-line justification
- Source citation: URL where vendor was discovered, with access date

(C) Priority target extended entries. For the ten named priority vendors
(Peptide Sciences, Biotech Peptides, Core Peptides, Pure Rawz, Behemoth
Labz, Limitless Life Nootropics, Swiss Chems, Peptide Guys, Amino Asylum,
Domestic Supply), produce an extended entry that includes every available
data point from the Mandate 1 field list: website structure, disclaimer
language, COA posture, shipping countries, payment methods with any
jurisdictional variation, customer service channels, trust signals, and
any documented regulatory actions or controversies.

(D) Coverage gaps: vendors you suspect exist but could not fully verify,
with partial evidence and what would be needed to confirm.

CITATION REQUIREMENTS
Every vendor row cites at least one URL where evidence of the vendor was
observed. Include access date for every cited URL.

GROUND RULES
- If a vendor operates without a public website (Telegram-only,
  Discord-only), include them with the channel as the domain field.
- Do not invent vendors. Unverifiable suspects go in coverage gaps.
- Write "uncertain" rather than guessing on any field.
- Do not add qualifiers not in this prompt: no "reputable vendors," no
  "major players."
- Include vendors that appear to operate in gray-legal territory if they
  operate openly and publicly.
- Include vendors mentioned only in a single forum thread.
- Include defunct and archived vendors. Mark status accurately.
- Where conflicting data exists between sources on any field, report both
  versions and state which you took.
- No em-dashes. Use commas, periods, colons, or parentheses.

Begin the discovery loop now. Do not ask clarifying questions before
starting.
```

**After it finishes:** save as `01_chatgpt_outputs/slice_1_vendor_universe.md`.
Extract the master vendor table into a structured CSV using exactly the column
headers specified in the folder setup section above, and save as
`01_chatgpt_outputs/vendor_list.csv`. Track 2 uses this CSV as its input.

---

### Slice 2: Customer Acquisition - Search, Owned Channels, and Gray-Channel Tactics (Mandate 2)

**Files to attach:** `00_inputs/combined_context.md`, `01_chatgpt_outputs/slice_1_vendor_universe.md`.

**Prompt (copy verbatim):**

```
ROLE
You are a deep research agent conducting an academic analysis of customer
acquisition practices in the research-peptide industry. Attached:
combined_context.md (orientation), slice_1_vendor_universe.md (master
vendor list from a prior run). Read both before planning. Do not cite
either as a research source.

ACADEMIC FRAMING
Graduate-level academic analysis for a medical school research project.
Standard: pharmaceutical market entry analysis or graduate thesis
literature review. Every claim requires a specific, verifiable source.
Use OBSERVED: and INFERRED: labels throughout. Where conflicting data
exists between sources, report both and analyze the discrepancy. Where
data is unavailable through direct observation (internal email metrics,
private commission rates), use forum discussions, affiliate marketing
disclosures, and marketing industry analyses as proxies and label all
such claims as PROXY (forum-reported), PROXY (affiliate disclosure), or
PROXY (industry analysis). Do not speculate without labeling it as
inference. No em-dashes. Use commas, periods, colons, or parentheses.

OBJECTIVE
Map the search-channel, owned-channel, and gray-channel customer-
acquisition surface for the entire research-peptide industry. The vendor
list is your starting set; expand outward wherever new vendors surface.
The scope is the entire internet, not a fixed number of vendors.

CHANNELS IN SCOPE

SECTION A: Google organic search. Which category and product terms drive
traffic, which content types rank, the role of domain authority. Name
specific vendors ranking for specific terms. Where data from Ahrefs,
SEMrush, or SimilarWeb is publicly available or cited in SEO research
articles, use it and cite the source.

SECTION B: SEO content marketing. The educational content economy around
research peptides. Which sites rank for category terms, how they are
monetized, how affiliate flows route back to vendors. Name specific sites,
articles, and domains. Document specific observable content strategies:
blog posts, educational articles, peptide guides, dosage protocols.
Identify the on-page and technical SEO patterns shared across successful
peptide sites.

SECTION C: Google Ads and alternative search advertising. Whether any
vendors actively run Google Ads despite category restrictions. Whether
Bing, DuckDuckGo, or other search platforms are used.

SECTION D: Vendor-owned YouTube channels, Instagram, TikTok, and X
accounts. Posting cadence, content type, how product references are
framed within platform-specific constraints.

SECTION E: Email marketing. This is a full-depth investigation:
- How do companies build email lists: lead magnets, free guides, discount
  codes, newsletter sign-ups.
- What email sequences are used: welcome series, educational drips,
  promotional blasts, and specifically abandoned cart sequences.
- What email platforms do peptide companies use given the product category.
  Specifically look for: Klaviyo, Mailchimp, SendGrid, and self-hosted
  solutions. Name which platforms specific vendors appear to use and how
  you determined this (email headers, footer text, observable platform
  branding in signup flows).
- What subject lines, CTAs, and content types perform well based on
  observable evidence from case studies, marketing blogs, and forum
  discussions. Label all such evidence with its source type (OBSERVED
  from a vendor email vs. PROXY from a marketing blog).

SECTION F: SMS marketing where observable.

SECTION G: Gray-channel tactics. This section treats gray-channel methods
as a unified analytical surface, not scattered across other sections:
- How companies use "research purposes only" and educational framing as
  a marketing tactic to legally discuss products in marketing contexts.
  Document specific examples of how this framing is used not just for
  legal protection but actively to attract buyers who understand the code.
- How nootropics and biohacking adjacent communities function as funnel
  entry points that route audiences into peptide purchasing. Document
  the specific conversion mechanics: what content or communities serve
  as top-of-funnel, how audiences migrate toward purchasing behavior.
- How the follower bases of specific public figures function as
  addressable audiences for peptide vendors: Dr. Peter Attia (longevity
  medicine), Bryan Johnson (biohacking and longevity protocol), Andrew
  Huberman (neuroscience and performance optimization). Document how
  vendors target or appear in content adjacent to these figures.
- How vendors use compounding pharmacy relationships or clinical-adjacent
  language as a marketing legitimacy tactic, not just a legal-structure
  category. Document specific examples of how clinical framing is deployed
  in marketing copy, email, or social content to signal product quality
  and legitimacy to buyers.
- Paid ad networks that accept this category: crypto-adjacent ad networks,
  fitness-vertical programmatic networks, harm-reduction-adjacent
  placements, native ad networks. Named examples with evidence.

SCOPE REQUIREMENT
There is no minimum count requirement. The scope is every observable
vendor example across the entire internet. Continue until a full
additional pass surfaces nothing new.

DELIVERABLES PER CHANNEL
For each channel:
1. How the channel functions for this category, including any platform-
   policy constraints.
2. Named vendor examples actively using the channel, each citing a URL
   and access date. No minimum count.
3. Cost structure for a new entrant.
4. Time horizon to meaningful traction.
5. Risk profile.

After per-channel coverage, rank all channels by industry importance:
how widely used, how central to customer acquisition, how accessible.
Ground every rank position in evidence from this run.

CITATION REQUIREMENTS
Every claim cites a specific URL with access date. Forum threads link
to the specific thread, not the forum root. For taken-down pages, use
archive.org and cite the archive URL.

Begin now. Do not ask clarifying questions before starting.
```

**After it finishes:** save as `01_chatgpt_outputs/slice_2_search_owned.md`.

---

### Slice 3: Customer Acquisition - Community Channels (Mandate 2)

**Files to attach:** `00_inputs/combined_context.md`, `01_chatgpt_outputs/slice_1_vendor_universe.md`.

**Prompt (copy verbatim):**

```
ROLE
You are a deep research agent conducting an academic analysis of
community-channel customer acquisition in the research-peptide industry.
Attached: combined_context.md (orientation), slice_1_vendor_universe.md
(vendor list). Read both. Do not cite as sources.

ACADEMIC FRAMING
Graduate-level academic analysis for a medical school research project.
Standard: pharmaceutical market entry analysis or graduate thesis
literature review. Every claim requires a specific, verifiable source.
Use OBSERVED: and INFERRED: labels throughout. Where conflicting data
exists between sources, report both and analyze the discrepancy. Where
data is unavailable through direct observation, use forum discussions
or other proxies and label all such claims as PROXY (forum-reported) or
the appropriate proxy type. Do not speculate without labeling it as
inference. No em-dashes. Use commas, periods, colons, or parentheses.

OBJECTIVE
Map the community-channel customer-acquisition surface for the entire
research-peptide industry. The vendor list is the starting surface, not
the ceiling. Expand wherever research surfaces additional vendors or
communities not in the list. The scope is the entire internet.

COMMUNITY ENTRY POINT FRAMING
A central question for this mandate is: how do communities function as
funnel entry points that route new audiences toward peptide purchasing?
For each community or channel type below, explicitly document the
conversion pathway: what content or discussion serves as top-of-funnel
awareness, how that audience migrates toward purchase intent, and what
the observable handoff mechanism is (link drops, vendor mentions, source-
request threads, pinned vendor lists). Communities are not just channels;
they are conversion funnels. Document them as such.

CHANNELS IN SCOPE

Reddit ecosystem: map every subreddit relevant to peptides, sarms,
steroids, biohacking, looksmaxxing, mewing, men's health, longevity,
fitness, bodybuilding, and gen-Z gym culture. For each subreddit:
approximate subscriber count, the posting culture around vendors and
product discussion, how source-review threads are structured, written
and unwritten rules around vendor self-promotion, documented ban
patterns, the role of pinned source lists and moderator relationships.
VERIFICATION REQUIREMENT: Before exhausting any subreddit, verify it
currently exists and is active. Check r/PeptidesForSale specifically
for current status, as such vendor-discussion communities are frequently
banned and re-spawn under different names. Search for successor and mirror
subreddits and include them. Search Reddit's own search and external
Reddit archives for any subreddit related to peptide sourcing.

Specialized forums: Meso-Rx, Anabolic Steroid Forums, Anabolic Minds,
Evolutionary.org, ThinkSteroids, EliteFitness, MuscleGurus, Peptide
Underground, and every other forum you surface. For each: source-review
subforum structure, vendor sponsorship models, paid advertising
opportunities, lifecycle of a new vendor from debut to community
acceptance or rejection, documented vendor controversies or bans.

Telegram channels: map every publicly accessible Telegram channel
relevant to this product category. For each: channel size where visible,
posting cadence, content type, vendor presence, link-drop culture, how
promotions and flash sales are run. Flash sales announced via Telegram
are a documented tactic in this industry: document every observable
example of how flash sale mechanics work on this platform.

Discord servers: same coverage. Named servers, vendor presence, how
peptide discussion is structured.

Niche aggregator and review sites: source-rating aggregators, peptide
review blogs, vendor directory sites. For each: how they operate, how
vendors are listed, how ranking or rating works, what influence they
appear to have on purchasing behavior.

SCOPE REQUIREMENT
This is not a sample. This is not a count-limited exercise. The goal is
every community surface the open internet can reveal. Continue expanding
until a full additional pass surfaces no new communities or vendors.

DELIVERABLES PER CHANNEL
1. Channel mechanics for this product category, including the conversion
   funnel pathway.
2. Named vendor examples actively present in the channel, each with URL
   evidence and access date. No minimum count.
3. Cost structure for a new entrant.
4. Time horizon to community acceptance and traction.
5. Risk profile: ban risk, reputation risk, community dynamics.

ADDITIONAL DELIVERABLE
Reputation dynamics: how brand reputation spreads across communities, how
trust is established and lost, the role of trusted reviewers and review
threads, the lifecycle from first appearance to community acceptance or
rejection. Include documented examples of successful and failed vendor
introductions where observable.

After per-channel coverage, rank channels by research significance and
industry importance.

CITATION AND GROUND RULES
Every claim cites a specific URL with access date. Forum thread links
go to the specific thread, not the forum root. No em-dashes. Document
observed practices crossing into clearly illegal territory as findings.

Begin now. Do not ask clarifying questions before starting.
```

**After it finishes:** save as `01_chatgpt_outputs/slice_3_community.md`.

---

### Slice 4: Customer Acquisition - Influencer, Podcast, Paid Channels, and Indirect Tactics (Mandate 2)

**Files to attach:** `00_inputs/combined_context.md`, `01_chatgpt_outputs/slice_1_vendor_universe.md`.

**Prompt (copy verbatim):**

```
ROLE
You are a deep research agent conducting an academic analysis of
influencer-channel, podcast-channel, paid-channel, and indirect-channel
customer acquisition in the research-peptide industry. Attached:
combined_context.md (orientation), slice_1_vendor_universe.md (vendor
list). Read both. Do not cite as sources.

ACADEMIC FRAMING
Graduate-level academic analysis for a medical school research project.
Standard: pharmaceutical market entry analysis or graduate thesis
literature review. Every claim requires a specific, verifiable source.
Use OBSERVED: and INFERRED: labels throughout. Where conflicting data
exists between sources, report both and analyze the discrepancy. Where
data is unavailable through direct observation (internal commission rates,
private affiliate structures), use affiliate marketing disclosures, forum
discussions, and marketing industry analyses as proxies and label them as
PROXY (affiliate disclosure), PROXY (forum-reported), or PROXY (industry
analysis). Do not speculate without labeling it as inference. No em-dashes.

OBJECTIVE
Map the influencer, podcast, paid-network, and indirect customer-
acquisition surface for the research-peptide industry. The vendor list is
the starting surface, not the ceiling. The scope is the entire internet.

CHANNELS IN SCOPE

YouTube creator economy: produce a named list of every creator operating
in fitness, bodybuilding, looksmaxxing, biohacking, longevity, men's
health, PED education, and gen-Z gym culture who has any observable
relationship with peptide vendors. Specifically investigate whether
creators in the orbit of Dr. Peter Attia, Bryan Johnson, and Andrew
Huberman are used as marketing channels: these three public figures
represent the longevity and biohacking audiences most targeted by peptide
vendors. Document any observable creator relationships adjacent to these
figures. For each creator in the universe: handle, channel URL, subscriber
count where visible, content style, observable vendor relationships
(sponsorships, discount codes, product mentions), how products are
discussed without triggering YouTube policy violations, and the specific
compliance language used. This is not a top-30 list. This is every
observable creator with any vendor relationship, ranked by subscriber
count.

TikTok and Instagram creator economy: same coverage. Named accounts,
follower counts where visible, content style, observable vendor
relationships, hashtag taxonomies in actual use (derive from observation,
do not invent). How products are referenced within platform-specific
constraints. Document specifically: how shadow banning is avoided on
Instagram and TikTok. What language choices, hashtag practices, account
structures, and posting behaviors are observable among vendors or creators
who have maintained consistent platform presence without account
termination. This is a documented industry challenge; document the
observable solutions.

X (Twitter) creator economy: notable accounts in the peptide and adjacent
space, how they monetize, observable vendor relationships, how X is used
compared to other platforms.

Affiliate program structures: document the affiliate programs of every
major vendor. Commission rates where disclosed or observable from affiliate
disclosures, attribution mechanics (promo code vs. trackable link),
cookie durations where disclosed, tracking method types (last-click
cookie, server-to-server postback, first-party data). How vendors recruit
affiliates. Label all rate data with its source: directly disclosed on an
affiliate page vs. PROXY (forum-reported) vs. PROXY (affiliate disclosure).

FTC disclosure handling: what practices are observable, what appears to
be avoided or obscured across influencer and affiliate channels.

Podcast sponsorships: every podcast in fitness, biohacking, men's health,
longevity, PED education, and adjacent spaces that has taken a peptide
vendor sponsor. For each: show name, feed URL or link, audience size where
estimable, sponsor name, how the sponsor is presented, compliance language
used in the ad read.

Newsletter sponsorships: same coverage for substantive newsletters.

Paid ad networks: crypto-adjacent ad networks, fitness-vertical programmatic
networks, harm-reduction-adjacent placements, native ad networks. Named
examples with URLs and evidence of peptide vendor ads.

Sponsored placements on review aggregators and forums.

In-person and physical marketing: bodybuilding expos, biohacking
conferences, gym-scene marketing, sponsored athletes, gym materials,
bodybuilding show sponsorships.

SCOPE REQUIREMENT
There is no minimum count. The scope is every creator, every podcast,
every newsletter, every affiliate, and every paid-channel example the
open internet can surface. Continue until a full additional pass surfaces
nothing new.

DELIVERABLES PER CHANNEL
1. Channel mechanics for this product category, including any platform
   constraints.
2. Named examples with URL evidence and access date. No minimum count.
3. Cost structure for entry.
4. Time horizon to traction.
5. Risk profile.

After per-channel coverage, produce a synthesis ranking channels by
research significance.

CITATION AND GROUND RULES
Every claim cites a URL with access date. Triangulate. Use OBSERVED: and
INFERRED: labels. Document practices crossing into clearly illegal
territory as findings. No em-dashes. Begin now.
```

**After it finishes:** save as `01_chatgpt_outputs/slice_4_influencer_paid.md`.

---

### Slice 5: Compliance, Disclaimer, and Regulatory Posture (Mandate 1 + Mandate 2)

**Files to attach:** `00_inputs/combined_context.md`, `01_chatgpt_outputs/slice_1_vendor_universe.md`.

**Prompt (copy verbatim):**

```
ROLE
You are a deep research agent conducting an academic analysis of
compliance and regulatory posture in the research-peptide industry.
Attached: combined_context.md (orientation), slice_1_vendor_universe.md
(vendor list). Read both. Do not cite as sources.

ACADEMIC FRAMING
Graduate-level academic analysis for a medical school research project.
Standard: pharmaceutical market entry analysis or graduate thesis
literature review. Every claim requires a specific, verifiable source.
Regulatory enforcement events must cite primary sources (FDA.gov,
court records, official press releases) where they exist. Use OBSERVED:
and INFERRED: labels throughout. Where conflicting data exists between
sources, report both and analyze the discrepancy. Where data is
unavailable through direct observation, use forum discussions or
published legal analyses as proxies and label as PROXY (forum-reported)
or PROXY (published analysis). Do not speculate without labeling it
as inference. No em-dashes.

MANDATE SCOPE NOTE
This slice serves both Mandate 1 (competitive landscape) and Mandate 2
(advertising and customer acquisition). Regulatory actions, warnings,
and controversies are a Mandate 1 data requirement for each vendor.
Disclaimer language and marketing-framing tactics are a Mandate 2 data
requirement. This slice captures both. The final synthesis will attribute
each finding to its correct mandate section.

OBJECTIVE
Catalog the compliance, disclaimer, and legal-posture patterns that
research-peptide vendors use on their public websites and in marketing
language. Capture verbatim language and cite specific URLs. Map observed
regulatory enforcement events with primary-source documentation.

SOURCES IN SCOPE
Company websites, regulatory filings (FDA.gov, FTC.gov, DEA databases,
court records), academic publications discussing the legal status of
research peptides, forum discussions of enforcement events, trade and
industry publications. All of these are in scope.

DELIVERABLES

1. Disclaimer language inventory. Capture verbatim disclaimer text from
vendors across the vendor list and from your own expanded research.
Cover:
- "Research use only" formulations and their variations
- "Not for human consumption" formulations and their variations
- Age-gate language
- Jurisdictional restriction language
- Medical-claim avoidance language
- "Consult a physician" hedges
- Terms-of-service highlights as they relate to purchase intent
For each captured disclaimer: vendor name, URL, access date, verbatim
text. Aim for the widest possible sample across the entire vendor
universe. More is better. There is no cap.

2. Disclaimer as marketing tactic. Beyond legal function, how are
"research use only" disclaimers and educational framing actively used
as customer acquisition and conversion tactics. Document specific
examples where the framing appears designed to signal product
availability to informed buyers while maintaining legal deniability.
This is a Mandate 2 finding, not just a Mandate 1 compliance note.

3. Pattern analysis: which disclaimer formulations appear most commonly,
which are unique, which appear to provide the strongest liability shield
based on legal commentary or documented outcomes where such sources
exist.

4. Site-architecture compliance signals: COA hosting practices, lab-
partner disclosure, batch and lot transparency, ID verification,
age-gate placement, terms-of-service structure, refund policy patterns,
shipping policy patterns including jurisdictional exclusions.

5. Marketing-language compliance signals: how product descriptions are
written to avoid medical claims, how ad copy is framed, how email and
social copy navigates regulatory constraints. Cite specific examples
with URLs.

6. Payment-processor and platform-policy posture: which processors named
vendors use (cite with evidence), how they appear to maintain processor
relationships, documented processor failures or migrations from forums
and reviews.

7. Observed enforcement events: catalog every FDA warning letter, DEA
action, FTC action, payment-processor termination, domain seizure, or
platform takedown affecting vendors in this space. For each: vendor name,
event type, date, regulatory body or platform, outcome where known,
primary source citation. Search FDA.gov, FTC.gov, and court record
databases directly.

8. Regulatory and legal framework overview: the current legal status of
research peptides in the United States and key international markets
where observable. The regulatory bodies that govern this space. The
specific statutes that apply. The documented gray areas that allow the
industry to operate openly. Cite academic publications and legal analyses
where they exist.

CITATION AND GROUND RULES
Every disclaimer quote cites a vendor URL and access date. Enforcement
events cite primary sources wherever they exist. Forum-reported events
are labeled PROXY (forum-reported). Use OBSERVED: and INFERRED: labels.
Flag vendor practices crossing into clearly illegal territory as findings.
No em-dashes. Begin now.
```

**After it finishes:** save as `01_chatgpt_outputs/slice_5_compliance.md`.

---

### TRACK 2: Run before Slice 6

**Before running Slice 6, complete all of Track 2.** Slice 6 requires Track 2's
`pricing_matrix.csv` to produce a grounded Mandate 3 synthesis. Slice 6 attaches
that file. If you run Slice 6 before Track 2 is complete, the Mandate 3 section will
be evidence-starved. The correct sequence is: Slices 1-5 run, Track 2 runs using
Slice 1's vendor_list.csv, then Slice 6 runs with all prior slice outputs plus
Track 2's pricing_matrix.csv and coverage_report.md.

See the full Track 2 section below.

---

### Slice 6: Cross-Mandate Synthesis (Mandates 1, 2, 3)

**Files to attach:** `00_inputs/combined_context.md`, all five prior slice outputs,
plus `02_claude_code_outputs/pricing_matrix.csv` and
`02_claude_code_outputs/coverage_report.md` from Track 2.

**Prompt (copy verbatim):**

```
ROLE
You are a deep research agent. Attached: combined_context.md
(orientation), five prior slice outputs covering vendor universe, search
and owned channels, community channels, influencer and paid channels, and
compliance and regulatory posture, plus pricing_matrix.csv and
coverage_report.md from a systematic per-vendor extraction run. Read all
of them before planning. Do not cite any attached file as a research
source.

ACADEMIC FRAMING
Graduate-level academic analysis. Standard: pharmaceutical market entry
analysis or graduate thesis literature review. This synthesis run produces
the analytical layer that sits above the raw research: patterns, rankings,
comparisons, and interpretations grounded entirely in observed evidence
from the prior files. Every claim must trace to a prior input file. No
new claims introduced here without grounding in prior-input evidence.
Use OBSERVED: and INFERRED: labels throughout. Where conflicting data
exists between prior inputs, report both and state which you took and why.
No em-dashes.

OBJECTIVE
Produce a structured analytical synthesis covering all three research
mandates with equal rigor. Mandate 1, Mandate 2, and Mandate 3 receive
equal depth in this synthesis.

DATA SOURCE HIERARCHY FOR MANDATE 3
The pricing_matrix.csv attached from Track 2 is the authoritative source
for all Mandate 3 pricing data. The per-vendor JSON profiles are the
authoritative source for Mandate 1 vendor data. Where the prior ChatGPT
slices conflict with Track 2 data on any pricing or vendor field, the
Track 2 data takes precedence, because it was captured from actual vendor
pages with verbatim evidence. Note every such conflict and state which
source you took.

DELIVERABLES

(A) Mandate 1 synthesis: Competitive landscape patterns.
- Tier distribution of the vendor universe: what Tier 1 vendors have in
  common, what Tier 2 vendors have in common, what Tier 3 characteristically
  looks like.
- Geographic distribution patterns and supply-chain implications.
- Quality signal patterns: COA transparency distribution, correlation
  with other quality indicators.
- Site architecture patterns: strongest structural patterns by tier.
- Longevity patterns: market longevity, turnover rates, rebrand patterns.
- Legal structure distribution: how vendors are distributed across legal
  structure categories and what that distribution implies.

(B) Mandate 2 synthesis: Customer acquisition channel analysis.
- Master channel ranking: for every channel covered in Slices 2 through 4,
  rank by industry importance. Ground every rank position in evidence from
  the prior slices.
- Channel interaction effects: which channels work together.
- Platform-policy risk distribution: which channels carry highest risk.
- Compliance language patterns across channels: how the same product is
  framed differently across SEO content, social media, forum posts, and
  influencer sponsorships.
- Gray-channel tactic synthesis: the most impactful indirect acquisition
  tactics observed across the vendor universe.

(C) Mandate 3 synthesis: Pricing intelligence patterns.
This section uses pricing_matrix.csv as its primary data source.
- Price range norms per major peptide category, derived from the pricing
  matrix. For every major peptide: minimum, median, and maximum per-mg
  price observed across the vendor universe.
- Pricing strategy patterns: volume discount structures, bundle and kit
  pricing distinctions (bundles are multiple peptides together; kits
  typically include reconstitution supplies such as syringes and
  bacteriostatic water), cryptocurrency discount rates, subscription and
  auto-ship pricing, sale frequency and typical discount depth.
- Out-of-stock cross-vendor analysis: which peptides are consistently out
  of stock across multiple vendors simultaneously, indicating supply
  constraints or demand spikes. Aggregate from per-vendor OOS data in
  the pricing matrix.
- Supply and demand signals: peptides commanding premium pricing, peptides
  appearing exclusive or rare, emerging peptides gaining commercial
  traction.
- Price collusion and uniformity: explicitly analyze whether any peptides
  show observable price uniformity across vendors that could indicate
  coordination, cartel-like pricing, or aggressive undercutting by
  specific vendors. State what evidence exists and what it supports.
- Stack and bundle ecosystem: what combinations are marketed as stacks,
  at what price points, how stack pricing compares to individual SKU
  pricing.
- Price-quality correlation: observable relationship between pricing
  and quality indicators (COA availability, lab testing, brand tier).

(D) Open questions for Step 3. Specific data gaps that the Step 3
synthesis will need to resolve, questions the current evidence left
open, and what would be needed to answer each.

GROUND RULES
- Every claim ties back to a prior input file by file name and section.
- Take analytical positions where evidence supports them.
- Where evidence is ambiguous or conflicting, report both sides and state
  which is more supported and why.
- Use OBSERVED: and INFERRED: labels.
- No em-dashes.

Begin now. Do not ask clarifying questions before starting.
```

**After it finishes:** save as `01_chatgpt_outputs/slice_6_channel_synthesis.md`.

---

## TRACK 2: Claude Code CLI Driver (Mandates 1 and 3)

**When to run:** after Slice 1 produces `vendor_list.csv`. Tracks 1 (Slices 2-5) and
Track 2 can run in parallel. Slice 6 runs after Track 2 completes.

**Model:** the current frontier Claude Opus model in Claude Code (terminal). Before
running, verify the current model string at docs.claude.com. Use `claude-opus-4-latest`
if that alias is available; otherwise use the current Opus 4 model string from the
documentation. If Opus is rate-limited, fall back to the current Claude Sonnet model.

**Files needed in your working directory before you start:**

```
~/peptide-research/
+-- 00_inputs/
|   +-- combined_context.md
|   +-- vendor_list.csv        (extracted from Slice 1 with columns as specified)
+-- 02_claude_code_outputs/    (empty, will be filled)
+-- PILLAR_A_SCHEMA.md         (create this file first, content below)
```

**Create `PILLAR_A_SCHEMA.md` first.** Paste this content into it verbatim:

```
# Mandate 1 and 3 Data Schema (per-vendor profile)

Every vendor profile is a JSON file at
02_claude_code_outputs/vendors/{slug}.json with these fields:

{
  "vendor_slug": "kebab-case-vendor-name",
  "brand_name": "Brand Name",
  "primary_domain": "https://...",
  "fetched_url": "https://...",
  "fetched_at": "ISO 8601 timestamp",
  "fetch_status": "ok | partial | failed",
  "tier": "1 | 2 | 3",

  "company_profile": {
    "country_of_operation": "...",
    "fulfillment_country": "...",
    "ship_to_scope": "us_only | us_intl | intl_excl_us",
    "year_established": "YYYY or unknown",
    "years_in_business": "integer or unknown",
    "stated_legal_structure": "research_chemical_supplier | compounding_pharmacy | licensed_distributor | pharmaceutical_grade | other | unknown"
  },

  "website_architecture": {
    "hero_copy_excerpt": "verbatim quote, max 200 chars",
    "hero_imagery_style": "clinical | lifestyle | meme_coded | anonymous | other",
    "primary_cta": "...",
    "navigation_pattern": "...",
    "pages_present": ["list of observed pages: About, Blog, COA, Shipping, etc."],
    "footer_disclaimers": "verbatim quote",
    "research_use_only_phrasing_homepage": "verbatim quote from homepage",
    "research_use_only_phrasing_product_pages": "verbatim quote from product pages, note if it differs from homepage",
    "research_use_only_phrasing_checkout": "verbatim quote from checkout or cart, note if it differs",
    "age_gate_present": "true | false",
    "jurisdictional_restriction_notice": "verbatim quote or none"
  },

  "catalog": {
    "sku_count": "integer or unknown",
    "category_taxonomy": ["..."],
    "formulation_types_offered": ["lyophilized_powder", "pre_mixed_solution", "nasal_spray", "oral_capsule", "transdermal", "other"],
    "search_filter_capabilities": "...",
    "stack_bundle_pages_present": "true | false"
  },

  "product_page_anatomy": {
    "sample_product_url": "https://...",
    "sample_product_name": "...",
    "dose_options": ["..."],
    "list_price": "$...",
    "per_mg_cost": "$...",
    "photographic_treatment": "...",
    "description_copy_excerpt": "verbatim quote, max 300 chars",
    "exact_disclaimer_language": "verbatim quote",
    "coa_present": "true | false",
    "coa_hosting": "on_site | third_party_portal | none",
    "lab_partner_named": "name or unknown",
    "hplc_data_available": "true | false",
    "mass_spec_data_available": "true | false",
    "batch_lot_transparency": "true | false",
    "customer_review_module_present": "true | false",
    "related_product_modules_present": "true | false"
  },

  "trust_compliance": {
    "ssl_present": "true | false",
    "trustpilot_present": "true | false",
    "trustpilot_score": "float or unknown",
    "bbb_present": "true | false",
    "reddit_reputation_summary": "...",
    "tos_url": "https://...",
    "tos_highlights": "...",
    "refund_policy": "...",
    "shipping_policy": "..."
  },

  "checkout_flow": {
    "account_required": "true | false",
    "guest_checkout_available": "true | false",
    "id_verification_present": "true | false",
    "payment_methods_accepted": ["BTC", "ETH", "USDT-TRC20", "eCheck", "wire", "credit_card", "gift_card"],
    "payment_methods_by_jurisdiction": "describe any jurisdictional variation in payment acceptance, e.g. credit card not available in certain countries, or crypto only for international orders. Use 'no jurisdictional variation observed' if none is found.",
    "crypto_discount_offered": "true | false",
    "crypto_discount_rate": "percentage or unknown",
    "shipping_carriers": ["..."],
    "shipping_cost_structure": "...",
    "cold_chain_handling": {
      "offered": "true | false | unknown",
      "method": "refrigerated | frozen | dry_ice | ambient | not_applicable | unknown",
      "vendor_description": "verbatim quote describing cold chain capability, or none"
    },
    "customs_declaration_language": "verbatim quote or unknown",
    "international_policy": "..."
  },

  "customer_service": {
    "live_chat_present": "true | false",
    "email_present": "true | false",
    "phone_present": "true | false",
    "response_speed_forum_reported": "..."
  },

  "tech_stack": {
    "platform_signal": "shopify | woocommerce | custom | headless | unknown",
    "cdn": "...",
    "analytics_tools_loaded": ["..."],
    "marketing_pixels_present": ["..."],
    "email_platform_signal": "klaviyo | mailchimp | sendgrid | self_hosted | unknown. Derive from email header analysis, footer branding in newsletter sign-up flows, or observable platform UI patterns.",
    "chat_widget_present": "true | false"
  },

  "content_footprint": {
    "blog_present": "true | false",
    "blog_url": "https://... or none",
    "content_cadence": "...",
    "topic_taxonomy": ["..."],
    "author_bylines_present": "true | false",
    "internal_linking_to_products": "..."
  },

  "social_proof": {
    "on_site_reviews": "true | false",
    "off_site_aggregators": ["..."],
    "visible_influencer_endorsements": "...",
    "forum_review_thread_urls": ["..."]
  },

  "regulatory_actions": {
    "fda_warning_letters": "documented or none found",
    "fda_warning_letter_urls": ["primary source URLs or empty array"],
    "payment_processor_terminations": "documented or none found",
    "domain_seizures": "documented or none found",
    "platform_takedowns": "documented or none found",
    "other_controversies": "..."
  },

  "skus": [
    {
      "peptide_name": "...",
      "variant": "e.g., acetate salt, arginine salt",
      "dose_mg": "...",
      "format": "vial | nasal_spray | capsule | pre_mixed | topical | other",
      "list_price": "$...",
      "sale_price": "$... or null",
      "per_mg_price": "$...",
      "volume_discount_tiers": "describe each tier: e.g. 1 unit $X, 3 units $Y each, 5 units $Z each",
      "bundle_pricing": "describe if this SKU is sold in multi-peptide bundles. A bundle is multiple peptides packaged together at a combined price.",
      "kit_pricing": "describe if this SKU is sold as part of a kit that includes reconstitution supplies (bacteriostatic water, syringes, etc.) at a combined price. Kits are distinct from bundles.",
      "subscription_pricing": "$... per cycle or null",
      "sale_frequency_observed": "frequent (more than once per month) | occasional (monthly or less) | rare | unknown",
      "discount_depth_percent": "typical % off during observed sales, or unknown",
      "in_stock": "true | false | unknown",
      "out_of_stock_note": "describe if repeatedly out of stock or if OOS is notable",
      "url": "https://..."
    }
  ],

  "evidence_file": "evidence/{slug}.txt",
  "uncertainty_notes": "list any field marked uncertain and explain why"
}

The corresponding evidence file at
02_claude_code_outputs/evidence/{slug}.txt contains, for each non-trivial
claim in the profile, a verbatim quoted excerpt from the fetched page along
with the URL and timestamp. Format:

[CLAIM] hero_copy_excerpt
[URL] https://...
[FETCHED_AT] ISO 8601
[QUOTE]
"verbatim text from the page"
[/QUOTE]

[CLAIM] research_use_only_phrasing_homepage
...
```

**Now the master Track 2 driver prompt. In your `~/peptide-research/` directory, start
Claude Code and paste this verbatim:**

```
You are running an exhaustive per-vendor research operation in this
working directory. This research is a graduate-level academic market
analysis of the global peptide retail and research supply industry,
produced for a medical school research project. The standard of rigor
is that of a pharmaceutical market entry analysis or a graduate thesis
literature review. Read this entire prompt before taking any action.
Then enter plan mode and build a plan before executing.

FILES PROVIDED
- 00_inputs/combined_context.md: orientation only, do not cite as a
  research source
- 00_inputs/vendor_list.csv: the vendor universe to profile
- PILLAR_A_SCHEMA.md: the exact data schema for every vendor profile

PRIORITY VENDORS
Profile these ten vendors first, before any others, and at maximum depth
regardless of their tier classification. They are named explicitly in the
research mandate:
  Peptide Sciences, Biotech Peptides, Core Peptides, Pure Rawz,
  Behemoth Labz, Limitless Life Nootropics, Swiss Chems, Peptide Guys,
  Amino Asylum, Domestic Supply.
For each of these ten, every field in PILLAR_A_SCHEMA.md that is
observable must be populated. Mark only genuinely inaccessible fields
as uncertain. These are non-negotiable priority targets.

OBJECTIVE
For every vendor in vendor_list.csv, produce:
1. A profile JSON at 02_claude_code_outputs/vendors/{slug}.json
   following PILLAR_A_SCHEMA.md exactly.
2. An evidence file at 02_claude_code_outputs/evidence/{slug}.txt
   with verbatim quoted excerpts supporting every non-trivial claim.

After the per-vendor pass, produce:
3. A pricing matrix at 02_claude_code_outputs/pricing_matrix.csv
   covering every SKU across every vendor with these columns:
   vendor_slug, vendor_brand_name, peptide_name, variant, dose_mg,
   format, list_price, sale_price, per_mg_price, volume_discount_tiers,
   kit_pricing, bundle_pricing, crypto_discount_rate, subscription_price,
   sale_frequency_observed, discount_depth_percent, in_stock,
   out_of_stock_note, url.
   One row per SKU. This is the authoritative data source for Mandate 3.
4. A coverage report at 02_claude_code_outputs/coverage_report.md.
5. A discovery log at 02_claude_code_outputs/discovery_log.jsonl,
   appended to as you work, with one JSON line per fetch:
   {"vendor_slug": "...", "url": "...", "ts": "...",
    "status": "ok|partial|failed", "notes": "..."}.

PEPTIDES TO BENCHMARK IN THE PRICING MATRIX
The pricing matrix must include data for every SKU in every vendor's
catalog. Priority benchmarking coverage for these peptides (this list
is a minimum, not a ceiling):
BPC-157, TB-500, Selank, Semax, Epithalon, GHK-Cu, KPV,
Thymosin Alpha-1, PT-141 (Bremelanotide), Ipamorelin, CJC-1295
(with and without DAC), GHRP-2, GHRP-6, Hexarelin,
MK-677 (Ibutamoren), IGF-1 LR3, MGF (PEG-MGF), AOD-9604,
Fragment 176-191, Follistatin 344, DSIP, Dihexa, NAD+ peptide variants,
LL-37, MOTS-c, SS-31, Humanin, 5-Amino-1MQ, FGL, Pinealon,
Cerebrolysin (where available), Semaglutide, Tirzepatide, Retatrutide,
and every additional peptide you observe being sold commercially.

CROSS-VENDOR AGGREGATION TASKS
After assembling the pricing matrix, produce two additional analyses
in the coverage report:

OUT-OF-STOCK DEMAND SIGNAL: identify every peptide that appears as
out_of_stock = true or is noted as repeatedly OOS across three or more
vendors simultaneously. List these peptides, the count of vendors with
OOS status, and interpret the supply constraint or demand signal this
implies. This cross-vendor aggregation is the specific finding the
research mandate asks for: which peptides are consistently out of stock
across vendors, indicating high demand and potential supply chain insights.

PRICE UNIFORMITY ANALYSIS: for every peptide with pricing data across
five or more vendors, calculate the coefficient of variation in per-mg
price. Flag any peptide where the coefficient of variation is below 10%
(indicating possible pricing coordination or market norm convergence).
Flag any vendor whose pricing on multiple peptides is consistently the
lowest (indicating aggressive undercutting). Document findings in the
coverage report. The Step 3 synthesis will interpret these signals.

==============================================================
RESEARCH INTEGRITY STANDARDS
==============================================================

STANDARD 1: No fabrication. Ever. If you cannot fetch a vendor's page,
that profile gets fetch_status="failed" and affected fields get
"uncertain." Do not infer disclaimer language from what vendors usually
say. Do not infer prices from typical market prices.

STANDARD 2: Every non-trivial claim must have a corresponding entry in
the evidence file with a verbatim quoted excerpt from the fetched page.
If you cannot produce a verbatim excerpt, mark the field "uncertain" and
explain in uncertainty_notes.

STANDARD 3: No copy-paste between vendors. Each vendor's language,
pricing, and policies must be captured fresh from that vendor's actual
pages.

STANDARD 4: Honesty over helpfulness. "Uncertain" is a valid output.
A profile with 30% uncertain fields and 70% verified fields is more
valuable than one with 100% confident fields where 30% are invented.

STANDARD 5: Verification spot-check. After every batch of 10 vendors,
pick 2 at random, re-fetch their homepage and one product page, and
compare against saved profiles. If anything differs, treat the original
as compromised, log the discrepancy in coverage_report.md, and redo the
profile from scratch.

STANDARD 6: No shortcuts via summary. Read actual page HTML or rendered
text for every claim you make.

STANDARD 7: No premature termination. Tier 3 vendors get a baseline
profile. If you cannot reach baseline coverage on a vendor, that is a
fetch_status="failed" entry, not a "this one is unimportant" decision.

STANDARD 8: No completion claims without verification. Before marking
a vendor done: does the profile JSON parse as valid JSON? Does the
evidence file exist? Does every non-uncertain claim have a corresponding
evidence entry? If any answer is no, the vendor is not done.

STANDARD 9: Document obstacles. If a site has technical characteristics
preventing reliable fetching (heavy JavaScript, captcha, region lock),
document the obstacle in uncertainty_notes, mark affected fields
uncertain, and move on. Do not write scripts that bypass anti-scraping
protections.

STANDARD 10: Stop and report when stuck. Three failed attempts with
different approaches on a single vendor: log fetch_status="failed,"
append a note to coverage_report.md explaining what blocked you, and
proceed to the next vendor.

STANDARD 11: Conflicting data. Where two pages on the same vendor's
site show different pricing, disclaimer language, or other data, report
both versions in the evidence file and note the discrepancy in
uncertainty_notes. Do not silently pick one.

STANDARD 12: No em-dashes in any output. Use commas, periods, colons,
or parentheses.

==============================================================
EXECUTION FLOW
==============================================================

Phase 0 (planning): Read combined_context.md, vendor_list.csv, and
PILLAR_A_SCHEMA.md. Produce a plan including:
- Profiling order (ten priority vendors first, then Tier 1, Tier 2, Tier 3)
- Fetch tooling available
- Batching strategy and verification spot-check schedule
- Expected runtime and planned pause points for inspection
Present the plan and wait for approval before proceeding.

Phase 1 (per-vendor profiling): For each vendor in vendor_list.csv:
- Fetch the homepage. If ok or partial, proceed. If failed, log and
  move on.
- Walk the catalog: capture sku_count, taxonomy, formulation types.
- Fetch one representative product page per category. Capture full
  product_page_anatomy with verbatim disclaimer quotes.
- For Mandate 3 pricing matrix: Tier 1 vendors get every SKU captured
  at full detail. Tier 2 vendors get every SKU at minimum name, dose,
  format, list_price, per_mg_price, and in_stock status. Tier 3 vendors
  get the headline SKU set plus any others quick to capture.
- Fetch TOS, refund policy, shipping policy.
- Walk checkout flow without submitting orders or creating accounts.
- Capture tech stack signals from page source and headers.
- Capture content footprint and social proof.
- Write profile JSON. Write evidence file. Append discovery_log.
- After every 10 vendors, run the verification spot-check.

Phase 2 (pricing matrix): Aggregate every SKU from every profile into
pricing_matrix.csv. Compute per-mg-price. Note out-of-stock status where
visible. Do not re-fetch in this phase; use saved profiles only.

Phase 3 (cross-vendor aggregation): Produce the OOS demand signal
analysis and price uniformity analysis described above.

Phase 4 (coverage report): Write coverage_report.md with:
- Total vendors attempted
- Per-tier completion rates
- Per-vendor status (full / partial / failed) with one-line note
- Aggregate field-level uncertainty summary
- Cross-vendor OOS demand signal findings
- Price uniformity flag table
- Follow-up flags: vendors worth re-attempting and the specific reason

After Phase 4, output a one-page summary in chat only. Do not write
a final report here. Synthesis happens in Step 3.

Enter plan mode now. Read all three input files. Produce the plan.
Do not begin execution until I approve.
```

**While it runs:** monitor `discovery_log.jsonl` to verify it is actually fetching
pages. Spot-check 3 to 4 random vendor JSON files against the live sites and the
evidence files. If you find fabrication, stop the run, share the discrepancy with
Claude Code, and have it redo the affected batch.

**When it finishes:** you should have populated `02_claude_code_outputs/vendors/`,
`02_claude_code_outputs/evidence/`, `pricing_matrix.csv`, `coverage_report.md`, and
`discovery_log.jsonl`.

---

## STEP 3: Final Academic Synthesis

**Model:** Claude in claude.ai (web or desktop, not CLI). Use the Projects feature:
create a new Project called "Peptide Market Research Synthesis" so file uploads
persist across messages in the synthesis session.

**Files to upload to the Project:**

From Track 1:
- `01_chatgpt_outputs/slice_1_vendor_universe.md`
- `01_chatgpt_outputs/slice_2_search_owned.md`
- `01_chatgpt_outputs/slice_3_community.md`
- `01_chatgpt_outputs/slice_4_influencer_paid.md`
- `01_chatgpt_outputs/slice_5_compliance.md`
- `01_chatgpt_outputs/slice_6_channel_synthesis.md`

From Track 2:
- `02_claude_code_outputs/pricing_matrix.csv`
- `02_claude_code_outputs/coverage_report.md`
- A consolidated vendor profiles document: in your terminal, run
  `cat 02_claude_code_outputs/vendors/*.json > vendor_profiles_consolidated.json`
  and upload that file.

Plus:
- `00_inputs/combined_context.md`
- `00_inputs/research_mandate.md`

**Prompt (copy verbatim, paste into the Project chat):**

```
ROLE
You are the senior synthesizer for a graduate-level academic market
analysis of the global peptide retail and research supply industry,
produced for a medical school research project. The standard of rigor
is that of a pharmaceutical market entry analysis or a graduate thesis
literature review. You are producing the unified academic report that
constitutes the final deliverable.

INPUTS ATTACHED
- research_mandate.md: the original three-mandate research prompt. Use it
  to verify this synthesis covers everything asked for. Do not cite as
  a research source.
- combined_context.md: orientation. Do not cite as a source.
- Six ChatGPT Deep Research slice outputs covering vendor universe, search
  and owned channels, community channels, influencer and paid channels,
  compliance and regulatory posture, and cross-mandate synthesis.
- pricing_matrix.csv: the authoritative per-SKU pricing dataset across
  the full vendor universe, from direct per-vendor page extraction.
- coverage_report.md: the per-vendor crawl coverage and gap report,
  including cross-vendor OOS demand signal findings and price uniformity
  flag table.
- vendor_profiles_consolidated.json: full per-vendor structured data.

==============================================================
SYNTHESIS RULES
==============================================================

RULE 1: Data source hierarchy. Track 2 outputs (per-vendor profiles,
pricing_matrix.csv) take precedence over ChatGPT slice outputs on any
factual conflict, because they were captured from actual vendor pages
with verbatim evidence. Note every conflict and state which source
you took and why.

RULE 2: No new claims. Every fact in the unified report must trace to a
specific input file and section. If you find yourself wanting to state
something not in the inputs, do not. Either flag it as an open question
or leave it out.

RULE 3: Honest uncertainty. Reflect coverage gaps from the coverage
report. A finding that says "pricing data was unavailable for 12 of 47
Tier 3 vendors" is more useful than one that pretends completeness.

RULE 4: Take positions. Where the evidence supports a finding, state it
clearly. Where evidence is ambiguous, state that and identify what would
resolve it.

RULE 5: Allow "we do not know." If a question the research mandate called
for is not answered by the inputs, say so plainly and put it in the open
questions section.

RULE 6: Conflicting sources. Where two inputs disagree on a fact, report
both versions, cite both, and state which you took and why. Do not paper
over contradictions.

RULE 7: Proxy labeling. Where a claim derives from forum discussions,
affiliate disclosures, or industry analyses rather than direct
observation, label it as PROXY (forum-reported), PROXY (affiliate
disclosure), or PROXY (industry analysis).

RULE 8: OBSERVED and INFERRED labels. Use these labels wherever the
distinction between observed fact and analytical inference matters.

RULE 9: No em-dashes in any output. Use commas, periods, colons, or
parentheses.

RULE 10: No AI tells. No "let's dive in," "I'd be happy to," "it's
worth noting," "in the ever-evolving landscape of," or similar preamble
phrases. Direct, declarative, dense academic prose.

RULE 11: Equal rigor across all three mandates. Mandate 1, Mandate 2,
and Mandate 3 sections must be of equivalent depth and analytical
thoroughness. No mandate is a secondary pass.

==============================================================
DELIVERABLE STRUCTURE
==============================================================

Produce the unified academic report with these sections in order.
The report is organized in three primary mandate sections as the
research prompt specifies. Subsections provide the analytical detail.

1. Executive Summary (maximum 600 words). State of the global peptide
retail and research supply industry, scope and methodology of this
analysis, and the three top findings per mandate.

2. Methodology. How the research was conducted: the three-track
architecture, models and tools used, number of vendors profiled,
surfaces searched, coverage rates by tier, and known limitations.

3. Mandate 1: Competitive Landscape Analysis.

   3a. Vendor Universe Overview. Total count, tier distribution,
   geographic distribution, fulfillment country patterns, ship-to scope
   distribution, legal structure distribution, longevity distribution.

   3b. Priority Vendor Profiles. Full standardized profiles for the ten
   named priority vendors (Peptide Sciences, Biotech Peptides, Core
   Peptides, Pure Rawz, Behemoth Labz, Limitless Life Nootropics, Swiss
   Chems, Peptide Guys, Amino Asylum, Domestic Supply) covering: company
   overview, years in operation, stated legal structure, website
   architecture and UX, complete observed product catalog (with all
   formulation types, all concentration options, all variant distinctions
   such as acetate vs. arginine salt), quality and legitimacy indicators
   (COA availability and hosting, HPLC and mass spec data, named lab
   partners), shipping and logistics including cold chain handling,
   customs declarations language, and countries shipped to, customer
   service infrastructure, payment methods with any jurisdictional
   variation, trust signals, and any documented regulatory actions or
   controversies.

   3c. Extended Vendor Profiles. For the next 20 to 30 vendors by tier
   and market significance, produce standardized profiles at the same
   depth as 3b. For remaining vendors, produce abbreviated profiles
   referencing the vendor profiles file.

   3d. Site Architecture Patterns. Structural patterns observed across
   the vendor universe by tier: homepage design, product page anatomy,
   trust signal placement, checkout flow design, tech stack patterns.
   What high-trust vendors do that low-trust vendors do not.

   3e. Quality Signal Analysis. Distribution of COA availability,
   third-party lab testing posture, HPLC and mass spec data availability,
   named lab partners, and how these correlate with vendor tier and
   pricing.

   3f. Compliance and Legal Posture. Disclaimer language inventory with
   verbatim examples, pattern analysis of the most common formulations,
   site-architecture compliance signals, marketing-language compliance
   patterns, payment-processor posture, and all observed regulatory
   enforcement events with primary-source citations.

4. Mandate 2: Advertising and Customer Acquisition Analysis.

   4a. Channel Taxonomy. Every channel in use across the industry,
   organized by type: search and owned, community, influencer and paid,
   gray-channel and indirect. For each channel: mechanics specific to
   this product category, platform-policy constraints, evidence of scale
   and penetration across the vendor universe.

   4b. Channel-by-Channel Analysis. For each channel: detailed mechanics,
   named vendor examples with URL evidence, cost structure, time horizon
   to traction, risk profile, and industry-wide adoption pattern.

   4c. SEO and Organic Search Deep Dive. Keyword taxonomy, content-
   marketing patterns, domain authority distribution, on-page and
   technical SEO patterns, the educational content economy and its
   connection to conversions. Include any observable data from Ahrefs,
   SEMrush, or SimilarWeb cited in the input files.

   4d. Community Channel Deep Dive. Full Reddit ecosystem map,
   forum-by-forum analysis, Telegram and Discord presence including flash
   sale mechanics, review aggregator role, reputation dynamics, conversion
   funnel pathways.

   4e. Influencer and Creator Ecosystem. Full tiered creator list with
   evidence, affiliate program structures including commission rates,
   attribution mechanics (promo code vs. trackable link), tracking method
   types (last-click cookie, server-to-server postback), cookie durations,
   disclosure norms and observed evasion patterns, podcast and newsletter
   sponsorship landscape.

   4f. Gray-Channel and Indirect Tactic Analysis. How "research purposes
   only" and educational framing function as marketing tactics. How
   nootropics and biohacking communities function as funnel entry points.
   How the audiences of Dr. Peter Attia, Bryan Johnson, and Andrew Huberman
   are targeted. How compounding pharmacy relationships and clinical-
   adjacent language are used for marketing legitimacy. How shadow banning
   is avoided on Instagram and TikTok. How email platforms including
   Klaviyo, Mailchimp, SendGrid, and self-hosted solutions are used given
   the product category.

   4g. Master Channel Ranking. Ranked by industry importance, adoption
   breadth, and apparent contribution to customer acquisition, with
   supporting evidence for every rank position.

5. Mandate 3: Pricing Intelligence and Product Catalog Benchmarking.

   5a. Product Catalog Overview. Every commercially significant peptide
   observed across the vendor universe, with all available forms (vial,
   pre-mixed, nasal spray, oral, topical), all observed concentrations
   and sizes, variant distinctions (e.g., BPC-157 acetate vs. arginine
   salt), and notes on exclusivity or rarity.

   5b. Pricing Matrix Summary. Derived from pricing_matrix.csv. For every
   major peptide: minimum, median, and maximum per-mg price observed
   across the vendor universe. Cross-vendor price comparison tables for
   the most commercially significant peptides. Vendor pricing positioning
   relative to category medians.

   5c. Pricing Strategy Patterns. Volume discount structures, bundle
   pricing and kit pricing (noting the distinction: bundles are multiple
   peptides together; kits include reconstitution supplies), cryptocurrency
   discount rates, subscription and auto-ship pricing, sale frequency and
   typical discount depth by vendor and by peptide.

   5d. Supply and Demand Signals. Peptides consistently out of stock
   across multiple vendors simultaneously (from the cross-vendor OOS
   aggregation in the coverage report), indicating supply constraints or
   demand spikes. Peptides appearing exclusive or rare. Emerging peptides
   gaining commercial traction.

   5e. Stack and Bundle Analysis. Combinations marketed as stacks, at
   what price points, how stack pricing compares to individual SKU pricing.

   5f. Price-Quality Correlation. Observable relationship between pricing
   and quality indicators (COA availability, lab testing, brand reputation
   tier) derived from pricing_matrix.csv cross-referenced with trust
   signal data.

   5g. Pricing Uniformity and Competitive Dynamics. Observable patterns
   of pricing uniformity or aggressive undercutting across vendors, drawn
   from the price uniformity flag table in the coverage report. Interpret
   what the evidence supports regarding pricing coordination, market norm
   convergence, or competitive undercutting. State explicitly what the
   evidence supports and what it does not support.

6. Open Questions. Every research question from the three mandates that
   the inputs did not fully resolve, what would be needed to resolve each,
   and whether a follow-up research pass is warranted.

7. Coverage Gaps. Vendors and data fields not fully captured, what was
   missed, what to revisit, and the methodology impact of those gaps.

8. Appendix A: Full Vendor Master Table. The complete vendor universe
   in tabular form.

9. Appendix B: Pricing Matrix Reference. Key tables from the pricing
   matrix for the most commercially significant peptides.

10. Appendix C: Disclaimer Language Inventory. Verbatim disclaimer texts
    captured across the vendor universe with source citations.

==============================================================
CITATION AND STYLE RULES
==============================================================

- Cite inputs inline by file name and section:
  (slice_3, Reddit subsection) or (vendor profile: BrandX) or
  (pricing_matrix.csv, BPC-157 rows).
- Every specific claim cites a source. Every pricing figure cites
  (pricing_matrix.csv).
- No em-dashes. Use commas, periods, colons, or parentheses.
- No AI tells: no "let's dive in," "I'd be happy to," "in the ever-
  evolving landscape of."
- Direct, declarative, dense. Tables where comparison is involved.
  Prose where prose is right.
- Write in third person. This is an academic report.
- Cite conflicting sources where they exist. State which you took and
  why. Do not paper over contradictions.
- Label proxy-sourced claims as PROXY (forum-reported), PROXY (affiliate
  disclosure), or PROXY (industry analysis).
- Label inferences as INFERRED: and observed facts as OBSERVED: wherever
  the distinction matters.

Begin the synthesis now. Do not ask clarifying questions before
starting. If you find genuine contradictions in the inputs, surface
them in the relevant section and state which side you took and why.
```

**After it finishes:** save the output to `03_final/unified_report.md`. This is the
final academic deliverable.

---

## File Handoff Map

| Step | Produces | Consumed by |
|---|---|---|
| Step 0 | `combined_context.md` | All subsequent steps |
| Slice 1 | `slice_1_vendor_universe.md`, `vendor_list.csv` | Slices 2-5, Track 2, Slice 6, Synthesis |
| Slices 2-5 | `slice_2` through `slice_5` outputs | Slice 6, Synthesis |
| Track 2 | vendor profiles, evidence files, `pricing_matrix.csv`, `coverage_report.md`, `discovery_log.jsonl` | Slice 6, Synthesis |
| Slice 6 | `slice_6_channel_synthesis.md` | Synthesis |
| Synthesis | `unified_report.md` | Final academic deliverable |

**CRITICAL ORDERING:** Slice 6 runs AFTER both Slices 1-5 AND Track 2 are complete.
Slice 6 requires Track 2's pricing_matrix.csv to produce a grounded Mandate 3
synthesis section. Running Slice 6 before Track 2 produces an evidence-starved
Mandate 3 section.

---

## Sanity Checks Between Steps

Do not skip these.

**After Slice 1:** open the vendor list and pick 10 random vendors. Visit each
site yourself. Confirm they exist and the basic data matches. Confirm the ten
named priority vendors (Peptide Sciences, Biotech Peptides, Core Peptides, Pure
Rawz, Behemoth Labz, Limitless Life Nootropics, Swiss Chems, Peptide Guys, Amino
Asylum, Domestic Supply) are all present. If any vendor is invented or wrong, re-run
Slice 1 with explicit feedback.

**After each Slice 2 through 5:** spot-check 5 cited URLs per slice. Confirm they
load and contain what the slice claims. If you find fabrication, push back in the
same chat and have it correct the specific claims. Do not accept unsupported claims.

**After Slice 6:** verify that every rank position in the channel ranking cites a
specific prior slice and section. Verify that the Mandate 3 section cites
pricing_matrix.csv, not the prior ChatGPT slices. If anything is unsupported, push
back.

**After Track 2:** compare `discovery_log.jsonl` line count against the number of
profile JSONs. If wildly mismatched, the agent took shortcuts. Spot-check 5 random
vendor profiles by opening the actual vendor sites and comparing against both the
profile JSON and the evidence file. Verify the priority ten vendors all have complete
profiles.

**After Synthesis:** verify that every claim in the executive summary traces to an
input file. Verify that Mandate 3 figures trace to pricing_matrix.csv, not to the
ChatGPT slices. Verify that the ten priority vendors all have full profiles in
section 3b. Push back on any unsupported assertion.

---

## Cost and Time Estimate

Step 0: 10 to 20 minutes of Claude chat time.

Track 1 (six Deep Research runs): each run is 20 to 45 minutes of wall-clock time.
Total: roughly 3 to 5 hours. Uses 6 of your monthly Deep Research runs.

Track 2 (Claude Code CLI): for 50 vendors, expect 4 to 8 hours of wall-clock time.
For 100 or more vendors, plan 8 to 16 hours. The agent runs autonomously; check
periodically.

Slice 6 (after Track 2): 20 to 45 minutes after you have Track 2 outputs ready.

Step 3 (Synthesis): 30 to 90 minutes of Claude chat time depending on input volume.

**Total wall-clock for the full mission: 1 to 2 calendar days if you push
sequentially with minimal pauses. 5 to 7 days if you run methodically with full
sanity checks between each stage, which is the recommended approach for a research
project requiring this level of accuracy and verifiability.**

---