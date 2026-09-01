import { spawn, type ChildProcess } from 'node:child_process';
import { once } from 'node:events';
import { mkdir, stat } from 'node:fs/promises';
import { isAbsolute, join } from 'node:path';

import { expect, type Page } from '@playwright/test';
import getPort from 'get-port';

const MODE = 'astro-static';
const ROUTES = [
  '/',
  '/writing',
  '/blog',
  '/articles',
  '/papers',
  '/tags',
  '/contact',
] as const;

const FEED_ROUTES = [
  { path: '/rss.xml', contentType: 'application/xml' },
  { path: '/sitemap.xml', contentType: 'application/xml' },
] as const;

type Runtime = {
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

let shared: Runtime | undefined;

export async function startSharedRuntime(): Promise<string> {
  shared = await startRuntime();
  return shared.baseURL;
}

export async function stopSharedRuntime(): Promise<void> {
  if (!shared) return;
  const { child } = shared;
  shared = undefined;
  await stopRuntime(child);
}

export const BASE_PATH_FIXTURE = '/rmet-publishing';

const BASE_SITE_ROOT = 'test-results/base-site';

export async function withBasedRuntime<T>(
  action: (runtime: { baseURL: string; basePath: string }) => Promise<T>
): Promise<T> {
  await buildWithBasePath();
  const port = await getPort();
  const child = spawn(
    'npx',
    ['serve', '-l', `tcp://0.0.0.0:${port}`, BASE_SITE_ROOT],
    {
      cwd: process.cwd(),
      detached: process.platform !== 'win32',
      stdio: ['ignore', 'pipe', 'pipe'],
    }
  );
  const baseURL = `http://127.0.0.1:${port}`;
  try {
    await waitForAddress(`${baseURL}${BASE_PATH_FIXTURE}/`, child);
    return await action({ baseURL, basePath: BASE_PATH_FIXTURE });
  } finally {
    await stopRuntime(child);
  }
}

async function buildWithBasePath(): Promise<void> {
  const outDir = `${BASE_SITE_ROOT}${BASE_PATH_FIXTURE}`;
  const build = spawn('npx', ['astro', 'build', '--outDir', outDir], {
    cwd: process.cwd(),
    env: { ...process.env, PUBLIC_BASE_PATH: BASE_PATH_FIXTURE },
    stdio: ['ignore', 'pipe', 'pipe'],
  });
  let output = '';
  build.stdout?.on('data', (chunk: Buffer) => {
    output += chunk.toString();
  });
  build.stderr?.on('data', (chunk: Buffer) => {
    output += chunk.toString();
  });
  const [code] = (await once(build, 'exit')) as [number | null];
  if (code !== 0) {
    throw new Error(`Base-path build failed:\n${output}`);
  }
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

export function sharedBaseUrl(): string {
  if (!shared) throw new Error('Shared runtime has not been started');
  return shared.baseURL;
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

export async function withRuntime<T>(
  action: (runtime: { baseURL: string }) => Promise<T>
): Promise<T> {
  const runtime = await startRuntime();
  try {
    return await action({ baseURL: runtime.baseURL });
  } finally {
    await stopRuntime(runtime.child);
  }
}

async function startRuntime(): Promise<Runtime> {
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
    await waitUntilReady(runtime);
    return runtime;
  } catch (error) {
    await stopRuntime(child);
    throw error;
  }
}

async function waitUntilReady(runtime: Runtime): Promise<void> {
  const deadline = Date.now() + 10000;
  while (Date.now() < deadline) {
    if (runtime.child.exitCode !== null) {
      throw new Error(`Runtime exited before readiness:
${runtime.output()}`);
    }
    try {
      await assertHealth(runtime.baseURL);
      return;
    } catch {
      await new Promise((resolve) => setTimeout(resolve, 100));
    }
  }
  throw new Error(`Runtime readiness timed out:
${runtime.output()}`);
}

async function stopRuntime(child: ChildProcess): Promise<void> {
  if (child.exitCode !== null || child.pid === undefined) return;
  signalRuntime(child, 'SIGTERM');
  if (!(await exitsWithin(child, 1000))) {
    signalRuntime(child, 'SIGKILL');
    await once(child, 'exit');
  }
}

function signalRuntime(child: ChildProcess, signal: NodeJS.Signals): void {
  if (child.pid === undefined) return;
  if (process.platform === 'win32') child.kill(signal);
  else process.kill(-child.pid, signal);
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
