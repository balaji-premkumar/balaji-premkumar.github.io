import { Suspense, useEffect, useMemo, useRef, useState } from 'react';
import { Canvas, useFrame, useLoader, useThree } from '@react-three/fiber';
import * as THREE from 'three';
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader.js';
import { MeshoptDecoder } from 'three/examples/jsm/libs/meshopt_decoder.module.js';
import { site, type SiteContent } from '@/content';
import { fitHeight } from '@/shared/three/figure';
import { buildActions } from '@/shared/three/gestures';
import { asset } from '@/shared/lib/assets';

type Config = NonNullable<SiteContent['avatar']>;

const HEIGHT = 2; // world units; the camera below frames exactly this

/**
 * The rigged figure (Tripo + Mixamo GLB) standing in the hero stage. Idles, turns toward the cursor,
 * waves when it appears and when hovered, gives a thumbs-up when clicked. Renders only while on screen.
 */
export default function AvatarCanvas({ config }: { config: Config }) {
  const wrap = useRef<HTMLDivElement>(null);
  const [onScreen, setOnScreen] = useState(true);

  useEffect(() => {
    const io = new IntersectionObserver(([e]) => setOnScreen(!!e?.isIntersecting));
    io.observe(wrap.current!);
    return () => io.disconnect();
  }, []);

  return (
    <div ref={wrap} role="img" aria-label={config.alt} className="absolute inset-0 cursor-pointer">
      <Canvas
        frameloop={onScreen ? 'always' : 'never'}
        dpr={[1, 2]}
        camera={{ position: [0, HEIGHT / 2, 4.6], fov: 30, near: 0.1, far: 20 }}
        gl={{ antialias: true, alpha: true }}
        onCreated={({ camera }) => camera.lookAt(0, HEIGHT / 2, 0)}
      >
        <Suspense fallback={null}>
          <Figure config={config} />
        </Suspense>
      </Canvas>
    </div>
  );
}

function Figure({ config }: { config: Config }) {
  const gltf = useLoader(GLTFLoader, asset(config.model), (loader) => loader.setMeshoptDecoder(MeshoptDecoder));
  const target = useThree((s) => s.gl.domElement.parentElement!.parentElement!);
  const body = useRef<THREE.Group>(null);
  const pointer = useRef({ x: 0, y: 0 });

  const model = useMemo(() => fitHeight(gltf.scene, HEIGHT), [gltf]);

  const hands = useMemo(() => {
    const out: THREE.Object3D[] = [];
    model.traverse((o) => void ((o as THREE.Bone).isBone && /hand$/i.test(o.name) && out.push(o)));
    return out;
  }, [model]);

  const anim = useMemo(() => {
    const mixer = new THREE.AnimationMixer(model);
    const clips = gltf.animations.length ? gltf.animations : buildActions(model); // rig without clips → action library
    const get = (name?: string) => {
      const clip = name && THREE.AnimationClip.findByName(clips, name);
      return clip ? mixer.clipAction(clip) : undefined;
    };
    const idle = get(config.clips?.idle);
    let current: THREE.AnimationAction | undefined;
    // Gestures don't restart themselves; `interrupt` lets a click cut into the hover wave.
    const once = (action?: THREE.AnimationAction, interrupt = false) => {
      if (!action || action === current || (current && !interrupt)) return;
      current?.fadeOut(0.2);
      current = action;
      action.reset().setLoop(THREE.LoopOnce, 1);
      action.clampWhenFinished = true;
      action.fadeIn(0.25).play();
      idle?.fadeOut(0.25);
    };
    mixer.addEventListener('finished', (e) => {
      if (e.action !== current) return;
      current = undefined;
      e.action.fadeOut(0.3);
      idle?.reset().fadeIn(0.3).play();
    });
    idle?.play();
    return { mixer, once, get, clips, greet: get(config.clips?.greet), cheer: get(config.clips?.cheer) };
  }, [model, gltf.animations, config.clips]);

  useEffect(() => {
    document.documentElement.dataset.avatar3d = ''; // hides the static poster (index.css)
    anim.once(anim.greet);
    // Dev only: preview any clip from the console, e.g. avatar.play('shrug').
    if (import.meta.env.DEV)
      Object.assign(window, {
        avatar: {
          model,
          clips: anim.clips,
          play: (name: string) => anim.once(anim.get(name), true),
          // Freeze a clip at time t (seconds) for screenshots: avatar.seek('vanakkam', 1.2)
          seek: (name: string, t: number) => {
            anim.mixer.stopAllAction();
            const a = anim.get(name)!.reset().play();
            a.paused = true;
            a.time = t;
            anim.mixer.update(0);
          },
        },
      });
    const onMove = (e: PointerEvent) => {
      pointer.current.x = (e.clientX / innerWidth) * 2 - 1;
      pointer.current.y = (e.clientY / innerHeight) * 2 - 1;
    };
    const greet = () => anim.once(anim.greet);
    const cheer = () => anim.once(anim.cheer, true);
    addEventListener('pointermove', onMove, { passive: true });
    target.addEventListener('pointerenter', greet);
    target.addEventListener('click', cheer);
    return () => {
      delete document.documentElement.dataset.avatar3d;
      removeEventListener('pointermove', onMove);
      target.removeEventListener('pointerenter', greet);
      target.removeEventListener('click', cheer);
      // No mixer.stopAllAction(): StrictMode re-runs this effect, and stopping skips 'finished', so the
      // gesture guard in once() would stay set and block every later gesture. The mixer dies with the model.
    };
  }, [anim, target, model]);

  const maxTurn = THREE.MathUtils.degToRad(config.followPointer);
  useFrame(({ clock }, dt) => {
    anim.mixer.update(Math.min(dt, 0.1)); // first frame after loading carries the whole load time
    if (config.handScale) for (const h of hands) h.scale.setScalar(config.handScale); // after the mixer: clips key scale too
    const b = body.current!;
    b.position.y = Math.sin(clock.elapsedTime * 1.4) * 0.015;
    b.rotation.y = THREE.MathUtils.damp(b.rotation.y, pointer.current.x * maxTurn, 3, dt);
    b.rotation.x = THREE.MathUtils.damp(b.rotation.x, pointer.current.y * maxTurn * 0.15, 3, dt);
  });

  return (
    <>
      <group ref={body}>
        <primitive object={model} />
      </group>
      <hemisphereLight args={['#fff4e8', '#3a3550', 1.8]} />
      <directionalLight position={[0, 1.5, 6]} intensity={1.2} />
      <directionalLight position={[-3, 4, 5]} intensity={2.2} color="#fff4e8" />
      <pointLight position={[-1.6, 2.6, -1.4]} intensity={14} distance={7} color={site.theme.accent} />
      <pointLight position={[1.8, 2.2, -1.2]} intensity={12} distance={7} color={site.theme.yellow} />
    </>
  );
}
