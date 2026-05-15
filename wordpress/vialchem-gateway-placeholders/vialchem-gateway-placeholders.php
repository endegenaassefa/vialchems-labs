<?php
/**
 * Plugin Name: VialChem Gateway Placeholders
 * Plugin URI: https://vialchemlabs.net
 * Description: Link Money placeholder gateway and admin guardrails for VialChem WooCommerce checkout.
 * Version: 1.0.1
 * Author: VialChem Labs LLC
 * Text Domain: vialchem-gateway-placeholders
 */

if ( ! defined( 'ABSPATH' ) ) {
	exit;
}

add_action( 'plugins_loaded', 'vialchem_gateway_placeholders_bootstrap' );
function vialchem_gateway_placeholders_bootstrap() {
	if ( ! class_exists( 'WC_Payment_Gateway' ) ) {
		return;
	}

	class WC_Gateway_VialChem_Link_Money extends WC_Payment_Gateway {
		public $api_key;

		public function __construct() {
			$this->id                 = 'vialchem_link_money';
			$this->method_title       = esc_html__( 'Link Money', 'vialchem-gateway-placeholders' );
			$this->method_description = esc_html__( 'Placeholder Pay by Bank gateway. Replace with the official Link Money WooCommerce integration or supply merchant API credentials before enabling live checkout.', 'vialchem-gateway-placeholders' );
			$this->has_fields         = false;
			$this->supports           = array( 'products' );

			$this->init_form_fields();
			$this->init_settings();

			$this->title       = $this->get_option( 'title', 'Link Money / Pay by Bank' );
			$this->description = $this->get_option( 'description', 'Pay by bank at secure checkout.' );
			$this->enabled     = $this->get_option( 'enabled', 'no' );
			$this->api_key     = $this->get_option( 'api_key', defined( 'VIALCHEM_LINK_MONEY_API_KEY' ) ? VIALCHEM_LINK_MONEY_API_KEY : '' );

			add_action( 'woocommerce_update_options_payment_gateways_' . $this->id, array( $this, 'process_admin_options' ) );
		}

		public function init_form_fields() {
			$this->form_fields = array(
				'enabled'     => array(
					'title'   => esc_html__( 'Enable/Disable', 'vialchem-gateway-placeholders' ),
					'type'    => 'checkbox',
					'label'   => esc_html__( 'Enable Link Money placeholder', 'vialchem-gateway-placeholders' ),
					'default' => 'no',
				),
				'title'       => array(
					'title'       => esc_html__( 'Title', 'vialchem-gateway-placeholders' ),
					'type'        => 'text',
					'description' => esc_html__( 'Customer-facing title.', 'vialchem-gateway-placeholders' ),
					'default'     => 'Link Money / Pay by Bank',
				),
				'description' => array(
					'title'   => esc_html__( 'Description', 'vialchem-gateway-placeholders' ),
					'type'    => 'textarea',
					'default' => 'Pay by bank at secure checkout.',
				),
				'api_key'     => array(
					'title'       => esc_html__( 'Link Money API key', 'vialchem-gateway-placeholders' ),
					'type'        => 'password',
					'description' => esc_html__( 'Placeholder until operator provides the live Link Money merchant key or installs the official plugin.', 'vialchem-gateway-placeholders' ),
					'default'     => defined( 'VIALCHEM_LINK_MONEY_API_KEY' ) ? VIALCHEM_LINK_MONEY_API_KEY : '',
				),
			);
		}

		public function is_available() {
			if ( 'yes' !== $this->enabled ) {
				return false;
			}

			return $this->has_live_api_key();
		}

		public function process_payment( $order_id ) {
			$order = wc_get_order( $order_id );
			if ( ! $order ) {
				wc_add_notice( esc_html__( 'Unable to initialize Link Money payment.', 'vialchem-gateway-placeholders' ), 'error' );
				return array( 'result' => 'failure' );
			}

			if ( ! $this->has_live_api_key() ) {
				wc_add_notice( esc_html__( 'Link Money credentials are not configured yet.', 'vialchem-gateway-placeholders' ), 'error' );
				return array( 'result' => 'failure' );
			}

			$order->update_status( 'on-hold', esc_html__( 'Link Money placeholder selected. Awaiting live Link Money API integration.', 'vialchem-gateway-placeholders' ) );

			return array(
				'result'   => 'success',
				'redirect' => $this->get_return_url( $order ),
			);
		}

		private function has_live_api_key() {
			$key = is_string( $this->api_key ) ? trim( $this->api_key ) : '';
			return '' !== $key && false === strpos( $key, 'PLACEHOLDER_' );
		}
	}
}

add_filter( 'woocommerce_payment_gateways', 'vialchem_register_link_money_gateway' );
function vialchem_register_link_money_gateway( $gateways ) {
	$gateways[] = 'WC_Gateway_VialChem_Link_Money';
	return $gateways;
}

add_filter( 'woocommerce_available_payment_gateways', 'vialchem_disable_placeholder_card_wallet_gateways', 20 );
function vialchem_disable_placeholder_card_wallet_gateways( $gateways ) {
	$disabled_ids = array(
		'stripe',
		'ppcp-gateway',
		'paypal',
		'woocommerce_payments',
	);

	foreach ( $disabled_ids as $id ) {
		if ( isset( $gateways[ $id ] ) ) {
			unset( $gateways[ $id ] );
		}
	}

	return $gateways;
}

add_filter( 'woocommerce_available_payment_gateways', 'vialchem_restrict_gateways_to_preferred_method', 30 );
function vialchem_restrict_gateways_to_preferred_method( $gateways ) {
	if ( ! function_exists( 'is_wc_endpoint_url' ) || ! is_wc_endpoint_url( 'order-pay' ) ) {
		return $gateways;
	}

	$order_id = absint( get_query_var( 'order-pay' ) );
	if ( ! $order_id && isset( $_SERVER['REQUEST_URI'] ) ) {
		$path = wp_parse_url( sanitize_text_field( wp_unslash( (string) $_SERVER['REQUEST_URI'] ) ), PHP_URL_PATH );
		if ( is_string( $path ) && preg_match( '#/checkout/order-pay/([0-9]+)/?#', $path, $matches ) ) {
			$order_id = absint( $matches[1] );
		}
	}

	if ( ! $order_id ) {
		return $gateways;
	}

	$order = wc_get_order( $order_id );
	if ( ! $order ) {
		return $gateways;
	}

	$preferred = sanitize_key( (string) $order->get_meta( '_preferred_payment_method', true ) );
	if ( ! $preferred ) {
		return $gateways;
	}

	$gateway_ids_by_method = array(
		'link_money' => array( 'vialchem_link_money', 'link_money', 'linkmoney' ),
		'bitcoin'    => array( 'btcpay', 'btcpay_server', 'btcpay_gateway', 'btcpay_for_woocommerce' ),
		'card'       => array( 'stripe', 'woocommerce_payments' ),
		'apple_pay'  => array( 'stripe', 'woocommerce_payments' ),
		'google_pay' => array( 'stripe', 'woocommerce_payments' ),
		'paypal'     => array( 'ppcp-gateway', 'paypal' ),
	);

	$allowed_ids = apply_filters(
		'vialchem_preferred_payment_gateway_ids',
		$gateway_ids_by_method[ $preferred ] ?? array(),
		$preferred
	);

	if ( empty( $allowed_ids ) || ! is_array( $allowed_ids ) ) {
		return array();
	}

	return array_intersect_key( $gateways, array_flip( array_map( 'sanitize_key', $allowed_ids ) ) );
}

add_action( 'admin_notices', 'vialchem_gateway_placeholder_admin_notice' );
function vialchem_gateway_placeholder_admin_notice() {
	if ( ! current_user_can( 'manage_woocommerce' ) ) {
		return;
	}

	$screen = function_exists( 'get_current_screen' ) ? get_current_screen() : null;
	if ( ! $screen || false === strpos( $screen->id, 'woocommerce' ) ) {
		return;
	}

	echo '<div class="notice notice-warning"><p>';
	echo esc_html__( 'VialChem checkout placeholders: configure BTCPay V2, replace PLACEHOLDER_LINK_MONEY_API_KEY, and keep Stripe/PayPal/card wallets disabled until live credentials and compliance approval are present.', 'vialchem-gateway-placeholders' );
	echo '</p></div>';
}
