import { glob } from 'astro/loaders';
import { z } from 'astro/zod';
import { defineCollection } from 'astro:content';

import { POST_KINDS } from '../../../logic/posts/post_kinds';
import type { PostKind } from '../../../types/post';

const kinds = [...POST_KINDS] as [PostKind, ...PostKind[]];

const posts = defineCollection({
  loader: glob({
    base: './state/adapters/inbound/content/posts',
    pattern: '**/*.md',
  }),
  schema: z.object({
    title: z.string(),
    description: z.string(),
    kind: z.enum(kinds),
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
