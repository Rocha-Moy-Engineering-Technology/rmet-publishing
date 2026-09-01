import { slugify } from '../text/slugify';
import { readingMinutes } from '../text/reading_time';
import type { Post, PostSource } from '../../types/post';

function slugFromId(id: string): string {
  return slugify(id.slice(id.lastIndexOf('/') + 1));
}

export function toPost(source: PostSource): Post {
  const { data } = source;
  return {
    slug: slugFromId(source.id),
    kind: data.kind,
    title: data.title,
    description: data.description,
    publishedAt: data.publishedAt,
    updatedAt: data.updatedAt,
    tags: data.tags ?? [],
    draft: data.draft ?? false,
    authors: data.authors ?? [],
    abstract: data.abstract,
    doi: data.doi,
    pdfUrl: data.pdfUrl,
    canonicalUrl: data.canonicalUrl,
    readingMinutes: readingMinutes(source.body),
  };
}
