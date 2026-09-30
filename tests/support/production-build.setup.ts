import { buildSite } from './site-build';

/**
 * Playwright global setup. The suites that run the production server serve
 * dist/, so dist/ is rebuilt first with every build variable set explicitly
 * and blank: the real content, no base path, no subscription provider, and the
 * default contact address, whatever a local .env or the shell says.
 */
export default async function rebuildProductionSite(): Promise<void> {
  await buildSite('dist', {});
}
