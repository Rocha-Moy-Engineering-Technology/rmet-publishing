import { mkdtemp, mkdir, rm, writeFile } from 'node:fs/promises';
import { tmpdir } from 'node:os';
import { join } from 'node:path';
import { glob } from 'astro/loaders';
import { expect, test } from 'vitest';
import { CONTENT_GLOB } from '../../logic/posts/content_files';

test('RMET-VERSIONS-001 loader excludes editorial siblings before parsing', async () => {
  const base = await mkdtemp(join(tmpdir(), 'rmet-versions-'));
  try {
    await mkdir(join(base, 'nested'));
    for (const filename of [
      'original.md',
      'orphan.migrated.bad.md',
      'original.compose.20260908_143205.migrated.20260908_160000.md',
      'nested/other.transcribed.20260908_143205.before-restore.20260908_160000.mdx',
      'nested/other.mdx',
      'original.compose.20260908_143205.md',
      'nested/other.transcribed.20260908_143205.mdx',
    ]) {
      await writeFile(join(base, filename), 'fixture');
    }
    const entries: string[] = [];
    const loader = glob({ base, pattern: CONTENT_GLOB });
    await loader.load({
      config: {
        root: new URL(`file://${base}/`),
        srcDir: new URL(`file://${base}/src/`),
      },
      entryTypes: new Map(
        ['.md', '.mdx'].map((extension) => [
          extension,
          { getEntryInfo: () => ({ body: 'fixture', data: {} }) },
        ])
      ),
      collection: 'posts',
      logger: {
        info() {},
        warn() {},
        error(message: string) {
          throw new Error(message);
        },
      },
      store: {
        clear() {},
        keys() {
          return [];
        },
        get() {
          return undefined;
        },
        set(entry: { id: string }) {
          entries.push(entry.id);
        },
        delete() {},
      },
      parseData: async ({ data }: { data: unknown }) => data,
      generateDigest: () => 'digest',
      renderMarkdown: async () => ({ html: '' }),
      meta: {
        get() {
          return undefined;
        },
        set() {},
      },
    } as unknown as Parameters<typeof loader.load>[0]);
    expect(entries.sort()).toEqual(['nested/other', 'original']);
  } finally {
    await rm(base, { recursive: true, force: true });
  }
});
