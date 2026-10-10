import { useRef } from 'react';
import { pop } from '@/content';
import { gsap, MOTION_OK, useGSAP } from '@/shared/lib/gsap';
import { SectionHeader } from '@/shared/ui/SectionHeader';
import type { Props } from './Experience';

/** Newest first, one colour card per stop on a thick rail that fills as you scroll. */
export function Timeline({ section, index }: Props) {
  const root = useRef<HTMLElement>(null);
  const items = [...section.items].reverse();

  useGSAP(
    () => {
      gsap.matchMedia().add(MOTION_OK, () => {
        gsap.fromTo('[data-rail-fill]', { scaleY: 0 }, {
          scaleY: 1,
          ease: 'none',
          scrollTrigger: { trigger: '[data-rail]', start: 'top 70%', end: 'bottom 70%', scrub: 0.4 },
        });
      });
    },
    { scope: root },
  );

  return (
    <section ref={root} id={section.id} aria-labelledby={`${section.id}-title`} className="px-6 py-16 md:py-24">
      <div className="mx-auto max-w-5xl">
        <SectionHeader index={index} eyebrow={section.eyebrow} title={section.title} id={section.id} mark="var(--sky)" />

        <ol data-rail className="relative space-y-10 pl-10 md:pl-16">
          <span className="absolute top-2 bottom-2 left-[9px] w-1.5 rounded-full bg-ink/15 md:left-[17px]" aria-hidden />
          <span data-rail-fill className="absolute top-2 bottom-2 left-[9px] w-1.5 origin-top rounded-full bg-ink md:left-[17px]" aria-hidden />

          {items.map((item, i) => {
            const colors = pop(i, item.color);
            return (
              <li key={item.company} data-reveal className="relative">
                <span className="brut-sm absolute top-8 -left-10 size-6 rounded-full md:-left-[3.25rem] md:size-7" style={{ background: colors.background }} aria-hidden />
                <article className={`brut rounded-3xl p-7 md:p-10 ${i % 2 ? 'md:rotate-[0.4deg]' : 'md:-rotate-[0.4deg]'}`} style={colors}>
                  <div className="flex flex-wrap items-start justify-between gap-3">
                    <div>
                      <h3 className="font-display text-3xl leading-tight font-extrabold md:text-4xl">{item.role}</h3>
                      <p className="mt-1 text-lg font-bold opacity-85">
                        {item.company}
                        {item.location && ` · ${item.location}`}
                      </p>
                    </div>
                    <span className="brut-sm eyebrow rounded-full bg-card px-3 py-1 text-ink">{item.period}</span>
                  </div>
                  <ul className="mt-6 space-y-2.5">
                    {item.points.map((p) => (
                      <li key={p} className="flex gap-3">
                        <span aria-hidden>✦</span>
                        <span>{p}</span>
                      </li>
                    ))}
                  </ul>
                  {item.tech && (
                    <ul className="mt-6 flex flex-wrap gap-2" aria-label="Technologies">
                      {item.tech.map((t) => (
                        <li key={t} className="rounded-full border-2 border-current px-3 py-0.5 text-sm font-bold">{t}</li>
                      ))}
                    </ul>
                  )}
                </article>
              </li>
            );
          })}
        </ol>
      </div>
    </section>
  );
}
