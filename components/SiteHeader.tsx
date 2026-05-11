import Link from 'next/link';
import { siteConfig } from '@/lib/content/site';
import { CartCount } from '@/components/CartCount';
import { MobileNavMenu } from '@/components/MobileNavMenu';
import { AuthHeaderLink } from '@/components/AuthHeaderLink';
import { ThemeToggle } from '@/components/ThemeToggle';

// v5 rebrand — nav rewritten per brand spec §6:
//   Shop Peptides · Verify a Vial · Get Verified · My Lab
const NAV = [
  { href: '/shop', label: 'Shop Peptides' },
  { href: '/coa', label: 'Verify a Vial' },
  { href: '/verify', label: 'Get Verified' },
  { href: '/account', label: 'My Lab' },
];

export function SiteHeader() {
  return (
    <header className="border-b border-[var(--border)] bg-[var(--bg)]/85 backdrop-blur-md sticky top-0 z-20">
      <div className="mx-auto max-w-6xl px-6 h-16 flex items-center justify-between">
        <Link
          href="/"
          className="group inline-flex items-baseline leading-none"
          aria-label={`${siteConfig.name} home`}
        >
          {/* Wordmark — single lowercase brand name. */}
          <span className="text-[18px] font-medium tracking-tight text-[var(--text)]">
            vialchemlabs
          </span>
        </Link>

        <nav className="hidden md:flex items-center gap-1" aria-label="Primary">
          {NAV.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className="px-3 py-2 text-[14px] text-[var(--text-muted)] hover:text-[var(--text)] transition-colors duration-[var(--dur-short)] rounded-[var(--radius-md)]"
            >
              {item.label}
            </Link>
          ))}
        </nav>

        <div className="flex items-center gap-3">
          <ThemeToggle />
          <AuthHeaderLink />
          <Link
            href="/verify"
            className="hidden md:inline-flex items-center px-3 h-9 rounded-[var(--radius-md)] bg-[var(--accent)] text-[var(--text-on-accent)] text-[13px] font-medium hover:bg-[var(--accent-deep)] transition-colors duration-[var(--dur-short)]"
          >
            Get Verified
          </Link>
          <Link
            href="/cart"
            className="inline-flex items-center gap-2 px-3 h-9 rounded-[var(--radius-md)] border border-[var(--border)] hover:border-[var(--accent)] text-[13px] transition-colors duration-[var(--dur-short)]"
            aria-label="Cart"
          >
            <span>Cart</span>
            <CartCount />
          </Link>
          <MobileNavMenu items={NAV} />
        </div>
      </div>
    </header>
  );
}
