import { useMemo, useRef } from 'react';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';
import { sceneOf } from '../scroll';
import type { Palette } from '../Stage';

const GAP = 5; // world units between career stops
const FLOW = 240; // particles streaming along the path

/**
 * A glowing path receding into depth with one node per career stop. Scrolling through the
 * experience section moves the path toward the camera so the active stop sits at the focal point.
 */
export function Timeline({ colors, palette }: { colors: string[]; palette: Palette }) {
  const group = useRef<THREE.Group>(null);
  const nodes = useRef<THREE.Mesh[]>([]);
  const n = colors.length;

  const { curve, tube, flow, flowOffsets } = useMemo(() => {
    const pts = [new THREE.Vector3(0, -0.5, GAP)];
    for (let i = 0; i < n; i++) pts.push(new THREE.Vector3(i % 2 ? 1.2 : -1.2, Math.sin(i * 1.7) * 0.6, -i * GAP));
    pts.push(new THREE.Vector3(0, 0.5, -n * GAP));
    const curve = new THREE.CatmullRomCurve3(pts, false, 'catmullrom', 0.5);
    const flow = new THREE.BufferGeometry();
    flow.setAttribute('position', new THREE.BufferAttribute(new Float32Array(FLOW * 3), 3));
    return {
      curve,
      tube: new THREE.TubeGeometry(curve, 400, 0.012, 6),
      flow,
      flowOffsets: Float32Array.from({ length: FLOW }, () => Math.random()),
    };
  }, [n]);

  const materials = useMemo(
    () => ({
      tube: new THREE.MeshBasicMaterial({ color: palette.accent, transparent: true, opacity: 0, blending: THREE.AdditiveBlending, depthWrite: false }),
      flow: new THREE.PointsMaterial({ color: palette.accent2, size: 0.05, transparent: true, opacity: 0, blending: THREE.AdditiveBlending, depthWrite: false }),
      nodes: colors.map((c) => new THREE.MeshBasicMaterial({ color: c, transparent: true, opacity: 0, wireframe: true })),
    }),
    [colors, palette],
  );

  const tmp = useMemo(() => new THREE.Vector3(), []);

  useFrame(({ clock }, dt) => {
    const g = group.current;
    if (!g) return;
    const { vis, inner } = sceneOf('experience');
    g.visible = vis > 0.01;
    if (!g.visible) return;

    const focus = THREE.MathUtils.clamp(inner * n - 0.5, 0, n - 1); // fractional index of the active stop
    g.position.z = THREE.MathUtils.damp(g.position.z, focus * GAP - 2, 5, dt);
    g.position.x = window.innerWidth < 768 ? 0 : 1.4;

    materials.tube.opacity = vis * 0.8;
    materials.flow.opacity = vis;

    nodes.current.forEach((m, i) => {
      const near = 1 - Math.min(1, Math.abs(focus - i));
      m.scale.setScalar(0.2 + near * 0.3);
      m.rotation.y += dt * (0.3 + near);
      m.rotation.x += dt * 0.2;
      materials.nodes[i]!.opacity = vis * (0.35 + near * 0.65);
    });

    // Stream particles along the path.
    const arr = flow.attributes.position!.array as Float32Array;
    const t = clock.elapsedTime * 0.02;
    for (let i = 0; i < FLOW; i++) {
      curve.getPoint((flowOffsets[i]! + t) % 1, tmp);
      arr[i * 3] = tmp.x + Math.sin(i) * 0.08;
      arr[i * 3 + 1] = tmp.y + Math.cos(i) * 0.08;
      arr[i * 3 + 2] = tmp.z;
    }
    flow.attributes.position!.needsUpdate = true;
  });

  return (
    <group ref={group}>
      <mesh geometry={tube} material={materials.tube} />
      <points geometry={flow} material={materials.flow} frustumCulled={false} />
      {colors.map((_, i) => (
        <mesh
          key={i}
          ref={(m) => void (m && (nodes.current[i] = m))}
          position={curve.points[i + 1]}
          material={materials.nodes[i]}
        >
          <icosahedronGeometry args={[1, 1]} />
        </mesh>
      ))}
    </group>
  );
}
