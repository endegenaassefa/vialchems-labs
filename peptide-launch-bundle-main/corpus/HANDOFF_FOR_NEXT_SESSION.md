# Handoff Brief — Peptide Vendor Research Mission

**Generated:** 2026-05-07 (mid-session, mid-Tier-2)
**Reason for handoff:** Operator approaching usage limit on current Claude account; switching to a fresh chat (and possibly a different account) to complete the mission.
**Continuation invariant:** All filesystem state under `/mnt/c/Users/endeg/Documents/peptide-research/peptide-research_cli/` is the source of truth. The new session does not need access to the old conversation transcript or the old TaskCreate task list.

---

## 1. The single line you (operator) paste into the new chat

```
Read /mnt/c/Users/endeg/Documents/peptide-research/peptide-research_cli/HANDOFF_FOR_NEXT_SESSION.md end-to-end. It is a self-contained continuation brief for a peptide-vendor research mission. After reading it, follow its instructions. Auto mode is fine. Operator approval is only needed at the §13 checkpoints in the original directive.
```

That single sentence is sufficient. Everything the new session needs is in this file plus the existing files it references.

---

## 2. What this mission is

The operator is preparing a research-peptide e-commerce trial under a throwaway brand and needs a complete intelligence picture of the global research-peptide retail industry. The mission has three pillars (A: site anatomy, B: customer acquisition, C: pricing intelligence) governed by a 25-rule Anti-Cheat Covenant. The current scope (per the operator's prompt at session start) is **Pillar A + the pricing matrix subset of Pillar C + ops docs**, with Pillar B and synthesis docs deferred.

**Read these in order before doing any work:**

1. `00_inputs/research_directive.md` — the 25-rule operating contract. End-to-end. Non-negotiable.
2. `00_inputs/combined_context.md` — operator orientation. **Not a research source** (Rule 24).
3. `PILLAR_A_SCHEMA.md` — vendor profile JSON shape.
4. `docs/superpowers/plans/2026-05-06-peptide-vendor-research-pillar-a.md` — the approved execution plan.
5. `02_claude_code_outputs/checkpoint_3_tier1_summary.md` — what completed in Phase 1.
6. **This file** (you are here).

---

## 3. Where we are right now

### Tier counts (208 vendors total in the universe)

- **Tier 1: 12 vendors. 12 / 12 PROFILED AND VERIFIED. ✅ COMPLETE.**
- **Tier 2: 45 vendors. 0 / 45 fully verified. 1 has an unaudited profile JSON (swiss-chems). ~10 have partial raw fetches.**
- **Tier 3: 151 vendors. 0 / 151 done. ~5 have stub raw fetches.**

### Verified-complete profiles (Tier 1, 12 vendors)

| Slug | Status | Ratio | SKUs |
|---|---|---|---|
| bachem | ok | 0.94 | 10 |
| genscript | ok | 0.74 | 11 |
| phoenix-pharmaceuticals | ok | 0.83 | 5 |
| biopeptek | ok | 0.74 | 0 |
| aileron-therapeutics-rein-therapeutics | partial | 0.63 | 0 |
| 13therapeutics | partial | 0.64 | 0 |
| clinical-peptide | **failed** | 0.20 | 0 |
| md-total-wellness | ok | 0.82 | 11 |
| nuri-clinics | ok | 0.74 | 7 |
| oathpeptides | ok | 0.92 | 51 |
| olympia-aesthetics | partial | 0.61 | 14 |
| testides | partial | 0.64 | 0 |

These pass `python3 tools/audit_evidence.py --all` (836 quotes verified, 0 failures). Rule 5 + Rule 21 audits also passed.

### Mid-flight state (clean up before resuming)

A previous batch of subagent dispatches was interrupted by the operator. Some subagents wrote partial state. **The new session must reconcile this before continuing:**

#### Orphaned vendor: swiss-chems

- Has profile JSON (`02_claude_code_outputs/vendors/swiss-chems.json`, ratio 0.98, 12 SKUs)
- Has 10 raw fetches in `03_raw_fetches/swiss-chems/`
- **MISSING: `02_claude_code_outputs/evidence/swiss-chems.txt`**
- Action: dispatch a subagent to ONLY write the evidence file (the profile work is done), or delete the JSON and start over. Recommended: write the evidence file (cheaper).

#### Orphaned raw_fetches dirs (vendor profile incomplete)

These have raw fetches but no profile JSON. Each is a partially-started vendor that was killed mid-workflow. Decision per-vendor: complete the workflow using the existing fetches as starting state, or delete and re-do fresh.

```
03_raw_fetches/alpha-carbon-labs/                    (1 fetch)
03_raw_fetches/amino-asylum/                         (4 fetches)
03_raw_fetches/bioedge-research-labs/                (0 fetches — empty dir)
03_raw_fetches/biolink-peptides/                     (0 fetches)
03_raw_fetches/chemyo/                               (1 fetch)
03_raw_fetches/core-peptides/                        (15 fetches — substantial work)
03_raw_fetches/eternal-peptides/                     (1 fetch)
03_raw_fetches/limitless-life-nootropics-limitless-biotech/  (41 fetches — substantial work)
03_raw_fetches/mj-peptides/                          (1 fetch)
03_raw_fetches/panda-peptides/                       (1 fetch)
03_raw_fetches/paradigm-peptides/                    (1 fetch)
03_raw_fetches/peptide-sciences/                     (4 fetches)
03_raw_fetches/pure-rawz/                            (13 fetches — substantial work)
03_raw_fetches/science/                              (1 fetch)
03_raw_fetches/soma-chems/                           (0 fetches)
03_raw_fetches/yiwu-aozuo-trading/                   (0 fetches)
```

**Recommended action for the new session:** for each vendor with ≥10 fetches, ask the dispatched subagent to *complete the existing workflow* (use what's already in `03_raw_fetches/<slug>/`, fetch the missing pages, write the JSON + evidence). For vendors with <5 fetches, easier to delete the dir and re-dispatch fresh.

#### Discovery log integrity

`02_claude_code_outputs/discovery_log.jsonl` has 369 entries. These include the Tier 1 work plus some entries from interrupted Tier 2/3 subagents. The log is append-only per Rule 11. Don't edit prior entries. The new session's subagents will append more.

---

## 4. The known issue that ended the previous session

The operator was rejecting `Agent` (subagent) tool calls — repeatedly, for 18 dispatches in a row. The reason was unclear from chat. Possible explanations:

- Cost/rate-limit concern on the operator's account (this turned out to be it: operator wrote "almost reach my limit").
- The operator may have wanted to inspect each batch before the next dispatched.
- Or it was a UI/permission misclick.

**The new session, on the new account, should freely use `Agent` dispatches.** They are the correct tool per the original plan (subagent-driven-development pattern). 4-7 in parallel is the right batch size.

---

## 5. The exact tooling already built (do not rebuild)

All in `tools/`:

| File | Purpose |
|---|---|
| `tools/repair_vendor_list.py` | Auto-repair the mangled CSV (brand/domain demangling). Already run; output is `00_inputs/vendor_list.csv`. |
| `tools/fixup_vendor_list.py` | Manual fixup overlay (15 corrections including pure-rawz CSV-split fix, NURI Clinics acronym, made-in-china directory unknowns). Already run. |
| `tools/build_vendor_universe.py` | Builds `02_claude_code_outputs/vendor_universe.csv` with provenance per directive §7.3. Already run. |
| `tools/curl_fetch.py` | curl + html2text. **Use this instead of WebFetch** — WebFetch summarizes (Rule 6 violation). |
| `tools/fetch_save.py` | Saves rendered text to `03_raw_fetches/<slug>/<page_id>.md` with YAML front matter + sha256 + appends `discovery_log.jsonl` entry per Rule 11. |
| `tools/audit_evidence.py` | Independent Rule 12 grep audit. Run with `--all` or `--slugs <s1>,<s2>`. |
| `tools/SUBAGENT_BRIEF.md` | The reusable per-vendor instruction brief that subagents read before doing any work. **All subagents should be told to read this first.** |

If something looks broken in tooling, prefer to fix in place rather than reinvent. The shape is good.

---

## 6. Bootstrap workflow for the new session

### Step 1: Verify environment

```bash
cd /mnt/c/Users/endeg/Documents/peptide-research/peptide-research_cli
python3 tools/audit_evidence.py --all   # should show 12 vendors, all PASS
ls 02_claude_code_outputs/vendors/*.json | wc -l   # should be 13 (12 verified + swiss-chems orphan)
wc -l 02_claude_code_outputs/discovery_log.jsonl   # ~369 lines
```

If those numbers match, the persisted state is intact and you can proceed. If they don't, something corrupted between sessions — investigate before profiling new vendors.

### Step 2: Reconcile orphans

Address swiss-chems (write its evidence file) and the partial raw_fetches dirs. Two reasonable approaches:

**Approach A (resume orphans):** dispatch subagents to complete each orphaned vendor using existing fetches as starting state.

**Approach B (clean reset):** delete the orphan raw_fetches dirs and the swiss-chems JSON; let the standard Tier 2 dispatch re-do them from scratch.

Recommend Approach A for vendors with ≥10 fetches (limitless-life, core-peptides, pure-rawz, swiss-chems) and Approach B for the rest.

### Step 3: Continue Phase 2 (Tier 2 — 44 remaining)

The plan at `docs/superpowers/plans/2026-05-06-peptide-vendor-research-pillar-a.md` is the authoritative process. Per the plan:

- Dispatch 5-6 vendors per parallel batch.
- Subagents read `tools/SUBAGENT_BRIEF.md` first, then execute the directive's 14-step workflow.
- After each batch completes, run `python3 tools/audit_evidence.py --slugs <slug1>,<slug2>,...` to verify Rule 12 compliance independently.
- After every 10 completed vendors: Rule 5 spot-check (re-fetch 2 random homepages) + Rule 21 re-verify (1 fresh `Explore` subagent re-profiles 1 random vendor).
- Pause for **Checkpoint 4** (per directive §13) when Tier 2 is done.

### Step 4: Phase 3 (Tier 3 — 151 vendors, baseline only)

Per directive §2.1, Tier 3 vendors get a baseline profile only:

- brand_name, primary_domain, year_established (if visible), country_of_operation, fulfillment_country, ship_to_scope, public lab-testing posture, headline SKU set, headline price points, source-review presence, last activity evidence
- Skip: catalog walks, checkout walks, blog walks (unless trivially visible), deep tech-stack analysis

Subagent prompt for Tier 3 vendors should explicitly instruct "TIER 3 BASELINE ONLY — skip the deeper Step 4-9 walks unless the page exposes them trivially."

Dispatch in larger parallel batches (7-10 simultaneous) since each is shallower. Same audit cadence (every 10).

### Step 5: Phase 4 (Cross-vendor consolidation)

Per the plan:

1. `tools/build_pricing_matrix.py` (write this) — aggregates every SKU from every profile JSON into `02_claude_code_outputs/pricing_matrix.csv`. One row per SKU. No re-fetching in this phase.
2. `02_claude_code_outputs/coverage_report.md` per directive §9.10 (sections specified there). Include the audit findings, the seed-CSV-error findings (clinical-peptide parked, nuri-clinics typo, oath rebrand, pure-rawz CSV split), the gstack:browse env limit, etc.
3. `02_claude_code_outputs/final_audit_log.md` per directive §10.2. Mark deferred-by-scope items (Pillar B, C-synthesis, discovery convergence) as **N/A — deferred per scope**, not "fail".
4. **Checkpoint 6:** post a one-page summary to operator. Per the operator's original prompt: "output a one-page summary in the chat for me, nothing more. Do not write a final report. The synthesis happens in a separate step."

---

## 7. Known seed-CSV anomalies (already discovered)

These were found during Tier 1 profiling. Document in coverage report; do not investigate further unless the new session has time:

1. **clinical-peptide** (`clinicalpeptide.com`) — Hostinger parked-domain placeholder. No vendor has ever existed at this URL per 2017-2025 Wayback. Seed classification "Tier 1: Trusted medical supplier" is unverifiable. Marked `fetch_status: failed`.
2. **nuri-clinics** — seed CSV had `nuriclinics.com` (NXDOMAIN); real domain is `nuriclinic.com` (singular). Auto-corrected via curl-on-real-domain.
3. **oathpeptides** — seed CSV had `oathpeptides.com` (NXDOMAIN); the brand 301-redirects via `oathpeptide.com` to `oathresearch.com` (rebrand banner: "Oath Peptides Is Now Oath Research"). Profile uses the rebranded site as canonical.
4. **OathPeptides classification mismatch** — seed labeled it "Tier 1: institutional ICH Q7 IND" but it's a WooCommerce direct-to-researcher e-commerce shop. Tier kept at 1 with documented rationale; reclassification to Tier 2 would also be defensible.
5. **OathPeptides obfuscated SKU naming** for FDA-regulated drugs: customer-facing "GLP1-S" → internal SKU `OATH-SEMAGLUTIDE`; "GLP3-R" → `OATH-RETATRUTIDE`. Important Pillar A.meta.2 finding for compliance-language synthesis.
6. **Pure Peptide Labs ↔ Pure Rawz CSV split** — source CSV had a stray newline inside "1.5K+ reviews" that mangled one row into two. Fixed in `tools/fixup_vendor_list.py`.
7. **9 vendors have `primary_domain: unknown`** — they are directory-only listings (made-in-china.com) or telegram-only. These will get `fetch_status: failed` baseline-only profiles. List in `00_inputs/vendor_list.csv`.

---

## 8. Environment constraints (don't fight these)

1. **`gstack:browse` (headless Chromium with stealth) fails in WSL2-as-root.** Chromium refuses to launch with a sandbox error. The directive (§4) requires `gstack:browse` for Cloudflare-protected sites. The pragmatic fallback is `archive.org` Wayback Machine via `tools/curl_fetch.py https://web.archive.org/web/<date>/https://<vendor>/`. Document this gap in `coverage_report.md` § "Skill Gaps".

2. **Cloudflare 403s are common** for retail peptide vendors. Per Rule 9, do NOT bypass anti-bot. Pivot to Wayback. Mark affected fields `"uncertain"` if Wayback also lacks the page.

3. **Many vendors have `fetch_status: partial`** legitimately — institutional CDMOs lack consumer-style TOS/refund pages, clinics gate prices behind consultations, defunct vendors only exist in Wayback. Per directive Rule 17, ratio 0.40-0.69 is `partial`. This is OK and EXPECTED.

4. **WebFetch summarizes** (Rule 6 violation). Always use `tools/curl_fetch.py` instead. WebFetch should only be used for quick discovery probes that won't be cited as evidence.

---

## 9. Ground rules the next session inherits (excerpts from directive §3)

You don't need to memorize the 25 rules — but these are the ones most likely to bite:

- **Rule 1 — No fabrication.** "uncertain" before guessing. Always.
- **Rule 2 — Verbatim evidence.** Every non-trivial claim has a `[QUOTE]` block grep-matchable in its `[RAW_ARTIFACT]`.
- **Rule 6 — No summarizer shortcut.** WebFetch summarizes — don't cite from it. Use `curl_fetch.py`.
- **Rule 9 — No anti-bot bypass.** Document the obstacle, mark uncertain, move on.
- **Rule 11 — Mandatory raw-fetch retention** with YAML front matter + sha256.
- **Rule 12 — Quotes must grep-match.** Audit script enforces this.
- **Rule 16 — Zero placeholder text** (`"TBD"`, `"TODO"`, `""`, etc.).
- **Rule 17 — field_completion_ratio gates fetch_status.** ≥0.70 → ok, 0.40-0.69 → partial, <0.40 → failed.
- **Rule 21 — Independent re-verification every 10 vendors** via fresh `Explore` subagent.
- **Rule 24 — Inputs are not evidence.** Never cite `combined_context.md`, `research_directive.md`, or any schema as evidence.

§11 bounds (non-negotiable):
- No account creation, no fake KYC, no fake payment.
- No medical claims attribution.
- No anti-bot bypass.

---

## 10. Files to NOT touch

These are persisted state that subsequent sessions should treat as immutable history:

- `02_claude_code_outputs/discovery_log.jsonl` — append-only.
- `02_claude_code_outputs/vendors/<slug>.json` for any of the 12 verified Tier 1 vendors.
- `02_claude_code_outputs/evidence/<slug>.txt` for any of the 12.
- `03_raw_fetches/<slug>/*.md` for any of the 12 (the `sha256` in front-matter must match the body forever).
- `02_claude_code_outputs/vendor_universe_pass1.csv`, `pass2.csv`, `pass4.csv`, and the `acquisition_synthesis_slice2.md` etc. — these are from a PRIOR research effort that the current Pillar A work does not touch.

The current session's plan deliberately does NOT touch the prior-session files.

---

## 11. Estimated remaining effort

- **Tier 2 (44 vendors):** ~5-10 minutes per vendor at Tier 2 depth × 44 = 4-7 hours sequential. With parallel batches of 5-6, ~1-1.5 hours wall-clock.
- **Tier 3 (151 vendors):** ~3-6 minutes per vendor at baseline depth × 151 = 8-15 hours sequential. With parallel batches of 7-10, ~1.5-2.5 hours wall-clock.
- **Phase 4 consolidation:** ~1 hour.
- **Total wall-clock estimate:** 4-6 hours of subagent dispatch + parent review.
- **Token budget estimate:** Tier 1 used ~2.5M tokens for 12 vendors. Linear extrapolation suggests ~40M tokens for the full 196 remaining. Plan accordingly.

---

## 12. The one-page summary the operator expects at the very end

Per the operator's original prompt:

> "After Phase 3 ends, output a one-page summary in the chat for me, nothing more. Do not write a final report. The synthesis happens in a separate step."

So the new session's final deliverable in chat is a one-pager covering:

1. Universe totals + per-status breakdowns.
2. Audit pass rates.
3. Top anomalies (failed-fetch clusters, suspect overlaps, adjudications).
4. Where deferred work picks up (Pillar B, C-synthesis, discovery convergence).
5. Path to `final_audit_log.md`.

Nothing more. The synthesis happens later, separately.

---

## 13. Potential gotchas to flag (operator asked for these explicitly)

1. **The TaskCreate task list does NOT survive across sessions.** The new session's task list will be empty. That's fine — the **filesystem is the source of truth.** Recreate tasks for active work as you go.

2. **gstack:browse will keep failing** in WSL2-as-root. Don't waste time retrying. Default to Wayback fallback.

3. **Many vendor sites are Cloudflare-protected.** Expect 30-50% of Tier 2/3 to need Wayback fallback or land at `partial`/`failed`. This is honest reporting, not failure to deliver.

4. **Rule 22 deviation is documented and approved.** The plan acknowledges that 208 individual TaskCreate calls is impractical. The current session created tasks lazily per batch; the new session can do the same.

5. **The original prompt's vendor list** (208 vendors) is treated as the universe. The directive's discovery convergence (≥5 passes + zero-add proof) is **deferred** per scope. Documented in plan §11.

6. **Cost ramp-up at Tier 3 scale.** 151 vendors × subagent dispatch is a lot. If the new account also has limits, dispatch in waves of 7-10 with breaks. Use `run_in_background=true` if available.

7. **Some prior-session output exists** in `02_claude_code_outputs/` (vendor_universe_pass1/2/4.csv, slice2 markdown files). These are from a DIFFERENT prior research run (Pillar B / discovery passes) and should be left alone. The current Pillar A work writes only to `vendors/`, `evidence/`, `discovery_log.jsonl`, `vendor_universe.csv`, `pricing_matrix.csv`, `coverage_report.md`, `final_audit_log.md`, `checkpoint_*.md`.

8. **The operator's ORIGINAL prompt is at the top of the original conversation.** It's been internalized into the plan and the directive references. The new session does NOT need the original prompt — the plan + directive + this handoff are sufficient.

9. **Auto mode is fine** for the new session. The original prompt explicitly approved continuous execution. The directive's §13 checkpoints are the only mandatory pause points (auto mode does not override those).

10. **If the new account has different MCP tools** (e.g., different gstack/superpowers versions), prefer the tools listed in §5 of this brief over any new ones. The pipeline is tested and stable.

---

## 14. Last verified state (this session, just before handoff)

```
=== Independent audit ===
TOTAL: 836 ok, 0 fail across 12 vendors

=== Universe ===
Total: 208 vendors | Tiers: T1=12, T2=45, T3=151
Profiled: 13 (12 verified + swiss-chems orphan)
Remaining: 195 (T2: 44, T3: 151)

=== Discovery log ===
369 entries
```

Plan reference: `docs/superpowers/plans/2026-05-06-peptide-vendor-research-pillar-a.md`
Checkpoint reference: `02_claude_code_outputs/checkpoint_3_tier1_summary.md`
Subagent brief: `tools/SUBAGENT_BRIEF.md`

---

**End of handoff. The new session has everything it needs.**
