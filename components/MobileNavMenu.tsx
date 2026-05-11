'use client';

/**
 * MobileNavMenu — disclosure-style nav for narrow viewports.
 *
 * Lives in SiteHeader behind `md:hidden` so desktop keeps the inline nav.
 * Closes on Escape, click outside, or any internal Link click. Body scroll
 * locks while open (prevents background scroll on iOS).
 *
 * ISSUE-005 fix: previously SiteHeader hid the desktop nav at md and provided
 * no replacement, so mobile users had no way to reach Shop / Quality / COA /
 * Research / About / FAQ / Contact except via the footer.
 */
import Link from 'next/link';
import { useEffect, useState, useSyncExternalStore } from 'react';
import { createPortal } from 'react-dom';
import { Menu, X } from 'lucide-react';

interface MobileNavMenuProps {
  items: { href: string; label: string }[];
}

const subscribe = () => () => {};
const noopSnapshot = () => false;
const clientSnapshot = () => true;

export function MobileNavMenu({ items }: MobileNavMenuProps) {
  const [open, setOpen] = useState(false);
  const mounted = useSyncExternalStore(subscribe, clientSnapshot, noopSnapshot);

  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') setOpen(false);
    };
    document.addEventListener('keydown', onKey);
    document.body.style.overflow = 'hidden';
    return () => {
      document.removeEventListener('keydown', onKey);
      document.body.style.overflow = '';
    };
  }, [open]);

  return (
    <>
      <button
        type="button"
        onClick={() => setOpen(true)}
        aria-label="Open menu"
        aria-expanded={open}
        aria-controls="mobile-nav-drawer"
        className="md:hidden inline-flex items-center justify-center w-10 h-10 rounded-[var(--radius-md)] border border-[var(--border-strong)] hover:border-[var(--accent)] text-[var(--text-muted)] hover:text-[var(--text)] transition-colors"
      >
        <Menu size={18} aria-hidden="true" />
      </button>

      {open && mounted &&
        createPortal(
          <div
            id="mobile-nav-drawer"
            role="dialog"
            aria-modal="true"
            aria-label="Site navigation"
            className="md:hidden fixed inset-0 z-50 bg-black/80"
            onClick={(e) => {
              if (e.target === e.currentTarget) setOpen(false);
            }}
          >
            <div className="absolute right-0 top-0 h-full w-full max-w-sm bg-[var(--surface)] border-l border-[var(--border)] shadow-2xl flex flex-col">
              <div className="flex items-center justify-between px-6 h-16 border-b border-[var(--border)]">
                <span className="font-mono text-[11px] uppercase tracking-[0.16em] text-[var(--text-muted)]">
                  Menu
                </span>
                <button
                  type="button"
                  onClick={() => setOpen(false)}
                  aria-label="Close menu"
                  className="inline-flex items-center justify-center w-10 h-10 rounded-[var(--radius-md)] border border-[var(--border-strong)] hover:border-[var(--accent)] text-[var(--text-muted)] hover:text-[var(--text)] transition-colors"
                >
                  <X size={18} aria-hidden="true" />
                </button>
              </div>
              <nav className="flex-1 overflow-y-auto px-6 py-4" aria-label="Mobile navigation">
                <ul className="space-y-1">
                  {items.map((item) => (
                    <li key={item.href}>
                      <Link
                        href={item.href}
                        onClick={() => setOpen(false)}
                        className="block px-3 py-3 text-[16px] text-[var(--text)] hover:text-[var(--accent)] rounded-[var(--radius-md)] hover:bg-[var(--surface-strong)] transition-colors"
                      >
                        {item.label}
                      </Link>
                    </li>
                  ))}
                  <li className="pt-4 mt-4 border-t border-[var(--border)]">
                    <Link
                      href="/account"
                      onClick={() => setOpen(false)}
                      className="block px-3 py-3 font-mono text-[12px] uppercase tracking-[0.16em] text-[var(--text-muted)] hover:text-[var(--accent)] rounded-[var(--radius-md)] hover:bg-[var(--surface-strong)] transition-colors"
                    >
                      Account
                    </Link>
                  </li>
                </ul>
              </nav>
            </div>
          </div>,
          document.body,
        )}
    </>
  );
}
