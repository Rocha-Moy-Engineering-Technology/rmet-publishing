import { describe, expect, test } from 'vitest';

import { mailtoHref, splitEmail } from '../../logic/contact/contact_email';

describe('contact email', () => {
  test('RMET-UNIT-140 splits an address into its parts for obfuscation (A6.5)', () => {
    expect(splitEmail('someone@example.org')).toEqual({
      user: 'someone',
      domain: 'example.org',
    });
  });

  test('RMET-UNIT-141 refuses an address without exactly one separator (A6.5)', () => {
    expect(splitEmail('someone-example.org')).toBeUndefined();
    expect(splitEmail('a@b@example.org')).toBeUndefined();
  });

  test('RMET-UNIT-142 refuses an address with an empty part (A6.5)', () => {
    expect(splitEmail('@example.org')).toBeUndefined();
    expect(splitEmail('someone@')).toBeUndefined();
  });

  test('RMET-UNIT-143 builds a plain mail address link (A6.5)', () => {
    expect(mailtoHref('someone@example.org')).toBe(
      'mailto:someone@example.org'
    );
  });

  test('RMET-UNIT-144 encodes a subject into the mail address link (A6.5)', () => {
    expect(mailtoHref('someone@example.org', 'Hello & welcome')).toBe(
      'mailto:someone@example.org?subject=Hello%20%26%20welcome'
    );
  });
});
