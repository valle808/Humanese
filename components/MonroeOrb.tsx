'use client';

import { useRef, useState, useEffect } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import { Float, Sparkles, MeshDistortMaterial, Sphere, Trail } from '@react-three/drei';
import * as THREE from 'three';
import { useRouter } from 'next/navigation';

function OrbCore() {
  const meshRef = useRef<THREE.Mesh>(null!);
  
  useFrame(({ clock }) => {
    if (!meshRef.current) return;
    const t = clock.getElapsedTime();
    // Complex unpredictable rotation
    meshRef.current.rotation.x = Math.sin(t * 0.5) * Math.PI;
    meshRef.current.rotation.y = Math.cos(t * 0.3) * Math.PI;
    meshRef.current.scale.setScalar(1 + Math.sin(t * 2) * 0.05);
  });

  return (
    <Sphere ref={meshRef} args={[1, 64, 64]} scale={0.8}>
      <MeshDistortMaterial
        color="#ff1a1a"
        emissive="#ff0000"
        emissiveIntensity={4}
        distort={0.6}
        speed={4}
        roughness={0.2}
        metalness={0.8}
      />
    </Sphere>
  );
}

function OrbShell({ hovered }: { hovered: boolean }) {
  const meshRef = useRef<THREE.Mesh>(null!);
  
  useFrame(({ clock }) => {
    if (!meshRef.current) return;
    const t = clock.getElapsedTime();
    meshRef.current.rotation.y = t * 0.2;
    meshRef.current.rotation.z = Math.sin(t * 0.1) * 0.5;
  });

  return (
    <Sphere ref={meshRef} args={[1.2, 64, 64]}>
      <MeshDistortMaterial
        color={hovered ? "#00ffff" : "#00bfff"}
        emissive="#0088ff"
        emissiveIntensity={hovered ? 1.5 : 0.8}
        distort={0.4}
        speed={2}
        transparent
        opacity={0.4}
        roughness={0.1}
        metalness={1}
        transmission={0.9}
        ior={1.5}
        thickness={1}
        clearcoat={1}
        clearcoatRoughness={0.1}
      />
    </Sphere>
  );
}

function NeuralPaths() {
  const groupRef = useRef<THREE.Group>(null!);
  
  useFrame(({ clock }) => {
    if (!groupRef.current) return;
    const t = clock.getElapsedTime();
    groupRef.current.rotation.y = -t * 0.5;
    groupRef.current.rotation.x = Math.sin(t * 0.2);
  });

  return (
    <group ref={groupRef}>
      <Trail width={2} length={8} color="#00ffff" attenuation={(t) => t * t}>
        <mesh position={[1.4, 0, 0]}>
          <sphereGeometry args={[0.05]} />
          <meshBasicMaterial color="#ffffff" />
        </mesh>
      </Trail>
      <Trail width={2} length={8} color="#ff0055" attenuation={(t) => t * t}>
        <mesh position={[-1.4, 0, 0]}>
          <sphereGeometry args={[0.05]} />
          <meshBasicMaterial color="#ffffff" />
        </mesh>
      </Trail>
      <Trail width={1.5} length={6} color="#0088ff" attenuation={(t) => t * t}>
        <mesh position={[0, 1.4, 0]}>
          <sphereGeometry args={[0.04]} />
          <meshBasicMaterial color="#ffffff" />
        </mesh>
      </Trail>
    </group>
  );
}

function Scene({ hovered }: { hovered: boolean }) {
  return (
    <>
      <ambientLight intensity={1} color="#ffffff" />
      <directionalLight position={[3, 5, 3]} intensity={3} color="#00ffff" />
      <directionalLight position={[-3, -3, -2]} intensity={2} color="#ff0000" />
      <pointLight position={[0, 0, 0]} intensity={hovered ? 5 : 3} color="#ff3300" distance={5} />

      <Float speed={1.5} rotationIntensity={0.5} floatIntensity={0.5}>
        <group scale={1.2}>
          <OrbCore />
          <OrbShell hovered={hovered} />
          <NeuralPaths />
        </group>
      </Float>

      <Sparkles
        count={hovered ? 150 : 80}
        scale={4}
        size={1.5}
        speed={0.8}
        opacity={0.6}
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
      className="relative w-full h-full min-h-[360px] cursor-pointer group"
      onClick={() => router.push('/monroe')}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
    >
      {/* Ambient outer glow */}
      <div className="absolute inset-0 flex items-center justify-center pointer-events-none transition-opacity duration-500">
        <div
          className={`w-[250px] h-[250px] rounded-full transition-all duration-700 ${hovered ? 'scale-110 opacity-60' : 'scale-100 opacity-40'}`}
          style={{
            background: 'radial-gradient(circle, rgba(0,255,255,0.2) 0%, rgba(255,0,0,0.1) 40%, transparent 70%)',
            animation: 'pulse 4s ease-in-out infinite',
            filter: 'blur(20px)'
          }}
        />
      </div>

      <Canvas
        camera={{ position: [0, 0, 4.5], fov: 45 }}
        gl={{ antialias: true, alpha: true, toneMapping: THREE.ACESFilmicToneMapping }}
        style={{ background: 'transparent' }}
      >
        <Scene hovered={hovered} />
      </Canvas>

      {/* HUD label */}
      <div className="absolute bottom-4 left-1/2 -translate-x-1/2 pointer-events-none select-none transition-all duration-300">
        <div className={`text-[9px] font-black uppercase tracking-[1em] italic flex flex-col items-center gap-1 ${hovered ? 'text-primary' : 'text-primary/40'}`}>
          <span className={hovered ? 'animate-pulse' : ''}>Monroe_Simulation // Active</span>
          {hovered && <span className="text-[7px] text-primary/80 tracking-[0.5em]">Click to Interface</span>}
        </div>
      </div>
    </div>
  );
}
