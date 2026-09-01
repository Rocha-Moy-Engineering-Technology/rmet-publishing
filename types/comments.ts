export type CommentsTheme = 'light' | 'dark' | 'preferred_color_scheme';

export interface GiscusSettings {
  readonly repo: string;
  readonly repoId: string;
  readonly category: string;
  readonly categoryId: string;
}

export interface GiscusOptions {
  readonly term: string;
  readonly theme?: CommentsTheme;
}

export type GiscusAttributes = Readonly<Record<string, string>>;

export interface GiscusThemeMessage {
  readonly giscus: { readonly setConfig: { readonly theme: CommentsTheme } };
}
