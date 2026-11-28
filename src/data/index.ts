/**
 * Typed access to the JSON data. Screens import from here, never from the JSON files directly,
 * so new real outputs can be added as files without UI changes.
 */
import type {
  Comparison,
  Fallbacks,
  MeetingKind,
  MeetingType,
  Persona,
  PersonaId,
  PrepSheet,
  Scenario,
  TopicIdea,
} from '../types/prep-sheet.ts';
import comparisonJson from './comparison.json';
import fallbacksJson from './fallbacks.json';
import meetingTypesJson from './meeting-types.json';
import personasJson from './personas.json';
import scenariosJson from './scenarios.json';

const sheetModules = import.meta.glob<PrepSheet>('./sheets/*.json', {
  eager: true,
  import: 'default',
});

export const personas = personasJson as Persona[];
export const scenarios = scenariosJson as Scenario[];
export const meetingTypes = meetingTypesJson as MeetingType[];
export const comparison = comparisonJson as Comparison;
export const fallbacks = fallbacksJson as Fallbacks;
export const sheets: PrepSheet[] = Object.values(sheetModules);

export function getPersona(id: PersonaId | string | null | undefined): Persona | undefined {
  return personas.find((persona) => persona.id === id);
}

export function getScenario(id: string | null | undefined): Scenario | undefined {
  return scenarios.find((scenario) => scenario.id === id);
}

export function getSheet(id: string | null | undefined): PrepSheet | undefined {
  return sheets.find((sheet) => sheet.id === id);
}

export function getMeetingType(kind: MeetingKind): MeetingType | undefined {
  return meetingTypes.find((type) => type.kind === kind);
}

/**
 * A scenario is ready when it and its sheet exist. Personas, fallbacks and the
 * "Also available" panels may already point to scenarios whose real output follows
 * later; those stay hidden until the files are added.
 */
export function isScenarioReady(id: string | null | undefined): boolean {
  const scenario = getScenario(id);
  return Boolean(scenario && getSheet(scenario.sheetId));
}

export function getReadyScenario(id: string | null | undefined): Scenario | undefined {
  return isScenarioReady(id) ? getScenario(id) : undefined;
}

/** The persona's scenario for meeting 1 or 2, or undefined if it is hidden for now. */
export function personaScenarioId(
  persona: Persona | undefined,
  meeting: 1 | 2,
): string | undefined {
  const id = meeting === 1 ? persona?.kickoffScenarioId : persona?.followupScenarioId;
  return isScenarioReady(id) ? id : undefined;
}

/** Number of words in the student's notes (for the thin-notes rule). */
export function countWords(text: string): number {
  return text.split(/\s+/).filter(Boolean).length;
}

/**
 * Prototype rule (spec 6.3): when a student types their own notes, show the sheet
 * of a similar student. The mapping lives in fallbacks.json: for each meeting and
 * topic-idea answer, the first ready scenario in the list wins. Very short kick-off
 * notes show the clarifying-questions example instead.
 */
export function fallbackScenarioId(meeting: 1 | 2, topicIdea: TopicIdea, notes = ''): string {
  const { thinNotes } = fallbacks;
  if (
    meeting === 1 &&
    countWords(notes) < thinNotes.underWords &&
    isScenarioReady(thinNotes.scenarioId)
  ) {
    return thinNotes.scenarioId;
  }
  const candidates = fallbacks[meeting === 1 ? 'kickoff' : 'followup'][topicIdea];
  const id = candidates.find(isScenarioReady);
  if (!id) throw new Error(`No ready fallback scenario for meeting ${meeting}, ${topicIdea}`);
  return id;
}
