# VialChem Checkout Theme

Checkout-only Storefront child theme for `shop.vialchemlabs.net`.

## Evidence

- `design-tokens.json` records the Next.js v2 colors, typography, spacing, nav, footer, card, table, badge, and button patterns.
- `components/v2/Shell.tsx` is the source for the header and footer link structure.
- `components/v2/Cart.tsx` is the source for the card, summary, and checkout handoff surface.
- WordPress child theme documentation says child themes extend parent themes and keep customizations separate from the parent.
- WooCommerce template documentation says templates can be overridden by copying them into a child theme `woocommerce/` directory while preserving template paths.

Official references:

- https://developer.wordpress.org/themes/advanced-topics/child-themes/
- https://developer.wordpress.org/themes/core-concepts/main-stylesheet/
- https://developer.woocommerce.com/docs/theming/theme-development/template-structure

## Install

```bash
rsync -av wordpress/vialchem-checkout-theme/ PLACEHOLDER_SSH_USER@PLACEHOLDER_HOST:/path/to/wp-content/themes/vialchem-checkout-theme/
wp theme activate vialchem-checkout-theme
```

## Behavior

- Header and footer links point to `https://vialchemlabs.net`.
- Shop/product/catalog routes redirect to the main site.
- Checkout and order-pay pages remain on `shop.vialchemlabs.net`.
- `<meta name="robots" content="noindex,nofollow">` is emitted on every public page.
- Public order item names are forced to `Research Supply Order - SKU {sku}` where SKU metadata exists.
- `_real_sku`, `_real_name`, `_real_slug`, and price metadata remain private order/item metadata from the Next.js handoff.
- The required attestation checkbox is rendered before checkout submission and order-pay payment submission.
- Woo thank-you completion redirects to `https://vialchemlabs.net/order-confirmed?order={id}`.

## Visual Verification

Run after deploying the theme and starting the main site:

```bash
npm run test:e2e -- tests/e2e/visual-regression.spec.ts
curl -I https://shop.vialchemlabs.net/checkout
curl -I https://shop.vialchemlabs.net/robots.txt
```

Manual screenshot targets:

- `https://vialchemlabs.net/cart`
- `https://shop.vialchemlabs.net/checkout`
- `https://shop.vialchemlabs.net/checkout/order-pay/PLACEHOLDER_ORDER_ID/?key=PLACEHOLDER_ORDER_KEY`

## Placeholders

- `PLACEHOLDER_SSH_USER`
- `PLACEHOLDER_HOST`
- `PLACEHOLDER_ORDER_ID`
- `PLACEHOLDER_ORDER_KEY`
