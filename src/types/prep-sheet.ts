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
  id: string; // 'S1' ... 'S6', 'X4'
  meeting: MeetingKind;
  minutes: number;
  topicIdea: TopicIdea;
  notes: string; // verbatim test input
  /**
   * Context carried over from meeting 1 (follow-up scenarios only).
   * `previousSheetId` is optional because a persona can start at meeting 2
   * (Sara: her kick-off is not part of the prototype).
   */
  context?: { previousSheetId?: string; afterMeetingNotes: string };
  sheetId: string; // coach output (R3)
  baselineText?: string; // verbatim baseline output for the compare view
  baselineAnnotations?: string[];
}

export interface AgendaItem {
  minutes: number;
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
}

export interface SupervisorDecision {
  decision: string;
  options: string[];
}

export interface PrepSheet {
  id: string;
  runId: string; // e.g. 'R3-S1' – links to the test log
  model: string; // e.g. 'Claude Sonnet …, 2026-11-26'
  goal: string;
  clarifyingQuestions?: string[];
  sinceLastTime?: { decided: string[]; carriedOver: string[] };
  agenda: AgendaItem[];
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

export function isPlaceholder(runId: string): boolean {
  return runId === PLACEHOLDER_RUN_ID;
}
