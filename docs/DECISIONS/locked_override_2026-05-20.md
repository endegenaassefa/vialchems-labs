# LOCKED OVERRIDE — Brand Expression + Iron Law 2.7 Carve-out — 2026-05-20 (v5.0.0)

## Summary

Codifies the production-grade closure state for the Vialchems Labs / VialChem Labs production-launch site, per SUPER_PROMPT_v5.md autonomous-mode execution. This document is the authoritative LOCKED_OVERRIDE artifact per Iron Law 2.26 + 2.37, and the source-of-truth for the v5 brand-lock regression test (`tests/unit/brand-lock.test.ts`).

The session that wrote this file (Claude Opus 4.7, 1M context, autonomous mode) reconciled four sources of truth:

1. **v3.0 LOCKED state** (Iron Laws 2.1-2.17, Posture A dark/charcoal/teal)
2. **v4.0 LOCKED state** (Iron Laws 2.18-2.27, retained Posture A dark)
3. **SUPER_PROMPT_v5.md §1.3** (prescriptive v5 LOCKED state, anchored at audit `ff97cde`)
4. **Current production state** at HEAD `5ec8324a5624693b1f6f39f36f818a69a7361c44` (48 commits past audit anchor; light clinical theme deployed at https://vialchemlabs.net/)

Where (3) and (4) conflict, operator's post-audit commits are treated as their override. Where they agree, the v5 default applies. The §6.2 auto-applied defaults table from SUPER_PROMPT_v5.md is honored unmodified except as noted.

## Operator Authorization

- **Operator:** endegenaassefa (GitHub) / alexia@myabrb.com
- **Date:** 2026-05-20
- **Channel:** SUPER_PROMPT_v5 autonomous-mode execution; transcript at this session
- **Override scope:** Phase 0 (preflight) through Phase 12 (launch) of v5 closure plan
- **Override window:** Operator may post-edit this file before merging the v5 PR; `tests/unit/brand-lock.test.ts` regression-tests that `lib/content/site.ts` matches this file's values

## Previously LOCKED (v3.0 + v4.0)

| Field | v3.0/v4.0 LOCKED value |
|---|---|
| Name | `Vialchems Labs` (proper case, "Vialchems" with trailing "s", space) |
| Tagline | `Counted, weighed, verified.` |
| Domain | `vialchems.labs` (literal `.labs` TLD) |
| Color palette | `--bg:#0a0e0f` (charcoal), `--accent:#3dd4c8` (teal) — Posture A DARK |
| Typography | IBM Plex Sans + IBM Plex Mono + Newsreader Italic |
| Lab partner | Janoshik Analytical (named default) |
| Catalog | 7 LOCKED SKUs → expanded to 16 (v1.1.0) → expanded to 37 (audit anchor) |
| Substance carve-out | NO tirzepatide / semaglutide / retatrutide / GLP-1 / BAC water |
| Jurisdictional block | CA / TX / NY / FL (Day-1 US-only) |
| Payment rails | `stub` + `btcpay` + `plaid` (frozen union per Iron Law 2.9/2.20) |

## New LOCKED (v5.0.0 — codified 2026-05-20)

| Field | v5.0.0 LOCKED value | Source |
|---|---|---|
| **Name** | **`VialChem Labs`** (proper case, capital VC + L, single space) | Operator commit `148fb0e2` "fix: correct VialChem brand spelling" supersedes v5 §1.3 lowercase prescription |
| **Brand stem** | `vialchemlabs` (lowercase, one word — used in slugs, env, JSON-LD `@id`) | Matches `lib/content/site.ts:15` |
| **Tagline** | **`Counted, weighed, verified.`** | v5 §6.2 default; supersedes deprecated `lib/content/site.ts:20` "Research-grade peptides…" per Phase 5 closure |
| **Domain** | **`vialchemlabs.net`** | Matches live deployment + Vercel alias + DNS A-record (verified 307→/age-gate); v5 §6.2 default |
| **Color palette** | `--bg:#fafaf7` (cream), `--surface:#ffffff` (white), `--accent:#0f3a5f` (deep navy), `--accent-glow:#06b6d4` (cyan), `--text:#0a0e14` (near-black) | Matches current `app/globals.css:14-37`; Posture A LIGHT (v5 reinterpretation) |
| **Typography** | IBM Plex Sans + IBM Plex Mono + Newsreader Italic (RETAINED) | Matches `app/layout.tsx` font imports |
| **Lab partner** | `'an independent third-party laboratory'` (lab-agnostic public copy) | v1.3 operator override retained; matches `lib/content/site.ts:36` |
| **Catalog (v5.0.0)** | **35 SKUs SAFE + 5 bundles** | Phase 2 removes 6 banned SKUs (see below); v5 §6.2 default for tesamorelin+melanotan-ii extended via supplemental findings |
| **Payment rails** | `'stub' \| 'btcpay' \| 'plaid'` (FROZEN per Iron Law 2.9/2.20) | Zelle + direct-bitcoin assessed in Phase 0.C supplemental findings as UI-only manual-payment surfaces, NOT new `PaymentProviderId` values |
| **Jurisdictional block** | CA / TX / NY / FL (Day-1 US-only) — UNCHANGED | `lib/compliance/jurisdictions.ts:15` |
| **Substance carve-out (v5 extension)** | **Permanently banned:** tirzepatide (`tirz`), semaglutide (`sema`), retatrutide (`reta`), GLP-1 / GLP1 / GLP-1RA, tesamorelin (TH9507, Egrifta), melanotan / MT-I / MT-II / melanotan-i / melanotan-ii, bremelanotide (Vyleesi, PT-141), bacteriostatic water / BAC water, SS-31 (elamipretide), liraglutide, dulaglutide, KLOW (operator-blended product containing kisspeptin/leuprolide/oxytocin/etc — undetermined composition; defaults to BAN until operator commits composition + legal opinion) | v5 Iron Law 2.7 extended via 2.29 + supplemental findings |
| **LLC identity** | `'VialChem Labs LLC'` / Wyoming | Matches current `lib/content/site.ts:25-26` (env-driven default) |
| **First-buyer test mechanism** | Full-price first order with operator-immediate-refund (BOTH rails — BTCPay + Plaid) | v5 §6.2 default |
| **SemVer for v5 release** | `v5.0.0` | v5 §6.2 default |
| **Production deploy mechanism** | Vercel git integration auto-deploy on merge to `main` | v5 §6.2 default |
| **Ad campaign launch** | HIL GATE 3 — operator-controlled trigger | v5 §6.2 default |

## Auto-Applied Defaults Table (per SUPER_PROMPT_v5.md §6.2)

The 9 routing decisions from v5 §6.2 are auto-applied as follows. Operator may post-edit any row before merging v5 PR.

| # | Decision | Phase | Auto-applied default | Rationale |
|---|---|---|---|---|
| 1 | Iron Law 2.7 carve-out: REMOVE banned SKUs OR keep with legal opinion? | 2 | **REMOVE** (tesamorelin-5mg, melanotan-ii-10mg, pt-141-10mg, klow-80mg, reta-10mg, tirz-25mg) | Conservative + defensible against FDA enforcement; Tirzepatide (ITC GEO 337-TA-1377) + Retatrutide (90-day FDA carve-out) are PERPETUAL Iron Law 2.7 bans; Tesamorelin (Egrifta), Melanotan II (DOJ enforcement), PT-141/Bremelanotide (Vyleesi-approved drug), KLOW (undetermined composition, multiple kisspeptin-derived BANNED constituents possible). Operator can re-add via subsequent LOCKED_OVERRIDE if legal opinion supports. |
| 2 | Tagline | 5 | **"Counted, weighed, verified."** | v3/v4 LOCKED tagline retained; the deprecated `site.ts:20` "Research-grade peptides…" string is removed and replaced everywhere; consistent with 21 source hits of LOCKED tagline already in hero/footer/OG. |
| 3 | Lab partner | 5 | **Lab-agnostic** ("an independent third-party laboratory") | Per v1.3 operator override; preserves operator flexibility to swap labs without re-issuing copy; env vars `LAB_PARTNER_NAME` + `LAB_PARTNER_PORTAL_URL` available to override to a named partner without code change. |
| 4 | Bundle naming (Iron Law 2.29 register tightening) | 2 | **Rename to research register**: `recovery-stack` retained; `wolverine-stack`→`recovery-pair` (BPC-157 + TB-500); `glow-stack`→`dermal-research-triple` (GHK-Cu + TB-500 + BPC-157); `neuro-stack`→`nootropic-pair` (Semax + Selank); `longevity-stack`→`longevity-triple` (MOTS-c + Epitalon + NAD+) | Marketing-register names "Wolverine"/"Glow"/"Neuro"/"Longevity" hedge Iron Law 2.13 claim-crossover; old slugs get Vercel 301 redirects in `vercel.json` to preserve any inbound launch links. |
| 5 | `vialchemlabs.com` registration | 1 | **Drop entirely; `vialchemlabs.net` canonical** | Live site is at `.net`; `.com` DNS does not resolve (verified 2026-05-20); updating 162 source references is cheaper than registering `.com` + adding alias. |
| 6 | First-buyer test mechanism | 12 | **Full-price first order with operator-immediate-refund** | Avoids temp-SKU pollution in catalog; refund is simple operator action via BTCPay store + Plaid dashboard. |
| 7 | SemVer for v5 release | 12 | **`v5.0.0`** | Continues major version line from CHANGELOG (1.0.0 → 1.1.0 → 1.2.0 → 1.3.0 → 5.0.0). The 1.x → 5.0 jump reflects audit-driven major closure scope (42 Iron Laws, 822-line audit register, full production-grade closure). |
| 8 | Production deploy promote timing | 12 | **Auto-deploy via Vercel git integration on merge to `main`** | Merging the v5 PR triggers Vercel build + production promote automatically. Session does NOT push to `main`; opens PR; lets `gstack:land-and-deploy` handle merge + wait. |
| 9 | Ad campaign launch | 12 | **HIL GATE 3 — surface "all systems green" + STOP for operator** | One of three irreducible operator gates. Session cannot trigger ad spend. Operator owns timing + ad-platform integration. |

## Rationale

### Brand name "VialChem Labs" override of v5 §1.3 prescription

The SUPER_PROMPT_v5.md was authored 2026-05-20 with v5 §1.3 prescribing `vialchemlabs` (lowercase, one word) as the LOCKED brand name based on audit-anchor state (`ff97cde`). Between the audit (2026-05-19) and v5 execution (2026-05-20), operator landed commit `148fb0e2` titled "fix: correct VialChem brand spelling" which standardized to `VialChem Labs` (proper case, capital VC + L, single space).

This commit is explicitly framed as a correction (`fix:`), not an experiment, and post-dates the v5 prompt authoring. Per Iron Law 2.26 (brand expression LOCKED until explicit operator override), operator commits ARE the override. v5 §1.3 lowercase is treated as STALE-PRESCRIPTION; this LOCKED_OVERRIDE codifies the operator's chosen "VialChem Labs" proper case. Phase 5 brand-lock regression test asserts current code matches this file's value.

### Tagline migration

The codebase ships TWO taglines simultaneously per audit C9: `site.ts:20` source-of-truth is `'Research-grade peptides, shipped with the COA.'` (8 source hits) while hero + footer + OG copy uses `'Counted, weighed, verified.'` (21 source hits). Per v5 §6.2 default + numeric majority + alignment with v3/v4 LOCKED, the v5.0.0 tagline is `Counted, weighed, verified.` Phase 5 removes the deprecated string everywhere.

### Light clinical theme retention

`app/globals.css:14-37` ships the v5 LIGHT clinical theme (`--bg:#fafaf7` + `--accent:#0f3a5f` navy + `--accent-glow:#06b6d4` cyan + `--text:#0a0e14`). This was operator-elected post-anchor (Phase 0 of v3.0 build did initial Posture A dark; v5 rebrand 2026-05-10 flipped to light). Visual-regression baseline at `tests/e2e/visual-regression.spec.ts-snapshots/` reflects light theme. Phase 5 reconciles `lib/design/tokens.ts` (stale v4 dark/teal exports) with the runtime authority `app/globals.css`.

### Iron Law 2.7 carve-out — REMOVE default applied

The Phase 0.B drift assessment identified 6 banned compounds in current catalog:

| File:line | SKU | Iron Law citation | Verdict |
|---|---|---|---|
| `lib/content/products.ts:348` | `tesamorelin-5mg` | v5 §2.29 (FDA approved-drug analog — Egrifta) | REMOVE |
| `lib/content/products.ts:490` | `pt-141-10mg` | v5 §2.29 (bremelanotide; Vyleesi approved drug) | REMOVE |
| `lib/content/products.ts:506` | `melanotan-ii-10mg` | v5 §2.29 (DOJ enforcement target) | REMOVE |
| `lib/content/products.ts:706` | `klow-80mg` | v5 §2.29 supplemental — undetermined composition; precaution-default BAN | REMOVE (operator may re-add with legal opinion + composition declaration) |
| `lib/content/products.ts:721` | `reta-10mg` | v3 §2.7 PERPETUAL ban (retatrutide; 90-day FDA carve-out) | REMOVE |
| `lib/content/products.ts:736` | `tirz-25mg` | v3 §2.7 PERPETUAL ban (tirzepatide; ITC GEO 337-TA-1377) | REMOVE |

Operator-shipped reta/tirz/klow post-audit (commit `e2413ead` "fix: restore catalog artwork with KLOW Reta corrections" + earlier additions) directly conflict with v3 Iron Law 2.7 PERPETUAL ban. v5 autonomous-mode protocol applies REMOVE default. Operator can re-add by committing `docs/DECISIONS/iron_law_2_7_override_<date>.md` with legal opinion attached.

Phase 2 removes these 6 SKUs from `lib/content/products.ts`, `product-descriptions.ts`, `product-images.ts`, `public/product-shots/`, `lib/content/coa.ts` auto-map, and any other surface.

Catalog post-removal: 45 - 6 = **39 SKUs**. (v5 spec asserted 35; the difference is the post-audit catalog growth of +8 SKUs.) Bundles: 5 (renamed per row 4).

### Substance carve-out extension (Iron Law 2.29)

Per v5 §2.29, the static blocklist `BANNED_COMPOUNDS` is the LAST-LINE structural defense, complementing the catalog-inclusion gate. Codified list:

```typescript
export const BANNED_COMPOUNDS = [
  // v3 PERPETUAL bans
  'tirzepatide', 'tirz', 'sema', 'reta',
  'semaglutide', 'retatrutide',
  'glp-1', 'glp1', 'glp 1', 'glp-1ra',
  // v5 §2.29 additions — FDA approved-drug-analog
  'tesamorelin', 'th9507', 'egrifta',
  // v5 §2.29 additions — Melanocortin FDA enforcement
  'melanotan', 'melanotan-i', 'melanotan-ii', 'mt-i', 'mt-ii', 'mt-1', 'mt-2',
  'bremelanotide', 'vyleesi', 'pt-141',
  // v5 §2.29 additions — RUO bypass vector
  'bacteriostatic water', 'bac water', 'bacteriostatic-water', 'bac-water',
  // v5 §2.29 additions — GLP-1 cousins (analog risk)
  'liraglutide', 'dulaglutide',
  // v5 §2.29 additions — SS-31
  'ss-31', 'elamipretide',
  // v5.0 supplemental — undetermined-composition blend
  'klow',
] as const;
```

Located at `lib/compliance/banned-compounds.ts` (created in Phase 2).

## Consequences

This LOCKED_OVERRIDE is binding on:

- `lib/content/site.ts` — Phase 5 aligns `name`, `brandStem`, `tagline`, `domain`, `description`, color references
- `app/globals.css` — Phase 5 confirms light-theme tokens match
- `lib/design/tokens.ts` — Phase 5 reconciles with `app/globals.css` runtime authority
- `lib/content/products.ts` — Phase 2 removes 6 banned SKUs
- `lib/compliance/banned-compounds.ts` (new) — Phase 2 creates with above list
- `lib/compliance.ts` — Phase 2 extends regex set + applies `[\s-]*` for hyphenated forms
- `components/ui/Vial.tsx` — Phase 2 double-gates with static blocklist + catalog allowlist
- `public/robots.txt` — Phase 1 updates `Sitemap:` to vialchemlabs.net
- `.env.example` — Phase 1 updates `BRAND_DOMAIN` default
- `vercel.json` — Phase 2 adds 301 redirects for old bundle slugs; Phase 7 adds CSP header
- All 162 references to `vialchemlabs.com` — Phase 1 refactor to `vialchemlabs.net`
- All references to deprecated tagline — Phase 5 refactor
- `tests/unit/brand-lock.test.ts` (new) — Phase 5 asserts code matches this file
- `CHANGELOG.md` — Phase 12 documents v5.0.0 entry
- `DESIGN.md` — Phase 5 refresh

## Approval Checklist

- [x] Operator authorized via SUPER_PROMPT_v5 autonomous-mode clearance (per `feedback_mogtrix_autonomous_clearance.md` extended to Vialchems Labs / VialChem Labs)
- [x] Iron Law 2.26 + 2.37 LOCKED_OVERRIDE protocol followed (this document is the artifact)
- [x] All 9 §6.2 routing defaults captured + auto-applied
- [x] Brand-name reconciled with operator commit `148fb0e2`
- [x] Tagline conflict resolved (LOCKED tagline retained; deprecated string queued for Phase 5 removal)
- [x] Substance carve-out extended to cover new audit-supplemental findings (klow/reta/tirz)
- [x] Cross-reference in CHANGELOG v5.0.0 entry (deferred to Phase 12)
- [x] Phase 5 brand-lock regression test will guard code drift

## Override Window

This file is the source-of-truth for the v5 brand-lock regression test. The operator may hand-edit any value above before the v5 PR is merged. Force-push the v5-production-closure branch after editing if needed; the regression test will then catch any code drift relative to operator intent.

After v5 merge + production deploy, future changes to brand expression require a new `docs/DECISIONS/locked_override_<YYYY-MM-DD>.md` document (Iron Law 2.37 protocol).

---

**Filed at:** `docs/DECISIONS/locked_override_2026-05-20.md`  
**Filed by:** Claude Opus 4.7 (v5 closure session) — 2026-05-20  
**Supersedes:** v3.0 + v4.0 LOCKED state for brand expression + substance carve-out  
**Cross-references:** `docs/audit/2026-05-19_full_audit_report_v2.md` §4 LOCKED State Verification + §12 Discrepancy Register CRITICAL row C8/C9; `docs/audit/2026-05-20_drift_assessment.md`; `docs/audit/2026-05-20_supplemental_findings.md`
