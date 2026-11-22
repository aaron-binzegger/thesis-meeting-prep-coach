import { screen } from '@testing-library/react';
import { describe, expect, it } from 'vitest';
import App from './App.tsx';
import { renderWithRouter } from './test/renderWithRouter.tsx';

describe('App', () => {
  it('renders the app name on the start page', () => {
    renderWithRouter(<App />);
    expect(
      screen.getByRole('heading', { level: 1, name: 'Thesis Meeting Prep Coach' }),
    ).toBeInTheDocument();
  });

  it('renders the start page inside a main landmark', () => {
    renderWithRouter(<App />);
    expect(screen.getByRole('main')).toBeInTheDocument();
  });
});
