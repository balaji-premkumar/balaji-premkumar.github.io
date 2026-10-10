import { useRef } from 'react';
import { pop, type SectionOf } from '@/content';
import { gsap, MOTION_OK, useGSAP } from '@/shared/lib/gsap';
import { SectionHeader } from '@/shared/ui/SectionHeader';

/** Bento: quote tile, story tile, one colour tile per stat. */
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
            scrollTrigger: { trigger: el, start: 'top 90%', once: true },
          });
        });
      });
    },
    { scope: root },
  );

  return (
    <section ref={root} id={section.id} aria-labelledby={`${section.id}-title`} className="px-6 py-16 md:py-24">
      <div className="mx-auto max-w-7xl">
        <SectionHeader index={index} eyebrow={section.eyebrow} title={section.title} id={section.id} />

        <div className="grid gap-6 md:grid-cols-2">
          <blockquote data-reveal className="brut flex flex-col justify-between gap-10 rounded-3xl bg-yellow p-8 md:p-10">
            <p className="font-display text-3xl leading-[1.1] font-extrabold md:text-4xl">“{section.quote}”</p>
            <span aria-hidden className="text-7xl leading-none">✦</span>
          </blockquote>

          <div data-reveal className="brut space-y-4 rounded-3xl bg-card p-8 text-lg leading-relaxed md:p-10">
            {section.paragraphs.map((p) => (
              <p key={p}>{p}</p>
            ))}
          </div>

          <dl className="grid gap-6 sm:grid-cols-3 md:col-span-2">
            {section.stats.map((s, i) => (
              <div
                key={s.label}
                data-reveal
                style={pop(i + 1)}
                className="brut press flex flex-col-reverse justify-end gap-1 rounded-3xl p-8"
              >
                <dt className="text-lg font-bold">{s.label}</dt>
                <dd className="font-display text-7xl font-extrabold tracking-tight">
                  <span data-count>{s.value}</span>
                  {s.suffix}
                </dd>
              </div>
            ))}
          </dl>
        </div>
      </div>
    </section>
  );
}
