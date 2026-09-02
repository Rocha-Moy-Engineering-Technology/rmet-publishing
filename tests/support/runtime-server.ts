import { spawn, type ChildProcess } from 'node:child_process';
import { once } from 'node:events';
import { mkdir, stat } from 'node:fs/promises';
import { isAbsolute, join } from 'node:path';

import { expect, type Page } from '@playwright/test';
import getPort from 'get-port';

const MODE = 'astro-static';

const ROUTES = ['/', '/tags', '/contact'] as const;

const FEED_ROUTES = [
  { path: '/rss.xml', contentType: 'application/xml' },
  { path: '/sitemap.xml', contentType: 'application/xml' },
] as const;

export const BASE_PATH_FIXTURE = '/rmet-publishing';
export const FIXTURE_CONTENT_DIR = 'tests/fixtures/content';
export const FIXTURE_ASSETS_DIR = 'tests/fixtures/public';
const BUILD_ROOT = 'test-results/built-site';

export type Runtime = { baseURL: string; basePath: string };

type Process = {
  baseURL: string;
  child: ChildProcess;
  output: () => string;
};

export function htmlRoutes(): readonly string[] {
  return ROUTES;
}

export function feedRoutes(): readonly { path: string; contentType: string }[] {
  return FEED_ROUTES;
}

export async function assertHealth(baseURL: string): Promise<void> {
  const response = await fetch(`${baseURL}/health`);
  expect(response.status).toBe(200);
  expect(response.headers.get('content-type')).toBe('application/json');
  expect(await response.text()).toBe('{"status":"ok"}');
}

export async function captureRoute(
  page: Page,
  testId: string,
  route: string
): Promise<void> {
  const root = process.env.ASTRO_SCREENSHOT_DIR;
  if (!root || !isAbsolute(root)) {
    throw new Error('ASTRO_SCREENSHOT_DIR must be an absolute path');
  }
  const slug = route === '/' ? 'root' : route.slice(1).replaceAll('/', '-');
  const directory = join(root, MODE);
  const destination = join(directory, `${testId}-${slug}.png`);
  await mkdir(directory, { recursive: true });
  await page.screenshot({ path: destination, fullPage: true });
  if ((await stat(destination)).size === 0) {
    throw new Error(`Screenshot is empty: ${destination}`);
  }
}

/** Serves the checked-in production build, which carries no content. */
export async function withRuntime<T>(
  action: (runtime: Runtime) => Promise<T>
): Promise<T> {
  const runtime = await startProductionServer();
  try {
    return await action({ baseURL: runtime.baseURL, basePath: '' });
  } finally {
    await stopProcess(runtime.child);
  }
}

/**
 * Builds the site from fixture content (optionally under a base path) and
 * serves it the way a static host would, then tears both down.
 */
export async function withBuiltRuntime<T>(
  options: { basePath?: string; contentDir?: string; assetsDir?: string },
  action: (runtime: Runtime) => Promise<T>
): Promise<T> {
  const basePath = options.basePath ?? '';
  const outDir = `${BUILD_ROOT}${basePath}`;
  await build(outDir, basePath, options.contentDir, options.assetsDir);
  const port = await getPort();
  const child = spawn(
    'npx',
    ['serve', '-l', `tcp://0.0.0.0:${port}`, BUILD_ROOT],
    {
      cwd: process.cwd(),
      detached: process.platform !== 'win32',
      stdio: ['ignore', 'pipe', 'pipe'],
    }
  );
  const baseURL = `http://127.0.0.1:${port}`;
  try {
    await waitForAddress(`${baseURL}${basePath}/`, child);
    return await action({ baseURL, basePath });
  } finally {
    await stopProcess(child);
  }
}

async function build(
  outDir: string,
  basePath: string,
  contentDir?: string,
  assetsDir?: string
): Promise<void> {
  const child = spawn('npx', ['astro', 'build', '--outDir', outDir], {
    cwd: process.cwd(),
    env: {
      ...process.env,
      ...(basePath ? { PUBLIC_BASE_PATH: basePath } : {}),
      ...(contentDir ? { PUBLIC_CONTENT_DIR: contentDir } : {}),
      ...(assetsDir ? { PUBLIC_ASSETS_DIR: assetsDir } : {}),
    },
    stdio: ['ignore', 'pipe', 'pipe'],
  });
  let output = '';
  child.stdout?.on('data', (chunk: Buffer) => {
    output += chunk.toString();
  });
  child.stderr?.on('data', (chunk: Buffer) => {
    output += chunk.toString();
  });
  const [code] = (await once(child, 'exit')) as [number | null];
  if (code !== 0) throw new Error(`Build failed:\n${output}`);
}

async function startProductionServer(): Promise<Process> {
  const port = await getPort();
  let stdout = '';
  let stderr = '';
  const child = spawn('npm', ['run', 'start'], {
    cwd: process.cwd(),
    detached: process.platform !== 'win32',
    env: { ...process.env, HOST: '0.0.0.0', PORT: String(port) },
    stdio: ['ignore', 'pipe', 'pipe'],
  });
  child.stdout?.on('data', (chunk: Buffer) => {
    stdout += chunk.toString();
  });
  child.stderr?.on('data', (chunk: Buffer) => {
    stderr += chunk.toString();
  });
  const runtime = {
    baseURL: `http://127.0.0.1:${port}`,
    child,
    output: () => `${stdout}${stderr}`,
  };
  try {
    await waitUntilHealthy(runtime);
    return runtime;
  } catch (error) {
    await stopProcess(child);
    throw error;
  }
}

async function waitUntilHealthy(runtime: Process): Promise<void> {
  const deadline = Date.now() + 10000;
  while (Date.now() < deadline) {
    if (runtime.child.exitCode !== null) {
      throw new Error(`Runtime exited before readiness:\n${runtime.output()}`);
    }
    try {
      await assertHealth(runtime.baseURL);
      return;
    } catch {
      await new Promise((resolve) => setTimeout(resolve, 100));
    }
  }
  throw new Error(`Runtime readiness timed out:\n${runtime.output()}`);
}

async function waitForAddress(url: string, child: ChildProcess): Promise<void> {
  const deadline = Date.now() + 15000;
  while (Date.now() < deadline) {
    if (child.exitCode !== null) {
      throw new Error(`Static server exited before readiness: ${url}`);
    }
    try {
      const response = await fetch(url);
      if (response.status === 200) return;
    } catch {
      /* not listening yet */
    }
    await new Promise((resolve) => setTimeout(resolve, 100));
  }
  throw new Error(`Static server readiness timed out: ${url}`);
}

async function stopProcess(child: ChildProcess): Promise<void> {
  if (child.exitCode !== null || child.pid === undefined) return;
  signal(child, 'SIGTERM');
  if (!(await exitsWithin(child, 1000))) {
    signal(child, 'SIGKILL');
    await once(child, 'exit');
  }
}

function signal(child: ChildProcess, signalName: NodeJS.Signals): void {
  if (child.pid === undefined) return;
  if (process.platform === 'win32') child.kill(signalName);
  else process.kill(-child.pid, signalName);
}

async function exitsWithin(
  child: ChildProcess,
  milliseconds: number
): Promise<boolean> {
  if (child.exitCode !== null) return true;
  return Promise.race([
    once(child, 'exit').then(() => true),
    new Promise<boolean>((resolve) =>
      setTimeout(() => resolve(false), milliseconds)
    ),
  ]);
}
