import type { Priority } from '../../types/prep-sheet.ts';

export type { Priority };

export const priorityLabels: Record<Priority, string> = {
  must: 'Must',
  should: 'Should',
  'if-time': 'If time',
};
