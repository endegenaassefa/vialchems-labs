# v5 Phase 1 Checkpoint — Domain Alignment

**Date:** 2026-05-20  
**Branch:** `v5-production-closure`  
**Phase 1 commit SHA:** `ca9bc208`  
**Phase 0 SHA:** `0b7a3f8c` (checkpoint commit; Phase 0 baseline `27876f8f`)

---

## Phase Scope

Per `SUPER_PROMPT_v5.md` §8 Phase 1:

> The canonical domain becomes `vialchemlabs.net` everywhere. The 162 source references to `vialchemlabs.com` get refactored. Domain refactor + DNS preflight + canonical-domain regression test.

Per Phase 0 drift assessment, C1/C11/H14/H29 were already RESOLVED by operator commit `f164f60f Switch production domain to vialchemlabs.net`. Phase 1 closure is **verification-only** plus new Iron Law 2.28/2.38 enforcement gates.

---

## Phase Exit State

### Verification of f164f60f resolution

| Audit finding | Cited file:line at anchor | Current state at HEAD `5ec8324a` | Verdict |
|---|---|---|---|
| C1 | `lib/content/site.ts:8` `?? 'vialchemlabs.com'` | `lib/content/site.ts:9 ?? "vialchemlabs.net"` | ✅ RESOLVED |
| C11 | `public/robots.txt:13` Sitemap line | `public/robots.txt:36 Sitemap: https://vialchemlabs.net/sitemap.xml` | ✅ RESOLVED |
| H14 | self-referential fallback lists in `docs/deploy/dns.md` etc | `docs/deploy/dns.md` lines 1, 5, 12, 29, 39, 72, 79, 84 now `vialchemlabs.net` | ✅ RESOLVED |
| H29 | `app/sitemap.ts:11` + `public/robots.txt:13` wrong-domain base | `siteConfig.url` resolves via `siteConfig.domain = vialchemlabs.net`; robots.txt aligns | ✅ RESOLVED |
| M21 | `docs/checkpoints/phase_15_post_deploy.md:21,40,83,88,93` `.com` refs | Per drift assessment grep: 0 hits in source-tree (only in audit doc historical context) | ✅ RESOLVED |
| M25 | `README.md:36` `.com` reference | Per drift: source-tree clean; README inherits | ✅ RESOLVED |
| L7 | `docs/checkpoints/phase_15_post_deploy.md` (duplicate M21) | Same | ✅ RESOLVED |

### New artifacts created

| File | Lines | Purpose | Iron Law |
|---|---|---|---|
| `scripts/check-canonical-domain.sh` | 102 | Pre-commit grep gate — refuses source-tree refs to 4 legacy domains | 2.28 |
| `scripts/check-dns-resolution.sh` | 76 | Prebuild DNS probe — verifies BRAND_DOMAIN resolves (skip via env) | 2.38 |
| `tests/unit/site/canonical-domain.test.ts` | 150 | Vitest regression lock: 0 legacy refs + robots.txt + .env.example | 2.28 |
| `tests/unit/site/site-config.test.ts` | 91 | siteConfig invariants test | 2.1 |

### Modifications

| File | Change | Purpose |
|---|---|---|
| `package.json` scripts | Added `prebuild`, `check-canonical-domain`, `check-dns-resolution`; extended `preflight` | Wire new gates |
| `.husky/pre-commit` | Added `check-canonical-domain.sh` step (post supply-chain-scan) | Pre-commit enforcement |

---

## Audit-register closures from Phase 1

**RESOLVED-by-prior-work + regression-locked (8 findings):**
- C1 — Domain misalignment in `site.ts:8`
- C11 — `robots.txt:13` Sitemap line  
- H14 — Fallback domain self-references in deploy docs
- H29 — `sitemap.ts:11`/`robots.txt:13` base URL drift
- M21 — `docs/checkpoints/phase_15_post_deploy.md` canary URL refs
- M25 — `README.md:36` domain reference
- L7 — duplicate of M21

**Supplemental closure:**
- S17 — `.husky/pre-commit` missing Iron Law 2.28/2.38 hooks → CLOSED (added check-canonical-domain to pre-commit; check-dns-resolution gated by prebuild)

**Total Phase 1 closures: 8.**

---

## Iron Law movements

| Iron Law | Pre-Phase 1 | Post-Phase 1 | Notes |
|---|---|---|---|
| 2.1 | TDD discipline — applies | applies | Phase 1 follows regression-lock pattern (test added to lock RESOLVED state) |
| 2.2 | Verification before completion | PASS | `npm test`/`build`/`preflight` re-run; commands captured below |
| 2.6 | Checkpoint artifacts per phase | PASS | This checkpoint exists |
| 2.15 | TDD checkpoint commits | PASS | `ca9bc208` commit body includes RED-GREEN-REFACTOR cadence note + audit closure citations |
| **2.28** | FAIL-CRITICAL (no enforcement) | **PASS** | `scripts/check-canonical-domain.sh` + `tests/unit/site/canonical-domain.test.ts` |
| **2.38** | FAIL-CRITICAL (no preflight check) | **PASS** | `scripts/check-dns-resolution.sh` + prebuild wiring |

---

## Tests added

```
tests/unit/site/canonical-domain.test.ts      7 tests (1 CANONICAL + 4 LEGACY x4 + robots + env)
tests/unit/site/site-config.test.ts          13 tests (brandStem, domain, url, posture, llcName,
                                                       llcJurisdiction, labPartner.name, labPartner.portalUrl,
                                                       name, tagline, shipping, email.from, email.staff)

Total: 20 NEW tests added.
```

Test count progression:
- Phase 0 baseline: 634/634 across 62 files
- Phase 1 post: 654/654 across 64 files

---

## Test/build/preflight output

```
$ npm run preflight
# (all 11 gates GREEN)
> npm run typecheck     clean
> npm run lint           0 errors, 3 warnings (pre-existing; queued Phase 10)
> npm run format:check   clean
> npm test               654/654 passed (62→64 files; +20 tests)
> npm run build          (gated by NEW prebuild script which now runs first)
> npm audit --high       clean (4 moderate-severity queued)
> npm run grep-mogtrix   OK 0 hits
> npm run grep-forbidden OK 0 hits
> npm run supply-chain   OK 0 violations
> npm run check-canonical-domain  OK 0 legacy-domain references
> SKIP_DNS_CHECK=true npm run check-dns-resolution  OK (skipped per env)
```

Live DNS probe (separate from preflight):
```
$ bash scripts/check-dns-resolution.sh
OK: check-dns-resolution — https://vialchemlabs.net/ resolved 200
```

(Live site returns 200 after following age-gate redirect; preflight uses SKIP=true to avoid CI flakiness.)

---

## Sub-agent dispatch log

None this phase. Phase 1 was inline (the drift assessment already provided the operative work list; the closures were verification-only + 4 file additions).

---

## Operator decisions made (Phase 1)

None. All Phase 1 work followed the LOCKED_OVERRIDE defaults from Phase 0. The new scripts + tests + wiring are mechanical implementations of Iron Laws 2.28 + 2.38.

---

## Deferrals (NEW from Phase 1)

None. Phase 1 scope closed in full.

---

## Phase 2 entry conditions

| Gate | Pass? | Evidence |
|---|---|---|
| Phase 0 checkpoint exists | ✅ | `docs/checkpoints/v5_phase_0_preflight.md` (`0b7a3f8c`) |
| `npm run preflight` GREEN | ✅ | All 11 gates pass per output above |
| 0 hits of `vialchemlabs.com` in source-tree | ✅ | `bash scripts/check-canonical-domain.sh` confirms |
| `scripts/check-canonical-domain.sh` exists + executable | ✅ | `ls -la` shows `-rwxr-xr-x` |
| `scripts/check-dns-resolution.sh` exists + executable | ✅ | same |
| `tests/unit/site/canonical-domain.test.ts` passes | ✅ | 7/7 |
| `tests/unit/site/site-config.test.ts` passes | ✅ | 13/13 |
| Build green | ✅ | `next build` succeeds; prebuild gates also pass |
| Preflight green | ✅ | exit 0 |
| `docs/checkpoints/v5_phase_1_domain_alignment.md` written | ✅ (this file) |

**All Phase 1 exit criteria met. Phase 2 (compliance catalog + banned-compound blocklist) begins.**

---

## Recommended Phase 2 entry

Phase 2 closes the largest cluster of CRITICAL findings from the v5 audit register:

- C2 (tesamorelin-5mg) — SHIFTED to `products.ts:348`
- C3 (melanotan-ii-10mg) — SHIFTED to `products.ts:506`
- C4 (compliance regex incomplete) — PARTIALLY-RESOLVED; extend with short-codes + missing compounds
- C5 (Vial whitelist auto-derives) — STILL-APPLIES; replace with explicit static allowlist
- M14 (LOCKED EXCLUSION banners on wave files) — 4 banner files needed
- H21 (bundle names tilt marketing) — research-register rename
- M1 (`pharmaceutical-grade` hyphen bypass) — regex fix
- **S1 NEW (klow-80mg + reta-10mg + tirz-25mg)** — REMOVE per LOCKED_OVERRIDE
- **S4 NEW (FAQ names Reta/Tirz/KLOW publicly)** — rewrite faq.ts:59
- **S6 NEW (covered by S4)** — same
- **S10 NEW (short-code regex)** — add `\btirz\b`/`\breta\b`/`\bsema\b`/`\bklow\b`

Phase 2 will dispatch 6 sub-agents in parallel per v5 §8 Phase 2 spec, plus the supplemental S1/S4/S6/S10 additions:
- B1: Remove 6 banned SKUs from products.ts (lines 348, 490, 506, 706, 721, 736) + related files
- B2: Create lib/compliance/banned-compounds.ts + comprehensive tests
- B3: Extend lib/compliance.ts regex set with hyphen-fix + short-codes (protected path; SCANNER_OK)
- B4: Double-gate Vial.tsx assertCompoundAllowed (catalog allowlist + static blocklist)
- B5: Bundle renames + Vercel 301 redirects in vercel.json
- B6: LOCKED EXCLUSION banners on 4 wave files
- B7 (NEW): Rewrite lib/content/faq.ts:59 to omit banned compound names + add regression test
- B8 (NEW): Verify `lib/content/email-templates.ts:106` Recovery Stack composition matches products.ts (H11)

Expected closures: 11 findings (4 CRITICAL + 5 HIGH + 3 MEDIUM/LOW from original + 4 supplemental).

---

End of Phase 1 checkpoint.
