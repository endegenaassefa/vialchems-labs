<?php
/**
 * Checkout header matching the Next.js v2 shell.
 */

if ( ! defined( 'ABSPATH' ) ) {
	exit;
}
?>
<!doctype html>
<html <?php language_attributes(); ?>>
<head>
	<meta charset="<?php bloginfo( 'charset' ); ?>">
	<meta name="viewport" content="width=device-width, initial-scale=1">
	<?php wp_head(); ?>
</head>
<body <?php body_class( 'vc-checkout-body' ); ?>>
<?php wp_body_open(); ?>
<a class="screen-reader-text" href="#main">Skip to main content</a>
<nav class="vc-nav" aria-label="Site navigation">
	<div class="vc-container vc-nav-inner">
		<a class="vc-brand" href="<?php echo vialchem_main_site_url( '/' ); ?>" aria-label="vialchemlabs home">
			<span class="vc-brand-mark" aria-hidden="true"></span>
			<span>vialchem<span class="vc-muted">.labs</span></span>
		</a>
		<div class="vc-nav-links">
			<a href="<?php echo vialchem_main_site_url( '/shop' ); ?>">Shop Peptides</a>
			<a href="<?php echo vialchem_main_site_url( '/coa' ); ?>">Verify a Vial</a>
			<a href="<?php echo vialchem_main_site_url( '/affiliate' ); ?>">Affiliate Program</a>
			<a href="<?php echo vialchem_main_site_url( '/account' ); ?>">My Lab</a>
		</div>
		<div class="vc-nav-spacer"></div>
		<a class="vc-btn vc-btn-accent" href="<?php echo vialchem_main_site_url( '/shop' ); ?>">Return to catalog</a>
	</div>
</nav>
<main id="main" class="vc-main">
	<section class="vc-checkout-hero">
		<div class="vc-container">
			<p class="vc-eyebrow">Secure checkout</p>
			<h1>Complete your order</h1>
			<p>Payment authorization and order processing are handled on shop.vialchemlabs.net.</p>
		</div>
	</section>
	<section class="vc-checkout-shell">
		<div class="vc-container">
