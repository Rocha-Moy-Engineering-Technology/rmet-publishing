import mdxRenderer from '@astrojs/mdx/server.js';
import { getCollection, render, type CollectionEntry } from 'astro:content';
import { experimental_AstroContainer as AstroContainer } from 'astro/container';

import { toPost } from '../../../../logic/posts/post_mapper';
import {
  comparePostsByRecency,
  isPublished,
} from '../../../../logic/posts/post_queries';
import type { Post, RenderedPost } from '../../../../types/post';
import type { PostRepository } from '../../../../types/ports/post_repository';

export type PostEntry = CollectionEntry<'posts'>;

export interface PostDocument {
  readonly entry: PostEntry;
  readonly post: Post;
}

/** One container renders every body; it is created on first use. */
let container: Promise<AstroContainer> | undefined;

/**
 * A Markdown body is an Astro component the container renders on its own; an
 * MDX body is tagged for the `astro:jsx` renderer, which the MDX integration
 * gives every page but a bare container lacks.
 */
async function createContainer(): Promise<AstroContainer> {
  const created = await AstroContainer.create();
  created.addServerRenderer({ renderer: mdxRenderer });
  return created;
}

function htmlContainer(): Promise<AstroContainer> {
  container ??= createContainer();
  return container;
}

function toDocument(entry: PostEntry): PostDocument {
  return {
    entry,
    post: toPost({ id: entry.id, body: entry.body ?? '', data: entry.data }),
  };
}

/**
 * Renders a piece's body to HTML outside a page. The loader pre-renders
 * Markdown only; MDX becomes a component, so both go through the container.
 */
async function renderHtml(entry: PostEntry): Promise<string> {
  const { Content } = await render(entry);
  return (await htmlContainer()).renderToString(Content);
}

/** The one read of the collection: published pieces, newest first. */
export async function listPostDocuments(): Promise<readonly PostDocument[]> {
  const entries = await getCollection('posts');
  return entries
    .map(toDocument)
    .filter(({ post }) => isPublished(post))
    .sort((first, second) => comparePostsByRecency(first.post, second.post));
}

export function postRepository(): PostRepository {
  return {
    async listPosts(): Promise<readonly Post[]> {
      return (await listPostDocuments()).map(({ post }) => post);
    },
    async listRenderedPosts(): Promise<readonly RenderedPost[]> {
      const documents = await listPostDocuments();
      return Promise.all(
        documents.map(async ({ entry, post }) => ({
          post,
          html: await renderHtml(entry),
        }))
      );
    },
  };
}
