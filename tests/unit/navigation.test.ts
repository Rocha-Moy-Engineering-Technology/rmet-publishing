import { describe, expect, test } from 'vitest';

import { isActivePath, navigationItems } from '../../logic/site/navigation';

describe('site navigation', () => {
  test('RMET-UNIT-010 leads with the combined writing index', () => {
    expect(navigationItems()[0]).toEqual({
      label: 'Writing',
      href: '/writing',
    });
  });

  test('RMET-UNIT-011 offers one entry per kind and a contact entry', () => {
    const targets = navigationItems().map((item) => item.href);
    expect(targets).toEqual([
      '/writing',
      '/blog',
      '/articles',
      '/papers',
      '/contact',
    ]);
  });

  test('RMET-UNIT-012 marks the exact page as active', () => {
    expect(isActivePath('/papers', '/papers')).toBe(true);
    expect(isActivePath('/papers/', '/papers')).toBe(true);
  });

  test('RMET-UNIT-013 marks a piece as active within its kind', () => {
    expect(isActivePath('/papers/a-paper', '/papers')).toBe(true);
  });

  test('RMET-UNIT-014 leaves unrelated pages inactive', () => {
    expect(isActivePath('/contact', '/papers')).toBe(false);
    expect(isActivePath('/papers-and-more', '/papers')).toBe(false);
  });

  test('RMET-UNIT-015 treats the home page as active only for itself', () => {
    expect(isActivePath('/', '/')).toBe(true);
    expect(isActivePath('/writing', '/')).toBe(false);
  });
});
