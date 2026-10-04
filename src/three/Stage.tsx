import { useEffect, useMemo, useState } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import * as THREE from 'three';
import { sections, site } from '../content';
import { measure, scroll } from './scroll';
import { Core } from './scenes/Core';
import { Particles } from './scenes/Particles';
import { SkillGalaxy } from './scenes/SkillGalaxy';
import { Timeline } from './scenes/Timeline';

export type Palette = { accent: THREE.Color; accent2: THREE.Color };

// Scene inputs derived once from content.
const experience = sections.find((s) => s.type === 'experience');
const skills = sections.find((s) => s.type === 'skills');
const timelineColors = experience?.items.map((i) => i.color ?? site.theme.accent) ?? [];
const galaxyGroups =
  skills?.groups.map((g) => ({ label: g.label, icons: g.items.flatMap((i) => (i.icon ? [i.icon] : [])) })) ?? [];

/** Coarse device tier — fewer particles, lower geometry detail and DPR on phones / low-core machines. */
function quality() {
  const low = window.innerWidth < 768 || (navigator.hardwareConcurrency ?? 8) <= 4;
  return {
    particles: low ? site.effects.particles.mobile : site.effects.particles.desktop,
    detail: low ? 16 : 40,
    dpr: [1, low ? 1.5 : 2] as [number, number],
  };
}

/** Reads section positions every frame (before scenes) and eases the camera toward the pointer. */
function Rig() {
  const sceneEls = useMemo(() => Array.from(document.querySelectorAll<HTMLElement>('[data-scene]')), []);

  useEffect(() => {
    const onMove = (e: PointerEvent) => {
      scroll.pointer.x = (e.clientX / window.innerWidth) * 2 - 1;
      scroll.pointer.y = (e.clientY / window.innerHeight) * 2 - 1;
    };
    window.addEventListener('pointermove', onMove, { passive: true });
    return () => window.removeEventListener('pointermove', onMove);
  }, []);

  useFrame(({ camera }, dt) => {
    measure(sceneEls);
    camera.position.x = THREE.MathUtils.damp(camera.position.x, scroll.pointer.x * 0.5, 2, dt);
    camera.position.y = THREE.MathUtils.damp(camera.position.y, -scroll.pointer.y * 0.35, 2, dt);
    camera.lookAt(0, 0, 0);
  });

  return null;
}

export default function Stage() {
  const [q] = useState(quality);
  const [ready, setReady] = useState(false);
  const palette = useMemo<Palette>(
    () => ({ accent: new THREE.Color(site.theme.accent), accent2: new THREE.Color(site.theme.accent2) }),
    [],
  );

  return (
    <Canvas
      className={`transition-opacity duration-1000 ${ready ? 'opacity-100' : 'opacity-0'}`}
      dpr={q.dpr}
      camera={{ position: [0, 0, 6], fov: 50, near: 0.1, far: 60 }}
      gl={{ antialias: false, alpha: true, powerPreference: 'high-performance' }}
      onCreated={() => setReady(true)}
    >
      <Rig />
      <Particles palette={palette} count={q.particles} />
      <Core palette={palette} detail={q.detail} />
      {timelineColors.length > 0 && <Timeline colors={timelineColors} palette={palette} />}
      {galaxyGroups.length > 0 && <SkillGalaxy groups={galaxyGroups} />}
    </Canvas>
  );
}
