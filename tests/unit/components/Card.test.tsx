import { describe, expect, it } from 'vitest';
import { render, screen } from '@testing-library/react';
import { Card } from '@/components/ui/Card';

describe('Card', () => {
  it('renders children', () => {
    render(
      <Card>
        <span data-testid="inner">contents</span>
      </Card>,
    );
    expect(screen.getByTestId('inner')).toBeInTheDocument();
  });

  it('defaults to <div>', () => {
    render(<Card data-testid="card">x</Card>);
    expect(screen.getByTestId('card').tagName).toBe('DIV');
  });

  it('renders <article> when as="article"', () => {
    render(
      <Card as="article" data-testid="card">
        x
      </Card>,
    );
    expect(screen.getByTestId('card').tagName).toBe('ARTICLE');
  });

  it('renders <section> when as="section"', () => {
    render(
      <Card as="section" data-testid="card">
        x
      </Card>,
    );
    expect(screen.getByTestId('card').tagName).toBe('SECTION');
  });

  it('applies surface bg, border, and 14px radius by default', () => {
    render(<Card data-testid="card">x</Card>);
    const el = screen.getByTestId('card');
    expect(el.className).toMatch(/bg-\[var\(--surface\)\]/);
    expect(el.className).toMatch(/border/);
    expect(el.className).toMatch(/rounded-\[14px\]/);
  });

  it('default variant does NOT include hover lift', () => {
    render(<Card data-testid="card">x</Card>);
    const el = screen.getByTestId('card');
    expect(el.className).not.toMatch(/hover:-translate-y/);
  });

  it('interactive variant adds hover accent border + lift', () => {
    render(
      <Card variant="interactive" data-testid="card">
        x
      </Card>,
    );
    const el = screen.getByTestId('card');
    expect(el.className).toMatch(/hover:border-\[var\(--accent\)\]/);
    expect(el.className).toMatch(/hover:-translate-y/);
  });

  it('forwards arbitrary className', () => {
    render(
      <Card className="custom-card" data-testid="card">
        x
      </Card>,
    );
    expect(screen.getByTestId('card').className).toMatch(/custom-card/);
  });

  it('forwards ref to underlying element', () => {
    const ref = { current: null as HTMLDivElement | null };
    render(
      <Card ref={ref} data-testid="card">
        x
      </Card>,
    );
    expect(ref.current).toBeInstanceOf(HTMLElement);
  });
});
