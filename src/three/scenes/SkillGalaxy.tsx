import { useEffect, useMemo, useRef, useState } from 'react';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';
import { iconUrl } from '../../lib/icons';
import { sceneOf } from '../scroll';

type Group = { label: string; icons: string[] };

/** Rasterise an SVG/PNG icon to a square canvas (SVGs without width/height don't upload reliably as textures). */
async function loadIcon(url: string): Promise<THREE.Texture | null> {
  try {
    const img = new Image();
    img.crossOrigin = 'anonymous';
    img.src = url;
    await img.decode();
    const c = document.createElement('canvas');
    c.width = c.height = 128;
    c.getContext('2d')!.drawImage(img, 12, 12, 104, 104);
    const tex = new THREE.CanvasTexture(c);
    tex.colorSpace = THREE.SRGBColorSpace;
    return tex;
  } catch {
    return null; // missing icon → simply not in the galaxy
  }
}

/** Each skill group is a tilted orbit of icon sprites; the galaxy spins up as the section scrolls by. */
export function SkillGalaxy({ groups }: { groups: Group[] }) {
  const root = useRef<THREE.Group>(null);
  const rings = useRef<THREE.Group[]>([]);
  const [textures, setTextures] = useState<(THREE.Texture | null)[][]>([]);

  useEffect(() => {
    let alive = true;
    Promise.all(groups.map((g) => Promise.all(g.icons.map((i) => loadIcon(iconUrl(i)))))).then((t) => alive && setTextures(t));
    return () => {
      alive = false;
    };
  }, [groups]);

  const material = useMemo(() => new Map<THREE.Texture, THREE.SpriteMaterial>(), []);
  const spriteMaterial = (t: THREE.Texture) => {
    if (!material.has(t)) material.set(t, new THREE.SpriteMaterial({ map: t, transparent: true, depthWrite: false, opacity: 0 }));
    return material.get(t)!;
  };

  useFrame(({ clock }, dt) => {
    const g = root.current;
    if (!g) return;
    const { vis, inner } = sceneOf('skills');
    g.visible = vis > 0.01;
    if (!g.visible) return;

    const s = THREE.MathUtils.damp(g.scale.x, 0.4 + vis * 0.6, 4, dt);
    g.scale.setScalar(s);
    g.rotation.y = inner * Math.PI * 1.2;
    rings.current.forEach((r, i) => (r.rotation.y = clock.elapsedTime * (0.08 + i * 0.025) * (i % 2 ? -1 : 1)));
    material.forEach((m) => (m.opacity = vis * 0.55));
  });

  if (!textures.length) return null;

  return (
    <group ref={root} position={[0, 0, -2]}>
      {groups.map((group, gi) => {
        const radius = 1.8 + gi * 0.75;
        return (
          <group key={group.label} rotation={[0.9 + gi * 0.18, 0, gi * 0.45]}>
            <group ref={(r) => void (r && (rings.current[gi] = r))}>
              {textures[gi]?.map((tex, i, all) => {
                if (!tex) return null;
                const a = (i / all.length) * Math.PI * 2;
                return <sprite key={i} material={spriteMaterial(tex)} position={[Math.cos(a) * radius, 0, Math.sin(a) * radius]} scale={0.32} />;
              })}
            </group>
          </group>
        );
      })}
    </group>
  );
}
