import { describe, expect, it } from 'vitest';
import { contrastRatio, parseHex } from './contrast.ts';

describe('contrast helpers', () => {
  it('parses short and long hex colours', () => {
    expect(parseHex('#fff')).toEqual([255, 255, 255]);
    expect(parseHex('#1b2440')).toEqual([27, 36, 64]);
  });

  it('rejects values that are not hex colours', () => {
    expect(() => parseHex('red')).toThrow();
  });

  it('matches the WCAG reference ratios', () => {
    expect(contrastRatio('#000000', '#ffffff')).toBeCloseTo(21, 5);
    expect(contrastRatio('#ffffff', '#ffffff')).toBeCloseTo(1, 5);
    expect(contrastRatio('#767676', '#ffffff')).toBeCloseTo(4.54, 2);
  });
});
