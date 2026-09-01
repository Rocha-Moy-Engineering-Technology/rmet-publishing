import type {
  CommentsTheme,
  GiscusAttributes,
  GiscusOptions,
  GiscusSettings,
  GiscusThemeMessage,
} from '../../types/comments';
import { readSetting } from '../site/settings';
import type { EnvironmentSnapshot } from '../../types/ports/environment_reader';

export const GISCUS_ENVIRONMENT_KEYS = [
  'PUBLIC_GISCUS_REPO',
  'PUBLIC_GISCUS_REPO_ID',
  'PUBLIC_GISCUS_CATEGORY',
  'PUBLIC_GISCUS_CATEGORY_ID',
] as const;

const DEFAULT_THEME: CommentsTheme = 'preferred_color_scheme';

export function resolveGiscusSettings(
  environment: EnvironmentSnapshot
): GiscusSettings | undefined {
  const values = GISCUS_ENVIRONMENT_KEYS.map((key) =>
    readSetting(environment, key)
  );
  if (values.some((value) => value === undefined)) return undefined;
  const [repo, repoId, category, categoryId] = values as readonly string[];
  return { repo, repoId, category, categoryId };
}

export function giscusAttributes(
  settings: GiscusSettings,
  options: GiscusOptions
): GiscusAttributes {
  return {
    'data-repo': settings.repo,
    'data-repo-id': settings.repoId,
    'data-category': settings.category,
    'data-category-id': settings.categoryId,
    'data-mapping': 'specific',
    'data-term': options.term,
    'data-strict': '1',
    'data-reactions-enabled': '1',
    'data-emit-metadata': '0',
    'data-input-position': 'top',
    'data-theme': options.theme ?? DEFAULT_THEME,
    'data-lang': 'en',
    'data-loading': 'lazy',
  };
}

export function giscusThemeMessage(theme: CommentsTheme): GiscusThemeMessage {
  return { giscus: { setConfig: { theme } } };
}
