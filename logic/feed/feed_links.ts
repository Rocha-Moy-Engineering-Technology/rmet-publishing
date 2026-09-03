/**
 * Root-relative `href` and `src` values (`/x`, never `//host`) as rendered
 * HTML writes them: double-quoted and preceded by whitespace, so an attribute
 * that merely ends in the word (`data-href`) is left alone.
 */
const ROOT_LINK = /(\s)(href|src)="(\/(?!\/)[^"]*)"/g;

/**
 * A link that is relative to the site is dead once the body leaves it, as it
 * does in a feed reader or an email, so each becomes an absolute address.
 */
export function absolutizeRootLinks(
  html: string,
  resolve: (path: string) => string
): string {
  return html.replace(
    ROOT_LINK,
    (_match, space: string, attribute: string, path: string) =>
      `${space}${attribute}="${resolve(path)}"`
  );
}
