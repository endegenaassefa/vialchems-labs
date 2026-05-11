import { describe, expect, it } from 'vitest';
import { render, screen } from '@testing-library/react';
import { Skeleton } from '@/components/ui/Skeleton';

describe('Skeleton', () => {
  it('default variant="text" renders an inline-block placeholder', () => {
    render(<Skeleton data-testid="sk" />);
    const el = screen.getByTestId('sk');
    expect(el.className).toMatch(/inline-block|block/);
  });

  it('variant="card" renders a block-level surface placeholder', () => {
    render(<Skeleton variant="card" data-testid="sk" />);
    const el = screen.getByTestId('sk');
    expect(el.className).toMatch(/block/);
    // Card-skeletons reserve significant vertical space
    expect(el.className).toMatch(/h-\d+/);
  });

  it('variant="tableRow" renders a horizontal placeholder', () => {
    render(<Skeleton variant="tableRow" data-testid="sk" />);
    const el = screen.getByTestId('sk');
    expect(el.className).toMatch(/h-/);
    expect(el.className).toMatch(/w-full/);
  });

  it('variant="image" renders an aspect-ratio placeholder', () => {
    render(<Skeleton variant="image" data-testid="sk" />);
    const el = screen.getByTestId('sk');
    expect(el.className).toMatch(/aspect-/);
  });

  it('a11y: role="status" + aria-busy="true" + aria-label', () => {
    render(<Skeleton data-testid="sk" />);
    const el = screen.getByRole('status');
    expect(el.getAttribute('aria-busy')).toBe('true');
    expect(el.getAttribute('aria-label')).toBe('Loading');
  });

  it('uses --surface-strong (or stronger surface token) for placeholder fill', () => {
    render(<Skeleton data-testid="sk" />);
    const el = screen.getByTestId('sk');
    expect(el.className).toMatch(/bg-\[var\(--surface-strong\)\]/);
  });
});
