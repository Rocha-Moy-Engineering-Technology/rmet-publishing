import { describe, expect, test } from 'vitest';

import {
  BACKGROUND_HANDOVER_SECONDS,
  BACKGROUND_JOIN_CROSSFADE_SECONDS,
  BACKGROUND_STILL_DEFAULT_FOCUS,
  BACKGROUND_STILL_FADE_SECONDS,
  BACKGROUND_STILL_FOCUS,
  BACKGROUND_STILL_HOLD_SECONDS,
  BACKGROUND_WIDE_VIEWPORT,
  BACKGROUND_PLAYBACK_RATE,
  BACKGROUND_POSTER_FILE,
  BACKGROUND_VIDEO_DIRECTORY,
  backgroundMedia,
  backgroundStillCandidates,
  backgroundVideoCandidates,
  nextStillIndex,
  shouldHandOver,
} from '../../logic/media/background_video';

describe('background video', () => {
  test('RMET-UNIT-180 offers WebM before MP4 so browsers take the smaller file', () => {
    expect(backgroundVideoCandidates().map((source) => source.file)).toEqual([
      'background.webm',
      'background.mp4',
    ]);
  });

  test('RMET-UNIT-181 addresses each candidate under the video directory with its media type', () => {
    expect(backgroundVideoCandidates()).toEqual([
      {
        file: 'background.webm',
        src: '/video/background.webm',
        type: 'video/webm',
      },
      {
        file: 'background.mp4',
        src: '/video/background.mp4',
        type: 'video/mp4',
      },
    ]);
    expect(BACKGROUND_VIDEO_DIRECTORY).toBe('/video');
  });

  test('RMET-UNIT-187 plays the backdrop at a usable speed', () => {
    expect(BACKGROUND_PLAYBACK_RATE).toBeGreaterThan(0);
    expect(BACKGROUND_PLAYBACK_RATE).toBeLessThanOrEqual(2);
    expect(Number.isFinite(BACKGROUND_PLAYBACK_RATE)).toBe(true);
  });

  test('RMET-UNIT-182 reports no media when the directory is empty', () => {
    expect(backgroundMedia([])).toEqual({
      sources: [],
      stills: [],
      poster: undefined,
    });
  });

  test('RMET-UNIT-183 keeps only the formats that are actually present', () => {
    expect(backgroundMedia(['background.mp4']).sources).toEqual([
      {
        file: 'background.mp4',
        src: '/video/background.mp4',
        type: 'video/mp4',
      },
    ]);
  });

  test('RMET-UNIT-184 returns both formats and the poster when all are present', () => {
    const media = backgroundMedia([
      'background.mp4',
      'background.webm',
      BACKGROUND_POSTER_FILE,
    ]);
    expect(media.sources.map((source) => source.type)).toEqual([
      'video/webm',
      'video/mp4',
    ]);
    expect(media.poster).toBe('/video/background-poster.jpg');
  });

  test('RMET-UNIT-185 ignores files that are not the background media', () => {
    expect(backgroundMedia(['other.mp4', 'notes.txt'])).toEqual({
      sources: [],
      stills: [],
      poster: undefined,
    });
  });

  test('RMET-UNIT-186 offers a poster only when the poster file exists', () => {
    expect(backgroundMedia(['background.mp4']).poster).toBeUndefined();
  });
});

describe('handing one player over to the next', () => {
  test('RMET-UNIT-188 waits until the fade window opens', () => {
    expect(shouldHandOver(20, 28.125, 0.6)).toBe(false);
    expect(shouldHandOver(27.5, 28.125, 0.6)).toBe(false);
  });

  test('RMET-UNIT-189 hands over once inside the fade window', () => {
    expect(shouldHandOver(27.525, 28.125, 0.6)).toBe(true);
    expect(shouldHandOver(28.125, 28.125, 0.6)).toBe(true);
  });

  test('RMET-UNIT-190 refuses to hand over on an unknown duration', () => {
    expect(shouldHandOver(1, Number.NaN, 0.6)).toBe(false);
    expect(shouldHandOver(1, Number.POSITIVE_INFINITY, 0.6)).toBe(false);
  });

  test('RMET-UNIT-191 refuses to hand over on a clip shorter than the fade', () => {
    expect(shouldHandOver(0.3, 0.5, 0.6)).toBe(false);
  });

  test('RMET-UNIT-192 uses the configured window by default', () => {
    expect(BACKGROUND_HANDOVER_SECONDS).toBeGreaterThan(0);
    expect(
      shouldHandOver(28.125 - BACKGROUND_HANDOVER_SECONDS / 2, 28.125)
    ).toBe(true);
  });

  test('RMET-UNIT-195 hands over for as long as the clips crossfade', () => {
    // the loop is the fourth join, so it has to last exactly as long as the
    // three the file already carries
    expect(BACKGROUND_HANDOVER_SECONDS).toBe(BACKGROUND_JOIN_CROSSFADE_SECONDS);
  });
});

describe('stills for narrow screens', () => {
  test('RMET-UNIT-193 collects the stills that are present, in order', () => {
    expect(
      backgroundMedia([
        'background-still-2.webp',
        'background-still-1.webp',
        'background-still-3.webp',
      ]).stills.map((still) => still.src)
    ).toEqual([
      '/video/background-still-1.webp',
      '/video/background-still-2.webp',
      '/video/background-still-3.webp',
    ]);
  });

  test('RMET-UNIT-194 keeps a gap in the numbering from breaking the sequence', () => {
    expect(
      backgroundMedia([
        'background-still-1.webp',
        'background-still-3.webp',
      ]).stills.map((still) => still.src)
    ).toEqual([
      '/video/background-still-1.webp',
      '/video/background-still-3.webp',
    ]);
  });

  test('RMET-UNIT-195 reports no stills when none are present', () => {
    expect(backgroundMedia(['background.mp4']).stills).toEqual([]);
  });

  test('RMET-UNIT-196 names candidates under the video directory convention', () => {
    expect(backgroundStillCandidates()[0]).toBe('background-still-1.webp');
    expect(backgroundStillCandidates()).toHaveLength(9);
  });

  test('RMET-UNIT-197 advances through the stills and wraps around', () => {
    expect(nextStillIndex(0, 3)).toBe(1);
    expect(nextStillIndex(1, 3)).toBe(2);
    expect(nextStillIndex(2, 3)).toBe(0);
  });

  test('RMET-UNIT-198 stays put when there is nothing to advance through', () => {
    expect(nextStillIndex(0, 0)).toBe(0);
    expect(nextStillIndex(3, -1)).toBe(0);
  });

  test('RMET-UNIT-199 keeps the video for wide viewports only', () => {
    expect(BACKGROUND_WIDE_VIEWPORT).toBe('(min-width: 768px)');
  });

  test('RMET-UNIT-201 crops a portrait screen around the subject of each still', () => {
    // the lunar lander stands at the right of its frame; a centred crop
    // would show Earth and the ground and lose the lander
    expect(BACKGROUND_STILL_FOCUS['background-still-2.webp']).toBe('94% 50%');
    // Earth hangs behind the dish at the left of the lunar base frame
    expect(BACKGROUND_STILL_FOCUS['background-still-4.webp']).toBe('29% 50%');
    // the satellites frame stays centred
    expect(BACKGROUND_STILL_FOCUS['background-still-3.webp']).toBeUndefined();
    expect(backgroundMedia(['background-still-3.webp']).stills[0].focus).toBe(
      BACKGROUND_STILL_DEFAULT_FOCUS
    );
    const stills = backgroundMedia([
      'background-still-1.webp',
      'background-still-2.webp',
    ]).stills;
    // the space station crosses the right of its frame
    expect(stills[0]).toEqual({
      src: '/video/background-still-1.webp',
      focus: '80% 50%',
    });
    expect(stills[1]).toEqual({
      src: '/video/background-still-2.webp',
      focus: '94% 50%',
    });
    expect(BACKGROUND_STILL_DEFAULT_FOCUS).toBe('50% 50%');
  });

  test('RMET-UNIT-200 holds each still alone for three seconds, then dissolves for no longer than that', () => {
    expect(BACKGROUND_STILL_HOLD_SECONDS).toBe(3);
    expect(BACKGROUND_STILL_FADE_SECONDS).toBeGreaterThan(0);
    expect(BACKGROUND_STILL_FADE_SECONDS).toBeLessThanOrEqual(
      BACKGROUND_STILL_HOLD_SECONDS
    );
  });
});
