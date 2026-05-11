import Link from 'next/link';
import { siteConfig } from '@/lib/content/site';
import { NewsletterForm } from '@/components/NewsletterForm';

/**
 * Site footer with verbatim disclaimer block (Appendix A.1) and link grid (Appendix O).
 * Disclaimer language is LOCKED via DECISIONS/compliance_posture.md.
 */
export function SiteFooter() {
  const year = new Date().getFullYear();
  return (
    <footer className="mt-auto border-t border-[var(--border)] bg-[var(--bg)]">
      <div className="mx-auto max-w-6xl px-6 py-14">
        {/* v5 — RESEARCH USE ONLY badge banner per brand spec §5 */}
        <div className="mb-10 flex items-center justify-center">
          <span className="inline-flex items-center gap-2 px-3 h-7 rounded-[var(--radius-pill)] border border-[var(--border)] bg-[var(--surface)] font-mono text-[11px] uppercase tracking-[0.05em] text-[var(--text-muted)]">
            <span aria-hidden="true" className="h-1.5 w-1.5 rounded-full bg-[var(--accent-hi)]" />
            Research use only · For verified laboratories
          </span>
        </div>
        <div className="grid gap-10 md:grid-cols-5">
          <div className="md:col-span-2">
            <p className="text-[18px] font-medium tracking-tight text-[var(--text)] mb-2">
              vialchemlabs
            </p>
            <p className="text-[14px] text-[var(--text-muted)] max-w-sm mb-5 leading-relaxed">
              {siteConfig.tagline} For verified laboratories and qualified
              research organizations only.
            </p>
            <NewsletterForm />
            <p className="font-mono text-[11px] uppercase tracking-[0.05em] text-[var(--text-subtle)] mt-2">
              Research updates. No marketing fluff.
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
          <p className="font-mono">vialchemlabs</p>
        </div>
      </div>
    </footer>
  );
}
