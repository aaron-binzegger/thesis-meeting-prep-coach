import { CheckCircle2, ChevronDown, Circle, Lock, NotebookPen } from 'lucide-react';
import { useId, useState, type ReactNode } from 'react';
import { ButtonLink } from '../../components/Button/Button.tsx';
import { Card } from '../../components/Card/Card.tsx';
import { PrepSheetView } from '../../components/PrepSheet/PrepSheetView.tsx';
import {
  getMeetingType,
  getPersona,
  getReadyScenario,
  getSheet,
  personaScenarioId,
} from '../../data/index.ts';
import type { MeetingStatus } from '../../state/session.ts';
import { useSession } from '../../state/useSession.ts';
import type { MeetingKind, MeetingType } from '../../types/prep-sheet.ts';
import styles from './Journey.module.css';

const statusLabels: Record<MeetingStatus, string> = {
  'not-prepared': 'Not prepared',
  prepared: 'Prepared',
  'notes-added': 'Notes added',
};

const statusIcons: Record<MeetingStatus, ReactNode> = {
  'not-prepared': <Circle size={18} />,
  prepared: <CheckCircle2 size={18} />,
  'notes-added': <NotebookPen size={18} />,
};

const alsoAvailable: MeetingKind[] = ['regular', 'midterm', 'presubmission'];

function StatusLabel({ children, icon }: { children: ReactNode; icon: ReactNode }) {
  return (
    <p className={styles.status}>
      <span aria-hidden="true" className={styles.statusIcon}>
        {icon}
      </span>
      <span>{children}</span>
    </p>
  );
}

function AlsoAvailable({
  type,
  open,
  onToggle,
}: {
  type: MeetingType;
  open: boolean;
  onToggle: () => void;
}) {
  const panelId = useId();
  const [showSheet, setShowSheet] = useState(false);
  const scenario = getReadyScenario(type.exampleScenarioId);
  const sheet = getSheet(scenario?.sheetId);

  return (
    <article className={styles.minor}>
      <h2>
        <button
          type="button"
          className={styles.minorButton}
          aria-expanded={open}
          aria-controls={panelId}
          onClick={onToggle}
        >
          <span>{type.title}</span>
          <ChevronDown size={18} aria-hidden="true" className={styles.chevron} />
        </button>
      </h2>
      <p>{type.summary}</p>
      <p className={styles.badge}>Also available</p>
      <div id={panelId} className={styles.panel} hidden={!open}>
        <h3>What the coach does</h3>
        <ul>
          {type.coachDoes.map((item) => (
            <li key={item}>{item}</li>
          ))}
        </ul>
        <p>This prototype focuses on meetings 1 and 2.</p>
        {scenario && sheet && (
          <details
            className={styles.example}
            onToggle={(event) => setShowSheet(event.currentTarget.open)}
          >
            <summary>Show example sheet</summary>
            {showSheet && (
              <div className={styles.exampleSheet}>
                <PrepSheetView sheet={sheet} scenario={scenario} meetingTitle={type.title} />
              </div>
            )}
          </details>
        )}
      </div>
    </article>
  );
}

export default function Journey() {
  const [openKind, setOpenKind] = useState<MeetingKind | undefined>();
  const { session, status, meeting2Unlocked } = useSession();
  const kickoff = getMeetingType('kickoff');
  const followup = getMeetingType('followup');
  const meeting1Prepared = Boolean(session.meeting1.prepared);
  const meeting2Prepared = Boolean(session.meeting2.prepared);
  // A demo persona only shows the meetings that have a real coach output.
  const persona = getPersona(session.personaId);
  const showMeeting = (meeting: 1 | 2) => !persona || Boolean(personaScenarioId(persona, meeting));

  return (
    <div className={styles.page}>
      <header className={styles.header}>
        <h1>Your thesis meetings</h1>
        <p className={styles.lead}>
          Prepare one meeting at a time. What you note down after meeting 1 carries into meeting 2.
        </p>
      </header>

      <ol className={styles.timeline}>
        {showMeeting(1) && (
          <li className={styles.step}>
            <Card as="article" className={styles.main}>
              <h2>{kickoff?.title ?? 'Meeting 1: Kick-off'}</h2>
              <p>{kickoff?.summary}</p>
              <StatusLabel icon={statusIcons[status[1]]}>{statusLabels[status[1]]}</StatusLabel>
              <div className={styles.actions}>
                {meeting1Prepared ? (
                  <>
                    <ButtonLink to="/meeting/1/sheet">Open your prep sheet</ButtonLink>
                    <ButtonLink to="/meeting/1/after" variant="secondary">
                      Add notes after the meeting
                    </ButtonLink>
                  </>
                ) : (
                  <ButtonLink to="/meeting/1/setup">Prepare meeting 1</ButtonLink>
                )}
              </div>
            </Card>
          </li>
        )}

        {showMeeting(2) && (
          <li className={styles.step}>
            <Card as="article" className={styles.main} tone={meeting2Unlocked ? 'panel' : 'tinted'}>
              <h2>{followup?.title ?? 'Meeting 2: Follow-up'}</h2>
              <p>{followup?.summary}</p>
              {meeting2Unlocked ? (
                <>
                  <StatusLabel icon={statusIcons[status[2]]}>{statusLabels[status[2]]}</StatusLabel>
                  <div className={styles.actions}>
                    {meeting2Prepared ? (
                      <ButtonLink to="/meeting/2/sheet">Open your prep sheet</ButtonLink>
                    ) : (
                      <ButtonLink to="/meeting/2/setup">Prepare meeting 2</ButtonLink>
                    )}
                  </div>
                </>
              ) : (
                <>
                  <StatusLabel icon={<Lock size={18} />}>
                    Locked. Opens after you add notes from meeting 1
                  </StatusLabel>
                  <div className={styles.actions}>
                    <ButtonLink to="/meeting/1/after" variant="secondary">
                      Add notes from meeting 1
                    </ButtonLink>
                  </div>
                </>
              )}
            </Card>
          </li>
        )}

        {alsoAvailable.map((kind) => {
          const type = getMeetingType(kind);
          if (!type) return null;
          return (
            <li key={kind} className={styles.step}>
              <AlsoAvailable
                type={type}
                open={openKind === kind}
                onToggle={() => setOpenKind(openKind === kind ? undefined : kind)}
              />
            </li>
          );
        })}
      </ol>

      <p className={styles.note}>
        This prototype focuses on meetings 1 and 2. The other meetings are shown for context.
      </p>
    </div>
  );
}
