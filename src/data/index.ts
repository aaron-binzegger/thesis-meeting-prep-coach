/**
 * Typed access to the JSON data. Screens import from here, never from the JSON files directly,
 * so the real R3 outputs can replace the placeholder files without UI changes.
 */
import type {
  Comparison,
  MeetingKind,
  MeetingType,
  Persona,
  PersonaId,
  PrepSheet,
  Scenario,
  TopicIdea,
} from '../types/prep-sheet.ts';
import comparisonJson from './comparison.json';
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
 * Prototype rule (spec 6.3): when a student types their own notes, show the sheet
 * of the persona whose starting point matches the topic-idea answer.
 */
const kickoffFallback: Record<TopicIdea, string> = { none: 'S2', torn: 'S1', one: 'S3' };
const followupFallback: Record<TopicIdea, string> = { none: 'S6', torn: 'S4', one: 'S5' };

export function fallbackScenarioId(meeting: 1 | 2, topicIdea: TopicIdea): string {
  return meeting === 1 ? kickoffFallback[topicIdea] : followupFallback[topicIdea];
}
