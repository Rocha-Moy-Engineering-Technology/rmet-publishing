import { describe, expect, test } from 'vitest';

import {
  POST_KINDS,
  isPostKind,
  kindDescription,
  kindFromSegment,
  kindLabel,
  kindPlural,
  kindSegment,
} from '../../logic/posts/post_kinds';

describe('post kinds', () => {
  test('RMET-UNIT-020 publishes blogs, articles, and papers in that order', () => {
    expect(POST_KINDS).toEqual(['blog', 'article', 'paper']);
  });

  test('RMET-UNIT-021 recognises a known kind', () => {
    expect(isPostKind('paper')).toBe(true);
    expect(isPostKind('newsletter')).toBe(false);
  });

  test('RMET-UNIT-022 maps each kind to its address segment', () => {
    expect(kindSegment('blog')).toBe('blog');
    expect(kindSegment('article')).toBe('articles');
    expect(kindSegment('paper')).toBe('papers');
  });

  test('RMET-UNIT-023 maps an address segment back to its kind', () => {
    expect(kindFromSegment('articles')).toBe('article');
    expect(kindFromSegment('essays')).toBeUndefined();
  });

  test('RMET-UNIT-024 labels a single piece and a collection of pieces', () => {
    expect(kindLabel('blog')).toBe('Blog post');
    expect(kindPlural('paper')).toBe('Papers');
  });

  test('RMET-UNIT-025 describes what each kind holds', () => {
    for (const kind of POST_KINDS) {
      expect(kindDescription(kind).length).toBeGreaterThan(0);
    }
  });
});
