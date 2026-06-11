# VialChem Labs — Customer Accounts Mega-Spec

**Date:** 2026-05-25
**Branch (to create):** `feat/customer-accounts`
**Author:** Operator (endegenaassefa2@gmail.com) + Claude
**Mode:** Autonomous execution. Drive through brainstorm/spec/plan/execute gates without per-gate approval. Surface only irreversible / external decisions (Vercel env mutations, Supabase auth setting changes, anything that touches live customers before merge).
**Predecessor:** PR #64 (`feat/auth-flow-redesign`) — fixes the immediate "View orders → Sign in wall" bug. Its commits roll into this branch; PR #64 closes when this lands.
**Single PR:** Yes. Operator chose option 2 (hold #64, ship everything together) because the half-fix would expose the *bigger* gap — that "Welcome, $email + 3 buttons where 2 are nav links" is not a real customer account.

---

## 1 — Mission (one paragraph)

Build VialChem Labs a real customer account system. Replace the magic-link-only flow + skeletal welcome screen with: a full registration form (name, age 21+, contact, research-organization classification, address, password), email-confirmation gate, working account dashboard with tabs (Profile / Addresses / Orders / Security), uniqueness enforcement that doesn't permanently lock a customer out if they delete their account, and a graceful migration path for the ~handful of customers who already signed up via magic-link before this rebuild. The live ad campaign is running; do this once, do it right, ship as one cohesive PR, and don't leave the codebase mid-refactor.

---

## 2 — Why this is urgent

| Pain | Cost |
|------|------|
| "View all orders →" lands on "Sign in to see your orders" *after* successful sign-in | Customer trust killer. Every signed-in user who clicks orders thinks the auth is broken. |
| Account page is 3 buttons where 2 (Lab Reports, Shop catalog) are duplicate site nav | The account page does not feel like an account. Customers cannot edit a single thing. |
| No address, no name, no research-org classification on file | Order fulfillment relies on per-checkout shipping snapshot. Customer profile data is empty. |
| No password option | Magic-link is single-channel — if email is down, they can't get in. Repeat customers want fast login. |
| No uniqueness enforcement | A customer can register infinite times with the same email via magic-link (Supabase doesn't reject re-registration; it just sends another link). No friction against bad actors. |
| No account deletion | GDPR / privacy compliance gap. Customers can't leave cleanly. |
| Live ad campaign | Every broken click costs CAC. The longer the broken account experience lives, the more it bleeds. |

---

## 3 — Scope (what's IN)

### 3.1 Registration

A real `/register` page. Required fields:

- **Full legal name** — single text input, validated 2-120 chars. Not split into first/last (research operators frequently have mononym, hyphenated, or non-Latin names).
- **Date of birth** — date picker, calculated `(today - dob) >= 21 years`. Reject if < 21. (Stricter than current age-gate cookie which is just "I confirm I'm 21+".)
- **Email** — required. Lowercased. Validated. Becomes the auth identity.
- **Phone** — optional but encouraged. Validated as E.164 (international format). If provided, unique constraint applies.
- **Research organization type** — required select. Options:
  1. University / academic lab
  2. Biotech / pharma company
  3. Independent research organization
  4. Contract research organization (CRO)
  5. Government / public-sector lab
  6. Individual researcher
  7. Other (text field appears if selected)
- **Research focus** — required free text, 10-500 chars. Customer describes their work in 1-3 sentences. (Replaces the "what is your research" gut-check the operator does manually today.)
- **Mailing address** — required. Fields: street1, street2 (optional), city, state, postal code, country (default US, dropdown to international).
- **Shipping address** — optional. Defaults to mailing. Form shows a checkbox: "☑ Shipping address is the same as mailing." If unchecked, the shipping fields appear.
- **Password** — required. Rules:
  - 12-128 characters
  - Must contain at least 1 uppercase, 1 lowercase, 1 digit
  - No special-character requirement (NIST 800-63B guidance: complexity rules harm more than help)
  - Reject the 10,000 most common passwords (use the `@zxcvbn-ts/core` library; deny if score < 3)
  - Confirm password field (must match)
- **Terms acceptance** — checkbox. "I confirm I am 21+ and acknowledge research-use-only policy." Required.

### 3.2 Email confirmation

After submitting registration:
1. Account row is created with `status = 'pending_email_verification'`.
2. Supabase Auth user is created via admin API with `email_confirm: false`.
3. We send a custom confirmation email via Resend with a tokenized link to `/auth/confirm-email?token=...` (HMAC, 24h TTL, reuses the same pattern as `lib/auth/order-token.ts` from PR #64).
4. On click → token verified → account row updated to `status = 'active'` → Supabase user's `email_confirmed_at` set → session established → redirect to `/account?welcome=1`.
5. Unconfirmed accounts can't sign in (login attempt returns a "check your email" message + offers to resend confirmation).

**Why custom token instead of Supabase's built-in confirm flow:** we already own this pattern from PR #64, the link works cross-device, and we get full control over the post-confirm landing (the welcome screen). Supabase's built-in flow hijacks the URL hash with a different schema.

### 3.3 Sign in

`/login` page is rebuilt:

- Default form: **email + password**.
- "Forgot your password?" link below the form → `/forgot-password`.
- "Sign in with a magic link instead" expandable section → existing magic-link OTP flow (preserved for repeat customers + as fallback).
- After sign-in (whether password or magic-link): redirect to `?next=` if present, else `/account`.
- Pending-verification users see a clear inline message: "Your email is not yet confirmed. We sent a link to {email}. [Resend confirmation]."

### 3.4 Forgot password

`/forgot-password`:
- Single email input.
- Uniform anti-enumeration response: "If an account with that email exists, we sent a reset link." (Same pattern as `/track-order`.)
- Email contains an HMAC-tokenized link to `/reset-password?token=...` (1-hour TTL).
- On valid token → form with new password + confirm. On submit → Supabase admin `updateUser` → invalidate the token → redirect to `/login?reset=1`.

### 3.5 Account dashboard

`/account` rebuilt as a real dashboard. Layout: sticky left rail (or top tabs on mobile) with sections:

#### Tab 1: Profile (`/account` default)
- Display name, email, phone, date of birth (age computed), research org type, research focus.
- "Edit" button per section opens inline form. Save → optimistic UI → Supabase update.
- Email change requires re-verification (sends a new confirmation link to the new address; until clicked, the email stays as the old one).
- Date-of-birth is **immutable after registration** (mistype would let people back-door age-gate). Show as read-only with a "Contact support to change" affordance.
- Phone change is allowed and requires no re-verification (no SMS infrastructure yet — this is a future TODO).

#### Tab 2: Addresses (`/account/addresses`)
- Mailing address card with edit button.
- Shipping address card with edit button + "Same as mailing" toggle.
- Edit form uses the same Address schema as registration (extract to `components/forms/AddressForm.tsx`).
- Note: checkout already has its own address form (`AddressForm.tsx` per memory). Keep that as-is — it's the source of truth for the per-order snapshot. The dashboard addresses populate it as defaults but don't replace it.

#### Tab 3: Orders (`/account/orders`)
- The list that already exists in PR #64. Real `OrdersList.tsx` component. **This time it works** — the redirect-when-no-session fix from PR #64 stays. Plus: each order row shows status pill, total, date, and links to `/account/orders/[id]` for the full address-included view (signed-in only) OR the `/orders/[id]?token=...` guest view from email.

#### Tab 4: Security (`/account/security`)
- Change password form (current password + new + confirm).
- Sign out of all sessions (Supabase `signOut({ scope: 'global' })`).
- Delete account — opens a confirmation modal:
  - Requires re-entry of password (or magic-link OTP if no password set on the account)
  - Shows what gets deleted vs archived
  - On confirm: moves data to `archived_accounts` table, removes Supabase auth row, frees email/phone for re-registration, sends a "your account has been deleted" email
  - Redirect to `/?account_deleted=1` with a toast

### 3.6 Header / nav changes

Currently: header has "My Lab" link. Replace with:
- Signed-out: **Sign in** | **Register** (two buttons in header right, per the Biocollex reference)
- Signed-in: **{first-name-or-email-localpart} ▾** dropdown → Account / Orders / Sign out

The "My Lab" label was vague. "Account" is clearer to actual customers.

### 3.7 Uniqueness + re-registration

| Scenario | Behavior |
|----------|----------|
| Same email, account is `active` | Reject. "An account with this email already exists. [Sign in] or [Forgot password]." |
| Same email, account is `pending_email_verification` | Reject. "We already sent a confirmation link to this email. [Resend confirmation]." |
| Same email, account is `archived` (i.e., user previously deleted) | Allow. Email is freed when deletion completes. |
| Same phone, account is `active` or `pending_email_verification` | Reject. "This phone number is already on file. If this is yours, sign in or reset your password." |
| Same phone, account is `archived` | Allow. |

### 3.8 Migration of existing customers

There are existing customers who registered via the magic-link-only flow. They have a Supabase auth row but no profile row. On their next sign-in:

1. Magic-link sign-in still works (we keep this path).
2. After successful sign-in, if profile row is missing → server redirects to `/account/complete-profile` (a one-time flow that collects the same fields as registration *except* password — they keep magic-link as their auth method).
3. They can optionally set a password from `/account/security` later.

No customer is forced into the new flow if they don't sign in. We don't bulk-migrate. Stale accounts stay stale.

---

## 4 — Anti-scope (what's OUT)

Documented so the executor doesn't expand mid-build:

- **Social login** (Google, Apple, GitHub) — not now. Future TODO.
- **SMS OTP** — not now. Phone is a contact field only.
- **2FA / TOTP** — not now.
- **Team / org accounts** — single user per account. (Multi-seat is a Q3 conversation.)
- **Affiliate program changes** — touched only if header nav requires it. Existing affiliate dashboard stays.
- **Newsletter subscription preferences** — keep current implementation in `/account` if it exists; do not redesign.
- **Address book with multiple addresses** — exactly 1 mailing + 1 shipping per account. (Most B2B research labs ship to one location.)
- **Bulk import / CSV** — manual entry only.
- **Admin / staff account UI** — not now. The operator continues to use Supabase Studio for admin tasks.
- **Email change without re-verification** — always re-verifies.

---

## 5 — Decisions already made (do not re-ask)

These are the calls. The executor implements them. If the executor genuinely thinks one is wrong, flag it in the PR description — don't silently deviate.

| # | Decision | Rationale |
|---|----------|-----------|
| D1 | Email always required; phone optional | Email is the auth anchor + order communication channel. Operator said "one of the 2 mandatory" — email is the harder requirement to remove cleanly. |
| D2 | Password is mandatory at registration | Operator was explicit. Magic-link kept as secondary path. |
| D3 | DOB (date), not "21+ checkbox" | Operator said "age mandatory". A date is auditable; a checkbox is not. |
| D4 | Custom HMAC email-confirmation token (not Supabase built-in) | Reuses PR #64's pattern; cross-device-safe; full control over landing page. |
| D5 | Single-shot mailing + shipping (1 each, not address book) | Matches operator description; matches B2B reality. |
| D6 | Account deletion = move to `archived_accounts`, not hard-delete | GDPR-aligned; allows re-registration with same email; gives operator forensic trail if a customer disputes. |
| D7 | Existing magic-link customers get a "complete your profile" funnel on next sign-in, not forced migration | Avoids breaking active customers mid-session. |
| D8 | Single PR (`feat/customer-accounts`) incorporates PR #64's commits | Operator chose option 2. Auth-flow-redesign + customer-accounts ship as one cohesive change. |
| D9 | `zxcvbn-ts` for password strength, NIST-aligned rules | Industry standard; avoids brittle complexity rules. |
| D10 | Welcome screen (post-confirm landing): see §6 below — full design | Operator's message was cut off mid-design; this is my reasoned default. Operator validates in PR review. |

---

## 6 — Post-confirm welcome screen design (the cut-off detail)

Operator was describing this when the message ended. My design:

```
┌──────────────────────────────────────────────────────────────────┐
│  Header (logo / nav / signed-in chip)                            │
├──────────────────────────────────────────────────────────────────┤
│                                                                  │
│    Welcome to VialChem Labs.                                     │
│    Your account is verified.                                     │
│                                                                  │
│  ┌────────────────────────────────────────────────────────┐      │
│  │ Verified ✓  ·  {first name from full_name}             │      │
│  │ {email}                                                │      │
│  │ Member since May 25, 2026                              │      │
│  └────────────────────────────────────────────────────────┘      │
│                                                                  │
│   Your next steps                                                │
│                                                                  │
│   ┌──────────────┐ ┌──────────────┐ ┌──────────────┐             │
│   │ Shop catalog │ │ View lab     │ │ Manage your  │             │
│   │  ↗           │ │ reports      │ │ profile      │             │
│   │              │ │  ↗           │ │  ↗           │             │
│   └──────────────┘ └──────────────┘ └──────────────┘             │
│                                                                  │
│   ── Recent orders ──────────────────────────────────────        │
│                                                                  │
│   You haven't placed an order yet.                               │
│   [Browse the catalog →]                                         │
│                                                                  │
│   ── Account details ────────────────────────────────────        │
│                                                                  │
│   Name             {full_name}            [Edit]                 │
│   Email            {email}                [Edit]                 │
│   Phone            {phone or "Not set"}   [Edit]                 │
│   Research org     {org_type}             [Edit]                 │
│   Mailing addr     {one-line summary}     [Edit]                 │
│                                                                  │
│   [Sign out]   [Account settings]                                │
│                                                                  │
└──────────────────────────────────────────────────────────────────┘
```

Key changes vs current:
- Account info IS visible (operator's complaint: "2 of 3 options are website nav, not account").
- The 3 "next step" tiles are smaller affordances at the top, not the whole page.
- Editable account details live ON the welcome page (no separate page click).
- "Recent orders" inline, not behind a link.

If the operator wants a different layout after seeing it, change `app/account/page.tsx`. The structure is component-driven; layout is cheap.

---

## 7 — Data model

### 7.1 New tables (PostgreSQL via Supabase)

```sql
-- 7.1.1 customer_profiles
create table public.customer_profiles (
  id uuid primary key default gen_random_uuid(),
  auth_user_id uuid not null unique references auth.users(id) on delete cascade,
  email text not null unique,
  phone text unique,
  full_name text not null check (char_length(full_name) between 2 and 120),
  date_of_birth date not null,
  research_org_type text not null check (research_org_type in
    ('university', 'biotech', 'independent_research', 'cro', 'government', 'individual', 'other')),
  research_org_other text,
  research_focus text not null check (char_length(research_focus) between 10 and 500),
  status text not null default 'pending_email_verification' check (status in
    ('pending_email_verification', 'active', 'suspended')),
  email_confirmed_at timestamptz,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  constraint age_at_least_21 check (date_of_birth <= current_date - interval '21 years')
);

create index customer_profiles_email_idx on public.customer_profiles(email);
create index customer_profiles_phone_idx on public.customer_profiles(phone) where phone is not null;
create index customer_profiles_auth_user_id_idx on public.customer_profiles(auth_user_id);

-- 7.1.2 customer_addresses
create table public.customer_addresses (
  id uuid primary key default gen_random_uuid(),
  profile_id uuid not null references public.customer_profiles(id) on delete cascade,
  kind text not null check (kind in ('mailing', 'shipping')),
  street1 text not null,
  street2 text,
  city text not null,
  region text not null,
  postal_code text not null,
  country text not null default 'US',
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  unique (profile_id, kind)
);

-- 7.1.3 archived_accounts (soft-delete dest)
create table public.archived_accounts (
  id uuid primary key default gen_random_uuid(),
  original_profile_id uuid not null,
  email text not null,
  phone text,
  full_name text not null,
  date_of_birth date not null,
  research_org_type text not null,
  research_org_other text,
  research_focus text not null,
  archived_at timestamptz not null default now(),
  archive_reason text,
  raw_snapshot jsonb not null  -- full profile + addresses snapshot
);

create index archived_accounts_email_idx on public.archived_accounts(email);

-- 7.1.4 RLS policies (locked down: service-role bypasses, customers see only their own row)
alter table public.customer_profiles enable row level security;
alter table public.customer_addresses enable row level security;
alter table public.archived_accounts enable row level security;

create policy "customers can read their own profile"
  on public.customer_profiles for select
  using (auth.uid() = auth_user_id);

create policy "customers can update their own profile (no status change)"
  on public.customer_profiles for update
  using (auth.uid() = auth_user_id)
  with check (auth.uid() = auth_user_id and status = 'active');

create policy "customers can read their own addresses"
  on public.customer_addresses for select
  using (exists (
    select 1 from public.customer_profiles p
    where p.id = profile_id and p.auth_user_id = auth.uid()
  ));

create policy "customers can manage their own addresses"
  on public.customer_addresses for all
  using (exists (
    select 1 from public.customer_profiles p
    where p.id = profile_id and p.auth_user_id = auth.uid()
  ));

-- archived_accounts: no customer access. Service role only.
```

### 7.2 Migration ordering

1. Apply migration via Supabase dashboard SQL editor OR via `supabase db push` (operator decides).
2. Backfill: zero rows. Existing magic-link customers don't get a profile until they sign in next.
3. No destructive drops in this migration.

### 7.3 New env vars

| Var | Purpose | Where set |
|-----|---------|-----------|
| `ORDER_TOKEN_SECRET` | From PR #64. Unchanged. | Vercel (already pending) |
| `ACCOUNT_EMAIL_TOKEN_SECRET` | HMAC for email-confirmation + password-reset links | Vercel + .env.local (`openssl rand -hex 32`) |
| `ACCOUNT_EMAIL_TOKEN_SECRET_PREVIOUS` | Rotation overlap | Optional |

Operator must add these to Vercel Production env before the smoke test.

---

## 8 — Auth architecture

```
                  ┌─────────────────────────┐
                  │   Customer browser      │
                  └───────────┬─────────────┘
                              │
              ┌───────────────┴───────────────┐
              │                               │
       /register                          /login
              │                               │
              ▼                               ▼
    POST /api/auth/register         POST /api/auth/sign-in
      • zod-validate                  • zod-validate
      • check uniqueness (email,       • supabase.auth.signInWithPassword OR
        phone) against profiles +        signInWithOtp
        archived_accounts             • on success: set Supabase cookie
      • supabase.admin.createUser
        (email_confirm=false)
      • insert profile (status=
        'pending_email_verification')
      • insert addresses
      • send confirmation email
        via Resend w/ HMAC token
              │
              ▼
       /auth/confirm-email?token=...
              │
              ▼
       • verifyConfirmationToken
       • supabase.admin.updateUser
         (email_confirmed_at=now())
       • profiles set status='active'
       • establish session
       • redirect → /account?welcome=1
```

Server-side: `serviceSupabase()` for admin actions. Client-side: `browserSupabase()` for the auth state hook (existing `useSupabaseUser` from PR #64).

Token format identical to `order-token`: `base64url(payload).hmac_hex`. Payload: `{ purpose: 'confirm-email' | 'password-reset', userId, email, exp }`.

---

## 9 — Validation rules (single source of truth)

`lib/validation/customer.ts` exports zod schemas reused by client + server:

```ts
export const fullNameSchema = z.string().trim().min(2).max(120);
export const emailSchema = z.string().trim().toLowerCase().email().max(254);
export const phoneSchema = z.string().regex(/^\+?[1-9]\d{6,14}$/).optional();
export const dobSchema = z.string().date().refine(d => /* age >= 21 */);
export const orgTypeSchema = z.enum([...]);
export const orgOtherSchema = z.string().min(2).max(120).optional();
export const researchFocusSchema = z.string().trim().min(10).max(500);
export const passwordSchema = z.string().min(12).max(128).refine(/* upper+lower+digit, zxcvbn>=3 */);
export const addressSchema = z.object({
  street1: z.string().min(1).max(200),
  street2: z.string().max(200).optional(),
  city: z.string().min(1).max(100),
  region: z.string().min(1).max(100),
  postal_code: z.string().min(2).max(20),
  country: z.string().length(2).default('US'),
});

export const registrationSchema = z.object({...all of the above + terms_accepted: z.literal(true)})
  .refine(data => data.org_type !== 'other' || data.org_other);
```

---

## 10 — Email flows

| Trigger | Resend template (inline TSX) | Tag |
|---------|------------------------------|-----|
| Registration submitted | "Confirm your VialChem Labs account" — single CTA button → `/auth/confirm-email?token=...` | `account-email-confirm` |
| `/forgot-password` submitted | "Reset your VialChem Labs password" — CTA → `/reset-password?token=...` | `account-password-reset` |
| Email changed (from /account profile edit) | "Confirm your new email" — CTA to new address | `account-email-change` |
| Account deleted | "Your VialChem Labs account has been deleted" — informational | `account-deleted` |
| Magic-link sign-in (legacy customers) | Existing template | `magic-link` (unchanged) |

All use existing `sendEmail` helper. Add tag union entries to `lib/email/resend.ts`.

---

## 11 — UI surfaces (page-by-page checklist)

| Page | Status | Notes |
|------|--------|-------|
| `/register` | NEW | Multi-section form. Progress indicator at top. |
| `/login` | REBUILD | Password + email primary; magic-link secondary in expandable section. |
| `/forgot-password` | NEW | Single email input. Uniform response. |
| `/reset-password?token=...` | NEW | New password + confirm. Token verified server-side. |
| `/auth/confirm-email?token=...` | NEW | Server component. Verifies + establishes session + redirects. |
| `/account` | REBUILD | Welcome screen layout from §6. |
| `/account/addresses` | NEW | Mailing + shipping cards with inline edit. |
| `/account/orders` | KEEP (from PR #64) | The list that finally works. |
| `/account/orders/[id]` | NEW | Signed-in detailed order view (full address shown, unlike guest view). |
| `/account/security` | NEW | Change password, sign out everywhere, delete account. |
| `/account/complete-profile` | NEW | One-time onboarding for legacy magic-link customers. |
| `/orders/[display_id]?token=...` | KEEP (from PR #64) | Guest receipt view; PII-minimized. |
| `/track-order` | KEEP (from PR #64) | Anti-enum form. |

Header component (`SiteHeader.tsx`) updated: signed-out shows Sign in + Register; signed-in shows email-dropdown.

---

## 12 — Iron Laws (hard constraints)

These come from the project's working rules (see `CLAUDE.md`, prior memory):

1. **Iron Law 2.1 (TDD):** Every new endpoint, validation rule, and lib function gets a vitest test BEFORE the production code is written. No exceptions on security-sensitive paths.
2. **Iron Law 2.4 (forbidden words):** Avoid placeholder text and forbidden patterns. The pre-commit hook will block "treat", and likely others. Use plain prose.
3. **Iron Law 2.41 (no placeholders):** No "Lorem ipsum", "Acme Co", "TODO: real copy". All customer-facing copy is final at PR open.
4. **Iron Law 2.45 (brand neutrality / accuracy):** Copy reflects VialChem Labs identity — research-grade, RUO, compliance-aware. No generic e-commerce copy.
5. **Codex review mandatory** on auth + payment + compliance paths (per operator memory). Run `gstack:codex` on the diff before opening the PR.
6. **No backwards-compat cruft.** This is a clean rebuild. Delete the old `app/account/page.tsx` skeleton, don't preserve dead branches. The `lib/auth-store.ts` is already gone (PR #64).
7. **No console.log in shipped code.** Use `captureException` for errors.
8. **`force-dynamic` + `runtime = nodejs`** on every route that touches Supabase admin.
9. **Anti-enumeration on every account-discovery endpoint** (`/forgot-password`, `/register` with existing email, etc.) — uniform 200, no status differentiation. Pattern from `app/api/track-order/route.ts`.
10. **Rate limit** every POST endpoint via `isRateLimited()` (the Upstash-aware wrapper). New entries in `lib/rate-limit.ts`:
    - `register`: 5/hr by IP, 2/hr by email
    - `forgotPassword`: 10/hr by IP, 3/hr by email
    - `resetPassword`: 10/hr by IP, 5/hr by token-payload-email
    - `emailChange`: 5/hr by user

---

## 13 — Test plan

### 13.1 Unit (vitest)

`tests/unit/auth/`:
- `account-email-token.test.ts` — sign/verify/expire/tamper/rotation (~15 tests). Mirrors `order-token.test.ts`.
- `password-policy.test.ts` — zxcvbn integration, length, complexity (~10 tests).
- `validation/customer.test.ts` — every zod schema, edge cases including unicode names, international phone, edge DOB (exactly 21 today) (~25 tests).

`tests/unit/api/`:
- `auth/register.test.ts` — uniform response on existing email/phone, on archived re-registration, on malformed body, on rate-limit, on DB error (~12 tests).
- `auth/sign-in.test.ts` — password path, magic-link path, pending-verification rejection (~8 tests).
- `auth/confirm-email.test.ts` — valid token, expired, tampered, replay attack, wrong user (~8 tests).
- `auth/forgot-password.test.ts` — uniform response invariant, rate-limit (~6 tests).
- `auth/reset-password.test.ts` — token validation, password update, token revocation post-use (~8 tests).
- `account/delete.test.ts` — archive row creation, profile cascade, auth row deletion, email freeing (~6 tests).
- `account/profile-update.test.ts` — RLS enforcement, email-change re-verify flow (~6 tests).

### 13.2 Integration / E2E (Playwright)

`tests/e2e/customer-accounts.spec.ts`:
- Full registration → email confirm (mock Resend) → land on welcome
- Sign in with password, then sign in with magic link (mock OTP)
- Edit profile fields
- Add shipping address different from mailing
- Forgot password → reset → sign in with new password
- Delete account → confirm gone → re-register with same email → succeeds

### 13.3 Regression guards

- PR #64's `/orders/[id]?token=...` still works.
- `/track-order` uniform response unchanged.
- Existing magic-link customers can sign in and are routed to `/account/complete-profile`.

### 13.4 Coverage target

100% line coverage on `lib/auth/` and `app/api/auth/`. Lower is unacceptable on auth code.

---

## 14 — Codex review checkpoints

Per operator memory ("for payment/compliance/security paths, always run gstack:codex; surface reviewers verified Layer 3 called but missed metadata-key mismatch making it silently fail open"):

Run codex review after each of these milestones, **before** moving on:

1. After data model migration + RLS policies written
2. After `lib/auth/account-email-token.ts` written (token sign/verify lib)
3. After `/api/auth/register` + `/api/auth/confirm-email` written (the registration pipeline)
4. After `/api/auth/forgot-password` + `/api/auth/reset-password` written
5. After account-deletion endpoint + `archived_accounts` move logic written
6. Final pre-PR full-diff review

Fix every CRITICAL / HIGH finding before progressing. Document MEDIUM findings inline; defer LOW only with explicit operator approval.

---

## 15 — Single-PR rollout plan

### 15.1 Branch strategy

```bash
git checkout main
git pull
git checkout -b feat/customer-accounts
git cherry-pick 7cf540ac   # PR #64's single commit
# build everything else on top
```

Resulting PR contains PR #64's work + everything new. When this PR merges, close PR #64 with a comment "rolled into #NEW".

### 15.2 Commit ordering

One commit per logical milestone (NOT one mega-commit):

1. `feat(db): customer_profiles + customer_addresses + archived_accounts schema`
2. `feat(auth): account-email-token lib with HMAC sign/verify + rotation`
3. `feat(validation): customer zod schemas + password policy`
4. `feat(api): POST /api/auth/register + email confirmation`
5. `feat(api): GET /auth/confirm-email token landing`
6. `feat(api): forgot-password + reset-password flow`
7. `feat(auth): rebuild /login with password + magic-link fallback`
8. `feat(ui): /register multi-section form`
9. `feat(ui): /account welcome screen + profile edit`
10. `feat(ui): /account/addresses with mailing + shipping`
11. `feat(ui): /account/security with delete-to-archive`
12. `feat(ui): /account/complete-profile for legacy customers`
13. `feat(header): replace 'My Lab' with Sign in/Register + account dropdown`
14. `chore(email): new Resend templates + tag union update`
15. `chore(rate-limit): new entries for register/forgot/reset/email-change`
16. `test: integration + regression coverage`

Each commit is independently sensible. The PR is the unit; the commits are the audit trail.

### 15.3 Pre-merge checklist (in PR body)

```
- [ ] All 1596+ existing tests pass
- [ ] New tests added (target: ~120 unit + 6 e2e). All pass.
- [ ] Typecheck clean
- [ ] Lint 0 errors
- [ ] Codex review run, 0 unresolved CRITICAL/HIGH
- [ ] Iron Law audit: no forbidden words, no placeholders
- [ ] Supabase migration applied to PROD (verified via list_tables)
- [ ] ACCOUNT_EMAIL_TOKEN_SECRET set in Vercel Production
- [ ] ORDER_TOKEN_SECRET set in Vercel Production (from PR #64)
- [ ] Resend templates reviewed in inbox preview
- [ ] Smoke test (§16) run on Vercel preview deploy, all 12 steps pass
```

---

## 16 — Post-deploy smoke test (12 steps)

To be run on Vercel preview URL after PR opens, then again on prod after merge:

1. **Register** a new account with a real email — full form filled, submit.
2. **Inbox** receives confirmation email within 60s. Click link.
3. **Land** on `/account?welcome=1` — verified pill, profile filled, "Sign out" button visible.
4. **Click "View all orders"** → loads `/account/orders` cleanly. Shows "No orders yet" (because the account is brand new). **Critically: does NOT show "Sign in to see your orders".**
5. **Sign out** from header dropdown.
6. **Sign back in** with email + password. Land on `/account`.
7. **Edit profile** — change phone, save, refresh — change persists.
8. **Add shipping address** different from mailing. Save, refresh, persists.
9. **Forgot password flow** — request reset, click email link, set new password, sign in with new.
10. **Delete account** from /account/security. Confirms with password, then "your account has been deleted" page.
11. **Re-register** with same email — succeeds (because previous was archived).
12. **Magic-link path** — sign-out, request magic link, click, land back signed in. (Verifies legacy path still works.)

Each step has clear pass/fail. If any fail, that's a P0 — fix before claiming done.

---

## 17 — Risk + rollback

### Risk register

| Risk | Mitigation |
|------|------------|
| Live ad campaign customer hits broken flow during deploy | Vercel atomic deploys — old version stays live until new is healthy. Rollback = redeploy prior commit (1 click in Vercel dashboard). |
| Supabase migration breaks existing data | Migration is purely additive (new tables, no alters on existing tables). Reversible by dropping new tables. |
| Existing magic-link customers locked out | They are explicitly preserved. `/account/complete-profile` exists for them. Tested in §13.3. |
| Email confirmation fails to send | Resend has 99.9% SLA. Token TTL is 24h, customer can request resend. UI exposes "Resend confirmation". |
| Rate limit too tight, blocks real customers | Configured generously (5/hr per IP for register). Easy to relax via env / config without redeploy. |
| zxcvbn rejects too aggressively | Score-3 threshold matches OWASP guidance. UI shows the strength bar so customers self-correct. |

### Rollback

```bash
# If post-deploy smoke test fails at a P0 level:
git revert <merge-commit-sha>
git push origin main
# Vercel auto-redeploys the revert.
# DB migration is additive only — no rollback SQL needed.
```

---

## 18 — Open questions (only these — every other decision is made)

**Q1.** Welcome-screen layout (§6) — does the operator want this exact structure, or a different arrangement of the 3 affordance tiles? **Default action if no response:** ship as designed; iterate in a follow-up PR if operator feedback differs.

**Q2.** Header label — is "Sign in" + "Register" the right copy? Or "Sign in" + "Create account"? **RESOLVED 2026-05-25:** operator chose "Sign in" + "Create account" (more explicit, modern e-commerce default). Use this throughout the UI.

**Q1 RESOLVED 2026-05-25:** Welcome-screen layout as designed in §6. Ship it.

That's it. Everything else is in this spec.

---

## 19 — Acceptance criteria

This work is "done" when:

1. All 12 smoke-test steps pass on prod.
2. The original bug ("View all orders → Sign in to see your orders") never reproduces in any test.
3. A new customer can register, confirm, sign in with password, sign in with magic-link, edit profile, manage addresses, delete account, re-register — all without operator intervention.
4. An archived account's email is reusable.
5. Codex review on the final diff finds zero unresolved CRITICAL or HIGH.
6. The `feat/auth-flow-redesign` (PR #64) branch is deleted post-merge and its PR is closed-as-resolved.
7. Resend dashboard shows the new templates landing in inboxes with the expected tags.
8. Vercel deploy is green.

---

## 20 — Execution mode

This spec is sufficient to execute autonomously. The executor (Claude in this or a fresh session, or an Agent worktree) should:

- Read this spec top to bottom before writing code.
- Work through commits in the order in §15.2.
- Run vitest after each commit. Failure halts progress until fixed.
- Run codex review at the checkpoints in §14.
- Open the PR with the checklist from §15.3.
- Surface ONLY irreversible / external decisions for operator approval:
  - Supabase migration apply (operator chooses: dashboard SQL editor vs CLI)
  - Vercel env var addition
  - Final PR merge (operator's call)
  - Anything Codex flags as CRITICAL that needs a judgment call

Everything else: drive through.

End of spec.
