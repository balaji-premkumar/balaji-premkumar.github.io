import { useEffect, useRef } from 'react';
import gsap from 'gsap';

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
      gsap.set(cursor, { xPercent: -15, yPercent: -10, opacity: 0 });
      gsap.set(glow, { xPercent: -50, yPercent: -50, opacity: 0 });

      // Create x/y quickSetters for performance
      const xToCursor = gsap.quickTo(cursor, "x", { duration: 0, ease: "none" });
      const yToCursor = gsap.quickTo(cursor, "y", { duration: 0, ease: "none" });
      
      const xToGlow = gsap.quickTo(glow, "x", { duration: 0.15, ease: "power2.out" });
      const yToGlow = gsap.quickTo(glow, "y", { duration: 0.15, ease: "power2.out" });

      const onMouseMove = (e: MouseEvent) => {
        // Show cursor when it moves (in case it was hidden)
        gsap.to([cursor, glow], { opacity: 1, duration: 0.2, overwrite: "auto" });
        xToCursor(e.clientX);
        yToCursor(e.clientY);
        xToGlow(e.clientX);
        yToGlow(e.clientY);
      };

      // Hide cursor when leaving the browser window completely
      const onMouseLeaveViewport = () => {
        gsap.to([cursor, glow], { opacity: 0, duration: 0.2, overwrite: "auto" });
      };

      const onMouseEnterViewport = () => {
        gsap.to([cursor, glow], { opacity: 1, duration: 0.2, overwrite: "auto" });
      };

      window.addEventListener("mousemove", onMouseMove);
      document.addEventListener("mouseleave", onMouseLeaveViewport);
      document.addEventListener("mouseenter", onMouseEnterViewport);

      // Handle hover states on interactive elements
      const interactiveElements = document.querySelectorAll('a, button, input, textarea, select');
      
      const onHover = () => {
        gsap.to(cursor, { scale: 1.1, rotate: -5, duration: 0.3, ease: 'back.out(1.7, 0.3)' });
        gsap.to(glow, { scale: 1.8, opacity: 0.8, backgroundColor: 'rgba(96, 200, 240, 0.3)', duration: 0.3, ease: 'power2.out' });
      };

      const onLeave = () => {
        gsap.to(cursor, { scale: 1, rotate: 0, duration: 0.3, ease: 'power2.out' });
        gsap.to(glow, { scale: 1, opacity: 0.4, backgroundColor: 'rgba(255, 255, 255, 0.1)', duration: 0.3, ease: 'power2.out' });
      };

      interactiveElements.forEach((el) => {
        el.addEventListener('mouseenter', onHover);
        el.addEventListener('mouseleave', onLeave);
      });

      return () => {
        window.removeEventListener("mousemove", onMouseMove);
        document.removeEventListener("mouseleave", onMouseLeaveViewport);
        document.removeEventListener("mouseenter", onMouseEnterViewport);
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
        className="fixed top-0 left-0 w-14 h-14 rounded-full pointer-events-none z-[9998] blur-[20px] bg-white/10"
      />
      <div 
        ref={cursorRef} 
        className="fixed top-0 left-0 pointer-events-none z-[9999] drop-shadow-[0_0_12px_rgba(200,240,96,0.8)]"
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
    </>
  );
};

export default CustomCursor;