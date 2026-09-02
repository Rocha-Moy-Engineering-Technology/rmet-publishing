export interface BackgroundVideoSource {
  readonly file: string;
  readonly src: string;
  readonly type: string;
}

export interface BackgroundMedia {
  readonly sources: readonly BackgroundVideoSource[];
  readonly poster?: string;
}
