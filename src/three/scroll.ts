/**
 * Per-frame scroll state shared by all 3D scenes. Mutated in place (no React re-renders).
 *
 * For every `[data-scene="<type>"]` section:
 *  - vis:   0..1 how much of the viewport the section covers (fade in/out)
 *  - inner: 0..1 progress while the section is pinned/scrolled through (top hits top → bottom hits bottom)
 */
export type SceneProgress = { vis: number; inner: number };

export const scroll = {
  page: 0,
  scenes: {} as Record<string, SceneProgress>,
  pointer: { x: 0, y: 0 },
};

const clamp01 = (v: number) => Math.min(1, Math.max(0, v));

export function measure(elements: HTMLElement[]) {
  const vh = window.innerHeight;
  const max = document.documentElement.scrollHeight - vh;
  scroll.page = max > 0 ? window.scrollY / max : 0;

  for (const el of elements) {
    const r = el.getBoundingClientRect();
    const vis = clamp01((Math.min(r.bottom, vh) - Math.max(r.top, 0)) / vh);
    const inner = r.height > vh ? clamp01(-r.top / (r.height - vh)) : clamp01((vh - r.top) / (vh + r.height));
    scroll.scenes[el.dataset.scene!] = { vis, inner };
  }
}

export const sceneOf = (type: string): SceneProgress => scroll.scenes[type] ?? { vis: 0, inner: 0 };
