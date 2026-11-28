import { screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, expect, it } from 'vitest';
import { useSession } from '../../state/useSession.ts';
import { renderWithRouter } from '../../test/renderWithRouter.tsx';
import type { PersonaId } from '../../types/prep-sheet.ts';
import Journey from './Journey.tsx';

function PickPersona({ id }: { id: PersonaId }) {
  const { selectPersona } = useSession();
  return <button onClick={() => selectPersona(id)}>pick {id}</button>;
}

describe('Journey', () => {
  it('has one h1 and an ordered list of meetings', () => {
    renderWithRouter(<Journey />, { route: '/journey' });
    expect(screen.getAllByRole('heading', { level: 1 })).toHaveLength(1);
    expect(screen.getAllByRole('listitem')).toHaveLength(5);
  });

  it('shows meeting 1 as not prepared with a prepare action', () => {
    renderWithRouter(<Journey />, { route: '/journey' });
    expect(screen.getByText('Not prepared')).toBeInTheDocument();
    expect(screen.getByRole('link', { name: 'Prepare meeting 1' })).toHaveAttribute(
      'href',
      '/meeting/1/setup',
    );
  });

  it('locks meeting 2 with an explanation and a link', () => {
    renderWithRouter(<Journey />, { route: '/journey' });
    expect(screen.getByText(/Opens after you add notes from meeting 1/)).toBeInTheDocument();
    expect(screen.getByRole('link', { name: 'Add notes from meeting 1' })).toHaveAttribute(
      'href',
      '/meeting/1/after',
    );
    expect(screen.queryByRole('link', { name: 'Prepare meeting 2' })).not.toBeInTheDocument();
  });

  it('lists the other meetings as also available', () => {
    renderWithRouter(<Journey />, { route: '/journey' });
    expect(screen.getAllByText('Also available')).toHaveLength(3);
    expect(screen.getByRole('heading', { name: 'Regular meeting' })).toBeInTheDocument();
    expect(screen.getByText(/The other meetings are shown for context/)).toBeInTheDocument();
  });

  it('opens an also-available panel with what the coach does', async () => {
    const user = userEvent.setup();
    renderWithRouter(<Journey />, { route: '/journey' });
    const button = screen.getByRole('button', { name: 'Regular meeting' });
    expect(button).toHaveAttribute('aria-expanded', 'false');
    await user.click(button);
    expect(button).toHaveAttribute('aria-expanded', 'true');
    expect(screen.getByText('Suggests one next step')).toBeVisible();
    expect(screen.getAllByText('This prototype focuses on meetings 1 and 2.')).toHaveLength(3);
    expect(screen.getAllByText('This prototype focuses on meetings 1 and 2.')[2]).not.toBeVisible();
    expect(screen.getAllByRole('heading', { name: 'What the coach does' })).toHaveLength(1);
    // One panel at a time.
    await user.click(screen.getByRole('button', { name: 'Pre-submission' }));
    expect(button).toHaveAttribute('aria-expanded', 'false');
  });

  it('hides the pre-submission example until its real output (X4) exists', async () => {
    const user = userEvent.setup();
    renderWithRouter(<Journey />, { route: '/journey' });
    await user.click(screen.getByRole('button', { name: 'Pre-submission' }));
    expect(screen.getByRole('heading', { name: 'What the coach does' })).toBeVisible();
    expect(screen.queryByText('Show example sheet')).not.toBeInTheDocument();
  });

  it("hides a persona's meeting that has no real output yet", async () => {
    const user = userEvent.setup();
    renderWithRouter(
      <>
        <PickPersona id="luca" />
        <PickPersona id="sara" />
        <Journey />
      </>,
      { route: '/journey' },
    );
    await user.click(screen.getByText('pick luca'));
    expect(screen.getByRole('heading', { name: 'Meeting 1: Kick-off' })).toBeInTheDocument();
    expect(screen.queryByRole('heading', { name: 'Meeting 2: Follow-up' })).not.toBeInTheDocument();
    await user.click(screen.getByText('pick sara'));
    expect(screen.queryByRole('heading', { name: 'Meeting 1: Kick-off' })).not.toBeInTheDocument();
    expect(screen.getByRole('heading', { name: 'Meeting 2: Follow-up' })).toBeInTheDocument();
  });
});
