import { resolve } from 'node:path';
import { defineConfig, type HtmlTagDescriptor, type Plugin } from 'vite';
import react from '@vitejs/plugin-react';
import tailwindcss from '@tailwindcss/vite';
import { imagetools } from 'vite-imagetools';
import site from './src/content/site.json';

/** Injects <title>, SEO/social meta, JSON-LD, theme colours and analytics from site.json into each HTML page. */
function siteHead(): Plugin {
  const { meta, person, theme, cv } = site;
  const { googleId, gtmId } = (site as { analytics?: { googleId?: string; gtmId?: string } }).analytics ?? {};
  const verification = (meta as { googleSiteVerification?: string }).googleSiteVerification;
  // Raw JSON import: section types aren't narrowed here, so look sections up by type and cast.
  const section = <T,>(type: string) => site.sections.find((s) => s.type === type) as T | undefined;
  const skills = section<{ groups: { items: { name: string }[] }[] }>('skills')?.groups.flatMap((g) => g.items.map((i) => i.name)) ?? [];
  const current = section<{ items: { company: string; period: string }[] }>('experience')?.items.at(-1);
  const abs = (path: string) => new URL(path, meta.url).href;
  const name = `${person.firstName} ${person.lastName}`;
  const metaTag = (attrs: Record<string, string>): HtmlTagDescriptor => ({ tag: 'meta', attrs, injectTo: 'head' });

  return {
    name: 'site-head',
    transformIndexHtml: {
      order: 'pre',
      handler: (html, ctx) => {
        // Tracking, production builds only so local testing never shows up in the stats. With a GTM container,
        // GTM is the only script (GA4 and other tags are managed in the GTM dashboard); otherwise GA4 directly.
        // window.__tags tells src/shared/lib/analytics.ts how to send events.
        const analytics: HtmlTagDescriptor[] = ctx.server
          ? []
          : gtmId
            ? [
                {
                  tag: 'script',
                  children: `window.__tags='gtm';(function(w,d,s,l,i){w[l]=w[l]||[];w[l].push({'gtm.start':new Date().getTime(),event:'gtm.js'});var f=d.getElementsByTagName(s)[0],j=d.createElement(s);j.async=true;j.src='https://www.googletagmanager.com/gtm.js?id='+i;f.parentNode.insertBefore(j,f)})(window,document,'script','dataLayer','${gtmId}');`,
                  injectTo: 'head-prepend',
                },
                {
                  tag: 'noscript',
                  children: `<iframe src="https://www.googletagmanager.com/ns.html?id=${gtmId}" height="0" width="0" style="display:none;visibility:hidden"></iframe>`,
                  injectTo: 'body-prepend',
                },
              ]
            : googleId
              ? [
                  { tag: 'script', attrs: { async: true, src: `https://www.googletagmanager.com/gtag/js?id=${googleId}` }, injectTo: 'head' },
                  {
                    tag: 'script',
                    children: `window.__tags='gtag';window.dataLayer=window.dataLayer||[];function gtag(){dataLayer.push(arguments)}gtag('js',new Date());gtag('config','${googleId}');`,
                    injectTo: 'head',
                  },
                ]
              : [];
        const verify = verification ? [metaTag({ name: 'google-site-verification', content: verification })] : [];
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
              ...verify,
              ...analytics,
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
            metaTag({ property: 'og:image:type', content: 'image/jpeg' }),
            metaTag({ property: 'og:image:width', content: '1200' }),
            metaTag({ property: 'og:image:height', content: '630' }),
            ...(meta.ogImageAlt ? [metaTag({ property: 'og:image:alt', content: meta.ogImageAlt }), metaTag({ name: 'twitter:image:alt', content: meta.ogImageAlt })] : []),
            metaTag({ name: 'twitter:card', content: 'summary_large_image' }),
            metaTag({ name: 'twitter:title', content: meta.title }),
            metaTag({ name: 'twitter:description', content: meta.description }),
            metaTag({ name: 'twitter:image', content: abs(meta.ogImage) }),
            {
              tag: 'script',
              attrs: { type: 'application/ld+json' },
              // ProfilePage (Google's markup for personal profile pages) around the Person.
              children: JSON.stringify({
                '@context': 'https://schema.org',
                '@type': 'ProfilePage',
                url: meta.url,
                dateModified: new Date().toISOString().slice(0, 10),
                mainEntity: {
                  '@type': 'Person',
                  name,
                  jobTitle: person.jobTitle,
                  description: meta.description,
                  image: abs(meta.ogImage),
                  email: `mailto:${person.email}`,
                  ...(person.phone && { telephone: person.phone }),
                  ...(person.location && { address: { '@type': 'PostalAddress', addressCountry: person.location } }),
                  ...(current && /present/i.test(current.period) && { worksFor: { '@type': 'Organization', name: current.company } }),
                  knowsAbout: skills,
                  url: meta.url,
                  sameAs: person.socials.map((s) => s.href).filter((h) => h.startsWith('http')),
                },
              }),
              injectTo: 'head',
            },
            colours,
            ...verify,
            ...analytics,
          ],
        };
      },
    },
  };
}

export default defineConfig({
  plugins: [react(), tailwindcss(), imagetools(), siteHead()],
  resolve: { alias: { '@': resolve(__dirname, 'src') } },
  // three.js is ~250 KB gz and lives in its own lazy chunk (loaded after idle), so the default warning is noise.
  build: {
    chunkSizeWarningLimit: 1000,
    rollupOptions: { input: { main: resolve(__dirname, 'index.html'), cv: resolve(__dirname, 'cv/index.html') } },
  },
});
