const EDGE_SLASHES = /^\/+|\/+$/g;

export function normalizeBasePath(value: string | undefined): string {
  const trimmed = (value ?? '').trim().replace(EDGE_SLASHES, '');
  return trimmed.length === 0 ? '' : `/${trimmed}`;
}

export function astroBase(value: string | undefined): string {
  const basePath = normalizeBasePath(value);
  return basePath.length === 0 ? '/' : basePath;
}

export function withBasePath(basePath: string, path: string): string {
  if (!path.startsWith('/')) return path;
  if (basePath.length === 0) return path;
  return path === '/' ? `${basePath}/` : `${basePath}${path}`;
}

export function stripBasePath(basePath: string, path: string): string {
  if (basePath.length === 0) return path;
  if (path === basePath) return '/';
  if (!path.startsWith(`${basePath}/`)) return path;
  const remainder = path.slice(basePath.length);
  return remainder === '/' ? '/' : remainder;
}
