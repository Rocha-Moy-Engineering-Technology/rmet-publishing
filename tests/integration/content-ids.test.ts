import { mkdtemp, mkdir, rm, writeFile } from 'node:fs/promises';
import { tmpdir } from 'node:os';
import { basename, join } from 'node:path';
import { afterEach, beforeEach, describe, expect, test } from 'vitest';

import { stripContentExtension } from '../../logic/posts/content_files';
import { toPost } from '../../logic/posts/post_mapper';
import { slugify } from '../../logic/text/slugify';
import { postsCollection } from '../../state/adapters/inbound/posts_collection';
import type { PostFrontmatter } from '../../types/post';
import { loadEntries } from '../support/content-loader';

const FRONT_MATTER = {
  title: 'A piece',
  description: 'A short description.',
  publishedAt: '2026-01-10',
};

let base: string;

beforeEach(async () => {
  base = await mkdtemp(join(tmpdir(), 'rmet-ids-'));
});

afterEach(async () => {
  await rm(base, { recursive: true, force: true });
});

function slugOf(id: string, data: Record<string, unknown>): string {
  return toPost({ id, body: '', data: data as unknown as PostFrontmatter })
    .slug;
}

describe('posts collection loader ids', () => {
  test('RMET-INTEGRATION-006 keys each entry by its file path so the slug is slugify of the file name', async () => {
    await mkdir(join(base, 'guides'));
    const files: Record<string, unknown> = {
      "don't-panic.md": {},
      'v1.2.md': {},
      'guides/index.mdx': {},
      // Astro's default id gives way to this; the site ignores it
      'renamed.md': { slug: 'elsewhere' },
    };
    for (const [path, data] of Object.entries(files)) {
      await writeFile(join(base, path), JSON.stringify(data));
    }

    const entries = await loadEntries(postsCollection(base).loader, base);

    expect(entries.map(({ id }) => id)).toEqual([
      "don't-panic.md",
      'guides/index.mdx',
      'renamed.md',
      'v1.2.md',
    ]);
    const slugs = entries.map(({ id, data }) => slugOf(id, data));
    expect(slugs).toEqual(['don-t-panic', 'index', 'renamed', 'v1-2']);
    // the same rule the CLI mirrors: slugify.ts over the file name
    expect(slugs).toEqual(
      entries.map(({ id }) => slugify(stripContentExtension(basename(id))))
    );
  });
});

describe('posts collection schema', () => {
  test('RMET-INTEGRATION-007 rejects a front-matter slug, because the file name is the address', () => {
    const result = postsCollection(base).schema.safeParse({
      ...FRONT_MATTER,
      slug: 'elsewhere',
    });
    expect(result.success).toBe(false);
    expect(result.error?.issues).toMatchObject([
      {
        path: ['slug'],
        message: expect.stringContaining('rename the file'),
      },
    ]);
  });

  test('RMET-INTEGRATION-008 accepts front matter without a slug', () => {
    const result = postsCollection(base).schema.safeParse(FRONT_MATTER);
    expect(result.success).toBe(true);
    expect(result.data).not.toHaveProperty('slug');
  });
});
