import { defineConfig } from 'astro/config';

// `site` y `base` se ajustan al dominio definitivo cuando se publique.
export default defineConfig({
  site: process.env.SITE_URL || 'https://www.blankhotel.com.ar',
  base: process.env.BASE_PATH || '/',
  trailingSlash: 'ignore',
  server: { host: true },
});
