import { readdirSync } from 'node:fs';
import { join } from 'node:path';

import {
  BACKGROUND_VIDEO_DIRECTORY,
  backgroundMedia,
} from '../../../../logic/media/background_video';
import type { BackgroundMedia } from '../../../../types/media';

const DEFAULT_ASSETS_DIRECTORY = './state/adapters/inbound/public';

function videoDirectory(): string {
  const assets = process.env.PUBLIC_ASSETS_DIR ?? DEFAULT_ASSETS_DIRECTORY;
  return join(assets, BACKGROUND_VIDEO_DIRECTORY);
}

function availableFiles(): readonly string[] {
  try {
    return readdirSync(videoDirectory());
  } catch {
    return [];
  }
}

export function readBackgroundMedia(): BackgroundMedia {
  return backgroundMedia(availableFiles());
}
