// bun test — the GTM import file must trigger on exactly the events the site sends, for the GA4 ID in site.json.
import { expect, test } from 'bun:test';
import container from '../../../analytics/gtm-container.json';
import site from '../../content/site.json';
import { EVENTS } from './analytics';

const json = JSON.stringify(container);

test('GTM trigger matches the site events', () => {
  const regex = json.match(/\^\(([a-z_|]+)\)\$/)?.[1]?.split('|') ?? [];
  expect(regex.sort()).toEqual([...EVENTS].sort());
});

test('GTM container sends to the GA4 property in site.json', () => {
  expect(json).toContain(`"value":"${site.analytics.googleId}"`);
});
