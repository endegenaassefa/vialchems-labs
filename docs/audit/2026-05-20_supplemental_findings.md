# Audit Supplemental Findings — 2026-05-20

**Audit anchor:** `ff97cde73b57665336d35ee173b186120d531cef`
**Current HEAD:** `5ec8324a5624693b1f6f39f36f818a69a7361c44`
**Commits ahead:** 48 (`git log ff97cde..HEAD --oneline | wc -l` → 48)
**Working repo:** `/root/peptide-site-v5/`

This document captures NEW CRITICAL/HIGH/MEDIUM findings introduced by post-audit work between `ff97cde` and `5ec8324a`. The 43-finding drift assessment at `docs/audit/2026-05-20_drift_assessment.md` is the operative work list for re-validated audit findings; this file is its companion for issues that did not exist at the audit anchor.

---

## Severity legend

- **CRITICAL** — production safety / legal exposure / Iron Law 2.7 perpetual ban violations / customer-attestation surface drift.
- **HIGH** — known-failure-mode in a payment, identity, or compliance code path; observability gap; data-integrity gap.
- **MEDIUM** — quality / hygiene / drift surface that does not directly block ship.

---

## Findings summary

| ID | Severity | File:Line evidence | Iron Law | Recommended phase |
|---|---|---|---|---|
| S1 | CRITICAL | `lib/content/products.ts:706` (klow-80mg), `:721` (reta-10mg), `:736` (tirz-25mg) | 2.7 | Phase 2.1 |
| S2 | HIGH | `wordpress/` directory (12 files) | 2.12 | Phase 2.x or 4.x |
| S3 | HIGH | `lib/payments/zelle.ts`, `lib/payments/config.ts:6`, `app/checkout/zelle/page.tsx` | 2.9 / 2.20 | Phase 0.B (LOCKED_OVERRIDE) or Phase 3 (codify as 4th rail) |
| S4 | HIGH | `lib/payments/bitcoin-direct.ts:1` (new file), `app/api/payments/bitcoin/status/route.ts` | 2.30 | Phase 3.2 |
| S5 | HIGH | `lib/content/site.ts:16` `name: "VialChem Labs"` (proper case), vs v5 LOCKED `vialchemlabs` (lowercase) | 2.26 | Phase 0.B (LOCKED_OVERRIDE codification) |
| S6 | HIGH | `lib/content/faq.ts:59` advertises "Reta 10mg, Tirz 25mg" in customer-facing FAQ | 2.4 / 2.7 / 2.13 | Phase 2.1 |
| S7 | HIGH | `git log --pretty='%an %ae' ff97cde..HEAD` → 48 commits by `Endegena Assefa <endegenaassefa2@gmail.com>` | Appendix U.5 | Operator |
| S8 | HIGH | `components/v2/`, `app/v2-brand.css`, `app/verify/page.tsx`, `design-tokens.json` post-anchor v2 components | 2.21 / 2.26 | Phase 5 or 0.B |
| S9 | MEDIUM | `wordpress/vialchem-gateway-placeholders/vialchem-gateway-placeholders.php` — placeholder Link Money WC gateway | 2.9 / 2.20 | Phase 0.B |
| S10 | MEDIUM | `lib/payments/btcpay.ts` (11 KB, was ~8 KB), `lib/payments/bitcoin-direct.ts`, `lib/payments/btcpay-health.ts`, `lib/payments/bitcoin-status.ts` post-anchor BTCPay hardening | 2.5 / 2.30 | Phase 3.x verification |
| S11 | MEDIUM | `git log ff97cde..HEAD --pretty=%s | grep -E "^(fix|feat|chore|style)"` → 52 commits, 0 phase markers | 2.15 | Operator / commit-hygiene contract |
| S12 | MEDIUM | `docs/audit/2026-05-19_full_audit_report_v2.md` shipped in repo (audit doc itself committed) | 2.12 | Document acceptance |

Total: 1 CRITICAL · 7 HIGH · 4 MEDIUM.

---

## S1 — Iron Law 2.7 PERPETUAL ban violations: 3 NEW banned SKUs added since audit

**Severity:** CRITICAL.

**File:Line evidence:**

```
lib/content/products.ts:705-718  slug: "klow-80mg"      sku: "KLOW-80MG"  shortName: "KLOW"  dose: "80mg"  category: "metabolic"
lib/content/products.ts:720-733  slug: "reta-10mg"      sku: "RETA-10MG"  shortName: "Reta"  dose: "10mg"  category: "metabolic"
lib/content/products.ts:735-748  slug: "tirz-25mg"      sku: "TIRZ-25MG"  shortName: "Tirz"  dose: "25mg"  category: "metabolic"
```

`category: "metabolic"` + `shortName: "Reta"` / `"Tirz"` makes the GLP-1 lineage transparent. KLOW (Ketotifen + Levocarnitine + Ostarine + Wegovy/Semaglutide stack — operator vernacular) sits as a composite product whose name does not resolve to any single compound but is a known internet euphemism for a GLP-1 + SARM + antihistamine cocktail.

**Iron Law citation:** v3 SUPER_PROMPT §2.7 — verbatim:

> Tirzepatide: ITC General Exclusion Order 337-TA-1377 (May 2025). CBP blocks all infringing imports at border. Excluded perpetually.
> Semaglutide / Retatrutide: highest-enforcement-priority FDA targets. Excluded for first 90 days. Operator may override after Day 90 review of FDA enforcement signal.

v5 SUPER_PROMPT §1.3 LOCKED state line 172 says:

> Substance carve-out: tirzepatide/semaglutide/retatrutide/GLP-1/BAC water perpetually banned — same + tesamorelin + melanotan + bremelanotide + MT-2/MT-II + bacteriostatic water (extended per audit C4).

And v5 §2.7:

> No tirzepatide, no semaglutide, no retatrutide, no GLP-1 obfuscation. v5 EXTENDS via Iron Law 2.29 to add tesamorelin, melanotan, bremelanotide, MT-2/MT-II, bacteriostatic water. Per v3 §2.7.

The `shortName: "Reta"` is exactly the "GLP-1 obfuscation" the spec explicitly bans. The `shortName: "Tirz"` is named directly in the perpetual ban list.

**Demonstrates audit C5 concretely:** `components/ui/Vial.tsx:82–85` auto-derives `allowedCompounds` from `products.map(p => p.shortName.toLowerCase())`. When the operator added `shortName: "Reta"` and `"Tirz"` to `products.ts`, the Vial.tsx structural guard automatically blessed them. C5's predicted failure mode HAPPENED.

**Customer-facing exposure:** `lib/content/faq.ts:59` (also S6 below) advertises these in answer copy:

> "Current live records include ... KLOW 80mg, KPV 500mcg, MOTS-c 10mg, Semax 10mg, Selank 10mg, Reta 10mg, Tirz 25mg, and NAD+ 500mg."

So named in customer-facing marketing copy as part of a positioning statement, post-acquired commit `74d3c97c feat: harden production catalog and brand`.

**Recommended closure (Phase 2.1):**
- Remove the 3 SKU blocks from `lib/content/products.ts` (lines 705–748).
- Remove from `lib/content/product-descriptions.ts` if referenced.
- Remove the assets at `public/product-shots/klow-80mg.*`, `reta-10mg.*`, `tirz-25mg.*` if present.
- Remove from `lib/content/faq.ts:59` answer copy (see S6).
- Remove from any `lib/content/coa.ts` mapping.
- Extend `lib/compliance.ts` regex set to include `/\bklow\b/i`, `/\breta\b/i`, `/\btirz\b/i` so future re-introduction surfaces at runtime.
- Replace `components/ui/Vial.tsx:82–85` whitelist derivation with explicit static allowlist that EXCLUDES these compounds.
- Add unit test that asserts `Vial` throws when passed `compound="reta"` or `"tirz"` or `"klow"` even if they appear in `products.ts`.

**Alternative closure:** if operator wants to keep, commit `docs/DECISIONS/locked_override_2026-05-20.md` with explicit FDA enforcement risk acceptance + legal opinion attached + per-SKU justification. Per v5 §6.2 the default is "Remove" — codify "Remove" unless operator explicitly directs otherwise.

---

## S2 — WordPress + WooCommerce preview stack: Iron Law 2.12 scope review needed

**Severity:** HIGH.

**File:Line evidence:**

```
wordpress/local/compose.yml
wordpress/local/vialchem-local-checkout-preview/vialchem-local-checkout-preview.php
wordpress/vialchem-checkout-theme/footer.php
wordpress/vialchem-checkout-theme/header.php
wordpress/vialchem-checkout-theme/functions.php
wordpress/vialchem-checkout-theme/woocommerce/checkout/form-pay.php
wordpress/vialchem-checkout-theme/woocommerce/checkout/form-checkout.php
wordpress/vialchem-gateway-placeholders/vialchem-gateway-placeholders.php
(12 files total under wordpress/)
```

Introduced by commits `1961af46 chore: provision minimal WordPress + WooCommerce on shop subdomain`, `35968566 feat: custom child theme matching Next.js design system`, `99959a50 feat: configure Link Money and BTCPay gateways in WooCommerce`, `1f129ba2 feat: extract design tokens for subdomain theme matching`, `cd1deea9 feat: complete end-to-end handoff and success flow`, `4288f1ac fix: allow localhost checkout handoff preview`, `977f5e35 fix: add local Woo handoff preview mode`, `6e789f2f feat: add local WordPress WooCommerce preview stack`, `8dd5cb1c fix: match WordPress checkout preview styling`, `74a24f79 fix: align WordPress checkout header with main site`.

**Iron Law citation:** Iron Law 2.12 (per audit prompt + v5 carry-forward) — "No Mogtrix mentions in source-tree files." `scripts/grep-mogtrix.sh:29–36` excludes `node_modules`, `.next`, `.git`, `.vercel`, `dist`, `build`, `coverage`, `docs` but NOT `wordpress/`. If any PHP file in `wordpress/` contains the string "mogtrix" (case-insensitive), preflight will fail.

**Spot-check:** `grep -rn "mogtrix\|Mogtrix" wordpress/ --include="*.php" --include="*.css" --include="*.js"` → 0 matches. PASS for now.

**Additional concern (Iron Law 2.30 webhook handling):** `wordpress/vialchem-gateway-placeholders/vialchem-gateway-placeholders.php` registers a WooCommerce payment gateway called `vialchem_link_money` as a placeholder. Per v5 §2.30, webhook signature handling must be enforced for any rail. If this WP gateway ever processes real money, it MUST verify webhook signatures (Link Money's standard) — current implementation is `placeholder` per the plugin description and does not verify.

**Recommended closure (Phase 2.x or 4.x):**
- Add `wordpress/` to the `--exclude-dir` list in `scripts/grep-mogtrix.sh:29–36` AND `:63–64` (the script has two grep blocks). Alternatively, since WP is a non-production artefact and not deployed to vercel, add the exception under v5 Iron Law 2.12 exemption rules.
- Document the WP preview stack's scope in `docs/checkpoints/` so future audits know to treat it as preview-only (not production).
- If Link Money gateway WILL ship: implement webhook signature verification (HMAC or whatever Link Money mandates) BEFORE going live. Tag with `SCANNER_OK` annotation per Iron Law 2.5.
- Verify `wordpress/` is in `.gitignore` patterns OR is explicitly committed-and-blessed.

---

## S3 — Zelle as 4th payment rail: Iron Law 2.9 / 2.20 codification gap

**Severity:** HIGH.

**File:Line evidence:**

```
lib/payments/zelle.ts                          (3.6 KB, new file)
lib/payments/config.ts:6                       import { createZelleAdapter } from "./zelle";
lib/payments/config.ts:21                      zelle: createZelleAdapter()
lib/payments/config.ts:41                      const VALID_IDS: PaymentProviderId[] = ["stub", "btcpay", "plaid", "zelle"];
lib/payments/config.ts:51                      "payment_provider_required: PAYMENT_PROVIDER must be btcpay, plaid, or zelle in production."
app/checkout/zelle/page.tsx                    (Zelle checkout user surface)
app/api/payments/btcpay/status/route.ts        (new status endpoint)
app/api/payments/bitcoin/status/route.ts       (new status endpoint)
components/ZelleCopyButton.tsx
components/ZelleReceiptForm.tsx
lib/checkout/direct-payment.ts                 (Zelle env validation helpers)
```

Introduced by commits `f56d3abc feat: finish zelle checkout path`, `aa522373 feat: elevate zelle qr checkout`, `38958f63 feat: add official zelle qr asset`, `06726d64 fix: verify zelle receipts with qr links`, `0f69daf0 feat: split checkout routing for bitcoin and zelle`.

**Iron Law citation:**

- v3 §2.9 (per audit anchor): "Day-1 payment rails frozen at { stub, btcpay, plaid }. Operator may add cards via post-90-day-review per Iron Law 2.20."
- v5 §1.3 LOCKED state line 170: "Payment rails | stub + btcpay + plaid | same (Iron Law 2.9/2.20) | unchanged"

The codebase has ADDED zelle as a 4th rail without a documented LOCKED_OVERRIDE per Iron Law 2.26. Production code now accepts `PAYMENT_PROVIDER=zelle` as valid.

**Recommended closure (Phase 0.B):**
Option A — codify the addition. Commit `docs/DECISIONS/locked_override_2026-05-20.md` adding Zelle to the rail registry with rationale (likely operator's lower-friction manual-bank-app option for buyers). Update v5 LOCKED state to reflect `{ stub, btcpay, plaid, zelle }`.

Option B — revert. Remove `lib/payments/zelle.ts`, the Zelle UI surfaces, and the registry entry. Restore Day-1 frozen rail set.

Per v5 §6.2 default decisions, the operator has not been heard from on Zelle; the prompt-author's posture is that Zelle is a manual bank-app rail (Zelle is not a webhook-driven rail — it is buyer-attests, operator-verifies-bank, manual reconciliation). This makes Zelle structurally different from BTCPay/Plaid and the Iron Law 2.20 review pathway may need its own clause. Recommend Option A but with explicit documentation of manual-reconciliation posture.

**Additional concern (Iron Law 2.8 Layer 3):** Zelle adapter does NOT call `assertOrderJurisdictionAllowed`. Same C13 gap, expanded surface.

**Additional concern (Iron Law 2.30 webhook handling):** Zelle has no webhook from the bank; instead the user submits a receipt screenshot/text via `ZelleReceiptForm`. This is a TRUST boundary — buyer-attested. Must be reconciled manually before any credit-bearing transition. Verify `app/checkout/zelle/page.tsx` does not automatically credit on receipt submission.

---

## S4 — Direct Bitcoin fallback checkout: Iron Law 2.30 hardening posture

**Severity:** HIGH.

**File:Line evidence:**

```
lib/payments/bitcoin-direct.ts                 (6.9 KB, new file)
lib/payments/bitcoin-status.ts                 (1.9 KB, new file)
lib/payments/btcpay-health.ts                  (4.4 KB, new file)
app/api/payments/bitcoin/status/route.ts       (new endpoint)
```

Introduced by `a10d918f feat: add direct bitcoin fallback checkout`, `d7098594 feat: fail closed bitcoin checkout when btcpay unreachable`, `d9ec8cf4 feat: add reachable btcpay endpoint migration path`, `2ed72087 fix: harden btcpay bootstrap dns checks`, `b9c514be chore: add btcpay dns automation`, `f81adc8d fix: report btcpay verifier network failures`.

**Iron Law citation:** Iron Law 2.30 (per v5 §2.30) — webhook signature handling for all payment rails. Direct on-chain Bitcoin (no BTCPay layer) does not have a "webhook" in the BTCPay sense; instead it relies on chain-event observation (presumably via mempool/electrum/blockstream API). The "fail closed" posture per `d7098594` suggests the implementation correctly fails when BTCPay is unreachable, but the cryptographic verification path for direct on-chain transactions is not covered by Iron Law 2.30's webhook-signature model.

**Recommended closure (Phase 3.2):**
- Re-read `lib/payments/bitcoin-direct.ts` start-to-end. Verify:
  1. No client-side trust for payment confirmation (e.g., user-submitted txid that the server does not verify).
  2. Confirmation count threshold (≥3 blocks for first-time-buyer, ≥6 for high-value).
  3. UTXO verification against the operator's wallet address (not just chain inclusion).
  4. Idempotency (same txid arriving twice does not double-credit).
- Add unit + E2E tests for these properties.
- Document in CHANGELOG that direct-on-chain Bitcoin is a 5th rail (or 4th, alongside Zelle) and requires per-Iron-Law-2.20 review.

---

## S5 — Brand-name capitalization vs v5 LOCKED state

**Severity:** HIGH.

**File:Line evidence:**

```
lib/content/site.ts:16  name: "VialChem Labs"   (proper case, with space)
lib/content/site.ts:17  brandStem: "vialchemlabs"
lib/content/site.ts:21  description: "VialChem Labs ships research-grade peptides..."
lib/content/site.ts:26  llcName: process.env.NEXT_PUBLIC_LLC_NAME ?? "VialChem Labs LLC"
```

**Iron Law citation:** v5 SUPER_PROMPT §1.3 LOCKED state — the prompt asserts `vialchemlabs` (lowercase, no space). Live site URL is `vialchemlabs.net` (lowercase). The codebase ships `VialChem Labs` (CamelCase + space) — a third capitalization variant.

This is also the situation the audit C8 identified at the audit anchor (`name: 'vialchemlabs'` lowercase at that time). Post-anchor commit `148fb0e2 fix: correct VialChem brand spelling` deliberately switched FROM lowercase TO CamelCase — i.e., the operator chose CamelCase against the v5 LOCKED state.

**Recommended closure (Phase 0.B):**
Per Iron Law 2.26, the operator has authority to override LOCKED brand expression. The post-anchor "correct VialChem brand spelling" commit IS that override action. v5 §3.0 grants automation clearance for this exact case.

Codify in `docs/DECISIONS/locked_override_2026-05-20.md`:
- `name: "VialChem Labs"` (CamelCase, with space) — final operator decision
- `brandStem: "vialchemlabs"` (lowercase, used for domain, slug, env var values)
- `domain: "vialchemlabs.net"` (lowercase, .net TLD)
- `tagline: "Research-grade peptides, shipped with the COA."` (final, supersedes v3 LOCKED "Counted, weighed, verified.")

Then update v5 §1.3 LOCKED state line for future audits, OR explicitly note the LOCKED_OVERRIDE applies to this rebrand.

---

## S6 — Customer-facing FAQ names banned compounds (Reta + Tirz + KLOW)

**Severity:** HIGH.

**File:Line evidence:** `lib/content/faq.ts:59`:

> "VialChem Labs keeps a focused live catalog to maintain compliance simplicity, COA pipeline integrity, and operational reliability. Current live records include BPC-157 10mg, TB-500 10mg, GHK-Cu 50mg, CJC-1295 + Ipamorelin 5mg, **KLOW 80mg**, KPV 500mcg, MOTS-c 10mg, Semax 10mg, Selank 10mg, **Reta 10mg**, **Tirz 25mg**, and NAD+ 500mg. Non-live materials are handled by custom request."

**Iron Law citation:** Iron Law 2.4 (no human-consumption / therapeutic language), Iron Law 2.7 (perpetual ban — see S1 above), Iron Law 2.13 (no hedged-but-still-claiming language). Naming Reta and Tirz in customer-facing copy is the FDA-enforcement-prioritized obfuscation the rules ban perpetually.

**Recommended closure (Phase 2.1):**
- Remove the three banned-compound names from the answer.
- Strengthen `lib/compliance.ts` `unsafeMarketingPatterns` to add `/\breta\s+\d+\s*mg/i`, `/\btirz\s+\d+\s*mg/i`, `/\bklow\s+\d+\s*mg/i` so this exact phrasing fails the runtime gate.
- Add `assertMarketingCopySafe` call inside whatever surfaces faq.ts → user (consider `lib/content/faq.ts` itself running at import-time per `lib/compliance.ts:97`).

---

## S7 — Second operator personal email in commit author chain

**Severity:** HIGH.

**File:Line evidence:** `git log --pretty='%h %an %ae' ff97cde..HEAD | head -48` — all 48 commits show:

```
Endegena Assefa <endegenaassefa2@gmail.com>
```

Additional PII surface:
- `docs/deploy/live-account-setup.md:39` — GitHub username `endegenaassefa`.
- `docs/deploy/runbook.md:174,208` — GitHub username `endegenaassefa`.
- `docs/checkpoints/phase_14_deploy.md:8 Repository: https://github.com/endegenaassefa/vialchemlabs`.
- `.git/config remote.origin.url = https://github.com/endegenaassefa/vialchems-labs.git` (not committable but exposes operator handle).

The audit's C12 cited `ak47abhinav47@gmail.com` (still present at `docs/checkpoints/phase_0_bootstrap.md:76`); this finding adds a SECOND personal gmail to the public-history surface area.

**Iron Law citation:** Appendix U.5 (LLC-isolation posture). The audit C12 is now compounded — two operator-personal-identifiers in committed artefacts. Treat as PII / operational-security finding.

**Recommended closure (Operator):**
- Set git committer to non-personal address (`ops@vialchemlabs.net` or similar) for all future commits.
- Document the existing PII in `docs/DECISIONS/locked_override_2026-05-20.md` as "accepted-PII-leak-pre-launch" if the operator chooses to accept rather than force-push-rewrite history.
- If branch has not been pushed to remote: `git rebase` author rewrite + force-push.
- If branch has been pushed: rewrite is destructive across consumers — document acceptance.

---

## S8 — Post-anchor v2 design components (parallel design system)

**Severity:** HIGH.

**File:Line evidence:**

```
app/v2-brand.css                              (modified in commit 148fb0e2)
app/verify/page.tsx                           (modified in commit 148fb0e2)
components/v2/Home.tsx
components/v2/Shell.tsx
components/v2/Verify.tsx
design-tokens.json                            (modified in commit 148fb0e2, 81 lines vs 165 lines)
```

Introduced by commits `3d339b21 Migrate storefront to v2 design` + `1f129ba2 feat: extract design tokens for subdomain theme matching` + `148fb0e2 fix: correct VialChem brand spelling`.

**Iron Law citation:** Iron Law 2.21 (single source of truth) — the codebase now appears to have parallel design surfaces (`components/` + `components/v2/`), parallel CSS (`app/globals.css` + `app/v2-brand.css`), parallel tokens (`lib/design/tokens.ts` + `design-tokens.json`). This violates the single-source-of-truth contract Iron Law 2.21 enforces.

**Recommended closure (Phase 5 or 0.B):**
- Inventory: identify which design system is canonical (likely v2 per the `3d339b21 Migrate storefront to v2 design` commit message).
- Delete the non-canonical system (`lib/design/tokens.ts` likely; verify routing).
- Update `app/globals.css` if `app/v2-brand.css` supersedes.
- Document in CHANGELOG.

---

## S9 — Link Money WooCommerce gateway placeholder

**Severity:** MEDIUM.

**File:Line evidence:** `wordpress/vialchem-gateway-placeholders/vialchem-gateway-placeholders.php` lines 1–80 — registers `WC_Gateway_VialChem_Link_Money` extends `WC_Payment_Gateway`. Per the plugin description: "Placeholder Pay by Bank gateway. Replace with the official Link Money WooCommerce integration or supply merchant API credentials before enabling live checkout."

**Iron Law citation:** Iron Law 2.9 + 2.20 — Link Money is another non-frozen rail (5th, alongside the 4 in S3). The placeholder is gated by `enabled='no'` default but is in the codebase.

**Recommended closure (Phase 0.B):**
Same posture as S3 — codify or revert. If kept, document it as preview-only / non-production until merchant credentials are wired.

---

## S10 — BTCPay hardening expansion (size + supporting modules)

**Severity:** MEDIUM.

**File:Line evidence:**

```
lib/payments/btcpay.ts          (~11 KB, up from ~8 KB at audit anchor; +3KB additional logic)
lib/payments/btcpay-health.ts   (4.4 KB, new)
lib/payments/bitcoin-status.ts  (1.9 KB, new)
lib/payments/bitcoin-direct.ts  (6.9 KB, new, see S4)
```

Introduced by `723b1e2a feat: harden btcpay production readiness`, `74d3c97c feat: harden production catalog and brand`, `f81adc8d fix: report btcpay verifier network failures`, `d9ec8cf4 feat: add reachable btcpay endpoint migration path`, `2ed72087 fix: harden btcpay bootstrap dns checks`, `b9c514be chore: add btcpay dns automation`, `2f643e58 feat: gate checkout methods for btcpay launch`.

**Iron Law citation:** Iron Law 2.5 (idempotency + immutability) + Iron Law 2.30 (webhook signature). The post-audit BTCPay hardening is a positive signal but verification is needed.

**Recommended closure (Phase 3.x):**
- Re-read `lib/payments/btcpay.ts` + `btcpay-health.ts`. Verify:
  1. HMAC verification still uses `crypto.timingSafeEqual` (no string-equal bypass).
  2. Health-check endpoint does not bypass auth.
  3. DNS bootstrap automation does not leak credentials in logs.
- Add unit tests for new behaviors if missing.

---

## S11 — Commit-message phase-marker hygiene

**Severity:** MEDIUM.

**File:Line evidence:** `git log v1.0.0..HEAD --pretty='%h %s%n%b%n---' | grep -c "RED\|GREEN\|SCANNER_OK"` → 0. 52 commits since v1.0.0, 0 commits with phase markers.

**Iron Law citation:** Iron Law 2.15 (truth-in-marketing + commit-hygiene contract). Audit H1 cited 4 commits since v1.0.0 with 0 markers; this is now 52 commits with 0 markers.

**Recommended closure (Operator):**
- Enforce phase-marker pattern in `.husky/commit-msg` regex.
- Document the expected format in `docs/checkpoints/v4_phase_13_handoff.md` or similar.

---

## S12 — Audit doc itself committed to repo

**Severity:** MEDIUM.

**File:Line evidence:** `docs/audit/2026-05-19_full_audit_report_v1.md`, `docs/audit/2026-05-19_full_audit_report_v2.md` — both audit reports are in-repo. This is correct per v5 §3.1 audit-trail intent.

**Iron Law citation:** Iron Law 2.12 (Mogtrix-mentions ban) — the audit doc text contains "mogtrix" references in its prose (when describing the source pattern), and these will hit the preflight scanner unless `docs/` is in the exclusion list. Per `scripts/grep-mogtrix.sh:36`, `docs` IS in the exclude-dir list, so this is FINE.

**Spot-check:** `grep -c "mogtrix\|Mogtrix" docs/audit/2026-05-19_full_audit_report_v2.md` → 4 hits, all legitimate (citing the source-pattern attribution in `lib/compliance.ts`'s comment). Exempt per preflight script.

**Recommended closure:** acceptance. Document acceptance in same `docs/DECISIONS/` LOCKED_OVERRIDE so future audits do not re-flag.

---

## Cross-cutting observations

1. **Three independent payment rails added** since audit anchor: Zelle (S3), Bitcoin direct (S4), Link Money WC (S9). Iron Law 2.9 froze the Day-1 set at `{ stub, btcpay, plaid }`. The codebase has effectively 6 rails now if all are counted (`stub`, `btcpay`, `plaid`, `zelle`, `bitcoin-direct`, `link-money-wc`). Phase 0.B LOCKED_OVERRIDE must address all three at once.

2. **C5 audit prediction came true:** the structural defect in `Vial.tsx` whitelist (auto-derives from catalog) is what allowed klow/reta/tirz to ship through Iron Law 2.7's only structural guard. Phase 2 closure is now URGENT — it is not "a hypothetical issue" but "the actual mechanism by which the policy was bypassed."

3. **Brand drift between v5 LOCKED and ship state needs codification, not reconciliation:** the operator has shipped `VialChem Labs` (CamelCase + space) deliberately via `148fb0e2`. Iron Law 2.26 grants the operator override authority. The right closure is to commit the LOCKED_OVERRIDE doc, not to roll back the operator's brand choice.

4. **PII surface area DOUBLED:** two personal gmails now in committed history. Phase 0.B should treat this as a single CRITICAL closure (S7 + audit C12) and either rewrite-and-force-push or formally accept.

5. **The post-audit work pattern is "feat: feat: fix: fix: fix:"** — 52 commits in ~10 days, 0 RED/GREEN/SCANNER_OK markers. The commit messages describe intent ("harden BTCPay", "elevate Zelle QR checkout") but do not carry phase-test-state markers. Iron Law 2.15 hygiene drift is a process issue more than a code issue.

6. **No `docs/DECISIONS/` directory exists.** Six findings (C8, S1, S3, S5, S7, S8, S9) all want a LOCKED_OVERRIDE doc. Phase 0.B should create the dir AND populate the consolidated 2026-05-20 override.

---

End of supplemental findings.
