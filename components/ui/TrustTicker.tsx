/**
 * TrustTicker — Repeating monospace claim ticker.
 *
 * Inspired directly by biocollexresearch.com's repeating trust banner
 * ("FREE SHIPPING ON $200+ / COAS PROVIDED / US-BASED LAB CERTIFIED /
 * 99%+ PURITY GUARANTEED") which loops obsessively to reinforce key trust
 * signals without being overt. Adapted to vialchemlabs' Posture A: charcoal bg,
 * Plex Mono uppercase claims, accent dividers.
 *
 * Items are shown statically on small screens (no horizontal scroll on
 * narrow viewports — accessibility + perf), and animated marquee on
 * md+ viewports. Honors prefers-reduced-motion via global @media kill switch
 * in app/globals.css.
 */
import { cn } from "@/lib/utils";

export interface TrustTickerProps {
  items: string[];
  className?: string;
}

export function TrustTicker({ items, className }: TrustTickerProps) {
  if (items.length === 0) return null;
  // Duplicate items so the marquee can loop seamlessly.
  const duplicated = [...items, ...items];
  return (
    <section
      aria-label="Trust signals"
      className={cn(
        "w-full overflow-hidden",
        "border-y border-[var(--border)] bg-[var(--surface)]",
        className,
      )}
    >
      {/* Mobile: static, comma-joined, mono-uppercase */}
      <div className="md:hidden px-6 py-4">
        <p className="font-mono text-[11px] uppercase tracking-[0.16em] text-[var(--text-muted)] leading-relaxed">
          {items.map((item, i) => (
            <span key={i}>
              {item}
              {i < items.length - 1 ? (
                <span className="text-[var(--accent)] mx-2" aria-hidden="true">
                  ·
                </span>
              ) : null}
            </span>
          ))}
        </p>
      </div>
      {/* Desktop: marquee */}
      <div className="hidden md:block">
        <ul
          className={cn(
            "flex gap-12 whitespace-nowrap py-4 px-6",
            "animate-trust-ticker",
          )}
          aria-hidden="true"
        >
          {duplicated.map((item, i) => (
            <li
              key={i}
              className="font-mono text-[11px] uppercase tracking-[0.16em] text-[var(--text-muted)] flex items-center gap-12"
            >
              <span>{item}</span>
              <span className="text-[var(--accent)]" aria-hidden="true">
                ·
              </span>
            </li>
          ))}
        </ul>
        {/* SR-friendly: original list as static text */}
        <p className="sr-only">{items.join(", ")}</p>
      </div>
    </section>
  );
}
