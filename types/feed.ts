export interface FeedChannel {
  readonly title: string;
  readonly link: string;
  readonly description: string;
  readonly language: string;
}

export interface FeedItem {
  readonly title: string;
  readonly link: string;
  readonly description: string;
  /** The rendered body as HTML, with every address absolute. */
  readonly content: string;
  readonly publishedAt: Date;
}

export interface SitemapEntry {
  readonly loc: string;
  readonly lastModified?: Date;
}
