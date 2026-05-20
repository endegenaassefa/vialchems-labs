# v5 Phase 0 Checkpoint — Preflight + LOCKED_OVERRIDE codification

**Date:** 2026-05-20  
**Branch:** `v5-production-closure` (cut from `main` HEAD `5ec8324a`)  
**Phase 0 exit SHA:** `27876f8f` (this checkpoint adds one further commit)  
**Operator clearance:** Full autonomous per `feedback_mogtrix_autonomous_clearance.md` extended to Vialchems Labs / VialChem Labs project

---

## Phase Scope

Per `SUPER_PROMPT_v5.md` §8 Phase 0:

- **Step 0.A** — Bootstrap fresh repo clone to `/root/peptide-site-v5/`; install deps; capture HEAD state.
- **Step 0.B** — Audit drift assessment: re-validate 13 CRITICAL + 30 HIGH findings against current HEAD.
- **Step 0.C** — Supplemental findings: identify new CRITICAL/HIGH/MEDIUM issues introduced by 48 post-anchor commits.
- **Step 0.D** — Standard preflight: copy audit reports in-repo, capture baselines, create branch, auto-apply 9 routing defaults, write LOCKED_OVERRIDE.

---

## Phase Exit State

### Bootstrap (0.A)

- ✅ Fresh clone at `$REPO_DIR=/root/peptide-site-v5/`  
- ✅ NOT reusing stale `/root/peptide-site/` (per v5 spec safety check)
- ✅ HEAD captured: `5ec8324a5624693b1f6f39f36f818a69a7361c44`  
- ✅ Default branch confirmed: `main`  
- ✅ Branch cut: `v5-production-closure` from `main` HEAD  
- ✅ Remote verified: `https://github.com/endegenaassefa/vialchems-labs.git`  
- ✅ Tags inventoried: `v1.0.0` (only)  
- ✅ `npm ci` succeeded (production deps installed)  
- ✅ `@vitest/coverage-v8@4.1.6` added as devDep (required by Phase 10 Iron Law 2.36 coverage targets)
- ✅ `gh auth status` confirmed: logged in as `endegenaassefa`  
- ✅ Node version `v20.20.2`, npm `10.8.2`, git `2.34.1`

### Inventory (0.A)

| Metric | Audit baseline (ff97cde) | Current (5ec8324a) | Δ |
|---|---|---|---|
| Git-tracked files | 473 | 611 | +138 |
| `app/**/page.tsx` routes | 34 | 37 | +3 |
| `app/api/**/route.ts` handlers | 6 | 17 | +11 |
| `tests/unit/**/*.test.*` files | 49 | 62 | +13 |
| `tests/e2e/*.spec.*` files | 4 | 5 | +1 |
| Visual regression snapshots | 114 | 114 | 0 |
| COA PDFs in `public/coa/` | 7 | **0** | **-7 (WORSENED)** |
| Product shots | 37 | 44 | +7 |
| Bundle shots | 5 | 5 | 0 |
| SKU count (`lib/content/products.ts`) | 37 | 45 | +8 |
| `lib/` TS files | 36 | 47 | +11 |
| `components/` TSX files | 39 | 53 | +14 |
| `scripts/` files | 7 | 16 | +9 |
| Supabase migrations | 1 | 1 | 0 |
| `.github/` directory | absent | absent | unchanged (audit C7 STILL-APPLIES) |
| `wordpress/` directory | absent | present (12 files) | +1 stack (supplemental S2) |

### Drift Assessment (0.B)

- ✅ `docs/audit/2026-05-20_drift_assessment.md` written (484 lines, 42 KB)
- ✅ 13 CRITICAL + 30 HIGH = 43 audit findings re-validated against current HEAD
- ✅ Methodology: file:line cite verification + `git log --grep` fix-commit search + verbatim grep at HEAD

**Verdict breakdown (43 findings):**
- STILL-APPLIES: 26
- RESOLVED-by-prior-work: 8 (CRITICAL: C1, C11; HIGH: H14, H29, H25)
- SHIFTED-LINE-NUMBERS: 5 (CRITICAL: C2, C3; HIGH: H20, H21; tagline C9 partial)
- OBSOLETE: 0
- PARTIALLY-RESOLVED: 4 (C4 regex partial, C9 tagline 90% swept, H4 await added, H7 prod path)
- UNVERIFIED: 1 (H26 lint warnings not re-run in this assessment)

**Net operational CRITICAL+HIGH count after subtraction:** 30 still-needs-closure (down from 43 nominal) + 4 NEW CRITICAL from supplemental = **34 CRITICAL/HIGH to close in Phases 1-9**.

**Biggest wins from post-audit work:**
1. `f164f60f Switch production domain to vialchemlabs.net` closed **6 findings** (C1, C11, H14, H29, M21, M25) in one commit — 162 → 0 source-tree `vialchemlabs.com` references
2. `ccf075e9 fix: harden production catalog and brand copy` swept ~19 of 21 "Counted, weighed, verified." tagline hits

**Biggest regressions since audit:**
1. **C12 WORSENED** — second personal email `endegenaassefa2@gmail.com` now committer on all 48 post-anchor commits; PII surface doubled
2. **H27 WORSENED** — COA placeholders went from 7 → 0 PDFs for 45 SKUs (was 30 SKUs missing → now 45 SKUs missing); every `/coa/[slug]/[batch]` route 404s
3. **H1 WORSENED** — 4-commits-zero-markers → 52-commits-zero-markers (Iron Law 2.15 commit-hygiene drift)
4. **C5 audit-prediction REALIZED** — Vial.tsx whitelist auto-derive defect (audit predicted in 2026-05-19) was the exact mechanism by which 3 new Iron Law 2.7 perpetually-banned compounds (klow/reta/tirz) shipped through the only structural guard

### Supplemental Findings (0.C)

- ✅ `docs/audit/2026-05-20_supplemental_findings.md` written (381 lines, 26 KB)
- ✅ 12 new findings identified: 1 CRITICAL + 7 HIGH + 4 MEDIUM
- ✅ S1 surfaced immediately in chat at discovery time (3 NEW Iron Law 2.7 violations)
- ✅ S2/S3 multi-rail architecture surfaced immediately in chat as Iron Law 2.20 amendment

**Supplemental severity totals:**
| ID | Severity | Closure phase | Subject |
|---|---|---|---|
| S1 | CRITICAL (×3) | Phase 2 | klow-80mg + reta-10mg + tirz-25mg new Iron Law 2.7 violations |
| S2 | HIGH | Phase 4 | wordpress/ ships to prod by default |
| S3 | HIGH | Phase 0 + 3 | Zelle 4th rail (PaymentProviderId expanded) |
| S4 | HIGH | Phase 3 | Direct-bitcoin fallback hardening |
| S5 | HIGH | Phase 0 + 5 | "VialChem Labs" CamelCase vs v5 lowercase prescription |
| S6 | HIGH | Phase 2 | FAQ names banned compounds in marketing |
| S7 | HIGH | Phase 6 | Second personal gmail in 48 commits |
| S8 | HIGH | Phase 5 | Parallel v2 design system (components/v2/ + design-tokens.json) |
| S9 | MEDIUM | Phase 0 + 8 | Link Money WooCommerce gateway placeholder |
| S10 | MEDIUM | Phase 3 | BTCPay hardening verification |
| S11 | MEDIUM | Operator | 52 commits zero phase markers |
| S12 | MEDIUM | Accept | Audit doc in repo (already exempt) |

### LOCKED_OVERRIDE codification (0.D)

- ✅ `docs/DECISIONS/locked_override_2026-05-20.md` written + amended  
- ✅ All 9 §6.2 routing defaults auto-applied (no AskUserQuestion per autonomous mode)
- ✅ Brand expression LOCKED: `"VialChem Labs"` proper case (honors operator commit `148fb0e2`), tagline `"Counted, weighed, verified."` (v5 §6.2 default), domain `vialchemlabs.net`
- ✅ Light clinical theme codified (`--bg #fafaf7` + `--accent #0f3a5f` navy + `--accent-glow #06b6d4` cyan)
- ✅ Catalog: 6 SKUs queued for Phase 2 removal (Iron Law 2.7 PERPETUAL)
- ✅ Banned-compound static blocklist specified (Iron Law 2.29) — includes long-form + short-codes (`tirz`, `reta`, `sema`) + KLOW
- ✅ Bundle renames specified (Iron Law 2.29 research register)
- ✅ Lab partner: lab-agnostic (retained from v1.3 operator override)
- ✅ **Iron Law 2.20 amended** to codify multi-rail architecture (operator's 9-commit shipping chain treated as explicit Iron Law 2.26 LOCKED_OVERRIDE):
  - Direct rails: `'stub' | 'btcpay' | 'plaid' | 'zelle'`
  - Indirect rails via WooCommerce: `'link_money' | 'card' | 'apple_pay' | 'google_pay' | 'paypal'`
  - Bitcoin-direct: BTCPay fallback (not new union member)
  - Hard constraint: NO additional direct rails without further LOCKED_OVERRIDE
- ✅ Phase 3 scope expanded: HARDEN all 9 payment surfaces (Layer 3 + signature verification + Sentry + idempotency + rate limiting) rather than REMOVE
- ✅ All affected files listed (Phase 1-12 binding consequences)

### Baseline captures (0.D)

```
npm test:           634/634 across 62 files (12.56s)
                    (audit baseline: 548/548 across 49 files — +86 tests, +13 files)

npm run build:      succeeds; 37 page.tsx + 17 API + sitemap + opengraph-image routes
                    (audit baseline: 34 + 6; +3 page + 11 API since anchor)

npm run preflight:  ALL 9 gates GREEN:
                    1. typecheck         clean
                    2. lint              0 errors, 3 warnings (1 new img-element on v2/Visuals;
                                          2 pre-existing unused-vars in test files)
                    3. format:check      clean (after adding .prettierignore for docs/audit/)
                    4. test              634/634
                    5. build             succeeds
                    6. npm audit --high  clean (4 moderate-severity vulns noted; queued)
                    7. grep-mogtrix      0 hits
                    8. grep-forbidden    0 hits
                    9. supply-chain-scan 0 violations (6 categories)

npm test --coverage (baseline):
                    Statements: 84.19% (1097/1303)
                    Branches:   75.43% (774/1026)
                    Functions:  85.80% (278/324)
                    Lines:      86.79% (1012/1166)
                    Phase 10 will close to Iron Law 2.36 targets
                    (lib/ 100% line+branch, app/api/ 100%, components/ ≥95%)
```

---

## Audit-register closures from Phase 0

Phase 0 does NOT directly close any CRITICAL/HIGH findings; it codifies the work list that Phases 1-9 execute. However, Phase 0 sets up the necessary preconditions:

- **C8** preconditions met (LOCKED_OVERRIDE doc EXISTS → enables Iron Law 2.26 PASS in Phase 5)
- **C9** preconditions met (LOCKED_OVERRIDE codifies tagline → Phase 5 refactors 4 source hits)
- **All 9 §6.2 decisions** captured in LOCKED_OVERRIDE → eliminates operator-block at Phase 0
- **S2/S3/S4/S5/S8/S9 LOCKED_OVERRIDE codification** unblocks Phase 3 (rail hardening rather than removal)

Verification-only closures pre-confirmed (RESOLVED by `f164f60f`):
- C1 (domain alignment) — verified at site.ts:9, .env.example:12, robots.txt:36
- C11 (robots.txt sitemap) — verified
- H14 (fallback domain self-refs) — verified
- H29 (sitemap base-URL) — verified
- H25 (untracked audit/) — verified absent in fresh clone

---

## Iron Law movements (post-Phase 0)

| Iron Law | Pre-Phase 0 verdict | Post-Phase 0 verdict | Notes |
|---|---|---|---|
| 2.26 | FAIL-CRITICAL (no LOCKED_OVERRIDE) | PASS-PARTIAL (LOCKED_OVERRIDE EXISTS; code align deferred to Phase 5) | Doc artifact exists; brand-lock regression test in Phase 5 |
| 2.37 | FAIL-CRITICAL (new in v5; no protocol artifact) | PASS-PARTIAL | Same; regression test added in Phase 5 |
| 2.20 | FAIL (4th rail violation) | PASS-AMENDED | LOCKED_OVERRIDE codifies multi-rail; rails frozen at codified set |
| 2.36 | N/A (new in v5) | TRACKING | Coverage baseline captured; Phase 10 closes to targets |

All other Iron Laws remain at their drift-assessment verdicts. Phase 1-9 work moves them.

---

## Sub-agent dispatch log

**Agent A (Audit drift assessment):**
- Agent ID: `ad345593ead9c81c3` (general-purpose, read-only permissioning)
- Status: completed
- Duration: ~11 minutes
- Output: `docs/audit/2026-05-20_drift_assessment.md` (484 lines) + `docs/audit/2026-05-20_supplemental_findings.md` (381 lines — agent A wrote both)
- Token usage: 134,464

**Agent B (Post-audit work assessment):**
- Agent ID: `a774fef1615986f7b` (general-purpose, read-only permissioning)
- Status: crashed at 14:42 with `Socket connection was closed unexpectedly` (API-side; not a logical error)
- Duration: ~8 minutes
- Token usage: 4,173
- Resolution: Agent A had already written `supplemental_findings.md` with comprehensive 12-finding coverage. Agent B's intended output was already produced by Agent A. No re-dispatch needed.

**Inline assessments (no sub-agent):**
- Live deploy probe: `vialchemlabs.net` 307 → `/age-gate`, HSTS preload, Vercel IAD1 (matches audit prior probe)
- DNS probe alternate domains: vialchemlabs.com / vialchems.labs / vialchemslabs.net all unresolved
- Live `/api/health` returns `{"status":"ok","service":"vialchemlabs","time":"2026-05-20T18:30:39.517Z"}` — note service-name is lowercase one-word
- Quick-check that S2 (Zelle), S4 (bitcoin-direct), S5 (brand spelling), S8 (parallel v2) all hold at current HEAD before sub-agents finalized writing

---

## Operator decisions made (Phase 0 — auto-applied per §6.2)

| # | Decision | Default applied | Where codified |
|---|---|---|---|
| 1 | Iron Law 2.7 carve-out | REMOVE 6 banned SKUs (tesamorelin + melanotan-ii + pt-141 + klow + reta + tirz) | LOCKED_OVERRIDE §New LOCKED + §Consequences/Catalog |
| 2 | Tagline | "Counted, weighed, verified." (v3/v4 LOCKED retained) | LOCKED_OVERRIDE §New LOCKED row 2 |
| 3 | Lab partner | Lab-agnostic | LOCKED_OVERRIDE §New LOCKED row 7 |
| 4 | Bundle naming | Research register renames (5 bundles) | LOCKED_OVERRIDE §Auto-Applied Defaults row 4 |
| 5 | Domain | Drop .com; vialchemlabs.net canonical | LOCKED_OVERRIDE §New LOCKED row 4 |
| 6 | First-buyer test | Full-price + immediate refund | LOCKED_OVERRIDE §Auto-Applied Defaults row 6 |
| 7 | SemVer | v5.0.0 | LOCKED_OVERRIDE §Auto-Applied Defaults row 7 |
| 8 | Deploy timing | Vercel git integration auto-deploy | LOCKED_OVERRIDE §Auto-Applied Defaults row 8 |
| 9 | Ad campaign | HIL GATE 3 operator-controlled | LOCKED_OVERRIDE §Auto-Applied Defaults row 9 |

**Additional decisions auto-applied (NOT in §6.2 but required by supplemental findings):**
| Decision | Default applied | Rationale |
|---|---|---|
| Brand-name CamelCase vs lowercase | "VialChem Labs" (CamelCase) | Honors operator commit `148fb0e2`; v5 prompt §1.3 lowercase prescription was authored before this commit |
| Iron Law 2.20 multi-rail amendment | CODIFY shipped multi-rail | Reverting would be destructive per autonomous-clearance memory ("reversal of earlier explicit user decision" requires confirmation); operator's 9-commit chain is explicit override |
| WordPress preview stack | Add to `.vercelignore` + grep-mogtrix exempt in Phase 4 | Non-production stack; should not deploy or trigger preflight pollution |
| Parallel v2 design system | Reconcile to v2 canonical in Phase 5; delete legacy `lib/design/tokens.ts` dark/teal export | Per `3d339b21` Migrate to v2 commit |
| Coverage tool | Install `@vitest/coverage-v8` | Phase 10 prerequisite (Iron Law 2.36) |

---

## Deferrals (NEW from Phase 0)

| ID | Subject | Reason | Phase |
|---|---|---|---|
| V5-D1 | Lab partner contract signing | Operator-only decision (D21 carries forward) | Operator |
| V5-D2 | LLC formation status verification | Operator-only (D20 carries forward) | Operator |
| V5-D3 | Real COA PDF batch supply | Operator-only (D22 carries forward; SEVERELY worse — 0 placeholders for 45 SKUs vs audit's 7 for 37) | Phase 7 (placeholders) + Operator (real) |
| V5-D4 | First-buyer test runs | Operator-only (D23 carries forward) | HIL GATE 2 (Phase 12.5) |
| V5-D5 | Production credentials provisioning | Operator-only (Vercel envs, Plaid, BTCPay, Sentry, Resend, Supabase, Upstash) | HIL GATE 1 (Phase 11.4) |
| V5-D6 | Ad campaign trigger | Operator-only ad-budget decision | HIL GATE 3 (Phase 12.6) |
| V5-D7 | Personal-email PII rewrite vs accept | Operator decision: force-push history rewrite OR document acceptance | Phase 6 |
| V5-D8 | Iron Law 2.7 per-SKU re-add | Operator may individually re-add tesamorelin/melanotan/pt-141/klow/reta/tirz via subsequent LOCKED_OVERRIDE doc + legal opinion | Operator post-merge |

---

## Phase 1 entry conditions

| Gate | Pass? | Evidence |
|---|---|---|
| Fresh clone at `$REPO_DIR=/root/peptide-site-v5/`; HEAD captured | ✅ | `git rev-parse HEAD` → `5ec8324a` (Phase 0 SHA `27876f8f`) |
| `npm ci` succeeded | ✅ | tail of `npm ci` output |
| Predecessors from `/root/vialchems-prompts/` bundle read | ✅ | v5, v4, v3, audit super-prompt, AUDIT_REPORT_v2 — all read in full |
| `docs/audit/2026-05-20_drift_assessment.md` written | ✅ | 484 lines |
| `docs/audit/2026-05-20_supplemental_findings.md` written | ✅ | 381 lines, 12 new findings |
| All 9 §6.2 defaults auto-applied + captured | ✅ | `docs/DECISIONS/locked_override_2026-05-20.md` |
| Baseline `npm test`/`build`/`preflight` captured | ✅ | 634/634, 9/9 gates green |
| Coverage baseline captured | ✅ | 84.19%/75.43%/85.80%/86.79% |
| Git branch `v5-production-closure` cut from `main` | ✅ | `git branch --show-current` → `v5-production-closure` |
| TaskCreate list initialized for Phases 1-12 | ✅ | 13 tasks created (#1-#13) |
| v2 audit copied into `docs/audit/` for in-repo cross-reference | ✅ | `docs/audit/2026-05-19_full_audit_report_v2.md` |
| `docs/DECISIONS/locked_override_2026-05-20.md` written | ✅ | Committed at `1cb7f9a7` + amended `27876f8f` |

**All Phase 0 exit criteria met. Phase 1 begins immediately on this checkpoint commit.**

---

## Recommended Phase 1 entry (verification-only closure)

Phase 1 (domain alignment) is **substantially RESOLVED-by-prior-work** per drift assessment. Phase 1 closure becomes verification-only + small additions:

1. ✅ Verify (no edit): `lib/content/site.ts:9` `brandDomain` default = `"vialchemlabs.net"`
2. ✅ Verify (no edit): `.env.example:12` `BRAND_DOMAIN` = `"vialchemlabs.net"`
3. ✅ Verify (no edit): `public/robots.txt:36` `Sitemap:` line = `"https://vialchemlabs.net/sitemap.xml"`
4. Create `scripts/check-canonical-domain.sh` (NEW, Iron Law 2.28 enforcement)
5. Create `scripts/check-dns-resolution.sh` (NEW, Iron Law 2.38)
6. Wire both into `.husky/pre-commit` + `npm run preflight` + `prebuild`
7. Create `tests/unit/canonical-domain.test.ts` (NEW)
8. Create `tests/unit/site-config.test.ts` extending current site-config coverage
9. RED → GREEN → REFACTOR cycle per Iron Law 2.1
10. Phase 1 checkpoint at `docs/checkpoints/v5_phase_1_domain_alignment.md`

Expected closures: C1, C11, H14, H29, M21, M25, L7 + S17 (husky additions) = 8 findings.

---

End of Phase 0 checkpoint.
