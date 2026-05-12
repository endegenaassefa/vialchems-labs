import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import { Specs } from '@/components/ui/Specs';

const rows = [
  { label: 'CAS', value: '137525-51-0' },
  { label: 'MW', value: '1419.56 g/mol' },
  { label: 'Sequence', value: 'GEPPPGKPADDAGLV' },
  { label: 'Purity', value: '99.2% HPLC' },
];

describe('Specs primitive', () => {
  it('renders all rows as dt/dd pairs', () => {
    render(<Specs rows={rows} />);
    rows.forEach((r) => {
      expect(screen.getByText(r.label)).toBeInTheDocument();
      expect(screen.getByText(r.value)).toBeInTheDocument();
    });
  });

  it('uses mono font for both label and value', () => {
    const { container } = render(<Specs rows={rows.slice(0, 1)} />);
    const dt = container.querySelector('dt');
    const dd = container.querySelector('dd');
    expect(dt?.className).toContain('font-mono');
    expect(dd?.className).toContain('font-mono');
  });

  it('uses surface-data background by default', () => {
    const { container } = render(<Specs rows={rows} />);
    const dl = container.querySelector('dl');
    expect(dl?.className).toContain('grid-cols-[auto_1fr]');
  });
});
