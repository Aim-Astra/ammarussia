// @ts-check
import { defineConfig } from 'astro/config';

// https://astro.build/config
export default defineConfig({
  site: 'https://aim-astra.github.io/ammarussia',
  base: '/ammarussia/',
  output: 'static',
  build: {
    assets: '_astro',
    format: 'directory',
  },
  compressHTML: true,
});
