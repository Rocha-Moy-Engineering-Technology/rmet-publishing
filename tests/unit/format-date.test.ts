import { describe, expect, test } from 'vitest';

import {
  formatDate,
  toIsoDate,
  toRfc822Date,
} from '../../logic/text/format_date';

describe('date formatting', () => {
  test('RMET-UNIT-050 writes a reader-facing date in Coordinated Universal Time', () => {
    expect(formatDate(new Date('2026-09-01T23:30:00.000Z'))).toBe(
      '1 September 2026'
    );
  });

  test('RMET-UNIT-051 writes every month name', () => {
    const months = Array.from({ length: 12 }, (_, index) =>
      formatDate(new Date(Date.UTC(2026, index, 15)))
    );
    expect(months[0]).toBe('15 January 2026');
    expect(months[11]).toBe('15 December 2026');
    expect(new Set(months).size).toBe(12);
  });

  test('RMET-UNIT-052 writes the machine-readable date', () => {
    expect(toIsoDate(new Date('2026-09-01T23:30:00.000Z'))).toBe('2026-09-01');
  });

  test('RMET-UNIT-053 writes the feed date in the syndication format', () => {
    expect(toRfc822Date(new Date('2026-09-01T12:05:09.000Z'))).toBe(
      'Tue, 01 Sep 2026 12:05:09 GMT'
    );
  });
});
