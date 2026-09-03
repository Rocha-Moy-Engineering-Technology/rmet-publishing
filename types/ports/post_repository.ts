import type { Post, RenderedPost } from '../post';

export interface PostRepository {
  listPosts(): Promise<readonly Post[]>;
  /** Published posts, newest first, each with its body rendered to HTML. */
  listRenderedPosts(): Promise<readonly RenderedPost[]>;
}
