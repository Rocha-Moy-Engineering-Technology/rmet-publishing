import { astroBase } from './base_path';
import { readSetting } from './settings';
import { SITE } from './site_config';
import type { EnvironmentSnapshot } from '../../types/ports/environment_reader';
import type { BuildSettings } from '../../types/site';

/** The prefix Astro exposes to pages; the build's own settings share it. */
export const BUILD_SETTING_PREFIX = 'PUBLIC_';

export const DEFAULT_ASSETS_DIRECTORY = './state/adapters/inbound/public';
export const DEFAULT_CONTENT_DIRECTORY =
  './state/adapters/inbound/content/posts';

/** A blank value counts as unset, so it falls back like an absent one. */
export function resolveBuildSettings(
  environment: EnvironmentSnapshot
): BuildSettings {
  return {
    site: readSetting(environment, 'PUBLIC_SITE_URL') ?? SITE.defaultSiteUrl,
    base: astroBase(readSetting(environment, 'PUBLIC_BASE_PATH')),
    assetsDirectory:
      readSetting(environment, 'PUBLIC_ASSETS_DIR') ?? DEFAULT_ASSETS_DIRECTORY,
    contentDirectory:
      readSetting(environment, 'PUBLIC_CONTENT_DIR') ??
      DEFAULT_CONTENT_DIRECTORY,
  };
}
