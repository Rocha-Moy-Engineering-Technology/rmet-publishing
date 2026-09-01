import { describe, expect, test } from 'vitest';

import { countWords, readingMinutes } from '../../logic/text/reading_time';

describe('reading time', () => {
  test('RMET-UNIT-060 counts words separated by any whitespace', () => {
    expect(countWords('one two\nthree\tfour  five')).toBe(5);
  });

  test('RMET-UNIT-061 counts nothing in empty or blank text', () => {
    expect(countWords('   ')).toBe(0);
  });

  test('RMET-UNIT-062 rounds the estimate up to whole minutes', () => {
    expect(readingMinutes('word '.repeat(201))).toBe(2);
  });

  test('RMET-UNIT-063 never reports less than one minute', () => {
    expect(readingMinutes('')).toBe(1);
  });

  test('RMET-UNIT-064 accepts a different reading pace', () => {
    expect(readingMinutes('word '.repeat(100), 50)).toBe(2);
  });
});
