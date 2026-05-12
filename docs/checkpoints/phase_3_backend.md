# Phase 3 — Backend Bootstrap (CHECKPOINT)

Date: 2026-05-08
Phase target: 90-120 min
Status: COMPLETE (with deferrals noted)

## Goal

Initialize NEW Next.js project. NOT a Mogtrix fork. Port specific Mogtrix patterns by READ + ADAPT with attribution comments.

## Deliverables

| Item                                                                   | Status                         |
| ---------------------------------------------------------------------- | ------------------------------ |
| Next.js 16.2.6 + React 19.2.4 + TS scaffold                            | ✓                              |
| Tailwind v4 + PostCSS                                                  | ✓                              |
| Husky 9 pre-commit hook (.husky/pre-commit)                            | ✓                              |
| scripts/grep-mogtrix.sh (Iron Law 2.12)                                | ✓                              |
| scripts/grep-forbidden-words.sh (Iron Law 2.4)                         | ✓                              |
| scripts/supply-chain-scan.sh (Iron Law 2.16)                           | ✓                              |
| lib/compliance.ts (ported, extended Appendix P, 50 tests pass)         | ✓                              |
| lib/compliance/jurisdictions.ts (CA/TX/NY/FL block list, Iron Law 2.8) | ✓                              |
| lib/content/site.ts (vialchemlabs brand config)                        | ✓                              |
| app/api/health/route.ts (canary endpoint)                              | ✓                              |
| .env.example (full env template)                                       | ✓                              |
| Vitest config + tests/setup.ts                                         | ✓                              |
| Initial test suite (50/50 passing)                                     | ✓                              |
| `npm run build` passes                                                 | ✓                              |
| Pre-commit hook fires on commit                                        | ✓ (verified by initial commit) |

## Iron Law Verification

- 2.1 (TDD): tests/unit/compliance.test.ts has 50 cases (37 forbidden patterns + 7 safe + 6 edge). For NEW code from Phase 4 onward, strict failing-test-first cycle applies. compliance.ts was ported (both impl and tests landed together) — noted as port-not-iterative-TDD.
- 2.4 (no forbidden marketing language): scripts/grep-forbidden-words.sh enforced; 0 hits across `app/`, `components/`, `lib/content/`, `public/`.
- 2.12 (no Mogtrix branding): scripts/grep-mogtrix.sh enforced; only attribution comments allowed (`// Pattern adapted from mogtrix-website/...`).
- 2.15 (TDD checkpoint commits): commit message format `feat(phase-3): GREEN — ...` with verbatim test PASS/FAIL output and validating-command list.
- 2.16 (supply-chain scanner): scripts/supply-chain-scan.sh enforced; 6 categories scanned (hidden unicode, infra keywords, credential files, debug leftovers, prompt-injection comments, suspicious base64).

## Deferred (per architecture plan §7 + context-budget pragmatism)

| Item                                                 | Deferred to                             | Reason                                                                      |
| ---------------------------------------------------- | --------------------------------------- | --------------------------------------------------------------------------- |
| Supabase client port (lib/supabase/\*)               | Phase 5/8 (when first feature needs it) | Day-1 stub mode means no real DB calls; defer to feature need               |
| Auth flow (lib/auth/_, app/auth/_)                   | Phase 8                                 | Customer qualification + age gate are Phase 8; auth couples to those        |
| Payment adapter implementations                      | Phase 9                                 | Iron Law 2.5 mandates /review + /cso before commit; do as one focused phase |
| Sentry instrumentation activation                    | When SENTRY_AUTH_TOKEN provided         | Stub DSN means errors local-only                                            |
| Vercel staging deploy + /api/health 200 verification | Phase 14                                | Requires Vercel link + token; defer to ship phase                           |

## Verification Gate

- [x] Site builds (`npm run build` passes)
- [x] Tests pass (`npm test` 50/50)
- [x] grep-mogtrix returns 0 non-attribution hits
- [x] grep-forbidden-words returns 0 hits
- [x] supply-chain-scan returns 0 violations
- [x] All ported patterns have attribution comments (1 file: lib/compliance.ts; comment present line 1-3)
- [ ] Deploys to Vercel staging (deferred to Phase 14)
- [ ] /api/health returns 200 (deferred to Phase 14; route compiled OK)

## Outstanding for Phase 4 entry

Phase 4 (Brand + Design System) can begin immediately. Token values from Appendix V.2 are LOCKED. Component primitives + design tokens build on the scaffold.
