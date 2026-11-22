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
    expect(text).toContain(sheet.goal);
    expect(text).toContain('[Must]');
    expect(text).toContain('From your notes:');
    expect(text).toContain('(check: ');
    expect(text).toContain('Option: ');
    expect(text).toContain('minutes planned');
    expect(text.trimEnd().endsWith(SHEET_FOOTER)).toBe(true);
  });

  it('includes since last time for follow-ups only', () => {
    expect(textFor('S4').text).toContain("Decided in meeting 1 (don't reopen):");
    expect(textFor('S1').text).not.toContain('Since last time');
  });
});
