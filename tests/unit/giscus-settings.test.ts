import { describe, expect, test } from 'vitest';

import {
  GISCUS_ENVIRONMENT_KEYS,
  giscusAttributes,
  giscusThemeMessage,
  resolveGiscusSettings,
} from '../../logic/comments/giscus_settings';

const complete = {
  PUBLIC_GISCUS_REPO: 'Rocha-Moy-Engineering-Technology/rmet-publishing',
  PUBLIC_GISCUS_REPO_ID: 'R_kgDO',
  PUBLIC_GISCUS_CATEGORY: 'Announcements',
  PUBLIC_GISCUS_CATEGORY_ID: 'DIC_kwDO',
};

describe('giscus settings', () => {
  test('RMET-UNIT-150 names the four variables the embed needs', () => {
    expect(GISCUS_ENVIRONMENT_KEYS).toEqual([
      'PUBLIC_GISCUS_REPO',
      'PUBLIC_GISCUS_REPO_ID',
      'PUBLIC_GISCUS_CATEGORY',
      'PUBLIC_GISCUS_CATEGORY_ID',
    ]);
  });

  test('RMET-UNIT-151 resolves settings when every variable is present', () => {
    expect(resolveGiscusSettings(complete)).toEqual({
      repo: 'Rocha-Moy-Engineering-Technology/rmet-publishing',
      repoId: 'R_kgDO',
      category: 'Announcements',
      categoryId: 'DIC_kwDO',
    });
  });

  test('RMET-UNIT-152 resolves nothing when a variable is missing or blank', () => {
    expect(
      resolveGiscusSettings({ ...complete, PUBLIC_GISCUS_REPO_ID: undefined })
    ).toBeUndefined();
    expect(
      resolveGiscusSettings({ ...complete, PUBLIC_GISCUS_CATEGORY: '   ' })
    ).toBeUndefined();
  });

  test('RMET-UNIT-153 trims the values it resolves', () => {
    expect(
      resolveGiscusSettings({ ...complete, PUBLIC_GISCUS_REPO: ' owner/repo ' })
        ?.repo
    ).toBe('owner/repo');
  });

  test('RMET-UNIT-154 builds the embed attributes with reactions enabled', () => {
    const settings = resolveGiscusSettings(complete);
    if (!settings) throw new Error('settings should resolve');
    const attributes = giscusAttributes(settings, {
      term: 'papers/on-evaluation',
    });
    expect(attributes['data-repo']).toBe(
      'Rocha-Moy-Engineering-Technology/rmet-publishing'
    );
    expect(attributes['data-mapping']).toBe('specific');
    expect(attributes['data-term']).toBe('papers/on-evaluation');
    expect(attributes['data-reactions-enabled']).toBe('1');
    expect(attributes['data-theme']).toBe('preferred_color_scheme');
    expect(attributes['data-loading']).toBe('lazy');
  });

  test('RMET-UNIT-155 accepts a chosen theme for the embed', () => {
    const settings = resolveGiscusSettings(complete);
    if (!settings) throw new Error('settings should resolve');
    expect(
      giscusAttributes(settings, { term: 'x', theme: 'dark' })['data-theme']
    ).toBe('dark');
  });

  test('RMET-UNIT-156 builds the message that retunes the embed theme', () => {
    expect(giscusThemeMessage('dark')).toEqual({
      giscus: { setConfig: { theme: 'dark' } },
    });
  });
});
