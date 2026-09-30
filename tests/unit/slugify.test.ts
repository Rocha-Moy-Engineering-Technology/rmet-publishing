import { describe, expect, test } from 'vitest';

import { SLUG_UNICODE_VERSION, slugify } from '../../logic/text/slugify';

describe('slugify', () => {
  test('RMET-UNIT-030 lowercases and joins words with hyphens (A6.19)', () => {
    expect(slugify('Agentic Workflows')).toBe('agentic-workflows');
  });

  test('RMET-UNIT-031 strips accents (A6.19)', () => {
    expect(slugify('São Paulo')).toBe('sao-paulo');
  });

  test('RMET-UNIT-032 collapses punctuation and repeated separators (A6.19)', () => {
    expect(slugify('Retrieval --- augmented, generation!')).toBe(
      'retrieval-augmented-generation'
    );
  });

  test('RMET-UNIT-033 trims leading and trailing separators (A6.19)', () => {
    expect(slugify('  -- Papers --  ')).toBe('papers');
  });

  test('RMET-UNIT-034 returns an empty slug for input without words (A6.19)', () => {
    expect(slugify('***')).toBe('');
  });

  test('RMET-UNIT-035 runs on the Unicode version the slug rule is pinned to', () => {
    expect(process.versions.unicode).toBe(SLUG_UNICODE_VERSION);
  });
});
