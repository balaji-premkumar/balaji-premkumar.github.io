import { site } from '@/content';

export function Footer() {
  return (
    <footer className="border-t-3 border-ink bg-ink px-6 py-8 text-center font-mono text-xs tracking-wider text-bg">
      © {new Date().getFullYear()} {site.footer.text}
    </footer>
  );
}
