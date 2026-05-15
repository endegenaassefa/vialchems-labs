<?php
/**
 * Order-pay form override for API-created pending orders.
 *
 * Public line names stay generic; full details remain in private order meta.
 *
 * @see https://developer.woocommerce.com/docs/theming/theme-development/template-structure
 * @version 9.4.0
 */

defined( 'ABSPATH' ) || exit;

$totals = $order->get_order_item_totals();
?>

<form id="order_review" method="post" class="vc-card">
	<table class="shop_table">
		<thead>
			<tr>
				<th class="product-name"><?php esc_html_e( 'Order', 'vialchem-checkout-theme' ); ?></th>
				<th class="product-quantity"><?php esc_html_e( 'Qty', 'vialchem-checkout-theme' ); ?></th>
				<th class="product-total"><?php esc_html_e( 'Total', 'vialchem-checkout-theme' ); ?></th>
			</tr>
		</thead>
		<tbody>
			<?php if ( count( $order->get_items() ) > 0 ) : ?>
				<?php foreach ( $order->get_items() as $item_id => $item ) : ?>
					<?php
					if ( ! apply_filters( 'woocommerce_order_item_visible', true, $item ) ) {
						continue;
					}
					?>
					<tr class="<?php echo esc_attr( apply_filters( 'woocommerce_order_item_class', 'order_item', $item, $order ) ); ?>">
						<td class="product-name">
							<?php echo wp_kses_post( apply_filters( 'woocommerce_order_item_name', $item->get_name(), $item, false ) ); ?>
						</td>
						<td class="product-quantity"><?php echo esc_html( sprintf( 'x %s', $item->get_quantity() ) ); ?></td>
						<td class="product-subtotal"><?php echo wp_kses_post( $order->get_formatted_line_subtotal( $item ) ); ?></td>
					</tr>
				<?php endforeach; ?>
			<?php endif; ?>
		</tbody>
		<tfoot>
			<?php if ( $totals ) : ?>
				<?php foreach ( $totals as $total ) : ?>
					<tr>
						<th scope="row" colspan="2"><?php echo wp_kses_post( $total['label'] ); ?></th>
						<td class="product-total"><?php echo wp_kses_post( $total['value'] ); ?></td>
					</tr>
				<?php endforeach; ?>
			<?php endif; ?>
		</tfoot>
	</table>

	<?php do_action( 'woocommerce_pay_order_before_payment' ); ?>

	<div id="payment">
		<?php if ( $order->needs_payment() ) : ?>
			<ul class="wc_payment_methods payment_methods methods">
				<?php
				if ( ! empty( $available_gateways ) ) {
					foreach ( $available_gateways as $gateway ) {
						wc_get_template( 'checkout/payment-method.php', array( 'gateway' => $gateway ) );
					}
				} else {
					echo '<li>';
					wc_print_notice( apply_filters( 'woocommerce_no_available_payment_methods_message', esc_html__( 'No payment methods are available for this order. Please contact support.', 'woocommerce' ) ), 'notice' );
					echo '</li>';
				}
				?>
			</ul>
		<?php endif; ?>

		<?php vialchem_render_attestation_checkbox(); ?>

		<div class="form-row">
			<input type="hidden" name="woocommerce_pay" value="1">

			<?php wc_get_template( 'checkout/terms.php' ); ?>

			<?php do_action( 'woocommerce_pay_order_before_submit' ); ?>

			<?php echo apply_filters( 'woocommerce_pay_order_button_html', '<button type="submit" class="button alt' . esc_attr( wc_wp_theme_get_element_class_name( 'button' ) ? ' ' . wc_wp_theme_get_element_class_name( 'button' ) : '' ) . '" id="place_order" value="' . esc_attr__( 'Pay for order', 'woocommerce' ) . '" data-value="' . esc_attr__( 'Pay for order', 'woocommerce' ) . '">' . esc_html__( 'Pay for order', 'woocommerce' ) . '</button>' ); ?>

			<?php do_action( 'woocommerce_pay_order_after_submit' ); ?>

			<?php wp_nonce_field( 'woocommerce-pay', 'woocommerce-pay-nonce' ); ?>
		</div>
	</div>
</form>

<?php do_action( 'woocommerce_pay_order_after_payment' ); ?>
