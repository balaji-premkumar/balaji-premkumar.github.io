import { sections, type SectionOf } from '../../content';

const allSkills = () => sections.flatMap((s) => (s.type === 'skills' ? s.groups.flatMap((g) => g.items.map((i) => i.name)) : []));

/** Tilted ink strip with words scrolling across (CSS animation; pauses on hover, still with reduced motion). */
export function Marquee({ section }: { section: SectionOf<'marquee'> }) {
  const items = section.items ?? allSkills();
  const row = (hidden?: boolean) => (
    <ul aria-hidden={hidden} className="flex shrink-0 items-center">
      {items.map((t, i) => (
        <li key={t} className={`px-5 font-display text-2xl font-extrabold whitespace-nowrap md:text-3xl ${i % 2 ? 'text-bg' : 'text-lime'}`}>
          {t}
          <span className="ml-10 text-accent" aria-hidden>✦</span>
        </li>
      ))}
    </ul>
  );

  return (
    <section id={section.id} aria-label="Tech stack" className="relative -mx-4 my-10 -rotate-[1.5deg] overflow-hidden border-y-3 border-ink bg-ink py-4">
      <div className="marquee-track flex w-max">
        {row()}
        {row(true)}
      </div>
    </section>
  );
}
