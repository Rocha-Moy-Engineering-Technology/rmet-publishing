import type { SiteConfig } from '../../types/site';

export const SITE: SiteConfig = {
  name: 'Pedro Henrique Rocha Moy',
  publicationTitle: 'Rocha Moy Engineering & Technology Blog',
  tagline:
    'Engineering & Technology, Artificial Intelligence, Machine Learning, Data Science, Data & Software Engineering',
  description:
    'Writing on engineering, artificial intelligence, and the systems built with it.',
  author: 'Pedro Henrique Rocha Moy',
  locale: 'en',
  defaultSiteUrl: 'http://localhost:4321',
  defaultContactEmail: 'phrmoy@gmail.com',
  profileLinks: [
    {
      label: 'Resume',
      handle: 'rocha-moy-engineering-technology.github.io/resume',
      href: 'https://rocha-moy-engineering-technology.github.io/resume/',
      testId: 'resume-link',
      mark: 'resume',
    },
    {
      label: 'GitHub',
      handle: '@phrmoy',
      href: 'https://github.com/phrmoy',
      testId: 'github-link',
      mark: 'github',
    },
    {
      label: 'LinkedIn',
      handle: 'in/phrmoy',
      href: 'https://www.linkedin.com/in/phrmoy/',
      testId: 'linkedin-link',
      mark: 'linkedin',
    },
  ],
};
