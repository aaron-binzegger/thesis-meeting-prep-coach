import { useState } from 'react';
import styles from './DemoSwitch.module.css';

/**
 * Demo mode switch (spec 6.8). Phase 1 only provides the control;
 * the persona panel and shared state arrive in Phase 4.
 */
export function DemoSwitch() {
  const [on, setOn] = useState(false);

  return (
    <button
      type="button"
      role="switch"
      aria-checked={on}
      className={styles.switch}
      onClick={() => setOn((value) => !value)}
    >
      <span>Demo</span>
      <span className={styles.track} aria-hidden="true">
        <span className={styles.thumb} />
      </span>
    </button>
  );
}
