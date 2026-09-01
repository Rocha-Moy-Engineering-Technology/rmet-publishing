import { escapeXml } from '../text/escape_xml';
import { toIsoDate } from '../text/format_date';
import type { SitemapEntry } from '../../types/feed';

function renderEntry(entry: SitemapEntry): string {
  const lines = [
    '  <url>',
    `    <loc>${escapeXml(entry.loc)}</loc>`,
    ...(entry.lastModified === undefined
      ? []
      : [`    <lastmod>${toIsoDate(entry.lastModified)}</lastmod>`]),
    '  </url>',
  ];
  return lines.join('\n');
}

export function buildSitemap(entries: readonly SitemapEntry[]): string {
  return [
    '<?xml version="1.0" encoding="UTF-8"?>',
    '<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">',
    ...entries.map(renderEntry),
    '</urlset>',
    '',
  ].join('\n');
}
