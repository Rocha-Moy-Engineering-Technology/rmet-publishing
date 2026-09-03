import { expect } from '@playwright/test';
import { createBdd, test } from 'playwright-bdd';

import {
  FIXTURE_CONTENT_DIR,
  FIXTURE_SUBSCRIBE_ACTION,
  FIXTURE_SUBSCRIBE_EMAIL_FIELD,
  captureRoute,
  withBuiltRuntime,
  type Runtime,
} from '../../support/runtime-server';

const { Given, When, Then, After } = createBdd(test);

const READER_EMAIL = 'reader@example.com';

let runtime: Runtime | undefined;
let finish: (() => void) | undefined;
let running: Promise<unknown> | undefined;
let providerPost: string | undefined;

Given('the published site is running', async () => {
  const started = new Promise<Runtime>((resolveStarted) => {
    const closed = new Promise<void>((resolveClosed) => {
      finish = resolveClosed;
    });
    running = withBuiltRuntime(
      {
        contentDir: FIXTURE_CONTENT_DIR,
        subscribeAction: FIXTURE_SUBSCRIBE_ACTION,
        subscribeEmailField: FIXTURE_SUBSCRIBE_EMAIL_FIELD,
      },
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

Then('the landing page offers an email subscription', async ({ page }) => {
  const section = page.locator('[data-testid="subscribe"]');
  await expect(section.locator('[data-testid="subscribe-open"]')).toBeVisible();
  await expect(section.locator('[data-testid="feed-link"]')).toBeVisible();
  const form = section.locator('form');
  await expect(form).toBeHidden();
  await expect(form).toHaveAttribute('action', FIXTURE_SUBSCRIBE_ACTION);
  await captureRoute(page, 'rmet-bdd-006', '/subscribe');
});

When('the reader opens the subscribe popup', async ({ page }) => {
  await page.locator('[data-testid="subscribe-open"]').click();
});

Then('the popup shows an email box', async ({ page }) => {
  const popover = page.locator('[data-testid="subscribe-popover"]');
  await expect(popover).toBeVisible();
  await expect(popover.locator('input[type="email"]')).toBeFocused();
  await captureRoute(page, 'rmet-bdd-006', '/subscribe-open');
});

When('the reader enters an email address and subscribes', async ({ page }) => {
  providerPost = undefined;
  await page.context().route(FIXTURE_SUBSCRIBE_ACTION, async (route) => {
    providerPost = route.request().postData() ?? undefined;
    await route.fulfill({
      status: 200,
      contentType: 'text/html',
      body: '<p>Subscribed</p>',
    });
  });
  const form = page.locator('[data-testid="subscribe-popover"] form');
  await form.locator('input[type="email"]').fill(READER_EMAIL);
  const popup = page.waitForEvent('popup');
  await form.locator('button[type="submit"]').click();
  await (await popup).waitForLoadState();
});

Then(
  'the subscription reaches the provider with that address',
  async ({ page }) => {
    expect(providerPost).toBeDefined();
    const fields = new URLSearchParams(providerPost);
    expect(fields.get(FIXTURE_SUBSCRIBE_EMAIL_FIELD)).toBe(READER_EMAIL);
    await captureRoute(page, 'rmet-bdd-006', '/subscribed');
  }
);
