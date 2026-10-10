import { lazy, Suspense, useEffect, useState, type ReactNode } from 'react';
import { site } from '@/content';
import { asset, srcSet } from '@/shared/lib/assets';
import { canRender3D } from '@/shared/lib/webgl';

const AvatarCanvas = lazy(() => import('./three/AvatarCanvas'));

/** Blue blob with the figure on it: static poster first (SSR / no WebGL), the 3D figure loaded once the page is idle.
 * The poster is a frame of the canvas itself (idle pose), so the swap doesn't shift. Children (e.g. stickers) sit on top. */
export function AvatarStage({ children }: { children?: ReactNode }) {
  const avatar = site.avatar?.enabled ? site.avatar : undefined;
  const [live, setLive] = useState(false);

  useEffect(() => {
    if (!avatar || !canRender3D()) return;
    const start = () => setLive(true);
    if ('requestIdleCallback' in window) {
      const id = requestIdleCallback(start, { timeout: 1500 });
      return () => cancelIdleCallback(id);
    }
    const id = setTimeout(start, 300);
    return () => clearTimeout(id);
  }, [avatar]);

  return (
    <div className="relative mx-auto aspect-square w-full max-w-[30rem] lg:mr-0">
      <div className="brut absolute inset-[6%] rounded-[44%_56%_52%_48%/52%_44%_56%_48%] bg-blue" aria-hidden />
      {avatar?.poster && (
        <img
          src={asset(avatar.poster)}
          srcSet={srcSet(avatar.poster)}
          sizes="30rem"
          alt={avatar.alt}
          width={926}
          height={926}
          decoding="async"
          fetchPriority="high" // the hero's largest paint
          className="avatar-poster absolute inset-0 size-full object-contain transition-opacity duration-500"
        />
      )}
      {avatar && live && (
        <Suspense fallback={null}>
          <AvatarCanvas config={avatar} />
        </Suspense>
      )}
      {children}
    </div>
  );
}
