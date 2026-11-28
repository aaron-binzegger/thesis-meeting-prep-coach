import { render, screen } from '@testing-library/react';
import { describe, expect, it } from 'vitest';
import { getScenario } from '../../data/index.ts';
import { CompareView } from './CompareView.tsx';

describe('CompareView', () => {
  it('shows the baseline, the annotations and the sheet for S1', () => {
    const s1 = getScenario('S1')!;
    render(
      <CompareView scenario={s1}>
        <p>SHEET</p>
      </CompareView>,
    );
    expect(screen.getByRole('heading', { name: 'Compare with a plain AI prompt' })).toBeVisible();
    expect(screen.getByRole('heading', { name: 'Plain AI prompt' })).toBeInTheDocument();
    expect(screen.getByRole('heading', { name: 'Prep Coach' })).toBeInTheDocument();
    expect(screen.getByText(/Here's a plan for the 30 minutes/)).toBeInTheDocument();
    expect(screen.getAllByRole('listitem')).toHaveLength(s1.baselineAnnotations!.length);
    expect(screen.getByText('SHEET')).toBeInTheDocument();
  });

  it('shows a note and the sheet when there is no baseline', () => {
    render(
      <CompareView scenario={getScenario('X1')!}>
        <p>SHEET</p>
      </CompareView>,
    );
    expect(screen.getByText('No plain-AI comparison for this scenario.')).toBeInTheDocument();
    expect(screen.getByText('SHEET')).toBeInTheDocument();
  });
});
