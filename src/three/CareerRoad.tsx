import { Suspense, use, useEffect, useMemo, useRef, useState, type RefObject } from 'react';
import { Canvas, useFrame, useLoader, useThree } from '@react-three/fiber';
import * as THREE from 'three';
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader.js';
import { MeshoptDecoder } from 'three/examples/jsm/libs/meshopt_decoder.module.js';
import { clone } from 'three/examples/jsm/utils/SkeletonUtils.js';
import { pop, site, textOn, type SectionOf } from '../content';
import { asset } from '../lib/assets';
import { locate, plan } from '../lib/careerPlan';
import { fitHeight } from './figure';
import { buildActions } from './gestures';

type Item = SectionOf<'experience'>['items'][number];
type Props = { items: Item[]; progress: RefObject<number> };

/**
 * The career road: the figure walks a winding road; at each job a milestone post shows the year and a board lies
 * flat on the ground beside it. The figure lifts the board upright (hinged at its base) to show the role, then
 * walks on, leaving it standing. Everything is a pure function of `progress` (0..1, scrubbed by GSAP), so
 * scrolling back plays it in reverse.
 */
export default function CareerRoad({ items, progress }: Props) {
  const wrap = useRef<HTMLDivElement>(null);
  const [onScreen, setOnScreen] = useState(true);
  useEffect(() => {
    const io = new IntersectionObserver(([e]) => setOnScreen(!!e?.isIntersecting));
    io.observe(wrap.current!);
    return () => io.disconnect();
  }, []);

  return (
    <div ref={wrap} className="absolute inset-0" aria-hidden>
      <Canvas frameloop={onScreen ? 'always' : 'never'} dpr={[1, 1.75]} camera={{ fov: 40, near: 0.1, far: 60 }} gl={{ antialias: true, alpha: true }}>
        <Suspense fallback={null}>
          <Road items={items} progress={progress} />
        </Suspense>
      </Canvas>
    </div>
  );
}

// ── Layout (world units: the figure is 1 tall) ──────────────────────────────────────────────────────
const UP = new THREE.Vector3(0, 1, 0);
const SPACING = 4.5; // road length between milestones
const ROAD = 1.1; // road width
const BOARD = { w: 1.05, h: 0.68 };
const STEP = 0.55; // distance per walk cycle
const ink = site.theme.ink;

const side = (t: THREE.Vector3) => new THREE.Vector3(-t.z, 0, t.x); // right-hand side of travel
const yaw = (v: THREE.Vector3) => Math.atan2(v.x, v.z);
const smooth = (a: number, b: number, x: number) => {
  const t = Math.min(1, Math.max(0, (x - a) / (b - a)));
  return t * t * (3 - 2 * t);
};
const rand = (k: number) => {
  const x = Math.sin(k * 127.1) * 43758.5453;
  return x - Math.floor(x);
};

function useLayout(n: number) {
  return useMemo(() => {
    const pts = [new THREE.Vector3(0, 0, 2)];
    for (let i = 1; i <= n + 1; i++) pts.push(new THREE.Vector3(i % 2 ? 1.5 : -1.5, 0, -i * SPACING));
    // Past the finish the road bends sharply away: the figure walks off round it, out of the finish shot.
    const out = Math.sign(pts[n + 1]!.x);
    pts.push(new THREE.Vector3(pts[n + 1]!.x + 2.5 * out, 0, -(n + 1.6) * SPACING), new THREE.Vector3(pts[n + 1]!.x + 10 * out, 0, -(n + 1.9) * SPACING));
    const curve = new THREE.CatmullRomCurve3(pts, false, 'centripetal');
    // Arc-length parameter of each control point (milestones are points 1..n, the finish is n+1).
    const samples = Array.from({ length: 2001 }, (_, i) => curve.getPointAt(i / 2000));
    const uOf = (p: THREE.Vector3) => samples.reduce((best, s, i) => (s.distanceTo(p) < samples[best]!.distanceTo(p) ? i : best), 0) / 2000;
    const frame = (u: number) => {
      const p = curve.getPointAt(u);
      const t = curve.getTangentAt(u).setY(0).normalize();
      return { p, t, s: side(t) };
    };
    const stops = pts.slice(1, n + 1).map((pt) => {
      const u = uOf(pt);
      const { p, t, s } = frame(u);
      const face = t.clone().negate().addScaledVector(s, -0.55).normalize(); // board + post face back down the road
      const figure = p.clone().addScaledVector(s, -0.3);
      const board = p.clone().addScaledVector(s, -1.05);
      const post = p.clone().addScaledVector(s, -2.0).addScaledVector(t, 0.25);
      const center = figure.clone().add(post).multiplyScalar(0.5);
      return { u, p, t, s, face, figure, board, post, center };
    });
    const end = frame(uOf(pts[n + 1]!));
    const finish = { ...end, u: uOf(pts[n + 1]!), face: end.t.clone().negate().addScaledVector(end.s, 0.3).normalize() };
    return { curve, frame, stops, finish, length: curve.getLength() };
  }, [n]);
}
type Layout = ReturnType<typeof useLayout>;

// ── Scene ───────────────────────────────────────────────────────────────────────────────────────────
function Road({ items, progress }: Props) {
  const layout = useLayout(items.length);
  const segments = useMemo(() => plan(items.length), [items.length]);
  const boards = useRef<(THREE.Group | null)[]>([]);
  const fig = useRef<THREE.Group>(null);

  const figure = useFigure();
  const { camera, size } = useThree() as { camera: THREE.PerspectiveCamera; size: { width: number; height: number } };

  // Reusable scratch values for the frame loop.
  const tmp = useMemo(() => ({ pos: new THREE.Vector3(), look: new THREE.Vector3(), cPos: new THREE.Vector3(), cLook: new THREE.Vector3(), yaw: 0 }), []);

  useFrame(() => {
    const at = locate(segments, progress.current ?? 0);
    const { stops, finish, frame } = layout;
    const prev = stops[at.stop - 1];
    const stop = stops[at.stop];

    // Figure position + facing.
    let u: number, lateral = 0, face: THREE.Vector3;
    if (at.phase === 'walk') {
      const from = prev?.u ?? 0;
      const to = stop?.u ?? finish.u;
      u = THREE.MathUtils.lerp(from, to, 0.5 - Math.cos(Math.PI * at.t) / 2); // ease in/out: start and stop gently
      lateral = -0.3 * ((prev ? 1 - smooth(0, 0.3, at.t) : 0) + (stop ? smooth(0.7, 1, at.t) : 0));
      const f = frame(u);
      face = f.t;
      if (prev && at.t < 0.2) face = new THREE.Vector3().lerpVectors(prev.face, f.t, smooth(0, 0.2, at.t)).normalize();
    } else if (at.phase === 'finish') {
      u = finish.u;
      face = finish.t.clone().lerp(finish.face, smooth(0, 0.3, at.t)).normalize();
    } else if (at.phase === 'exit') {
      u = THREE.MathUtils.lerp(finish.u, 1, 1 - Math.cos((Math.PI / 2) * at.t)); // set off gently, then keep going
      face = finish.face.clone().lerp(frame(u).t, smooth(0, 0.15, at.t)).normalize();
    } else {
      u = stop!.u;
      lateral = -0.3;
      face =
        at.phase === 'lift'
          ? stop!.t.clone().lerp(stop!.s.clone().negate(), smooth(0, 0.3, at.t)).normalize()
          : stop!.s.clone().negate().lerp(stop!.face, smooth(0, 0.35, at.t)).normalize();
    }
    const f = frame(u);
    const g = fig.current!;
    g.position.copy(f.p).addScaledVector(f.s, lateral);
    g.rotation.y = yaw(face);

    // Pose: set each action's time and weight directly; the mixer only blends.
    const walked = u * layout.length;
    const pose: [THREE.AnimationAction | undefined, number, number][] = [];
    if (at.phase === 'walk') {
      const fadeIn = smooth(0, 0.12, at.t);
      const fadeOut = 1 - smooth(0.86, 1, at.t);
      const walk = Math.min(fadeIn, fadeOut);
      pose.push([figure.act.walk, walk, (walked / STEP) % 1]);
      if (fadeIn < 1) pose.push(prev ? [figure.act.present, 1 - walk, 1] : [figure.act.idle, 1 - walk, 0]);
      else pose.push([figure.act.idle, 1 - walk, 0]);
    } else if (at.phase === 'lift') pose.push([figure.act.lift, 1, at.t * 1.6]);
    else if (at.phase === 'hold') pose.push([figure.act.present, 1, Math.min(1, at.t * 2)]);
    else if (at.phase === 'finish') pose.push([figure.act['thumbs-up'], 1, smooth(0.2, 1, at.t) * 2.2]);
    else {
      const walk = smooth(0, 0.12, at.t);
      pose.push([figure.act.walk, walk, (walked / STEP) % 1], [figure.act.idle, 1 - walk, 0]);
    }
    figure.pose(pose);

    // Boards: flat until lifted, then stay up.
    boards.current.forEach((b, i) => {
      if (!b) return;
      const up = i < at.stop || (i === at.stop && at.phase === 'hold') ? 1 : i === at.stop && at.phase === 'lift' ? smooth(0.5, 0.95, at.t) : 0;
      b.rotation.x = -Math.PI / 2 * (1 - up);
    });

    // Camera: follow from behind while walking, frame figure + board + post at a stop, face the figure at the end.
    // Free screen area (fraction + centre) between the header and the details card: right column on desktop,
    // bottom sheet on phones. View offset centres the scene there; framing distances fit inside it.
    const usable = size.width >= 768 ? { x: 0.62, y: 1, cx: 0.31, cy: 0.52 } : { x: 1, y: 0.42, cx: 0.5, cy: 0.4 };
    camera.setViewOffset(size.width, size.height, size.width * (0.5 - usable.cx), size.height * (0.5 - usable.cy), size.width, size.height);
    const tanV = Math.tan(THREE.MathUtils.degToRad(camera.fov / 2));
    const tanH = tanV * camera.aspect * usable.x;

    const follow = (pos: THREE.Vector3, look: THREE.Vector3) => {
      const ff = frame(u);
      const back = camera.aspect < 1 ? 1 + (1 - camera.aspect) * 0.9 : 1; // portrait: pull back so the figure fits
      pos.copy(g.position).addScaledVector(ff.t, -2.7 * back).addScaledVector(ff.s, 0.75).addScaledVector(UP, 1.45 * back);
      look.copy(g.position).addScaledVector(ff.t, 1.4).addScaledVector(UP, 0.55);
    };
    const framed = (s: Layout['stops'][number], pos: THREE.Vector3, look: THREE.Vector3) => {
      const dist = Math.max(1.15 / tanH, 0.7 / (tanV * usable.y)) * 1.1;
      look.copy(s.center).addScaledVector(UP, 0.45);
      pos.copy(look).addScaledVector(s.face, dist).addScaledVector(UP, dist * 0.32);
    };
    follow(tmp.pos, tmp.look);
    let w = 0;
    let target: Layout['stops'][number] | undefined;
    if (at.phase === 'walk') {
      if (stop && at.t > 0.65) {
        target = stop;
        w = smooth(0.65, 1, at.t);
      } else if (prev && at.t < 0.35) {
        target = prev;
        w = 1 - smooth(0, 0.35, at.t);
      }
    } else if (at.phase === 'finish' || at.phase === 'exit') {
      const dist = Math.max(0.8 / tanH, 0.75 / (tanV * usable.y)) * 1.1;
      tmp.cLook.copy(finish.p).addScaledVector(UP, 0.5);
      tmp.cPos.copy(tmp.cLook).addScaledVector(finish.face, dist).addScaledVector(UP, dist * 0.25);
      const k = at.phase === 'exit' ? 1 : smooth(0, 0.45, at.t);
      tmp.pos.lerp(tmp.cPos, k);
      tmp.look.lerp(tmp.cLook, k);
    } else {
      target = stop;
      w = 1;
    }
    if (target && w > 0) {
      framed(target, tmp.cPos, tmp.cLook);
      tmp.pos.lerp(tmp.cPos, w);
      tmp.look.lerp(tmp.cLook, w);
    }
    camera.position.copy(tmp.pos);
    camera.lookAt(tmp.look);
  });

  return (
    <>
      <hemisphereLight args={['#fffaf0', '#c9b9a0', 1.7]} />
      <directionalLight position={[-4, 8, 6]} intensity={1.6} />
      <fog attach="fog" args={[site.theme.bg, 10, 28]} />

      <Ground layout={layout} />
      {layout.stops.map((s, i) => (
        <group key={items[i]!.company}>
          <Post at={s.post} face={s.face} year={items[i]!.period.match(/\d{4}/)?.[0] ?? ''} color={pop(i, items[i]!.color).background} />
          <group position={s.board} rotation-y={yaw(s.face)}>
            <group ref={(el) => void (boards.current[i] = el)}>
              <Board item={items[i]!} color={pop(i, items[i]!.color).background} />
            </group>
          </group>
        </group>
      ))}
      <mesh position={layout.finish.p.clone().setY(0.012)} rotation-x={-Math.PI / 2}>
        <circleGeometry args={[0.75, 48]} />
        <meshStandardMaterial color={site.theme.yellow} />
      </mesh>
      <mesh position={layout.finish.p.clone().setY(0.008)} rotation-x={-Math.PI / 2}>
        <circleGeometry args={[0.82, 48]} />
        <meshBasicMaterial color={ink} />
      </mesh>

      <group ref={fig}>
        <primitive object={figure.model} />
        <mesh position-y={0.006} rotation-x={-Math.PI / 2}>
          <circleGeometry args={[0.26, 32]} />
          <meshBasicMaterial color={ink} transparent opacity={0.18} depthWrite={false} />
        </mesh>
      </group>
    </>
  );
}

// ── Figure: its own skeleton (the hero canvas uses the loaded scene) + the action library ─────────────
function useFigure() {
  const avatar = site.avatar!;
  const gltf = useLoader(GLTFLoader, asset(avatar.model), (l) => l.setMeshoptDecoder(MeshoptDecoder));
  return useMemo(() => {
    const model = fitHeight(clone(gltf.scene), 1);
    const mixer = new THREE.AnimationMixer(model);
    const clips = buildActions(model);
    const act = Object.fromEntries(
      clips.map((c) => {
        const a = mixer.clipAction(c);
        a.play().paused = true;
        a.setEffectiveWeight(0);
        return [c.name, a];
      }),
    ) as Record<string, THREE.AnimationAction>;
    return {
      model,
      act,
      pose(weights: [THREE.AnimationAction | undefined, number, number][]) {
        for (const a of Object.values(act)) a.setEffectiveWeight(0);
        for (const [a, weight, time] of weights) {
          if (!a) continue;
          a.setEffectiveWeight(weight);
          a.time = time;
        }
        mixer.update(0);
      },
    };
  }, [gltf]);
}

// ── Pieces ──────────────────────────────────────────────────────────────────────────────────────────
function ribbon(layout: Layout, a: number, b: number, y: number) {
  const n = 400;
  const pos: number[] = [];
  const idx: number[] = [];
  for (let i = 0; i <= n; i++) {
    const { p, s } = layout.frame(i / n);
    pos.push(p.x + s.x * a, y, p.z + s.z * a, p.x + s.x * b, y, p.z + s.z * b);
    if (i < n) idx.push(2 * i, 2 * i + 1, 2 * i + 2, 2 * i + 1, 2 * i + 3, 2 * i + 2); // faces up
  }
  const g = new THREE.BufferGeometry();
  g.setAttribute('position', new THREE.Float32BufferAttribute(pos, 3));
  g.setIndex(idx);
  g.computeVertexNormals();
  return g;
}

function Ground({ layout }: { layout: Layout }) {
  const { road, edges, dashes, hills } = useMemo(() => {
    const half = ROAD / 2;
    const edges = [ribbon(layout, -half - 0.07, -half, 0.011), ribbon(layout, half, half + 0.07, 0.011)];
    const count = Math.floor(layout.length / 0.5);
    const dashes = Array.from({ length: count }, (_, k) => {
      const { p, t } = layout.frame((k + 0.5) / count);
      return new THREE.Matrix4().compose(p.clone().setY(0.012), new THREE.Quaternion().setFromAxisAngle(UP, yaw(t)), new THREE.Vector3(1, 1, 1));
    });
    const colors = ['blue', 'accent', 'lime', 'yellow', 'orange', 'sky', 'mint'] as const;
    const end = layout.stops.length + 3;
    const hills = Array.from({ length: end * 4 }, (_, k) => {
      const along = 4 - (k / 4) * SPACING * 1.05;
      const { p, s } = layout.frame(Math.min(1, Math.max(0, -along / (end * SPACING))));
      const dir = k % 2 ? 1 : -1;
      const r = 1.6 + rand(k) * 2.4;
      const off = (dir < 0 ? 8 : 5) + r + rand(k + 9) * 4; // clear of the road; the stop cameras sit on the left (-1)
      return { pos: new THREE.Vector3(p.x + s.x * off * dir, -r * 0.15, along), r, color: site.theme[colors[k % colors.length]!] };
    });
    return { road: ribbon(layout, -half, half, 0.01), edges, dashes, hills };
  }, [layout]);

  const dashRef = useRef<THREE.InstancedMesh>(null);
  useEffect(() => {
    dashes.forEach((m, i) => dashRef.current!.setMatrixAt(i, m));
    dashRef.current!.instanceMatrix.needsUpdate = true;
  }, [dashes]);

  return (
    <>
      <mesh rotation-x={-Math.PI / 2} position={[0, 0, -layout.stops.length * SPACING / 2]}>
        <planeGeometry args={[60, 80]} />
        <meshStandardMaterial color="#eadcc2" />
      </mesh>
      <mesh geometry={road}>
        <meshStandardMaterial color={site.theme.card} />
      </mesh>
      {edges.map((g, i) => (
        <mesh key={i} geometry={g}>
          <meshBasicMaterial color={ink} />
        </mesh>
      ))}
      <instancedMesh ref={dashRef} args={[undefined, undefined, dashes.length]}>
        <boxGeometry args={[0.05, 0.004, 0.22]} />
        <meshBasicMaterial color={ink} />
      </instancedMesh>
      {hills.map((h, i) => (
        <mesh key={i} position={h.pos} scale={[1, 0.5, 1]}>
          <sphereGeometry args={[h.r, 32, 16]} />
          <meshStandardMaterial color={h.color} roughness={0.9} />
        </mesh>
      ))}
    </>
  );
}

// Text is drawn into canvases in the site fonts; wait for them so the first draw isn't in a fallback face.
const fontsReady =
  typeof document === 'undefined'
    ? Promise.resolve()
    : Promise.all(['800 80px "Bricolage Grotesque"', '700 40px "DM Sans"', '500 30px "JetBrains Mono"'].map((f) => document.fonts.load(f))).then(() => undefined);

function canvasTexture(w: number, h: number, draw: (c: CanvasRenderingContext2D) => void) {
  const canvas = document.createElement('canvas');
  canvas.width = w;
  canvas.height = h;
  draw(canvas.getContext('2d')!);
  const tex = new THREE.CanvasTexture(canvas);
  tex.colorSpace = THREE.SRGBColorSpace;
  tex.anisotropy = 4;
  return tex;
}

/** Milestone post (rounded top, like a road marker) showing the year. */
function Post({ at, face, year, color }: { at: THREE.Vector3; face: THREE.Vector3; year: string; color: string }) {
  use(fontsReady);
  const { shape, outline, tex } = useMemo(() => {
    const r = 0.2;
    const h = 0.36;
    const s = new THREE.Shape();
    s.moveTo(-r, 0);
    s.lineTo(-r, h);
    s.absarc(0, h, r, Math.PI, 0, true);
    s.lineTo(r, 0);
    s.closePath();
    const shape = new THREE.ExtrudeGeometry(s, { depth: 0.12, bevelEnabled: true, bevelSize: 0.015, bevelThickness: 0.015, bevelSegments: 2 });
    shape.translate(0, 0, -0.06);
    const outline = shape.clone().scale(1.08, 1.05, 1.15);
    const tex = canvasTexture(400, 560, (c) => {
      c.fillStyle = color;
      c.beginPath();
      c.arc(200, 200, 200, Math.PI, 0);
      c.lineTo(400, 230);
      c.lineTo(0, 230);
      c.fill();
      c.fillStyle = textOn(site.theme.card);
      c.font = '800 132px "Bricolage Grotesque"';
      c.textAlign = 'center';
      c.textBaseline = 'middle';
      c.fillText(year, 200, 395, 370);
    });
    return { shape, outline, tex };
  }, [year, color]);
  return (
    <group position={at} rotation-y={yaw(face)}>
      <mesh geometry={shape}>
        <meshStandardMaterial color={site.theme.card} />
      </mesh>
      <mesh geometry={outline}>
        <meshBasicMaterial color={ink} side={THREE.BackSide} />
      </mesh>
      <mesh position={[0, 0.28, 0.078]}>
        <planeGeometry args={[0.4, 0.56]} />
        <meshBasicMaterial map={tex} transparent toneMapped={false} />
      </mesh>
    </group>
  );
}

/** Career board: role, company and period on the job's colour. Hinged at its base: rotate the parent to lift it. */
function Board({ item, color }: { item: Item; color: string }) {
  use(fontsReady);
  const tex = useMemo(
    () =>
      canvasTexture(1024, Math.round((1024 * BOARD.h) / BOARD.w), (c) => {
        const W = c.canvas.width;
        const H = c.canvas.height;
        const fg = textOn(color);
        c.fillStyle = color;
        c.fillRect(0, 0, W, H);
        c.lineWidth = 26;
        c.strokeStyle = ink;
        c.strokeRect(13, 13, W - 26, H - 26);
        // From–to chip.
        c.font = '500 40px "JetBrains Mono"';
        const period = item.period.toUpperCase();
        const pw = c.measureText(period).width + 48;
        c.fillStyle = site.theme.card;
        c.fillRect(64, 60, pw, 70);
        c.lineWidth = 6;
        c.strokeRect(64, 60, pw, 70);
        c.fillStyle = ink;
        c.textBaseline = 'middle';
        c.fillText(period, 88, 97);
        // Role: largest size that fits in two lines.
        c.fillStyle = fg;
        c.textBaseline = 'alphabetic';
        let size = 92;
        let lines: string[] = [];
        for (; size > 44; size -= 4) {
          c.font = `800 ${size}px "Bricolage Grotesque"`;
          lines = wrap(c, item.role, W - 130);
          if (lines.length <= 2) break;
        }
        lines.forEach((l, i) => c.fillText(l, 64, 168 + size * (i + 1) * 0.98));
        // Company: the headline of the lower half, on a highlighter stripe like the section titles.
        let cs = 76;
        for (; cs > 40; cs -= 2) {
          c.font = `800 ${cs}px "Bricolage Grotesque"`;
          if (c.measureText(item.company).width <= W - 150) break;
        }
        const base = H - 78;
        c.fillStyle = site.theme.card;
        c.fillRect(56, base - cs * 0.42, c.measureText(item.company).width + 20, cs * 0.5);
        c.fillStyle = ink;
        c.fillText(item.company, 64, base);
      }),
    [item, color],
  );
  return (
    <group position-y={BOARD.h / 2}>
      <mesh position={[0.035, -0.035, -0.045]}>
        <boxGeometry args={[BOARD.w, BOARD.h, 0.03]} />
        <meshBasicMaterial color={ink} />
      </mesh>
      <mesh>
        <boxGeometry args={[BOARD.w, BOARD.h, 0.04]} />
        {[0, 1, 2, 3, 5].map((i) => (
          <meshBasicMaterial key={i} attach={`material-${i}`} color={ink} />
        ))}
        <meshBasicMaterial attach="material-4" map={tex} toneMapped={false} />
      </mesh>
    </group>
  );
}

function wrap(c: CanvasRenderingContext2D, text: string, max: number) {
  const lines: string[] = [];
  let line = '';
  for (const word of text.split(' ')) {
    const next = line ? `${line} ${word}` : word;
    if (c.measureText(next).width > max && line) {
      lines.push(line);
      line = word;
    } else line = next;
  }
  return [...lines, line];
}
