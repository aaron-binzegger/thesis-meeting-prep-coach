import { ButtonLink } from '../../components/Button/Button.tsx';
import { Callout } from '../../components/Callout/Callout.tsx';
import { Highlight } from '../../components/Highlight/Highlight.tsx';
import { PriorityBadge } from '../../components/PriorityBadge/PriorityBadge.tsx';
import { MarginQuote, Sheet, SheetRow, SheetSection } from '../../components/Sheet/Sheet.tsx';
import { getSheet } from '../../data/index.ts';
import styles from './Welcome.module.css';

const BOUNDARIES =
  'This coach helps you prepare for meetings with your thesis supervisor. It does not choose your topic, judge your work or give official university advice. It never states rules, dates or deadlines of your university. Those depend on your programme and semester, so it lists them under "Verify first" for you to check with your supervisor or in your programme\'s regulations. Please don\'t enter real names, grades or confidential company data.';

const points = [
  {
    title: 'Turns your rough notes into an agenda',
    text: 'Scribbles and half-ideas become a short plan that fits the time you have.',
  },
  {
    title: 'Ranks your questions',
    text: 'You see which ones to ask first and which can wait if time runs out.',
  },
  {
    title: 'Separates what to check from what your supervisor decides',
    text: 'Facts to verify are highlighted. Choices that are not yours alone are listed for the meeting.',
  },
];

function SheetFragment() {
  const sheet = getSheet('sheet-S1');
  if (!sheet) return null;
  const question = sheet.questions.find((q) => q.priority === 'must');
  const verify = sheet.verifyFirst[0];
  return (
    <figure className={styles.example}>
      <div aria-hidden="true">
        <Sheet className={styles.sheet}>
          <SheetSection>
            <SheetRow>
              <p className={styles.kicker}>Goal for this meeting</p>
              <p className={styles.goal}>{sheet.goal}</p>
            </SheetRow>
          </SheetSection>
          {question && (
            <SheetSection heading="Question to ask first">
              <SheetRow
                note={question.fromNotes ? <MarginQuote>{question.fromNotes}</MarginQuote> : null}
              >
                <PriorityBadge priority={question.priority} />
                <p className={styles.question}>{question.text}</p>
              </SheetRow>
            </SheetSection>
          )}
          {verify && (
            <SheetSection heading={<Highlight>Verify first</Highlight>}>
              <SheetRow note={<p className={styles.meta}>{verify.whereToCheck}</p>}>
                <p>{verify.item}</p>
              </SheetRow>
            </SheetSection>
          )}
        </Sheet>
      </div>
      <figcaption className={styles.caption}>Example of a prep sheet</figcaption>
    </figure>
  );
}

export default function Welcome() {
  return (
    <div className={styles.page}>
      <section className={styles.hero}>
        <div className={styles.intro}>
          <h1 className={styles.title}>
            Walk into your thesis meeting prepared, even if you don't have a topic yet.
          </h1>
          <ul className={styles.points}>
            {points.map((point) => (
              <li key={point.title}>
                <strong>{point.title}.</strong> {point.text}
              </li>
            ))}
          </ul>
          <div className={styles.action}>
            <ButtonLink to="/journey">Start with your first meeting</ButtonLink>
          </div>
        </div>
        <SheetFragment />
      </section>
      <div className={styles.notes}>
        <Callout tone="boundaries">
          <p>{BOUNDARIES}</p>
        </Callout>
        <Callout tone="privacy">
          <p>Don't enter real names, grades or confidential company data.</p>
        </Callout>
      </div>
    </div>
  );
}
