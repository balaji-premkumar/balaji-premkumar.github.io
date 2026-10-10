/**
 * Scroll script of the career road, shared by the 3D scene and the HTML cards so they never drift apart.
 * For each job: walk to its milestone, lift its board up from the ground, hold (read). Then walk to the finish,
 * give a thumbs-up, and walk off the road out of view.
 * Progress 0..1 maps onto these segments in proportion to their length.
 */
export type Phase = 'walk' | 'lift' | 'hold' | 'finish' | 'exit';
export interface Segment {
  phase: Phase;
  /** Job index the segment belongs to (walk = walking toward it; equals the job count for the finish). */
  stop: number;
  start: number;
  end: number;
}

const LENGTH: Record<Phase, number> = { walk: 1, lift: 0.8, hold: 0.9, finish: 0.9, exit: 0.9 };

export function plan(stops: number): Segment[] {
  const phases: [Phase, number][] = [];
  for (let i = 0; i < stops; i++) phases.push(['walk', i], ['lift', i], ['hold', i]);
  phases.push(['walk', stops], ['finish', stops], ['exit', stops]);
  const total = phases.reduce((t, [p]) => t + LENGTH[p], 0);
  let acc = 0;
  return phases.map(([phase, stop]) => {
    const start = acc / total;
    acc += LENGTH[phase];
    return { phase, stop, start, end: acc / total };
  });
}

/** Total length in "screens" of scroll (one unit ≈ one swipe). */
export const scrollScreens = (stops: number) => stops * (LENGTH.walk + LENGTH.lift + LENGTH.hold) + LENGTH.walk + LENGTH.finish + LENGTH.exit;

/** Segment at progress p, with t = 0..1 through it. */
export function locate(segments: Segment[], p: number) {
  const s = segments.find((x) => p <= x.end) ?? segments[segments.length - 1]!;
  return { ...s, t: Math.min(1, Math.max(0, (p - s.start) / (s.end - s.start || 1))) };
}

/** Which job card is showing: from mid-lift through the hold. -1 = none. */
export function activeCard(at: ReturnType<typeof locate>) {
  return (at.phase === 'lift' && at.t > 0.45) || at.phase === 'hold' ? at.stop : -1;
}

