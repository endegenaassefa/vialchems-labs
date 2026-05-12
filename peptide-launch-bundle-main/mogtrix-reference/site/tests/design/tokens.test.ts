import { describe, it, expect } from 'vitest';
import { tokens } from '@/lib/design/tokens';

describe('design tokens', () => {
  it('exports color tokens with hex values', () => {
    expect(tokens.color.background).toBe('#020202');
    expect(tokens.color.scaffold).toBe('#050505');
    expect(tokens.color.surface).toBe('#111111');
    expect(tokens.color.surfaceStrong).toBe('#171717');
    expect(tokens.color.surfaceData).toBe('#0a1f24');
    expect(tokens.color.border).toBe('#1f1f1f');
    expect(tokens.color.borderStrong).toBe('#2a2a2a');
    expect(tokens.color.accent).toBe('#7cff00');
    expect(tokens.color.accentSoft).toBe('#b4ff2e');
    expect(tokens.color.acidGlow).toBe('#bfef8f');
    expect(tokens.color.electric).toBe('#22d3ee');
    expect(tokens.color.electricSoft).toBe('#67e8f9');
    expect(tokens.color.mutedBlue).toBe('#7c93a8');
    expect(tokens.color.amber).toBe('#ffb04f');
    expect(tokens.color.error).toBe('#ff4d6d');
  });

  it('exports text alpha tokens', () => {
    expect(tokens.color.text).toMatch(/^rgba\(255,\s*255,\s*255,\s*0\.92\)$/);
    expect(tokens.color.textMuted).toMatch(/^rgba\(255,\s*255,\s*255,\s*0\.62\)$/);
    expect(tokens.color.textSubtle).toMatch(/^rgba\(255,\s*255,\s*255,\s*0\.36\)$/);
  });

  it('exports CSS variable names that match globals.css', () => {
    expect(tokens.cssVar.accent).toBe('var(--accent)');
    expect(tokens.cssVar.electric).toBe('var(--electric)');
    expect(tokens.cssVar.surfaceData).toBe('var(--surface-data)');
    expect(tokens.cssVar.textSubtle).toBe('var(--text-subtle)');
  });

  it('exports the 11-step spacing scale', () => {
    expect(tokens.space).toEqual({
      px: '1px',
      '2xs': '2px', xs: '4px', sm: '8px', md: '12px', lg: '16px', xl: '24px',
      '2xl': '32px', '3xl': '48px', '4xl': '64px', '5xl': '96px', '6xl': '128px',
    });
  });

  it('exports type scale roles', () => {
    expect(tokens.type.displayHeroXl.size).toBe('88px');
    expect(tokens.type.bodyMd.size).toBe('16px');
    expect(tokens.type.monoBody.size).toBe('14px');
    expect(tokens.type.label.letterSpacing).toBe('0.16em');
  });
});
