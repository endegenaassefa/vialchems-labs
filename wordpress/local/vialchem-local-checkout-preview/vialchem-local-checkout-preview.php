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

		get_header();
		?>
		<div class="vc-checkout-card">
			<div>
				<p class="vc-eyebrow">WooCommerce local preview</p>
				<h2>Order <?php echo esc_html( $order_id ); ?></h2>
			</div>
			<table class="shop_table shop_table_responsive">
				<tbody>
					<?php foreach ( $items as $item ) : ?>
						<tr>
							<td>
								<strong><?php echo esc_html( 'Research Supply Order - SKU ' . $item['sku'] ); ?></strong>
								<span style="display:block;color:var(--fg-muted);font-size:12px;margin-top:6px">
									<?php echo esc_html( 'Quantity ' . $item['qty'] ); ?>
								</span>
							</td>
							<td style="text-align:right;color:var(--fg-muted)">Included</td>
						</tr>
					<?php endforeach; ?>
				</tbody>
				<tfoot>
					<tr>
						<th>Subtotal</th>
						<td><?php echo esc_html( vialchem_local_preview_money( $subtotal_cents ) ); ?></td>
					</tr>
					<tr>
						<th>Shipping</th>
						<td><?php echo esc_html( vialchem_local_preview_money( $shipping_cents ) ); ?></td>
					</tr>
					<tr>
						<th>Total</th>
						<td><?php echo esc_html( vialchem_local_preview_money( $total_cents ) ); ?></td>
					</tr>
				</tfoot>
			</table>
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
