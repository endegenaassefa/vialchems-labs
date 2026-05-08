import Link from 'next/link';
import { siteConfig } from '@/lib/content/site';

/**
 * Site footer with verbatim disclaimer block (Appendix A.1) and link grid (Appendix O).
 * Disclaimer language is LOCKED via DECISIONS/compliance_posture.md.
 */
export function SiteFooter() {
  const year = new Date().getFullYear();
  return (
    <footer className="mt-auto border-t border-[var(--border)] bg-[var(--surface)]">
      <div className="mx-auto max-w-6xl px-6 py-12">
        <div className="grid gap-10 md:grid-cols-5">
          <div className="md:col-span-2">
            <p className="text-[18px] font-semibold tracking-tight text-[var(--text)] mb-2">
              {siteConfig.name}
            </p>
            <p className="text-[14px] text-[var(--text-muted)] max-w-sm mb-5">
              Research peptides with per-batch independent Certificates of Analysis.
              {' '}
              <span className="font-mono text-[var(--accent)]">{siteConfig.tagline}</span>
            </p>
            <form
              action="/api/newsletter/subscribe"
              method="POST"
              className="flex gap-2 max-w-sm"
            >
              <input
                type="email"
                name="email"
                required
                aria-label="Email address for newsletter"
                placeholder="research@example.com"
                className="flex-1 h-10 px-3 rounded-[var(--radius-md)] bg-[var(--surface-strong)] border border-[var(--border)] text-[14px] focus:border-[var(--accent)] focus:outline-none"
              />
              <button
                type="submit"
                className="px-4 h-10 rounded-[var(--radius-md)] bg-[var(--accent)] text-[var(--bg)] font-medium text-[13px] hover:bg-[var(--accent-soft)] transition-colors"
              >
                Subscribe
              </button>
            </form>
            <p className="font-mono text-[11px] text-[var(--text-subtle)] mt-2">
              Research updates. No marketing fluff. 15% off first order.
            </p>
          </div>

          <div>
            <h3 className="font-mono text-[11px] uppercase tracking-[0.16em] text-[var(--text-muted)] mb-3">
              Shop
            </h3>
            <ul className="space-y-2 text-[14px]">
              <li>
                <Link href="/shop" className="text-[var(--text-muted)] hover:text-[var(--accent)] transition-colors">
                  All Products
                </Link>
              </li>
              <li>
                <Link href="/products/recovery-stack" className="text-[var(--text-muted)] hover:text-[var(--accent)] transition-colors">
                  Recovery Stack
                </Link>
              </li>
              <li>
                <Link href="/coa" className="text-[var(--text-muted)] hover:text-[var(--accent)] transition-colors">
                  Certificate of Analysis
                </Link>
              </li>
              <li>
                <Link href="/test-reports" className="text-[var(--text-muted)] hover:text-[var(--accent)] transition-colors">
                  Lab Partner
                </Link>
              </li>
            </ul>
          </div>

          <div>
            <h3 className="font-mono text-[11px] uppercase tracking-[0.16em] text-[var(--text-muted)] mb-3">
              Customer Service
            </h3>
            <ul className="space-y-2 text-[14px]">
              <li><Link href="/contact" className="text-[var(--text-muted)] hover:text-[var(--accent)] transition-colors">Contact</Link></li>
              <li><Link href="/faq" className="text-[var(--text-muted)] hover:text-[var(--accent)] transition-colors">FAQ</Link></li>
              <li><Link href="/account" className="text-[var(--text-muted)] hover:text-[var(--accent)] transition-colors">Account</Link></li>
              <li><Link href="/affiliate" className="text-[var(--text-muted)] hover:text-[var(--accent)] transition-colors">Affiliate Program</Link></li>
            </ul>
          </div>

          <div>
            <h3 className="font-mono text-[11px] uppercase tracking-[0.16em] text-[var(--text-muted)] mb-3">
              Legal
            </h3>
            <ul className="space-y-2 text-[14px]">
              <li><Link href="/legal/terms" className="text-[var(--text-muted)] hover:text-[var(--accent)] transition-colors">Terms</Link></li>
              <li><Link href="/legal/privacy" className="text-[var(--text-muted)] hover:text-[var(--accent)] transition-colors">Privacy</Link></li>
              <li><Link href="/legal/refunds" className="text-[var(--text-muted)] hover:text-[var(--accent)] transition-colors">Refunds</Link></li>
              <li><Link href="/legal/shipping" className="text-[var(--text-muted)] hover:text-[var(--accent)] transition-colors">Shipping</Link></li>
              <li><Link href="/legal/cookies" className="text-[var(--text-muted)] hover:text-[var(--accent)] transition-colors">Cookies</Link></li>
            </ul>
          </div>
        </div>

        {/* Verbatim disclaimer block — LOCKED per DECISIONS/compliance_posture.md and Appendix A.1 */}
        <div className="mt-12 pt-8 border-t border-[var(--border)] space-y-3 text-[13px] text-[var(--text-subtle)] leading-relaxed">
          <p>
            All products are sold for research, laboratory, or analytical purposes only,
            and are not for human consumption.
          </p>
          <p>
            The statements made within this website have not been evaluated by the
            U.S. Food and Drug Administration. The statements and the products of this
            company are not intended to diagnose, treat, cure or prevent any disease.
          </p>
          <p>
            {siteConfig.name} is a chemical supplier. {siteConfig.name} is not a compounding
            pharmacy or chemical compounding facility as defined under 503A of the Federal
            Food, Drug, and Cosmetic Act. {siteConfig.name} is not an outsourcing facility
            as defined under 503B of the Federal Food, Drug, and Cosmetic Act.
          </p>
        </div>

        <div className="mt-8 text-[12px] text-[var(--text-subtle)] flex justify-between flex-wrap gap-3">
          <p>© {year} {siteConfig.llcName}, {siteConfig.llcJurisdiction}. All rights reserved.</p>
          <p className="font-mono">vialchems.labs</p>
        </div>
      </div>
    </footer>
  );
}
