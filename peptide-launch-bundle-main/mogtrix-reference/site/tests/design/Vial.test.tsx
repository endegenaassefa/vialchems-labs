import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import { Vial } from '@/components/ui/Vial';

describe('Vial primitive', () => {
  it('renders the vial composition with name + cas + batch in label', () => {
    render(
      <Vial
        name="BPC-157"
        amount="5mg"
        cas="137525-51-0"
        mw="1419.56"
        batch="L0237"
        purity="99.2"
      />,
    );
    expect(screen.getByText('BPC-157')).toBeInTheDocument();
    expect(screen.getByText(/137525-51-0/)).toBeInTheDocument();
    expect(screen.getByText(/L0237/)).toBeInTheDocument();
  });

  it('vial scene has aria-hidden=true with role=img wrapper carrying full label', () => {
    render(<Vial name="BPC-157" amount="5mg" cas="x" />);
    const scene = document.querySelector('[data-vial-scene]');
    expect(scene).toHaveAttribute('aria-hidden', 'true');
    const wrapper = document.querySelector('[role="img"]');
    expect(wrapper).toHaveAttribute('aria-label', expect.stringContaining('BPC-157'));
  });

  it('animation classes applied (vial-rotate, vial-float, vial-sheen)', () => {
    const { container } = render(<Vial name="x" amount="x" cas="x" />);
    expect(container.querySelector('.vial-rotate')).toBeInTheDocument();
    expect(container.querySelector('.vial-float')).toBeInTheDocument();
  });

  it('honors animationPaused prop (e.g., for click-to-inspect)', () => {
    const { container } = render(<Vial name="x" amount="x" cas="x" animationPaused />);
    const rotate = container.querySelector('.vial-rotate') as HTMLElement;
    expect(rotate.style.animationPlayState).toBe('paused');
  });
});
