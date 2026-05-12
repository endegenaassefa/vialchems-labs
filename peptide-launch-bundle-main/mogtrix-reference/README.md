# Mogtrix Website

Next.js 16 storefront for Mogtrix, plus the journalism / legal-research workspace that grounds its product and compliance copy.

The Flutter mobile app and its Express/Prisma backend live in a separate repository: [`mogtrix-app`](https://github.com/abhicloses7838/mogtrix-app).

## What's Here

### `site/` — the storefront (Vercel-deployed)

Next.js 16 + Supabase + Stripe private research storefront. Customer qualification, hosted pilot checkout, persisted order history, manual request fallback, protected staff ops workspace, Sentry telemetry, Vercel analytics, and CSP/HSTS security headers.

For local development, environment configuration, and deploy instructions, see [`site/README.md`](site/README.md). The Vercel deploy uses `site/` as the project root; CI in `.github/workflows/ci.yml` runs `working-directory: site` on Node 22.

Production deployment: `site-omega-three-59.vercel.app` (Valid Configuration in Vercel). The custom apex `mogtrix.bio` and `www.mogtrix.bio` are attached to the Vercel project but not yet DNS-verified at the registrar — see `REPO_SEPARATION_REPORT.md` for required records and current status.

### Research / journalism workspace

Investigative material that grounds the storefront's legal posture and product copy. Not deployed by Vercel (Vercel only builds `site/`), but it stays alongside the website it informs.

- [`Context.md`](Context.md) — running peptide-industry investigation context
- `MODULE-01-OUTPUT.md` through `MODULE-13-OUTPUT.md` — investigative reporting modules
- [`STRATELABS-INITIAL-LEGAL-PARALLELS-REPORT.md`](STRATELABS-INITIAL-LEGAL-PARALLELS-REPORT.md), [`STRATELABS-INTERACTIVE-INVESTIGATION-REPORT.md`](STRATELABS-INTERACTIVE-INVESTIGATION-REPORT.md) — legal research reports
- [`plans/`](plans) — website plans (e.g., the checkout relaunch)
- [`investigations/`](investigations) — RUO / Stratelabs legal investigation working files
- [`ruo-registration-evidence/`](ruo-registration-evidence) — HTML evidence captures and screenshots
- [`vector-bio-supply-demo/`](vector-bio-supply-demo) — static-HTML reference material, intentionally outside `site/` so Vercel does not deploy it
- [`TODOS.md`](TODOS.md) — current TODOs

### Configuration

- [`CLAUDE.md`](CLAUDE.md) — deploy configuration for Claude Code workflows
- [`.github/workflows/ci.yml`](.github/workflows/ci.yml) — site-scoped CI (lint, test, build) on every push and PR
- [`.gitignore`](.gitignore) — root ignores including `.gstack/` tooling state and Next-generated `next-env.d.ts`

## Repository Separation

This repository was rebuilt on 2026-05-04 to focus on the website + research workspace only. The Flutter mobile app and its companion backend that previously lived at the root have been moved to [`mogtrix-app`](https://github.com/abhicloses7838/mogtrix-app).

- Pre-separation state preserved at branch [`backup-archive/pre-separation-2026-05-04`](https://github.com/abhicloses7838/mogtrix-website/tree/backup-archive/pre-separation-2026-05-04) and at tag `pre-separation-mogtrix-website-2026-05-04` (private backup repo)
- Post-separation tag: [`v0.1.0-post-separation`](https://github.com/abhicloses7838/mogtrix-website/releases/tag/v0.1.0-post-separation)
- Detailed move/delete manifest, history-strategy rationale, dirty-work preservation chain, and verification log: [`REPO_SEPARATION_REPORT.md`](REPO_SEPARATION_REPORT.md)

For the Flutter app, see [`mogtrix-app`](https://github.com/abhicloses7838/mogtrix-app).
