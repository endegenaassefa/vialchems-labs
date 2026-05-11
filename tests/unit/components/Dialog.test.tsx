import { describe, expect, it, vi } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import { Dialog } from '@/components/ui/Dialog';

describe('Dialog', () => {
  it('does NOT render when open=false', () => {
    render(
      <Dialog open={false} onClose={() => {}} title="Cancel order">
        <p>body</p>
      </Dialog>,
    );
    expect(screen.queryByRole('dialog')).not.toBeInTheDocument();
  });

  it('renders when open=true', () => {
    render(
      <Dialog open onClose={() => {}} title="Cancel order">
        <p>body</p>
      </Dialog>,
    );
    expect(screen.getByRole('dialog')).toBeInTheDocument();
    expect(screen.getByText('Cancel order')).toBeInTheDocument();
    expect(screen.getByText('body')).toBeInTheDocument();
  });

  it('uses role="dialog" + aria-modal="true"', () => {
    render(
      <Dialog open onClose={() => {}} title="x">
        <p>body</p>
      </Dialog>,
    );
    const dialog = screen.getByRole('dialog');
    expect(dialog.getAttribute('aria-modal')).toBe('true');
  });

  it('associates the title via aria-labelledby', () => {
    render(
      <Dialog open onClose={() => {}} title="Refund request">
        <p>body</p>
      </Dialog>,
    );
    const dialog = screen.getByRole('dialog');
    const labelledBy = dialog.getAttribute('aria-labelledby');
    expect(labelledBy).toBeTruthy();
    const titleEl = document.getElementById(labelledBy as string);
    expect(titleEl?.textContent).toBe('Refund request');
  });

  it('fires onClose on Escape key', () => {
    const onClose = vi.fn();
    render(
      <Dialog open onClose={onClose} title="x">
        <p>body</p>
      </Dialog>,
    );
    fireEvent.keyDown(document, { key: 'Escape' });
    expect(onClose).toHaveBeenCalledTimes(1);
  });

  it('fires onClose on backdrop click', () => {
    const onClose = vi.fn();
    render(
      <Dialog open onClose={onClose} title="x">
        <p>body</p>
      </Dialog>,
    );
    fireEvent.click(screen.getByTestId('dialog-backdrop'));
    expect(onClose).toHaveBeenCalledTimes(1);
  });

  it('does NOT fire onClose on dialog content click (event does not bubble out of panel)', () => {
    const onClose = vi.fn();
    render(
      <Dialog open onClose={onClose} title="x">
        <p data-testid="body">body</p>
      </Dialog>,
    );
    fireEvent.click(screen.getByTestId('body'));
    expect(onClose).not.toHaveBeenCalled();
  });

  it('renders into a portal (not inside the parent DOM tree)', () => {
    const { container } = render(
      <Dialog open onClose={() => {}} title="x">
        <p>body</p>
      </Dialog>,
    );
    // Portal mounts to document.body; should not be a descendant of container
    expect(container.querySelector('[role="dialog"]')).toBeNull();
  });
});
