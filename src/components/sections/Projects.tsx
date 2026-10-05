import { useEffect, useRef } from 'react';
import { ArrowUpRight } from 'lucide-react';
import { site, type SectionOf } from '../../content';
import { asset, srcSet } from '../../lib/assets';
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

  // When the 3D figure deals this section's cards, each card waits (hidden) for its thrown 3D card to land.
  const dealing = !!site.avatar?.enabled && site.avatar.deal?.section === section.type;
  const flyer = useRef<HTMLDivElement>(null);
  useDealing(dealing, track, flyer);

  useGSAP(
    () => {
      gsap.matchMedia().add(`(min-width: 1024px) and ${MOTION_OK}`, () => {
        const section = root.current!;
        const list = track.current!;
        const distance = () => list.scrollWidth - window.innerWidth;
        const size = () => void (section.style.height = `${distance() + window.innerHeight * 1.2}px`);
        size();

        // The card closest to the middle of the screen is the highlight (see [data-active] in index.css).
        const cards = Array.from(list.children) as HTMLElement[];
        const highlight = () => {
          const mid = window.innerWidth * 0.55;
          let best: HTMLElement | undefined;
          let bestD = Infinity;
          for (const c of cards) {
            const r = c.getBoundingClientRect();
            const d = Math.abs(r.left + r.width / 2 - mid);
            if (d < bestD) [best, bestD] = [c, d];
          }
          cards.forEach((c) => c.toggleAttribute('data-active', c === best));
        };

        gsap.to(list, {
          x: () => -distance(),
          ease: 'none',
          onUpdate: highlight,
          scrollTrigger: { trigger: section, start: 'top top', end: 'bottom bottom', scrub: 0.6, invalidateOnRefresh: true, onRefreshInit: size, onRefresh: highlight },
        });
        return () => {
          section.style.height = '';
          cards.forEach((c) => c.removeAttribute('data-active'));
        };
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

        <ul ref={track} className={`grid gap-6 px-6 md:grid-cols-2 lg:flex lg:w-max lg:gap-8 lg:pr-[10vw] ${dealing ? 'lg:pl-[24vw]' : 'lg:pl-[max(1.5rem,calc((100vw-80rem)/2+1.5rem))]'}`}>
          {section.items.map((p, i) => (
            <li
              key={p.name}
              data-reveal={dealing ? undefined : true}
              data-deal-index={dealing ? i : undefined}
              className="project-card group flex flex-col overflow-hidden rounded-3xl border border-line bg-card/70 backdrop-blur-md hover:border-accent/50 lg:w-[min(30rem,70vw)]"
            >
              <div data-deal-target className="relative aspect-[16/9] overflow-hidden bg-surface">
                {p.image && (
                  <img
                    src={asset(p.image)}
                    srcSet={srcSet(p.image)}
                    sizes="(min-width: 1024px) 30rem, (min-width: 768px) 50vw, 100vw"
                    alt={`${p.name} preview`}
                    width={1280}
                    height={720}
                    loading="lazy"
                    decoding="async"
                    className="size-full object-cover transition-transform duration-700 group-hover:scale-105"
                  />
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

      {/* The card in flight: thrown from the figure's hand, drawn above the page so it passes in front of the cards. */}
      {dealing && (
        <div ref={flyer} aria-hidden className="deal-flyer pointer-events-none fixed top-0 left-0 z-40 hidden [perspective:1200px]">
          <div data-flyer-card className="relative size-full [transform-style:preserve-3d]">
            <img alt="" className="absolute inset-0 size-full rounded-xl object-cover shadow-2xl shadow-accent/20 [backface-visibility:hidden]" />
            <div className="absolute inset-0 rounded-xl border-4 border-accent bg-card [backface-visibility:hidden] [transform:rotateY(180deg)]" />
          </div>
        </div>
      )}
    </section>
  );
}

/**
 * Page side of the card deal (3D side: three/scenes/Avatar.tsx). Events on window:
 *   deal:request {index}           page → 3D: a card's slot scrolled into view; please throw its card
 *   deal:release {index, x, y, w}  3D → page: card left the hand at screen (x, y), w px wide → fly it to its slot
 *   deal:landed  {index}           flight done (or 3D gave up) → flip the real card in
 * The flight is a DOM element above the page, so it passes in front of the cards. Cards are only hidden while
 * <html data-deal> is set; anything not landed in time (5 s + 2.5 s per card queued ahead) is revealed anyway.
 */
function useDealing(
  enabled: boolean,
  track: React.RefObject<HTMLUListElement | null>,
  flyerRef: React.RefObject<HTMLDivElement | null>,
) {
  useEffect(() => {
    const list = track.current;
    const flyer = flyerRef.current;
    const deal = site.avatar?.deal;
    if (!enabled || !list || !flyer || !deal) return;
    const cards = Array.from(list.querySelectorAll<HTMLElement>('[data-deal-index]'));
    const flyerCard = flyer.querySelector<HTMLElement>('[data-flyer-card]')!;
    const flyerImg = flyer.querySelector('img')!;
    const timers = new Map<number, number>();
    const section = list.closest('section')!;

    const reveal = (card: HTMLElement, animate: boolean) => {
      if (card.hasAttribute('data-dealt')) return;
      card.setAttribute('data-dealt', '');
      if (animate) gsap.fromTo(card, { rotationY: -75, opacity: 0, transformPerspective: 1200 }, { rotationY: 0, opacity: 1, duration: 0.55, ease: 'back.out(1.4)', clearProps: 'transform,opacity' });
    };
    const land = (i: number) => window.dispatchEvent(new CustomEvent('deal:landed', { detail: { index: i } }));

    const onLanded = (e: Event) => {
      const i = (e as CustomEvent<{ index: number }>).detail.index;
      clearTimeout(timers.get(i));
      timers.delete(i);
      if (cards[i]) reveal(cards[i], true);
    };

    let flight: gsap.core.Tween | undefined;
    const onRelease = (e: Event) => {
      const { index, x, y, w } = (e as CustomEvent<{ index: number; x: number; y: number; w: number }>).detail;
      const slot = cards[index]?.querySelector<HTMLElement>('[data-deal-target]');
      if (!slot) return land(index);
      flight?.progress(1); // finish any previous flight first
      flyerImg.src = slot.querySelector('img')?.currentSrc ?? '';
      flyer.classList.remove('hidden');
      const aspect = slot.offsetWidth / slot.offsetHeight || 16 / 9;
      const state = { p: 0 };
      flight = gsap.to(state, {
        p: 1,
        duration: deal.flight,
        ease: 'power2.out',
        onUpdate() {
          const r = slot.getBoundingClientRect(); // live: the track keeps moving while the card flies
          const out = section.getBoundingClientRect();
          if (out.bottom < 0 || out.top > innerHeight) return void flight?.progress(1); // scrolled away → land now
          const p = state.p;
          const q = 1 - p;
          const ex = r.left + r.width / 2;
          const ey = r.top + r.height / 2;
          const mx = (x + ex) / 2;
          const my = Math.min(y, ey) - deal.arc * innerHeight; // arc apex above both ends
          const cx = q * q * x + 2 * q * p * mx + p * p * ex;
          const cy = q * q * y + 2 * q * p * my + p * p * ey;
          const width = w + (r.width - w) * p;
          const height = width / aspect;
          flyer.style.width = `${width}px`;
          flyer.style.height = `${height}px`;
          flyer.style.transform = `translate(${cx - width / 2}px, ${cy - height / 2}px)`;
          // Leaves the hand showing its back; `spins` turns + a half turn later it lands face up.
          flyerCard.style.transform = `rotateY(${q * (deal.spins * 360 + 180)}deg) rotateX(${q * 25}deg)`;
        },
        onComplete() {
          flyer.classList.add('hidden');
          land(index);
        },
      });
    };

    window.addEventListener('deal:landed', onLanded);
    window.addEventListener('deal:release', onRelease);

    const io = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          const card = entry.target as HTMLElement;
          if (!entry.isIntersecting || card.hasAttribute('data-dealt') || card.hasAttribute('data-requested')) continue;
          const index = Number(card.dataset.dealIndex);
          if (!('deal' in document.documentElement.dataset)) {
            reveal(card, false); // dealer not active (mobile / no 3D / still loading) → just show it
            continue;
          }
          const ahead = timers.size; // cards still waiting to land
          card.setAttribute('data-requested', '');
          window.dispatchEvent(new CustomEvent('deal:request', { detail: { index } }));
          timers.set(index, window.setTimeout(() => reveal(card, true), 5000 + ahead * 2500));
        }
      },
      { threshold: 0.35 },
    );
    cards.forEach((c) => io.observe(c));

    return () => {
      io.disconnect();
      flight?.kill();
      window.removeEventListener('deal:landed', onLanded);
      window.removeEventListener('deal:release', onRelease);
      timers.forEach(clearTimeout);
    };
  }, [enabled, track, flyerRef]);
}
