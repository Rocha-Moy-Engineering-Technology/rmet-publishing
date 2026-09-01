import { describe, expect, test } from 'vitest';

import { buildRssFeed } from '../../logic/feed/rss_feed';

const channel = {
  title: 'RMET Publishing',
  link: 'https://example.org',
  description: 'Blogs, articles, and papers.',
  language: 'en',
};

const item = {
  title: 'On evaluation',
  link: 'https://example.org/papers/on-evaluation',
  description: 'Measuring agents.',
  publishedAt: new Date('2026-09-01T12:05:09.000Z'),
};

describe('really simple syndication feed', () => {
  test('RMET-UNIT-120 opens with a feed document and channel metadata', () => {
    const feed = buildRssFeed(channel, [item]);
    expect(feed.startsWith('<?xml version="1.0" encoding="UTF-8"?>')).toBe(
      true
    );
    expect(feed).toContain('<title>RMET Publishing</title>');
    expect(feed).toContain('<link>https://example.org</link>');
    expect(feed).toContain('<language>en</language>');
  });

  test('RMET-UNIT-121 writes one entry per piece with a stable identifier', () => {
    const feed = buildRssFeed(channel, [item]);
    expect(feed).toContain(
      '<guid isPermaLink="true">https://example.org/papers/on-evaluation</guid>'
    );
    expect(feed).toContain('<pubDate>Tue, 01 Sep 2026 12:05:09 GMT</pubDate>');
  });

  test('RMET-UNIT-122 escapes markup in titles and descriptions', () => {
    const feed = buildRssFeed(channel, [
      { ...item, title: 'Agents & <tools>' },
    ]);
    expect(feed).toContain('<title>Agents &amp; &lt;tools&gt;</title>');
  });

  test('RMET-UNIT-123 writes a valid feed with no entries', () => {
    const feed = buildRssFeed(channel, []);
    expect(feed).toContain('</channel>');
    expect(feed).not.toContain('<item>');
  });
});
