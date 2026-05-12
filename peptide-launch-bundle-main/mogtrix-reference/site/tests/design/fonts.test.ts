import { describe, it, expect } from 'vitest';
import { readFileSync } from 'node:fs';
import { resolve } from 'node:path';

const layoutPath = resolve(__dirname, '../../app/layout.tsx');

describe('Font loading', () => {
  it('layout.tsx source declares Bunny Fonts link tags for the design system stack', () => {
    const layout = readFileSync(layoutPath, 'utf-8');
    expect(layout).toContain('rel="preconnect"');
    expect(layout).toContain('https://fonts.bunny.net');
    expect(layout).toMatch(/ibm-plex-sans:300,400,500,600,700/);
    expect(layout).toMatch(/ibm-plex-mono:300,400,500,600/);
    expect(layout).toMatch(/newsreader:400,400i/);
    expect(layout).toContain('display=swap');
  });
});
