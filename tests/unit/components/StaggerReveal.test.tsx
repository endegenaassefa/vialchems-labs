import { describe, expect, it, vi, beforeEach } from 'vitest';
import { render, screen } from '@testing-library/react';

let reducedMotionValue: boolean | null = false;
vi.mock('motion/react', async () => {
  const actual =
    await vi.importActual<typeof import('motion/react')>('motion/react');
  return {
    ...actual,
    useReducedMotion: () => reducedMotionValue,
  };
});

import { StaggerReveal } from '@/components/ui/StaggerReveal';

/**
 * Phase 7 (v4) — Motion & Interaction Layer.
 *
 * StaggerReveal wraps a list of children, fades each in with a small upward
 * translate, and applies a stagger delay per child. Per Iron Law 2.18,
 * `prefers-reduced-motion: reduce` hard-disables the animation: children
 * render plain, with no motion-driven transform. This is non-negotiable.
 *
 * Spec source: SUPER_PROMPT_v4 §8 PHASE 7 step 3 (60-80ms/item, 320ms duration).
 */

describe('StaggerReveal', () => {
  beforeEach(() => {
    reducedMotionValue = false;
  });

  it('renders all children in order', () => {
    render(
      <StaggerReveal data-testid="reveal">
        <li>alpha</li>
        <li>bravo</li>
        <li>charlie</li>
      </StaggerReveal>,
    );
    const wrapper = screen.getByTestId('reveal');
    const items = wrapper.querySelectorAll('li');
    expect(items).toHaveLength(3);
    expect(items[0]).toHaveTextContent('alpha');
    expect(items[1]).toHaveTextContent('bravo');
    expect(items[2]).toHaveTextContent('charlie');
  });

  it('uses the provided wrapper element via the `as` prop', () => {
    render(
      <StaggerReveal as="ul" data-testid="reveal">
        <li>x</li>
      </StaggerReveal>,
    );
    expect(screen.getByTestId('reveal').tagName).toBe('UL');
  });

  it('passes through className and children props', () => {
    render(
      <StaggerReveal className="my-list" data-testid="reveal">
        <span>only</span>
      </StaggerReveal>,
    );
    const wrapper = screen.getByTestId('reveal');
    expect(wrapper).toHaveClass('my-list');
    expect(wrapper).toHaveTextContent('only');
  });

  it('honors useReducedMotion: no inline transform/opacity styles applied to children when reduce is set', () => {
    reducedMotionValue = true;
    render(
      <StaggerReveal data-testid="reveal">
        <span data-testid="child">hi</span>
      </StaggerReveal>,
    );
    const child = screen.getByTestId('child');
    expect(child.style.transform).toBe('');
    expect(child.style.opacity).toBe('');
  });

  it('marks the wrapper with data-stagger-reveal so global CSS / scanners can target it', () => {
    render(
      <StaggerReveal data-testid="reveal">
        <span>x</span>
      </StaggerReveal>,
    );
    expect(screen.getByTestId('reveal')).toHaveAttribute(
      'data-stagger-reveal',
    );
  });

  it('uses itemAs to wrap each child in a valid HTML element (e.g. "li" inside "ul")', () => {
    // ul/ol require li children — div between them is invalid HTML. itemAs
    // lets the wrapper produce semantically correct + animatable per-child
    // elements.
    render(
      <StaggerReveal as="ul" itemAs="li" data-testid="reveal">
        <span>alpha</span>
        <span>bravo</span>
      </StaggerReveal>,
    );
    const wrapper = screen.getByTestId('reveal');
    expect(wrapper.tagName).toBe('UL');
    const items = wrapper.querySelectorAll(':scope > li');
    expect(items).toHaveLength(2);
    // No invalid divs inserted between ul and li.
    expect(wrapper.querySelectorAll(':scope > div')).toHaveLength(0);
    expect(items[0]).toHaveTextContent('alpha');
    expect(items[1]).toHaveTextContent('bravo');
  });

  it('itemAs="tr" works for table-row layouts', () => {
    render(
      <StaggerReveal as="tbody" itemAs="tr" data-testid="reveal">
        <td>cell a</td>
        <td>cell b</td>
      </StaggerReveal>,
    );
    const wrapper = screen.getByTestId('reveal');
    expect(wrapper.tagName).toBe('TBODY');
    expect(wrapper.querySelectorAll(':scope > tr')).toHaveLength(2);
  });

  it('reduced-motion path keeps children semantically correct under itemAs', () => {
    reducedMotionValue = true;
    render(
      <StaggerReveal as="ul" itemAs="li" data-testid="reveal">
        <span>only</span>
      </StaggerReveal>,
    );
    const wrapper = screen.getByTestId('reveal');
    expect(wrapper.tagName).toBe('UL');
    // Even in reduced-motion, children must render under valid <li> wrappers
    // so pre-rendered HTML is correct for screen-readers / SEO.
    expect(wrapper.querySelectorAll(':scope > li')).toHaveLength(1);
  });
});
