# 🎯 GEMINI CLI — Portfolio Redesign Prompt
# Bun + React + Vite + Tailwind CSS + GSAP + Framer Motion

---

## YOUR ROLE

You are a senior frontend engineer and creative UI/UX designer.
Your job is to fully redesign and upgrade my existing React portfolio
into a modern, production-grade, visually stunning developer portfolio.
Make bold design decisions. Do not ask clarifying questions — just build.

---

## STEP 1 — READ THE PROJECT FIRST

Before writing any code, read every file in the current directory:
- All files inside `src/` recursively
- `package.json`, `vite.config.js`, `index.html`
- Any existing component, page, style, or data files

Extract and preserve:
- My real name, bio, tagline
- All projects (title, description, tech stack, links)
- All skills and technologies
- Work experience / education
- Social links (GitHub, LinkedIn, email, etc.)

Never use placeholder or dummy content. Every piece of text in the
final output must come from my existing source files.

---

## STEP 2 — INSTALL DEPENDENCIES

Run the following using Bun:
```bash
bun add gsap framer-motion lucide-react react-router-dom
bun add -d tailwindcss postcss autoprefixer
bunx tailwindcss init -p
```

---

## STEP 3 — DESIGN SYSTEM TO FOLLOW

### Color Palette
Define these as Tailwind custom colors in `tailwind.config.js`:

| Token     | Value                      | Usage                        |
|-----------|----------------------------|------------------------------|
| bg        | #0a0a0f                    | Page background              |
| surface   | #111118                    | Section backgrounds          |
| card      | #16161f                    | Cards, panels                |
| accent    | #c8f060                    | Primary CTA, highlights      |
| accent2   | #60c8f0                    | Secondary highlights         |
| muted     | rgba(255,255,255,0.38)      | Subdued text, labels         |
| ink       | #eeeef2                    | Primary text                 |

### Typography
Import from Google Fonts and register in Tailwind:

| Role          | Font             | Usage                      |
|---------------|------------------|----------------------------|
| font-display  | Syne 700/800     | All headings, logo         |
| font-mono     | DM Mono 300/400  | Body text, labels, code    |
| font-serif    | Instrument Serif | Italic callout quotes      |

### Visual Rules
- Dark background throughout — no light sections
- Noise texture overlay on body using SVG feTurbulence via CSS
- Dot grid or line grid on hero background via Tailwind backgroundImage
- Subtle border color: rgba(255,255,255,0.07) on all cards
- All cards have backdrop-blur and a faint border
- Radial glow behind hero heading using a blurred div
- Custom CSS cursor — hide default, implement dot + ring in React
- Nothing on the page should appear static — every section animates in

---

## STEP 4 — PAGE SECTIONS TO BUILD

Build these sections in order. Use my real content in each one.

### 1. Navbar (Fixed)
- Logo using my initials, left-aligned, accent color, Syne font
- Nav links: About, Skills, Projects, Experience, Contact
- Each link has an underline that animates in on hover
- "Hire Me" CTA button right-aligned with border → fill on hover
- On scroll past 40px: add frosted glass background + bottom border
- Mobile: hamburger icon that opens a fullscreen overlay menu
- Animate in on page load sliding down from top using Framer Motion

### 2. Hero
- Sticky dot grid background, radial glow behind heading
- Eyebrow label: "Available for Work" with decorative lines either side
- My full name as the main heading — split into two lines, each animates
  up from below on load using GSAP stagger
- Typewriter effect cycling through 3 role titles using GSAP TextPlugin
- Two CTA buttons: "View Work" (filled accent) + "Download CV" (outlined)
- Animated scroll arrow bouncing at the bottom center

### 3. About
- Two-column layout: large italic serif quote left, bio paragraph right
- Three animated stat counters below (years exp, projects, technologies)
  — numbers count up from 0 when scrolled into view using GSAP
- Section heading animates in with clip-path reveal on scroll

### 4. Skills
- Grouped by category (e.g. Frontend, Backend, DevOps, Tools)
- Each skill displayed as a pill/tag — NOT a progress bar
- Pills stagger fade-up into view on scroll using GSAP ScrollTrigger
- Hover: pill lifts slightly, background flashes to accent color

### 5. Projects
- 2–3 column responsive card grid
- Each card shows: project name, one-line description, tech stack pills,
  GitHub icon link, and Live Demo link
- Card hover: border turns accent, subtle scale up, glow shadow appears
- Cards stagger animate in from below on scroll using GSAP

### 6. Experience
- Vertical timeline layout
- The connecting line draws itself downward using GSAP stroke animation
  with scrub tied to scroll position
- Each entry fades and slides in alternating left/right

### 7. Contact
- Split layout: large "Let's Talk" heading left, links list right
- Links: GitHub, LinkedIn, Email — each with icon + label
- Label slides into view on hover using Framer Motion layout animation
- Subtle gradient mesh or glow in the background

### 8. Footer
- Single centered line: copyright + "Designed & Built by [my name]"
- Back-to-top button animates in after scrolling down

---

## STEP 5 — ANIMATION RULES

### Tools
- Use **GSAP** for: page load sequences, scroll-triggered reveals,
  text splitting, typewriter, counter animations, timeline line draw,
  and magnetic button effects
- Use **Framer Motion** for: navbar entrance, mobile menu, card hover
  states, button press feedback, scroll indicator, and layout transitions
- Never mix both libraries on the same element

### GSAP Patterns to Apply
- Register `ScrollTrigger` and `TextPlugin` plugins at the top of
  every file that uses them
- Wrap all GSAP code inside `gsap.context()` and return `ctx.revert()`
  in the useEffect cleanup to prevent memory leaks
- Use `stagger` on every list/grid of elements entering the viewport
- All section headings reveal using `clipPath: inset(100% 0 0 0)`
  animating to `inset(0% 0 0 0)` on scroll enter
- Hero title: split into `.line` spans, stagger `y: 90 → 0, opacity: 0 → 1`
- Stat counters: animate `textContent` from 0 to target value with snap
- Timeline line: `scaleY: 0 → 1` with `scrub: 1` tied to scroll
- Project cards: `y: 60, rotateX: 8, opacity: 0` → default, staggered

### Framer Motion Patterns to Apply
- Navbar: `initial={{ y: -80, opacity: 0 }}` → `animate={{ y: 0, opacity: 1 }}`
- Nav links: stagger delay `0.1 * index + 0.5`
- Mobile menu: slide in from right with `x: '100%'` using AnimatePresence
- All CTA buttons: `whileHover={{ scale: 1.04 }}` + `whileTap={{ scale: 0.96 }}`
- Scroll arrow: `animate={{ y: [0, 10, 0] }}` infinite repeat

### Custom Cursor (GSAP)
- Hide the default cursor globally via CSS
- Create a small filled dot and a larger hollow ring as fixed divs
- Dot follows mouse instantly (duration: 0)
- Ring follows with a slight lag (duration: 0.14, power2.out)
- On hover over any `a` or `button`: dot scales up to 2.8x
- Apply mix-blend-mode: exclusion to the dot

### Magnetic Buttons
- Apply to all primary CTA buttons
- On mousemove: calculate offset from button center, translate button
  by 35% of offset using GSAP
- On mouseleave: spring back using `elastic.out(1, 0.4)` easing

## ICONS — Skill Icons (skillicons.dev)

Do NOT use lucide-react or any icon library for skill/technology icons.
Use the Skill Icons service from https://skillicons.dev for all technology
and tool icons throughout the portfolio.

### How to Use Skill Icons

Skill icons are embedded as plain <img> tags using this URL pattern:
```
https://skillicons.dev/icons?i=ICON_NAME
```

For a row of multiple icons in one image:
```
https://skillicons.dev/icons?i=react,typescript,nodejs,tailwind&perline=4
```

### Display Rules

- Use `perline` parameter to control icons per row (recommended: 6–8)
- Always add `theme=dark` or `theme=light` param to match site theme:
```
  https://skillicons.dev/icons?i=react,ts,nodejs&theme=dark
```
- Wrap each icon img in a div with Tailwind hover: scale-110 + transition
- Give every icon img a descriptive alt text (e.g. alt="React")
- Icons should be 48x48px on desktop, 36x36px on mobile

### Skills Section — Implementation Pattern

Group icons by category and render each group like this:
```jsx
const skillGroups = [
  {
    label: 'Frontend',
    icons: ['html', 'css', 'js', 'ts', 'react', 'tailwind'],
  },
  {
    label: 'Backend',
    icons: ['nodejs', 'express', 'python', 'django'],
  },
  {
    label: 'Database',
    icons: ['mongodb', 'postgres', 'mysql', 'redis'],
  },
  {
    label: 'DevOps & Tools',
    icons: ['git', 'github', 'docker', 'linux', 'vscode', 'figma'],
  },
];

// Render each group:
// Use the multi-icon URL for the entire group row in one <img>:
// https://skillicons.dev/icons?i=html,css,js,ts,react,tailwind&theme=dark&perline=6
```

Replace the icon names above with the ones actually found in my
existing portfolio source files.

### Social / Contact Icons

For social links in the Contact and Footer sections also use skill icons
where applicable:

| Platform  | Skill Icon Name |
|-----------|----------------|
| GitHub    | github         |
| LinkedIn  | linkedin       |
| Twitter/X | twitter        |
| Discord   | discord        |
| Gmail     | gmail          |

Example usage:
```html
<img src="https://skillicons.dev/icons?i=github&theme=dark" alt="GitHub" />
```

### Full Icon Reference

Use only valid icon names from this list:
https://skillicons.dev

Common ones to know:
- Languages:  js, ts, python, java, cpp, cs, go, rust, php, swift
- Frontend:   html, css, react, vue, angular, svelte, nextjs, tailwind,
              bootstrap, sass, redux, vite
- Backend:    nodejs, express, fastapi, django, flask, spring, laravel
- Database:   mongodb, postgres, mysql, sqlite, redis, firebase, supabase
- DevOps:     docker, kubernetes, git, github, gitlab, linux, nginx, aws,
              gcp, azure, vercel, netlify
- Tools:      vscode, figma, postman, jest, webpack, babel
- Runtimes:   bun, deno

### Animation on Skill Icons

Apply GSAP stagger animation when icons scroll into view:

- Each icon `<img>` gets the class `skill-icon`
- Animate: `y: 20, opacity: 0` → default, stagger 0.05s, ScrollTrigger
- On hover (CSS + Tailwind): `hover:scale-110 hover:-translate-y-1 transition-all`
- Do NOT animate the multi-icon URLs — use individual icon URLs per
  `<img>` tag so each one can be staggered independently

---

## STEP 6 — RESPONSIVE BREAKPOINTS

| Breakpoint | Behavior                                      |
|------------|-----------------------------------------------|
| < 768px    | Single column layouts, hamburger nav          |
| 768–1024px | Two column where applicable                   |
| > 1024px   | Full multi-column layouts                     |

- Hero font size: clamp(3.2rem, 8vw, 7rem)
- All section padding: clamp(4rem, 8vw, 8rem) vertical
- Cards: 1 col mobile → 2 col tablet → 3 col desktop
- Custom cursor: disable on touch devices (pointer: coarse)

---

## STEP 7 — CODE QUALITY RULES

- One component per file inside `src/components/`
- All GSAP logic lives inside `useEffect` with proper cleanup
- No inline styles — use only Tailwind utility classes
- No hardcoded colors outside of `tailwind.config.js`
- All external links open in `target="_blank"` with `rel="noreferrer"`
- All images have `alt` attributes for accessibility
- `App.jsx` should only import and compose section components
- Keep `main.jsx` minimal — just render `<App />`

---

## STEP 8 — FINAL DELIVERY CHECKLIST

Before finishing, verify every item below is working:

- [ ] All my real content is used — no dummy text anywhere
- [ ] Tailwind config has all custom colors and fonts registered
- [ ] Google Fonts are imported in `index.html` or `index.css`
- [ ] GSAP plugins registered before use in every component
- [ ] All useEffect GSAP contexts cleaned up with ctx.revert()
- [ ] ScrollTrigger applied to every section entry animation
- [ ] Hero typewriter cycles through 3 roles infinitely
- [ ] Stat counters animate on scroll enter
- [ ] Project cards stagger in on scroll
- [ ] Experience timeline line draws on scroll
- [ ] Custom cursor working, hidden on mobile
- [ ] Magnetic effect on CTA buttons
- [ ] Navbar turns frosted glass on scroll
- [ ] Mobile hamburger menu opens and closes
- [ ] Fully responsive at 480px, 768px, 1024px
- [ ] No console errors or warnings
- [ ] `bun run dev` starts without errors

---

## START

Read the project files now, extract my content, then build the entire
portfolio from top to bottom following every instruction above.
