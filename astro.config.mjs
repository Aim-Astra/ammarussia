// @ts-check
import { defineConfig } from 'astro/config';

// https://astro.build/config
export default defineConfig({
  site: 'https://mosmates.ru/amma',
  base: '/',
  output: 'static',
  build: {
    assets: '_astro',
    format: 'directory',
  },
  compressHTML: true,
});
