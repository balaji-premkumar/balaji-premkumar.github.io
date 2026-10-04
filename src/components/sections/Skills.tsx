import type { SectionOf } from '../../content';
import { Icon } from '../ui/Icon';
import { SectionHeader } from '../ui/SectionHeader';

export function Skills({ section, index }: { section: SectionOf<'skills'>; index: number }) {
  return (
    <section id={section.id} data-scene="skills" aria-labelledby={`${section.id}-title`} className="relative px-6 py-32 md:py-48">
      <div className="mx-auto max-w-7xl">
        <SectionHeader index={index} eyebrow={section.eyebrow} title={section.title} id={section.id} />

        <div className="columns-1 gap-6 md:columns-2 xl:columns-3">
          {section.groups.map((group) => (
            <div key={group.label} data-reveal className="mb-6 break-inside-avoid rounded-3xl border border-line bg-card/60 p-8 backdrop-blur-md">
              <h3 className="mb-6 flex items-center justify-between text-xs uppercase tracking-[0.25em] text-accent">
                {group.label}
                <span className="text-muted">{String(group.items.length).padStart(2, '0')}</span>
              </h3>
              <ul className="flex flex-wrap gap-2">
                {group.items.map((item) => (
                  <li
                    key={item.name}
                    className="flex items-center gap-2 rounded-full border border-line bg-bg/60 py-1.5 pr-4 pl-2 text-sm transition-colors hover:border-accent/60"
                  >
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
