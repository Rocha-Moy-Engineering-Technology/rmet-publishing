import { afterEach, beforeEach, expect } from 'vitest';

let startedAt = 0;

beforeEach(() => {
  startedAt = performance.now();
});

afterEach(() => {
  expect(performance.now() - startedAt).toBeLessThan(1000);
});
