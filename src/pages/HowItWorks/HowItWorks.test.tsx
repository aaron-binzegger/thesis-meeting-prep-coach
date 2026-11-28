import { screen, within } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, expect, it } from 'vitest';
import { renderWithRouter } from '../../test/renderWithRouter.tsx';
import HowItWorks from './HowItWorks.tsx';

describe('HowItWorks', () => {
  it('has one h1 and the section headings', () => {
    renderWithRouter(<HowItWorks />);
    expect(screen.getAllByRole('heading', { level: 1 })).toHaveLength(1);
    expect(screen.getByRole('heading', { level: 1 })).toHaveTextContent('How it works');
    for (const name of [
      'The workflow',
      'What the coach will never do',
      'How we built and tested it',
      'Peer test',
      'Privacy and human oversight',
      'Prototype limitations and AI use',
    ]) {
      expect(screen.getByRole('heading', { level: 2, name })).toBeInTheDocument();
    }
  });

  it('shows the workflow steps with the yes/no branch', () => {
    renderWithRouter(<HowItWorks />);
    expect(screen.getByText('Are the notes too thin?')).toBeInTheDocument();
    expect(screen.getByText(/asks you clarifying questions/)).toBeInTheDocument();
    expect(screen.getByText('The coach writes your prep sheet')).toBeInTheDocument();
    expect(screen.getByText('You and your supervisor check the sheet')).toBeInTheDocument();
  });

  it('lists what the coach never does', () => {
    renderWithRouter(<HowItWorks />);
    const section = screen
      .getByRole('heading', { name: 'What the coach will never do' })
      .closest('section')!;
    expect(within(section).getAllByRole('listitem')).toHaveLength(3);
  });

  it('shows the evaluation from docs/evaluation.md and links to it', () => {
    renderWithRouter(<HowItWorks />);
    const table = screen.getByRole('table', { name: 'Prompt versions and test results' });
    expect(within(table).getAllByRole('row')).toHaveLength(6);
    expect(within(table).getByRole('rowheader', { name: 'R3.1 Final' })).toBeInTheDocument();
    expect(screen.getByRole('heading', { name: 'Where it does not work' })).toBeInTheDocument();
    expect(screen.queryByText(/placeholder/i)).not.toBeInTheDocument();
    expect(
      screen.getByRole('link', { name: 'Read the full evaluation on GitHub' }),
    ).toHaveAttribute(
      'href',
      'https://github.com/aaron-binzegger/thesis-meeting-prep-coach/blob/main/docs/evaluation.md',
    );
  });

  it('marks the peer test as coming soon without results', () => {
    renderWithRouter(<HowItWorks />);
    const section = screen.getByRole('heading', { name: 'Peer test' }).closest('section')!;
    expect(within(section).getByText('Results coming soon')).toBeVisible();
    expect(within(section).getByText(/To be added: blind A\/B comparison/)).toBeInTheDocument();
  });

  it('shows the real clarifying example (R3-X1) from the "too thin" branch', async () => {
    const user = userEvent.setup();
    renderWithRouter(<HowItWorks />);
    await user.click(screen.getByText('See an example with very thin notes'));
    // The sheet renders on the <details> toggle event, which jsdom fires asynchronously.
    expect(
      await screen.findByText(
        'Your notes are a bit thin. Answer these first.',
        {},
        { timeout: 5000 },
      ),
    ).toBeInTheDocument();
    expect(screen.getByText('kickoff tmrw. no idea. help')).toBeInTheDocument();
    await user.click(screen.getByRole('button', { name: 'Use example answers' }));
    expect(screen.getByRole('heading', { name: 'Agenda' })).toBeInTheDocument();
    expect(screen.getByText(/Source run R3-X1/)).toBeInTheDocument();
  });
});
