import { useLayoutEffect, useRef } from 'react';
import { motion } from 'framer-motion';
import gsap from 'gsap';
import { TextPlugin } from 'gsap/TextPlugin';
import { ChevronDown } from 'lucide-react';
import { personalInfo } from '../constants';

gsap.registerPlugin(TextPlugin);

const Hero = () => {
  const containerRef = useRef<HTMLDivElement>(null);
  const nameLine1Ref = useRef<HTMLSpanElement>(null);
  const nameLine2Ref = useRef<HTMLSpanElement>(null);
  const rolesRef = useRef<HTMLSpanElement>(null);

  useLayoutEffect(() => {
    const ctx = gsap.context(() => {
      // Name stagger animation
      gsap.fromTo(
        [nameLine1Ref.current, nameLine2Ref.current],
        { y: 90, opacity: 0 },
        {
          y: 0,
          opacity: 1,
          duration: 1,
          stagger: 0.2,
          ease: "power4.out",
          delay: 0.2
        }
      );

      // Typewriter effect
      const roles = personalInfo.roles;
      
      const tl = gsap.timeline({ repeat: -1 });
      
      roles.forEach((role) => {
        tl.to(rolesRef.current, {
          duration: 1,
          text: role,
          ease: "none",
        })
        .to(rolesRef.current, {
          duration: 1,
          delay: 2,
          text: "",
          ease: "none"
        });
      });

    }, containerRef);

    return () => ctx.revert();
  }, []);

  return (
    <section 
      ref={containerRef}
      id="hero" 
      className="relative min-h-screen flex items-center justify-center pt-20 px-6 overflow-hidden bg-dot-grid bg-fixed"
    >
      {/* Radial Glow */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[60vw] h-[60vw] bg-accent/10 rounded-full blur-[120px] pointer-events-none" />

      <div className="max-w-5xl mx-auto relative z-10 w-full flex flex-col items-center text-center">
        
        {/* Eyebrow */}
        <div className="flex items-center gap-4 mb-8">
          <div className="w-12 h-px bg-accent/50" />
          <span className="font-mono text-accent text-sm tracking-widest uppercase">
            Available for Work
          </span>
          <div className="w-12 h-px bg-accent/50" />
        </div>

        {/* Main Heading */}
        <h1 className="font-display font-black leading-[1.1] tracking-tighter text-ink mb-6" style={{ fontSize: 'clamp(3.2rem, 8vw, 7rem)' }}>
          <span className="block overflow-hidden pb-2">
            <span ref={nameLine1Ref} className="block">{personalInfo.name.first}</span>
          </span>
          <span className="block overflow-hidden text-accent pb-2">
            <span ref={nameLine2Ref} className="block">{personalInfo.name.last}</span>
          </span>
        </h1>

        {/* Roles Typewriter */}
        <div className="h-8 md:h-12 mb-12">
          <span className="font-mono text-xl md:text-2xl text-muted">I am a </span>
          <span ref={rolesRef} className="font-mono text-xl md:text-2xl text-ink font-bold border-r-2 border-accent pr-1 animate-pulse"></span>
        </div>

        {/* CTA Buttons */}
        <div className="flex flex-col sm:flex-row gap-6 items-center">
          <motion.a
            href="#projects"
            whileHover={{ scale: 1.04 }}
            whileTap={{ scale: 0.96 }}
            className="px-8 py-4 bg-accent text-bg font-mono font-bold rounded-full w-full sm:w-auto text-center"
          >
            View Work
          </motion.a>
          <motion.button
            onClick={() => window.print()}
            whileHover={{ scale: 1.04 }}
            whileTap={{ scale: 0.96 }}
            className="px-8 py-4 border border-border-subtle bg-surface/50 backdrop-blur-sm text-ink font-mono font-bold rounded-full hover:border-muted transition-colors w-full sm:w-auto text-center"
          >
            Download CV
          </motion.button>
        </div>
      </div>

      {/* Scroll Indicator */}
      <motion.div 
        className="absolute bottom-10 left-1/2 -translate-x-1/2 flex flex-col items-center gap-2 text-muted"
        animate={{ y: [0, 10, 0] }}
        transition={{ repeat: Infinity, duration: 2, ease: "easeInOut" }}
      >
        <span className="font-mono text-xs uppercase tracking-widest">Scroll</span>
        <ChevronDown size={20} />
      </motion.div>
    </section>
  );
};

export default Hero;