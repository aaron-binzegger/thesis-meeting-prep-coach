import { screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, expect, it } from 'vitest';
import App from '../../App.tsx';
import { renderWithRouter } from '../../test/renderWithRouter.tsx';

describe('AfterMeeting', () => {
  it('asks for at least one note', async () => {
    const user = userEvent.setup();
    renderWithRouter(<App />, { route: '/meeting/1/after' });
    await user.click(screen.getByRole('button', { name: 'Prepare meeting 2' }));
    expect(screen.getByText(/Add at least one note/)).toBeInTheDocument();
    expect(screen.getByLabelText('What was decided?')).toHaveFocus();
  });

  it('unlocks meeting 2 once a note is added', async () => {
    const user = userEvent.setup();
    renderWithRouter(<App />, { route: '/meeting/1/after' });
    expect(screen.getByRole('link', { name: /prepare your kick-off meeting/ })).toBeInTheDocument();
    await user.type(screen.getByLabelText('What was decided?'), 'Topic A');
    await user.click(screen.getByRole('button', { name: 'Prepare meeting 2' }));
    expect(
      screen.getByRole('heading', { name: 'Carried over from meeting 1' }),
    ).toBeInTheDocument();
    expect(screen.getByLabelText('What was decided?')).toHaveValue('Topic A');
    await user.click(screen.getByRole('button', { name: 'Prepare my meeting' }));
    expect(screen.getByText('Add a few notes first. Half sentences are fine.')).toBeInTheDocument();
  });
});
