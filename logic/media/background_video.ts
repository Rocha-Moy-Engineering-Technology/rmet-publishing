import type {
  BackgroundMedia,
  BackgroundStill,
  BackgroundVideoSource,
} from '../../types/media';

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

/**
 * Seconds each still stands alone on a narrow screen before the next one
 * dissolves in. Nothing else is blended with it during the hold.
 */
export const BACKGROUND_STILL_HOLD_SECONDS = 3;

/**
 * Seconds the next still takes to dissolve in over the current one. The
 * outgoing still stays whole underneath for the whole dissolve, so the
 * picture never dips; the script applies this as the stills' transition.
 */
export const BACKGROUND_STILL_FADE_SECONDS = 1;

const MAX_STILLS = 9;

/** Where a crop centres when a still names no focal point of its own. */
export const BACKGROUND_STILL_DEFAULT_FOCUS = '50% 50%';

/**
 * The `object-position` a portrait screen crops each still around, by file.
 * A phone shows only a slice of these wide frames, so a subject that stands
 * off centre names where the slice goes: the space station crosses the right
 * of its frame, the lunar lander stands at the right of its own, and Earth
 * hangs behind the dish at the left of the lunar base.
 */
export const BACKGROUND_STILL_FOCUS: Readonly<Record<string, string>> = {
  'background-still-1.webp': '80% 50%',
  'background-still-2.webp': '94% 50%',
  'background-still-4.webp': '29% 50%',
};

function still(file: string): BackgroundStill {
  return {
    src: mediaPath(file),
    focus: BACKGROUND_STILL_FOCUS[file] ?? BACKGROUND_STILL_DEFAULT_FOCUS,
  };
}

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
    .map(still);
  const poster = present.has(BACKGROUND_POSTER_FILE)
    ? mediaPath(BACKGROUND_POSTER_FILE)
    : undefined;
  return { sources, stills, poster };
}
