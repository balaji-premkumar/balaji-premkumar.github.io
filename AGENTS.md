# AGENTS.md

Guide for coding agents working in this repo. Human-facing overview: [README.md](README.md).

## Non-negotiables

1. **All content comes from `src/content/site.json`.** Text, links, images, colours, labels and section order are
   never hard-coded in components. A new piece of copy means a new (optional) field in `src/content/schema.ts` plus
   the value in `site.json`. Run `bun run content:check` afterwards (it regenerates `site.schema.json`).
2. **Every section must work without 3D.** No WebGL, reduced motion or `effects.webgl: false` fall back to static
   content (avatar poster, `experience/Timeline`). The SSR/prerendered HTML must contain all content.
3. **Accessibility stays at Lighthouse 100.** Text on coloured backgrounds uses `textOn()` / `pop()` from
   `@/content` (WCAG contrast based); never hard-code `text-white` on pink/orange. 3D canvases are `aria-hidden`
   with a text equivalent in the DOM (e.g. `sr-only` role/company on the career cards).
4. **Do not commit, push, merge or deploy unless asked.** Deploying publishes the live site.

## Commands

| Task | Command |
|---|---|
| Install | `bun install` |
| Dev server | `bun run dev` (validates content first) |
| Content check | `bun run content:check` (`--remote` also pings icon URLs) |
| Tests | `bun test` (colocated `*.test.ts`) |
| Lint | `bun run lint` |
| Typecheck | `bunx tsc -b` |
| Production build | `bun run build` (content check → tsc → vite → SSR → prerender) |
| Rebuild avatar GLB | `bun run models` (needs Blender + the git-ignored source in `art/models/`) |
| Deploy | merge to `main`, then `gh workflow run deploy.yml --ref main` |

Before reporting work done: `bun run lint && bun test && bun run build` all pass.

## Layout and conventions

- `src/app/`: shell (section registry in `App.tsx`, entries, `styles.css`). `src/content/`: data + schema.
  `src/features/<section-type>/`: one module per section, public API in `index.ts`. `src/shared/`: `ui`,
  `layout`, `lib`, `three` used by several features.
- Imports across modules use `@/…` (alias in `tsconfig.app.json` and `vite.config.ts`); imports inside a module are
  relative. Import other features through their `index.ts`, not deep paths.
- React Three Fiber code goes in a `three/` folder and is loaded with `lazy()`, so three.js never lands in the main
  chunk. ESLint relaxes `react-hooks/immutability` and `purity` for `src/**/three/**` only (R3F mutates objects in
  `useFrame` by design).
- New section type: schema variant in `schema.ts` → `src/features/<type>/` module → register in `src/app/App.tsx`.
- Styling: Tailwind 4 with theme tokens injected from `site.json` (`bg`, `card`, `ink`, `accent`, `blue`, `orange`,
  `lime`, `yellow`, `sky`, `mint`). Neo-brutalist utilities in `src/app/styles.css`: `brut`, `brut-sm`, `press`,
  `eyebrow`. Fonts: Bricolage Grotesque (display), DM Sans (body), JetBrains Mono (labels).
- Animations: GSAP via `@/shared/lib/gsap` (`useGSAP`, wrap motion in `gsap.matchMedia().add(MOTION_OK, …)`).
  No Framer Motion; GSAP covers DOM and scroll, R3F covers 3D.
- Analytics: interactive elements worth measuring get `data-track="<event>"` (+ optional `data-track-label`); events
  are listed in `src/shared/lib/analytics.ts` `EVENTS` and must match `analytics/gtm-container.json` (tested).
  Tracking scripts are injected only in production builds (see `analytics/README.md`).
- Comments explain *why*, briefly. Match the surrounding density.

## Avatar and gestures

- `src/shared/three/gestures.ts` builds every animation in code from key poses: `[x,y,z]` aims a bone in character
  space (+X = the figure's left, +Y up, +Z toward the viewer), `{ turn }` rotates, `{ aim, palm }` sets a hand's
  palm direction, a number curls finger joints. `mirror()` / `both()` give left/right versions. The solver keeps
  the feet on the ground by lowering the hips. Add an action = add poses + an entry in `ACTIONS`.
- `site.json` `avatar.clips` picks which actions play (`idle`, `greet` on load/hover, `cheer` on click).
- Preview on the dev server console: `avatar.play('name')`, `avatar.seek('name', seconds)` (dev only).
- The model is a Tripo auto-rig repaired by `bun run models` (`art/blender/fix_skeleton.ts` +
  `art/blender/reskin.py`). If a new export animates with torn arms, check skin weights and bind pose before
  touching gesture code.

## Career road (experience)

- `src/features/experience/careerPlan.ts` maps scroll progress to segments (walk / lift / hold per job, then
  finish / exit). Both `three/CareerRoad.tsx` and the HTML cards read the same progress ref driven by one GSAP
  ScrollTrigger (`pin`, `scrub`). Keep everything a pure function of progress so reverse scrolling works.
- Jobs are ordered oldest first in `site.json`; the road, posts, boards, year chips and scroll length all derive
  from the list. Milestone year = first 4-digit number in `period`.
- Board shows period, role, company; the side card shows only `pointsLabel` + points + tech (role/company are
  `sr-only` there).

## Verifying visual work

Unit tests don't cover visuals. After UI or 3D changes, check desktop (1440×900) and mobile (390×844) in headless
Chrome:
- Playwright (`playwright-core`) with system Chrome and `--use-angle=swiftshader --enable-unsafe-swiftshader
  --ignore-gpu-blocklist` for WebGL.
- Add an init script setting `history.scrollRestoration = 'manual'`.
- Wait for `document.documentElement.dataset.avatar3d` before screenshots (3D loaded).
- For the career road, scroll to `pinSpacer.top + progress × (pinSpacer.height − innerHeight)`; compute exact
  progress points with `plan()` from `careerPlan.ts`.
- Prefer per-section viewport screenshots: full-page captures of the pinned section are misleading.
- Lighthouse (accessibility / best practices / SEO) should stay 100 on `/` and `/cv/`; the CV must print to 2 A4 pages.

## Pitfalls already hit

- React StrictMode runs effects twice: never `mixer.stopAllAction()` in cleanup (it silently blocked every gesture).
- The first frame after a model loads carries the whole load time as `dt`; clamp mixer steps (`Math.min(dt, 0.1)`).
- Side effects in `useMemo` run twice in dev; put dev hooks and listeners in `useEffect`.
- `useLoader` caches the GLTF: a second canvas must `SkeletonUtils.clone()` the scene.
- glTF bones only aim if they have a child; leaf bones fall back to their own +Y axis (Head after pruning).
- Share images are cached by URL on WhatsApp/LinkedIn/Facebook: new card = new filename in `public/` +
  `meta.ogImage`.
- `site.json` is hand-formatted: edit it with targeted text edits, don't re-dump it with a JSON serializer.
