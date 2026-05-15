#!/usr/bin/env bash
set -euo pipefail

compose_file="wordpress/local/compose.yml"

wp() {
  docker compose -f "$compose_file" run --rm wpcli wp "$@" --allow-root
}

docker compose -f "$compose_file" up -d

echo "Waiting for local WordPress files and database..."
for attempt in $(seq 1 60); do
  if docker compose -f "$compose_file" exec -T wordpress test -f /var/www/html/wp-load.php; then
    break
  fi

  if [ "$attempt" = "60" ]; then
    echo "Timed out waiting for WordPress files." >&2
    exit 1
  fi

  sleep 3
done

if ! wp core is-installed >/dev/null 2>&1; then
  wp core install \
    --url="http://localhost:3002" \
    --title="VialChem Checkout Preview" \
    --admin_user="admin" \
    --admin_password="admin" \
    --admin_email="dev@vialchemlabs.local" \
    --skip-email
fi

wp plugin install woocommerce --activate

if ! wp theme is-installed storefront >/dev/null 2>&1; then
  wp theme install storefront
fi

wp theme activate vialchem-checkout-theme
wp plugin activate vialchem-gateway-placeholders vialchem-local-checkout-preview

wp option update blog_public 0
wp option update woocommerce_currency USD
wp option update woocommerce_store_address "4448 Ammendale Road"
wp option update woocommerce_store_city "Beltsville"
wp option update woocommerce_default_country "US:MD"
wp option update woocommerce_store_postcode "20705"
wp option update woocommerce_custom_orders_table_enabled yes
wp option update woocommerce_custom_orders_table_data_sync_enabled yes

checkout_id="$(wp post list --post_type=page --name=checkout --field=ID || true)"
if [ -z "$checkout_id" ]; then
  checkout_id="$(wp post create --post_type=page --post_title="Checkout" --post_status=publish --post_name=checkout --post_content="[woocommerce_checkout]" --porcelain)"
fi
wp option update woocommerce_checkout_page_id "$checkout_id"

wp rewrite structure '/%postname%/'
wp rewrite flush --hard

echo "Local WordPress + WooCommerce checkout is ready:"
echo "  http://localhost:3002"
echo "  Admin: http://localhost:3002/wp-admin/  admin / admin"
