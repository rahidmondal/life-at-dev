import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, expect, it, vi } from 'vitest';
import { HowToPlayModal } from '../HowToPlayModal';

describe('HowToPlayModal', () => {
  it('renders modal with title', () => {
    const onClose = vi.fn();
    render(<HowToPlayModal onClose={onClose} />);

    expect(screen.getByText('// HOW TO PLAY')).toBeInTheDocument();
  });

  it('shows game overview section', () => {
    const onClose = vi.fn();
    render(<HowToPlayModal onClose={onClose} />);

    expect(screen.getByText(/THE JOURNEY/)).toBeInTheDocument();
    expect(screen.getByText(/Life@Dev is a strategic simulation/)).toBeInTheDocument();
  });

  it('shows skill vs XP explanation', () => {
    const onClose = vi.fn();
    render(<HowToPlayModal onClose={onClose} />);

    expect(screen.getByText(/THE TWO-CURRENCY PUZZLE/)).toBeInTheDocument();
    expect(screen.getByText(/SKILL \(Potential\)/)).toBeInTheDocument();
    expect(screen.getByText(/XP \(Proof\)/)).toBeInTheDocument();
  });

  it('calls onClose when X button is clicked', async () => {
    const user = userEvent.setup();
    const onClose = vi.fn();
    render(<HowToPlayModal onClose={onClose} />);

    const closeButton = screen.getByRole('button', { name: /close modal/i });
    await user.click(closeButton);

    expect(onClose).toHaveBeenCalledTimes(1);
  });

  it('calls onClose when backdrop is clicked', async () => {
    const user = userEvent.setup();
    const onClose = vi.fn();
    render(<HowToPlayModal onClose={onClose} />);

    // Click on the backdrop (fixed inset-0 element)
    const backdrop = screen.getByText('// HOW TO PLAY').closest('[class*="fixed inset-0"]');
    expect(backdrop).toBeInTheDocument();
    if (backdrop) {
      await user.click(backdrop);
      expect(onClose).toHaveBeenCalledTimes(1);
    }
  });

  it('does not close when modal content is clicked', async () => {
    const user = userEvent.setup();
    const onClose = vi.fn();
    render(<HowToPlayModal onClose={onClose} />);

    // Click on the modal content
    const title = screen.getByText('// HOW TO PLAY');
    await user.click(title);

    expect(onClose).not.toHaveBeenCalled();
  });
});
