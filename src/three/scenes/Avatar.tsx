import { useEffect, useMemo, useRef } from 'react';
import { useFrame, useLoader, useThree } from '@react-three/fiber';
import * as THREE from 'three';
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader.js';
import { MeshoptDecoder } from 'three/examples/jsm/libs/meshopt_decoder.module.js';
import { sections, type SiteContent } from '../../content';
import { asset, srcSet } from '../../lib/assets';
import { scroll, sceneOf } from '../scroll';
import type { Palette } from '../Stage';

type Config = NonNullable<SiteContent['avatar']>;

/** Soft radial glow texture for the floor disc under the figure. */
function glowTexture(color: THREE.Color) {
  const c = document.createElement('canvas');
  c.width = c.height = 128;
  const g = c.getContext('2d')!;
  const grad = g.createRadialGradient(64, 64, 0, 64, 64, 64);
  grad.addColorStop(0, `#${color.getHexString()}aa`);
  grad.addColorStop(1, `#${color.getHexString()}00`);
  g.fillStyle = grad;
  g.fillRect(0, 0, 128, 128);
  return new THREE.CanvasTexture(c);
}

/** Card back: dark card with a lime border, so the spinning card reads as a card from both sides. */
function cardBackTexture(color: THREE.Color) {
  const c = document.createElement('canvas');
  c.width = 256;
  c.height = 144;
  const g = c.getContext('2d')!;
  g.fillStyle = '#16161f';
  g.fillRect(0, 0, 256, 144);
  g.strokeStyle = `#${color.getHexString()}`;
  g.lineWidth = 8;
  g.strokeRect(10, 10, 236, 124);
  const t = new THREE.CanvasTexture(c);
  t.colorSpace = THREE.SRGBColorSpace;
  return t;
}

/** Smallest bundled variant of an image (from the responsive srcset) — plenty for a flying card texture. */
const smallUrl = (path: string) => srcSet(path)?.split(',')[0]?.trim().split(' ')[0] ?? asset(path);

const CARD_ASPECT = 16 / 9;
const tmpV = new THREE.Vector3();
const tmpV2 = new THREE.Vector3();
const tmpQ = new THREE.Quaternion();

type Flight = { index: number; phase: 'windup' | 'released' };

/**
 * The clay figurine (rigged GLB: Blender/Tripo + Mixamo). Stands where site.json `avatar.poses` says for the sections on
 * screen, idles, turns toward the cursor, waves in the hero, cheers at contact — and on desktop deals the project cards:
 * throw clip → at `releaseAt` the card leaves the hand → the page (Projects.tsx) flies it, in front of the cards, to its slot.
 */
export function Avatar({ config, palette }: { config: Config; palette: Palette }) {
  const gltf = useLoader(GLTFLoader, asset(config.model), (loader) => loader.setMeshoptDecoder(MeshoptDecoder));
  const camera = useThree((s) => s.camera) as THREE.PerspectiveCamera;
  const root = useRef<THREE.Group>(null);
  const body = useRef<THREE.Group>(null);
  const card = useRef<THREE.Group>(null);
  const mobile = window.innerWidth < 768;

  // ---- model: normalise to `height`, feet on y=0 (precise box: the Mixamo rig is rotated, raw bounds are not)
  const model = useMemo(() => {
    const scene = gltf.scene;
    scene.updateMatrixWorld(true);
    const box = new THREE.Box3().setFromObject(scene, true);
    const size = box.getSize(new THREE.Vector3());
    const s = config.height / size.y;
    scene.scale.multiplyScalar(s);
    scene.position.set(-((box.min.x + box.max.x) / 2) * s, -box.min.y * s, -((box.min.z + box.max.z) / 2) * s);
    scene.traverse((o) => void ((o as THREE.Mesh).isMesh && (o.frustumCulled = false))); // skinned bounds lie
    return scene;
  }, [gltf, config.height]);

  const hand = useMemo(
    () => (config.handBone ? model.getObjectByName(THREE.PropertyBinding.sanitizeNodeName(config.handBone)) : undefined),
    [model, config.handBone],
  );

  // ---- animation
  const anim = useMemo(() => {
    const mixer = new THREE.AnimationMixer(model);
    const get = (name?: string) => {
      const clip = name && THREE.AnimationClip.findByName(gltf.animations, name);
      return clip ? mixer.clipAction(clip) : undefined;
    };
    const idle = get(config.clips?.idle);
    const once = (action?: THREE.AnimationAction, fade = 0.25) => {
      if (!action) return;
      action.reset().setLoop(THREE.LoopOnce, 1);
      action.clampWhenFinished = true;
      action.fadeIn(fade).play();
      idle?.fadeOut(fade);
    };
    mixer.addEventListener('finished', (e) => {
      if (e.action === idle) return;
      e.action.fadeOut(0.3);
      idle?.reset().fadeIn(0.3).play();
    });
    idle?.play();
    return { mixer, idle, once, greet: get(config.clips?.greet), throw: get(config.clips?.throw), cheer: get(config.clips?.cheer) };
  }, [model, gltf.animations, config.clips]);
  useEffect(() => () => void anim.mixer.stopAllAction(), [anim]);

  // ---- dealing: card textures + request queue (desktop only)
  const deal = config.deal;
  const dealItems = useMemo(() => {
    const s = deal && sections.find((x) => x.type === deal.section);
    return s && s.type === 'projects' ? s.items : [];
  }, [deal]);
  const canDeal = !!deal && !!hand && !!anim.throw && dealItems.length > 0 && matchMedia('(min-width: 1024px)').matches;

  const cardTex = useMemo(() => {
    const loader = new THREE.TextureLoader();
    return dealItems.map((p) => {
      if (!p.image) return null;
      const t = loader.load(smallUrl(p.image));
      t.colorSpace = THREE.SRGBColorSpace;
      return t;
    });
  }, [dealItems]);
  const cardMats = useMemo(() => {
    const front = new THREE.MeshBasicMaterial({ toneMapped: false, side: THREE.FrontSide });
    const back = new THREE.MeshBasicMaterial({ map: cardBackTexture(palette.accent), toneMapped: false, side: THREE.FrontSide });
    return { front, back };
  }, [palette]);

  const queue = useRef<number[]>([]);
  const flight = useRef<Flight | null>(null);

  useEffect(() => {
    if (!canDeal) return;
    const onRequest = (e: Event) => queue.current.push((e as CustomEvent<{ index: number }>).detail.index);
    window.addEventListener('deal:request', onRequest);
    document.documentElement.dataset.deal = '';
    return () => {
      window.removeEventListener('deal:request', onRequest);
      delete document.documentElement.dataset.deal;
    };
  }, [canDeal]);

  const landed = (index: number) => window.dispatchEvent(new CustomEvent('deal:landed', { detail: { index } }));

  // ---- the 3D figure is ready → hide the static poster (see .avatar-poster in index.css)
  useEffect(() => {
    document.documentElement.dataset.avatar3d = '';
    return () => void delete document.documentElement.dataset.avatar3d;
  }, []);

  const glow = useMemo(() => glowTexture(palette.accent), [palette]);
  useEffect(() => () => glow.dispose(), [glow]);

  const target = useMemo(() => ({ pos: new THREE.Vector3(), scale: 0, turn: 0 }), []);
  const poses = Object.entries(config.poses);
  const maxTurn = THREE.MathUtils.degToRad(config.followPointer);
  const seen = useRef({ hero: false, cheer: false });

  useFrame(({ clock }, dt) => {
    const g = root.current;
    const b = body.current;
    const c = card.current;
    if (!g || !b || !c) return;
    anim.mixer.update(dt);

    // Blend the configured poses by how visible each section is (same approach as the core).
    let w = 0;
    target.pos.set(0, 0, 0);
    target.scale = 0;
    target.turn = 0;
    for (const [type, pose] of poses) {
      const v = sceneOf(type).vis;
      if (!v) continue;
      const p = mobile && pose.mobile ? pose.mobile : pose.pos;
      target.pos.x += p[0] * v;
      target.pos.y += p[1] * v;
      target.pos.z += p[2] * v;
      target.scale += (mobile ? (pose.mobileScale ?? pose.scale) : pose.scale) * v;
      target.turn += THREE.MathUtils.degToRad(pose.turn ?? 0) * v;
      w += v;
    }
    if (w > 0) {
      target.pos.divideScalar(w);
      target.turn /= w;
      target.scale /= Math.max(w, 1);
    }

    const k = 4;
    g.position.x = THREE.MathUtils.damp(g.position.x, target.pos.x, k, dt);
    g.position.y = THREE.MathUtils.damp(g.position.y, target.pos.y, k, dt);
    g.position.z = THREE.MathUtils.damp(g.position.z, target.pos.z, k, dt);
    const s = THREE.MathUtils.damp(g.scale.x, Math.max(0.0001, target.scale), k, dt);
    g.scale.setScalar(s);
    g.visible = s > 0.02;

    // Greet when the hero comes (back) into view; cheer when contact does.
    const heroVis = sceneOf('hero').vis;
    if (heroVis > 0.6 && !seen.current.hero && g.visible) anim.once(anim.greet);
    seen.current.hero = heroVis > 0.6 || (seen.current.hero && heroVis > 0.2);
    const contactVis = sceneOf('contact').vis;
    if (contactVis > 0.6 && !seen.current.cheer && g.visible) anim.once(anim.cheer);
    seen.current.cheer = contactVis > 0.6 || (seen.current.cheer && contactVis > 0.2);

    // Idle bob; turn toward the cursor around the configured base angle (dealing: face the cards).
    const dealingNow = !!flight.current;
    b.position.y = Math.sin(clock.elapsedTime * 1.4) * 0.02;
    b.rotation.y = THREE.MathUtils.damp(b.rotation.y, target.turn + (dealingNow ? 0 : scroll.pointer.x * maxTurn), 3, dt);
    b.rotation.x = THREE.MathUtils.damp(b.rotation.x, dealingNow ? 0 : scroll.pointer.y * maxTurn * 0.15, 3, dt);

    if (!canDeal) return;
    dealTick(g, c);
  });

  function dealTick(g: THREE.Group, c: THREE.Group) {
    const dealVis = sceneOf(deal!.section).vis;
    const f = flight.current;

    // Scrolled away mid-deal → land everything instantly (never leave a card hidden).
    if (dealVis < 0.25) {
      if (f?.phase === 'windup') landed(f.index);
      queue.current.splice(0).forEach(landed);
      flight.current = null;
      c.visible = false;
      return;
    }

    // Start the next throw once the figure has arrived at its pose and the previous throw has finished.
    if (!f && queue.current.length && g.visible && dealVis > 0.6) {
      const index = queue.current.shift()!;
      anim.throw!.timeScale = (deal!.speed ?? 1) * (queue.current.length > 1 ? 1.3 : 1); // catch up when cards pile up
      anim.once(anim.throw, 0.15);
      cardMats.front.map = cardTex[index] ?? null;
      cardMats.front.color.set(cardTex[index] ? '#ffffff' : '#16161f');
      cardMats.front.needsUpdate = true;
      flight.current = { index, phase: 'windup' };
    }
    const cur = flight.current;
    if (!cur) return void (c.visible = false);

    const action = anim.throw!;
    if (cur.phase === 'released') {
      // Card is flying on the page (Projects.tsx); wait for the arm to finish before the next throw.
      if (!action.isRunning() || action.time >= action.getClip().duration * 0.92) flight.current = null;
      return;
    }

    // Wind-up: the card sits in the hand until the release point of the throw clip.
    const handWorld = hand!.getWorldPosition(tmpV);
    const inHandWidth = 0.42 * g.scale.x;
    c.visible = true;
    c.position.copy(handWorld);
    c.scale.set(inHandWidth, inHandWidth / CARD_ASPECT, 1);
    c.quaternion.copy(hand!.getWorldQuaternion(tmpQ));

    if (action.time >= action.getClip().duration * deal!.releaseAt) {
      // Hand off to the page: screen position of the hand + on-screen width of the card.
      const ndc = tmpV2.copy(handWorld).project(camera);
      const dist = camera.position.distanceTo(handWorld);
      const pxPerWorld = innerHeight / (2 * Math.tan(THREE.MathUtils.degToRad(camera.fov / 2)) * dist);
      window.dispatchEvent(
        new CustomEvent('deal:release', {
          detail: { index: cur.index, x: ((ndc.x + 1) / 2) * innerWidth, y: ((1 - ndc.y) / 2) * innerHeight, w: inHandWidth * pxPerWorld },
        }),
      );
      cur.phase = 'released';
      c.visible = false;
    }
  }

  return (
    <>
      <group ref={root} scale={0.0001}>
        <group ref={body}>
          <primitive object={model} />
        </group>
        {/* Brand glow disc under the feet */}
        <mesh rotation-x={-Math.PI / 2} position-y={0.01} scale={config.height * 0.55}>
          <planeGeometry />
          <meshBasicMaterial map={glow} transparent depthWrite={false} blending={THREE.AdditiveBlending} />
        </mesh>
        {/* Lights scoped to the figure (other scenes use unlit shaders) */}
        <hemisphereLight args={['#fff4e8', '#1a1a22', 1.6]} />
        {/* Soft front fill so the face reads whichever way the figure turns */}
        <directionalLight position={[0, 1.5, 6]} intensity={1.1} color="#ffffff" />
        <directionalLight position={[-3, 4, 5]} intensity={2.4} color="#fff4e8" />
        <pointLight position={[-1.6, 2.6, -1.4]} intensity={18} distance={7} color={palette.accent} />
        <pointLight position={[1.8, 2.2, -1.2]} intensity={14} distance={7} color={palette.accent2} />
      </group>

      {/* The card in the hand during the wind-up (world space, outside the scaled figure). */}
      <group ref={card} visible={false}>
        <mesh material={cardMats.front}>
          <planeGeometry />
        </mesh>
        <mesh material={cardMats.back} rotation-y={Math.PI}>
          <planeGeometry />
        </mesh>
      </group>
    </>
  );
}
