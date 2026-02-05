import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, expect, it, vi } from 'vitest';
import { ExitGameModal } from '../ExitGameModal';

describe('ExitGameModal', () => {
  it('renders modal with title', () => {
    const onConfirm = vi.fn();
    const onCancel = vi.fn();
    render(<ExitGameModal onConfirm={onConfirm} onCancel={onCancel} />);

    expect(screen.getByText('Exit Game?')).toBeInTheDocument();
  });

  it('shows warning about unsaved progress', () => {
    const onConfirm = vi.fn();
    const onCancel = vi.fn();
    render(<ExitGameModal onConfirm={onConfirm} onCancel={onCancel} />);

    expect(screen.getByText(/Progress since your/)).toBeInTheDocument();
    expect(screen.getByText('last save')).toBeInTheDocument();
  });

  it('shows auto-save tip', () => {
    const onConfirm = vi.fn();
    const onCancel = vi.fn();
    render(<ExitGameModal onConfirm={onConfirm} onCancel={onCancel} />);

    expect(screen.getByText(/Auto-save happens at year-end/)).toBeInTheDocument();
  });

  it('calls onConfirm when Exit button is clicked', async () => {
    const user = userEvent.setup();
    const onConfirm = vi.fn();
    const onCancel = vi.fn();
    render(<ExitGameModal onConfirm={onConfirm} onCancel={onCancel} />);

    const exitButton = screen.getByRole('button', { name: /exit to home/i });
    await user.click(exitButton);

    expect(onConfirm).toHaveBeenCalledTimes(1);
  });

  it('calls onCancel when Cancel button is clicked', async () => {
    const user = userEvent.setup();
    const onConfirm = vi.fn();
    const onCancel = vi.fn();
    render(<ExitGameModal onConfirm={onConfirm} onCancel={onCancel} />);

    const cancelButton = screen.getByRole('button', { name: /cancel/i });
    await user.click(cancelButton);

    expect(onCancel).toHaveBeenCalledTimes(1);
  });

  it('renders both action buttons', () => {
    const onConfirm = vi.fn();
    const onCancel = vi.fn();
    render(<ExitGameModal onConfirm={onConfirm} onCancel={onCancel} />);

    expect(screen.getByRole('button', { name: /exit to home/i })).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /cancel/i })).toBeInTheDocument();
  });
});
