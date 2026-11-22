import { render, screen } from '@testing-library/react';
import { describe, expect, it } from 'vitest';
import { PriorityBadge } from './PriorityBadge.tsx';
import { priorityLabels, type Priority } from './priority.ts';

const priorities = Object.keys(priorityLabels) as Priority[];

describe('PriorityBadge', () => {
  it.each(priorities)('shows a text label and a decorative icon for "%s"', (priority) => {
    const { container } = render(<PriorityBadge priority={priority} />);
    expect(screen.getByText(priorityLabels[priority])).toBeInTheDocument();
    const icon = container.querySelector('svg');
    expect(icon).not.toBeNull();
    expect(icon).toHaveAttribute('aria-hidden', 'true');
  });

  it('uses a different icon shape for each priority', () => {
    const shapes = priorities.map((priority) => {
      const { container } = render(<PriorityBadge priority={priority} />);
      return container.querySelector('svg')?.innerHTML;
    });
    expect(new Set(shapes).size).toBe(priorities.length);
  });
});
