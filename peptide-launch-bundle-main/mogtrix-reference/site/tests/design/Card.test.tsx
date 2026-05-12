import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import { Card } from '@/components/ui/Card';

describe('Card primitive', () => {
  it('renders surface variant by default', () => {
    render(<Card data-testid="c">x</Card>);
    expect(screen.getByTestId('c').className).toContain('bg-[var(--surface)]');
    expect(screen.getByTestId('c').className).toContain('border-[var(--border)]');
    expect(screen.getByTestId('c').className).toContain('rounded-2xl');
  });

  it('renders strong variant', () => {
    render(<Card variant="strong" data-testid="c">x</Card>);
    expect(screen.getByTestId('c').className).toContain('bg-[var(--surface-strong)]');
  });

  it('renders data variant', () => {
    render(<Card variant="data" data-testid="c">x</Card>);
    expect(screen.getByTestId('c').className).toContain('bg-[var(--surface-data)]');
  });
});
