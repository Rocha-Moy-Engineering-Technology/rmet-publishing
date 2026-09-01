import type { CitationOptions, Post } from '../../types/post';

function authorList(post: Post, fallbackAuthor: string): string {
  if (post.authors.length === 0) return fallbackAuthor;
  return post.authors.join(' & ');
}

function citationTarget(post: Post, url: string): string {
  return post.doi === undefined ? url : `https://doi.org/${post.doi}`;
}

export function formatCitation(post: Post, options: CitationOptions): string {
  const authors = authorList(post, options.fallbackAuthor);
  const year = post.publishedAt.getUTCFullYear();
  const target = citationTarget(post, options.url);
  return `${authors} (${year}). ${post.title}. ${options.siteName}. ${target}`;
}
