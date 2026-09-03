import { readSetting } from '../site/settings';
import type { EnvironmentSnapshot } from '../../types/ports/environment_reader';
import type { SubscribeSettings } from '../../types/subscribe';

export const SUBSCRIBE_ENVIRONMENT_KEYS = [
  'PUBLIC_SUBSCRIBE_ACTION',
  'PUBLIC_SUBSCRIBE_EMAIL_FIELD',
] as const;

/** The field name most providers read; Kit wants `email_address`, Mailchimp `EMAIL`. */
export const DEFAULT_SUBSCRIBE_EMAIL_FIELD = 'email';

const [ACTION_KEY, EMAIL_FIELD_KEY] = SUBSCRIBE_ENVIRONMENT_KEYS;

function isHttpsAddress(value: string): boolean {
  return URL.canParse(value) && new URL(value).protocol === 'https:';
}

/**
 * The form is on only while the provider address is set. A set address that
 * is not an https address is a misconfiguration, so it fails the build rather
 * than shipping a form that posts nowhere useful.
 */
export function resolveSubscribeSettings(
  environment: EnvironmentSnapshot
): SubscribeSettings | undefined {
  const action = readSetting(environment, ACTION_KEY);
  if (action === undefined) return undefined;
  if (!isHttpsAddress(action)) {
    throw new Error(
      `${ACTION_KEY} must be an https:// address, got: ${action}`
    );
  }
  const emailField =
    readSetting(environment, EMAIL_FIELD_KEY) ?? DEFAULT_SUBSCRIBE_EMAIL_FIELD;
  return { action, emailField };
}
