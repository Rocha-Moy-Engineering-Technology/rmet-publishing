import type {
  EnvironmentReader,
  EnvironmentSnapshot,
} from '../../../../types/ports/environment_reader';

export function siteEnvironment(): EnvironmentReader {
  return {
    snapshot(): EnvironmentSnapshot {
      return {
        BASE_URL: import.meta.env.BASE_URL,
        PUBLIC_SITE_URL: import.meta.env.PUBLIC_SITE_URL,
        PUBLIC_CONTACT_EMAIL: import.meta.env.PUBLIC_CONTACT_EMAIL,
        PUBLIC_GISCUS_REPO: import.meta.env.PUBLIC_GISCUS_REPO,
        PUBLIC_GISCUS_REPO_ID: import.meta.env.PUBLIC_GISCUS_REPO_ID,
        PUBLIC_GISCUS_CATEGORY: import.meta.env.PUBLIC_GISCUS_CATEGORY,
        PUBLIC_GISCUS_CATEGORY_ID: import.meta.env.PUBLIC_GISCUS_CATEGORY_ID,
        PUBLIC_SUBSCRIBE_ACTION: import.meta.env.PUBLIC_SUBSCRIBE_ACTION,
        PUBLIC_SUBSCRIBE_EMAIL_FIELD: import.meta.env
          .PUBLIC_SUBSCRIBE_EMAIL_FIELD,
      };
    },
  };
}
