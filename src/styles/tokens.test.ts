import { describe, expect, it } from 'vitest';
import { contrastRatio } from '../lib/contrast.ts';
import tokensCss from './tokens.css?raw';

/** Reads the hex colour tokens declared in tokens.css. */
function readColourTokens(css: string): Record<string, string> {
  const tokens: Record<string, string> = {};
  for (const match of css.matchAll(/--([\w-]+):\s*(#[0-9a-fA-F]{3,6})\s*;/g)) {
    const [, name, value] = match;
    if (name && value) tokens[name] = value;
  }
  return tokens;
}

const tokens = readColourTokens(tokensCss);

function token(name: string): string {
  const value = tokens[name];
  if (!value) throw new Error(`Missing colour token --${name}`);
  return value;
}

const textColours = ['ink', 'ink-muted', 'accent', 'must', 'should', 'iftime'];
const backgrounds = ['paper', 'desk', 'tint'];

describe('design tokens', () => {
  it.each(textColours.flatMap((fg) => backgrounds.map((bg) => [fg, bg] as const)))(
    'text colour --%s has at least 4.5:1 contrast on --%s',
    (fg, bg) => {
      expect(contrastRatio(token(fg), token(bg))).toBeGreaterThanOrEqual(4.5);
    },
  );

  it('button text has at least 4.5:1 contrast on the accent colour', () => {
    expect(contrastRatio(token('on-accent'), token('accent'))).toBeGreaterThanOrEqual(4.5);
    expect(contrastRatio(token('on-accent'), token('accent-strong'))).toBeGreaterThanOrEqual(4.5);
  });

  it('text stays readable on the highlighter', () => {
    expect(contrastRatio(token('ink'), token('highlighter'))).toBeGreaterThanOrEqual(4.5);
  });

  it('the margin line and focus ring reach 3:1 as non-text graphics', () => {
    expect(contrastRatio(token('margin-red'), token('paper'))).toBeGreaterThanOrEqual(3);
    expect(contrastRatio(token('focus'), token('desk'))).toBeGreaterThanOrEqual(3);
    expect(contrastRatio(token('focus'), token('paper'))).toBeGreaterThanOrEqual(3);
  });
});
