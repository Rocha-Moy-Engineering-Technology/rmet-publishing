import type { BackgroundMedia, BackgroundVideoSource } from '../../types/media';

export const BACKGROUND_VIDEO_DIRECTORY = '/video';
export const BACKGROUND_VIDEO_BASENAME = 'background';
export const BACKGROUND_POSTER_FILE = `${BACKGROUND_VIDEO_BASENAME}-poster.jpg`;

/** Speed the backdrop plays at: 1 is real time, below 1 slows the drift. */
export const BACKGROUND_PLAYBACK_RATE = 1;

/**
 * Seconds each clip crossfades into the next inside the file. The loop back to
 * the start has to match it, or the last transition reads differently from the
 * other three.
 */
export const BACKGROUND_JOIN_CROSSFADE_SECONDS = 1;

/**
 * Seconds before the end at which the standby player takes over. Browsers stall
 * visibly when a looping video seeks back to zero, so two players hand over to
 * each other instead and neither one ever seeks. The handover is also the loop
 * transition: the file ends on the last clip and starts on the first, and the
 * two players crossfade between them, which is why this matches the crossfade
 * length baked between the clips. Folding the file's tail over its head as well
 * would dissolve twice at once and dip the picture.
 */
export const BACKGROUND_HANDOVER_SECONDS = BACKGROUND_JOIN_CROSSFADE_SECONDS;

export function shouldHandOver(
  currentTime: number,
  duration: number,
  fadeSeconds: number = BACKGROUND_HANDOVER_SECONDS
): boolean {
  if (!Number.isFinite(duration)) return false;
  if (duration <= fadeSeconds) return false;
  return currentTime >= duration - fadeSeconds;
}

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

/**
 * Viewport at which the video is worth its bytes. Narrower screens get the
 * still frames instead: far less to download, and no decoding on a phone.
 */
export const BACKGROUND_WIDE_VIEWPORT = '(min-width: 768px)';

/** Seconds each still holds before the next one fades in. */
export const BACKGROUND_STILL_SECONDS = 5;

const MAX_STILLS = 9;

export function backgroundStillCandidates(): readonly string[] {
  return Array.from(
    { length: MAX_STILLS },
    (_, index) => `${BACKGROUND_VIDEO_BASENAME}-still-${index + 1}.webp`
  );
}

export function nextStillIndex(current: number, total: number): number {
  if (total <= 0) return 0;
  return (current + 1) % total;
}

export function backgroundMedia(
  availableFiles: readonly string[]
): BackgroundMedia {
  const present = new Set(availableFiles);
  const sources = backgroundVideoCandidates().filter((source) =>
    present.has(source.file)
  );
  const stills = backgroundStillCandidates()
    .filter((file) => present.has(file))
    .map(mediaPath);
  const poster = present.has(BACKGROUND_POSTER_FILE)
    ? mediaPath(BACKGROUND_POSTER_FILE)
    : undefined;
  return { sources, stills, poster };
}
