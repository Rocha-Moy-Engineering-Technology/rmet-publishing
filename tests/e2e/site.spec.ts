import { mkdir, rm, writeFile } from 'node:fs/promises';
import { join } from 'node:path';

import { expect } from '@playwright/test';

import {
  BACKGROUND_HANDOVER_SECONDS,
  BACKGROUND_PLAYBACK_RATE,
  BACKGROUND_STILL_FADE_SECONDS,
  BACKGROUND_STILL_HOLD_SECONDS,
} from '../../logic/media/background_video';
import { stripContentExtension } from '../../logic/posts/content_files';
import { slugify } from '../../logic/text/slugify';
import {
  captureRoute,
  feedRoutes,
  withRuntime,
} from '../support/runtime-server';
import { test } from '../support/fixture-sites';
import { runBuild } from '../support/site-build';

/** The fixture whose name Astro's default entry id would have rewritten. */
const PUNCTUATED_FIXTURE = "don't-panic-v1.2.md";

/** Throwaway content directories for builds that must fail. */
const CONTENT_CASES = 'test-results/content-cases';

async function writeContentCase(
  name: string,
  files: Readonly<Record<string, string>>
): Promise<string> {
  const directory = join(CONTENT_CASES, name);
  await rm(directory, { recursive: true, force: true });
  await mkdir(directory, { recursive: true });
  for (const [file, contents] of Object.entries(files)) {
    await writeFile(join(directory, file), contents);
  }
  return directory;
}

function casePiece(title: string, extraFrontMatter = ''): string {
  return [
    '---',
    `title: '${title}'`,
    "description: 'A content case.'",
    'publishedAt: 2026-01-10',
    `${extraFrontMatter}---`,
    '',
    'Body.',
    '',
  ].join('\n');
}

/**
 * Budget for a build that must be refused, kept apart from the 30-second test
 * limit as the fixture sites' budget is (tests/support/fixture-sites.ts): the
 * refusal comes from the build itself, so the test has to run one.
 */
const REFUSED_BUILD_MILLISECONDS = 120_000;

/** Runs a build over a content case that must fail and returns its output. */
async function refusedBuild(contentDir: string): Promise<string> {
  const { code, output } = await runBuild(join(CONTENT_CASES, 'dist'), {
    contentDir,
  });
  expect(code).not.toBe(0);
  return output;
}

/** One entry the page records about a still, stamped by the browser clock. */
type StillEvent = {
  at: number;
  still: number;
  kind: 'class' | 'transitionend';
  classes: string;
};

type StillWindow = { stillTimeline: StillEvent[] };

test('RMET-E2E-001 navigates from the landing page into a piece (A6.2)', async ({
  page,
  contentSite,
}) => {
  const { baseURL } = contentSite;
  await page.goto(`${baseURL}/`);
  await captureRoute(page, 'rmet-e2e-001', '/');
  const firstCard = page.locator('[data-testid="post-card"] a').first();
  const title = (await firstCard.locator('h2').textContent())?.trim() ?? '';
  await firstCard.click();
  await page.waitForLoadState('domcontentloaded');
  await expect(page.locator('article h1')).toHaveText(title);
  await expect(page.locator('[data-testid="feed-link"]')).toHaveCount(2);
  expect(page.url()).toContain('/writings/');
  await captureRoute(page, 'rmet-e2e-001', '/piece');
});

test('RMET-E2E-002 remembers the theme the reader chooses (A6.6)', async ({
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

test('RMET-E2E-003 serves a feed and a sitemap (A6.10)', async ({
  request,
}) => {
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

test('RMET-E2E-004 answers an unknown address with the not-found page (A6.15)', async ({
  page,
}) => {
  await withRuntime(async ({ baseURL }) => {
    const response = await page.goto(`${baseURL}/no-such-piece`);
    expect(response?.status()).toBe(404);
    await expect(page.locator('main')).toBeVisible();
    await captureRoute(page, 'rmet-e2e-004', '/not-found');
  });
});

test('RMET-E2E-005 serves every internal link under a project base path (A6.11)', async ({
  page,
  basePathSite,
}) => {
  const { baseURL, basePath } = basePathSite;
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
  const feedText = await feed.text();
  expect(feedText).toContain(`${basePath}/writings/`);
  // a root-relative link inside a body carries the base path in the feed
  expect(feedText).toContain(
    `href=&quot;http://localhost:4321${basePath}/papers/fixture.pdf&quot;`
  );
});

test('RMET-E2E-006 renders an MDX piece from the collection (A6.2)', async ({
  page,
  contentSite,
}) => {
  const { baseURL } = contentSite;
  await page.goto(`${baseURL}/writings/mdx-fixture-piece`);
  await expect(page.locator('article h1')).toHaveText('MDX fixture piece');
  await expect(page.locator('[data-testid="post-body"]')).toContainText(
    'The MDX pipeline evaluated two plus two as 4.'
  );
  await captureRoute(page, 'rmet-e2e-006', '/mdx-piece');
});

test('RMET-E2E-008 gives a narrow screen still frames and fetches no video (A6.17)', async ({
  page,
  mediaSite,
}) => {
  await page.setViewportSize({ width: 390, height: 844 });
  const { baseURL } = mediaSite;
  const requested: string[] = [];
  page.on('request', (request) => requested.push(request.url()));

  await page.goto(`${baseURL}/`);
  await expect(page.locator('.page-media-still.is-active')).toHaveCount(1);

  // the phone must not pay for the video at all
  expect(requested.filter((url) => /\.(webm|mp4)$/.test(url))).toEqual([]);
  expect(
    await page
      .locator('.page-media-frame')
      .first()
      .evaluate((node: HTMLVideoElement) => node.currentSrc)
  ).toBe('');

  // and there is no sound to offer
  await expect(page.locator('[data-testid="sound-toggle"]')).toBeHidden();

  await captureRoute(page, 'rmet-e2e-008', '/narrow');
});

test('RMET-E2E-007 plays the background video on a loop, silent until asked (A6.16)', async ({
  page,
  mediaSite,
}) => {
  const { baseURL } = mediaSite;
  const requested: string[] = [];
  page.on('request', (request) => requested.push(request.url()));

  await page.goto(`${baseURL}/`);
  const video = page.locator('.page-media-frame');
  await expect(video).toHaveCount(2);

  const state = await video.first().evaluate((node: HTMLVideoElement) => ({
    muted: node.muted,
    loop: node.loop,
    autoplay: node.autoplay,
    fixed: getComputedStyle(node.parentElement as HTMLElement).position,
  }));
  // playback is script-driven, never declarative: the markup carries no
  // autoplay and no source, so a narrow screen fetches nothing
  expect(state).toEqual({
    muted: true,
    loop: false,
    autoplay: false,
    fixed: 'fixed',
  });

  await expect(page.locator('.page-media-frame.is-active')).toHaveCount(1);

  await expect
    .poll(async () =>
      video.first().evaluate((node: HTMLVideoElement) => node.currentTime > 0)
    )
    .toBe(true);

  // the fixture must outlast this test by a wide margin: near its end
  // the standby takes over on its own, and the assertions below assume
  // the only handover is the one driven here
  expect(
    await video.first().evaluate((node: HTMLVideoElement) => node.duration)
  ).toBeGreaterThan(BACKGROUND_HANDOVER_SECONDS * 10);

  expect(
    await video.first().evaluate((node: HTMLVideoElement) => node.playbackRate)
  ).toBe(BACKGROUND_PLAYBACK_RATE);

  // the stylesheet hides the stills on this screen, so none is fetched
  expect(
    await page
      .locator('.page-media-still')
      .evaluateAll((nodes) => nodes.map((node) => node.getAttribute('src')))
  ).toEqual([null, null]);
  expect(requested.filter((url) => /-still-\d+\.webp$/.test(url))).toEqual([]);

  const control = page.locator('[data-testid="sound-toggle"]');
  await expect(control).toHaveAttribute('aria-pressed', 'false');
  await control.click();
  await expect(control).toHaveAttribute('aria-pressed', 'true');
  expect(
    await video.first().evaluate((node: HTMLVideoElement) => node.muted)
  ).toBe(false);

  // drive the active player to the loop point: the standby must take over
  // rather than the first player seeking back to zero
  await video
    .first()
    .evaluate(
      (node: HTMLVideoElement) => (node.currentTime = node.duration - 0.4)
    );
  await expect(page.locator('.page-media-frame').nth(1)).toHaveClass(
    /is-active/
  );
  await expect(page.locator('.page-media-frame').first()).not.toHaveClass(
    /is-active/
  );
  expect(
    await video
      .nth(1)
      .evaluate((node: HTMLVideoElement) => node.currentTime < 1)
  ).toBe(true);

  await captureRoute(page, 'rmet-e2e-007', '/background');

  await page.locator('[data-testid="post-card"] a').first().click();
  await page.waitForLoadState('domcontentloaded');
  await expect(page.locator('.page-media-frame')).toHaveCount(0);
  await expect(page.locator('[data-testid="sound-toggle"]')).toHaveCount(0);
});

test('RMET-E2E-009 holds each still alone for three seconds, then dissolves in the next (A6.17)', async ({
  page,
  mediaSite,
}) => {
  await page.setViewportSize({ width: 390, height: 844 });
  const { baseURL } = mediaSite;
  // the page keeps its own timeline of the stills from before any script
  // runs: every class change and every finished opacity transition,
  // stamped by the browser clock, so no poll interval blurs the timing
  await page.addInitScript(() => {
    const timeline: StillEvent[] = [];
    (window as unknown as StillWindow).stillTimeline = timeline;
    const isStill = (node: EventTarget | null): node is Element =>
      node instanceof Element && node.classList.contains('page-media-still');
    const record = (node: Element, kind: StillEvent['kind']): void => {
      timeline.push({
        at: performance.now(),
        still: Array.from(
          document.querySelectorAll('.page-media-still')
        ).indexOf(node),
        kind,
        classes: node.className,
      });
    };
    new MutationObserver((records) => {
      for (const { target } of records) {
        if (isStill(target)) record(target, 'class');
      }
    }).observe(document, {
      attributes: true,
      attributeFilter: ['class'],
      subtree: true,
    });
    document.addEventListener(
      'transitionend',
      (event) => {
        if (event.propertyName === 'opacity' && isStill(event.target)) {
          record(event.target, 'transitionend');
        }
      },
      true
    );
  });

  await page.goto(`${baseURL}/`);
  const stills = page.locator('.page-media-still');
  await expect(stills).toHaveCount(2);

  // the stills carry the video's treatment, applied once around all of them
  expect(
    await page.locator('.page-media-stills').evaluate((node) => {
      const style = getComputedStyle(node);
      return { opacity: style.opacity, filter: style.filter };
    })
  ).toEqual({ opacity: '0.4', filter: 'grayscale(0.3) contrast(1.05)' });
  await expect(stills.first()).toHaveCSS(
    'transition-duration',
    `${BACKGROUND_STILL_FADE_SECONDS}s`
  );

  // a portrait crop is centred on each still's subject: the station
  // crosses the right of its frame, the lunar lander stands at the right
  await expect(stills.first()).toHaveCSS('object-position', '80% 50%');
  await expect(stills.nth(1)).toHaveCSS('object-position', '94% 50%');

  // the players are not displayed on this screen at all, so neither the
  // poster nor a frame can blend into a still
  const frames = page.locator('.page-media-frame');
  await expect(frames).toHaveCount(2);
  for (const frame of await frames.all()) {
    await expect(frame).toBeHidden();
  }

  const state = () =>
    page.locator('.page-media-stills').evaluate((root) =>
      Array.from(root.querySelectorAll('img')).map((image) => ({
        active: image.classList.contains('is-active'),
        leaving: image.classList.contains('is-leaving'),
        opacity: getComputedStyle(image).opacity,
      }))
    );
  const alone = (index: number) =>
    [0, 1].map((other) => ({
      active: other === index,
      leaving: false,
      opacity: other === index ? '1' : '0',
    }));
  const polling = { intervals: [100], timeout: 10000 };

  // the first still fades in and then stands alone
  await expect.poll(state, polling).toEqual(alone(0));

  // nothing else shows during the hold; a timer never fires early, so a
  // check well before the hold ends proves the still was never blended
  await page.waitForTimeout(BACKGROUND_STILL_HOLD_SECONDS * 1000 - 1000);
  expect(await state()).toEqual(alone(0));

  // the dissolve: the next still fades in on top while the outgoing one
  // stays whole underneath, so the picture never dips
  await expect.poll(state, polling).toMatchObject([
    { active: false, leaving: true, opacity: '1' },
    { active: true, leaving: false },
  ]);

  // the hold is timed by the page itself, from the first still's fade
  // ending to the second still being switched on. The hold timer starts
  // on the tick the fade timer ends, a frame or so before the transition
  // reports its end, and a timer only ever fires late, so the page can
  // read short by a few frames at most and never by a poll interval
  const timeline = await page.evaluate(
    () => (window as unknown as StillWindow).stillTimeline
  );
  const aloneAt = timeline.find(
    (event) => event.still === 0 && event.kind === 'transitionend'
  )?.at;
  const dissolveAt = timeline.find(
    (event) => event.still === 1 && event.classes.includes('is-active')
  )?.at;
  if (aloneAt === undefined || dissolveAt === undefined) {
    throw new Error(`Timeline incomplete: ${JSON.stringify(timeline)}`);
  }
  expect(dissolveAt - aloneAt).toBeGreaterThanOrEqual(
    BACKGROUND_STILL_HOLD_SECONDS * 1000 - 100
  );
  // and nothing touched the second still before that moment
  expect(
    timeline
      .filter((event) => event.at < dissolveAt)
      .every((event) => event.still === 0)
  ).toBe(true);

  // then the second still stands alone in turn
  await expect.poll(state, polling).toMatchObject([
    { active: false, leaving: false },
    { active: true, leaving: false, opacity: '1' },
  ]);

  await captureRoute(page, 'rmet-e2e-009', '/stills');
});

test('RMET-E2E-012 fetches the stills only once the screen narrows enough to show them (A6.17)', async ({
  page,
  mediaSite,
}) => {
  const { baseURL } = mediaSite;
  const requested: string[] = [];
  page.on('request', (request) => requested.push(request.url()));
  const stillRequests = () =>
    requested.filter((url) => /-still-\d+\.webp$/.test(url));

  // a wide screen: the video plays and no still is attached or fetched
  await page.setViewportSize({ width: 1280, height: 800 });
  await page.goto(`${baseURL}/`);
  await expect(page.locator('.page-media-frame.is-active')).toHaveCount(1);
  expect(stillRequests()).toEqual([]);
  await expect(page.locator('.page-media-still.is-active')).toHaveCount(0);

  // the same page narrowed: the stills start and the first one shows
  await page.setViewportSize({ width: 390, height: 844 });
  await expect(page.locator('.page-media-still.is-active')).toHaveCount(1);
  await expect(page.locator('.page-media-still').first()).toBeVisible();
  expect(stillRequests().length).toBeGreaterThan(0);

  await captureRoute(page, 'rmet-e2e-012', '/narrowed');
});

test('RMET-E2E-013 hides the sound control with the video when the screen narrows, silencing it, and shows it again when the screen widens (A6.17)', async ({
  page,
  mediaSite,
}) => {
  const { baseURL } = mediaSite;
  const control = page.locator('[data-testid="sound-toggle"]');
  const playersMuted = () =>
    page
      .locator('.page-media-frame')
      .evaluateAll((nodes) =>
        nodes.map((node) => (node as HTMLVideoElement).muted)
      );

  // a wide screen: the control shows with the video, and the reader
  // turns the sound on
  await page.setViewportSize({ width: 1280, height: 800 });
  await page.goto(`${baseURL}/`);
  await expect(control).toBeVisible();
  await control.click();
  await expect(control).toHaveAttribute('aria-pressed', 'true');
  expect(await playersMuted()).toEqual([false, false]);

  // narrowed: the video is hidden, so the control hides with it and
  // the sound goes off rather than play unseen
  await page.setViewportSize({ width: 390, height: 844 });
  await expect(control).toBeHidden();
  await expect(page.locator('.page-media-frame').first()).toBeHidden();
  await expect(control).toHaveAttribute('aria-pressed', 'false');
  expect(await playersMuted()).toEqual([true, true]);
  await captureRoute(page, 'rmet-e2e-013', '/narrowed-silent');

  // widened again: the video and its control return, still silent
  await page.setViewportSize({ width: 1280, height: 800 });
  await expect(control).toBeVisible();
  await expect(control).toHaveText('Sound off');
  await expect(page.locator('.page-media-frame.is-active')).toBeVisible();
  await captureRoute(page, 'rmet-e2e-013', '/widened');
});

test('RMET-E2E-010 offers only the feed icon while no provider is configured (A6.9)', async ({
  page,
}) => {
  await withRuntime(async ({ baseURL }) => {
    await page.goto(`${baseURL}/`);
    await expect(page.locator('[data-testid="subscribe-popover"]')).toHaveCount(
      0
    );
    await expect(page.locator('[data-testid="subscribe-open"]')).toHaveCount(0);
    const feeds = page.locator('[data-testid="feed-link"]');
    await expect(feeds).toHaveCount(2);
    await expect(feeds.first()).toBeVisible();
    await expect(feeds.first()).toHaveAttribute('href', '/rss.xml');
    await captureRoute(page, 'rmet-e2e-010', '/subscribe-unconfigured');
  });
});

test('RMET-E2E-011 carries the rendered body of every piece in the feed (A6.10)', async ({
  request,
  contentSite,
}) => {
  const { baseURL } = contentSite;
  const response = await request.get(`${baseURL}/rss.xml`);
  expect(response.status()).toBe(200);
  const feed = await response.text();
  expect(feed).toContain(
    'xmlns:content="http://purl.org/rss/1.0/modules/content/"'
  );
  expect(feed.split('<content:encoded>').length - 1).toBe(
    feed.split('<item>').length - 1
  );
  // the Markdown body arrives rendered, markup escaped for the XML
  expect(feed).toContain('&lt;h2 id=&quot;a-heading&quot;&gt;A heading');
  // the MDX body arrives evaluated, not as source
  expect(feed).toContain('two plus two as 4');
  // a root-relative link in a body is absolute in the feed
  expect(feed).toContain(
    'href=&quot;http://localhost:4321/papers/fixture.pdf&quot;'
  );
});

test('RMET-E2E-014 serves a punctuated, dotted file name at the slug slugify gives it (A6.19)', async ({
  page,
  contentSite,
}) => {
  const slug = slugify(stripContentExtension(PUNCTUATED_FIXTURE));
  expect(slug).toBe('don-t-panic-v1-2');
  const { baseURL } = contentSite;
  await page.goto(`${baseURL}/`);
  const card = page.locator(
    `[data-testid="post-card"] a[href="/writings/${slug}"]`
  );
  await expect(card).toHaveCount(1);
  await card.click();
  await page.waitForLoadState('domcontentloaded');
  expect(page.url()).toBe(`${baseURL}/writings/${slug}`);
  await expect(page.locator('article h1')).toHaveText("Don't panic, v1.2");
  await captureRoute(page, 'rmet-e2e-014', '/punctuated-piece');

  // the address Astro's own github-slugged entry id would have produced
  const legacy = await page.request.get(`${baseURL}/writings/dont-panic-v12`);
  expect(legacy.status()).toBe(404);
  for (const route of ['/rss.xml', '/sitemap.xml']) {
    const response = await page.request.get(`${baseURL}${route}`);
    const content = await response.text();
    expect(content).toContain(`/writings/${slug}<`);
    expect(content).not.toContain('/writings/dont-panic-v12');
  }
});

test('RMET-E2E-015 fails the build on a front-matter slug, naming the file (A6.19)', async () => {
  test.setTimeout(REFUSED_BUILD_MILLISECONDS);
  const contentDir = await writeContentCase('front-matter-slug', {
    'moved.md': casePiece('Moved', "slug: 'elsewhere'\n"),
  });
  expect(await refusedBuild(contentDir)).toMatch(
    /moved\.md[\s\S]*slug[\s\S]*rename the file/
  );
});

test('RMET-E2E-016 fails the build when two files share a slug, naming both (A6.19)', async () => {
  test.setTimeout(REFUSED_BUILD_MILLISECONDS);
  const contentDir = await writeContentCase('shared-slug', {
    'twin.md': casePiece('Twin in Markdown'),
    'twin.mdx': casePiece('Twin in MDX'),
  });
  expect(await refusedBuild(contentDir)).toContain(
    'Content files twin.md and twin.mdx share the slug "twin"'
  );
});

test('RMET-VERSIONS-E2E-001 keeps review copies out of pages, feed, and sitemap (A6.12)', async ({
  page,
  contentSite,
}) => {
  const { baseURL } = contentSite;
  await page.goto(`${baseURL}/`);
  await expect(page.locator('[data-testid="post-card"]')).toHaveCount(4);
  await expect(page.locator('main')).not.toContainText('Editorial review only');
  await page.locator('[data-testid="post-card"] a').first().click();
  await expect(page.locator('article h1')).toBeVisible();
  await expect(page.locator('article')).not.toContainText(
    'EDITORIAL_REVIEW_ONLY'
  );
  for (const route of ['/rss.xml', '/sitemap.xml']) {
    const response = await page.request.get(`${baseURL}${route}`);
    expect(response.status()).toBe(200);
    const content = await response.text();
    expect(content).not.toContain('EDITORIAL_REVIEW_ONLY');
    // the slug a leaked review copy would carry; each archive's slug
    // starts with its review copy's, so this covers them too
    for (const reviewCopy of [
      'first-fixture-piece.compose.20260908_143205.md',
      'mdx-fixture-piece.transcribed.20260908_143205.mdx',
    ]) {
      expect(content).not.toContain(slugify(stripContentExtension(reviewCopy)));
    }
  }
  await captureRoute(page, 'rmet-versions-e2e-001', '/original');
});
