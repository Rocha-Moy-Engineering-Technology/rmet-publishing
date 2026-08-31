import type { APIRoute } from 'astro';

import { serializeHealth } from '../../../../logic/health';

export const prerender = true;

export const GET: APIRoute = () =>
  new Response(serializeHealth(), {
    status: 200,
    headers: { 'Content-Type': 'application/json' },
  });
