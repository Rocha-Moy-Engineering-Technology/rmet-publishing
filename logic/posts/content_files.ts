export const CONTENT_EXTENSIONS = ['md', 'mdx'] as const;

const extensions = `{${CONTENT_EXTENSIONS.join(',')}}`;
export const CONTENT_GLOB = [
  `**/*.${extensions}`,
  `!**/*.{transcribed,compose}.*.${extensions}`,
  `!**/*.{migrated,before-restore}.*.${extensions}`,
];

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
