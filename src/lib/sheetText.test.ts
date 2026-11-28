import { describe, expect, it } from 'vitest';
import { getScenario, getSheet } from '../data/index.ts';
import { SHEET_FOOTER, sheetToText } from './sheetText.ts';

function textFor(scenarioId: string) {
  const scenario = getScenario(scenarioId)!;
  const sheet = getSheet(scenario.sheetId)!;
  return { sheet, text: sheetToText(sheet, scenario, 'Kick-off') };
}

describe('sheetToText', () => {
  it('contains all blocks and the footer', () => {
    const { sheet, text } = textFor('S1');
    for (const heading of [
      'Agenda',
      'Questions for your supervisor',
      'Verify first',
      'Your supervisor decides',
      'One next step',
    ]) {
      expect(text).toContain(heading);
    }
    expect(text).toContain('Before I can help');
    expect(text).toContain(sheet.questions[0]!.fromNotes);
    expect(text).toContain('[Must]');
    expect(text).toContain('From your notes:');
    expect(text).toContain('(check: ');
    expect(text).toContain('Option: ');
    expect(text).toContain('minutes planned');
    expect(text.trimEnd().endsWith(SHEET_FOOTER)).toBe(true);
  });

  it('includes since last time for follow-ups only', () => {
    expect(textFor('S6').text).toContain("Decided in meeting 1 (don't reopen):");
    expect(textFor('S1').text).not.toContain('Since last time');
  });

  it('keeps the verbatim agenda times and the clarifying turn', () => {
    expect(textFor('S1').text).toContain('- 0–5 (5 min): Opening and context');
    const x1 = textFor('X1').text;
    expect(x1).toContain('Your notes are a bit thin. Answer these first.');
    expect(x1).toContain('Example answers');
    expect(x1).toContain('Here are my answers:');
    expect(x1).toContain('What I bring');
    expect(x1).not.toContain('Goal:');
  });
});
