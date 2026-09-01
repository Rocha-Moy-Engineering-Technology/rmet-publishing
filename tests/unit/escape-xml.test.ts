import { describe, expect, test } from 'vitest';

import { escapeXml } from '../../logic/text/escape_xml';

describe('escapeXml', () => {
  test('RMET-UNIT-040 escapes the five markup-significant characters', () => {
    expect(escapeXml('<a href="x">Tom & Jerry\'s</a>')).toBe(
      '&lt;a href=&quot;x&quot;&gt;Tom &amp; Jerry&apos;s&lt;/a&gt;'
    );
  });

  test('RMET-UNIT-041 escapes ampersands before the other characters', () => {
    expect(escapeXml('&lt;')).toBe('&amp;lt;');
  });

  test('RMET-UNIT-042 leaves plain text untouched', () => {
    expect(escapeXml('plain text')).toBe('plain text');
  });
});
