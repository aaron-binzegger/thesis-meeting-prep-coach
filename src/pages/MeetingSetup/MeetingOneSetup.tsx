import { useRef, useState, type FormEvent } from 'react';
import { Button } from '../../components/Button/Button.tsx';
import { Callout } from '../../components/Callout/Callout.tsx';
import { RadioGroup, TextArea, TextField } from '../../components/Field/Field.tsx';
import { LoadingSteps, usePrepareFlow } from '../../components/LoadingSteps/index.ts';
import { useSession } from '../../state/useSession.ts';
import type { TopicIdea } from '../../types/prep-sheet.ts';
import styles from './MeetingSetup.module.css';
import { useFocusFirstError } from './useFocusFirstError.ts';

const topicOptions: { value: TopicIdea; label: string; description: string }[] = [
  { value: 'one', label: 'Yes, one', description: 'You have a topic and want to test it.' },
  {
    value: 'torn',
    label: "I'm torn between some",
    description: 'You have two or three candidates and need to choose.',
  },
  { value: 'none', label: 'Not yet', description: 'You are still looking for a direction.' },
];

interface Errors {
  minutes?: string;
  topicIdea?: string;
  notes?: string;
}

export default function MeetingOneSetup() {
  const { session, updateMeeting1 } = useSession();
  const { minutes, topicIdea, notes } = session.meeting1;
  const [errors, setErrors] = useState<Errors>({});
  const [attempt, setAttempt] = useState(0);
  const formRef = useRef<HTMLFormElement>(null);
  const flow = usePrepareFlow(1);
  useFocusFirstError(formRef, attempt);

  function onSubmit(event: FormEvent) {
    event.preventDefault();
    if (flow.running) return;
    const next: Errors = {};
    if (!Number.isFinite(minutes) || minutes < 5 || minutes > 120)
      next.minutes = 'Enter a number of minutes between 5 and 120.';
    if (!topicIdea)
      next.topicIdea = 'Choose one of the options, so the coach knows where you start.';
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
      <h1>Prepare your kick-off meeting</h1>
      <p className={styles.intro}>
        Tell the coach where you stand. You get an agenda and questions for your supervisor.
      </p>
      <form ref={formRef} className={styles.form} onSubmit={onSubmit} noValidate>
        <TextField
          label="Minutes available"
          type="number"
          min={5}
          max={120}
          inputMode="numeric"
          value={Number.isNaN(minutes) ? '' : minutes}
          onChange={(e) => updateMeeting1({ minutes: e.target.valueAsNumber })}
          error={errors.minutes}
        />
        <div data-invalid={errors.topicIdea ? 'true' : undefined}>
          <RadioGroup
            legend="Do you already have a topic idea?"
            name="topicIdea"
            options={topicOptions}
            value={topicIdea}
            onChange={(value) => {
              updateMeeting1({ topicIdea: value });
              setErrors((e) => ({ ...e, topicIdea: undefined }));
            }}
          />
          {errors.topicIdea && (
            <p className={styles.fieldError} role="alert">
              {errors.topicIdea}
            </p>
          )}
        </div>
        <TextArea
          label="Your notes"
          hint="Messy notes are fine, and so is mixing German and English."
          value={notes}
          onChange={(e) => updateMeeting1({ notes: e.target.value })}
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
