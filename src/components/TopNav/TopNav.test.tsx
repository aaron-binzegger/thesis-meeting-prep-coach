import { screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, expect, it } from 'vitest';
import App from '../../App.tsx';
import { renderWithRouter } from '../../test/renderWithRouter.tsx';

/**
 * jsdom does not evaluate media queries, so tests see the phone layout:
 * the navigation is hidden until the menu is opened.
 */
async function renderWithOpenMenu(route = '/') {
  const user = userEvent.setup();
  renderWithRouter(<App />, { route });
  await user.click(screen.getByRole('button', { name: 'Menu' }));
  return user;
}

describe('TopNav', () => {
  it('lists the main destinations in a labelled navigation landmark', async () => {
    await renderWithOpenMenu();
    expect(screen.getByRole('navigation', { name: 'Main' })).toBeInTheDocument();
    for (const name of ['Journey', 'How it works', 'Use it in your own AI']) {
      expect(screen.getByRole('link', { name })).toBeInTheDocument();
    }
  });

  it('marks the current page', async () => {
    await renderWithOpenMenu('/journey');
    expect(screen.getByRole('link', { name: 'Journey' })).toHaveAttribute('aria-current', 'page');
  });

  it('opens and closes the menu with the toggle and Escape', async () => {
    const user = userEvent.setup();
    renderWithRouter(<App />);
    const toggle = screen.getByRole('button', { name: 'Menu' });
    expect(toggle).toHaveAttribute('aria-expanded', 'false');
    expect(screen.queryByRole('navigation', { name: 'Main' })).not.toBeInTheDocument();

    await user.click(toggle);
    expect(toggle).toHaveAttribute('aria-expanded', 'true');

    await user.keyboard('{Escape}');
    expect(toggle).toHaveAttribute('aria-expanded', 'false');
    expect(toggle).toHaveFocus();
  });

  it('closes the menu after navigating', async () => {
    const user = await renderWithOpenMenu();
    await user.click(screen.getByRole('link', { name: 'How it works' }));
    expect(screen.getByRole('button', { name: 'Menu' })).toHaveAttribute('aria-expanded', 'false');
  });

  it('toggles the demo switch', async () => {
    const user = await renderWithOpenMenu();
    const demo = screen.getByRole('switch', { name: 'Demo' });
    expect(demo).toHaveAttribute('aria-checked', 'false');
    await user.click(demo);
    expect(demo).toHaveAttribute('aria-checked', 'true');
  });
});
