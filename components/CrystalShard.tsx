'use client';

import { useRef, useMemo, useState, useEffect } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import { MeshTransmissionMaterial, Environment, Float, Sparkles } from '@react-three/drei';
import * as THREE from 'three';

function ShardGeometry() {
  const meshRef = useRef<THREE.Mesh>(null!);
  const [hovered, setHovered] = useState(false);

  // Build a custom faceted crystal geometry
  const geometry = useMemo(() => {
    const geo = new THREE.BufferGeometry();

    // Crystal cluster: a central spire + surrounding smaller spires
    const vertices: number[] = [];
    const indices: number[] = [];

    const addPyramid = (
      cx: number, cy: number, cz: number,
      rx: number, rz: number,
      height: number,
      baseOffset: number,
      twist: number = 0
    ) => {
      const base = vertices.length / 3;
      const sides = 6;
      // base ring
      for (let i = 0; i < sides; i++) {
        const angle = (i / sides) * Math.PI * 2 + twist;
        vertices.push(
          cx + Math.cos(angle) * rx,
          cy + baseOffset,
          cz + Math.sin(angle) * rz
        );
      }
      // apex
      vertices.push(cx, cy + height, cz);
      const apex = base + sides;

      // mid ring for faceting
      for (let i = 0; i < sides; i++) {
        const angle = (i / sides) * Math.PI * 2 + twist + 0.15;
        vertices.push(
          cx + Math.cos(angle) * rx * 0.6,
          cy + baseOffset + height * 0.45,
          cz + Math.sin(angle) * rz * 0.6
        );
      }
      const midBase = base + sides + 1;

      for (let i = 0; i < sides; i++) {
        const next = (i + 1) % sides;
        // lower section
        indices.push(base + i, midBase + i, base + next);
        indices.push(midBase + i, midBase + next, base + next);
        // upper section to apex
        indices.push(midBase + i, apex, midBase + next);
      }
    };

    // Main central spire
    addPyramid(0, -0.5, 0, 0.55, 0.55, 2.4, 0, 0);
    // Surrounding crystal spires
    addPyramid(0.55, -0.5, 0.25, 0.28, 0.28, 1.5, 0.1, 0.3);
    addPyramid(-0.55, -0.5, 0.25, 0.25, 0.25, 1.3, 0.15, -0.2);
    addPyramid(0.2, -0.5, -0.6, 0.30, 0.30, 1.6, 0.05, 0.5);
    addPyramid(-0.25, -0.5, -0.55, 0.22, 0.22, 1.2, 0.2, -0.4);
    addPyramid(0.65, -0.5, -0.3, 0.18, 0.18, 1.0, 0.3, 0.1);
    addPyramid(-0.6, -0.5, -0.2, 0.20, 0.20, 1.1, 0.25, 0.7);
    // Bottom cluster base
    addPyramid(0, -1.2, 0, 0.85, 0.85, 0.8, -0.6, 0.3);

    geo.setAttribute('position', new THREE.Float32BufferAttribute(vertices, 3));
    geo.setIndex(indices);
    geo.computeVertexNormals();
    return geo;
  }, []);

  useFrame(({ clock }) => {
    if (!meshRef.current) return;
    const t = clock.getElapsedTime();
    meshRef.current.rotation.y = t * 0.18;
    meshRef.current.position.y = Math.sin(t * 0.7) * 0.12;
    if (hovered) {
      meshRef.current.rotation.x = Math.sin(t * 0.5) * 0.08;
    }
  });

  return (
    <mesh
      ref={meshRef}
      geometry={geometry}
      onPointerEnter={() => setHovered(true)}
      onPointerLeave={() => setHovered(false)}
      castShadow
    >
      <MeshTransmissionMaterial
        backside
        samples={8}
        resolution={512}
        transmission={0.95}
        roughness={0.04}
        thickness={0.6}
        ior={1.6}
        chromaticAberration={0.08}
        anisotropy={0.2}
        distortion={0.3}
        distortionScale={0.4}
        temporalDistortion={0.1}
        color={hovered ? '#38bdf8' : '#ff6b2b'}
        attenuationDistance={0.6}
        attenuationColor={hovered ? '#0ea5e9' : '#ff4500'}
        toneMapped={false}
      />
    </mesh>
  );
}

function Scene() {
  return (
    <>
      <ambientLight intensity={0.3} />
      <directionalLight position={[5, 8, 5]} intensity={2.5} color="#ff6b2b" />
      <directionalLight position={[-5, 3, -3]} intensity={1.5} color="#ffffff" />
      <pointLight position={[0, 4, 0]} intensity={3} color="#ff6b2b" distance={8} />
      <pointLight position={[0, -3, 0]} intensity={1} color="#ff4500" distance={6} />

      <Float speed={1.4} rotationIntensity={0.2} floatIntensity={0.5}>
        <ShardGeometry />
      </Float>

      <Sparkles
        count={80}
        scale={5}
        size={1.2}
        speed={0.4}
        opacity={0.6}
        color="#ff6b2b"
      />

      <Environment preset="city" />
    </>
  );
}

export default function CrystalShard() {
  const [mounted, setMounted] = useState(false);
  useEffect(() => setMounted(true), []);
  if (!mounted) return null;

  return (
    <div className="relative w-full h-full min-h-[500px]">
      {/* Ambient glow layers */}
      <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
        <div className="w-[300px] h-[300px] bg-primary/20 blur-[100px] rounded-full animate-pulse" />
      </div>
      <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
        <div className="w-[150px] h-[150px] bg-primary/40 blur-[60px] rounded-full" style={{ animation: 'pulse 2s ease-in-out infinite alternate' }} />
      </div>

      <Canvas
        camera={{ position: [0, 1, 5], fov: 45 }}
        gl={{ antialias: true, alpha: true }}
        style={{ background: 'transparent' }}
      >
        <Scene />
      </Canvas>

      {/* HUD labels */}
      <div className="absolute bottom-8 left-1/2 -translate-x-1/2 text-center pointer-events-none select-none">
        <div className="text-[10px] font-black uppercase tracking-[1em] text-primary/60 italic animate-pulse">
          Sovereign_Core // Active
        </div>
      </div>
    </div>
  );
}
