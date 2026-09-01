import { describe, expect, test } from 'vitest';

import { slugify } from '../../logic/text/slugify';

describe('slugify', () => {
  test('RMET-UNIT-030 lowercases and joins words with hyphens', () => {
    expect(slugify('Agentic Workflows')).toBe('agentic-workflows');
  });

  test('RMET-UNIT-031 strips accents', () => {
    expect(slugify('São Paulo')).toBe('sao-paulo');
  });

  test('RMET-UNIT-032 collapses punctuation and repeated separators', () => {
    expect(slugify('Retrieval --- augmented, generation!')).toBe(
      'retrieval-augmented-generation'
    );
  });

  test('RMET-UNIT-033 trims leading and trailing separators', () => {
    expect(slugify('  -- Papers --  ')).toBe('papers');
  });

  test('RMET-UNIT-034 returns an empty slug for input without words', () => {
    expect(slugify('***')).toBe('');
  });
});
