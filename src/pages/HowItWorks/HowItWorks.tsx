import { useState } from 'react';
import { Callout } from '../../components/Callout/Callout.tsx';
import { PrepSheetView } from '../../components/PrepSheet/PrepSheetView.tsx';
import {
  comparison,
  fallbacks,
  getMeetingType,
  getReadyScenario,
  getSheet,
} from '../../data/index.ts';
import styles from './HowItWorks.module.css';

const REPO_URL = 'https://github.com/aaron-binzegger/thesis-meeting-prep-coach';

const PROTOTYPE_NOTE =
  'Prototype: the sheets shown are real outputs of our final prompt, generated in our test runs. The prototype itself does not call an AI.';

/** The real clarifying-questions output (R3-X1), opened from the "too thin" branch. */
function ClarifyingExample() {
  const [open, setOpen] = useState(false);
  const scenario = getReadyScenario(fallbacks.thinNotes.scenarioId);
  const sheet = getSheet(scenario?.sheetId);
  if (!scenario || !sheet) return null;
  return (
    <details className={styles.example} onToggle={(event) => setOpen(event.currentTarget.open)}>
      <summary>See an example with very thin notes</summary>
      {open && (
        <div className={styles.exampleBody}>
          <p>
            The notes were: <q>{scenario.notes}</q>
          </p>
          <PrepSheetView
            sheet={sheet}
            scenario={scenario}
            meetingTitle={getMeetingType(scenario.meeting)?.title ?? 'Kick-off'}
          />
        </div>
      )}
    </details>
  );
}

export default function HowItWorks() {
  return (
    <div className={styles.page}>
      <header className={styles.header}>
        <h1>How it works</h1>
        <p className={styles.lead}>
          You give the coach your rough notes, and it hands back a one-page prep sheet that you and
          your supervisor can check.
        </p>
      </header>

      <section aria-labelledby="flow-heading" className={styles.section}>
        <h2 id="flow-heading">The workflow</h2>
        <ol className={styles.flow}>
          <li className={styles.step}>
            <span className={styles.stepText}>
              Your notes, plus context from meeting 1 if you have it
            </span>
          </li>
          <li className={styles.step}>
            <span className={styles.stepText}>The coach prompt reads them</span>
          </li>
          <li className={`${styles.step} ${styles.decision}`}>
            <span className={styles.stepText}>Are the notes too thin?</span>
            <ul className={styles.branches}>
              <li className={styles.branch}>
                <strong className={styles.branchLabel}>Yes</strong>
                <span aria-hidden="true" className={styles.arrow}>
                  →
                </span>
                <span>The coach asks you clarifying questions, then you add to your notes</span>
              </li>
              <li className={styles.branch}>
                <strong className={styles.branchLabel}>No</strong>
                <span aria-hidden="true" className={styles.arrow}>
                  →
                </span>
                <span>The coach writes your prep sheet</span>
              </li>
            </ul>
          </li>
          <li className={styles.step}>
            <span className={styles.stepText}>You and your supervisor check the sheet</span>
          </li>
        </ol>
        <ClarifyingExample />
      </section>

      <section aria-labelledby="never-heading" className={styles.section}>
        <h2 id="never-heading">What the coach will never do</h2>
        <ul className={styles.never}>
          <li>State university rules or dates</li>
          <li>Pick your topic, method or scope</li>
          <li>Judge whose feedback is right</li>
        </ul>
        <p>
          Anything that depends on your programme goes under &ldquo;Verify first&rdquo;, so you can
          check it with your supervisor.
        </p>
      </section>

      <section aria-labelledby="built-heading" className={styles.section}>
        <h2 id="built-heading">How we built and tested it</h2>
        {comparison.status === 'placeholder' && (
          <p className={styles.placeholder}>Placeholder results. The real evaluation follows.</p>
        )}
        <ol className={styles.iterations}>
          {comparison.iterations.map((it) => (
            <li key={it.id}>
              <strong>{it.name}</strong>
              <span>{it.change}</span>
              <span className={styles.result}>{it.keyResult}</span>
            </li>
          ))}
        </ol>
        <h3>Key results</h3>
        <dl className={styles.results}>
          {comparison.keyResults.map((r) => (
            <div key={r.label} className={styles.resultRow}>
              <dt>{r.label}</dt>
              <dd>{r.value}</dd>
            </div>
          ))}
        </dl>
        <p>
          <a href={REPO_URL}>See the code and the test runs on GitHub</a>
        </p>
      </section>

      <section aria-labelledby="privacy-heading" className={styles.section}>
        <h2 id="privacy-heading">Privacy and human oversight</h2>
        <p>
          Nothing you type here is stored or sent anywhere. Still, please don&rsquo;t enter real
          names, grades or confidential company data.
        </p>
        <p>
          The sheet is a starting point. You and your supervisor check it, and your supervisor has
          the final say on what happens in your thesis.
        </p>
      </section>

      <section aria-labelledby="limits-heading" className={styles.section}>
        <h2 id="limits-heading">Prototype limitations and AI use</h2>
        <Callout tone="prototype">
          <p>{PROTOTYPE_NOTE}</p>
        </Callout>
        <p>
          The outputs are pre-generated and the students are fictional. Nothing here is official
          university advice. The app code was written with Claude Code.
        </p>
      </section>
    </div>
  );
}
