<?php
/**
 * Checkout footer matching the Next.js v2 shell.
 */

if ( ! defined( 'ABSPATH' ) ) {
	exit;
}
?>
		</div>
	</section>
</main>
<footer class="vc-footer">
	<div class="vc-container">
		<div class="vc-foot-grid">
			<div class="vc-foot-col">
				<a class="vc-brand" href="<?php echo vialchem_main_site_url( '/' ); ?>" style="margin-bottom:16px">
					<span class="vc-brand-mark" aria-hidden="true"></span>
					<span>vialchem<span class="vc-muted">.labs</span></span>
				</a>
				<p style="max-width:320px;margin:0 0 16px">Research-grade peptides sold only to verified laboratories and qualified research organizations.</p>
				<div class="vc-badge"><span class="vc-badge-dot"></span>Research Use Only</div>
			</div>
			<div class="vc-foot-col">
				<h5>Shop</h5>
				<ul>
					<li><a href="<?php echo vialchem_main_site_url( '/shop' ); ?>">Peptide Catalog</a></li>
					<li><a href="<?php echo vialchem_main_site_url( '/coa' ); ?>">Verify a Vial</a></li>
					<li><a href="<?php echo vialchem_main_site_url( '/account' ); ?>">My Lab</a></li>
				</ul>
			</div>
			<div class="vc-foot-col">
				<h5>Compliance</h5>
				<ul>
					<li><a href="<?php echo vialchem_main_site_url( '/legal/terms' ); ?>">Research Use Policy</a></li>
					<li><a href="<?php echo vialchem_main_site_url( '/faq' ); ?>">Quality Standards</a></li>
					<li><a href="<?php echo vialchem_main_site_url( '/coa' ); ?>">Documentation</a></li>
					<li><a href="<?php echo vialchem_main_site_url( '/legal/shipping' ); ?>">Shipping</a></li>
				</ul>
			</div>
			<div class="vc-foot-col">
				<h5>Organization</h5>
				<ul>
					<li><a href="<?php echo vialchem_main_site_url( '/about' ); ?>">About</a></li>
					<li><a href="<?php echo vialchem_main_site_url( '/contact' ); ?>">Contact</a></li>
					<li><a href="<?php echo vialchem_main_site_url( '/affiliate' ); ?>">Affiliate</a></li>
					<li><a href="<?php echo vialchem_main_site_url( '/blog' ); ?>">Research Notes</a></li>
				</ul>
			</div>
			<div class="vc-foot-col">
				<h5>Legal</h5>
				<ul>
					<li><a href="<?php echo vialchem_main_site_url( '/legal/terms' ); ?>">Terms</a></li>
					<li><a href="<?php echo vialchem_main_site_url( '/legal/privacy' ); ?>">Privacy</a></li>
					<li><a href="<?php echo vialchem_main_site_url( '/legal/refunds' ); ?>">Refunds</a></li>
					<li><a href="<?php echo vialchem_main_site_url( '/legal/cookies' ); ?>">Cookies</a></li>
				</ul>
			</div>
		</div>
		<div class="vc-foot-base">
			<span>&copy; 2026 VIALCHEM LABS - RESEARCH USE ONLY - NOT FOR HUMAN OR ANIMAL USE</span>
			<span>BUILD 26.04 - STATUS: OPERATIONAL</span>
		</div>
	</div>
</footer>
<?php wp_footer(); ?>
</body>
</html>
