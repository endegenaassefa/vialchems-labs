# Supabase Production Provisioning

One-time setup to wire a real Supabase project to the Mogtrix private storefront, hosted pilot checkout, and staff ops workspace.

## 1. Create the project

1. Sign in at <https://supabase.com/dashboard>.
2. Click **New project**.
3. Set the name, choose a region close to Vercel `iad1`, and save the database password in a password manager.
4. Wait for provisioning.

## 2. Capture credentials

In **Project Settings > API**, copy:

| Variable | Where to find it |
| --- | --- |
| `NEXT_PUBLIC_SUPABASE_URL` | Project URL, `https://<ref>.supabase.co` |
| `NEXT_PUBLIC_SUPABASE_ANON_KEY` | API keys, `anon` / `public` |
| `SUPABASE_SERVICE_ROLE_KEY` | API keys, `service_role` / `secret` |
| `OPS_SIGNUP_ENABLED` | Optional Vercel env, `true` only when staff should request inactive accounts |

The service role key has admin powers. Never paste it in client code, never commit it, never share it. Mogtrix only uses it server-side.

## 3. Apply migrations

Recommended:

```bash
brew install supabase/tap/supabase
cd site
supabase link --project-ref <ref>
supabase db push
```

This applies every file in `site/supabase/migrations/`, in timestamp order:

- `20260501194000_backend_foundation.sql` - products, request intake, RLS, RPC writes, rate limiting.
- `20260502004000_ops_auth_and_transitions.sql` - staff ops auth, request transitions, notes, and admin-only policies.
- `20260503001000_customer_auth_and_private_catalog.sql` - customer profiles, private-catalog RLS, the customer-aware `handle_new_auth_user()` trigger body, and the first-pass customer backfill.
- `20260503120000_customer_auth_and_qualification.sql` - qualification fields, `customer_qualifications`, and the latest `handle_new_auth_user()` trigger body.
- `20260504000000_orders_and_payments.sql` - orders, order items, payment intent metadata, and order history.
- `20260504010000_unify_catalog_products.sql` - canonical product metadata, storefront slug backfill, and signed-in catalog visibility rules.
- `20260504100000_hosted_payment_orders.sql` - hosted payment session fields, webhook event storage, and internal paid-order ops notes.
- `20260504120000_first_sale_recovery.sql` - pilot checkout eligibility, atomic order draft creation, atomic webhook reconciliation, and hosted-payment total persistence.
- `20260504130000_order_status_enum_backfill.sql` - post-enum data rewrite for order and history rows using the new hosted-checkout status names.

Studio fallback:

1. Open the Supabase SQL editor.
2. Run **all** migration files above, in timestamp order, top to bottom.
3. Skipping any of them, especially the `customer_auth_*` migrations, leaves the database without `public.customer_profiles` and causes customer login to bounce to `/login?error=access`.
4. Re-run only if needed. The migrations are written to tolerate repeated setup work where possible.

## 4. Seed products

If `supabase db push` did not seed local product data, run `site/supabase/seed.sql` in the SQL editor.

Verify:

```sql
select count(*) from public.products;
-- expect: 15
```

## 5. Create the first staff operator

1. In Supabase Auth, create the staff user's email/password, or set `OPS_SIGNUP_ENABLED=true` and have the operator request access at `/ops/login?mode=signup`.
2. Promote that user:

```sql
update public.profiles
set role = 'admin',
    staff_active = true
where email = '<operator-email>';
```

3. Sign in at `/ops/login`.

## 6. Verify request security

In the SQL editor:

```sql
select pg_get_functiondef('public.create_research_order_request'::regproc);

set role anon;
insert into public.research_order_requests (
  contact_name, organization, email, normalized_email, project_summary, idempotency_key
) values ('test', 'test', 't@t.t', 't@t.t', 'test summary', gen_random_uuid());
reset role;
-- expected: permission denied
```

## 7. Wire env vars to Vercel

In Vercel project settings, add these for Production and Preview:

| Name | Value |
| --- | --- |
| `NEXT_PUBLIC_SITE_URL` | `https://<your-domain>` |
| `NEXT_PUBLIC_SUPABASE_URL` | From step 2 |
| `NEXT_PUBLIC_SUPABASE_ANON_KEY` | From step 2 |
| `SUPABASE_SERVICE_ROLE_KEY` | From step 2, mark sensitive |
| `REQUIRE_SUPABASE` | `true` for preview and production pilot deployments |
| `OPS_SIGNUP_ENABLED` | `true` only for protected pilot deployments where staff signup should be available |
| `PAYMENT_PROVIDER` | `stripe` outside local development |
| `STRIPE_SECRET_KEY` | Stripe secret key for hosted checkout |
| `STRIPE_WEBHOOK_SECRET` | Stripe webhook signing secret |
| `PILOT_US_SHIPPING_CENTS` | Fixed US shipping amount for the pilot |
| `ORDER_EMAIL_FROM` | Sender for order emails |
| `ORDER_STAFF_EMAILS` | Staff recipients for payment and issue notifications |
| `RESEND_API_KEY` | Resend API key for order emails |
| `NEXT_PUBLIC_SENTRY_DSN` | Sentry project DSN |
| `SENTRY_AUTH_TOKEN` | Sentry auth token with release/source-map upload access |
| `SENTRY_ORG` | Sentry org slug |
| `SENTRY_PROJECT` | Sentry project slug |

## 8. Post-deploy smoke test

After the first Vercel deploy:

```bash
export VERCEL_AUTOMATION_BYPASS_SECRET=<vercel-protection-bypass-secret>
bash site/scripts/smoke-test.sh https://<your-domain>
```

Then verify one write-through request and confirm the row appears in `research_order_requests` with `status = 'pending_review'`:

```bash
SMOKE_SUBMIT=1 bash site/scripts/smoke-test.sh https://<your-domain>
```
