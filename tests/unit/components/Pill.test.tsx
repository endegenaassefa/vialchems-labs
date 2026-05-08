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
});
