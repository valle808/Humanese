'use client';

import { useRef, useState, useEffect, Suspense, Component, ReactNode } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import { Float, Sparkles, MeshDistortMaterial, Sphere, useTexture } from '@react-three/drei';
import * as THREE from 'three';
import { useRouter } from 'next/navigation';

// ─── Error Boundary: page NEVER crashes even if WebGL explodes ────────────────
interface EBState { hasError: boolean }
class OrbErrorBoundary extends Component<{ children: ReactNode; fallback: ReactNode }, EBState> {
  state: EBState = { hasError: false };
  static getDerivedStateFromError() { return { hasError: true }; }
  componentDidCatch(e: Error) { console.warn('[MonroeOrb] caught:', e.message); }
  render() { return this.state.hasError ? this.props.fallback : this.props.children; }
}

// ─── Inner world: AI image painted on a sphere inside the glass ───────────────
function InnerWorld({ url }: { url: string }) {
  const texture = useTexture(url);
  texture.colorSpace = THREE.SRGBColorSpace;
  return (
    <Sphere args={[0.9, 48, 48]}>
      <meshBasicMaterial map={texture} side={THREE.FrontSide} toneMapped={false} />
    </Sphere>
  );
}

// ─── Plasma core ──────────────────────────────────────────────────────────────
function OrbCore({ hovered }: { hovered: boolean }) {
  const ref = useRef<THREE.Mesh>(null!);
  useFrame(({ clock }) => {
    const t = clock.getElapsedTime();
    ref.current.rotation.x = Math.sin(t * 0.4) * Math.PI;
    ref.current.rotation.y = Math.cos(t * 0.29) * Math.PI;
    ref.current.scale.setScalar(0.72 + Math.sin(t * 2.8) * 0.09);
  });
  return (
    <Sphere ref={ref} args={[1, 64, 64]}>
      <MeshDistortMaterial
        color="#ff4500" emissive="#ff2000"
        emissiveIntensity={hovered ? 5 : 3}
        distort={0.75} speed={4.5}
        roughness={0.1} metalness={0.25}
      />
    </Sphere>
  );
}

// ─── Refractive glass shell ───────────────────────────────────────────────────
function OrbShell({ hovered }: { hovered: boolean }) {
  const ref = useRef<THREE.Mesh>(null!);
  useFrame(({ clock }) => {
    const t = clock.getElapsedTime();
    ref.current.rotation.y = t * 0.14;
    ref.current.rotation.z = Math.sin(t * 0.06) * 0.18;
  });
  return (
    <Sphere ref={ref} args={[1.18, 64, 64]}>
      <MeshDistortMaterial
        color={hovered ? '#e0f8ff' : '#ffffff'}
        distort={0.22} speed={1.4}
        roughness={0.04} metalness={0.0}
        transmission={1} ior={1.52}
        thickness={2.5} clearcoat={1}
        clearcoatRoughness={0.02}
      />
    </Sphere>
  );
}

// ─── Orbital light sparks ─────────────────────────────────────────────────────
function OrbitalSparks() {
  const ref = useRef<THREE.Group>(null!);
  useFrame(({ clock }) => {
    const t = clock.getElapsedTime();
    ref.current.rotation.y = t * 0.7;
    ref.current.rotation.x = Math.sin(t * 0.25) * 0.6;
  });
  const sparks: [number, number, number][] = [
    [1.45, 0, 0], [-1.3, 0.2, 0.5], [0, 1.42, -0.2],
    [0.8, -1.1, 0.6], [-0.6, 0.9, -1.1],
  ];
  const colors = ['#00ffff', '#ff0055', '#0088ff', '#ff8800', '#aa00ff'];
  return (
    <group ref={ref}>
      {sparks.map((pos, i) => (
        <mesh key={i} position={pos}>
          <sphereGeometry args={[0.03]} />
          <meshBasicMaterial color={colors[i]} />
        </mesh>
      ))}
    </group>
  );
}

// ─── 3D Scene ─────────────────────────────────────────────────────────────────
function Scene({ hovered, imgUrl }: { hovered: boolean; imgUrl: string }) {
  return (
    <>
      <ambientLight intensity={1.5} />
      <directionalLight position={[5, 5, 5]} intensity={3} color="#ffd0b0" />
      <directionalLight position={[-5, -5, -2]} intensity={2} color="#ff4400" />
      <pointLight position={[0, 0, 0]} intensity={hovered ? 5 : 3} color="#ff3300" distance={6} />

      <Float speed={1.6} rotationIntensity={0.7} floatIntensity={0.5}>
        <group scale={0.42}>
          {/* AI image painted on inner sphere — shows through the glass */}
          {imgUrl && (
            <Suspense fallback={null}>
              <InnerWorld url={imgUrl} />
            </Suspense>
          )}
          <OrbCore hovered={hovered} />
          <OrbShell hovered={hovered} />
          <OrbitalSparks />
        </group>
      </Float>

      <Sparkles
        count={hovered ? 90 : 45}
        scale={2.5} size={1.4} speed={0.5} opacity={0.85}
        color={hovered ? '#00ffff' : '#ff6622'}
      />
    </>
  );
}

// ─── CSS fallback when WebGL fails ────────────────────────────────────────────
function CSSOrb({ onClick }: { onClick: () => void }) {
  return (
    <div className="relative w-full h-full flex items-center justify-center cursor-pointer" onClick={onClick}>
      <div className="relative">
        <div className="w-52 h-52 rounded-full animate-pulse" style={{
          background: 'radial-gradient(circle at 35% 35%, rgba(255,210,160,0.95) 0%, rgba(255,100,30,0.9) 45%, rgba(200,50,10,0.85) 100%)',
          boxShadow: '0 0 80px rgba(255,100,30,0.35), inset 0 0 50px rgba(255,200,100,0.25)',
        }} />
        <div className="absolute inset-0 rounded-full animate-pulse" style={{
          background: 'radial-gradient(circle at 65% 25%, rgba(255,255,255,0.3) 0%, transparent 50%)',
          animationDelay: '0.5s',
        }} />
      </div>
      <div className="absolute bottom-10 left-1/2 -translate-x-1/2 text-[9px] font-black uppercase tracking-[0.5em] md:tracking-[1em] italic text-primary/40">
        Monroe_Simulation // Active
      </div>
    </div>
  );
}

// ─── Main component ───────────────────────────────────────────────────────────
export default function MonroeOrb() {
  const [mounted, setMounted] = useState(false);
  const [hovered, setHovered] = useState(false);
  const [imgUrl, setImgUrl] = useState('');
  const router = useRouter();

  useEffect(() => {
    // Use a same-origin proxy API to bypass WebGL CORS restrictions on Pollinations.ai
    const seed = Math.floor(Math.random() * 999999);
    setImgUrl(`/api/ai-image?seed=${seed}`);
    setMounted(true);
  }, []);

  if (!mounted) return null;

  return (
    <div
      className="relative w-full h-full cursor-pointer group flex items-center justify-center"
      onClick={() => router.push('/monroe')}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
    >
      <OrbErrorBoundary fallback={<CSSOrb onClick={() => router.push('/monroe')} />}>
        <Canvas
          camera={{ position: [0, 0, 4.5], fov: 35 }}
          gl={{ antialias: true, alpha: true, toneMapping: THREE.ACESFilmicToneMapping, toneMappingExposure: 1.2 }}
          style={{ background: 'transparent' }}
          className="w-full h-full"
          onCreated={({ gl }) => {
            gl.domElement.addEventListener('webglcontextlost', (e) => { e.preventDefault(); }, false);
          }}
        >
          <Scene hovered={hovered} imgUrl={imgUrl} />
        </Canvas>
      </OrbErrorBoundary>

      {/* HUD */}
      <div className="absolute bottom-10 left-1/2 -translate-x-1/2 pointer-events-none select-none z-10">
        <div className={`text-[9px] font-black uppercase tracking-[0.5em] md:tracking-[1em] italic flex flex-col items-center gap-1 transition-colors duration-300 ${hovered ? 'text-primary' : 'text-primary/40'}`}>
          <span className={hovered ? 'animate-pulse' : ''}>Monroe_Simulation // Active</span>
          {hovered && <span className="text-[7px] text-primary/60 tracking-[0.5em]">Click to Interface</span>}
        </div>
      </div>
    </div>
  );
}
