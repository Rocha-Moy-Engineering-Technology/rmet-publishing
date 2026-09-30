import { mkdtemp, readdir, readFile, rm, stat } from 'node:fs/promises';
import { tmpdir } from 'node:os';
import { join } from 'node:path';

import { afterEach, describe, expect, test } from 'vitest';

import { SITE } from '../../logic/site/site_config';
import {
  FIXTURE_ASSETS_DIR,
  FIXTURE_CONTENT_DIR,
  buildSite,
  type BuildOptions,
} from '../support/site-build';

const scratch: string[] = [];

afterEach(async () => {
  for (const directory of scratch.splice(0)) {
    await rm(directory, { recursive: true, force: true });
  }
});

/** Builds the fixture site and returns every built file's path and bytes. */
async function builtFiles(
  options: BuildOptions
): Promise<readonly { path: string; bytes: Buffer }[]> {
  const root = await mkdtemp(join(tmpdir(), 'rmet-contact-build-'));
  scratch.push(root);
  const outDir = join(root, 'dist');
  await buildSite(outDir, {
    contentDir: FIXTURE_CONTENT_DIR,
    assetsDir: FIXTURE_ASSETS_DIR,
    ...options,
  });
  const files: { path: string; bytes: Buffer }[] = [];
  for (const entry of await readdir(outDir, { recursive: true })) {
    const path = join(outDir, entry);
    if ((await stat(path)).isFile()) {
      files.push({ path: entry, bytes: await readFile(path) });
    }
  }
  return files;
}

async function expectNeverWhole(
  address: string,
  options: BuildOptions
): Promise<void> {
  const files = await builtFiles(options);
  expect(files.length).toBeGreaterThan(0);
  const carriers = files
    .filter(({ bytes }) => bytes.includes(address))
    .map(({ path }) => path);
  expect(carriers, `files carrying ${address} whole`).toEqual([]);

  const [user, domain] = address.split('@');
  const contact = files.find(({ path }) => path === 'contact/index.html');
  const html = contact?.bytes.toString('utf8') ?? '';
  expect(html).toContain(`data-user="${user}"`);
  expect(html).toContain(`data-domain="${domain}"`);
}

describe('contact address in a real build', () => {
  test('RMET-INTEGRATION-015 keeps a configured contact address out of every built file, publishing only its two parts (A6.5)', async () => {
    await expectNeverWhole('probe.reader@example.org', {
      contactEmail: 'probe.reader@example.org',
    });
  });

  test('RMET-INTEGRATION-016 keeps the default contact address out of every built file too (A6.5)', async () => {
    await expectNeverWhole(SITE.defaultContactEmail, {});
  });
});
