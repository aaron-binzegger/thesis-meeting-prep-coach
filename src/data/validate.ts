/**
 * Runtime validation of the JSON data against the types in src/types/prep-sheet.ts.
 * Used by the data test so that swapping in the real R3 outputs fails loudly
 * if a file does not match. Returns a list of readable problems (empty = valid).
 */
import { MAX_QUESTIONS } from '../types/prep-sheet.ts';

type Json = unknown;
type Problems = string[];

const MEETING_KINDS = ['kickoff', 'followup', 'regular', 'midterm', 'presubmission'];
const PRIORITIES = ['must', 'should', 'if-time'];
const TOPIC_IDEAS = ['one', 'torn', 'none'];
const PERSONA_IDS = ['mia', 'luca', 'sara', 'jonas'];
const PRIORITY_ORDER: Record<string, number> = { must: 0, should: 1, 'if-time': 2 };

function isObject(value: Json): value is Record<string, Json> {
  return typeof value === 'object' && value !== null && !Array.isArray(value);
}

function isNonEmptyString(value: Json): value is string {
  return typeof value === 'string' && value.trim().length > 0;
}

function isStringArray(value: Json): value is string[] {
  return Array.isArray(value) && value.every(isNonEmptyString);
}

/** Checks required/optional keys and flags unknown ones. */
function checkKeys(
  where: string,
  value: Record<string, Json>,
  required: string[],
  optional: string[],
  problems: Problems,
) {
  for (const key of required) {
    if (!(key in value)) problems.push(`${where}: missing "${key}"`);
  }
  for (const key of Object.keys(value)) {
    if (!required.includes(key) && !optional.includes(key)) {
      problems.push(`${where}: unknown field "${key}"`);
    }
  }
}

export function validatePersona(value: Json, where = 'persona'): Problems {
  const problems: Problems = [];
  if (!isObject(value)) return [`${where}: not an object`];
  checkKeys(
    where,
    value,
    ['id', 'name', 'tagline', 'startingPoint'],
    ['kickoffScenarioId', 'followupScenarioId'],
    problems,
  );
  if (!PERSONA_IDS.includes(value.id as string)) problems.push(`${where}: invalid id`);
  for (const key of ['name', 'tagline', 'startingPoint']) {
    if (!isNonEmptyString(value[key])) problems.push(`${where}: "${key}" must be text`);
  }
  for (const key of ['kickoffScenarioId', 'followupScenarioId']) {
    if (key in value && !isNonEmptyString(value[key])) {
      problems.push(`${where}: "${key}" must be text`);
    }
  }
  return problems;
}

export function validateScenario(value: Json, where = 'scenario'): Problems {
  const problems: Problems = [];
  if (!isObject(value)) return [`${where}: not an object`];
  checkKeys(
    where,
    value,
    ['id', 'meeting', 'minutes', 'topicIdea', 'notes', 'sheetId'],
    ['context', 'baselineText', 'baselineAnnotations'],
    problems,
  );
  if (!isNonEmptyString(value.id)) problems.push(`${where}: "id" must be text`);
  if (!MEETING_KINDS.includes(value.meeting as string)) problems.push(`${where}: invalid meeting`);
  if (typeof value.minutes !== 'number' || value.minutes <= 0) {
    problems.push(`${where}: "minutes" must be a positive number`);
  }
  if (!TOPIC_IDEAS.includes(value.topicIdea as string))
    problems.push(`${where}: invalid topicIdea`);
  if (!isNonEmptyString(value.notes)) problems.push(`${where}: "notes" must be text`);
  if (!isNonEmptyString(value.sheetId)) problems.push(`${where}: "sheetId" must be text`);
  if ('context' in value) {
    const context = value.context;
    if (!isObject(context)) {
      problems.push(`${where}.context: not an object`);
    } else {
      checkKeys(
        `${where}.context`,
        context,
        ['afterMeetingNotes'],
        ['previousSheetId', 'previousSheetText'],
        problems,
      );
      if (!isNonEmptyString(context.afterMeetingNotes)) {
        problems.push(`${where}.context: "afterMeetingNotes" must be text`);
      }
      for (const key of ['previousSheetId', 'previousSheetText']) {
        if (key in context && !isNonEmptyString(context[key])) {
          problems.push(`${where}.context: "${key}" must be text`);
        }
      }
    }
  }
  if ('baselineText' in value && !isNonEmptyString(value.baselineText)) {
    problems.push(`${where}: "baselineText" must be text`);
  }
  if ('baselineAnnotations' in value && !isStringArray(value.baselineAnnotations)) {
    problems.push(`${where}: "baselineAnnotations" must be a list of texts`);
  }
  return problems;
}

export function validateSheet(value: Json, where = 'sheet'): Problems {
  const problems: Problems = [];
  if (!isObject(value)) return [`${where}: not an object`];
  checkKeys(
    where,
    value,
    ['id', 'runId', 'model', 'agenda', 'questions', 'verifyFirst', 'supervisorDecides', 'nextStep'],
    [
      'goal',
      'extraBlocks',
      'clarifyingQuestions',
      'clarifyingLead',
      'clarifyingClosing',
      'exampleAnswer',
      'whatIBring',
      'sinceLastTime',
      'agendaNote',
      'privacyWarning',
    ],
    problems,
  );
  for (const key of ['id', 'runId', 'model', 'nextStep']) {
    if (!isNonEmptyString(value[key])) problems.push(`${where}: "${key}" must be text`);
  }
  for (const key of [
    'goal',
    'clarifyingLead',
    'clarifyingClosing',
    'exampleAnswer',
    'agendaNote',
  ]) {
    if (key in value && !isNonEmptyString(value[key])) {
      problems.push(`${where}: "${key}" must be text`);
    }
  }
  const clarifyingKeys = ['clarifyingLead', 'clarifyingClosing', 'exampleAnswer'];
  if (clarifyingKeys.some((key) => key in value) && !('clarifyingQuestions' in value)) {
    problems.push(`${where}: clarifying texts need "clarifyingQuestions"`);
  }
  if ('clarifyingQuestions' in value && !('exampleAnswer' in value)) {
    problems.push(`${where}: "clarifyingQuestions" need an "exampleAnswer" to reach the sheet`);
  }

  for (const [key, fields] of [
    ['extraBlocks', ['heading', 'markdown']],
    ['whatIBring', ['label', 'text']],
  ] as const) {
    if (!(key in value)) continue;
    const list = value[key];
    if (!Array.isArray(list) || list.length === 0) {
      problems.push(`${where}: "${key}" must be a non-empty list`);
      continue;
    }
    list.forEach((entry, i) => {
      const at = `${where}.${key}[${i}]`;
      if (!isObject(entry)) return problems.push(`${at}: not an object`);
      checkKeys(at, entry, [...fields], [], problems);
      for (const field of fields) {
        if (!isNonEmptyString(entry[field])) problems.push(`${at}: "${field}" must be text`);
      }
    });
  }

  if (!Array.isArray(value.agenda) || value.agenda.length === 0) {
    problems.push(`${where}: "agenda" must be a non-empty list`);
  } else {
    value.agenda.forEach((item, i) => {
      const at = `${where}.agenda[${i}]`;
      if (!isObject(item)) return problems.push(`${at}: not an object`);
      checkKeys(at, item, ['minutes', 'topic', 'goal'], ['time'], problems);
      if ('time' in item && !isNonEmptyString(item.time)) {
        problems.push(`${at}: "time" must be text`);
      }
      if (typeof item.minutes !== 'number' || item.minutes <= 0) {
        problems.push(`${at}: "minutes" must be a positive number`);
      }
      if (!isNonEmptyString(item.topic) || !isNonEmptyString(item.goal)) {
        problems.push(`${at}: "topic" and "goal" must be text`);
      }
    });
  }

  if (!Array.isArray(value.questions)) {
    problems.push(`${where}: "questions" must be a list`);
  } else {
    if (value.questions.length > MAX_QUESTIONS) {
      problems.push(`${where}: ${value.questions.length} questions, at most ${MAX_QUESTIONS}`);
    }
    let lastOrder = 0;
    value.questions.forEach((q, i) => {
      const at = `${where}.questions[${i}]`;
      if (!isObject(q)) return problems.push(`${at}: not an object`);
      checkKeys(at, q, ['priority', 'text', 'fromNotes'], [], problems);
      if (!PRIORITIES.includes(q.priority as string)) problems.push(`${at}: invalid priority`);
      if (!isNonEmptyString(q.text) || !isNonEmptyString(q.fromNotes)) {
        problems.push(`${at}: "text" and "fromNotes" must be text`);
      }
      const order = PRIORITY_ORDER[q.priority as string] ?? 0;
      if (order < lastOrder)
        problems.push(`${at}: questions must be ordered must, should, if time`);
      lastOrder = order;
    });
  }

  if (!Array.isArray(value.verifyFirst)) {
    problems.push(`${where}: "verifyFirst" must be a list`);
  } else {
    value.verifyFirst.forEach((v, i) => {
      const at = `${where}.verifyFirst[${i}]`;
      if (!isObject(v)) return problems.push(`${at}: not an object`);
      checkKeys(at, v, ['item', 'whereToCheck'], ['fromNotes'], problems);
      if ('fromNotes' in v && !isNonEmptyString(v.fromNotes)) {
        problems.push(`${at}: "fromNotes" must be text`);
      }
      if (!isNonEmptyString(v.item) || !isNonEmptyString(v.whereToCheck)) {
        problems.push(`${at}: "item" and "whereToCheck" must be text`);
      }
    });
  }

  if (!Array.isArray(value.supervisorDecides)) {
    problems.push(`${where}: "supervisorDecides" must be a list`);
  } else {
    value.supervisorDecides.forEach((d, i) => {
      const at = `${where}.supervisorDecides[${i}]`;
      if (!isObject(d)) return problems.push(`${at}: not an object`);
      checkKeys(at, d, ['decision', 'options'], [], problems);
      if (!isNonEmptyString(d.decision)) problems.push(`${at}: "decision" must be text`);
      if (!isStringArray(d.options) || d.options.length === 1) {
        problems.push(`${at}: "options" must be empty or list at least two options`);
      }
    });
  }

  if ('clarifyingQuestions' in value && !isStringArray(value.clarifyingQuestions)) {
    problems.push(`${where}: "clarifyingQuestions" must be a list of texts`);
  }
  if ('sinceLastTime' in value) {
    const since = value.sinceLastTime;
    if (!isObject(since) || !isStringArray(since.decided) || !isStringArray(since.carriedOver)) {
      problems.push(`${where}: "sinceLastTime" needs "decided" and "carriedOver" lists`);
    }
  }
  if ('privacyWarning' in value && !isNonEmptyString(value.privacyWarning)) {
    problems.push(`${where}: "privacyWarning" must be text`);
  }
  return problems;
}

/** Sum of agenda minutes; callers compare it with the scenario's minutes. */
export function agendaTotal(sheet: { agenda: { minutes: number }[] }): number {
  return sheet.agenda.reduce((sum, item) => sum + item.minutes, 0);
}
