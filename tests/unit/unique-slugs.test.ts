import { describe, expect, test } from 'vitest';

import { assertUniqueSlugs } from '../../logic/posts/unique_slugs';

describe('one content file per slug', () => {
  test('RMET-UNIT-230 accepts an empty collection', () => {
    expect(() => assertUniqueSlugs([])).not.toThrow();
  });

  test('RMET-UNIT-231 accepts files whose slugs all differ', () => {
    expect(() =>
      assertUniqueSlugs([
        { id: 'first.md', slug: 'first' },
        { id: 'nested/second.mdx', slug: 'second' },
      ])
    ).not.toThrow();
  });

  test('RMET-UNIT-232 refuses two files that share a slug, naming both in order', () => {
    expect(() =>
      assertUniqueSlugs([
        { id: 'twin.mdx', slug: 'twin' },
        { id: 'other.md', slug: 'other' },
        { id: 'twin.md', slug: 'twin' },
      ])
    ).toThrow(
      'Content files twin.md and twin.mdx share the slug "twin"; the file name is the address, so rename one of them.'
    );
  });

  test('RMET-UNIT-233 refuses files in different folders that share a slug', () => {
    expect(() =>
      assertUniqueSlugs([
        { id: 'a/notes.md', slug: 'notes' },
        { id: 'b/notes.md', slug: 'notes' },
      ])
    ).toThrow('a/notes.md and b/notes.md share the slug "notes"');
  });
});
