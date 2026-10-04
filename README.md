# balaji-premkumar.github.io

Personal portfolio — React 19 + TypeScript + Vite, three.js / React Three Fiber scenes driven by GSAP ScrollTrigger, Tailwind CSS 4. Prerendered to static HTML and deployed to GitHub Pages.

## Updating content — edit one file

**All text, links, images, colours and section order live in [`src/content/site.json`](src/content/site.json).** Components never need to change for content updates.

VS Code autocompletes and validates the file (it references the generated `site.schema.json`). Every `dev` and `build` re-validates it and stops with a readable error if something is wrong.

| Want to… | Do this in `site.json` |
|---|---|
| Change name, roles, email, phone, socials | `person` (remove `phone` to hide it everywhere) |
| Reorder sections | Reorder the `sections` array — nav order follows |
| Hide a section | Add `"hidden": true` to it |
| Show/hide a nav item | Set or remove `navLabel` |
| Add a job | Add an item to the `experience` section's `items` (optional `art` image + `color` for the 3D timeline) |
| Add a project | Add an item to `projects.items` (`image`, `label`, `links.demo`, `links.source` are optional) |
| Add a skill | Add `{ "name": "...", "icon": "..." }` to a group (it also joins the 3D skill galaxy) |
| Change colours | `theme` — the site and the 3D scenes both use it |
| Turn 3D off | `effects.webgl: false` |
| Update SEO / link preview | `meta` (title, description, `ogImage`) |
| Tune the printable CV | `cv` — print accent colour, optional `summary`, `projectLimit` |

**Icons** — `"dev:<file>"` uses [Devicon](https://devicon.dev) (e.g. `dev:react-original`), `"si:<slug>"` uses [Simple Icons](https://simpleicons.org) with optional colour (`si:github/ffffff`), or give a `/path` / URL. Omit it for a lettered badge.

**Images** go in `public/` and are referenced from the site root (`/art/x.webp`). Prefer WebP around 1280px wide.

Check every icon URL is reachable: `bun run content:check --remote`.

**CV** — `/cv/` is an A4 CV built from the same content (prints to 2 pages). "Download CV" links to `/cv/?print=1`, which opens the browser's print dialog → *Save as PDF*.

## Commands

```bash
bun install
bun run dev            # dev server (validates content first)
bun run build          # validate → typecheck → build → prerender to dist/
bun run preview        # serve dist/
bun run lint
```

Deploy: run the **Deploy to GitHub Pages** workflow (Actions tab).

## How it is put together

```
src/
  content/
    site.json          ← all content (edit this)
    schema.ts          ← zod schema: validation + TS types + JSON Schema
    index.ts           ← typed access for components
  components/
    sections/          ← one component per section `type` (Hero, About, Experience, Skills, Projects, Contact)
    layout/            ← Navbar, Footer, Backdrop (lazy-loads the 3D stage)
    ui/                ← SectionHeader, Icon
  cv/                  ← printable CV page (CvPage, print CSS, entry) → served at /cv/
  three/
    Stage.tsx          ← single fixed <Canvas>, quality tiers, camera rig
    scroll.ts          ← per-frame scroll progress for each [data-scene] section
    scenes/            ← Core (hero/about/contact), Particles, Timeline, SkillGalaxy
  lib/                 ← gsap setup, icon resolver
scripts/
  check-content.ts     ← validates site.json, writes site.schema.json
  prerender.ts         ← renders HTML at build time; writes 404.html, sitemap.xml, llms.txt
vite.config.ts         ← injects SEO meta, JSON-LD and theme colours from site.json
```

- **Fast first paint** — HTML is prerendered; the three.js chunk (~250 KB gz) loads only after the page is idle.
- **Graceful fallback** — no WebGL, `prefers-reduced-motion`, or `effects.webgl: false` → static gradient backdrop, all content intact.
- **Scroll choreography** — each section has `data-scene="<type>"`; 3D scenes read how visible their section is and blend between poses, so reordering or hiding sections in `site.json` just works.
- **Adding a new kind of section** — add a variant to `section` in `schema.ts`, a component in `components/sections/`, and register it in `App.tsx`.

## Art

`art/gen.sh` regenerates the backdrop and project art with Nano Banana via the Antigravity CLI (`agy`). Raw outputs stay in `art/` (git-ignored); optimised WebP copies live in `public/art/`.
