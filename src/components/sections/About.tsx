import { useRef } from 'react';
import type { SectionOf } from '../../content';
import { gsap, MOTION_OK, useGSAP } from '../../lib/gsap';
import { SectionHeader } from '../ui/SectionHeader';

export function About({ section, index }: { section: SectionOf<'about'>; index: number }) {
  const root = useRef<HTMLElement>(null);

  useGSAP(
    () => {
      // Real numbers are in the HTML (SEO, no-JS); animate from 0 only when motion is welcome.
      gsap.matchMedia().add(MOTION_OK, () => {
        gsap.utils.toArray<HTMLElement>('[data-count]').forEach((el) => {
          gsap.from(el, {
            textContent: 0,
            snap: { textContent: 1 },
            duration: 1.6,
            ease: 'power2.out',
            scrollTrigger: { trigger: el, start: 'top 85%', once: true },
          });
        });
      });
    },
    { scope: root },
  );

  return (
    <section ref={root} id={section.id} data-scene="about" aria-labelledby={`${section.id}-title`} className="relative px-6 py-32 md:py-48">
      <div className="mx-auto max-w-7xl">
        <SectionHeader index={index} eyebrow={section.eyebrow} title={section.title} id={section.id} />

        <div className="grid gap-16 lg:grid-cols-[1.1fr_1fr] lg:gap-24">
          <blockquote data-reveal className="font-serif text-4xl italic leading-tight text-ink md:text-5xl">
            <span className="text-accent">“</span>
            {section.quote}
            <span className="text-accent">”</span>
          </blockquote>

          <div className="space-y-6 text-base leading-relaxed text-muted md:text-lg">
            {section.paragraphs.map((p) => (
              <p key={p} data-reveal>{p}</p>
            ))}
          </div>
        </div>

        <dl className="mt-24 grid grid-cols-1 gap-px overflow-hidden rounded-3xl border border-line bg-line sm:grid-cols-3">
          {section.stats.map((s) => (
            <div key={s.label} data-reveal className="flex flex-col-reverse gap-2 bg-bg/80 p-10 backdrop-blur-sm">
              <dt className="text-xs uppercase tracking-[0.25em] text-muted">{s.label}</dt>
              <dd className="font-display text-6xl font-extrabold text-ink md:text-7xl">
                <span data-count>{s.value}</span>
                <span className="text-accent">{s.suffix}</span>
              </dd>
            </div>
          ))}
        </dl>
      </div>
    </section>
  );
}
