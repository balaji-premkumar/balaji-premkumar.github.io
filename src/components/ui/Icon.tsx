import { asset } from '../../lib/assets';
import { iconUrl, initials } from '../../lib/icons';

type Props = {
  name: string;
  icon?: string;
  className?: string;
};

/** Content icon (see `icon` in schema) with a lettered badge fallback. Decorative: the name is always shown as text nearby. */
export function Icon({ name, icon, className = 'size-6' }: Props) {
  if (!icon) {
    return (
      <span aria-hidden className={`${className} grid place-items-center rounded-md bg-accent/15 text-[0.6rem] font-medium text-accent`}>
        {initials(name)}
      </span>
    );
  }
  return <img src={asset(iconUrl(icon))} alt="" aria-hidden loading="lazy" decoding="async" className={`${className} object-contain`} />;
}
