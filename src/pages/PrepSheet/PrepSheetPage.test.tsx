import { screen, within } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { Route, Routes } from 'react-router-dom';
import { describe, expect, it } from 'vitest';
import { renderWithRouter } from '../../test/renderWithRouter.tsx';
import { useSession } from '../../state/useSession.ts';
import PrepSheetPage from './PrepSheetPage.tsx';

function Controls() {
  const { selectPersona, prepareMeeting } = useSession();
  return (
    <>
      <button onClick={() => selectPersona('mia')}>persona</button>
      <button onClick={() => prepareMeeting(1)}>prepare1</button>
      <button onClick={() => prepareMeeting(2)}>prepare2</button>
    </>
  );
}

function setup(route: string) {
  return renderWithRouter(
    <>
      <Controls />
      <Routes>
        <Route path="/meeting/:n/sheet" element={<PrepSheetPage />} />
      </Routes>
    </>,
    { route },
  );
}

async function prepare(withPersona: boolean, meeting: 1 | 2 = 1) {
  const user = userEvent.setup();
  if (withPersona) await user.click(screen.getByText('persona'));
  await user.click(screen.getByText(`prepare${meeting}`));
}

describe('PrepSheetPage', () => {
  it('shows an empty state when the meeting is not prepared', () => {
    setup('/meeting/1/sheet');
    expect(screen.getByRole('heading', { level: 1 }).textContent).toBe(
      "You haven't prepared meeting 1 yet",
    );
    expect(screen.getByRole('link').getAttribute('href')).toBe('/meeting/1/setup');
  });

  it('shows a message for an unknown meeting', () => {
    setup('/meeting/3/sheet');
    expect(screen.getByText('No such meeting')).toBeTruthy();
    expect(screen.getByRole('link', { name: /journey/i }).getAttribute('href')).toBe('/journey');
  });

  it('renders the blocks in order with one h1', async () => {
    setup('/meeting/1/sheet');
    await prepare(true);
    expect(screen.getAllByRole('heading', { level: 1 })).toHaveLength(1);
    const h2 = screen.getAllByRole('heading', { level: 2 }).map((h) => h.textContent);
    expect(h2).toEqual([
      'Agenda',
      'Questions for your supervisor',
      'Verify first',
      'Your supervisor decides',
      'One next step',
    ]);
    expect(screen.getByText('Placeholder data')).toBeTruthy();
    expect(screen.queryByText(/Prototype: this is an example/)).toBeNull();
    expect(screen.getByRole('link', { name: /Add notes after the meeting/ })).toBeTruthy();
  });

  it('renders the agenda as a table with a total and at most 6 questions', async () => {
    setup('/meeting/1/sheet');
    await prepare(true);
    const table = screen.getByRole('table');
    expect(within(table).getByRole('columnheader', { name: 'Minutes' })).toBeTruthy();
    expect(screen.getByText(/\d+ of 30 minutes planned/)).toBeTruthy();
    const section = screen
      .getByRole('heading', { name: 'Questions for your supervisor' })
      .closest('section')!;
    expect(within(section).getAllByRole('listitem').length).toBeLessThanOrEqual(6);
    expect(within(section).getAllByText('From your notes').length).toBeGreaterThan(0);
  });

  it('shows the example banner when the sheet is an example', async () => {
    setup('/meeting/1/sheet');
    await prepare(false);
    expect(
      screen.getByText(
        'Prototype: this is an example output for a similar student. The real coach would use your notes.',
      ),
    ).toBeTruthy();
  });

  it('shows Since last time and the journey link for meeting 2', async () => {
    setup('/meeting/2/sheet');
    await prepare(true, 2);
    expect(screen.getByRole('heading', { level: 2, name: 'Since last time' })).toBeTruthy();
    expect(screen.getByText("Don't reopen")).toBeTruthy();
    expect(screen.getByRole('link', { name: 'Back to your journey' })).toBeTruthy();
  });
});
