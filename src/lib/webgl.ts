import { site } from '../content';

/** WebGL2 available, enabled in site.json, and the user hasn't asked for reduced motion. Client only. */
export function canRender3D() {
  if (!site.effects.webgl || matchMedia('(prefers-reduced-motion: reduce)').matches) return false;
  try {
    return !!document.createElement('canvas').getContext('webgl2');
  } catch {
    return false;
  }
}
