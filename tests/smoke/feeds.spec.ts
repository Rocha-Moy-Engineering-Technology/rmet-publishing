import { expect, test } from '@playwright/test';

import { feedRoutes, withRuntime } from '../support/runtime-server';

test('RMET-SMOKE-001 serves the syndication surfaces from the production runtime', async ({
  request,
}) => {
  await withRuntime(async ({ baseURL }) => {
    for (const route of feedRoutes()) {
      const response = await request.get(`${baseURL}${route.path}`);
      expect(response.status()).toBe(200);
      expect(response.headers()['content-type']).toContain(route.contentType);
    }
  });
});

test('RMET-SMOKE-002 serves the subscription section beside the feed', async ({
  request,
}) => {
  await withRuntime(async ({ baseURL }) => {
    const response = await request.get(`${baseURL}/`);
    expect(response.status()).toBe(200);
    const html = await response.text();
    expect(html).toContain('data-testid="subscribe"');
    expect(html).toContain('href="/rss.xml"');
  });
});
