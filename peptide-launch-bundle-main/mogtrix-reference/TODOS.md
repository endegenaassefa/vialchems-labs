# TODOs

## Deferred From `/autoplan`

- Decide whether the relaunch wedge really stays "full private checkout" or shifts to a narrower discovery-first or pay-after-approval flow. This is a user challenge from the CEO and engineering passes.
- Decide whether canonical commerce data gets separate `orders`, `order_items`, `payments`, and `order_events` tables instead of extending `research_order_requests`. This is a user challenge from the engineering pass.
- Decide whether to keep a provider-agnostic payment adapter before the first real processor is chosen and tested. Both CEO and engineering reviews flagged this as likely premature abstraction.
- If the cart remains browser-local in v1, document and accept the same-device limitation; otherwise add a server-owned draft order.

## Deferred Scope

- Organization accounts, approvers, PO and invoice flows, and tax-exempt handling
- Saved carts and multi-device cart sync
- Reserved inventory or hard stock allocation before checkout completion
- A full standalone design-system project before the relaunch ships

## Design Follow-Ups

- Create `DESIGN.md` from the token and component rules already written into the plan.
- Fix designer access so mockups can be generated for the customer journey and `/ops` workspace.
- Run `/design-review` after implementation to catch visual drift and missing mobile/error-state polish.

## Public Deployment/Legal Review Gate

- Require explicit legal/editorial review before the `vector-bio-supply-demo/` artifact is ever published publicly.
- The demo intentionally simulates a gray-zone research-use-only peptide storefront, including fake checkout, consent logging, arbitration/chargeback clauses, and refusal-to-sell behavior. It is safe as a local investigative artifact, but public hosting changes the risk profile.
- This prevents accidental exposure under `mogtrix.bio` or another public domain, and preserves the plan decision that this demo stays outside the deployed `site/` app.
- This gate may be unnecessary if the artifact remains local-only.
- The engineering review accepted a root-level `/vector-bio-supply-demo/` folder specifically because Vercel deploys only `/site`. If a future change moves this artifact into `site/public`, `site/app`, or another deployed root, legal/editorial review should happen first.
- This only matters if someone proposes public hosting, production routing, or external sharing beyond local demo review.
