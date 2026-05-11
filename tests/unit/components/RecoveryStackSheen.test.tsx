import { describe, expect, it, vi, beforeEach, afterEach } from 'vitest';
import { render, act } from '@testing-library/react';

let reducedMotionValue: boolean | null = false;
vi.mock('motion/react', async () => {
  const actual =
    await vi.importActual<typeof import('motion/react')>('motion/react');
  return {
    ...actual,
    useReducedMotion: () => reducedMotionValue,
  };
});

import { RecoveryStackSheen } from '@/components/ui/RecoveryStackSheen';

const SESSION_KEY = 'vc-recovery-sheen-played';

/**
 * Phase 7 (v4) — sheen sweep on Recovery Stack CTA. Once-per-session, honors
 * prefers-reduced-motion (Iron Law 2.18). Runs on initial paint and self-
 * removes when the animation finishes.
 */

describe('RecoveryStackSheen', () => {
  beforeEach(() => {
    reducedMotionValue = false;
    sessionStorage.clear();
  });

  afterEach(() => {
    sessionStorage.clear();
  });

  it('renders the sheen overlay on first mount when no session flag', () => {
    const { container } = render(<RecoveryStackSheen />);
    expect(
      container.querySelector('[data-recovery-sheen]'),
    ).toBeInTheDocument();
  });

  it('writes the session flag on mount so subsequent visits skip the animation', () => {
    render(<RecoveryStackSheen />);
    expect(sessionStorage.getItem(SESSION_KEY)).toBe('1');
  });

  it('renders nothing when the session flag is already set', () => {
    sessionStorage.setItem(SESSION_KEY, '1');
    const { container } = render(<RecoveryStackSheen />);
    expect(
      container.querySelector('[data-recovery-sheen]'),
    ).not.toBeInTheDocument();
  });

  it('renders nothing when prefers-reduced-motion is reduce (Iron Law 2.18)', () => {
    reducedMotionValue = true;
    const { container } = render(<RecoveryStackSheen />);
    expect(
      container.querySelector('[data-recovery-sheen]'),
    ).not.toBeInTheDocument();
  });

  it('uses pointer-events-none on the overlay so the underlying CTA stays clickable', () => {
    const { container } = render(<RecoveryStackSheen />);
    const overlay = container.querySelector(
      '[data-recovery-sheen]',
    ) as HTMLElement;
    expect(overlay).not.toBeNull();
    expect(overlay.className).toMatch(/pointer-events-none/);
  });

  it('removes itself after the animation completes', () => {
    vi.useFakeTimers();
    try {
      const { container } = render(<RecoveryStackSheen />);
      expect(
        container.querySelector('[data-recovery-sheen]'),
      ).toBeInTheDocument();
      act(() => {
        // sheen advertised duration is ~1400ms; advance well past
        vi.advanceTimersByTime(2000);
      });
      expect(
        container.querySelector('[data-recovery-sheen]'),
      ).not.toBeInTheDocument();
    } finally {
      vi.useRealTimers();
    }
  });
});
