import mdx from '@astrojs/mdx';
import tailwindcss from '@tailwindcss/vite';
import serveConfig from './serve.json';
import { defineConfig } from 'astro/config';

import { resolveBuildSettings } from './logic/site/build_settings';
import { buildEnvironment } from './state/adapters/outbound/environment/build_environment';

/** .env files and the shell, the shell winning; see build_environment.ts. */
const settings = resolveBuildSettings(buildEnvironment().snapshot());

/** @type {import('vite').Plugin} */
const serveConfigPlugin = {
  name: 'static-serve-config',
  generateBundle() {
    this.emitFile({
      type: 'asset',
      fileName: 'serve.json',
      source: JSON.stringify(serveConfig),
    });
  },
};

export default defineConfig({
  site: settings.site,
  base: settings.base,
  redirects: {
    '/writings': '/',
  },
  srcDir: './state/adapters/inbound',
  publicDir: settings.assetsDirectory,
  output: 'static',
  integrations: [mdx()],
  vite: {
    plugins: [tailwindcss(), serveConfigPlugin],
  },
});
