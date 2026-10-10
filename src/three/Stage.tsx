import { Suspense, useEffect, useMemo, useState } from 'react';
import { createPortal } from 'react-dom';
import { Canvas, useFrame } from '@react-three/fiber';
import * as THREE from 'three';
import { sections, site } from '../content';
import { measure, scroll } from './scroll';
import { Avatar } from './scenes/Avatar';
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

const avatar = site.avatar?.enabled ? site.avatar : undefined;
const CAMERA_Z = 6;
// On desktop the hero core becomes a halo behind the figure's head. It sits deeper than the figure, so scale
// x/y by the depth ratio to keep it visually behind the head from the camera's point of view.
const heroPose = avatar?.poses.hero;
function haloFor([x, y, z]: [number, number, number], scale: number) {
  const haloZ = z - 1.8 * scale;
  const k = (CAMERA_Z - haloZ) / (CAMERA_Z - z);
  return { pos: [x * k, (y + avatar!.height * scale * 0.66) * k, haloZ] as [number, number, number], scale: 0.85 * scale };
}
export type HaloAnchor = { desktop: ReturnType<typeof haloFor>; mobile: ReturnType<typeof haloFor> };
const heroAnchor: HaloAnchor | undefined = heroPose && {
  desktop: haloFor(heroPose.pos, heroPose.scale),
  mobile: haloFor(heroPose.mobile ?? heroPose.pos, heroPose.mobileScale ?? heroPose.scale),
};

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

  const canvas = {
    className: `transition-opacity duration-1000 ${ready ? 'opacity-100' : 'opacity-0'}`,
    dpr: q.dpr,
    camera: { position: [0, 0, CAMERA_Z] as [number, number, number], fov: 50, near: 0.1, far: 60 },
    gl: { antialias: false, alpha: true, powerPreference: 'high-performance' as const },
  };

  return (
    <>
      <Canvas {...canvas} onCreated={() => setReady(true)}>
        <Rig />
        <Particles palette={palette} count={q.particles} />
        <Core palette={palette} detail={q.detail} heroAnchor={heroAnchor} />
        {timelineColors.length > 0 && <Timeline colors={timelineColors} palette={palette} />}
        {galaxyGroups.length > 0 && <SkillGalaxy groups={galaxyGroups} />}
      </Canvas>
      {/* The figure gets its own transparent layer above the page (below the navbar and the dealt card in flight),
          so it stands in front of the project cards instead of behind them. Same camera rig → lines up with the core. */}
      {avatar &&
        createPortal(
          <div aria-hidden className="pointer-events-none fixed inset-0 z-30">
            <Canvas {...canvas}>
              <Rig />
              <Suspense fallback={null}>
                <Avatar config={avatar} palette={palette} />
              </Suspense>
            </Canvas>
          </div>,
          document.body,
        )}
    </>
  );
}
