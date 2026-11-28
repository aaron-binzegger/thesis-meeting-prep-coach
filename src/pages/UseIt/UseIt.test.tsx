import { fireEvent, screen, waitFor } from '@testing-library/react';
import { afterEach, describe, expect, it, vi } from 'vitest';
import { renderWithRouter } from '../../test/renderWithRouter.tsx';
import UseIt from './UseIt.tsx';

describe('UseIt', () => {
  afterEach(() => vi.restoreAllMocks());

  it('has one h1, the tested models and the privacy reminder', () => {
    renderWithRouter(<UseIt />);
    expect(screen.getByRole('heading', { level: 1 })).toHaveTextContent('Use it in your own AI');
    expect(screen.getByText(/Portability runs used free ChatGPT and Gemini/)).toBeInTheDocument();
    expect(screen.getByText('4 / 7 (stress 3 / 3, ChatGPT/Gemini 3 / 4)')).toBeInTheDocument();
    expect(
      screen.getByText('Don’t enter real names, grades or confidential company data.'),
    ).toBeInTheDocument();
  });

  it('switches tabs with the arrow keys', () => {
    renderWithRouter(<UseIt />);
    const first = screen.getByRole('tab', { name: 'Copy-paste prompt' });
    const second = screen.getByRole('tab', { name: 'Skill file' });
    expect(first).toHaveAttribute('aria-selected', 'true');
    first.focus();
    fireEvent.keyDown(first, { key: 'ArrowRight' });
    expect(second).toHaveAttribute('aria-selected', 'true');
    expect(second).toHaveFocus();
    expect(screen.getByRole('tabpanel', { name: 'Skill file' })).toBeVisible();
    fireEvent.keyDown(second, { key: 'Home' });
    expect(first).toHaveAttribute('aria-selected', 'true');
  });

  it('offers the skill download', () => {
    renderWithRouter(<UseIt />);
    fireEvent.click(screen.getByRole('tab', { name: 'Skill file' }));
    const link = screen.getByRole('link', { name: 'Download SKILL.md' });
    expect(link.getAttribute('href')).toMatch(/skill\/SKILL\.md$/);
    expect(link).toHaveAttribute('download');
  });

  it('copies the prompt and announces it', async () => {
    const writeText = vi.fn().mockResolvedValue(undefined);
    Object.defineProperty(navigator, 'clipboard', { value: { writeText }, configurable: true });
    renderWithRouter(<UseIt />);
    fireEvent.click(screen.getByRole('button', { name: 'Copy prompt' }));
    expect(writeText).toHaveBeenCalledOnce();
    await waitFor(() => expect(screen.getByRole('status')).toHaveTextContent('Copied'));
  });
});
