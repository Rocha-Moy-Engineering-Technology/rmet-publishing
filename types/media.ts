export interface BackgroundVideoSource {
  readonly file: string;
  readonly src: string;
  readonly type: string;
}

/** One still for narrow screens: its address and the point a crop centres on. */
export interface BackgroundStill {
  readonly src: string;
  readonly focus: string;
}

export interface BackgroundMedia {
  readonly sources: readonly BackgroundVideoSource[];
  readonly stills: readonly BackgroundStill[];
  readonly poster?: string;
}
