import { Check } from 'lucide-react';
import type { CSSProperties } from 'react';
import { SHEET_FOOTER } from '../../lib/sheetText.ts';
import {
  isPlaceholder,
  MAX_QUESTIONS,
  type PrepSheet,
  type Priority,
  type Scenario,
} from '../../types/prep-sheet.ts';
import { Highlight } from '../Highlight/Highlight.tsx';
import { PriorityBadge } from '../PriorityBadge/PriorityBadge.tsx';
import { MarginQuote, Sheet, SheetRow, SheetSection } from '../Sheet/Sheet.tsx';
import styles from './PrepSheetView.module.css';

export interface PrepSheetViewProps {
  sheet: PrepSheet;
  scenario: Scenario;
  meetingTitle: string;
}

const priorities: Priority[] = ['must', 'should', 'if-time'];

/** The prep sheet itself (spec 6.4): nine blocks on one ruled page. */
export function PrepSheetView({ sheet, scenario, meetingTitle }: PrepSheetViewProps) {
  let block = 0;
  const blockProps = () => ({
    className: styles.block,
    style: { '--i': block++ } as CSSProperties,
  });

  const planned = sheet.agenda.reduce((sum, item) => sum + item.minutes, 0);
  const barTotal = Math.max(planned, scenario.minutes);
  const questions = sheet.questions.slice(0, MAX_QUESTIONS);

  return (
    <Sheet aria-label="Prep sheet">
      <SheetSection {...blockProps()}>
        <SheetRow note={<p className={styles.meta}>{scenario.minutes} minutes</p>}>
          <h1 className={styles.title}>{meetingTitle}</h1>
          <p className={styles.kicker}>Goal for this meeting</p>
          <p className={styles.goal}>{sheet.goal}</p>
        </SheetRow>
      </SheetSection>

      {sheet.sinceLastTime && (
        <SheetSection heading="Since last time" {...blockProps()}>
          <SheetRow
            note={
              <p className={styles.dontReopen}>
                <Check size={16} aria-hidden="true" /> Don't reopen
              </p>
            }
          >
            <h3 className={styles.subhead}>Decided in meeting 1</h3>
            <ul className={styles.list}>
              {sheet.sinceLastTime.decided.map((item) => (
                <li key={item}>{item}</li>
              ))}
            </ul>
          </SheetRow>
          <SheetRow>
            <h3 className={styles.subhead}>Carried over</h3>
            <ul className={styles.list}>
              {sheet.sinceLastTime.carriedOver.map((item) => (
                <li key={item}>{item}</li>
              ))}
            </ul>
          </SheetRow>
        </SheetSection>
      )}

      {sheet.clarifyingQuestions && sheet.clarifyingQuestions.length > 0 && (
        <SheetSection heading="Clarifying questions" {...blockProps()}>
          <SheetRow>
            <p>Your notes are a bit thin. Answer these first.</p>
            <ol className={styles.list}>
              {sheet.clarifyingQuestions.map((q) => (
                <li key={q}>{q}</li>
              ))}
            </ol>
          </SheetRow>
        </SheetSection>
      )}

      <SheetSection heading="Agenda" {...blockProps()}>
        <SheetRow>
          <div className={styles.tableWrap}>
            <table className={styles.table}>
              <caption className={styles.caption}>Agenda for {scenario.minutes} minutes</caption>
              <thead>
                <tr>
                  <th scope="col">Minutes</th>
                  <th scope="col">Topic</th>
                  <th scope="col">Goal</th>
                </tr>
              </thead>
              <tbody>
                {sheet.agenda.map((item) => (
                  <tr key={item.topic}>
                    <td className={styles.num}>{item.minutes}</td>
                    <th scope="row">{item.topic}</th>
                    <td>{item.goal}</td>
                  </tr>
                ))}
              </tbody>
              <tfoot>
                <tr>
                  <td className={styles.num}>{planned}</td>
                  <th scope="row" colSpan={2}>
                    Total minutes planned
                  </th>
                </tr>
              </tfoot>
            </table>
          </div>
          <div className={styles.bar} aria-hidden="true">
            {sheet.agenda.map((item) => (
              <span
                key={item.topic}
                className={styles.segment}
                style={{ width: `${(item.minutes / barTotal) * 100}%` }}
              />
            ))}
          </div>
          <p className={styles.barLabel}>
            {planned} of {scenario.minutes} minutes planned
          </p>
        </SheetRow>
      </SheetSection>

      <SheetSection heading="Questions for your supervisor" {...blockProps()}>
        {priorities.map((priority) => {
          const group = questions.filter((q) => q.priority === priority);
          if (group.length === 0) return null;
          return (
            <div key={priority} className={styles.group}>
              <SheetRow>
                <h3 className={styles.groupHead}>
                  <PriorityBadge priority={priority} />
                </h3>
              </SheetRow>
              <ul className={styles.questions}>
                {group.map((q) => (
                  <li key={q.text}>
                    <SheetRow note={<MarginQuote>{q.fromNotes}</MarginQuote>}>
                      <p className={styles.questionText}>{q.text}</p>
                    </SheetRow>
                  </li>
                ))}
              </ul>
            </div>
          );
        })}
      </SheetSection>

      <SheetSection heading="Verify first" {...blockProps()}>
        <ul className={styles.plain}>
          {sheet.verifyFirst.map((v) => (
            <li key={v.item}>
              <SheetRow note={<p className={styles.meta}>Check: {v.whereToCheck}</p>}>
                <p>
                  <Highlight>{v.item}</Highlight>
                </p>
              </SheetRow>
            </li>
          ))}
        </ul>
      </SheetSection>

      <SheetSection heading="Your supervisor decides" {...blockProps()}>
        {sheet.supervisorDecides.map((d) => (
          <SheetRow key={d.decision}>
            <p className={styles.decision}>{d.decision}</p>
            <ul className={styles.options} aria-label={`Options for: ${d.decision}`}>
              {d.options.map((o) => (
                <li key={o}>{o}</li>
              ))}
            </ul>
          </SheetRow>
        ))}
      </SheetSection>

      <SheetSection heading="One next step" {...blockProps()}>
        <SheetRow>
          <p className={styles.nextStep}>{sheet.nextStep}</p>
        </SheetRow>
      </SheetSection>

      <SheetSection {...blockProps()}>
        <SheetRow>
          <footer className={styles.footer}>
            <p>{SHEET_FOOTER}</p>
            <p>
              <span className={styles.runId}>{sheet.runId}</span>
              {isPlaceholder(sheet.runId) && <span className={styles.badge}>Placeholder data</span>}
            </p>
          </footer>
        </SheetRow>
      </SheetSection>
    </Sheet>
  );
}
