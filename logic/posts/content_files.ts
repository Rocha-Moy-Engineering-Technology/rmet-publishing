export const CONTENT_EXTENSIONS = ['md', 'mdx'] as const;

export const CONTENT_GLOB = `**/*.{${CONTENT_EXTENSIONS.join(',')}}`;

export function stripContentExtension(filename: string): string {
  const lower = filename.toLowerCase();
  for (const extension of CONTENT_EXTENSIONS) {
    const suffix = `.${extension}`;
    if (lower.endsWith(suffix)) {
      return filename.slice(0, filename.length - suffix.length);
    }
  }
  return filename;
}
