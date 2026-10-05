import type { ComponentType } from 'react';
import { sections, type Section, type SectionOf } from './content';
import { gsap, MOTION_OK, ScrollTrigger, useGSAP } from './lib/gsap';
import { Navbar } from './components/layout/Navbar';
import { Footer } from './components/layout/Footer';
import { Backdrop } from './components/layout/Backdrop';
import { Hero } from './components/sections/Hero';
import { About } from './components/sections/About';
import { Experience } from './components/sections/Experience';
import { Skills } from './components/sections/Skills';
import { Projects } from './components/sections/Projects';
import { Contact } from './components/sections/Contact';

type SectionProps<T extends Section['type']> = { section: SectionOf<T>; index: number };

/** Section `type` in site.json → component. Add a type to the schema + here to create a new kind of section. */
const registry: { [T in Section['type']]: ComponentType<SectionProps<T>> } = {
  hero: Hero,
  about: About,
  experience: Experience,
  skills: Skills,
  projects: Projects,
  contact: Contact,
};

export default function App() {
  // Fade/slide-in for anything marked data-reveal. Content stays visible without JS / with reduced motion.
  useGSAP(() => {
    gsap.matchMedia().add(MOTION_OK, () => {
      gsap.set('[data-reveal]', { autoAlpha: 0, y: 40 });
      ScrollTrigger.batch('[data-reveal]', {
        start: 'top 90%',
        once: true,
        onEnter: (els) => gsap.to(els, { autoAlpha: 1, y: 0, duration: 0.9, stagger: 0.08, ease: 'power3.out', overwrite: true }),
      });
    });
  });

  let n = 0;
  return (
    <>
      <a href="#main" className="sr-only z-[200] rounded bg-accent px-4 py-2 text-bg focus:not-sr-only focus:fixed focus:top-4 focus:left-4">
        Skip to content
      </a>
      <Backdrop />
      <Navbar />
      <main id="main" className="relative">
        <span id="top" className="absolute top-0" aria-hidden />
        {sections.map((section) => {
          const Component = registry[section.type] as ComponentType<SectionProps<Section['type']>>;
          return <Component key={section.id} section={section as never} index={section.type === 'hero' ? 0 : ++n} />;
        })}
      </main>
      <Footer />
    </>
  );
}
