import { act, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import App from '../../App.tsx';
import { renderWithRouter } from '../../test/renderWithRouter.tsx';

describe('meeting setup screens', () => {
  beforeEach(() => vi.useFakeTimers({ shouldAdvanceTime: true }));
  afterEach(() => vi.useRealTimers());

  it('shows validation errors and focuses the first invalid field', async () => {
    const user = userEvent.setup({ advanceTimers: vi.advanceTimersByTime });
    renderWithRouter(<App />, { route: '/meeting/1/setup' });
    await user.click(screen.getByRole('button', { name: 'Prepare my meeting' }));
    expect(
      screen.getByText('Choose one of the options, so the coach knows where you start.'),
    ).toBeInTheDocument();
    expect(screen.getByText('Add a few notes first. Half sentences are fine.')).toBeInTheDocument();
    expect(screen.getByRole('radio', { name: /Yes, one/ })).toHaveFocus();
  });

  it('shows loading steps and then opens the sheet', async () => {
    const user = userEvent.setup({ advanceTimers: vi.advanceTimersByTime });
    renderWithRouter(<App />, { route: '/meeting/1/setup' });
    await user.click(screen.getByRole('radio', { name: /Not yet/ }));
    await user.type(screen.getByLabelText('Your notes'), 'some half sentences');
    await user.click(screen.getByRole('button', { name: 'Prepare my meeting' }));
    expect(screen.getByRole('status')).toHaveTextContent('Reading your notes…');
    act(() => {
      vi.advanceTimersByTime(700);
    });
    expect(screen.getByRole('status')).toHaveTextContent('Building your agenda…');
    act(() => {
      vi.advanceTimersByTime(700);
    });
    expect(
      screen.queryByRole('heading', { name: 'Prepare your kick-off meeting' }),
    ).not.toBeInTheDocument();
  });

  it('locks meeting 2 by default', () => {
    renderWithRouter(<App />, { route: '/meeting/2/setup' });
    expect(
      screen.getByText('Meeting 2 opens after you add notes from meeting 1.'),
    ).toBeInTheDocument();
    expect(screen.getByRole('link', { name: /Add notes from meeting 1/ })).toHaveAttribute(
      'href',
      '/meeting/1/after',
    );
    expect(screen.queryByLabelText('Minutes available')).not.toBeInTheDocument();
  });
});
