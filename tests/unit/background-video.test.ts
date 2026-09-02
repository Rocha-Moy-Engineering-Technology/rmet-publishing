import { describe, expect, test } from 'vitest';

import {
  BACKGROUND_PLAYBACK_RATE,
  BACKGROUND_POSTER_FILE,
  BACKGROUND_VIDEO_DIRECTORY,
  backgroundMedia,
  backgroundVideoCandidates,
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
    expect(backgroundMedia([])).toEqual({ sources: [], poster: undefined });
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
      poster: undefined,
    });
  });

  test('RMET-UNIT-186 offers a poster only when the poster file exists', () => {
    expect(backgroundMedia(['background.mp4']).poster).toBeUndefined();
  });
});
