type Props = {
  index: number;
  eyebrow?: string;
  title: string;
  id: string;
  /** Marker colour behind the last word (CSS colour). */
  mark?: string;
};

/** "01 — Eyebrow" + big display title with the last word on a highlighter stripe. */
export function SectionHeader({ index, eyebrow, title, id, mark = 'var(--yellow)' }: Props) {
  const words = title.split(' ');
  const last = words.pop();

  return (
    <header className="mb-12 md:mb-16" data-reveal>
      <p className="eyebrow mb-4 flex items-center gap-3">
        <span className="brut-sm rounded-md bg-ink px-2 py-0.5 text-bg">{String(index).padStart(2, '0')}</span>
        {eyebrow}
      </p>
      <h2 id={`${id}-title`} className="font-display text-5xl leading-[0.95] font-extrabold tracking-tight sm:text-6xl md:text-7xl lg:text-8xl">
        {words.join(' ')}{' '}
        <span className="bg-[linear-gradient(transparent_58%,var(--mark)_58%,var(--mark)_92%,transparent_92%)] px-1" style={{ '--mark': mark } as React.CSSProperties}>
          {last}.
        </span>
      </h2>
    </header>
  );
}
