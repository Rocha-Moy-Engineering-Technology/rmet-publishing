import { describe, expect, test } from 'vitest';

import { formatCitation } from '../../logic/posts/citation';
import { makePost } from '../support/post-fixture';

const options = {
  siteName: 'RMET Publishing',
  url: 'https://example.org/papers/on-evaluation',
  fallbackAuthor: 'Pedro Henrique Rocha Moy',
};

describe('citation', () => {
  test('RMET-UNIT-110 cites authors, year, title, publication, and address', () => {
    const post = makePost({
      title: 'On evaluation',
      authors: ['Rocha Moy, P.'],
      publishedAt: new Date('2026-05-04T00:00:00.000Z'),
    });
    expect(formatCitation(post, options)).toBe(
      'Rocha Moy, P. (2026). On evaluation. RMET Publishing. https://example.org/papers/on-evaluation'
    );
  });

  test('RMET-UNIT-111 joins several authors with an ampersand', () => {
    const post = makePost({
      authors: ['Rocha Moy, P.', 'Doe, J.'],
      title: 'Together',
    });
    expect(formatCitation(post, options)).toContain('Rocha Moy, P. & Doe, J.');
  });

  test('RMET-UNIT-112 falls back to the site author when none is named', () => {
    const post = makePost({ authors: [], title: 'Anonymous' });
    expect(formatCitation(post, options)).toContain(
      'Pedro Henrique Rocha Moy (2026).'
    );
  });

  test('RMET-UNIT-113 prefers the digital object identifier when present', () => {
    const post = makePost({ doi: '10.1000/example' });
    expect(formatCitation(post, options)).toContain(
      'https://doi.org/10.1000/example'
    );
  });
});
