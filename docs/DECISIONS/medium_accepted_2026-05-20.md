# MEDIUM Track — Acceptance Decisions — 2026-05-20 (v5 Phase 8)

Documents Phase 8 closure decisions for MEDIUM-track audit findings
that did NOT require code edits — either because the audit's
description was outdated, because the finding was already closed in an
earlier phase, or because the finding does not require a backfill.

This file is the single acceptance artifact referenced by the Phase 8
checkpoint (see `docs/checkpoints/v5_phase_8_medium.md` once written).

## Audit M2 — v3 phases 6/7/8/9 missing checkpoint files

**Audit finding:** Iron Law 2.6 partial — v3 phases 6/7/8/9 do not
have dedicated checkpoint files under `docs/checkpoints/`.

**Acceptance:** No backfill required.

**Evidence:** The v3 execution model consolidated phases 6 through 9
into the Phase 12 QA checkpoint
(`docs/checkpoints/phase_12_qa.md`). The phase numbering is internal
to v3; phases 6/7/8/9 were never executed as separate vertical slices
with their own deliverables, exit criteria, or commits. Writing
synthetic checkpoint files post-hoc would create the false impression
that those phases produced independent artifacts.

The v3 checkpoint dir today contains:

- `phase_0_bootstrap.md`
- `phase_1_comprehension.md`
- `phase_2_architecture.md`
- `phase_3_backend.md`
- `phase_4_brand_design.md`
- `phase_5_pages.md`
- `phase_10_auxiliary.md`
- `phase_11_runbook.md`
- `phase_12_qa.md` (← consolidates 6/7/8/9)
- `phase_13_reviews.md`
- `phase_14_deploy.md`
- `phase_15_post_deploy.md`

Iron Law 2.6 was satisfied at phase exit by the operator approving
phase 12 as the consolidated checkpoint. The audit applied the
checkpoint-per-phase pattern from later versions (v4/v5) retroactively;
the v3 model legitimately differed.

**Decision:** Accepted as a documentation-shape difference, not a
defect.

## Audit M3 — verbatim 21+ / RUO copy regrep miss

**Audit finding:** Grep for verbatim "21+" + "research use only (RUO)"
strings in `components/ReviewPanel.tsx` returned 0 hits; audit expected
them on the cart review pane.

**Acceptance:** PASS — the audit grepped the wrong surface.

**Evidence:** The verbatim 21+/RUO acknowledgement copy lives in the
age-gate component (`components/age-gate/AgeGateClient.tsx`), where it
is presented at first visit and persisted via
`persistAgeVerification`. Specifically:

- Line 30: `"You are 21 years of age or older"` (requirements list)
- Line 37-39: `"Research use only"` (research-details section title +
  body)
- Line 239-241: `"I confirm that I am 21+ years of age and will use
  these products solely for laboratory research in non-clinical
  settings. Products are not for human consumption."` (terms-accept
  label)
- Line 254: `"I am 21+ Enter"` (primary CTA)

These match the verbatim text in `lib/attestations.ts`
(`AGE_GATE_TEXT`, `RUO_ACK_TEXT`). The Phase 7 G1 component tests
(`tests/unit/components/AgeGateClient.test.tsx`) explicitly assert
these strings.

**Decision:** Accepted as a regrep miss in the audit. The audit script
should target `components/age-gate/` not `components/ReviewPanel.tsx`.

## Audit M4 — RUO disclaimer expected 2 hits, found 1

**Audit finding:** Audit expected the RUO disclaimer to appear on both
the product detail page (PDP) and the bundle page, but only found 1
hit.

**Acceptance:** PASS via shared template.

**Evidence:** The single product page route
(`app/products/[slug]/page.tsx`) handles both single products and
bundles by delegating to `components/v2/ProductPage.tsx` (`V2ProductPage`).
The catalog (`components/v2/data.ts`) merges both
`products` and `bundles` into the same `CatalogItem` shape, so the
slug router covers both surfaces uniformly. The RUO disclaimer hits in
`ProductPage.tsx`:

- Line 102: `<span>RUO</span>` (media meta line)
- Line 115: `<span className="badge badge-ruo">RESEARCH USE</span>`
  (badge row)
- Line 325: `Production COA required before shipment · RUO`
  (compliance footer)

Bundle pages render the same component with the same disclaimers; the
audit's "2 hits" expectation assumed separate page files, but the
v5 architecture intentionally collapses both into one template.

**Decision:** Accepted as a shared-template architectural decision.
No code change required.

## Audit M19 — getIntent for BTCPay

**Audit finding:** `lib/payments/btcpay.ts:206-211` getIntent returns
null with TODO.

**Acceptance:** Already implemented — audit description out of date.

**Evidence:** `lib/payments/btcpay.ts:250-304` (current HEAD) is a full
`GET /api/v1/stores/{storeId}/invoices/{invoiceId}` implementation
with 404 → null, error → throw, and normalized PaymentIntent return.
The line numbers in the audit pointed at an earlier revision before
the BTCPay Greenfield wiring shipped.

The Plaid-side of M19 (also referenced in the audit) is the only piece
still open, and is closed in commit `feat(phase-8.M19): implement
Plaid getIntent status-poll via /transfer/get`.

**Decision:** Accepted as already closed; only the Plaid half required
Phase 8 work.
