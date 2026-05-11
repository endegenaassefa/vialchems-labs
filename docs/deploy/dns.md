# DNS + registrar guide — `vialchemlabs.com`

Phase 12.3 (v4) — D19 closure.

This is the operator action for getting `vialchemlabs.com` live on Vercel.
The agent does not register domains on the operator's behalf (Iron Law
2.22 — credit-card details + registrar credentials are operator-only).

## TLD note

`.labs` is a generic TLD operated by Google Registry (delegated to
Identity Digital). Most major registrars carry it; pricing typically
$30-60/year. Confirmed availability at multiple registrars as of
2026-05-08 (per `brand_name_candidates.md` Tier 1 footprint check).

## Recommended registrars (ranked)

| Registrar | Notes |
|---|---|
| **Cloudflare** | Cheapest renewal, zero-cost DNS, built-in DDoS + WAF. Requires Cloudflare account. |
| **Gandi** | Strong privacy posture (free WHOIS privacy), no upsells, EU-based. |
| **101domain** | Carries every TLD; slightly higher renewal than Cloudflare. |
| **Namecheap** | Cheap intro year; renewal pricing creeps. WHOIS privacy free. |

The agent does NOT recommend GoDaddy (upsell-heavy + history of
parking domains during transfer disputes).

## Step 1 — register the domain

1. Sign in to your chosen registrar.
2. Search `vialchemlabs.com`. Confirm available.
3. Add to cart with **2 years** initial term + **WHOIS privacy ON** +
   **auto-renew ON**.
4. Complete checkout. Save the receipt.
5. Save the registrar transfer authorization code (auth code / EPP
   code) somewhere offline — you'll need it if you ever transfer
   registrars.

## Step 2 — point DNS at Vercel

After running `vercel link` and `vercel domains add vialchemlabs.com`,
Vercel will tell you the exact records to set. The standard pattern is
one of:

### Option A — A record (apex) + CNAME (www)

Most registrars support apex CNAME these days, but if yours doesn't,
this is the fallback:

| Type | Name | Value | TTL |
|---|---|---|---|
| A | `@` | `76.76.21.21` | Auto / 3600 |
| CNAME | `www` | `cname.vercel-dns.com.` | Auto / 3600 |

(Vercel's apex IP can change — always confirm with `vercel domains
inspect vialchemlabs.com` before saving.)

### Option B — CNAME apex (Cloudflare, Gandi)

Cloudflare's "CNAME flattening" + Gandi's "ALIAS" record both let you
CNAME the apex:

| Type | Name | Value | TTL |
|---|---|---|---|
| CNAME / ALIAS | `@` | `cname.vercel-dns.com.` | Auto / 3600 |
| CNAME | `www` | `cname.vercel-dns.com.` | Auto / 3600 |

### Required + recommended additional records

| Type | Name | Value | Purpose |
|---|---|---|---|
| MX | `@` | (none Day-1) | No inbound mail; outbound via Resend |
| TXT | `@` | `v=spf1 include:_spf.resend.com ~all` | SPF for Resend (Phase 10.2) |
| TXT | `_dmarc` | `v=DMARC1; p=quarantine; rua=mailto:dmarc@vialchemlabs.com` | DMARC opens at quarantine; tighten to `p=reject` after 7-day review |
| TXT | `resend._domainkey` | (Resend supplies after `vercel domains add` + Resend domain verification) | DKIM |
| CAA | `@` | `0 issue "letsencrypt.org"` | Limits cert issuance to LE; Vercel uses LE |
| CAA | `@` | `0 issue "digicert.com"` | Vercel may also use DigiCert as backup |

### Sender domain (Resend)

Resend will issue 4 DNS records when you add `vialchemlabs.com` as a
sender domain in their dashboard. Add them all:

1. SPF (TXT): per-row above
2. DKIM (TXT): from Resend dashboard
3. MX (optional, for inbound): if you ever want to receive `@vialchemlabs.com` mail
4. Custom return-path (CNAME): `bounces.vialchemlabs.com → bounces.resend.com`

After Resend verifies (usually 5-30 min), set `RESEND_SENDER_DOMAIN_VERIFIED=yes`
in Vercel env per Appendix AA Section 3.

## Step 3 — wait for propagation

DNS propagation timeline:
- Cloudflare / Gandi: 1-5 minutes
- Most others: 15-60 minutes
- Worst case: 24 hours

Verify with:

```bash
dig vialchemlabs.com +short          # Should resolve to Vercel
dig www.vialchemlabs.com +short      # Should resolve to Vercel
dig vialchemlabs.com TXT +short      # Should show SPF
dig _dmarc.vialchemlabs.com TXT +short
dig vialchemlabs.com CAA +short
```

## Step 4 — confirm Vercel cert issuance

Once DNS resolves, Vercel automatically requests a Let's Encrypt cert.
This usually completes in <60 seconds. Watch in `vercel domains inspect
vialchemlabs.com` — the status should show `Valid Configuration`.

If cert issuance fails:
- Check CAA records aren't blocking LE
- Re-run `vercel domains add vialchemlabs.com --force`
- If still failing: contact Vercel support with the failure log

## Fallback domain

If `vialchemlabs.com` is unavailable at registration time, fallbacks per
brand-pick research:

1. `vialchemlabs.bio`
2. `vialchemlabs.com`
3. `vialchemlabs.co`

If the fallback is used, update:
- `lib/content/site.ts:url`
- `lib/content/site.ts:brandDomain` (when introduced)
- `NEXT_PUBLIC_SITE_URL` in Vercel env
- The Iron Law 2.22 `.env.example` placeholder line

## Verification command after deploy

```bash
curl -sI https://vialchemlabs.com/ | head -10
# Expected:
#   HTTP/2 200
#   strict-transport-security: max-age=63072000; includeSubDomains; preload
#   x-content-type-options: nosniff
```

If those headers are missing, `vercel.json` headers block isn't being
applied — verify in `Project → Settings → Headers`.
