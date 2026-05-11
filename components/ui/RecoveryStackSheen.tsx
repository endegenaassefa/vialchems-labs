'use client';

import { useEffect, useState } from 'react';
import { useReducedMotion } from 'motion/react';

/**
 * Phase 7 (v4) — sheen sweep on Recovery Stack CTA.
 *
 * Renders a subtle teal-tinted gradient that sweeps left → right across the
 * parent container exactly once per session. Per Iron Law 2.18, the sheen
 * is hard-disabled when prefers-reduced-motion: reduce.
 *
 * Anchor: place inside a `position: relative` container; this overlay is
 * absolutely positioned and pointer-events:none so it never interferes with
 * the underlying CTA click target.
 *
 * Session flag: `vc-recovery-sheen-played`. The component sets it on mount
 * and reads it from sessionStorage; on subsequent visits the sheen renders
 * nothing.
 */

const SESSION_KEY = 'vc-recovery-sheen-played';
const DURATION_MS = 1400;

export function RecoveryStackSheen() {
  const reduced = useReducedMotion();
  const [render, setRender] = useState(false);

  useEffect(() => {
    if (reduced) return;
    if (typeof window === 'undefined') return;
    try {
      if (sessionStorage.getItem(SESSION_KEY) === '1') return;
      sessionStorage.setItem(SESSION_KEY, '1');
    } catch {
      // sessionStorage may throw in private mode; degrade silently
      return;
    }
    // Client-only: the sheen is gated by sessionStorage which is unavailable
    // during SSR, so the render → effect → setState cycle is the correct
    // shape here.
    /* eslint-disable react-hooks/set-state-in-effect */
    setRender(true);
    const id = window.setTimeout(() => {
      setRender(false);
    }, DURATION_MS);
    /* eslint-enable react-hooks/set-state-in-effect */
    return () => window.clearTimeout(id);
  }, [reduced]);

  if (!render) return null;

  return (
    <span
      data-recovery-sheen=""
      aria-hidden="true"
      className="pointer-events-none absolute inset-0 overflow-hidden rounded-[inherit]"
    >
      <span
        className="absolute top-0 left-0 h-full w-[40%] [animation:recovery-sheen_1400ms_var(--ease-premium-out)_both]"
        style={{
          background:
            'linear-gradient(115deg, transparent 0%, rgba(125,241,232,0) 30%, rgba(125,241,232,0.18) 50%, rgba(125,241,232,0) 70%, transparent 100%)',
        }}
      />
    </span>
  );
}
