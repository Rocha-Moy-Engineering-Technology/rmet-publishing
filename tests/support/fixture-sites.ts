import { join } from 'node:path';

import { test as base, type Fixtures } from '@playwright/test';

import {
  BASE_PATH_FIXTURE,
  FIXTURE_SUBSCRIBE_ACTION,
  FIXTURE_SUBSCRIBE_EMAIL_FIELD,
  serveStatic,
  type Runtime,
} from './runtime-server';
import {
  FIXTURE_ASSETS_DIR,
  FIXTURE_CONTENT_DIR,
  buildSite,
  type BuildOptions,
} from './site-build';

/** Every site the browser suites build from fixtures, by fixture name. */
const FIXTURE_SITES = {
  contentSite: { contentDir: FIXTURE_CONTENT_DIR },
  mediaSite: { contentDir: FIXTURE_CONTENT_DIR, assetsDir: FIXTURE_ASSETS_DIR },
  basePathSite: {
    basePath: BASE_PATH_FIXTURE,
    contentDir: FIXTURE_CONTENT_DIR,
  },
  subscribeSite: {
    contentDir: FIXTURE_CONTENT_DIR,
    subscribeAction: FIXTURE_SUBSCRIBE_ACTION,
    subscribeEmailField: FIXTURE_SUBSCRIBE_EMAIL_FIELD,
  },
} as const satisfies Record<string, BuildOptions>;

export type FixtureSites = Record<keyof typeof FIXTURE_SITES, Runtime>;

const SITES_ROOT = 'test-results/fixture-sites';

/**
 * Budget for one site's build and server start, kept apart from the 30-second
 * test limit. A fixture site builds in a few seconds on an idle machine, but
 * at a load average near 60 a build plus one page visit overran 30 seconds
 * (RMET-E2E-001, 2026-09-30). Two minutes absorbs that, and a build or server
 * that hangs still fails the run within two minutes.
 */
const SITE_TIMEOUT_MILLISECONDS = 120_000;

type SiteName = keyof typeof FIXTURE_SITES;

/**
 * A worker-scoped fixture: the first test in a worker that asks for the site
 * builds and serves it once; later tests in that worker reuse the same server,
 * which stops when the worker ends. Tests themselves only visit a finished site.
 */
function fixtureSite(name: SiteName): Fixtures<object, FixtureSites>[SiteName] {
  return [
    async ({}, use) => {
      const options: BuildOptions = FIXTURE_SITES[name];
      const root = join(SITES_ROOT, name);
      const basePath = options.basePath ?? '';
      await buildSite(join(root, basePath), options);
      const server = await serveStatic(root, basePath);
      try {
        await use(server.runtime);
      } finally {
        await server.stop();
      }
    },
    { scope: 'worker', timeout: SITE_TIMEOUT_MILLISECONDS },
  ];
}

export const fixtureSiteFixtures: Fixtures<object, FixtureSites> = {
  contentSite: fixtureSite('contentSite'),
  mediaSite: fixtureSite('mediaSite'),
  basePathSite: fixtureSite('basePathSite'),
  subscribeSite: fixtureSite('subscribeSite'),
};

/** The Playwright test the end-to-end specs use, with the fixture sites. */
export const test = base.extend<object, FixtureSites>(fixtureSiteFixtures);
