import { useMemo, useRef } from 'react';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';
import { simplex3 } from '../noise.glsl';
import { sceneOf } from '../scroll';
import type { HaloAnchor, Palette } from '../Stage';

/** Where the core sits for each section type; blended by how visible each section is. */
type Pose = { pos: [number, number, number]; mobile?: [number, number, number]; scale: number; mobileScale?: number; amp: number };
const POSES: Record<string, Pose> = {
  hero: { pos: [0, 0, 0], scale: 1, amp: 0.22 },
  about: { pos: [-2.7, -1.1, -1.5], mobile: [0, 2.2, -2], scale: 0.55, amp: 0.12 },
  contact: { pos: [0, 0, -2], scale: 1.75, amp: 0.25 },
};

const vertex = /* glsl */ `
  uniform float uTime, uAmp;
  varying vec3 vNormal, vView;
  varying float vNoise;
  ${simplex3}
  void main() {
    float n = snoise(position * 1.1 + uTime * 0.25);
    vNoise = n;
    vec3 p = position + normal * n * uAmp;
    vec4 mv = modelViewMatrix * vec4(p, 1.0);
    vNormal = normalize(normalMatrix * normal);
    vView = normalize(-mv.xyz);
    gl_Position = projectionMatrix * mv;
  }
`;

const fragment = /* glsl */ `
  uniform vec3 uA, uB;
  uniform float uOpacity, uCore;
  varying vec3 vNormal, vView;
  varying float vNoise;
  void main() {
    float fresnel = pow(1.0 - abs(dot(vNormal, vView)), 2.2);
    vec3 col = mix(uB, uA, smoothstep(-0.4, 0.6, vNoise));
    gl_FragColor = vec4(col * (fresnel * 1.6 + uCore), (fresnel + uCore) * uOpacity);
  }
`;

export function Core({ palette, detail, heroAnchor }: { palette: Palette; detail: number; heroAnchor?: HaloAnchor }) {
  const group = useRef<THREE.Group>(null);
  const mobile = typeof window !== 'undefined' && window.innerWidth < 768;

  const [shell, wire] = useMemo(() => {
    const make = (wireframe: boolean, core: number) =>
      new THREE.ShaderMaterial({
        vertexShader: vertex,
        fragmentShader: fragment,
        uniforms: {
          uTime: { value: 0 },
          uAmp: { value: 0.2 },
          uA: { value: palette.accent },
          uB: { value: palette.accent2 },
          uOpacity: { value: 0 },
          uCore: { value: core },
        },
        wireframe,
        transparent: true,
        depthWrite: false,
        blending: THREE.AdditiveBlending,
      });
    return [make(false, 0.03), make(true, 0.0)];
  }, [palette]);

  const target = useMemo(() => ({ pos: new THREE.Vector3(), scale: 0, amp: 0.2 }), []);
  const poses = useMemo(
    (): Record<string, Pose> =>
      heroAnchor
        ? {
            ...POSES,
            hero: {
              ...POSES.hero!,
              pos: heroAnchor.desktop.pos,
              scale: heroAnchor.desktop.scale,
              mobile: heroAnchor.mobile.pos,
              mobileScale: heroAnchor.mobile.scale,
            },
          }
        : POSES,
    [heroAnchor],
  );

  useFrame(({ clock }, dt) => {
    const g = group.current;
    if (!g) return;

    // Weighted blend of poses by section visibility.
    let w = 0;
    target.pos.set(0, 0, 0);
    target.scale = 0;
    target.amp = 0;
    for (const [type, pose] of Object.entries(poses)) {
      const v = sceneOf(type).vis;
      if (!v) continue;
      const pos = mobile && pose.mobile ? pose.mobile : pose.pos;
      target.pos.x += pos[0] * v;
      target.pos.y += pos[1] * v;
      target.pos.z += pos[2] * v;
      target.scale += (mobile ? (pose.mobileScale ?? pose.scale) : pose.scale) * v;
      target.amp += pose.amp * v;
      w += v;
    }
    const opacity = Math.min(1, w);
    if (w > 0) {
      target.pos.divideScalar(w);
      target.scale /= w;
      target.amp /= w;
    }
    // Leaving the hero: the core swells and becomes more turbulent.
    const heroExit = 1 - sceneOf('hero').vis;
    if (sceneOf('hero').vis > 0) {
      target.scale *= 1 + heroExit * 0.8;
      target.amp += heroExit * 0.5;
    }

    const k = 4;
    g.position.x = THREE.MathUtils.damp(g.position.x, target.pos.x, k, dt);
    g.position.y = THREE.MathUtils.damp(g.position.y, target.pos.y, k, dt);
    g.position.z = THREE.MathUtils.damp(g.position.z, target.pos.z, k, dt);
    const s = THREE.MathUtils.damp(g.scale.x, Math.max(0.001, target.scale), k, dt);
    g.scale.setScalar(s);
    g.rotation.y += dt * 0.12;
    g.rotation.x = Math.sin(clock.elapsedTime * 0.2) * 0.2;
    g.visible = s > 0.01;

    for (const m of [shell, wire]) {
      m.uniforms.uTime!.value = clock.elapsedTime;
      m.uniforms.uAmp!.value = THREE.MathUtils.damp(m.uniforms.uAmp!.value, target.amp, k, dt);
      m.uniforms.uOpacity!.value = THREE.MathUtils.damp(m.uniforms.uOpacity!.value, opacity * (m === wire ? 0.25 : 1), k, dt);
    }
  });

  return (
    <group ref={group} scale={0.001}>
      <mesh material={shell}>
        <icosahedronGeometry args={[1.5, detail]} />
      </mesh>
      <mesh material={wire} scale={1.02}>
        <icosahedronGeometry args={[1.5, Math.max(2, Math.floor(detail / 4))]} />
      </mesh>
    </group>
  );
}
