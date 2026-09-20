/**
 * gabayluneta.com — Cloudflare Worker para sa static assets ng Astro.
 *
 * 1) 301 redirect: HTTP -> HTTPS at www -> apex (iisa lang ang canonical host).
 * 2) Linisin ang path: /index.html -> /
 * 3) Security headers (HSTS, nosniff, referrer policy) sa lahat ng response.
 * 4) Cache: immutable para sa hashed Astro assets, maikli para sa HTML at sw.js.
 * 5) I-serve ang build output mula sa ASSETS binding.
 */

const CANONICAL_HOST = 'gabayluneta.com';

const SECURITY_HEADERS = {
  'Strict-Transport-Security': 'max-age=31536000; includeSubDomains; preload',
  'X-Content-Type-Options': 'nosniff',
  'Referrer-Policy': 'strict-origin-when-cross-origin',
  'X-Frame-Options': 'SAMEORIGIN',
  'Permissions-Policy': 'geolocation=(), camera=(), microphone=()'
};

const HASHED_ASSET = /^\/_astro\//;
const VERSIONED_FILE = /\.(?:js|mjs|css|woff2?|ttf|otf)$/;
const MEDIA_FILE = /\.(?:jpe?g|png|webp|avif|gif|svg|ico)$/;

function cacheControlFor(pathname) {
  if (pathname === '/sw.js' || pathname === '/manifest.webmanifest') return 'no-cache';
  if (HASHED_ASSET.test(pathname)) return 'public, max-age=31536000, immutable';
  if (VERSIONED_FILE.test(pathname)) return 'public, max-age=31536000, immutable';
  if (MEDIA_FILE.test(pathname)) return 'public, max-age=604800, stale-while-revalidate=86400';
  return 'public, max-age=0, must-revalidate';
}

export default {
  async fetch(request, env) {
    const url = new URL(request.url);
    const host = url.hostname.toLowerCase();
    const isCanonicalHost = host === CANONICAL_HOST || host === `www.${CANONICAL_HOST}`;

    /* HTTP -> HTTPS at www -> apex: permanent redirect para hindi mahati ang signal. */
    if (isCanonicalHost && (url.protocol === 'http:' || host !== CANONICAL_HOST)) {
      const target = new URL(request.url);
      target.protocol = 'https:';
      target.hostname = CANONICAL_HOST;
      target.port = '';
      return Response.redirect(target.toString(), 301);
    }

    /* /index.html -> / */
    if (url.pathname.endsWith('/index.html')) {
      const target = new URL(request.url);
      target.pathname = url.pathname.replace(/index\.html$/, '');
      return Response.redirect(target.toString(), 301);
    }

    const assetResponse = await env.ASSETS.fetch(request);

    const headers = new Headers(assetResponse.headers);
    for (const [name, value] of Object.entries(SECURITY_HEADERS)) {
      headers.set(name, value);
    }
    if (!headers.has('Cache-Control')) {
      headers.set('Cache-Control', cacheControlFor(url.pathname));
    }

    return new Response(assetResponse.body, {
      status: assetResponse.status,
      statusText: assetResponse.statusText,
      headers
    });
  }
};
