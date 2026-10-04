import { site } from '../../content';

export function Footer() {
  return (
    <footer className="relative border-t border-line px-6 py-10 text-center text-xs text-muted">
      © {new Date().getFullYear()} {site.footer.text}
    </footer>
  );
}
