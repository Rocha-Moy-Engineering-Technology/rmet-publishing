import { defineCollection } from 'astro:content';

import { resolveBuildSettings } from '../../../logic/site/build_settings';
import { buildEnvironment } from '../outbound/environment/build_environment';
import { postsCollection } from './posts_collection';

const { contentDirectory } = resolveBuildSettings(
  buildEnvironment().snapshot()
);

const posts = defineCollection(postsCollection(contentDirectory));

export const collections = { posts };
