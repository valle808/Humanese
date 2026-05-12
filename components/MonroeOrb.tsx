'use client';

import { useRef, useState, useEffect, Suspense, Component, ReactNode } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import { Float, Sparkles, MeshDistortMaterial, Sphere, Trail, useTexture } from '@react-three/drei';
import * as THREE from 'three';
import { useRouter } from 'next/navigation';

// 30 diverse prompt categories — unique seed per mount guarantees a different image
const AI_PROMPTS = [
  "A glowing molecular structure floating in a futuristic lab, neon colors, ultra detailed 8k",
  "A breathtaking galaxy cluster with colorful nebulae and supernovas, cinematic space photography",
  "A microscopic view of cellular mitosis with vibrant neon organelles, macro photography",
  "An alien planet covered in bioluminescent jungles under a violet sky, fantasy art",
  "A cyberpunk city at night with flying vehicles, rain-slicked streets, neon holograms",
  "A surreal fairy tale forest with giant glowing mushrooms and floating lanterns",
  "A majestic wolf face made of aurora borealis and starlight, cosmic wildlife",
  "A human face dissolving into a swirling galaxy, digital art surrealism",
  "A futuristic utopian city floating above the clouds with waterfalls and lush vegetation",
  "A blooming lotus flower made entirely of light and energy, macro photography",
  "An ancient Mayan temple in a dense tropical jungle at golden hour, photorealistic",
  "A time vortex portal showing images of past civilizations and future worlds",
  "A deep sea bioluminescent ocean floor with alien-like creatures glowing",
  "An ice crystal landscape on an arctic planet with two suns rising",
  "A dragon made entirely of fire and lightning soaring over stormy mountains",
  "A microscopic diatom algae seen under electron microscope, ultra detailed",
  "A neural network visualization glowing like neon circuits, digital art",
  "The surface of Jupiter storm system seen from orbit, NASA photography style",
  "A cherry blossom tree at night with fireflies and moonlight reflection on water",
  "Ancient Egyptian gods in a hyper-realistic futuristic setting, digital art",
  "A black hole event horizon with swirling accretion disk, scientific visualization",
  "A pride of lions in a golden savanna at sunset, ultra realistic wildlife photography",
  "A crystal cave with glowing geodes and underground waterfalls, fantasy",
  "A futuristic human city on Mars with geodesic domes and red rocky landscape",
  "A whale swimming through clouds instead of water, dreamlike surrealism",
  "A quantum computing chip magnified 1000x glowing with data streams",
  "The northern lights reflected in a perfectly still fjord lake Norway, photography",
  "A samurai warrior in neon-lit feudal Japan at night, cinematic art",
  "Thousands of monarch butterflies filling an enchanted forest, magical realism",
  "A coral reef teeming with tropical fish in crystal clear water, underwater photography"
];

// ─── Error Boundary ───────────────────────────────────────────────────────────
// Catches any 3D/WebGL crash and renders a safe fallback instead of crashing the page
interface EBState { hasError: boolean }
class OrbErrorBoundary extends Component<{ children: ReactNode; fallback: ReactNode }, EBState> {
  state: EBState = { hasError: false };
  static getDerivedStateFromError() { return { hasError: true }; }
  componentDidCatch(err: Error) { console.warn('[MonroeOrb] 3D error caught, using fallback:', err.message); }
  render() {
    if (this.state.hasError) return this.props.fallback;
    return this.props.children;
  }
}

// ─── Inner World Sphere ───────────────────────────────────────────────────────
// Renders the AI image on an inner sphere — glass shell refracts it
function InnerWorld({ url }: { url: string }) {
  const texture = useTexture(url);
  texture.colorSpace = THREE.SRGBColorSpace;
  return (
    <Sphere args={[0.88, 64, 64]}>
      <meshBasicMaterial map={texture} side={THREE.FrontSide} toneMapped={false} />
    </Sphere>
  );
}

// ─── Orb Core (glowing red plasma) ────────────────────────────────────────────
function OrbCore({ hovered }: { hovered: boolean }) {
  const meshRef = useRef<THREE.Mesh>(null!);
  useFrame(({ clock }) => {
    if (!meshRef.current) return;
    const t = clock.getElapsedTime();
    meshRef.current.rotation.x = Math.sin(t * 0.4) * Math.PI;
    meshRef.current.rotation.y = Math.cos(t * 0.3) * Math.PI;
    meshRef.current.scale.setScalar(0.75 + Math.sin(t * 3) * 0.08);
  });
  return (
    <Sphere ref={meshRef} args={[1, 64, 64]}>
      <MeshDistortMaterial
        color="#ff4500"
        emissive="#ff2200"
        emissiveIntensity={hovered ? 5 : 3}
        distort={0.8}
        speed={5}
        roughness={0.15}
        metalness={0.3}
      />
    </Sphere>
  );
}

// ─── Glass Shell ──────────────────────────────────────────────────────────────
function OrbShell({ hovered }: { hovered: boolean }) {
  const meshRef = useRef<THREE.Mesh>(null!);
  useFrame(({ clock }) => {
    if (!meshRef.current) return;
    const t = clock.getElapsedTime();
    meshRef.current.rotation.y = t * 0.15;
    meshRef.current.rotation.z = Math.sin(t * 0.05) * 0.2;
  });
  return (
    <Sphere ref={meshRef} args={[1.2, 64, 64]}>
      <MeshDistortMaterial
        color={hovered ? '#e0f8ff' : '#ffffff'}
        distort={0.25}
        speed={1.5}
        roughness={0.05}
        metalness={0.0}
        transmission={1}
        ior={1.52}
        thickness={2.5}
        clearcoat={1}
        clearcoatRoughness={0.03}
      />
    </Sphere>
  );
}

// ─── Neural light trails ──────────────────────────────────────────────────────
function NeuralPaths() {
  const groupRef = useRef<THREE.Group>(null!);
  useFrame(({ clock }) => {
    if (!groupRef.current) return;
    const t = clock.getElapsedTime();
    groupRef.current.rotation.y = -t * 0.6;
    groupRef.current.rotation.x = Math.sin(t * 0.3) * 0.5;
  });
  return (
    <group ref={groupRef}>
      <Trail width={1.5} length={10} color="#00ffff" attenuation={(t) => t * t}>
        <mesh position={[1.4, 0.2, 0]}>
          <sphereGeometry args={[0.02]} /><meshBasicMaterial color="#ffffff" />
        </mesh>
      </Trail>
      <Trail width={1.5} length={10} color="#ff0055" attenuation={(t) => t * t}>
        <mesh position={[-1.3, -0.2, 0.5]}>
          <sphereGeometry args={[0.02]} /><meshBasicMaterial color="#ffffff" />
        </mesh>
      </Trail>
      <Trail width={1.2} length={8} color="#0088ff" attenuation={(t) => t * t}>
        <mesh position={[0, 1.4, -0.2]}>
          <sphereGeometry args={[0.02]} /><meshBasicMaterial color="#ffffff" />
        </mesh>
      </Trail>
    </group>
  );
}

// ─── Scene ────────────────────────────────────────────────────────────────────
function Scene({ hovered, envUrl }: { hovered: boolean; envUrl: string }) {
  return (
    <>
      <ambientLight intensity={1.5} color="#ffffff" />
      <directionalLight position={[5, 5, 5]} intensity={3} color="#ffd0b0" />
      <directionalLight position={[-5, -5, -2]} intensity={2} color="#ff4400" />
      <pointLight position={[0, 0, 0]} intensity={hovered ? 5 : 3} color="#ff3300" distance={6} />

      <Float speed={1.5} rotationIntensity={0.6} floatIntensity={0.4}>
        <group scale={0.4}>
          {/* Wrapped in Suspense+ErrorBoundary — if image fails, silently skip */}
          {envUrl && (
            <Suspense fallback={null}>
              <InnerWorld url={envUrl} />
            </Suspense>
          )}
          <OrbCore hovered={hovered} />
          <OrbShell hovered={hovered} />
          <NeuralPaths />
        </group>
      </Float>

      <Sparkles count={hovered ? 100 : 50} scale={2.5} size={1.5} speed={0.6} opacity={0.8}
        color={hovered ? '#00ffff' : '#ff3300'} />
    </>
  );
}

// ─── CSS fallback orb (shown when WebGL crashes) ──────────────────────────────
function CSSFallbackOrb({ onClick }: { onClick: () => void }) {
  return (
    <div className="relative w-full h-full flex items-center justify-center cursor-pointer" onClick={onClick}>
      <div className="w-48 h-48 rounded-full animate-pulse"
        style={{
          background: 'radial-gradient(circle at 35% 35%, rgba(255,200,150,0.95) 0%, rgba(255,100,30,0.9) 40%, rgba(200,50,10,0.85) 100%)',
          boxShadow: '0 0 60px rgba(255,100,30,0.4), inset 0 0 40px rgba(255,200,100,0.3)',
        }}
      />
      <div className="absolute bottom-10 left-1/2 -translate-x-1/2 text-[9px] font-black uppercase tracking-[1em] italic text-primary/40">
        Monroe_Simulation // Active
      </div>
    </div>
  );
}

// ─── Main Export ──────────────────────────────────────────────────────────────
export default function MonroeOrb() {
  const [mounted, setMounted] = useState(false);
  const [hovered, setHovered] = useState(false);
  const [envUrl, setEnvUrl] = useState('');
  const router = useRouter();

  useEffect(() => {
    const prompt = AI_PROMPTS[Math.floor(Math.random() * AI_PROMPTS.length)];
    const seed = Math.floor(Math.random() * 999999);
    const encoded = encodeURIComponent(prompt);
    // Use crossOrigin-friendly URL via pollinations (no API key needed)
    setEnvUrl(
      `https://image.pollinations.ai/prompt/${encoded}?width=512&height=512&nologo=true&seed=${seed}&model=flux`
    );
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
      {/* OrbErrorBoundary catches any WebGL/Three.js crash — page never goes blank */}
      <OrbErrorBoundary fallback={<CSSFallbackOrb onClick={() => router.push('/monroe')} />}>
        <Canvas
          camera={{ position: [0, 0, 4.5], fov: 35 }}
          gl={{ antialias: true, alpha: true, toneMapping: THREE.ACESFilmicToneMapping, toneMappingExposure: 1.2 }}
          style={{ background: 'transparent' }}
          className="w-full h-full"
          onCreated={({ gl }) => {
            // Prevent uncaught WebGL errors from bubbling to React
            gl.domElement.addEventListener('webglcontextlost', (e) => { e.preventDefault(); }, false);
          }}
        >
          <Scene hovered={hovered} envUrl={envUrl} />
        </Canvas>
      </OrbErrorBoundary>

      {/* HUD label */}
      <div className="absolute bottom-10 left-1/2 -translate-x-1/2 pointer-events-none select-none z-10">
        <div className={`text-[9px] font-black uppercase tracking-[1em] italic flex flex-col items-center gap-1 transition-colors duration-300 ${hovered ? 'text-primary' : 'text-primary/40'}`}>
          <span className={hovered ? 'animate-pulse' : ''}>Monroe_Simulation // Active</span>
          {hovered && <span className="text-[7px] text-primary/60 tracking-[0.5em]">Click to Interface</span>}
        </div>
      </div>
    </div>
  );
}
