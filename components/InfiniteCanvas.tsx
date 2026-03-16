'use client';

import React, { useRef, useMemo, useEffect, useState } from 'react';
import { Canvas, useFrame, useThree } from '@react-three/fiber';
import { Points, PointMaterial, PerspectiveCamera, Stars } from '@react-three/drei';
import * as THREE from 'three';
import gsap from 'gsap';

interface PointCloudProps {
  volatility: number;
}

function PointCloud({ volatility }: PointCloudProps) {
  const points = useRef<THREE.Points>(null!);
  
  const particleCount = 10000; // Reduced for performance optimization
  const positions = useMemo(() => {
    const pos = new Float32Array(particleCount * 3);
    for (let i = 0; i < particleCount; i++) {
      const phi = Math.acos(-1 + (2 * i) / particleCount);
      const theta = Math.sqrt(particleCount * Math.PI) * phi;
      
      const radius = 5;
      pos[i * 3] = Math.cos(theta) * Math.sin(phi) * radius;
      pos[i * 3 + 1] = Math.sin(theta) * Math.sin(phi) * radius;
      pos[i * 3 + 2] = Math.cos(phi) * radius;
    }
    return pos;
  }, []);

  useFrame((state) => {
    const time = state.clock.getElapsedTime();
    if (points.current) {
      points.current.rotation.y = time * 0.05;
      // Pulse animation based on volatility
      const pulse = 1 + Math.sin(time * 0.5) * (volatility - 0.9);
      points.current.scale.set(pulse, pulse, pulse);
    }
  });

  return (
    <Points ref={points} positions={positions} stride={3} frustumCulled={false}>
      <PointMaterial
        transparent
        color="#00FF41"
        size={0.015}
        sizeAttenuation={true}
        depthWrite={false}
        blending={THREE.AdditiveBlending}
        opacity={0.6}
      />
    </Points>
  );
}

function CameraController({ trigger }: { trigger: number }) {
  const { camera } = useThree();
  
  useEffect(() => {
    if (trigger > 0) {
      gsap.to(camera.position, {
        z: 3,
        duration: 1.2,
        ease: "power3.inOut",
        onComplete: () => {
          gsap.to(camera.position, {
            z: 10,
            duration: 1.8,
            ease: "expo.out"
          });
        }
      });
    }
  }, [trigger, camera]);

  return null;
}

interface InfiniteCanvasProps {
  refreshKey?: number;
  volatility?: number;
}

export function InfiniteCanvas({ refreshKey = 0, volatility = 0.997 }: InfiniteCanvasProps) {
  const [hasError, setHasError] = useState(false);

  return (
    <div className="w-full h-full bg-[#050505] relative">
      {/* Fallback Background */}
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,_rgba(0,255,65,0.05)_0%,_transparent_70%)]" />
      
      {!hasError ? (
        <Canvas 
          dpr={[1, 1.5]} 
          gl={{ antialias: false, powerPreference: "high-performance" }}
          onError={() => setHasError(true)}
          onCreated={({ gl }) => {
            gl.setClearColor('#050505');
          }}
        >
          <PerspectiveCamera makeDefault position={[0, 0, 10]} />
          <CameraController trigger={refreshKey} />
          
          <Stars radius={100} depth={50} count={3000} factor={4} saturation={0} fade speed={0.5} />
          
          <ambientLight intensity={0.5} />
          <PointCloud volatility={volatility} />
          
          <fog attach="fog" args={['#050505', 8, 15]} />
        </Canvas>
      ) : (
        <div className="w-full h-full flex items-center justify-center">
            <div className="text-emerald/20 font-mono text-[10px] uppercase tracking-widest animate-pulse">
                Lattice Visual Engine Offline // Fallback Active
            </div>
        </div>
      )}
    </div>
  );
}
