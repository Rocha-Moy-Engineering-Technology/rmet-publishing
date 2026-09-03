import { escapeXml } from '../text/escape_xml';
import { toRfc822Date } from '../text/format_date';
import type { FeedChannel, FeedItem } from '../../types/feed';

function renderItem(item: FeedItem): string {
  return [
    '    <item>',
    `      <title>${escapeXml(item.title)}</title>`,
    `      <link>${escapeXml(item.link)}</link>`,
    `      <guid isPermaLink="true">${escapeXml(item.link)}</guid>`,
    `      <description>${escapeXml(item.description)}</description>`,
    `      <content:encoded>${escapeXml(item.content)}</content:encoded>`,
    `      <pubDate>${toRfc822Date(item.publishedAt)}</pubDate>`,
    '    </item>',
  ].join('\n');
}

export function buildRssFeed(
  channel: FeedChannel,
  items: readonly FeedItem[]
): string {
  return [
    '<?xml version="1.0" encoding="UTF-8"?>',
    '<rss version="2.0" xmlns:atom="http://www.w3.org/2005/Atom" xmlns:content="http://purl.org/rss/1.0/modules/content/">',
    '  <channel>',
    `    <title>${escapeXml(channel.title)}</title>`,
    `    <link>${escapeXml(channel.link)}</link>`,
    `    <description>${escapeXml(channel.description)}</description>`,
    `    <language>${escapeXml(channel.language)}</language>`,
    ...items.map(renderItem),
    '  </channel>',
    '</rss>',
    '',
  ].join('\n');
}
