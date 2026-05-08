import { describe, expect, it } from 'vitest';
import { render, screen } from '@testing-library/react';
import { Specs } from '@/components/ui/Specs';

const items = [
  { term: 'Sequence', value: '15 aa' },
  { term: 'Mass', value: '1419 Da' },
  { term: 'Purity', value: '99.1%' },
];

describe('Specs', () => {
  it('renders a <dl>', () => {
    render(<Specs items={items} data-testid="specs" />);
    expect(screen.getByTestId('specs').tagName).toBe('DL');
  });

  it('renders all items as <dt>/<dd> pairs', () => {
    render(<Specs items={items} />);
    expect(screen.getByText('Sequence').tagName).toBe('DT');
    expect(screen.getByText('15 aa').tagName).toBe('DD');
    expect(screen.getByText('Mass').tagName).toBe('DT');
    expect(screen.getByText('1419 Da').tagName).toBe('DD');
    expect(screen.getByText('Purity').tagName).toBe('DT');
    expect(screen.getByText('99.1%').tagName).toBe('DD');
  });

  it('renders mono typography on dt and dd', () => {
    render(<Specs items={items} />);
    const dt = screen.getByText('Sequence');
    const dd = screen.getByText('15 aa');
    expect(dt.className).toMatch(/font-mono/);
    expect(dd.className).toMatch(/font-mono/);
  });

  it('applies dotted bottom-border separator class to row wrappers', () => {
    render(<Specs items={items} data-testid="specs" />);
    const dl = screen.getByTestId('specs');
    // Each row carries a border-dotted class so rows are visually separated.
    const dottedEls = dl.querySelectorAll('.border-dotted');
    expect(dottedEls.length).toBeGreaterThan(0);
  });

  it('renders ReactNode values, not just strings', () => {
    render(
      <Specs
        items={[
          { term: 'COA', value: <a href="https://example.com/coa.pdf">View PDF</a> },
        ]}
      />,
    );
    expect(screen.getByRole('link', { name: 'View PDF' })).toBeInTheDocument();
  });

  it('forwards arbitrary className', () => {
    render(<Specs items={items} className="custom-specs" data-testid="specs" />);
    expect(screen.getByTestId('specs').className).toMatch(/custom-specs/);
  });

  it('renders empty <dl> for an empty list', () => {
    render(<Specs items={[]} data-testid="specs" />);
    const dl = screen.getByTestId('specs');
    expect(dl.tagName).toBe('DL');
    expect(dl.children.length).toBe(0);
  });
});
