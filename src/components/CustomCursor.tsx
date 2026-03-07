import { useEffect, useRef, useState } from 'react';
import gsap from 'gsap';

const CustomCursor = () => {
  const cursorRef = useRef<HTMLDivElement>(null);
  const glowRef = useRef<HTMLDivElement>(null);
  const [isTouch, setIsTouch] = useState(false);

  useEffect(() => {
    // Detect touch device only on client side
    const touch = window.matchMedia('(pointer: coarse)').matches;
    setIsTouch(touch);
    if (touch) return;

    const cursor = cursorRef.current;
    const glow = glowRef.current;

    if (!cursor || !glow) return;

    const ctx = gsap.context(() => {
      // Set initial state — no xPercent/yPercent to avoid conflicts
      gsap.set(cursor, { x: 0, y: 0, opacity: 0 });
      gsap.set(glow, { x: 0, y: 0, opacity: 0 });

      // Use quickSetter for cursor (instant, no tween) — fixes the stuck cursor bug
      const xSetCursor = gsap.quickSetter(cursor, 'x', 'px');
      const ySetCursor = gsap.quickSetter(cursor, 'y', 'px');

      // Keep smooth lag on glow
      const xToGlow = gsap.quickTo(glow, 'x', { duration: 0.15, ease: 'power2.out' });
      const yToGlow = gsap.quickTo(glow, 'y', { duration: 0.15, ease: 'power2.out' });

      let hasMoved = false;

      const onMouseMove = (e: MouseEvent) => {
        if (!hasMoved) {
          gsap.to([cursor, glow], { opacity: 1, duration: 0.2, overwrite: 'auto' });
          hasMoved = true;
        }

        xSetCursor(e.clientX);
        ySetCursor(e.clientY);
        xToGlow(e.clientX);
        yToGlow(e.clientY);
      };

      const onMouseLeaveViewport = () => {
        hasMoved = false;
        gsap.to([cursor, glow], { opacity: 0, duration: 0.2, overwrite: 'auto' });
      };

      const onMouseEnterViewport = (e: MouseEvent) => {
        hasMoved = true;

        // Snap both to current position immediately to avoid sliding in from corner
        gsap.set(cursor, { x: e.clientX, y: e.clientY });
        gsap.set(glow, { x: e.clientX, y: e.clientY });
        gsap.to([cursor, glow], { opacity: 1, duration: 0.2, overwrite: 'auto' });
      };

      window.addEventListener('mousemove', onMouseMove);
      document.addEventListener('mouseleave', onMouseLeaveViewport);
      document.addEventListener('mouseenter', onMouseEnterViewport);

      // Use event delegation instead of querying static elements —
      // this catches dynamically added buttons/links too
      const onHoverStart = (e: MouseEvent) => {
        const target = e.target as Element;
        if (target.closest('a, button, input, textarea, select')) {
          gsap.to(cursor, { scale: 1.1, rotate: -5, duration: 0.3, ease: 'back.out(1.7, 0.3)' });
          gsap.to(glow, { scale: 1.8, opacity: 0.8, backgroundColor: 'rgba(96, 200, 240, 0.3)', duration: 0.3, ease: 'power2.out' });
        }
      };

      const onHoverEnd = (e: MouseEvent) => {
        const target = e.target as Element;
        if (target.closest('a, button, input, textarea, select')) {
          gsap.to(cursor, { scale: 1, rotate: 0, duration: 0.3, ease: 'power2.out' });
          gsap.to(glow, { scale: 1, opacity: 0.4, backgroundColor: 'rgba(255, 255, 255, 0.1)', duration: 0.3, ease: 'power2.out' });
        }
      };

      document.addEventListener('mouseover', onHoverStart);
      document.addEventListener('mouseout', onHoverEnd);

      return () => {
        window.removeEventListener('mousemove', onMouseMove);
        document.removeEventListener('mouseleave', onMouseLeaveViewport);
        document.removeEventListener('mouseenter', onMouseEnterViewport);
        document.removeEventListener('mouseover', onHoverStart);
        document.removeEventListener('mouseout', onHoverEnd);
      };
    });

    return () => ctx.revert();
  }, []);

  // Don't render on touch devices (determined client-side to avoid SSR mismatch)
  if (isTouch) return null;

  return (
    <div className="print:hidden">
      {/* Glow blob — lags slightly behind cursor */}
      <div
        ref={glowRef}
        className="fixed top-0 left-0 w-14 h-14 rounded-full pointer-events-none z-[9998] blur-[20px] bg-white/10"
        style={{ willChange: 'transform', marginLeft: '-28px', marginTop: '-28px' }}
      />
      {/* Cursor SVG — snaps instantly to mouse */}
      <div
        ref={cursorRef}
        className="fixed top-0 left-0 pointer-events-none z-[9999] drop-shadow-[0_0_12px_rgba(200,240,96,0.8)]"
        style={{ willChange: 'transform', marginLeft: '-4px', marginTop: '-2px' }}
      >
        <svg
          width="34"
          height="34"
          viewBox="0 0 32 32"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
        >
          <defs>
            <linearGradient id="cursorGradient" x1="0" y1="0" x2="32" y2="32" gradientUnits="userSpaceOnUse">
              <stop stopColor="#c8f060" />
              <stop offset="0.5" stopColor="#06B6D4" />
              <stop offset="1" stopColor="#512BD4" />
            </linearGradient>
          </defs>
          <path
            d="M6.35 1.5C5.46 0.77 4 1.4 4 2.55v26.9c0 1.15 1.46 1.78 2.35 1.05l7.15-5.92c.3-.25.68-.38 1.07-.38h9.88c1.15 0 1.78-1.46 1.05-2.35L6.35 1.5z"
            fill="url(#cursorGradient)"
            stroke="white"
            strokeWidth="1.5"
            strokeLinejoin="round"
          />
        </svg>
      </div>
    </div>
  );
};

export default CustomCursor;