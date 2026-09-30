import { spawn } from 'node:child_process';
import { once } from 'node:events';

export const FIXTURE_CONTENT_DIR = 'tests/fixtures/content';
export const FIXTURE_ASSETS_DIR = 'tests/fixtures/public';

export type BuildOptions = {
  basePath?: string;
  contentDir?: string;
  assetsDir?: string;
  subscribeAction?: string;
  subscribeEmailField?: string;
  contactEmail?: string;
};

export type BuildResult = { code: number | null; output: string };

const BUILD_VARIABLES: Readonly<Record<keyof BuildOptions, string>> = {
  basePath: 'PUBLIC_BASE_PATH',
  contentDir: 'PUBLIC_CONTENT_DIR',
  assetsDir: 'PUBLIC_ASSETS_DIR',
  subscribeAction: 'PUBLIC_SUBSCRIBE_ACTION',
  subscribeEmailField: 'PUBLIC_SUBSCRIBE_EMAIL_FIELD',
  contactEmail: 'PUBLIC_CONTACT_EMAIL',
};

/** A variable no suite sets but a developer's .env or shell might. */
const PINNED_BLANK = ['PUBLIC_SITE_URL'] as const;

/**
 * Every build variable is set, blank when the suite passes no value: a shell
 * value wins over a .env file and a blank one counts as unset, so a local
 * .env never leaks into a suite's build.
 */
function buildEnvironment(options: BuildOptions): NodeJS.ProcessEnv {
  const env: NodeJS.ProcessEnv = { ...process.env };
  for (const variable of PINNED_BLANK) env[variable] = '';
  for (const [option, variable] of Object.entries(BUILD_VARIABLES)) {
    env[variable] = options[option as keyof BuildOptions] ?? '';
  }
  return env;
}

/** Runs `astro build` into outDir and reports its exit code and output. */
export async function runBuild(
  outDir: string,
  options: BuildOptions
): Promise<BuildResult> {
  const child = spawn('npx', ['astro', 'build', '--outDir', outDir], {
    cwd: process.cwd(),
    env: buildEnvironment(options),
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
  return { code, output };
}

/** Builds into outDir and throws with the build output when it fails. */
export async function buildSite(
  outDir: string,
  options: BuildOptions
): Promise<void> {
  const { code, output } = await runBuild(outDir, options);
  if (code !== 0) throw new Error(`Build failed:\n${output}`);
}
