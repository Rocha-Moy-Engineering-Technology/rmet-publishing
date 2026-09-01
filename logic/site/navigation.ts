import { POST_KINDS, kindPlural } from '../posts/post_kinds';
import { kindPath } from '../posts/post_routes';
import type { NavigationItem } from '../../types/site';

const WRITING_ITEM: NavigationItem = { label: 'Writing', href: '/writing' };
const CONTACT_ITEM: NavigationItem = { label: 'Contact', href: '/contact' };

export function navigationItems(): readonly NavigationItem[] {
  const kindItems = POST_KINDS.map((kind) => ({
    label: kindPlural(kind),
    href: kindPath(kind),
  }));
  return [WRITING_ITEM, ...kindItems, CONTACT_ITEM];
}

function normalizePath(path: string): string {
  const trimmed = path.replace(/\/+$/, '');
  return trimmed.length === 0 ? '/' : trimmed;
}

export function isActivePath(currentPath: string, href: string): boolean {
  const current = normalizePath(currentPath);
  const target = normalizePath(href);
  if (target === '/') return current === '/';
  return current === target || current.startsWith(`${target}/`);
}
