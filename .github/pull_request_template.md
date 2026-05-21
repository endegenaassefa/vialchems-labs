<!--
v5 Pull Request Template

This template enforces v5 closure discipline. Required sections:
- Iron Law citations for any protected-path changes (Iron Law 2.5/2.19)
- SCANNER_OK confirmation if any protected path is touched
- Test coverage delta + verification evidence
- Audit-register / supplemental-finding closure references (if applicable)
-->

## Summary

<!-- 1-3 sentences: what changes, why now. -->

## Iron Laws affected

<!-- List any Iron Laws (2.1-2.42) this PR moves between PASS/WARN/FAIL/PARTIAL,
or any new laws it introduces. -->

- Iron Law N.NN — <one-line description>

## Audit / supplemental closures

<!-- List closure IDs (Cn / Hn / Mn / Ln / Sn) this PR closes. Cite the
docs/audit/ or docs/checkpoints/ reference for each. -->

- Closes Cn — <one-line>
- Closes Hn — <one-line>

## Protected-path changes (Iron Law 2.5/2.19)

<!-- If any of the following paths were touched, confirm SCANNER_OK in commit
bodies and operator-review via CODEOWNERS:
  - lib/payments/, lib/compliance.ts, lib/compliance/, lib/customer-qualification.ts,
    lib/attestations.ts, lib/sentry.ts, lib/content/products.ts,
    lib/content/product-descriptions.ts, app/checkout/review/ReviewPanel.tsx,
    components/ui/Vial.tsx, docs/DECISIONS/, supabase/migrations/

If none touched, mark "N/A". -->

- [ ] N/A — no protected-path changes
- [ ] All protected-path commits include `SCANNER_OK: reviewed-and-cso-passed`
- [ ] CODEOWNERS will trigger operator review

## Test plan

<!-- Use checkboxes. Include the run-fresh evidence per Iron Law 2.2:
  - npm test:        <count> / <count> passing
  - npm run build:   succeeds
  - npm run preflight: <count> gates GREEN
  - Per-touched-route Sentry breadcrumb + Layer 3 verified (if payment surface)
-->

- [ ] `npm test` passes
- [ ] `npm run build` succeeds
- [ ] `npm run preflight` all 11 gates GREEN
- [ ] New tests added cover all new branches
- [ ] Coverage targets (Iron Law 2.36) verified for touched modules
- [ ] No `.skip(true)` or `.only(` markers added
- [ ] No `console.log` / debug leftovers
- [ ] No TODOs without a tracking reference

## Visual regression baseline (if applicable)

<!-- If snapshots changed, CODEOWNERS on tests/e2e/visual-regression.spec.ts-snapshots/
will require operator review. Document why the baseline changed:

  - [ ] Snapshot diff is intentional (operator-approved design change)
  - [ ] Snapshots refreshed via `npx playwright test --update-snapshots` locally
  - [ ] Diff thumbnails reviewed by operator before merge
-->

## Brand expression (Iron Law 2.26/2.37)

<!-- If lib/content/site.ts brand fields, app/globals.css color tokens, or
app/layout.tsx fonts changed, link the docs/DECISIONS/locked_override_<date>.md
that authorizes the change.

  - [ ] N/A — no brand-expression change
  - [ ] LOCKED_OVERRIDE doc at: docs/DECISIONS/<filename>
-->

## Operator action required after merge

<!-- Anything the operator needs to do after merge (e.g., env var provisioning,
branch-protection script re-run, ad campaign trigger). Leave blank if none. -->

---

Co-Authored-By: Claude Opus 4.7 (v5 closure) <noreply@anthropic.com>
