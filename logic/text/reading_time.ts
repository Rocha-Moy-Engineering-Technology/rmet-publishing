const DEFAULT_WORDS_PER_MINUTE = 200;
const WHITESPACE = /\s+/;

export function countWords(text: string): number {
  const trimmed = text.trim();
  if (trimmed.length === 0) return 0;
  return trimmed.split(WHITESPACE).length;
}

export function readingMinutes(
  text: string,
  wordsPerMinute: number = DEFAULT_WORDS_PER_MINUTE
): number {
  return Math.max(1, Math.ceil(countWords(text) / wordsPerMinute));
}
