import { describe, it, expect } from 'vitest';
import { easing, duration, motion } from '@/lib/design/motion';

describe('design motion', () => {
  it('exports premium-out easing matching DESIGN.md spec', () => {
    expect(easing.premiumOut).toBe('cubic-bezier(0.16, 1, 0.3, 1)');
    expect(easing.move).toBe('cubic-bezier(0.4, 0, 0.2, 1)');
    expect(easing.in).toBe('ease-in');
    expect(easing.linear).toBe('linear');
  });

  it('exports the 5-tier duration scale', () => {
    expect(duration.micro).toBe(80);
    expect(duration.short).toBe(200);
    expect(duration.medium).toBe(320);
    expect(duration.long).toBe(540);
    expect(duration.slow).toBe(720);
  });

  it('exports vial rotation duration range', () => {
    expect(duration.vialRotate.min).toBe(14000);
    expect(duration.vialRotate.max).toBe(22000);
  });

  it('exports composed motion presets', () => {
    expect(motion.hoverShort).toBe(`200ms cubic-bezier(0.16, 1, 0.3, 1)`);
    expect(motion.staggerStep).toBe(70);
  });
});
