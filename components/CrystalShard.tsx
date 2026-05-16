'use client';

import { useRef, useMemo, useState, useEffect } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import { Float, Sparkles, MeshDistortMaterial } from '@react-three/drei';
import * as THREE from 'three';

// Rainbow color cycle helper
function hslToHex(h: number, s: number, l: number): string {
  const a = s * Math.min(l, 1 - l);
  const f = (n: number) => {
    const k = (n + h / 30) % 12;
    const color = l - a * Math.max(Math.min(k - 3, 9 - k, 1), -1);
    return Math.round(255 * color).toString(16).padStart(2, '0');
  };
  return `#${f(0)}${f(8)}${f(4)}`;
}

function CrystalMesh() {
  const meshRef = useRef<THREE.Mesh>(null!);
  const lightRef = useRef<THREE.PointLight>(null!);
  const [hovered, setHovered] = useState(false);
  const hueRef = useRef(0);

  // Build faceted crystal geometry — scaled down
  const geometry = useMemo(() => {
    const geo = new THREE.BufferGeometry();
    const vertices: number[] = [];
    const indices: number[] = [];

    const addCrystal = (
      cx: number, cy: number, cz: number,
      rx: number, rz: number,
      height: number,
      baseY: number,
      twist: number = 0
    ) => {
      const base = vertices.length / 3;
      const sides = 6;
      for (let i = 0; i < sides; i++) {
        const angle = (i / sides) * Math.PI * 2 + twist;
        vertices.push(cx + Math.cos(angle) * rx, cy + baseY, cz + Math.sin(angle) * rz);
      }
      vertices.push(cx, cy + height, cz);
      const apex = base + sides;

      for (let i = 0; i < sides; i++) {
        const angle = (i / sides) * Math.PI * 2 + twist + 0.2;
        vertices.push(cx + Math.cos(angle) * rx * 0.55, cy + baseY + height * 0.4, cz + Math.sin(angle) * rz * 0.55);
      }
      const midBase = base + sides + 1;

      for (let i = 0; i < sides; i++) {
        const next = (i + 1) % sides;
        indices.push(base + i, midBase + i, base + next);
        indices.push(midBase + i, midBase + next, base + next);
        indices.push(midBase + i, apex, midBase + next);
      }
    };

    // Scale everything down by ~0.55x compared to before
    addCrystal(0, -0.25, 0, 0.30, 0.30, 1.3, 0, 0);
    addCrystal(0.30, -0.25, 0.14, 0.15, 0.15, 0.82, 0.05, 0.3);
    addCrystal(-0.30, -0.25, 0.14, 0.14, 0.14, 0.72, 0.08, -0.2);
    addCrystal(0.11, -0.25, -0.33, 0.17, 0.17, 0.88, 0.02, 0.5);
    addCrystal(-0.14, -0.25, -0.30, 0.12, 0.12, 0.66, 0.11, -0.4);
    addCrystal(0.36, -0.25, -0.16, 0.10, 0.10, 0.55, 0.15, 0.1);
    addCrystal(-0.33, -0.25, -0.11, 0.11, 0.11, 0.60, 0.12, 0.7);
    addCrystal(0, -0.65, 0, 0.47, 0.47, 0.44, -0.33, 0.3);

    geo.setAttribute('position', new THREE.Float32BufferAttribute(vertices, 3));
    geo.setIndex(indices);
    geo.computeVertexNormals();
    return geo;
  }, []);

  useFrame(({ clock }) => {
    if (!meshRef.current) return;
    const t = clock.getElapsedTime();

    // Slow rotation + floating
    meshRef.current.rotation.y = t * 0.22;
    meshRef.current.position.y = Math.sin(t * 0.8) * 0.08;

    const mat = meshRef.current.material as THREE.MeshPhysicalMaterial;

    if (hovered) {
      // Rainbow cycle
      hueRef.current = (hueRef.current + 1.2) % 360;
      const rainbowColor = new THREE.Color(hslToHex(hueRef.current, 1, 0.55));
      mat.color.lerp(rainbowColor, 0.12);
      mat.emissive.lerp(rainbowColor, 0.08);
      mat.emissiveIntensity = 0.5 + Math.sin(t * 4) * 0.3;

      if (lightRef.current) {
        lightRef.current.color = rainbowColor;
        lightRef.current.intensity = 4 + Math.sin(t * 6) * 2;
      }
    } else {
      // Constant warm orange/amber color — always visible
      const baseColor = new THREE.Color('#ff6b2b');
      const accentColor = new THREE.Color('#ff9500');
      const lerpedColor = baseColor.lerp(accentColor, (Math.sin(t * 0.5) + 1) / 2);
      mat.color.lerp(lerpedColor, 0.05);
      mat.emissive.set('#ff3d00');
      mat.emissiveIntensity = 0.25 + Math.sin(t * 1.5) * 0.1;

      if (lightRef.current) {
        lightRef.current.color.set('#ff6b2b');
        lightRef.current.intensity = 2;
      }
    }
  });

  return (
    <group>
      {/* Dynamic point light that follows crystal color */}
      <pointLight ref={lightRef} position={[0, 1, 1]} intensity={2} color="#ff6b2b" distance={6} />

      <mesh
        ref={meshRef}
        geometry={geometry}
        onPointerEnter={() => setHovered(true)}
        onPointerLeave={() => setHovered(false)}
      >
        <meshPhysicalMaterial
          color="#ff6b2b"
          emissive="#ff3d00"
          emissiveIntensity={0.3}
          metalness={0.1}
          roughness={0.05}
          transmission={0.4}
          thickness={0.8}
          ior={1.5}
          reflectivity={0.8}
          clearcoat={1}
          clearcoatRoughness={0.05}
          transparent
          opacity={0.92}
        />
      </mesh>
    </group>
  );
}

function Scene() {
  return (
    <>
      {/* Strong ambient so crystal is always visible */}
      <ambientLight intensity={0.8} color="#ffffff" />

      {/* Key lights from multiple angles */}
      <directionalLight position={[3, 5, 3]} intensity={3} color="#ff8c42" />
      <directionalLight position={[-3, 3, -2]} intensity={2} color="#ffffff" />
      <directionalLight position={[0, -3, 2]} intensity={1} color="#ff4500" />

      {/* Rim light for silhouette definition */}
      <pointLight position={[-2, 2, -3]} intensity={2} color="#ffd700" distance={8} />
      <pointLight position={[2, -1, 2]} intensity={1.5} color="#ff6b2b" distance={6} />

      <Float speed={1.2} rotationIntensity={0.15} floatIntensity={0.4}>
        <CrystalMesh />
      </Float>

      <Sparkles
        count={50}
        scale={3.5}
        size={0.8}
        speed={0.3}
        opacity={0.5}
        color="#ff6b2b"
      />
    </>
  );
}

export default function CrystalShard() {
  const [mounted, setMounted] = useState(false);
  useEffect(() => setMounted(true), []);
  if (!mounted) return null;

  return (
    <div className="relative w-full h-full min-h-[360px]">
      {/* Ambient glow */}
      <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
        <div
          className="w-[200px] h-[200px] rounded-full"
          style={{
            background: 'radial-gradient(circle, rgba(255,107,43,0.3) 0%, transparent 70%)',
            animation: 'pulse 3s ease-in-out infinite',
          }}
        />
      </div>

      <Canvas
        camera={{ position: [0, 0.5, 3.5], fov: 42 }}
        gl={{ antialias: true, alpha: true }}
        style={{ background: 'transparent' }}
      >
        <Scene />
      </Canvas>

      {/* HUD label */}
      <div className="absolute bottom-4 left-1/2 -translate-x-1/2 pointer-events-none select-none">
        <div className="text-[9px] font-black uppercase tracking-[0.5em] md:tracking-[1em] text-primary/50 italic animate-pulse">
          Sovereign_Core // Active
        </div>
      </div>
    </div>
  );
}
