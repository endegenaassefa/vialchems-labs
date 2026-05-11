import { render, screen } from '@testing-library/react';
import { describe, it, expect } from 'vitest';
import { NamedAttestation } from '@/components/ui/NamedAttestation';

describe('NamedAttestation', () => {
  it('renders the placeholder default copy when placeholder=true', () => {
    render(<NamedAttestation placeholder />);
    expect(screen.getByText(/Attestation · pending/i)).toBeInTheDocument();
    expect(
      screen.getByText(/Pending real research-buyer attestations/i),
    ).toBeInTheDocument();
  });

  it('renders a custom placeholder message when provided', () => {
    render(<NamedAttestation placeholder message="Custom pending text." />);
    expect(screen.getByText('Custom pending text.')).toBeInTheDocument();
  });

  it('renders quote + name + role + organization in real mode', () => {
    render(
      <NamedAttestation
        quote="The COA library is the differentiator."
        name="Dr. Real Researcher"
        role="PI"
        organization="University Lab"
      />,
    );
    expect(
      screen.getByText('The COA library is the differentiator.'),
    ).toBeInTheDocument();
    expect(screen.getByText('Dr. Real Researcher')).toBeInTheDocument();
    expect(screen.getByText('PI · University Lab')).toBeInTheDocument();
  });

  it('renders the "Researcher attestation" eyebrow in real mode', () => {
    render(
      <NamedAttestation
        quote="quote"
        name="name"
        role="role"
        organization="org"
      />,
    );
    expect(screen.getByText('Researcher attestation')).toBeInTheDocument();
  });
});
