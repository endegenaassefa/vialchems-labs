# VERIFICATION REPORT — VialChem Labs Soft-Launch Readiness

**Auditor:** Claude (Opus 4.7, 1M context, fresh session)
**Date:** 2026-05-23
**Mission contract:** `/root/vialchems-prompts/SUPER_PROMPT_softlaunch_2026-05-22.md`
**Live HEAD on `origin/main`:** `84b7d770` (PR #33 C2 operator order detail)
**Working branch:** `feat/phase-11-reconciliation-paid-emails` (PR #34 in-flight, uncommitted)
**Test baseline:** 1503/1503 passing · `tsc --noEmit` clean · preflight greps clean

## TL;DR

23 PRs landed against main since 2026-05-22, covering the entire mobile workstream (M0a–M0j) plus B1/B2/B3/C1/C2/C3/C4/D1/E3/F1/F2/J1/J2/H4 partial scope. **Six P0 bugs** survived the previous session's verification: four are runtime crashes against the live Supabase schema, two are silent contract breaks (UI promises emails the backend never fires; audit-trail rows that never get written). Five additional P1 gaps are open. PR #34 (paid-event reconciliation emails) cannot ship until two of the P0s are fixed in the same branch.

---

## (a) Tier 0 item verification matrix

| Item | PR / SHA | Status | Evidence / Gap |
|---|---|---|---|
| **Mobile workstream** | | | |
| M0a Zelle mobile | #11 `4c4a8a19` | ✅ VERIFIED | viewport export + .input/.btn classes + page restructure; codex P2 fixes applied at PR time |
| M0b Bitcoin mobile | #12 `31ed069d` | ✅ VERIFIED | mirror of M0a + CopyButton component |
| M0c Home hero mobile | #13 `c763a2cf` | ✅ VERIFIED | CSS order swap |
| M0d /shop grid | #14 `44d8b527` | ✅ VERIFIED | 1/2/3-col responsive |
| M0e PDP mobile | #15 `1932f65f` | ✅ VERIFIED | image-first, CTA above-fold (spec relaxed to ~857px per memo) |
| M0f Cart + checkout review | #16 `a853fea0` | ✅ VERIFIED | regression guard; cart was already mobile-ready |
| M0g Secondary pages | #17 `6e9caf23` | ✅ VERIFIED | 14-route guard |
| M0h Nav + footer | #18 `669d2179` | ✅ VERIFIED | hamburger + footer stack guard |
| **M0i Image variants** | #19 `1bdaef0e` | ⚠️ PARTIAL | 164 variants generated + `ProductVisual` rewired with srcset, but `components/ui/Vial.tsx` + `VialProductPhoto.tsx` still emit bare `<img>` — **PROTECTED** follow-up still owed (codex required) |
| M0j A11y sweep | #20 + #21 | ✅ VERIFIED | 16/16 axe assertions green after theme reconciliation |
| **M0k Visual-regression mobile snapshots** | — | ❌ NOT STARTED | `tests/e2e/visual-regression.spec.ts` (PROTECTED) still lacks 375×667 + 412×915 viewports |
| M0l Real-device verification | — | 🚧 OPERATOR-BLOCKED | Awaits operator iPhone/Android pass |
| **Infrastructure (A–J)** | | | |
| A1 Supabase env in Vercel | — | 🚧 OPERATOR-BLOCKED | Day-1 default REQUIRE_SUPABASE=false; code is stub-safe |
| A2 Migrations applied to live DB | — | 🚧 OPERATOR-BLOCKED | Depends on A1 |
| B1 Supabase Auth magic-link | #22 + #30 | ✅ VERIFIED | wrapper + callback + login/signup UI; 6 unit assertions in `tests/unit/auth/supabase-auth.test.ts` |
| **B2 Customer order history API** | #29 `62eda031` | 🔴 **P0 BROKEN** | `app/api/account/orders/route.ts:57` selects `items` column from `orders` — **column does not exist** (lives on `order_items` table per `20260510000001_init.sql:229-239`). Returns 500 the moment Supabase is configured. |
| B3 Order confirmation email | #24 helpers + #32 placed + PR #34 paid | ⚠️ PARTIAL/BROKEN | Placed-event wiring verified in `app/api/checkout/orders/route.ts:412-433` ✓. **Paid-event wiring in `firePaidEmails` BROKEN** — P0-1 (items column) + P1-7 (concurrency race). **Zelle-paid path missing entirely** — P0-5 below. |
| C1 Operator dashboard scaffold | #25 `3b258fa2` | ✅ VERIFIED | list + filter chips + stub-mode banner; auth-guard via `lib/operator/auth-guard.ts` |
| **C2 Operator order detail + PATCH** | #33 `84b7d770` | 🔴 **P0 BROKEN** | Multiple breaks — see P0-3, P0-4, P0-5, P0-6 below. mark_paid action will 500 on the first real Zelle reconcile. |
| C3 Orders shipping columns migration | #23 `0fccfa8c` | ✅ VERIFIED | adds tracking_number/carrier/operator_notes/shipped_at + status index. **Does NOT add `payment_verified_at`** — referenced by C2 PATCH route (P0-3) |
| C4 Operator notification email | #24 helpers + #32 placed + PR #34 paid | ⚠️ PARTIAL | Placed-event ✓. Paid-event has same P0-1 + P1-7 issues as B3. Operator gets no email when Zelle mark_paid fires (correct per spec — operator IS the actor). |
| D1 Plausible analytics | #26 `239d85cf` | ✅ VERIFIED | conditional `<Script>` + CSP allow-list; `lib/analytics/plausible.ts` typed wrapper; 5 unit assertions |
| D2 Sentry env | — | 🚧 OPERATOR-BLOCKED | code already wired in `lib/sentry.ts` |
| D3 Sentry alerts | — | 🚧 OPERATOR-BLOCKED | dashboard config |
| **D4 Funnel events** | #31 `e389af8c` partial | ⚠️ PARTIAL | Wired: `add_to_cart`, `product_viewed`. **Not wired:** `age_gate_passed`, `checkout_started`, `qualification_completed`, `payment_method_selected`, `order_placed`, `order_paid` + missing `/api/analytics/track` proxy route |
| E1 Resend domain verified | — | 🚧 OPERATOR-BLOCKED | DNS records |
| E2 Resend env in Vercel | — | 🚧 OPERATOR-BLOCKED | code stub-safe |
| E3 Unsubscribe handler | #27 `e3114762` | ✅ VERIFIED | HMAC tokens, PROTECTED migration `20260523000002_newsletter_unsubscribes.sql`, 9 unit assertions |
| F1 Fulfillment SOP | #24 `2be5ee70` | ✅ VERIFIED | `docs/operator-runbook.md` updated |
| F2 Shipped email | #33 `84b7d770` | ✅ VERIFIED (code) | `sendOrderShipped` fires on mark_shipped; unit-tested in `transactional-emails.test.ts`. Operator dashboard flow gated by P0-3 + P0-4 |
| G1 BTCPay provisioned | — | 🚧 OPERATOR-BLOCKED | |
| G2 Plaid go-live vs hide | — | 🚧 OPERATOR-BLOCKED | currently disabled in UI (returns 503 on `method=ach`) |
| G3 Zelle env | — | 🚧 OPERATOR-BLOCKED | |
| H1 KLOW composition | — | 🚧 OPERATOR-BLOCKED | needs real text |
| H2 Reta-20mg artwork | — | 🚧 OPERATOR-BLOCKED | needs real asset |
| H3 COA PDFs | — | 🚧 OPERATOR-BLOCKED | lab turnaround |
| H4 PR #4 status | #28 `71070348` | ✅ VERIFIED | documented in operator-runbook; operator's branch — do NOT touch |
| I1 Visual-regression desktop re-baseline | — | ⚠️ PENDING | pre-existing CI red (predates session) |
| **I2 Lighthouse thresholds** | — | ❌ NOT STARTED | `lighthouserc.cjs` (PROTECTED) untouched since v5 |
| I3 Upstash rate limiting | (overlaps PR #4) | 🚧 OPERATOR | PR #4 v5.1 covers it — do NOT touch |
| J1 Support inbox | #28 `71070348` | ✅ VERIFIED | `support@vialchemlabs.net` placeholder swap |
| J2 Contact ack email | #31 `e389af8c` | ✅ VERIFIED | `sendContactAck` fires in `/api/contact/route.ts` |

---

## (b) Iron Law compliance audit

| Law | Status | Evidence |
|---|---|---|
| 2.1 TDD (RED before GREEN) | ✅ | Commit log shows test/feat ordering on shipped PRs |
| 2.4 Medical-claim language | ✅ | `scripts/grep-forbidden-words.sh` returns 0 hits |
| 2.5 / 2.19 PROTECTED-path codex | ⚠️ | Codex confirmed for PR #11, #12 (mobile); PR #23, #26, #27, #33 are PROTECTED and per memory were either codex-cleared or covered by review skill — **must verify before any new push touching these paths**. The pending fixes to `lib/payments/reconciliation.ts` + `app/api/operator/orders/[id]/route.ts` are BOTH protected and MUST go through codex |
| 2.7 / 2.29 Banned-compound override | ✅ | `BANNED_COMPOUNDS` array immutable; `OVERRIDE_ALLOWED_COMPOUNDS` documented in DECISIONS |
| 2.8 BLOCKED_US_STATES = [] | ✅ | Per LOCKED_OVERRIDE 2026-05-20 |
| 2.14 Audit-trail immutability | ⚠️ | Audit triggers are intact. **However C2 PATCH inserts into `audit_log` with wrong columns (P0-4) — never lands, so the trail has gaps for operator actions** |
| 2.15 Commit phase markers | ✅ | All session PRs use `feat(phase-11): ...` / `test(phase-11): ...` |
| 2.16 No `--no-verify` | ✅ | Git log shows no hook-skip commits |
| 2.20 PaymentProviderId locked | ✅ | Union unchanged |
| 2.22 No real credentials | ✅ | `.env.production.template` keeps empty values |
| 2.25 / 2.40 Visual-regression baseline | ⏳ | M0k still owed — no operator review yet because no CHANGED snapshots, only ADDED ones (exception applies) |
| 2.26 / 2.37 Brand expression | ✅ | `siteConfig.name/tagline/domain` locked |
| 2.28 Canonical domain | ✅ | `scripts/check-canonical-domain.sh` clean (no .com refs) |
| 2.30 Webhook signature verification | ✅ | All webhook handlers verify before side-effects |
| 2.31 Layer-3 jurisdictional guard | ✅ | `assertOrderJurisdictionAllowed` intact + B3 fail-closed branch |
| 2.32 Sentry PII scrubber | ✅ | `lib/sentry.ts` `beforeSend` unchanged |
| 2.33 Append-only audit triggers | ⚠️ | Triggers intact, but P0-4 means operator-action audit rows aren't being written → indirect 2.33 hole (no row to UPDATE/DELETE, so trigger doesn't even get exercised) |
| 2.34 Rate limiting | 🚧 | In-memory adapter live; Upstash via PR #4 (operator's branch) |
| 2.41 CSP header | ✅ | vercel.json allow-lists plausible.io |

---

## (c) PROTECTED-path codex coverage map

| PR | PROTECTED files touched | Codex status |
|---|---|---|
| #11 M0a | (none — payment-path adjacent only) | Codex run, 2 P2 fixes applied (specificity + hardcoded secret) ✓ |
| #12 M0b | (none) | Codex run, no findings ✓ |
| #19 M0i | (none — Vial.tsx/VialProductPhoto.tsx deferred) | Skipped per scope |
| #23 C3 migration | `supabase/migrations/*.sql` | Per memory, gate PASS ✓ |
| #26 D1 Plausible | `vercel.json` (CSP) | Per memory, gate PASS ✓ |
| #27 E3 unsubscribe | `supabase/migrations/*.sql` | Per memory, gate PASS ✓ |
| #33 C2 PATCH route | `app/api/operator/*` | Per memory, claimed reviewed via `/codex` ✓ — **yet the route has 4 P0 schema/contract breaks**. This is exactly the failure mode `feedback_codex_catches_integration_gaps` warns about: codex's surface review caught visible patterns but missed schema-name integration gaps |
| **PR #34 (in-flight)** | `lib/payments/reconciliation.ts` | **NOT YET RUN — required before push** |
| **Upcoming C2 PATCH fix** | `app/api/operator/orders/[id]/route.ts` | **MUST run before push** |
| **Upcoming Vial.tsx srcset** | `components/ui/Vial.tsx`, `components/ui/VialProductPhoto.tsx` | **MUST run before push** |
| **Upcoming M0k** | `tests/e2e/visual-regression.spec.ts` | **MUST run before push** |
| **Upcoming I2** | `lighthouserc.cjs` | **MUST run before push** |

---

## (d) In-flight PR #34 status

Branch: `feat/phase-11-reconciliation-paid-emails` (local-only, NOT yet pushed)
Diff target: `lib/payments/reconciliation.ts`
Scope: add `firePaidEmails` helper, call after order_status_history insert on `intent.status === "paid"`.

**Known issues from previous codex review:**

1. **P0-1 (originally tagged P2)** — `firePaidEmails` SELECT references non-existent column:
   ```ts
   .select("display_id, email, total_cents, items")  // line 316
   ```
   `orders` table schema (`20260510000001_init.sql:197-225`) has NO `items` column. Order lines live in the separate `order_items` table. Result: when REQUIRE_SUPABASE=true, the SELECT errors, the outer try/catch captures to Sentry, and the paid email never fires. Stub-mode hides it because `serviceSupabase()` returns null upstream.
   **Severity correction:** this is P0, not P2 — it is a hard contract break for the B3-paid event. The previous review tagged it P2 because the catch swallows it silently, but "paid email never fires" is the actual user-facing failure.

2. **P1-7 (originally tagged P2)** — UPDATE-path concurrency race in `persistToSupabase`:
   ```ts
   const { error: updateError } = await sb
     .from("payments")
     .update({ status: intent.status, ... })
     .eq("provider", intent.provider)
     .eq("provider_intent_id", providerIntentId);
   ```
   No `eq("status", currentStatus)` filter. Two cold-started instances racing on the same `pending → paid` transition can both SELECT `pending`, both UPDATE without conflict, both fall through to `firePaidEmails` → duplicate paid emails. Idempotency-key on Resend would also work as defense-in-depth.

**Fix plan inside PR #34 itself (do NOT split):**
- Drop `items` from the SELECT in `firePaidEmails`; query `order_items` by `order_id` separately.
- Gate UPDATE on prior status via `.eq("status", currentStatus)` and `.select()` so 0-row updates short-circuit `firePaidEmails`.
- Add `idempotencyKey: "${displayId}:paid:customer"` and `"${displayId}:paid:operator"` to Resend send for defense-in-depth.
- Add RED tests: (1) items column drop doesn't crash; (2) race: two reconciles with same `pi` only fire emails once; (3) order_items joined.

---

## (e) Test / typecheck / build gate results

| Gate | Result | Notes |
|---|---|---|
| `npx tsc --noEmit` | ✅ 0 errors | TypeScript can't see Postgres column names, so the P0 schema bugs aren't visible at the type layer |
| `npx vitest run` | ✅ 1503/1503 passed | Matches memory baseline. No regressions. |
| `npm run build` | not run (would block on lint+test) | Husky pre-commit runs all of these; no need to re-run for verification |
| `scripts/grep-forbidden-words.sh` | ✅ 0 hits | Medical-claim regex clean |
| `scripts/grep-mogtrix.sh` | ✅ 0 non-attribution hits | Brand pivot complete |
| `git log origin/main..main` | empty | No unsync'd local commits on main |

**Test coverage for the broken paths:** None of the P0s are caught by current tests. The reconciliation persistence tests mock Supabase at the `from()` boundary, so column-name mismatches don't surface. The C2 route has 4 unit assertions (per memory) but none of them exercise the failing UPDATE path against the real schema.

---

## (f) Prioritized fix list

### P0 (production-breaking when Supabase enabled) — must fix before next session declares anything ready

1. **PR #34 paid-email reconciliation gaps** — fix P0-1 (items column) + P1-7 (concurrency race) in the same in-flight branch. Files: `lib/payments/reconciliation.ts` (PROTECTED — codex required). Add RED tests for both.

2. **B2 customer order history list API** — drop `items` from the SELECT in `app/api/account/orders/route.ts:57`. The detail endpoint can fetch order_items separately. Single-file fix; codex still required because customer-data API is PROTECTED per super-prompt §6 B2 quality gates.

3. **C2 PATCH route — non-existent column writes** — `app/api/operator/orders/[id]/route.ts` (PROTECTED):
   - **P0-3:** Remove `payment_verified_at` from the `mark_paid` UPDATE (column doesn't exist; either drop, or add via new migration with codex review). Cleanest fix: drop the field — the `placed_at` + `order_status_history` row at `to_status='paid'` already records when payment was verified.
   - **P0-4:** Replace `{ action, actor_email, target_kind, target_id, payload }` audit_log insert with the real schema: `{ event_type: "operator.<action>", order_id: <UUID>, details: { actor_email, display_id, ...body } }`. Look up the order's UUID via `display_id` first.

4. **C2 PATCH route — missing side-effects** (same file):
   - **P0-5:** mark_paid action must fire `sendOrderConfirmation({status: "paid"})` for the customer (B3 closure for Zelle/bitcoin-direct paths).
   - **P0-6:** Both mark_paid and mark_shipped must insert `order_status_history` rows (`to_status: "paid"` / `to_status: "shipped"`) per Iron Law 2.33 audit lineage.

### P1 (functional/perf gaps blocking soft-launch checklist)

5. **D4 remaining funnel events** — instrument `age_gate_passed`, `checkout_started`, `qualification_completed`, `payment_method_selected`, `order_placed`, `order_paid`. Add `app/api/analytics/track/route.ts` server-side proxy that hits the Plausible Events API for the two server-only events (`order_placed`, `order_paid`).

6. **M0k visual-regression mobile snapshots** — add 375×667 + 412×915 viewports to `tests/e2e/visual-regression.spec.ts` (PROTECTED — codex required). NEW snapshots only — no operator review per Iron Law 2.25 exception.

7. **M0i Vial.tsx + VialProductPhoto.tsx srcset** (PROTECTED — codex required). Components currently emit bare `<img>`; pipe the 256/384/512/768 variants through Next/Image with proper `sizes`.

8. **I2 Lighthouse threshold tuning** (PROTECTED — codex required). Set thresholds to match achieved scores; minimum 80 on performance, ≥98 on a11y.

### Operator-blocked (parked, surface only at session end)

- A1/A2 Supabase env + migrations
- D2/D3 Sentry env + alerts
- E1/E2 Resend domain + API key
- G1/G3 BTCPay + Zelle env
- H1/H2/H3 real content
- M0l real-device verification
- M1 first-buyer test

---

## Recommended execution order for Phase 2

1. Fix PR #34 (P0-1 + P1-7) → codex → push → admin-merge. (1 PR)
2. Fix B2 list API (P0-2) → push → admin-merge. (1 PR)
3. Fix C2 PATCH (P0-3 + P0-4 + P0-5 + P0-6) → codex → push → admin-merge. (1 PR, bundle because same file)
4. D4 remaining funnel events. (1 PR)
5. M0k visual snapshots. (1 PR)
6. M0i Vial.tsx srcset. (1 PR)
7. I2 Lighthouse. (1 PR)

Estimated: 7 PRs to close every code-side Tier 0 gap. Operator-side gates remain blocked on credential provisioning.

---

*End of report. Phase 2 fixes begin immediately.*
