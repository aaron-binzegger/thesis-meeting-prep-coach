import { Check } from 'lucide-react';
import { forwardRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { personas } from '../../data/index.ts';
import { useSession } from '../../state/useSession.ts';
import type { Persona } from '../../types/prep-sheet.ts';
import styles from './DemoPanel.module.css';

function coverage(persona: Persona): string {
  if (persona.kickoffScenarioId && persona.followupScenarioId) return 'Kick-off and follow-up';
  return persona.kickoffScenarioId ? 'Kick-off only' : 'Follow-up only';
}

export interface DemoPanelProps {
  id: string;
  /** Called after a persona is picked, so the parent can close the panel. */
  onPicked?: () => void;
}

/** Demo settings: persona choice and the compare switch (spec 6.8). */
export const DemoPanel = forwardRef<HTMLDivElement, DemoPanelProps>(function DemoPanel(
  { id, onPicked },
  ref,
) {
  const { session, selectPersona, setCompareMode } = useSession();
  const navigate = useNavigate();
  const headingId = `${id}-heading`;

  function pick(persona: Persona) {
    selectPersona(persona.id);
    navigate(persona.kickoffScenarioId ? '/meeting/1/setup' : '/meeting/2/setup');
    onPicked?.();
  }

  return (
    <div
      ref={ref}
      id={id}
      tabIndex={-1}
      role="group"
      aria-labelledby={headingId}
      className={styles.panel}
      data-print="hide"
    >
      <h2 id={headingId} className={styles.heading}>
        Demo mode
      </h2>
      <p className={styles.lead}>
        Personas pre-fill every form and the prep sheets with a fictional student.
      </p>

      <button
        type="button"
        role="switch"
        aria-checked={session.compareMode}
        className={styles.compare}
        onClick={() => setCompareMode(!session.compareMode)}
      >
        <span>Compare with a plain AI prompt</span>
        <span className={styles.track} aria-hidden="true">
          <span className={styles.thumb} />
        </span>
      </button>

      <ul className={styles.list}>
        {personas.map((persona) => {
          const selected = session.personaId === persona.id;
          return (
            <li key={persona.id}>
              <button
                type="button"
                className={styles.persona}
                aria-pressed={selected}
                onClick={() => pick(persona)}
              >
                <span className={styles.personaHead}>
                  <span className={styles.name}>{persona.name}</span>
                  {selected && (
                    <span className={styles.selected}>
                      <Check size={16} aria-hidden="true" /> Selected
                    </span>
                  )}
                </span>
                <span>{persona.tagline}</span>
                <span className={styles.meta}>{coverage(persona)}</span>
              </button>
            </li>
          );
        })}
      </ul>

      <button
        type="button"
        className={styles.clear}
        disabled={!session.personaId}
        onClick={() => selectPersona(undefined)}
      >
        Clear persona
      </button>
    </div>
  );
});
