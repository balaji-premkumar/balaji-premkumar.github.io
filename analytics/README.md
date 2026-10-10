# Analytics, Tag Manager and Search Console

Tracking is configured in `src/content/site.json` → `analytics` and only ships in production builds.

| `analytics` in site.json | What the site loads |
|---|---|
| `{ "gtmId": "GTM-…" }` (plus `googleId`) | **Google Tag Manager only.** GA4 and every other tag live in the GTM dashboard. |
| `{ "googleId": "G-…" }` | GA4 directly (gtag.js), no GTM. |
| removed | Nothing. |

## Events the site sends

Pushed to the dataLayer (GTM) or sent to GA4 directly, each with a `label` parameter:

| Event | When | `label` |
|---|---|---|
| `hire_me_click` | "Hire Me" in the navbar | `nav` / `menu` |
| `cta_click` | Hero buttons (except the CV one) | button text |
| `cv_open` | Any link to `/cv/` (e.g. "Download CV") | link text |
| `cv_print` | Print button on the CV, or opened with `?print=1` | `button` / `download` |
| `email_copy` | "Copy email" button | button text |
| `contact_click` | Contact CTA, phone, social links | `cta` / `phone` / network name |
| `project_click` | Project "Live" / "Source" buttons | `<project> · live` / `· source` |
| `avatar_click` | Clicking the 3D figure (thumbs-up) | `hero` |
| `career_complete` | Scrolled through the whole career road (once per visit) | none |

Add an event: name it in `EVENTS` in `src/shared/lib/analytics.ts`, put `data-track="name"` on the element (or call
`track()`), add it to the trigger regex in `gtm-container.json`. `bun test` fails if the two lists differ.

## One-time setup

### 1. Google Tag Manager
1. <https://tagmanager.google.com> → **Create account** → container name `balaji-premkumar.github.io`, platform **Web**.
2. Copy the container ID (`GTM-XXXXXXX`), put it in `site.json` → `analytics.gtmId`, and deploy.
3. In GTM: **Admin → Import container** → choose `analytics/gtm-container.json` → workspace *Default* →
   **Merge** (*Rename conflicting*). This adds:
   - **Google tag - GA4** for `G-XWF0Z76G86`, firing on every page.
   - **GA4 event - site events**: forwards every event above to GA4 with its `label`.
   - Trigger **Site events** and variables **DLV - label**, **GA4 Measurement ID**.
4. **Preview** (Tag Assistant) on the live site to check tags fire, then **Submit → Publish**.

From then on, new tools (Microsoft Clarity, LinkedIn Insight, ad pixels…) are added as tags in GTM: no code change
or redeploy. The site's events are available as triggers (*Custom Event*, e.g. `cv_open`).

### 2. Google Analytics (GA4 property `G-XWF0Z76G86`)
- **Admin → Data streams → the web stream → Enhanced measurement**: keep on (page views, scrolls, outbound
  clicks, file downloads).
- **Admin → Custom definitions → Create custom dimension**: name `Label`, scope *Event*, parameter `label`
  (so labels show up in reports).
- **Admin → Events**: mark `cv_open`, `cv_print`, `email_copy`, `hire_me_click`, `contact_click` as
  **key events** (conversions).
- **Admin → Data streams → Configure tag settings → Define internal traffic**: add your IP, then
  **Admin → Data filters** → activate *Internal traffic* to exclude your own visits.
- **Admin → Product links → Search Console links**: link the property below.

### 3. Google Search Console
1. <https://search.google.com/search-console> → **Add property** → URL prefix `https://balaji-premkumar.github.io/`.
2. Verify with **Google Analytics** or **Google Tag Manager** (uses the tag already on the page). Or use
   **HTML tag**: copy only the `content` value into `site.json` → `meta.googleSiteVerification` and deploy.
3. **Sitemaps** → submit `sitemap.xml`.
4. **URL inspection** → `https://balaji-premkumar.github.io/` → **Request indexing**.

The page also carries `ProfilePage` structured data (Person, job, skills, links); check it with
<https://search.google.com/test/rich-results>.
