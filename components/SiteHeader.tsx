import Link from 'next/link';
import { siteConfig } from '@/lib/content/site';

const NAV = [
  { href: '/shop', label: 'Shop' },
  { href: '/test-reports', label: 'Quality' },
  { href: '/coa', label: 'COA' },
  { href: '/blog', label: 'Research' },
  { href: '/about', label: 'About' },
  { href: '/faq', label: 'FAQ' },
  { href: '/contact', label: 'Contact' },
];

export function SiteHeader() {
  return (
    <header className="border-b border-[var(--border)] bg-[var(--surface-muted)] backdrop-blur-md sticky top-0 z-20">
      <div className="mx-auto max-w-6xl px-6 h-16 flex items-center justify-between">
        <Link
          href="/"
          className="flex items-baseline gap-2 group"
          aria-label={`${siteConfig.name} home`}
        >
          <span className="text-[20px] font-semibold tracking-tight text-[var(--text)] group-hover:text-[var(--accent-soft)] transition-colors duration-[var(--dur-short)]">
            Vialchems
          </span>
          <span className="font-mono text-[11px] uppercase tracking-[0.16em] px-2 py-0.5 rounded-[var(--radius-sm)] border border-[var(--border-strong)] text-[var(--accent)]">
            LABS
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

        <div className="flex items-center gap-2">
          <Link
            href="/account"
            className="hidden md:inline-flex items-center font-mono text-[11px] uppercase tracking-[0.16em] text-[var(--text-muted)] hover:text-[var(--accent)] transition-colors px-3 py-2"
          >
            Account
          </Link>
          <Link
            href="/cart"
            className="inline-flex items-center gap-2 px-4 h-10 rounded-[var(--radius-md)] border border-[var(--border-strong)] hover:border-[var(--accent)] text-[14px] transition-colors duration-[var(--dur-short)]"
            aria-label="Cart"
          >
            <span>Cart</span>
            <span className="font-mono text-[11px] text-[var(--text-muted)]">0</span>
          </Link>
        </div>
      </div>
    </header>
  );
}
