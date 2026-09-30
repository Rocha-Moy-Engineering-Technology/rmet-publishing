import { glob } from 'astro/loaders';
import { z } from 'astro/zod';

import { CONTENT_GLOB } from '../../../logic/posts/content_files';
import { WRITINGS_SEGMENT } from '../../../logic/posts/post_routes';

const FRONT_MATTER_SLUG_ERROR = `a front-matter slug is not supported; the file name is the /${WRITINGS_SEGMENT} address, so rename the file instead`;

/**
 * The posts collection's loader and schema, kept apart from `content.config.ts`
 * (which needs the `astro:content` virtual module) so the integration suite can
 * run the production loader and schema directly.
 *
 * Each entry's id is its path under the content directory, extension
 * included, which is what `logic/posts/post_mapper.ts` reads the slug from.
 * Astro's default id github-slugs that path (deleting punctuation, dropping a
 * trailing `/index`) and gives way to a front-matter `slug`; the site and the
 * publishing CLI both take the address from the file name alone, so the
 * schema refuses a `slug` key.
 */
export function postsCollection(base: string) {
  return {
    loader: glob({
      base,
      pattern: CONTENT_GLOB,
      generateId: ({ entry }) => entry,
    }),
    schema: z.object({
      title: z.string(),
      description: z.string(),
      publishedAt: z.coerce.date(),
      updatedAt: z.coerce.date().optional(),
      tags: z.array(z.string()).default([]),
      draft: z.boolean().default(false),
      authors: z.array(z.string()).default([]),
      abstract: z.string().optional(),
      doi: z.string().optional(),
      pdfUrl: z.string().optional(),
      canonicalUrl: z.string().url().optional(),
      slug: z.never({ error: FRONT_MATTER_SLUG_ERROR }).optional(),
    }),
  };
}
