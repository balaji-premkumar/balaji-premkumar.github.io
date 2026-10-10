// bun test — every theme colour used behind text must get ink or white at WCAG AA (4.5:1).
import { expect, test } from 'bun:test';
import { contrast, site, textOn } from './index';

test('text on every theme colour meets AA', () => {
  for (const [name, hex] of Object.entries(site.theme)) {
    if (name === 'ink') continue;
    expect({ name, ratio: contrast(hex, textOn(hex)) >= 4.5 }).toEqual({ name, ratio: true });
  }
});
