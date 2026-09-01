import type { APIRoute } from 'astro';

import { buildRssFeed } from '../../../../logic/feed/rss_feed';
import { absoluteUrl, postPath } from '../../../../logic/posts/post_routes';
import { SITE } from '../../../../logic/site/site_config';
import { postRepository } from '../../outbound/content/post_content_repository';
import { siteHref } from '../site_links';

export const prerender = true;

export const GET: APIRoute = async ({ site }) => {
  const base = site?.href ?? SITE.defaultSiteUrl;
  const posts = await postRepository().listPosts();
  const feed = buildRssFeed(
    {
      title: SITE.name,
      link: absoluteUrl(base, siteHref('/')),
      description: SITE.description,
      language: SITE.locale,
    },
    posts.map((post) => ({
      title: post.title,
      link: absoluteUrl(base, siteHref(postPath(post))),
      description: post.description,
      publishedAt: post.publishedAt,
    }))
  );
  return new Response(feed, {
    status: 200,
    headers: { 'Content-Type': 'application/xml; charset=utf-8' },
  });
};
