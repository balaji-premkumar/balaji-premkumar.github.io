/**
 * Single source of truth for the shape of `site.json`.
 *
 * - `bun run content:check` validates site.json against this schema and
 *   regenerates `site.schema.json` (editor autocomplete + inline errors).
 * - The app imports only the inferred *types*, so zod never ships to the browser.
 *
 * To change what the site shows, edit `site.json` — not the components.
 */
import { z } from 'zod';

const hex = z.string().regex(/^#[0-9a-fA-F]{6}$/, 'Expected a 6-digit hex colour, e.g. #c8f060');
const slug = z.string().regex(/^[a-z][a-z0-9-]*$/, 'Lowercase letters, digits and dashes only');

/**
 * Icon reference:
 *  - "dev:<file>"  → Devicon, e.g. "dev:react-original"
 *  - "si:<slug>"   → Simple Icons, optional colour: "si:github/ffffff"
 *  - "/path.svg" or "https://…" → any image
 * Omit to render a lettered badge.
 */
const icon = z.string().describe('dev:<devicon-file> | si:<simple-icon>[/hex] | /local/path | https://url');

const link = z.object({
  label: z.string(),
  href: z.string(),
});

const sectionBase = {
  id: slug.describe('Anchor id, used in the URL hash (#id)'),
  navLabel: z.string().optional().describe('Shown in the navbar when set'),
  hidden: z.boolean().optional().describe('Set true to remove the section without deleting its content'),
  eyebrow: z.string().optional(),
  title: z.string(),
};

const heroSection = z.object({
  type: z.literal('hero'),
  ...sectionBase,
  title: z.string().optional(),
  primaryCta: link,
  secondaryCta: link.optional(),
});

const aboutSection = z.object({
  type: z.literal('about'),
  ...sectionBase,
  quote: z.string(),
  paragraphs: z.array(z.string()).min(1),
  stats: z.array(z.object({
    value: z.number().int().nonnegative(),
    suffix: z.string().optional(),
    label: z.string(),
  })),
});

const experienceSection = z.object({
  type: z.literal('experience'),
  ...sectionBase,
  items: z.array(z.object({
    role: z.string(),
    company: z.string(),
    period: z.string(),
    location: z.string().optional(),
    points: z.array(z.string()).min(1),
    tech: z.array(z.string()).optional(),
    art: z.string().optional().describe('Backdrop image shown behind this career stop'),
    color: hex.optional().describe('Glow colour of this stop in the 3D timeline'),
  })).min(1),
});

const skillsSection = z.object({
  type: z.literal('skills'),
  ...sectionBase,
  groups: z.array(z.object({
    label: z.string(),
    items: z.array(z.object({
      name: z.string(),
      icon: icon.optional(),
    })).min(1),
  })).min(1),
});

const projectsSection = z.object({
  type: z.literal('projects'),
  ...sectionBase,
  moreLink: link.optional(),
  items: z.array(z.object({
    name: z.string(),
    description: z.string(),
    tech: z.array(z.string()),
    image: z.string().optional(),
    featured: z.boolean().optional(),
    label: z.string().optional().describe('Small tag, e.g. "Open Source" or "Client · Private"'),
    links: z.object({
      demo: z.url().optional(),
      source: z.url().optional(),
    }).optional(),
  })).min(1),
});

const contactSection = z.object({
  type: z.literal('contact'),
  ...sectionBase,
  text: z.string(),
  cta: link.optional(),
});

export const section = z.discriminatedUnion('type', [
  heroSection,
  aboutSection,
  experienceSection,
  skillsSection,
  projectsSection,
  contactSection,
]);

export const siteSchema = z.object({
  $schema: z.string().optional(),
  meta: z.object({
    title: z.string(),
    description: z.string(),
    url: z.url(),
    ogImage: z.string().describe('1200×630 image used for link previews'),
    keywords: z.array(z.string()).optional(),
  }),
  theme: z.object({
    bg: hex,
    surface: hex,
    card: hex,
    ink: hex,
    accent: hex,
    accent2: hex,
  }),
  effects: z.object({
    webgl: z.boolean().describe('false = no 3D, CSS-only visuals'),
    particles: z.object({ desktop: z.number().int().min(0), mobile: z.number().int().min(0) }),
  }),
  person: z.object({
    firstName: z.string(),
    lastName: z.string(),
    jobTitle: z.string(),
    availability: z.string().optional(),
    location: z.string().optional(),
    email: z.email(),
    phone: z
      .string()
      .regex(/^\+?[0-9][0-9 ()-]{6,19}$/, 'Digits, spaces, dashes or brackets, optional leading +, e.g. "+91 81227 08776"')
      .optional()
      .describe('Shown in the Contact section and on the CV; remove to hide everywhere'),
    roles: z.array(z.string()).min(1).describe('Rotating lines under the name in the hero'),
    socials: z.array(link.extend({ icon })),
  }),
  nav: z.object({ cta: link.optional() }),
  sections: z.array(section).min(1).describe('Rendered top to bottom in this order'),
  footer: z.object({ text: z.string() }),
  cv: z.object({
    accent: hex.describe('Print-safe accent for headings/rules on white paper (the brand lime is too light to print)'),
    summary: z.string().optional().describe('Defaults to the first About paragraph'),
    projectLimit: z.number().int().positive().optional().describe('Max projects listed (default: all)'),
  }).describe('Printable CV page at /cv/ — built from the same content as the site'),
});

export type SiteContent = z.infer<typeof siteSchema>;
export type Section = z.infer<typeof section>;
export type SectionOf<T extends Section['type']> = Extract<Section, { type: T }>;
