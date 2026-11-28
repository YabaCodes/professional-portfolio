import { defineConfig } from 'astro/config';
import tailwindcss from '@tailwindcss/vite';

export default defineConfig({
  // Custom domain (PP-024): served from the domain root.
  site: 'https://yeabsramekdim.com',
  base: '/',
  output: 'static',
  vite: { plugins: [tailwindcss()] },
});
