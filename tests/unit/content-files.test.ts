import { describe, expect, test } from 'vitest';

import {
  CONTENT_EXTENSIONS,
  CONTENT_GLOB,
  stripContentExtension,
} from '../../logic/posts/content_files';

describe('content file extensions', () => {
  test('RMET-UNIT-080 lists Markdown and MDX as the ingestible extensions', () => {
    expect([...CONTENT_EXTENSIONS]).toEqual(['md', 'mdx']);
  });

  test('RMET-UNIT-081 builds the collection glob from those extensions', () => {
    expect(CONTENT_GLOB).toBe('**/*.{md,mdx}');
  });

  test('RMET-UNIT-082 leaves an identifier without an extension unchanged', () => {
    expect(stripContentExtension('latency-notes')).toBe('latency-notes');
  });

  test('RMET-UNIT-083 strips a trailing Markdown extension', () => {
    expect(stripContentExtension('Latency Notes.md')).toBe('Latency Notes');
  });

  test('RMET-UNIT-084 strips a trailing MDX extension', () => {
    expect(stripContentExtension('Latency Notes.mdx')).toBe('Latency Notes');
  });

  test('RMET-UNIT-085 does not treat a mid-name md as an extension', () => {
    expect(stripContentExtension('mdx-notes')).toBe('mdx-notes');
  });
});
