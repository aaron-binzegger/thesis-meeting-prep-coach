/**
 * The prompt a student pastes into a chat: the text inside the ```text code block of
 * docs/skill/copy-paste-prompt.md, without the fences. The usage notes around it stay out.
 */
export function promptFromCopyPaste(markdown: string): string {
  const match = /```text\r?\n([\s\S]*?)\r?\n```/.exec(markdown);
  if (!match) throw new Error('copy-paste-prompt.md has no ```text code block');
  return match[1]!;
}
