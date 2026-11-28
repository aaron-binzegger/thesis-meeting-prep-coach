import { screen, within } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { Route, Routes } from 'react-router-dom';
import { describe, expect, it } from 'vitest';
import { renderWithRouter } from '../../test/renderWithRouter.tsx';
import { useSession } from '../../state/useSession.ts';
import PrepSheetPage from './PrepSheetPage.tsx';

function Controls() {
  const { selectPersona, prepareMeeting, updateMeeting1 } = useSession();
  return (
    <>
      <button onClick={() => selectPersona('mia')}>persona</button>
      <button onClick={() => selectPersona('sara')}>persona sara</button>
      <button
        onClick={() =>
          updateMeeting1({
            topicIdea: 'torn',
            notes:
              'two ideas, chatbot or maintenance, not sure which one is better and what the supervisor expects from me',
          })
        }
      >
        typed
      </button>
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

const EXAMPLE_BANNER =
  'Prototype: this is an example output for a similar student. The real coach would use your notes.';

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
      'Before I can help',
      'Agenda',
      'Questions for your supervisor',
      'Verify first',
      'Your supervisor decides',
      'One next step',
    ]);
    expect(screen.queryByText('Placeholder data')).toBeNull();
    expect(screen.getByText(/Source run R3\.1-S1/)).toBeTruthy();
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
    const user = userEvent.setup();
    await user.click(screen.getByText('typed'));
    await prepare(false);
    expect(screen.getByText(EXAMPLE_BANNER)).toBeTruthy();
    expect(screen.getByText(/Source run R3\.1-S1/)).toBeTruthy();
  });

  it('shows clarifying questions first for thin notes, then the sheet after example answers', async () => {
    setup('/meeting/1/sheet');
    await prepare(false);
    expect(screen.getByText(EXAMPLE_BANNER)).toBeTruthy();
    expect(screen.getByText('Your notes are a bit thin. Answer these first.')).toBeTruthy();
    expect(screen.queryByRole('heading', { name: 'Agenda' })).toBeNull();

    const user = userEvent.setup();
    await user.click(screen.getByRole('button', { name: 'Use example answers' }));
    expect(screen.getByRole('heading', { name: 'Example answers' })).toBeTruthy();
    expect(screen.getByText(/Here are my answers:/)).toBeTruthy();
    expect(screen.getByRole('heading', { name: 'Agenda' })).toBeTruthy();
    expect(screen.getByRole('heading', { name: 'What I bring' })).toBeTruthy();
    expect(screen.queryByRole('button', { name: 'Use example answers' })).toBeNull();
    expect(document.activeElement?.textContent).toBe('Example answers');
  });

  it('shows Since last time and the journey link for meeting 2', async () => {
    setup('/meeting/2/sheet');
    const user = userEvent.setup();
    await user.click(screen.getByText('persona sara'));
    await user.click(screen.getByText('prepare2'));
    expect(screen.queryByText(EXAMPLE_BANNER)).toBeNull();
    expect(screen.getByRole('heading', { level: 2, name: 'Since last time' })).toBeTruthy();
    expect(screen.getByText("Don't reopen")).toBeTruthy();
    expect(screen.getByRole('link', { name: 'Back to your journey' })).toBeTruthy();
  });
});
