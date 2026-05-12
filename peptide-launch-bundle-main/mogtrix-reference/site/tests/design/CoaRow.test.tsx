import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import { CoaRow } from '@/components/ui/CoaRow';

describe('CoaRow primitive', () => {
  it('renders batch + info + status', () => {
    render(<CoaRow batch="L0237" info="BPC-157 5mg · 99.2%" status="verified" />);
    expect(screen.getByText('L0237')).toBeInTheDocument();
    expect(screen.getByText('BPC-157 5mg · 99.2%')).toBeInTheDocument();
    expect(screen.getByText(/verified/i)).toBeInTheDocument();
  });

  it('verified rows highlight border in accent', () => {
    const { container } = render(<CoaRow batch="L0237" info="x" status="verified" />);
    expect(container.firstChild).toHaveClass(/border-/);
    expect((container.firstChild as HTMLElement).className).toContain('var(--accent)');
  });

  it.each([
    ['archived', 'archived'],
    ['expired', 'expired'],
    ['pending', 'pending'],
  ] as const)('renders %s status text', (status, label) => {
    render(<CoaRow batch="L0231" info="x" status={status} />);
    expect(screen.getByText(new RegExp(label, 'i'))).toBeInTheDocument();
  });
});
