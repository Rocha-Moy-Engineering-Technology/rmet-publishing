import { describe, expect, test } from 'vitest';

import { serializeHealth } from '../../logic/health';

describe('health payload', () => {
  test('ASTRO-GEN-UNIT-001 returns the exact health payload (A6.14)', () => {
    expect(serializeHealth()).toBe('{"status":"ok"}');
  });
});
