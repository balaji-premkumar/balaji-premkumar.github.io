/**
 * Validates src/content/site.json and regenerates site.schema.json.
 *
 *   bun run content:check            # schema + local files
 *   bun run content:check --remote   # also pings every icon / external image URL
 *
 * Runs automatically before `dev` and `build`; a bad edit fails fast with a readable message.
 */
import { existsSync, writeFileSync } from 'node:fs';
import { join } from 'node:path';
import { z } from 'zod';
import { siteSchema, type SiteContent } from '../src/content/schema';
import { iconUrl } from '../src/lib/icons';
import raw from '../src/content/site.json';

const root = join(import.meta.dir, '..');
const errors: string[] = [];
const warnings: string[] = [];

writeFileSync(
  join(root, 'src/content/site.schema.json'),
  JSON.stringify(z.toJSONSchema(siteSchema, { io: 'input' }), null, 2) + '\n',
);

const parsed = siteSchema.safeParse(raw);
if (!parsed.success) {
  console.error('✖ site.json is invalid:\n' + z.prettifyError(parsed.error));
  process.exit(1);
}
const site: SiteContent = parsed.data;

// Section ids must be unique — they are URL anchors.
const ids = site.sections.map((s) => s.id);
for (const id of ids.filter((id, i) => ids.indexOf(id) !== i)) errors.push(`Duplicate section id "${id}"`);

// Every "#anchor" link must point at a visible section.
const visible = new Set(site.sections.filter((s) => !s.hidden).map((s) => s.id));
const links = [site.nav.cta, ...site.sections.flatMap((s) =>
  s.type === 'hero' ? [s.primaryCta, s.secondaryCta] : s.type === 'contact' ? [s.cta] : []),
];
for (const l of links) {
  if (l?.href.startsWith('#') && !visible.has(l.href.slice(1))) errors.push(`Link "${l.label}" → ${l.href} has no visible section`);
}

// Collect every asset reference.
const assets: string[] = [site.meta.ogImage, ...site.person.socials.map((s) => s.icon)];
if (site.avatar) assets.push(site.avatar.model, ...(site.avatar.poster ? [site.avatar.poster] : []));
for (const s of site.sections) {
  // Only file links (e.g. a PDF) are assets; page links like /cv/ are not.
  if (s.type === 'hero' && s.secondaryCta && /\.\w+$/.test(s.secondaryCta.href)) assets.push(s.secondaryCta.href);
  if (s.type === 'experience') s.items.forEach((i) => i.art && assets.push(i.art));
  if (s.type === 'skills') s.groups.forEach((g) => g.items.forEach((i) => i.icon && assets.push(i.icon)));
  if (s.type === 'projects') s.items.forEach((i) => i.image && assets.push(i.image));
}

const remote: string[] = [];
for (const ref of assets) {
  const url = iconUrl(ref);
  if (url.startsWith('http')) remote.push(url);
  else if (url.startsWith('/')) {
    // "/x" → public/x (served as-is). Missing → warning: the UI degrades gracefully, but you should know.
    if (!existsSync(join(root, 'public', url))) warnings.push(`Missing file public${url}`);
  } else if (!existsSync(join(root, 'src/assets', url))) {
    // "x/y.webp" → bundled from src/assets; a missing one would break the build, so it's an error.
    errors.push(`Missing bundled asset src/assets/${url}`);
  }
}

if (process.argv.includes('--remote')) {
  const results = await Promise.all([...new Set(remote)].map(async (url) => {
    const res = await fetch(url, { method: 'HEAD' }).catch(() => null);
    return res?.ok ? null : `Unreachable (${res?.status ?? 'network'}) ${url}`;
  }));
  errors.push(...results.filter((r): r is string => r !== null));
}

warnings.forEach((w) => console.warn('⚠ ' + w));
if (errors.length) {
  errors.forEach((e) => console.error('✖ ' + e));
  process.exit(1);
}
console.log(`✔ site.json valid — ${site.sections.length} sections, ${assets.length} asset refs`);
