import type { SiteConfig } from '../../types/site';

export const SITE: SiteConfig = {
  name: 'RMET Publishing',
  tagline: 'Blogs, articles, and papers by Pedro Henrique Rocha Moy',
  description:
    'Writing on engineering, artificial intelligence, and the systems built with it: short notes, longer articles, and formal papers.',
  author: 'Pedro Henrique Rocha Moy',
  locale: 'en',
  defaultSiteUrl: 'http://localhost:4321',
  defaultContactEmail: 'phrmoy@gmail.com',
  socialLinks: [
    {
      label: 'GitHub',
      handle: '@phrmoy',
      href: 'https://github.com/phrmoy',
      testId: 'github-link',
    },
    {
      label: 'LinkedIn',
      handle: 'in/phrmoy',
      href: 'https://www.linkedin.com/in/phrmoy/',
      testId: 'linkedin-link',
    },
    {
      label: 'Resume',
      handle: 'rocha-moy-engineering-technology.github.io/resume',
      href: 'https://rocha-moy-engineering-technology.github.io/resume/',
      testId: 'resume-link',
    },
  ],
};
