<?php
/**
 * VialChem checkout-only Storefront child theme.
 *
 * Evidence:
 * - WordPress Theme Handbook: child themes extend parent themes and may enqueue
 *   their own stylesheet via functions.php.
 * - WooCommerce theme docs: templates are overridden by copying files to a
 *   child-theme woocommerce/ directory while keeping the same path structure.
 * - Main-site tokens are captured in design-tokens.json and app/v2-brand.css.
 */

if ( ! defined( 'ABSPATH' ) ) {
	exit;
}

if ( ! defined( 'VIALCHEM_MAIN_SITE_URL' ) ) {
	define( 'VIALCHEM_MAIN_SITE_URL', 'https://vialchemlabs.net' );
}

add_action( 'wp_enqueue_scripts', 'vialchem_checkout_enqueue_styles', 20 );
function vialchem_checkout_enqueue_styles() {
	wp_enqueue_style(
		'storefront-style',
		get_template_directory_uri() . '/style.css',
		array(),
		wp_get_theme( 'storefront' )->get( 'Version' )
	);

	wp_enqueue_style(
		'vialchem-checkout-style',
		get_stylesheet_uri(),
		array( 'storefront-style' ),
		wp_get_theme()->get( 'Version' )
	);
}

add_action( 'after_setup_theme', 'vialchem_checkout_setup' );
function vialchem_checkout_setup() {
	add_theme_support( 'woocommerce' );
}

add_action( 'wp_head', 'vialchem_checkout_noindex_meta', 1 );
function vialchem_checkout_noindex_meta() {
	echo "<meta name=\"robots\" content=\"noindex,nofollow\">\n";
}

add_filter( 'pre_option_blog_public', '__return_zero' );

add_action( 'template_redirect', 'vialchem_checkout_only_redirects' );
function vialchem_checkout_only_redirects() {
	if ( is_admin() || wp_doing_ajax() ) {
		return;
	}

	if ( function_exists( 'is_checkout' ) && is_checkout() ) {
		return;
	}

	if ( is_page() ) {
		return;
	}

	if ( function_exists( 'is_wc_endpoint_url' ) && ( is_wc_endpoint_url( 'order-pay' ) || is_wc_endpoint_url( 'order-received' ) ) ) {
		return;
	}

	if ( function_exists( 'is_shop' ) && ( is_shop() || is_product_taxonomy() || is_product() ) ) {
		wp_safe_redirect( VIALCHEM_MAIN_SITE_URL . '/shop', 302 );
		exit;
	}
}

add_filter( 'woocommerce_order_item_name', 'vialchem_generic_order_item_name', 20, 2 );
function vialchem_generic_order_item_name( $item_name, $item ) {
	$sku = '';

	if ( is_object( $item ) && method_exists( $item, 'get_meta' ) ) {
		$sku = (string) $item->get_meta( '_real_sku', true );
	}

	if ( '' === $sku && is_object( $item ) && method_exists( $item, 'get_product' ) ) {
		$product = $item->get_product();
		if ( $product && method_exists( $product, 'get_sku' ) ) {
			$sku = (string) $product->get_sku();
		}
	}

	if ( '' === $sku ) {
		return esc_html__( 'Research Supply Order', 'vialchem-checkout-theme' );
	}

	return esc_html( sprintf( 'Research Supply Order - SKU %s', $sku ) );
}

add_filter( 'woocommerce_cart_item_name', 'vialchem_generic_cart_item_name', 20, 3 );
function vialchem_generic_cart_item_name( $product_name, $cart_item, $cart_item_key ) {
	unset( $product_name, $cart_item_key );

	$product = isset( $cart_item['data'] ) ? $cart_item['data'] : null;
	$sku     = $product && method_exists( $product, 'get_sku' ) ? (string) $product->get_sku() : '';

	if ( '' === $sku ) {
		return esc_html__( 'Research Supply Order', 'vialchem-checkout-theme' );
	}

	return esc_html( sprintf( 'Research Supply Order - SKU %s', $sku ) );
}

add_action( 'woocommerce_review_order_before_submit', 'vialchem_render_checkout_attestation', 12 );
function vialchem_render_checkout_attestation() {
	vialchem_render_attestation_checkbox();
}

add_action( 'woocommerce_checkout_process', 'vialchem_validate_checkout_attestation' );
function vialchem_validate_checkout_attestation() {
	if ( empty( $_POST['vialchem_research_attestation'] ) ) {
		wc_add_notice( esc_html__( 'Research-use attestation is required before checkout.', 'vialchem-checkout-theme' ), 'error' );
	}
}

add_action( 'woocommerce_checkout_create_order', 'vialchem_store_checkout_attestation', 20, 2 );
function vialchem_store_checkout_attestation( $order, $data ) {
	unset( $data );

	if ( ! empty( $_POST['vialchem_research_attestation'] ) && is_object( $order ) && method_exists( $order, 'update_meta_data' ) ) {
		$order->update_meta_data( '_vialchem_research_attestation', 'yes' );
		$order->update_meta_data( '_vialchem_research_attestation_text', vialchem_attestation_text() );
	}
}

add_action( 'woocommerce_before_pay_action', 'vialchem_validate_pay_order_attestation', 5 );
function vialchem_validate_pay_order_attestation( $order = null ) {
	if ( ! empty( $_POST['vialchem_research_attestation'] ) ) {
		if ( is_object( $order ) && method_exists( $order, 'update_meta_data' ) ) {
			$order->update_meta_data( '_vialchem_research_attestation', 'yes' );
			$order->update_meta_data( '_vialchem_research_attestation_text', vialchem_attestation_text() );
			$order->save();
		}
		return;
	}

	if ( function_exists( 'wc_add_notice' ) ) {
		wc_add_notice( esc_html__( 'Research-use attestation is required before payment.', 'vialchem-checkout-theme' ), 'error' );
	}

	if ( is_object( $order ) && method_exists( $order, 'get_checkout_payment_url' ) ) {
		wp_safe_redirect( $order->get_checkout_payment_url() );
		exit;
	}
}

add_action( 'woocommerce_thankyou', 'vialchem_redirect_order_confirmation', 30 );
function vialchem_redirect_order_confirmation( $order_id ) {
	if ( ! $order_id || headers_sent() ) {
		return;
	}

	$target = VIALCHEM_MAIN_SITE_URL . '/order-confirmed?order=' . rawurlencode( (string) $order_id );
	wp_safe_redirect( $target, 302 );
	exit;
}

function vialchem_attestation_text() {
	return 'I confirm these products are for qualified laboratory research use only and are not for human or animal use.';
}

function vialchem_render_attestation_checkbox() {
	?>
	<div class="vc-attestation">
		<label for="vialchem_research_attestation">
			<input id="vialchem_research_attestation" name="vialchem_research_attestation" type="checkbox" value="1" required>
			<span><?php echo esc_html( vialchem_attestation_text() ); ?></span>
		</label>
	</div>
	<?php
}

function vialchem_main_site_url( $path = '/' ) {
	return esc_url( trailingslashit( VIALCHEM_MAIN_SITE_URL ) . ltrim( $path, '/' ) );
}
