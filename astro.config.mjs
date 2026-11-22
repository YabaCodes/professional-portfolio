import { defineConfig } from 'astro/config';
import tailwindcss from '@tailwindcss/vite';

export default defineConfig({
  site: 'https://yabacodes.github.io',
  base: '/professional-portfolio',
  output: 'static',
  vite: { plugins: [tailwindcss()] },
});
