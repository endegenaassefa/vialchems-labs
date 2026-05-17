# Super Prompt: BTCPay Production Reachability Fix

You are the VialChem Labs build agent. Fix Bitcoin checkout so customers never
hit a broken BTCPay flow.

## Mission

Research the BTCPay production flow using official BTCPay and Voltage
documentation, then implement the production-safe solution in the existing
Next.js codebase.

## Facts To Preserve

- Zelle is live on the main site.
- Bitcoin is a main-site checkout path that creates a BTCPay invoice
  server-side, then sends the buyer to the BTCPay invoice checkout link.
- Link Money, cards, Apple Pay, Google Pay, and PayPal are not live yet and
  must remain visible only as coming soon.
- Voltage-hosted `btcpay0.voltageapp.io` currently resets TLS from the server
  and requires VPN from some customer networks.
- A browser VPN does not help server-side invoice creation.
- A redirect or iframe to Voltage does not fix API reachability.

## Required Research Findings

- BTCPay eCommerce flow requires backend invoice creation and webhook handling.
- BTCPay webhooks must be validated with the webhook secret.
- BTCPay Docker deployment requires a domain pointing to the host with ports 80
  and 443 reachable.
- Voltage-hosted BTCPay does not support a real custom domain for the hosted
  instance.

## Implementation Requirements

1. Add deterministic endpoint diagnostics.
2. Add a self-hosted BTCPay migration path for `pay.vialchemlabs.net`.
3. Add a runtime health check endpoint that never exposes secrets.
4. Disable Bitcoin in the cart unless both the launch flag is enabled and the
   runtime health check passes.
5. Keep Zelle active.
6. Keep all non-Zelle/non-Bitcoin methods disabled as coming soon.
7. Verify with unit tests, lint, typecheck, build, endpoint diagnostics, and
   atomic commits.

## Acceptance Criteria

Bitcoin is production-ready only when all are true:

```bash
npm run diagnose:btcpay
npm run verify:btcpay
npm test -- tests/unit/payments/btcpay-health.test.ts tests/unit/payments/btcpay-status-route.test.ts tests/unit/payments/btcpay.test.ts tests/unit/payments/btcpay-create-intent.test.ts tests/unit/payments/webhook-routes.test.ts tests/unit/checkout/direct-payment.test.ts tests/unit/checkout/payment-routing.test.ts
npm run typecheck
npm run lint
npm run build
```

The cart must not let customers select Bitcoin if the BTCPay endpoint is
missing, blocked, returning auth errors, or failing TLS.

## Official Sources

- BTCPay eCommerce integration:
  https://docs.btcpayserver.org/Development/ecommerce-integration-guide/
- BTCPay Docker deployment:
  https://docs.btcpayserver.org/Docker/
- BTCPay Greenfield authorization:
  https://docs.btcpayserver.org/BTCPayServer/greenfield-authorization/
- Voltage BTCPay FAQ:
  https://docs.voltage.cloud/btcpayserver-faq
