import { useMemo, useRef } from 'react';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';
import { scroll, sceneOf } from '../scroll';
import type { Palette } from '../Stage';

const DEPTH = 40;

const vertex = /* glsl */ `
  uniform float uTime, uTravel, uPixelRatio;
  attribute float aSeed;
  varying float vSeed, vFade;
  void main() {
    vec3 p = position;
    // Endless fly-through: wrap z inside [-DEPTH, 6].
    p.z = mod(p.z + uTravel + ${DEPTH.toFixed(1)}, ${(DEPTH + 6).toFixed(1)}) - ${DEPTH.toFixed(1)};
    p.x += sin(uTime * 0.2 + aSeed * 6.28) * 0.15;
    p.y += cos(uTime * 0.15 + aSeed * 6.28) * 0.15;
    vec4 mv = modelViewMatrix * vec4(p, 1.0);
    gl_Position = projectionMatrix * mv;
    gl_PointSize = (2.0 + aSeed * 4.0) * uPixelRatio * (6.0 / -mv.z);
    vSeed = aSeed;
    vFade = smoothstep(${DEPTH.toFixed(1)}, 8.0, -mv.z) * smoothstep(0.5, 3.0, -mv.z);
  }
`;

const fragment = /* glsl */ `
  uniform vec3 uA, uB;
  uniform float uTime;
  varying float vSeed, vFade;
  void main() {
    float d = length(gl_PointCoord - 0.5);
    float glow = smoothstep(0.5, 0.0, d);
    float twinkle = 0.55 + 0.45 * sin(uTime * (1.0 + vSeed * 2.0) + vSeed * 40.0);
    vec3 col = mix(uB, uA, step(0.35, vSeed));
    gl_FragColor = vec4(col, glow * glow * twinkle * vFade * 0.9);
  }
`;

/** Ambient star/data field. Scrolling the page flies the camera through it; the projects section speeds it up. */
export function Particles({ palette, count }: { palette: Palette; count: number }) {
  const points = useRef<THREE.Points>(null);
  const travel = useRef(0);

  const geometry = useMemo(() => {
    const pos = new Float32Array(count * 3);
    const seed = new Float32Array(count);
    for (let i = 0; i < count; i++) {
      // Hollow cylinder around the camera path so nothing sits right on the lens.
      const r = 2.5 + Math.random() * 9;
      const a = Math.random() * Math.PI * 2;
      pos.set([Math.cos(a) * r, Math.sin(a) * r * 0.7, -Math.random() * DEPTH], i * 3);
      seed[i] = Math.random();
    }
    const g = new THREE.BufferGeometry();
    g.setAttribute('position', new THREE.BufferAttribute(pos, 3));
    g.setAttribute('aSeed', new THREE.BufferAttribute(seed, 1));
    return g;
  }, [count]);

  const material = useMemo(
    () =>
      new THREE.ShaderMaterial({
        vertexShader: vertex,
        fragmentShader: fragment,
        uniforms: {
          uTime: { value: 0 },
          uTravel: { value: 0 },
          uPixelRatio: { value: 1 },
          uA: { value: palette.accent },
          uB: { value: palette.accent2 },
        },
        transparent: true,
        depthWrite: false,
        blending: THREE.AdditiveBlending,
      }),
    [palette],
  );

  useFrame(({ clock, gl }, dt) => {
    // Distance travelled = scroll position + a slow idle drift + a warp boost through projects.
    const warp = sceneOf('projects').vis * 6;
    travel.current += dt * (0.4 + warp);
    material.uniforms.uTravel!.value = scroll.page * 30 + travel.current;
    material.uniforms.uTime!.value = clock.elapsedTime;
    material.uniforms.uPixelRatio!.value = gl.getPixelRatio();
    if (points.current) points.current.rotation.z = scroll.page * Math.PI * 0.5;
  });

  return <points ref={points} geometry={geometry} material={material} frustumCulled={false} />;
}
