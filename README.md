# balaji-premkumar.github.io

Personal portfolio. React 19 + TypeScript + Vite 7, Tailwind CSS 4, GSAP ScrollTrigger, React Three Fiber.
Neo-brutalist "pop" design, a rigged 3D avatar that greets with a vanakkam, and a scroll-driven **career road**.
Prerendered to static HTML and deployed to GitHub Pages: <https://balaji-premkumar.github.io>.

## Updating content: edit one file

**All text, links, images, colours and section order live in [`src/content/site.json`](src/content/site.json).**
Content updates never need component changes.

VS Code autocompletes and validates the file through the generated `site.schema.json`. Every `dev` and `build`
re-validates it and stops with a readable error if something is wrong.

| Want to… | Do this in `site.json` |
|---|---|
| Change name, roles, email, phone, socials | `person` (remove `phone` to hide it everywhere) |
| Reorder sections | Reorder `sections` (nav order follows) |
| Hide a section / nav item | `"hidden": true` / remove `navLabel` |
| Add a job | Append to the experience section's `items` (see below) |
| Add a project | Add to `projects.items` (`image`, `label`, `featured`, `links.demo`, `links.source` optional) |
| Add a skill | Add `{ "name": "...", "icon": "..." }` to a group (it also joins the marquee strip) |
| Change colours | `theme` (contrast for text on each colour is picked automatically and tested) |
| Hero stickers around the avatar | `hero.stickers` (max 4) |
| Avatar gestures | `avatar.clips`: `idle`, `greet` (on load and hover), `cheer` (on click); names from the action library |
| Turn 3D off | `effects.webgl: false` (poster image + card timeline instead) |
| SEO / link preview | `meta` (`title`, `description`, `ogImage`, `ogImageAlt`) |
| Printable CV | `cv`: print accent, optional `summary`, `projectLimit` |

### Adding a job

The career road is generated from the experience list, so a new job automatically gets its own milestone, board,
responsibilities card and year chip, and the scroll gets longer.

1. **Append** the job at the end of `items` (oldest first, newest last). The road walks the list in order; the CV
   and the fallback timeline show newest first by themselves.
2. Start `period` with a 4-digit year (`"2026 – Present"`): the milestone post shows it. Close the previous job's
   `"Present"`.
3. `color` is optional (the palette cycles otherwise).

Hand-written wording does not update itself: the section `eyebrow` ("13 years in the making"), `finish`
("13+ years and counting"), the hero sticker, About stats, and the share card (see below).

### Icons, images, models

- **Icons:** `"dev:<file>"` uses [Devicon](https://devicon.dev) (`dev:react-original`), `"si:<slug>"` uses
  [Simple Icons](https://simpleicons.org) with an optional colour (`si:github/ffffff`), or give a `/path` / URL.
  Omit it for a lettered badge. `bun run content:check --remote` pings every icon URL.
- **Images and models:** put them in `src/assets/` and reference them relative to it (`"projects/x.webp"`,
  `"models/me.glb"`). They are content-hashed, and images get 640/1280 px WebP `srcset`s. Use a leading `/` only for
  files that need a stable URL in `public/` (`/og-v2.jpg`, `favicon.svg`).
- **CV:** `/cv/` is an A4 CV built from the same content (prints to 2 pages). "Download CV" links to
  `/cv/?print=1`, which opens the print dialog (*Save as PDF*).

## Commands

```bash
bun install
bun run dev        # dev server (validates content first)
bun test           # unit tests (career road timing, colour contrast)
bun run lint
bun run build      # validate → typecheck → build → SSR prerender → dist/
bun run preview    # serve dist/
bun run models     # rebuild the avatar GLB from the Tripo export (see below)
```

**Deploy:** merge to `main`, then run the **Deploy to GitHub Pages** workflow (Actions tab, or
`gh workflow run deploy.yml --ref main`). It runs `bun test` and `bun run build` first.

## Architecture

```
src/
  app/            App (section registry), entries (client, SSR, CV), global styles
  content/        site.json + zod schema (types, validation, JSON Schema) + typed helpers
  features/       one module per section type; index.ts is the public API
    hero/ about/ marquee/ skills/ projects/ contact/ cv/
    avatar/       AvatarStage (poster + lazy canvas), three/AvatarCanvas
    experience/   Experience (road vs fallback), Timeline, careerPlan (+ test), three/CareerRoad
  shared/
    ui/ layout/   SectionHeader, Icon / Navbar, Footer
    lib/          assets, gsap, icons, webgl
    three/        figure (fit to height), gestures (action library)
scripts/          check-content (validate + schema), prerender (HTML, 404, sitemap, llms.txt)
art/              asset tooling: Blender/GLB repair, share card, image generation
```

- Cross-module imports use `@/…`; files inside a module import each other relatively. React Three Fiber code lives in a
  `three/` folder and is lazy-loaded after the page is idle.
- **New kind of section:** add a variant to `section` in `schema.ts`, a module in `src/features/<type>/`, and
  register it in `src/app/App.tsx`.
- **Fallbacks:** no WebGL, `prefers-reduced-motion`, or `effects.webgl: false` show the poster image and the card
  timeline. The prerendered HTML always contains the full content.

### Career road

Experience is a pinned GSAP scroll story. The figure walks a winding road. At each job a milestone post shows the
year, and a board lying beside it is lifted upright, showing period, role and company, while a side card lists the
responsibilities. The road ends with a thumbs-up and the figure walking off.
`careerPlan.ts` turns scroll progress (0–1) into walk / lift / hold / finish / exit segments. The 3D scene and the
HTML cards both read it, so they stay in sync and the scroll is fully reversible.

### Avatar

The rigged GLB carries no animations: gestures are built in code by `src/shared/three/gestures.ts` from a few key
poses per action (aim a bone, turn it, face a palm, curl fingers; mirrored left/right; feet kept on the ground).
Actions: idle, vanakkam, thumbs-up, wave, nod, shake, shrug, point, cheer, think, walk, lift, present.
On the dev server, `avatar.play('shrug')` and `avatar.seek('vanakkam', 1.2)` in the console preview them.

**Model pipeline** (`bun run models`): Tripo's auto-rigged GLB export (`art/models/me-v2.rigged.glb`) leaves the
joints without transforms, turns the skeleton 90° inside the mesh, and weights most vertices to the hips.
`art/blender/fix_skeleton.ts` rebuilds the joints from the inverse bind matrices; `art/blender/reskin.py` recomputes
skin weights in headless Blender; gltf-transform compresses to `src/assets/models/me.glb` (~1 MB).
Source models and photos (`art/models/`, `art/me/`) are git-ignored.

### Share card

`public/og-v2.jpg` (1200×630, under 300 KB for WhatsApp) shows the avatar mid-vanakkam. Regenerate it with
`art/og/card.mjs` (instructions at the top of the file). Use a **new filename** for every change and update
`meta.ogImage`, because WhatsApp/LinkedIn/Facebook cache preview images by URL.
