const DIACRITICS = /\p{Diacritic}/gu;
const NON_WORD = /[^a-z0-9]+/g;
const EDGE_SEPARATORS = /^-+|-+$/g;

export function slugify(value: string): string {
  return value
    .normalize('NFD')
    .replace(DIACRITICS, '')
    .toLowerCase()
    .replace(NON_WORD, '-')
    .replace(EDGE_SEPARATORS, '');
}
