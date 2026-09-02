import { expect } from '@playwright/test';
import { createBdd, test } from 'playwright-bdd';

import {
  FIXTURE_CONTENT_DIR,
  captureRoute,
  withBuiltRuntime,
  type Runtime,
} from '../../support/runtime-server';

const { Given, When, Then, After } = createBdd(test);

let runtime: Runtime | undefined;
let finish: (() => void) | undefined;
let running: Promise<unknown> | undefined;

Given('the published site is running', async () => {
  const started = new Promise<Runtime>((resolveStarted) => {
    const closed = new Promise<void>((resolveClosed) => {
      finish = resolveClosed;
    });
    running = withBuiltRuntime(
      { contentDir: FIXTURE_CONTENT_DIR },
      async (started) => {
        resolveStarted(started);
        await closed;
      }
    );
  });
  runtime = await started;
});

After(async () => {
  finish?.();
  await running;
  runtime = undefined;
  finish = undefined;
  running = undefined;
});

function baseURL(): string {
  if (!runtime) throw new Error('The runtime was not started');
  return runtime.baseURL;
}

When('the reader opens the landing page', async ({ page }) => {
  await page.goto(`${baseURL()}/`);
  await captureRoute(page, 'rmet-bdd-001', '/');
});

Then(
  'the writings are listed with their publication dates',
  async ({ page }) => {
    const cards = page.locator('[data-testid="post-card"]');
    expect(await cards.count()).toBeGreaterThan(1);
    await expect(cards.first().locator('time')).toBeVisible();
  }
);

Then('the newest piece is listed first', async ({ page }) => {
  const dates = await page
    .locator('[data-testid="post-card"] time')
    .evaluateAll((nodes) => nodes.map((node) => node.getAttribute('datetime')));
  const sorted = [...dates].sort().reverse();
  expect(dates).toEqual(sorted);
});

When(
  'the reader opens the first piece on the landing page',
  async ({ page }) => {
    await page.goto(`${baseURL()}/`);
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
  await captureRoute(page, 'rmet-bdd-002', '/piece');
});

Then(
  'the header links to the resume, GitHub, and LinkedIn',
  async ({ page }) => {
    const header = page.locator('header');
    await expect(header.locator('a[data-testid="resume-link"]')).toBeVisible();
    await expect(header.locator('a[data-testid="github-link"]')).toBeVisible();
    await expect(
      header.locator('a[data-testid="linkedin-link"]')
    ).toBeVisible();
    await expect(
      header.locator('a[data-testid="resume-link"]')
    ).toHaveAttribute(
      'href',
      /rocha-moy-engineering-technology\.github\.io\/resume/
    );
    await captureRoute(page, 'rmet-bdd-003', '/header');
  }
);

When('the reader opens the contact page', async ({ page }) => {
  await page.goto(`${baseURL()}/contact`);
  await captureRoute(page, 'rmet-bdd-004', '/contact');
});

Then('the contact page offers an email route', async ({ page }) => {
  await expect(page.locator('[data-testid="email-link"]')).toBeVisible();
});

Then(
  'the contact page links to GitHub, LinkedIn, and the resume site',
  async ({ page }) => {
    const main = page.locator('main');
    await expect(
      main.locator('a[href*="github.com/phrmoy"]').first()
    ).toBeVisible();
    await expect(
      main.locator('a[href*="linkedin.com/in/phrmoy"]').first()
    ).toBeVisible();
    await expect(main.locator('a[data-testid="resume-link"]')).toBeVisible();
  }
);

When('the reader activates the theme toggle', async ({ page }) => {
  await page.locator('[data-testid="theme-toggle"]').click();
});

Then('the site records the chosen theme', async ({ page }) => {
  const stored = await page.evaluate(() => localStorage.getItem('rmet-theme'));
  expect(stored === 'dark' || stored === 'light').toBe(true);
  await captureRoute(page, 'rmet-bdd-005', '/theme');
});
