# VialChem Labs Two-Site Checkout Architecture

This repository now contains the Next.js main-site implementation, WordPress/WooCommerce provisioning notes, and deployable WordPress assets for the checkout-only subdomain.

## Sites

- `https://vialchemlabs.net`: Next.js brand, catalog, age gate, cart, Bitcoin checkout, Zelle checkout, payment-method messaging, and WooCommerce order handoff for non-direct methods.
- `https://shop.vialchemlabs.net`: WordPress + WooCommerce checkout engine for Link Money, cards, Apple Pay, Google Pay, and PayPal only. Public catalog and marketing routes are redirected back to the main site by the child theme.

Bitcoin production setup details live in `docs/btcpay-production.md`.

## Evidence From This Codebase

- App Router layout and global tokens: `app/layout.tsx`, `app/globals.css`, `app/v2-brand.css`, `app/v2-layout.css`.
- Header/footer pattern: `components/v2/Shell.tsx`.
- Cart implementation and checkout trigger: `components/v2/Cart.tsx`.
- Split payment routing: `lib/checkout/payment-routing.ts`.
- Main-site Bitcoin/Zelle order routes: `app/api/create-bitcoin-order/route.ts`, `app/api/create-zelle-order/route.ts`.
- SKU catalog source: `lib/content/products.ts`.
- Server route convention: `app/api/create-woo-order/route.ts` and `app/api/woocommerce/order-webhook/route.ts`.
- Extracted design token handoff: `design-tokens.json`.

## Payment Routing Matrix

| Method     | Route                            | Checkout system                         |
| ---------- | -------------------------------- | --------------------------------------- |
| Bitcoin    | `POST /api/create-bitcoin-order` | Main-site BTCPay invoice flow           |
| Zelle      | `POST /api/create-zelle-order`   | Main-site manual Zelle instruction flow |
| Link Money | `POST /api/create-woo-order`     | WooCommerce on `shop.vialchemlabs.net`  |
| Cards      | `POST /api/create-woo-order`     | WooCommerce on `shop.vialchemlabs.net`  |
| Apple Pay  | `POST /api/create-woo-order`     | WooCommerce on `shop.vialchemlabs.net`  |
| Google Pay | `POST /api/create-woo-order`     | WooCommerce on `shop.vialchemlabs.net`  |
| PayPal     | `POST /api/create-woo-order`     | WooCommerce on `shop.vialchemlabs.net`  |

## Main Site Flow

1. The buyer adds catalog items to the client cart.
2. `components/PaymentMethodSelector.tsx` displays Link Money, Bitcoin, Zelle, card, Apple Pay, Google Pay, and PayPal with route-specific messaging.
3. The cart posts SKU, slug, quantity, selected payment method, and return path to the route selected by `lib/checkout/payment-routing.ts`.
4. Bitcoin creates a BTCPay invoice server-side and returns a main-site `/checkout/bitcoin` URL. Missing local credentials fall back to a placeholder page; production fails with `Missing required credential: [exact name]`.
5. Zelle creates a pending manual-payment order reference and returns a main-site `/checkout/zelle` instruction URL using the configured recipient details.
6. Link Money, Cards, Apple Pay, Google Pay, and PayPal create a WooCommerce order through REST API v3.
7. WooCommerce public line items use `Research Supply Order - SKU {sku}`. Full item details are stored in private order item meta: `_real_sku`, `_real_name`, `_real_slug`, `_real_unit_price_cents`, and `_real_line_total_cents`.
8. WooCommerce buyers are redirected to `https://shop.vialchemlabs.net/checkout/order-pay/{order_id}/?key={order_key}`.
9. WooCommerce returns completed checkout traffic to `https://vialchemlabs.net/order-confirmed?order={id}`.

The browser back button remains natural because the main site uses `window.location.assign(checkoutUrl)`, leaving the cart page in browser history before the cross-domain checkout page.

## WooCommerce Subdomain

Provisioning steps live in `docs/wordpress/phase-3-provisioning.md`.

The child theme lives in `wordpress/vialchem-checkout-theme` and provides:

- Storefront child theme metadata and CSS overrides.
- Header and footer matching the extracted Next.js tokens.
- Absolute navigation links back to `https://vialchemlabs.net`.
- Checkout and order-pay template overrides.
- Generic public item names.
- Required research-use attestation validation and order meta.
- `noindex,nofollow` meta and `robots.txt`.
- Checkout-only redirects for shop/catalog/product views.

Gateway configuration notes live in `docs/wordpress/phase-5-gateways.md`.

The placeholder gateway plugin lives in `wordpress/vialchem-gateway-placeholders` and provides a fail-closed Link Money gateway shell plus disabled placeholder handling for Stripe, PayPal, Apple Pay, Google Pay, and WooPayments-style gateways.

## Security Controls

- WooCommerce REST credentials, BTCPay credentials, and Zelle recipient settings are server-only environment variables and are never exposed to the browser except for the Zelle recipient instructions intentionally shown on the payment page.
- `CHECKOUT_ALLOWED_ORIGINS` can add explicit preview/staging origins; by default only `SITE_URL` is allowed for browser-origin handoff requests.
- `WOOCOMMERCE_WEBHOOK_SECRET` verifies WooCommerce webhook payloads using the official `x-wc-webhook-signature` HMAC-SHA256 header.
- Production hosting should restrict write access to `/wp-json/wc/v3/*` to the Next.js hosting egress IPs when the host or WAF supports path-based IP allowlists.
- If static egress IPs are not available, keep the Woo REST key scoped to the checkout service user, rotate it before launch, keep HPOS enabled, and rely on TLS plus long generated consumer secrets.

## Required Environment Variables

```bash
SITE_URL=https://vialchemlabs.net
NEXT_PUBLIC_SITE_URL=https://vialchemlabs.net
WOOCOMMERCE_STORE_URL=https://shop.vialchemlabs.net
WOOCOMMERCE_CONSUMER_KEY=PLACEHOLDER_WOOCOMMERCE_CONSUMER_KEY
WOOCOMMERCE_CONSUMER_SECRET=PLACEHOLDER_WOOCOMMERCE_CONSUMER_SECRET
WOOCOMMERCE_WEBHOOK_SECRET=PLACEHOLDER_WOOCOMMERCE_WEBHOOK_SECRET
CHECKOUT_ALLOWED_ORIGINS=
ALLOW_WOO_MOCK_HANDOFF_IN_DEVELOPMENT=false
LINK_MONEY_API_KEY=PLACEHOLDER_LINK_MONEY_API_KEY
PAYMENT_PROVIDER=zelle
NEXT_PUBLIC_ENABLE_BITCOIN_CHECKOUT=false
ENABLE_WOO_CHECKOUT_METHODS=false
BTCPAY_SERVER_URL=PLACEHOLDER_BTCPAY_SERVER_URL
BTCPAY_URL=PLACEHOLDER_BTCPAY_URL_LEGACY_ALIAS
BTCPAY_API_KEY=PLACEHOLDER_BTCPAY_API_KEY
BTCPAY_STORE_ID=PLACEHOLDER_BTCPAY_STORE_ID
BTCPAY_WEBHOOK_SECRET=PLACEHOLDER_BTCPAY_WEBHOOK_SECRET
ZELLE_RECIPIENT_NAME=Vialchem Labs LLC
ZELLE_HANDLE=vialchem-pay
ZELLE_EMAIL=abhinav@vialchemlabs.net
ZELLE_SUPPORT_EMAIL=abhinav@vialchemlabs.net
ZELLE_PHONE=PLACEHOLDER_ZELLE_PHONE
ZELLE_QR_IMAGE_URL=/payments/zelle-qr.png
ZELLE_PAYMENT_NOTE_PREFIX=VCL
ZELLE_CHECKOUT_SIGNING_SECRET=PLACEHOLDER_ZELLE_CHECKOUT_SIGNING_SECRET
```

## Deployment Order

1. Deploy the Next.js main-site changes.
2. Create `shop.vialchemlabs.net` DNS and hosting.
3. Install WordPress, WooCommerce, Storefront, BTCPay for WooCommerce, and the VialChem assets under `wordpress/`.
4. Generate WooCommerce REST credentials and populate the Next.js environment variables.
5. Configure Link Money credentials or keep the fail-closed placeholder disabled.
6. Configure BTCPay Server credentials for direct Bitcoin checkout.
7. Configure Zelle recipient details for direct Zelle checkout.
8. Create the WooCommerce webhook pointing to `https://vialchemlabs.net/api/woocommerce/order-webhook`.
9. Run the smoke test in `docs/wordpress/phase-5-gateways.md` and the final checks below.

## Verification

Local checks:

```bash
npm test -- --run tests/unit/woocommerce/handoff.test.ts tests/unit/woocommerce/webhook.test.ts tests/unit/woocommerce/security.test.ts
npm test -- --run tests/unit/checkout/payment-routing.test.ts tests/unit/checkout/direct-payment.test.ts tests/unit/payments/zelle.test.ts
npm run verify:btcpay
npm run typecheck
npm run build
```

Local UI preview without live WooCommerce credentials:

```bash
ALLOW_WOO_MOCK_HANDOFF_IN_DEVELOPMENT=true npm run dev
bash scripts/bootstrap-local-wordpress.sh
```

This mode is rejected in production and redirects checkout attempts to a real local WordPress + WooCommerce site at `http://localhost:3002/checkout/order-pay/{id}/?key=...`. Completing the preview checkout redirects back to `http://localhost:3001/order-confirmed?order={id}`. If Docker is unavailable, `npm run dev:shop-preview` remains available as a minimal non-WordPress fallback.

Hosted checks after credentials and DNS are live:

```bash
curl -I https://shop.vialchemlabs.net/checkout
curl -sS https://shop.vialchemlabs.net/robots.txt
curl -sS https://vialchemlabs.net/order-confirmed?order=123
```

End-to-end smoke:

1. Add two products to the Next.js cart.
2. Select Bitcoin and confirm the browser stays on `vialchemlabs.net/checkout/bitcoin`.
3. Select Zelle and confirm the browser stays on `vialchemlabs.net/checkout/zelle`.
4. Select Link Money or Cards and confirm the browser redirects to `shop.vialchemlabs.net`.
5. Confirm WooCommerce displays only generic `Research Supply Order - SKU ...` names for Woo-routed methods.
6. Complete a sandbox/mock payment.
7. Confirm the return URL is `/order-confirmed?order={id}` and the Woo order item meta contains the private SKU/name/price fields.

## Official References

- WooCommerce REST API v3: https://developer.woocommerce.com/docs/apis/rest-api/v3/
- WooCommerce orders API: https://developer.woocommerce.com/docs/apis/rest-api/v3/orders/
- WooCommerce REST authentication: https://developer.woocommerce.com/docs/apis/rest-api/authentication/
- WooCommerce HPOS: https://developer.woocommerce.com/docs/features/high-performance-order-storage
- WooCommerce payment gateway API: https://developer.woocommerce.com/docs/woocommerce-payment-gateway-api/
- WooCommerce template structure: https://developer.woocommerce.com/docs/theming/theme-development/template-structure
- WordPress child themes: https://developer.wordpress.org/themes/advanced-topics/child-themes/
- WP-CLI plugin command: https://developer.wordpress.org/cli/commands/plugin/
- BTCPay Server Greenfield example: https://docs.btcpayserver.org/Development/GreenFieldExample/
- BTCPay Server API authorization: https://docs.btcpayserver.org/BTCPayServer/greenfield-authorization/
- BTCPay Server eCommerce integration: https://docs.btcpayserver.org/Development/ecommerce-integration-guide/
- BTCPay Server WooCommerce integration: https://docs.btcpayserver.org/WooCommerce/

## Placeholder Inventory

- DNS and hosting: `PLACEHOLDER_HOSTING_IPV4`, `PLACEHOLDER_HOSTING_TARGET`, `PLACEHOLDER_HOST`.
- WordPress install: `PLACEHOLDER_DB_NAME`, `PLACEHOLDER_DB_USER`, `PLACEHOLDER_DB_PASSWORD`, `PLACEHOLDER_DB_HOST`, `PLACEHOLDER_WP_ADMIN_USER`, `PLACEHOLDER_WP_ADMIN_PASSWORD`, `PLACEHOLDER_WP_ADMIN_EMAIL`.
- WooCommerce REST: `PLACEHOLDER_WOOCOMMERCE_CONSUMER_KEY`, `PLACEHOLDER_WOOCOMMERCE_CONSUMER_SECRET`.
- WooCommerce webhook: `PLACEHOLDER_WOOCOMMERCE_WEBHOOK_SECRET`.
- Link Money: `PLACEHOLDER_LINK_MONEY_API_KEY` and any official merchant/plugin credentials supplied by Link Money.
- BTCPay Server: `PLACEHOLDER_BTCPAY_SERVER_URL`, `PLACEHOLDER_BTCPAY_API_KEY`, `PLACEHOLDER_BTCPAY_STORE_ID`, `PLACEHOLDER_BTCPAY_WEBHOOK_SECRET`.
- Zelle is live with the verified public recipient values `Vialchem Labs LLC`, `vialchem-pay`, `abhinav@vialchemlabs.net`, and the official QR asset at `/payments/zelle-qr.png`. Remaining optional Zelle placeholders: `PLACEHOLDER_ZELLE_PHONE`, `PLACEHOLDER_ZELLE_CHECKOUT_SIGNING_SECRET` if not reusing `AGE_GATE_SECRET`.
- Hosting security: Next.js egress IPs or WAF rule identifiers for `/wp-json/wc/v3/*`.
- Final hosted verification: live SSL certificate, DNS resolution, and sandbox payment credentials.
