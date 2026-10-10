import data from './site.json';
import type { SiteContent } from './schema';

export type { Section, SectionOf, SiteContent } from './schema';

/** Validated at dev/build time by scripts/check-content.ts, so the cast is safe. */
export const site = data as unknown as SiteContent;

export const sections = site.sections.filter((s) => !s.hidden);

export const navItems = sections.flatMap((s) => ('navLabel' in s && s.navLabel ? [{ id: s.id, label: s.navLabel }] : []));

export const fullName = `${site.person.firstName} ${site.person.lastName}`;

/** `tel:` URL for the configured phone number (spaces/brackets stripped). */
export const telHref = (phone: string) => `tel:${phone.replace(/[^\d+]/g, '')}`;

/** Readable text colour (ink or white) on a hex background. */
export const textOn = (hex: string) => {
  const [r, g, b] = [1, 3, 5].map((i) => parseInt(hex.slice(i, i + 2), 16) / 255);
  return 0.2126 * r! + 0.7152 * g! + 0.0722 * b! > 0.55 ? site.theme.ink : '#ffffff';
};

const pops = ['yellow', 'accent', 'lime', 'blue', 'orange', 'sky', 'mint'] as const;

/** Background + text colour for the i-th coloured card (cycles through the theme's pop colours), or a fixed hex. */
export const pop = (i: number, hex?: string) => {
  const background = hex ?? site.theme[pops[i % pops.length]!];
  return { background, color: textOn(background) };
};
