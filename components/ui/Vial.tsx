/**
 * Vial — clean clinical SVG vial graphic.
 *
 * Posture A signature element. NOT meme-coded:
 *   - Vertical metallic cap (gradient grey)
 *   - Glass body (subtle teal-tinted strokes)
 *   - Cream-colored lyophilized powder fill (NOT saturated green liquid)
 *   - Optional sway animation referencing @keyframes vial-sway in globals.css
 *
 * Decorative by default. Pass `aria-hidden` when paired with a text label
 * (e.g., catalog tile already has a name) so screen readers skip the SVG.
 */
import type { HTMLAttributes, Ref } from 'react';
import { cn } from '@/lib/utils';

export type VialSize = 'sm' | 'md' | 'lg';

export interface VialProps extends HTMLAttributes<HTMLDivElement> {
  size?: VialSize;
  sway?: boolean;
  ref?: Ref<HTMLDivElement>;
}

const sizeClasses: Record<VialSize, string> = {
  sm: 'w-8 h-12',
  md: 'w-12 h-20',
  lg: 'w-16 h-28',
};

export function Vial({
  size = 'md',
  sway = false,
  className,
  ref,
  style,
  ...rest
}: VialProps) {
  return (
    <div
      ref={ref}
      className={cn(
        'inline-block',
        'origin-top',
        sizeClasses[size],
        sway ? '[animation:vial-sway_6.4s_ease-in-out_infinite]' : '',
        className,
      )}
      style={style}
      {...rest}
    >
      <svg
        viewBox="0 0 32 80"
        xmlns="http://www.w3.org/2000/svg"
        className="w-full h-full"
        focusable="false"
      >
        <defs>
          {/* Metallic cap gradient (vertical, mid-grey to dark) */}
          <linearGradient id="vc-cap" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0" stopColor="#3a4045" />
            <stop offset="0.5" stopColor="#5a6065" />
            <stop offset="1" stopColor="#2a2f33" />
          </linearGradient>

          {/* Glass body — very subtle teal tint */}
          <linearGradient id="vc-glass" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0" stopColor="rgba(61,212,200,0.10)" />
            <stop offset="1" stopColor="rgba(61,212,200,0.04)" />
          </linearGradient>

          {/* Cream lyophilized powder fill */}
          <linearGradient id="vc-powder" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0" stopColor="#f4ecd8" />
            <stop offset="1" stopColor="#d9cfb3" />
          </linearGradient>
        </defs>

        {/* Cap (top metallic crimp) */}
        <rect x="9" y="2" width="14" height="8" rx="1" fill="url(#vc-cap)" />
        {/* Cap shoulder (slight overhang) */}
        <rect x="8" y="9" width="16" height="3" rx="0.5" fill="#1f2428" />

        {/* Glass body */}
        <rect
          x="7"
          y="12"
          width="18"
          height="60"
          rx="2"
          fill="url(#vc-glass)"
          stroke="#2a3a40"
          strokeWidth="1"
        />

        {/* Cream powder (fills lower 35%) */}
        <rect x="8" y="50" width="16" height="22" rx="1" fill="url(#vc-powder)" />

        {/* Subtle highlight on left edge of glass */}
        <rect
          x="9"
          y="14"
          width="1.2"
          height="56"
          rx="0.6"
          fill="rgba(255,255,255,0.18)"
        />

        {/* Bottom curve (rounded base shadow) */}
        <rect
          x="7"
          y="70"
          width="18"
          height="3"
          rx="2"
          fill="rgba(0,0,0,0.30)"
        />
      </svg>
    </div>
  );
}
