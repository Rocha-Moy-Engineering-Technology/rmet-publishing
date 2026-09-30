import { describe, expect, test } from 'vitest';

import {
  iconLinks,
  isActivePath,
  navigationAnchor,
  navigationItems,
  navigationLinks,
  profileLink,
} from '../../logic/site/navigation';

describe('site navigation', () => {
  test('RMET-UNIT-010 offers the resume and the contact page only (A6.4)', () => {
    expect(navigationItems().map((item) => item.label)).toEqual([
      'Resume',
      'Contact',
    ]);
  });

  test('RMET-UNIT-011 sends the resume entry off site and keeps contact on site (A6.4)', () => {
    const [resume, contact] = navigationItems();
    expect(resume.external).toBe(true);
    expect(resume.href).toBe(
      'https://rocha-moy-engineering-technology.github.io/resume/'
    );
    expect(contact.external).toBe(false);
    expect(contact.href).toBe('/contact');
  });

  test('RMET-UNIT-012 exposes GitHub and LinkedIn as icon links, without the resume (A6.4)', () => {
    expect(iconLinks().map((link) => link.mark)).toEqual([
      'github',
      'linkedin',
    ]);
  });

  test('RMET-UNIT-013 finds a profile link by its mark (A6.4)', () => {
    expect(profileLink('github').href).toBe('https://github.com/phrmoy');
  });

  test('RMET-UNIT-014 refuses a mark that is not configured (A6.4)', () => {
    expect(() =>
      profileLink('mastodon' as Parameters<typeof profileLink>[0])
    ).toThrow('No profile link for mark: mastodon');
  });

  test('RMET-UNIT-015 marks the exact page as active (A6.4)', () => {
    expect(isActivePath('/contact', '/contact')).toBe(true);
    expect(isActivePath('/contact/', '/contact')).toBe(true);
  });

  test('RMET-UNIT-016 marks a piece as active within its section (A6.4)', () => {
    expect(isActivePath('/writings/a-piece', '/writings')).toBe(true);
  });

  test('RMET-UNIT-017 leaves unrelated pages inactive (A6.4)', () => {
    expect(isActivePath('/contact', '/writings')).toBe(false);
    expect(isActivePath('/writings-and-more', '/writings')).toBe(false);
  });

  test('RMET-UNIT-018 treats the home page as active only for itself (A6.4)', () => {
    expect(isActivePath('/', '/')).toBe(true);
    expect(isActivePath('/contact', '/')).toBe(false);
  });
});

describe('navigation links', () => {
  test('RMET-UNIT-019 marks the entry for the current page as active (A6.4)', () => {
    const links = navigationLinks('/contact');
    expect(links.map((link) => link.active)).toEqual([false, true]);
  });

  test('RMET-UNIT-020 never marks an off-site entry as active (A6.4)', () => {
    const [resume] = navigationLinks(
      'https://rocha-moy-engineering-technology.github.io/resume/'
    );
    expect(resume.active).toBe(false);
  });

  test('RMET-UNIT-021 sends an off-site entry to a new tab and tags it for tests (A6.4)', () => {
    const [resume] = navigationLinks('/');
    expect(navigationAnchor(resume)).toEqual({
      rel: 'noopener',
      target: '_blank',
      'data-testid': 'resume-link',
    });
  });

  test('RMET-UNIT-022 marks the current on-site entry for assistive technology (A6.4)', () => {
    const [, contact] = navigationLinks('/contact');
    expect(navigationAnchor(contact)).toEqual({ 'aria-current': 'page' });
  });

  test('RMET-UNIT-023 leaves an inactive on-site entry unadorned (A6.4)', () => {
    const [, contact] = navigationLinks('/');
    expect(navigationAnchor(contact)).toEqual({});
  });
});
