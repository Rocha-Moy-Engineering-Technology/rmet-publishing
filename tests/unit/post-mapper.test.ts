import { describe, expect, test } from 'vitest';

import { toPost } from '../../logic/posts/post_mapper';
import type { PostSource } from '../../types/post';

function source(overrides: Partial<PostSource> = {}): PostSource {
  return {
    id: 'agentic-workflows',
    body: 'word '.repeat(400),
    data: {
      title: 'Agentic workflows',
      description: 'How agents get work done.',
      kind: 'article',
      publishedAt: new Date('2026-02-01T00:00:00.000Z'),
    },
    ...overrides,
  };
}

describe('mapping content to a post', () => {
  test('RMET-UNIT-070 carries the front matter onto the post', () => {
    const post = toPost(source());
    expect(post.title).toBe('Agentic workflows');
    expect(post.description).toBe('How agents get work done.');
    expect(post.kind).toBe('article');
    expect(post.publishedAt.toISOString()).toBe('2026-02-01T00:00:00.000Z');
  });

  test('RMET-UNIT-071 derives the slug from the file identifier', () => {
    expect(toPost(source({ id: '2026/Agentic Workflows' })).slug).toBe(
      'agentic-workflows'
    );
  });

  test('RMET-UNIT-072 defaults the optional front matter', () => {
    const post = toPost(source());
    expect(post.tags).toEqual([]);
    expect(post.authors).toEqual([]);
    expect(post.draft).toBe(false);
    expect(post.updatedAt).toBeUndefined();
    expect(post.abstract).toBeUndefined();
    expect(post.doi).toBeUndefined();
    expect(post.pdfUrl).toBeUndefined();
    expect(post.canonicalUrl).toBeUndefined();
  });

  test('RMET-UNIT-073 keeps the scholarly front matter of a paper', () => {
    const post = toPost(
      source({
        data: {
          title: 'On evaluation',
          description: 'Measuring agents.',
          kind: 'paper',
          publishedAt: new Date('2026-03-01T00:00:00.000Z'),
          updatedAt: new Date('2026-04-01T00:00:00.000Z'),
          tags: ['Evaluation', 'Agents'],
          draft: true,
          authors: ['Pedro Henrique Rocha Moy'],
          abstract: 'An abstract.',
          doi: '10.1000/example',
          pdfUrl: '/papers/on-evaluation.pdf',
          canonicalUrl: 'https://example.org/on-evaluation',
        },
      })
    );
    expect(post.tags).toEqual(['Evaluation', 'Agents']);
    expect(post.draft).toBe(true);
    expect(post.authors).toEqual(['Pedro Henrique Rocha Moy']);
    expect(post.abstract).toBe('An abstract.');
    expect(post.doi).toBe('10.1000/example');
    expect(post.pdfUrl).toBe('/papers/on-evaluation.pdf');
    expect(post.canonicalUrl).toBe('https://example.org/on-evaluation');
    expect(post.updatedAt?.toISOString()).toBe('2026-04-01T00:00:00.000Z');
  });

  test('RMET-UNIT-074 estimates the reading time from the body', () => {
    expect(toPost(source()).readingMinutes).toBe(2);
  });
});
