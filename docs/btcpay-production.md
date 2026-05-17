# BTCPay Production Setup

Bitcoin checkout is handled on `vialchemlabs.net` by `POST /api/create-bitcoin-order`.
The route creates a BTCPay Greenfield invoice server-side and sends the buyer to
the main-site Bitcoin checkout page.

## Required Keys

```bash
BTCPAY_SERVER_URL=https://your-btcpay-server.example.com
BTCPAY_API_KEY=...
BTCPAY_STORE_ID=...
BTCPAY_WEBHOOK_SECRET=...
```

`BTCPAY_URL` remains supported as a legacy alias, but new deployments should use
`BTCPAY_SERVER_URL`.

## BTCPay Permissions

Create a store-scoped API key in BTCPay with these permissions:

```text
btcpay.store.cancreateinvoice
btcpay.store.canviewinvoices
btcpay.store.canviewstoresettings
```

Add webhook modification permission only if this app will register webhooks for
you:

```text
btcpay.store.webhooks.canmodifywebhooks
```

The webhook URL is:

```text
https://vialchemlabs.net/api/payments/btcpay/webhook
```

Store the webhook secret as `BTCPAY_WEBHOOK_SECRET`.

## Verify

After adding the four environment variables:

```bash
npm run diagnose:btcpay
npm run verify:btcpay
npm test -- --run tests/unit/payments/btcpay.test.ts tests/unit/payments/btcpay-create-intent.test.ts tests/unit/payments/webhook-routes.test.ts
npm run typecheck
npm run build
```

`npm run verify:btcpay` checks that the API key reaches the configured store.
The live create-invoice permission is exercised by the checkout route when a
buyer selects Bitcoin.

## Reachability Gate

Bitcoin checkout must remain disabled until the configured `BTCPAY_SERVER_URL`
is reachable without a VPN from the production runtime and normal customer
browsers. This is a hard launch gate because the Next.js server creates the
invoice before the buyer can receive the BTCPay `checkoutLink`.

Current remediation notes for the Voltage endpoint live in
`docs/btcpay-endpoint-remediation.md`. The self-hosted replacement runbook
lives in `docs/deploy/btcpay-self-host.md`.

## Official References

- BTCPay Greenfield example: https://docs.btcpayserver.org/Development/GreenFieldExample/
- BTCPay API authorization: https://docs.btcpayserver.org/BTCPayServer/greenfield-authorization/
- BTCPay eCommerce integration guide: https://docs.btcpayserver.org/Development/ecommerce-integration-guide/
