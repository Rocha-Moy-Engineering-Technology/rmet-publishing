import { describe, expect, test } from 'vitest';

import {
  DEFAULT_SUBSCRIBE_EMAIL_FIELD,
  SUBSCRIBE_ENVIRONMENT_KEYS,
  resolveSubscribeSettings,
} from '../../logic/subscribe/subscribe_settings';

const action = 'https://buttondown.com/api/emails/embed-subscribe/rmet';

describe('subscription settings', () => {
  test('RMET-UNIT-210 names the two variables the form reads', () => {
    expect(SUBSCRIBE_ENVIRONMENT_KEYS).toEqual([
      'PUBLIC_SUBSCRIBE_ACTION',
      'PUBLIC_SUBSCRIBE_EMAIL_FIELD',
    ]);
  });

  test('RMET-UNIT-211 resolves the provider address with the default email field', () => {
    expect(DEFAULT_SUBSCRIBE_EMAIL_FIELD).toBe('email');
    expect(
      resolveSubscribeSettings({ PUBLIC_SUBSCRIBE_ACTION: action })
    ).toEqual({ action, emailField: 'email' });
  });

  test('RMET-UNIT-212 resolves nothing while the provider address is unset', () => {
    expect(resolveSubscribeSettings({})).toBeUndefined();
    expect(
      resolveSubscribeSettings({ PUBLIC_SUBSCRIBE_ACTION: '   ' })
    ).toBeUndefined();
    expect(
      resolveSubscribeSettings({ PUBLIC_SUBSCRIBE_EMAIL_FIELD: 'EMAIL' })
    ).toBeUndefined();
  });

  test('RMET-UNIT-213 honors a configured email field name, trimmed, and falls back on a blank one', () => {
    expect(
      resolveSubscribeSettings({
        PUBLIC_SUBSCRIBE_ACTION: ` ${action} `,
        PUBLIC_SUBSCRIBE_EMAIL_FIELD: ' email_address ',
      })
    ).toEqual({ action, emailField: 'email_address' });
    expect(
      resolveSubscribeSettings({
        PUBLIC_SUBSCRIBE_ACTION: action,
        PUBLIC_SUBSCRIBE_EMAIL_FIELD: '   ',
      })?.emailField
    ).toBe('email');
  });

  test('RMET-UNIT-214 rejects a provider address that is not an https address', () => {
    for (const bad of [
      '/subscribe',
      'http://subscribe.example/form',
      'not an address',
      'mailto:list@example.com',
    ]) {
      expect(() =>
        resolveSubscribeSettings({ PUBLIC_SUBSCRIBE_ACTION: bad })
      ).toThrow('PUBLIC_SUBSCRIBE_ACTION');
    }
  });
});
