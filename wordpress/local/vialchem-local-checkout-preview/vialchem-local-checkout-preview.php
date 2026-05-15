<?php
/**
 * Plugin Name: VialChem Local Checkout Preview
 * Description: Local-only order-pay preview for the Docker WordPress + WooCommerce checkout stack.
 * Version: 0.1.0
 * Author: VialChem Labs
 */

if ( ! defined( 'ABSPATH' ) ) {
	exit;
}

function vialchem_local_preview_enabled(): bool {
	return wp_get_environment_type() === 'local';
}

function vialchem_local_main_site_url(): string {
	if ( defined( 'VIALCHEM_MAIN_SITE_URL' ) ) {
		return untrailingslashit( VIALCHEM_MAIN_SITE_URL );
	}

	return 'http://localhost:3001';
}

add_filter(
	'allowed_redirect_hosts',
	function ( array $hosts ): array {
		$hosts[] = 'localhost';
		$hosts[] = '127.0.0.1';
		$hosts[] = 'vialchemlabs.net';
		return array_values( array_unique( $hosts ) );
	}
);

function vialchem_local_preview_items(): array {
	$raw_items = isset( $_GET['preview_item'] ) ? (array) $_GET['preview_item'] : array(); // phpcs:ignore WordPress.Security.NonceVerification.Recommended
	$items     = array();

	foreach ( $raw_items as $raw_item ) {
		$parts = explode( ':', sanitize_text_field( wp_unslash( (string) $raw_item ) ), 2 );
		$sku   = $parts[0] ?? '';
		$qty   = isset( $parts[1] ) ? max( 1, absint( $parts[1] ) ) : 1;

		if ( $sku ) {
			$items[] = array(
				'sku' => $sku,
				'qty' => $qty,
			);
		}
	}

	if ( $items ) {
		return $items;
	}

	return array(
		array(
			'sku' => 'LOCAL-PREVIEW',
			'qty' => 1,
		),
	);
}

function vialchem_local_preview_money( int $cents ): string {
	return '$' . number_format( $cents / 100, 2 );
}

function vialchem_local_preview_return_url(): string {
	$return_url = isset( $_GET['return_url'] ) ? esc_url_raw( wp_unslash( (string) $_GET['return_url'] ) ) : ''; // phpcs:ignore WordPress.Security.NonceVerification.Recommended

	if ( ! $return_url ) {
		return vialchem_local_main_site_url() . '/order-confirmed';
	}

	$host = wp_parse_url( $return_url, PHP_URL_HOST );
	if ( in_array( $host, array( 'localhost', '127.0.0.1', 'vialchemlabs.net' ), true ) ) {
		return untrailingslashit( $return_url );
	}

	return vialchem_local_main_site_url() . '/order-confirmed';
}

function vialchem_local_preview_payment_methods(): array {
	return array(
		'link_money' => array(
			'title'       => 'Link Money',
			'description' => 'Pay by bank',
			'badge'       => 'Bank',
		),
		'bitcoin'    => array(
			'title'       => 'Bitcoin',
			'description' => 'BTCPay invoice',
			'badge'       => 'Crypto',
		),
		'card'       => array(
			'title'       => 'Cards',
			'description' => 'Credit and debit cards',
			'badge'       => 'Card',
		),
		'apple_pay'  => array(
			'title'       => 'Apple Pay',
			'description' => 'Apple Pay wallet',
			'badge'       => 'Wallet',
		),
		'google_pay' => array(
			'title'       => 'Google Pay',
			'description' => 'Google Pay wallet',
			'badge'       => 'Wallet',
		),
		'paypal'     => array(
			'title'       => 'PayPal',
			'description' => 'PayPal checkout',
			'badge'       => 'PayPal',
		),
	);
}

function vialchem_local_preview_selected_payment_method(): array {
	$methods = vialchem_local_preview_payment_methods();
	$method  = isset( $_GET['preview_payment_method'] ) ? sanitize_key( wp_unslash( (string) $_GET['preview_payment_method'] ) ) : 'link_money'; // phpcs:ignore WordPress.Security.NonceVerification.Recommended

	return $methods[ $method ] ?? $methods['link_money'];
}

function vialchem_local_preview_is_order_pay(): bool {
	if ( ! vialchem_local_preview_enabled() ) {
		return false;
	}

	$path = wp_parse_url( $_SERVER['REQUEST_URI'] ?? '/', PHP_URL_PATH );
	if ( ! is_string( $path ) ) {
		return false;
	}

	return preg_match( '#^/checkout/order-pay/([0-9]+)/?$#', $path ) === 1;
}

function vialchem_local_preview_order_id(): string {
	$path = wp_parse_url( $_SERVER['REQUEST_URI'] ?? '/', PHP_URL_PATH );
	if ( ! is_string( $path ) || ! preg_match( '#^/checkout/order-pay/([0-9]+)/?$#', $path, $matches ) ) {
		return '260515001';
	}

	return $matches[1];
}

add_action(
	'template_redirect',
	function (): void {
		if ( ! vialchem_local_preview_is_order_pay() ) {
			return;
		}

		status_header( 200 );
		nocache_headers();

		$order_id       = vialchem_local_preview_order_id();
		$items          = vialchem_local_preview_items();
		$total_cents    = isset( $_GET['preview_total_cents'] ) ? absint( $_GET['preview_total_cents'] ) : 6900; // phpcs:ignore WordPress.Security.NonceVerification.Recommended
		$shipping_cents = isset( $_GET['preview_shipping_cents'] ) ? absint( $_GET['preview_shipping_cents'] ) : 1500; // phpcs:ignore WordPress.Security.NonceVerification.Recommended
		$subtotal_cents = max( 0, $total_cents - $shipping_cents );
		$return_url     = vialchem_local_preview_return_url();
		$payment_method = vialchem_local_preview_selected_payment_method();

		get_header();
		?>
		<div class="vc-local-order-pay">
			<div class="vc-local-checkout-grid">
				<section class="vc-card vc-local-order-card" aria-labelledby="vc-preview-order-title">
					<p class="vc-eyebrow">Order review</p>
					<h2 id="vc-preview-order-title">Order <?php echo esc_html( $order_id ); ?></h2>
					<div class="vc-order-lines" role="table" aria-label="Order line items">
						<?php foreach ( $items as $item ) : ?>
							<div class="vc-order-line" role="row">
								<div role="cell">
									<strong><?php echo esc_html( 'Research Supply Order - SKU ' . $item['sku'] ); ?></strong>
									<span><?php echo esc_html( 'Quantity ' . $item['qty'] ); ?></span>
								</div>
								<div class="vc-order-line-value" role="cell">Included</div>
							</div>
						<?php endforeach; ?>
					</div>
					<form method="post" action="<?php echo esc_url( admin_url( 'admin-post.php' ) ); ?>">
						<input type="hidden" name="action" value="vialchem_local_preview_complete">
						<input type="hidden" name="order_id" value="<?php echo esc_attr( $order_id ); ?>">
						<input type="hidden" name="return_url" value="<?php echo esc_attr( $return_url ); ?>">
						<?php wp_nonce_field( 'vialchem_local_preview_complete', 'vialchem_local_preview_nonce' ); ?>
						<label class="vc-attestation">
							<input type="checkbox" name="vialchem_attestation" value="1" required>
							<span>I confirm these products are for qualified laboratory research use only and are not for human or animal use.</span>
						</label>
						<button type="submit" class="button alt vc-complete-button">Complete secure checkout</button>
					</form>
				</section>
				<aside class="vc-card vc-local-summary" aria-labelledby="vc-preview-summary-title">
					<h2 id="vc-preview-summary-title">Order summary</h2>
					<div class="vc-summary-row">
						<span>Subtotal</span>
						<strong><?php echo esc_html( vialchem_local_preview_money( $subtotal_cents ) ); ?></strong>
					</div>
					<div class="vc-summary-row">
						<span>Shipping</span>
						<strong><?php echo esc_html( vialchem_local_preview_money( $shipping_cents ) ); ?></strong>
					</div>
					<div class="vc-summary-row vc-summary-total">
						<span>Total</span>
						<strong><?php echo esc_html( vialchem_local_preview_money( $total_cents ) ); ?></strong>
					</div>
					<div class="vc-payment-list" aria-label="Selected payment method">
						<div class="vc-payment-method">
							<span>
								<strong><?php echo esc_html( $payment_method['title'] ); ?></strong>
								<small><?php echo esc_html( $payment_method['description'] ); ?></small>
							</span>
							<em><?php echo esc_html( $payment_method['badge'] ); ?></em>
						</div>
					</div>
				</aside>
			</div>
		</div>
		<?php
		get_footer();
		exit;
	}
);

add_action( 'admin_post_nopriv_vialchem_local_preview_complete', 'vialchem_local_preview_complete' );
add_action( 'admin_post_vialchem_local_preview_complete', 'vialchem_local_preview_complete' );

function vialchem_local_preview_complete(): void {
	if ( ! vialchem_local_preview_enabled() ) {
		wp_die( esc_html__( 'Local checkout preview is disabled.', 'vialchem-local-checkout-preview' ), 403 );
	}

	if (
		! isset( $_POST['vialchem_local_preview_nonce'] ) ||
		! wp_verify_nonce( sanitize_text_field( wp_unslash( (string) $_POST['vialchem_local_preview_nonce'] ) ), 'vialchem_local_preview_complete' )
	) {
		wp_die( esc_html__( 'Checkout preview session expired.', 'vialchem-local-checkout-preview' ), 403 );
	}

	if ( empty( $_POST['vialchem_attestation'] ) ) {
		wp_die( esc_html__( 'Research-use attestation is required.', 'vialchem-local-checkout-preview' ), 400 );
	}

	$order_id   = isset( $_POST['order_id'] ) ? absint( $_POST['order_id'] ) : 260515001;
	$return_url = isset( $_POST['return_url'] ) ? esc_url_raw( wp_unslash( (string) $_POST['return_url'] ) ) : vialchem_local_main_site_url() . '/order-confirmed';
	$target     = add_query_arg( 'order', (string) $order_id, $return_url );

	wp_safe_redirect( $target, 303 );
	exit;
}
