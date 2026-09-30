// \p{Diacritic} follows the Unicode data of the Node running the build. The
// publishing CLI mirrors this rule with a code-point list of this Unicode
// version, so the pin moves with the CI Node version and that list together.
export const SLUG_UNICODE_VERSION = '17.0';

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
