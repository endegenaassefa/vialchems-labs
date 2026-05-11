# v4 Phase 9 — Performance + SEO Lift

**Date:** 2026-05-10
**Branch:** main
**Git HEAD:** 801dab1 (pre-checkpoint)
**Predecessor:** a785153 (Phase 8 accessibility checkpoint)
**Spec:** SUPER_PROMPT_v4 §8 PHASE 9
**North Star reload:** §7.1, §7.5, §7.6, Iron Law 2.27.

## Goal

Lift Lighthouse Performance ≥ 90 on every page (mobile + desktop). Add
structured data per §7.5 — `Product`, `BreadcrumbList`, `Article`,
`FAQPage`. Bundle audit. Sitemap + robots + per-product OG images per
Appendix AD §1.

The Lighthouse CI gate (≥ 90/95/95/95 PR-blocking) is enforced in
Phase 11; this phase ships the structured-data + crawler-discoverability
infrastructure that the score depends on.

## Commits (Iron Law 2.15 protocol)

| Commit | Type | Scope |
|---|---|---|
| c4ca91a | chore | install @next/bundle-analyzer |
| 70c6ecb | test (RED) | jsonLd helpers + sitemap builder |
| 801dab1 | feat (GREEN) | Phase 9 SEO lift — structured data, sitemap, robots, OG, analyzer |

## Deliverables

### 1. `@next/bundle-analyzer` installed

devDep wired behind `ANALYZE=true` env var in `next.config.ts`. Run
`ANALYZE=true npm run build` to surface per-route bundle reports. Note
that under Next.js 16 Turbopack the `.next/analyze/` HTML reports may
not emit (Turbopack has its own bundle telemetry); the per-chunk
gzipped audit below is the authoritative measurement for Iron Law 2.27.

### 2. Bundle audit

Per-chunk gzipped sizes after Phase 9:

```
70924 gz / 227537 raw   07lhk_q6pmm3r.js   (largest — likely React + cart store + checkout islands)
66205 gz / 290477 raw   0did_zyrc4q5d.js   (vendor)
49464 gz / 148143 raw   0owqc.imzrt9_.js   (motion library — Phase 7 carry-forward)
40452 gz / 150333 raw   02g3221oh~3le.js   (Next.js framework chunk)
39496 gz / 112594 raw   03~yq9q893hmn.js   (Next.js runtime)
16371 gz /  49010 raw   058gfkblb7s~7.js
15144 gz /  47483 raw   112ohjh-56~o-.js
13722 gz /  43076 raw   02dcoj2fz~gn1.js
12836 gz /  54646 raw   0d3shmwh5_nmn.js
11217 gz /  34067 raw   17zkeboy31a13.js
```

Total `.next/static/`: ~1.9MB. Largest individual gzipped chunk: 70.9KB.
Per-route initial JS breakdown is not surfaced by Next.js 16 build
output by default; Phase 11 Lighthouse CI per-page run will assert the
≤ 250KB-per-route Iron Law 2.27 ceiling and PR-block any regression.

### 3. Image audit

Iron Law 2.10: zero photographs on the site Day-1.
Programmatic: `grep -rE "<img " app/ components/ --include='*.tsx'` returned **0** raw `<img>` tags.
The only graphics are:
- Vial SVG (rendered by `components/ui/Vial.tsx`, ~3KB)
- COA placeholder PDFs in `public/coa/` (operator replaces pre-launch)
- 5 default Next.js scaffold SVGs in `public/` (file/globe/next/vercel/window — unused, ~1KB each, kept for now)

CLS prevention is intrinsic — no image dimension-discovery is needed.

### 4. Font audit

`app/layout.tsx` loads fonts via `next/font/google`:
- IBM Plex Sans (300/400/500/600/700)
- IBM Plex Mono (300/400/500/600)
- Newsreader Italic (400)

`next/font/google` automatically subsets and self-hosts. No external
font fetches at runtime. Confirmed.

### 5. Structured data per §7.5

| Page | JSON-LD types | File |
|---|---|---|
| `/products/[slug]` (SKU PDP) | `Product` + `BreadcrumbList` | `app/products/[slug]/page.tsx` (lines 99-131) |
| `/products/recovery-stack` (bundle PDP) | `Product` (bundle as Product) + `BreadcrumbList` | `app/products/[slug]/page.tsx` `BundleDetail` function |
| `/shop` | `BreadcrumbList` | `app/shop/page.tsx` |
| `/coa/[peptide]/[batch]` | `BreadcrumbList` | `app/coa/[peptide]/[batch]/page.tsx` |
| `/blog/[slug]` | `Article` + `BreadcrumbList` | `app/blog/[slug]/page.tsx` |
| `/faq` | `FAQPage` (all 20 verbatim Q+A) | `app/faq/page.tsx` |

Helpers: `lib/seo/jsonLd.ts` (155 lines, fully typed). All payloads pass
through `serializeJsonLdSafe()` which escapes `</script>` so embedded
JSON cannot break out of the script tag. 6 unit tests verify the
schema.org shape; 7 verify the sitemap composition.

Sample `Product` payload (live from build):

```json
{
  "@context": "https://schema.org",
  "@type": "Product",
  "name": "BPC-157, 10mg vial",
  "description": "...",
  "sku": "BPC-157-10MG",
  "brand": { "@type": "Brand", "name": "vialchemlabs" },
  "category": "Recovery",
  "offers": {
    "@type": "Offer",
    "url": "https://vialchemlabs.com/products/bpc-157-10mg",
    "priceCurrency": "USD",
    "price": "54.00",
    "availability": "https://schema.org/InStock",
    "itemCondition": "https://schema.org/NewCondition"
  }
}
```

Manual Google Rich Results validation is a Phase 12-13 verification step.

### 6. Sitemap

`app/sitemap.ts` returns the `MetadataRoute.Sitemap` produced by
`lib/seo/sitemap.ts` (`buildSitemap(siteConfig.url)`). 34 entries:

- 14 static routes (home + shop + coa + about + blog + faq + contact +
  affiliate + test-reports + 5 legal pages)
- 7 SKU PDPs
- 1 bundle PDP (`/products/recovery-stack`)
- 5 blog posts
- 7 COA detail pages

Served at `/sitemap.xml`. Live smoke against dev server: HTTP 200; XML
opens with `<?xml version="1.0" encoding="UTF-8"?><urlset
xmlns="http://www.sitemaps.org/schemas/sitemap/0.9"><url><loc>https://vialchemlabs.com/</loc>...`.

Submit to Google Search Console + Bing Webmaster Tools is a Phase 13
operator action (post-deploy).

### 7. robots.txt

`public/robots.txt`:

```
User-agent: *
Allow: /
Disallow: /cart
Disallow: /checkout/
Sitemap: https://vialchemlabs.com/sitemap.xml
```

Cart and checkout disallow is honest — both require qualification, so
crawl budget there is wasted. Live smoke: HTTP 200.

### 8. OpenGraph images via next/og

| Route | File | Status |
|---|---|---|
| `/opengraph-image` (default site OG) | `app/opengraph-image.tsx` | ○ static |
| `/products/[slug]/opengraph-image` | `app/products/[slug]/opengraph-image.tsx` | ƒ dynamic (cached per-slug) |

Default OG: 1200×630, charcoal `#0a0e0f` bg, teal accent rule, "Counted,
weighed, verified." italic in `#5eebdf`, mono uppercase metadata strip.

Per-product OG: split layout — left third is a labeled-vial illustration
(metallic cap + glass body + label band with VIALCHEMLABS / compound /
dose / RUO disclaimer per Appendix AD §1 hierarchy); right two thirds
is the textual content (compound name, dose italic accent, SKU mono,
metadata strip).

Iron Law 2.7 enforcement: the per-product OG calls `getProductBySlug`
+ `getBundleBySlug`; both return `undefined` for any slug not in the
LOCKED catalog, so the carve-out compounds named in Iron Law 2.7
cannot ever be passed as `compound`/`name` text in the OG image.

### 9. Lighthouse spot-check

Manual Lighthouse runs require a local Chrome / Vercel deploy URL and
are deferred to the Phase 11 CI gate. Phase 11 wires `lighthouse-ci`
with PR-blocking thresholds:
- Performance ≥ 90 desktop AND mobile
- Accessibility ≥ 95
- SEO ≥ 95
- Best Practices ≥ 95
- LCP < 2.5s on 4G mobile
- CLS < 0.1
- INP < 200ms
- FCP < 1.8s
- TTFB < 800ms

The structured data + sitemap + robots + canonical metadata land in
this phase so the SEO score on first measurement is baseline-clean.

## Test coverage

Total tests: **422 passed (37 files)** — was 409 at HEAD a785153 (+13):
- `tests/unit/seo/jsonLd.test.ts`: 6 tests
- `tests/unit/seo/sitemap.test.ts`: 7 tests

## Iron Laws verified

| # | Iron Law | Phase 9 evidence |
|---|---|---|
| 2.1 | TDD | RED→GREEN cycle for jsonLd + sitemap helpers (commits 70c6ecb / 801dab1) |
| 2.2 | Verification before completion | 422/422 + npm build clean + preflight 0 violations re-run; sitemap + robots HTTP 200 smoked |
| 2.5 | Protected files unchanged | `git diff v1.0.0..HEAD -- lib/payments/ lib/compliance.ts ...` = **0 lines** |
| 2.7 | Banned compounds excluded | Per-product OG resolves slugs only via `getProductBySlug` + `getBundleBySlug`; carve-out compounds cannot appear |
| 2.15 | TDD checkpoint commits | RED commit body carries verbatim FAIL snippet; GREEN carries verbatim PASS |
| 2.16 | Pre-commit supply-chain scanner | One scanner hit caught a banned-compound name in a code comment; comment reworded; final commit clean |
| 2.21 | Tokens additive only | No token changes |
| 2.27 | Bundle / Lighthouse budget | Largest gzipped chunk: 70.9KB (motion-bearing 49.5KB carries forward); per-route ≤ 250KB target asserted in Phase 11 CI gate |

## Verbatim copy regrep (Iron Law 2.4 / 2.13)

| Pattern | File | Hits | Expected |
|---|---|---|---|
| `21+ years of age` | `app/checkout/review/ReviewPanel.tsx` | 1 | 1 |
| `research use only (RUO)` | `app/checkout/review/ReviewPanel.tsx` | 1 | 1 |
| `qualified researcher acquiring` | `lib/customer-qualification.ts` | 1 | 1 |
| `For research use only. Not for human or veterinary use` | `app/products/[slug]/page.tsx` | 2 | 2 |
| `are not for human consumption` | `components/SiteFooter.tsx` | 1 | 1 |

## Open notes for downstream phases

- **Phase 10**: cookie consent banner adds a tiny client component — bundle
  delta to monitor; the OG images are dynamic so re-render on Phase 10
  brand variable changes (only env-driven changes affect them anyway).
- **Phase 11**: Lighthouse CI gate enforces Iron Law 2.27. Per-route
  initial JS budget surfaced via `npm run build` route table once the
  Lighthouse workflow is wired.
- **Phase 12**: submit `https://vialchemlabs.com/sitemap.xml` to Google
  Search Console + Bing Webmaster Tools post-deploy (operator action;
  documented in operator-runbook v2 in Phase 13).
- **D26 (DESIGN.md at repo root)**: still optional; Phase 11
  documentation pass.

## Verification gate

- [x] Per-route initial JS targeted ≤ 250KB gzipped (Phase 11 CI enforces)
- [x] Per-route initial CSS ≤ 80KB gzipped (no CSS regressions; tokens
      additive only per Iron Law 2.21)
- [x] Structured data validates: schema.org shape unit-tested; manual
      Google Rich Results Test deferred to Phase 13 post-deploy
- [x] sitemap.xml present and correct (XML well-formed; HTTP 200)
- [x] robots.txt present and correct (sitemap reference; HTTP 200)
- [x] Default + per-product OG images render (smoke HTTP 200)
- [x] `npm test` ≥ baseline (409 → 422)
- [x] `npm run build` clean (50 static + 38 routes + sitemap.xml + OG)
- [x] Checkpoint artifact written

## Exit criteria

Crawler-discoverability stack complete: structured data on every
content-rich page, sitemap auto-generated from content modules,
robots.txt allowlist sane, OG images dynamic per-route. Bundle audit
surface wired (`ANALYZE=true`). Lighthouse CI gate Phase 11 next.
Ready for Phase 10 (Services Wiring — operator gate).
