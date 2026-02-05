import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { beforeEach, describe, expect, it, vi } from 'vitest';
import { useGameStore } from '../../../store/useGameStore';
import type { EventLogEntry } from '../../../types/events';
import { Terminal } from '../Terminal';

// Mock the store
const mockPerformAction = vi.fn();

vi.mock('../../../store/useGameStore', () => ({
  useGameStore: vi.fn(),
}));

describe('Terminal', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    // Default mock state with empty event log
    (useGameStore as unknown as ReturnType<typeof vi.fn>).mockReturnValue({
      meta: { tick: 0 },
      eventLog: [],
      performAction: mockPerformAction,
    });
  });

  it('renders terminal header', () => {
    render(<Terminal />);

    expect(screen.getByText(/TERMINAL — EVENT LOG/)).toBeInTheDocument();
    expect(screen.getByText('LIVE')).toBeInTheDocument();
  });

  it('shows welcome message when event log is empty', () => {
    render(<Terminal />);

    // Should show welcome message with 0 entries
    expect(screen.getByText(/0 entries/)).toBeInTheDocument();
  });

  it('displays event log entries when present', () => {
    const mockEntries: EventLogEntry[] = [
      { tick: 1, message: 'Started a new game!', eventId: 'game_start' },
      { tick: 2, message: 'Completed tutorial', eventId: 'tutorial_complete' },
    ];

    (useGameStore as unknown as ReturnType<typeof vi.fn>).mockReturnValue({
      meta: { tick: 2 },
      eventLog: mockEntries,
      performAction: mockPerformAction,
    });

    render(<Terminal />);

    // Text is prefixed with ">" in the terminal display
    expect(screen.getByText(/Started a new game!/)).toBeInTheDocument();
    expect(screen.getByText(/Completed tutorial/)).toBeInTheDocument();
  });

  it('shows entry count in terminal header', () => {
    const mockEntries: EventLogEntry[] = [
      { tick: 1, message: 'Entry 1', eventId: 'event_1' },
      { tick: 2, message: 'Entry 2', eventId: 'event_2' },
      { tick: 3, message: 'Entry 3', eventId: 'event_3' },
    ];

    (useGameStore as unknown as ReturnType<typeof vi.fn>).mockReturnValue({
      meta: { tick: 3 },
      eventLog: mockEntries,
      performAction: mockPerformAction,
    });

    render(<Terminal />);

    expect(screen.getByText(/\[3\]/)).toBeInTheDocument();
  });

  it('shows weeks remaining in year', () => {
    (useGameStore as unknown as ReturnType<typeof vi.fn>).mockReturnValue({
      meta: { tick: 10 }, // 10 weeks into year
      eventLog: [],
      performAction: mockPerformAction,
    });

    render(<Terminal />);

    // 52 - 10 = 42 weeks left
    expect(screen.getByText(/42w left/)).toBeInTheDocument();
  });

  it('calls performAction with skip_week when Next Week button clicked', async () => {
    const user = userEvent.setup();
    render(<Terminal />);

    const nextWeekButton = screen.getByRole('button', { name: /Next Week/ });
    await user.click(nextWeekButton);

    expect(mockPerformAction).toHaveBeenCalledWith('skip_week');
  });

  it('shows correct weeks remaining at end of year', () => {
    (useGameStore as unknown as ReturnType<typeof vi.fn>).mockReturnValue({
      meta: { tick: 51 }, // Week 51 of year
      eventLog: [],
      performAction: mockPerformAction,
    });

    render(<Terminal />);

    // 52 - 51 = 1 week left
    expect(screen.getByText(/1w left/)).toBeInTheDocument();
  });
});
