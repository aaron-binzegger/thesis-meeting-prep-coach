import { describe, expect, it } from 'vitest';
import {
  hasAfterNotes,
  initialSession,
  parseAfterMeetingNotes,
  resolvePreparedSheet,
  sessionForPersona,
} from './session.ts';

describe('parseAfterMeetingNotes', () => {
  it('splits Decided / Open / Next lines into the three fields', () => {
    expect(
      parseAfterMeetingNotes('Decided: idea B\nOpen: method\nNext: write half a page'),
    ).toEqual({ decided: 'idea B', open: 'method', next: 'write half a page' });
  });

  it('keeps continuation lines with the previous field and ignores case', () => {
    expect(parseAfterMeetingNotes('decided: A\nand also B\nNEXT: read')).toEqual({
      decided: 'A\nand also B',
      open: '',
      next: 'read',
    });
  });

  it('puts unprefixed text into "decided"', () => {
    expect(parseAfterMeetingNotes('we talked a lot').decided).toBe('we talked a lot');
  });
});

describe('hasAfterNotes', () => {
  it('is false for empty or whitespace-only notes', () => {
    expect(hasAfterNotes({ decided: ' ', open: '', next: '\n' })).toBe(false);
    expect(hasAfterNotes({ decided: '', open: 'x', next: '' })).toBe(true);
  });
});

describe('sessionForPersona', () => {
  it('pre-fills the meetings a persona has real outputs for', () => {
    const session = sessionForPersona('mia', true);
    expect(session.personaId).toBe('mia');
    expect(session.demoMode).toBe(true);
    expect(session.meeting1.notes).toContain('HR chatbot for onboarding');
    expect(session.meeting1.topicIdea).toBe('torn');
    // Mia's follow-up (R3.1-S4b) is not there yet, so meeting 2 stays empty.
    expect(session.meeting2.notes).toBe('');
    expect(hasAfterNotes(session.meeting1.after)).toBe(false);
  });

  it('pre-fills the after-meeting notes from the follow-up context', () => {
    const session = sessionForPersona('jonas', true);
    expect(session.meeting1.notes).toBe('');
    expect(session.meeting2.notes).toContain('Candidate models: Llama 3 and Mistral');
    expect(hasAfterNotes(session.meeting1.after)).toBe(true);
  });

  it('leaves meeting 1 notes empty for a persona who starts at meeting 2', () => {
    const session = sessionForPersona('sara', true);
    expect(session.meeting1.notes).toBe('');
    expect(session.meeting2.notes).not.toBe('');
  });
});

const longNotes =
  'two ideas, a chatbot or predictive maintenance, not sure which one fits and what my supervisor expects';

function typed(topicIdea: 'one' | 'torn' | 'none', notes = longNotes) {
  return {
    ...initialSession,
    meeting1: { ...initialSession.meeting1, topicIdea, notes },
    meeting2: { ...initialSession.meeting2, notes },
  };
}

describe('resolvePreparedSheet', () => {
  it("uses the persona's own scenario", () => {
    expect(resolvePreparedSheet(sessionForPersona('mia', true), 1)).toEqual({
      scenarioId: 'S1',
      isExample: false,
    });
    expect(resolvePreparedSheet(sessionForPersona('jonas', true), 2)).toEqual({
      scenarioId: 'S5',
      isExample: false,
    });
  });

  it('falls back to the first ready example of fallbacks.json for typed notes (spec 6.3)', () => {
    expect(resolvePreparedSheet(typed('none'), 1)).toEqual({ scenarioId: 'S2', isExample: true });
    expect(resolvePreparedSheet(typed('torn'), 1)).toEqual({ scenarioId: 'S1', isExample: true });
    // S3 is not there yet, so the next entry in the list is used.
    expect(resolvePreparedSheet(typed('one'), 1)).toEqual({ scenarioId: 'S1', isExample: true });
    expect(resolvePreparedSheet(typed('none'), 2)).toEqual({ scenarioId: 'S6', isExample: true });
    // S4b is not there yet, so S5 (same content) is used.
    expect(resolvePreparedSheet(typed('torn'), 2)).toEqual({ scenarioId: 'S5', isExample: true });
    expect(resolvePreparedSheet(typed('one'), 2)).toEqual({ scenarioId: 'S5', isExample: true });
  });

  it('shows the clarifying example (X1) for typed kick-off notes under 15 words', () => {
    const fourteen =
      'one two three four five six seven eight nine ten eleven twelve thirteen fourteen';
    expect(resolvePreparedSheet(typed('one', fourteen), 1)).toEqual({
      scenarioId: 'X1',
      isExample: true,
    });
    expect(resolvePreparedSheet(typed('one', `${fourteen} fifteen`), 1).scenarioId).not.toBe('X1');
    // Only for the kick-off: X1 is a kick-off output.
    expect(resolvePreparedSheet(typed('none', fourteen), 2).scenarioId).toBe('S6');
  });

  it('falls back to an example for a persona step that is hidden', () => {
    expect(resolvePreparedSheet(sessionForPersona('luca', true), 2).isExample).toBe(true);
  });
});
