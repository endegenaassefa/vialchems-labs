import { describe, expect, it } from 'vitest';
import { render, screen } from '@testing-library/react';
import { Pill } from '@/components/ui/Pill';

describe('Pill', () => {
  it('renders text content', () => {
    render(<Pill variant="accent">VERIFIED</Pill>);
    expect(screen.getByText('VERIFIED')).toBeInTheDocument();
  });

  it('applies accent variant color', () => {
    render(<Pill variant="accent">VERIFIED</Pill>);
    const pill = screen.getByText('VERIFIED');
    expect(pill.className).toMatch(/--pill-accent/);
  });

  it('applies info variant color', () => {
    render(<Pill variant="info">SHIPS US</Pill>);
    const pill = screen.getByText('SHIPS US');
    expect(pill.className).toMatch(/--pill-info/);
  });

  it('applies electric variant color', () => {
    render(<Pill variant="electric">IN STOCK</Pill>);
    const pill = screen.getByText('IN STOCK');
    expect(pill.className).toMatch(/--pill-electric/);
  });

  it('applies error variant color', () => {
    render(<Pill variant="error">EXPIRED</Pill>);
    const pill = screen.getByText('EXPIRED');
    expect(pill.className).toMatch(/--pill-error/);
  });

  it('always carries an accessible name (text label)', () => {
    // A11y rule: color is never the sole indicator. Text is required content.
    render(<Pill variant="accent">VERIFIED</Pill>);
    const pill = screen.getByText('VERIFIED');
    expect(pill.textContent).toBe('VERIFIED');
  });

  it('respects external aria-label', () => {
    render(
      <Pill variant="accent" aria-label="Independently verified">
        VERIFIED
      </Pill>,
    );
    const pill = screen.getByLabelText('Independently verified');
    expect(pill).toBeInTheDocument();
  });

  it('renders mono uppercase typography', () => {
    render(<Pill variant="accent">VERIFIED</Pill>);
    const pill = screen.getByText('VERIFIED');
    expect(pill.className).toMatch(/font-mono/);
    expect(pill.className).toMatch(/uppercase/);
  });

  // Phase 2 v4 — `kind` prop extends Pill into a Badge surface
  // (per Appendix W.1 visual quality + Phase 4/5 catalog tag usage).
  describe('Phase 2 v4 — kind variants', () => {
    it('default kind="status" preserves existing v3.0 visual (color-mix tinted bg)', () => {
      render(
        <Pill variant="accent" data-testid="pill">
          VERIFIED
        </Pill>,
      );
      const pill = screen.getByTestId('pill');
      expect(pill.className).toMatch(/rounded-full/);
      expect(pill.className).toMatch(/color-mix/);
    });

    it('kind="category" uses surface bg (lower visual weight) for catalog category tags', () => {
      render(
        <Pill variant="accent" kind="category" data-testid="pill">
          Recovery
        </Pill>,
      );
      const pill = screen.getByTestId('pill');
      expect(pill.className).toMatch(/bg-\[var\(--surface\)\]/);
    });

    it('kind="tag" uses --surface-muted bg + --text-muted for inline data tags', () => {
      render(
        <Pill variant="accent" kind="tag" data-testid="pill">
          BPC-157
        </Pill>,
      );
      const pill = screen.getByTestId('pill');
      expect(pill.className).toMatch(/bg-\[var\(--surface-muted\)\]/);
      expect(pill.className).toMatch(/text-\[var\(--text-muted\)\]/);
    });

    it('kind variants preserve text label (Iron Law a11y rule unchanged)', () => {
      render(
        <Pill variant="accent" kind="category">
          Recovery
        </Pill>,
      );
      expect(screen.getByText('Recovery')).toBeInTheDocument();
    });
  });
});
