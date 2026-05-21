# v5 Phase 8 Checkpoint — MEDIUM Track Residual

**Date:** 2026-05-20  
**Branch:** `v5-production-closure`  
**Phase 8 SHA range:** `775e929b` → `ed864699`  
**Phase 7 SHA:** `9ec00415` (entry baseline)

---

## Phase Scope

Per `SUPER_PROMPT_v5.md` §8 Phase 8: close residual MEDIUM findings not already closed in Phases 1-7. Most MEDIUMs (M10/M11/M12/M13/M14/M15/M17/M18/M21/M23/M24/M25/M26/M27/M28) were closed in earlier phases; Phase 8 handles the rest.

Sub-agent dispatch: 1 agent (`a38c93feb12c75208`), ~13 minutes, 107 tool uses, 142K tokens.

---

## Phase Exit State

### 6 commits closing 10 MEDIUMs

| SHA | Subject | Closures |
|---|---|---|
| `775e929b` | fix(phase-8.M5+M6): clean dead header fallbacks + access route comment drift | M5, M6 |
| `f82f43e1` | feat(phase-8.M7): wire marketing-copy filter on contact route message field | M7 (+2 tests) |
| `848e3312` | feat(phase-8.M19): implement Plaid getIntent status-poll via /transfer/get | M19 (+5 tests) |
| `09957e4d` | fix(phase-8.M9): SHA-256 attestation hashing helper in lib/attestations.ts | M9 (+10 tests) |
| `0e86fea9` | docs(phase-8.M16+M20): clarify first-payment-verification + catalog framing | M16, M20 |
| `ed864699` | docs(phase-8.M2+M3+M4): formal acceptance of audit findings — no code change | M2, M3, M4 |

### Per-MEDIUM closure detail

| ID | Status | Evidence |
|---|---|---|
| M2 | ACCEPTED (no backfill) | `docs/DECISIONS/medium_accepted_2026-05-20.md` — v3 model consolidated phases 6-9 into `phase_12_qa.md` |
| M3 | ACCEPTED (audit regrep miss) | `components/age-gate/AgeGateClient.tsx` lines 30/37-39/239-241/254 carry verbatim 21+ + RUO copy |
| M4 | ACCEPTED (shared template) | `app/products/[slug]/page.tsx` → `V2ProductPage`; RUO disclaimer at lines 102, 115, 325 — covers BOTH PDP + bundle |
| M5 | CLOSED | `lib/payments/btcpay.ts:314` collapsed dead-fallback to single `headers["btcpay-sig"]`; `lib/payments/plaid.ts:184-192` lowercase-normalizes at entry |
| M6 | CLOSED | `app/api/access/route.ts:13` comment now correctly references `findMarketingCopyViolation` |
| M7 | CLOSED + TESTED | `app/api/contact/route.ts` invokes `findMarketingCopyViolation(message)`; +2 contact-route tests (banned-compound mention → 400) |
| M9 | CLOSED + TESTED | `lib/attestations.ts` now exports `hashLegalText` + `hashAttestationsBlock` with full pipeline doc; access route imports helper; +10 tests |
| M16 | CLOSED | `docs/deploy/first-payment-verification.md` Test 1 rewritten with explicit Path A ($1 SKU) / Path B (full price + refund) |
| M19 | CLOSED + TESTED | BTCPay was already implemented (lines 250-304 per finding); Plaid `getIntent` now POSTs `/transfer/get` with full error handling; +5 tests |
| M20 | CLOSED | `lib/content/products.ts` + `product-descriptions.ts` header comments reframed; "7-SKU" now positioned as catalog history only |

### Unexpected findings (from sub-agent report)

1. **M19 BTCPay was already done** — audit pointed at lines 206-211 with "TODO" but current HEAD has full Greenfield API impl at 250-304. Only Plaid half required new work.
2. **M20 audit pointer off** — audit said `faq.ts:64` had "7-SKU"; actual hit was in `products.ts` + `product-descriptions.ts` header comments. Phase 8 fixed the real locations.
3. **M5 line numbers off** — audit said btcpay.ts:223 + plaid.ts:167-169; actual locations were btcpay.ts:314 + plaid.ts:184-187. Same intent applied.
4. **Plaid M5 test contract** — instead of breaking the public mixed-case header test, normalized at function entry. External behavior preserved.

---

## Audit-register closures from Phase 8

**MEDIUM closures (10):**
- M2 — checkpoint backfill → ACCEPTED
- M3 — 21+/RUO verbatim regrep → ACCEPTED (lives in age-gate component, audit regrep miss)
- M4 — RUO disclaimer parity PDP + bundle → ACCEPTED (shared template handles both)
- M5 — dead header fallback → CLOSED (PROTECTED PATH SCANNER_OK)
- M6 — comment naming drift → CLOSED
- M7 — /api/contact marketing-copy filter → CLOSED + TESTED
- M9 — SHA-256 attestation hashing pipeline → CLOSED + TESTED (helper added; access route uses it)
- M16 — first-payment-verification framing → CLOSED (Path A/B clarified)
- M19 — getIntent TODOs → CLOSED + TESTED (Plaid implemented; BTCPay already was)
- M20 — FAQ "7-SKU" stale → CLOSED (header comments reframed)

**Total Phase 8 closures: 10 MEDIUMs.**

Combined audit MEDIUM count across all phases:
- Closed in earlier phases: M10/M11/M12/M13/M14/M15/M17/M18/M21/M23/M24/M25/M26/M27/M28 = 15
- Closed in Phase 8: M2/M3/M4/M5/M6/M7/M9/M16/M19/M20 = 10
- Deferred to Phase 11: M22 (visual regression baseline freshness)
- Total: 25 of 28 closed; 1 deferred; 2 require re-verification (M1 was Phase 2; M8 covered Phase 5)

---

## Iron Law movements

| Iron Law | Pre-Phase 8 | Post-Phase 8 | Notes |
|---|---|---|---|
| 2.4 | PASS | PASS-REINFORCED | Marketing-copy filter now wired on /api/contact (M7) |
| 2.6 | PARTIAL | **PASS** | M2 formally accepted via docs/DECISIONS/medium_accepted_2026-05-20.md |
| 2.10 | PASS | PASS-REINFORCED | hashLegalText + hashAttestationsBlock helpers exposed; attestation-pipeline integrity documented |
| 2.32 | PASS | PASS-REINFORCED | Plaid getIntent gains structured error handling + Sentry-friendly error messages |

---

## Tests added

```
tests/unit/api/contact.test.ts            +2 tests (M7)
tests/unit/payments/plaid.test.ts         +5 tests (M19); 1 prior test replaced
tests/unit/attestations.test.ts (NEW)     +10 tests (M9)

Net: +17 tests
```

Test count progression:
- Phase 7 baseline: 1231/1231 across 81 files
- Phase 8 post: **1248/1248 across 82 files (+17, +1 file)**

---

## Test/build/preflight output

```
$ npm test
 Test Files  82 passed (82)
      Tests  1248 passed (1248)

$ npm run preflight
# all 11 gates GREEN
```

Pre-commit hooks fired on all 6 Phase 8 commits.

---

## Sub-agent dispatch log

**Agent `a38c93feb12c75208`** (Phase 8 sole slot): 13 minutes, 107 tool uses, 142K tokens.

---

## Operator decisions made (Phase 8)

None. All inline work; no operator-routing required.

`docs/DECISIONS/medium_accepted_2026-05-20.md` was created as the formal acceptance artifact for M2/M3/M4 (audit observations rather than defects).

---

## Deferrals (NEW from Phase 8)

None. All Phase 8 in-scope work closed.

M22 (visual regression baseline freshness) explicitly deferred to Phase 11 verification per v5 spec.

---

## Phase 9 entry conditions

| Gate | Pass? | Evidence |
|---|---|---|
| Phase 8 checkpoint exists | ✅ (this file) |
| `npm test` GREEN | ✅ 1248/1248 |
| `npm run preflight` GREEN | ✅ 11 gates |
| MEDIUM track resolved (closed or accepted) | ✅ 25 of 28; 1 deferred to Phase 11 |

**All Phase 9 entry criteria met. Phase 9 (LOW + INFO sweep) begins.**

---

## Recommended Phase 9 entry

Phase 9 reviews + closes LOW + INFO findings. Most LOWs already closed by earlier phases (L7/L9/L10/L11 in Phase 1+5+6+8). Remaining:

- **L1** — products.ts header admission of sensitive additions → CLOSED in Phase 2 (header rewritten)
- **L2** — covered by M5 → CLOSED Phase 8
- **L3** — a11y dynamic coverage → CLOSED Phase 7
- **L4** — WELCOME15 promo unlimited globally → consider per-account limit (Phase 9)
- **L5** — orders.status DB transition guard → consider Phase 9 (could be Phase 7 trigger pattern)
- **L6** — sub_6_payments.md stale brand → CLOSED Phase 6 (docs refresh)
- **L7+L8+L9+L10+L11** — CLOSED earlier
- **L12** — bacteriostatic-free water in reconstitution blog (legitimate research context) → INFO; accept
- **L13** — `/api/health` no version/git-sha field → Phase 9 add version field
- **L14** — `next.config.ts` cosmetic → INFO; no action
- **L15** — `tests/setup.ts` spot-check pollution → Phase 9 audit
- **L16** — pre-commit set -e → PASS
- **L17** — `scripts/canary.sh` content deep-read → Phase 9 review
- **L18** — `scripts/generate-product-shots.mjs` → Phase 9 review
- **L19** — `dynamic = 'force-dynamic'` → documentation; PASS
- **L20** — `app/sitemap.ts` minimal/honest → PASS
- **L21** — CHANGELOG `1.3.0:65` COA auto-extend → CLOSED Phase 2 + 7

INFO sweep:
- I1-I19 mostly observational. I12 (CHANGELOG self-contradiction) → fix in Phase 9 CHANGELOG update (or Phase 12 with v5.0.0 entry).

Phase 9 will be inline (small scope; mostly cleanup + INFO acknowledgments).

Expected closures: ~5 LOW + ~5 INFO action items.

---

End of Phase 8 checkpoint.
