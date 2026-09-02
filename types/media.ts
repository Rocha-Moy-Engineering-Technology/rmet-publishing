export interface BackgroundVideoSource {
  readonly file: string;
  readonly src: string;
  readonly type: string;
}

export interface BackgroundMedia {
  readonly sources: readonly BackgroundVideoSource[];
  readonly stills: readonly string[];
  readonly poster?: string;
}
