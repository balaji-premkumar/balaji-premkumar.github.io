import { useState } from 'react';
import { ArrowUpRight, Check, Copy, Phone } from 'lucide-react';
import { site, telHref, type SectionOf } from '../../content';
import { Icon } from '../ui/Icon';

export function Contact({ section, index }: { section: SectionOf<'contact'>; index: number }) {
  const { email, phone, socials } = site.person;
  const [copied, setCopied] = useState(false);
  const copy = () =>
    navigator.clipboard?.writeText(email).then(() => {
      setCopied(true);
      setTimeout(() => setCopied(false), 1800);
    });

  return (
    <section id={section.id} aria-labelledby={`${section.id}-title`} className="px-6 py-16 md:py-24">
      <div data-reveal className="brut mx-auto max-w-6xl rounded-[2rem] bg-orange px-6 py-16 text-center text-white md:px-12 md:py-24">
        <p className="eyebrow mb-5">
          <span className="brut-sm rounded-md bg-ink px-2 py-0.5 text-bg">{String(index).padStart(2, '0')}</span> {section.eyebrow}
        </p>
        <h2 id={`${section.id}-title`} className="font-display text-[clamp(3.2rem,10vw,8.5rem)] leading-[0.9] font-extrabold tracking-[-0.03em]">
          {section.title}.
        </h2>
        <p className="mx-auto mt-6 max-w-2xl text-lg md:text-xl">{section.text}</p>

        <div className="mt-10 flex flex-col items-center justify-center gap-4 sm:flex-row">
          {section.cta && (
            <a href={section.cta.href} className="brut press flex items-center gap-2 rounded-full bg-lime px-8 py-4 text-lg font-bold text-ink">
              {section.cta.label} <ArrowUpRight size={20} aria-hidden />
            </a>
          )}
          <button type="button" onClick={copy} className="brut press flex items-center gap-2 rounded-full bg-card px-6 py-4 text-lg font-bold text-ink">
            {copied ? <Check size={20} aria-hidden /> : <Copy size={20} aria-hidden />}
            {copied ? 'Copied!' : email}
            <span className="sr-only" aria-live="polite">{copied ? 'Email copied to clipboard' : ''}</span>
          </button>
        </div>

        <ul className="mt-10 flex flex-wrap justify-center gap-3">
          {phone && (
            <li>
              <a href={telHref(phone)} className="brut-sm press flex items-center gap-2 rounded-full bg-card px-5 py-2.5 font-bold text-ink">
                <Phone size={18} aria-hidden />
                <span className="sr-only">Phone: </span>
                {phone}
              </a>
            </li>
          )}
          {socials.map((s) => (
            <li key={s.label}>
              <a
                href={s.href}
                target={s.href.startsWith('http') ? '_blank' : undefined}
                rel="noreferrer"
                className="brut-sm press flex items-center gap-2 rounded-full bg-card px-5 py-2.5 font-bold text-ink"
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
