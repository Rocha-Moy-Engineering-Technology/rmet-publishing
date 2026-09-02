import { expect, test } from '@playwright/test';

import { BACKGROUND_PLAYBACK_RATE } from '../../logic/media/background_video';
import {
  BASE_PATH_FIXTURE,
  FIXTURE_ASSETS_DIR,
  FIXTURE_CONTENT_DIR,
  captureRoute,
  feedRoutes,
  withBuiltRuntime,
  withRuntime,
} from '../support/runtime-server';

test('RMET-E2E-001 navigates from the landing page into a piece', async ({
  page,
}) => {
  await withBuiltRuntime(
    { contentDir: FIXTURE_CONTENT_DIR },
    async ({ baseURL }) => {
      await page.goto(`${baseURL}/`);
      await captureRoute(page, 'rmet-e2e-001', '/');
      const firstCard = page.locator('[data-testid="post-card"] a').first();
      const title = (await firstCard.locator('h2').textContent())?.trim() ?? '';
      await firstCard.click();
      await page.waitForLoadState('domcontentloaded');
      await expect(page.locator('article h1')).toHaveText(title);
      await expect(page.locator('[data-testid="comments"]')).toBeVisible();
      expect(page.url()).toContain('/writings/');
      await captureRoute(page, 'rmet-e2e-001', '/piece');
    }
  );
});

test('RMET-E2E-002 remembers the theme the reader chooses', async ({
  page,
}) => {
  await withRuntime(async ({ baseURL }) => {
    await page.goto(`${baseURL}/`);
    const before = await page.evaluate(
      () => document.documentElement.dataset.theme
    );
    expect(before).toBe('dark');
    await page.locator('[data-testid="theme-toggle"]').click();
    const after = await page.evaluate(
      () => document.documentElement.dataset.theme
    );
    expect(after).toBe('light');
    await page.reload();
    const persisted = await page.evaluate(
      () => document.documentElement.dataset.theme
    );
    expect(persisted).toBe('light');
    await captureRoute(page, 'rmet-e2e-002', '/theme');
  });
});

test('RMET-E2E-003 serves a feed and a sitemap', async ({ request }) => {
  await withRuntime(async ({ baseURL }) => {
    for (const route of feedRoutes()) {
      const response = await request.get(`${baseURL}${route.path}`);
      expect(response.status()).toBe(200);
      expect(response.headers()['content-type']).toContain(route.contentType);
      expect(await response.text()).toContain(
        '<?xml version="1.0" encoding="UTF-8"?>'
      );
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
  await withBuiltRuntime(
    { basePath: BASE_PATH_FIXTURE, contentDir: FIXTURE_CONTENT_DIR },
    async ({ baseURL, basePath }) => {
      const response = await page.goto(`${baseURL}${basePath}/`);
      expect(response?.status()).toBe(200);

      const internal = await page
        .locator('a[href^="/"]')
        .evaluateAll((links) => links.map((link) => link.getAttribute('href')));
      expect(internal.length).toBeGreaterThan(0);
      for (const target of internal) {
        expect(target?.startsWith(`${basePath}/`)).toBe(true);
      }

      await page.locator('[data-testid="post-card"] a').first().click();
      await page.waitForLoadState('domcontentloaded');
      expect(page.url()).toContain(`${basePath}/writings/`);
      await expect(page.locator('[data-testid="post-body"]')).toBeVisible();

      const styles = await page
        .locator('link[rel="stylesheet"][href^="/"]')
        .evaluateAll((links) => links.map((link) => link.getAttribute('href')));
      for (const style of styles) {
        expect(style?.startsWith(`${basePath}/`)).toBe(true);
      }

      const feed = await page.request.get(`${baseURL}${basePath}/rss.xml`);
      expect(feed.status()).toBe(200);
      expect(await feed.text()).toContain(`${basePath}/writings/`);
    }
  );
});

test('RMET-E2E-006 renders an MDX piece from the collection', async ({
  page,
}) => {
  await withBuiltRuntime(
    { contentDir: FIXTURE_CONTENT_DIR },
    async ({ baseURL }) => {
      await page.goto(`${baseURL}/writings/mdx-fixture-piece`);
      await expect(page.locator('article h1')).toHaveText('MDX fixture piece');
      await expect(page.locator('[data-testid="post-body"]')).toContainText(
        'The MDX pipeline evaluated two plus two as 4.'
      );
      await captureRoute(page, 'rmet-e2e-006', '/mdx-piece');
    }
  );
});

test('RMET-E2E-007 plays the background video on a loop, silent until asked', async ({
  page,
}) => {
  await withBuiltRuntime(
    { contentDir: FIXTURE_CONTENT_DIR, assetsDir: FIXTURE_ASSETS_DIR },
    async ({ baseURL }) => {
      await page.goto(`${baseURL}/`);
      const video = page.locator('.page-media-frame');
      await expect(video).toHaveCount(1);

      const state = await video.evaluate((node: HTMLVideoElement) => ({
        muted: node.muted,
        loop: node.loop,
        autoplay: node.autoplay,
        fixed: getComputedStyle(node.parentElement as HTMLElement).position,
      }));
      expect(state).toEqual({
        muted: true,
        loop: true,
        autoplay: true,
        fixed: 'fixed',
      });

      await expect
        .poll(async () =>
          video.evaluate((node: HTMLVideoElement) => node.currentTime > 0)
        )
        .toBe(true);

      expect(
        await video.evaluate((node: HTMLVideoElement) => node.playbackRate)
      ).toBe(BACKGROUND_PLAYBACK_RATE);

      const control = page.locator('[data-testid="sound-toggle"]');
      await expect(control).toHaveAttribute('aria-pressed', 'false');
      await control.click();
      await expect(control).toHaveAttribute('aria-pressed', 'true');
      expect(await video.evaluate((node: HTMLVideoElement) => node.muted)).toBe(
        false
      );

      await captureRoute(page, 'rmet-e2e-007', '/background');
    }
  );
});
