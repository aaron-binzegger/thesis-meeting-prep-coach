import type { ReactNode } from 'react';
import styles from './Highlight.module.css';

/**
 * A highlighter stroke for things the student must check ("Verify first").
 * Uses <mark>, so assistive technology and forced-colours mode still convey it.
 */
export function Highlight({ children }: { children: ReactNode }) {
  return <mark className={styles.highlight}>{children}</mark>;
}
