# Live account setup for `vialchemlabs.net`

This is the exact operator sequence for creating the production accounts,
collecting the required credentials, applying the Supabase database migration,
pushing Vercel environment variables, and deploying.

Do not paste secrets into GitHub, chat, screenshots, docs, or source files.
Use `.env.production.local` only on the launch machine. It is ignored by git.

## 0. Local files and scripts

From the repo root:

```bash
cp .env.example .env.production.local
bash scripts/generate-production-secret.sh
```

Paste the generated value into:

```dotenv
AGE_GATE_SECRET=<generated value>
```

The launch helpers are:

```bash
bash scripts/check-production-env.sh
bash scripts/supabase-apply-migrations.sh
bash scripts/vercel-env-push.sh
```

If you self-host BTCPay on a VPS, copy `scripts/btcpay-setup.sh` to that VPS
and run it there.

## 1. Vercel account, project, token, org ID, project ID

1. Go to `https://vercel.com/signup`.
2. Sign up with the GitHub account that owns `endegenaassefa/vialchems-labs`.
3. In Vercel, import the GitHub repository and create a project named
   `vialchemlabs`.
4. In the repo root, link the local checkout:

```bash
npx --yes vercel@latest login
npx --yes vercel@latest link
```

Choose the existing `vialchemlabs` project if the dashboard import already
created it.

5. Read the IDs from the file Vercel created:

```bash
cat .vercel/project.json
```

Copy:

```dotenv
VERCEL_ORG_ID=<orgId from .vercel/project.json>
VERCEL_PROJECT_ID=<projectId from .vercel/project.json>
```

6. Create the token:
   - Open Vercel dashboard.
   - Go to Account Settings -> Tokens.
   - Create a token named `vialchemlabs-production-launch`.
   - Copy it once and paste it into:

```dotenv
VERCEL_TOKEN=<token from Vercel>
```

7. Add the domain in Vercel:

```bash
npx --yes vercel@latest domains add vialchemlabs.net
npx --yes vercel@latest domains inspect vialchemlabs.net
```

8. In Cloudflare DNS for `vialchemlabs.net`, add the exact records shown by
   `domains inspect`. The usual Vercel pattern is:

```text
A      @      76.76.21.21
CNAME  www    cname.vercel-dns-0.com
```

Keep the Cloudflare proxy disabled for Vercel records until Vercel shows
`Valid Configuration`.

## 2. Supabase project and database

1. Go to `https://supabase.com/dashboard`.
2. Create a new organization or use your existing one.
3. Create a project named `vialchemlabs-prod`.
4. Choose the production region closest to the expected buyers/operators.
5. Save the database password in a password manager.
6. Open Project Settings -> API Keys.
7. Copy the public browser key into:

```dotenv
NEXT_PUBLIC_SUPABASE_ANON_KEY=<anon or publishable key>
```

8. Copy the project URL into:

```dotenv
NEXT_PUBLIC_SUPABASE_URL=https://<project-ref>.supabase.co
```

9. Copy the backend-only elevated key into:

```dotenv
SUPABASE_SERVICE_ROLE_KEY=<service_role or secret key>
```

Never expose `SUPABASE_SERVICE_ROLE_KEY` in browser code, `NEXT_PUBLIC_*`
variables, screenshots, or docs.

10. Open the Supabase dashboard Connect panel and copy the Session pooler
    Postgres connection string. Replace `[YOUR-PASSWORD]` with the database
    password.

```dotenv
SUPABASE_DB_URL=postgres://...
```

11. Confirm these production flags:

```dotenv
REQUIRE_SUPABASE=true
ALLOW_SUPABASE_OPTIONAL_IN_PRODUCTION=false
```

12. Apply the database migration:

```bash
bash scripts/supabase-apply-migrations.sh
```

The script applies `supabase/migrations/*.sql`, then prints the required
tables and RLS status. All listed tables should show `rls_enabled` as `t`.

## 3. BTCPay Server credentials

Choose one path.

### Option A: managed BTCPay

1. Create a managed BTCPay instance with a provider such as Voltage Cloud.
2. Open the BTCPay dashboard for that instance.
3. Create the first admin user.
4. Create a store named `vialchemlabs`.
5. Enable Bitcoin payment methods. Enable Lightning only after the wallet and
   liquidity plan are ready.

### Option B: self-hosted BTCPay

1. Create a VPS with at least 2 GB RAM, 40 GB disk, and public ports `80` and
   `443` open.
2. Add a Cloudflare DNS record:

```text
A  btcpay  <VPS public IPv4>
```

3. SSH into the VPS and run:

```bash
sudo su -
apt-get update
apt-get install -y git docker.io docker-compose-plugin
export BTCPAY_HOST=btcpay.vialchemlabs.net
export LETSENCRYPT_EMAIL=ops@vialchemlabs.net
bash /path/to/scripts/btcpay-setup.sh
```

4. Visit `https://btcpay.vialchemlabs.net`.
5. Create the first admin user.
6. Create a store named `vialchemlabs`.
7. Enable Bitcoin payment methods. Enable Lightning only after the wallet and
   liquidity plan are ready.

### BTCPay values to copy

In BTCPay:

1. Copy the base URL:

```dotenv
BTCPAY_URL=https://btcpay.vialchemlabs.net
```

2. Open the store settings and copy the store ID:

```dotenv
BTCPAY_STORE_ID=<store id>
```

3. Go to Account -> Manage account -> API keys.
4. Create a Greenfield API key for the store with invoice permissions:
   view invoices, create invoice, and modify invoices.

```dotenv
BTCPAY_API_KEY=<Greenfield API key>
```

5. Go to Store settings -> Webhooks.
6. Add this payload URL:

```text
https://vialchemlabs.net/api/payments/btcpay/webhook
```

7. Enable invoice events:

```text
InvoiceCreated
InvoiceProcessing
InvoiceSettled
InvoiceInvalid
InvoiceExpired
```

8. Copy the webhook secret:

```dotenv
BTCPAY_WEBHOOK_SECRET=<webhook secret>
```

9. Confirm:

```dotenv
PAYMENT_PROVIDER=btcpay
ALLOW_STUB_PAYMENTS_IN_PRODUCTION=false
```

## 4. Resend email

1. Go to `https://resend.com/signup`.
2. Create the account and team.
3. Open Domains and add `vialchemlabs.net`.
4. Use Resend's Cloudflare automatic setup if offered. Otherwise add every DNS
   record Resend shows, usually SPF, DKIM, and return-path records.
5. Add a DMARC TXT record in Cloudflare:

```text
Name: _dmarc
Type: TXT
Value: v=DMARC1; p=none; rua=mailto:ops@vialchemlabs.net
```

Move DMARC to `p=quarantine` or `p=reject` only after test mail passes.

6. Click Verify DNS Records in Resend and wait until the domain is verified.
7. Create a production API key and paste it into:

```dotenv
RESEND_API_KEY=<Resend API key>
ORDER_EMAIL_FROM=research@vialchemlabs.net
ORDER_STAFF_EMAILS=ops@vialchemlabs.net
REQUIRE_RESEND=true
ALLOW_RESEND_OPTIONAL_IN_PRODUCTION=false
```

`ORDER_STAFF_EMAILS` must be a real mailbox or forwarding alias that receives
order/contact notifications.

## 5. Validate local production env

When all values above are filled:

```bash
bash scripts/check-production-env.sh
```

The script must print `set:` for every required value and exit successfully.

## 6. Push env vars to Vercel

Make sure the project is linked:

```bash
test -f .vercel/project.json && cat .vercel/project.json
```

Then push the production env:

```bash
bash scripts/vercel-env-push.sh .env.production.local production
```

This script refuses to run if `VERCEL_ORG_ID` or `VERCEL_PROJECT_ID` do not
match `.vercel/project.json`. It pushes app runtime secrets to Vercel but does
not push `SUPABASE_DB_URL`, `VERCEL_TOKEN`, `VERCEL_ORG_ID`, or
`VERCEL_PROJECT_ID`.

## 7. Deploy and verify

Deploy production:

```bash
npx --yes vercel@latest --prod --token "$VERCEL_TOKEN"
```

Verify the public site:

```bash
curl -sS https://vialchemlabs.net/api/health
curl -sS https://vialchemlabs.net/api/health/ready
curl -sSI https://vialchemlabs.net/ | head
```

`/api/health/ready` must return `status: "ready"`. If it reports missing
values, fix the Vercel environment variable, push again, and redeploy.
