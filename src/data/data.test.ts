import { describe, expect, it } from 'vitest';
import { MAX_QUESTIONS, type PrepSheet, type Scenario } from '../types/prep-sheet.ts';
import fallbacksJson from './fallbacks.json';
import {
  evaluation,
  fallbackScenarioId,
  getScenario,
  getSheet,
  isScenarioReady,
  meetingTypes,
  personas,
  scenarios,
  sheets,
} from './index.ts';
import meetingTypesJson from './meeting-types.json';
import personasJson from './personas.json';
import scenariosJson from './scenarios.json';
import { agendaTotal, validatePersona, validateScenario, validateSheet } from './validate.ts';

import evaluationMd from '../../docs/evaluation.md?raw';

const sheetFiles = import.meta.glob<unknown>('./sheets/*.json', { eager: true, import: 'default' });

/** The real test outputs (spec 8). Every sheet and scenario text is copied from these files. */
const sourceFiles = import.meta.glob<string>('../../data-source/{coach,baseline}/*.md', {
  eager: true,
  query: '?raw',
  import: 'default',
});

interface SourceFile {
  path: string;
  kind: 'coach' | 'baseline';
  text: string;
  frontMatter: Record<string, string>;
}

const sources: SourceFile[] = Object.entries(sourceFiles).map(([path, raw]) => {
  const text = raw.replace(/\r\n/g, '\n');
  const block = /^---\n([\s\S]*?)\n---\n/.exec(text)?.[1] ?? '';
  const frontMatter = Object.fromEntries(
    block.split('\n').map((line) => {
      const at = line.indexOf(':');
      return [line.slice(0, at).trim(), line.slice(at + 1).trim()];
    }),
  );
  return { path, kind: path.includes('/coach/') ? 'coach' : 'baseline', text, frontMatter };
});

const coachSource = (runId: string) =>
  sources.find((s) => s.kind === 'coach' && s.frontMatter.runId === runId);

/**
 * Scenarios whose real output follows later. Personas, fallbacks and meeting types may point
 * to them; the UI hides them until the files exist. Empty now: every output is in data-source/.
 * Listing them here keeps a typo in a link from being hidden silently.
 */
const PENDING_SCENARIOS: string[] = [];

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

const optional = (text: string | undefined) => (text ? [text] : []);

/** Texts on the sheet outside "Verify first". */
function sheetTexts(sheet: PrepSheet): string[] {
  return [
    ...optional(sheet.goal),
    sheet.nextStep,
    ...(sheet.extraBlocks ?? []).flatMap((b) => [b.heading, b.markdown]),
    ...optional(sheet.clarifyingLead),
    ...(sheet.clarifyingQuestions ?? []),
    ...optional(sheet.clarifyingClosing),
    ...optional(sheet.exampleAnswer),
    ...(sheet.whatIBring ?? []).flatMap((b) => [b.label, b.text]),
    ...(sheet.sinceLastTime?.decided ?? []),
    ...(sheet.sinceLastTime?.carriedOver ?? []),
    ...sheet.agenda.flatMap((a) => [...optional(a.time), a.topic, a.goal]),
    ...optional(sheet.agendaNote),
    ...sheet.questions.map((q) => q.text),
    ...sheet.supervisorDecides.flatMap((d) => [d.decision, ...d.options]),
    ...optional(sheet.privacyWarning),
  ];
}

/** Texts under "Verify first". */
function verifyTexts(sheet: PrepSheet): string[] {
  return sheet.verifyFirst.flatMap((v) => [v.item, v.whereToCheck, ...optional(v.fromNotes)]);
}

/** Every text of a sheet, including the quotes from the student's notes. */
function allSheetTexts(sheet: PrepSheet): string[] {
  return [...sheetTexts(sheet), ...verifyTexts(sheet), ...sheet.questions.map((q) => q.fromNotes)];
}

function scenarioForSheet(sheet: PrepSheet): Scenario | undefined {
  return scenarios.find((s) => s.sheetId === sheet.id);
}

/**
 * Finds institutional facts in texts. A match is allowed only if the exact phrase is in the
 * scenario's input notes (the coach repeats the student's own words) AND the sheet shows that
 * phrase under "Verify first". Example: X4 repeats "60 pages" from the notes in a question and
 * lists "whether 60 pages fits it" under Verify first.
 */
function institutionalFacts(
  texts: string[],
  allowed?: { notes: string; verifyFirst: string[] },
): string[] {
  const found: string[] = [];
  for (const text of texts) {
    for (const [name, pattern] of INSTITUTIONAL_FACT_PATTERNS) {
      const match = pattern.exec(text);
      if (!match) continue;
      const phrase = match[0];
      if (
        allowed &&
        allowed.notes.includes(phrase) &&
        allowed.verifyFirst.some((v) => v.includes(phrase))
      ) {
        continue;
      }
      found.push(`${name} "${phrase}" in: "${text}"`);
    }
  }
  return found;
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

  it('evaluation.json has the five prompt versions', () => {
    expect(evaluation.versions.map((v) => v.id)).toEqual(['baseline', 'R1', 'R2', 'R3', 'R3.1']);
  });
});

describe('data rules', () => {
  it('sheet ids match their file names', () => {
    for (const [path, json] of Object.entries(sheetFiles)) {
      const fileId = path.replace('./sheets/', '').replace('.json', '');
      expect((json as { id: string }).id).toBe(fileId);
    }
  });

  it.each(sheets.map((s) => [s.id, s] as const))(
    '%s has at most 6 questions and an agenda within the minutes of its scenario',
    (_, sheet) => {
      expect(sheet.questions.length).toBeLessThanOrEqual(MAX_QUESTIONS);
      const owners = scenarios.filter((s) => s.sheetId === sheet.id);
      expect(owners).toHaveLength(1);
      expect(agendaTotal(sheet)).toBeLessThanOrEqual(owners[0]!.minutes);
    },
  );

  it.each(scenarios.map((s) => [s.id, s] as const))(
    '%s has its sheet, or is pending',
    (_, scenario) => {
      if (!getSheet(scenario.sheetId)) expect(PENDING_SCENARIOS).toContain(scenario.id);
    },
  );

  it('follow-up scenarios carry context, and their sheets show "since last time"', () => {
    for (const scenario of scenarios.filter((s) => s.meeting === 'followup')) {
      expect(scenario.context, scenario.id).toBeDefined();
      if (scenario.context?.previousSheetId) {
        expect(getSheet(scenario.context.previousSheetId), scenario.id).toBeDefined();
      }
      if (!isScenarioReady(scenario.id)) continue;
      expect(getSheet(scenario.sheetId)?.sinceLastTime, scenario.id).toBeDefined();
    }
  });

  it('persona links point to ready scenarios of the right meeting, or to pending ones', () => {
    for (const persona of personas) {
      const links = [
        [persona.kickoffScenarioId, 'kickoff'],
        [persona.followupScenarioId, 'followup'],
      ] as const;
      for (const [id, meeting] of links) {
        if (!id) continue;
        if (isScenarioReady(id)) expect(getScenario(id)?.meeting, persona.id).toBe(meeting);
        else expect(PENDING_SCENARIOS, `${persona.id}: ${id}`).toContain(id);
      }
    }
  });

  it('every persona has at least one ready meeting', () => {
    for (const persona of personas) {
      const ids = [persona.kickoffScenarioId, persona.followupScenarioId];
      expect(
        ids.some((id) => isScenarioReady(id)),
        persona.id,
      ).toBe(true);
    }
  });

  it('the compare view has a baseline with 2 to 4 annotations for S1, S2, S4, S5 and S6', () => {
    for (const id of ['S1', 'S2', 'S4', 'S5', 'S6']) {
      const scenario = getScenario(id);
      expect(scenario?.baselineText, id).toBeTruthy();
      expect(scenario?.baselineAnnotations?.length, id).toBeGreaterThanOrEqual(2);
      expect(scenario?.baselineAnnotations?.length, id).toBeLessThanOrEqual(4);
    }
  });

  it('example scenarios of meeting types are ready or pending', () => {
    for (const type of meetingTypes) {
      const id = type.exampleScenarioId;
      if (id && !isScenarioReady(id)) expect(PENDING_SCENARIOS).toContain(id);
    }
  });

  it('fallbacks.json names ready or pending scenarios of the right meeting', () => {
    const lists = [
      ...Object.values(fallbacksJson.kickoff).map((ids) => [ids, 'kickoff'] as const),
      ...Object.values(fallbacksJson.followup).map((ids) => [ids, 'followup'] as const),
    ];
    for (const [ids, meeting] of lists) {
      expect(
        ids.some((id) => isScenarioReady(id)),
        ids.join(', '),
      ).toBe(true);
      for (const id of ids) {
        if (isScenarioReady(id)) expect(getScenario(id)?.meeting, id).toBe(meeting);
        else expect(PENDING_SCENARIOS, id).toContain(id);
      }
    }
    const thin = getScenario(fallbacksJson.thinNotes.scenarioId);
    expect(thin?.meeting).toBe('kickoff');
    expect(getSheet(thin?.sheetId)?.clarifyingQuestions).toBeDefined();
  });

  it('fallback scenarios for typed notes are ready', () => {
    for (const meeting of [1, 2] as const) {
      for (const idea of ['one', 'torn', 'none'] as const) {
        expect(isScenarioReady(fallbackScenarioId(meeting, idea, 'word '.repeat(20)))).toBe(true);
      }
    }
  });

  it.each(sheets.map((s) => [s.id, s] as const))(
    '%s contains no institutional facts',
    (_, sheet) => {
      const allowed = {
        notes: scenarioForSheet(sheet)?.notes ?? '',
        verifyFirst: verifyTexts(sheet),
      };
      expect(institutionalFacts([...sheetTexts(sheet), ...verifyTexts(sheet)], allowed)).toEqual(
        [],
      );
    },
  );

  it("allows a student's own phrase only if it is in the notes and under Verify first", () => {
    const notes = 'worried 12 credits is too much work';
    const allowed = { notes, verifyFirst: ['Scope of 12 credits'] };
    expect(institutionalFacts(['Scope of 12 credits'], allowed)).toEqual([]);
    expect(institutionalFacts(['Is 12 credits enough?'], allowed)).toEqual([]);
    expect(institutionalFacts(['Scope of 12 credits'])).toHaveLength(1);
    // In the notes, but not under Verify first.
    expect(
      institutionalFacts(['Is 12 credits enough?'], { notes, verifyFirst: ['Workload'] }),
    ).toHaveLength(1);
    // Under Verify first, but not in the notes.
    expect(
      institutionalFacts(['Scope of 15 credits'], { notes, verifyFirst: ['Scope of 15 credits'] }),
    ).toHaveLength(1);
    expect(
      institutionalFacts(['Scope of 12 ECTS'], { notes, verifyFirst: ['Scope of 12 ECTS'] }),
    ).toHaveLength(1);
  });
});

describe('evaluation summary from docs/evaluation.md', () => {
  /** The file as plain text: markdown emphasis removed, line endings normalised. */
  const plain = evaluationMd.replace(/\r\n/g, '\n').replace(/\*/g, '');

  it('copies every text verbatim', () => {
    const texts = [
      ...evaluation.setup,
      ...evaluation.versions.flatMap((v) => [v.name, v.idea, v.hardPasses, v.softAvg]),
      ...evaluation.findings,
      ...evaluation.baselineDoes,
      ...evaluation.limitations.flatMap((l) => [l.title, l.text]),
      ...evaluation.gains,
      evaluation.peerTest.note,
    ];
    expect(texts.filter((text) => !plain.includes(text))).toEqual([]);
  });

  it('has a table row for each version', () => {
    for (const v of evaluation.versions) {
      expect(plain, v.name).toContain(`| ${v.name} | ${v.idea} | ${v.hardPasses} | ${v.softAvg} |`);
    }
  });

  it('shows peer test results only once the file has them', () => {
    expect(evaluation.peerTest.status).toBe(
      plain.includes('To be added: blind A/B comparison') ? 'coming-soon' : 'done',
    );
  });

  it('contains no institutional facts', () => {
    expect(
      institutionalFacts([
        ...evaluation.findings,
        ...evaluation.baselineDoes,
        ...evaluation.limitations.map((l) => l.text),
      ]),
    ).toEqual([]);
  });
});

describe('real outputs from data-source/', () => {
  it('has coach and baseline files', () => {
    expect(sources.filter((s) => s.kind === 'coach').length).toBeGreaterThan(0);
    expect(sources.filter((s) => s.kind === 'baseline').length).toBeGreaterThan(0);
  });

  it('has no placeholder sheets left', () => {
    expect(sheets.filter((s) => s.runId === 'PLACEHOLDER').map((s) => s.id)).toEqual([]);
  });

  it.each(sheets.map((s) => [s.id, s] as const))(
    '%s has a runId that matches a file in data-source/coach/',
    (_, sheet) => {
      const source = coachSource(sheet.runId);
      expect(source, `no data-source/coach file for ${sheet.runId}`).toBeDefined();
      expect(source?.path.endsWith(`/coach/${sheet.runId}.md`)).toBe(true);
    },
  );

  it.each(sheets.map((s) => [s.id, s] as const))(
    '%s takes model, date, scenario and minutes from the front matter',
    (_, sheet) => {
      const fm = coachSource(sheet.runId)?.frontMatter;
      expect(sheet.model).toBe(`${fm?.model}, ${fm?.date}`);
      const scenario = scenarioForSheet(sheet);
      expect(scenario?.id).toBe(fm?.scenario);
      expect(scenario?.minutes).toBe(Number(fm?.minutes));
    },
  );

  it.each(sheets.map((s) => [s.id, s] as const))(
    '%s copies every text verbatim from its source file',
    (_, sheet) => {
      const source = coachSource(sheet.runId)?.text ?? '';
      expect(allSheetTexts(sheet).filter((text) => !source.includes(text))).toEqual([]);
    },
  );

  it.each(scenarios.map((s) => [s.id, s] as const))(
    '%s copies notes, context and baseline verbatim',
    (_, scenario) => {
      const inputs = sources.filter((s) => s.frontMatter.scenario === scenario.id);
      expect(inputs.length).toBeGreaterThan(0);
      const texts = [
        scenario.notes,
        ...optional(scenario.context?.afterMeetingNotes),
        ...optional(scenario.context?.previousSheetText),
      ];
      for (const text of texts) {
        expect(
          inputs.some((s) => s.text.includes(`\n${text}\n`)),
          text.slice(0, 40),
        ).toBe(true);
      }
      if (scenario.baselineText) {
        const baseline = inputs.find((s) => s.kind === 'baseline');
        const output = baseline?.text.split('\n## Output (verbatim)\n')[1]?.trim();
        expect(scenario.baselineText).toBe(output);
      }
    },
  );
});
