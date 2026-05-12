import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import { Input, FieldLabel } from '@/components/ui/Input';

describe('Input primitive', () => {
  it('renders with surface-strong background and accent focus ring classes', () => {
    render(<Input placeholder="email" />);
    const input = screen.getByPlaceholderText('email');
    expect(input.className).toContain('bg-[var(--surface-strong)]');
    expect(input.className).toContain('focus:outline-2');
    expect(input.className).toContain('focus:outline-[var(--accent)]');
  });

  it('forwards arbitrary HTML attributes', () => {
    render(<Input data-testid="x" type="email" required />);
    const input = screen.getByTestId('x');
    expect(input).toHaveAttribute('type', 'email');
    expect(input).toBeRequired();
  });

  it('FieldLabel renders mono uppercase text', () => {
    render(<FieldLabel htmlFor="email">Institutional Email</FieldLabel>);
    const label = screen.getByText('Institutional Email');
    expect(label.className).toContain('font-mono');
    expect(label.className).toMatch(/uppercase/);
    expect(label).toHaveAttribute('for', 'email');
  });
});
