import { expect } from '@playwright/test';
import { createBdd, test } from 'playwright-bdd';

import {
  captureRoute,
  sharedBaseUrl,
  startSharedRuntime,
  stopSharedRuntime,
} from '../../support/runtime-server';

const { Given, When, Then, After } = createBdd(test);

Given('the published site is running', async () => {
  await startSharedRuntime();
});

After(async () => {
  await stopSharedRuntime();
});

When('the reader opens the writing index', async ({ page }) => {
  await page.goto(`${sharedBaseUrl()}/writing`);
  await captureRoute(page, 'rmet-bdd-001', '/writing');
});

Then(
  'every published piece is listed with its kind and publication date',
  async ({ page }) => {
    const cards = page.locator('[data-testid="post-card"]');
    expect(await cards.count()).toBeGreaterThan(0);
    await expect(
      cards.first().locator('[data-testid="post-kind"]')
    ).toBeVisible();
    await expect(cards.first().locator('time')).toBeVisible();
  }
);

When('the reader opens the papers index', async ({ page }) => {
  await page.goto(`${sharedBaseUrl()}/papers`);
  await captureRoute(page, 'rmet-bdd-002', '/papers');
});

Then('only papers are listed', async ({ page }) => {
  const kinds = page.locator('[data-testid="post-kind"]');
  expect(await kinds.count()).toBeGreaterThan(0);
  for (const label of await kinds.allTextContents()) {
    expect(label.trim().toLowerCase()).toBe('paper');
  }
});

When(
  'the reader opens the first piece on the writing index',
  async ({ page }) => {
    await page.goto(`${sharedBaseUrl()}/writing`);
    await page.locator('[data-testid="post-card"] a').first().click();
    await page.waitForLoadState('domcontentloaded');
  }
);

Then('the piece shows its title and body', async ({ page }) => {
  await expect(page.locator('article h1')).toBeVisible();
  await expect(page.locator('[data-testid="post-body"]')).toBeVisible();
});

Then('the piece offers a comment and reaction area', async ({ page }) => {
  await expect(page.locator('[data-testid="comments"]')).toBeVisible();
  await captureRoute(page, 'rmet-bdd-003', '/post-detail');
});

When('the reader opens the contact page', async ({ page }) => {
  await page.goto(`${sharedBaseUrl()}/contact`);
  await captureRoute(page, 'rmet-bdd-004', '/contact');
});

Then(
  'the contact page links to GitHub, LinkedIn, and the resume site',
  async ({ page }) => {
    await expect(
      page.locator('a[href*="github.com/phrmoy"]').first()
    ).toBeVisible();
    await expect(
      page.locator('a[href*="linkedin.com/in/phrmoy"]').first()
    ).toBeVisible();
    await expect(
      page.locator('a[data-testid="resume-link"]').first()
    ).toBeVisible();
  }
);

Then('the contact page offers an email route', async ({ page }) => {
  await expect(page.locator('[data-testid="email-link"]')).toBeVisible();
});

When('the reader opens the home page', async ({ page }) => {
  await page.goto(`${sharedBaseUrl()}/`);
});

When('the reader activates the theme toggle', async ({ page }) => {
  await page.locator('[data-testid="theme-toggle"]').click();
});

Then('the site records the chosen theme', async ({ page }) => {
  const stored = await page.evaluate(() => localStorage.getItem('rmet-theme'));
  expect(stored === 'dark' || stored === 'light').toBe(true);
  await captureRoute(page, 'rmet-bdd-005', '/theme');
});
