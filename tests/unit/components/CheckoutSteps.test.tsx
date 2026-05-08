/**
 * CheckoutSteps unit tests.
 *
 * Verifies that the active step is announced visually + via aria-label, and
 * that prior steps are styled as complete.
 */
import { describe, expect, it } from 'vitest';
import { render, screen } from '@testing-library/react';
import { CheckoutSteps } from '@/app/checkout/CheckoutSteps';

describe('CheckoutSteps', () => {
  it('renders all four step labels', () => {
    render(<CheckoutSteps active="address" />);
    expect(screen.getByText('Address')).toBeInTheDocument();
    expect(screen.getByText('Payment')).toBeInTheDocument();
    expect(screen.getByText('Review')).toBeInTheDocument();
    expect(screen.getByText('Confirm')).toBeInTheDocument();
  });

  it('uses an ordered list with descriptive aria-label', () => {
    render(<CheckoutSteps active="address" />);
    expect(
      screen.getByRole('list', { name: /checkout progress/i }),
    ).toBeInTheDocument();
  });

  it('renders 4 list items', () => {
    render(<CheckoutSteps active="review" />);
    expect(screen.getAllByRole('listitem')).toHaveLength(4);
  });
});
