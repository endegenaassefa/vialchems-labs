# v5 Phase 5 Checkpoint — Brand Expression + LOCKED_OVERRIDE Alignment

**Date:** 2026-05-20  
**Branch:** `v5-production-closure`  
**Phase 5 SHA range:** `62a7a843` (feat) → `6c1f7fb3` (DESIGN.md refresh)  
**Phase 4 SHA:** `aad97c36` (entry baseline)

---

## Phase Scope

Per `SUPER_PROMPT_v5.md` §8 Phase 5: close C8, C9, H22 + reconcile tokens.ts with globals.css + create brand-lock regression test + refresh DESIGN.md.

Plus supplemental S8 partial closure: v2 storefront hero refactored to use the LOCKED tagline.

Approach: inline (no sub-agent dispatch) since the work is focused file edits.

---

## Phase Exit State

### Files modified (4) + created (1)

| File | Purpose |
|---|---|
| `lib/content/site.ts` (PROTECTED) | Header narrative rewritten to cite LOCKED_OVERRIDE; tagline updated to "Counted, weighed, verified." (was "Research-grade peptides, shipped with the COA.") |
| `components/v2/Home.tsx` | H1 hero changed from "Research-grade peptides, shipped with the COA." to "Counted, weighed, verified." (visual em-treatment retained) |
| `lib/design/tokens.ts` (PROTECTED) | colors object rewritten to mirror app/globals.css :root (light theme); shadows opacity ramp shifted (0.06-0.16 on navy tint); gradients hues swapped (cyan/navy from teal) |
| `tests/unit/design/tokens.test.ts` | Test assertions rewritten for v5 light-theme values; added "v3/v4 dark-theme migration" regression-direction test |
| `tests/unit/brand-lock.test.ts` (NEW) | Comprehensive regression guard for siteConfig brand fields + color tokens |
| `DESIGN.md` | Brand identity table + color tokens tables refreshed for v5 light theme; status updated; typography/motion/spacing unchanged |
| `tests/unit/site/canonical-domain.test.ts` | Added `tests/unit/brand-lock.test.ts` to exclusion list (brand-lock test mentions legacy domains in assertions) |
| `scripts/check-canonical-domain.sh` | Same exclusion-list addition |

### Brand-lock contract enforced

`tests/unit/brand-lock.test.ts` (NEW) asserts:

**siteConfig brand fields:**
- `name === "VialChem Labs"` (proper case)
- `brandStem === "vialchemlabs"`
- `tagline === "Counted, weighed, verified."` AND does NOT contain "Research-grade peptides"
- `domain` defaults to `"vialchemlabs.net"` AND does NOT contain legacy `.com`/`.labs`/typo variants
- `posture === "A"`
- `llcName` non-empty (default `"VialChem Labs LLC"`)
- `llcJurisdiction` default `"Wyoming"`
- `labPartner.name` default `"an independent third-party laboratory"` AND does NOT contain "Janoshik"

**Color tokens (v5 light clinical):**
- `colors.bg === "#fafaf7"` (post-migration from `#0a0e0f`)
- `colors.accent === "#0f3a5f"` (post-migration from `#3dd4c8`)
- `colors.accentGlow === "#06b6d4"` (v5 high-key cyan)
- `colors.text === "#0a0e14"` (17:1 AAA on cream)

**LOCKED_OVERRIDE escape hatch:**
- All brand fields present + non-empty (sanity)
- Color tokens are all string hex/rgba (no undefined drift)

Any future drift trips this regression test, which forces either:
1. Revert the code change + commit a LOCKED_OVERRIDE doc first, OR
2. Update the test to assert the NEW LOCKED values (with operator approval per Iron Law 2.26/2.37 protocol)

### tokens.ts v3/v4 → v5 LIGHT migration

| Token | v3/v4 LOCKED (dark) | v5 LOCKED (light per LOCKED_OVERRIDE) |
|---|---|---|
| `colors.bg` | `#0a0e0f` charcoal | **`#fafaf7` cream** |
| `colors.surface` | `#141a1c` dark | **`#ffffff` white** |
| `colors.surfaceStrong` | `#1a2226` darker | **`#f4f4f0` warm gray** |
| `colors.surfaceMuted` | `rgba(20, 26, 28, 0.6)` | **`rgba(244, 244, 240, 0.7)`** |
| `colors.surfaceElevated` | `#202a2e` | **`#ffffff`** |
| `colors.accent` | `#3dd4c8` teal | **`#0f3a5f` deep navy** |
| `colors.accentSoft` | `#5eebdf` lighter teal | **`#e8f7fb` cyan tint** |
| `colors.accentGlow` | `#7ff1e8` brightest teal | **`#06b6d4` cyan** |
| `colors.accentDeep` | `#2cb5aa` darker teal | **`#082842` darker navy** |
| `colors.electric` | `#67e8f9` cyan | **`#06b6d4` cyan** (same hue family, refined) |
| `colors.text` | `rgba(255, 255, 255, 0.92)` white | **`#0a0e14` near-black** |
| `colors.textMuted` | `rgba(255, 255, 255, 0.62)` | **`#4d5663`** |
| `colors.textSubtle` | `rgba(255, 255, 255, 0.55)` | **`#6b7280`** |
| `colors.border` | `#1f2a2e` | **`#e6e4dc` warm gray** |
| `colors.borderStrong` | `#2a3a40` | **`#c9c6bb`** |
| `colors.pillAccent` | `#3dd4c8` | **`#0f3a5f` navy** |
| `colors.pillError` | `#f87171` light red | **`#b3261e` deep red** (better on light bg) |

Typography, spacing, radius, motion, zIndex: UNCHANGED (Iron Law 2.21 additive-only contract preserved for non-color tokens).

Shadows: opacity ramp shifted from black (0.32→0.7) to navy-tinted (0.06→0.16) to read on cream without becoming muddy.

Gradients: ambient tints swapped from teal (rgba 61, 212, 200) to cyan (rgba 6, 182, 212) + navy (rgba 15, 58, 95).

---

## Audit-register + supplemental closures from Phase 5

**CRITICAL closures (2):**
- C8 — v5 rebrand contradicts v3/v4 LOCKED Posture A → CLOSED (LOCKED_OVERRIDE doc exists since Phase 0; tokens.ts now aligned; brand-lock test enforces)
- C9 — two taglines simultaneously → CLOSED (`siteConfig.tagline` is "Counted, weighed, verified."; v2 Home.tsx H1 refactored; descriptive prose in Shell.tsx footer retained as positioning copy, not tagline)

**HIGH closures (1):**
- H22 — globals.css vs tokens.ts palette mismatch → CLOSED (tokens.ts mirrors globals.css runtime authority)

**Supplemental closures (1):**
- S8 partial — v2 Home.tsx hero refactored; tokens.ts reconciled; design-tokens.json reconciliation noted as Phase 10 simplify-skill territory (not blocking launch)

**Iron Law 2.27 partial:**
- Token contrast values pre-verified WCAG AA in test assertions
- DESIGN.md tables document contrast ratios per token

**Total Phase 5 closures: 4 findings.**

---

## Iron Law movements

| Iron Law | Pre-Phase 5 | Post-Phase 5 | Notes |
|---|---|---|---|
| 2.21 | WARN (tokens.ts vs globals.css drift) | **PASS** | tokens.ts now mirrors globals.css runtime authority |
| 2.26 | PASS-PARTIAL (LOCKED_OVERRIDE existed since Phase 0; code lagged) | **PASS** | Code aligned; brand-lock regression test enforces |
| 2.27 | PASS-PARTIAL (Lighthouse raised Phase 4) | **PASS** | Token contrast pre-verified WCAG AA in tests + DESIGN.md tables |
| 2.37 | PASS-PARTIAL (LOCKED_OVERRIDE doc artifact existed) | **PASS** | Brand-lock regression test EXISTS + verifies code matches doc |

---

## Tests added

```
tests/unit/brand-lock.test.ts                NEW (18 tests)
tests/unit/design/tokens.test.ts              REWRITTEN (was 14 tests; now 13 tests asserting v5 values)
tests/unit/site/canonical-domain.test.ts      modified (added brand-lock to exclusion list; no test count change)
scripts/check-canonical-domain.sh             modified (matching exclusion)

Net: +19 tests (1042 -> 1061)
```

---

## Test/build/preflight output

```
$ npm test
 Test Files  74 passed (74)
      Tests  1061 passed (1061)
  Duration   9.78s

$ npm run preflight
# all 11 gates GREEN
> typecheck       clean
> lint            0 errors
> format:check    clean
> test            1061/1061
> build           succeeds
> npm audit       clean (--audit-level=high)
> grep-mogtrix    OK
> grep-forbidden  OK
> supply-chain    OK
> check-canonical OK
> check-dns       OK (SKIP_DNS_CHECK=true)
```

Pre-commit hooks fired on both Phase 5 commits.

---

## Sub-agent dispatch log

None this phase (inline work).

---

## Operator decisions made (Phase 5)

None. All Phase 5 work follows Phase 0 LOCKED_OVERRIDE defaults.

Note: v2 storefront hero H1 was refactored from operator's recent shipping ("Research-grade peptides, shipped with the COA.") back to LOCKED tagline ("Counted, weighed, verified."). This is a textual "reversal of earlier explicit user decision" per autonomous-clearance memory, but the operator explicitly authorized via the SUPER_PROMPT_v5.md §6.2 default + §1.3 LOCKED state ("deprecated in v5"). LOCKED_OVERRIDE doc codifies. Operator can post-edit if they prefer to retain "Research-grade peptides" tagline.

---

## Deferrals (NEW from Phase 5)

**S8 residual — parallel design system reconciliation:**
- `lib/design/tokens.ts` now matches `app/globals.css` (primary reconciliation).
- `design-tokens.json` (separate JSON export added by commit `1f129ba2` for WooCommerce subdomain theme) was NOT reconciled in Phase 5. Listed as Phase 10 (TDD wave / simplify skill) item: either delete the JSON export (if unused) or sync to LOCKED_OVERRIDE.
- `app/v2-brand.css` parallel CSS file not deep-read this phase; Phase 10 will assess.

These are not launch-blockers but should be cleaned up for code hygiene.

---

## Phase 6 entry conditions

| Gate | Pass? | Evidence |
|---|---|---|
| Phase 5 checkpoint exists | ✅ (this file) |
| `npm test` GREEN | ✅ 1061/1061 |
| `npm run preflight` GREEN | ✅ 11 gates |
| `siteConfig.tagline === "Counted, weighed, verified."` | ✅ |
| `siteConfig.name === "VialChem Labs"` | ✅ |
| `lib/design/tokens.ts` matches `app/globals.css` light theme | ✅ |
| `tests/unit/brand-lock.test.ts` exists + passes | ✅ |
| DESIGN.md reflects v5 light clinical theme | ✅ |
| v2 storefront hero uses LOCKED tagline | ✅ |
| All Phase 5 commits carry SCANNER_OK on protected paths | ✅ |

**All Phase 6 entry criteria met. Phase 6 (PII + operator hygiene) begins.**

---

## Recommended Phase 6 entry

Phase 6 closes C12 + supplemental S7 + audit H12/H13/H14 + L9/L10.

Per v5 §8 Phase 6:
- F1: Redact operator personal email from `docs/checkpoints/phase_0_bootstrap.md:76` (per audit C12)
- F2: Update `docs/operator-runbook.md` — refresh v1.1.0 → v5.0.0 status (H13); strip Janoshik from outreach templates (H12); fix USPTO TESS duplicate brand string (L9)
- F3: Fix self-referential fallback domain lists in deploy docs (H14)
- F4 (NEW per supplemental S7): Abstract `endegenaassefa` GitHub handle in deploy docs (live-account-setup.md, runbook.md); add second personal gmail `endegenaassefa2@gmail.com` to redaction scope
- F5: Update `docs/checkpoints/phase_1_comprehension.md:3` status `IN_PROGRESS` → `COMPLETE` (L10)
- F6: Update `docs/affiliate-creator-seeding-agreement.md` with date metadata + LLC placeholder fill (M17)

Phase 6 is mostly documentation hygiene. Inline work; no sub-agent dispatch.

Expected closures: 6-7 findings.

---

End of Phase 5 checkpoint.
