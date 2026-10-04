import { ArrowUpRight, Phone } from 'lucide-react';
import { site, telHref, type SectionOf } from '../../content';
import { Icon } from '../ui/Icon';

export function Contact({ section, index }: { section: SectionOf<'contact'>; index: number }) {
  const words = section.title.split(' ');
  const last = words.pop();

  return (
    <section id={section.id} data-scene="contact" aria-labelledby={`${section.id}-title`} className="relative flex min-h-svh items-center px-6 py-32">
      <div className="mx-auto w-full max-w-5xl text-center">
        <p data-reveal className="mb-6 text-xs uppercase tracking-[0.3em] text-accent">
          {String(index).padStart(2, '0')} — {section.eyebrow}
        </p>
        <h2 id={`${section.id}-title`} data-reveal className="font-display font-extrabold leading-[0.9] tracking-tighter" style={{ fontSize: 'clamp(2.25rem, 9vw, 8.5rem)' }}>
          {words.join(' ')} <span className="text-accent">{last}.</span>
        </h2>
        <p data-reveal className="mx-auto mt-8 max-w-2xl text-lg leading-relaxed text-muted">{section.text}</p>

        {section.cta && (
          <div data-reveal className="mt-12">
            <a href={section.cta.href} className="inline-flex items-center gap-3 rounded-full bg-accent px-10 py-5 text-lg font-medium text-bg transition-transform hover:scale-[1.04] active:scale-95">
              {section.cta.label} <ArrowUpRight size={20} aria-hidden />
            </a>
          </div>
        )}

        <ul data-reveal className="mt-16 flex flex-wrap justify-center gap-4">
          {site.person.phone && (
            <li>
              <a
                href={telHref(site.person.phone)}
                className="flex items-center gap-3 rounded-full border border-line bg-card/60 px-6 py-3 backdrop-blur-md transition-colors hover:border-accent/60"
              >
                <Phone size={18} className="text-accent" aria-hidden />
                <span className="sr-only">Phone: </span>
                {site.person.phone}
              </a>
            </li>
          )}
          {site.person.socials.map((s) => (
            <li key={s.label}>
              <a
                href={s.href}
                target={s.href.startsWith('http') ? '_blank' : undefined}
                rel="noreferrer"
                className="flex items-center gap-3 rounded-full border border-line bg-card/60 px-6 py-3 backdrop-blur-md transition-colors hover:border-accent/60"
              >
                <Icon name={s.label} icon={s.icon} className="size-5" />
                {s.label}
              </a>
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}
