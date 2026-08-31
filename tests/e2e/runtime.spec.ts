import { expect, test } from '@playwright/test';

import {
  captureRoute,
  htmlRoutes,
  withRuntime,
} from '../support/runtime-server';

test('ASTRO-GEN-E2E-001 renders every HTML route', async ({ page }) => {
  await withRuntime(async ({ baseURL }) => {
    for (const route of htmlRoutes()) {
      const response = await page.goto(`${baseURL}${route}`);
      expect(response?.status()).toBe(200);
      await expect(page.locator('main')).toBeVisible();
      await captureRoute(page, 'astro-gen-e2e-001', route);
    }
  });
});
