import { ClipboardCopy, NotebookPen, Printer } from 'lucide-react';
import { useState, type ReactNode } from 'react';
import { Button, ButtonLink } from '../../components/Button/Button.tsx';
import { Callout } from '../../components/Callout/Callout.tsx';
import { Card } from '../../components/Card/Card.tsx';
import { RadioGroup, TextArea, TextField } from '../../components/Field/Field.tsx';
import { Highlight } from '../../components/Highlight/Highlight.tsx';
import { PriorityBadge } from '../../components/PriorityBadge/PriorityBadge.tsx';
import type { Priority } from '../../components/PriorityBadge/priority.ts';
import { MarginQuote, Sheet, SheetRow, SheetSection } from '../../components/Sheet/Sheet.tsx';
import { contrastRatio } from '../../lib/contrast.ts';
import styles from './Styleguide.module.css';

interface Swatch {
  token: string;
  role: string;
  /** Text colours show their contrast on paper. */
  text?: boolean;
}

const swatches: Swatch[] = [
  { token: '--desk', role: 'Page background' },
  { token: '--paper', role: 'Sheets, panels, inputs' },
  { token: '--ruling', role: 'Ruled lines, dividers' },
  { token: '--tint', role: 'Selected and secondary areas' },
  { token: '--ink', role: 'Body text', text: true },
  { token: '--ink-muted', role: 'Secondary text', text: true },
  { token: '--accent', role: 'Primary actions, links, focus', text: true },
  { token: '--margin-red', role: 'Margin line (decorative)' },
  { token: '--highlighter', role: 'Verify first' },
  { token: '--must', role: 'Priority: Must', text: true },
  { token: '--should', role: 'Priority: Should', text: true },
  { token: '--iftime', role: 'Priority: If time', text: true },
];

function readToken(token: string): string {
  if (typeof window === 'undefined') return '';
  return getComputedStyle(document.documentElement).getPropertyValue(token).trim();
}

function ratioLabel(hex: string, paper: string): string | null {
  try {
    return `${contrastRatio(hex, paper).toFixed(1)}:1 on paper`;
  } catch {
    return null;
  }
}

function Group({ title, intro, children }: { title: string; intro?: string; children: ReactNode }) {
  return (
    <section className={styles.group} aria-labelledby={`sg-${title}`}>
      <div className={styles.groupHead}>
        <h2 id={`sg-${title}`}>{title}</h2>
        {intro && <p className={styles.intro}>{intro}</p>}
      </div>
      {children}
    </section>
  );
}

const sampleQuestions: { priority: Priority; text: string; fromNotes: string }[] = [
  {
    priority: 'must',
    text: 'Which of my two ideas fits your research area better, and would you supervise either of them?',
    fromNotes: 'idea A remote work tools in small firms?? idea B chatbots in customer service',
  },
  {
    priority: 'should',
    text: 'Is a survey realistic for the question, or would interviews give me better data?',
    fromNotes: 'survey or interviews, no clue how many ppl',
  },
  {
    priority: 'if-time',
    text: 'Could you suggest one or two papers to start reading?',
    fromNotes: 'literatur: where to start',
  },
];

/** Dev-only reference of the design system (spec section 11, phase 1). */
export default function Styleguide() {
  const [colours] = useState(() =>
    swatches.map((swatch) => ({ ...swatch, value: readToken(swatch.token) })),
  );
  const paper = colours.find((c) => c.token === '--paper')?.value || '#ffffff';
  const [topicIdea, setTopicIdea] = useState<'one' | 'torn' | 'none' | undefined>('torn');

  return (
    <div className={styles.page}>
      <header className={styles.pageHead}>
        <h1>Styleguide</h1>
        <p className={styles.lead}>
          The ruled notebook: one sheet of paper on a desk, written in blue-black ink, with a red
          margin line and a highlighter for what to check. This page exists only in development.
        </p>
      </header>

      <Group
        title="The prep sheet"
        intro="The hero of the app. Notes from the student sit in the margin; on phones they move under each item."
      >
        <Sheet aria-label="Sample prep sheet" className={styles.sampleSheet}>
          <SheetSection>
            <SheetRow note={<p className={styles.sheetMeta}>Kick-off, 30 minutes</p>}>
              <p className={styles.sheetKicker}>Goal for this meeting</p>
              <p className={styles.sheetGoal}>
                Leave with one agreed topic direction and a first idea of the method.
              </p>
            </SheetRow>
          </SheetSection>

          <SheetSection heading="Questions for your supervisor">
            <ol className={styles.questions}>
              {sampleQuestions.map((question) => (
                <li key={question.text}>
                  <SheetRow note={<MarginQuote>{question.fromNotes}</MarginQuote>}>
                    <PriorityBadge priority={question.priority} />
                    <p className={styles.questionText}>{question.text}</p>
                  </SheetRow>
                </li>
              ))}
            </ol>
          </SheetSection>

          <SheetSection heading="Verify first">
            <SheetRow note={<p className={styles.sheetMeta}>Check with your supervisor</p>}>
              <p>
                <Highlight>How long the written proposal should be</Highlight>
              </p>
            </SheetRow>
            <SheetRow note={<p className={styles.sheetMeta}>Your programme's regulations</p>}>
              <p>
                <Highlight>Whether a company partner needs a signed agreement</Highlight>
              </p>
            </SheetRow>
          </SheetSection>

          <SheetSection heading="Your supervisor decides">
            <SheetRow>
              <p className={styles.decision}>Which idea you pursue</p>
              <ul className={styles.options}>
                <li>Remote-work tools in small firms</li>
                <li>Chatbots in customer service</li>
                <li>A narrower mix of both</li>
              </ul>
            </SheetRow>
          </SheetSection>

          <SheetSection heading="One next step">
            <SheetRow>
              <p className={styles.nextStep}>
                Before the meeting, write half a page on each idea: the question, why it matters,
                and where the data could come from.
              </p>
            </SheetRow>
          </SheetSection>

          <SheetSection>
            <SheetRow>
              <p className={styles.sheetFooter}>
                Prepared by the Thesis Meeting Prep Coach. Not official university advice. Check
                with your supervisor. <span className={styles.runId}>PLACEHOLDER</span>
              </p>
            </SheetRow>
          </SheetSection>
        </Sheet>
      </Group>

      <Group
        title="Colour"
        intro="Text colours meet at least 4.5:1 on paper and desk. The margin red is decorative only."
      >
        <ul className={styles.swatches}>
          {colours.map((colour) => (
            <li key={colour.token} className={styles.swatch}>
              <span
                className={styles.chip}
                style={{ background: `var(${colour.token})` }}
                aria-hidden="true"
              />
              <span className={styles.swatchText}>
                <code>{colour.token}</code>
                <span>{colour.role}</span>
                <span className={styles.swatchMeta}>
                  {colour.value || 'n/a'}
                  {colour.text && colour.value && ` – ${ratioLabel(colour.value, paper) ?? ''}`}
                </span>
              </span>
            </li>
          ))}
        </ul>
      </Group>

      <Group
        title="Type"
        intro="Newsreader for headings and quotes, Atkinson Hyperlegible Next for everything you read and click."
      >
        <div className={styles.typeScale}>
          <p className={styles.typeH1}>Walk in prepared</p>
          <p className={styles.typeH2}>Questions for your supervisor</p>
          <p className={styles.typeH3}>Since last time</p>
          <p className={styles.typeH4}>Carried over</p>
          <p>
            Body text is 18 px with a line height of 1.55 and a measure of about 68 characters. It
            is set in Atkinson Hyperlegible Next, a typeface designed for readers with low vision.
          </p>
          <MarginQuote>no idea what method, maybe survey?? ask</MarginQuote>
        </div>
      </Group>

      <Group title="Buttons" intro="One primary action per screen.">
        <div className={styles.row}>
          <Button>Prepare my meeting</Button>
          <Button variant="secondary" icon={<ClipboardCopy />}>
            Copy as text
          </Button>
          <Button variant="secondary" icon={<Printer />}>
            Print or save as PDF
          </Button>
          <Button variant="quiet" icon={<NotebookPen />}>
            Add notes after the meeting
          </Button>
          <ButtonLink to="/">Start with your first meeting</ButtonLink>
          <Button disabled>Prepare meeting 2</Button>
        </div>
      </Group>

      <Group
        title="Priorities"
        intro="Shape, label and colour together, so priority never depends on colour alone."
      >
        <div className={styles.row}>
          <PriorityBadge priority="must" />
          <PriorityBadge priority="should" />
          <PriorityBadge priority="if-time" />
        </div>
      </Group>

      <Group title="Form fields">
        <form className={styles.form} onSubmit={(event) => event.preventDefault()}>
          <TextField
            label="Minutes available"
            type="number"
            inputMode="numeric"
            min={5}
            max={120}
            defaultValue={30}
            className={styles.minutes}
          />
          <RadioGroup
            legend="Do you already have a topic idea?"
            name="topic-idea"
            value={topicIdea}
            onChange={setTopicIdea}
            options={[
              { value: 'one', label: 'Yes, one' },
              {
                value: 'torn',
                label: "I'm torn between some",
                description: 'The coach helps you compare them.',
              },
              {
                value: 'none',
                label: 'Not yet',
                description: 'That is fine. The coach helps you find a starting point.',
              },
            ]}
          />
          <TextArea
            label="Your notes"
            hint="Messy notes are fine, and so is mixing German and English."
            placeholder="Paste or type what is on your mind about the thesis…"
          />
          <TextField
            label="What is still open?"
            error="Add at least one open point, or write “nothing”."
          />
        </form>
      </Group>

      <Group title="Callouts">
        <div className={styles.stack}>
          <Callout tone="boundaries" heading="What this coach does and doesn't do">
            <p>
              This coach helps you prepare for meetings with your thesis supervisor. It does not
              choose your topic, judge your work or give official university advice. It never states
              rules, dates or deadlines of your university. Those depend on your programme and
              semester, so it lists them under “Verify first” for you to check with your supervisor
              or in your programme's regulations. Please don't enter real names, grades or
              confidential company data.
            </p>
          </Callout>
          <Callout tone="privacy">
            <p>Don't enter real names, grades or confidential company data.</p>
          </Callout>
          <Callout tone="prototype">
            <p>
              Prototype: this is an example output for a similar student. The real coach would use
              your notes.
            </p>
          </Callout>
        </div>
      </Group>

      <Group title="Cards">
        <div className={styles.cards}>
          <Card>
            <h3 className={styles.cardTitle}>Meeting 1: Kick-off</h3>
            <p>Find a direction, even without a topic idea.</p>
          </Card>
          <Card tone="tinted">
            <h3 className={styles.cardTitle}>Carried over from meeting 1</h3>
            <p>Secondary context sits on a tinted panel.</p>
          </Card>
        </div>
      </Group>
    </div>
  );
}
