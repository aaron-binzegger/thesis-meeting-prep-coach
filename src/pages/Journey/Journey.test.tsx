import { screen } from '@testing-library/react';
import { describe, expect, it } from 'vitest';
import { renderWithRouter } from '../../test/renderWithRouter.tsx';
import Journey from './Journey.tsx';

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
    expect(screen.getByText(/focuses on meetings 1 and 2/)).toBeInTheDocument();
  });
});
