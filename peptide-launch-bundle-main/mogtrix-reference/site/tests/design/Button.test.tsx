import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import { Button, ButtonLink } from '@/components/ui/Button';

describe('Button primitive', () => {
  it('renders primary variant by default with accent background class', () => {
    render(<Button>Add to order</Button>);
    const btn = screen.getByRole('button', { name: 'Add to order' });
    expect(btn.className).toContain('bg-[var(--accent)]');
    expect(btn.className).toContain('text-black');
    expect(btn.className).toMatch(/min-h-11/);
  });

  it('renders outline variant', () => {
    render(<Button variant="outline">Verify</Button>);
    expect(screen.getByRole('button').className).toContain('border-[var(--border-strong)]');
  });

  it('renders ghost variant', () => {
    render(<Button variant="ghost">Docs</Button>);
    expect(screen.getByRole('button').className).toContain('text-[var(--text-muted)]');
  });

  it('renders data variant with mono font', () => {
    render(<Button variant="data">$ verify --batch L0237</Button>);
    expect(screen.getByRole('button').className).toContain('font-mono');
    expect(screen.getByRole('button').className).toContain('bg-[var(--surface-data)]');
  });

  it('forwards type and onClick', () => {
    const onClick = () => {};
    render(<Button type="submit" onClick={onClick}>Submit</Button>);
    expect(screen.getByRole('button')).toHaveAttribute('type', 'submit');
  });

  it('ButtonLink renders an anchor with href', () => {
    render(<ButtonLink href="/shop">Shop</ButtonLink>);
    const link = screen.getByRole('link', { name: 'Shop' });
    expect(link).toHaveAttribute('href', '/shop');
    expect(link.className).toContain('bg-[var(--accent)]');
  });
});
