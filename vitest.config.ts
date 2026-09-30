import { defineConfig } from 'vitest/config';

/** Integration tests that run a full `astro build` need seconds, not one. */
const INTEGRATION_TIMEOUT_MILLISECONDS = 120_000;

export default defineConfig({
  test: {
    coverage: {
      provider: 'v8',
      include: ['logic/**/*.ts'],
      thresholds: {
        branches: 100,
        functions: 100,
        lines: 100,
        statements: 100,
      },
    },
    projects: [
      {
        test: {
          name: 'unit',
          include: ['tests/unit/**/*.test.ts'],
          setupFiles: ['tests/unit/time-budget.setup.ts'],
          testTimeout: 1000,
        },
      },
      {
        test: {
          name: 'integration',
          include: ['tests/integration/**/*.test.ts'],
          // every astro build writes its prerender chunks to the shared
          // .astro/ folder, so two files building at once break each other
          fileParallelism: false,
          testTimeout: INTEGRATION_TIMEOUT_MILLISECONDS,
          hookTimeout: INTEGRATION_TIMEOUT_MILLISECONDS,
        },
      },
    ],
  },
});
