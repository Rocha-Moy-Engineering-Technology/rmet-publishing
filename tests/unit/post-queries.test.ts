import { describe, expect, test } from 'vitest';

import {
  collectTags,
  findPost,
  latestPosts,
  newestFirst,
  postsWithTag,
  publishedPosts,
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
  test('RMET-UNIT-080 drops drafts', () => {
    expect(publishedPosts([older, draft]).map((post) => post.slug)).toEqual([
      'older',
    ]);
  });

  test('RMET-UNIT-082 keeps only the pieces carrying a tag', () => {
    expect(
      postsWithTag([older, newer, sameDay], 'evaluation').map(
        (post) => post.slug
      )
    ).toEqual(['newer']);
  });

  test('RMET-UNIT-083 orders the newest piece first', () => {
    expect(newestFirst([older, newer]).map((post) => post.slug)).toEqual([
      'newer',
      'older',
    ]);
  });

  test('RMET-UNIT-084 breaks a same-day tie by title', () => {
    expect(newestFirst([newer, sameDay]).map((post) => post.slug)).toEqual([
      'a-same-day',
      'newer',
    ]);
  });

  test('RMET-UNIT-085 leaves the input untouched when ordering', () => {
    const input = [older, newer];
    newestFirst(input);
    expect(input.map((post) => post.slug)).toEqual(['older', 'newer']);
  });

  test('RMET-UNIT-086 takes the newest few pieces', () => {
    expect(
      latestPosts([older, newer, sameDay], 2).map((post) => post.slug)
    ).toEqual(['a-same-day', 'newer']);
  });

  test('RMET-UNIT-087 counts tags and orders them by weight then name', () => {
    expect(collectTags([older, newer])).toEqual([
      { tag: 'Agents', slug: 'agents', count: 2 },
      { tag: 'Evaluation', slug: 'evaluation', count: 1 },
    ]);
  });

  test('RMET-UNIT-088 counts a tag once per piece regardless of spelling', () => {
    const shouty = makePost({ slug: 'shouty', tags: ['AGENTS'] });
    expect(collectTags([older, shouty])).toEqual([
      { tag: 'Agents', slug: 'agents', count: 2 },
    ]);
  });

  test('RMET-UNIT-089 counts a tag repeated inside one piece only once', () => {
    const repeated = makePost({ slug: 'repeated', tags: ['Agents', 'agents'] });
    expect(collectTags([repeated])).toEqual([
      { tag: 'Agents', slug: 'agents', count: 1 },
    ]);
  });

  test('RMET-UNIT-090 orders equally weighted tags by name', () => {
    const first = makePost({ slug: 'one', tags: ['Zebra'] });
    const second = makePost({ slug: 'two', tags: ['Agents'] });
    expect(collectTags([first, second]).map((tag) => tag.tag)).toEqual([
      'Agents',
      'Zebra',
    ]);
  });

  test('RMET-UNIT-091 finds one piece by slug', () => {
    expect(findPost([older, newer], 'newer')?.title).toBe('Newer');
    expect(findPost([older, newer], 'missing')).toBeUndefined();
  });
});
