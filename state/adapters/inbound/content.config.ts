import { defineCollection } from 'astro:content';

import { postsCollection } from './posts_collection';

const CONTENT_BASE =
  process.env.PUBLIC_CONTENT_DIR ?? './state/adapters/inbound/content/posts';

const posts = defineCollection(postsCollection(CONTENT_BASE));

export const collections = { posts };
