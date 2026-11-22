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
  it('pre-fills meeting 1 and 2 for a persona with both scenarios', () => {
    const session = sessionForPersona('mia', true);
    expect(session.personaId).toBe('mia');
    expect(session.demoMode).toBe(true);
    expect(session.meeting1.notes).not.toBe('');
    expect(session.meeting1.topicIdea).toBe('torn');
    expect(session.meeting2.notes).not.toBe('');
    expect(hasAfterNotes(session.meeting1.after)).toBe(true);
  });

  it('leaves meeting 1 notes empty for a persona who starts at meeting 2', () => {
    const session = sessionForPersona('sara', true);
    expect(session.meeting1.notes).toBe('');
    expect(session.meeting2.notes).not.toBe('');
  });
});

describe('resolvePreparedSheet', () => {
  it("uses the persona's own scenario", () => {
    expect(resolvePreparedSheet(sessionForPersona('mia', true), 1)).toEqual({
      scenarioId: 'S1',
      isExample: false,
    });
    expect(resolvePreparedSheet(sessionForPersona('mia', true), 2)).toEqual({
      scenarioId: 'S4',
      isExample: false,
    });
  });

  it('falls back to an example by topic idea for typed notes (spec 6.3)', () => {
    const typed = (topicIdea: 'one' | 'torn' | 'none') => ({
      ...initialSession,
      meeting1: { ...initialSession.meeting1, topicIdea },
    });
    expect(resolvePreparedSheet(typed('none'), 1)).toEqual({ scenarioId: 'S2', isExample: true });
    expect(resolvePreparedSheet(typed('torn'), 1)).toEqual({ scenarioId: 'S1', isExample: true });
    expect(resolvePreparedSheet(typed('one'), 1)).toEqual({ scenarioId: 'S3', isExample: true });
  });

  it('falls back to an example for a persona step that is hidden', () => {
    expect(resolvePreparedSheet(sessionForPersona('luca', true), 2).isExample).toBe(true);
  });
});
