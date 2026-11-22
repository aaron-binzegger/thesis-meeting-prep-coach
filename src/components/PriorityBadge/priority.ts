export type Priority = 'must' | 'should' | 'if-time';

export const priorityLabels: Record<Priority, string> = {
  must: 'Must',
  should: 'Should',
  'if-time': 'If time',
};
