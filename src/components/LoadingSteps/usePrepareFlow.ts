import { useCallback, useEffect, useRef, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useSession } from '../../state/useSession.ts';
import type { MeetingNumber } from '../../state/session.ts';

export const PREPARE_STEPS = ['Reading your notes…', 'Building your agenda…'] as const;
export const PREPARE_STEP_MS = 600;

/**
 * Runs the short "Prepare my meeting" progress (about 1.2 s), then stores the
 * prepared sheet and opens it. Timers are cleared when the page unmounts.
 */
export function usePrepareFlow(meeting: MeetingNumber) {
  const { prepareMeeting } = useSession();
  const navigate = useNavigate();
  const [stepIndex, setStepIndex] = useState<number | undefined>(undefined);
  const timers = useRef<number[]>([]);

  useEffect(() => {
    const pending = timers.current;
    return () => pending.forEach((t) => window.clearTimeout(t));
  }, []);

  const start = useCallback(() => {
    if (timers.current.length > 0) return;
    setStepIndex(0);
    timers.current.push(
      window.setTimeout(() => setStepIndex(1), PREPARE_STEP_MS),
      window.setTimeout(() => {
        prepareMeeting(meeting);
        navigate(`/meeting/${meeting}/sheet`);
      }, PREPARE_STEP_MS * 2),
    );
  }, [meeting, navigate, prepareMeeting]);

  return { running: stepIndex !== undefined, stepIndex, start };
}
