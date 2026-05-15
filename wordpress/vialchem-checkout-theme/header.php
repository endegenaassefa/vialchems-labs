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
		<div class="vc-nav-actions">
			<button type="button" class="vc-theme-switch" aria-label="Dark theme" aria-pressed="true" title="Dark theme">
				<svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">
					<path d="M20.985 12.486a9 9 0 1 1-9.473-9.472c.405-.022.617.46.402.803a6 6 0 0 0 8.268 8.268c.344-.215.825-.004.803.401"></path>
				</svg>
				<span>Theme · dark</span>
				<span class="vc-theme-toggle" aria-hidden="true"><span></span></span>
			</button>
			<a class="vc-icon-btn" href="<?php echo vialchem_main_site_url( '/shop?focus=search' ); ?>" aria-label="Search catalog" title="Search catalog">
				<svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">
					<path d="m21 21-4.34-4.34"></path><circle cx="11" cy="11" r="8"></circle>
				</svg>
			</a>
			<a class="vc-icon-btn" href="<?php echo vialchem_main_site_url( '/account' ); ?>" aria-label="Account" title="Account">
				<svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">
					<path d="M19 21v-2a4 4 0 0 0-4-4H9a4 4 0 0 0-4 4v2"></path><circle cx="12" cy="7" r="4"></circle>
				</svg>
			</a>
			<a class="vc-icon-btn" href="<?php echo vialchem_main_site_url( '/cart' ); ?>" aria-label="Cart" title="Cart">
				<svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">
					<circle cx="8" cy="21" r="1"></circle><circle cx="19" cy="21" r="1"></circle><path d="M2.05 2.05h2l2.66 12.42a2 2 0 0 0 2 1.58h9.78a2 2 0 0 0 1.95-1.57l1.65-7.43H5.12"></path>
				</svg>
			</a>
			<a class="vc-btn vc-btn-primary vc-btn-sm vc-nav-cta" href="<?php echo vialchem_main_site_url( '/affiliate' ); ?>">
				Affiliate
				<svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">
					<path d="M5 12h14"></path><path d="m12 5 7 7-7 7"></path>
				</svg>
			</a>
		</div>
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
