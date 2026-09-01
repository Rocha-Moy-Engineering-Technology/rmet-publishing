import { describe, expect, test } from 'vitest';

import { buildSitemap } from '../../logic/feed/sitemap';

describe('sitemap', () => {
  test('RMET-UNIT-130 lists every address in a sitemap document', () => {
    const sitemap = buildSitemap([{ loc: 'https://example.org/' }]);
    expect(sitemap.startsWith('<?xml version="1.0" encoding="UTF-8"?>')).toBe(
      true
    );
    expect(sitemap).toContain(
      '<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">'
    );
    expect(sitemap).toContain('<loc>https://example.org/</loc>');
  });

  test('RMET-UNIT-131 records a last modification date when it is known', () => {
    const sitemap = buildSitemap([
      {
        loc: 'https://example.org/papers/on-evaluation',
        lastModified: new Date('2026-09-01T12:00:00.000Z'),
      },
    ]);
    expect(sitemap).toContain('<lastmod>2026-09-01</lastmod>');
  });

  test('RMET-UNIT-132 omits the modification date when it is unknown', () => {
    expect(buildSitemap([{ loc: 'https://example.org/' }])).not.toContain(
      '<lastmod>'
    );
  });

  test('RMET-UNIT-133 escapes markup in addresses', () => {
    expect(buildSitemap([{ loc: 'https://example.org/?a=1&b=2' }])).toContain(
      '<loc>https://example.org/?a=1&amp;b=2</loc>'
    );
  });
});
