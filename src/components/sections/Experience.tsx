import { useRef, useState, type CSSProperties } from 'react';
import type { SectionOf } from '../../content';
import { asset, srcSet } from '../../lib/assets';
import { gsap, ScrollTrigger, useGSAP } from '../../lib/gsap';
import { SectionHeader } from '../ui/SectionHeader';

/**
 * Desktop: the section is `items × 100vh` tall with a sticky stage; scroll position picks the
 * active career stop (the 3D timeline follows the same progress). Mobile: a plain vertical list.
 */
export function Experience({ section, index }: { section: SectionOf<'experience'>; index: number }) {
  const root = useRef<HTMLElement>(null);
  const fill = useRef<HTMLSpanElement>(null);
  const trigger = useRef<ScrollTrigger>(null);
  const [active, setActive] = useState(0);
  const n = section.items.length;

  useGSAP(
    () => {
      gsap.matchMedia().add('(min-width: 768px)', () => {
        trigger.current = ScrollTrigger.create({
          trigger: root.current,
          start: 'top top',
          end: 'bottom bottom',
          onUpdate: (self) => {
            setActive(Math.min(n - 1, Math.floor(self.progress * n)));
            fill.current?.style.setProperty('transform', `scaleY(${self.progress})`);
          },
        });
      });
    },
    { scope: root },
  );

  const jumpTo = (i: number) => {
    const t = trigger.current;
    if (t) window.scrollTo({ top: t.start + ((i + 0.5) / n) * (t.end - t.start) });
  };

  return (
    <section
      ref={root}
      id={section.id}
      data-scene="experience"
      aria-labelledby={`${section.id}-title`}
      style={{ '--n': n } as CSSProperties}
      className="relative px-6 py-32 md:h-[calc(var(--n)*100svh)] md:py-0"
    >
      {/* Era artwork — crossfades behind the active stop (desktop). */}
      <div className="pointer-events-none absolute inset-0 hidden overflow-clip md:block" aria-hidden>
        <div className="sticky top-0 h-svh">
          {section.items.map((item, i) =>
            item.art ? (
              <img
                key={item.art}
                src={asset(item.art)}
                srcSet={srcSet(item.art)}
                sizes="100vw"
                alt=""
                loading="lazy"
                decoding="async"
                className="absolute inset-0 size-full object-cover opacity-0 transition-opacity duration-1000 [mask-image:radial-gradient(70%_70%_at_70%_50%,black,transparent)] data-[on=true]:opacity-30"
                data-on={i === active}
              />
            ) : null,
          )}
        </div>
      </div>

      <div className="relative mx-auto max-w-7xl md:sticky md:top-0 md:flex md:h-svh md:flex-col md:justify-center">
        <SectionHeader index={index} eyebrow={section.eyebrow} title={section.title} id={section.id} compact />

        <div className="grid gap-12 md:grid-cols-[220px_1fr] md:gap-20">
          {/* Timeline rail */}
          <ol className="relative hidden md:block" aria-label="Career stops">
            <span className="absolute top-2 bottom-2 left-[5px] w-px bg-line" aria-hidden />
            <span ref={fill} className="absolute top-2 bottom-2 left-[5px] w-px origin-top scale-y-0 bg-accent" aria-hidden />
            {section.items.map((item, i) => (
              <li key={item.company} className="relative pb-10 pl-8 last:pb-0">
                <button
                  type="button"
                  onClick={() => jumpTo(i)}
                  aria-current={i === active ? 'step' : undefined}
                  className="group text-left"
                >
                  <span
                    className="absolute top-1.5 left-0 size-[11px] rounded-full border border-muted bg-bg transition-all group-aria-[current]:scale-125 group-aria-[current]:border-transparent"
                    style={i <= active ? { background: item.color ?? 'var(--accent)' } : undefined}
                    aria-hidden
                  />
                  <span className="block text-xs tracking-widest text-muted transition-colors group-aria-[current]:text-accent">{item.period}</span>
                  <span className="block text-sm text-muted transition-colors group-hover:text-ink group-aria-[current]:text-ink">{item.company}</span>
                </button>
              </li>
            ))}
          </ol>

          {/* Cards: stacked in one grid cell on desktop, listed on mobile. */}
          <div className="grid gap-8 md:[&>*]:col-start-1 md:[&>*]:row-start-1">
            {section.items.map((item, i) => (
              <article
                key={item.company}
                data-active={i === active}
                className="rounded-3xl border border-line bg-card/50 p-8 backdrop-blur-md transition-all duration-700 md:p-12 md:data-[active=false]:pointer-events-none md:data-[active=false]:translate-y-8 md:data-[active=false]:opacity-0"
              >
                <p className="mb-3 text-xs tracking-[0.25em] text-accent">{item.period}</p>
                <h3 className="font-display text-3xl font-bold md:text-5xl">{item.role}</h3>
                <p className="mt-2 text-lg text-muted">
                  {item.company}
                  {item.location && ` · ${item.location}`}
                </p>
                <ul className="mt-8 space-y-3 text-muted">
                  {item.points.map((p) => (
                    <li key={p} className="flex gap-3">
                      <span className="text-accent" aria-hidden>▹</span>
                      <span>{p}</span>
                    </li>
                  ))}
                </ul>
                {item.tech && (
                  <ul className="mt-8 flex flex-wrap gap-2" aria-label="Technologies">
                    {item.tech.map((t) => (
                      <li key={t} className="rounded-full border border-line px-3 py-1 text-xs text-ink/80">{t}</li>
                    ))}
                  </ul>
                )}
              </article>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
