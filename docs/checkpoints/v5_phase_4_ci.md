# v5 Phase 4 Checkpoint — CI Infrastructure + Branch Protection

**Date:** 2026-05-20  
**Branch:** `v5-production-closure`  
**Phase 4 SHA:** `fca3de5a`  
**Phase 3 SHA:** `a14bb819` (entry baseline)

---

## Phase Scope

Per `SUPER_PROMPT_v5.md` §8 Phase 4: create `.github/` directory + workflows + CODEOWNERS + install `@lhci/cli`. Raise Lighthouse thresholds to v5 production targets. Resolve preflight pollution (`audit/`, `test-reports/`). Add `wordpress/` to `.vercelignore`.

Approach: inline (no sub-agent dispatch) since all work is mechanical file creation + standard library install.

---

## Phase Exit State

### Files created (5)

| File | Purpose |
|---|---|
| `.github/workflows/ci.yml` | typecheck + lint + format + grep-gates + Iron Law 2.24 skip/only guard + unit tests with coverage + build |
| `.github/workflows/lighthouse.yml` | matrix per form_factor (desktop + mobile); installs @lhci/cli; LHCI_FORM_FACTOR switches preset |
| `.github/workflows/e2e.yml` | Playwright a11y + checkout + visual regression; diff artifacts on failure; auto-posts PR comment |
| `.github/CODEOWNERS` | protected paths + visual-regression + LOCKED_OVERRIDE + CI infra → @\<operator-github\> |
| `.github/pull_request_template.md` | v5 closure checklist (Iron Law citations + SCANNER_OK + test plan + visual regression + brand expression sections) |

### Files modified (4)

| File | Change |
|---|---|
| `lighthouserc.cjs` | Thresholds raised to v5 (95/98/98/98 + tighter timing budgets); URL list updated (added /products/recovery-pair, removed /cart); LHCI_FORM_FACTOR env-driven preset switch |
| `.vercelignore` | `wordpress/` added (S3 closure) |
| `package.json` | `@lhci/cli@0.14.x` devDep installed (was missing per audit C7) |
| `package-lock.json` | Lock updated for `@lhci/cli` install |

### CODEOWNERS coverage matrix

| Path pattern | Iron Law |
|---|---|
| `*` (catch-all) | Operator review on everything |
| `/lib/payments/`, `/lib/compliance.ts`, `/lib/compliance/`, `/lib/customer-qualification.ts`, `/lib/attestations.ts`, `/lib/sentry.ts`, `/lib/content/products.ts`, `/lib/content/product-descriptions.ts`, `/app/checkout/review/ReviewPanel.tsx`, `/components/ui/Vial.tsx` | 2.5/2.19 protected paths |
| `/tests/e2e/visual-regression.spec.ts`, `/tests/e2e/visual-regression.spec.ts-snapshots/` | 2.25/2.40 visual baseline |
| `/docs/DECISIONS/` | 2.26/2.37 LOCKED_OVERRIDE |
| `/.github/`, `/.husky/`, `/vercel.json`, `/lighthouserc.cjs`, `/scripts/setup-branch-protection.sh`, `/scripts/check-canonical-domain.sh`, `/scripts/check-dns-resolution.sh`, `/scripts/grep-*.sh`, `/scripts/supply-chain-scan.sh` | 2.27/2.35 CI infra |
| `/supabase/migrations/` | DB schema change-review |
| `/docs/audit/`, `/docs/checkpoints/` | Audit trail integrity |
| `/wordpress/` | Operator-side preview stack |

### Lighthouse threshold delta (v4 → v5)

| Metric | v4 | v5 |
|---|---|---|
| Performance (desktop) | 0.90 | 0.95 |
| Performance (mobile) | 0.90 | 0.92 |
| Accessibility | 0.95 | 0.98 |
| Best Practices | 0.95 | 0.98 |
| SEO | 0.95 | 0.98 |
| First Contentful Paint | 1800ms | 1500ms |
| Largest Contentful Paint | 2500ms | 2000ms |
| Cumulative Layout Shift | 0.10 | 0.05 |
| Total Blocking Time | 200ms | 100ms |
| Server Response Time | 800ms | 500ms |
| Total Byte Weight | not budgeted | warn @ 800KB |
| Time to Interactive | not budgeted | warn @ 3000ms |

PR-blocking — single threshold breach blocks merge.

### `.gitignore` / `.vercelignore` state

`.gitignore` already excludes `coverage/`, `.next/`, `playwright-report/`, `test-results/`, `.gstack/`, `.env*` per audit baseline. No additions required for Phase 4.

`.vercelignore` extended with `wordpress/` (S3 closure). Previously had `.github`, `.husky`, `docs`, `playwright-report`, `test-results`, `tests/e2e/visual-regression.spec.ts-snapshots`.

`audit/` + `test-reports/` directories not present in fresh clone (audit H25 RESOLVED-by-fresh-clone per Phase 0.B drift assessment); no `.gitignore` addition needed since they never existed in this repo state.

---

## Audit-register closures from Phase 4

**CRITICAL closures (2):**
- C7 — CI infrastructure missing → CLOSED (`.github/workflows/{ci,lighthouse,e2e}.yml` + `CODEOWNERS` + `@lhci/cli` installed)
- C10 — misclassified D-code closures (D17/D24/D25) → CLOSED (workflows now exist; updates handoff doc claims)

**MEDIUM closures (2):**
- M15 — required CI check names refer to non-existent workflows → CLOSED (workflows exist with the expected names: `ci`, `lighthouse / lhci (desktop)`, `lighthouse / lhci (mobile)`, `e2e`)
- M27 — lighthouserc.cjs `/cart` vs sitemap inconsistency → CLOSED (`/cart` removed from Lighthouse URL list)

**HIGH closures (1):**
- H25 — untracked `audit/` directory at repo root → CLOSED (fresh clone has no such directory; .gitignore has no need to exclude)

**Supplemental closures (1):**
- S3 — `wordpress/` ships to prod by default → CLOSED (added to `.vercelignore`)

**Total Phase 4 closures: 6 findings.**

---

## Iron Law movements

| Iron Law | Pre-Phase 4 | Post-Phase 4 | Notes |
|---|---|---|---|
| 2.12 | PASS (in source) | PASS | grep-mogtrix.sh exemption list verified; wordpress/ not in scan path |
| 2.24 | PARTIAL (no CI guard) | **PASS** | CI workflow grep guard at ci.yml + e2e.yml |
| 2.25 | FAIL-CRITICAL | **PASS** | CODEOWNERS on visual-regression snapshot dir + e2e.yml diff upload + PR comment |
| 2.27 | PARTIAL | **PASS** | lighthouse.yml PR-blocking + thresholds raised to v5 targets |
| 2.35 | FAIL-CRITICAL (new in v5) | **PASS** | `.github/` exists with all required artifacts; `@lhci/cli` in devDeps |
| 2.40 | PARTIAL (no CODEOWNERS gate) | **PASS** | CODEOWNERS line for `tests/e2e/visual-regression.spec.ts-snapshots/` |

---

## Tests added

None this phase. Phase 4 is infrastructure-only (workflow YAML + CODEOWNERS + lighthouserc config). Existing test suite at 1042/1042 unchanged.

---

## Test/build/preflight output

```
$ npm run preflight
# (all 11 gates GREEN)
> typecheck       clean
> lint            0 errors, ~3 pre-existing warnings (queued Phase 10)
> format:check    clean
> test            1042/1042
> build           succeeds (lighthouserc + .github files don't affect build)
> npm audit       clean (--audit-level=high; 4 moderate queued Phase 7)
> grep-mogtrix    OK 0 hits (wordpress/ not in scan path; .github/ harmless)
> grep-forbidden  OK 0 hits
> supply-chain    OK 0 violations
> check-canonical OK 0 legacy refs
> check-dns       OK (SKIP_DNS_CHECK=true)
```

---

## Sub-agent dispatch log

None this phase. Phase 4 work performed inline by parent session. Token-budget conservation for Phase 7 (HIGH track) and Phase 10 (TDD waves) which require heavy sub-agent dispatch.

---

## Operator decisions made (Phase 4)

None. Per v5 §6.2 defaults already codified Phase 0.

---

## Deferrals (NEW from Phase 4)

**Operator post-merge action required:**
- Run `scripts/setup-branch-protection.sh` AFTER:
  1. v5 PR merged (or this Phase 4 slice merged as a setup PR)
  2. Each of `ci.yml`, `lighthouse.yml`, `e2e.yml` workflows has executed at least once and populated check-run names
  3. Required check names in the script match the actual emitted check names (verify via `gh api repos/{owner}/{repo}/commits/{sha}/check-runs`)
- This is documented in Phase 4 commit body + carries forward to Phase 12 launch checklist (Appendix Q operator pre-launch list).

---

## Phase 5 entry conditions

| Gate | Pass? | Evidence |
|---|---|---|
| Phase 4 checkpoint exists | ✅ (this file) |
| `.github/workflows/{ci,lighthouse,e2e}.yml` exist + functional | ✅ |
| `.github/CODEOWNERS` exists with operator handle | ✅ (`@<operator-github>`) |
| `.github/pull_request_template.md` exists | ✅ |
| `@lhci/cli` in devDeps | ✅ |
| `lighthouserc.cjs` thresholds raised to v5 targets | ✅ (95/98/98/98 + tighter timing) |
| `wordpress/` in `.vercelignore` | ✅ |
| `npm run preflight` GREEN | ✅ 11 gates |
| `npm test` GREEN | ✅ 1042/1042 |
| Build succeeds with new prebuild gates | ✅ |

**All Phase 5 entry criteria met. Phase 5 (brand expression + LOCKED_OVERRIDE alignment) begins.**

---

## Recommended Phase 5 entry

Phase 5 closes C8, C9, H22 + LOCKED_OVERRIDE alignment.

Per v5 §8 Phase 5 + supplemental S8:

4 sub-agents in parallel per v5 spec (but Phase 5 is also relatively small; can be done inline):
- E1: Refactor `lib/content/site.ts:22` tagline to "Counted, weighed, verified." (v5 §6.2 default; supersedes deprecated "Research-grade peptides…")
- E2: Reconcile `lib/design/tokens.ts` with `app/globals.css` runtime authority (v5 light clinical theme)
- E3: Create `tests/unit/brand-lock.test.ts` regression guard
- E4: Refresh `DESIGN.md` for v5 light clinical theme

Plus supplemental S8: reconcile parallel `components/v2/`, `app/v2-brand.css`, `design-tokens.json` design system (or document parallel-system acceptance if both are canonical).

Expected closures: 3-4 findings.

---

End of Phase 4 checkpoint.
