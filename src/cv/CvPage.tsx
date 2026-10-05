import type { ReactNode } from 'react';
import { fullName, sections, site, telHref, type Section, type SectionOf } from '../content';

const byType = <T extends Section['type']>(type: T) =>
  sections.find((s) => s.type === type) as SectionOf<T> | undefined;

const host = (url: string) => url.replace(/^(mailto:|https?:\/\/)(www\.)?/, '').replace(/\/$/, '');

function Block({ title, children }: { title: string; children: ReactNode }) {
  return (
    <section>
      <h2 className="mb-4 flex break-after-avoid items-center gap-3 text-[0.7rem] font-semibold uppercase tracking-[0.25em] text-cv-accent">
        {title}
        <span className="h-px flex-1 bg-cv-accent/30" aria-hidden />
      </h2>
      {children}
    </section>
  );
}

/** A4 CV generated from site.json — same content as the site, print-first styling. */
export function CvPage() {
  const { person, cv } = site;
  const about = byType('about');
  const experience = byType('experience');
  const skills = byType('skills');
  const projects = byType('projects');
  const summary = cv.summary ?? about?.paragraphs[0];
  const projectItems = projects?.items.slice(0, cv.projectLimit);

  const contacts = [
    { label: 'Email', value: person.email, href: `mailto:${person.email}` },
    ...(person.phone ? [{ label: 'Phone', value: person.phone, href: telHref(person.phone) }] : []),
    ...(person.location ? [{ label: 'Location', value: person.location }] : []),
    ...person.socials.filter((s) => s.href.startsWith('http')).map((s) => ({ label: s.label, value: host(s.href), href: s.href })),
    { label: 'Portfolio', value: host(site.meta.url), href: site.meta.url },
  ];

  return (
    <>
      <nav className="sticky top-0 z-10 flex items-center justify-between gap-4 bg-white/80 px-6 py-3 text-sm backdrop-blur print:hidden">
        <a href="/" className="text-cv-ink/70 hover:text-cv-ink">← Back to portfolio</a>
        <button type="button" onClick={() => window.print()} className="rounded-full bg-cv-ink px-5 py-2 font-medium text-white hover:bg-cv-accent">
          Print / Save as PDF
        </button>
      </nav>

      <article className="cv-sheet mx-auto bg-white text-cv-ink shadow-2xl shadow-black/10 print:shadow-none">
        <header className="cv-band bg-cv-bg px-[14mm] py-[10mm] text-white">
          <div className="flex flex-wrap items-end justify-between gap-x-10 gap-y-5">
            <div>
              <h1 className="font-display text-[2.6rem] font-extrabold leading-[0.95] tracking-tight">
                {person.firstName} <span className="text-cv-brand">{person.lastName}</span>
              </h1>
              <p className="mt-3 font-mono text-sm uppercase tracking-[0.2em] text-cv-brand">{person.jobTitle}</p>
              {about && (
                <p className="mt-4 flex flex-wrap gap-x-5 gap-y-1 text-xs text-white/70">
                  {about.stats.map((s) => (
                    <span key={s.label}>
                      <strong className="font-semibold text-white">{s.value}{s.suffix}</strong> {s.label}
                    </span>
                  ))}
                </p>
              )}
            </div>
            <ul className="flex w-full flex-wrap gap-x-6 gap-y-1.5 border-t border-white/10 pt-5 text-xs">
              {contacts.map((c) => (
                <li key={c.label}>
                  <span className="mr-1.5 text-white/45">{c.label}</span>
                  {c.href ? <a href={c.href} className="text-white hover:text-cv-brand">{c.value}</a> : c.value}
                </li>
              ))}
            </ul>
          </div>
        </header>

        <div className="space-y-7 px-[14mm] py-[9mm] text-[0.8rem] leading-relaxed">
          {summary && (
            <Block title="Profile">
              <p className="text-cv-ink/85">{summary}</p>
            </Block>
          )}

          {experience && (
            <Block title="Experience">
              <ol className="space-y-5">
                {[...experience.items].reverse().map((item) => (
                  <li key={item.company} className="grid break-inside-avoid gap-x-6 gap-y-1 sm:grid-cols-[30mm_1fr]">
                    <p className="font-mono text-[0.7rem] uppercase tracking-wider text-cv-accent">
                      {item.period}
                      {item.location && <span className="block text-cv-ink/50">{item.location}</span>}
                    </p>
                    <div className="border-l-2 border-cv-accent/25 pl-4">
                      <h3 className="text-[0.95rem] font-semibold">{item.role}</h3>
                      <p className="text-cv-ink/60">{item.company}</p>
                      <ul className="mt-2 space-y-1">
                        {item.points.map((p) => (
                          <li key={p} className="flex gap-2">
                            <span className="text-cv-accent" aria-hidden>▸</span>
                            <span>{p}</span>
                          </li>
                        ))}
                      </ul>
                      {item.tech && <p className="mt-2 font-mono text-[0.68rem] text-cv-ink/55">{item.tech.join(' · ')}</p>}
                    </div>
                  </li>
                ))}
              </ol>
            </Block>
          )}

          {skills && (
            <Block title="Skills">
              <dl className="grid gap-x-6 gap-y-2 sm:grid-cols-[30mm_1fr]">
                {skills.groups.map((g) => (
                  <div key={g.label} className="contents">
                    <dt className="font-mono text-[0.7rem] uppercase tracking-wider text-cv-accent">{g.label}</dt>
                    <dd>{g.items.map((i) => i.name).join(' · ')}</dd>
                  </div>
                ))}
              </dl>
            </Block>
          )}

          {projectItems && (
            <Block title={projects!.title}>
              <ul className="space-y-3">
                {projectItems.map((p) => {
                  const link = p.links?.demo ?? p.links?.source;
                  return (
                    <li key={p.name} className="grid break-inside-avoid gap-x-6 sm:grid-cols-[30mm_1fr]">
                      <p className="font-mono text-[0.65rem] uppercase tracking-wider text-cv-accent">{p.label}</p>
                      <div>
                        <h3 className="flex flex-wrap items-baseline justify-between gap-x-4">
                          <span className="font-semibold">{p.name}</span>
                          {link && (
                            <a href={link} className="text-[0.7rem] text-cv-accent underline-offset-2 hover:underline">{host(link).split('/')[0]}</a>
                          )}
                        </h3>
                        <p className="text-cv-ink/75">
                          {p.description} <span className="font-mono text-[0.68rem] text-cv-ink/50">— {p.tech.join(' · ')}</span>
                        </p>
                      </div>
                    </li>
                  );
                })}
              </ul>
            </Block>
          )}
        </div>
      </article>
      <p className="py-8 text-center text-xs text-cv-ink/40 print:hidden">{fullName} · generated from the portfolio content</p>
    </>
  );
}
