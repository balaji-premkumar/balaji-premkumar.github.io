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
 *  - "art/x.svg" → bundled from src/assets (hashed URL); "/x.svg" → public/; or "https://…"
 * Omit to render a lettered badge.
 */
const icon = z.string().describe('dev:<devicon-file> | si:<simple-icon>[/hex] | assets/relative/path | /public/path | https://url');

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
  stickers: z.array(z.string()).max(4).optional().describe('Short tilted labels around the avatar, e.g. "13+ yrs 🚀"'),
});

const marqueeSection = z.object({
  type: z.literal('marquee'),
  id: slug,
  hidden: z.boolean().optional(),
  items: z.array(z.string()).min(1).optional().describe('Words scrolling across the strip; defaults to every skill name'),
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
  finish: z.string().optional().describe('Shown when the career road reaches today, e.g. "13+ years and counting"'),
  pointsLabel: z.string().optional().describe('Heading of the side card on the career road (the board shows role/company/period)'),
  items: z.array(z.object({
    role: z.string(),
    company: z.string(),
    period: z.string(),
    location: z.string().optional(),
    points: z.array(z.string()).min(1),
    tech: z.array(z.string()).optional(),
    art: z.string().optional().describe('Backdrop image shown behind this career stop (path under src/assets, e.g. "art/x.webp")'),
    color: hex.optional().describe('Card colour of this stop (text turns light/dark to match)'),
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
    image: z.string().optional().describe('Card image (path under src/assets, e.g. "projects/x.webp")'),
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
  marqueeSection,
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
    bg: hex.describe('Page background'),
    card: hex.describe('Plain card background'),
    ink: hex.describe('Text, borders and hard shadows'),
    accent: hex.describe('Primary brand colour (name highlight, main buttons)'),
    blue: hex,
    orange: hex,
    lime: hex,
    yellow: hex,
    sky: hex,
    mint: hex,
  }).describe('Every key becomes a CSS variable (--bg, --accent, …); cards cycle through the pop colours'),
  effects: z.object({
    webgl: z.boolean().describe('false = no 3D avatar, the poster image is shown instead'),
  }),
  avatar: z
    .object({
      enabled: z.boolean(),
      model: z.string().describe('GLB under src/assets, e.g. "models/me.glb" (built by `bun run models`)'),
      poster: z.string().optional().describe('Static image shown when 3D is off (no WebGL / reduced motion)'),
      alt: z.string().describe('Accessible description of the figure'),
      followPointer: z.number().min(0).max(60).describe('Max degrees the figure turns toward the cursor'),
      handScale: z.number().positive().optional().describe('Enlarge the hands (both *Hand bones) so gestures read at small sizes; 1 = as modelled'),
      clips: z
        .object({
          idle: z.string(),
          greet: z.string().optional().describe('Played when the hero comes into view'),
          cheer: z.string().optional().describe('Played when the figure is clicked'),
        })
        .optional()
        .describe('Animation clip names inside the GLB (Mixamo actions)'),
    })
    .optional(),
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
    accent: hex.describe('Print-safe accent for dates and the job title on white paper (needs 4.5:1 on white)'),
    summary: z.string().optional().describe('Defaults to the first About paragraph'),
    projectLimit: z.number().int().positive().optional().describe('Max projects listed (default: all)'),
  }).describe('Printable CV page at /cv/ — built from the same content as the site'),
});

export type SiteContent = z.infer<typeof siteSchema>;
export type Section = z.infer<typeof section>;
export type SectionOf<T extends Section['type']> = Extract<Section, { type: T }>;
