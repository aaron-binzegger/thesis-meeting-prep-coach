import { screen, within } from '@testing-library/react';
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

  it('shows the placeholder note and the repo link', () => {
    renderWithRouter(<HowItWorks />);
    expect(screen.getByText('Placeholder results. The real evaluation follows.')).toBeVisible();
    expect(screen.getByRole('link', { name: /GitHub/ })).toHaveAttribute(
      'href',
      'https://github.com/aaron-binzegger/thesis-meeting-prep-coach',
    );
  });
});
