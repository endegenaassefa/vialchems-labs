# Auth Flow Redesign — VialChem Labs

**Date:** 2026-05-25
**Status:** Spec (pre-implementation)
**Author:** Engineering lead (with operator collaboration)
**Context:** Live ad campaign; real customers buying; trust-breaking sign-in regression in production.

## Problem

A customer signs in via magic link, lands on `/account`, clicks "View orders", and sees a "Sign in to see your orders" empty state — **even though they just signed in**. This breaks trust on a live, paid traffic source.

Root causes:

1. **Two auth systems coexist.** Legacy PBKDF2/localStorage (`lib/auth-store.ts`, Zustand) was never removed when Supabase Auth (magic-link) shipped. `/account/page.tsx` checks both; `/account/orders/OrdersList.tsx` only checks Supabase. The mismatch produces a "logged in here, not there" feel.
2. **`OrdersList` treats session-race as unauthorized.** It tries `getSession()` on mount, gets `null` (because supabase-js hasn't rehydrated from localStorage yet), waits 2s for `onAuthStateChange`, and if the event never fires it falls through to a cookie-only `/api/account/orders` call → 401 → "Sign in" CTA. The 2-second timeout is too short for slow networks and the fallback UX is wrong (it shouldn't show a sign-in CTA at all on a page reachable only from a signed-in nav).
3. **No path for guest customers to view their order.** Today, a buyer who didn't sign up has to (a) figure out that they need to "sign in" with the same email they used at checkout, (b) hope the magic link works, (c) hope OrdersList shows their order. There's no direct "view this specific order" link.

## Goals (in priority order)

1. **No regression to "Sign in" after a signed-in customer reaches `/account/orders`.** Once a session exists, the page never asks for it again.
2. **Single source of truth for auth.** Supabase Auth only. Remove legacy `auth-store.ts` and all callers.
3. **Guest customers get a one-click "view my order" path** from their email — no manual sign-in dance.
4. **Account dashboard is honest about what a customer can do.** No fake stat cards, no inactive nav items.

## Non-Goals

- Adding passwords (magic-link remains the only auth method).
- Replacing Supabase Auth.
- Touching the checkout flow (it already collects guest shipping inline — confirmed).
- Building a full user-profile editor (addresses/settings stay read-only for now).

## Design

### 1. Single Supabase auth source of truth

**What changes:**

- Delete `lib/auth-store.ts` (Zustand PBKDF2 store), `lib/use-session-storage.ts` references to it, and all `useCurrentUser` / `useAuthStore` / `useAuthHydrated` imports.
- `/account/page.tsx` reads only Supabase Auth via a new hook `useSupabaseUser()` that returns `{ user, loading }` and subscribes to `onAuthStateChange`.
- Any feature that depended on the legacy "qualification role" stored in localStorage (e.g., research-use attestation) moves to a Supabase `user.user_metadata.qualification` field, written on first sign-in.

**Why:** The dual system is the root of every "logged in here, not there" bug. Removing it eliminates an entire class of failures.

### 2. `/account/orders` no-regression rule

**Invariant:** If the user reached this page from a signed-in nav (the nav only shows "Orders" when a session exists), they have a session. The page must NEVER render a "Sign in" CTA.

**Replacement state machine for `OrdersList`:**

```
initial:        Loading skeleton (3 placeholder rows)
session-known + orders-loaded + non-empty:   Orders list
session-known + orders-loaded + empty:       "No orders yet — browse the catalog"
session-known + fetch-error:                 "We couldn't load your orders — retry button"
no-session (genuinely):                      Redirect to /login?next=/account/orders
                                              (NOT an inline CTA — full redirect)
```

The fallback to "no session" only fires after we've conclusively confirmed there's no session (i.e., `getSession()` returned null AND no `onAuthStateChange` event arrived within a generous window, e.g., 5s).

### 3. Tokenized "view my order" link in confirmation email

**What changes:**

- Order confirmation email (and shipped email) includes a one-click link of the form:
  `https://vialchemlabs.net/orders/{display_id}?token={signed_jwt}`
- The token is a custom HMAC-signed payload (`{order_id, email, exp}`) that grants read-only access to that one order for 90 days.
- **Secret rotation (A1):** verification accepts `ORDER_TOKEN_SECRET` (sign + verify) and an optional `ORDER_TOKEN_SECRET_PREVIOUS` (verify-only). On rotation, set both for ~90 days, then drop the previous. This keeps in-flight email links working through a key rotation.
- **Boot-time guard:** if `ORDER_TOKEN_SECRET` is unset at module init, throw at import time so the server fails loud during deploy, not silently at request time.
- **Forwardable-by-design (A2):** these links are shareable on purpose. The page is view-only and **does not show the shipping address** (the most sensitive PII on an order). Anyone who receives a forwarded link sees only order status, items, totals, carrier + tracking — same info as the confirmation email. Full shipping address stays inside `/account/orders/[id]` which requires a real Supabase session. Same model as Amazon / Shopify guest receipt links.
- New page `/orders/[display_id]/page.tsx`:
  - If `?token=` present + valid → render the order detail.
  - If token expired / invalid → show "Sign in with the email on this order" with a /login redirect that preserves `next=/orders/{display_id}`.
- Existing `/account/orders/[id]/route.ts` continues to work for fully-signed-in users.

**Why:** Guest customers (the dominant path under live ads) get to their order in one click from their inbox, no sign-in friction.

### 4. `/track-order` lookup page

For customers who lost their confirmation email but have the order id:

- Enter email + display_id.
- Server validates they match a real order, then sends a fresh tokenized link to that email.
- Rate-limited (3/hr per email, 10/hr per IP — reuses `lib/rate-limit.ts`).
- **Uniform response (A4):** the endpoint always returns `200 { ok: true, message: "If an order matching that email exists, a link has been sent." }` regardless of whether the order exists, the email matches, or the request was rate-limited. Status differentiation would let an attacker enumerate which emails have orders. Rate limiting stays as defense in depth, not as the only line.

**Why:** Self-service unblock for the inevitable "I can't find my order" emails. Lower support load.

### 5. Account dashboard simplification

`/account/page.tsx` is reorganized around what customers actually came here for:

**Primary (top of viewport, immediately above the fold):**
- Recent orders preview (top 3, fetched with Bearer). This is the #1 reason customers visit /account after buying. It leads.

**Secondary (mid-page):**
- Email (verified pill) + "Member since" line. Identity confirmation, not the headline.

**Tertiary (bottom):**
- Section links: `/account/orders` (full history), `/account/addresses` (only if Supabase address rows exist), Sign out.

Stat cards with "0 active subscriptions / 0 wishlist items / etc." are removed. Don't show empty stats — show real things only.

**Welcome-back microcopy:** after a fresh magic-link sign-in, render a non-blocking pill at the top — `Signed in as {email} · just now` — that auto-dismisses after 4 seconds. Visceral feedback that the link worked. Detection: `URLSearchParams` flag set by `/auth/callback` after a successful exchange.

## Components & Files

### New files

- `lib/auth/use-supabase-user.ts` — single React hook returning `{ user, loading }`.
- `lib/auth/order-token.ts` — sign + verify `view_order` JWTs (HMAC with `ORDER_TOKEN_SECRET`).
- `app/orders/[display_id]/page.tsx` — tokenized guest order view (server component, validates token, renders).
- `app/track-order/page.tsx` + `app/api/track-order/route.ts` — lookup + email-resend flow.

### Modified files

- `app/account/page.tsx` — strip legacy auth-store usage, use `useSupabaseUser`, simplify dashboard.
- `app/account/orders/OrdersList.tsx` — new state machine, no inline "Sign in" CTA, redirect to /login as the only no-session escape hatch.
- `components/AuthHeaderLink.tsx` — switch from `useCurrentUser()` (legacy auth-store) to `useSupabaseUser()`. Without this fix the header would still say "Sign in" after a Supabase magic-link sign-in. **Found by grep during eng review — was missing from initial spec.**
- `lib/email/order-confirmation.ts` + `lib/email/order-shipped.ts` — append tokenized link.
- `components/Shell.tsx` / `SiteHeader.tsx` — "Orders" nav link visibility tied to Supabase session only.

### Deleted files

- `lib/auth-store.ts`
- `lib/use-session-storage.ts` callers that referenced auth-store (the session-storage helper itself can stay — it's used for checkout draft state).
- Any imports of `useCurrentUser`, `useAuthHydrated`, `useAuthStore` (~5 files per a quick grep).

## Data Flow

### Signed-in customer viewing orders

```
Browser                          Next.js                       Supabase
   │                                │                             │
   │  GET /account/orders           │                             │
   ├───────────────────────────────►│                             │
   │  HTML (no orders inline)       │                             │
   │◄───────────────────────────────┤                             │
   │                                │                             │
   │  supabase.auth.getSession()    │                             │
   │  (localStorage rehydrate)      │                             │
   │  → access_token                │                             │
   │                                │                             │
   │  GET /api/account/orders       │                             │
   │  Authorization: Bearer ...     │                             │
   ├───────────────────────────────►│                             │
   │                                │  supabase.auth.getUser(token)│
   │                                ├────────────────────────────►│
   │                                │  { user: { email, id } }    │
   │                                │◄────────────────────────────┤
   │                                │  SELECT FROM orders         │
   │                                │  WHERE email = ...          │
   │                                ├────────────────────────────►│
   │                                │  rows                       │
   │                                │◄────────────────────────────┤
   │  { orders: [...] }             │                             │
   │◄───────────────────────────────┤                             │
   │  Render list                   │                             │
```

### Guest customer clicking confirmation email link

```
Email link: /orders/VC-12345?token=eyJ...

Browser ─► Next.js (server component)
              │
              ├─ verify(token, ORDER_TOKEN_SECRET)
              ├─ extract { order_id, email, exp }
              ├─ SELECT FROM orders WHERE display_id=? AND email=?
              └─ render order detail page
```

No Supabase Auth involved. No sign-in dance.

## Error Handling

- **Invalid token:** Render "This link is no longer valid. Enter your email below to receive a fresh one." with /track-order form inline.
- **Order not found:** Same as above (don't leak that the order id was wrong vs. expired).
- **Rate-limited:** Standard 429 with "Try again in N minutes."
- **Supabase outage on /account/orders:** Show "Order history is temporarily unavailable. Your most recent order from this device:" + sessionStorage stub fallback if present.

## Interaction States (per screen)

### `/orders/[display_id]` (guest tokenized view)

| State | What user sees | Trigger |
|-------|----------------|---------|
| Valid | Full order panel: status pill, items, total, tracking (if shipped) | Token verifies + order found |
| Expired | "This link is no longer valid. Enter your email to get a fresh one." + inline `/track-order` form | Token TTL exceeded |
| Tampered / invalid | Same as expired (don't differentiate) | Token signature mismatch |
| Missing token | Redirect to `/track-order?next=/orders/{display_id}` | No `?token=` param |
| Order refunded | Same panel + neutral "Refunded on {date}" subline. Full item list preserved. | `status === 'refunded'` |

Server-rendered, so no JS-loading state. JS-disabled is fine.

### `/track-order` (lookup)

| State | What user sees |
|-------|----------------|
| Idle | Email input + order-id input + "Email me a link" button. Helper text: "Find an order id in the confirmation email we sent." |
| Submitting | Button shows "Sending..." (disabled). Form inputs disabled. |
| Sent (uniform) | Card replaces form: "If an order matching that email exists, a link has been sent. Check your inbox (and spam) in the next minute." |
| Rate-limited | Same uniform "sent" message (do NOT show "rate-limited" copy — that leaks state). Server-side: 429 but UI renders the success card. |
| Network error | Inline error: "Something went wrong. Try again in a moment." Form stays editable. |

### `/account/orders` (authenticated list)

State machine already specified in §2 above. Addendum: the loading skeleton renders 3 placeholder card-rows of the same height as a real order card to prevent layout shift.

### `/account` (dashboard, after magic-link sign-in)

| State | What user sees |
|-------|----------------|
| Just signed in (`?welcome=1` flag) | "Signed in as {email} · just now" auto-dismiss pill + dashboard |
| Returning user | Dashboard without the pill |
| No Supabase session | Redirect to `/login?next=/account` (not inline CTA) |
| Supabase outage | "Account is temporarily unavailable. Try again in a moment." |

## Design system alignment

All new pages reuse existing components — no new visual primitives:

- `/orders/[display_id]`: `V2Header`, `V2Footer`, `Card`, `Pill`, `VerifyBreadcrumb` pattern (adapted for order context).
- `/track-order`: `V2Header`, `V2Footer`, `Card variant="elevated"`, `FieldLabel`, `Input`, `Button variant="primary" size="lg"`.
- `/account` dashboard: same `Card`/`Pill` vocabulary as `/account/orders`. Welcome pill uses `Pill variant="accent"` with a fade-out CSS transition (300ms).

## Responsive & accessibility

### Mobile (375px / iOS Safari priority)

- Magic-link click opens in the same browser tab (no `target="_blank"` on email anchor).
- `/track-order` form inputs are 48px tall (above iOS minimum), `inputMode="email"` on the email field for the right keyboard.
- `/account/orders` order cards stack vertically on <768px; the right-side pill + price + Detail link wrap to a second row.
- `/orders/[display_id]` content has 24px horizontal padding on mobile to clear notch / safe-area.

### Keyboard navigation

- `/login` and `/track-order` forms: autofocus on email input on page load.
- `/orders/[display_id]` expired state: focus moves to the `/track-order` email input when the fresh-link UI renders.
- `Sign out` button is always reachable via Tab from anywhere on `/account`.

### Screen readers

- Welcome pill on `/account` uses `role="status" aria-live="polite"` so the announcement doesn't interrupt screen-reader navigation.
- Status pills on orders include hidden text: e.g., `<Pill>Shipped<span className="sr-only"> on {date}</span></Pill>`.
- Error states use `role="alert"` (already standard via the existing `Pill variant="error"` pattern).

### Color contrast

All new copy uses existing CSS vars (`--text`, `--text-muted`, `--accent`) which are already WCAG-AA verified. No new color tokens introduced.

## Testing

### Unit

- `lib/auth/order-token.ts` — sign + verify roundtrip, expired-token rejection, tampered-token rejection.
- `app/api/track-order/route.ts` — rate limit hit, valid lookup, mismatched email, missing order.
- `lib/auth/use-supabase-user.ts` — onAuthStateChange subscription cleanup.

### Integration (Vitest + Testing Library)

- `OrdersList` happy path: session present → renders orders.
- `OrdersList` loading state: no session yet → renders skeleton, then orders when session arrives.
- `OrdersList` no-session state: confirmed no session → redirects to /login (assert router.push call).
- `OrdersList` never renders "Sign in" CTA inline (regression guard for the trust-breaking bug).
- `/orders/[id]?token=...` server component: valid token renders order; expired token renders fresh-link UI.

### E2E (Playwright)

- Magic-link sign-in → /account → click Orders → see order list (no flash of "Sign in").
- Guest checkout → click email link in test inbox → land on tokenized order page → no auth required.

### Visual regression

- New `/orders/[id]` page screenshot.
- `/account/orders` loading skeleton screenshot.
- `/account` simplified dashboard screenshot.

## Migration / Rollout

**Single PR, ship-and-smoke-test.** Operator confirmed during eng-review: solo founder + live ad campaign means a 3-phase rollout costs more (three deploys, three verification windows, dual-auth confusion persists through the middle phase) than it saves. One coherent PR is the right move.

1. Implement everything in a single branch (auth-store deletion included).
2. Deploy to production.
3. Within 10 minutes of deploy: sign in as a synthetic test customer (`test+vialchem-{date}@gmail.com`), walk the full flow — magic-link sign-in → `/account` → `/account/orders` → click a real order → sign out.
4. Place a $0.50 cart-test order to verify guest checkout + tokenized email link.
5. If any step regresses, `git revert HEAD && git push`. Revert is faster than a phased rollback.

**Why this is safe:** the auth-store deletion only affects customers who have an existing PBKDF2 localStorage entry — and that data was always client-side-only, never synced. Those customers re-sign-in via magic link (one extra step, one time). All order data lives in Supabase and is keyed by email, so nothing is lost.

## Iron Laws Compliance

- **2.1 TDD:** All new logic shipped with failing tests first.
- **2.5 PROTECTED:** No changes to compliance code (`lib/compliance/*`), purity COA data, or RUO attestation gates.
- **2.41 No placeholders:** Empty-state copy is honest ("No orders yet — browse the catalog"), not aspirational ("Coming soon").
- **2.45 Brand neutrality:** No external lab links touched.

## Open Questions

(Resolved during brainstorming; preserved for posterity.)

- **Q:** Required vs. optional sign-in for checkout? **A:** Optional — guest checkout with email-based order tracking.
- **Q:** Tokenized link vs. force-sign-in? **A:** Tokenized link for guest path; sign-in for repeat-customer dashboard.

## Decision Log

- **D1:** Use HMAC signed tokens instead of Supabase magic links for order-view links. Rationale: doesn't burn Supabase's 4/hr rate limit; doesn't require the customer to have a Supabase user record at all; can grant per-order scope (not full account access); 90-day window is appropriate for an order receipt link.
- **D2:** Full redirect (not inline CTA) for genuine no-session on `/account/orders`. Rationale: an inline "Sign in" form on a page that should only be reachable when signed in is confusing and looks broken.
- **D3:** Keep the legacy `auth-store.ts` for one release (Phase A → B) so we can revert quickly if something regresses. **Superseded by A3 (single-PR rollout) above.**
- **D4:** Guest `/orders/[display_id]` page does NOT show a "Create an account" CTA. Decision: keep it a pure receipt view, matching Amazon/Shopify behavior. Customers who want an account click "Sign in" in the existing header. Rationale: a receipt is not a sales surface.
