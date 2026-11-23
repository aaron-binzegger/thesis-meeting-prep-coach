import type { ReactNode } from 'react';
import type { Scenario } from '../../types/prep-sheet.ts';
import styles from './CompareView.module.css';

export interface CompareViewProps {
  scenario: Scenario;
  /** The Prep Coach sheet, shown in the second column. */
  children: ReactNode;
}

/**
 * Compare view (spec 6.8): a plain AI answer next to the Prep Coach sheet, with
 * short margin notes that point out the differences. Hidden in print.
 */
export function CompareView({ scenario, children }: CompareViewProps) {
  if (!scenario.baselineText) {
    return (
      <div className={styles.fallback}>
        <p className={styles.noBaseline} data-print="hide" role="note">
          No plain-AI comparison for this scenario.
        </p>
        {children}
      </div>
    );
  }

  const annotations = scenario.baselineAnnotations ?? [];

  return (
    <div className={styles.compare}>
      <header className={styles.intro} data-print="hide">
        <h2 className={styles.title}>Compare with a plain AI prompt</h2>
        <p>The same notes, once with a plain prompt and once with the Prep Coach.</p>
      </header>

      <div className={styles.columns}>
        <section className={styles.baseline} aria-labelledby="compare-plain" data-print="hide">
          <h3 id="compare-plain" className={styles.colTitle}>
            Plain AI prompt
          </h3>
          <pre className={styles.text}>{scenario.baselineText}</pre>
          {annotations.length > 0 && (
            <div className={styles.notes}>
              <h4 className={styles.notesTitle}>What is different</h4>
              <ol className={styles.noteList}>
                {annotations.map((note) => (
                  <li key={note}>{note}</li>
                ))}
              </ol>
            </div>
          )}
        </section>

        <section className={styles.coach} aria-labelledby="compare-coach">
          <h3 id="compare-coach" className={styles.colTitle} data-print="hide">
            Prep Coach
          </h3>
          {children}
        </section>
      </div>
    </div>
  );
}
