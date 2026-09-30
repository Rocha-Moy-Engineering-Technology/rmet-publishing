import type { Loader } from 'astro/loaders';

export type LoadedEntry = {
  id: string;
  data: Record<string, unknown>;
};

/**
 * Runs a content loader over its base directory with a minimal stand-in for
 * Astro's load context and returns what it stored, ids sorted. Each file's
 * contents are its front matter as JSON, so a test decides the unvalidated
 * data the loader sees without a Markdown parser.
 */
export async function loadEntries(
  loader: Loader,
  root: string
): Promise<LoadedEntry[]> {
  const entries: LoadedEntry[] = [];
  const entryInfo = {
    getEntryInfo: ({ contents }: { contents: string }) => ({
      body: '',
      data: contents.trim() ? JSON.parse(contents) : {},
    }),
  };
  await loader.load({
    config: {
      root: new URL(`file://${root}/`),
      srcDir: new URL(`file://${root}/src/`),
    },
    entryTypes: new Map([
      ['.md', entryInfo],
      ['.mdx', entryInfo],
    ]),
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
      set(entry: LoadedEntry) {
        entries.push({ id: entry.id, data: entry.data });
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
  } as unknown as Parameters<Loader['load']>[0]);
  return entries.sort((first, second) => first.id.localeCompare(second.id));
}
