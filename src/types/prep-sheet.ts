/**
 * Data model of the prototype (spec section 8).
 * All content shown in the app comes from JSON files in src/data/ that match these types.
 */

export type MeetingKind = 'kickoff' | 'followup' | 'regular' | 'midterm' | 'presubmission';
export type Priority = 'must' | 'should' | 'if-time';
export type TopicIdea = 'one' | 'torn' | 'none';
export type PersonaId = 'mia' | 'luca' | 'sara' | 'jonas';

/** runId of sheets that are not real R3 outputs yet. The UI shows a dev badge for them. */
export const PLACEHOLDER_RUN_ID = 'PLACEHOLDER';

/** Maximum number of questions for the supervisor on one sheet. */
export const MAX_QUESTIONS = 6;

export interface Persona {
  id: PersonaId;
  name: string;
  tagline: string;
  startingPoint: string;
  kickoffScenarioId?: string;
  followupScenarioId?: string;
}

export interface Scenario {
  id: string; // 'S1' ... 'S6', 'X1', 'X4'
  meeting: MeetingKind;
  minutes: number;
  topicIdea: TopicIdea;
  notes: string; // verbatim test input
  /**
   * Context carried over from meeting 1 (follow-up scenarios only).
   * `previousSheetId` is optional because a persona can start at meeting 2
   * (Sara: her kick-off is not part of the prototype).
   */
  context?: {
    previousSheetId?: string;
    /** Verbatim "prep sheet used last time" that was given to the coach as input. */
    previousSheetText?: string;
    afterMeetingNotes: string;
  };
  sheetId: string; // coach output (R3)
  baselineText?: string; // verbatim baseline output for the compare view
  baselineAnnotations?: string[];
}

export interface AgendaItem {
  /** Length of the item in minutes, used for the total and the time bar. */
  minutes: number;
  /** The minutes cell exactly as the coach wrote it, e.g. "0–5". Shown instead of `minutes`. */
  time?: string;
  topic: string;
  goal: string;
}

export interface SheetQuestion {
  priority: Priority;
  text: string;
  fromNotes: string;
}

export interface VerifyItem {
  item: string;
  whereToCheck: string;
  fromNotes?: string;
}

export interface SupervisorDecision {
  decision: string;
  /** Empty when the coach phrased the decision as one sentence without listed options. */
  options: string[];
}

/** One line of "What I bring", e.g. { label: 'Interests', text: '…' }. */
export interface BringItem {
  label: string;
  text: string;
}

/** Part of a real coach output that fits no other field. Kept verbatim and shown on the sheet. */
export interface ExtraBlock {
  heading: string;
  markdown: string;
}

export interface PrepSheet {
  id: string;
  runId: string; // e.g. 'R3.1-S1' – matches a file in data-source/coach/
  model: string; // e.g. 'Claude Haiku 5.5, medium effort, 2026-11-27'
  /** One-line goal. Real outputs do not have one, so it is optional and never invented. */
  goal?: string;
  /** Verbatim parts of the output that fit no other field (shown at the top of the sheet). */
  extraBlocks?: ExtraBlock[];
  /**
   * Clarifying state (turn 1 of the coach). When set, the sheet first shows only these
   * questions; the rest of the sheet is the coach's turn 2 after `exampleAnswer`.
   */
  clarifyingQuestions?: string[];
  clarifyingLead?: string;
  clarifyingClosing?: string;
  /** The fixed answer that was sent to the coach after turn 1 (verbatim). */
  exampleAnswer?: string;
  whatIBring?: BringItem[];
  sinceLastTime?: { decided: string[]; carriedOver: string[] };
  agenda: AgendaItem[];
  /** Verbatim line under the agenda table, e.g. "Total: 30 minutes." */
  agendaNote?: string;
  questions: SheetQuestion[]; // max 6
  verifyFirst: VerifyItem[];
  supervisorDecides: SupervisorDecision[];
  nextStep: string;
  privacyWarning?: string;
}

/** A meeting type on the Journey screen (spec 6.2). */
export interface MeetingType {
  kind: MeetingKind;
  title: string;
  /** One line shown on the journey card. */
  summary: string;
  /** What the coach does for this meeting type (shown in the "Also available" panel). */
  coachDoes: string[];
  /** Optional example sheet for the "Also available" panel, e.g. X4 for pre-submission. */
  exampleScenarioId?: string;
}

/** Prompt iterations and evaluation results (How it works, Use it in your own AI). */
export interface Comparison {
  /** 'placeholder' until the real evaluation numbers replace this file. */
  status: 'placeholder' | 'final';
  iterations: {
    id: 'baseline' | 'R1' | 'R2' | 'R3';
    name: string;
    change: string;
    keyResult: string;
  }[];
  models: {
    name: string;
    tested: string;
    result: string;
  }[];
  keyResults: { label: string; value: string }[];
}

/**
 * Which example sheet a student sees for their own typed notes (spec 6.3).
 * Lists are in order of preference; the first scenario that is ready wins.
 */
export interface Fallbacks {
  thinNotes: { underWords: number; scenarioId: string };
  kickoff: Record<TopicIdea, string[]>;
  followup: Record<TopicIdea, string[]>;
}

export function isPlaceholder(runId: string): boolean {
  return runId === PLACEHOLDER_RUN_ID;
}
