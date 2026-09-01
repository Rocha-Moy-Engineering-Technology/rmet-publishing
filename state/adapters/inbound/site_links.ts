import {
  normalizeBasePath,
  stripBasePath,
  withBasePath,
} from '../../../logic/site/base_path';
import { siteEnvironment } from '../outbound/environment/site_environment';

function basePath(): string {
  return normalizeBasePath(siteEnvironment().snapshot().BASE_URL);
}

export function siteHref(path: string): string {
  return withBasePath(basePath(), path);
}

export function sitePath(path: string): string {
  return stripBasePath(basePath(), path);
}
