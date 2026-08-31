import { describe, expect, test } from 'vitest';

import { GET } from '../../state/adapters/inbound/pages/health';

describe('health route adapter', () => {
  test('ASTRO-GEN-INTEGRATION-001 returns the public health contract', async () => {
    const response = await GET({} as Parameters<typeof GET>[0]);
    expect(response.status).toBe(200);
    expect(response.headers.get('content-type')).toBe('application/json');
    expect(await response.text()).toBe('{"status":"ok"}');
  });
});
