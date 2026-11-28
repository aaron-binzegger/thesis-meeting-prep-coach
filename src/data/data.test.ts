import { describe, expect, it } from 'vitest';
import { MAX_QUESTIONS } from '../types/prep-sheet.ts';
import comparisonJson from './comparison.json';
import {
  comparison,
  fallbackScenarioId,
  getScenario,
  getSheet,
  meetingTypes,
  personas,
  scenarios,
  sheets,
} from './index.ts';
import meetingTypesJson from './meeting-types.json';
import personasJson from './personas.json';
import scenariosJson from './scenarios.json';
import { agendaTotal, validatePersona, validateScenario, validateSheet } from './validate.ts';

const sheetFiles = import.meta.glob<unknown>('./sheets/*.json', { eager: true, import: 'default' });

/**
 * Patterns that would be institutional facts in a coach sheet (zero-institution-facts policy):
 * dates, deadlines with values, page or word limits, credits.
 */
const INSTITUTIONAL_FACT_PATTERNS: [string, RegExp][] = [
  ['date like 12.03.', /\b\d{1,2}\.\s?\d{1,2}\.(\d{2,4})?/],
  ['date like 2026-03-12', /\b\d{4}-\d{2}-\d{2}\b/],
  [
    'month name with a day',
    /\b\d{1,2}(st|nd|rd|th)?\s+(January|February|March|April|May|June|July|August|September|October|November|December)\b/i,
  ],
  ['page or word count', /\b\d+\s*(pages?|words?|Seiten)\b/i],
  ['credits', /\b\d+\s*(ECTS|credits?)\b/i],
  ['deadline with a value', /\bdeadline\b[^.]{0,20}\d/i],
];

function sheetTexts(sheet: (typeof sheets)[number]): string[] {
  return [
    ...(sheet.goal ? [sheet.goal] : []),
    sheet.nextStep,
    ...(sheet.clarifyingQuestions ?? []),
    ...(sheet.sinceLastTime?.decided ?? []),
    ...(sheet.sinceLastTime?.carriedOver ?? []),
    ...sheet.agenda.flatMap((a) => [a.topic, a.goal]),
    ...sheet.questions.map((q) => q.text),
    ...sheet.verifyFirst.flatMap((v) => [v.item, v.whereToCheck]),
    ...sheet.supervisorDecides.flatMap((d) => [d.decision, ...d.options]),
    ...(sheet.privacyWarning ? [sheet.privacyWarning] : []),
  ];
}

describe('data files match the types', () => {
  it('personas.json', () => {
    expect(Array.isArray(personasJson)).toBe(true);
    expect(personasJson.flatMap((p, i) => validatePersona(p, `persona[${i}]`))).toEqual([]);
  });

  it('scenarios.json', () => {
    expect(Array.isArray(scenariosJson)).toBe(true);
    expect(scenariosJson.flatMap((s, i) => validateScenario(s, `scenario[${i}]`))).toEqual([]);
  });

  it.each(Object.entries(sheetFiles))('%s', (path, json) => {
    expect(validateSheet(json, path)).toEqual([]);
  });

  it('meeting-types.json lists every meeting kind once', () => {
    const kinds = meetingTypesJson.map((m) => m.kind).sort();
    expect(kinds).toEqual(['followup', 'kickoff', 'midterm', 'presubmission', 'regular']);
  });

  it('comparison.json has the four prompt iterations', () => {
    expect(comparisonJson.iterations.map((i) => i.id)).toEqual(['baseline', 'R1', 'R2', 'R3']);
  });
});

describe('data rules', () => {
  it('sheet ids match their file names', () => {
    for (const [path, json] of Object.entries(sheetFiles)) {
      const fileId = path.replace('./sheets/', '').replace('.json', '');
      expect((json as { id: string }).id).toBe(fileId);
    }
  });

  it.each(scenarios.map((s) => [s.id, s] as const))(
    '%s: sheet exists, has at most 6 questions and the agenda fits the minutes',
    (_, scenario) => {
      const sheet = getSheet(scenario.sheetId);
      expect(sheet, `sheet ${scenario.sheetId}`).toBeDefined();
      if (!sheet) return;
      expect(sheet.questions.length).toBeLessThanOrEqual(MAX_QUESTIONS);
      expect(agendaTotal(sheet)).toBeLessThanOrEqual(scenario.minutes);
    },
  );

  it('follow-up scenarios carry context, and their sheets show "since last time"', () => {
    for (const scenario of scenarios.filter((s) => s.meeting === 'followup')) {
      expect(scenario.context, scenario.id).toBeDefined();
      if (scenario.context?.previousSheetId) {
        expect(getSheet(scenario.context.previousSheetId), scenario.id).toBeDefined();
      }
      expect(getSheet(scenario.sheetId)?.sinceLastTime, scenario.id).toBeDefined();
    }
  });

  it('persona scenario links point to existing scenarios of the right meeting', () => {
    for (const persona of personas) {
      if (persona.kickoffScenarioId) {
        expect(getScenario(persona.kickoffScenarioId)?.meeting, persona.id).toBe('kickoff');
      }
      if (persona.followupScenarioId) {
        expect(getScenario(persona.followupScenarioId)?.meeting, persona.id).toBe('followup');
      }
    }
  });

  it('the compare view has baseline output for S1, S2 and S4', () => {
    for (const id of ['S1', 'S2', 'S4']) {
      const scenario = getScenario(id);
      expect(scenario?.baselineText, id).toBeTruthy();
      expect(scenario?.baselineAnnotations?.length, id).toBeGreaterThan(0);
    }
  });

  it('example scenarios of meeting types exist', () => {
    for (const type of meetingTypes) {
      if (type.exampleScenarioId) expect(getScenario(type.exampleScenarioId)).toBeDefined();
    }
  });

  it('fallback scenarios for typed notes exist', () => {
    for (const meeting of [1, 2] as const) {
      for (const idea of ['one', 'torn', 'none'] as const) {
        expect(getScenario(fallbackScenarioId(meeting, idea))).toBeDefined();
      }
    }
  });

  it.each(sheets.map((s) => [s.id, s] as const))(
    '%s contains no institutional facts',
    (_, sheet) => {
      for (const text of sheetTexts(sheet)) {
        for (const [name, pattern] of INSTITUTIONAL_FACT_PATTERNS) {
          expect(pattern.test(text), `${name} in: "${text}"`).toBe(false);
        }
      }
    },
  );

  it('comparison status is set', () => {
    expect(['placeholder', 'final']).toContain(comparison.status);
  });
});
