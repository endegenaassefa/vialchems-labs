import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import { Pill } from '@/components/ui/Pill';

describe('Pill primitive', () => {
  it.each([
    ['accent', 'var(--accent)'],
    ['info', 'var(--muted-blue)'],
    ['electric', 'var(--electric)'],
    ['warn', 'var(--amber)'],
    ['error', 'var(--error)'],
  ] as const)('renders %s variant with the right color token', (variant, token) => {
    render(<Pill variant={variant}>label</Pill>);
    const el = screen.getByText('label');
    expect(el.className).toContain(token);
  });

  it('renders with mono font and uppercase letterforms', () => {
    render(<Pill variant="accent">RUO ONLY</Pill>);
    const el = screen.getByText('RUO ONLY');
    expect(el.className).toContain('font-mono');
    expect(el.className).toMatch(/text-\[11px\]/);
    expect(el.className).toMatch(/tracking-/);
  });
});
