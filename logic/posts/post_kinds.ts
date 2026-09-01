import type { PostKind } from '../../types/post';

interface KindDefinition {
  readonly segment: string;
  readonly label: string;
  readonly plural: string;
  readonly description: string;
}

const DEFINITIONS: Readonly<Record<PostKind, KindDefinition>> = {
  blog: {
    segment: 'blog',
    label: 'Blog post',
    plural: 'Blog',
    description:
      'Shorter notes, working thoughts, and things worth writing down.',
  },
  article: {
    segment: 'articles',
    label: 'Article',
    plural: 'Articles',
    description: 'Longer pieces that develop one idea end to end.',
  },
  paper: {
    segment: 'papers',
    label: 'Paper',
    plural: 'Papers',
    description: 'Formal write-ups with an abstract, authors, and references.',
  },
};

export const POST_KINDS: readonly PostKind[] = ['blog', 'article', 'paper'];

export function isPostKind(value: string): value is PostKind {
  return Object.prototype.hasOwnProperty.call(DEFINITIONS, value);
}

export function kindSegment(kind: PostKind): string {
  return DEFINITIONS[kind].segment;
}

export function kindFromSegment(segment: string): PostKind | undefined {
  return POST_KINDS.find((kind) => DEFINITIONS[kind].segment === segment);
}

export function kindLabel(kind: PostKind): string {
  return DEFINITIONS[kind].label;
}

export function kindPlural(kind: PostKind): string {
  return DEFINITIONS[kind].plural;
}

export function kindDescription(kind: PostKind): string {
  return DEFINITIONS[kind].description;
}
