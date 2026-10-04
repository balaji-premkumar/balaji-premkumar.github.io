import { useEffect, useState } from 'react';
import { Menu, X } from 'lucide-react';
import { navItems, site } from '../../content';

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

  return (
    <header
      className={`fixed inset-x-0 top-0 z-50 px-6 transition-all duration-300 md:px-12 ${
        scrolled ? 'border-b border-line bg-bg/70 py-4 backdrop-blur-md' : 'py-6'
      }`}
    >
      <nav aria-label="Main" className="mx-auto flex max-w-7xl items-center justify-between">
        <a href="#top" className="font-display text-2xl font-bold tracking-tighter text-accent" aria-label={`${site.person.firstName[0]}${site.person.lastName[0]}. — back to top`}>
          {site.person.firstName[0]}
          {site.person.lastName[0]}.
        </a>

        <ul className="hidden items-center gap-8 md:flex">
          {navItems.map(({ id, label }) => (
            <li key={id}>
              <a
                href={`#${id}`}
                aria-current={active === id ? 'location' : undefined}
                className="group relative text-sm text-muted transition-colors hover:text-ink aria-[current]:text-ink"
              >
                {label}
                <span className="absolute -bottom-1 left-0 h-px w-0 bg-accent transition-all duration-300 group-hover:w-full group-aria-[current]:w-full" />
              </a>
            </li>
          ))}
          {cta && (
            <li>
              <a href={cta.href} className="ml-4 rounded-full border border-accent px-6 py-2 text-sm text-accent transition-colors hover:bg-accent hover:text-bg">
                {cta.label}
              </a>
            </li>
          )}
        </ul>

        <button
          type="button"
          className="relative z-50 text-ink md:hidden"
          onClick={() => setOpen(!open)}
          aria-expanded={open}
          aria-controls="mobile-menu"
          aria-label={open ? 'Close menu' : 'Open menu'}
        >
          {open ? <X size={28} /> : <Menu size={28} />}
        </button>
      </nav>

      <div
        id="mobile-menu"
        hidden={!open}
        className="fixed inset-0 z-40 flex flex-col items-center justify-center gap-8 bg-surface md:hidden"
      >
        {navItems.map(({ id, label }) => (
          <a key={id} href={`#${id}`} onClick={close} className="font-display text-4xl text-ink hover:text-accent">
            {label}
          </a>
        ))}
        {cta && (
          <a href={cta.href} onClick={close} className="mt-6 rounded-full bg-accent px-8 py-4 text-lg font-medium text-bg">
            {cta.label}
          </a>
        )}
      </div>
    </header>
  );
}
