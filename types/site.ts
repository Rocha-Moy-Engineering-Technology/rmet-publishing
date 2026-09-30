export type ProfileMark = 'github' | 'linkedin' | 'resume';

export interface ProfileLink {
  readonly label: string;
  readonly handle: string;
  readonly href: string;
  readonly testId: string;
  readonly mark: ProfileMark;
}

export interface NavigationItem {
  readonly label: string;
  readonly href: string;
  readonly external: boolean;
}

export interface NavigationLink extends NavigationItem {
  readonly active: boolean;
}

export type AnchorAttributes = Readonly<Record<string, string>>;

/** What the build reads from the environment before Astro starts. */
export interface BuildSettings {
  readonly site: string;
  readonly base: string;
  readonly assetsDirectory: string;
  readonly contentDirectory: string;
}

export interface SiteConfig {
  readonly name: string;
  readonly publicationTitle: string;
  readonly tagline: string;
  readonly description: string;
  readonly author: string;
  readonly locale: string;
  readonly defaultSiteUrl: string;
  readonly defaultContactEmail: string;
  readonly profileLinks: readonly ProfileLink[];
}
