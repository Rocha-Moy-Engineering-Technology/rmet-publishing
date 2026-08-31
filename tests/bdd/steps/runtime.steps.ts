import { expect } from '@playwright/test';
import { createBdd, test } from 'playwright-bdd';

import {
  assertHealth,
  captureRoute,
  htmlRoutes,
  withRuntime,
} from '../../support/runtime-server';

const { Given, When, Then } = createBdd(test);

Given('a built generated Astro application', async () => {});

When('its production runtime is exercised', async () => {});

Then(
  'the health contract and browser routes are available',
  async ({ page }) => {
    await withRuntime(async ({ baseURL }) => {
      await assertHealth(baseURL);
      for (const route of htmlRoutes()) {
        const response = await page.goto(`${baseURL}${route}`);
        expect(response?.status()).toBe(200);
        await expect(page.locator('main')).toBeVisible();
        await captureRoute(page, 'astro-gen-bdd-001', route);
      }
    });
  }
);
