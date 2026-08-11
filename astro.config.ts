import sitemap from '@astrojs/sitemap';
import tailwindcss from '@tailwindcss/vite';
import { defineConfig } from 'astro/config';

/**
 * Ilagay ang production URL dito kapag handa na ang domain, hal. "https://...".
 * Ito lang ang lugar kung saan kino-configure ang sariling site URL.
 * Kapag undefined, buildable pa rin ang site at hindi gagawa ng sitemap.
 */
const site: string | undefined = undefined;

export default defineConfig({
  site,
  integrations: site ? [sitemap()] : [],
  vite: {
    plugins: [tailwindcss()],
  },
});
