import { SITE } from './site_config';
import type {
  AnchorAttributes,
  NavigationItem,
  NavigationLink,
  ProfileLink,
  ProfileMark,
} from '../../types/site';

const ICON_MARKS: readonly ProfileMark[] = ['github', 'linkedin'];

export function profileLink(mark: ProfileMark): ProfileLink {
  const link = SITE.profileLinks.find((candidate) => candidate.mark === mark);
  if (!link) throw new Error(`No profile link for mark: ${mark}`);
  return link;
}

export function iconLinks(): readonly ProfileLink[] {
  return SITE.profileLinks.filter((link) => ICON_MARKS.includes(link.mark));
}

export function navigationItems(): readonly NavigationItem[] {
  const resume = profileLink('resume');
  return [
    { label: 'Resume', href: resume.href, external: true },
    { label: 'Contact', href: '/contact', external: false },
  ];
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

export function navigationLinks(
  currentPath: string
): readonly NavigationLink[] {
  return navigationItems().map((item) => ({
    ...item,
    active: !item.external && isActivePath(currentPath, item.href),
  }));
}

export function navigationAnchor(link: NavigationLink): AnchorAttributes {
  if (link.external) {
    return { rel: 'noopener', target: '_blank', 'data-testid': 'resume-link' };
  }
  return link.active ? { 'aria-current': 'page' } : {};
}
