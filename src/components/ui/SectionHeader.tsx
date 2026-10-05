type Props = {
  index: number;
  eyebrow?: string;
  title: string;
  id: string;
  /** Smaller title for sticky/pinned sections that must fit one viewport. */
  compact?: boolean;
};

/** "01 — Eyebrow" + big display title with the last word in accent colour. */
export function SectionHeader({ index, eyebrow, title, id, compact }: Props) {
  const words = title.split(' ');
  const last = words.pop();

  return (
    <header className={compact ? 'mb-10 md:mb-12' : 'mb-14 md:mb-20'} data-reveal>
      <p className="mb-4 flex items-center gap-3 text-xs uppercase tracking-[0.3em] text-accent">
        <span>{String(index).padStart(2, '0')}</span>
        <span className="h-px w-10 bg-accent/50" aria-hidden />
        {eyebrow && <span className="text-muted">{eyebrow}</span>}
      </p>
      <h2
        id={`${id}-title`}
        className={`font-display font-extrabold uppercase leading-[0.95] tracking-tight ${compact ? 'text-4xl sm:text-5xl md:text-6xl' : 'text-4xl sm:text-5xl md:text-7xl lg:text-8xl'}`}
      >
        {words.join(' ')} <span className="text-accent">{last}.</span>
      </h2>
    </header>
  );
}
