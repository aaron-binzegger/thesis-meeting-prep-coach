import { screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, expect, it, vi } from 'vitest';
import App from '../../App.tsx';
import { getScenario } from '../../data/index.ts';
import { renderWithRouter } from '../../test/renderWithRouter.tsx';

async function openPanel(route = '/') {
  const user = userEvent.setup();
  renderWithRouter(<App />, { route });
  await user.click(screen.getByRole('button', { name: 'Menu' }));
  await user.click(screen.getByRole('switch', { name: 'Demo' }));
  return user;
}

describe('DemoPanel', () => {
  it('opens when demo mode is switched on and moves focus into the panel', async () => {
    await openPanel();
    const panel = await screen.findByRole('group', { name: 'Demo mode' });
    expect(panel).toBeInTheDocument();
    await vi.waitFor(() => expect(panel).toHaveFocus());
    expect(screen.getByRole('button', { name: /Choose persona/ })).toHaveAttribute(
      'aria-expanded',
      'true',
    );
  });

  it('closes with Escape and returns focus to the button', async () => {
    const user = await openPanel();
    await screen.findByRole('group', { name: 'Demo mode' });
    await user.keyboard('{Escape}');
    expect(screen.queryByRole('group', { name: 'Demo mode' })).not.toBeInTheDocument();
    expect(screen.getByRole('button', { name: /Choose persona/ })).toHaveFocus();
    // The mobile menu stays open.
    expect(screen.getByRole('button', { name: 'Menu' })).toHaveAttribute('aria-expanded', 'true');
  });

  it('pre-fills meeting 1 for Mia and navigates to the setup', async () => {
    const user = await openPanel();
    await user.click(screen.getByRole('button', { name: /Mia/ }));
    expect(
      await screen.findByRole('heading', { level: 1, name: 'Prepare your kick-off meeting' }),
    ).toBeInTheDocument();
    const notes = screen.getByRole('textbox', { name: /notes/i });
    expect(notes).toHaveValue(getScenario('S1')!.notes);
  });

  it('sends Sara to meeting 2', async () => {
    const user = await openPanel();
    await user.click(screen.getByRole('button', { name: /Sara/ }));
    expect(
      await screen.findByRole('heading', { level: 1, name: 'Prepare your next meeting' }),
    ).toBeInTheDocument();
  });

  it('shows who covers which meetings', async () => {
    await openPanel();
    expect(screen.getAllByText('Kick-off and follow-up').length).toBeGreaterThan(0);
    expect(screen.getByText('Follow-up only')).toBeInTheDocument();
  });

  it('toggles the compare switch', async () => {
    const user = await openPanel();
    const compare = screen.getByRole('switch', { name: 'Compare with a plain AI prompt' });
    expect(compare).toHaveAttribute('aria-checked', 'false');
    await user.click(compare);
    expect(compare).toHaveAttribute('aria-checked', 'true');
  });

  it('activates a persona from the ?persona parameter', async () => {
    const user = userEvent.setup();
    renderWithRouter(<App />, { route: '/meeting/1/setup?persona=luca' });
    await user.click(screen.getByRole('button', { name: 'Menu' }));
    expect(screen.getByRole('switch', { name: 'Demo' })).toHaveAttribute('aria-checked', 'true');
    expect(screen.getByRole('button', { name: /Demo: Luca/ })).toBeInTheDocument();
  });

  it('ignores an unknown persona', () => {
    renderWithRouter(<App />, { route: '/journey?persona=nobody' });
    expect(screen.queryByRole('button', { name: /Demo:/ })).not.toBeInTheDocument();
  });
});
