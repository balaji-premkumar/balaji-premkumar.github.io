import { lazy, Suspense, useMemo, useRef, useSyncExternalStore } from 'react';
import { pop, type SectionOf } from '../../content';
import { activeCard, locate, plan, scrollScreens } from '../../lib/careerPlan';
import { gsap, MOTION_OK, useGSAP } from '../../lib/gsap';
import { canRender3D } from '../../lib/webgl';
import { SectionHeader } from '../ui/SectionHeader';

const CareerRoad = lazy(() => import('../../three/CareerRoad'));

type Props = { section: SectionOf<'experience'>; index: number };

/** The career road where 3D can run; the card timeline otherwise (SSR, no WebGL, reduced motion). */
let probed: boolean | undefined;
const noSubscribe = () => () => {};
export function Experience(props: Props) {
  // Server and hydration render the timeline; the client switches once it knows WebGL is there.
  const road = useSyncExternalStore(noSubscribe, () => (probed ??= canRender3D()), () => false);
  return road ? <Road {...props} /> : <Timeline {...props} />;
}

/**
 * Pinned scroll story, oldest job first: the figure walks the road, lifts each job's board up from the ground next to
 * its year milestone, then walks on. GSAP scrubs one progress value; the 3D scene and these cards both read it.
 */
function Road({ section, index }: Props) {
  const root = useRef<HTMLElement>(null);
  const progress = useRef(0);
  const items = section.items;
  const segments = useMemo(() => plan(items.length), [items.length]);
  const years = items.map((it) => it.period.match(/\d{4}/)?.[0] ?? it.period);

  useGSAP(
    () => {
      const cards = gsap.utils.toArray<HTMLElement>('[data-card]', root.current);
      const marks = gsap.utils.toArray<HTMLElement>('[data-mark]', root.current);
      const finish = root.current!.querySelector<HTMLElement>('[data-finish]');
      const state = { p: 0 };
      let shown = -2;
      const sync = () => {
        progress.current = state.p;
        const at = locate(segments, state.p);
        const card = activeCard(at);
        if (card !== shown) {
          shown = card;
          cards.forEach((c, i) => c.toggleAttribute('data-active', i === card));
        }
        marks.forEach((m, i) => m.toggleAttribute('data-done', i < at.stop || (i === at.stop && at.phase !== 'walk')));
        finish?.toggleAttribute('data-active', at.phase === 'finish' && at.t > 0.35);
      };
      gsap.matchMedia().add(MOTION_OK, () => {
        gsap.to(state, {
          p: 1,
          ease: 'none',
          onUpdate: sync,
          scrollTrigger: {
            trigger: root.current,
            start: 'top top',
            end: `+=${Math.round(scrollScreens(items.length) * 75)}%`,
            pin: true,
            scrub: 0.6,
            anticipatePin: 1,
          },
        });
      });
    },
    { scope: root, dependencies: [segments] },
  );

  return (
    <section ref={root} id={section.id} aria-labelledby={`${section.id}-title`} className="relative h-svh overflow-hidden">
      <Suspense fallback={null}>
        <CareerRoad items={items} progress={progress} />
      </Suspense>

      <header className="pointer-events-none absolute top-0 left-0 px-6 pt-20 md:px-10 md:pt-24">
        <p className="eyebrow mb-2 flex items-center gap-3">
          <span className="brut-sm rounded-md bg-ink px-2 py-0.5 text-bg">{String(index).padStart(2, '0')}</span>
          {section.eyebrow}
        </p>
        <h2 id={`${section.id}-title`} className="font-display text-4xl leading-none font-extrabold tracking-tight md:text-6xl">
          {section.title}.
        </h2>
        <ol className="mt-4 flex gap-1.5" aria-hidden>
          {years.map((y) => (
            <li key={y} data-mark className="brut-sm eyebrow rounded-full bg-card px-2.5 py-0.5 transition-colors data-[done]:bg-ink data-[done]:text-bg">
              {y}
            </li>
          ))}
        </ol>
      </header>

      <ol>
        {items.map((item, i) => {
          const colors = pop(i, item.color);
          return (
            <li
              key={item.company}
              data-card
              className="brut pointer-events-none absolute inset-x-4 bottom-4 max-h-[40svh] translate-y-6 overflow-y-auto rounded-3xl p-5 opacity-0 transition duration-300 data-[active]:pointer-events-auto data-[active]:translate-y-0 data-[active]:opacity-100 md:inset-x-auto md:top-1/2 md:right-8 md:bottom-auto md:max-h-[80svh] md:w-[min(26rem,34vw)] md:-translate-y-1/2 md:translate-x-6 md:p-7 md:data-[active]:-translate-y-1/2 md:data-[active]:translate-x-0"
              style={colors}
            >
              {/* Role, company and period are on the 3D board; repeat them only for screen readers. */}
              <h3 className="sr-only">
                {item.role}, {item.company}
                {item.location && `, ${item.location}`}, {item.period}
              </h3>
              {section.pointsLabel && (
                <p className="eyebrow" aria-hidden>
                  {section.pointsLabel}
                </p>
              )}
              <ul className="mt-3 space-y-1.5 text-sm md:text-base">
                {item.points.map((p) => (
                  <li key={p} className="flex gap-2.5">
                    <span aria-hidden>✦</span>
                    <span>{p}</span>
                  </li>
                ))}
              </ul>
              {item.tech && (
                <ul className="mt-4 flex flex-wrap gap-1.5" aria-label="Technologies">
                  {item.tech.map((t) => (
                    <li key={t} className="rounded-full border-2 border-current px-2.5 py-0.5 text-xs font-bold">
                      {t}
                    </li>
                  ))}
                </ul>
              )}
            </li>
          );
        })}
      </ol>

      {section.finish && (
        <p
          data-finish
          className="brut pointer-events-none absolute inset-x-4 bottom-6 rotate-[-2deg] rounded-2xl bg-yellow px-6 py-4 text-center font-display text-3xl font-extrabold opacity-0 transition duration-500 data-[active]:opacity-100 md:inset-x-auto md:top-1/2 md:right-12 md:bottom-auto md:-translate-y-1/2 md:text-5xl"
        >
          {section.finish} 🎉
        </p>
      )}
    </section>
  );
}

/** Newest first, one colour card per stop on a thick rail that fills as you scroll. */
function Timeline({ section, index }: Props) {
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
