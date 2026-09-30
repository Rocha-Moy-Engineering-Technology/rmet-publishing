import { z } from 'astro/zod';

/** The front matter every piece must carry; `content.config.ts` applies it. */
export const postSchema = z.object({
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
  canonicalUrl: z.url().optional(),
});
