import { ChevronDown } from 'lucide-react';
import { useId, useRef, useState, type KeyboardEvent } from 'react';
import { getPersona } from '../../data/index.ts';
import { useSession } from '../../state/useSession.ts';
import { DemoPanel } from '../DemoPanel/DemoPanel.tsx';
import { usePersonaParam } from '../DemoPanel/usePersonaParam.ts';
import styles from './DemoSwitch.module.css';

/**
 * Demo mode switch (spec 6.8). Turns demo mode on or off. While on, a disclosure button
 * opens the demo panel with personas and the compare switch.
 */
export function DemoSwitch() {
  const { session, setDemoMode } = useSession();
  const on = session.demoMode;
  const [open, setOpen] = useState(false);
  const panelId = useId();
  const panelRef = useRef<HTMLDivElement>(null);
  const toggleRef = useRef<HTMLButtonElement>(null);
  usePersonaParam();

  const persona = getPersona(session.personaId);

  function openPanel() {
    setOpen(true);
    // Move focus into the panel once it is rendered.
    requestAnimationFrame(() => panelRef.current?.focus({ preventScroll: true }));
  }

  function onSwitch() {
    if (on) {
      setDemoMode(false);
      setOpen(false);
    } else {
      setDemoMode(true);
      openPanel();
    }
  }

  function onKeyDown(event: KeyboardEvent) {
    if (open && event.key === 'Escape') {
      // Keep the mobile menu open; only the panel closes.
      event.stopPropagation();
      setOpen(false);
      toggleRef.current?.focus();
    }
  }

  const showPanel = on && open;

  return (
    // Only listens for Escape bubbling up from the buttons and panel inside.
    // eslint-disable-next-line jsx-a11y/no-static-element-interactions
    <div className={styles.root} onKeyDown={onKeyDown}>
      <div className={styles.controls}>
        <button
          type="button"
          role="switch"
          aria-checked={on}
          className={styles.switch}
          onClick={onSwitch}
        >
          <span>Demo</span>
          <span className={styles.track} aria-hidden="true">
            <span className={styles.thumb} />
          </span>
        </button>
        {on && (
          <button
            ref={toggleRef}
            type="button"
            className={styles.options}
            aria-expanded={showPanel}
            aria-controls={panelId}
            onClick={() => (showPanel ? setOpen(false) : openPanel())}
          >
            {persona ? `Demo: ${persona.name}` : 'Choose persona'}
            <ChevronDown size={18} aria-hidden="true" />
          </button>
        )}
      </div>
      {showPanel && (
        <div className={styles.anchor}>
          <DemoPanel ref={panelRef} id={panelId} onPicked={() => setOpen(false)} />
        </div>
      )}
    </div>
  );
}
