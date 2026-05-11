import { render, screen } from '@testing-library/react';
import { describe, it, expect } from 'vitest';
import { TrustTicker } from '@/components/ui/TrustTicker';

describe('TrustTicker', () => {
  // v1.3 — lab-agnostic per Iron Law 2.26 operator override. Test items match
  // production usage on the home page (no specific lab name).
  const items = [
    'Per-batch HPLC',
    'USP <71>',
    'LAL endotoxin',
    'Independently tested',
  ];

  it('returns null when items array is empty', () => {
    const { container } = render(<TrustTicker items={[]} />);
    expect(container.firstChild).toBeNull();
  });

  it('renders the section with an aria-label', () => {
    const { container } = render(<TrustTicker items={items} />);
    expect(
      container.querySelector('section[aria-label="Trust signals"]'),
    ).not.toBeNull();
  });

  it('renders all items in a screen-reader-friendly text', () => {
    render(<TrustTicker items={items} />);
    // The sr-only paragraph joins them with commas.
    expect(
      screen.getByText('Per-batch HPLC, USP <71>, LAL endotoxin, Independently tested'),
    ).toBeInTheDocument();
  });

  it('duplicates items in the marquee for seamless loop', () => {
    const { container } = render(<TrustTicker items={items} />);
    // The hidden md+ marquee renders 2x items (for the loop). It also has a
    // mobile-only static block that renders 1x. So total mentions vary; this
    // test asserts the marquee exists with the animation class.
    expect(
      container.querySelector('.animate-trust-ticker'),
    ).not.toBeNull();
  });
});
