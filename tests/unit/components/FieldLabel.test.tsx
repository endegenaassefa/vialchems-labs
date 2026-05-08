import { describe, expect, it } from 'vitest';
import { render, screen } from '@testing-library/react';
import { FieldLabel } from '@/components/ui/FieldLabel';

describe('FieldLabel', () => {
  it('renders text', () => {
    render(<FieldLabel>Email</FieldLabel>);
    expect(screen.getByText(/email/i)).toBeInTheDocument();
  });

  it('uses Plex Mono uppercase 11px tracked typography', () => {
    render(<FieldLabel>Email</FieldLabel>);
    const label = screen.getByText(/email/i);
    expect(label.className).toMatch(/font-mono/);
    expect(label.className).toMatch(/uppercase/);
    expect(label.className).toMatch(/text-\[11px\]/);
    expect(label.className).toMatch(/tracking-\[0\.12em\]/);
  });

  it('does NOT render asterisk by default', () => {
    render(<FieldLabel>Email</FieldLabel>);
    // no required-marker
    expect(screen.queryByText('*')).not.toBeInTheDocument();
  });

  it('renders an asterisk when required=true', () => {
    render(<FieldLabel required>Email</FieldLabel>);
    expect(screen.getByText('*')).toBeInTheDocument();
  });

  it('marks asterisk with aria-hidden so screen readers do not announce it', () => {
    render(<FieldLabel required>Email</FieldLabel>);
    const star = screen.getByText('*');
    expect(star.getAttribute('aria-hidden')).toBe('true');
  });

  it('associates with form field via htmlFor', () => {
    render(<FieldLabel htmlFor="email-input">Email</FieldLabel>);
    const label = screen.getByText(/email/i);
    expect(label.tagName).toBe('LABEL');
    expect((label as HTMLLabelElement).htmlFor).toBe('email-input');
  });

  it('renders a <label> element', () => {
    render(<FieldLabel>Email</FieldLabel>);
    const label = screen.getByText(/email/i);
    expect(label.tagName).toBe('LABEL');
  });

  it('forwards arbitrary className', () => {
    render(<FieldLabel className="my-extra">Email</FieldLabel>);
    expect(screen.getByText(/email/i).className).toMatch(/my-extra/);
  });
});
