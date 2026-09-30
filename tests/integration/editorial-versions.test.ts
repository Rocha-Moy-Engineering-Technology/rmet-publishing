import { mkdtemp, mkdir, rm, writeFile } from 'node:fs/promises';
import { tmpdir } from 'node:os';
import { join } from 'node:path';
import { expect, test } from 'vitest';

import { postsCollection } from '../../state/adapters/inbound/posts_collection';
import { loadEntries } from '../support/content-loader';

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
      'original.single-compose.20260908_143205.md',
      'original.single-compose-claude.20260908_143206.md',
      'original.multi-compose.20260908_143207.md',
      'nested/other.transcribed.20260908_143205.mdx',
    ]) {
      await writeFile(join(base, filename), '{}');
    }
    const entries = await loadEntries(postsCollection(base).loader, base);
    expect(entries.map(({ id }) => id)).toEqual([
      'nested/other.mdx',
      'original.md',
    ]);
  } finally {
    await rm(base, { recursive: true, force: true });
  }
});
