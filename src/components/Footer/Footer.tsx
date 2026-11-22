import styles from './Footer.module.css';

const REPO_URL = 'https://github.com/aaron-binzegger/thesis-meeting-prep-coach';

export function Footer() {
  return (
    <footer className={styles.footer} data-print="hide">
      <div className={styles.inner}>
        <p>
          Prototype: the sheets shown are real outputs of our final prompt, generated in our test
          runs. The prototype itself does not call an AI.
        </p>
        <p className={styles.meta}>
          A student project at HSLU in the Prompt Engineering module. Not official university
          advice. <a href={REPO_URL}>Source code on GitHub</a>
        </p>
      </div>
    </footer>
  );
}
