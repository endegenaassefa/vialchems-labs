# Self-Hosted BTCPay Launch Runbook

This is the production replacement for the blocked Voltage-hosted endpoint.

## Decision

Use a BTCPay instance reachable at:

```text
https://pay.vialchemlabs.net
```

Do not launch Bitcoin checkout against `https://btcpay0.voltageapp.io` while it
requires VPN access or resets TLS from the production server.

## Why

BTCPay's official Docker deployment requires a domain name pointing to the host
with ports 80 and 443 externally accessible. The official eCommerce flow also
requires the VialChem backend to create the invoice before redirecting the buyer
to BTCPay. Therefore the BTCPay host must be reachable by both the server and
the customer without VPN.

Voltage's hosted BTCPay FAQ states that custom domains are not supported for
Voltage-hosted BTCPay. A redirect or iframe would still leave the underlying
Voltage host in the payment path, so it does not fix the reachability failure.

## DNS

Create this record before running the bootstrap:

```text
Type: A
Name: pay
Value: 130.85.59.153
TTL: 300
Proxy status: DNS only
```

Verify:

```bash
getent ahostsv4 pay.vialchemlabs.net
```

If Cloudflare API access is available, create or update the DNS record from the
target server:

```bash
cd /root/vialchems-labs
CLOUDFLARE_API_TOKEN=<token with DNS edit on vialchemlabs.net> \
npm run dns:btcpay
```

The script creates `pay.vialchemlabs.net` as a DNS-only `A` record pointing at
the server's detected public IP. It does not print the token.

## Bootstrap

Run from the target server:

```bash
cd /root/vialchems-labs
BTCPAY_HOST=pay.vialchemlabs.net \
LETSENCRYPT_EMAIL=abhinav@vialchemlabs.net \
scripts/btcpay-setup.sh
```

The bootstrap performs these safety checks before installing:

- DNS for `BTCPAY_HOST` must resolve.
- DNS must point to the server's detected public IP unless
  `ALLOW_DNS_MISMATCH=true` is explicitly set.
- Ports 80 and 443 must be available unless `ALLOW_PORT_CONFLICT=true` is
  explicitly set.
- Bitcoin is the only default crypto rail.
- Lightning is disabled by default.
- `BTCPAY_UPDATE_CLEAN=false` is set by default to protect unrelated Docker
  workloads on this host.

## Dashboard Setup

After BTCPay starts:

1. Visit `https://pay.vialchemlabs.net`.
2. Create the admin account.
3. Create store `vialchemlabs`.
4. Configure the Bitcoin wallet using an xpub or hardware-wallet-backed wallet.
5. Create a store-scoped API key with:

```text
btcpay.store.cancreateinvoice
btcpay.store.canviewinvoices
btcpay.store.canviewstoresettings
```

6. Create a webhook:

```text
URL: https://vialchemlabs.net/api/payments/btcpay/webhook
Events:
  InvoiceCreated
  InvoiceReceivedPayment
  InvoiceProcessing
  InvoicePaymentSettled
  InvoiceSettled
  InvoiceExpired
  InvoiceInvalid
```

7. Copy the API key, store ID, and webhook secret into environment variables.

## Environment

```bash
BTCPAY_SERVER_URL=https://pay.vialchemlabs.net
BTCPAY_API_KEY=<store-scoped api key>
BTCPAY_STORE_ID=<store id>
BTCPAY_WEBHOOK_SECRET=<webhook secret>
NEXT_PUBLIC_ENABLE_BITCOIN_CHECKOUT=true
```

Keep these disabled until the checks pass:

```bash
ENABLE_WOO_CHECKOUT_METHODS=false
```

## Verification

```bash
npm run diagnose:btcpay
npm run verify:btcpay
npm test -- tests/unit/payments/btcpay.test.ts tests/unit/payments/btcpay-create-intent.test.ts tests/unit/payments/webhook-routes.test.ts tests/unit/checkout/direct-payment.test.ts tests/unit/checkout/payment-routing.test.ts
npm run build
```

Then test the cart with the `$1` verification product and select Bitcoin.

Bitcoin is production-ready only after:

- `npm run diagnose:btcpay` passes from the production server.
- `npm run verify:btcpay` returns `ok: true`.
- A real invoice checkout page opens without VPN from a normal browser.
- A webhook redelivery from BTCPay reaches
  `/api/payments/btcpay/webhook`.

## Official References

- BTCPay Docker deployment:
  https://docs.btcpayserver.org/Docker/
- BTCPay eCommerce integration:
  https://docs.btcpayserver.org/Development/ecommerce-integration-guide/
- BTCPay Greenfield authorization:
  https://docs.btcpayserver.org/BTCPayServer/greenfield-authorization/
- Voltage BTCPay FAQ:
  https://docs.voltage.cloud/btcpayserver-faq
