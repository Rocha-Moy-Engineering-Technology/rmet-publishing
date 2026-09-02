import type { BackgroundMedia, BackgroundVideoSource } from '../../types/media';

export const BACKGROUND_VIDEO_DIRECTORY = '/video';
export const BACKGROUND_VIDEO_BASENAME = 'background';
export const BACKGROUND_POSTER_FILE = `${BACKGROUND_VIDEO_BASENAME}-poster.jpg`;

/** Speed the backdrop plays at: 1 is real time, below 1 slows the drift. */
export const BACKGROUND_PLAYBACK_RATE = 1;

const FORMATS: readonly (readonly [string, string])[] = [
  ['webm', 'video/webm'],
  ['mp4', 'video/mp4'],
];

function mediaPath(file: string): string {
  return `${BACKGROUND_VIDEO_DIRECTORY}/${file}`;
}

export function backgroundVideoCandidates(): readonly BackgroundVideoSource[] {
  return FORMATS.map(([extension, type]) => {
    const file = `${BACKGROUND_VIDEO_BASENAME}.${extension}`;
    return { file, src: mediaPath(file), type };
  });
}

export function backgroundMedia(
  availableFiles: readonly string[]
): BackgroundMedia {
  const present = new Set(availableFiles);
  const sources = backgroundVideoCandidates().filter((source) =>
    present.has(source.file)
  );
  const poster = present.has(BACKGROUND_POSTER_FILE)
    ? mediaPath(BACKGROUND_POSTER_FILE)
    : undefined;
  return { sources, poster };
}
