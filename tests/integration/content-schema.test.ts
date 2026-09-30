import { describe, expect, test } from 'vitest';

import { postSchema } from '../../state/adapters/inbound/content_schema';

const MINIMAL = {
  title: 'A title',
  description: 'A description.',
  publishedAt: '2026-09-01',
};

function issuePaths(data: unknown): readonly string[] {
  const result = postSchema.safeParse(data);
  if (result.success) return [];
  return result.error.issues.map((issue) => issue.path.join('.'));
}

describe('content collection schema', () => {
  test('RMET-INTEGRATION-009 accepts the three required fields and fills every default (A6.20)', () => {
    expect(postSchema.parse(MINIMAL)).toEqual({
      title: 'A title',
      description: 'A description.',
      publishedAt: new Date('2026-09-01'),
      tags: [],
      draft: false,
      authors: [],
    });
  });

  test('RMET-INTEGRATION-010 accepts every optional field and coerces both dates (A6.20)', () => {
    const parsed = postSchema.parse({
      ...MINIMAL,
      updatedAt: '2026-09-08',
      tags: ['Agents'],
      draft: true,
      authors: ['Pedro Henrique Rocha Moy'],
      abstract: 'An abstract.',
      doi: '10.1000/example',
      pdfUrl: '/papers/example.pdf',
      canonicalUrl: 'https://elsewhere.example/x',
    });
    expect(parsed.updatedAt).toEqual(new Date('2026-09-08'));
    expect(parsed.draft).toBe(true);
    expect(parsed.canonicalUrl).toBe('https://elsewhere.example/x');
    expect(
      postSchema.parse({ ...MINIMAL, canonicalUrl: 'mailto:a@b.example' })
        .canonicalUrl
    ).toBe('mailto:a@b.example');
  });

  test('RMET-INTEGRATION-011 rejects a canonicalUrl that is not an absolute address (A6.20)', () => {
    for (const canonicalUrl of [
      '/relative/path',
      'example.com',
      '',
      'not a url',
      'https://',
      42,
    ]) {
      expect(issuePaths({ ...MINIMAL, canonicalUrl })).toEqual([
        'canonicalUrl',
      ]);
    }
  });

  test('RMET-INTEGRATION-012 rejects missing required fields and mistyped values (A6.20)', () => {
    expect(issuePaths({})).toEqual(['title', 'description', 'publishedAt']);
    expect(issuePaths({ ...MINIMAL, publishedAt: 'not a date' })).toEqual([
      'publishedAt',
    ]);
    expect(issuePaths({ ...MINIMAL, draft: 'yes' })).toEqual(['draft']);
    expect(issuePaths({ ...MINIMAL, tags: 'Agents' })).toEqual(['tags']);
    expect(issuePaths({ ...MINIMAL, doi: 10 })).toEqual(['doi']);
  });
});
