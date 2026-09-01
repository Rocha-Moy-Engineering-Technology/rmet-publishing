export interface SocialLink {
  readonly label: string;
  readonly handle: string;
  readonly href: string;
  readonly testId: string;
}

export interface NavigationItem {
  readonly label: string;
  readonly href: string;
}

export interface SiteConfig {
  readonly name: string;
  readonly tagline: string;
  readonly description: string;
  readonly author: string;
  readonly locale: string;
  readonly defaultSiteUrl: string;
  readonly defaultContactEmail: string;
  readonly socialLinks: readonly SocialLink[];
}
