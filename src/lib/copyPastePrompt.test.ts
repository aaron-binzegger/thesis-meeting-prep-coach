import { describe, expect, it } from 'vitest';
import copyPasteFile from '../../docs/skill/copy-paste-prompt.md?raw';
import { promptFromCopyPaste } from './copyPastePrompt.ts';

describe('promptFromCopyPaste', () => {
  it('returns the code block of copy-paste-prompt.md from ROLE to the end', () => {
    const prompt = promptFromCopyPaste(copyPasteFile);
    expect(prompt.startsWith('ROLE\n')).toBe(true);
    expect(prompt.trimEnd().endsWith('toward the supervisor.')).toBe(true);
    expect(prompt).not.toContain('```');
    expect(copyPasteFile).toContain(prompt);
  });

  it('fails loudly when the code block is missing', () => {
    expect(() => promptFromCopyPaste('# no prompt here')).toThrow();
  });
});
