const DEVICON = 'https://cdn.jsdelivr.net/gh/devicons/devicon@latest/icons';
const SIMPLE_ICONS = 'https://cdn.simpleicons.org';

/** Resolve a content icon reference (see `icon` in content/schema.ts) to an image URL. */
export function iconUrl(ref: string): string {
  if (ref.startsWith('dev:')) {
    const file = ref.slice(4);
    return `${DEVICON}/${file.split('-')[0]}/${file}.svg`;
  }
  if (ref.startsWith('si:')) return `${SIMPLE_ICONS}/${ref.slice(3)}`;
  return ref;
}

/** "Factory AI (Custom Droids)" → "FA" — badge text when a skill has no icon. */
export function initials(name: string): string {
  return name
    .replace(/\(.*?\)/g, '')
    .split(/[\s/.-]+/)
    .filter(Boolean)
    .slice(0, 2)
    .map((w) => w[0]!.toUpperCase())
    .join('');
}
