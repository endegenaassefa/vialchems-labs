import { render, screen } from '@testing-library/react';
import { describe, it, expect } from 'vitest';
import { ProcessFlow } from '@/components/ui/ProcessFlow';

describe('ProcessFlow', () => {
  const steps = [
    { n: 1, title: 'Sample', description: 'Per-batch sample drawn.' },
    { n: 2, title: 'Test', description: 'HPLC + USP + LAL.' },
    { n: 3, title: 'Publish', description: 'COA on /coa.' },
  ];

  it('renders all steps with titles and descriptions', () => {
    render(<ProcessFlow steps={steps} />);
    expect(screen.getByText('Sample')).toBeInTheDocument();
    expect(screen.getByText('Per-batch sample drawn.')).toBeInTheDocument();
    expect(screen.getByText('Test')).toBeInTheDocument();
    expect(screen.getByText('Publish')).toBeInTheDocument();
  });

  it('zero-pads numeric step numbers (01, 02, 03)', () => {
    render(<ProcessFlow steps={steps} />);
    expect(screen.getByText('01')).toBeInTheDocument();
    expect(screen.getByText('02')).toBeInTheDocument();
    expect(screen.getByText('03')).toBeInTheDocument();
  });

  it('preserves string step numbers verbatim', () => {
    render(
      <ProcessFlow
        steps={[{ n: 'A', title: 'Step', description: 'desc' }]}
      />,
    );
    expect(screen.getByText('A')).toBeInTheDocument();
  });

  it('renders eyebrow + headline when provided', () => {
    render(
      <ProcessFlow
        eyebrow="Pipeline"
        headline="What happens next"
        steps={steps}
      />,
    );
    expect(screen.getByText('Pipeline')).toBeInTheDocument();
    expect(screen.getByText('What happens next')).toBeInTheDocument();
  });

  it('renders an ordered list with one li per step', () => {
    const { container } = render(<ProcessFlow steps={steps} />);
    const items = container.querySelectorAll('li');
    expect(items.length).toBe(3);
  });
});
