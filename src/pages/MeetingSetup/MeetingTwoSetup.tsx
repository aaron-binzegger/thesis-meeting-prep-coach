import { useRef, useState, type FormEvent } from 'react';
import { Button, ButtonLink } from '../../components/Button/Button.tsx';
import { Callout } from '../../components/Callout/Callout.tsx';
import { Card } from '../../components/Card/Card.tsx';
import { TextArea, TextField } from '../../components/Field/Field.tsx';
import { LoadingSteps, usePrepareFlow } from '../../components/LoadingSteps/index.ts';
import { getPersona, getScenario, getSheet } from '../../data/index.ts';
import { useSession } from '../../state/useSession.ts';
import styles from './MeetingSetup.module.css';
import { useFocusFirstError } from './useFocusFirstError.ts';

interface Errors {
  minutes?: string;
  notes?: string;
}

export default function MeetingTwoSetup() {
  const { session, meeting2Unlocked, updateAfterNotes, updateMeeting2 } = useSession();
  const { minutes, notes } = session.meeting2;
  const { after } = session.meeting1;
  const [errors, setErrors] = useState<Errors>({});
  const [attempt, setAttempt] = useState(0);
  const formRef = useRef<HTMLFormElement>(null);
  const flow = usePrepareFlow(2);
  useFocusFirstError(formRef, attempt);

  if (!meeting2Unlocked) {
    return (
      <div className={styles.page}>
        <h1>Prepare your next meeting</h1>
        <p className={styles.intro}>Meeting 2 opens after you add notes from meeting 1.</p>
        <ButtonLink to="/meeting/1/after">Add notes from meeting 1</ButtonLink>
      </div>
    );
  }

  const kickoffScenario = getScenario(session.meeting1.prepared?.scenarioId);
  const sheetId =
    kickoffScenario?.sheetId ??
    getScenario(getPersona(session.personaId)?.followupScenarioId)?.context?.previousSheetId;
  const sheet = getSheet(sheetId);

  function onSubmit(event: FormEvent) {
    event.preventDefault();
    if (flow.running) return;
    const next: Errors = {};
    if (!Number.isFinite(minutes) || minutes < 5 || minutes > 120)
      next.minutes = 'Enter a number of minutes between 5 and 120.';
    if (!notes.trim()) next.notes = 'Add a few notes first. Half sentences are fine.';
    setErrors(next);
    if (Object.keys(next).length > 0) {
      setAttempt((a) => a + 1);
      return;
    }
    flow.start();
  }

  return (
    <div className={styles.page}>
      <h1>Prepare your next meeting</h1>
      <p className={styles.intro}>
        The coach builds on what you decided and left open in meeting 1.
      </p>
      <Card as="section" tone="tinted" className={styles.context} aria-labelledby="carried-over">
        <h2 id="carried-over">Carried over from meeting 1</h2>
        {sheet && (
          <details>
            <summary className={styles.summary}>Your kick-off sheet</summary>
            <div className={styles.sheetBody}>
              {sheet.goal && (
                <>
                  <h3>Goal</h3>
                  <p>{sheet.goal}</p>
                </>
              )}
              <h3>Questions</h3>
              <ul>
                {sheet.questions.map((q) => (
                  <li key={q.text}>{q.text}</li>
                ))}
              </ul>
              <h3>Next step</h3>
              <p>{sheet.nextStep}</p>
            </div>
          </details>
        )}
        <div className={styles.notes}>
          <TextArea
            label="What was decided?"
            rows={3}
            value={after.decided}
            onChange={(e) => updateAfterNotes({ decided: e.target.value })}
          />
          <TextArea
            label="What is still open?"
            rows={3}
            value={after.open}
            onChange={(e) => updateAfterNotes({ open: e.target.value })}
          />
          <TextArea
            label="What do I have to do next?"
            rows={3}
            value={after.next}
            onChange={(e) => updateAfterNotes({ next: e.target.value })}
          />
        </div>
      </Card>
      <form ref={formRef} className={styles.form} onSubmit={onSubmit} noValidate>
        <TextField
          label="Minutes available"
          type="number"
          min={5}
          max={120}
          inputMode="numeric"
          value={Number.isNaN(minutes) ? '' : minutes}
          onChange={(e) => updateMeeting2({ minutes: e.target.valueAsNumber })}
          error={errors.minutes}
        />
        <TextArea
          label="What happened since meeting 1?"
          hint="Messy notes are fine, and so is mixing German and English."
          value={notes}
          onChange={(e) => updateMeeting2({ notes: e.target.value })}
          error={errors.notes}
        />
        <Callout tone="privacy">
          Don't enter real names, grades or confidential company data.
        </Callout>
        <Button type="submit" disabled={flow.running}>
          Prepare my meeting
        </Button>
        <LoadingSteps stepIndex={flow.stepIndex} />
      </form>
    </div>
  );
}
