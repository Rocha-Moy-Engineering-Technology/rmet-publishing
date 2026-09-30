import { existsSync } from 'node:fs';
import { mkdir, mkdtemp, readFile, rm, writeFile } from 'node:fs/promises';
import { tmpdir } from 'node:os';
import { join } from 'node:path';

import { afterEach, describe, expect, test } from 'vitest';

import {
  FIXTURE_ASSETS_DIR,
  FIXTURE_CONTENT_DIR,
  buildSite,
  runBuild,
} from '../support/site-build';

const scratch: string[] = [];

async function scratchDirectory(): Promise<string> {
  const directory = await mkdtemp(join(tmpdir(), 'rmet-content-build-'));
  scratch.push(directory);
  return directory;
}

/** A content folder holding one piece with the given front matter lines. */
async function contentFolder(frontMatter: readonly string[]): Promise<string> {
  const folder = join(await scratchDirectory(), 'posts');
  await mkdir(folder);
  const text = ['---', ...frontMatter, '---', '', 'Body PIECE_BODY.', ''];
  await writeFile(join(folder, 'piece.md'), text.join('\n'));
  return folder;
}

afterEach(async () => {
  for (const directory of scratch.splice(0)) {
    await rm(directory, { recursive: true, force: true });
  }
});

describe('content collection in a real build', () => {
  test('RMET-INTEGRATION-008 keeps a draft out of every page, listing, tag page, feed, and sitemap (A6.13)', async () => {
    const outDir = join(await scratchDirectory(), 'dist');
    await buildSite(outDir, {
      contentDir: FIXTURE_CONTENT_DIR,
      assetsDir: FIXTURE_ASSETS_DIR,
    });

    expect(
      existsSync(join(outDir, 'writings/first-fixture-piece/index.html'))
    ).toBe(true);
    expect(existsSync(join(outDir, 'writings/draft-fixture-piece'))).toBe(
      false
    );
    expect(existsSync(join(outDir, 'tags/draft-only'))).toBe(false);

    const index = await readFile(join(outDir, 'index.html'), 'utf8');
    expect(index).toContain('First fixture piece');
    for (const file of [
      'index.html',
      'tags/index.html',
      'tags/fixtures/index.html',
      'rss.xml',
      'sitemap.xml',
    ]) {
      const text = await readFile(join(outDir, file), 'utf8');
      for (const marker of [
        'DRAFT_FIXTURE_ONLY',
        'Draft fixture piece',
        'draft-fixture-piece',
        'Draft Only',
      ]) {
        expect(text, `${marker} in ${file}`).not.toContain(marker);
      }
    }
  });

  test('RMET-INTEGRATION-013 renders a piece whose front matter sets every field, canonicalUrl included (A6.20)', async () => {
    const contentDir = await contentFolder([
      "title: 'Full front matter'",
      "description: 'Every field set.'",
      'publishedAt: 2026-04-01',
      'updatedAt: 2026-04-02',
      "tags: ['Schema']",
      "authors: ['Ada Author', 'Ben Author']",
      "abstract: 'FULL_ABSTRACT'",
      "doi: '10.1000/full'",
      "pdfUrl: '/papers/full.pdf'",
      "canonicalUrl: 'https://elsewhere.example/full'",
    ]);
    const outDir = join(await scratchDirectory(), 'dist');
    await buildSite(outDir, { contentDir, assetsDir: FIXTURE_ASSETS_DIR });

    const page = await readFile(
      join(outDir, 'writings/piece/index.html'),
      'utf8'
    );
    expect(page).toContain(
      '<link rel="canonical" href="https://elsewhere.example/full">'
    );
    expect(page).toContain(
      '<meta property="og:url" content="https://elsewhere.example/full">'
    );
    expect(page).toContain('FULL_ABSTRACT');
    expect(page).toContain('href="/papers/full.pdf"');
    expect(page).toContain('Updated 2 April 2026');
    expect(page).toContain(
      'Ada Author &amp; Ben Author (2026). Full front matter.'
    );
    expect(page).toContain('https://doi.org/10.1000/full');
    expect(existsSync(join(outDir, 'tags/schema/index.html'))).toBe(true);
  });

  test('RMET-INTEGRATION-014 stops the build on a canonicalUrl that is not an absolute address (A6.20)', async () => {
    const contentDir = await contentFolder([
      "title: 'Relative canonical'",
      "description: 'An invalid canonical address.'",
      'publishedAt: 2026-04-01',
      "canonicalUrl: '/relative/path'",
    ]);
    const outDir = join(await scratchDirectory(), 'dist');
    const { code, output } = await runBuild(outDir, {
      contentDir,
      assetsDir: FIXTURE_ASSETS_DIR,
    });

    expect(code).not.toBe(0);
    expect(output).toContain('InvalidContentEntryDataError');
    expect(output).toContain('canonicalUrl');
    expect(existsSync(join(outDir, 'writings/piece'))).toBe(false);
  });
});
