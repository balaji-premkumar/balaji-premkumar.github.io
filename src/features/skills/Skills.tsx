import { pop, type SectionOf } from '@/content';
import { Icon } from '@/shared/ui/Icon';
import { SectionHeader } from '@/shared/ui/SectionHeader';

/** One colour card per group; white chips that lift on hover. */
export function Skills({ section, index }: { section: SectionOf<'skills'>; index: number }) {
  return (
    <section id={section.id} aria-labelledby={`${section.id}-title`} className="px-6 py-16 md:py-24">
      <div className="mx-auto max-w-7xl">
        <SectionHeader index={index} eyebrow={section.eyebrow} title={section.title} id={section.id} mark="var(--lime)" />

        <div className="columns-1 gap-6 md:columns-2 xl:columns-3">
          {section.groups.map((group, i) => (
            <div key={group.label} data-reveal style={pop(i + 3)} className="brut mb-6 break-inside-avoid rounded-3xl p-7">
              <h3 className="mb-5 flex items-center justify-between gap-3 font-display text-2xl font-extrabold">
                {group.label}
                <span className="brut-sm eyebrow rounded-md bg-card px-2 py-0.5 text-ink">{String(group.items.length).padStart(2, '0')}</span>
              </h3>
              <ul className="flex flex-wrap gap-2.5">
                {group.items.map((item) => (
                  <li key={item.name} className="brut-sm flex items-center gap-2 rounded-full bg-card py-1.5 pr-4 pl-2 text-sm font-bold text-ink transition-transform hover:-translate-y-1 hover:-rotate-2">
                    <Icon name={item.name} icon={item.icon} className="size-5" />
                    {item.name}
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
