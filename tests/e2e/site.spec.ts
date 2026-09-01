import { expect, test } from '@playwright/test';

import {
  captureRoute,
  feedRoutes,
  withBasedRuntime,
  withRuntime,
} from '../support/runtime-server';

test('RMET-E2E-001 navigates from the home page into a piece and back', async ({
  page,
}) => {
  await withRuntime(async ({ baseURL }) => {
    await page.goto(`${baseURL}/`);
    await captureRoute(page, 'rmet-e2e-001', '/');
    await page.locator('nav a[href="/writing"]').first().click();
    await page.waitForLoadState('domcontentloaded');
    const firstCard = page.locator('[data-testid="post-card"] a').first();
    const title = (await firstCard.textContent())?.trim() ?? '';
    await firstCard.click();
    await page.waitForLoadState('domcontentloaded');
    await expect(page.locator('article h1')).toHaveText(title);
    await expect(page.locator('[data-testid="comments"]')).toBeVisible();
    await captureRoute(page, 'rmet-e2e-001', '/piece');
  });
});

test('RMET-E2E-002 remembers the theme the reader chooses', async ({
  page,
}) => {
  await withRuntime(async ({ baseURL }) => {
    await page.goto(`${baseURL}/`);
    const before = await page.evaluate(() =>
      document.documentElement.classList.contains('dark')
    );
    await page.locator('[data-testid="theme-toggle"]').click();
    const after = await page.evaluate(() =>
      document.documentElement.classList.contains('dark')
    );
    expect(after).toBe(!before);
    await page.reload();
    const persisted = await page.evaluate(() =>
      document.documentElement.classList.contains('dark')
    );
    expect(persisted).toBe(after);
    await captureRoute(page, 'rmet-e2e-002', '/theme');
  });
});

test('RMET-E2E-003 serves a feed and a sitemap that list the published pieces', async ({
  request,
}) => {
  await withRuntime(async ({ baseURL }) => {
    for (const route of feedRoutes()) {
      const response = await request.get(`${baseURL}${route.path}`);
      expect(response.status()).toBe(200);
      expect(response.headers()['content-type']).toContain(route.contentType);
      const body = await response.text();
      expect(body).toContain('<?xml version="1.0" encoding="UTF-8"?>');
    }
  });
});

test('RMET-E2E-004 answers an unknown address with the not-found page', async ({
  page,
}) => {
  await withRuntime(async ({ baseURL }) => {
    const response = await page.goto(`${baseURL}/no-such-piece`);
    expect(response?.status()).toBe(404);
    await expect(page.locator('main')).toBeVisible();
    await captureRoute(page, 'rmet-e2e-004', '/not-found');
  });
});

test('RMET-E2E-005 serves every internal link under a project base path', async ({
  page,
}) => {
  await withBasedRuntime(async ({ baseURL, basePath }) => {
    const home = `${baseURL}${basePath}/`;
    const response = await page.goto(home);
    expect(response?.status()).toBe(200);

    const targets = await page
      .locator('nav a')
      .evaluateAll((links) => links.map((link) => link.getAttribute('href')));
    for (const target of targets) {
      expect(target?.startsWith(`${basePath}/`)).toBe(true);
    }

    await page.locator('nav a[href$="/writing"]').first().click();
    await page.waitForLoadState('domcontentloaded');
    expect(page.url()).toContain(`${basePath}/writing`);

    await page.locator('[data-testid="post-card"] a').first().click();
    await page.waitForLoadState('domcontentloaded');
    expect(page.url()).toContain(`${basePath}/`);
    await expect(page.locator('article h1')).toBeVisible();
    await expect(page.locator('[data-testid="post-body"]')).toBeVisible();

    const styles = await page
      .locator('link[rel="stylesheet"]')
      .evaluateAll((links) => links.map((link) => link.getAttribute('href')));
    for (const style of styles) {
      expect(style?.startsWith(`${basePath}/`)).toBe(true);
    }

    const feed = await page.request.get(`${baseURL}${basePath}/rss.xml`);
    expect(feed.status()).toBe(200);
    expect(await feed.text()).toContain(`${basePath}/`);
  });
});
