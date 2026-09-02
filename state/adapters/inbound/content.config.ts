import { glob } from 'astro/loaders';
import { z } from 'astro/zod';
import { defineCollection } from 'astro:content';

import { CONTENT_GLOB } from '../../../logic/posts/content_files';

const CONTENT_BASE =
  process.env.PUBLIC_CONTENT_DIR ?? './state/adapters/inbound/content/posts';

const posts = defineCollection({
  loader: glob({ base: CONTENT_BASE, pattern: CONTENT_GLOB }),
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
  }),
});

export const collections = { posts };
