// Tripo's rigged GLB export leaves every joint at the origin with identity rotation; the real bind pose
// survives only in the skin's inverse bind matrices. Rebuild each joint's local transform from them:
// world = inverse(IBM), local = inverse(parentWorld) * world. The export also drops the armature's -90° turn
// about Y (skeleton faces sideways inside the mesh), so the bind pose is turned by TURN and the inverse
// bind matrices rewritten to match. Check: hand joints should sit inside the hand vertices.  Usage: bun art/blender/fix_skeleton.ts in.glb out.glb
import { NodeIO, type Node } from '@gltf-transform/core';
import { ALL_EXTENSIONS } from '@gltf-transform/extensions';
import { Matrix4, Quaternion, Vector3 } from 'three';

const [src, out] = process.argv.slice(2);
const io = new NodeIO().registerExtensions(ALL_EXTENSIONS);
const doc = await io.read(src!);
const skin = doc.getRoot().listSkins()[0]!;
const ibm = skin.getInverseBindMatrices()!;
const TURN = new Matrix4().makeRotationY(-Math.PI / 2);
const world = new Map<Node, Matrix4>();
skin.listJoints().forEach((j, i) => {
  const w = TURN.clone().multiply(new Matrix4().fromArray(ibm.getElement(i, [])).invert());
  world.set(j, w);
  ibm.setElement(i, w.clone().invert().toArray());
});

const fix = (n: Node, parentWorld: Matrix4) => {
  const w = world.get(n) ?? parentWorld.clone().multiply(new Matrix4().fromArray(n.getMatrix()));
  const [t, q, s] = [new Vector3(), new Quaternion(), new Vector3()];
  new Matrix4().copy(parentWorld).invert().multiply(w).decompose(t, q, s);
  if (world.has(n)) n.setTranslation(t.toArray()).setRotation(q.toArray() as [number, number, number, number]).setScale(s.toArray());
  n.listChildren().forEach((c) => fix(c, w));
};
for (const scene of doc.getRoot().listScenes()) for (const n of scene.listChildren()) fix(n, new Matrix4());
await io.write(out!, doc);
console.log('fixed', world.size, 'joints');
