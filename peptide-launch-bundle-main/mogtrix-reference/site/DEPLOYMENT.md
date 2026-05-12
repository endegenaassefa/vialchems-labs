# MOGTRIX Labs Launch Checklist

Production target: `https://mogtrix.bio`

## 1. Supabase

1. Create a new Supabase project.
2. Open SQL Editor.
3. Run the full contents of `supabase/schema.sql`.
4. Go to Project Settings, then API.
5. Copy these values for Vercel:

```text
NEXT_PUBLIC_SUPABASE_URL=<Project URL>
NEXT_PUBLIC_SUPABASE_ANON_KEY=<anon public key>
SUPABASE_SERVICE_ROLE_KEY=<service_role key>
```

The service role key must only be stored as a server-side secret in Vercel. Do
not expose it in browser code, screenshots, or public docs.

## 2. Vercel

1. Import this repository into Vercel.
2. Set Root Directory to `site`.
3. Keep Framework Preset as Next.js.
4. Confirm commands:

```text
Install Command: npm install
Build Command: npm run build
Development Command: npm run dev
```

5. Add these Environment Variables:

```text
NEXT_PUBLIC_SUPABASE_URL=<from Supabase>
NEXT_PUBLIC_SUPABASE_ANON_KEY=<from Supabase>
SUPABASE_SERVICE_ROLE_KEY=<from Supabase>
NEXT_PUBLIC_SITE_URL=https://mogtrix.bio
MOGTRIX_ADMIN_PASSCODE=<strong temporary admin passcode>
MOGTRIX_ADMIN_COOKIE_SECRET=<long random secret>
REQUIRE_SUPABASE=true
OPS_SIGNUP_ENABLED=true
PAYMENT_PROVIDER=stripe
STRIPE_SECRET_KEY=<stripe-secret-key>
STRIPE_WEBHOOK_SECRET=<stripe-webhook-secret>
PILOT_US_SHIPPING_CENTS=1500
ORDER_EMAIL_FROM=orders@mogtrix.bio
ORDER_STAFF_EMAILS=ops@mogtrix.bio
RESEND_API_KEY=<resend-api-key>
```

For `MOGTRIX_ADMIN_COOKIE_SECRET`, use a long random value. Example command:

```bash
openssl rand -base64 48
```

## 3. Domain

1. In Vercel, open Project Settings, then Domains.
2. Add `mogtrix.bio`.
3. Follow the DNS records Vercel gives you at your domain registrar.
4. Wait for Vercel to show the domain as valid.

## 3.5. Stripe

1. Create a Stripe account and a restricted test-mode key pair for the pilot.
2. In Stripe, create a webhook endpoint that points to:

```text
https://mogtrix.bio/api/payments/webhook
```

3. Subscribe the webhook to:

```text
checkout.session.completed
checkout.session.async_payment_succeeded
checkout.session.async_payment_failed
checkout.session.expired
```

4. Copy the webhook signing secret into `STRIPE_WEBHOOK_SECRET`.
5. Confirm Stripe Tax is enabled for the pilot account before allowing real buyers through hosted checkout.

## 4. Launch Verification

After the first production deploy, verify:

```text
https://mogtrix.bio
https://mogtrix.bio/categories
https://mogtrix.bio/access
https://mogtrix.bio/verify
https://mogtrix.bio/checkout
https://mogtrix.bio/admin
https://mogtrix.bio/api/health
```

Expected health response:

```json
{
  "ok": true,
  "service": "mogtrix-labs-site",
  "domain": "mogtrix.bio"
}
```

In production, the health response should also show:

```json
{
  "checks": {
    "supabasePublicConfigured": true,
    "supabaseServiceConfigured": true
  }
}
```

## 5. Before Public Launch

- Have a qualified attorney review every page under `/legal`.
- Replace the temporary admin passcode flow with Supabase Auth before handling sensitive real submissions.
- Confirm no public category copy includes prices, dosing, medical claims, disease claims, or treatment language.
- Confirm `/catalog` remains private and public preview pages still do not expose prices.
- Confirm hosted checkout is limited to qualified buyers, US shipping, and `checkout_enabled` pilot SKUs.
- Submit a test access request and confirm it appears in `/admin`.
- Run one successful Stripe sandbox purchase and confirm the order becomes visible in `/account/orders/[id]` and `/ops`.
- Run one failed or expired Stripe sandbox payment and confirm the order stays visible with a follow-up path instead of silently disappearing.
