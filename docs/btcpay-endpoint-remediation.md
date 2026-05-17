# BTCPay Endpoint Remediation

## Current Finding

`btcpay0.voltageapp.io` is not reachable from this production-like server path:

```text
BTCPay host: btcpay0.voltageapp.io
Resolved IP: 54.214.99.172
Observed source IP: 130.85.186.51
Failure: TCP connects to 443, then TLS is reset during ClientHello.
Verifier: npm run verify:btcpay
Error: Network/TLS error: fetch failed (read ECONNRESET)
```

This is not an API-key failure. The connection is reset before BTCPay can
authenticate the request.

## Production Requirement

Bitcoin checkout is only live when the configured BTCPay endpoint is reachable
without a VPN from both:

1. the production Next.js server, because `POST /api/create-bitcoin-order`
   creates the invoice server-side;
2. normal customer browsers, because BTCPay returns a `checkoutLink` where the
   buyer pays the invoice.

BTCPay's official eCommerce guide defines this backend flow: the frontend sends
checkout data to the backend, the backend creates a BTCPay invoice, stores the
invoice ID with the internal order, and redirects the customer to the invoice
`checkoutLink`. The same guide requires webhook validation using the webhook
secret and invoice events such as `InvoiceProcessing`, `InvoiceSettled`,
`InvoiceExpired`, and `InvoiceInvalid`.

Voltage's BTCPay FAQ says hosted Voltage BTCPay does not support using a custom
domain for the hosted BTCPay instance. A domain redirect or iframe does not fix
server-side API reachability, so a blocked `btcpay0.voltageapp.io` endpoint must
be fixed at the provider/network layer or replaced with another reachable
BTCPay endpoint.

## Super Prompt Executed

```text
Research the BTCPay Server production integration using only official BTCPay and
Voltage documentation. Confirm whether the Next.js server must reach the BTCPay
API directly, whether customers must reach the returned checkout URL directly,
and whether a Voltage-hosted BTCPay instance can be moved behind a custom
domain. Then implement the safest production posture in the VialChem Labs repo:
keep Zelle and Bitcoin as the only live checkout methods, disable unfinished
WooCommerce-style methods as coming soon, preserve the BTCPay invoice/webhook
code, add deterministic verification, and document the network remediation
steps and acceptance criteria for a reachable BTCPay endpoint.
```

The full production-fix prompt, including the runtime fail-closed health check,
lives in `docs/super-prompts/btcpay-production-reachability-fix.md`.

## Remediation Options

### Option A - Voltage Unblocks Current Endpoint

Ask Voltage to allow traffic from the production server and confirm the endpoint
is reachable by normal customer browsers without VPN.

Support message:

```text
Our server at 130.85.186.51 cannot complete TLS to btcpay0.voltageapp.io.
DNS resolves to 54.214.99.172. TCP connects to port 443, then the server resets
during TLS ClientHello. curl error: OpenSSL SSL_connect: Connection reset by
peer. Please check whether our source IP is blocked by firewall, WAF, geofence,
or security rules.
```

Acceptance:

```bash
curl -Iv https://btcpay0.voltageapp.io/
npm run verify:btcpay
```

### Option B - Use a Different Reachable BTCPay Endpoint

Move `BTCPAY_SERVER_URL` to a BTCPay instance that is reachable without VPN from
the production server and customer browsers. This can be a self-hosted BTCPay
deployment on a public VPS with a domain such as `pay.vialchemlabs.net`, or
another managed provider whose endpoint passes the acceptance checks below.

This is the recommended fix for the current Voltage issue. Voltage-hosted
BTCPay is currently unusable for launch because the checkout host requires a VPN
from some client networks and resets TLS from this server. A proxy or browser
VPN does not solve the server-side invoice creation requirement, and a domain
redirect does not change the BTCPay API/checkout host.

Implementation status:

```text
Recommended production host: pay.vialchemlabs.net
Detected server public IP: 130.85.186.51
Current DNS status: pay.vialchemlabs.net and btcpay.vialchemlabs.net do not resolve yet
Repo bootstrap: scripts/btcpay-setup.sh
Endpoint diagnostics: npm run diagnose:btcpay
API verification: npm run verify:btcpay
Runtime guard: /api/payments/btcpay/status
```

DNS required before bootstrap:

```text
Type: A
Name: pay
Value: 130.85.186.51
TTL: 300
```

Then run the self-host bootstrap on the target server:

```bash
cd /root/vialchems-labs
BTCPAY_HOST=pay.vialchemlabs.net \
LETSENCRYPT_EMAIL=abhinav@vialchemlabs.net \
scripts/btcpay-setup.sh
```

The script now refuses to run when DNS is missing or points somewhere else, and
it refuses to start if ports 80 or 443 are already occupied. It installs BTC
only by default, leaves Lightning disabled unless explicitly requested, and sets
`BTCPAY_UPDATE_CLEAN=false` so the official BTCPay update path does not remove
unrelated Docker images on this host.

Required environment update:

```bash
BTCPAY_SERVER_URL=https://pay.vialchemlabs.net
BTCPAY_API_KEY=<store-scoped api key>
BTCPAY_STORE_ID=<store id>
BTCPAY_WEBHOOK_SECRET=<webhook secret>
NEXT_PUBLIC_ENABLE_BITCOIN_CHECKOUT=true
```

Acceptance:

```bash
curl -Iv "$BTCPAY_SERVER_URL/"
npm run diagnose:btcpay
npm run verify:btcpay
npm test -- tests/unit/payments/btcpay.test.ts tests/unit/payments/btcpay-create-intent.test.ts tests/unit/payments/webhook-routes.test.ts tests/unit/checkout/direct-payment.test.ts tests/unit/checkout/payment-routing.test.ts
```

### Option C - Keep Bitcoin Disabled Until Reachable

If neither endpoint path is reachable, keep:

```bash
NEXT_PUBLIC_ENABLE_BITCOIN_CHECKOUT=false
```

Zelle remains the live payment option. Bitcoin must not be advertised as live
until `npm run verify:btcpay` succeeds from the production runtime.

The cart also checks `/api/payments/btcpay/status` before enabling the Bitcoin
radio option. If the endpoint is missing, blocked, returning auth errors, or
failing TLS, customers remain on Zelle instead of entering a broken Bitcoin
checkout.

## Official References

- BTCPay eCommerce integration guide:
  https://docs.btcpayserver.org/Development/ecommerce-integration-guide/
- BTCPay Greenfield API authorization:
  https://docs.btcpayserver.org/BTCPayServer/greenfield-authorization/
- Voltage BTCPay FAQ:
  https://docs.voltage.cloud/btcpayserver-faq
- Voltage BTCPay setup:
  https://docs.voltage.cloud/getting-started-w-btcpay
