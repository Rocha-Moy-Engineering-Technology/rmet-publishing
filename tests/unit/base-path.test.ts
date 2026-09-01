import { describe, expect, test } from 'vitest';

import {
  astroBase,
  normalizeBasePath,
  stripBasePath,
  withBasePath,
} from '../../logic/site/base_path';

describe('base path', () => {
  test('RMET-UNIT-160 treats an absent, empty, or root value as no base', () => {
    expect(normalizeBasePath(undefined)).toBe('');
    expect(normalizeBasePath('')).toBe('');
    expect(normalizeBasePath('/')).toBe('');
  });

  test('RMET-UNIT-161 normalizes a project base to a single leading slash', () => {
    expect(normalizeBasePath('/rmet-publishing')).toBe('/rmet-publishing');
    expect(normalizeBasePath('rmet-publishing')).toBe('/rmet-publishing');
    expect(normalizeBasePath('/rmet-publishing/')).toBe('/rmet-publishing');
    expect(normalizeBasePath('  /rmet-publishing/  ')).toBe('/rmet-publishing');
  });

  test('RMET-UNIT-162 prefixes an internal address with the base', () => {
    expect(withBasePath('/rmet-publishing', '/blog')).toBe(
      '/rmet-publishing/blog'
    );
    expect(withBasePath('/rmet-publishing', '/papers/on-evaluation')).toBe(
      '/rmet-publishing/papers/on-evaluation'
    );
  });

  test('RMET-UNIT-163 keeps the home address usable under a base', () => {
    expect(withBasePath('/rmet-publishing', '/')).toBe('/rmet-publishing/');
    expect(withBasePath('', '/')).toBe('/');
  });

  test('RMET-UNIT-164 leaves an internal address alone when there is no base', () => {
    expect(withBasePath('', '/blog')).toBe('/blog');
  });

  test('RMET-UNIT-165 never rewrites an address that is not site-internal', () => {
    expect(withBasePath('/rmet-publishing', 'https://github.com/phrmoy')).toBe(
      'https://github.com/phrmoy'
    );
    expect(withBasePath('/rmet-publishing', 'mailto:someone@example.org')).toBe(
      'mailto:someone@example.org'
    );
    expect(withBasePath('/rmet-publishing', '#content')).toBe('#content');
  });

  test('RMET-UNIT-166 strips the base from an incoming address', () => {
    expect(stripBasePath('/rmet-publishing', '/rmet-publishing/blog')).toBe(
      '/blog'
    );
    expect(stripBasePath('/rmet-publishing', '/rmet-publishing')).toBe('/');
    expect(stripBasePath('/rmet-publishing', '/rmet-publishing/')).toBe('/');
  });

  test('RMET-UNIT-167 leaves an address that does not carry the base', () => {
    expect(stripBasePath('', '/blog')).toBe('/blog');
    expect(stripBasePath('/rmet-publishing', '/blog')).toBe('/blog');
    expect(stripBasePath('/rmet-publishing', '/rmet-publishing-notes')).toBe(
      '/rmet-publishing-notes'
    );
  });

  test('RMET-UNIT-168 gives Astro a base it accepts', () => {
    expect(astroBase(undefined)).toBe('/');
    expect(astroBase('/rmet-publishing/')).toBe('/rmet-publishing');
  });
});
