// site/components/ui/Vial.tsx
import { cn } from '@/lib/utils';

type VialProps = {
  name: string;
  amount: string;
  cas: string;
  mw?: string;
  batch?: string;
  purity?: string;
  glowColor?: 'accent' | 'electric' | 'mixed';
  className?: string;
  animationPaused?: boolean;
};

const glowMap = {
  accent: 'rgba(124,255,0,0.36)',
  electric: 'rgba(34,211,238,0.32)',
  mixed: 'rgba(124,255,0,0.32)',
} as const;

export function Vial({
  name,
  amount,
  cas,
  mw,
  batch,
  purity,
  glowColor = 'accent',
  className,
  animationPaused,
}: VialProps) {
  const playState = animationPaused ? 'paused' : 'running';
  return (
    <div
      role="img"
      aria-label={`${name} ${amount}${cas ? `, CAS ${cas}` : ''}${mw ? `, MW ${mw}` : ''}${batch ? `, batch ${batch}` : ''}${purity ? `, purity ${purity}%` : ''}`}
      className={cn('relative', className)}
    >
      <div
        data-vial-scene
        aria-hidden="true"
        className="relative aspect-[1/2.7] mx-auto w-full"
        style={{ perspective: '1200px' }}
      >
        <div
          className="absolute inset-[24%_18%_18%_18%] -z-10"
          style={{
            background: `radial-gradient(circle, ${glowMap[glowColor]}, transparent 60%)`,
            filter: 'blur(36px)',
          }}
        />

        <div className="vial-float absolute inset-0">
          <div
            className="vial-rotate absolute inset-0"
            style={{ animationPlayState: playState, transformStyle: 'preserve-3d' }}
          >
            <div
              className="absolute inset-[14%_0_0_0] border border-[var(--border-strong)]"
              style={{
                borderRadius: '22% 22% 14% 14% / 6% 6% 12% 12%',
                background:
                  'linear-gradient(110deg, rgba(255,255,255,0.18) 0%, rgba(255,255,255,0.04) 18%, transparent 38%, rgba(0,0,0,0.4) 100%), linear-gradient(180deg, rgba(255,255,255,0.08), rgba(124,255,0,0.04) 35%, rgba(255,255,255,0.02) 70%), var(--surface)',
                boxShadow:
                  'inset 0 -36px 64px rgba(0,0,0,0.6), inset 8px 0 24px rgba(255,255,255,0.04), inset -8px 0 24px rgba(0,0,0,0.5), 0 30px 64px rgba(0,0,0,0.7), 0 0 32px color-mix(in srgb, var(--accent) 8%, transparent)',
                backfaceVisibility: 'hidden',
              }}
            />
            <div
              className="absolute top-[4%] left-[32%] right-[32%] h-[12%] border border-[var(--border-strong)]"
              style={{
                borderRadius: '6px 6px 4px 4px',
                background:
                  'linear-gradient(180deg, #2e2e2e, #181818 35%, #0d0d0d 70%, #050505)',
                boxShadow: '0 4px 8px rgba(0,0,0,0.5), inset 0 -2px 4px rgba(0,0,0,0.5)',
              }}
            />
            <div
              className="absolute left-[11%] right-[11%] bottom-[8%] h-[42%] overflow-hidden"
              style={{
                borderRadius: '8% 8% 50% 50% / 6% 6% 18% 18%',
                background:
                  'radial-gradient(ellipse 90% 36% at 50% 0%, rgba(255,255,255,0.30), transparent 70%), linear-gradient(180deg, rgba(248,252,238,0.94) 0%, rgba(228,242,210,0.90) 32%, rgba(208,232,180,0.86) 64%, rgba(188,220,160,0.82) 100%)',
                boxShadow:
                  'inset 0 8px 16px rgba(255,255,255,0.22), inset 0 -10px 18px rgba(0,0,0,0.40), inset 6px 0 14px rgba(255,255,255,0.05), inset -6px 0 14px rgba(0,0,0,0.20)',
                filter: 'blur(0.25px)',
              }}
            >
              <div
                aria-hidden
                className="absolute inset-0 pointer-events-none"
                style={{
                  backgroundImage:
                    "url(\"data:image/svg+xml;utf8,<svg xmlns='http://www.w3.org/2000/svg' width='120' height='120'><filter id='n'><feTurbulence type='fractalNoise' baseFrequency='1.4' numOctaves='2' seed='4'/><feColorMatrix values='0 0 0 0 1  0 0 0 0 1  0 0 0 0 0.94  0 0 0 0.55 0'/></filter><rect width='100%' height='100%' filter='url(%23n)'/></svg>\")",
                  mixBlendMode: 'overlay',
                  opacity: 0.55,
                }}
              />
            </div>
            <div
              className="absolute left-[14%] right-[14%] top-[38%] h-[38%] rounded-md border p-2.5 font-mono text-[8.5px] leading-[1.5] tracking-[0.06em] text-[var(--text-muted)] text-left overflow-hidden"
              style={{
                background:
                  'linear-gradient(180deg, rgba(255,255,255,0.04), rgba(0,0,0,0.45)), var(--surface-data)',
                borderColor: 'color-mix(in srgb, var(--accent) 14%, var(--border))',
                backfaceVisibility: 'hidden',
              }}
            >
              <span className="block text-[var(--text)] font-semibold text-[11px] tracking-[0.1em] mb-1">
                {name}
              </span>
              {amount} lyophilized
              <span className="block h-px bg-[var(--border)] my-1.5" />
              CAS&nbsp;<span className="text-[var(--accent)]">{cas}</span>
              {mw ? <><br />MW&nbsp;{mw}</> : null}
              {batch ? (
                <>
                  <br />BATCH&nbsp;<span className="text-[var(--electric)]">{batch}</span>
                </>
              ) : null}
              {purity ? <><br />PURITY&nbsp;{purity}%</> : null}
              <br />
              <span className="text-[var(--accent)]">●</span>&nbsp;COA&nbsp;VERIFIED
            </div>
            <div
              className="absolute inset-[14%_0_0_0] overflow-hidden pointer-events-none"
              style={{ borderRadius: '22% 22% 14% 14% / 6% 6% 12% 12%' }}
            >
              <div className="vial-sheen absolute -top-[10%] -left-[40%] w-[36%] h-[120%] -rotate-[15deg] blur-md"
                   style={{
                     background:
                       'linear-gradient(90deg, transparent, rgba(255,255,255,0.32), transparent)',
                   }}
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
