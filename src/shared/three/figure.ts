import * as THREE from 'three';

/** Scale a model to `height`, feet on y=0, centred on x/z. Uses the precise (skinned) box: a rig's raw bounds lie. */
export function fitHeight<T extends THREE.Object3D>(obj: T, height: number): T {
  obj.position.set(0, 0, 0);
  obj.updateMatrixWorld(true);
  const box = new THREE.Box3().setFromObject(obj, true);
  const s = height / box.getSize(new THREE.Vector3()).y;
  obj.scale.multiplyScalar(s);
  obj.position.set(-((box.min.x + box.max.x) / 2) * s, -box.min.y * s, -((box.min.z + box.max.z) / 2) * s);
  obj.traverse((o) => void ((o as THREE.Mesh).isMesh && (o.frustumCulled = false))); // skinned bounds lie
  return obj;
}
