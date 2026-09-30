import { describe, expect, test } from 'vitest';

import {
  collectTags,
  comparePostsByRecency,
  isPublished,
  postsWithTag,
} from '../../logic/posts/post_queries';
import { makePost } from '../support/post-fixture';

const older = makePost({
  slug: 'older',
  title: 'Older',
  publishedAt: new Date('2026-01-01T00:00:00.000Z'),
  tags: ['Agents'],
});
const newer = makePost({
  slug: 'newer',
  title: 'Newer',
  publishedAt: new Date('2026-06-01T00:00:00.000Z'),
  tags: ['Agents', 'Evaluation'],
});
const draft = makePost({
  slug: 'draft',
  title: 'Draft',
  draft: true,
  publishedAt: new Date('2026-07-01T00:00:00.000Z'),
});
const sameDay = makePost({
  slug: 'a-same-day',
  title: 'A same day',
  publishedAt: new Date('2026-06-01T00:00:00.000Z'),
  tags: [],
});

describe('post queries', () => {
  test('RMET-UNIT-091 tells a published piece from a draft (A6.13)', () => {
    expect(isPublished(older)).toBe(true);
    expect(isPublished(draft)).toBe(false);
  });

  test('RMET-UNIT-092 keeps only the pieces carrying a tag (A6.3)', () => {
    expect(
      postsWithTag([older, newer, sameDay], 'evaluation').map(
        (post) => post.slug
      )
    ).toEqual(['newer']);
  });

  test('RMET-UNIT-093 orders the newest piece first (A6.1)', () => {
    expect(comparePostsByRecency(newer, older)).toBeLessThan(0);
    expect(comparePostsByRecency(older, newer)).toBeGreaterThan(0);
    expect(
      [older, newer].sort(comparePostsByRecency).map((post) => post.slug)
    ).toEqual(['newer', 'older']);
  });

  test('RMET-UNIT-094 breaks a same-day tie by title (A6.1)', () => {
    expect(comparePostsByRecency(sameDay, newer)).toBeLessThan(0);
    expect(comparePostsByRecency(newer, newer)).toBe(0);
    expect(
      [newer, sameDay].sort(comparePostsByRecency).map((post) => post.slug)
    ).toEqual(['a-same-day', 'newer']);
  });

  test('RMET-UNIT-087 counts tags and orders them by weight then name (A6.3)', () => {
    expect(collectTags([older, newer])).toEqual([
      { tag: 'Agents', slug: 'agents', count: 2 },
      { tag: 'Evaluation', slug: 'evaluation', count: 1 },
    ]);
  });

  test('RMET-UNIT-088 counts a tag once per piece regardless of spelling (A6.3)', () => {
    const shouty = makePost({ slug: 'shouty', tags: ['AGENTS'] });
    expect(collectTags([older, shouty])).toEqual([
      { tag: 'Agents', slug: 'agents', count: 2 },
    ]);
  });

  test('RMET-UNIT-089 counts a tag repeated inside one piece only once (A6.3)', () => {
    const repeated = makePost({ slug: 'repeated', tags: ['Agents', 'agents'] });
    expect(collectTags([repeated])).toEqual([
      { tag: 'Agents', slug: 'agents', count: 1 },
    ]);
  });

  test('RMET-UNIT-090 orders equally weighted tags by name (A6.3)', () => {
    const first = makePost({ slug: 'one', tags: ['Zebra'] });
    const second = makePost({ slug: 'two', tags: ['Agents'] });
    expect(collectTags([first, second]).map((tag) => tag.tag)).toEqual([
      'Agents',
      'Zebra',
    ]);
  });
});
