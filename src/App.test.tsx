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

  it('provides banner, main and contentinfo landmarks and a skip link', () => {
    renderWithRouter(<App />);
    expect(screen.getByRole('banner')).toBeInTheDocument();
    expect(screen.getByRole('main')).toBeInTheDocument();
    expect(screen.getByRole('contentinfo')).toBeInTheDocument();
    expect(screen.getByRole('link', { name: 'Skip to content' })).toBeInTheDocument();
  });

  it('shows a helpful page for unknown routes', () => {
    renderWithRouter(<App />, { route: '/does-not-exist' });
    expect(screen.getByRole('heading', { level: 1 })).toHaveTextContent("This page isn't here yet");
    expect(screen.getByRole('link', { name: 'Go to the start page' })).toBeInTheDocument();
  });

  it('renders the styleguide in development', async () => {
    renderWithRouter(<App />, { route: '/styleguide' });
    expect(
      await screen.findByRole('heading', { level: 1, name: 'Styleguide' }),
    ).toBeInTheDocument();
  });
});
