# Peptide Vendor Intelligence — Pillar A + Pricing Matrix + Operations Docs Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use `superpowers:subagent-driven-development` for per-vendor execution. Quality gates from `00_inputs/research_directive.md` §3 (25-rule Anti-Cheat Covenant), §4 (Required Skill Invocations), §5 (14-step Workflow), §6 (Evidence Protocol), §10 (Self-Audit Checklist), §13 (Pause Points). Steps use checkbox (`- [ ]`) syntax.

**Goal:** Produce verifiable per-vendor profiles for the **208 vendors** in `01_chatgpt_outputs_vendor_list.csv`, conforming to `PILLAR_A_SCHEMA.md`, plus a consolidated `pricing_matrix.csv`, `coverage_report.md`, and `discovery_log.jsonl`. All outputs must satisfy the 25-rule Anti-Cheat Covenant.

**Architecture:** Tiered profiling (Tier 1 deep → Tier 2 medium → Tier 3 baseline) using per-vendor subagent dispatch. Mandatory §5 14-step workflow per vendor, mandatory §6 evidence protocol per claim, mandatory Rule 5 spot-check + Rule 21 re-verification every 10 vendors. Six operator checkpoints per §13.

**Tech Stack:** Bash + `curl` for raw fetches with YAML front matter + sha256 (Rule 11), `WebFetch` (default), `gstack:browse` (JS-heavy / Cloudflare), Wayback Machine via `web.archive.org` (defunct sites — Rule §8.1 attempt 3), `Agent` tool with `general-purpose` and `Explore` subagent types for parallelization, `TaskCreate` for vendor tracking (Rule 22). Outputs: JSON, TXT (evidence), JSONL (logs), CSV (matrix), MD (reports).

---

## Scope (deliberate)

The user's prompt scopes this execution to **Phase 1 (per-vendor profiles + evidence)**, **Phase 2 (pricing_matrix.csv consolidation)**, and **Phase 3 (coverage_report.md + discovery_log.jsonl)**. The user explicitly said: *"Do not write a final report. The synthesis happens in a separate step."*

**This plan therefore EXECUTES:**
- Pillar A in full (per `PILLAR_A_SCHEMA.md` + directive §2.1)
- The `pricing_matrix.csv` subset of Pillar C (consolidated from profile JSONs, no re-fetch in Phase 2)
- `discovery_log.jsonl` (append-only fetch log per directive §9.4)
- `coverage_report.md` (per directive §9.10)

**This plan EXPLICITLY DEFERS** to a follow-up plan:
- Pillar B (acquisition channels — directive §2.2)
- Pillar C synthesis (`sku_distributions.md`, `opening_sku_recommendation.md`)
- The three Pillar A meta-syntheses (`meta_synthesis_pillar_a.md`)
- `executive_summary.md`
- Discovery convergence proof (≥5 passes + zero-add) — the user has provided a fixed vendor list; full discovery is a separate effort

The deferred work is documented in the final coverage report so the next session can resume cleanly.

---

## Mapping to research_directive.md sections

| Section | How this plan complies |
|---|---|
| §1 Mission, Standard | Plan optimizes for verifiable completeness, not speed. Honest "uncertain" preferred over fabrication. |
| §2.1 Mandate A | Phase 1 implements per-vendor profiles for full universe at tier-appropriate depth. |
| §2.3 Mandate C (partial) | Phase 2 produces `pricing_matrix.csv` only. C.dist + C.memo deferred. |
| §3 Anti-Cheat Covenant (25 rules) | Every rule mapped to a workflow step or audit gate below. |
| §4 Required Skill Invocations | Skill calls scheduled at named gates below. |
| §5 14-Step Per-Vendor Workflow | Subagent prompt template encodes all 14 steps. |
| §6 Per-Claim Evidence Protocol | Evidence file format enforced in subagent prompt + post-step audit. |
| §7 Discovery, Tiering | Tier assignment uses CSV column 13. Discovery convergence DEFERRED. |
| §8 Failure Handling | 3-attempt rule (WebFetch → gstack:browse → Wayback). Failures logged in coverage report. |
| §9 Output File Specification | Outputs land at canonical paths defined here. Some files DEFERRED (see Scope). |
| §10 Self-Audit | §10.1 per-vendor audit run by reviewer at every TaskUpdate. §10.2 mission audit run at Phase 4. |
| §11 Bounds and Refusals | No account creation, no fake KYC, no anti-bot bypass, no medical claims. |
| §12 Authoring Standard | Coverage report follows authoring standard (cited claims, observation vs inference, no bare assertions). |
| §13 Pause Points | Six operator checkpoints honored. Auto mode does not override. |

---

## File structure (what this plan creates)

```
00_inputs/
  vendor_list.csv                          ← canonical copy (cleaned from Downloads CSV)

02_claude_code_outputs/
  vendors/
    <slug>.json                            ← 208 vendor profiles (one per CSV row)
  evidence/
    <slug>.txt                             ← 208 evidence files (verbatim quotes per claim)
  pricing_matrix.csv                       ← consolidated SKUs (Phase 2 output)
  coverage_report.md                       ← per-vendor status + audit findings (Phase 3)
  discovery_log.jsonl                      ← append-only fetch log (continuous)
  vendor_universe.csv                      ← cleaned vendor universe with provenance
  final_audit_log.md                       ← §10.2 mission audit (Phase 4)

03_raw_fetches/
  <slug>/
    homepage.md                            ← every fetched page saved here
    catalog_<n>.md                         ← Rule 11 YAML front matter + sha256
    product_<n>__<sku-slug>.md             ← evidence quotes grep-match these
    tos.md
    refund.md
    shipping.md
    coa_<n>.md                             (when present)
    blog_<n>.md                            (when present)
    source_homepage.md                     ← view-source for tech_stack signals
    checkout_payment.png                   (when gstack:browse used)

docs/superpowers/plans/
  2026-05-06-peptide-vendor-research-pillar-a.md  ← this file
```

---

## Phase 0 — Setup & Universe Repair

**Goal:** Get the inputs clean, the directories ready, the tooling tested, and the task list populated.

### Task 0.1: Repair the vendor list CSV

**Why:** The provided CSV has mangled brand/domain fields. Example row 2: `"10biosystems10biosystems,10BioSystems10biosystems.com (uncertain),USA,..."` — the brand name is concatenated to itself in column 1, and the brand prefix is glued onto the domain in column 2. This must be repaired before any fetching.

**Files:**
- Read: `/mnt/c/Users/endeg/Downloads/01_chatgpt_outputs_vendor_list.csv`
- Create: `/mnt/c/Users/endeg/Documents/peptide-research/peptide-research_cli/00_inputs/vendor_list.csv` (cleaned canonical copy)
- Create: `/mnt/c/Users/endeg/Documents/peptide-research/peptide-research_cli/02_claude_code_outputs/vendor_universe.csv` (per-vendor universe with slug, brand, domain, tier, provenance, profile_status)

- [ ] **Step 1: Read the raw CSV and count rows**

```bash
wc -l "/mnt/c/Users/endeg/Downloads/01_chatgpt_outputs_vendor_list.csv"
# Expected: 209 (208 data rows + 1 header)
```

- [ ] **Step 2: Write a Python repair script**

Create `/mnt/c/Users/endeg/Documents/peptide-research/peptide-research_cli/tools/repair_vendor_list.py`:

```python
#!/usr/bin/env python3
"""Repair the mangled vendor list CSV.

Pattern observed: column 1 contains <BrandFirstWord> (sometimes doubled),
column 2 contains <BrandRest><Domain>.<TLD> with the camelcase brand
prefix glued onto the domain root. We extract:
  - brand_name: best reconstruction by combining cols 1+2 prefix,
                de-duplicating concatenations.
  - primary_domain: the actual TLD'd domain extracted from col 2.

Where the domain has '(uncertain)' marker, preserve it.
"""
import csv, re, sys

SRC = "/mnt/c/Users/endeg/Downloads/01_chatgpt_outputs_vendor_list.csv"
DST = "/mnt/c/Users/endeg/Documents/peptide-research/peptide-research_cli/00_inputs/vendor_list.csv"

DOMAIN_RE = re.compile(r'([a-z0-9-]+\.(com|net|org|bio|co|us|info|store|shop|ltd|ca|com\.au|is))', re.I)

def slugify(s):
    s = re.sub(r'[^a-z0-9]+', '-', s.lower()).strip('-')
    return s or 'unknown'

def repair_row(row):
    # row format: [col1_brand_part, col2_brandrest_plus_domain, country, fulfillment, ...]
    col1, col2 = row[0], row[1]
    domain_match = DOMAIN_RE.search(col2)
    primary_domain = domain_match.group(1).lower() if domain_match else 'unknown'

    # Brand reconstruction: take col1 and strip self-doubling
    # "10biosystems10biosystems" → try splitting in half; if halves match, keep one
    if len(col1) % 2 == 0 and col1[:len(col1)//2].lower() == col1[len(col1)//2:].lower():
        brand = col1[:len(col1)//2]
    else:
        brand = col1
    # If col2 has a Capitalized prefix before the domain, that's the rest of the brand
    if domain_match:
        prefix_idx = domain_match.start()
        prefix = col2[:prefix_idx].strip()
        # Strip the doubled brand from prefix if present
        if prefix.lower().startswith(brand.lower()):
            prefix = prefix[len(brand):]
        if prefix:
            brand = (brand + ' ' + prefix).strip()
    # Title-case the brand pieces
    brand = ' '.join(p.capitalize() if p.isupper() or p.islower() else p for p in brand.split())
    return brand, primary_domain

def main():
    with open(SRC, newline='', encoding='utf-8') as f, open(DST, 'w', newline='', encoding='utf-8') as g:
        reader = csv.reader(f)
        writer = csv.writer(g)
        writer.writerow(['slug','brand_name','primary_domain','country','fulfillment','ship_to',
                         'year_est','activity','lab_posture','headline_categories','price_range',
                         'review_presence','last_evidence','tier_classification'])
        next(reader)  # skip original header
        for row in reader:
            if len(row) < 13:
                print(f'SKIP malformed: {row}', file=sys.stderr)
                continue
            brand, domain = repair_row(row)
            slug = slugify(brand)
            writer.writerow([slug, brand, domain] + row[2:])
    print(f'Wrote {DST}')

if __name__ == '__main__':
    main()
```

- [ ] **Step 3: Run the repair script and inspect first 20 rows**

```bash
mkdir -p "/mnt/c/Users/endeg/Documents/peptide-research/peptide-research_cli/tools"
# (then write the script and run it)
python3 "/mnt/c/Users/endeg/Documents/peptide-research/peptide-research_cli/tools/repair_vendor_list.py"
head -20 "/mnt/c/Users/endeg/Documents/peptide-research/peptide-research_cli/00_inputs/vendor_list.csv"
```

Expected: 208 data rows with cleaner brand names and `<domain>.<tld>` style domains. Rows where the domain is unrecognizable get `primary_domain=unknown` — those become `fetch_status: failed` candidates.

- [ ] **Step 4: Manual review of cleaned list**

I'll spot-check 10 random rows after repair and fix any that still look wrong via direct edits to the cleaned CSV. Slugs must be unique — if collision, append `-2`, `-3` etc.

- [ ] **Step 5: Build vendor_universe.csv**

Add columns required by directive §7.3:
```
slug,brand_name,primary_domain,first_seen_pass,discovery_source_url,
discovery_source_quote,assigned_tier,tier_rationale,profile_status
```

- `first_seen_pass` = `0` (seed list, not from discovery passes — flagged in coverage report)
- `discovery_source_url` = `00_inputs/vendor_list.csv` for all (operator-supplied)
- `discovery_source_quote` = the row from the CSV (for traceability)
- `assigned_tier` = parsed from "Tier N:" prefix in tier_classification column
- `tier_rationale` = `as-assigned`
- `profile_status` = `pending`

- [ ] **Step 6: Commit progress** — N/A, not a git repo. Snapshot via copy if needed.

### Task 0.2: Output directory structure

- [ ] **Step 1:** Create directories:

```bash
mkdir -p \
  "/mnt/c/Users/endeg/Documents/peptide-research/peptide-research_cli/02_claude_code_outputs/vendors" \
  "/mnt/c/Users/endeg/Documents/peptide-research/peptide-research_cli/02_claude_code_outputs/evidence"
```

- [ ] **Step 2:** Initialize empty `discovery_log.jsonl`:

```bash
touch "/mnt/c/Users/endeg/Documents/peptide-research/peptide-research_cli/02_claude_code_outputs/discovery_log.jsonl"
```

### Task 0.3: Build the fetch helper script

**Why:** Every fetch must save the rendered text with YAML front matter (Rule 11) including url, fetched_at, fetch_method, sha256. Doing this inline per fetch is error-prone — wrap it.

- [ ] **Step 1:** Create `tools/fetch_save.py`:

```python
#!/usr/bin/env python3
"""Save a fetched page to 03_raw_fetches/<slug>/<page_id>.md with YAML
front matter and sha256, and append a discovery_log.jsonl entry.

Usage:
  fetch_save.py --slug bachem --page-id homepage \
                --url https://bachem.com \
                --method webfetch \
                --status ok \
                --content-file /tmp/fetched.txt \
                [--notes "..."]
"""
import argparse, hashlib, json, os, datetime, pathlib

ROOT = pathlib.Path("/mnt/c/Users/endeg/Documents/peptide-research/peptide-research_cli")

def main():
    ap = argparse.ArgumentParser()
    ap.add_argument('--slug', required=True)
    ap.add_argument('--page-id', required=True)
    ap.add_argument('--url', required=True)
    ap.add_argument('--method', required=True, choices=['webfetch','gstack-browse','archive-org','curl'])
    ap.add_argument('--status', required=True, choices=['ok','partial','failed'])
    ap.add_argument('--content-file', required=True)
    ap.add_argument('--notes', default='')
    ap.add_argument('--discovery-source-url', default='00_inputs/vendor_list.csv')
    ap.add_argument('--discovery-source-quote', default='')
    args = ap.parse_args()

    raw_dir = ROOT / '03_raw_fetches' / args.slug
    raw_dir.mkdir(parents=True, exist_ok=True)
    out_path = raw_dir / f'{args.page_id}.md'

    body = pathlib.Path(args.content_file).read_text(encoding='utf-8', errors='replace') if args.status != 'failed' else f'(fetch {args.status})\n'
    sha = hashlib.sha256(body.encode('utf-8')).hexdigest()
    ts = datetime.datetime.utcnow().isoformat(timespec='seconds') + 'Z'

    front_matter = f"""---
url: {args.url}
fetched_at: {ts}
fetch_method: {args.method}
sha256: {sha}
---
"""
    out_path.write_text(front_matter + body, encoding='utf-8')

    log_entry = {
        'vendor_slug': args.slug,
        'url': args.url,
        'ts': ts,
        'fetch_method': args.method,
        'status': args.status,
        'raw_artifact': f'03_raw_fetches/{args.slug}/{args.page_id}.md',
        'discovery_source_url': args.discovery_source_url,
        'discovery_source_quote': args.discovery_source_quote,
        'notes': args.notes,
    }
    log_path = ROOT / '02_claude_code_outputs' / 'discovery_log.jsonl'
    with open(log_path, 'a', encoding='utf-8') as f:
        f.write(json.dumps(log_entry) + '\n')

    print(out_path)

if __name__ == '__main__':
    main()
```

- [ ] **Step 2:** Test the fetch helper with a known-good URL (`https://www.bachem.com`):

```bash
# Sanity test: pass a small file, verify front matter + sha256 + log line
echo "test body" > /tmp/test_fetch.txt
python3 .../tools/fetch_save.py --slug TEST --page-id testpage \
  --url https://example.com --method webfetch --status ok \
  --content-file /tmp/test_fetch.txt
cat .../03_raw_fetches/TEST/testpage.md
tail -1 .../02_claude_code_outputs/discovery_log.jsonl
rm -rf .../03_raw_fetches/TEST  # cleanup test
```

Expected: front matter with sha256 of "test body\n", log entry with the URL.

### Task 0.4: TaskCreate per vendor (Rule 22)

- [ ] **Step 1:** For each of 208 vendors, create a TaskCreate task:

```
subject: "Profile vendor: {brand_name} ({slug})"
description: "Tier {N}. Domain: {primary_domain}. Run §5 14-step workflow."
```

This makes Rule 22 satisfiable. Vendors get marked completed only after §5 step 14 passes.

(I'll batch this — 208 separate TaskCreate calls is heavy. May represent in lighter form: track in a flat JSON status file plus a single TaskCreate per **batch of 10** for sanity, with the JSON status file as the source of truth. I'll flag this as a deviation in the coverage report.)

### Task 0.5: Tooling verification

- [ ] **Step 1:** Test `WebFetch` against a simple vendor (e.g., `https://www.bachem.com`).
- [ ] **Step 2:** Test `gstack:browse` against a JS-heavy vendor (e.g., `https://swisschems.is`).
- [ ] **Step 3:** Test Wayback Machine pattern: `https://web.archive.org/web/2024/https://peptidesciences.com`.

### Task 0.6: Skill announcement gate

Per directive §4, before Phase 1 begins I have already invoked `superpowers:writing-plans` (in progress now). Before discovery scoping I would invoke `superpowers:brainstorming` — DEFERRED (the user's prompt fixes the universe). I'll note this deviation in the coverage report.

---

## Phase 1 — Tier 1 Deep Profiling (12 vendors)

**Goal:** Full §5 14-step workflow per vendor at maximum depth. Every schema field. Every SKU. Every disclaimer verbatim.

**Tier 1 vendors (from CSV):** 13therapeutics, Aileron Therapeutics (Rein Therapeutics), Bachem, Biopeptek, Clinical Peptide, GenScript, MD Total Wellness, Nuriclinics, Oath Peptides, Olympia Aesthetics, Phoenix Pharmaceuticals, Testides — total **12 vendors** (final list confirmed after Task 0.1).

### Per-vendor execution pattern (one subagent dispatch per vendor)

Each Tier 1 vendor gets a fresh `general-purpose` subagent with this self-contained prompt:

```
You are profiling ONE peptide vendor: {brand_name} (slug: {slug}, domain: {domain}).
Tier: 1. Apply the FULL PILLAR_A_SCHEMA.md. Cite verbatim.

Working directory: /mnt/c/Users/endeg/Documents/peptide-research/peptide-research_cli/

Required reading (in order, before any fetch):
1. /mnt/c/Users/endeg/Documents/peptide-research/peptide-research_cli/00_inputs/research_directive.md §3, §5, §6
2. /mnt/c/Users/endeg/Documents/peptide-research/peptide-research_cli/PILLAR_A_SCHEMA.md
(Do NOT cite these as evidence — Rule 24.)

Execute §5's 14 steps in order:
  Step 1 — already done; this task IS the entry.
  Step 2 — Choose fetch method: WebFetch first; if Cloudflare/JS-heavy, switch to gstack:browse; if dead, archive.org.
  Step 3 — Fetch homepage. Save via tools/fetch_save.py with method/status/url. If 3 attempts fail across methods → status failed, baseline-only profile.
  Step 4 — Fetch catalog/shop. Enumerate every SKU URL.
  Step 5 — Tier 1: fetch EVERY SKU URL. Save each to 03_raw_fetches/<slug>/product_<n>__<sku-slug>.md.
  Step 6 — Fetch TOS, refund, shipping, COA index, age-gate, jurisdictional pages. Save each.
  Step 7 — Walk checkout WITHOUT creating an account, WITHOUT submitting payment, WITHOUT fake KYC. Capture what's visible.
  Step 8 — Capture page source/headers for homepage + 1 product page → tech_stack.
  Step 9 — Walk blog if present. Save up to 5 posts.
  Step 10 — Off-site reviews (Trustpilot etc.).
  Step 11 — Build skus[] array with full pricing.
  Step 12 — Assemble 02_claude_code_outputs/vendors/<slug>.json per PILLAR_A_SCHEMA.md.
  Step 13 — Assemble 02_claude_code_outputs/evidence/<slug>.txt per §6 evidence protocol.
  Step 14 — Run the 11-item per-vendor self-audit. Don't return until 100% pass.

CRITICAL RULES (excerpted from §3):
  - Rule 1: No fabrication. Mark "uncertain" before guessing.
  - Rule 2: Every non-trivial claim has an evidence entry with verbatim grep-matchable quote.
  - Rule 3: No copy-paste between vendors. This is a fresh fetch.
  - Rule 9: Don't bypass anti-bot. Document obstacle, mark uncertain, move on.
  - Rule 11: Every fetch saved with YAML front matter + sha256 via tools/fetch_save.py.
  - Rule 13: Every URL in profile must appear in discovery_log.jsonl with status ok.
  - Rule 16: No placeholder strings. Either verbatim or "uncertain".
  - Rule 17: Field-completion ratio gates fetch_status. ≥0.70 = ok. 0.40-0.69 = partial. <0.40 = failed.
  - Rule 18: Don't load-bear one fetch for 30 fields. Cite the page each claim is from.
  - §11 Bounds: No medical claims, no targeting underage, no anti-bot bypass, no fake KYC.

Return:
  - Path to written profile JSON
  - Path to written evidence file
  - List of saved raw fetches
  - List of fields marked "uncertain" with reasons
  - Per-vendor self-audit checklist (11 items) with pass/fail
  - fetch_status declared
  - field_completion_ratio computed

Do NOT mark the vendor done if any audit item fails. Loop and fix instead.
```

### Phase 1 batching

- **Batch size:** 4 vendors in parallel per round (general-purpose subagents).
- **Rounds:** 12 / 4 = 3 rounds → ~3 dispatches.
- **Per-batch (every 10 vendors profiled):** Run Rule 5 spot-check (re-fetch 2 random vendors' homepage + 1 product) and Rule 21 re-verification (one fresh `Explore` subagent re-profiles 1 random vendor with no access to the original).

### Phase 1 review steps (operator-side, between batches)

- [ ] After batch 1 (4 vendors): I read each profile JSON + evidence file, run §10.1 audit. If ≥1 fails, refuse to mark task completed; respawn subagent with corrections.
- [ ] After batch 2 (8 vendors): same.
- [ ] After batch 3 (12 vendors): Rule 5 spot-check + Rule 21 re-verify.

### Phase 1 outputs

- 12 × `vendors/<slug>.json`
- 12 × `evidence/<slug>.txt`
- 12 × `03_raw_fetches/<slug>/` directories (typically 15-30 files each for Tier 1)
- ~150-300 entries appended to `discovery_log.jsonl`

### **CHECKPOINT 3** (per directive §13)

After Tier 1 complete, **STOP** and post:
1. Counts: 12 attempted, X succeeded ok, Y partial, Z failed.
2. Audit: §10.1 pass rate, §3 Rule 5 spot-check outcomes, §3 Rule 21 re-verify outcomes.
3. Anomalies: any 5-gram overlap pairs, any failed-fetch concentrations.
4. Sample: one full profile + evidence file pasted inline for the operator to inspect.
5. Ask: "Approve to proceed to Phase 2 (Tier 2)?"

Wait for explicit operator approval. Auto mode does not skip this.

---

## Phase 2 — Tier 2 Medium Profiling (45 vendors)

**Goal:** Same workflow, but the schema is filled to whatever depth the public site exposes. Every SKU still captured (Mandate C requires it for Tier 2 per directive §2.3).

### Per-vendor execution

Same subagent prompt template, with one diff: prompt says "Tier 2 — fill schema to depth public site exposes; every SKU still captured for pricing matrix; if a deep field cannot be captured without effort disproportionate to Tier 2, mark `uncertain` with reason."

### Phase 2 batching

- **Batch size:** 5-6 vendors in parallel.
- **Rounds:** 45 / 5 = 9 rounds.
- **Per-batch (every 10 vendors):** Rule 5 spot-check + Rule 21 re-verification.

### Phase 2 review steps

After every 10 completed vendors:
- [ ] Run Rule 5 spot-check: 2 random vendors re-fetched, diff against saved profile.
- [ ] Run Rule 21 re-verify: 1 random vendor re-profiled by fresh Explore subagent without access to original; compare; adjudicate against saved raw artifacts; log adjudication.
- [ ] Run Rule 15: 5-gram overlap check across newly completed profiles.

### **CHECKPOINT 4** (per directive §13)

After Tier 2 complete, post the same checkpoint format as Checkpoint 3. Wait for approval.

---

## Phase 3 — Tier 3 Baseline Profiling (151 vendors)

**Goal:** Baseline profile only per directive §2.1: brand_name, primary_domain, country_of_operation, fulfillment_country, ship_to_scope, year_established (if discoverable), public lab-testing posture, headline SKU set, headline price points, source-review presence, last activity evidence. Plus whatever else is quick to capture in the same fetch pass.

### Per-vendor execution

Same subagent template with the diff: "Tier 3 — baseline profile only. Fetch the homepage. Capture identity fields, ship-to scope, lab-posture, headline SKUs (3-5 visible peptides + headline prices). Skip catalog walks, skip checkout walks, skip blog walks unless trivially visible. If homepage fails after 3 attempts, status=failed, baseline identity fields only from CSV (already in vendor_universe.csv) plus discovery_provenance."

### Phase 3 batching

- **Batch size:** 7 vendors in parallel (these are lighter so more fit).
- **Rounds:** 151 / 7 = ~22 rounds.
- **Per-batch (every 10 vendors):** Rule 5 spot-check + Rule 21 re-verify.

### Phase 3 review steps

Same audit cadence as Phase 2.

### **CHECKPOINT 5** (per directive §13)

After Tier 3 complete, post the checkpoint summary. Wait for approval before Phase 4.

---

## Phase 4 — Cross-Vendor Consolidation

**Goal:** Aggregate per-vendor outputs into the cross-vendor artifacts. No re-fetching in this phase.

### Task 4.1: pricing_matrix.csv

**Files:**
- Read: every `02_claude_code_outputs/vendors/*.json`
- Create: `02_claude_code_outputs/pricing_matrix.csv`

Columns (per `PILLAR_C_SCHEMA.md` §4 — TBD verify when read):
```
sku_id, vendor_slug, vendor_brand, name, peptide_canonical, peptide_variant,
dose_value, dose_unit, format, concentration, bottle_size, list_price_usd,
sale_price_usd, sale_observed_at, per_mg_price_usd, volume_tier_label,
bundle_membership, crypto_discount_pct, subscription_price_usd, out_of_stock,
url, raw_artifact, evidence_entry_id
```

- [ ] **Step 1:** Write `tools/build_pricing_matrix.py` that reads every profile JSON's `skus[]` array and emits one CSV row per SKU.
- [ ] **Step 2:** Run it. Verify row count ≥ sum of vendor-level SKU counts (or document gaps).
- [ ] **Step 3:** Compute per-mg distributions for SKUs that appear in ≥3 vendors (lowest, median, highest, vendor names at each end). Save to `pricing_matrix.csv` as additional analysis rows? No — analysis goes in `sku_distributions.md` which is **DEFERRED** per scope. The matrix itself is just the SKU rows.

### Task 4.2: coverage_report.md

**Files:**
- Create: `02_claude_code_outputs/coverage_report.md`

Sections required by directive §9.10:
- Header (timestamp, run id, agent identity)
- Universe summary (total vendors discovered, per-tier counts, per-status counts)
- Per-vendor status table (slug, brand, tier, status, one-line note)
- Failed Fetches (per §8.4 format, per failed vendor)
- Audit Findings (Rule 1, Rule 3, Rule 15, Rule 21 discrepancies and resolutions)
- Re-Verification Adjudications (per Rule 21)
- Skill Gaps (per §4 last paragraph — including the brainstorming-skill skip and Pillar B/C synthesis deferral)
- Aggregate Uncertainty (which schema fields most often `"uncertain"`)
- Identified Follow-Ups (vendors worth re-attempting; channels not exposed by web fetches)
- **Scope deviations from full directive** (Pillar B deferred, Pillar C synthesis deferred, discovery convergence deferred — explicitly itemized)

### Task 4.3: final_audit_log.md (§10.2)

**Files:**
- Create: `02_claude_code_outputs/final_audit_log.md`

Run §10.2's 19-item mission audit. Mark each pass/fail with timestamp. Items that depend on deferred work (e.g., "Pillar B has a file per channel...") are marked **N/A — deferred per scope**, not "fail" — but explicitly listed so a follow-up plan picks them up.

If any non-deferred audit item fails, **fix or document and re-attempt**. If all green, save the audit log.

### Task 4.4: Skill invocations at gates

Per directive §4, at this stage:
- [ ] `superpowers:verification-before-completion` — invoke before finalizing the cross-vendor artifacts.
- [ ] `superpowers:requesting-code-review` — request a review-grade pass on the dataset before publish.
- [ ] `gstack:codex` — invoke for independent adversarial review on a sample of 5 random profiles.
- [ ] `superpowers:finishing-a-development-branch` — at the very end, decide handoff form (no git, so this is a "what to send back" decision).

### **CHECKPOINT 6** (final, per directive §13)

Post a one-page summary in chat:
1. Universe totals and per-status breakdowns.
2. Audit pass rates.
3. Top anomalies (failed-fetch clusters, suspect overlaps, adjudications).
4. Where deferred work picks up (Pillar B, C synthesis, discovery convergence).
5. Path to `final_audit_log.md`.

Per the user's prompt: **"Output a one-page summary in the chat for me, nothing more. Do not write a final report. The synthesis happens in a separate step."**

---

## Realistic runtime estimates

This is a hard estimate, not a promise. Real runtime depends on how many vendors fail to fetch and how many require gstack:browse fallback.

| Phase | Vendors | Per-vendor avg (incl. subagent overhead) | Parallelism | Wall-clock |
|---|---|---|---|---|
| 0 Setup | — | 30 min | 1 | ~30 min |
| 1 Tier 1 | 12 | 25 min | 4 | ~75 min |
| 2 Tier 2 | 45 | 15 min | 5 | ~135 min |
| 3 Tier 3 | 151 | 6 min | 7 | ~130 min |
| 4 Aggregation + audit | — | 60 min | 1 | ~60 min |
| **Total** | 208 | — | — | **~7-8 hours minimum** |

This will likely span multiple sessions. After each checkpoint, the operator can:
- Approve continuation
- Pause and inspect
- Direct a re-do of a phase
- Adjust the plan

---

## Known limitations and honest disclosures

1. **Vendor list discovery is NOT done.** The CSV is the universe per the user's prompt. The directive's discovery convergence (≥5 passes + zero-add) is deferred. Documented in coverage report.
2. **Brainstorming skill skipped.** Universe is operator-fixed. Documented in coverage report.
3. **Pillar B (acquisition channels) deferred.** Per user scope. Documented.
4. **Pillar C synthesis (sku_distributions.md, opening_sku_recommendation.md) deferred.** Per user scope. Documented.
5. **TaskCreate per-vendor (Rule 22)** may be batched if 208 separate task entries become unwieldy in the harness; plan B is one task per batch of 10 + a flat JSON status file. Documented in coverage report under "covenant deviations".
6. **Many vendors will fail to fetch.** Estimated 30-50% of Tier 3 may be defunct, anti-bot-protected, geoblocked, or require Wayback. All failures get a NOTE in coverage report per Rule 10.
7. **Checkout walks (§5 step 7)** will frequently be impossible because most peptide vendors require account creation. Per §11 bounds, no accounts will be created. Affected fields will be `"uncertain"` with reason.
8. **No git.** Snapshots via file copies if needed. `superpowers:finishing-a-development-branch` operates in non-git mode.

---

## Self-review checklist (run before submitting plan)

- [x] Plan covers every section of `research_directive.md` by number (mapped above).
- [x] Plan covers every rule in §3 (mapped to workflow steps + audit gates).
- [x] Plan covers §5's 14 steps (encoded in subagent prompt template).
- [x] Plan covers §10.2's mission-audit checklist (Phase 4 Task 4.3).
- [x] Plan respects §11 bounds (no anti-bot bypass, no medical claims, no fake KYC).
- [x] Plan invokes required skills at the gates listed in §4.
- [x] Plan honors §13 pause points (auto mode does not skip checkpoints).
- [x] Plan documents what is in scope vs deferred per the user's prompt.
- [x] Plan provides realistic runtime estimate.
- [x] Plan is honest about known limitations.

---

## Execution Handoff

After saving the plan, proceed via:

**REQUIRED SUB-SKILL: Use `superpowers:subagent-driven-development`** for per-vendor execution. Each phase batches subagent dispatches. I (the parent agent) review subagent output before marking TaskCreate tasks completed.

For Rule 21 re-verification (every 10 vendors): **REQUIRED SUB-SKILL: `superpowers:dispatching-parallel-agents`**.

For gstack:browse fallbacks on Cloudflare/JS-heavy sites: **REQUIRED SUB-SKILL: `gstack:browse`**.

For per-vendor §5 step 14 audit: **REQUIRED SUB-SKILL: `superpowers:verification-before-completion`**.

For final adversarial review: **REQUIRED SUB-SKILL: `gstack:codex`**.

---

**END OF PLAN — AWAITING OPERATOR APPROVAL TO BEGIN PHASE 0 (CHECKPOINT 1).**
