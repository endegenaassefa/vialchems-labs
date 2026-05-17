"use client";

/**
 * VialShowcase — Vial + control panel.
 *
 * For prominent placements (home hero, PDP hero) where the vial is the
 * visual centerpiece. Renders a large vial with a small below-vial control
 * bar: animation mode (Sway / Spin / Bob / Pause), interactive toggle,
 * manual-rotate slider.
 *
 * Pure client island. Honors prefers-reduced-motion via the global @media
 * kill switch in app/globals.css; the controls themselves remain present
 * but the animations don't run.
 */

import { useState } from "react";
import { Vial, type VialSize } from "@/components/ui/Vial";
import { cn } from "@/lib/utils";

type Mode = "sway" | "spin" | "bob" | "pause";

export interface VialShowcaseProps {
  size?: VialSize;
  withLabel?: boolean;
  compound?: string;
  dose?: string;
  batch?: string;
  /** Initial animation mode. Default 'sway'. */
  defaultMode?: Mode;
  /** Initial interactive state (hover scale + click rotate). Default true. */
  defaultInteractive?: boolean;
  className?: string;
}

const MODES: { id: Mode; label: string }[] = [
  { id: "sway", label: "Sway" },
  { id: "spin", label: "Spin" },
  { id: "bob", label: "Bob" },
  { id: "pause", label: "Pause" },
];

export function VialShowcase({
  size = "2xl",
  withLabel = true,
  compound = "BPC-157",
  dose = "10mg",
  batch = "2026-05",
  defaultMode = "sway",
  defaultInteractive = true,
  className,
}: VialShowcaseProps) {
  const [mode, setMode] = useState<Mode>(defaultMode);
  const [interactive, setInteractive] = useState(defaultInteractive);
  const [manualRotation, setManualRotation] = useState(0);

  return (
    <div className={cn("flex flex-col items-center gap-8", className)}>
      {/* Vial display area — generous breathing room */}
      <div
        className="flex items-center justify-center min-h-[280px]"
        style={
          manualRotation !== 0
            ? {
                transform: `rotate(${manualRotation}deg)`,
                transition: "transform 200ms cubic-bezier(0.16,1,0.3,1)",
              }
            : undefined
        }
      >
        <Vial
          size={size}
          withLabel={withLabel}
          compound={compound}
          dose={dose}
          batch={batch}
          sway={mode === "sway"}
          spin={mode === "spin"}
          bob={mode === "bob"}
          interactive={interactive}
          aria-label={
            withLabel ? `vialchemlabs.net ${compound} ${dose} vial` : undefined
          }
        />
      </div>

      {/* Control bar */}
      <div className="flex flex-col items-center gap-4 w-full max-w-md">
        {/* Mode toggle row */}
        <div
          role="radiogroup"
          aria-label="Animation mode"
          className="inline-flex items-center gap-px bg-[var(--border)] rounded-[var(--radius-md)] p-px"
        >
          {MODES.map((m) => {
            const isActive = m.id === mode;
            return (
              <button
                key={m.id}
                type="button"
                role="radio"
                aria-checked={isActive}
                onClick={() => setMode(m.id)}
                className={cn(
                  "px-3 h-8 font-mono text-[10px] uppercase tracking-[0.16em] rounded-[calc(var(--radius-md)-1px)] transition-colors duration-[var(--dur-short)]",
                  isActive
                    ? "bg-[var(--surface-elevated)] text-[var(--accent)]"
                    : "bg-[var(--surface)] text-[var(--text-subtle)] hover:text-[var(--text-muted)]",
                )}
              >
                {m.label}
              </button>
            );
          })}
        </div>

        {/* Manual rotation slider */}
        <div className="w-full">
          <label
            htmlFor="vial-rotate"
            className="flex items-center justify-between font-mono text-[10px] uppercase tracking-[0.16em] text-[var(--text-subtle)] mb-2"
          >
            <span>Manual rotate</span>
            <span className="tabular text-[var(--text-muted)]">
              {manualRotation}°
            </span>
          </label>
          <input
            id="vial-rotate"
            type="range"
            min={-180}
            max={180}
            step={1}
            value={manualRotation}
            onChange={(e) => setManualRotation(Number(e.target.value))}
            className="w-full accent-[var(--accent)]"
          />
        </div>

        {/* Interactive toggle */}
        <label className="inline-flex items-center gap-3 cursor-pointer text-[12px] text-[var(--text-muted)]">
          <input
            type="checkbox"
            checked={interactive}
            onChange={(e) => setInteractive(e.target.checked)}
            className="h-4 w-4 accent-[var(--accent)]"
          />
          <span className="font-mono uppercase tracking-[0.12em] text-[10px]">
            Interactive (hover + click)
          </span>
        </label>
      </div>
    </div>
  );
}
