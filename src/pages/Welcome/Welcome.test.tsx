import { screen } from '@testing-library/react';
import { describe, expect, it } from 'vitest';
import { renderWithRouter } from '../../test/renderWithRouter.tsx';
import Welcome from './Welcome.tsx';

describe('Welcome', () => {
  it('states the value in the h1', () => {
    renderWithRouter(<Welcome />);
    expect(screen.getByRole('heading', { level: 1 })).toHaveTextContent(
      "Walk into your thesis meeting prepared, even if you don't have a topic yet.",
    );
  });

  it('has one primary action to the journey', () => {
    renderWithRouter(<Welcome />);
    expect(screen.getByRole('link', { name: 'Start with your first meeting' })).toHaveAttribute(
      'href',
      '/journey',
    );
  });

  it('shows the boundaries statement and the privacy note', () => {
    renderWithRouter(<Welcome />);
    expect(screen.getByText(/It does not choose your topic, judge your work/)).toBeInTheDocument();
    expect(
      screen.getByText("Don't enter real names, grades or confidential company data."),
    ).toBeInTheDocument();
  });

  it('hides the decorative example sheet from assistive technology', () => {
    renderWithRouter(<Welcome />);
    expect(screen.getByText('Example of a prep sheet')).toBeInTheDocument();
    expect(screen.queryByRole('heading', { name: 'Verify first' })).not.toBeInTheDocument();
  });
});
