import { screen } from '@testing-library/react';
import axe from 'axe-core';
import { describe, expect, it } from 'vitest';
import App from '../App.tsx';
import { renderWithRouter } from './renderWithRouter.tsx';

/**
 * Structural accessibility check with axe-core. jsdom has no layout or
 * computed colours, so colour contrast is covered by tokens.test.ts instead.
 */
async function axeViolations(container: HTMLElement) {
  const results = await axe.run(container, {
    rules: { 'color-contrast': { enabled: false } },
  });
  return results.violations.map((v) => `${v.id}: ${v.help} (${v.nodes.length})`);
}

describe('accessibility (axe)', () => {
  it('has no violations on the start page', async () => {
    const { container } = renderWithRouter(<App />);
    expect(await axeViolations(container)).toEqual([]);
  });

  it.each([
    '/journey',
    '/meeting/1/setup',
    '/meeting/1/after',
    '/meeting/2/setup',
    '/meeting/1/sheet',
    '/how-it-works',
    '/use-it',
  ])('has no violations on %s', async (route) => {
    const { container } = renderWithRouter(<App />, { route });
    await screen.findByRole('heading', { level: 1 });
    expect(await axeViolations(container)).toEqual([]);
  });

  it('has no violations on the styleguide', async () => {
    const { container } = renderWithRouter(<App />, { route: '/styleguide' });
    await screen.findByRole('heading', { level: 1, name: 'Styleguide' });
    expect(await axeViolations(container)).toEqual([]);
  });
});
