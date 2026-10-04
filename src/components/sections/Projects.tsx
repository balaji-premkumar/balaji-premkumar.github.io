import { useRef } from 'react';
import { ArrowUpRight } from 'lucide-react';
import type { SectionOf } from '../../content';
import { gsap, MOTION_OK, useGSAP } from '../../lib/gsap';
import { Icon } from '../ui/Icon';
import { SectionHeader } from '../ui/SectionHeader';

/**
 * Desktop: sticky stage + horizontal track driven by vertical scroll. The section's height is
 * set to "track overflow + one viewport" so the scroll distance matches the track length.
 * Mobile / reduced motion: a plain vertical grid.
 */
export function Projects({ section, index }: { section: SectionOf<'projects'>; index: number }) {
  const root = useRef<HTMLElement>(null);
  const track = useRef<HTMLUListElement>(null);

  useGSAP(
    () => {
      gsap.matchMedia().add(`(min-width: 1024px) and ${MOTION_OK}`, () => {
        const section = root.current!;
        const list = track.current!;
        const distance = () => list.scrollWidth - window.innerWidth;
        const size = () => void (section.style.height = `${distance() + window.innerHeight * 1.2}px`);
        size();

        gsap.to(list, {
          x: () => -distance(),
          ease: 'none',
          scrollTrigger: { trigger: section, start: 'top top', end: 'bottom bottom', scrub: 0.6, invalidateOnRefresh: true, onRefreshInit: size },
        });
        return () => void (section.style.height = '');
      });
    },
    { scope: root },
  );

  return (
    <section ref={root} id={section.id} data-scene="projects" aria-labelledby={`${section.id}-title`} className="relative py-32 lg:py-0">
      <div className="lg:sticky lg:top-0 lg:flex lg:h-svh lg:flex-col lg:justify-center lg:overflow-hidden">
        <div className="mx-auto flex w-full max-w-7xl flex-wrap items-end justify-between gap-6 px-6">
          <SectionHeader index={index} eyebrow={section.eyebrow} title={section.title} id={section.id} compact />
          {section.moreLink && (
            <a href={section.moreLink.href} target="_blank" rel="noreferrer" className="mb-10 flex items-center gap-2 text-sm uppercase tracking-[0.2em] text-accent hover:text-ink md:mb-12">
              {section.moreLink.label} <ArrowUpRight size={16} aria-hidden />
            </a>
          )}
        </div>

        <ul ref={track} className="grid gap-6 px-6 md:grid-cols-2 lg:flex lg:w-max lg:gap-8 lg:pr-[10vw] lg:pl-[max(1.5rem,calc((100vw-80rem)/2+1.5rem))]">
          {section.items.map((p) => (
            <li key={p.name} data-reveal className="group flex flex-col overflow-hidden rounded-3xl border border-line bg-card/70 backdrop-blur-md transition-colors hover:border-accent/50 lg:w-[min(30rem,70vw)]">
              <div className="relative aspect-[16/9] overflow-hidden bg-surface">
                {p.image && (
                  <img src={p.image} alt={`${p.name} preview`} loading="lazy" decoding="async" className="size-full object-cover transition-transform duration-700 group-hover:scale-105" />
                )}
                {p.label && (
                  <span className="absolute top-4 left-4 rounded-full bg-bg/80 px-3 py-1 text-[0.65rem] uppercase tracking-[0.2em] text-accent backdrop-blur">
                    {p.label}
                  </span>
                )}
              </div>

              <div className="flex flex-1 flex-col p-8">
                <h3 className="font-display text-2xl font-bold">{p.name}</h3>
                <p className="mt-3 flex-1 leading-relaxed text-muted">{p.description}</p>

                <ul className="mt-6 flex flex-wrap gap-2" aria-label="Technologies">
                  {p.tech.map((t) => (
                    <li key={t} className="rounded-full border border-line px-3 py-1 text-xs text-ink/80">{t}</li>
                  ))}
                </ul>

                {(p.links?.demo || p.links?.source) && (
                  <div className="mt-6 flex gap-6 border-t border-line pt-6 text-sm">
                    {p.links.demo && (
                      <a href={p.links.demo} target="_blank" rel="noreferrer" className="flex items-center gap-1.5 text-ink hover:text-accent">
                        Live <ArrowUpRight size={16} aria-hidden />
                        <span className="sr-only">: {p.name}</span>
                      </a>
                    )}
                    {p.links.source && (
                      <a href={p.links.source} target="_blank" rel="noreferrer" className="flex items-center gap-1.5 text-ink hover:text-accent">
                        <Icon name="GitHub" icon="si:github/ffffff" className="size-4" /> Source
                        <span className="sr-only">: {p.name}</span>
                      </a>
                    )}
                  </div>
                )}
              </div>
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}
