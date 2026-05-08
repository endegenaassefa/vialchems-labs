import { describe, expect, it } from 'vitest';
import { render, screen } from '@testing-library/react';
import { Input } from '@/components/ui/Input';

describe('Input', () => {
  it('renders an input element', () => {
    render(<Input placeholder="enter email" />);
    expect(screen.getByPlaceholderText('enter email')).toBeInTheDocument();
  });

  it('uses surface-strong bg with 10px radius', () => {
    render(<Input placeholder="x" />);
    const input = screen.getByPlaceholderText('x');
    expect(input.className).toMatch(/bg-\[var\(--surface-strong\)\]/);
    expect(input.className).toMatch(/rounded-\[10px\]/);
  });

  it('passes id through for label association', () => {
    render(<Input id="email" placeholder="x" />);
    expect(screen.getByPlaceholderText('x').id).toBe('email');
  });

  it('does NOT show error state by default', () => {
    render(<Input placeholder="x" />);
    expect(screen.queryByRole('alert')).not.toBeInTheDocument();
    const input = screen.getByPlaceholderText('x');
    expect(input.getAttribute('aria-invalid')).toBe('false');
  });

  it('renders error message with role="alert" when error prop is set', () => {
    render(<Input placeholder="x" error="Required field" />);
    const alert = screen.getByRole('alert');
    expect(alert).toBeInTheDocument();
    expect(alert.textContent).toBe('Required field');
  });

  it('toggles aria-invalid=true when error is present', () => {
    render(<Input placeholder="x" error="bad input" />);
    expect(screen.getByPlaceholderText('x').getAttribute('aria-invalid')).toBe(
      'true',
    );
  });

  it('associates input with error message via aria-describedby', () => {
    render(<Input id="email" placeholder="x" error="Required" />);
    const input = screen.getByPlaceholderText('x');
    const describedBy = input.getAttribute('aria-describedby');
    expect(describedBy).toBeTruthy();
    const errorEl = document.getElementById(describedBy as string);
    expect(errorEl?.textContent).toBe('Required');
  });

  it('forwards arbitrary native props (type, name, value, onChange)', () => {
    render(
      <Input
        type="email"
        name="email"
        defaultValue="a@b.co"
        placeholder="x"
      />,
    );
    const input = screen.getByPlaceholderText('x') as HTMLInputElement;
    expect(input.type).toBe('email');
    expect(input.name).toBe('email');
    expect(input.value).toBe('a@b.co');
  });

  it('forwards ref', () => {
    const ref = { current: null as HTMLInputElement | null };
    render(<Input ref={ref} placeholder="x" />);
    expect(ref.current).toBeInstanceOf(HTMLInputElement);
  });

  it('merges external className', () => {
    render(<Input className="custom-input" placeholder="x" />);
    expect(screen.getByPlaceholderText('x').className).toMatch(
      /custom-input/,
    );
  });
});
