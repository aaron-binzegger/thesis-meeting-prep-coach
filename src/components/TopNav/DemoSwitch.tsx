import { useSession } from '../../state/useSession.ts';
import styles from './DemoSwitch.module.css';

/**
 * Demo mode switch (spec 6.8). Turns demo mode on in the session;
 * the persona panel arrives in Phase 4.
 */
export function DemoSwitch() {
  const { session, setDemoMode } = useSession();
  const on = session.demoMode;

  return (
    <button
      type="button"
      role="switch"
      aria-checked={on}
      className={styles.switch}
      onClick={() => setDemoMode(!on)}
    >
      <span>Demo</span>
      <span className={styles.track} aria-hidden="true">
        <span className={styles.thumb} />
      </span>
    </button>
  );
}
