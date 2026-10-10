/**
 * Named events for Google Tag Manager / GA4. The page's tag (injected at build from site.json `analytics`, see
 * vite.config.ts) sets window.__tags: 'gtm' → push to the dataLayer (GTM triggers on the event name),
 * 'gtag' → GA4 directly. Neither on the dev server, where events are only logged.
 * analytics/gtm-container.json triggers on exactly these names (checked by analytics.test.ts).
 */
export const EVENTS = [
  'hire_me_click',
  'cta_click',
  'cv_open',
  'cv_print',
  'email_copy',
  'contact_click',
  'project_click',
  'avatar_click',
  'career_complete',
] as const;
export type TrackEvent = (typeof EVENTS)[number];

type TaggedWindow = { __tags?: 'gtm' | 'gtag'; dataLayer?: unknown[]; gtag?: (...args: unknown[]) => void };

export function track(event: TrackEvent, label?: string) {
  const w = window as unknown as TaggedWindow;
  if (w.__tags === 'gtm') w.dataLayer?.push({ event, label }); // always set label so GTM doesn't reuse the last one
  else if (w.__tags === 'gtag') w.gtag?.('event', event, label ? { label } : {});
  else if (import.meta.env.DEV) console.debug('[track]', event, label ?? '');
}

/**
 * One delegated listener for the whole page: `<a data-track="cta_click" data-track-label="View Work">`.
 * Any link to the CV counts as `cv_open` without markup. The label defaults to the element's text.
 */
export function trackClicks() {
  document.addEventListener(
    'click',
    (e) => {
      const el = (e.target as Element | null)?.closest?.<HTMLElement>('[data-track], a[href*="/cv/"]');
      if (!el) return;
      const event = (el.dataset.track as TrackEvent | undefined) ?? 'cv_open';
      track(event, el.dataset.trackLabel ?? el.textContent?.trim().slice(0, 80));
    },
    { capture: true },
  );
}
