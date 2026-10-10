import { useRef } from 'react';
import { site, type SectionOf } from '@/content';
import { AvatarStage } from '@/features/avatar';
import { gsap, MOTION_OK, useGSAP } from '@/shared/lib/gsap';

const STICKERS = [
  'top-[4%] left-0 -rotate-8 bg-yellow md:-left-[4%]',
  'top-[42%] left-0 rotate-4 bg-card md:-left-[10%]',
  'bottom-[14%] right-0 rotate-6 bg-orange md:-right-[5%]',
  'top-[10%] right-0 rotate-3 bg-mint md:-right-[2%]',
];

export function Hero({ section }: { section: SectionOf<'hero'> }) {
  const root = useRef<HTMLElement>(null);
  const roleRef = useRef<HTMLSpanElement>(null);
  const { person } = site;
  const { primaryCta, secondaryCta } = section;

  useGSAP(
    () => {
      gsap.matchMedia().add(MOTION_OK, () => {
        gsap.from('[data-hero-in]', { y: 40, opacity: 0, duration: 0.9, stagger: 0.08, ease: 'back.out(1.6)', delay: 0.1 });
        gsap.from('[data-sticker]', { scale: 0, duration: 0.6, stagger: 0.12, ease: 'back.out(2.5)', delay: 0.6 });

        // Rotate through roles: slide current out, swap text, slide next in.
        const el = roleRef.current!;
        const roles = person.roles;
        const tl = gsap.timeline({ repeat: -1 });
        roles.forEach((_, i) => {
          tl.to(el, { yPercent: -100, opacity: 0, duration: 0.35, ease: 'power2.in', delay: 2.2 })
            .call(() => void (el.textContent = roles[(i + 1) % roles.length]!))
            .fromTo(el, { yPercent: 100, opacity: 0 }, { yPercent: 0, opacity: 1, duration: 0.45, ease: 'back.out(2)' });
        });
      });
    },
    { scope: root },
  );

  return (
    <section ref={root} id={section.id} className="relative px-6 pt-32 pb-20 md:pt-36">
      <div className="mx-auto grid max-w-7xl items-center gap-14 lg:grid-cols-[1.2fr_1fr]">
        <div>
          {person.availability && (
            <p data-hero-in className="brut-sm inline-flex items-center gap-2 rounded-full bg-lime px-4 py-1.5 font-bold">
              <span className="relative flex size-2.5" aria-hidden>
                <span className="absolute inline-flex size-full animate-ping rounded-full bg-ink opacity-50" />
                <span className="relative inline-flex size-2.5 rounded-full bg-ink" />
              </span>
              {person.availability}
            </p>
          )}

          <h1 className="mt-7 font-display text-[clamp(3.4rem,10vw,9rem)] leading-[0.9] font-extrabold tracking-[-0.03em]">
            <span data-hero-in className="block">{person.firstName}</span>
            <span data-hero-in className="brut mt-3 inline-block -rotate-2 rounded-[0.2em] bg-accent px-[0.12em] pb-[0.06em] text-white">
              {person.lastName}
            </span>
          </h1>

          <p data-hero-in className="mt-7 flex h-9 items-center overflow-hidden text-xl font-bold md:text-2xl" aria-hidden>
            <span ref={roleRef} className="inline-block bg-[linear-gradient(transparent_55%,var(--yellow)_55%)]">{person.roles[0]}</span>
          </p>
          <p className="sr-only">{person.roles.join(', ')}</p>

          <div data-hero-in className="mt-9 flex flex-col gap-4 sm:flex-row">
            <a href={primaryCta.href} data-track="cta_click" className="brut press rounded-full bg-lime px-8 py-4 text-center text-lg font-bold">
              {primaryCta.label} ↓
            </a>
            {secondaryCta && (
              <a
                href={secondaryCta.href}
                download={secondaryCta.href.endsWith('.pdf') || undefined}
                data-track={secondaryCta.href.includes('/cv/') ? undefined : 'cta_click'}
                className="brut press rounded-full bg-card px-8 py-4 text-center text-lg font-bold"
              >
                {secondaryCta.label}
              </a>
            )}
          </div>
        </div>

        <AvatarStage>
          {section.stickers?.map((s, i) => (
            <span key={s} data-sticker className={`brut-sm pointer-events-none absolute rounded-xl px-3 py-1.5 font-bold whitespace-nowrap md:text-lg ${STICKERS[i % STICKERS.length]}`}>
              {s}
            </span>
          ))}
        </AvatarStage>
      </div>
    </section>
  );
}
