import { useEffect, useState } from 'react';
import { Menu, X } from 'lucide-react';
import { navItems, site } from '@/content';

export function Navbar() {
  const [scrolled, setScrolled] = useState(false);
  const [open, setOpen] = useState(false);
  const [active, setActive] = useState<string>();
  const cta = site.nav.cta;

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 40);
    onScroll();
    window.addEventListener('scroll', onScroll, { passive: true });

    // Highlight the nav item whose section crosses the middle of the viewport.
    const observer = new IntersectionObserver(
      (entries) => entries.forEach((e) => e.isIntersecting && setActive(e.target.id)),
      { rootMargin: '-50% 0px -50% 0px' },
    );
    navItems.forEach(({ id }) => {
      const el = document.getElementById(id);
      if (el) observer.observe(el);
    });

    return () => {
      window.removeEventListener('scroll', onScroll);
      observer.disconnect();
    };
  }, []);

  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => e.key === 'Escape' && setOpen(false);
    document.addEventListener('keydown', onKey);
    document.body.style.overflow = 'hidden';
    return () => {
      document.removeEventListener('keydown', onKey);
      document.body.style.overflow = '';
    };
  }, [open]);

  const close = () => setOpen(false);

  const initials = `${site.person.firstName[0]}${site.person.lastName[0]}`;

  return (
    <header
      className={`fixed inset-x-0 top-0 z-50 px-4 transition-all duration-300 md:px-8 ${
        scrolled ? 'border-b-3 border-ink bg-bg/90 py-3 backdrop-blur-md' : 'py-5'
      }`}
    >
      <nav aria-label="Main" className="mx-auto flex max-w-7xl items-center justify-between">
        <a href="#top" className="brut-sm press grid size-12 place-items-center rounded-2xl bg-lime font-display text-xl font-extrabold" aria-label={`${initials} — back to top`}>
          {initials}
        </a>

        <ul className="hidden items-center gap-1 md:flex">
          {navItems.map(({ id, label }) => (
            <li key={id}>
              <a
                href={`#${id}`}
                aria-current={active === id ? 'location' : undefined}
                className="rounded-full px-4 py-2 text-[0.95rem] font-bold transition-colors hover:bg-ink hover:text-bg aria-[current]:bg-ink aria-[current]:text-bg"
              >
                {label}
              </a>
            </li>
          ))}
        </ul>

        {cta && (
          <a href={cta.href} className="brut-sm press hidden rounded-full bg-accent px-6 py-2.5 font-bold text-ink md:block">
            {cta.label} →
          </a>
        )}

        <button
          type="button"
          className="brut-sm relative z-50 grid size-12 place-items-center rounded-2xl bg-card md:hidden"
          onClick={() => setOpen(!open)}
          aria-expanded={open}
          aria-controls="mobile-menu"
          aria-label={open ? 'Close menu' : 'Open menu'}
        >
          {open ? <X size={26} /> : <Menu size={26} />}
        </button>
      </nav>

      <div
        id="mobile-menu"
        hidden={!open}
        className="fixed inset-0 z-40 flex flex-col items-center justify-center gap-6 bg-yellow md:hidden"
      >
        {navItems.map(({ id, label }) => (
          <a key={id} href={`#${id}`} onClick={close} className="font-display text-5xl font-extrabold hover:text-accent">
            {label}
          </a>
        ))}
        {cta && (
          <a href={cta.href} onClick={close} className="brut mt-6 rounded-full bg-accent px-8 py-4 text-lg font-bold text-ink">
            {cta.label} →
          </a>
        )}
      </div>
    </header>
  );
}
