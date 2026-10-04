import data from './site.json';
import type { SiteContent } from './schema';

export type { Section, SectionOf, SiteContent } from './schema';

/** Validated at dev/build time by scripts/check-content.ts, so the cast is safe. */
export const site = data as unknown as SiteContent;

export const sections = site.sections.filter((s) => !s.hidden);

export const navItems = sections.flatMap((s) => (s.navLabel ? [{ id: s.id, label: s.navLabel }] : []));

export const fullName = `${site.person.firstName} ${site.person.lastName}`;

/** `tel:` URL for the configured phone number (spaces/brackets stripped). */
export const telHref = (phone: string) => `tel:${phone.replace(/[^\d+]/g, '')}`;
