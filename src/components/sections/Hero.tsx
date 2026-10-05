import { useRef } from 'react';
import { ArrowDown } from 'lucide-react';
import { site, type SectionOf } from '../../content';
import { asset, srcSet } from '../../lib/assets';
import { gsap, MOTION_OK, useGSAP } from '../../lib/gsap';

export function Hero({ section }: { section: SectionOf<'hero'> }) {
  const root = useRef<HTMLElement>(null);
  const roleRef = useRef<HTMLSpanElement>(null);
  const { person, avatar } = site;
  // With the 3D figure on the right, desktop text aligns left and the name shrinks to leave room.
  const withAvatar = !!avatar?.enabled && !!avatar.poses.hero;
  const { primaryCta, secondaryCta } = section;

  useGSAP(
    () => {
      gsap.matchMedia().add(MOTION_OK, () => {
        gsap.from('[data-hero-in]', { yPercent: 110, opacity: 0, duration: 1.1, stagger: 0.1, ease: 'power4.out', delay: 0.15 });

        // Rotate through roles: slide current out, swap text, slide next in.
        const el = roleRef.current!;
        const roles = person.roles;
        const tl = gsap.timeline({ repeat: -1 });
        roles.forEach((_, i) => {
          tl.to(el, { yPercent: -100, opacity: 0, duration: 0.4, ease: 'power2.in', delay: 2.2 })
            .call(() => void (el.textContent = roles[(i + 1) % roles.length]!))
            .fromTo(el, { yPercent: 100, opacity: 0 }, { yPercent: 0, opacity: 1, duration: 0.5, ease: 'power3.out' });
        });

        // Content drifts up and fades as the hero scrolls away; the 3D core takes over.
        gsap.to('[data-hero-content]', {
          yPercent: -25,
          opacity: 0,
          ease: 'none',
          scrollTrigger: { trigger: root.current, start: 'top top', end: 'bottom top', scrub: true },
        });
      });
    },
    { scope: root },
  );

  return (
    <section
      ref={root}
      id={section.id}
      data-scene="hero"
      // Mobile + figure: content sits high so the figure can stand below the buttons.
      className={`relative flex min-h-svh justify-center px-6 ${withAvatar ? 'items-start pt-28 md:items-center md:pt-20' : 'items-center pt-20'}`}
    >
      <div
        data-hero-content
        className={`flex w-full flex-col items-center text-center ${withAvatar ? 'max-w-7xl lg:items-start lg:text-left' : 'max-w-5xl'}`}
      >
        {person.availability && (
          <div className="mb-8 overflow-hidden">
            <p data-hero-in className="flex items-center gap-4 text-xs uppercase tracking-[0.3em] text-accent">
              <span className="relative flex size-2" aria-hidden>
                <span className="absolute inline-flex size-full animate-ping rounded-full bg-accent opacity-60" />
                <span className="relative inline-flex size-2 rounded-full bg-accent" />
              </span>
              {person.availability}
            </p>
          </div>
        )}

        <h1
          className={`font-display text-[clamp(2rem,8.2vw,8rem)] leading-[0.92] font-extrabold tracking-tighter ${withAvatar ? 'lg:text-[clamp(3rem,6.2vw,7rem)]' : ''}`}
        >
          <span className="block overflow-hidden pb-[0.06em]">
            <span data-hero-in className="block">{person.firstName}</span>
          </span>
          <span className="block overflow-hidden pb-[0.06em]">
            <span data-hero-in className="block text-accent">{person.lastName}</span>
          </span>
        </h1>

        <p className="mt-8 h-8 overflow-hidden text-lg text-muted md:text-2xl" aria-hidden>
          <span data-hero-in className="inline-block">
            <span ref={roleRef} className="inline-block text-ink">{person.roles[0]}</span>
          </span>
        </p>
        <p className="sr-only">{person.roles.join(', ')}</p>

        <div className="mt-12 w-full overflow-hidden p-2 sm:w-auto">
          <div data-hero-in className="flex flex-col items-center gap-4 sm:flex-row sm:gap-6">

          <a href={primaryCta.href} className="w-full rounded-full bg-accent px-8 py-4 text-center font-medium text-bg transition-transform hover:scale-[1.04] active:scale-95 sm:w-auto">
            {primaryCta.label}
          </a>
          {secondaryCta && (
            <a
              href={secondaryCta.href}
              download={secondaryCta.href.endsWith('.pdf') || undefined}
              className="w-full rounded-full border border-line bg-surface/50 px-8 py-4 text-center font-medium backdrop-blur-sm transition hover:scale-[1.04] hover:border-muted active:scale-95 sm:w-auto"
            >
              {secondaryCta.label}
            </a>
          )}
          </div>
        </div>
      </div>

      {withAvatar && avatar.poster && (
        <img
          src={asset(avatar.poster)}
          srcSet={srcSet(avatar.poster)}
          sizes="40vw"
          alt={avatar.alt}
          width={800}
          height={1100}
          loading="lazy" // hidden below lg → never fetched on phones
          decoding="async"
          className="avatar-poster pointer-events-none absolute right-[5%] bottom-[4svh] hidden h-[78svh] w-auto lg:block"
        />
      )}

      <a href={`#${site.sections.find((s) => s.type !== 'hero' && !s.hidden)?.id ?? ''}`} className={`absolute bottom-8 left-1/2 -translate-x-1/2 flex-col items-center gap-2 text-xs uppercase tracking-[0.3em] text-muted hover:text-ink ${withAvatar ? 'hidden md:flex' : 'flex'}`}>
        Scroll
        <ArrowDown size={16} className="animate-bounce" aria-hidden />
      </a>
    </section>
  );
}
