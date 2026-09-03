import type { APIRoute } from 'astro';

import { absolutizeRootLinks } from '../../../../logic/feed/feed_links';
import { buildRssFeed } from '../../../../logic/feed/rss_feed';
import { absoluteUrl, postPath } from '../../../../logic/posts/post_routes';
import { SITE } from '../../../../logic/site/site_config';
import { postRepository } from '../../outbound/content/post_content_repository';
import { siteHref } from '../site_links';

export const prerender = true;

export const GET: APIRoute = async ({ site }) => {
  const base = site?.href ?? SITE.defaultSiteUrl;
  const resolve = (path: string): string => absoluteUrl(base, siteHref(path));
  const posts = await postRepository().listRenderedPosts();
  const feed = buildRssFeed(
    {
      title: SITE.publicationTitle,
      link: resolve('/'),
      description: SITE.description,
      language: SITE.locale,
    },
    posts.map(({ post, html }) => ({
      title: post.title,
      link: resolve(postPath(post)),
      description: post.description,
      content: absolutizeRootLinks(html, resolve),
      publishedAt: post.publishedAt,
    }))
  );
  return new Response(feed, {
    status: 200,
    headers: { 'Content-Type': 'application/xml; charset=utf-8' },
  });
};
