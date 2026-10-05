import { resolve } from 'node:path';
import { defineConfig, type HtmlTagDescriptor, type Plugin } from 'vite';
import react from '@vitejs/plugin-react';
import tailwindcss from '@tailwindcss/vite';
import { imagetools } from 'vite-imagetools';
import site from './src/content/site.json';

/** Injects <title>, SEO/social meta, JSON-LD and theme colours from site.json into each HTML page. */
function siteHead(): Plugin {
  const { meta, person, theme, cv } = site;
  const abs = (path: string) => new URL(path, meta.url).href;
  const name = `${person.firstName} ${person.lastName}`;
  const metaTag = (attrs: Record<string, string>): HtmlTagDescriptor => ({ tag: 'meta', attrs, injectTo: 'head' });

  return {
    name: 'site-head',
    transformIndexHtml: {
      order: 'pre',
      handler: (html, ctx) => {
        const colours: HtmlTagDescriptor = {
          tag: 'style',
          children: `:root{${Object.entries(theme).map(([k, v]) => `--${k}:${v}`).join(';')};--cv-accent:${cv.accent}}`,
          injectTo: 'head',
        };
        if (ctx.path.startsWith('/cv/')) {
          return {
            html: html.replace('<title></title>', `<title>${name} — CV</title>`),
            tags: [
              metaTag({ name: 'description', content: `Curriculum vitae of ${name}, ${person.jobTitle}.` }),
              { tag: 'link', attrs: { rel: 'canonical', href: abs('/cv/') }, injectTo: 'head' },
              colours,
            ],
          };
        }
        return {
          html: html.replace('<title></title>', `<title>${meta.title}</title>`),
          tags: [
            metaTag({ name: 'description', content: meta.description }),
            metaTag({ name: 'keywords', content: (meta.keywords ?? []).join(', ') }),
            metaTag({ name: 'author', content: name }),
            metaTag({ name: 'theme-color', content: theme.bg }),
            { tag: 'link', attrs: { rel: 'canonical', href: meta.url }, injectTo: 'head' },
            metaTag({ property: 'og:type', content: 'website' }),
            metaTag({ property: 'og:url', content: meta.url }),
            metaTag({ property: 'og:title', content: meta.title }),
            metaTag({ property: 'og:description', content: meta.description }),
            metaTag({ property: 'og:image', content: abs(meta.ogImage) }),
            metaTag({ name: 'twitter:card', content: 'summary_large_image' }),
            metaTag({ name: 'twitter:title', content: meta.title }),
            metaTag({ name: 'twitter:description', content: meta.description }),
            metaTag({ name: 'twitter:image', content: abs(meta.ogImage) }),
            {
              tag: 'script',
              attrs: { type: 'application/ld+json' },
              children: JSON.stringify({
                '@context': 'https://schema.org',
                '@type': 'Person',
                name,
                jobTitle: person.jobTitle,
                email: `mailto:${person.email}`,
              ...(person.phone && { telephone: person.phone }),
                url: meta.url,
                sameAs: person.socials.map((s) => s.href).filter((h) => h.startsWith('http')),
              }),
              injectTo: 'head',
            },
            colours,
          ],
        };
      },
    },
  };
}

export default defineConfig({
  plugins: [react(), tailwindcss(), imagetools(), siteHead()],
  // three.js is ~250 KB gz and lives in its own lazy chunk (loaded after idle), so the default warning is noise.
  build: {
    chunkSizeWarningLimit: 1000,
    rollupOptions: { input: { main: resolve(__dirname, 'index.html'), cv: resolve(__dirname, 'cv/index.html') } },
  },
});
