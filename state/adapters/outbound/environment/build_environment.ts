import { loadEnv } from 'vite';

import { BUILD_SETTING_PREFIX } from '../../../../logic/site/build_settings';
import type {
  EnvironmentReader,
  EnvironmentSnapshot,
} from '../../../../types/ports/environment_reader';

/** Astro sets NODE_ENV to its mode before it reads the configuration. */
const DEFAULT_MODE = 'production';

/**
 * The build's own settings, read before Astro fills `import.meta.env`: the
 * `.env` files in the project root (`.env`, `.env.local`, and their `.<mode>`
 * variants), overridden by any variable the shell already exported.
 */
export function buildEnvironment(): EnvironmentReader {
  return {
    snapshot(): EnvironmentSnapshot {
      return loadEnv(
        process.env.NODE_ENV ?? DEFAULT_MODE,
        process.cwd(),
        BUILD_SETTING_PREFIX
      );
    },
  };
}
