import { describe, expect, test } from 'vitest';

import {
  BUILD_SETTING_PREFIX,
  DEFAULT_ASSETS_DIRECTORY,
  DEFAULT_CONTENT_DIRECTORY,
  resolveBuildSettings,
} from '../../logic/site/build_settings';
import { SITE } from '../../logic/site/site_config';

describe('build settings', () => {
  test('RMET-UNIT-175 falls back to the default address, the root, and the source folders when nothing is set (A6.23)', () => {
    expect(resolveBuildSettings({})).toEqual({
      site: SITE.defaultSiteUrl,
      base: '/',
      assetsDirectory: DEFAULT_ASSETS_DIRECTORY,
      contentDirectory: DEFAULT_CONTENT_DIRECTORY,
    });
    expect(DEFAULT_ASSETS_DIRECTORY).toBe('./state/adapters/inbound/public');
    expect(DEFAULT_CONTENT_DIRECTORY).toBe(
      './state/adapters/inbound/content/posts'
    );
  });

  test('RMET-UNIT-176 takes every value from the environment, trimmed (A6.23)', () => {
    expect(
      resolveBuildSettings({
        PUBLIC_SITE_URL: ' https://example.github.io ',
        PUBLIC_BASE_PATH: '/rmet-publishing',
        PUBLIC_ASSETS_DIR: ' tests/fixtures/public ',
        PUBLIC_CONTENT_DIR: 'tests/fixtures/content',
      })
    ).toEqual({
      site: 'https://example.github.io',
      base: '/rmet-publishing',
      assetsDirectory: 'tests/fixtures/public',
      contentDirectory: 'tests/fixtures/content',
    });
  });

  test('RMET-UNIT-177 treats a blank value as unset (A6.23)', () => {
    expect(
      resolveBuildSettings({
        PUBLIC_SITE_URL: '',
        PUBLIC_BASE_PATH: '  ',
        PUBLIC_ASSETS_DIR: '',
        PUBLIC_CONTENT_DIR: ' ',
      })
    ).toEqual(resolveBuildSettings({}));
  });

  test('RMET-UNIT-178 hands Astro a normalized base path (A6.23)', () => {
    expect(
      resolveBuildSettings({ PUBLIC_BASE_PATH: 'rmet-publishing/' }).base
    ).toBe('/rmet-publishing');
    expect(resolveBuildSettings({ PUBLIC_BASE_PATH: '/' }).base).toBe('/');
  });

  test('RMET-UNIT-179 reads its settings under the prefix Astro exposes to pages (A6.23)', () => {
    expect(BUILD_SETTING_PREFIX).toBe('PUBLIC_');
  });
});
