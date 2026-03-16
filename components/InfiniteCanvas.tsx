'use client';

import React, { useRef, useMemo, useEffect } from 'react';
import { Canvas, useFrame, useThree } from '@react-three/fiber';
import { Points, PointMaterial, PerspectiveCamera, Stars } from '@react-three/drei';
import * as THREE from 'three';
import gsap from 'gsap';

interface PointCloudProps {
  volatility: number;
}

function PointCloud({ volatility }: PointCloudProps) {
  const points = useRef<THREE.Points>(null!);
  
  const particleCount = 15000;
  const positions = useMemo(() => {
    const pos = new Float32Array(particleCount * 3);
    for (let i = 0; i < particleCount; i++) {
      // Create a sphere (The Marble)
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
      points.current.rotation.z = time * 0.02;
      
      // Dynamic noise displacement simulation via rotation and scale
      const pulse = 1 + Math.sin(time * volatility) * 0.05;
      points.current.scale.set(pulse, pulse, pulse);
    }
  });

  return (
    <Points ref={points} positions={positions} stride={3}>
      <PointMaterial
        transparent
        color="#00FF41"
        size={0.02}
        sizeAttenuation={true}
        depthWrite={false}
        blending={THREE.AdditiveBlending}
      />
    </Points>
  );
}

function CameraController({ trigger }: { trigger: number }) {
  const { camera } = useThree();
  
  useEffect(() => {
    if (trigger > 0) {
      // Glitch fly-through effect
      gsap.to(camera.position, {
        z: 2,
        duration: 1.5,
        ease: "power4.inOut",
        onComplete: () => {
          gsap.to(camera.position, {
            z: 10,
            duration: 2,
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
  return (
    <div className="w-full h-full bg-[#050505]">
      <Canvas dpr={[1, 2]}>
        <PerspectiveCamera makeDefault position={[0, 0, 10]} />
        <CameraController trigger={refreshKey} />
        <color attach="background" args={['#050505']} />
        
        <Stars radius={100} depth={50} count={5000} factor={4} saturation={0} fade speed={1} />
        
        <ambientLight intensity={0.5} />
        <PointCloud volatility={volatility} />
        
        <fog attach="fog" args={['#050505', 5, 20]} />
      </Canvas>
    </div>
  );
}
