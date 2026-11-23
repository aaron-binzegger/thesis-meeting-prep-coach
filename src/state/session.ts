/**
 * In-memory session state (spec section 4: React context, no localStorage).
 * Holds what the student entered for meeting 1 and 2, the after-meeting notes,
 * the active demo persona and which scenario's sheet is shown.
 */
import { createContext } from 'react';
import { fallbackScenarioId, getPersona, getScenario } from '../data/index.ts';
import type { PersonaId, TopicIdea } from '../types/prep-sheet.ts';

export type MeetingNumber = 1 | 2;

export interface AfterMeetingNotes {
  decided: string;
  open: string;
  next: string;
}

export interface PreparedSheet {
  scenarioId: string;
  /** True when the sheet is an example for a similar student (own notes typed, spec 6.3). */
  isExample: boolean;
}

export interface MeetingOne {
  minutes: number;
  topicIdea: TopicIdea | undefined;
  notes: string;
  prepared: PreparedSheet | undefined;
  after: AfterMeetingNotes;
}

export interface MeetingTwo {
  minutes: number;
  notes: string;
  prepared: PreparedSheet | undefined;
}

export type MeetingStatus = 'not-prepared' | 'prepared' | 'notes-added';

export interface Session {
  demoMode: boolean;
  personaId: PersonaId | undefined;
  meeting1: MeetingOne;
  meeting2: MeetingTwo;
}

export interface SessionApi {
  session: Session;
  setDemoMode: (on: boolean) => void;
  /** Selects a demo persona and pre-fills all forms; `undefined` clears the persona. */
  selectPersona: (id: PersonaId | undefined) => void;
  updateMeeting1: (patch: Partial<Omit<MeetingOne, 'prepared' | 'after'>>) => void;
  updateAfterNotes: (patch: Partial<AfterMeetingNotes>) => void;
  updateMeeting2: (patch: Partial<Omit<MeetingTwo, 'prepared'>>) => void;
  /** Picks the sheet for a meeting (persona sheet or example) and stores it. */
  prepareMeeting: (meeting: MeetingNumber) => PreparedSheet;
  /** Clears everything, e.g. when leaving demo mode. */
  reset: () => void;
  status: Record<MeetingNumber, MeetingStatus>;
  /** Meeting 2 opens once meeting 1 has after-meeting notes, or always in demo mode. */
  meeting2Unlocked: boolean;
}

export const DEFAULT_MINUTES = 30;
export const emptyAfter: AfterMeetingNotes = { decided: '', open: '', next: '' };

export const initialSession: Session = {
  demoMode: false,
  personaId: undefined,
  meeting1: {
    minutes: DEFAULT_MINUTES,
    topicIdea: undefined,
    notes: '',
    prepared: undefined,
    after: emptyAfter,
  },
  meeting2: { minutes: DEFAULT_MINUTES, notes: '', prepared: undefined },
};

/**
 * Splits after-meeting notes written as "Decided: …", "Open: …", "Next: …" lines
 * into the three form fields. Text without a prefix goes to "decided".
 */
export function parseAfterMeetingNotes(text: string): AfterMeetingNotes {
  const result: AfterMeetingNotes = { decided: '', open: '', next: '' };
  let current: keyof AfterMeetingNotes = 'decided';
  for (const rawLine of text.split('\n')) {
    const line = rawLine.trim();
    if (!line) continue;
    const match = /^(decided|open|next)\s*:\s*(.*)$/i.exec(line);
    if (match) {
      current = match[1]!.toLowerCase() as keyof AfterMeetingNotes;
      if (match[2])
        result[current] = result[current] ? `${result[current]}\n${match[2]}` : match[2];
    } else {
      result[current] = result[current] ? `${result[current]}\n${line}` : line;
    }
  }
  return result;
}

export function hasAfterNotes(after: AfterMeetingNotes): boolean {
  return [after.decided, after.open, after.next].some((v) => v.trim().length > 0);
}

/** Builds the pre-filled session for a demo persona. */
export function sessionForPersona(id: PersonaId, demoMode: boolean): Session {
  const persona = getPersona(id);
  const kickoff = getScenario(persona?.kickoffScenarioId);
  const followup = getScenario(persona?.followupScenarioId);
  return {
    demoMode,
    personaId: id,
    meeting1: {
      minutes: kickoff?.minutes ?? DEFAULT_MINUTES,
      topicIdea: kickoff?.topicIdea ?? followup?.topicIdea,
      notes: kickoff?.notes ?? '',
      prepared: undefined,
      after: followup?.context
        ? parseAfterMeetingNotes(followup.context.afterMeetingNotes)
        : emptyAfter,
    },
    meeting2: {
      minutes: followup?.minutes ?? DEFAULT_MINUTES,
      notes: followup?.notes ?? '',
      prepared: undefined,
    },
  };
}

/** Decides which scenario's sheet a meeting shows (spec 6.3 output behaviour). */
export function resolvePreparedSheet(session: Session, meeting: MeetingNumber): PreparedSheet {
  const persona = getPersona(session.personaId);
  const personaScenarioId =
    meeting === 1 ? persona?.kickoffScenarioId : persona?.followupScenarioId;
  if (personaScenarioId) return { scenarioId: personaScenarioId, isExample: false };
  const topicIdea = session.meeting1.topicIdea ?? 'none';
  return { scenarioId: fallbackScenarioId(meeting, topicIdea), isExample: true };
}

export const SessionContext = createContext<SessionApi | null>(null);
