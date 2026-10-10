import * as THREE from 'three';

/**
 * Action library for a Mixamo-rigged figure that ships without animations. Each action is a few timed
 * key poses, solved against the figure's own skeleton into a regular AnimationClip. A pose sets bones in
 * character space (+X = the figure's left, +Y up, +Z toward the viewer), so it doesn't depend on the rig's
 * local bone axes:
 *   [x, y, z]            aim: point the bone (toward its first child) along this direction
 *   { turn: [x, y, z] }  rotate the bone by these Euler angles (radians) — head turns, tilts, torso twist
 *   { aim, turn }        aim first, then turn
 *   { aim, palm }        hands only: aim, then twist about the fingers so the palm faces this direction
 *   number               curl a finger joint toward the palm (radians)
 * Bones are Mixamo names without the prefix (Spine1, Head, RightArm, LeftHandIndex2, …).
 */
type Vec = [number, number, number];
type Target = Vec | { aim?: Vec; turn?: Vec; palm?: Vec } | number;
export type Pose = Record<string, Target>;
type Side = 'Left' | 'Right';
type Keys = [time: number, pose: Pose][];

// ── Building blocks ─────────────────────────────────────────────────────────────────────────────────
const FINGERS = ['Index', 'Middle', 'Ring', 'Pinky'];
const curl = (side: Side, angle: number, fingers = FINGERS): Pose =>
  Object.fromEntries(fingers.flatMap((f) => [1, 2, 3].map((j) => [`${side}Hand${f}${j}`, angle])));
const fist = (side: Side) => curl(side, 1.35);
const thumbUp = (side: Side): Pose => ({ [`${side}HandThumb1`]: [0, 1, 0.3], [`${side}HandThumb2`]: [0, 1, 0.1], [`${side}HandThumb3`]: [0, 1, 0] });

/** Swap Left/Right bones and reflect across the figure's centre plane. */
export const mirror = (pose: Pose): Pose =>
  Object.fromEntries(
    Object.entries(pose).map(([bone, t]) => {
      const name = bone.replace(/Left|Right/, (s) => (s === 'Left' ? 'Right' : 'Left'));
      if (typeof t === 'number') return [name, t];
      if (Array.isArray(t)) return [name, [-t[0], t[1], t[2]]];
      const flip = (v?: Vec): Vec | undefined => v && [-v[0], v[1], v[2]];
      return [name, { aim: flip(t.aim), palm: flip(t.palm), turn: t.turn && [t.turn[0], -t.turn[1], -t.turn[2]] }];
    }),
  );
const both = (pose: Pose): Pose => ({ ...pose, ...mirror(pose) }); // pose written for the right side

// ── Poses ───────────────────────────────────────────────────────────────────────────────────────────
// Arms hang by the sides with a slight elbow bend (the rig's rest pose is an A-pose).
const relaxed: Pose = { ...both({ RightArm: [-0.2, -1, 0.02], RightForeArm: [-0.12, -1, 0.25], ...curl('Right', 0.25) }), Head: [0.02, 1, 0.04] };
const at = (base: Pose, ...over: Pose[]): Pose => Object.assign({}, base, ...over);

const breathe = at(relaxed, both({ RightArm: [-0.24, -1, 0.02] }), { Spine1: [0, 1, -0.03], Head: [-0.02, 1, 0.06] });

const waveUp = at(relaxed, { RightArm: [-0.8, 0.55, 0.2], RightForeArm: [-0.25, 1, 0.15], ...curl('Right', 0.05), Spine1: [-0.04, 1, 0], Head: [-0.08, 1, 0.06] });
const waveL = at(waveUp, { RightForeArm: [-0.55, 1, 0.15] });
const waveR = at(waveUp, { RightForeArm: [0.15, 1, 0.15] });

// Fist forward with the palm facing in, so the thumb sits on top and points straight up.
const thumb = at(relaxed, {
  RightArm: [-0.3, -0.75, 0.45],
  RightForeArm: [-0.05, 0.25, 1],
  RightHand: { aim: [0, 0.1, 1], palm: [1, 0, 0] },
  ...fist('Right'),
  ...thumbUp('Right'),
  Spine1: [0, 1, 0.06],
  Head: [0, 1, 0.12],
});
const thumbNod = at(thumb, { Spine1: [0, 1, 0.1], Head: [0, 1, 0.22] });

const nodDown = at(relaxed, { Head: [0, 1, 0.3] });
const nodUp = at(relaxed, { Head: [0, 1, -0.05] });

const shakeL = at(relaxed, { Head: { turn: [0, 0.45, 0] } });
const shakeR = at(relaxed, { Head: { turn: [0, -0.45, 0] } });

const shrug = at(
  relaxed,
  both({ RightShoulder: [-1, 0.45, 0], RightArm: [-0.2, -1, 0.05], RightForeArm: [-0.75, 0.15, 0.65], ...curl('Right', 0.1) }),
  { Head: { turn: [0, 0, 0.15] } },
);

const point = at(relaxed, {
  RightArm: [-0.25, 0.05, 1],
  RightForeArm: [-0.1, 0.1, 1],
  ...curl('Right', 1.4, ['Middle', 'Ring', 'Pinky']),
  ...curl('Right', 0, ['Index']),
  Spine1: { turn: [0, -0.15, 0] },
  Head: [0, 1, 0.08],
});

const cheerUp = at(relaxed, both({ RightArm: [-0.45, 1, 0.1], RightForeArm: [-0.2, 1, 0.05], ...fist('Right') }), { Spine1: [0, 1, -0.06], Head: [0, 1, -0.1] });
const cheerHop = at(cheerUp, both({ RightArm: [-0.6, 0.9, 0.1] }), { Spine1: [0, 1, 0.02] });

const think = at(relaxed, {
  RightArm: [-0.1, -0.7, 0.6],
  RightForeArm: [0.4, 1, 0.35],
  ...curl('Right', 0.9),
  LeftArm: [0.1, -1, 0.35],
  LeftForeArm: [-0.9, 0.05, 0.45],
  Head: { turn: [0.1, -0.2, -0.12] },
});

// Vanakkam: palms pressed together at the chest, fingers up, then a small bow.
const palms = at(
  relaxed,
  both({ RightArm: [-0.2, -1, 0.3], RightForeArm: [0.85, 0.1, 0.5], RightHand: { aim: [0, 1, 0.15], palm: [1, 0, 0] }, ...curl('Right', 0), RightHandThumb1: [0.2, 1, 0.2], RightHandThumb2: [0, 1, 0], RightHandThumb3: [0, 1, 0] }),
  { Head: [0, 1, 0.08] },
);
const bow = at(palms, { Spine: [0, 1, 0.18], Spine1: [0, 1, 0.38], Neck: [0, 1, 0.4], Head: [0, 1, 0.6] });

// ── Career road: walk, lift a board up from the ground, present it ─────────────────────────────────
// One stride per second; the scene scrubs it by distance walked. Knees bend, so the solver drops the hips.
const stride: Pose = at(relaxed, {
  RightUpLeg: [0, -1, 0.5],
  RightLeg: [0, -1, 0.3],
  LeftUpLeg: [0, -1, -0.35],
  LeftLeg: [0, -1, -0.75],
  RightArm: [-0.15, -1, -0.3],
  RightForeArm: [-0.1, -1, -0.05],
  LeftArm: [0.15, -1, 0.35],
  LeftForeArm: [0.1, -0.8, 0.6],
  Head: [0, 1, 0.06],
});
const passing: Pose = at(relaxed, { RightUpLeg: [0, -1, 0], RightLeg: [0, -1, 0], LeftUpLeg: [0, -1, 0.3], LeftLeg: [0, -1, -0.55], Head: [0, 1, 0.06] });

const squat = both({ RightUpLeg: [0, -0.55, 0.85], RightLeg: [0, -1, -0.4] });
const reach = at(relaxed, squat, both({ RightArm: [-0.12, -0.75, 0.65], RightForeArm: [-0.05, -0.85, 0.5], ...curl('Right', 0.3) }), {
  Spine: [0, 1, 0.45],
  Spine1: [0, 1, 0.7],
  Neck: [0, 1, 0.6],
  Head: [0, 1, 0.6],
});
const grab = at(reach, curl('Right', 1), curl('Left', 1));
const raised = at(relaxed, both({ RightArm: [-0.2, -0.1, 1], RightForeArm: [-0.1, 0.3, 1], ...curl('Right', 0.9) }));
// Open palm toward the board, which stands on the figure's right once it turns to the camera.
const presenting = at(relaxed, {
  RightArm: [-0.85, -0.35, 0.45],
  RightForeArm: [-0.8, 0.05, 0.6],
  RightHand: { aim: [-1, 0.1, 0.5], palm: [0, 1, 0] },
  ...curl('Right', 0.1),
  Head: { turn: [0, -0.25, 0] },
});

// ── Actions ─────────────────────────────────────────────────────────────────────────────────────────
const gesture = (...poses: [number, Pose][]): Keys => [[0, relaxed], ...poses];
export const ACTIONS: Record<string, Keys> = {
  idle: [[0, relaxed], [2, breathe], [4, relaxed]],
  walk: [[0, stride], [0.25, passing], [0.5, mirror(stride)], [0.75, mirror(passing)], [1, stride]],
  lift: [[0, relaxed], [0.5, reach], [0.8, grab], [1.6, raised]],
  present: [[0, raised], [0.5, presenting], [1, presenting]],
  vanakkam: gesture([0.45, palms], [0.8, bow], [1.7, bow], [2.1, palms], [2.5, palms], [3, relaxed]),
  wave: gesture([0.35, waveUp], [0.6, waveL], [0.85, waveR], [1.1, waveL], [1.35, waveR], [1.6, waveUp], [2.1, relaxed]),
  'thumbs-up': gesture([0.35, thumb], [0.55, thumbNod], [0.8, thumb], [1.7, thumb], [2.2, relaxed]),
  nod: gesture([0.25, nodDown], [0.5, nodUp], [0.75, nodDown], [1.1, relaxed]),
  shake: gesture([0.25, shakeL], [0.55, shakeR], [0.85, shakeL], [1.15, shakeR], [1.5, relaxed]),
  shrug: gesture([0.35, shrug], [1.3, shrug], [1.8, relaxed]),
  point: gesture([0.35, point], [1.5, point], [2, relaxed]),
  cheer: gesture([0.3, cheerUp], [0.5, cheerHop], [0.7, cheerUp], [0.9, cheerHop], [1.1, cheerUp], [1.7, relaxed]),
  think: gesture([0.5, think], [2.2, think], [2.8, relaxed]),
};

// ── Solver ──────────────────────────────────────────────────────────────────────────────────────────
export function buildActions(model: THREE.Object3D): THREE.AnimationClip[] {
  const bones = new Map<string, THREE.Bone>(); // traverse order: parents before children
  model.traverse((o) => void ((o as THREE.Bone).isBone && bones.set(o.name.replace(/^mixamorig:?/, ''), o as THREE.Bone)));
  if (!bones.has('Hips')) return [];

  const rest = new Map([...bones.values()].map((b) => [b, b.quaternion.clone()]));
  const toWorld = model.getWorldQuaternion(new THREE.Quaternion());
  const fromWorld = toWorld.clone().invert();
  const pos = (name: string) => bones.get(name)!.getWorldPosition(new THREE.Vector3());
  // Palm normal, signed so it points down in the rest A-pose (palms face the floor).
  const palm = (side: Side) => {
    const along = pos(`${side}HandMiddle1`).sub(pos(`${side}Hand`));
    return along.cross(pos(`${side}HandIndex1`).sub(pos(`${side}HandPinky1`))).normalize();
  };
  const palmSign = { Left: Math.sign(-palm('Left').y) || 1, Right: Math.sign(-palm('Right').y) || 1 };
  // Ground contact: bent knees lift the feet, so lower the hips until the lowest foot is back on the floor.
  const hips = bones.get('Hips')!;
  const hipsRest = hips.position.clone();
  const feet = ['LeftFoot', 'RightFoot', 'LeftToeBase', 'RightToeBase'].flatMap((n) => bones.get(n) ?? []);
  const floor = () => Math.min(...feet.map((f) => f.getWorldPosition(new THREE.Vector3()).y));
  const restFloor = floor();

  const w = new THREE.Quaternion();
  const p = new THREE.Quaternion();
  const delta = new THREE.Quaternion();
  const solve = (pose: Pose) => {
    for (const [b, q] of rest) b.quaternion.copy(q);
    hips.position.copy(hipsRest);
    model.updateMatrixWorld(true);
    for (const [name, b] of bones) {
      const t = pose[name];
      if (t === undefined) continue;
      // A hand aims along its middle finger, not toward whichever finger is listed first.
      const child = b.children.find((c) => /Middle1$/.test(c.name)) ?? b.children.find((c) => c.position.lengthSq() > 1e-12);
      // Leaf bones (e.g. Head once its _End tip is pruned) fall back to their own axis: glTF bones point along +Y.
      const dir = child
        ? child.getWorldPosition(new THREE.Vector3()).sub(b.getWorldPosition(new THREE.Vector3())).normalize()
        : new THREE.Vector3(0, 1, 0).applyQuaternion(b.getWorldQuaternion(w));
      const rotate = (d: THREE.Quaternion) => {
        b.getWorldQuaternion(w).premultiply(d);
        b.quaternion.copy(b.parent!.getWorldQuaternion(p).invert().multiply(w)).normalize();
        b.updateMatrixWorld(true);
      };
      const aim = Array.isArray(t) ? t : typeof t === 'object' ? t.aim : undefined;
      if (typeof t === 'number') {
        if (!dir) continue;
        const side: Side = name.startsWith('Left') ? 'Left' : 'Right';
        const axis = dir.clone().cross(palm(side).multiplyScalar(palmSign[side]));
        if (axis.lengthSq() > 1e-10) rotate(delta.setFromAxisAngle(axis.normalize(), t));
      }
      if (aim && dir) rotate(delta.setFromUnitVectors(dir, new THREE.Vector3(...aim).normalize().applyQuaternion(toWorld)));
      if (typeof t === 'object' && !Array.isArray(t) && t.palm) {
        const side: Side = name.startsWith('Left') ? 'Left' : 'Right';
        const along = pos(`${side}HandMiddle1`).sub(pos(`${side}Hand`)).normalize();
        const want = new THREE.Vector3(...t.palm).applyQuaternion(toWorld).projectOnPlane(along).normalize();
        const have = palm(side).multiplyScalar(palmSign[side]).projectOnPlane(along).normalize();
        rotate(delta.setFromUnitVectors(have, want));
      }
      if (typeof t === 'object' && !Array.isArray(t) && t.turn) rotate(delta.setFromEuler(new THREE.Euler(...t.turn)).premultiply(toWorld).multiply(fromWorld));
    }
    const grounded = hips.getWorldPosition(new THREE.Vector3());
    grounded.y -= floor() - restFloor;
    hips.position.copy(hips.parent!.worldToLocal(grounded));
    return { quats: [...rest.keys()].map((b) => b.quaternion.toArray()), hips: hips.position.toArray() };
  };

  const clips = Object.entries(ACTIONS).map(([name, keys]) => {
    const frames = keys.map(([, pose]) => solve(pose));
    const times = keys.map(([t]) => t);
    const tracks: THREE.KeyframeTrack[] = [...rest.keys()].map(
      (b, i) => new THREE.QuaternionKeyframeTrack(`${b.name}.quaternion`, times, frames.flatMap((f) => f.quats[i]!)),
    );
    tracks.push(new THREE.VectorKeyframeTrack(`${hips.name}.position`, times, frames.flatMap((f) => f.hips)));
    return new THREE.AnimationClip(name, -1, tracks);
  });
  for (const [b, q] of rest) b.quaternion.copy(q);
  hips.position.copy(hipsRest);
  model.updateMatrixWorld(true);
  return clips;
}
