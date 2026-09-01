import { describe, expect, test } from 'vitest';

import {
  absoluteUrl,
  kindPath,
  postPath,
  tagPath,
} from '../../logic/posts/post_routes';
import { makePost } from '../support/post-fixture';

describe('post routes', () => {
  test('RMET-UNIT-100 addresses a kind index', () => {
    expect(kindPath('article')).toBe('/articles');
  });

  test('RMET-UNIT-101 addresses a piece under its kind', () => {
    expect(postPath(makePost({ kind: 'paper', slug: 'on-evaluation' }))).toBe(
      '/papers/on-evaluation'
    );
  });

  test('RMET-UNIT-102 addresses a tag index', () => {
    expect(tagPath('agents')).toBe('/tags/agents');
  });

  test('RMET-UNIT-103 joins a base address and a path exactly once', () => {
    expect(absoluteUrl('https://example.org/', '/papers')).toBe(
      'https://example.org/papers'
    );
    expect(absoluteUrl('https://example.org', 'papers')).toBe(
      'https://example.org/papers'
    );
  });

  test('RMET-UNIT-104 returns the base address for the home path', () => {
    expect(absoluteUrl('https://example.org/', '/')).toBe(
      'https://example.org/'
    );
  });
});
