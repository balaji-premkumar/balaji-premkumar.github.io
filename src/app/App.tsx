import type { ComponentType } from 'react';
import { sections, type Section, type SectionOf } from '@/content';
import { gsap, MOTION_OK, ScrollTrigger, useGSAP } from '@/shared/lib/gsap';
import { Navbar } from '@/shared/layout/Navbar';
import { Footer } from '@/shared/layout/Footer';
import { Hero } from '@/features/hero';
import { Marquee } from '@/features/marquee';
import { About } from '@/features/about';
import { Experience } from '@/features/experience';
import { Skills } from '@/features/skills';
import { Projects } from '@/features/projects';
import { Contact } from '@/features/contact';

type SectionProps<T extends Section['type']> = { section: SectionOf<T>; index: number };

/** Section `type` in site.json → component. Add a type to the schema + here to create a new kind of section. */
const registry: { [T in Section['type']]: ComponentType<SectionProps<T>> } = {
  hero: Hero,
  marquee: Marquee,
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
      <a href="#main" className="sr-only z-[200] rounded-full bg-ink px-4 py-2 text-bg focus:not-sr-only focus:fixed focus:top-4 focus:left-4">
        Skip to content
      </a>
      <Navbar />
      <main id="main" className="relative">
        <span id="top" className="absolute top-0" aria-hidden />
        {sections.map((section) => {
          const Component = registry[section.type] as ComponentType<SectionProps<Section['type']>>;
          return <Component key={section.id} section={section as never} index={section.type === 'hero' || section.type === 'marquee' ? 0 : ++n} />;
        })}
      </main>
      <Footer />
    </>
  );
}
