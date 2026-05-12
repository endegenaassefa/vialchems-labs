# Phase 0 — Bootstrap (CHECKPOINT)

Date: 2026-05-08
Phase target: 15-20 min
Phase actual: ~30 min (operator-interactive)
Status: COMPLETE

## Goal

Verify environment, load manifest, detect tooling, establish new project directory.

## Decisions locked

| Decision                   | Status          | Value                                                                                                                                                                       |
| -------------------------- | --------------- | --------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| Project directory          | LOCKED          | `/root/peptide-site/` (created, git initialized as `main`)                                                                                                                  |
| Brand pick                 | LOCKED_OVERRIDE | **vialchemlabs** (Posture A clean clinical) — operator override of 34-candidate synthesis. Bundle's `corpus/DECISIONS/brand_pick.md` updated with LOCKED entry.             |
| Brand domain               | LOCKED          | `vialchemlabs.net` (operator-provided production domain)                                                                                                                    |
| Source-side terms          | PENDING         | Build uses placeholder fulfillment promises; Janoshik Analytical as default lab partner placeholder                                                                         |
| Opening SKU set            | LOCKED_DEFAULT  | 7 SKUs + Recovery Stack bundle ($77) + 15% intro promo                                                                                                                      |
| Compliance posture         | LOCKED_DEFAULT  | RUO + 21+ + CA/TX/NY/FL block + 503A/503B + verbatim disclaimers                                                                                                            |
| Payment stack              | LOCKED_DEFAULT  | BTCPay self-hosted (BTC/LTC) + Plaid ACH; cards Phase 2 only                                                                                                                |
| Slice 3 community channels | PLACEHOLDER     | B1 prompt at `/mnt/c/Users/endeg/Downloads/slice_B1_reddit_and_forum_ecosystem_map.md` not fired; runbook will mark sections PLACEHOLDER_AWAITING_SLICE_3                   |
| GLP-1 carve-out            | LOCKED          | Tirzepatide (perpetual ITC GEO 337-TA-1377), Semaglutide + Retatrutide (90-day FDA enforcement carve-out), bacteriostatic water (perpetual exclusion per Iron Law 2.7+2.14) |

## Credentials (all STUB for dev mode)

| Provider | Status    | Notes                                                                                  |
| -------- | --------- | -------------------------------------------------------------------------------------- |
| Supabase | STUB      | `NEXT_PUBLIC_SUPABASE_URL=https://stub.supabase.co`; `REQUIRE_SUPABASE=false`          |
| Resend   | STUB      | Order/notification emails log to console; `ORDER_EMAIL_FROM=research@vialchemlabs.net` |
| Sentry   | STUB      | Error logging local only; DSN empty                                                    |
| Plaid    | STUB      | `PLAID_ENV=sandbox`, all keys stub                                                     |
| BTCPay   | STUB      | URL stub; payment adapter falls back to deterministic mock (`PAYMENT_PROVIDER=stub`)   |
| LLC      | TBD       | `LLC_NAME=vialchemlabs LLC (TBD)`, `LLC_JURISDICTION=Wyoming` (default)                |
| GitHub   | LIVE      | Authenticated as `endegenaassefa` (gh 2.90.0)                                          |
| Vercel   | INSTALLED | CLI 53.2.0 (linking deferred to Phase 14)                                              |

Operator action required before public launch: replace every stub with real credentials. See `docs/operator-runbook.md` (generated in Phase 11).

## Tooling detected

| Tool         | Version       | Status                                                                                                                                                                                         |
| ------------ | ------------- | ---------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| node         | 22.16.0       | OK                                                                                                                                                                                             |
| npm          | 10.9.2        | OK                                                                                                                                                                                             |
| git          | 2.34.1        | OK                                                                                                                                                                                             |
| gh           | 2.90.0        | OK (authenticated)                                                                                                                                                                             |
| docker       | 28.0.4        | OK                                                                                                                                                                                             |
| vercel CLI   | 53.2.0        | Installed in this session                                                                                                                                                                      |
| supabase CLI | NOT INSTALLED | Harness denied global npm install. Workaround: use `npx supabase` for one-off commands, or use Supabase JS client + dashboard (no CLI required for build). Will revisit at Phase 3 (DB phase). |

## Inputs verified

- `STAGE6_MANIFEST.yaml` — read, indexed
- `AUDIT_2026-05-08.md` — read, executive verdict absorbed
- `NAVIGATION_GUIDE.md` — read, corpus map internalized
- `DECISIONS/{brand_pick,source_terms,opening_sku_set,compliance_posture,payment_stack}.md` — all 5 read; brand_pick updated with LOCKED override
- `SUPER_PROMPT_v3_2026-05-08.md` lines 1-1099 read (mission, Iron Laws 2.1-2.17, Subagent Constitution, Execution Discipline, Context-Rot Mitigation, Decision Contract, Performance/UX/A11y/Motion specs, Phase-by-phase workflow, Verification Gates table, Appendix A.1-A.6 partial). Remaining appendices (B-W) read on-demand per phase.
- `/root/mogtrix-website/` — exists, read-only reference (Iron Law 2.12 forbids cloning/forking; Iron Law 2.5 forbids modification)
- `/root/peptide-launch-bundle/mogtrix-reference/` — exists, bundled source mirror, read-only

## Project skeleton

```
/root/peptide-site/
├── .env                       (stubbed, .gitignored)
├── .git/                      (initialized, branch `main`, no commits yet)
├── .gitignore                 (.env, node_modules, .next, .vercel, etc.)
└── docs/
    ├── checkpoints/
    │   └── phase_0_bootstrap.md   (this file)
    └── superpowers/plans/     (empty, populated in Phase 2)
```

Git committer identity: `vialchemlabs <ak47abhinav47@gmail.com>` (configured in this repo only).

## Iron Laws acknowledged (all 17)

2.1 TDD-first ✓
2.2 Verification before completion ✓
2.3 Root-cause investigation before fixes ✓
2.4 No human-consumption/therapeutic language ✓
2.5 /review + /cso gate before payment/compliance/catalog commits ✓
2.6 No merge to main without design+plan approval artifacts ✓
2.7 No BAC water, no Tirzepatide, no Semaglutide/Retatrutide in opening catalog ✓
2.8 No shipping to CA/TX/NY/FL ✓
2.9 No direct Stripe/PayPal/Square/Shopify-Payments ✓
2.10 No fake reviews, testimonials, or before/after stories on Day 1 ✓
2.11 No GLP-1 obfuscated SKU naming; canonical names only (`BPC-157-10mg`) ✓
2.12 No "Mogtrix" / "MOGTRIX" in source files (pre-commit grep enforces) ✓
2.13 No hedged-but-still-claiming language even with RUO disclaimer ✓
2.14 No reconstitution kit bundling ✓
2.15 TDD checkpoint commits with verbatim PASS/FAIL output in commit body ✓
2.16 Pre-commit supply-chain scanner mandatory (Phase 8 setup) ✓
2.17 Agent-introspection-debugging on 3+ failed fixes ✓

## Subagent Constitution acknowledged

Will be pinned verbatim to every Agent dispatch from §3 of SUPER_PROMPT_v3.

## Execution discipline

- Single-track Opus model (per §4.5; no Haiku/Sonnet downgrade)
- Superpowers skills invoked at canonical points
- gstack skills invoked at canonical points
- Subagent dispatch protocol: implementer → spec reviewer → code-quality reviewer (sequential)
- Worktree cascade for 3+ truly orthogonal modules (Phase 5 candidate)

## Outstanding issues / blockers

1. **Supabase CLI not installed** — non-blocking until Phase 3. Workarounds: `npx supabase init`, or skip CLI and use Supabase JS client with cloud project provisioned via dashboard.
2. **Brand `vialchemlabs.net` not registered** — operator action; build proceeds with placeholder URL.
3. **Slice 3 (B1) not fired** — operator action; runbook will emit PLACEHOLDER markers.
4. **Source supplier terms not confirmed** — build uses observed-industry-standard placeholders; operator confirms post-build.
5. **All real credentials stubbed** — operator replaces before public launch.

## Next phase entry conditions

Phase 1 (Comprehension — Full Corpus Read) can begin immediately:

- All Phase 0 inputs verified ✓
- Project directory ready for plans + checkpoints ✓
- Tooling sufficient for Phase 1 (read-only work) ✓
- Subagent dispatch protocol understood ✓

## Verification gate

- [x] State report exists (this file)
- [x] All manifest paths verified
- [x] New project directory confirmed (created empty, git initialized)
- [x] Brand pick stated (vialchemlabs Posture A LOCKED_OVERRIDE)
- [x] All 5 decision states reported
- [x] Iron Laws 2.1-2.17 acknowledged
- [x] Subagent Constitution noted for verbatim pinning
