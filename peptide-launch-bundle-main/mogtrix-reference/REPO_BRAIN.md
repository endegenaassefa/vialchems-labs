# REPO_BRAIN.md — Full Repo Context for Claude (Continuation File)

> **Purpose:** This file captures the complete understanding of the `mogtrix-website` repo built up by reading every single file (314 source files, ~44,000 lines including SQL migrations) on 2026-05-05 against commit `776a854`. A new Claude chat session can read this file and instantly have the same comprehension without re-reading the entire codebase.
>
> **How to use in a new chat:** Open a new session at `/root/mogtrix-website` and tell Claude: *"Read `/root/mogtrix-website/REPO_BRAIN.md` and use it as your full repo context. We are continuing the production-launch brainstorming I started in the previous chat — pick up at the visual companion stage of the brainstorming skill."*
>
> **Verify currency:** Before relying on any specific detail, run `git log --oneline -5` and `git status`. If commits past `776a854` exist, spot-check the changed files. If anything in this brain matches the current state of the file, trust it; if not, trust the file.

---

## 1. Repo Identity & High-Level Shape

**Name:** `mogtrix-website` (GitHub: `abhicloses7838/mogtrix-website`)
**Purpose:** Two artifacts under one root —
1. **`site/`** — the deployed Next.js 16 storefront for Mogtrix (production target `mogtrix.bio`, currently live at `site-omega-three-59.vercel.app`)
2. **`vector-bio-supply-demo/`** — a 28-page static-HTML investigative artifact simulating a gray-market peptide site. Intentionally NOT deployed (Vercel only builds `site/`). It exists as evidence for the journalism workspace.
3. **Journalism/research workspace** at the repo root (`Context.md`, `MODULE-01..13-OUTPUT.md`, `STRATELABS-*.md`, `investigations/`, `ruo-registration-evidence/`, `plans/`).

**Repo separation history:** The Flutter mobile app + Express/Prisma backend were extracted to `mogtrix-app` on 2026-05-04. Pre-separation tag: `pre-separation-mogtrix-website-2026-05-04`. Post-separation tag: `v0.1.0-post-separation`. See `REPO_SEPARATION_REPORT.md`.

**Current branch state (commit `776a854`):**
```
776a854 fix: tighten customer access and order flow
047699e docs: update README to reflect post-separation state (#3)
4f4b221 Add final repo separation report (#2)
3f4048a separation: strip Flutter app, app backend, and stale tracked junk
0696afa fix: refine checkout flow and order status migration
```

---

## 2. Tech Stack (`site/package.json`)

**Runtime:**
- Next.js **16.0.7** (app router)
- React **19.2.1** + react-dom 19.2.1
- TypeScript **5.9.3**, strict, `tsc --noEmit` is the lint command
- Node 22 (CI uses node 22)

**Data + auth:**
- Supabase: `@supabase/ssr 0.10.2`, `@supabase/supabase-js 2.87.1`
- RLS-driven access; service-role key only used server-side
- Zod **4.4.2** for validation (note: `lib/validation/access.ts` uses zod v3 import path, while orders/qualification use `zod/v4` — both work)

**Payments:**
- Stripe **22.1.0** (hosted Checkout Sessions, not Payment Intents)
- Stub adapter for local dev only

**UI:**
- Tailwind CSS **4.1.17** (via `@tailwindcss/postcss`)
- `motion 12.38.0` for page-level animations
- `react-three-fiber 9.4.0` + `@react-three/drei 10.7.7` + `three 0.181.2` for 3D vial scene
- `lucide-react 0.555.0` for icons
- `zustand 5.0.8` for client state (cart, age gate)
- `clsx 2.1.1` for class merging

**Telemetry:**
- `@sentry/nextjs 10.51.0`
- `@vercel/analytics 2.0.1`, `@vercel/speed-insights 2.0.0`

**Email:**
- Resend HTTP API (no SDK; raw `fetch` in `lib/order-email.ts`)

**Test:**
- vitest **4.0.14** + jsdom **27.2.0** + `@testing-library/react 16.3.0`
- Playwright **1.57.0** (two configs: `playwright.config.ts` for site E2E, `playwright.vector-demo.config.ts` for the static demo)

**Build:**
- Tailwind v4 via PostCSS, no separate build step beyond `next build`
- Sentry source-map upload via `withSentryConfig` (auto-disabled when `SENTRY_AUTH_TOKEN` or `NEXT_PUBLIC_SENTRY_DSN` missing)

**Scripts (`site/package.json`):**
- `dev` → `next dev`
- `build` → `next build`
- `start` → `next start`
- `lint` → `tsc --noEmit` (NOT eslint!)
- `test` → `vitest run`
- `test:watch` → `vitest`
- `e2e` → `npm run build && playwright test`
- `e2e:run` → `playwright test`
- `verify` → `npm run test && npm run build && npm run e2e`

---

## 3. Required Environment Variables (`site/.env.example`)

```
NEXT_PUBLIC_SITE_URL                     # e.g. https://mogtrix.bio
NEXT_PUBLIC_SUPABASE_URL                 # https://<ref>.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY            # sb_publishable_... or anon JWT
NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY     # optional alt name for above
SUPABASE_SERVICE_ROLE_KEY                # server-only, sb_secret_... or service_role JWT
REQUIRE_SUPABASE                         # true in preview/prod, false in local-demo
OPS_SIGNUP_ENABLED                       # true to allow /ops/login?mode=signup
PAYMENT_PROVIDER                         # stripe (prod) or stub (local only)
STRIPE_SECRET_KEY
STRIPE_WEBHOOK_SECRET
PILOT_US_SHIPPING_CENTS                  # e.g. 1500
ORDER_EMAIL_FROM                         # e.g. orders@mogtrix.bio
ORDER_STAFF_EMAILS                       # comma/space/semi separated
RESEND_API_KEY
NEXT_PUBLIC_SENTRY_DSN
SENTRY_AUTH_TOKEN
SENTRY_ORG
SENTRY_PROJECT
MOGTRIX_ADMIN_PASSCODE                   # legacy admin gate (also `mogtrix-demo-admin` in dev)
MOGTRIX_ADMIN_COOKIE_SECRET              # HMAC secret for legacy admin cookie
STUB_PAYMENT_WEBHOOK_SECRET              # only used by local stub adapter
```

**Fail-closed behavior:**
- `REQUIRE_SUPABASE=true` → `/api/research-requests` returns 503 if no service-role client; otherwise local-demo success
- `PAYMENT_PROVIDER=stripe` outside dev → `getPaymentAdapter()` throws if STRIPE_SECRET_KEY/STRIPE_WEBHOOK_SECRET missing
- Stub adapter forbidden in production via `NODE_ENV === "production"` check

---

## 4. Top-Level File Map (Repo Root)

```
.github/workflows/ci.yml          — Node 22, working-directory site, runs lint/test/build (NOT e2e in CI)
.gitignore                        — bans .gstack/, .vercel/, Research folder/, node_modules, etc
CLAUDE.md                         — Vercel deploy config, mogtrix.bio prod domain, /api/health check
Context.md                        — running peptide-industry investigation context (April 25, 2026)
MODULE-01..13-OUTPUT.md           — investigative reporting modules (~2,300 lines total)
STRATELABS-*.md                   — legal-parallels reports for stratelabs.is
README.md                         — project overview pointing to site/, research workspace
REPO_SEPARATION_REPORT.md         — chronology of 2026-05-04 split, recovery procedure, DNS issue
TODOS.md                          — deferred autoplan items (see §22)
investigations/ruo-stratelabs-legal/
ruo-registration-evidence/        — RUO_BIO_Legal_Report.md + HTML evidence dumps
plans/mogtrix-full-checkout-relaunch-plan.md — 905-line autoplan with CEO/Eng/Design phases
site/                             — the deployed app (see §5)
vector-bio-supply-demo/           — 28-page static demo (see §16)
```

---

## 5. site/ Directory Map

```
site/
├── .env.example                — env template (see §3)
├── .gitignore                  — node_modules, .next, .vercel, .env*, *.tsbuildinfo, next-env.d.ts
├── DEPLOYMENT.md               — production launch checklist (Supabase → Vercel → Domain → Stripe)
├── README.md                   — local dev, env, deploy steps
├── eslint.config.mjs           — uses eslint-config-next (despite lint=tsc --noEmit)
├── instrumentation-client.ts   — client Sentry init, replays disabled
├── instrumentation.ts          — server Sentry init, tracesSampleRate 0.1
├── next.config.ts              — security headers (CSP/HSTS/Frame-Options/etc), Sentry wrap
├── package.json                — see §2
├── package-lock.json
├── playwright.config.ts        — testDir e2e/, port 3100, chromium + iPhone 13
├── playwright.vector-demo.config.ts — testDir e2e-vector/, port 4179, chromium + iPhone 15
├── postcss.config.mjs          — @tailwindcss/postcss
├── proxy.ts                    — middleware (see §8)
├── tsconfig.json               — strict, paths "@/*" → "./*"
├── vercel.json                 — framework nextjs, region iad1, cleanUrls true
├── vitest.config.ts            — jsdom, globals, setupFiles ./tests/setup.ts
├── app/                        — app router routes (see §9)
├── components/                 — React components (see §11)
├── lib/                        — shared utilities (see §12)
├── public/                     — visuals/products, brand assets, vials photo (not read individually)
├── scripts/                    — build/render/seed utilities (see §15)
├── supabase/                   — config.toml, schema.sql (pointer), seed.sql, migrations/ (see §14)
├── tests/                      — vitest suites (see §13)
├── e2e/                        — Playwright site specs (core.spec.ts, core-flows.spec.ts)
└── e2e-vector/                 — Playwright vector demo specs (vector-demo.spec.ts)
```

---

## 6. Customer Access State Machine (`site/lib/customer.ts`)

The single source of truth for "can this user see X?" The state machine has 6 kinds, derived from auth + customer_profiles row + email_confirmed_at + qualification:

| `kind`          | Trigger                                                                           |
|-----------------|-----------------------------------------------------------------------------------|
| `unavailable`   | No browser supabase config (local demo mode)                                      |
| `anonymous`     | No `auth.users` row                                                               |
| `forbidden`     | Authed but missing `customer_profiles` row OR `blacklisted=true`                  |
| `unverified`    | Has profile, but `email_confirmed_at` is null                                     |
| `unqualified`   | Verified but `qualified=false` AND not (age_verified AND ruo_acknowledged)        |
| `ready`         | Verified, qualified, not blacklisted                                              |

**Routing decisions (`getCustomerRouteDecision`):**
- Auth pages (`/login`, `/signup`): `ready` redirects to `/shop`; `unqualified` redirects to `/qualify?next=/shop`; `forbidden` allowed (so error message shows)
- Protected paths (`/cart`, `/request`, `/checkout`, `/account/*`): require ready; redirect with appropriate error
- Catalog (`/shop`, `/products/*`): allowed for `anonymous` (preview); redirect required for `unverified`/`unqualified`/`forbidden` accessing checkout
- `/qualify`: only `unqualified` should be there

**Middleware does the redirect:** `lib/supabase/proxy.ts → updateSession` runs `getCustomerAccessState(supabase)` then `getCustomerRouteDecision(pathname, state)` and `NextResponse.redirect()` when needed. It also handles ops auth separately for `/ops` paths.

**Server pages double-check:** Each protected page calls `requireCustomerPageSession(pathname)` which does its own redirect. Layered defense.

**Catalog data is data-layer private:** Even if a route slipped through, `is_verified_qualified_customer()` SQL function gates `products` SELECT in RLS. `/api/catalog` returns 401 for anonymous, 403 for unqualified.

---

## 7. Dual Auth Principals

Two tables, one auth.users source, routed by `account_type` user_metadata key:

**`public.profiles`** (staff):
- `id` UUID FK → auth.users
- `email`, `full_name`, `organization`
- `role` enum `app_role` (`staff` | `admin`)
- `staff_active` bool — must be true to enter ops
- `age_verified`, `blacklisted` (mostly unused for staff)
- RLS: staff can read all staff profiles; admins can manage; users can update own row

**`public.customer_profiles`** (customers):
- `id` UUID FK → auth.users
- `email`, `full_name`, `organization`
- `age_verified`, `ruo_acknowledged`, `qualified` (with `qualified_at` timestamp)
- `blacklisted`
- RLS: customer can read/update own row; staff cannot read by default

**`public.customer_qualifications`** (1:1 with customer_profiles):
- `institution_name`, `institution_type`, `role_title`, `credential_details`, `research_environment`
- `attestation_age`, `attestation_ruo`, `attestation_no_human_use` bools
- RLS: customers manage own; staff can read all

**Trigger:** `public.handle_new_auth_user()` runs AFTER INSERT on auth.users. Reads `raw_user_meta_data->>'account_type'`:
- `'staff'` → insert into `public.profiles` with `staff_active=false` (admin must activate manually)
- otherwise (default customer) → insert into `public.customer_profiles` with `qualified=false`

**Auth signup paths:**
- `app/auth/actions.ts` `signupCustomer` → `account_type=customer` metadata, `emailRedirectTo: /auth/callback`
- `app/ops/actions.ts` `requestStaffAccess` → `account_type=staff` metadata, `emailRedirectTo: /ops/login`, gated by `OPS_SIGNUP_ENABLED=true`

**Verification flow:** `/auth/callback` receives `token_hash` + `type` (or `code`) from Supabase email link, calls `verifyOtp` (or `exchangeCodeForSession`), redirects based on resulting state.

---

## 8. Middleware (`site/proxy.ts`)

```ts
export const config = {
  matcher: [
    "/ops/:path*",
    "/shop/:path*",
    "/products/:path*",
    "/cart/:path*",
    "/request/:path*",
    "/checkout/:path*",
    "/account/:path*",
    "/login",
    "/signup",
    "/qualify",
  ],
};
```

`updateSession`:
1. Reads cookies via `createServerClient` from `@supabase/ssr`
2. Runs `supabase.auth.getUser()` (this triggers token refresh if needed)
3. For non-`/ops` paths: derives customer state, gets route decision, redirects if needed
4. For `/ops` paths: requires authed user to access non-login pages; redirects authed users away from `/ops/login`

The middleware mutates response cookies for refreshed sessions; sets `Cache-Control: private, no-store` on response when cookies change.

---

## 9. Site App Routes (`site/app/`)

**Public:**
- `/` (`page.tsx`) — hero with `HomeActions`, `HomeProofRow` (3-vial preview)
- `/categories` — public preview with all 5 category cards + product previews (no pricing)
- `/coa` — COA Library + batch lookup (`VerifyClient`)
- `/testing` — testing methods explainer
- `/faq` — 8 Q&A items
- `/legal` — legal index, `/legal/[slug]` for terms/privacy/shipping/mta/qualification
- `/access` — manual access request form (separate from customer signup; legacy demo path)
- `/admin/login` (passcode page), `/admin` (admin dashboard, requires `requireAdmin`)
- `/catalog` — admin catalog review surface

**Auth:**
- `/login`, `/signup`, `/verify`, `/qualify`
- `/auth/callback` — Supabase email confirmation handler

**Customer-protected:**
- `/shop` — qualified catalog grid OR public preview
- `/products/[slug]` — product detail
- `/cart` — `CartView`
- `/request` — manual procurement form (for non-pilot SKUs)
- `/checkout` — `CheckoutFlow`
- `/account` (redirects to `/account/orders`)
- `/account/orders` — order list grouped by customer-facing state
- `/account/orders/[id]` — detail with timeline + `OrderRefreshPoller` while pending

**Staff:**
- `/ops/login` — staff sign-in + signup-request form
- `/ops` (`(protected)/layout.tsx`) — split queue layout
- `/ops/(protected)/page.tsx` — research-request queue
- `/ops/(protected)/requests/[id]` — request detail with status form + notes
- `/ops/(protected)/orders` — paid-order queue
- `/ops/(protected)/orders/[id]` — order detail with status, shipment, notes forms

**Special:**
- `/payments/stub/hosted` — local-only stub payment page (404 outside `isLocalPaymentDevelopment`)

**Metadata files:**
- `app/layout.tsx` — site-wide metadata, themeColor #020202, Vercel Analytics + SpeedInsights
- `app/icon.tsx`, `app/apple-icon.tsx`, `app/opengraph-image.tsx` — generated at build via `next/og` ImageResponse
- `app/sitemap.ts` — only public routes (home, /legal, /legal/*) — gated routes intentionally omitted
- `app/robots.ts` — disallows `/api/`, `/shop`, `/products/`, `/cart`, `/request`, `/checkout`, `/account`, `/ops*`
- `app/error.tsx`, `app/global-error.tsx` — Sentry-integrated boundaries
- `app/not-found.tsx`, `app/loading.tsx`

---

## 10. API Routes (`site/app/api/`)

| Route                                          | Methods | Purpose                                                      |
|------------------------------------------------|---------|--------------------------------------------------------------|
| `/api/health`                                  | GET     | `{ ok, service, domain, environment, commit, checks, ... }` |
| `/api/access`                                  | POST    | Manual access-request form (legacy, demo-mode tolerant)      |
| `/api/admin/login`                             | POST    | Passcode → cookie (HMAC-signed)                              |
| `/api/admin/logout`                            | POST    | Clear cookie                                                 |
| `/api/admin/catalog` / `[id]`                  | POST/PATCH | Catalog row metadata mutations                            |
| `/api/admin/requests/[id]`                     | PATCH   | Update access-request status                                 |
| `/api/admin/staff-access` / `[id]`             | POST/PATCH | Repair-by-email; activate pending profile                  |
| `/api/catalog`                                 | GET     | Returns `{ products, missingIds }` for qualified customers   |
| `/api/research-requests`                       | POST/OPTIONS | Calls `create_research_order_request` RPC; rate-limited |
| `/api/orders`                                  | POST/GET | Create draft via `create_checkout_order_draft` RPC; list   |
| `/api/payments/checkout-session`               | POST    | Creates Stripe Checkout Session via adapter, persists via RPC |
| `/api/payments/webhook`                        | POST    | Verifies signature, calls `processPaymentWebhookEvent`       |
| `/api/payments/confirm`                        | POST    | Returns 409 (deprecated; webhooks own state changes)         |
| `/api/payments/create-intent`                  | (re-export of checkout-session) |                                          |
| `/api/payments/stub/complete`                  | POST    | Local-only stub webhook simulator                            |
| `/api/ops/orders/[id]/status` / `notes` / `shipment` | POST | Staff order actions, send Resend emails on shipped/issue   |
| `/api/ops/requests/[id]/status` / `notes`      | POST    | Staff research-request actions                               |

Common patterns:
- All ops routes guard with `getStaffSessionState()` (`unavailable`/`anonymous`/`forbidden`/`ready`)
- All customer-action routes guard with `requireQualifiedCustomer()` (throws → caught → 401/403)
- All admin routes guard with `requireAdmin()` (Supabase admin profile OR passcode cookie)
- RPCs handle race-safe writes; service-role only for `create_research_order_request`

---

## 11. Components (`site/components/`)

Server (default):
- `site-header.tsx` — sticky header, varies nav by auth state (anon vs unverified vs unqualified vs ready)
- `compliance-footer.tsx` — production footer with explore/policy/staff links
- `site-footer.tsx` — alternative footer using legal nav
- `attorney-banner.tsx` — "Draft legal shell" notice (for legal pages)
- `home-actions.tsx`, `home-proof-row.tsx` — home page sections
- `category-card.tsx`, `product-card.tsx` (covers Product, ProductPreview, StorefrontProduct shapes)
- `product-detail-panels.tsx` (tabs), `product-vial-visual.tsx`
- `private-catalog.tsx` (admin review surface)
- `customer-access-shell.tsx` (login/signup shared layout)
- `vial-hero.tsx` — large home hero vial image
- `status-pill.tsx`, `button.tsx`

Client (`"use client"`):
- `age-gate.tsx` — modal for age + qualification confirmation (uses `useAgeGateStore`)
- `cart-view.tsx` — full cart page with quantity controls
- `checkout-boundary.tsx` — alt layout
- `checkout/checkout-flow.tsx` (287 lines, orchestrates) — uses Cart store + canonical catalog rows + idempotency key
- `checkout/order-summary.tsx`, `checkout/payment-step.tsx`, `checkout/shipping-form.tsx`
- `qualification-flow.tsx` (462 lines, 3-step wizard)
- `request-form.tsx`
- `verify-client.tsx` (COA library lookup)
- `product-motion-enhancer.tsx` (motion/mini, scroll-in, vial spin on hover)
- `product-detail-actions.tsx` (Add to cart)
- `order-refresh-poller.tsx` (5x router.refresh() at 4s while pending)
- `vial-scene.tsx` (react-three-fiber, OrbitControls, autoRotate)
- `admin-dashboard.tsx`, `admin-login-form.tsx`, `admin-catalog-manager.tsx`
- `staff-access-admin-panel.tsx`
- `ops-note-form.tsx`, `ops-status-form.tsx`
- `ops-order-note-form.tsx`, `ops-order-status-form.tsx`, `ops-order-shipment-form.tsx`
- `stub-payment-hosted.tsx` (local-only)
- `product-showcase.tsx` (motion-enhanced grid alt)

---

## 12. Lib Modules (`site/lib/`)

**Core:**
- `types.ts` — `Product`, `CartItem`, `CustomerProfile`, `StaffProfile`, `OrderRecord`, `OrderItemRecord`, `OrderStatus` enum, `PaymentStatus` enum, etc.
- `utils.ts` — `cn()` clsx wrapper
- `compliance.ts` — `assertMarketingCopySafe(copy)` rejects regex patterns for "weight loss", "human use", "diagnose", etc.
- `attestations.ts` — 4 required attestation objects for the legacy request flow (age-qualified, research-only, no-guidance, affiliation)
- `legal.ts` — minimal legal page list (4 entries) for sitemap

**Auth helpers:**
- `auth-helpers.ts` — `normalizeAuthEmail`, `normalizeSafeNextPath`, `buildAuthUrl`, `getAuthEmailRedirectUrl`
- `customer.ts` (225 lines) — state machine, `getCustomerAccessState`, `getCustomerRouteDecision`, `requireCustomerPageSession`, `customerCanViewPrivatePricing`, `getCatalogAccessAction`
- `customer-auth.ts` — `getCustomerAuthMode()` returns `{ configured, label, reason }`
- `customer-qualification.ts` — Zod schema for 3-step qualification, `parseCustomerQualificationForm`, `upsertCustomerQualification`, `updateCustomerProfileQualification`
- `auth/admin.ts` (148 lines) — passcode flow with HMAC-signed cookie, also Supabase admin path
- `auth/customer.ts` — `getCustomerSession()`, `requireQualifiedCustomer()` (throws "Auth failed: <reason>" or "Not qualified")
- `auth/catalog.ts` — `requireCatalogAccess()` (alias for requireAdmin)
- `ops.ts` (529 lines) — staff session, queue list, request detail, validation for status/note/shipment/order-status, `canAutoAdvanceOrderToShipped`

**Supabase clients (`lib/supabase/`):**
- `env.ts` — JWT/sb_publishable/sb_secret pattern detection, `getSupabaseMode` returns 4 modes
- `browser.ts` — singleton `createBrowserClient`
- `public.ts` — non-persistent public client (rare)
- `server.ts` — `createServerSupabaseClient` (uses cookies()) — re-exports `createSupabaseServerClient` and `createSupabaseServiceClient`
- `service.ts` — `createServiceRoleSupabaseClient` (no session persist)
- `proxy.ts` — middleware (see §8)
- `index.ts` — barrel exports

**Catalog:**
- `products.ts` — re-exports `canonicalCatalogProducts` from seed for in-process Product[] (legacy fallback)
- `catalog.ts` — `mapCatalogProductRow`, `filterProducts`, `getProductBySlug`, `formatPrice`, `CatalogUnavailableError`
- `catalog.server.ts` — `listCatalogProducts`, `getCatalogProductsByIds`, `getCatalogProductBySlug` (RLS-gated)
- `catalog-seed.ts` (138 lines) — derives canonical rows from `lib/content/products.ts`, generates SQL for seed.sql
- `use-cart-catalog.ts` — `useCartCatalogRows(items)` hook + `getCartCatalogNotice` for stale/missing cart row guidance

**DB (`lib/db/`):**
- `types.ts` — `AccessRequest`, `AccessStatus`, `CatalogItem`, `AdminSession`
- `access-requests.ts` — Supabase + demo store
- `catalog-items.ts` — Supabase admin catalog mutations
- `demo-store.ts` — in-process fallback when Supabase missing

**Validation:**
- `validation/access.ts` — Zod v3 schema for `/access` form
- `validation/catalog.ts` — Zod schema for catalog metadata mutations

**Content (`lib/content/`):**
- `site.ts` — site name, domain, legalVersion, attorneyNotice, nav arrays
- `categories.ts` — 5 category objects with `slug`, `eyebrow`, `title`, `summary`, `detail`, `visual`, `controls[]`. Plus `publicClaimGuardTerms` array.
- `products.ts` (746 lines) — `storefrontProducts[15]` with full content; merging helpers
- `legal.ts` — 5 legal pages (terms, privacy, shipping, mta, qualification)
- `faq.ts` — 8 Q&As
- `verification.ts` — 3 sample batches + `lookupBatch()`
- `testing.ts` — testing page content
- `checkout.ts` — 4 checkout state copy variants
- `catalog.ts` — admin metadata label maps

**Payments (`lib/payments/`):**
- `types.ts` — `PaymentAdapter` interface, `HostedPaymentSession`, `PaymentWebhookVerification`, etc.
- `config.ts` — `resolvePaymentProvider`, `getSiteUrl`, `requireStripeSecrets`, `getPilotUsShippingCents`, `isLocalPaymentDevelopment`
- `index.ts` — `getPaymentAdapter()` factory
- `stripe.ts` (300 lines) — Stripe Checkout adapter, automatic_tax, US-only shipping, fixed shipping rate
- `stub.ts` (150 lines) — local stub adapter; verifyWebhook checks `STUB_PAYMENT_WEBHOOK_SECRET`
- `reconciliation.ts` (107 lines) — pure function `getPaymentEventOutcome(current, event)` decides apply/stale/duplicate/unsupported and resulting status pair
- `server.ts` (270 lines) — `processPaymentWebhookEvent`: looks up order by `external_payment_reference` then `payment_intent_id`, computes outcome, calls `apply_order_payment_webhook_event` RPC, sends emails via Resend on paid/failed

**Orders / Ops:**
- `orders.ts` (264 lines) — `buildOrderDraft`, currency helpers, `getCustomerOrderState` mapping internal → simplified UI label
- `order-email.ts` (230 lines) — Resend transport (or console fallback), `sendOrderEmail(event, order, transport?)`, `parseOrderStaffEmails(env)`
- `ops-orders.ts` (272 lines) — `listOpsOrders`, `getOpsOrderDetail`, status filter set
- `staff-access-admin.ts` (311 lines) — staff repair flow: `listPendingStaffProfiles`, `repairStaffProfileByEmail`, `activateStaffProfile`

**Request flow:**
- `request.ts` — client-side validators, REQUEST_LIMITS (20 items, 2000 char summary)
- `request.server.ts` — `validateResearchRequestSubmission`, `buildResearchRequestWriteInput`, `buildResearchRequestMeta` (origin/IP hash/UA), `hashIpAddress`

**Stores (Zustand, client-only):**
- `cart-store.ts` — persisted in localStorage as `mogtrix-cart`
- `age-gate-store.ts` — localStorage `mogtrix-age-gate`

---

## 13. Tests Coverage Map (`site/tests/`)

37 vitest files exist; 145+ tests according to verification log. Highlights:

**Unit/integration:**
- `setup.ts` — imports jest-dom matchers
- `request.test.ts` + `request-server.test.ts` — validation, payload building, IP hash, idempotency-key format
- `catalog.test.ts`, `catalog-seed.test.ts`, `catalog-validation.test.ts`, `storefront-products.test.ts`
- `access-validation.test.ts` — Zod schema correctness
- `customer.test.ts` — 174 lines — state machine, route decisions
- `customer-auth.test.ts` — 256 lines — signup, qualify, callbacks
- `orders.test.ts` — 197 lines — buildOrderDraft, US-only check, customer state mapping, stub adapter happy path
- `payment-provider.test.ts` — fail-closed for prod-without-stripe, stub adapter local
- `payment-reconciliation.test.ts` — outcome rules
- `order-email.test.ts` — staff parsing, customer/staff job builders, transport mock
- `ops.test.ts` — 290 lines — session state, normalizeOpsNextPath, validators, canAutoAdvanceOrderToShipped
- `ops-actions.test.ts` — 254 lines — login/signup actions
- `ops-routes.test.ts` — 165 lines — request status & notes API
- `staff-access-admin.test.ts` — 357 lines — repair, activate, missing-table tolerance
- `request-route.test.ts` — 164 lines — route mappings (RATE_LIMITED→429, INVALID_PRODUCT_IDS→400, etc.)
- `orders-route.test.ts` — POST /api/orders RPC mapping
- `catalog-route.test.ts` — auth gates + 503 on CatalogUnavailableError
- `verification.test.ts` — lookupBatch
- `provision-supabase-doc.test.ts` — verifies provision-supabase.md mentions every migration file
- `vector-demo-content.test.ts` — verifies 28-page demo manifest, presence of legal phrases, no tracking scripts, all internal hrefs resolve

**Component:**
- `vial-hero.test.tsx`, `home-actions.test.tsx`, `site-header.test.tsx`, `qualification-flow.test.tsx`, `customer-copy-pages.test.tsx`, `pilot-boundary.test.tsx`, `product-page.test.tsx`, `shop-page.test.tsx`, `use-cart-catalog.test.tsx`, `ops-entry.test.tsx`, `private-catalog-boundary.test.ts`, `site-content.test.ts`, `content-compliance.test.ts`, `checkout.test.ts`

**E2E (`site/e2e/`):**
- `core.spec.ts` (75 lines) — homepage gate, mobile catalog proof, staff footer entry
- `core-flows.spec.ts` (133 lines) — homepage, COA lookup, checkout auth gate, admin protected, private catalog, /api/health

**E2E vector demo (`site/e2e-vector/`):**
- `vector-demo.spec.ts` (237 lines) — cookie banner + age gate, all 28 pages render, registration progressive reveal + signature pad, cart thresholds + free Bac Water, MTA gate, 17-clause checkout, 17 consent log entries written, blacklist via contact form

---

## 14. Database (Supabase Migrations)

`supabase/schema.sql` is just a pointer comment; truth is migrations.

**Migration chronology** (`site/supabase/migrations/`):

1. **`20260501194000_backend_foundation.sql`** (705 lines) — pgcrypto, `app_role` enum, `research_request_status` enum, `request_actor_type` enum, `touch_updated_at` trigger fn, **tables:** `profiles`, `products`, `product_images`, `research_order_requests`, `research_order_items`, `consent_logs`, `request_status_history`, `staff_notes`. RLS for all + `is_admin()`, `is_staff()` helper functions. **`create_research_order_request(...) RPC`** with rate limiting (5 per 15min per IP hash), idempotency key, item validation, consent log validation. Storage bucket `product-images`. Initial seed of 3 placeholder MTRX products (`mtrx-reference-a/b/c`).

2. **`20260502004000_ops_auth_and_transitions.sql`** (157 lines) — `handle_new_auth_user()` trigger inserts every new auth user into `profiles` as `staff_active=false` (this is the version BEFORE customer profiles existed; superseded by migration 3). **`transition_research_request_status(...)`** RPC, staff-only.

3. **`20260503001000_customer_auth_and_private_catalog.sql`** (161 lines) — adds `customer_profiles` table, `is_verified_qualified_customer()` SQL fn, RLS for customer_profiles. Rewrites `handle_new_auth_user()` to branch on `account_type`. Backfills auth users without staff/customer profile rows into customer_profiles. Tightens RLS on products + product_images + storage.objects bucket to `is_verified_qualified_customer()`.

4. **`20260503120000_customer_auth_and_qualification.sql`** (166 lines) — adds `qualified` + `qualified_at` to customer_profiles. Adds `customer_qualifications` table. Backfills `qualified=true` for prior verified+RUO accounts. Updates `handle_new_auth_user()` again. Adds `is_qualified_customer()` and updates `is_verified_qualified_customer()` to OR with the new qualified flag.

5. **`20260504000000_orders_and_payments.sql`** (172 lines) — `order_status` enum (initial values: draft, pending_payment, paid, processing, shipped, delivered, cancelled, refunded). `payment_status` enum. **Tables:** `orders`, `order_items`, `order_status_history`. RLS: customers manage own orders, staff manage all. Triggers, indexes.

6. **`20260504010000_unify_catalog_products.sql`** (322 lines) — adds `documentation_status`, `availability_status`, `visible_to_approved` columns + check constraints. Deactivates the 3 placeholder MTRX products. **Inserts/updates the 15 canonical Mogtrix peptide products** with full descriptive content. Tightens RLS to require `visible_to_approved=true`.

7. **`20260504100000_hosted_payment_orders.sql`** (72 lines) — adds order columns: `external_payment_url`, `external_payment_reference`, `payment_last_event_id`, `customer_next_step`, `payment_requested_at`, `completed_at`, `shipment_tracking_reference`, `shipment_tracking_url`, `shipment_note`. **Tables:** `order_payment_events` (with `provider_event_id` UNIQUE for webhook idempotency), `order_staff_notes`. RLS staff-only.

8. **`20260504120000_first_sale_recovery.sql`** (507 lines) — adds `checkout_enabled` column to products. Backfills `checkout_enabled = (availability_status='requestable')`. **`create_checkout_order_draft(p_items, p_shipping, p_idempotency_key)` RPC** — atomic, requires auth.uid(), checks each item is checkout_enabled, US-only check, computes subtotal from canonical prices, creates order + items + status history. **`update_checkout_order_payment_session(...)` RPC** — saves Stripe session reference, transitions to `payment_requested`, writes status history. **`apply_order_payment_webhook_event(...)` RPC** — inserts into `order_payment_events` with `ON CONFLICT DO NOTHING` for idempotency, then optionally applies the resolved next_status/payment_status, sets `paid_at`, writes status history.

9. **`20260504130000_order_status_enum_backfill.sql`** (23 lines) — `payment_pending` and `completed` were added to `order_status` enum in migration 7 (via `alter type ... add value`). This migration rewrites any existing rows with old `pending_payment`/`delivered` to the new values.

**Note about enum additions:** Migration 7 has `alter type public.order_status add value if not exists 'payment_requested'` etc. Postgres requires `add value` to commit before use; if running the whole file in a single transaction this will fail. Migration 9 then does data updates separately. In practice `supabase db push` runs each file in its own transaction so this works.

**`supabase/seed.sql`** (274 lines) — generated by `scripts/generate-catalog-seed.mjs` from `lib/catalog-seed.ts`; UPSERTs the 15 canonical products. Has `--check` flag to verify the file matches the source.

**Provisioning doc:** `site/scripts/provision-supabase.md` (132 lines) lists every migration in order and walks through Supabase project setup, env vars, smoke test, first staff promotion (`update profiles set role='admin', staff_active=true where email=...`).

---

## 15. Scripts (`site/scripts/`)

- `generate-catalog-seed.mjs` (25 lines) — regenerates `seed.sql`; `--check` exits 1 if drift
- `serve-vector-demo.mjs` (43 lines) — local HTTP server for the vector-bio-supply-demo (used by Playwright vector config)
- `optimize-product-renders.mjs` (56 lines) — sharp PNG optimization
- `generate-product-renders.mjs` (452 lines) — TS-AST-driven Playwright renderer producing per-product 1200x1600 vial PNGs (CSS+SVG composition with full vial illustration). Saves to `public/visuals/products/mogtrix-vials/`.
- `render-product-vials-photo.mjs` (249 lines) — sharp-based composer using actual `vial-three-up-source.png` + `label-tirzepatide-source.png` to render photo-style vial PNGs. Saves to `public/visuals/products/mogtrix-vials-photo-v1/`. Active visual set referenced by `lib/content/products.ts` `productVialVisuals`.
- `generate-assets.mjs` (176 lines) — programmatic PNG generator for `hero-lab.png` and category visuals (`category-reference-v2.png`, etc.) using deflate-encoded raw RGBA + custom CRC32. Truly hand-rolled.
- `smoke-test.sh` (95 lines) — curls homepage/shop/legal/sitemap/robots, verifies CSP/HSTS/Frame/Referrer/Permissions headers, checks `/api/catalog` 401, OPTIONS `/api/research-requests`, malformed POSTs → 400. With `SMOKE_SUBMIT=1` runs a full write-through against Supabase.
- `provision-supabase.md` — documented above

---

## 16. vector-bio-supply-demo (28-page static demo)

**Generated by:** `src/build.mjs` (519 lines) reading from `src/content.mjs` (247 lines) + `BUILD-SPEC.md` (NOT in repo, lives at `/Users/abhinavkumar/Downloads/BUILD-SPEC.md` — the user's local file). The build extracts legal sections 11.A (Terms), 11.B (Privacy), 11.C (Shipping), 11.D (Refund), 11.E (MTA), 11.F (Affiliate) from BUILD-SPEC and renders them.

**Site identity:** `Vector Bio Supply Co.` / `Vector Bio Supply LLC, 30 N Gould St Ste R, Sheridan, WY 82801` — same Wyoming registered-agent address used by EA WORKS dba Trust Labs in real FDA records.

**6 products:** semaglutide-5mg, tirzepatide-10mg, retatrutide-10mg, bpc-157-5mg, cagrilintide-5mg, bacteriostatic-water-30ml. Each has CAS, formula, sequence, batch, refs.

**17 checkout consent clauses** (`checkoutAgreements` in content.mjs) including:
- tos-research-use-only, tos-customer-representations, tos-as-is-warranty
- tos-liability-cap ($500), tos-indemnification, tos-arbitration (Wyoming, AAA)
- tos-class-action-waiver, **tos-chargeback-fee** ($2,500 liquidated damages)
- tos-blacklist (asking for guidelines = lack of qualification), tos-unilateral-amendment
- shipping-final-sale, shipping-inspection-window (7 days, photos), shipping-address-liability
- mta (signed Material Transfer Agreement)
- privacy-data-share, marketing-newsletter, marketing-sms

**Compliance theater patterns simulated in code:**
- Cookie banner + age/researcher gate before any browse
- 5-stage progressive registration (`js/registration.js` 272 lines): identity → industry select → credential select → bundled multi-attestation checkbox → signature pad. All stages hidden until prior is valid.
- MTA signature gate: redirects to `/mta.html?next=/checkout.html` if not signed
- Contact form (`js/blacklist.js` 53 lines) screens for "dosage", "weight loss", "personal use", "appetite", etc. → triggers "Refusal to Provide Guidelines" modal → adds email to blacklist → redirects to FAQ#dosing-question
- Cart thresholds (`js/cart.js` 106 lines): free shipping $250, free 30mL Bac Water at $300
- Discrete packaging language explicitly in shipping policy

**Key files:**
- `manifest.json` — list of all 28 generated pages
- `css/main.css` (739 lines) — design system with navy/teal/amber palette
- `js/storage.js` (70 lines), `js/state.js` (182 lines) — VBSCStorage + VBSCState with normalized cart, free-gift logic
- `js/cart.js`, `js/checkout.js`, `js/consent-log.js`, `js/registration.js`, `js/blacklist.js`, `js/catalog-data.js`

**Tests for this demo:** `site/tests/vector-demo-content.test.ts` (vitest) + `site/e2e-vector/vector-demo.spec.ts` (Playwright) — both run against the live demo via `scripts/serve-vector-demo.mjs`.

**Public deployment gate:** TODOS.md explicitly forbids public hosting without legal/editorial review. The artifact is for investigative review only, not customer-facing.

---

## 17. Research Workspace

**`Context.md`** — running peptide-investigation context updated 2026-04-25, last module 13. Covers FDA timeline (Feb 2024 US Chem Labs/Helix → Feb 2026 BluefitMD/NewSelf/24HrDoc → Mar 2026 30 unnamed telehealth → Mar/Apr 2026 Gram/Watkins).

**Modules 1-13:**
1. Enforcement actions (38 actions, Feb 2024 - Apr 2026)
2. Legal grey zone (21 CFR 201.128, FD&C 503A/503B, FTC Act §§5/12, mail/wire fraud, state law)
3. Business formation / shell structure (EA WORKS Wyoming, Las Villas Florida, Earth Science Tech SEC)
4. Product sourcing / supply chain (FDA green-list import alert, CBP Cincinnati seizures, BioStem/Advanced Pharmaceutical Technology warnings, COA limitations)
5. Website compliance theater
6. Payment processing (Stripe/PayPal/Square restricted-business policies, Xcel Max Redemption flow)
7. Influencer marketing & customer pipeline (Prime social media cited in FDA letter, NextMed FTC case)
8. Consumer risk & product safety (Fullerton Wellness sterility, falsified semaglutide PubMed cases, Wegovy/Zepbound labeling)
9. Response patterns (Prime cleanup, Trust Labs domain hopping, Las Villas reinstatement, OFA litigation)
10. 5 case studies: Prime Peptides, USApeptide.com, Trust Labs/EA WORKS, Villas Health, Gram Peptides
11. Interview questions (10 sources × 10 questions each)
12. Evidence checklist (14 categories, top 20 items to collect first)
13. Open questions / next steps (28 items, top 10 ranked)

**STRATELABS reports:**
- Initial legal parallels (116 lines) — Strate Labs vs. RUO.bio side-by-side (Texas arbitration, all-sales-final, Netherlands HQ + Texas/Delaware fulfillment)
- Interactive investigation (445 lines) — live browse log, 18 URLs visited, payment-method inference from cart source (mecom_paypal, mecom_stripe, btcpaygf_default), Cloudflare-blocked checkout

**RUO.bio evidence (`ruo-registration-evidence/`):**
- `RUO_BIO_Legal_Report.md` (701 lines) — registration-flow analysis, exact consent text captured ("I, Fabricio Rodriguez, affirm that I hold the position of Research Scientist..."), 12 verbatim legal phrases (`ALL SALES ARE FINAL`, `binding arbitration`, `$2,500 liquidated damages fee`, `at least 21 years of age`, etc.)
- `ruo-registration-report.md` (199 lines) — registration form structure
- `gform1.html` — exact Gravity Forms HTML
- 4 large WordPress page dumps (registration.html, mta.html, terms-of-service.html, shipping-refunds-returns-policy.html) — all ~2000 lines but redirect to the same registration content

**RUO investigations (`investigations/ruo-stratelabs-legal/`):**
- `ruo-agent-report.md` (246 lines) — fresh logged-out audit
- `ruo-registration-human-evidence-update.md` (159 lines) — screenshot evidence
- `clean-codex-investigation-prompt.md` (125 lines)

**Plan:**
- `plans/mogtrix-full-checkout-relaunch-plan.md` (905 lines) — autoplan output with CEO review (selective expansion mode), Eng review (3 critical gaps flagged), Design review (revalidated 9/10 across most dimensions), full state matrix, copy rules, accessibility floor.

---

## 18. Status Field Maps

**`research_request_status` (DB enum):**
`pending_review` | `approved` | `rejected` | `needs_more_info`

**`order_status` (DB enum):**
`draft` | `pending_payment` (legacy) | `paid` | `processing` | `shipped` | `delivered` (legacy) | `cancelled` | `refunded` | `payment_requested` | `payment_pending` | `completed` | `issue`

**`payment_status` (DB enum):**
`pending` | `processing` | `succeeded` | `failed` | `cancelled` | `refunded`

**Customer-facing labels (`getCustomerOrderState`):**
- `Action needed` (draft, payment_requested)
- `Payment pending` (payment_pending, pending_payment)
- `Paid, under review` (paid)
- `Preparing shipment` (processing, shipped)
- `Completed` (completed, delivered)
- `Issue / follow-up required` (issue/cancelled/refunded OR any failed/cancelled/refunded payment status)

**Stripe webhook subscriptions** (per DEPLOYMENT.md):
`checkout.session.completed`, `checkout.session.async_payment_succeeded`, `checkout.session.async_payment_failed`, `checkout.session.expired`

**Stripe → internal event mapping (`lib/payments/stripe.ts`):**
- `completed` + `paid`/`no_payment_required` → `payment.paid`
- `completed` + other → `payment.pending`
- `async_payment_succeeded` → `payment.paid`
- `async_payment_failed` → `payment.failed`
- `expired` → `payment.cancelled`

---

## 19. The 15 Canonical Mogtrix Products

From `lib/content/products.ts` and SQL seed. All have `research_use_only=true`, `active=true`, `visible_to_approved=true`. The 5 marked `requestable`/checkout_enabled are pilot SKUs; the rest route to manual `/request`.

| Slug                              | SKU                  | Category    | Price (cents) | Documentation   | Availability    | Pilot? |
|-----------------------------------|----------------------|-------------|---------------|-----------------|-----------------|--------|
| `bpc-157-5mg`                     | MGX-REC-BPC-005      | reference   | 4900          | coa-ready       | requestable     | ✅      |
| `bpc-157-tb-500-5mg-5mg`          | MGX-REC-BT5-010      | reference   | 7900          | document-review | requestable     | ✅      |
| `cjc-1295-no-dac-5mg`             | MGX-GH-CJC-005       | analytical  | 6900          | coa-ready       | requestable     | ✅      |
| `cjc-1295-ipamorelin-5mg-5mg`     | MGX-GH-CJI-010       | analytical  | 8200          | document-review | requestable     | ✅      |
| `ipamorelin-5mg`                  | MGX-GH-IPA-005       | analytical  | 6300          | coa-ready       | requestable     | ✅      |
| `semax-5mg`                       | MGX-NEU-SMX-005      | reference   | 5900          | coa-ready       | limited-review  |        |
| `selank-5mg`                      | MGX-NEU-SEL-005 / SLK-005 | reference | 6100        | document-review→coa-ready (note slug mismatch between seed and migration 6) | limited-review |        |
| `dihexa-5mg`                      | MGX-NEU-DHX-005      | reference   | 9500          | coa-ready / document-review (seed vs mig6) | limited-review |     |
| `ghk-cu-50mg-100mg`               | MGX-COP-GHK-050100 / DRM-GHK-100 | handling/reference (seed vs mig6) | 7200/8800 (DRIFT) | coa-ready | limited-review |    |
| `ghk-cu-bpc-157-tb-500-blend`     | MGX-COP-GBT-TRI / DRM-GBT-015 | handling/reference (seed vs mig6) | 10900/9900 | document-review | limited-review |     |
| `hgh-frag-176-191-5mg`            | MGX-ML-HGF-005 / GH-FRG-005 | analytical | 6800/6500 | coa-ready | limited-review |             |
| `mazdutide-10mg`                  | MGX-ML-MAZ-010 / MTB-MZD-010 | analytical | 9800/8700 | document-review | limited-review |          |
| `mots-c-10mg-40mg`                | MGX-ML-MOT-010040 / MTB-MOT-040 | analytical | 8900/9100 | coa-ready | limited-review |              |
| `foxo4-dri-10mg`                  | MGX-ML-FOX-010 / SEN-FOX-010 | analytical/reference | 11900/11200 | document-review | limited-review |       |
| `humanin-10mg`                    | MGX-ML-HUM-010 / SEN-HMN-010 | analytical/reference | 7600/9800 | coa-ready | limited-review |             |

**⚠️ Drift between `seed.sql` and `migration 6 (unify_catalog_products)`:** Many SKUs, prices, categories, and documentation states differ between the seed file (regenerated from `lib/catalog-seed.ts`) and the inline INSERT in migration 6. Migration 6 was the older version; the seed file is canonical. If the database was provisioned via migrations only, it will have the migration-6 values and `seed.sql` won't have run automatically (the seed script is not part of `supabase db push` unless `[db.seed].enabled=true` and the file is at `./supabase/seed.sql` — which it is). Verify by `select sku, price_cents, documentation_status, availability_status from public.products order by id;` against current production.

---

## 20. Marketing-Copy Compliance Guardrail

`lib/compliance.ts` has `assertMarketingCopySafe(copy)` that throws on:
```
weight loss, bodybuilding, human use, human consumption,
diagnose, treatment, cure, prevent disease, dose/dosing, protocol
```

Used in `tests/catalog.test.ts` against every catalog row name+summary. Also `lib/content/categories.ts` exports `publicClaimGuardTerms` (8 terms) used in `tests/site-content.test.ts` to scan public category copy + product previews.

---

## 21. Security Headers (`site/next.config.ts`)

Applied via `headers()` in next config to `/(.*)`:
- `Content-Security-Policy` — strict; `script-src 'self' 'unsafe-inline' 'unsafe-eval' https://va.vercel-scripts.com`; `connect-src 'self' https://<supabase> wss://<supabase> https://vitals.vercel-insights.com https://*.ingest.sentry.io https://*.ingest.us.sentry.io https://*.sentry.io`
- `Strict-Transport-Security: max-age=31536000; includeSubDomains; preload`
- `X-Frame-Options: DENY`
- `X-Content-Type-Options: nosniff`
- `Referrer-Policy: strict-origin-when-cross-origin`
- `Permissions-Policy: camera=(), microphone=(), geolocation=(), payment=()` — note: `payment=()` blocks the Payment Request API which is fine for hosted Stripe Checkout but would break embedded Stripe Elements.
- `X-DNS-Prefetch-Control: on`
- `upgrade-insecure-requests` only in production with HTTPS site URL

`Sentry.tunnelRoute = "/monitoring"` in withSentryConfig — Sentry beacons proxied through the app to bypass adblockers.

---

## 22. Production-Grade Gaps (TODOS + DEPLOYMENT + REPO_SEPARATION)

**From TODOS.md:**
- Decide if relaunch wedge stays "full private checkout" or shifts to discovery-first or pay-after-approval (CEO challenge unresolved)
- Decide canonical commerce data: keep extending `research_order_requests` semantically OR split into clean `orders/order_items/payments/order_events` (Eng challenge — partly addressed by migration 5+ which created clean `orders` table separately, but `research_order_requests` still exists for the manual request path)
- Decide if provider-agnostic payment adapter is worth keeping before the second processor
- If cart stays browser-local in v1, document same-device limitation explicitly; otherwise add server-owned draft order
- Deferred scope: org accounts/approvers, saved carts, reserved inventory, full DESIGN.md before relaunch
- Design follow-ups: create `DESIGN.md`, fix designer access, run `/design-review` after implementation
- Public deployment gate: vector-bio-supply-demo must NOT ship publicly without legal/editorial review

**From REPO_SEPARATION_REPORT.md:**
- DNS for `mogtrix.bio` and `www.mogtrix.bio` shows "Invalid Configuration" in Vercel.
  - Required: A `@ → 216.198.79.1` and CNAME `www → ebe5acf2f3a2f82c.vercel-dns-017.com.`
  - Or use Vercel nameservers `ns1.vercel-dns.com`, `ns2.vercel-dns.com`
- Working URL today: `site-omega-three-59.vercel.app`

**From DEPLOYMENT.md launch checklist:**
- Have a qualified attorney review every page under `/legal` before public launch
- Replace temporary admin passcode flow with Supabase Auth before sensitive submissions
- Confirm public preview pages do not expose prices/medical claims/dosing
- Confirm hosted checkout limited to qualified buyers, US-only, `checkout_enabled` SKUs only
- Submit a real test access request, confirm it appears in `/admin`
- Run one Stripe sandbox purchase end-to-end, verify visible in `/account/orders/[id]` AND `/ops`
- Run one failed/expired Stripe sandbox payment, verify follow-up state
- Stripe Tax must be enabled for the pilot account
- All env vars present in Vercel Production AND Preview environments

---

## 23. Conventions Worth Knowing

- **`lint` is `tsc --noEmit`**, not eslint. Don't add `eslint` errors expecting CI to flag.
- **No emojis in shipped code** (per global system rules; the demo HTML uses ✓ checkmarks but those are explicit content)
- **Server components by default**, `"use client"` only where needed (forms, animation, stores)
- **All API routes return JSON consistently**: `{ error: string }` for errors, domain payload otherwise. Status codes are intentional (401 vs 403, 400 vs 503).
- **IDs are prefixed**: `req_<uuid-without-dashes>` for research requests, `ord_<uuid>` for orders, Stripe-generated for sessions.
- **Idempotency keys** are required UUIDs from the client and unique-indexed in DB. RPC returns `duplicate: true` instead of erroring on retry.
- **Server-side rate limiting**: 5 requests per 15min per IP hash via SQL count in `create_research_order_request`.
- **Origin IP is hashed** (sha256) before storage; user-agent truncated to 512 chars; request_origin truncated to 200.
- **Page titles** use a `%s | Mogtrix` template via `metadata.title.template`.

---

## 24. What's Not Here

- **No `DESIGN.md`** at the repo root yet (TODOS flags this as a follow-up). The lightweight token contract lives inside `plans/mogtrix-full-checkout-relaunch-plan.md`.
- **No actual mockups, Figma, or design files** in the repo. Visual decisions are coded in the components directly.
- **No CI deploy step** — Vercel deploys on push to main automatically. CI only runs lint + test + build (NOT e2e).
- **No legal review tracking** — TODOS.md says attorney review is required pre-launch; no record of it being done.
- **No payment provider abstraction beyond stripe + stub** — adapter pattern exists but only one real provider.
- **No org accounts, PO/invoice flow, multi-device cart sync, reserved inventory, saved carts** — all explicitly deferred.

---

## 25. Brainstorming Continuation Point

When this brain was written, the user had:
1. Asked for help finishing the website to "100% production-grade deployment"
2. Mentioned they want to incorporate "claude design" (likely Claude.ai's design tool) and bring it to the site for production
3. Demanded use of every superpowers + gstack skill
4. Started a new brainstorming flow per `superpowers:brainstorming`
5. Accepted the **visual companion** offer ("yes lets try it")

**Where we are in the brainstorming skill flow:**
- ✅ Explore project context (this file IS that context)
- ✅ Offer visual companion (user accepted)
- ⏸️ **Ask clarifying questions one at a time** ← resume here
- ⬜ Propose 2-3 approaches with trade-offs
- ⬜ Present design sections + get approval
- ⬜ Write design doc to `docs/superpowers/specs/YYYY-MM-DD-mogtrix-production-launch-design.md`
- ⬜ Spec self-review
- ⬜ User reviews spec
- ⬜ Transition to `superpowers:writing-plans`

**First clarifying question to ask the user (in the new chat):**
> What does "100% production-grade deployment" mean to you concretely? Pick the closest match (or describe your own):
>
> **A)** "Functionally complete & live to real buyers" — DNS for mogtrix.bio fixed, Stripe sandbox → live keys, attorney legal review done, first staff operator promoted, smoke + e2e green on prod, one real test order processed end-to-end.
>
> **B)** "Polished public site" — same as A but with a finished design system, all marketing copy reviewed, mobile QA, accessibility audit, SEO check, performance budget met.
>
> **C)** "Everything in TODOS.md closed" — same as B plus the autoplan deferred items (DESIGN.md, server-owned cart, dropping the placeholder admin passcode for Supabase admin auth, etc.).
>
> **D)** Some other definition — tell me.

**Open questions that will need answers before any code is written:**
1. The "claude design" reference — is the user planning to use Claude.ai to generate a new visual design separately, then port it into Next code? Or do they want me to design here in the chat using the visual companion?
2. Do they want to keep the current dark + acid-green visual language, or open to a redesign?
3. Are they OK with the current 3-step qualification flow + qualification questions copy, or want changes?
4. Should the manual `/request` and legacy `/access` paths be retired, or keep both?
5. Stripe live-keys timing — go straight to live, or stay on sandbox for the first cohort?
6. Vector-bio-supply-demo: leave as-is (local-only investigative artifact) or strip out before launch?

---

## 26. Quick Verification Commands

```bash
cd /root/mogtrix-website
git log --oneline -5                    # check current commit
git status                              # check working tree state
ls site/supabase/migrations/            # verify 9 migrations present
wc -l plans/mogtrix-full-checkout-relaunch-plan.md   # 905
wc -l site/lib/customer.ts              # 225
wc -l site/lib/ops.ts                   # 529
wc -l site/lib/content/products.ts      # 746
cat site/.env.example                   # confirm env shape

# Site verification
cd site
npm ci                                  # install deps
npm run lint                            # tsc --noEmit
npm run test                            # vitest 145+ tests
npm run build                           # next build
# npm run e2e                           # requires playwright install --with-deps
```

---

## 27. End of Brain

This file represents Claude's full read of the repo on 2026-05-05 against commit `776a854`. Future sessions: trust this file as the working model, but verify any specific claim before acting on it. The codebase changes; this file does not.
