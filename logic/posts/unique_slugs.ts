import type { SlugClaim } from '../../types/post';

/**
 * One content file per slug: the file name is the address, so two files that
 * slugify alike (`twin.md` and `twin.mdx`, or the same name in two folders)
 * would claim one page. Drafts count too, as they do for the publishing CLI.
 */
export function assertUniqueSlugs(claims: readonly SlugClaim[]): void {
  const owners = new Map<string, string>();
  for (const { id, slug } of claims) {
    const owner = owners.get(slug);
    if (owner !== undefined) {
      const [first, second] = [owner, id].sort();
      throw new Error(
        `Content files ${first} and ${second} share the slug "${slug}"; the file name is the address, so rename one of them.`
      );
    }
    owners.set(slug, id);
  }
}
