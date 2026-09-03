export interface PostFrontmatter {
  readonly title: string;
  readonly description: string;
  readonly publishedAt: Date;
  readonly updatedAt?: Date;
  readonly tags?: readonly string[];
  readonly draft?: boolean;
  readonly authors?: readonly string[];
  readonly abstract?: string;
  readonly doi?: string;
  readonly pdfUrl?: string;
  readonly canonicalUrl?: string;
}

export interface PostSource {
  readonly id: string;
  readonly body: string;
  readonly data: PostFrontmatter;
}

export interface Post {
  readonly slug: string;
  readonly title: string;
  readonly description: string;
  readonly publishedAt: Date;
  readonly updatedAt?: Date;
  readonly tags: readonly string[];
  readonly draft: boolean;
  readonly authors: readonly string[];
  readonly abstract?: string;
  readonly doi?: string;
  readonly pdfUrl?: string;
  readonly canonicalUrl?: string;
  readonly readingMinutes: number;
}

export interface RenderedPost {
  readonly post: Post;
  /** The body rendered to HTML, links as written in the source. */
  readonly html: string;
}

export interface TagCount {
  readonly tag: string;
  readonly slug: string;
  readonly count: number;
}

export interface CitationOptions {
  readonly siteName: string;
  readonly url: string;
  readonly fallbackAuthor: string;
}
