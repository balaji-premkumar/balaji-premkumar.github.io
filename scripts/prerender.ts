/**
 * Post-build: renders the app to static HTML so content paints before any JS runs
 * (fast first paint, crawlable, works without JS). Also writes 404.html and sitemap.xml.
 */
import { readFileSync, rmSync, writeFileSync } from 'node:fs';
import { join } from 'node:path';
import site from '../src/content/site.json';

const root = join(import.meta.dir, '..');
const dist = join(root, 'dist');
const ssrEntry = join(root, 'dist-ssr/entry-server.js');

const { pages } = (await import(ssrEntry)) as { pages: Record<string, () => string> };
let html = '';
for (const [file, render] of Object.entries(pages)) {
  const template = readFileSync(join(dist, file), 'utf8');
  const out = template.replace('<!--app-html-->', render());
  if (out === template) throw new Error(`<!--app-html--> placeholder not found in dist/${file}`);
  writeFileSync(join(dist, file), out);
  if (file === 'index.html') html = out;
}
writeFileSync(join(dist, '404.html'), html);
writeFileSync(
  join(dist, 'sitemap.xml'),
  `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
  <url><loc>${site.meta.url}</loc><lastmod>${new Date().toISOString().slice(0, 10)}</lastmod></url>
  <url><loc>${new URL('/cv/', site.meta.url).href}</loc><lastmod>${new Date().toISOString().slice(0, 10)}</lastmod></url>
</urlset>
`,
);
writeFileSync(join(dist, 'llms.txt'), llmsTxt());
rmSync(join(root, 'dist-ssr'), { recursive: true, force: true });

/** Plain-text profile for AI agents / crawlers (https://llmstxt.org). */
function llmsTxt() {
  const { person, meta } = site;
  const lines = [`# ${person.firstName} ${person.lastName}`, '', `> ${meta.description}`, ''];
  for (const s of site.sections) {
    if ('hidden' in s && s.hidden) continue;
    if (s.type === 'experience') {
      lines.push('## Experience', ...s.items.map((i) => `- ${i.role}, ${i.company} (${i.period})`), '');
    }
    if (s.type === 'projects') {
      const link = (p: (typeof s.items)[number]) => p.links?.demo ?? p.links?.source;
      lines.push('## Projects', ...s.items.map((p) => `- ${link(p) ? `[${p.name}](${link(p)})` : p.name}: ${p.description}`), '');
    }
    if (s.type === 'skills') {
      lines.push('## Skills', ...s.groups.map((g) => `- ${g.label}: ${g.items.map((i) => i.name).join(', ')}`), '');
    }
  }
  lines.push(
    '## Links',
    `- [Portfolio](${meta.url})`,
    `- [CV](${new URL('/cv/', meta.url).href})`,
    ...person.socials.map((s) => `- [${s.label}](${s.href})`),
    '',
  );
  return lines.join('\n');
}

console.log(`✔ prerendered ${(html.length / 1024).toFixed(1)} KB → dist/index.html, cv/index.html, 404.html, sitemap.xml, llms.txt`);
