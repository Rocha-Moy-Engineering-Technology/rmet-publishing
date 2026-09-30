import { mkdtemp, rm, writeFile } from 'node:fs/promises';
import { tmpdir } from 'node:os';
import { join } from 'node:path';

import { afterEach, beforeEach, describe, expect, test, vi } from 'vitest';

import { resolveBuildSettings } from '../../logic/site/build_settings';
import { buildEnvironment } from '../../state/adapters/outbound/environment/build_environment';

const BUILD_KEYS = [
  'PUBLIC_SITE_URL',
  'PUBLIC_BASE_PATH',
  'PUBLIC_ASSETS_DIR',
  'PUBLIC_CONTENT_DIR',
] as const;

const DOT_ENV = [
  'PUBLIC_SITE_URL=https://from-dot-env.example',
  'PUBLIC_BASE_PATH=/from-dot-env',
  'PUBLIC_ASSETS_DIR=tests/fixtures/public',
  'PUBLIC_CONTENT_DIR=tests/fixtures/content',
  'UNRELATED_SECRET=never-read',
  '',
].join('\n');

let root = '';

beforeEach(async () => {
  root = await mkdtemp(join(tmpdir(), 'rmet-build-env-'));
  await writeFile(join(root, '.env'), DOT_ENV);
  vi.spyOn(process, 'cwd').mockReturnValue(root);
  vi.stubEnv('NODE_ENV', 'production');
  for (const key of BUILD_KEYS) vi.stubEnv(key, undefined);
});

afterEach(async () => {
  vi.restoreAllMocks();
  vi.unstubAllEnvs();
  await rm(root, { recursive: true, force: true });
});

function settings() {
  return resolveBuildSettings(buildEnvironment().snapshot());
}

describe('build environment adapter', () => {
  test('RMET-INTEGRATION-002 reads the build settings from the .env file when the shell sets none (A6.23)', () => {
    expect(settings()).toEqual({
      site: 'https://from-dot-env.example',
      base: '/from-dot-env',
      assetsDirectory: 'tests/fixtures/public',
      contentDirectory: 'tests/fixtures/content',
    });
    expect(buildEnvironment().snapshot()).not.toHaveProperty(
      'UNRELATED_SECRET'
    );
  });

  test('RMET-INTEGRATION-003 lets a value the shell exported win over the .env file (A6.23)', () => {
    vi.stubEnv('PUBLIC_SITE_URL', 'https://from-shell.example');
    vi.stubEnv('PUBLIC_BASE_PATH', '/from-shell');
    expect(settings()).toMatchObject({
      site: 'https://from-shell.example',
      base: '/from-shell',
      contentDirectory: 'tests/fixtures/content',
    });
  });

  test('RMET-INTEGRATION-006 lets a blank shell value switch a .env value off (A6.23)', () => {
    vi.stubEnv('PUBLIC_BASE_PATH', '');
    expect(settings().base).toBe('/');
  });

  test('RMET-INTEGRATION-007 lets the mode file and the local file override the plain .env file (A6.23)', async () => {
    await writeFile(
      join(root, '.env.production'),
      'PUBLIC_SITE_URL=https://from-mode-file.example\n'
    );
    await writeFile(
      join(root, '.env.local'),
      'PUBLIC_BASE_PATH=/from-local-file\n'
    );
    expect(settings()).toMatchObject({
      site: 'https://from-mode-file.example',
      base: '/from-local-file',
    });
  });
});
