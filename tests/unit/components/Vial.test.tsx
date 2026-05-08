import { describe, expect, it } from 'vitest';
import { render, screen } from '@testing-library/react';
import { Vial } from '@/components/ui/Vial';

describe('Vial', () => {
  it('renders a root element', () => {
    render(<Vial data-testid="vial" />);
    expect(screen.getByTestId('vial')).toBeInTheDocument();
  });

  it('renders SVG markup (clean clinical, not an emoji)', () => {
    const { container } = render(<Vial />);
    const svg = container.querySelector('svg');
    expect(svg).toBeInTheDocument();
  });

  it('defaults to size="md"', () => {
    render(<Vial data-testid="vial" />);
    const vial = screen.getByTestId('vial');
    expect(vial.className).toMatch(/w-/);
  });

  it('applies size="sm" classes', () => {
    render(<Vial size="sm" data-testid="vial" />);
    expect(screen.getByTestId('vial').className).toMatch(/w-8/);
  });

  it('applies size="md" classes', () => {
    render(<Vial size="md" data-testid="vial" />);
    expect(screen.getByTestId('vial').className).toMatch(/w-12/);
  });

  it('applies size="lg" classes', () => {
    render(<Vial size="lg" data-testid="vial" />);
    expect(screen.getByTestId('vial').className).toMatch(/w-16/);
  });

  it('does NOT apply sway animation by default', () => {
    render(<Vial data-testid="vial" />);
    expect(screen.getByTestId('vial').className).not.toMatch(/animate.*sway/);
  });

  it('applies sway animation class when sway=true', () => {
    render(<Vial sway data-testid="vial" />);
    const vial = screen.getByTestId('vial');
    // class should reference the keyframe name vial-sway from globals.css
    expect(vial.className).toMatch(/vial-sway/);
  });

  it('applies aria-hidden when explicitly hidden', () => {
    render(<Vial aria-hidden data-testid="vial" />);
    expect(screen.getByTestId('vial').getAttribute('aria-hidden')).toBe('true');
  });

  it('does NOT carry aria-hidden by default', () => {
    render(<Vial data-testid="vial" />);
    // Components are not aria-hidden by default; consumer decides.
    expect(screen.getByTestId('vial').getAttribute('aria-hidden')).not.toBe(
      'true',
    );
  });

  it('does not render the green-liquid anti-pattern (only cream powder)', () => {
    // Sanity: the SVG fill should reference cream / powder color, not a
    // saturated green liquid. We assert no fill="#00ff00" / "lime" / "green".
    const { container } = render(<Vial />);
    const html = container.innerHTML;
    expect(html).not.toMatch(/lime/i);
    expect(html).not.toMatch(/#00ff00/i);
    expect(html).not.toMatch(/fill="green"/i);
  });
});
