import { slugify } from '../text/slugify';
import type { Post, TagCount } from '../../types/post';

/** The one rule that keeps a piece out of every generated output. */
export function isPublished(post: Post): boolean {
  return !post.draft;
}

export function postsWithTag(
  posts: readonly Post[],
  tagSlug: string
): readonly Post[] {
  return posts.filter((post) =>
    post.tags.some((tag) => slugify(tag) === tagSlug)
  );
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

/** Newest first; two pieces from the same day fall back to title order. */
export function comparePostsByRecency(first: Post, second: Post): number {
  const byDate = second.publishedAt.getTime() - first.publishedAt.getTime();
  return byDate === 0 ? first.title.localeCompare(second.title) : byDate;
}

function compareTags(first: TagCount, second: TagCount): number {
  const byCount = second.count - first.count;
  return byCount === 0 ? first.tag.localeCompare(second.tag) : byCount;
}
