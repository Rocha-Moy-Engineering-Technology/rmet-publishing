import { describe, expect, test } from 'vitest';

import { readSetting } from '../../logic/site/settings';

describe('reading a configuration setting', () => {
  test('RMET-UNIT-170 returns a value that carries content (A6.22)', () => {
    expect(readSetting({ KEY: 'value' }, 'KEY')).toBe('value');
  });

  test('RMET-UNIT-171 trims the value it returns (A6.22)', () => {
    expect(readSetting({ KEY: '  value  ' }, 'KEY')).toBe('value');
  });

  test('RMET-UNIT-172 treats an absent key as unset (A6.22)', () => {
    expect(readSetting({}, 'KEY')).toBeUndefined();
  });

  test('RMET-UNIT-173 treats an empty or blank value as unset (A6.22)', () => {
    expect(readSetting({ KEY: '' }, 'KEY')).toBeUndefined();
    expect(readSetting({ KEY: '   ' }, 'KEY')).toBeUndefined();
  });

  test('RMET-UNIT-174 treats an explicitly undefined value as unset (A6.22)', () => {
    expect(readSetting({ KEY: undefined }, 'KEY')).toBeUndefined();
  });
});
