import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { useGSAP } from '@gsap/react';

if (typeof window !== 'undefined') {
  gsap.registerPlugin(ScrollTrigger, useGSAP);
  // Mobile address bars resize the viewport while scrolling; don't re-measure pinned sections for that.
  ScrollTrigger.config({ ignoreMobileResize: true });
}

/** Animations that only run when the user hasn't asked for reduced motion. */
export const MOTION_OK = '(prefers-reduced-motion: no-preference)';

export { gsap, ScrollTrigger, useGSAP };
