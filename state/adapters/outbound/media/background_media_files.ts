import { readdirSync } from 'node:fs';
import { join } from 'node:path';

import {
  BACKGROUND_VIDEO_DIRECTORY,
  backgroundMedia,
} from '../../../../logic/media/background_video';
import { resolveBuildSettings } from '../../../../logic/site/build_settings';
import type { BackgroundMedia } from '../../../../types/media';
import { buildEnvironment } from '../environment/build_environment';

function videoDirectory(): string {
  const { assetsDirectory } = resolveBuildSettings(
    buildEnvironment().snapshot()
  );
  return join(assetsDirectory, BACKGROUND_VIDEO_DIRECTORY);
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
