import { priorityLabels } from '../components/PriorityBadge/priority.ts';
import {
  MAX_QUESTIONS,
  type Priority,
  type PrepSheet,
  type Scenario,
} from '../types/prep-sheet.ts';

export const SHEET_FOOTER =
  'Prepared by the Thesis Meeting Prep Coach. Not official university advice. Check with your supervisor.';

const priorityOrder: Priority[] = ['must', 'should', 'if-time'];

/** Plain-text version of a prep sheet, for "Copy as text". */
export function sheetToText(sheet: PrepSheet, scenario: Scenario, meetingTitle: string): string {
  const lines: string[] = [];
  const heading = (text: string) => lines.push('', text, '-'.repeat(text.length));

  lines.push(`${meetingTitle} (${scenario.minutes} minutes)`, '='.repeat(meetingTitle.length + 13));
  if (sheet.goal) lines.push('', `Goal: ${sheet.goal}`);

  if (sheet.privacyWarning) lines.push('', `Note: ${sheet.privacyWarning}`);

  for (const extra of sheet.extraBlocks ?? []) {
    heading(extra.heading);
    lines.push(extra.markdown);
  }

  if (sheet.clarifyingQuestions?.length) {
    heading('Clarifying questions');
    lines.push('Your notes are a bit thin. Answer these first.');
    if (sheet.clarifyingLead) lines.push(sheet.clarifyingLead);
    sheet.clarifyingQuestions.forEach((q, i) => lines.push(`${i + 1}. ${q}`));
    if (sheet.clarifyingClosing) lines.push(sheet.clarifyingClosing);
    if (sheet.exampleAnswer) {
      heading('Example answers');
      lines.push(sheet.exampleAnswer);
    }
  }

  if (sheet.whatIBring) {
    heading('What I bring');
    sheet.whatIBring.forEach((item) => lines.push(`- ${item.label}: ${item.text}`));
  }

  if (sheet.sinceLastTime) {
    heading('Since last time');
    lines.push("Decided in meeting 1 (don't reopen):");
    sheet.sinceLastTime.decided.forEach((d) => lines.push(`- ${d}`));
    lines.push('Carried over:');
    sheet.sinceLastTime.carriedOver.forEach((d) => lines.push(`- ${d}`));
  }

  heading('Agenda');
  let total = 0;
  sheet.agenda.forEach((item) => {
    total += item.minutes;
    const time = item.time ? `${item.time} (${item.minutes} min)` : `${item.minutes} min`;
    lines.push(`- ${time}: ${item.topic} (${item.goal})`);
  });
  if (sheet.agendaNote) lines.push(sheet.agendaNote);
  lines.push(`Total: ${total} of ${scenario.minutes} minutes planned`);

  heading('Questions for your supervisor');
  let n = 1;
  for (const priority of priorityOrder) {
    for (const q of sheet.questions
      .slice(0, MAX_QUESTIONS)
      .filter((x) => x.priority === priority)) {
      lines.push(`${n}. [${priorityLabels[priority]}] ${q.text}`);
      lines.push(`   From your notes: ${q.fromNotes}`);
      n += 1;
    }
  }

  heading('Verify first');
  sheet.verifyFirst.forEach((v) => {
    lines.push(`- ${v.item} (check: ${v.whereToCheck})`);
    if (v.fromNotes) lines.push(`  From your notes: ${v.fromNotes}`);
  });

  heading('Your supervisor decides');
  sheet.supervisorDecides.forEach((d) => {
    lines.push(`- ${d.decision}`);
    d.options.forEach((o) => lines.push(`  * Option: ${o}`));
  });

  heading('One next step');
  lines.push(sheet.nextStep);

  lines.push('', SHEET_FOOTER);
  return lines.join('\n') + '\n';
}
