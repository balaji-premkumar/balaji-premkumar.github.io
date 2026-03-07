import { useEffect, useRef } from 'react';
import gsap from 'gsap';

const CustomCursor = () => {
  const dotRef = useRef<HTMLDivElement>(null);
  const ringRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    // Disable custom cursor on touch devices
    if (window.matchMedia('(pointer: coarse)').matches) {
      return;
    }

    const dot = dotRef.current;
    const ring = ringRef.current;

    if (!dot || !ring) return;

    const ctx = gsap.context(() => {
      // Set initial state
      gsap.set(dot, { xPercent: -50, yPercent: -50 });
      gsap.set(ring, { xPercent: -50, yPercent: -50 });

      // Create x/y quickSetters for performance
      const xToDot = gsap.quickTo(dot, "x", { duration: 0, ease: "power3" });
      const yToDot = gsap.quickTo(dot, "y", { duration: 0, ease: "power3" });
      
      const xToRing = gsap.quickTo(ring, "x", { duration: 0.14, ease: "power2.out" });
      const yToRing = gsap.quickTo(ring, "y", { duration: 0.14, ease: "power2.out" });

      const onMouseMove = (e: MouseEvent) => {
        xToDot(e.clientX);
        yToDot(e.clientY);
        xToRing(e.clientX);
        yToRing(e.clientY);
      };

      window.addEventListener("mousemove", onMouseMove);

      // Handle hover states on interactive elements
      const interactiveElements = document.querySelectorAll('a, button, input, textarea, select');
      
      const onHover = () => {
        gsap.to(dot, { scale: 2.8, duration: 0.3, ease: 'power2.out' });
        gsap.to(ring, { scale: 0.5, opacity: 0, duration: 0.3, ease: 'power2.out' });
      };

      const onLeave = () => {
        gsap.to(dot, { scale: 1, duration: 0.3, ease: 'power2.out' });
        gsap.to(ring, { scale: 1, opacity: 1, duration: 0.3, ease: 'power2.out' });
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
        ref={dotRef} 
        className="fixed top-0 left-0 w-2 h-2 bg-ink rounded-full pointer-events-none z-[10000] mix-blend-exclusion"
      />
      <div 
        ref={ringRef} 
        className="fixed top-0 left-0 w-8 h-8 border border-white/20 rounded-full pointer-events-none z-[9999]"
      />
    </>
  );
};

export default CustomCursor;