import { useState } from 'react';
import { ArrowUpRight } from 'lucide-react';
import { pop, type SectionOf } from '@/content';
import { asset, srcSet } from '@/shared/lib/assets';
import { Icon } from '@/shared/ui/Icon';
import { SectionHeader } from '@/shared/ui/SectionHeader';

/** Featured projects get a wide card; filter chips are the techs used by 2+ projects. */
export function Projects({ section, index }: { section: SectionOf<'projects'>; index: number }) {
  const [tag, setTag] = useState<string>();
  const counts = new Map<string, number>();
  section.items.forEach((p) => p.tech.forEach((t) => counts.set(t, (counts.get(t) ?? 0) + 1)));
  const tags = [...counts].filter(([, n]) => n > 1).map(([t]) => t);
  const shown = section.items.filter((p) => !tag || p.tech.includes(tag));

  return (
    <section id={section.id} aria-labelledby={`${section.id}-title`} className="px-6 py-16 md:py-24">
      <div className="mx-auto max-w-7xl">
        <div className="flex flex-wrap items-end justify-between gap-x-6">
          <SectionHeader index={index} eyebrow={section.eyebrow} title={section.title} id={section.id} mark="var(--accent)" />
          {section.moreLink && (
            <a href={section.moreLink.href} target="_blank" rel="noreferrer" className="brut-sm press mb-12 flex items-center gap-2 rounded-full bg-card px-5 py-2.5 font-bold md:mb-16">
              {section.moreLink.label} <ArrowUpRight size={18} aria-hidden />
            </a>
          )}
        </div>

        {tags.length > 0 && (
          <div role="group" aria-label="Filter by technology" className="mb-10 flex flex-wrap gap-2.5">
            {[undefined, ...tags].map((t) => (
              <button
                key={t ?? 'all'}
                type="button"
                aria-pressed={tag === t}
                onClick={() => setTag(t)}
                className="brut-sm rounded-full bg-card px-4 py-1.5 font-bold transition-colors hover:bg-yellow aria-pressed:bg-ink aria-pressed:text-bg"
              >
                {t ?? 'All'}
              </button>
            ))}
          </div>
        )}

        <ul className="grid grid-flow-dense gap-8 md:grid-cols-2 lg:grid-cols-3">
          {shown.map((p, i) => (
            <li
              key={p.name}
              className={`brut press group flex flex-col overflow-hidden rounded-3xl bg-card ${p.featured ? 'md:col-span-2 lg:grid lg:grid-cols-[1.35fr_1fr]' : ''}`}
            >
              <div className={`relative aspect-[16/9] overflow-hidden border-ink ${p.featured ? 'border-b-3 lg:aspect-auto lg:border-r-3 lg:border-b-0' : 'border-b-3'}`}>
                {p.image && (
                  <img
                    src={asset(p.image)}
                    srcSet={srcSet(p.image)}
                    sizes={p.featured ? '(min-width: 1024px) 50rem, 100vw' : '(min-width: 1024px) 26rem, (min-width: 768px) 50vw, 100vw'}
                    alt={`${p.name} preview`}
                    width={1280}
                    height={720}
                    loading="lazy"
                    decoding="async"
                    className="size-full object-cover transition-transform duration-500 group-hover:scale-105"
                  />
                )}
              </div>

              <div className="flex flex-1 flex-col p-7">
                {p.label && (
                  <span style={pop(i)} className="eyebrow mb-3 self-start rounded-md border-2 border-ink px-2 py-0.5">
                    {p.label}
                  </span>
                )}
                <h3 className={`font-display leading-tight font-extrabold ${p.featured ? 'text-3xl md:text-4xl' : 'text-2xl'}`}>{p.name}</h3>
                <p className="mt-3 flex-1 leading-relaxed text-muted">{p.description}</p>

                <ul className="mt-5 flex flex-wrap gap-2" aria-label="Technologies">
                  {p.tech.map((t) => (
                    <li key={t} className="rounded-full border-2 border-ink px-3 py-0.5 text-sm font-bold">{t}</li>
                  ))}
                </ul>

                {(p.links?.demo || p.links?.source) && (
                  <div className="mt-6 flex gap-3">
                    {p.links.demo && (
                      <a href={p.links.demo} target="_blank" rel="noreferrer" className="brut-sm flex items-center gap-1.5 rounded-full bg-lime px-4 py-1.5 font-bold">
                        Live <ArrowUpRight size={16} aria-hidden />
                        <span className="sr-only">: {p.name}</span>
                      </a>
                    )}
                    {p.links.source && (
                      <a href={p.links.source} target="_blank" rel="noreferrer" className="brut-sm flex items-center gap-1.5 rounded-full bg-card px-4 py-1.5 font-bold">
                        <Icon name="GitHub" icon="si:github" className="size-4" /> Source
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
