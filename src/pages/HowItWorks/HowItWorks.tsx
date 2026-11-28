import { useState } from 'react';
import { Callout } from '../../components/Callout/Callout.tsx';
import { PrepSheetView } from '../../components/PrepSheet/PrepSheetView.tsx';
import {
  evaluation,
  fallbacks,
  getMeetingType,
  getReadyScenario,
  getSheet,
} from '../../data/index.ts';
import styles from './HowItWorks.module.css';

const REPO_URL = 'https://github.com/aaron-binzegger/thesis-meeting-prep-coach';
const EVALUATION_URL = `${REPO_URL}/blob/main/docs/evaluation.md`;
const PROMPTS_URL = `${REPO_URL}/tree/main/docs/prompts`;
const DISCLOSURE_URL = `${REPO_URL}/blob/main/docs/ai-use-disclosure.md`;

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
        <p>
          We started with a plain prompt and improved it in four steps. Every version ran on the
          same fictional notes.
        </p>
        <div className={styles.tableWrap}>
          <table className={styles.table}>
            <caption className={styles.caption}>Prompt versions and test results</caption>
            <thead>
              <tr>
                <th scope="col">Version</th>
                <th scope="col">Idea</th>
                <th scope="col">Hard passes</th>
                <th scope="col">Soft avg</th>
              </tr>
            </thead>
            <tbody>
              {evaluation.versions.map((v) => (
                <tr key={v.id}>
                  <th scope="row">{v.name}</th>
                  <td>{v.idea}</td>
                  <td>{v.hardPasses}</td>
                  <td>{v.softAvg}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        <dl className={styles.notes}>
          <dt>Hard passes</dt>
          <dd>{evaluation.setup[2]}</dd>
          <dt>Soft avg</dt>
          <dd>{evaluation.setup[3]}</dd>
          <dt>Model</dt>
          <dd>{evaluation.setup[0]}</dd>
          <dt>Scoring</dt>
          <dd>{evaluation.setup[4]}</dd>
        </dl>

        <h3>What the plain prompt did</h3>
        <ul className={styles.list}>
          {evaluation.baselineDoes.map((text) => (
            <li key={text}>{text}</li>
          ))}
        </ul>

        <h3>Final coach (R3.1)</h3>
        <ul className={styles.list}>
          {evaluation.findings.map((text) => (
            <li key={text}>{text}</li>
          ))}
        </ul>

        <h3>Where it does not work</h3>
        <ul className={styles.list}>
          {evaluation.limitations.map((l, index) => (
            <li key={l.title}>
              <strong>{l.title}</strong> {l.text}
              {index === 1 && (
                <ul className={styles.list}>
                  {evaluation.gains.map((text) => (
                    <li key={text}>{text}</li>
                  ))}
                </ul>
              )}
            </li>
          ))}
        </ul>

        <p className={styles.links}>
          <a href={EVALUATION_URL}>Read the full evaluation on GitHub</a>
          <a href={PROMPTS_URL}>See every prompt version</a>
        </p>
      </section>

      <section aria-labelledby="peer-heading" className={styles.section}>
        <h2 id="peer-heading">Peer test</h2>
        {evaluation.peerTest.status === 'coming-soon' && (
          <p className={styles.soon}>Results coming soon</p>
        )}
        <p>{evaluation.peerTest.note}</p>
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
          university advice. The app code was written with Claude Code.{' '}
          <a href={DISCLOSURE_URL}>Read how we used AI</a>
        </p>
      </section>
    </div>
  );
}
