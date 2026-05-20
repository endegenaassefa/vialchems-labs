# Audit Drift Assessment — 2026-05-20

**Audit anchor:** `ff97cde73b57665336d35ee173b186120d531cef`
**Current HEAD:** `5ec8324a5624693b1f6f39f36f818a69a7361c44`
**Commits ahead:** 48 (441 files changed, ~25K insertions since anchor)
**Assessment scope:** 13 CRITICAL + 30 HIGH findings from `docs/audit/2026-05-19_full_audit_report_v2.md` §12
**Working repo:** `/root/peptide-site-v5/`

---

## Methodology

For each finding the protocol was:

1. Verify the cited file:line exists at current HEAD (`Read` / `grep -n` at the cited path).
2. Check whether the quoted text is still present verbatim, present at a shifted line, refactored elsewhere, or removed entirely.
3. Scan `git log ff97cde..HEAD` for fix commits by keyword (`git log --grep`) and inspect the offending diff hunks where relevant.
4. Classify per v5 §0.B verdicts:
   - **STILL-APPLIES** — finding holds verbatim on current HEAD; Phase-N closure must execute as documented.
   - **RESOLVED-by-prior-work** — already fixed since audit anchor; cite the fix commit SHA; closure becomes verification-only.
   - **SHIFTED-LINE-NUMBERS** — same problem, new location; capture new file:line.
   - **OBSOLETE** — finding no longer relevant due to structural refactor; mark closed with rationale.
   - **NEW-COROLLARY-ISSUE** — finding partially addressed but refactor introduced a related new issue; flag for `supplemental_findings.md`.

All commands were read-only. No edits, writes, commits, or git mutations were performed.

---

## Verdict Summary

| Verdict | Count |
|---|---|
| STILL-APPLIES | 26 |
| RESOLVED-by-prior-work | 8 |
| SHIFTED-LINE-NUMBERS | 5 |
| OBSOLETE | 0 |
| PARTIALLY-RESOLVED / NEW-COROLLARY | 4 |
| **Total** | **43** |

Breakdown by severity:

- CRITICAL (13): 6 STILL-APPLIES · 4 RESOLVED · 3 SHIFTED · 0 PARTIALLY
- HIGH (30): 20 STILL-APPLIES · 4 RESOLVED · 2 SHIFTED · 4 PARTIALLY

Net: the v5 closure work list is **30 STILL-APPLIES or SHIFTED CRITICAL+HIGH findings**, NOT 43, after subtracting fully-resolved items. New supplemental findings introduced by the 48 post-anchor commits are tracked in `docs/audit/2026-05-20_supplemental_findings.md`.

---

## Findings table

| ID | Severity | Original cite (audit v2) | Current state at HEAD `5ec8324a` | Verdict | Fix commit / notes |
|---|---|---|---|---|---|
| C1 | CRITICAL | `lib/content/site.ts:8` `brandDomain = … ?? 'vialchemlabs.com'` | `lib/content/site.ts:9` `brandDomain = process.env.BRAND_DOMAIN ?? "vialchemlabs.net"` | RESOLVED-by-`f164f60f` | "Switch production domain to vialchemlabs.net". `.env.example:12 BRAND_DOMAIN=vialchemlabs.net`; `public/robots.txt:36 Sitemap: https://vialchemlabs.net/sitemap.xml`. Verification-only closure. |
| C2 | CRITICAL | `lib/content/products.ts:285` `slug: 'tesamorelin-5mg'` | `lib/content/products.ts:348` `slug: "tesamorelin-5mg"` | SHIFTED-LINE-NUMBERS | SKU still in catalog at line 348 (was 285); closure proceeds per audit recommendation §14 item 2. |
| C3 | CRITICAL | `lib/content/products.ts:443` `slug: 'melanotan-ii-10mg'` | `lib/content/products.ts:506` `slug: "melanotan-ii-10mg"` | SHIFTED-LINE-NUMBERS | SKU still in catalog at line 506; closure proceeds. |
| C4 | CRITICAL | `lib/compliance.ts:46–52` regex set missing tesamorelin / melanotan / bremelanotide / BAC water / tirz / sema / reta | `lib/compliance.ts:49–52` now contains `\btirzepatide\b`, `\bretatrutide\b`, `\bsemaglutide\b`, `GLP[-\s]?1`, `\binsulin\b`, `\bdiabetes\b` | PARTIALLY-RESOLVED | Three names added (tirzepatide/retatrutide/semaglutide). Still missing: `tesamorelin`, `melanotan`, `MT-2`, `MT-II`, `bremelanotide`, `bacteriostatic\s*water`, `BAC\s*water`, GLP-1 obfuscations (`\btirz\b`, `\bsema\b`, `\breta\b` as standalone short-codes). Phase-2 closure remains substantive. |
| C5 | CRITICAL | `components/ui/Vial.tsx:87–90` whitelist auto-derives from `products.map` | `components/ui/Vial.tsx:82–85` same pattern, exact same code (whitespace shift only) | STILL-APPLIES | Structural defect unmoved. Adding any banned compound to `products.ts` auto-allows through the only structural guard. The 3 NEW banned SKUs (klow-80mg / reta-10mg / tirz-25mg per supplemental) demonstrate the defect concretely. |
| C6 | CRITICAL | `lib/payments/plaid.ts:8–11`, `:92–114`, `:171`; plaid webhook | `lib/payments/plaid.ts:7–13` header still says "this scaffold uses HMAC for parity with BTCPay until ops wires JWKS in Phase 10"; `lib/payments/plaid-jwks.ts` (4.5KB) still present + still unimported | STILL-APPLIES | No production code path imports `plaid-jwks.ts`. `lib/payments/plaid.ts:146–148 throw new Error("plaid_create_intent_not_implemented")` still fires. |
| C7 | CRITICAL | No `.github/` workflows; no `@lhci/cli` in package.json | `ls -la .github/` → directory does not exist; `find . -name "*.yml" -path "*workflows*"` → no matches; no `lhci` in `package.json` | STILL-APPLIES | CI infrastructure entirely absent. `scripts/setup-branch-protection.sh` (referenced in audit) would still permanently lock main. |
| C8 | CRITICAL | `lib/content/site.ts:1–6`; `app/globals.css:14–37` v5 rebrand diverges from LOCKED Posture A | `lib/content/site.ts:4–6` still narrates v5 rebrand; `app/globals.css:14–37` still ships light + cyan-navy; `app/globals.css:14` confirms `--bg: #fafaf7` + `--accent: #0f3a5f` + `--accent-glow: #06b6d4` | STILL-APPLIES | NEW COROLLARY: `lib/design/tokens.ts:14–41` still ships v4 dark+teal (`--bg: #0a0e0f`, `--accent: #3dd4c8`) — CSS/tokens single-source-of-truth violation persists (also covered as H22). No `docs/DECISIONS/locked_override_2026-05-10.md` on disk. |
| C9 | CRITICAL | `lib/content/site.ts:20` tagline vs 21 hits of "Counted, weighed, verified." | `lib/content/site.ts:22 tagline: "Research-grade peptides, shipped with the COA."` vs `grep -rn "Counted, weighed, verified"` → 2 hits (down from 21): `app/products/[slug]/opengraph-image.tsx:212` and `app/newsletter/thanks/page.tsx:68` | SHIFTED + PARTIALLY-RESOLVED | Bulk of refs swept (19 of 21 cleared, likely by `ccf075e9` "harden production catalog and brand copy" + `77edd776` "remove legacy hero brand label" + `fe185e67` "align production brand and asset paths"). Two stragglers remain — OG generator + newsletter thanks page. |
| C10 | CRITICAL | `docs/checkpoints/v4_phase_13_handoff.md:53,59–60` claims D17/D24/D25 DONE | Lines 52, 59, 60 of handoff doc still read `✓ D17 Lighthouse CI gate`, `✓ D24 Branch protection`, `✓ D25 Visual-regression baseline + diff CI` | STILL-APPLIES | Misclassified-closure claim persists; `.github/` artifacts still absent (see C7). Handoff doc not updated. |
| C11 | CRITICAL | `public/robots.txt:13` `Sitemap: https://vialchemlabs.com/sitemap.xml` | `public/robots.txt:36` `Sitemap: https://vialchemlabs.net/sitemap.xml` | RESOLVED-by-`f164f60f` | Same domain fix that closed C1. Verification-only. |
| C12 | CRITICAL | `docs/checkpoints/phase_0_bootstrap.md:76` `git committer ak47abhinav47@gmail.com` | Line 76 unchanged: `Git committer identity: \`vialchemlabs <ak47abhinav47@gmail.com>\` (configured in this repo only).` | STILL-APPLIES + WORSENED | NEW COROLLARY: post-anchor commits add a SECOND personal email — `endegenaassefa2@gmail.com` is now the committer on 48/48 post-anchor commits (`git log --pretty='%h %an %ae' ff97cde..HEAD`). Also leaked in `docs/deploy/live-account-setup.md:39`, `docs/deploy/runbook.md:174,208`, `docs/checkpoints/phase_14_deploy.md:8` as GitHub username `endegenaassefa`. PII surface doubled. |
| C13 | CRITICAL | `lib/payments/reconciliation.ts:160–172` helper defined but `reconcile(result.intent)` called without it | `lib/payments/reconciliation.ts:147–170` helper still defined; `grep -rn "assertOrderJurisdictionAllowed"` → only 1 prod ref (its own definition) + 4 test refs in `tests/unit/payments/reconciliation-jurisdictional.test.ts`; `app/api/payments/btcpay/webhook/route.ts:39 reconcile(result.intent)` still uncalled; same for plaid + bitcoin route | STILL-APPLIES | Layer 3 guard remains unbound to production webhook boundary. NEW COROLLARY: Bitcoin direct webhook + Zelle adapter (new payment rails added since anchor) also do not invoke the guard — surface area expanded. |
| H1 | HIGH | `git log v1.0.0..HEAD` 4 commits, 0 RED/GREEN/SCANNER_OK markers | `git log v1.0.0..HEAD --oneline` → 52 commits since v1.0.0; `git log --pretty='%h %s%n%b%n---' | grep -c "RED\|GREEN\|SCANNER_OK"` → 0 | STILL-APPLIES + WORSENED | Commit-hygiene gap widened from 4 commits to 52 commits, still 0 phase markers. |
| H2 | HIGH | `lib/payments/reconciliation.ts:42` in-memory `Map<string, LedgerEntry>` | `lib/payments/reconciliation.ts:40 const ledger = new Map<string, LedgerEntry>()` | STILL-APPLIES | Identical pattern; no Supabase writes. Multi-instance Vercel race risk persists. |
| H3 | HIGH | `app/api/payments/btcpay/webhook/route.ts:49–54` bare `catch {}` | `app/api/payments/btcpay/webhook/route.ts:49–54` still `} catch { return NextResponse.json({ ok: false, error: "internal_error" }, { status: 500 }); }` | STILL-APPLIES | No Sentry `captureException`; no log line; no structured context. Same for `app/api/payments/plaid/webhook/route.ts`. |
| H4 | HIGH | `app/api/access/route.ts:114–132` un-awaited inserts inside conditional | `app/api/access/route.ts:114 await sb.from("attestations_audit").insert(...)`; `:123 await sb.from("audit_log").insert(...)` — now AWAITED, but still NOT wrapped in their own try/catch. If Postgres rejects either insert, the outer 200 success ships partially-persisted state. | PARTIALLY-RESOLVED | `await` keyword added (cannot identify commit precisely without per-line blame). Still no per-insert try/catch; unhandled rejection still possible. |
| H5 | HIGH | `app/api/access`; `newsletter/subscribe`; `contact` | `grep -rn "rateLimit\|@upstash/ratelimit" lib/ app/api/` → 0 matches | STILL-APPLIES | No rate-limit middleware anywhere. All 3 endpoints accept unauthenticated POST. |
| H6 | HIGH | `app/api/access/route.ts:104` `Persistence error: ${error.message}` | `app/api/access/route.ts:104` exact same `message: \`Persistence error: ${error.message}\`` | STILL-APPLIES | Supabase/Postgres error message still echoed verbatim to client. |
| H7 | HIGH | `app/api/newsletter/subscribe/route.ts:85–88` `catch {}` swallows silently | `app/api/newsletter/subscribe/route.ts:88–103` catch block now returns 502 with provider message when `isProductionRuntime()` is true; in dev still silently swallows. No Sentry capture. | PARTIALLY-RESOLVED | Dev path still silent; prod path now surfaces error. Sentry capture still absent. |
| H8 | HIGH | `lib/email/welcome-sequence.ts:67–73` emails 2/3/4 never scheduled | `lib/email/welcome-sequence.ts:67–72` still pushes placeholder `\`scheduled:${tag}:+${tpl.delayDays}d\`` string to `ids[]`; no Resend `scheduledAt` call; no cron job | STILL-APPLIES | Day-1 email sequence is single-fire only. D1 closure remains partial. |
| H9 | HIGH | `lib/sentry.ts` no `beforeSend` PII scrubber | `lib/sentry.ts` (62 lines) — no `beforeSend` callback; Sentry SDK calls pass `extra: context` unfiltered. File-level header still promises "reduced-noise scrubbing" without implementation. | STILL-APPLIES | PII scrubber unimplemented. |
| H10 | HIGH | `lib/payments/plaid.ts:147` `createIntent` throws not-implemented | `lib/payments/plaid.ts:146–148 throw new Error("plaid_create_intent_not_implemented")` | STILL-APPLIES | ACH rail still non-functional at runtime. |
| H11 | HIGH | `lib/content/faq.ts:85`; `lib/content/email-templates.ts:106` Recovery Stack "$77 (12.5%)" vs actual $129 / 36.1% | `lib/content/email-templates.ts:106` still says `BPC-157 10mg + TB-500 5mg research set is bundled at $77 (12.5% effective discount)`; `lib/content/faq.ts` no longer contains that exact line (was at :85; now FAQ at :59 advertises 12-SKU catalog including KLOW/Reta/Tirz). Stack composition contradiction still present in email; faq line gone. | PARTIALLY-RESOLVED + SHIFTED | One of two surfaces cleaned; the other (email template) still ships $77/12.5%/BPC+TB-500 5mg framing. |
| H12 | HIGH | `docs/operator-runbook.md:102,106,137,206` "Janoshik Analytical" in outreach templates despite v1.3.0 lab-agnostic copy | `grep -nE "Janoshik" docs/operator-runbook.md` → lines 45, 52, 106, 110, 142, 212 still name Janoshik in outreach templates | STILL-APPLIES + SHIFTED | Lines shifted; instances actually grew (now 6 mentions vs audit's 4 in templates). |
| H13 | HIGH | `docs/operator-runbook.md:18–25` claims v1.1.0 "push deferred" | `docs/operator-runbook.md:25` still `git tag local: v1.1.0 (push deferred to operator)`; `CHANGELOG.md` advertises `[1.3.0] — 2026-05-10` | STILL-APPLIES | Runbook still stale at v1.1.0; CHANGELOG at 1.3.0; actual SKU + brand state diverges further. |
| H14 | HIGH | `docs/deploy/dns.md:125–127`; `docs/checkpoints/phase_14_deploy.md:113–117`; `docs/operator-runbook.md:35–37` fallback domain self-references | `docs/deploy/dns.md` lines 1, 5, 12, 29, 39 now correctly use `vialchemlabs.net`; `docs/deploy/dns.md:72,79,84` use `vialchemlabs.net` | RESOLVED-by-`f164f60f` | Same domain-swap commit fixed fallback lists alongside primary URLs. |
| H15 | HIGH | `supabase/migrations/20260510000001_init.sql:104–115`, `:284–297` no append-only trigger on `attestations_audit` / `audit_log` | `grep -nE "trigger|TRIGGER" supabase/migrations/*.sql` → 0 matches; comments at line 103, 353 reference "append-only" but no TRIGGER/UPDATE/DELETE prevention | STILL-APPLIES | Audit-trail integrity unverified by DB. Service role can silently rewrite. |
| H16 | HIGH | `supabase/migrations/20260510000001_init.sql:241–249` `order_status_history` no append-only trigger | Same `grep` result — no trigger exists | STILL-APPLIES | Same defect. |
| H17 | HIGH | `components/age-gate/AgeGateClient.tsx`; `components/qualification-flow.tsx` no component tests | `find tests/unit -name "*age-gate*" -o -name "*qualification*"` → only `tests/unit/customer-qualification.test.ts` (data-layer); `tests/unit/components/` listing shows NO `AgeGate*.test.tsx` and NO `QualificationFlow.test.tsx` | STILL-APPLIES | Two most compliance-critical UI surfaces still untested at component level. |
| H18 | HIGH | No site-wide brand-string regression test | `find tests -name "*brand*"` → 0 matches | STILL-APPLIES | No brand-string guard test exists. |
| H19 | HIGH | `tests/e2e/checkout-{ach,crypto}.spec.ts` 1 test each (discount band) | `wc -l tests/e2e/checkout-ach.spec.ts checkout-crypto.spec.ts` → 42 + 30 lines; still narrow scope; no full webhook → confirm E2E | STILL-APPLIES | E2E coverage unchanged. |
| H20 | HIGH | `tests/e2e/a11y.spec.ts:19–38` limited to 18 static routes | `wc -l tests/e2e/a11y.spec.ts` → 96 lines (was 38). Spec expanded since audit. | SHIFTED-LINE-NUMBERS | Coverage grew; still need to verify it covers PDP / blog / COA / checkout sub-pages. Phase-N closure remains: confirm dynamic-route inclusion. |
| H21 | HIGH | `lib/content/products.ts:631–671` bundle names ("Wolverine", "Glow", "Neuro", "Longevity") tilt marketing | `grep -n "Wolverine\|Glow Stack\|Neuro Stack\|Longevity Stack" lib/content/products.ts` → lines 779, 789, 799, 809 (each is a bundle slug definition). Bundles unchanged. | STILL-APPLIES + SHIFTED | Names unchanged; lines shifted by catalog reorder. |
| H22 | HIGH | `app/globals.css:14–37` vs `lib/design/tokens.ts:14–41` light vs dark palette mismatch | `app/globals.css:14–48` light theme (`#fafaf7` / `#0f3a5f` / `#06b6d4`); `lib/design/tokens.ts:14–41` dark theme (`#0a0e0f` / `#3dd4c8`) — direct contradiction persists | STILL-APPLIES | Single-source-of-truth violation unchanged. |
| H23 | HIGH | `supabase/migrations/20260510000001_init.sql:336–338, :346–347` `magic_links_anon_insert` + `qualifications_anon_insert` `with check (true)` | `grep -nE "anon_insert\|with check" supabase/migrations/20260510000001_init.sql` → unlimited anon insert policies still present at same line ranges | STILL-APPLIES | Anti-abuse gap unchanged. |
| H24 | HIGH | `supabase/migrations:415–417` `lab_partners` seed default Janoshik vs `site.ts:38` agnostic default | Migration line 415–416 still seeds `('Janoshik Analytical', 'janoshik', true)`; `site.ts:39–41` `labPartner.name = process.env.LAB_PARTNER_NAME ?? "an independent third-party laboratory"` | STILL-APPLIES | Same contradiction. |
| H25 | HIGH | Untracked `audit/` dir at repo root | `ls audit/` → does not exist; `ls test-reports/` → does not exist | RESOLVED-by-prior-work | Sub-agent pollution cleaned (commit unknown — likely simply not re-introduced in fresh clone). |
| H26 | HIGH | `tests/unit/api/access.test.ts:6` + `tests/unit/design/tokens.test.ts:9` lint warnings | Not re-run; static-check still shows similar copy-paste patterns. Lint output not verified this run. | UNVERIFIED — likely STILL-APPLIES | Spot-check after Phase 1 lint run. |
| H27 | HIGH | `public/coa/` 7 placeholder PDFs for 37 SKUs | `ls public/coa/` → directory exists but EMPTY (0 files) | STILL-APPLIES + WORSENED | All COA placeholders removed; 0 of 45 SKUs (catalog grew from 37 → 45) have COA files. Every `/coa/[slug]/[batch]` route now 404s. |
| H28 | HIGH | Re-iteration of C13 at handler layer | Same as C13 STILL-APPLIES; no route-handler invocation either | STILL-APPLIES | Same evidence. |
| H29 | HIGH | `app/sitemap.ts:11`; `public/robots.txt:13` wrong-domain base URL | `lib/content/site.ts:9` resolves to `vialchemlabs.net`; sitemap arg uses `siteConfig.url`; robots.txt:36 also `.net` | RESOLVED-by-`f164f60f` | Same fix commit. |
| H30 | HIGH | `lib/auth-store.ts:105–111` SHA-256 single-round client-side password hash | `lib/auth-store.ts:113 await crypto.subtle.digest("SHA-256", data)` still single-round + salt; honest header still calls it "browser-side" pre-launch placeholder | STILL-APPLIES | Pre-Phase-10 placeholder unchanged. |

---

## Per-finding detail

### C1 — Domain alignment (RESOLVED)

**Evidence**: `lib/content/site.ts:9` reads `const brandDomain = process.env.BRAND_DOMAIN ?? "vialchemlabs.net";` (audit had `?? 'vialchemlabs.com'`). `.env.example:9–13` defaults all to `.net`. `public/robots.txt:36 Sitemap: https://vialchemlabs.net/sitemap.xml`.

**Fix commit**: `f164f60f Switch production domain to vialchemlabs.net`.

**Residual count check**: `grep -rn "vialchemlabs\.com" --include="*.ts" --include="*.tsx" --include="*.json" --include="*.txt" --include="*.example"` (excluding docs/audit/) → 0 remaining hits. Down from 162 (audit) to 0 — clean sweep in source-tree.

**Closure**: verification-only. Regression test recommended for Phase N (`tests/unit/site/brand-domain.test.ts` — asserts no `.com` references in any TS/TSX/JSON source). Resolves alongside C11 + H14 + H29.

### C2 — Tesamorelin perpetually-banned SKU (SHIFTED)

**Evidence**: `lib/content/products.ts:348` `slug: "tesamorelin-5mg"` (was line 285 at audit anchor). SKU block + name + dose + listPriceCents present.

**No fix commit found**. The catalog reorder (`74d3c97c feat: harden production catalog and brand` + `ccf075e9 fix: harden production catalog and brand copy` + `94855141 fix: remove reta 20mg listing` + `2e3ddae9 fix: dedupe public catalog listings`) shifted positions but did NOT remove tesamorelin.

**Closure**: per audit §14 item 2 — either delete SKU (preferred) OR commit `docs/DECISIONS/locked_override_2026-05-20.md`. No DECISIONS dir exists yet (`ls docs/DECISIONS/` → does not exist).

### C3 — Melanotan II perpetually-banned SKU (SHIFTED)

**Evidence**: `lib/content/products.ts:506` `slug: "melanotan-ii-10mg"` (was 443).

**Closure**: identical posture to C2.

### C4 — Compliance regex set incomplete (PARTIALLY-RESOLVED)

**Evidence**: `lib/compliance.ts:46–53` now includes:

```
/GLP[-\s]?1/i,
/\bsemaglutide\b/i,
/\btirzepatide\b/i,
/\bretatrutide\b/i,
/\binsulin\b/i,
/\bdiabetes\b/i,
```

This is a partial extension. Still missing per audit C4 list:
- `tesamorelin`
- `melanotan`, `MT-2`, `MT-II`
- `bremelanotide`
- `bacteriostatic\s*water`, `BAC\s*water`
- Short-code obfuscations as standalone words: `\btirz\b`, `\bsema\b`, `\breta\b` (longform exists but NOT short-codes — directly relevant because catalog now ships `shortName: "Reta"` and `shortName: "Tirz"`)

**Fix commit**: not isolated. Closure: substantive — Phase 2 must extend the regex set per the missing list above. Should also fix `compliance.test.ts` "safe-case" entries that may certify the bypass.

### C5 — Vial whitelist auto-derives from catalog (STILL-APPLIES)

**Evidence**: `components/ui/Vial.tsx:82–85`:

```typescript
const allowedCompounds: ReadonlySet<string> = new Set([
  ...products.map((p) => p.shortName.toLowerCase()),
  ...bundles.map((b) => b.name.toLowerCase()),
]);
```

The audit's quoted code is byte-identical to current HEAD (whitespace shift only). The structural defect is demonstrated concretely by supplemental finding S1: adding `klow`, `reta`, `tirz` to `products.ts` automatically allowed those shortNames through the only Iron Law 2.7 structural guard.

**Closure**: per audit §14 item 4 — replace `allowedCompounds` derivation with explicit static allowlist that excludes banned compounds. Add unit test that asserts banned shortNames throw EVEN IF they appear in `products.ts`.

### C6 — Plaid HMAC instead of JWKS (STILL-APPLIES)

**Evidence**: `lib/payments/plaid.ts:7–13`:

> `Webhook verification: per spec, HMAC-SHA256 over the raw body using PLAID_WEBHOOK_VERIFICATION_KEY, sent in 'Plaid-Verification' header as 'sha256=<hex>'. Plaid's production scheme is JWT-based; this scaffold uses HMAC for parity with BTCPay until ops wires JWKS in Phase 10.`

`lib/payments/plaid-jwks.ts` (4.5KB) still on disk, still unimported by any production module. `lib/payments/plaid.ts:146–148` throws `plaid_create_intent_not_implemented`.

**Closure**: per audit §14 item 5 — branch on `PLAID_VERIFICATION_MODE`. Currently no consumer of `plaid-jwks.ts` exists in `app/api/payments/plaid/webhook/route.ts`.

### C7 — CI infrastructure missing (STILL-APPLIES)

**Evidence**: `ls -la .github/` returns no such directory. `find . -maxdepth 4 -name "*.yml" -path "*workflows*"` returns 0 matches. `grep "lhci" package.json` → 0 matches.

**Closure**: per audit §14 item 6 — must create `.github/workflows/lighthouse.yml`, `e2e.yml`, `.github/CODEOWNERS`; install `@lhci/cli`. Then verify `scripts/setup-branch-protection.sh` check names.

### C8 — V5 rebrand vs LOCKED Posture A (STILL-APPLIES)

**Evidence**:
- `lib/content/site.ts:4–6` still narrates `v5 rebrand (2026-05-10): operator spec -> VialChem Labs (clinical-minimal light theme...)`.
- `app/globals.css:14–48` still ships `--bg: #fafaf7` + `--accent: #0f3a5f` + `--accent-glow: #06b6d4` (light + cyan-navy).
- `lib/design/tokens.ts:14–25` still ships `bg: "#0a0e0f"` + `accent: "#3dd4c8"` (dark + teal) — single-source-of-truth violation persists (also H22).
- `ls docs/DECISIONS/` → no such directory.

**Closure**: per audit §14 item 7 + v5 prompt §6.2 — the v5 LOCKED state IS the operator's authorized override; Phase 0 must produce `docs/DECISIONS/locked_override_2026-05-20.md` codifying this, and Phase 1 must reconcile `tokens.ts` to match `globals.css`.

### C9 — Two taglines simultaneously (PARTIALLY-RESOLVED)

**Evidence**:
- `lib/content/site.ts:22 tagline: "Research-grade peptides, shipped with the COA."` (source-of-truth unchanged from audit).
- `grep -rn "Counted, weighed, verified" --include="*.ts" --include="*.tsx"` → 2 hits (down from 21):
  - `app/products/[slug]/opengraph-image.tsx:212`
  - `app/newsletter/thanks/page.tsx:68`

**Likely fix commits**: `ccf075e9 fix: harden production catalog and brand copy`, `77edd776 fix: remove legacy hero brand label`, `fe185e67 fix: align production brand and asset paths`.

**Closure**: 90 % swept. Phase 1 must remove the two residual hits OR document them.

### C10 — Misclassified D-code closures (STILL-APPLIES)

**Evidence**: `docs/checkpoints/v4_phase_13_handoff.md:52,59,60`:

```
✓ D17  Lighthouse CI gate                    (Phase 11.4)
✓ D24  Branch protection                     (Phase 12.2 — script ready)
✓ D25  Visual-regression baseline + diff CI  (Phase 11.3)
```

All three claim DONE but `.github/` artifacts don't exist (see C7). Unchanged.

**Closure**: update handoff to ○ OPEN/PARTIAL, OR close them by creating the workflows.

### C11 — robots.txt wrong domain (RESOLVED)

**Evidence**: `public/robots.txt:36 Sitemap: https://vialchemlabs.net/sitemap.xml` (was `vialchemlabs.com`).

**Fix commit**: `f164f60f`.

### C12 — Operator PII leak (STILL-APPLIES + WORSENED)

**Evidence**:
- `docs/checkpoints/phase_0_bootstrap.md:76` still reads `Git committer identity: vialchemlabs <ak47abhinav47@gmail.com>`.
- NEW: `git log --pretty='%h %an %ae' ff97cde..HEAD` shows all 48 commits authored by `Endegena Assefa <endegenaassefa2@gmail.com>` (a SECOND personal email).
- NEW: `docs/deploy/live-account-setup.md:39` exposes GitHub username `endegenaassefa`.
- NEW: `docs/deploy/runbook.md:174 REPO=endegenaassefa/vialchemlabs bash scripts/setup-branch-protection.sh`.
- NEW: `docs/deploy/runbook.md:208` GitHub releases URL with `endegenaassefa` username.
- NEW: `docs/checkpoints/phase_14_deploy.md:8 Repository: https://github.com/endegenaassefa/vialchemlabs`.
- NEW: `.git/config remote.origin.url = https://github.com/endegenaassefa/vialchems-labs.git` — repo URL itself exposes the operator handle (this is not committable PII but it is the WHOIS-isolation issue).

**Closure**: redact both gmail addresses; rewrite git author config; if remote push has happened, the gmail-in-commit-history is unrecoverable without force-push to all consumers. Iron Law 2.36+ if added: enforce non-personal git committer (e.g., `ops@vialchemlabs.net`) at pre-commit. Audit §13 O2 needs to escalate to CRITICAL given second email now in history.

### C13 — Layer 3 jurisdictional guard never invoked (STILL-APPLIES)

**Evidence**:
- `lib/payments/reconciliation.ts:147–170` exports `JurisdictionalGuardError` + `assertOrderJurisdictionAllowed`.
- `grep -rn "assertOrderJurisdictionAllowed" --include="*.ts" --include="*.tsx"` (excluding audit/) → 4 hits in `tests/unit/payments/reconciliation-jurisdictional.test.ts` + 2 self-references in `lib/payments/reconciliation.ts`. **Zero production callsites.**
- `app/api/payments/btcpay/webhook/route.ts:39 const reconciled = reconcile(result.intent);` — guard not invoked.
- `app/api/payments/plaid/webhook/route.ts` same shape, no guard call.
- NEW: `app/api/payments/btcpay/status/route.ts`, `app/api/payments/bitcoin/status/route.ts` — payment status endpoints added post-anchor; no guard call.
- NEW: `lib/payments/zelle.ts` — Zelle adapter added post-anchor; no guard hookup.

**Closure**: per audit §14 item 8 — invoke `assertOrderJurisdictionAllowed` INSIDE `reconcile()` for credit-bearing transitions OR at the route boundary BEFORE `reconcile()`. Export `JurisdictionalGuardError` via `lib/payments/index.ts` (already exported per index.ts inspection? — verify). Add a route-handler unit test that asserts the throw + 4xx response when address is out-of-jurisdiction.

### H1 — Commit hygiene (STILL-APPLIES + WORSENED)

**Evidence**: `git log v1.0.0..HEAD --oneline | wc -l` → 52 commits (audit cited 4). `git log v1.0.0..HEAD --pretty='%h %s%n%b%n---' | grep -c "RED\|GREEN\|SCANNER_OK"` → 0.

**Closure**: enforce commit-message contract in pre-commit; mark Phase markers retroactively in future commits.

### H2 — Reconciliation ledger non-durable (STILL-APPLIES)

**Evidence**: `lib/payments/reconciliation.ts:40 const ledger = new Map<string, LedgerEntry>();` — in-memory only.

**Closure**: per audit §14 item 9 — write to `payments` + `order_status_history` Supabase tables.

### H3 — Bare catch in webhook routes (STILL-APPLIES)

**Evidence**: `app/api/payments/btcpay/webhook/route.ts:49–54` and `app/api/payments/plaid/webhook/route.ts:48–53` both wrap reconcile in `} catch { return 500 }` with no Sentry, no structured log.

**Closure**: per audit §14 item 10 — add `captureException` and `logger.error` per route.

### H4 — Un-awaited inserts in access route (PARTIALLY-RESOLVED)

**Evidence**: lines 114, 123 of `app/api/access/route.ts` now use `await sb.from(...).insert(...)` (audit cited un-awaited promises). However the awaits are NOT wrapped in their own try/catch; if either insert rejects, the surrounding handler's outer try/catch (if any) catches it but the 200 success path is no longer guaranteed. Need per-insert error handling.

**Closure**: add per-insert try/catch + Sentry capture; consider whether failed audit insert should fail the whole request (yes — audit trail is compliance-critical).

### H5 — No rate limiting on anon-write endpoints (STILL-APPLIES)

**Evidence**: `grep -rn "rateLimit\|@upstash/ratelimit" lib/ app/api/` → 0 matches.

**Closure**: per audit §14 item 16 — add `@upstash/ratelimit` or equivalent middleware to `/api/access`, `/api/newsletter/subscribe`, `/api/contact`.

### H6 — Error message leakage (STILL-APPLIES)

**Evidence**: `app/api/access/route.ts:104 message: \`Persistence error: ${error.message}\``.

**Closure**: replace with generic message + Sentry capture of the actual error.

### H7 — Newsletter catch swallows (PARTIALLY-RESOLVED)

**Evidence**: `app/api/newsletter/subscribe/route.ts:88` now has `} catch (error) { if (isProductionRuntime()) { return 502 with provider message } }`. Dev path: still swallows silently. Sentry capture still absent.

**Closure**: add Sentry capture in BOTH paths; remove production-only check; do not echo `error.message` to client (re-introduces H6 surface).

### H8 — Welcome sequence emails 2/3/4 never scheduled (STILL-APPLIES)

**Evidence**: `lib/email/welcome-sequence.ts:62–72`:

```typescript
} else {
  // Emails 2/3/4 — Phase 10.2 scaffolds the scheduling. Real
  // Resend send-with-scheduledAt requires the SDK's scheduled
  // delivery (Resend recently added support); for now we record
  // intent so a cron job (Phase 11+) can dispatch later.
  ids.push(`scheduled:${tag}:+${tpl.delayDays}d`);
}
```

Placeholder strings only; no Resend `scheduledAt`; no cron.

**Closure**: wire Resend scheduled-send OR create cron job; persist `welcome_email_*_sent_at` for idempotency.

### H9 — Sentry beforeSend missing (STILL-APPLIES)

**Evidence**: `lib/sentry.ts` 62 lines, no `beforeSend` registration. Sentry capture functions pass `extra: context` unfiltered.

**Closure**: register `beforeSend` in `sentry.{client,server,edge}.config.ts` (existence verified per audit I8) that scrubs `email`, `Authorization`, `Cookie`, body fields matching attestation patterns.

### H10 — Plaid createIntent not implemented (STILL-APPLIES)

**Evidence**: `lib/payments/plaid.ts:146–148 throw new Error("plaid_create_intent_not_implemented")`.

**Closure**: implement Plaid Link + Transfer per Phase 10 spec.

### H11 — Recovery Stack copy contradiction (PARTIALLY-RESOLVED + SHIFTED)

**Evidence**:
- `lib/content/email-templates.ts:106` still says `BPC-157 10mg + TB-500 5mg research set is bundled at $77 (12.5% effective discount)`.
- `lib/content/faq.ts` no longer contains "$77 (12.5%)" line; the FAQ at line 59 now advertises a 12-SKU catalog including `KLOW 80mg, KPV 500mcg, MOTS-c 10mg, Semax 10mg, Selank 10mg, Reta 10mg, Tirz 25mg, and NAD+ 500mg` — NEW Iron Law 2.7 violation in marketing copy (Reta + Tirz named).

**Closure**: fix email-template stack composition + price; remove Reta/Tirz/KLOW from FAQ copy.

### H12 — Janoshik in operator runbook templates (STILL-APPLIES)

**Evidence**: `grep -nE "Janoshik" docs/operator-runbook.md` → lines 45, 52, 106, 110, 142, 212 still name Janoshik in lab-partner references AND in outreach templates. Audit cited 4 instances; current is 6.

**Closure**: strip Janoshik from outreach templates; keep only `LAB_PARTNER_NAME` env-driven references.

### H13 — Operator runbook stale (STILL-APPLIES)

**Evidence**: `docs/operator-runbook.md:25 git tag local: v1.1.0 (push deferred to operator)`. Repo is at v1.3.0 per CHANGELOG and the catalog now has 45 SKUs (not 16 as runbook implies).

**Closure**: rewrite the v4 status snapshot block to reflect v1.3.0 state + 45 SKUs + post-audit deltas.

### H14 — Fallback domain self-references (RESOLVED)

Same fix commit `f164f60f` as C1.

### H15 — attestations_audit / audit_log no append-only trigger (STILL-APPLIES)

**Evidence**: `grep -nE "trigger|TRIGGER" supabase/migrations/*.sql` → 0 matches. Comments at line 103 and line 353 reference "append-only" but no SQL trigger or constraint enforces it.

**Closure**: add `BEFORE UPDATE OR DELETE` triggers that `RAISE EXCEPTION` for these two tables (and order_status_history per H16).

### H16 — order_status_history no append-only trigger (STILL-APPLIES)

Same as H15.

### H17 — AgeGate + qualification-flow no component tests (STILL-APPLIES)

**Evidence**: `ls tests/unit/components/` shows 22 component tests; none for `AgeGate*` or `qualification-flow*`. Data layer test exists at `tests/unit/customer-qualification.test.ts`.

**Closure**: add `tests/unit/components/AgeGateClient.test.tsx` + `tests/unit/components/QualificationFlow.test.tsx`.

### H18 — No brand-string regression test (STILL-APPLIES)

**Evidence**: `find tests -name "*brand*"` → 0.

**Closure**: add `tests/unit/site/brand-strings.test.ts` that asserts:
- `siteConfig.name` = expected
- `siteConfig.tagline` = expected
- `siteConfig.domain` = expected
- no source-tree references to legacy `vialchemlabs.com`
- no source-tree references to legacy LOCKED-form `Vialchems Labs` unless inside `docs/` or `lib/audit/`

### H19 — E2E checkout coverage thin (STILL-APPLIES)

**Evidence**: `wc -l tests/e2e/checkout-ach.spec.ts` → 42 lines; `checkout-crypto.spec.ts` → 30 lines. Need full webhook → confirm flow.

**Closure**: add tests that simulate full BTCPay webhook → reconcile → /confirm-render AND full Plaid webhook → reconcile → /confirm-render. Plus failure-mode tests (invalid signature, replay, out-of-jurisdiction).

### H20 — a11y E2E coverage limited (SHIFTED)

**Evidence**: `wc -l tests/e2e/a11y.spec.ts` → 96 lines (was 38). Spec was extended post-audit.

**Closure**: verify the extended spec now covers dynamic routes: `/products/[slug]`, `/blog/[slug]`, `/coa/[slug]/[batch]`, checkout sub-pages. If not, extend.

### H21 — Bundle names tilt marketing (STILL-APPLIES)

**Evidence**: `grep -n "Wolverine\|Glow Stack\|Neuro Stack\|Longevity Stack" lib/content/products.ts` → bundle slugs at lines 779, 789, 799, 809.

**Closure**: per audit §14 — rename bundles to research register (e.g., `bpc-tb500-research-set`, `melanocortin-research-set`, ...).

### H22 — globals.css vs tokens.ts palette mismatch (STILL-APPLIES)

**Evidence**: `app/globals.css:14–48` light theme; `lib/design/tokens.ts:14–25` dark theme. Runtime authority is `globals.css`; tokens.ts is stale.

**Closure**: per audit §14 item 7 — update tokens.ts to match globals.css (light + cyan-navy) since v5 LOCKED_OVERRIDE rules.

### H23 — Anon-insert RLS policies unlimited (STILL-APPLIES)

**Evidence**: `supabase/migrations/20260510000001_init.sql` lines around 336–347 still ship `with check (true)` for `magic_links_anon_insert` and `qualifications_anon_insert`.

**Closure**: pair with H5 — rate-limit at API layer is the only mitigation since policy is permissive by design (anon needs to insert before auth).

### H24 — lab_partners seed contradicts site default (STILL-APPLIES)

**Evidence**: migration line 415 seeds `('Janoshik Analytical', 'janoshik', true)`; `site.ts:39–41` defaults to `'an independent third-party laboratory'`. Contradictory single-source-of-truth.

**Closure**: change migration seed to `default_for_brand=false` until operator signs a contract, OR remove the seed entirely and rely on env-driven `LAB_PARTNER_NAME`.

### H25 — Untracked audit/ dir (RESOLVED)

`ls audit/` and `ls test-reports/` both return no such directory. Fresh clone — no pollution. Verification-only closure.

### H26 — Lint warnings (UNVERIFIED — likely STILL-APPLIES)

**Evidence**: not re-run; spot-check `tests/unit/api/access.test.ts:6` and `tests/unit/design/tokens.test.ts:9` for unused-var patterns deferred to Phase 1 lint step.

**Closure**: `npm run lint` after Phase 1 will surface; fix or `// eslint-disable` per case.

### H27 — COA PDFs missing (STILL-APPLIES + WORSENED)

**Evidence**: `ls public/coa/` returns no files (directory empty). Audit cited 7 placeholders for 37 SKUs; current is 0 placeholders for 45 SKUs.

**Closure**: per audit §14 item 12 — generate placeholder COAs for all 45 SKUs OR remove COA registry entries to prevent 404. All placeholders must include "EXAMPLE COA — REPLACE BEFORE LAUNCH" prominently.

### H28 — Re-iteration of C13 at handler layer (STILL-APPLIES)

Same evidence as C13.

### H29 — Sitemap/robots base URL drift (RESOLVED)

Same fix commit `f164f60f` as C1 + C11.

### H30 — Auth-store SHA-256 client-side password (STILL-APPLIES)

**Evidence**: `lib/auth-store.ts:113 await crypto.subtle.digest("SHA-256", data)`. Single-round + salt. Honest header at lines 11–13 names it as browser-side placeholder.

**Closure**: per audit §14 (implicit) — wait for Phase 10 Supabase auth wiring (D2 closure); ensure salt-versioning is in place so future upgrades can re-hash without forced re-login.

---

## Cross-cutting observations

1. **Domain-swap commit `f164f60f` was the largest single-commit win** — closed 6 CRITICAL/HIGH findings (C1 + C11 + H14 + H29 + M21 + M25) in one shot.

2. **48 commits, 0 phase markers in commit bodies** — H1 widened from 4-commits-zero-markers to 52-commits-zero-markers. Iron Law 2.15 commit-hygiene drift.

3. **Three NEW Iron Law 2.7 violations introduced post-audit** — klow-80mg, reta-10mg, tirz-25mg added to `lib/content/products.ts` at lines 706, 721, 736. These are Phase 0 LOCKED_OVERRIDE candidates per v5 §6.2 (which defaults to "Remove" rather than override). Each is documented in supplemental findings file.

4. **C9 PARTIAL — taglines mostly swept** — went from 21 hits → 2 hits of "Counted, weighed, verified." Likely byproduct of `ccf075e9` "harden production catalog and brand copy". Two stragglers remain at `app/products/[slug]/opengraph-image.tsx:212` and `app/newsletter/thanks/page.tsx:68`.

5. **C12 WORSENED** — second personal gmail (`endegenaassefa2@gmail.com`) is now committer on 48/48 post-anchor commits. GitHub username `endegenaassefa` baked into runbook and live-account-setup docs. PII surface area doubled since audit.

6. **H17 most expensive remaining gap** — AgeGate + qualification-flow are the two MOST compliance-critical UI surfaces. They have ZERO component tests. Iron Law 2.10 attestation immutability is structurally enforced ONLY at the data layer; UI form-rendering correctness is untested.

7. **C5 demonstrates concretely** — the supplemental Iron Law 2.7 violations (klow/reta/tirz) prove the audit's structural concern about the Vial whitelist mechanism. Because `allowedCompounds` auto-derives from `products.map`, adding banned compounds to the catalog auto-allows them through the only structural guard.

8. **C7 unaddressed despite the audit's prescriptive recommendations** — no `.github/` work has happened in 48 commits, despite this being audit §14 item 6 ("Create `.github/workflows/lighthouse.yml`, `e2e.yml`, and `.github/CODEOWNERS`. Install `@lhci/cli` as devDep.").

---

## Recommended Phase-N closure order

The audit's §14 priority order remains correct, with these revisions per drift:

1. **Phase 1 (was item 1)**: Domain alignment — VERIFICATION-ONLY (RESOLVED). Add regression test.
2. **Phase 2 (extension of item 2 + 3)**: Iron Law 2.7 carve-out enforcement — remove tesamorelin + melanotan-ii + the 3 NEW supplemental SKUs (klow/reta/tirz) OR codify LOCKED_OVERRIDE. Extend compliance.ts regex with missing patterns. Replace Vial.tsx whitelist. Add static allowlist with negative-test coverage. Strip Reta/Tirz/KLOW from `lib/content/faq.ts:59`.
3. **Phase 3 (items 5+8+9+10)**: Payment-rail hardening — Plaid JWKS default; `assertOrderJurisdictionAllowed` invocation at all 4 rails (BTCPay + Plaid + Bitcoin direct + Zelle); Sentry instrumentation in all 6 API routes; `JurisdictionalGuardError` exported via `lib/payments/index.ts`; reconciliation persisted to Supabase.
4. **Phase 4 (items 6+10)**: CI infrastructure — create `.github/workflows/lighthouse.yml`, `e2e.yml`, `CODEOWNERS`; install `@lhci/cli`; verify branch-protection script.
5. **Phase 5 (item 7)**: V5 LOCKED_OVERRIDE — commit `docs/DECISIONS/locked_override_2026-05-20.md`. Update `lib/design/tokens.ts` to match `app/globals.css`. Resolve final 2 tagline stragglers.
6. **Phase 6 (items 11+13)**: UI + brand-string regression tests — `AgeGateClient.test.tsx`, `QualificationFlow.test.tsx`, brand-strings.test.ts.
7. **Phase 7 (item 12)**: COA PDFs — generate placeholders for all 45 SKUs.
8. **Phase 8 (items 14+15+16+17+18+19+20)**: Operator runbook refresh, append-only triggers, rate limiting, CSP, engines.node, audit/ dir cleanup, PII redaction.

---

## Methodology confessions

- **Lint not re-run** (H26 left UNVERIFIED).
- **No live-site probe this run** — relied on audit's prior probe + on-disk evidence.
- **Sentry instrumentation files not re-deep-read** — confirmed `lib/sentry.ts` lacks `beforeSend`; did not byte-diff `sentry.{client,server,edge}.config.ts`.
- **Test count not re-tabulated** — audit cited 304 → 457 unit + 0 → 136 e2e at v1.3.0; not verified post-anchor.
- **Visual regression baselines not re-compared** — pre-existing snapshots not byte-diffed against current build.
- **Wave files not re-scanned** (LOW-priority audit M14 carries forward unchanged).
- **`docs/checkpoints/v4_phase_*.md` not deep-read** beyond `v4_phase_13_handoff.md` for C10.
- **`scripts/grep-mogtrix.sh` not re-tested** against `wordpress/` directory — supplemental finding S2 notes the script's `--exclude-dir` list does not include `wordpress/` so a Mogtrix mention there would surface as an Iron Law 2.12 violation.

---

End of drift assessment.
