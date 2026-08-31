import { spawn, type ChildProcess } from 'node:child_process';
import { once } from 'node:events';
import { mkdir, stat } from 'node:fs/promises';
import { isAbsolute, join } from 'node:path';

import { expect, type Page } from '@playwright/test';
import getPort from 'get-port';

const MODE = 'astro-static';
const ROUTES = ['/'] as const;

type Runtime = {
  baseURL: string;
  child: ChildProcess;
  output: () => string;
};

export function htmlRoutes(): readonly string[] {
  return ROUTES;
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
