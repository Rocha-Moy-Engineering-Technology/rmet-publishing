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
  readonly publishedAt: Date;
}

export interface SitemapEntry {
  readonly loc: string;
  readonly lastModified?: Date;
}
