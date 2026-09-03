import { describe, expect, test } from 'vitest';

import { SITE } from '../../logic/site/site_config';

describe('site configuration', () => {
  test('RMET-UNIT-001 names the publication and its author separately', () => {
    expect(SITE.name).toBe('Pedro Henrique Rocha Moy');
    expect(SITE.publicationTitle).toBe(
      'Rocha Moy Engineering & Technology Blog'
    );
    expect(SITE.tagline).toBe(
      'Engineering & Technology, Artificial Intelligence, Machine Learning, Data Science, Data & Software Engineering'
    );
    expect(SITE.author).toBe('Pedro Henrique Rocha Moy');
    expect(SITE.locale).toBe('en');
  });

  test('RMET-UNIT-002 carries the three profile links', () => {
    const targets = SITE.profileLinks.map((link) => link.href);
    expect(targets).toContain('https://github.com/phrmoy');
    expect(targets).toContain('https://www.linkedin.com/in/phrmoy/');
    expect(targets).toContain(
      'https://rocha-moy-engineering-technology.github.io/resume/'
    );
  });

  test('RMET-UNIT-003 gives every profile link a label, handle, and mark', () => {
    for (const link of SITE.profileLinks) {
      expect(link.label.length).toBeGreaterThan(0);
      expect(link.handle.length).toBeGreaterThan(0);
      expect(link.href.startsWith('https://')).toBe(true);
      expect(['github', 'linkedin', 'resume']).toContain(link.mark);
    }
  });

  test('RMET-UNIT-004 provides a default site address and contact address', () => {
    expect(SITE.defaultSiteUrl.startsWith('http')).toBe(true);
    expect(SITE.defaultContactEmail).toContain('@');
  });
});
