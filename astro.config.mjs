import mdx from '@astrojs/mdx';
import tailwindcss from '@tailwindcss/vite';
import serveConfig from './serve.json';
import { defineConfig } from 'astro/config';

import { astroBase } from './logic/site/base_path';
import { SITE } from './logic/site/site_config';

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
  site: process.env.PUBLIC_SITE_URL ?? SITE.defaultSiteUrl,
  base: astroBase(process.env.PUBLIC_BASE_PATH),
  redirects: {
    '/writings': '/',
  },
  srcDir: './state/adapters/inbound',
  publicDir: process.env.PUBLIC_ASSETS_DIR ?? './state/adapters/inbound/public',
  output: 'static',
  integrations: [mdx()],
  vite: {
    plugins: [tailwindcss(), serveConfigPlugin],
  },
});
