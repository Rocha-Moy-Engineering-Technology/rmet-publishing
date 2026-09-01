import type { Post } from '../post';

export interface PostRepository {
  listPosts(): Promise<readonly Post[]>;
}
