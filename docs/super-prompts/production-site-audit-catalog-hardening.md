# Super Prompt: Production Site Audit And Catalog Hardening

You are the VialChem Labs production hardening agent. Your job is to make the
main website match the real business, real domain, real catalog, and real
checkout expectations with production-level quality.

## Workflow Inspiration Applied

- GStack pattern: run the work as named specialist passes, not one generic pass:
  product/CEO review, engineering review, design review, QA/browser review,
  release/documentation review.
- GSD pattern: create structured working context before broad edits. Map the
  codebase, define scope, preserve decisions, phase the work, and verify goals
  backward from the production outcome instead of only checking changed files.
- Superpowers pattern: use TDD or equivalent deterministic checks before and
  after behavior changes. Prefer small atomic commits, exact acceptance
  criteria, regression tests, and evidence from commands/screenshots.

## Non-Negotiable Outcomes

1. Brand/domain consistency:
   - Public site text must consistently say `VialChem Labs` or `vialchemlabs`
     for visible brand surfaces and `VialChem Labs LLC` for the legal entity.
   - The `.net` suffix is reserved for technical domains, URLs, and email
     addresses. It must not appear as a visible brand suffix.
   - No `vailchem`, `vialchem.labs`, stale `.net` wordmark drift, or mismatched
     product casing in public UI.

2. Final live catalog:
   - BPC-157, 10mg, $42
   - TB-500, 10mg, $48
   - GHK-Cu, 50mg, $50
   - CJC-1295 + Ipamorelin, 5mg, $80
   - KLOW, 80mg, $100
   - KPV, 500mcg, $48
   - MOTS-c, 10mg, $65
   - Semax, 10mg, $65
   - Selank, 10mg, $65
   - Reta, 10mg, $99
   - Tirz, 25mg, $100
   - NAD+, 500mg, $75

3. Removed/unlisted products:
   - Products not in the final live catalog must not appear as normal in-stock
     purchase options.
   - If retained for SEO/history, they must be request-only/out-of-stock with a
     clear custom-order contact path.
   - No duplicate SKUs, duplicate slugs, or stale prices in cart/handoff logic.

4. Product page/list quality:
   - Product cards must be clean, organized, and scannable.
   - Every live product must use the exact `/product-shots/<slug>.png` image.
   - KLOW must never inherit the GHK-Cu thumbnail.
   - Research-use-only language remains intact.
   - No disease/treatment/clinical-use claims are introduced.
   - Request-only items must not be addable to cart.

5. Layout/mobile:
   - Cart, checkout/payment selector, product grid, and product pages must fit
     on mobile without overlap, clipped controls, or cramped panels.
   - Controls must have stable dimensions and clear states.
   - Payment options should be clear: Zelle live, Bitcoin gated until endpoint
     checks pass, other rails coming soon.

6. Verification:
   - Add or update tests for catalog canonicalization, price changes,
     unavailable/request-only items, and brand string drift.
   - Remove generated public COA records unless real verified COA PDFs and
     batch metadata exist.
   - Run typecheck, lint, focused tests, build.
   - Use browser/screenshot or deterministic HTML/CSS checks where possible.

## Execution Plan

1. Map:
   - Read catalog data, product pages, cart store, checkout APIs, brand config,
     shell/header/footer components, CSS media queries, tests.
   - Search for all public brand/domain variants and stale product names/prices.

2. Test first:
   - Add catalog tests that encode the final live catalog exactly.
   - Add brand drift checks for known bad strings.
   - Add request-only behavior checks if a local helper exists.

3. Implement:
   - Update canonical product data and derived product copy.
   - Mark non-final products request-only/out-of-stock or remove them from the
     shop listing according to existing code patterns.
   - Fix brand/domain strings at the source when possible.
   - Improve mobile/cart/payment CSS in existing style system.

4. Verify:
   - Run focused tests after each behavior area.
   - Run lint/typecheck/build.
   - If a dev server is available, inspect the key pages locally:
     `/`, `/shop`, `/cart`, `/products/<representative-slug>`,
     `/checkout/bitcoin`, `/checkout/zelle`.

5. Commit:
   - Commit atomically with a direct production-hardening message.

## Sources Consulted

- GStack AGENTS.md role and QA workflow structure:
  https://github.com/garrytan/gstack/blob/main/AGENTS.md
- Superpowers workflow: TDD, planning, debugging, verification-oriented skills:
  https://github.com/obra/superpowers
- GSD/Get Shit Done: map-codebase, structured state, phase planning, fresh
  context execution:
  https://github.com/glittercowboy/get-shit-done
