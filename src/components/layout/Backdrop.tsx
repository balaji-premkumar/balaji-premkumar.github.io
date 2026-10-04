import { lazy, Suspense, useEffect, useState } from 'react';
import { site } from '../../content';

const Stage = lazy(() => import('../../three/Stage'));

function canRender3D() {
  if (!site.effects.webgl) return false;
  if (matchMedia('(prefers-reduced-motion: reduce)').matches) return false;
  try {
    return !!document.createElement('canvas').getContext('webgl2');
  } catch {
    return false;
  }
}

/**
 * Fixed layer behind all content. The CSS gradient is always there (and is what SSR/no-JS sees);
 * the WebGL stage is loaded only after the page is idle, so it never delays first paint.
 */
export function Backdrop() {
  const [enabled, setEnabled] = useState(false);

  useEffect(() => {
    if (!canRender3D()) return;
    const start = () => setEnabled(true);
    if ('requestIdleCallback' in window) {
      const id = requestIdleCallback(start, { timeout: 1500 });
      return () => cancelIdleCallback(id);
    }
    const id = setTimeout(start, 300);
    return () => clearTimeout(id);
  }, []);

  return (
    <div aria-hidden className="backdrop-fallback pointer-events-none fixed inset-0 -z-10">
      {enabled && (
        <Suspense fallback={null}>
          <Stage />
        </Suspense>
      )}
    </div>
  );
}
