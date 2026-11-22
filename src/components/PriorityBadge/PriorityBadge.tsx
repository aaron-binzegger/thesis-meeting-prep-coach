import styles from './PriorityBadge.module.css';
import { priorityLabels, type Priority } from './priority.ts';

/**
 * Filled, half and outline circles: the shape alone tells the priorities apart,
 * so colour is never the only signal (WCAG 1.4.1).
 */
export function PriorityIcon({ priority }: { priority: Priority }) {
  return (
    <svg className={styles.icon} viewBox="0 0 16 16" aria-hidden="true" focusable="false">
      {priority === 'must' && <circle cx="8" cy="8" r="6.25" fill="currentColor" />}
      {priority === 'should' && (
        <>
          <circle cx="8" cy="8" r="6.25" fill="none" stroke="currentColor" strokeWidth="1.5" />
          <path d="M8 1.75a6.25 6.25 0 0 1 0 12.5Z" fill="currentColor" />
        </>
      )}
      {priority === 'if-time' && (
        <circle cx="8" cy="8" r="6.25" fill="none" stroke="currentColor" strokeWidth="1.5" />
      )}
    </svg>
  );
}

export interface PriorityBadgeProps {
  priority: Priority;
}

/** Priority marker with icon and text label. */
export function PriorityBadge({ priority }: PriorityBadgeProps) {
  return (
    <span className={styles.badge} data-priority={priority}>
      <PriorityIcon priority={priority} />
      {priorityLabels[priority]}
    </span>
  );
}
