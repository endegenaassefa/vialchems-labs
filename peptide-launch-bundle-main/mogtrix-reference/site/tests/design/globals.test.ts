import { describe, it, expect } from 'vitest';
import { readFileSync } from 'node:fs';
import { resolve } from 'node:path';

const css = readFileSync(resolve(__dirname, '../../app/globals.css'), 'utf-8');

describe('globals.css design tokens', () => {
  it('declares all required CSS variables', () => {
    const required = [
      '--background', '--scaffold', '--surface', '--surface-strong',
      '--surface-data',
      '--border', '--border-strong',
      '--accent', '--accent-soft', '--acid-glow',
      '--electric', '--electric-soft',
      '--muted-blue', '--amber', '--error',
      '--text', '--text-muted', '--text-subtle'
    ];
    for (const v of required) expect(css).toContain(v);
  });

  it('uses electrolyte cyan rgba in body background gradient (not Anthropic amber)', () => {
    expect(css).toMatch(/rgba\(34,\s*211,\s*238/);
    expect(css).not.toMatch(/rgba\(255,\s*176,\s*79/);
  });

  it('declares motion keyframes for the design system', () => {
    expect(css).toMatch(/@keyframes vial-float/);
    expect(css).toMatch(/@keyframes vial-tilt/);
    expect(css).toMatch(/@keyframes vial-sheen/);
    expect(css).toMatch(/@keyframes vial-rotate/);
    expect(css).toMatch(/@keyframes pulse/);
  });

  it('honors prefers-reduced-motion with hard fallback', () => {
    expect(css).toMatch(/@media\s*\(prefers-reduced-motion:\s*reduce\)/);
  });

  it('uses IBM Plex Sans as primary body font', () => {
    expect(css).toMatch(/font-family:\s*['"]IBM Plex Sans['"]/);
  });
});
