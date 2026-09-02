import { defineConfig, devices } from '@playwright/test';
import { defineBddConfig } from 'playwright-bdd';

const bddTestDir = defineBddConfig({
  features: 'tests/bdd/features/*.feature',
  steps: 'tests/bdd/steps/*.ts',
  outputDir: 'tests/.features-gen',
});

const executablePath = process.env.PLAYWRIGHT_CHROMIUM_PATH;

const launchArguments = ['--autoplay-policy=no-user-gesture-required'];

const chrome = executablePath
  ? {
      ...devices['Desktop Chrome'],
      launchOptions: { executablePath, args: launchArguments },
    }
  : {
      ...devices['Desktop Chrome'],
      channel: 'chrome',
      launchOptions: { args: launchArguments },
    };

export default defineConfig({
  fullyParallel: false,
  reporter: 'list',
  timeout: 30000,
  projects: [
    { name: 'bdd', testDir: bddTestDir, use: chrome },
    { name: 'e2e', testDir: 'tests/e2e', use: chrome },
    { name: 'smoke', testDir: 'tests/smoke', use: chrome },
  ],
});
