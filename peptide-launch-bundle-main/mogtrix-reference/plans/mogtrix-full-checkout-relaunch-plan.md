<!-- /autoplan restore point: /Users/fabriciorodriguez/.gstack/projects/Mogtrix-website-v1/clean-mogtrix-rebuild-autoplan-restore-20260502-222713.md -->
# Full Checkout Relaunch Plan

## Summary
- Audit result: as of May 2, 2026, this repo is a Supabase-backed request portal, not ecommerce. It has no customer account model, no payment rail, no customer-owned order history, and no stock model.
- Verified locally in this audit: `npm run lint`, `npm run test`, `npm run build`, and `npm run e2e:run` passed. Current browser coverage still proves only demo-mode intake and ops entry, not real Supabase-backed checkout.
- Locked decisions:
  - Full checkout will slip past the May 2, 2026 11 PM target.
  - Customers must sign in before browsing.
  - Payment must stay provider-agnostic because the processor is still unknown.
  - `profiles` stays staff-only; customer accounts get a separate model.

## Launch Thesis & Success Criteria

- Launch thesis: if a qualified buyer can sign in once, qualify once, pay once, and track the order without staff chasing them over email, Mogtrix should convert more qualified demand into accepted paid orders without increasing ops chaos.
- Phase-zero prerequisite: customer auth cannot start until the principal model is explicit. The current auth trigger writes every `auth.users` signup into `public.profiles` as inactive staff, so that conflict must be removed or redesigned first.
- Pilot success criteria:
  - zero unauthorized access to catalog data or customer-owned order data in preview and pilot environments
  - one real sandboxed provider flow passes checkout, webhook reconciliation, and `/ops` reconciliation on a real Supabase-backed preview with `REQUIRE_SUPABASE=true`
  - at least 90% of successful payment returns reconcile to a visible order state within 5 minutes
  - no paid order ends in an unlabeled exception state; every failure lands in an explicit staff-visible and customer-visible follow-up state
  - median staff touches per paid order do not increase above the current request-portal baseline during the pilot cohort
- Go/no-go rule: keep the current request-intake portal as fallback until the success criteria above pass on preview and in the first small live cohort.

## Implementation Changes

### 1. Convert the current request backbone into a customer-owned order backbone
- Keep the existing staff queue instead of creating a second internal system.
- Add order ownership and commerce state to the current request table: `customer_user_id`, shipping fields, `checkout_state`, `payment_state`, `payment_provider`, `payment_reference`, and customer-visible timestamps.
- Keep existing staff review status/history/notes, but treat them as post-payment ops workflow instead of the public order flow.
- Add customer RLS so customers can read only their own orders, items, consents, and status history.

### 2. Add customer auth and gated catalog access
- Add `customer_profiles` keyed to `auth.users.id`.
- Add `/login`, `/signup`, `/logout`, `/account/orders`, and `/account/orders/[id]`.
- Extend middleware so `/shop`, `/products/:slug`, `/cart`, `/checkout`, and `/account` require a customer session.
- Before customer signup ships, replace or remove the current `handle_new_auth_user` trigger path that writes every new auth user into staff-only `profiles`.
- Move qualification state out of browser-local storage into a server-owned customer access record reused by middleware, server loaders, and APIs.
- If the catalog truly remains private, enforce that privacy at the data layer: authenticated and qualified catalog reads only, `/api/catalog` locked down, and gated catalog routes removed from public sitemap and robots exposure.
- Signup flow uses email/password, email verification, and first-session RUO/age attestations. No manual customer approval in v1.

### 3. Add real storefront primitives the current repo is missing
- Extend `products` with soft inventory fields: `inventory_on_hand`, `allow_backorder`, `lead_time_note`.
- Wire `product_images` into catalog/detail queries and render at least one image per product.
- Fix mobile navigation and enforce age/RUO gating on direct links, not just `/`.
- Keep the cart browser-local in v1; do not add saved carts yet.
- If the cart stays browser-local in v1, explicitly constrain checkout to same-device completion and add stale-item recovery after email verification and payment-provider return.
- Lock the v1 inventory drift rule: backorder-eligible items may proceed through checkout with explicit lead-time warnings, but truly unavailable items block checkout until the cart is fixed.
- Revalidate inventory both before checkout-session creation and when webhook results are applied; paid-but-unfulfillable orders must enter explicit exception states instead of silently proceeding.

### 4. Add a provider-agnostic payment integration layer
- Add a payment adapter contract with `createCheckoutSession`, `handleWebhook`, and `readPaymentStatus`.
- Add generic envs for provider selection and secrets: `PAYMENT_PROVIDER`, provider API secret, and webhook secret.
- Implement a `manual/noop` adapter for local/dev and scaffold one real provider module for the processor you choose.
- Add `/api/payments/checkout-session` and `/api/payments/webhook`.
- Production must fail closed when payment config is missing; webhook is the only path that can mark an order paid.
- Persist provider event IDs and webhook application state so duplicate or out-of-order events cannot double-advance an order.

### 5. Upgrade customer and staff UX around the new order model
- Replace public "request-only" copy with customer order/account copy.
- Add customer order confirmation with order ID, payment state, and next steps.
- Add customer order timeline in `/account/orders/[id]`.
- Update `/ops` to show customer identity, payment state, shipping data, and soft inventory warnings alongside existing notes and staff transitions.

### 6. Expand verification and launch gates before release
- Add real Supabase-backed integration coverage for customer signup, gated browse, checkout session creation, webhook update, ops review, and customer history.
- Expand smoke coverage to include `/login`, `/shop`, `/checkout`, `/account/orders`, and `/ops`.
- Add policy and route coverage for catalog privacy, customer-to-customer order isolation, webhook retry and out-of-order delivery, stale inventory recovery, and concurrent staff/customer edits.
- Keep `REQUIRE_SUPABASE=true` outside local dev.
- Do not call the release "full checkout" until one real sandboxed provider passes checkout plus webhook plus ops reconciliation.

## Public Interfaces
- New tables/types:
  - `customer_profiles`
  - `checkout_state`
  - `payment_state`
  - added inventory fields on `products`
  - added ownership/payment/shipping columns on the current request table
- New routes:
  - `/login`
  - `/signup`
  - `/logout`
  - `/account/orders`
  - `/account/orders/[id]`
- New APIs:
  - `/api/payments/checkout-session`
  - `/api/payments/webhook`

## Screen Specs & Information Architecture

### Entry flow and gate sequencing
- Locked customer entry sequence: public home `/` -> `/login` or `/signup` -> email verification state -> three-step qualification flow inside `/qualify` -> `/shop`.
- The public home stays visible to unauthenticated users and acts as a branded private-catalog entry page. It explains who Mogtrix is for, why access is restricted, and the single next action to continue.
- Customers never browse catalog data before sign-in, but they do get product positioning, qualification context, and legal framing before auth.
- The public home is a poster-style entry page, not a mini storefront:
  - above the fold shows brand, qualification framing, one primary CTA, one quieter secondary link for access rules, and immediate product proof in the same composition
  - product proof must be visible without scrolling: show a tight horizontal row of up to three adjacent vial visuals or packshots, not a second stacked section hidden below the fold
  - teaser proof is visual first, not card-grid first: no full product cards, no repeated micro-copy, no duplicated CTA row
  - research/legal links live in the header or footer, not as a cluster of equal-weight actions in the hero
- Direct links to `/shop`, `/products/[slug]`, `/cart`, `/checkout`, `/account/orders`, and `/account/orders/[id]` redirect by state:
  - unauthenticated -> `/login?next=...`
  - authenticated but email-unverified -> verification-required screen
  - authenticated and verified but not yet RUO/age-qualified -> `/qualify`
  - fully qualified -> requested route
- Header behavior follows onboarding state:
  - anonymous users see brand, one primary auth action, and access-rules help
  - signed-in but unverified or unqualified users see a reduced onboarding nav: brand, progress, help, log out
  - only fully qualified users see the full `Shop`, `Cart`, and `Orders` navigation

### Qualification flow structure
- `/qualify` stays a single route, but it behaves as a guided 3-step flow with a progress indicator and one primary action per step.
- On mobile, `/qualify` shows one step at a time with a sticky progress indicator and a single visible primary CTA. It must not compress multiple steps into one long scroll wall.
- Step 1, account context:
  - confirm full name and account email
  - capture or confirm organization only if it is missing
  - no legal wall of text on this step
- Step 2, structured qualification:
  - required fields:
    - organization or lab name
    - institution type via select
    - role via select
    - procurement / research context via select
  - if the customer selects `Other` for institution type, role, or procurement / research context, reveal one short inline text field for that specific answer
  - remove the generic required `credential details` field
  - remove the generic required `describe the research environment` textarea
  - defer any open text to an optional supporting-notes field instead of making narrative writing the main task
  - show a short reason for each field in plain language
- Step 3, attestations and review:
  - show the three required attestations with a short summary of the answers from step 2
  - keep one primary CTA, `Continue to catalog`
  - show support / contact as a secondary fallback only
- The implementer should treat the current single long qualification form as deprecated. The relaunch flow must not ask customers to complete identity, qualification, narrative explanation, and legal acceptance in one uninterrupted block.

### Route jobs and hierarchy
- `/`
  - primary: explain the private research catalog and who it is for
  - secondary: show immediate product proof and explain access restriction
  - tertiary: legal links and staff access
  - composition rule: first viewport must read as one poster-like composition with one dominant CTA and one visible row of adjacent vial proof, without forcing the user to scroll to understand what Mogtrix sells
- `/login` and `/signup`
  - primary: continue into the private catalog
  - secondary: reinforce qualification rules and trust
  - tertiary: legal links and alternate auth path
  - shell rule: both routes use one shared access-shell composition, with the same visual frame, trust copy zone, and spacing system; only the active form state changes
- `/shop`
  - primary: browse products
  - secondary: inspect availability signals and use only the smallest filter set needed to keep browsing easy
  - tertiary: persistent cart/account access
- `/products/[slug]`
  - primary: evaluate one product
  - secondary: inspect image, specs, and availability / lead-time warning
  - tertiary: add to cart or return to catalog
- `/cart`
  - primary: confirm selected items
  - secondary: resolve quantity or stock issues
  - tertiary: continue to checkout or return to catalog
- `/checkout`
  - primary: complete shipping, payment handoff, and final attestations
  - secondary: review order summary and legal/compliance reminders
  - tertiary: return to cart
- `/account/orders`
  - primary: scan current and prior orders
  - secondary: filter by state / date when added later
  - tertiary: open order detail
- `/account/orders/[id]`
  - primary: understand current order state and next step
  - secondary: review payment, shipping, and timeline detail
  - tertiary: contact / support fallback
- `/ops`
  - primary: triage queue by payment and review state
  - secondary: spot risk, stock, or shipping blockers fast
  - tertiary: open order detail and act

### Layout model
- `/shop` becomes a product-first catalog on desktop:
  - above the fold shows one short page title, one compact search/sort row, and an immediate multi-column vial grid
  - filters stay in a narrow left rail or collapsed drawer and must not visually outweigh the product grid
  - do not stack a large marketing intro, category matrix, and dense product grid in the same first screen
- `/ops` becomes a split workspace on desktop:
  - left rail: filterable queue with payment state, review state, and warning indicators
  - main pane: selected order summary, timeline, shipping/payment block, and action modules
  - right-side or lower action zone: notes, status transition, and reconciliation actions
- `/ops` on mobile collapses to list -> detail navigation, but keeps the same hierarchy: summary first, blockers second, actions last.
- `/account/orders/[id]` uses a two-zone layout instead of stacked cards:
  - summary rail for order ID, payment state, shipment state, and next expected step
  - main column for timeline, item list, and customer-visible updates
- `/checkout` is not a stack of interchangeable cards. It is a three-part flow on one screen: shipping/contact, payment handoff, and order summary / attestations, with one primary action at the bottom.

## Interaction State Matrix

| Feature | Loading | Empty | Error | Success | Partial |
|--------|---------|-------|-------|---------|---------|
| `/login` | Disable submit button, show inline spinner, preserve entered email | Default state explains private catalog access and qualification rules | Inline auth error with retry guidance and legal links still visible | Redirect immediately to next step with lightweight success copy | If account exists but is unverified, show verify-email callout instead of generic failure |
| `/signup` | Disable submit, show progress text that explains what happens next | Default state explains eligibility, privacy, and what signup unlocks | Inline validation/auth error without clearing form fields | Confirmation state tells user to verify email before catalog access | If signup succeeds but email delivery is delayed, show resend affordance and support fallback |
| Email verification | Skeleton header plus disabled continue CTA while session refreshes | n/a | Explain expired or invalid link and offer resend | Continue CTA routes into the qualification flow | If already verified, skip forward without showing duplicate success language |
| Qualification flow | Preserve prior-step answers, disable only the active step CTA, and show short progress text | n/a | Show inline field errors on the current step only, without wiping earlier answers | Redirect straight into `/shop` and show a small “private access unlocked” confirmation banner above the catalog grid | If a structured choice is `Other`, reveal only the matching follow-up input; optional notes never block progress |
| `/shop` | Product-grid skeleton, filters visible, cart/account nav stays present | Warm no-results state with reset-filters action or “catalog unavailable” message | Full-width retry panel with support/legal fallback | Product grid with visible image, availability, and cart count | If some products are unavailable, keep grid visible and mark affected items with lead-time or backorder copy |
| `/cart` | Refresh row states without hiding the full cart | Friendly empty state with return-to-catalog CTA | Inline stale-catalog warning with retry | Continue to checkout CTA and confirmed quantities | If price, stock, or lead time changed, keep cart visible and highlight only affected rows |
| `/checkout` | Lock primary CTA, preserve form values, show payment-session progress | Empty-cart state routes back to `/shop` | Blocking inline error keeps all entered data visible | Redirect to provider and preserve order draft | If inventory drift allows backorder, show non-blocking warning; if it blocks purchase, push the user back to the affected line item |
| Payment return | Dedicated pending-confirmation page with order ID, pending state, and automatic recheck | n/a | Explain confirmation delay, keep order visible, and offer support / retry-recheck action | Transition from pending page to paid confirmation with next steps | If payment is authorized but webhook is delayed, remain on the pending page with timestamped “last checked” updates |
| `/account/orders` | List skeleton with signed-in shell intact | First-order empty state explains what will appear here and links back to `/shop` | Retry panel without collapsing account navigation | Orders grouped by current status and recency | If payment is pending or shipment not started, show that as a status chip, not an error state |
| `/account/orders/[id]` | Summary rail skeleton plus timeline placeholders | No-detail state explains if the order is missing, not yet visible, or no longer accessible | Inline error with retry and contact fallback | Visible order summary, payment state, shipment state, and timeline | If payment is confirmed but ops has not yet advanced fulfillment, show a calm “payment received, review in progress” step |
| `/ops` queue and detail | Queue stays visible while detail pane refreshes | Empty queue state explains whether filters or true zero work caused it | Inline fetch/update error scoped to the affected pane | Updated queue, detail, note, or transition confirms without full page reload | If payment, stock, or shipping data is incomplete, elevate a warning chip in the summary area instead of blocking the whole workspace |

## User Journey & Emotional Arc

- Public entry tone: premium private catalog first, compliance-forward but not compliance-dominated. The home page shows curated product proof and qualification context without exposing a browseable public catalog.
- 5-second goal: users understand that Mogtrix is a restricted research catalog, not a generic store or a dead-end gate.
- 5-minute goal: qualified users can move from discovery to checkout without re-entering the same trust decision three times.
- Long-term goal: order history and status pages feel dependable enough that customers trust Mogtrix for repeat procurement, not just one-off requests.

| Step | User does | User feels | Plan specifies? |
|------|-----------|------------|-----------------|
| 1 | Lands on public home | Curious but cautious | Yes: brand-first entry, qualification framing, curated product proof, one auth CTA |
| 2 | Chooses login or signup | Willing to continue if trust holds | Yes: auth screen reinforces who qualifies and why access is restricted |
| 3 | Verifies email | Mild friction, expects quick progress | Yes: verification state explains next step and preserves momentum |
| 4 | Completes qualification flow | Reassured if it feels like a fast one-time unlock, annoyed if it feels like bureaucracy | Yes: three-step gate, structured fields first, direct handoff into `/shop` |
| 5 | Lands in the signed-in catalog | Interested and relieved to finally move forward | Yes: top-of-page unlocked-access confirmation, product images, availability signals, account/cart nav, legal context kept secondary |
| 6 | Reviews cart and enters checkout | Focused, wants no surprises | Yes: stock drift rules, clear summary, one primary payment action |
| 7 | Returns from provider | Most anxious moment, needs proof the order exists | Yes: dedicated pending-confirmation page with order ID, recheck loop, and fallback support action |
| 8 | Opens account orders and order detail | Wants certainty about what happens next | Yes: summary rail, timeline, payment/shipment states, calm in-progress messaging |
| 9 | Staff works the order in `/ops` | Needs speed, clarity, and blocker visibility | Yes: split workspace, warnings elevated by position, actions grouped separately |

## Visual Direction & Anti-Slop Rules

- Classifier: `HYBRID`.
  - Public home, login, and signup use the brand-first Mogtrix visual language.
  - Checkout, account, and ops use calmer app-surface rules while staying recognizably Mogtrix.
- Preserve the existing design vocabulary from the current repo:
  - near-black scaffold, acid-green accent, metal surfaces, bold display type, minimal chrome
  - strong single primary action per screen
  - legal/compliance copy present but secondary to task flow
- Signed-in app surfaces deliberately tone down decorative glow and oversized hero treatment:
  - use the same palette and type system, but favor cleaner spacing, clearer data grouping, and fewer ornamental highlights
  - warnings and status states earn color by meaning, not decoration
- Product imagery is part of trust, not filler:
  - each product has one controlled primary image area with consistent aspect ratio and background treatment
  - product detail may show supporting images or zoom only if the image system stays quiet and clinical
  - no busy imagery behind copy, no stock-photo feel, no arbitrary image crops
- Motion is sparse and purposeful:
  - public entry may keep restrained atmospheric motion from the current site
  - checkout/account/ops motion is limited to loading transitions, status change feedback, and progressive disclosure
  - no ornamental carousel, floating blobs, or attention-stealing animation loops in signed-in flows
- Typography and copy hierarchy are explicit:
  - one headline, one supporting line, one primary action per major screen
  - account and ops use utility language first, not marketing copy
  - avoid repeating the same reassurance in multiple panels
  - Mogtrix voice for customer-facing surfaces is `direct clinical`: short, trusted, and plainspoken, with brand edge concentrated in headlines rather than body paragraphs
- Anti-slop guardrails:
  - the public home hero must not ship with a same-weight cluster of pills, research links, and preview actions competing with the main CTA
  - the current three-up feature-card strip is deprecated for the relaunch home page; proof points should appear as a compact adjacent-vial proof row inside the hero composition, not as a second scroll section
  - auth and qualification screens should use section dividers and progress cues, not a stack of equally styled boxed panels fighting for attention
  - no generic 3-column SaaS feature grid for signed-in surfaces
  - no stack-of-cards default when layout should create hierarchy
  - no generic white-label ecommerce theme for checkout/account
  - cards only appear when a card is the interaction, not as the default container for every section
  - the signed-in or preview shop landing must not open with a pill cloud, category matrix, and product grid all competing at once; products are the star, filters are support

## Lightweight Token & Component Contract

- `DESIGN.md` does not exist in this repo, so this plan carries the minimum design contract required for implementation.
- Before the relaunch is considered implementation-complete, the token and component rules in this section must be promoted into a repo-level `DESIGN.md`. This plan is the source material, not the final long-term home.
- Color roles map to the current site vocabulary:
  - scaffold / app background: near-black
  - surface: dark metal panel
  - primary accent: acid green, reserved for the dominant CTA and positive confirmation
  - warning: amber for lead-time or non-blocking drift
  - destructive / blocking: warm red-orange for blocking errors
  - quiet text: muted white / blue-gray for metadata and helper copy
- Type roles:
  - public entry pages may use large bold display headlines
  - signed-in app pages use smaller but still weighty headings, utility subheads, and tabular metadata where useful
  - status labels and chips stay concise and operational, not promotional
- Component usage:
  - buttons follow the current primary / outline / ghost split
  - form controls keep the current rounded dark-input treatment and 44px minimum touch target
  - status chips, warning rows, and summary rails are added as first-class patterns for checkout/account/ops
  - account and ops screens prefer rails, panes, and grouped lists before introducing new card variants
- Copy rules:
  - default voice is premium private catalog, not educational audit portal
  - legal and compliance language stays present but should sit beside the task, not drown it
  - every major screen gets one primary CTA; secondary actions are visually quieter
  - copy tone should borrow the reference sites' discipline: short, plainspoken, direct, and human, without copying their exact wording
  - hero, auth, shop, and product copy should sound like a confident operator talking to a qualified buyer, not like an AI-generated brand strategy memo
  - each text block should make one concrete point; if a sentence starts explaining the interface instead of helping the buyer decide, cut it
  - headline rule: keep the harder Mogtrix edge in the headline only, then immediately switch to calm customer language in supporting copy
  - body-copy rule: prefer one-sentence blocks under 18 words where possible; cut filler like `simpler way`, `continue into`, `unlock`, `seamless`, or any sentence that describes the funnel instead of the value
  - default CTA language should be literal, not theatrical: `Sign in`, `Create account`, `View access rules`, `View product`, `Open COA library`
  - auth-copy rule: say exactly what the customer gets after sign-in in one sentence, then stop
  - restriction-copy rule: access and RUO language should be calm and matter-of-fact, not defensive or melodramatic

## Responsive & Accessibility Rules

- Mobile navigation pattern:
  - keep the sticky top bar
  - use a drawer menu for primary navigation on mobile
  - keep cart and account utility actions visible in the header instead of burying everything behind one icon
- Viewport behavior:
  - desktop: split layouts for `/ops`, `/account/orders/[id]`, and product detail
  - tablet: keep two-column layouts where hierarchy still reads clearly, otherwise collapse secondary rails below the primary content
  - mobile: stack content intentionally in task order, not just by source order; summary first, blockers second, actions last
- Public home on mobile:
  - keep the richer branded home, but collapse the adjacent vial proof into a two-up row with a hint of the third vial instead of a full three-up grid
  - do not turn the first screen into a swipe carousel or a second stacked product section
  - primary CTA and access-rules link stay readable before the user scrolls
- Qualification on mobile:
  - one step visible at a time
  - sticky progress indicator and step title
  - helper copy limited to one short paragraph plus optional reveal for more detail
  - keyboard should never hide the active field label or primary CTA without a clear way back
- Checkout on mobile:
  - order summary stays reviewable without forcing long back-and-forth scrolling
  - the primary payment action remains reachable after legal/attestation content
  - blocking stock issues appear inline next to the affected item, not only at the top of the page
- Accessibility floor:
  - 44px minimum touch targets for interactive controls
  - visible keyboard focus states on all nav, CTA, and form elements
  - dialog semantics and focus trapping for qualification or auth-related overlays
  - ARIA landmarks for header, main, nav, order summary, and status timeline regions
  - status changes announced with polite live regions where the user would otherwise miss them
  - contrast must hold without relying on glow or blur effects
- Content behavior:
  - truncate or wrap long order IDs, names, and organization strings without breaking layout
  - timeline and queue items stay readable for keyboard and screen-reader users

## Customer-Facing Status Model

- Customer surfaces do not expose raw internal workflow labels by default.
- Internal `checkout_state`, `payment_state`, and staff review state map into a smaller customer-facing set:
  - `Action needed`: the customer must complete auth, qualification, cart changes, or a failed payment retry
  - `Payment pending`: payment handoff completed but confirmation is still syncing
  - `Paid, under review`: payment received and Mogtrix is validating / preparing the order
  - `Preparing shipment`: fulfillment work is in progress and no customer action is required
  - `Completed`: the order is fulfilled, shipped, or otherwise finished
  - `Issue / follow-up required`: Mogtrix needs customer action or manual resolution
- Each customer-facing state must include:
  - plain-language explanation
  - whether customer action is required
  - the next expected step or update
- `/account/orders` uses these simplified states as chips and grouping labels.
- `/account/orders/[id]` may show more detail in the timeline, but the header state remains customer-friendly.
- `/ops` keeps the richer internal statuses needed for staff work, with customer-facing labels shown only when staff need to confirm what the customer sees.

## Autoplan Phase 1: CEO Review

### 0A. Premise Challenge

- The plan currently assumes that "full checkout" is the next bottleneck because the repo lacks commerce primitives. Both independent CEO voices challenged that premise. The stronger strategic question is whether Mogtrix needs true self-serve ecommerce now, or whether it needs the fastest compliant path from qualified interest to accepted paid order.
- The plan also assumes that strict pre-browse gating is a compliance necessity. The current repo and tests show the opposite posture today: public discovery with request-only collection and no public pricing. That means the gating choice is not just implementation detail, it is a top-of-funnel bet.
- The plan assumes a separate customer identity model can coexist cleanly with staff-only `profiles`. The current auth trigger disproves that today by creating a `profiles` row for every new auth user and marking it `staff` by default.
- Review baseline for `/autoplan`: continue evaluating the current direction so the user gets a full review, but surface the wedge and identity-model challenges at the final approval gate as user challenges.

### 0B. Existing Code Leverage

| Sub-problem | Existing code to reuse | Reuse quality | CEO take |
|---|---|---|---|
| Staff auth and protected ops access | `site/app/ops/login/page.tsx`, `site/app/ops/actions.ts`, `site/lib/ops.ts`, `site/lib/supabase/proxy.ts` | Strong | Real leverage, but currently staff-shaped only. |
| Public catalog browsing | `site/app/shop/page.tsx`, `site/app/products/[slug]/page.tsx`, `site/lib/catalog.server.ts` | Strong | Already good enough to support a narrower discovery-first wedge. |
| Cart and item collection | `site/lib/cart-store.ts`, `site/components/cart-view.tsx`, `site/components/product-detail-actions.tsx` | Medium | Reusable UI, but browser-local persistence conflicts with authenticated repeat procurement. |
| Request intake persistence | `site/app/api/research-requests/route.ts`, `site/lib/request.server.ts`, Supabase request tables and RPC | Strong | Best current backbone for paid-intake or pay-after-approval. Less convincing as a long-term canonical orders ledger. |
| Ops review and state transitions | `site/app/ops/(protected)/page.tsx`, `site/app/ops/(protected)/requests/[id]/page.tsx`, `site/lib/ops.ts` | Strong | Valuable continuity, but preserving it too literally risks moving payment earlier without adding true operating leverage. |
| Product media foundation | `public.product_images` in `site/supabase/migrations/20260501194000_backend_foundation.sql` | Partial | Table exists already, so the plan should treat this as wiring work, not net-new modeling. |

### 0C. Dream State Mapping

```text
CURRENT
  Public catalog discovery
    -> Request list
      -> Manual intake submission
        -> Staff review

THIS PLAN
  Branded private entry
    -> Auth + qualification
      -> Catalog + cart
        -> Checkout + payment
          -> Paid order tracking
            -> Staff review / fulfillment

12-MONTH IDEAL
  Public or semi-public discovery
    -> Approved buyer identity
      -> Trusted pricing + inventory
        -> Fast payment or approved invoicing
          -> Transparent fulfillment + reorder loop
            -> Lower-touch ops, measurable conversion, repeat procurement
```

### 0C-bis. Implementation Alternatives

| Approach | Description | Effort | Upside | Strategic risk |
|---|---|---:|---|---|
| A. Current plan | Full gated browse, auth, checkout, account history, provider abstraction, paid order tracking | High | Most complete customer surface | May solve the wrong wedge first and overfit to a manual backend |
| B. Pay-after-approval wedge | Keep public discovery, convert request intake into approved request -> payment link -> order tracking | Medium | Fastest path to revenue proof with current ops model | Feels less like "real ecommerce" in marketing terms |
| C. Discovery-first commerce | Keep public browsing, gate price/cart/checkout, choose one processor, add buyer accounts gradually | Medium-high | Better acquisition and compliance tradeoff | Requires stronger position on public product visibility |

- Autoplan continuation decision: keep reviewing Approach A because it is the user-stated direction and the current plan is already written around it.
- User challenge queued for final gate: both outside voices prefer a narrower wedge between B and C before a full gated checkout rebuild.

### 0D. Mode-Specific Analysis

- Mode: `SELECTIVE_EXPANSION`.
- Auto-approved within blast radius:
  - add explicit business success criteria to the plan
  - add an alternatives matrix and launch-thesis section
  - add identity-model correction as a phase-zero prerequisite
- Deferred rather than auto-added:
  - org accounts, approvers, PO/invoice, tax-exempt flows
  - saved carts and multi-device draft persistence
  - reserved inventory and harder fulfillment guarantees
- Reason for deferral: these items are strategically important, but they materially change the product wedge. They belong in final-gate taste or user-challenge framing, not silent scope creep.

### 0E. Temporal Interrogation

- Hour 1: the team can wire customer auth, gated routes, and a draft checkout UI quickly because the repo already has catalog, cart, request validation, and staff auth scaffolding.
- Hour 6: the real work appears. Identity-model separation, payment-provider choice, request-table mutation, fulfillment-state semantics, and new RLS rules turn this from "UI plus endpoints" into a new operating system for orders.
- Six months: if the wedge is wrong, Mogtrix ends up with polished checkout UI on top of a still-manual paid-intake workflow. That is the kind of thing teams call "ecommerce" internally while users call it confusing.

### 0F. Mode Selection Confirmation

- Confirmed mode for `/autoplan`: `SELECTIVE_EXPANSION`.
- Practical meaning: keep the current plan intact for review, auto-add obvious clarity and launch-metric work, defer heavier wedge changes to the final gate instead of rewriting the product out from under the user.

### CEO Dual Voices

**CODEX SAYS (CEO — strategy challenge):**
- The plan may be architecture in search of a business model.
- Gating all browsing before value is shown is a commercial bet, not a neutral compliance step.
- Provider abstraction before provider choice is likely fake flexibility.
- The current scope optimizes control and internal neatness before discovery and repeat procurement.

**CLAUDE SUBAGENT (CEO — strategic independence):**
- The plan is operationally detailed but still solving an assumed problem.
- The current repo posture suggests discovery-first request intake, not incomplete ecommerce.
- The identity model and customer/order backbone decisions are not implementation details, they are phase-zero architecture choices.
- Business success criteria are missing, so the team could ship this and still not know if the strategy worked.

```text
CEO DUAL VOICES — CONSENSUS TABLE:
═══════════════════════════════════════════════════════════════
  Dimension                           Claude  Codex  Consensus
  ──────────────────────────────────── ─────── ─────── ─────────
  1. Premises valid?                  NO      NO      CONFIRMED
  2. Right problem to solve?          NO      NO      CONFIRMED
  3. Scope calibration correct?       NO      NO      CONFIRMED
  4. Alternatives sufficiently explored? NO   NO      CONFIRMED
  5. Competitive / market risks covered? NO   NO      CONFIRMED
  6. 6-month trajectory sound?        NO      NO      CONFIRMED
═══════════════════════════════════════════════════════════════
```

### Section 1. Architecture Review

- The strongest architectural risk at the CEO layer is not code shape, it is model shape. `research_order_requests` was designed for anonymous intake snapshots, while the current plan wants it to become a durable customer-owned order ledger with payment, shipping, and customer timeline semantics.
- The current repo also hardcodes every new `auth.users` signup into `public.profiles` as `staff`, which means the "separate customer model" premise is false in the current system. This is a strategic architecture mismatch, not a minor migration footnote.
- Architecture conclusion: do not let implementation start until the team explicitly chooses whether to extend the request model or introduce canonical `orders`, and whether identity is unified or truly split.

```text
CEO SYSTEM ARCHITECTURE

Public visitor
  -> public catalog pages
    -> cart draft
      -> checkout / payment intent
        -> customer order record
          -> staff ops workspace
            -> fulfillment / updates

Phase-zero decisions sitting underneath everything:
  auth model
    -> customer model vs staff profile model
  order model
    -> extend request table vs create canonical orders
  payment strategy
    -> real provider choice vs placeholder abstraction
```

### Section 2. Error & Rescue Map

| Failure | Why it matters | Rescue path |
|---|---|---|
| Checkout is not the real bottleneck | Team ships months of product work without revenue proof | Run a narrower pilot wedge first, measure conversion and staff time, then widen |
| Customer auth leaks into staff profile model | Customer signup creates staff-shaped rows and policy confusion | Fix identity architecture before enabling customer auth |
| Users pay into a still-manual review queue | Trust drops when "checkout complete" does not mean fulfillment certainty | Rename the offer honestly or raise the operational bar before using full-checkout language |
| Gating destroys discovery | Top-of-funnel shrinks before value is shown | Public or semi-public browse, gate price or checkout instead |
| Provider abstraction delays the real decision | Engineering invests in interface cleanliness instead of commercial learning | Pick one real provider and prove the path end to end |

### Section 3. Security & Threat Model

- The current plan repeatedly invokes RUO, age, qualification, and private catalog language, but the concrete controls are still light: auth, email verification, one-time attestations, and later staff review. If stronger entity or shipping controls are actually required, the security and compliance model is underbuilt.
- If those stronger controls are not required, the gating posture becomes performative friction that damages discovery and trust. Either way, the threat model needs a more explicit statement of what is actually being prevented.

### Section 4. Data Flow & Interaction Edge Cases

- The plan is good on visual states, but thin on commercial edge cases: cancellations, refunds, disputes, buyer-org handoff, shared purchasing, and when a paid order must be rolled back because stock or qualification changed.
- That matters because these are not fringe scenarios once payment is live. They are the difference between a request portal with payment attached and a durable procurement product.

### Section 5. Code Quality Review

- Reuse discipline is mostly good. The plan leans on real repo structures instead of proposing a rewrite.
- The quality risk is semantic overloading, not duplication. Turning current request entities into long-term orders without a clean boundary is the kind of "simple now, muddy forever" move that keeps paying interest.

### Section 6. Test Review

- The current test plan is software-heavy and business-light. It proves route flow, webhook behavior, and ops reconciliation, but it does not prove that the new wedge improves qualified conversion or lowers staff friction.
- CEO test requirement added by this review: define launch metrics alongside code verification. Without them, the plan can be technically green and strategically blind.

### Section 7. Performance Review

- System performance is not the primary CEO risk. The bigger performance problem is operational throughput: if staff still mediate every paid order, the real bottleneck is staff minutes per order, not database latency.
- That should be measured explicitly in launch criteria, otherwise the team may celebrate a faster frontend while the business remains just as manual.

### Section 8. Observability & Debuggability Review

- The plan needs funnel and ops instrumentation, not just application logs. At minimum it needs browse-to-auth, auth-to-checkout-start, checkout-start-to-paid, paid-to-fulfilled, exception rate, and staff touches per order.
- Without that layer, the product team will not know whether failures are technical, commercial, or operational.

### Section 9. Deployment & Rollout Review

- The fallback posture is sensible. Keeping the current request portal available protects the business from a bad launch.
- What is missing is the go/no-go rule. The plan needs an explicit threshold for when paid checkout graduates from pilot experiment to default path.

### Section 10. Long-Term Trajectory Review

- The long-term opportunity is not "become an ecommerce site." It is "become the fastest trusted way for a qualified buyer to discover, qualify, pay, and track a Mogtrix order."
- If that is the actual trajectory, then org purchasing, repeat-order mechanics, and lower-touch ops eventually outrank several of the current v1 scope choices.

### Section 11. Design & UX Review

- The plan is no longer design-naive. The current design pass fixed the hierarchy, state, and layout gaps that would have made implementation sloppy.
- The remaining UX issue is strategic, not visual: if the business wedge is wrong, the best-designed gated checkout still loses because it asks for commitment before it proves value.

## Dream State Delta

- Current plan after design review: credible gated checkout/account/ops product with better state coverage and clearer customer language.
- Twelve-month ideal from the CEO pass: trusted discovery, clearer buyer qualification, real payment/fulfillment certainty, repeat procurement mechanics, and measured operating leverage.
- Delta: the current plan is strong on customer surface completeness, weaker on revenue-proof wedge selection and long-term buyer workflow fit.

## Error & Rescue Registry

See Section 2 above. High-confidence rescue themes:
- choose the narrowest wedge that proves demand fastest
- fix identity architecture before customer auth
- define launch metrics before shipping checkout

## Failure Modes Registry

| Failure mode | Severity | Why it fails |
|---|---|---|
| Wrong wedge, right implementation | Critical | Team ships polished checkout that does not meaningfully improve conversion or fulfillment throughput |
| Customer signup collides with staff profile architecture | Critical | Identity and RLS model diverge from the plan before customer auth even starts |
| Paid checkout overpromises fulfillment certainty | High | Users pay with ecommerce expectations, then hit manual-review ambiguity |
| Discovery falls due to pre-browse gating | High | Acquisition and trust decline before product value is shown |
| Request table becomes a muddy long-term order model | High | Reorders, fulfillment, and reporting become harder with every extension |
| Business success is unmeasured | High | Launch ships, but the company learns nothing decisive |

## Completion Summary

```text
+====================================================================+
|                  CEO REVIEW — COMPLETION SUMMARY                   |
+====================================================================+
| Step 0               | SELECTIVE_EXPANSION, 3 auto-adds, 3 defers  |
| Section 1 (Arch)     | identity + order-model challenge flagged     |
| Section 2 (Rescue)   | registry produced                            |
| Section 3 (Security) | compliance posture underdefined              |
| Section 4 (Edges)    | commercial edge cases missing                |
| Section 5 (Quality)  | reuse good, semantics muddy                  |
| Section 6 (Tests)    | business metrics gap flagged                 |
| Section 7 (Perf)     | ops throughput > page latency                |
| Section 8 (Obs)      | funnel + ops instrumentation missing         |
| Section 9 (Rollout)  | fallback good, go/no-go missing              |
| Section 10 (Long)    | wrong-wedge risk high                        |
| Section 11 (Design)  | visual plan strong, strategic UX risk remains|
| NOT in scope         | written (5 items + CEO defers)               |
| What already exists  | written                                       |
| Failure modes        | 6 total, 2 CRITICAL GAPS                     |
| Dual voices          | 6/6 confirmed, 0 disagreements               |
+====================================================================+
```

## Autoplan Phase 2: Design Review Revalidation

- Input basis: the plan already contains a fresh full `/plan-design-review` pass on this branch, including screen hierarchy, interaction-state matrix, layout model, token contract, responsive rules, customer status model, and prior dual-voice findings.
- CEO Phase 1 did not add net-new screens or components. It added strategic pressure on the wedge, compliance posture, and launch thesis. That means the design job here is revalidation, not redesign.
- Revalidation outcome: the existing design review still holds. The plan is strong on route jobs, state handling, account/ops layout, and anti-slop guardrails. The remaining design risk is the same cross-phase theme from CEO: if discovery is gated too early, the UX may be polished but still commercially wrong.

```text
DESIGN REVALIDATION SCORECARD
═══════════════════════════════════════════════════════════════
  Pass                                    Score   Outcome
  ─────────────────────────────────────── ─────   ───────────────────────────────
  1. Information Architecture             9/10    clear route jobs + nav flow
  2. Interaction State Coverage           9/10    state matrix already strong
  3. User Journey & Emotional Arc         8/10    good sequencing, wedge risk remains
  4. AI Slop Risk                         9/10    explicit anti-slop rules in plan
  5. Design System Alignment              8/10    lightweight contract, no DESIGN.md
  6. Responsive & Accessibility           9/10    concrete mobile + a11y rules
  7. Unresolved Design Decisions          9/10    current UI ambiguities mostly resolved
═══════════════════════════════════════════════════════════════
```

```text
DESIGN DUAL VOICES — REUSED CONSENSUS
═══════════════════════════════════════════════════════════════
  Check                                    Prior result
  ─────────────────────────────────────── ─────────────────────
  Brand unmistakable in first screen?      previously fixed
  One strong visual anchor?                previously fixed
  Scannable by headlines only?             previously fixed
  Each section has one job?                previously fixed
  Cards actually necessary?                guarded by layout rules
  Motion improves hierarchy?               constrained and intentional
  Premium without decorative shadows?      addressed via calmer signed-in surfaces
═══════════════════════════════════════════════════════════════
```

- Phase 2 conclusion: keep the existing design additions. Do not auto-expand UI scope further here.
- Cross-phase note: the only design question reopened by CEO is whether full pre-browse gating is strategically worth the friction. That stays a final-gate user challenge, not an auto-edit.

## Autoplan Phase 3: Engineering Review

### 0A. Scope Challenge Against Current Code

| Sub-problem | Existing code to reuse | Reuse quality | Engineering take |
|---|---|---|---|
| Customer identity and auth | `site/supabase/migrations/20260502004000_ops_auth_and_transitions.sql`, `site/app/ops/actions.ts`, `site/lib/ops.ts`, `site/lib/supabase/proxy.ts` | Low | Current auth is staff-shaped. Customer auth is blocked until the principal model and trigger behavior are changed. |
| Private catalog gating | `site/app/shop/page.tsx`, `site/app/api/catalog/route.ts`, `site/lib/catalog.server.ts`, public product and image RLS, `site/app/sitemap.ts`, `site/app/robots.ts` | Low | Current catalog data is public at the data layer. Route gating alone does not create a private catalog. |
| Order persistence backbone | `create_research_order_request` RPC plus `research_order_requests`, items, consent logs, status history, notes | Medium | Strong fallback backbone for paid intake or request fallback; weak canonical ledger for long-lived orders, payments, and customer timelines. |
| Customer access state machine | `site/lib/age-gate-store.ts`, `site/components/age-gate.tsx`, ops-only `site/proxy.ts` matcher | Low | Current gate is browser-local and `/ops`-only. A four-state customer journey needs one server-owned guard path. |
| Cart and draft checkout | `site/lib/cart-store.ts`, `site/components/cart-view.tsx`, `site/components/product-detail-actions.tsx` | Medium | Good same-device collection shell, brittle across email verification, provider redirects, and stale catalog rows. |
| Staff ops continuity | `site/app/ops/(protected)/*`, `site/lib/ops.ts`, ops routes/tests | High | Best reuse in the repo. Keep the queue and staff tools, but do not let that dictate the canonical customer order model. |

- Complexity check outcome: the plan is implementable, but not in the current order. Identity, privacy, and order-ledger boundaries are phase-zero decisions, not polish work.
- Current code reality that matters most:
  - every new `auth.users` row currently becomes an inactive `public.profiles` staff record
  - product and product-image reads are anonymous today, and `/api/catalog` exposes them without auth
  - request creation currently goes through a service-role RPC optimized for intake snapshots, not customer-owned order lifecycles
  - middleware only guards `/ops`, while age/RUO gating is local-storage based and client-owned

### 0.5. Eng Dual Voices

**CODEX SAYS (eng — architecture challenge):**
- Codex CLI completed independent repo inspection across the plan, auth trigger, ops middleware, public catalog surfaces, and request intake path, but it never returned a structured final verdict before local CLI state and plugin noise stalled the session.
- Formal codex consensus is therefore unavailable for Phase 3.
- Even without a final structured answer, the inspection converged on the same pressure points this review hit: principal-model mismatch, route gating vs data privacy, request-ledger coupling, and auth-state transitions.

**CLAUDE SUBAGENT (eng — independent review):**
- Critical: customer auth conflicts with the current auth schema because every signup is still auto-written into staff-only `profiles`.
- High: a "private catalog" is not private if anonymous RLS and `/api/catalog` still expose product data.
- High: turning `research_order_requests` into the canonical paid-order ledger creates tight coupling between intake snapshots, staff review, payment state, and customer history.
- High: the auth, verification, and qualification state machine is underspecified and cannot safely piggyback on the current local-storage age gate plus `/ops`-only middleware.
- High: keeping the cart browser-local is much riskier once verification and external payment redirects enter the flow.
- High: soft inventory rules need explicit paid-but-unfulfillable recovery paths, not just pre-checkout warnings.
- Medium-high: the payment adapter is probably premature abstraction before the first real provider defines the actual event contract.
- High: the current test plan is too happy-path heavy for catalog privacy, RLS isolation, webhook retries, stale inventory, and concurrent edits.

```text
ENG DUAL VOICES — CONSENSUS TABLE:
═══════════════════════════════════════════════════════════════
  Dimension                           Claude  Codex  Consensus
  ──────────────────────────────────── ────── ────── ─────────
  1. Architecture sound?              NO      N/A    N/A
  2. Test coverage sufficient?        NO      N/A    N/A
  3. Performance risks addressed?     NO      N/A    N/A
  4. Security threats covered?        NO      N/A    N/A
  5. Error paths handled?             NO      N/A    N/A
  6. Deployment risk manageable?      NO      N/A    N/A
═══════════════════════════════════════════════════════════════
Missing codex verdict = no formal consensus. Single critical findings still count.
```

### Section 1. Architecture Review

```text
Public home (/)
  -> /login, /signup
      -> auth.users
          -> customer principal + qualification record
              -> shared customer access guard
                  -> middleware
                  -> server loaders
                  -> route handlers / APIs
                      -> /shop, /products/[slug], /cart, /checkout, /account/*

Qualified catalog path
  -> products + product_images
      -> private catalog policies
      -> /api/catalog
      -> product detail queries

Checkout path
  -> cart state (browser-local or server draft)
      -> draft order / canonical order
          -> /api/payments/checkout-session
              -> provider
              -> /api/payments/webhook
                  -> payment events
                  -> order state / customer timeline
                  -> /account/orders/*
                  -> /ops queue + detail

Staff path
  -> /ops/login
      -> staff membership / activation
          -> /ops
              -> notes
              -> transitions
              -> reconciliation
```

- Architecture verdict: workable only after three phase-zero corrections.
  - separate staff membership from generic authenticated principals before customer signup starts
  - decide whether the canonical commerce ledger stays inside `research_order_requests` or splits into `orders`, `payments`, and `order_events`
  - treat private-catalog access as a data-policy problem, not a page-routing problem
- Scaling and coupling risk:
  - if the current request table becomes the customer order ledger, customer-visible state, staff review state, payment state, and fulfillment exceptions all couple to the same entity too early
  - if page gating ships without policy changes, the "private catalog" promise fails immediately
  - if the customer guard is not centralized, SSR, CSR, API routes, and direct links will diverge
- Auto-decision from this section: add identity-model repair, data-layer privacy, and server-owned qualification state as prerequisites in the plan.
- User challenge from this section: both the primary engineering review and the independent engineer think a separate canonical order model is likely the cleaner long-term move. The current plan still keeps the existing request backbone so the user can explicitly approve or reject that challenge at the final gate.

### Section 2. Code Quality Review

- Semantic debt risk is high if paid-order code keeps the current `research_request` naming everywhere. `ResearchRequestSubmission`, `/api/research-requests`, request-only copy, and status enums currently describe intake, not paid ownership or fulfillment.
- `site/components/cart-view.tsx` currently collapses stale or missing catalog rows into an effectively empty cart. That is acceptable for anonymous intake, but not for an authenticated checkout flow where the user expects recovery instead of disappearance.
- `site/proxy.ts` and `site/lib/supabase/proxy.ts` are intentionally narrow today. Reusing them by accretion for customer gating would create hidden branching. A separate shared customer access guard is clearer than smuggling customer state into ops-only helpers.
- `create_research_order_request` is currently a service-role RPC optimized for validated intake writes. If customer checkout reuses that pattern, threat modeling must expand to payment reference writes, ownership writes, and webhook-only state transitions.

### Section 3. Test Review

- Current reusable coverage is narrow but real:
  - request validation and request route tests prove intake input-shaping and RPC error mapping
  - ops route and helper tests prove staff transitions and access activation rules
  - one browser flow proves public browse -> request list -> request submission
- That baseline does not cover the new lifecycle the plan introduces. The new system needs lifecycle, policy, concurrency, and recovery coverage, not just happy-path page tests.

| New lifecycle / branch | Key codepaths | Coverage needed | Exists now? | Decision |
|---|---|---|---|---|
| Customer signup -> verification -> customer principal creation | auth trigger replacement, customer profile creation, verify-email route/state | integration + browser + migration test | No | Add |
| Verification + RUO/age qualification direct-link gating | shared customer guard, middleware, server loaders, qualification write path | integration + browser | No | Add |
| Private catalog access blocked for anonymous users | product RLS, `site/app/api/catalog/route.ts`, sitemap/robots exposure | policy/sql + route + browser | No | Add |
| Same-device cart survives verify-email and provider-return path | `site/lib/cart-store.ts`, checkout loader, return screen | browser | No | Add |
| Checkout session creation fails closed | payment config loader, `/api/payments/checkout-session` | unit + route | No | Add |
| Webhook duplicate, retry, and out-of-order delivery | `/api/payments/webhook`, event persistence, order transitions | integration | No | Add |
| Customer order history and detail isolation | customer RLS, `/account/orders`, `/account/orders/[id]` | policy/sql + integration | No | Add |
| Inventory drift before payment session and after paid webhook | checkout validation, webhook application, exception states | unit + integration | No | Add |
| Concurrent staff/customer edits | `/ops` updates vs customer status reads | integration | No | Add |
| Pending-payment timeout and manual rescue | payment return screen, polling/recheck logic, ops reconciliation | browser + integration | No | Add |

- Detailed artifact written to: `/Users/fabriciorodriguez/.gstack/projects/Mogtrix-website-v1/fabriciorodriguez-clean-mogtrix-rebuild-test-plan-20260502-224201.md`
- Test review decision: keep current request-intake tests as fallback coverage, but do not count them as checkout readiness. Real Supabase policy tests plus one sandboxed payment E2E are mandatory before calling the relaunch "full checkout."

### Section 4. Performance Review

- If new customer, payment, and shipping fields land on `research_order_requests`, add indexes for customer ownership, payment state, and checkout state before using them in `/ops` or `/account/orders`.
- Avoid N+1 query drift on product images, order items, status history, and notes when building account detail and ops detail pages.
- Payment webhook processing must be idempotent and cheap on duplicates. Duplicate delivery should hit a stored event ledger and no-op quickly.
- The pending-payment return page needs bounded recheck intervals and a calm manual fallback; otherwise the plan trades payment uncertainty for polling noise.

## Engineering Failure Modes Registry

| Failure mode | Severity | Critical gap? | Why it fails |
|---|---|---|---|
| Customer signup still creates staff-shaped profiles | Critical | Yes | Customer auth and staff auth collide before the first browse gate even works |
| UI is gated but catalog data remains public | Critical | Yes | Private-catalog promise fails at the API/RLS layer |
| Request table becomes a mixed intake/order/payment ledger | High | Yes | State semantics rot, reporting gets muddy, and RLS rules become brittle |
| Verification and qualification redirects loop or bypass | High | No | Customer journey fragments across SSR, CSR, and direct links |
| Browser-local cart is lost after verify-email or provider return | High | No | Users return to an empty or stale checkout context |
| Duplicate or out-of-order webhooks double-advance state | High | No | Payment truth diverges from order truth |
| Paid order becomes unfulfillable after stock drift | High | No | Ops and customer surfaces need an exception path, not silent failure |
| Staff/internal state and customer-visible state drift apart | Medium-high | No | Customers see ambiguous progress while ops sees richer internal reality |

## Completion Summary

```text
+====================================================================+
|               ENGINEERING REVIEW — COMPLETION SUMMARY              |
+====================================================================+
| Step 0 (Scope)       | 6 repo hotspots mapped against real code    |
| Dual voices          | Claude returned 8 issues; Codex unavailable |
| Section 1 (Arch)     | 3 phase-zero blockers flagged              |
| Section 2 (Quality)  | naming + coupling debt called out          |
| Section 3 (Tests)    | lifecycle matrix written, artifact created |
| Section 4 (Perf)     | webhook/idempotency/indexing risks flagged |
| NOT in scope         | reused from existing plan sections          |
| What already exists  | reused from existing plan sections          |
| Failure modes        | 8 total, 3 critical gaps                   |
| Consensus table      | produced, formal consensus unavailable     |
+====================================================================+
```

> **Phase 3 complete.** Codex: structured verdict unavailable after independent repo inspection. Claude subagent: 8 issues.
> Consensus: 0/6 formally confirmed, 0 disagreements, 6 unavailable because the codex voice stalled before returning a verdict.
> Passing to Phase 3.5 (DX Review) or Phase 4 (Final Gate).

## Autoplan Phase 3.5: DX Review

- Phase 3.5 skipped — no developer-facing scope detected.

## Cross-Phase Themes

- **Theme: Identity model is a phase-zero blocker** — flagged in Phase 1 and Phase 3. High-confidence signal.
- **Theme: Browse gating is not just UX, it is a business and security decision** — flagged in Phase 1, Phase 2, and Phase 3. High-confidence signal.
- **Theme: provider abstraction before provider choice is risky** — flagged in Phase 1 and Phase 3. High-confidence signal.
- **Theme: extending request intake into the canonical order ledger creates long-term debt** — flagged in Phase 1 and Phase 3. High-confidence signal.

## What Already Exists

- Existing visual system to reuse:
  - dark scaffold, metal surfaces, acid-green accent, bold display typography, minimal chrome
- Existing components and patterns to reuse:
  - sticky header and compliance footer
  - current button variants and dark form controls
  - age-gate / qualification overlay pattern
  - cart/request list item editing pattern
  - ops queue + detail mental model, now upgraded into a split workspace
- Existing product constraints to preserve:
  - premium private-catalog voice
  - compliance guardrails present but quieter than the current request-portal framing

## Not In Scope

- Public anonymous catalog browsing in v1
- Saved carts or multi-device cart sync
- Reserved inventory / hard stock allocation before checkout completion
- A full standalone design-system project before this relaunch ships
- Decorative marketing expansion that weakens the private-catalog / research posture

## Deferred Follow-Ups

- Create `DESIGN.md` from the lightweight token, type, and component rules in this plan before implementation drifts.
- Create a screen-by-screen copy sheet for home, auth, qualification, shop, and product pages so implementation does not reintroduce AI-slop filler copy.
- Fix gstack designer access, currently blocked by OpenAI organization verification, and generate approved mockups for the customer journey and `/ops` workspace before frontend implementation begins.
- Run `/design-review` after implementation to catch visual drift, mobile issues, and missing empty/error-state polish.

- Historical note: the `GSTACK REVIEW REPORT` section below records earlier point-in-time review entries. The `/autoplan` phase summaries above are the latest review state for this plan.

### Navigation flow
```text
Customer journey
  Public home (/)
    -> Login / Signup
      -> Email verification
        -> 3-step qualification flow
          -> Shop
            -> Product detail
              -> Cart
                -> Checkout
                  -> Confirmation / payment-pending return
                    -> Account orders
                      -> Order detail + timeline

Staff journey
  Staff login
    -> Ops queue
      -> Ops order detail
        -> Status update / note / reconciliation
```

## Test Plan
- Detailed lifecycle matrix artifact: `/Users/fabriciorodriguez/.gstack/projects/Mogtrix-website-v1/fabriciorodriguez-clean-mogtrix-rebuild-test-plan-20260502-224201.md`
- Unit: customer auth/session helpers, payment adapter contract, fail-closed payment config, stock validation, checkout state transitions.
- Integration: signed-in customer can browse gated catalog, submit checkout, see order history; webhook updates payment state; staff sees same order and updates review state; policy tests prove catalog privacy and customer-to-customer isolation.
- Browser/E2E: signup -> verify -> browse -> checkout -> webhook -> ops review -> customer status view, plus pending-payment, stale-cart, and stale-inventory rescue paths.
- Release gate: preview deploy with real Supabase and the chosen payment sandbox before production.

## Assumptions
- Full customer checkout is no longer a same-night launch.
- Catalog is hidden until customer sign-in.
- Payment processor is undecided; architecture must stay pluggable until one provider is approved and tested.
- `profiles` remains staff-only; customer accounts are separate.
- Inventory is soft/manual in v1 and validated at checkout, not reserved on add-to-cart.
- If you reverse course and still need an order-taking flow tonight, the existing request-intake portal remains the fallback once Supabase and ops are verified.

## Decision Audit Trail

| # | Phase | Decision | Classification | Principle | Rationale | Rejected |
|---|-------|----------|----------------|-----------|-----------|----------|
| 1 | Intake | Use `plans/mogtrix-full-checkout-relaunch-plan.md` as the `/autoplan` target | Mechanical | Bias toward action | It is the active reviewed plan in this thread and already contains the latest design pass. | other open plan tabs |
| 2 | Intake | Use the current plan and `site/` repo as authority, not the April 30 design doc | Mechanical | Explicit over clever | The found design doc is for a different educational mockup artifact and would distort this commerce relaunch review. | stale cross-project design doc |
| 3 | Intake | UI scope = yes | Mechanical | Completeness | The plan adds auth, catalog gating, checkout, account history, and ops UI changes. | n/a |
| 4 | Intake | DX scope = no | Mechanical | Pragmatic | The plan mentions APIs and webhooks, but the shipped product is customer-facing, not a developer tool with getting-started/docs/API ergonomics as the user-facing job. | forced DX pass from keyword noise |
| 5 | Phase 1 | Keep reviewing the current full-checkout direction instead of silently rewriting to a narrower paid-intake wedge | User challenge | Scope challenge never reduce | Both CEO voices challenged the wedge, but the user's stated direction should stand until they explicitly change it. | unapproved wedge rewrite |
| 6 | Phase 1 | Add launch thesis, success criteria, and go/no-go thresholds to the plan | Auto-add | Completeness | The CEO pass showed the plan could ship technically green while remaining strategically blind. | vague launch conditions |
| 7 | Phase 2 | Reuse the existing fresh design review as the Phase 2 baseline | Mechanical | Pragmatic | CEO pressure changed strategy, not screen inventory, so a revalidation pass was the efficient path. | redundant full redesign pass |
| 8 | Phase 3 | Make identity-model repair a phase-zero prerequisite for customer auth | Auto-add | Explicit over clever | The current auth trigger writes every new auth user into staff-only `profiles`, so customer signup cannot be bolted on later. | treating auth conflict as implementation detail |
| 9 | Phase 3 | Treat private-catalog access as a data-policy and API-security requirement | Auto-add | Completeness | Anonymous product policies and `/api/catalog` mean route gating alone does not produce a private catalog. | route-only gating |
| 10 | Phase 3 | Keep browser-local cart as a user challenge, but constrain v1 to same-device completion and add recovery coverage | User challenge | Bias toward action | The user explicitly chose a browser-local cart, but engineering review found provider-return and verification recovery risk. | silent move to saved carts or server drafts |
| 11 | Phase 3 | Add webhook revalidation and paid-but-unfulfillable exception states | Auto-add | Failure modes first | Soft inventory plus payment webhooks needs an explicit remediation path or order truth becomes ambiguous. | optimistic warning-only inventory flow |
| 12 | Phase 3.5 | Skip DX review | Mechanical | Pragmatic | No developer-facing scope was detected after repo-grounded intake. | forced DX pass |

## GSTACK REVIEW REPORT

| Review | Trigger | Why | Runs | Status | Findings |
|--------|---------|-----|------|--------|----------|
| CEO Review | `/plan-ceo-review` | Scope & strategy | 1 | ISSUES OPEN | 2 proposals, 1 accepted, 1 deferred |
| Codex Review | `/codex review` | Independent 2nd opinion | 0 | — | — |
| Eng Review | `/plan-eng-review` | Architecture & tests (required) | 8 | CLEAN | 10 issues, 0 critical gaps |
| Design Review | `/plan-design-review` | UI/UX gaps | 7 | CLEAN | score: 6/10 → 9/10, 5 decisions |
| DX Review | `/plan-devex-review` | Developer experience gaps | 0 | — | — |

- **UNRESOLVED:** 0 open decision points from the latest review pass.
- **VERDICT:** ENG + DESIGN CLEARED. CEO review still has open scope questions, but the latest design and engineering reviews are clear enough to keep refining the relaunch plan.
