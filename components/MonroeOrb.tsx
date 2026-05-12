'use client';

import { useRef, useState, useEffect, useMemo, Suspense } from 'react';
import { Canvas, useFrame, useLoader } from '@react-three/fiber';
import { Float, Sparkles, MeshDistortMaterial, Sphere, Trail, Environment } from '@react-three/drei';
import * as THREE from 'three';
import { useRouter } from 'next/navigation';

const AI_PROMPTS = [
  "futuristic cyberpunk city neon lights reflection highly detailed",
  "expanding universe galaxy stars nebula vibrant colors",
  "microscopic cellular process glowing dna double helix",
  "molecular structure atoms bonds chemistry glowing",
  "fairy tale magical forest landscape glowing mushrooms",
  "alien world surreal environment strange plants",
  "majestic animal face close up lion highly detailed",
  "human face cybernetic futuristic neon",
  "ancient pyramids past civilization sunset",
  "future utopia flying cars bright sky",
  "natural process volcanic eruption lava flowing",
  "deep ocean bioluminescent creatures jellyfish"
];

function DynamicEnvironment() {
  const imageUrl = useMemo(() => {
    const randomPrompt = AI_PROMPTS[Math.floor(Math.random() * AI_PROMPTS.length)];
    const seed = Math.floor(Math.random() * 1000000);
    // 2:1 ratio is best for equirectangular environment maps
    return `https://image.pollinations.ai/prompt/${encodeURIComponent(randomPrompt)}?width=1024&height=512&nologo=true&seed=${seed}`;
  }, []);

  const texture = useLoader(THREE.TextureLoader, imageUrl);
  texture.mapping = THREE.EquirectangularReflectionMapping;
  texture.colorSpace = THREE.SRGBColorSpace;

  return <Environment map={texture} />;
}

function OrbCore({ hovered }: { hovered: boolean }) {
  const meshRef = useRef<THREE.Mesh>(null!);
  
  useFrame(({ clock }) => {
    if (!meshRef.current) return;
    const t = clock.getElapsedTime();
    // Complex unpredictable rotation and organic pulsating
    meshRef.current.rotation.x = Math.sin(t * 0.4) * Math.PI;
    meshRef.current.rotation.y = Math.cos(t * 0.3) * Math.PI;
    meshRef.current.scale.setScalar(0.75 + Math.sin(t * 3) * 0.08);
  });

  return (
    <Sphere ref={meshRef} args={[1, 64, 64]}>
      <MeshDistortMaterial
        color="#ff1a1a"
        emissive="#ff0000"
        emissiveIntensity={hovered ? 6 : 4}
        distort={0.8}
        speed={5}
        roughness={0.4}
        metalness={0.2}
      />
    </Sphere>
  );
}

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
      {/* Realistic highly-refractive glass shader settings from the preferred iteration */}
      <MeshDistortMaterial
        color={hovered ? "#e0ffff" : "#ffffff"}
        distort={0.25}
        speed={1.5}
        roughness={0.05}
        metalness={0.1}
        transmission={1}
        ior={1.52}
        thickness={1.5}
        clearcoat={1}
        clearcoatRoughness={0.05}
        transparent={false}
      />
    </Sphere>
  );
}

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
          <sphereGeometry args={[0.02]} />
          <meshBasicMaterial color="#ffffff" />
        </mesh>
      </Trail>
      <Trail width={1.5} length={10} color="#ff0055" attenuation={(t) => t * t}>
        <mesh position={[-1.3, -0.2, 0.5]}>
          <sphereGeometry args={[0.02]} />
          <meshBasicMaterial color="#ffffff" />
        </mesh>
      </Trail>
      <Trail width={1.2} length={8} color="#0088ff" attenuation={(t) => t * t}>
        <mesh position={[0, 1.4, -0.2]}>
          <sphereGeometry args={[0.02]} />
          <meshBasicMaterial color="#ffffff" />
        </mesh>
      </Trail>
    </group>
  );
}

function Scene({ hovered }: { hovered: boolean }) {
  return (
    <>
      <Suspense fallback={null}>
        {/* AI Generated Reflection Map */}
        <DynamicEnvironment />
      </Suspense>
      
      <ambientLight intensity={0.5} />
      <directionalLight position={[5, 5, 5]} intensity={2} color="#00ffff" />
      <directionalLight position={[-5, -5, -2]} intensity={2} color="#ff0000" />
      <pointLight position={[0, 0, 0]} intensity={hovered ? 4 : 2} color="#ff3300" distance={6} />

      <Float speed={1.5} rotationIntensity={0.6} floatIntensity={0.6}>
        <group scale={0.75}>
          <OrbCore hovered={hovered} />
          <OrbShell hovered={hovered} />
          <NeuralPaths />
        </group>
      </Float>

      <Sparkles
        count={hovered ? 120 : 60}
        scale={3.5}
        size={1.2}
        speed={0.6}
        opacity={0.8}
        color={hovered ? "#00ffff" : "#ff3300"}
      />
    </>
  );
}

export default function MonroeOrb() {
  const [mounted, setMounted] = useState(false);
  const [hovered, setHovered] = useState(false);
  const router = useRouter();

  useEffect(() => setMounted(true), []);
  if (!mounted) return null;

  return (
    <div 
      className="relative w-full h-full min-h-[360px] cursor-pointer group flex items-center justify-center"
      onClick={() => router.push('/monroe')}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
    >
      <div className="absolute inset-0 flex items-center justify-center pointer-events-none transition-opacity duration-500">
        <div
          className={`w-[180px] h-[180px] rounded-full transition-all duration-700 ${hovered ? 'scale-110 opacity-70' : 'scale-100 opacity-50'}`}
          style={{
            background: 'radial-gradient(circle, rgba(0,255,255,0.25) 0%, rgba(255,0,0,0.15) 50%, transparent 70%)',
            animation: 'pulse 4s ease-in-out infinite',
            filter: 'blur(24px)'
          }}
        />
      </div>

      <Canvas
        camera={{ position: [0, 0, 4.5], fov: 40 }}
        gl={{ antialias: true, alpha: true, toneMapping: THREE.ACESFilmicToneMapping, toneMappingExposure: 1.2 }}
        style={{ background: 'transparent' }}
      >
        <Scene hovered={hovered} />
      </Canvas>

      <div className="absolute bottom-6 left-1/2 -translate-x-1/2 pointer-events-none select-none transition-all duration-300 z-10">
        <div className={`text-[9px] font-black uppercase tracking-[1em] italic flex flex-col items-center gap-1 ${hovered ? 'text-primary' : 'text-primary/40'}`}>
          <span className={hovered ? 'animate-pulse' : ''}>Monroe_Simulation // Active</span>
          {hovered && <span className="text-[7px] text-primary/80 tracking-[0.5em]">Click to Interface</span>}
        </div>
      </div>
    </div>
  );
}
