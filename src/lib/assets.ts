/**
 * Bundled assets referenced from site.json.
 *
 * Path conventions in site.json:
 *   "art/era-2012-php.webp"  → src/assets/art/era-2012-php.webp, bundled: content-hashed URL (+ responsive srcset)
 *   "/og.jpg"                → public/og.jpg, served as-is (stable URL, e.g. for crawlers)
 *   "https://…"              → external
 */

// Every file under src/assets → its final (hashed) URL.
const urls = import.meta.glob<string>('../assets/**/*', { eager: true, query: '?url', import: 'default' });

// Raster images → responsive WebP srcset generated at build time (vite-imagetools).
const srcsets = import.meta.glob<string>('../assets/**/*.{webp,jpg,jpeg,png}', {
  eager: true,
  query: { w: '640;1280', format: 'webp', as: 'srcset' },
  import: 'default',
});

const isPassthrough = (path: string) => /^(https?:|data:|\/)/.test(path);

export function asset(path: string): string {
  if (isPassthrough(path)) return path;
  const url = urls[`../assets/${path}`];
  if (!url) throw new Error(`Unknown asset "${path}" — expected a file at src/assets/${path}`);
  return url;
}

/** `srcset` for a bundled raster image, or undefined for public/external paths. */
export function srcSet(path: string): string | undefined {
  return isPassthrough(path) ? undefined : srcsets[`../assets/${path}`];
}
