import { afterEach, describe, expect, test, vi } from 'vitest';

import {
  GISCUS_ENVIRONMENT_KEYS,
  resolveGiscusSettings,
} from '../../logic/comments/giscus_settings';
import { siteEnvironment } from '../../state/adapters/outbound/environment/site_environment';

afterEach(() => {
  vi.unstubAllEnvs();
});

describe('site environment adapter', () => {
  test('RMET-INTEGRATION-001 exposes every public variable the site reads', () => {
    const snapshot = siteEnvironment().snapshot();
    for (const key of GISCUS_ENVIRONMENT_KEYS) {
      expect(Object.hasOwn(snapshot, key)).toBe(true);
    }
    expect(Object.hasOwn(snapshot, 'PUBLIC_SITE_URL')).toBe(true);
    expect(Object.hasOwn(snapshot, 'PUBLIC_CONTACT_EMAIL')).toBe(true);
  });

  test('RMET-INTEGRATION-002 resolves comment settings from the real environment', () => {
    vi.stubEnv('PUBLIC_GISCUS_REPO', 'owner/repository');
    vi.stubEnv('PUBLIC_GISCUS_REPO_ID', 'R_kgDO');
    vi.stubEnv('PUBLIC_GISCUS_CATEGORY', 'Announcements');
    vi.stubEnv('PUBLIC_GISCUS_CATEGORY_ID', 'DIC_kwDO');
    expect(resolveGiscusSettings(siteEnvironment().snapshot())).toEqual({
      repo: 'owner/repository',
      repoId: 'R_kgDO',
      category: 'Announcements',
      categoryId: 'DIC_kwDO',
    });
  });

  test('RMET-INTEGRATION-003 leaves comments unconfigured when the variables are absent', () => {
    vi.stubEnv('PUBLIC_GISCUS_REPO', '');
    expect(resolveGiscusSettings(siteEnvironment().snapshot())).toBeUndefined();
  });
});
