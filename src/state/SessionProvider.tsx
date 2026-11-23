import { useCallback, useMemo, useState, type ReactNode } from 'react';
import {
  hasAfterNotes,
  initialSession,
  resolvePreparedSheet,
  SessionContext,
  sessionForPersona,
  type AfterMeetingNotes,
  type MeetingNumber,
  type MeetingOne,
  type MeetingStatus,
  type MeetingTwo,
  type Session,
  type SessionApi,
} from './session.ts';
import type { PersonaId } from '../types/prep-sheet.ts';

export function SessionProvider({ children }: { children: ReactNode }) {
  const [session, setSession] = useState<Session>(initialSession);

  const setDemoMode = useCallback((on: boolean) => {
    setSession((s) => (on ? { ...s, demoMode: true } : { ...initialSession }));
  }, []);

  const setCompareMode = useCallback((on: boolean) => {
    setSession((s) => ({ ...s, compareMode: on }));
  }, []);

  const selectPersona = useCallback((id: PersonaId | undefined) => {
    setSession((s) =>
      id
        ? { ...sessionForPersona(id, s.demoMode), compareMode: s.compareMode }
        : { ...initialSession, demoMode: s.demoMode },
    );
  }, []);

  const updateMeeting1 = useCallback((patch: Partial<Omit<MeetingOne, 'prepared' | 'after'>>) => {
    setSession((s) => ({ ...s, meeting1: { ...s.meeting1, ...patch } }));
  }, []);

  const updateAfterNotes = useCallback((patch: Partial<AfterMeetingNotes>) => {
    setSession((s) => ({
      ...s,
      meeting1: { ...s.meeting1, after: { ...s.meeting1.after, ...patch } },
    }));
  }, []);

  const updateMeeting2 = useCallback((patch: Partial<Omit<MeetingTwo, 'prepared'>>) => {
    setSession((s) => ({ ...s, meeting2: { ...s.meeting2, ...patch } }));
  }, []);

  const prepareMeeting = useCallback(
    (meeting: MeetingNumber) => {
      const prepared = resolvePreparedSheet(session, meeting);
      setSession((s) =>
        meeting === 1
          ? { ...s, meeting1: { ...s.meeting1, prepared } }
          : { ...s, meeting2: { ...s.meeting2, prepared } },
      );
      return prepared;
    },
    [session],
  );

  const reset = useCallback(() => setSession(initialSession), []);

  const api = useMemo<SessionApi>(() => {
    const m1After = hasAfterNotes(session.meeting1.after);
    const status: Record<MeetingNumber, MeetingStatus> = {
      1:
        m1After && session.meeting1.prepared
          ? 'notes-added'
          : session.meeting1.prepared
            ? 'prepared'
            : 'not-prepared',
      2: session.meeting2.prepared ? 'prepared' : 'not-prepared',
    };
    return {
      session,
      setDemoMode,
      setCompareMode,
      selectPersona,
      updateMeeting1,
      updateAfterNotes,
      updateMeeting2,
      prepareMeeting,
      reset,
      status,
      meeting2Unlocked: session.demoMode || m1After,
    };
  }, [
    session,
    setDemoMode,
    setCompareMode,
    selectPersona,
    updateMeeting1,
    updateAfterNotes,
    updateMeeting2,
    prepareMeeting,
    reset,
  ]);

  return <SessionContext.Provider value={api}>{children}</SessionContext.Provider>;
}
