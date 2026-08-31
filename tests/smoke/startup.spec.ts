import { expect, test } from '@playwright/test';

import {
  assertHealth,
  htmlRoutes,
  withRuntime,
} from '../support/runtime-server';

test('ASTRO-GEN-SMOKE-001 starts the production application', async ({
  request,
}) => {
  await withRuntime(async ({ baseURL }) => {
    await assertHealth(baseURL);
    for (const route of htmlRoutes()) {
      const response = await request.get(`${baseURL}${route}`);
      expect(response.status()).toBe(200);
    }
  });
});
