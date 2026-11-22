import styles from './Welcome.module.css';

export default function Welcome() {
  return (
    <div className={styles.page}>
      <h1>Thesis Meeting Prep Coach</h1>
      <p className={styles.lead}>
        Walk into your thesis meeting prepared, even if you don't have a topic yet.
      </p>
    </div>
  );
}
