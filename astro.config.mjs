import tailwindcss from '@tailwindcss/vite';
import serveConfig from './serve.json';
import { defineConfig } from 'astro/config';

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
  srcDir: './state/adapters/inbound',
  output: 'static',
  vite: {
    plugins: [tailwindcss(), serveConfigPlugin],
  },
});
