import { getCollection, type CollectionEntry } from 'astro:content';

import { toPost } from '../../../../logic/posts/post_mapper';
import {
  comparePostsByRecency,
  newestFirst,
  publishedPosts,
} from '../../../../logic/posts/post_queries';
import type { Post } from '../../../../types/post';
import type { PostRepository } from '../../../../types/ports/post_repository';

export type PostEntry = CollectionEntry<'posts'>;

export interface PostDocument {
  readonly entry: PostEntry;
  readonly post: Post;
}

function toDocument(entry: PostEntry): PostDocument {
  return {
    entry,
    post: toPost({ id: entry.id, body: entry.body ?? '', data: entry.data }),
  };
}

export async function listPostDocuments(): Promise<readonly PostDocument[]> {
  const entries = await getCollection('posts');
  return entries
    .map(toDocument)
    .filter(({ post }) => !post.draft)
    .sort((first, second) => comparePostsByRecency(first.post, second.post));
}

export function postRepository(): PostRepository {
  return {
    async listPosts(): Promise<readonly Post[]> {
      const entries = await getCollection('posts');
      return newestFirst(
        publishedPosts(entries.map((entry) => toDocument(entry).post))
      );
    },
  };
}
