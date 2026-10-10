// bun test — the scroll script must cover 0..1 contiguously and show each card exactly in its lift/hold window.
import { expect, test } from 'bun:test';
import { activeCard, locate, plan } from '../src/lib/careerPlan';

test('segments tile 0..1 in order', () => {
  const s = plan(4);
  expect(s[0]!.start).toBe(0);
  expect(s.at(-1)!.end).toBeCloseTo(1);
  s.slice(1).forEach((x, i) => expect(x.start).toBeCloseTo(s[i]!.end));
  expect(s.map((x) => x.phase).slice(0, 3)).toEqual(['walk', 'lift', 'hold']);
  expect(s.slice(-2).map((x) => x.phase)).toEqual(['finish', 'exit']);
});

test('cards follow the stops', () => {
  const s = plan(4);
  const mid = (i: number) => (s[i]!.start + s[i]!.end) / 2;
  expect(activeCard(locate(s, mid(0)))).toBe(-1); // walking to job 0
  expect(activeCard(locate(s, mid(2)))).toBe(0); // holding job 0
  expect(activeCard(locate(s, mid(5)))).toBe(1);
  expect(activeCard(locate(s, 1))).toBe(-1); // walking out
});
