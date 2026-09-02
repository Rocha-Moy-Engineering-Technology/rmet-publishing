import type { APIRoute } from 'astro';

import { buildSitemap } from '../../../../logic/feed/sitemap';
import { collectTags } from '../../../../logic/posts/post_queries';
import {
  absoluteUrl,
  postPath,
  tagPath,
} from '../../../../logic/posts/post_routes';
import { SITE } from '../../../../logic/site/site_config';
import { postRepository } from '../../outbound/content/post_content_repository';
import { siteHref } from '../site_links';
import type { SitemapEntry } from '../../../../types/feed';

export const prerender = true;

const STATIC_PATHS: readonly string[] = ['/', '/tags', '/contact'];

export const GET: APIRoute = async ({ site }) => {
  const base = site?.href ?? SITE.defaultSiteUrl;
  const posts = await postRepository().listPosts();
  const paths: readonly string[] = [
    ...STATIC_PATHS,
    ...collectTags(posts).map((tag) => tagPath(tag.slug)),
  ];
  const entries: readonly SitemapEntry[] = [
    ...paths.map((path) => ({ loc: absoluteUrl(base, siteHref(path)) })),
    ...posts.map((post) => ({
      loc: absoluteUrl(base, siteHref(postPath(post))),
      lastModified: post.updatedAt ?? post.publishedAt,
    })),
  ];
  return new Response(buildSitemap(entries), {
    status: 200,
    headers: { 'Content-Type': 'application/xml; charset=utf-8' },
  });
};
