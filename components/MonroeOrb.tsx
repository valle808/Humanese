'use client';

import { useRef, useState, useEffect, useMemo } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import { Float, Sparkles, MeshDistortMaterial, Sphere, Trail, Environment } from '@react-three/drei';
import * as THREE from 'three';
import { useRouter } from 'next/navigation';

const AI_PROMPTS = [
  "A glowing molecular structure in a futuristic city, highly detailed, neon colors, 8k",
  "A vast colorful universe with nebulae, galaxies, and bright stars, cinematic lighting",
  "A microscopic cellular process with vibrant neon colors and glowing connections, macro photography",
  "An amazing alien landscape with giant glowing flora and two moons, fantasy digital art",
  "A cyberpunk city at night with flying cars, holograms, and neon signs, rainy reflections",
  "A surreal fairy tale forest with glowing mushrooms and magical particles floating",
  "A hyper-realistic animal face made of starlight and nebula dust, cosmic entity",
  "A human face formed by glowing constellations in the deep night sky",
  "A utopian prediction of a future metropolis with organic nature integrated into crystal buildings",
  "A beautiful natural process like a blooming flower made of pure light and energy"
];

function DynamicBackground() {
  const prompt = useMemo(() => AI_PROMPTS[Math.floor(Math.random() * AI_PROMPTS.length)], []);
  const seed = useMemo(() => Math.floor(Math.random() * 1000000), []);
  
  const [texture, setTexture] = useState<THREE.Texture | null>(null);
  const [failed, setFailed] = useState(false);

  useEffect(() => {
    let isMounted = true;
    const encodedPrompt = encodeURIComponent(prompt);
    const imageUrl = `https://image.pollinations.ai/prompt/${encodedPrompt}?width=1024&height=1024&nologo=true&seed=${seed}`;
    
    new THREE.TextureLoader().load(
      imageUrl,
      (tex) => {
        if (isMounted) {
          tex.colorSpace = THREE.SRGBColorSpace;
          setTexture(tex);
        }
      },
      undefined,
      (err) => {
        console.warn("AI Background rate limited or failed, falling back to preset.", err);
        if (isMounted) setFailed(true);
      }
    );
    return () => { isMounted = false; };
  }, [prompt, seed]);

  // If the AI image fails (e.g. 429 Too Many Requests), fallback to a reliable preset
  if (failed) {
    return <Environment preset="city" background />;
  }

  // While generating the AI image, show a default environment so the glass doesn't look like a solid blob
  if (!texture) {
    return <Environment preset="city" background />;
  }

  // Once the AI image is ready, render it as the environment
  return (
    <Environment background>
      <mesh>
        <sphereGeometry args={[50, 64, 64]} />
        <meshBasicMaterial map={texture} side={THREE.BackSide} toneMapped={false} />
      </mesh>
    </Environment>
  );
}

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
        color="#ff1a1a"
        emissive="#ff0000"
        emissiveIntensity={hovered ? 6 : 4}
        distort={0.8}
        speed={5}
        roughness={0.2}
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
      <MeshDistortMaterial
        color={hovered ? "#e0ffff" : "#ffffff"}
        emissive="#000000"
        distort={0.25}
        speed={1.5}
        roughness={0.05}
        metalness={0.1}
        transmission={1}
        ior={1.52}
        thickness={2}
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
      <ambientLight intensity={1.5} color="#ffffff" />
      <directionalLight position={[5, 5, 5]} intensity={4} color="#00ffff" />
      <directionalLight position={[-5, -5, -2]} intensity={3} color="#ff0000" />
      <pointLight position={[0, 0, 0]} intensity={hovered ? 6 : 4} color="#ff3300" distance={6} />

      <DynamicBackground />

      <Float speed={1.5} rotationIntensity={0.6} floatIntensity={0.4}>
        <group scale={0.4}>
          <OrbCore hovered={hovered} />
          <OrbShell hovered={hovered} />
          <NeuralPaths />
        </group>
      </Float>

      <Sparkles
        count={hovered ? 100 : 50}
        scale={2.5}
        size={1.5}
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
      className="relative w-full h-full cursor-pointer group flex items-center justify-center overflow-hidden rounded-[3rem]"
      onClick={() => router.push('/monroe')}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
    >
      <div className="absolute inset-0 flex items-center justify-center pointer-events-none transition-opacity duration-500">
        <div
          className={`w-[140px] h-[140px] rounded-full transition-all duration-700 ${hovered ? 'scale-110 opacity-70' : 'scale-100 opacity-40'}`}
          style={{
            background: 'radial-gradient(circle, rgba(0,255,255,0.2) 0%, rgba(255,0,0,0.1) 50%, transparent 70%)',
            animation: 'pulse 4s ease-in-out infinite',
            filter: 'blur(16px)'
          }}
        />
      </div>

      <Canvas
        camera={{ position: [0, 0, 4.5], fov: 35 }}
        gl={{ antialias: true, alpha: true, toneMapping: THREE.ACESFilmicToneMapping, toneMappingExposure: 1.2 }}
        style={{ background: 'transparent' }}
        className="w-full h-full"
      >
        <Scene hovered={hovered} />
      </Canvas>

      <div className="absolute bottom-10 left-1/2 -translate-x-1/2 pointer-events-none select-none transition-all duration-300 z-10 bg-background/50 backdrop-blur-md px-4 py-2 rounded-full border border-primary/20">
        <div className={`text-[9px] font-black uppercase tracking-[1em] italic flex flex-col items-center gap-1 ${hovered ? 'text-primary' : 'text-primary/70'}`}>
          <span className={hovered ? 'animate-pulse' : ''}>Monroe_Simulation // Active</span>
          {hovered && <span className="text-[7px] text-primary/80 tracking-[0.5em]">Click to Interface</span>}
        </div>
      </div>
    </div>
  );
}
