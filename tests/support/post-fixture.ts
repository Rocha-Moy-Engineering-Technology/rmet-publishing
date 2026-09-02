import type { Post } from '../../types/post';

export function makePost(overrides: Partial<Post> = {}): Post {
  return {
    slug: 'a-piece',
    title: 'A piece',
    description: 'A short description.',
    publishedAt: new Date('2026-01-15T00:00:00.000Z'),
    tags: ['agents'],
    draft: false,
    authors: ['Pedro Henrique Rocha Moy'],
    readingMinutes: 3,
    ...overrides,
  };
}
