import type { Post } from '../../types/post';

export const WRITINGS_SEGMENT = 'writings';

export function postPath(post: Post): string {
  return `/${WRITINGS_SEGMENT}/${post.slug}`;
}

export function tagPath(tagSlug: string): string {
  return `/tags/${tagSlug}`;
}

export function absoluteUrl(baseUrl: string, path: string): string {
  const base = baseUrl.replace(/\/+$/, '');
  const suffix = path.replace(/^\/+/, '');
  return `${base}/${suffix}`;
}
