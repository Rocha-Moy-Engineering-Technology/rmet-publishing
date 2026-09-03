import { expect, test } from '@playwright/test';

import {
  BACKGROUND_HANDOVER_SECONDS,
  BACKGROUND_PLAYBACK_RATE,
  BACKGROUND_STILL_FADE_SECONDS,
  BACKGROUND_STILL_HOLD_SECONDS,
} from '../../logic/media/background_video';
import {
  BASE_PATH_FIXTURE,
  FIXTURE_ASSETS_DIR,
  FIXTURE_CONTENT_DIR,
  captureRoute,
  feedRoutes,
  withBuiltRuntime,
  withRuntime,
} from '../support/runtime-server';

/** One entry the page records about a still, stamped by the browser clock. */
type StillEvent = {
  at: number;
  still: number;
  kind: 'class' | 'transitionend';
  classes: string;
};

type StillWindow = { stillTimeline: StillEvent[] };

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
      await expect(page.locator('[data-testid="subscribe"]')).toBeVisible();
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
      const feedText = await feed.text();
      expect(feedText).toContain(`${basePath}/writings/`);
      // a root-relative link inside a body carries the base path in the feed
      expect(feedText).toContain(
        `href=&quot;http://localhost:4321${basePath}/papers/fixture.pdf&quot;`
      );
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

test('RMET-E2E-008 gives a narrow screen still frames and fetches no video', async ({
  page,
}) => {
  await page.setViewportSize({ width: 390, height: 844 });
  await withBuiltRuntime(
    { contentDir: FIXTURE_CONTENT_DIR, assetsDir: FIXTURE_ASSETS_DIR },
    async ({ baseURL }) => {
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
          video
            .first()
            .evaluate((node: HTMLVideoElement) => node.currentTime > 0)
        )
        .toBe(true);

      // the fixture must outlast this test by a wide margin: near its end
      // the standby takes over on its own, and the assertions below assume
      // the only handover is the one driven here
      expect(
        await video.first().evaluate((node: HTMLVideoElement) => node.duration)
      ).toBeGreaterThan(BACKGROUND_HANDOVER_SECONDS * 10);

      expect(
        await video
          .first()
          .evaluate((node: HTMLVideoElement) => node.playbackRate)
      ).toBe(BACKGROUND_PLAYBACK_RATE);

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
    }
  );
});

test('RMET-E2E-009 holds each still alone for three seconds, then dissolves in the next', async ({
  page,
}) => {
  await page.setViewportSize({ width: 390, height: 844 });
  await withBuiltRuntime(
    { contentDir: FIXTURE_CONTENT_DIR, assetsDir: FIXTURE_ASSETS_DIR },
    async ({ baseURL }) => {
      // the page keeps its own timeline of the stills from before any script
      // runs: every class change and every finished opacity transition,
      // stamped by the browser clock, so no poll interval blurs the timing
      await page.addInitScript(() => {
        const timeline: StillEvent[] = [];
        (window as unknown as StillWindow).stillTimeline = timeline;
        const isStill = (node: EventTarget | null): node is Element =>
          node instanceof Element &&
          node.classList.contains('page-media-still');
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
    }
  );
});

test('RMET-E2E-010 offers the feed in place of the form while no provider is configured', async ({
  page,
}) => {
  await withRuntime(async ({ baseURL }) => {
    await page.goto(`${baseURL}/`);
    const section = page.locator('[data-testid="subscribe"]');
    await expect(section).toBeVisible();
    await expect(section.locator('form')).toHaveCount(0);
    await expect(section.locator('a[href="/rss.xml"]')).toBeVisible();
    await captureRoute(page, 'rmet-e2e-010', '/subscribe-unconfigured');
  });
});

test('RMET-E2E-011 carries the rendered body of every piece in the feed', async ({
  request,
}) => {
  await withBuiltRuntime(
    { contentDir: FIXTURE_CONTENT_DIR },
    async ({ baseURL }) => {
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
    }
  );
});
