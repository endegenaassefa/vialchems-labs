/**
 * Shared shell for legal pages. Renders the title, last-updated stamp, and
 * a prose-style content column with consistent typography.
 *
 * Server component — no client logic. Each /legal/* page imports this and
 * passes its title + body sections.
 */
import type { ReactNode } from "react";
import Link from "next/link";
import { SiteHeader } from "@/components/SiteHeader";
import { SiteFooter } from "@/components/SiteFooter";

interface LegalShellProps {
  eyebrow: string;
  title: string;
  lastUpdated: string;
  children: ReactNode;
}

export function LegalShell({
  eyebrow,
  title,
  lastUpdated,
  children,
}: LegalShellProps) {
  return (
    <>
      <SiteHeader />
      <main id="main" className="flex-1">
        <section className="border-b border-[var(--border)]">
          <div className="mx-auto max-w-3xl px-6 py-20 md:py-24">
            <p className="font-mono text-[11px] uppercase tracking-[0.16em] text-[var(--accent)] mb-6">
              <Link href="/" className="hover:text-[var(--accent-soft)]">
                ← Home
              </Link>
              {" / "}
              {eyebrow}
            </p>
            <h1 className="text-[clamp(36px,5vw,60px)] font-light leading-[1.08] tracking-tight text-[var(--text)] mb-4">
              {title}
            </h1>
            <p className="font-mono text-[12px] text-[var(--text-subtle)] uppercase tracking-[0.16em]">
              Last updated: {lastUpdated}
            </p>
          </div>
        </section>

        <section>
          <div className="mx-auto max-w-3xl px-6 py-16 text-[16px] leading-[1.75] text-[var(--text-muted)]">
            {children}
          </div>
        </section>
      </main>
      <SiteFooter />
    </>
  );
}
