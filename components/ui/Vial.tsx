/**
 * Vial — clean clinical SVG vial graphic, v1.3 redesign.
 *
 * Posture A signature element. Refined to match the operator-supplied
 * Appendix AD reference image more closely:
 *
 *   - viewBox tightened to 28×60 (≈ 22:50 = 2.27:1 real-product aspect)
 *   - Cap is now WIDER than glass body (typical pharmaceutical crimp); the
 *     silvery aluminum tube + crimp shoulder reads correctly.
 *   - Glass body has more prominent left highlight + subtle right shadow.
 *   - Wrap label uses the teal accent border on all four edges (per
 *     Appendix AD §1) rather than just a top stripe.
 *   - VIALCHEMLABS wordmark + accent dot at top-left of label.
 *   - QR code on the LEFT of the lower label band (per reference); BATCH /
 *     LOT / MFG / EXP stack on the RIGHT.
 *   - New animation primitives: `spin`, `bob`, `interactive` (hover scale +
 *     click 360° rotation). All honor `prefers-reduced-motion: reduce`.
 *
 * Iron Law compliance:
 *   - 2.7 enforcement via `assertCompoundAllowed` against the LOCKED catalog
 *     in lib/content/products.ts. Out-of-catalog compound names throw at
 *     render with an Iron-Law-2.7 reference.
 *   - 2.10 — RUO disclaimer text on label is verbatim per Appendix A.2 spirit
 *     ("RESEARCH USE ONLY / NOT FOR HUMAN CONSUMPTION").
 *   - 2.18 — animations honor reduced-motion via the global @media kill
 *     switch in app/globals.css plus the explicit `motion-reduce:` Tailwind
 *     utilities below.
 *   - 2.21 — additive only: no token names changed; new keyframes appended
 *     to globals.css under v1.3 section.
 *   - 2.26 — palette + label composition unchanged; only refinement.
 *   - 2.27 — SVG-only (no raster, no QR library Day-1); zero JS bundle cost
 *     beyond the existing component code.
 */
'use client';

import {
  useCallback,
  useState,
  type HTMLAttributes,
  type Ref,
} from 'react';
import { cn } from '@/lib/utils';
import { products, bundles } from '@/lib/content/products';

export type VialSize = 'sm' | 'md' | 'lg' | 'xl' | '2xl';

export interface VialProps extends HTMLAttributes<HTMLDivElement> {
  size?: VialSize;
  /** Continuous gentle rotation sway (existing v3 keyframe). */
  sway?: boolean;
  /** Continuous full-rotation spin (slower). v1.3 addition. */
  spin?: boolean;
  /** Continuous vertical float. v1.3 addition. */
  bob?: boolean;
  /**
   * Pointer-interactive: hover scales 1.05; click triggers a single 360°
   * rotation. Touch-safe (taps trigger rotation). v1.3 addition.
   */
  interactive?: boolean;
  /**
   * When true, render the wrap-label SVG overlay per Appendix AD with
   * VIALCHEMLABS wordmark + compound + dose + RUO disclaimer + QR.
   * Requires `compound` and `dose` to be supplied.
   */
  withLabel?: boolean;
  /**
   * Compound short-name (e.g., "BPC-157"). Validated at render time
   * against the LOCKED catalog (lib/content/products.ts) per Iron Law 2.7.
   */
  compound?: string;
  /** Dose label (e.g., "10mg" or "5 mg"). Free-form string. */
  dose?: string;
  /** Optional batch code displayed on label (default: "2026-01"). */
  batch?: string;
  ref?: Ref<HTMLDivElement>;
}

const sizeClasses: Record<VialSize, string> = {
  sm: 'w-7 h-16',
  md: 'w-10 h-24',
  lg: 'w-14 h-32',
  xl: 'w-20 h-44',
  '2xl': 'w-28 h-64',
};

// Iron Law 2.7 enforcement via catalog whitelist.
const allowedCompounds: ReadonlySet<string> = new Set([
  ...products.map((p) => p.shortName.toLowerCase()),
  ...bundles.map((b) => b.name.toLowerCase()),
]);

function assertCompoundAllowed(compound: string): void {
  const normalized = compound.trim().toLowerCase();
  if (!allowedCompounds.has(normalized)) {
    throw new Error(
      `Iron Law 2.7 violation: compound "${compound}" is not in the LOCKED ` +
        `vialchemlabs catalog (lib/content/products.ts). The catalog ` +
        `enforces the perpetual ban on ITC-GEO and FDA-enforcement-priority ` +
        `compounds (see lib/content/products.ts comment header for the ` +
        `complete posture).`,
    );
  }
}

/**
 * QR-code placeholder. Hand-rolled SVG — three corner-marker squares
 * (the position-finder pattern of a real QR) + a sparse dot field.
 */
function QrPlaceholder({ x, y, size }: { x: number; y: number; size: number }) {
  const dot = size / 7;
  return (
    <g data-vial-qr transform={`translate(${x} ${y})`} aria-hidden="true">
      <rect width={size} height={size} fill="#ffffff" />
      {[
        { tx: 0, ty: 0 },
        { tx: size - dot * 3, ty: 0 },
        { tx: 0, ty: size - dot * 3 },
      ].map((corner, i) => (
        <g key={i} transform={`translate(${corner.tx} ${corner.ty})`}>
          <rect width={dot * 3} height={dot * 3} fill="#0a0e0f" />
          <rect
            x={dot * 0.5}
            y={dot * 0.5}
            width={dot * 2}
            height={dot * 2}
            fill="#ffffff"
          />
          <rect x={dot} y={dot} width={dot} height={dot} fill="#0a0e0f" />
        </g>
      ))}
      {[
        [3, 4], [5, 3], [4, 5], [3, 6], [4, 4], [5, 5],
      ].map(([gx, gy], i) => (
        <rect
          key={`d${i}`}
          x={gx * dot}
          y={gy * dot}
          width={dot}
          height={dot}
          fill="#0a0e0f"
        />
      ))}
    </g>
  );
}

export function Vial({
  size = 'md',
  sway = false,
  spin = false,
  bob = false,
  interactive = false,
  withLabel = false,
  compound,
  dose,
  batch = '2026-01',
  className,
  ref,
  style,
  onClick,
  ...rest
}: VialProps) {
  const [clickRotation, setClickRotation] = useState(0);

  if (withLabel && compound) {
    assertCompoundAllowed(compound);
  }

  const handleClick = useCallback(
    (e: React.MouseEvent<HTMLDivElement>) => {
      if (interactive) {
        setClickRotation((r) => r + 360);
      }
      onClick?.(e);
    },
    [interactive, onClick],
  );

  // Continuous animation classes; ordered so the most-specific wins. A vial
  // can only have one continuous animation at a time (sway > spin > bob),
  // because they're mutually-exclusive transforms applied to the same
  // element.
  const animationClass = sway
    ? 'motion-safe:[animation:vial-sway_6.4s_ease-in-out_infinite]'
    : spin
      ? 'motion-safe:[animation:vial-spin_18s_linear_infinite]'
      : bob
        ? 'motion-safe:[animation:vial-bob_5.2s_ease-in-out_infinite]'
        : '';

  const interactiveClass = interactive
    ? 'cursor-pointer transition-transform duration-[var(--dur-medium)] ease-[var(--ease-premium-out)] hover:scale-[1.05] motion-safe:will-change-transform'
    : '';

  // When the user clicks, apply a one-shot 360° rotation via inline transform
  // that overrides the continuous animation for that gesture.
  const clickStyle = interactive && clickRotation > 0
    ? { transform: `rotate(${clickRotation}deg)` }
    : undefined;

  return (
    <div
      ref={ref}
      onClick={handleClick}
      className={cn(
        'inline-block origin-bottom',
        'drop-shadow-[var(--shadow-md)]',
        sizeClasses[size],
        animationClass,
        interactiveClass,
        className,
      )}
      style={{ ...style, ...clickStyle }}
      {...rest}
    >
      <svg
        viewBox="0 0 28 60"
        xmlns="http://www.w3.org/2000/svg"
        className="w-full h-full"
        focusable="false"
      >
        <defs>
          {/* Metallic cap gradient — vertical, light-mid-grey to dark */}
          <linearGradient id="vc-cap" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0" stopColor="#6a7075" />
            <stop offset="0.4" stopColor="#9aa0a5" />
            <stop offset="0.7" stopColor="#5a6065" />
            <stop offset="1" stopColor="#2a2f33" />
          </linearGradient>

          {/* Cap crimp ring (darker band under cap) */}
          <linearGradient id="vc-crimp" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0" stopColor="#3a4045" />
            <stop offset="0.5" stopColor="#1a1f23" />
            <stop offset="1" stopColor="#3a4045" />
          </linearGradient>

          {/* Glass body — very subtle teal tint */}
          <linearGradient id="vc-glass" x1="0" y1="0" x2="1" y2="0">
            <stop offset="0" stopColor="rgba(61,212,200,0.16)" />
            <stop offset="0.5" stopColor="rgba(61,212,200,0.06)" />
            <stop offset="1" stopColor="rgba(61,212,200,0.12)" />
          </linearGradient>

          {/* Cream lyophilized powder fill */}
          <linearGradient id="vc-powder" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0" stopColor="#f4ecd8" />
            <stop offset="1" stopColor="#d9cfb3" />
          </linearGradient>
        </defs>

        {/* Cap (silvery, slightly wider than body — pharmaceutical crimp) */}
        <rect x="6" y="2" width="16" height="6" rx="0.8" fill="url(#vc-cap)" />
        {/* Cap top highlight */}
        <rect x="7" y="2.5" width="14" height="1.4" rx="0.4" fill="rgba(255,255,255,0.32)" />

        {/* Crimp ring (darker band where cap meets glass) */}
        <rect x="6" y="7.4" width="16" height="2" rx="0.4" fill="url(#vc-crimp)" />

        {/* Glass body (narrower than cap, clear with subtle teal tint) */}
        <rect
          x="8"
          y="9"
          width="12"
          height="46"
          rx="0.8"
          fill="url(#vc-glass)"
          stroke="#2a3a40"
          strokeWidth="0.6"
        />

        {/* Cream powder fill — bottom 35% of body, OR thin band at bottom
            when label is shown so the label dominates visually */}
        <rect
          x="8.6"
          y={withLabel ? 49 : 38}
          width="10.8"
          height={withLabel ? 5.5 : 16.5}
          fill="url(#vc-powder)"
        />

        {/* Glass left edge highlight */}
        <rect
          x="8.5"
          y="10"
          width="0.8"
          height="44"
          rx="0.4"
          fill="rgba(255,255,255,0.22)"
        />

        {/* Glass right edge subtle shadow */}
        <rect
          x="18.7"
          y="10"
          width="0.6"
          height="44"
          rx="0.3"
          fill="rgba(0,0,0,0.18)"
        />

        {/* Bottom curve / shadow */}
        <rect
          x="8"
          y="54"
          width="12"
          height="1.4"
          rx="0.7"
          fill="rgba(0,0,0,0.32)"
        />

        {/* WRAP LABEL OVERLAY — Appendix AD §1 + §2 */}
        {withLabel && compound && dose ? (
          <g data-vial-label>
            {/* Label background (charcoal) with teal border on all sides */}
            <rect
              x="8.4"
              y="11.5"
              width="11.2"
              height="36"
              fill="var(--label-bg, #0a0e0f)"
              stroke="var(--accent, #3dd4c8)"
              strokeWidth="0.18"
              rx="0.4"
            />

            {/* VIALCHEMLABS wordmark with accent dot — top-left */}
            <circle
              cx="9.4"
              cy="13.4"
              r="0.45"
              fill="var(--accent, #3dd4c8)"
            />
            <text
              x="10.2"
              y="13.85"
              fill="var(--text, rgba(255,255,255,0.92))"
              fontFamily="var(--font-mono), monospace"
              fontSize="1.1"
              fontWeight="600"
              letterSpacing="0.06"
            >
              VIALCHEMLABS
            </text>

            {/* Compound name — large, centered */}
            <text
              x="14"
              y="22"
              fill="var(--text, rgba(255,255,255,0.92))"
              fontFamily="var(--font-sans), sans-serif"
              fontSize="2.4"
              fontWeight="600"
              textAnchor="middle"
            >
              {compound}
            </text>

            {/* Dose — slightly smaller, accent color */}
            <text
              x="14"
              y="27"
              fill="var(--accent, #3dd4c8)"
              fontFamily="var(--font-mono), monospace"
              fontSize="2.2"
              fontWeight="500"
              textAnchor="middle"
            >
              {dose.toUpperCase()}
            </text>

            {/* RUO disclaimer block — verbatim per Iron Law 2.4 */}
            <text
              x="14"
              y="33"
              fill="var(--text-muted, rgba(255,255,255,0.62))"
              fontFamily="var(--font-mono), monospace"
              fontSize="0.95"
              fontWeight="400"
              textAnchor="middle"
              letterSpacing="0.04"
            >
              RESEARCH USE ONLY
            </text>
            <text
              x="14"
              y="35.4"
              fill="var(--text-muted, rgba(255,255,255,0.62))"
              fontFamily="var(--font-mono), monospace"
              fontSize="0.95"
              fontWeight="400"
              textAnchor="middle"
              letterSpacing="0.04"
            >
              NOT FOR HUMAN CONSUMPTION
            </text>

            {/* QR (left) + Batch metadata (right) — bottom band */}
            <QrPlaceholder x={9.2} y={38.5} size={5.2} />

            <text
              x="15.2"
              y="40"
              fill="var(--text-subtle, rgba(255,255,255,0.55))"
              fontFamily="var(--font-mono), monospace"
              fontSize="0.85"
            >
              BATCH
            </text>
            <text
              x="15.2"
              y="41.6"
              fill="var(--text, rgba(255,255,255,0.92))"
              fontFamily="var(--font-mono), monospace"
              fontSize="1.2"
              fontWeight="500"
            >
              {batch}
            </text>
            <text
              x="15.2"
              y="43.4"
              fill="var(--text-subtle, rgba(255,255,255,0.55))"
              fontFamily="var(--font-mono), monospace"
              fontSize="0.85"
            >
              MFG 2026-01
            </text>
            <text
              x="15.2"
              y="45"
              fill="var(--text-subtle, rgba(255,255,255,0.55))"
              fontFamily="var(--font-mono), monospace"
              fontSize="0.85"
            >
              EXP 2028-01
            </text>
          </g>
        ) : null}
      </svg>
    </div>
  );
}
