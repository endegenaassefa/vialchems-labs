/**
 * VialProductPhoto — static product-photo style vial.
 *
 * Built to replace the synthetic/rotated 3D vial in PDP hero surfaces with a
 * straight-on black studio composition: matte cap, metallic crimp, glass body,
 * visible lyophilized powder, black label, and floor reflection. The label is
 * original vialchem.labs artwork; no competitor raster asset is used.
 */
import type { CSSProperties, HTMLAttributes } from "react";
import { cn } from "@/lib/utils";
import { bundles, products } from "@/lib/content/products";

export interface VialProductPhotoProps extends HTMLAttributes<HTMLDivElement> {
  compound: string;
  dose: string;
  batch?: string;
  purityLabel?: string;
}

const allowedCompounds: ReadonlySet<string> = new Set([
  ...products.map((p) => p.shortName.toLowerCase()),
  ...bundles.map((b) => b.name.toLowerCase()),
]);

function assertCompoundAllowed(compound: string): void {
  const normalized = compound.trim().toLowerCase();
  if (!allowedCompounds.has(normalized)) {
    throw new Error(
      `Compound "${compound}" is not in the vialchem.labs catalog.`,
    );
  }
}

function MoleculeMark() {
  return (
    <svg
      viewBox="0 0 92 110"
      className="h-full w-full"
      aria-hidden="true"
      focusable="false"
    >
      <g
        fill="none"
        stroke="currentColor"
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth="5"
        opacity="0.88"
      >
        <path d="M35 32 56 20l21 12v25L56 69 35 57Z" />
        <path d="M35 57 18 70v23" />
        <path d="M77 57 92 70" />
        <path d="M56 20V4" />
        <path d="M19 21 35 32" />
        <path d="M56 69v23" />
        <path d="M21 91h23" />
        <path d="M74 86h18" />
        <path d="M8 16h22" />
      </g>
      <g fill="currentColor">
        <circle cx="56" cy="4" r="7" />
        <circle cx="19" cy="21" r="7" />
        <circle cx="18" cy="93" r="8" />
        <circle cx="74" cy="86" r="7" />
        <circle cx="92" cy="70" r="6" />
      </g>
    </svg>
  );
}

export function VialProductPhoto({
  compound,
  dose,
  batch = "2026-01",
  purityLabel = "99%+ PURITY",
  className,
  style,
  ...rest
}: VialProductPhotoProps) {
  assertCompoundAllowed(compound);
  const compactCompound = compound.length > 12;

  return (
    <div
      className={cn(
        "relative isolate flex min-h-[520px] w-full items-center justify-center overflow-hidden bg-[#030303]",
        className,
      )}
      aria-label={`vialchem.labs ${compound} ${dose} batch ${batch} vial product photo`}
      {...rest}
      style={
        {
          "--vial-photo-text-primary": "#f5f5f0",
          "--vial-photo-text-secondary": "#e9e9e3",
          ...style,
        } as CSSProperties
      }
    >
      <div
        aria-hidden="true"
        className="absolute inset-0 bg-[radial-gradient(circle_at_50%_35%,rgba(255,255,255,0.08),transparent_34%),linear-gradient(180deg,#000_0%,#030303_55%,#080808_100%)]"
      />
      <div
        aria-hidden="true"
        className="absolute bottom-[7%] h-[13%] w-[47%] rounded-[50%] bg-[radial-gradient(ellipse_at_center,rgba(255,255,255,0.34)_0%,rgba(255,255,255,0.13)_28%,rgba(255,255,255,0.04)_52%,transparent_75%)] blur-[1px]"
      />
      <div
        aria-hidden="true"
        className="absolute bottom-[8.5%] h-[16%] w-[31%] rounded-[50%] bg-[radial-gradient(ellipse_at_center,rgba(0,0,0,0.9),rgba(0,0,0,0.08)_70%,transparent_76%)]"
      />

      <div className="relative h-[84%] min-h-[360px] max-h-[570px] w-[min(50%,265px)] min-w-[190px] max-w-[265px]">
        {/* Matte black cap */}
        <div className="absolute left-[2%] right-[2%] top-0 h-[13.5%] rounded-[9px_9px_14px_14px] border border-white/10 bg-[linear-gradient(180deg,#222_0%,#050505_38%,#191919_70%,#030303_100%)] shadow-[inset_0_2px_7px_rgba(255,255,255,0.2),inset_0_-8px_16px_rgba(0,0,0,0.92),0_10px_25px_rgba(0,0,0,0.75)]" />
        <div className="absolute left-[9%] right-[9%] top-[3.5%] h-[2.2%] rounded-full bg-white/20 blur-[1px]" />

        {/* Metallic crimp ring */}
        <div className="absolute left-[5%] right-[5%] top-[10.7%] h-[10.2%] rounded-[4px_4px_14px_14px] border border-white/20 bg-[linear-gradient(90deg,#1a1a1a_0%,#d7d7d4_18%,#fff_34%,#6d6d6b_52%,#dadad8_72%,#171717_100%)] shadow-[inset_0_8px_14px_rgba(255,255,255,0.3),inset_0_-11px_16px_rgba(0,0,0,0.62),0_8px_16px_rgba(0,0,0,0.72)]" />

        {/* Neck glass */}
        <div className="absolute left-[24%] right-[24%] top-[18.8%] h-[10.5%] border-x border-white/30 bg-[linear-gradient(90deg,rgba(255,255,255,0.05),rgba(255,255,255,0.88)_35%,rgba(255,255,255,0.22)_58%,rgba(255,255,255,0.05))]" />
        <div className="absolute left-[18%] right-[18%] top-[27.2%] h-[3.2%] rounded-full border border-white/20 bg-[linear-gradient(90deg,rgba(255,255,255,0.08),rgba(255,255,255,0.74),rgba(255,255,255,0.08))]" />

        {/* Main glass body */}
        <div className="absolute bottom-[3%] left-[8%] right-[8%] top-[25.5%] overflow-hidden rounded-[22px_22px_12px_12px] border border-white/28 bg-[linear-gradient(90deg,rgba(255,255,255,0.03)_0%,rgba(255,255,255,0.68)_14%,rgba(255,255,255,0.08)_25%,rgba(255,255,255,0.03)_55%,rgba(255,255,255,0.52)_78%,rgba(255,255,255,0.07)_100%)] shadow-[inset_0_0_0_1px_rgba(255,255,255,0.18),inset_12px_0_24px_rgba(255,255,255,0.10),inset_-12px_0_22px_rgba(0,0,0,0.5),0_18px_36px_rgba(0,0,0,0.88)]">
          <div className="absolute inset-x-[7%] top-[5%] h-[18%] rounded-[45%] bg-[radial-gradient(ellipse_at_center,#f7f5ed_0%,#d8d3c8_42%,rgba(255,255,255,0.35)_65%,transparent_76%)] shadow-[0_5px_9px_rgba(255,255,255,0.26)]" />
          <div className="absolute inset-x-[6%] bottom-[9%] h-[18%] rounded-[40%] bg-[radial-gradient(ellipse_at_center,#f8f5ed_0%,#e2ded2_48%,rgba(255,255,255,0.35)_68%,transparent_78%)]" />
          <div className="absolute left-[8%] top-[3%] h-[92%] w-[10%] rounded-full bg-[linear-gradient(180deg,transparent,rgba(255,255,255,0.66)_18%,rgba(255,255,255,0.24)_70%,transparent)] blur-[1px]" />
          <div className="absolute right-[10%] top-[8%] h-[88%] w-[7%] rounded-full bg-[linear-gradient(180deg,transparent,rgba(255,255,255,0.38)_22%,rgba(255,255,255,0.13)_70%,transparent)] blur-[1px]" />

          {/* Front label */}
          <div className="absolute left-[6%] right-[6%] top-[27%] h-[49%] overflow-hidden rounded-[10px] border border-white/74 bg-[linear-gradient(90deg,#020202_0%,#151515_14%,#070707_50%,#151515_86%,#020202_100%)] px-[7%] py-[5%] text-[var(--vial-photo-text-primary)] shadow-[inset_14px_0_18px_rgba(255,255,255,0.08),inset_-16px_0_20px_rgba(0,0,0,0.72),inset_0_0_0_1px_rgba(255,255,255,0.12),0_0_18px_rgba(0,0,0,0.72)] before:absolute before:inset-x-[5%] before:top-[3%] before:h-[6%] before:rounded-[50%] before:bg-white/12 after:absolute after:inset-x-[4%] after:bottom-[3%] after:h-[7%] after:rounded-[50%] after:bg-black/45">
            <div className="relative z-10 mb-[7%] whitespace-nowrap text-center font-mono text-[clamp(8px,0.86vw,12px)] font-semibold uppercase tracking-[0.18em] text-[var(--vial-photo-text-primary)]">
              VIALCHEMLABS
            </div>
            <div className="relative z-10 grid grid-cols-[0.82fr_1.18fr] items-center gap-[7%]">
              <div className="text-[var(--vial-photo-text-secondary)]">
                <MoleculeMark />
              </div>
              <div className="text-left">
                <p
                  className={cn(
                    "mb-[9%] font-semibold tracking-[0] text-[var(--vial-photo-text-primary)]",
                    compactCompound
                      ? "text-[clamp(10px,1.08vw,15px)] leading-[1.04]"
                      : "whitespace-nowrap text-[clamp(14px,1.48vw,20px)] leading-none",
                  )}
                >
                  {compound}
                </p>
                <p className="whitespace-nowrap font-mono text-[clamp(6px,0.76vw,8px)] font-bold uppercase leading-[1.38] tracking-[0.01em] text-[var(--vial-photo-text-primary)]">
                  {purityLabel}
                </p>
                <p className="whitespace-nowrap font-mono text-[clamp(6px,0.76vw,8px)] font-bold uppercase leading-[1.38] tracking-[0.01em] text-[var(--vial-photo-text-primary)]">
                  Lyophilized powder
                </p>
                <p className="whitespace-nowrap font-mono text-[clamp(6px,0.76vw,8px)] font-bold uppercase leading-[1.38] tracking-[0.01em] text-[var(--vial-photo-text-primary)]">
                  Store at 2-8°C
                </p>
              </div>
            </div>
            <div className="relative z-10 mt-[5%] border-t border-white/45 pt-[3%] text-center font-mono text-[clamp(6px,0.68vw,8px)] font-semibold uppercase tracking-[0.02em] text-[var(--vial-photo-text-primary)]">
              For laboratory research only
            </div>
            <div className="relative z-10 mt-[3%] flex items-center justify-center gap-[7%]">
              <span className="h-px w-[28%] bg-white/72" />
              <span className="whitespace-nowrap font-mono text-[clamp(12px,1.28vw,18px)] font-bold leading-none text-[var(--vial-photo-text-primary)]">
                {dose.toUpperCase()}
              </span>
              <span className="h-px w-[28%] bg-white/72" />
            </div>
          </div>

          <div className="absolute inset-x-[4%] bottom-[1.5%] h-[6%] rounded-[50%] bg-[linear-gradient(180deg,rgba(255,255,255,0.58),rgba(255,255,255,0.06)_40%,rgba(0,0,0,0.68))]" />
        </div>
      </div>
    </div>
  );
}
