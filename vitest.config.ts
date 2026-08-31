import { defineConfig } from 'vitest/config';

export default defineConfig({
  test: {
    include: ['tests/{unit,integration}/**/*.test.ts'],
    setupFiles: ['tests/unit/time-budget.setup.ts'],
    testTimeout: 1000,
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
  },
});
