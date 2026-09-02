import { describe, expect, test } from 'vitest';

import {
  WRITINGS_SEGMENT,
  absoluteUrl,
  postPath,
  tagPath,
} from '../../logic/posts/post_routes';
import { makePost } from '../support/post-fixture';

describe('post routes', () => {
  test('RMET-UNIT-100 addresses every piece under one section', () => {
    expect(WRITINGS_SEGMENT).toBe('writings');
    expect(postPath(makePost({ slug: 'on-evaluation' }))).toBe(
      '/writings/on-evaluation'
    );
  });

  test('RMET-UNIT-101 addresses a tag index', () => {
    expect(tagPath('agents')).toBe('/tags/agents');
  });

  test('RMET-UNIT-102 joins a base address and a path exactly once', () => {
    expect(absoluteUrl('https://example.org/', '/writings')).toBe(
      'https://example.org/writings'
    );
    expect(absoluteUrl('https://example.org', 'writings')).toBe(
      'https://example.org/writings'
    );
  });

  test('RMET-UNIT-103 returns the base address for the home path', () => {
    expect(absoluteUrl('https://example.org/', '/')).toBe(
      'https://example.org/'
    );
  });
});
