# Phase 3 Provisioning - shop.vialchemlabs.net

Status: placeholder-backed runbook. The live WordPress host, DNS, SSL, Woo REST keys, BTCPay keys, and Link Money merchant key are operator-supplied.

## Evidence

- Next.js main site uses `https://vialchemlabs.net` from `lib/content/site.ts`; the checkout handoff route builds a return URL at `/order-confirmed`.
- Next.js cart source is `app/cart/page.tsx` -> `components/v2/Cart.tsx`; the cart now calls `POST /api/create-woo-order`.
- WooCommerce REST API v3 documentation says the current API uses `/wp-json/wc/v3/` endpoints and the orders API can create orders with `POST /wp-json/wc/v3/orders`.
- WooCommerce authentication documentation says REST API keys are generated at `WooCommerce > Settings > Advanced > REST API` and HTTPS Basic Auth uses the Consumer Key as username and Consumer Secret as password.
- WooCommerce HPOS documentation says HPOS has been enabled by default for new installations since WooCommerce 8.2 and stores order data in dedicated order tables.
- WP-CLI documentation supports `wp plugin install --activate` for plugin installation.

Official references:

- https://developer.woocommerce.com/docs/apis/rest-api/v3/
- https://developer.woocommerce.com/docs/apis/rest-api/v3/orders/
- https://developer.woocommerce.com/docs/apis/rest-api/authentication/
- https://developer.woocommerce.com/docs/features/high-performance-order-storage
- https://developer.wordpress.org/cli/commands/plugin/

## DNS And Hosting

Create one of these records for `shop.vialchemlabs.net`:

```text
Type: A
Name: shop
Value: PLACEHOLDER_HOSTING_IPV4
TTL: 300
```

or:

```text
Type: CNAME
Name: shop
Value: PLACEHOLDER_HOSTING_TARGET
TTL: 300
```

Required hosting state:

- PHP 8.2+.
- MySQL 8+ or MariaDB 10.6+.
- HTTPS certificate active for `shop.vialchemlabs.net`.
- Pretty permalinks enabled.
- Public catalog pages disabled by theme and Woo settings.

## Manual Install Path

Use the host's one-click WordPress installer if available. Use these values:

```text
Site URL: https://shop.vialchemlabs.net
Site title: vialchemlabs secure checkout
Admin user: PLACEHOLDER_WORDPRESS_ADMIN_USER
Admin email: PLACEHOLDER_WORDPRESS_ADMIN_EMAIL
Password: PLACEHOLDER_WORDPRESS_ADMIN_PASSWORD
Database name: PLACEHOLDER_WP_DB_NAME
Database user: PLACEHOLDER_WP_DB_USER
Database password: PLACEHOLDER_WP_DB_PASSWORD
Database host: PLACEHOLDER_WP_DB_HOST
```

## WP-CLI Install Path

Run from the web root on the target host:

```bash
wp core download
wp config create \
  --dbname=PLACEHOLDER_WP_DB_NAME \
  --dbuser=PLACEHOLDER_WP_DB_USER \
  --dbpass=PLACEHOLDER_WP_DB_PASSWORD \
  --dbhost=PLACEHOLDER_WP_DB_HOST
wp core install \
  --url=https://shop.vialchemlabs.net \
  --title="vialchemlabs secure checkout" \
  --admin_user=PLACEHOLDER_WORDPRESS_ADMIN_USER \
  --admin_password=PLACEHOLDER_WORDPRESS_ADMIN_PASSWORD \
  --admin_email=PLACEHOLDER_WORDPRESS_ADMIN_EMAIL
wp option update blog_public 0
wp rewrite structure '/%postname%/'
```

## Plugin And Theme Install

Install only checkout-required plugins. Storefront is the parent theme for the custom child theme in this repository.

```bash
wp theme install storefront --activate
wp plugin install woocommerce --activate
wp plugin install btcpay-for-woocommerce --activate
wp plugin install woocommerce-gateway-stripe
wp plugin install woocommerce-paypal-payments
```

Link Money state:

- Preferred: install the official Link Money WooCommerce plugin if the merchant dashboard provides one.
- Placeholder fallback: use `wp-content/plugins/vialchem-link-money-gateway/vialchem-link-money-gateway.php` from this repository until official plugin credentials are supplied.

Checkout field editor state:

- Preferred: configure the attestation checkbox in the child theme code, already included in Phase 4.
- Optional admin plugin: use an official WooCommerce checkout field extension only if the operator has a license.

## wp-config.php Snippet

Add these constants above the "stop editing" line:

```php
define( 'WP_ENVIRONMENT_TYPE', 'production' );
define( 'DISALLOW_FILE_EDIT', true );
define( 'WP_AUTO_UPDATE_CORE', 'minor' );
define( 'VIALCHEM_MAIN_SITE_URL', 'https://vialchemlabs.net' );
define( 'VIALCHEM_CHECKOUT_RETURN_URL', 'https://vialchemlabs.net/order-confirmed' );
define( 'VIALCHEM_LINK_MONEY_API_KEY', 'PLACEHOLDER_LINK_MONEY_API_KEY' );
define( 'VIALCHEM_BTCPAY_URL', 'PLACEHOLDER_BTCPAY_URL' );
define( 'VIALCHEM_BTCPAY_API_KEY', 'PLACEHOLDER_BTCPAY_API_KEY' );
define( 'VIALCHEM_BTCPAY_STORE_ID', 'PLACEHOLDER_BTCPAY_STORE_ID' );
```

## WooCommerce Setup Wizard

Use these locked values:

```text
Store address: 4448 Ammendale Road
City: Beltsville
State: MD
Postcode: 20705
Country: United States
Currency: USD
Product type: Physical
```

Then apply:

```bash
wp option update woocommerce_currency USD
wp option update woocommerce_store_address "4448 Ammendale Road"
wp option update woocommerce_store_city "Beltsville"
wp option update woocommerce_default_country "US:MD"
wp option update woocommerce_store_postcode "20705"
wp option update woocommerce_enable_guest_checkout yes
wp option update woocommerce_enable_checkout_login_reminder no
wp option update woocommerce_registration_generate_username yes
wp option update woocommerce_registration_generate_password yes
wp option update woocommerce_custom_orders_table_enabled yes
wp option update woocommerce_custom_orders_table_data_sync_enabled yes
```

## Required Pages

Create minimal checkout-support pages on the subdomain. Each page should link back to the main site for full policy text.

```bash
wp post create --post_type=page --post_status=publish --post_title="Research Use Only Policy" --post_content="Checkout policy summary. Full policy: https://vialchemlabs.net/legal/terms"
wp post create --post_type=page --post_status=publish --post_title="Terms" --post_content="Checkout terms summary. Full terms: https://vialchemlabs.net/legal/terms"
wp post create --post_type=page --post_status=publish --post_title="Privacy" --post_content="Checkout privacy summary. Full privacy policy: https://vialchemlabs.net/legal/privacy"
wp post create --post_type=page --post_status=publish --post_title="Shipping" --post_content="Checkout shipping summary. Full shipping policy: https://vialchemlabs.net/legal/shipping"
wp post create --post_type=page --post_status=publish --post_title="Refund" --post_content="Checkout refund summary. Full refund policy: https://vialchemlabs.net/legal/refunds"
wp post create --post_type=page --post_status=publish --post_title="Contact" --post_content="Contact vialchemlabs: https://vialchemlabs.net/contact"
```

## REST API Keys

Create a dedicated WordPress admin/service user, then create a WooCommerce REST API key:

```text
WooCommerce > Settings > Advanced > REST API > Add key
Description: vialchemlabs main site handoff
User: PLACEHOLDER_SERVICE_USER
Permissions: Read/Write
```

Copy values to the Next.js environment:

```bash
WOOCOMMERCE_STORE_URL=https://shop.vialchemlabs.net
WOOCOMMERCE_CONSUMER_KEY=PLACEHOLDER_WOOCOMMERCE_CONSUMER_KEY
WOOCOMMERCE_CONSUMER_SECRET=PLACEHOLDER_WOOCOMMERCE_CONSUMER_SECRET
```

## Verification

```bash
curl -I https://shop.vialchemlabs.net/wp-json/wc/v3/
curl -I https://shop.vialchemlabs.net/checkout
wp plugin list --status=active
wp option get woocommerce_custom_orders_table_enabled
wp option get blog_public
```

Expected:

- `/wp-json/wc/v3/` responds.
- `/checkout` responds with HTTP 200 after Woo pages are generated.
- `woocommerce` and `btcpay-for-woocommerce` are active.
- `woocommerce_custom_orders_table_enabled` is `yes`.
- `blog_public` is `0`.

## Placeholders To Replace

- `PLACEHOLDER_HOSTING_IPV4`
- `PLACEHOLDER_HOSTING_TARGET`
- `PLACEHOLDER_WORDPRESS_ADMIN_USER`
- `PLACEHOLDER_WORDPRESS_ADMIN_EMAIL`
- `PLACEHOLDER_WORDPRESS_ADMIN_PASSWORD`
- `PLACEHOLDER_WP_DB_NAME`
- `PLACEHOLDER_WP_DB_USER`
- `PLACEHOLDER_WP_DB_PASSWORD`
- `PLACEHOLDER_WP_DB_HOST`
- `PLACEHOLDER_SERVICE_USER`
- `PLACEHOLDER_WOOCOMMERCE_CONSUMER_KEY`
- `PLACEHOLDER_WOOCOMMERCE_CONSUMER_SECRET`
- `PLACEHOLDER_LINK_MONEY_API_KEY`
- `PLACEHOLDER_BTCPAY_URL`
- `PLACEHOLDER_BTCPAY_API_KEY`
- `PLACEHOLDER_BTCPAY_STORE_ID`
