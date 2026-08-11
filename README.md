# Bantayog ni José Rizal — Astro single-page site

Isang single-page Filipino travel/heritage site para sa José Rizal Monument sa Luneta, Maynila.

## Stack at pinned versions

- Astro 7.2.0
- Tailwind CSS 4.3.3 + `@tailwindcss/vite` 4.3.3
- TypeScript 6.0.3
- `@astrojs/check` 0.9.10
- `@astrojs/sitemap` 3.7.3
- Wrangler 4.120.0
- pnpm 11.21.0 (`packageManager` + `engines`)
- Node.js 24.19.0 LTS (`engines` + `.node-version`)

## Domain / site URL

Ang sariling domain ay sinasadyang **hindi pa naka-set**. I-edit lamang ang `site` constant sa `astro.config.ts` kapag may production domain na:

```ts
const site: string | undefined = undefined;
```

Huwag ilagay ang domain sa ibang config. Ang canonical, Open Graph URL, JSON-LD URL/image, at sitemap ay kumukuha sa `Astro.site`. Kapag `site` ay `undefined`, hindi maglalabas ng canonical/OG absolute URL at hindi ikakabit ang sitemap integration, kaya hindi nabibigo ang build at walang placeholder domain.

## Development

```bash
corepack enable
pnpm install --frozen-lockfile
pnpm check
pnpm build
pnpm dev
```

## Cloudflare Workers static assets

Ang `wrangler.jsonc` ay naka-configure sa `./dist` bilang Worker static assets directory.

```bash
pnpm deploy
```

## GA4

Measurement ID: `G-HXM22WWPKP`.

## Larawan at datos

Ang limang monument photos ay lokal na kopya mula sa official NPDC Rizal Monument page. Sinasabi ng NPDC na public domain ang nilalaman nito maliban kung may ibang pahayag. Tingnan ang `SOURCES.md` para sa research trail.
