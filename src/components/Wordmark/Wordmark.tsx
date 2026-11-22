import styles from './Wordmark.module.css';

/** App name with a small ruled-sheet mark. Never uses institutional branding. */
export function Wordmark() {
  return (
    <span className={styles.wordmark}>
      <svg className={styles.mark} viewBox="0 0 28 32" aria-hidden="true" focusable="false">
        <rect x="1" y="1" width="26" height="30" rx="2" className={styles.paper} />
        <line x1="8" y1="1" x2="8" y2="31" className={styles.margin} />
        <line x1="11" y1="10" x2="23" y2="10" className={styles.rule} />
        <line x1="11" y1="16" x2="23" y2="16" className={styles.rule} />
        <line x1="11" y1="22" x2="19" y2="22" className={styles.rule} />
      </svg>
      <span className={styles.name}>Thesis Meeting Prep Coach</span>
    </span>
  );
}
