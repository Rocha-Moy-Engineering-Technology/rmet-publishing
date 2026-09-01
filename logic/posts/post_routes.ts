import { kindSegment } from './post_kinds';
import type { Post, PostKind } from '../../types/post';

export function kindPath(kind: PostKind): string {
  return `/${kindSegment(kind)}`;
}

export function postPath(post: Post): string {
  return `${kindPath(post.kind)}/${post.slug}`;
}

export function tagPath(tagSlug: string): string {
  return `/tags/${tagSlug}`;
}

export function absoluteUrl(baseUrl: string, path: string): string {
  const base = baseUrl.replace(/\/+$/, '');
  const suffix = path.replace(/^\/+/, '');
  return `${base}/${suffix}`;
}
