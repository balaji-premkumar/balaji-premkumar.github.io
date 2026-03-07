import { useEffect, useRef } from 'react';
import gsap from 'gsap';
import { MousePointer2 } from 'lucide-react';

const CustomCursor = () => {
  const cursorRef = useRef<HTMLDivElement>(null);
  const glowRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    // Disable custom cursor on touch devices
    if (window.matchMedia('(pointer: coarse)').matches) {
      return;
    }

    const cursor = cursorRef.current;
    const glow = glowRef.current;

    if (!cursor || !glow) return;

    const ctx = gsap.context(() => {
      // Set initial state - adjust x/y percent so the tip of the arrow is at the actual mouse position
      gsap.set(cursor, { xPercent: -10, yPercent: -10 });
      gsap.set(glow, { xPercent: -50, yPercent: -50 });

      // Create x/y quickSetters for performance
      const xToCursor = gsap.quickTo(cursor, "x", { duration: 0, ease: "none" });
      const yToCursor = gsap.quickTo(cursor, "y", { duration: 0, ease: "none" });
      
      const xToGlow = gsap.quickTo(glow, "x", { duration: 0.15, ease: "power2.out" });
      const yToGlow = gsap.quickTo(glow, "y", { duration: 0.15, ease: "power2.out" });

      const onMouseMove = (e: MouseEvent) => {
        xToCursor(e.clientX);
        yToCursor(e.clientY);
        xToGlow(e.clientX);
        yToGlow(e.clientY);
      };

      window.addEventListener("mousemove", onMouseMove);

      // Handle hover states on interactive elements
      const interactiveElements = document.querySelectorAll('a, button, input, textarea, select');
      
      const onHover = () => {
        gsap.to(cursor, { scale: 1.2, duration: 0.3, ease: 'power2.out' });
        gsap.to(glow, { scale: 1.5, opacity: 0.8, backgroundColor: 'rgba(200, 240, 96, 0.2)', duration: 0.3, ease: 'power2.out' });
      };

      const onLeave = () => {
        gsap.to(cursor, { scale: 1, duration: 0.3, ease: 'power2.out' });
        gsap.to(glow, { scale: 1, opacity: 0.4, backgroundColor: 'rgba(255, 255, 255, 0.1)', duration: 0.3, ease: 'power2.out' });
      };

      interactiveElements.forEach((el) => {
        el.addEventListener('mouseenter', onHover);
        el.addEventListener('mouseleave', onLeave);
      });

      return () => {
        window.removeEventListener("mousemove", onMouseMove);
        interactiveElements.forEach((el) => {
          el.removeEventListener('mouseenter', onHover);
          el.removeEventListener('mouseleave', onLeave);
        });
      };
    });

    return () => ctx.revert();
  }, []);

  // Return nothing for touch devices
  if (typeof window !== 'undefined' && window.matchMedia('(pointer: coarse)').matches) {
    return null;
  }

  return (
    <>
      <div 
        ref={glowRef} 
        className="fixed top-0 left-0 w-12 h-12 rounded-full pointer-events-none z-[9998] blur-xl opacity-40 bg-white/10"
      />
      <div 
        ref={cursorRef} 
        className="fixed top-0 left-0 pointer-events-none z-[9999] text-accent drop-shadow-[0_0_8px_rgba(200,240,96,0.6)]"
      >
        <MousePointer2 size={24} strokeWidth={2.5} className="fill-bg" />
      </div>
    </>
  );
};

export default CustomCursor;