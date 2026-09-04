import { afterEach, describe, expect, test, vi } from 'vitest';

import {
  SUBSCRIBE_ENVIRONMENT_KEYS,
  resolveSubscribeSettings,
} from '../../logic/subscribe/subscribe_settings';
import { siteEnvironment } from '../../state/adapters/outbound/environment/site_environment';

afterEach(() => {
  vi.unstubAllEnvs();
});

describe('site environment adapter', () => {
  test('RMET-INTEGRATION-001 exposes every public variable the site reads', () => {
    const snapshot = siteEnvironment().snapshot();
    for (const key of SUBSCRIBE_ENVIRONMENT_KEYS) {
      expect(Object.hasOwn(snapshot, key)).toBe(true);
    }
    expect(Object.hasOwn(snapshot, 'PUBLIC_SITE_URL')).toBe(true);
    expect(Object.hasOwn(snapshot, 'PUBLIC_CONTACT_EMAIL')).toBe(true);
  });

  test('RMET-INTEGRATION-004 resolves subscription settings from the real environment', () => {
    vi.stubEnv('PUBLIC_SUBSCRIBE_ACTION', 'https://subscribe.example/form');
    vi.stubEnv('PUBLIC_SUBSCRIBE_EMAIL_FIELD', 'email_address');
    expect(resolveSubscribeSettings(siteEnvironment().snapshot())).toEqual({
      action: 'https://subscribe.example/form',
      emailField: 'email_address',
    });
  });

  test('RMET-INTEGRATION-005 leaves subscriptions unconfigured when the address is absent', () => {
    vi.stubEnv('PUBLIC_SUBSCRIBE_ACTION', '');
    expect(
      resolveSubscribeSettings(siteEnvironment().snapshot())
    ).toBeUndefined();
  });
});
