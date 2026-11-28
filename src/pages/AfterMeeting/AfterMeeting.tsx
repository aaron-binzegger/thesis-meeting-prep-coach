import { useRef, useState, type FormEvent } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Button } from '../../components/Button/Button.tsx';
import { TextArea } from '../../components/Field/Field.tsx';
import { getPersona, personaScenarioId } from '../../data/index.ts';
import { hasAfterNotes } from '../../state/session.ts';
import { useSession } from '../../state/useSession.ts';
import { useFocusFirstError } from '../MeetingSetup/useFocusFirstError.ts';
import styles from './AfterMeeting.module.css';

export default function AfterMeeting() {
  const { session, updateAfterNotes } = useSession();
  const { after, prepared } = session.meeting1;
  const navigate = useNavigate();
  const [error, setError] = useState<string>();
  const [attempt, setAttempt] = useState(0);
  const formRef = useRef<HTMLFormElement>(null);
  useFocusFirstError(formRef, attempt);
  const persona = getPersona(session.personaId);
  // A demo persona without a real meeting 2 output ends the walkthrough here.
  const meeting2Hidden = Boolean(persona && !personaScenarioId(persona, 2));

  function onSubmit(event: FormEvent) {
    event.preventDefault();
    if (!hasAfterNotes(after)) {
      setError('Add at least one note from your meeting first. A few words are enough.');
      setAttempt((a) => a + 1);
      return;
    }
    navigate(meeting2Hidden ? '/journey' : '/meeting/2/setup');
  }

  function change(patch: Partial<typeof after>) {
    updateAfterNotes(patch);
    setError(undefined);
  }

  return (
    <div className={styles.page}>
      <h1>After your kick-off meeting</h1>
      <p className={styles.intro}>
        Write down what you took away while it is fresh. Meeting 2 builds on these notes.
      </p>
      {!prepared && (
        <p className={styles.note}>
          You have not prepared meeting 1 yet. You can still add notes here, or{' '}
          <Link to="/meeting/1/setup">prepare your kick-off meeting first</Link>.
        </p>
      )}
      <form ref={formRef} className={styles.form} onSubmit={onSubmit} noValidate>
        <TextArea
          label="What was decided?"
          rows={4}
          value={after.decided}
          onChange={(e) => change({ decided: e.target.value })}
          error={error}
        />
        <TextArea
          label="What is still open?"
          rows={4}
          value={after.open}
          onChange={(e) => change({ open: e.target.value })}
        />
        <TextArea
          label="What do I have to do next?"
          rows={4}
          value={after.next}
          onChange={(e) => change({ next: e.target.value })}
        />
        <Button type="submit">
          {meeting2Hidden ? 'Save and go to your journey' : 'Prepare meeting 2'}
        </Button>
      </form>
    </div>
  );
}
