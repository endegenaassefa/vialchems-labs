# Checkpoint 3 — Tier 1 Complete

**Generated:** 2026-05-07
**Phase:** End of Phase 1 (Tier 1 deep profiling)
**Per directive §13:** Auto mode does not skip checkpoints. Awaiting operator approval before Phase 2 (Tier 2 medium profiling).

---

## What completed since Checkpoint 1

### Phase 0 (setup)
- ✓ Vendor list CSV repaired (208 rows, brand/domain demangled, slugified, tier-classified)
- ✓ `00_inputs/vendor_list.csv` canonical clean copy
- ✓ `02_claude_code_outputs/vendor_universe.csv` with provenance per directive §7.3
- ✓ Output directories created (`vendors/`, `evidence/`)
- ✓ Tooling built and tested:
  - `tools/repair_vendor_list.py` — auto CSV repair
  - `tools/fixup_vendor_list.py` — manual corrections (12 fixes applied)
  - `tools/build_vendor_universe.py` — universe builder
  - `tools/curl_fetch.py` — curl + html2text (avoids Rule 6 summarization)
  - `tools/fetch_save.py` — YAML front-matter + sha256 + log entry
  - `tools/audit_evidence.py` — independent Rule 12 grep audit
  - `tools/SUBAGENT_BRIEF.md` — reusable per-vendor instructions

### Phase 1 (Tier 1 — 12 vendors)
All 12 Tier 1 vendors profiled via parallel subagent dispatch (3 batches of 4).

| Slug | Brand | Domain | Status | Ratio | SKUs | Raw fetches |
|---|---|---|---|---|---|---|
| bachem | Bachem | bachem.com | ok | 0.94 | 10 | 37 |
| genscript | GenScript | genscript.com | ok | 0.74 | 11 | 14 |
| phoenix-pharmaceuticals | Phoenix Pharmaceuticals | phoenixpeptide.com | ok | 0.83 | 5 | 15 |
| biopeptek | Biopeptek | biopeptek.com | ok | 0.74 | 0 | 15 |
| aileron-therapeutics-rein-therapeutics | Aileron / Rein Therapeutics | reintx.com | partial | 0.63 | 0 | 12 |
| 13therapeutics | 13therapeutics | 13therapeutics.com | partial | 0.64 | 0 | 18 |
| clinical-peptide | Clinical Peptide | clinicalpeptide.com | **failed** | 0.20 | 0 | 5 |
| md-total-wellness | MD Total Wellness | mdtw.co | ok | 0.82 | 11 | 19 |
| nuri-clinics | NURI Clinics | nuriclinic.com | ok | 0.74 | 7 | 20 |
| oathpeptides | OathPeptides → Oath Research | oathpeptides.com (rebrand: oathresearch.com) | ok | 0.92 | 51 | 39 |
| olympia-aesthetics | Olympia Aesthetics | olympiaaesthetics.com | partial | 0.61 | 14 | 30 |
| testides | Testides | testides.com | partial | 0.64 | 0 | 5 |

**Aggregate counts:**
- ok: 7 vendors
- partial: 4 vendors
- failed: 1 vendor (clinical-peptide — domain is Hostinger parked-page placeholder, never hosted a vendor per 2017-2025 Wayback)
- Total raw fetches saved: ~233 across 12 vendor directories
- Total discovery_log entries: 255

---

## Audits run

### §10.1 per-vendor audit (run for each vendor)
All 12 vendors: **11/11 audit items pass** per subagent self-reports AND independent reviewer verification.

### Independent Rule 12 audit (parent agent ran `tools/audit_evidence.py`)
**836 quotes verified across 12 vendors. 0 failures.**

```
bachem                                        PASS (93 ok, 0 fail, 2 enum-skip)
genscript                                     PASS (71 ok, 0 fail, 0 enum-skip)
phoenix-pharmaceuticals                       PASS (79 ok, 0 fail, 0 enum-skip)
biopeptek                                     PASS (39 ok, 0 fail, 0 enum-skip)
aileron-therapeutics-rein-therapeutics        PASS (89 ok, 0 fail, 0 enum-skip)
13therapeutics                                PASS (24 ok, 0 fail, 18 enum-skip)
clinical-peptide                              PASS (13 ok, 0 fail, 0 enum-skip)
md-total-wellness                             PASS (76 ok, 0 fail, 6 enum-skip)
nuri-clinics                                  PASS (59 ok, 0 fail, 0 enum-skip)
oathpeptides                                  PASS (116 ok, 0 fail, 1 enum-skip)
olympia-aesthetics                            PASS (82 ok, 0 fail, 1 enum-skip)
testides                                      PASS (95 ok, 0 fail, 6 enum-skip)
TOTAL: 836 ok, 0 fail
```

### Rule 5 spot-check (re-fetch 2 random vendors)
- **bachem.com** homepage re-fetched: 287 lines vs original 294, diff = 2 lines (rendering noise). Hero copy "Leading Partner in TIDES" still present. PASS.
- **phoenix-pharmaceuticals** archive URL re-fetched: 282 vs 289 lines, diff = 2. "peptide research" still present. PASS.

### Rule 21 independent re-verification (Explore subagent on `testides`)
Independent verifier (read-only, no access to original profile) fetched testides.com and reported key fields. Adjudication:
- country (Canada): MATCH ✓
- business_model (testing-lab): MATCH ✓
- platform_signal (spa vs custom): both valid for React SPA — schema enum closest is `custom`. No fabrication.
- cloudflare/cdn: MATCH ✓
- pricing_currency (CAD): MATCH ✓
- age_gate (false vs uncertain): minor — original was more conservative; verifier's negative observation matches.
- payment_methods (Stripe/Interac/Wise/credits): MATCH ✓
- ISO 17025, Toronto, group testing: MATCH ✓

**Rule 21 result: PASS** — no fabrication, no staleness.

### Rule 15 5-gram overlap check (66 vendor pairs × 4 fields = 264 comparisons)
1 pair flagged: **nuri-clinics ↔ oathpeptides** at 35% overlap on `footer_disclaimers`.

**Adjudication:** This is FDA-mandated boilerplate ("not intended to diagnose, treat, cure, or prevent any disease") that legitimately appears verbatim on both vendors' actual pages (verified via grep on both raw artifacts). Both subagents captured the real language; no copy-paste. **Documented in coverage_report.md as a known false-positive trigger** for industry-standard disclaimer overlap. Will revisit if overlap clusters further as more vendors complete.

---

## Anomalies and findings worth flagging

1. **`clinicalpeptide.com` is a parked Hostinger placeholder** — never hosted a vendor per 2017-2025 Wayback. Seed CSV row was likely a parse error or speculative entry. Recommend manual investigation by operator.

2. **Two seed-CSV domain typos** auto-discovered:
   - `nuriclinics.com` (NXDOMAIN) → real domain is `nuriclinic.com` (singular)
   - `oathpeptides.com` (NXDOMAIN) → 301-redirects via `oathpeptide.com` to `oathresearch.com` (live rebrand banner: "Oath Peptides Is Now Oath Research")

3. **OathPeptides classification error in seed**: Seed labeled it "Tier 1: Preferred clinical research partner (IND) / Institutional (ICH Q7)". Live profiling reveals it's a US direct-to-researcher e-commerce shop with WooCommerce, NOT an institutional CDMO. No IND-grade posture, no ICH Q7 documentation. Tier 1 retained on schema-fillability grounds; rationale documents the mismatch.

4. **OathPeptides obfuscated SKU naming for FDA-regulated drugs**: customer-facing label "GLP1-S" but internal WooCommerce SKU `OATH-SEMAGLUTIDE`; "GLP3-R" but internal `OATH-RETATRUTIDE`. Likely a trademark/FDA-enforcement-evasion pattern. **Important Pillar A.meta.2 finding** for compliance-language synthesis.

5. **gstack:browse fails in WSL2-as-root** (Chromium sandbox refuses to launch). Affects Cloudflare-protected vendors; subagents pivoted to archive.org Wayback fallback. Documented as environmental constraint in coverage report.

6. **Supervised-clinic per-mg pricing**: nuri-clinics at $14.99/mg for Wolverine BPC-157+TB-500; md-total-wellness at ~$15/mg for similar peptides; olympia-aesthetics gates pricing entirely behind paid consultation (no public per-mg). Cross-clinic comparison: CA (md-total-wellness publishes prices) vs FL (olympia withholds) — divergent transparency posture.

7. **Testides is category infrastructure, not a vendor.** They're the analytical testing lab serious researchers use to verify other vendors' purity. Their watermark feature implies retail vendors send samples and receive COAs branded under the retail vendor's name — an interesting "trust laundering" mechanism worth noting.

---

## Sample artifacts (for operator inspection)

**Sample profile** (highest-completeness — Bachem, ratio 0.94):
- `02_claude_code_outputs/vendors/bachem.json` (10 SKUs, full schema)
- `02_claude_code_outputs/evidence/bachem.txt` (95 evidence entries)
- `03_raw_fetches/bachem/` (37 saved pages)

**Sample profile** (failed — clinical-peptide):
- `02_claude_code_outputs/vendors/clinical-peptide.json` (ratio 0.20, baseline only)
- 5 raw fetches documenting the parked-page evidence (live + 3 Wayback snapshots 2017-2025)

**Audit log** (run anytime to verify):
```bash
python3 tools/audit_evidence.py --all
```

---

## Coverage at this checkpoint

- **12 / 208 vendors profiled** (5.8% of universe)
- **Tier 1: 12 / 12 complete** (100%)
- **Tier 2: 0 / 45**
- **Tier 3: 0 / 151**

---

## Next phase

**Phase 2: Tier 2 medium profiling (45 vendors)**

- Subagent dispatch in batches of 5-6 in parallel.
- Same 14-step workflow, schema filled to depth public site exposes.
- Rule 5 spot-check + Rule 21 re-verification every 10 completed vendors.
- ~9 batches → estimated ~3 hours wall-clock with parallelism.
- Expected: more anti-bot pages (research-peptide retail sites are heavily Cloudflare-protected). Many Tier 2 vendors will need archive.org fallback or end up `partial`.

**Permission ask:**

Approve to proceed to Tier 2 profiling? Options:
1. **Approve as-is** — dispatch first batch of 5-6 immediately, continue through all 45.
2. **Pause for inspection** — let me look at sample artifacts (bachem.json + evidence/bachem.txt) before continuing.
3. **Course-correct** — adjust scope, change batch size, drop a vendor type, etc.
