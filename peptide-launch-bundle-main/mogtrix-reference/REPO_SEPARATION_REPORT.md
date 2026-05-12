# Mogtrix Repo Separation Report

Date: 2026-05-04

## Executive Summary

`mogtrix-app` and `mogtrix-website` are now fully separated with zero intentional overlap in their final trees. `mogtrix-app` was landed through the user-approved Option 4 force-push strategy so its public `main` is now the clean app-plus-backend history extracted from the former omnibus website repo. `mogtrix-website` was landed through PR #1 as a squash merge, leaving it as the website plus research workspace only.

## Final State

### Public repositories

- `github.com/abhicloses7838/mogtrix-website`
  - Separation landing commit: `3f4048ae7defe7632cd2b3682a888aa616fb94c0`
  - Public tag: `v0.1.0-post-separation`
  - Separation PR: https://github.com/abhicloses7838/mogtrix-website/pull/1
- `github.com/abhicloses7838/mogtrix-app`
  - Separation landing commit: `d86bcec60b382e6e3b968f6b1fbda0486262b86f`
  - Public tag: `v0.1.0-post-separation`
  - Review PR: https://github.com/abhicloses7838/mogtrix-app/pull/1

### Preservation points

- Website pre-change state:
  - `backup-archive/pre-separation-2026-05-04`: `0696afac41112cb891d7ebb294d6729eba9768d0`
  - `pre-separation-mogtrix-website-2026-05-04` in the private backup repo: `0696afac41112cb891d7ebb294d6729eba9768d0`
- App pre-change state:
  - `backup-archive/pre-separation-2026-05-04`: `81861f142d4847f5821ef03d5ec846a30477a53d`
  - `pre-separation-mogtrix-app-2026-05-04`: `81861f142d4847f5821ef03d5ec846a30477a53d`
- Private backup repo: `github.com/abhicloses7838/mogtrix-pre-separation-backup`
  - `v0.1.0-post-separation-website`: mirror of website post-separation commit `3f4048ae7defe7632cd2b3682a888aa616fb94c0`
  - `v0.1.0-post-separation-app`: mirror of app post-separation commit `d86bcec60b382e6e3b968f6b1fbda0486262b86f`

The backup repo uses disambiguated post-separation tag names because both public repos correctly use the same release tag name, `v0.1.0-post-separation`, while a single shared backup repository cannot store two different objects under one tag name. The temporary collision tag in the backup repo was replaced by the explicit `-website` and `-app` mirrors.

## History Strategy

The app used Option 4: force-push the cleaned, filtered app history to `mogtrix-app:main`. This was chosen because the existing public `mogtrix-app` history was only a four-commit snapshot import with little per-file value, while the former website omnibus repo contained the real granular history for the Flutter app, native scanner code, and Express/Prisma backend.

Trade-off: existing clones of `mogtrix-app` will see divergence and must reset or fresh-clone. Recovery remains available through `pre-separation-mogtrix-app-2026-05-04`, `backup-archive/pre-separation-2026-05-04`, and the private backup repo.

The website used the normal PR path: app and stale paths were removed from a branch and squash-merged into `mogtrix-website:main`.

## Journalism Workspace Decision

The journalism and research workspace used Option A: it stays at the root of `mogtrix-website`. This keeps the evidence, plans, and legal/research material attached to the website context that uses it, with no migration risk. It also honors the instruction not to touch the journalism workspace beyond preserving it.

## Move And Delete Manifest

### Moved into `mogtrix-app`

The following app and backend paths were kept in or moved to `mogtrix-app`:

- `.gitignore`
- `.metadata`
- `.env.example`
- `analysis_options.yaml`
- `IPHONE_TESTING.md`
- `MIGRATION_FACE_CAPTURE.md`
- `README.md` (rewritten as app-focused)
- `android/`
- `assets/branding/`
- `docs/api-disclosure.md`
- `docs/app-metadata.md`
- `docs/app-store-checklist.md`
- `docs/data-flow.md`
- `docs/LIVE_SCAN_PLAN.md`
- `ios/`
- `legal/privacy-policy.md`
- `legal/terms-and-conditions.md`
- `lib/`
- `linux/`
- `macos/`
- `package.json` (renamed package to `mogtrix-app-backend`)
- `package-lock.json`
- `prisma/schema.prisma`
- `prisma/seed.ts`
- `prisma.config.ts`
- `pubspec.lock`
- `pubspec.yaml`
- `scripts/generate_mogtrix_brand_assets.swift`
- `scripts/run_iphone.sh`
- `src/lib/prisma.ts`
- `src/server.ts`
- `test/`
- `tsconfig.json`
- `web/`
- `windows/`

### Stayed in `mogtrix-website`

The following website and research paths stay in `mogtrix-website`:

- `.github/workflows/ci.yml`
- `.gitignore` (strengthened for `.gstack/`)
- `CLAUDE.md`
- `Context.md`
- `MODULE-01-OUTPUT.md` through `MODULE-13-OUTPUT.md`
- `STRATELABS-INITIAL-LEGAL-PARALLELS-REPORT.md`
- `STRATELABS-INTERACTIVE-INVESTIGATION-REPORT.md`
- `TODOS.md`
- `README.md`
- `investigations/`
- `plans/`
- `ruo-registration-evidence/`
- `site/`
- `vector-bio-supply-demo/`

### Deleted or untracked from the website repo

The following app, backend, stale, or tooling paths were removed from `mogtrix-website`:

- `.metadata`
- root `.env.example`
- `analysis_options.yaml`
- `IPHONE_TESTING.md`
- `MIGRATION_FACE_CAPTURE.md`
- `android/`
- `assets/branding/`
- `docs/api-disclosure.md`
- `docs/app-metadata.md`
- `docs/app-store-checklist.md`
- `docs/data-flow.md`
- `docs/LIVE_SCAN_PLAN.md`
- `flutter_01.png`
- `.gstack/browse-audit.jsonl`
- `.gstack/browse.json`
- `.gstack/design-reports/design-audit-localhost-2026-04-28.md`
- `ios/`
- `legal/privacy-policy.md`
- `legal/terms-and-conditions.md`
- `lib/`
- `linux/`
- `macos/`
- `mogtrix/`
- root `package.json`
- root `package-lock.json`
- `prisma/`
- `prisma.config.ts`
- `prisma/schema.prismaq`
- `pubspec.lock`
- `pubspec.yaml`
- `scripts/generate_mogtrix_brand_assets.swift`
- `scripts/run_iphone.sh`
- `src/`
- `test/`
- `tsconfig.json`
- Flutter `web/`
- `windows/`
- `site/next-env.d.ts` was untracked only; it remains generated and ignored.

The final website tree was checked for the removed app roots and `.gstack/browse.json`; none were present. The final app tree was checked for website and research workspace roots such as `site/`, `investigations/`, `ruo-registration-evidence/`, `vector-bio-supply-demo/`, `MODULE-*`, `STRATELABS-*`, `Context.md`, `TODOS.md`, and `CLAUDE.md`; none were present.

## Dirty Work Preservation Chain

The dirty scanner tuning was preserved before any history rewrite:

- Original preservation branch: `preserve/dirty-scanner-tuning-2026-05-04`
- Original preserve commit: `6d948fe70fb3245f661d962052eb2d0639eb1aa0`
- Recorded preservation scope: 7 files, +861/-241
- Cleaned app-history commit: `6958e4b` (`preserve: scanner tuning (centered-face thresholds, Euler mapping, mesh fallback, HUD/progress, scan controller, +tests)`)
- Final app main includes the preserved scanner work after the Option 4 force-push.

Subsequent verification fixes on app main:

- `d5e506a` - added backend `/healthz` endpoint
- `b08192b` - added Android Gradle wrapper for verification
- `d86bcec6` - fixed Android face landmark buffer compilation

## Verification Log

Raw logs are stored locally under:

- `/Users/abhinavkumar/Desktop/separation/2026-05-04/verification-logs/app-phase7-adjusted.log`
- `/Users/abhinavkumar/Desktop/separation/2026-05-04/verification-logs/website-phase7-adjusted.log`

### App checks

- `flutter pub get`: pass, exit 0
- `dart analyze`: pass, exit 0, `No issues found!`
- `flutter test`: pass, exit 0, 38 tests passed
- `npm install`: pass, exit 0
- `npx prisma generate`: pass, exit 0
- `npm run dev`: backend started on `http://localhost:3001`
- `curl -s http://localhost:3001/healthz`: pass, HTTP 200, exit 0
- `cd android && ./gradlew assembleDebug`: pass, exit 0, `BUILD SUCCESSFUL`
- `cd ios && pod install && cd .. && flutter build ios --no-codesign`: final pass, exit 0, in a `/tmp` same-commit clone after the Desktop/FileProvider path produced macOS xattr signing detritus
- iPhone real-device face scan: deferred by user instruction
- Android real-device scan: N/A, no Android device available; Gradle assemble was the Android gate by user instruction

### Website checks

- `cd site && npm ci`: pass, exit 0
- `npm run lint`: pass, exit 0
- `npm run test`: pass, exit 0, 37 files / 145 tests passed
- `npm run build`: pass, exit 0
- `npx playwright install --with-deps`: pass, exit 0
- `npm run e2e`: pass, exit 0, 19 passed / 1 skipped
- Vercel preview deploy: pass, exit 0, `site-bz80r4waf-abhicloses7838-5895s-projects.vercel.app` ready
- Vercel preview `/api/health`: pass, HTTP 200, exit 0
- Vercel preview `/`, `/catalog`, `/login`, `/account`, `/ops/login`, `/cart`: pass, HTTP 200, exit 0 via authenticated `vercel curl`

## DNS Issue

The DNS issue for `mogtrix.bio` is independent and out of scope for the repo separation. In Vercel, `mogtrix.bio` and `www.mogtrix.bio` are present on the `site` project but show `Invalid Configuration`.

Required registrar DNS records shown by Vercel:

- `A` record: name `@`, value `216.198.79.1`
- `CNAME` record: name `www`, value `ebe5acf2f3a2f82c.vercel-dns-017.com.`

Alternative nameserver route:

- `ns1.vercel-dns.com`
- `ns2.vercel-dns.com`

The Vercel project still has `site-omega-three-59.vercel.app` with valid configuration.

## Recovery Procedure

### Website

To inspect the pre-separation website state:

```bash
git fetch origin backup-archive/pre-separation-2026-05-04
git checkout backup-archive/pre-separation-2026-05-04
```

To restore the public website repo to the pre-separation state, create a reviewed revert PR or, only with explicit approval, reset `main` to `0696afac41112cb891d7ebb294d6729eba9768d0`. The private backup repo also preserves this state at `pre-separation-mogtrix-website-2026-05-04`.

### App

To inspect the original four-commit public app snapshot:

```bash
git fetch origin --tags
git checkout pre-separation-mogtrix-app-2026-05-04
```

To restore the app repo to the pre-separation snapshot, use the tag `pre-separation-mogtrix-app-2026-05-04` or branch `backup-archive/pre-separation-2026-05-04` as the source, then perform a reviewed force-push only after explicit approval. The private backup repo also preserves the pre-separation app tag and the extracted post-separation app mirror tag.

## Out Of Scope Follow-Ups

- `lib/main.dart` remains large and should be refactored separately.
- Flutter package name remains `looksmax_app`; a rename is invasive and intentionally deferred.
- Prisma vs Supabase consolidation is intentionally out of scope. The app uses Prisma/Postgres directly, while the website uses Supabase.
- The iPhone real-device scanner retest remains deferred to the user after landing.
- Registrar DNS for `mogtrix.bio` must be fixed outside Git.

## References

- `MOGTRIX_HANDOFF.md`
- `FULL_REPO_AUDIT.md`
- `INDEPENDENT_AUDIT.md`
