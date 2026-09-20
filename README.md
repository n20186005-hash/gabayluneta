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

Ang production domain ay `https://gabayluneta.com` at naka-set na sa `site` constant ng `astro.config.ts`:

```ts
const site: string | undefined = 'https://gabayluneta.com';
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

## Rating at review (Google Maps)

- Rating na `4.6 / 5` at `3,201` review ay **naka-sync mula sa mga review ng user sa Google Maps**, oras ng pag-sync: **Setyembre 2026**.
- Ang pinagsama-samang rating at bilang ng review ay **ipinapakita lamang sa pahina**; hindi ito isinama sa JSON-LD (walang `aggregateRating` / `review` node) upang maiwasan ang maling structured-data claim.
- Bawat review block, stats card, seksyong `#sanggunian`, at footer ay may nakalagay na pinagmulan, oras ng pag-sync, at link papuntang Google Maps. Ang mga buong teksto ng review ay hindi kinokopya sa site.

## PWA

- `public/manifest.webmanifest` + `public/icons/icon.svg` at `public/icons/maskable.svg`.
- `public/sw.js` — service worker na nagpe-precache ng shell at nagfa-fallback sa cached home page kapag offline.
- Ang manifest, apple-mobile-web-app meta, at registration script ay nasa `<head>` ng `src/pages/index.astro`.

## Panahon (weather module)

- Ang kasalukuyang lagay ng panahon at 7-araw na forecast ay **kinukuha sa server** (build / render time) mula sa Open-Meteo at naka-cache ng **15 minuto** sa pamamagitan ng module-level cache (`loadWeather()` sa `src/pages/index.astro`).
- Ang naka-render na HTML ay naglalaman ng server snapshot; pagbukas ng pahina, isang maliit na inline script ang kumukuha ng mas bagong datos at ina-update ang mga numero (temp, feels-like, halumigmig, hangin, ulan, tsansa ng ulan, payo kung kailangan ng payong).
- Kapag hindi nakuha ang datos, nagpapakita ang pahina ng fallback na paalala at nananatiling kapaki-pakinabang ang seksyong estratehiya bawat quarter. Sa page, ang nakalagay ay **pinagmulan at oras ng pag-update** lamang; walang teknikal na detalye ng API, at ang opisyal na abiso sa bagyo ay itinuturo sa PAGASA.
- Pinagmulan ng klima para sa estratehiya bawat quarter: mga climate normal ng PAGASA para sa Maynila.

## HTTPS, canonical host at security headers

Isang Worker (`worker/index.js`) ang namamahala sa lahat ng request (`assets.run_worker_first = true`):

- **301 redirect**: `http://gabayluneta.com/*` → `https://gabayluneta.com/*`, at `www.gabayluneta.com/*` → `gabayluneta.com/*` (iisang canonical host).
- **301 redirect**: `/index.html` → `/`.
- **Headers**: HSTS (`max-age=31536000; includeSubDomains; preload`), `X-Content-Type-Options: nosniff`, `Referrer-Policy`, `X-Frame-Options`, `Permissions-Policy`.
- **Cache**: `/_astro/*` at iba pang hashed file ay `immutable` (1 taon); imahe 7 araw; `/sw.js` at `/manifest.webmanifest` ay `no-cache`; HTML ay `must-revalidate`.

Dagdag na hakbang sa Cloudflare dashboard (belt-and-braces): buksan ang **SSL/TLS → Edge Certificates → Always Use HTTPS** at i-verify sa Search Console ang property na `https://gabayluneta.com` (hindi ang `http://`).

## SEO notes

- Title / meta description / OG / Twitter ay nakatutok sa intent ng bisita: libreng pasok, oras ng pagbubukas, ruta mula LRT-1 at NAIA, mapa, panahon, kasaysayan + CTA.
- JSON-LD: `TouristAttraction` (may `geo`, `openingHoursSpecification`, `amenityFeature`, `touristType`, `containedInPlace` = Rizal Park, 4 na `photo` na may credit sa NPDC), `BreadcrumbList`, `Organization` + `WebSite`, at `FAQPage` (11 tanong).
- `hreflang="fil-PH"` at `hreflang="x-default"` ay naka-set sa canonical URL. Kung magdaragdag ng English na bersyon, gumawa ng hiwalay na URL (hal. `/en/`) at kumpletuhin ang hreflang triplet — huwag lang magdagdag ng `hreflang="en"` na tumuturo sa parehong Filipino na pahina.
- Rating at bilang ng review ay ipinapakita lamang sa pahina; hindi isinasama sa JSON-LD.

## Pag-deploy (manual sa Cloudflare Workers)

Static output ang site: `pnpm build` → `dist/`. Ang `wrangler.jsonc` ay may `main = worker/index.js` at `assets.directory = ./dist` (kasama ang ASSETS binding), kaya iisang deploy ang nag-a-upload ng Worker at ng static files.

```bash
pnpm build
npx wrangler deploy          # inirerekomenda: kasama ang Worker (301 HTTPS redirect + headers)
```

Kung i-uupload ang `dist/` nang manu-mano sa dashboard (walang Worker), gumana pa rin ang site dahil naka-enable ang static assets, ngunit wala ang 301 redirect at security headers ng Worker — siguraduhing naka-on ang **Always Use HTTPS** sa Cloudflare.

Ang `dist/`, `node_modules/`, `.astro/`, `.wrangler/`, at iba pang pansamantalang file ay nakalista sa `.gitignore`, kaya tanging source code at `public/` assets ang nai-upload.

## Larawan at datos

Ang limang monument photos ay lokal na kopya mula sa official NPDC Rizal Monument page. Sinasabi ng NPDC na public domain ang nilalaman nito maliban kung may ibang pahayag. Tingnan ang `SOURCES.md` para sa research trail.
