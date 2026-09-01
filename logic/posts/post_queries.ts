import { slugify } from '../text/slugify';
import type { Post, PostKind, TagCount } from '../../types/post';

export function publishedPosts(posts: readonly Post[]): readonly Post[] {
  return posts.filter((post) => !post.draft);
}

export function postsOfKind(
  posts: readonly Post[],
  kind: PostKind
): readonly Post[] {
  return posts.filter((post) => post.kind === kind);
}

export function postsWithTag(
  posts: readonly Post[],
  tagSlug: string
): readonly Post[] {
  return posts.filter((post) =>
    post.tags.some((tag) => slugify(tag) === tagSlug)
  );
}

export function newestFirst(posts: readonly Post[]): readonly Post[] {
  return [...posts].sort(comparePostsByRecency);
}

export function latestPosts(
  posts: readonly Post[],
  count: number
): readonly Post[] {
  return newestFirst(posts).slice(0, count);
}

export function findPost(
  posts: readonly Post[],
  kind: PostKind,
  slug: string
): Post | undefined {
  return posts.find((post) => post.kind === kind && post.slug === slug);
}

export function collectTags(posts: readonly Post[]): readonly TagCount[] {
  const counts = new Map<string, TagCount>();
  for (const post of posts) {
    for (const tag of uniqueTagSlugs(post)) addTag(counts, tag);
  }
  return [...counts.values()].sort(compareTags);
}

function uniqueTagSlugs(post: Post): readonly string[] {
  const seen = new Map<string, string>();
  for (const tag of post.tags) {
    const slug = slugify(tag);
    if (!seen.has(slug)) seen.set(slug, tag);
  }
  return [...seen.values()];
}

function addTag(counts: Map<string, TagCount>, tag: string): void {
  const slug = slugify(tag);
  const existing = counts.get(slug);
  counts.set(slug, {
    tag: existing?.tag ?? tag,
    slug,
    count: (existing?.count ?? 0) + 1,
  });
}

export function comparePostsByRecency(first: Post, second: Post): number {
  const byDate = second.publishedAt.getTime() - first.publishedAt.getTime();
  return byDate === 0 ? first.title.localeCompare(second.title) : byDate;
}

function compareTags(first: TagCount, second: TagCount): number {
  const byCount = second.count - first.count;
  return byCount === 0 ? first.tag.localeCompare(second.tag) : byCount;
}
