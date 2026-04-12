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
  
  const particleCount = 12000;
  const positions = useMemo(() => {
    const pos = new Float32Array(particleCount * 3);
    for (let i = 0; i < particleCount; i++) {
      const phi = Math.acos(-1 + (2 * i) / particleCount);
      const theta = Math.sqrt(particleCount * Math.PI) * phi;
      
      const radius = 5 + Math.random() * 0.2;
      pos[i * 3] = Math.cos(theta) * Math.sin(phi) * radius;
      pos[i * 3 + 1] = Math.sin(theta) * Math.sin(phi) * radius;
      pos[i * 3 + 2] = Math.cos(phi) * radius;
    }
    return pos;
  }, []);

  useFrame((state) => {
    const time = state.clock.getElapsedTime();
    if (points.current) {
      points.current.rotation.y = time * 0.08;
      points.current.rotation.z = time * 0.03;
      const pulse = 1 + Math.sin(time * 0.5) * (volatility - 1);
      points.current.scale.set(pulse, pulse, pulse);
    }
  });

  return (
    <Points ref={points} positions={positions} stride={3} frustumCulled={false}>
      <PointMaterial
        transparent
        // FLAGSHIP INTENSE ORANGE
        color="#ff6b2b"
        size={0.02}
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
        z: 4,
        duration: 1.5,
        ease: "power4.inOut",
        onComplete: () => {
          gsap.to(camera.position, {
            z: 12,
            duration: 2.5,
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

export function InfiniteCanvas({ refreshKey = 0, volatility = 1.0 }: InfiniteCanvasProps) {
  const [hasError, setHasError] = useState(false);

  return (
    <div className="w-full h-full bg-[#050505] relative overflow-hidden">
      {/* Visual Fallback: Constant Radial Gradient */}
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,_rgba(255,107,43,0.05)_0%,_transparent_75%)]" />
      <div className="absolute inset-0 bg-[url('/assets/noise.png')] opacity-[0.02] mix-blend-overlay pointer-events-none" />
      
      {!hasError ? (
        <Canvas 
          dpr={[1, 1.5]} 
          gl={{ 
            antialias: false, 
            powerPreference: "high-performance",
            alpha: true,
            preserveDrawingBuffer: false
          }}
          onError={() => setHasError(true)}
          onCreated={({ gl }) => {
            gl.setClearColor('#050505', 0);
            
            const handleContextLost = (event: Event) => {
              event.preventDefault();
              setHasError(true);
            };
            
            gl.domElement.addEventListener('webglcontextlost', handleContextLost, false);
            return () => {
              gl.domElement.removeEventListener('webglcontextlost', handleContextLost);
            };
          }}
        >
          <PerspectiveCamera makeDefault position={[0, 0, 12]} />
          <CameraController trigger={refreshKey} />
          
          <Stars radius={120} depth={60} count={3000} factor={6} saturation={0} fade speed={0.6} />
          
          <ambientLight intensity={0.4} />
          <pointLight position={[10, 10, 10]} intensity={1} color="#ff6b2b" />
          <PointCloud volatility={volatility} />
          
          <fog attach="fog" args={['#050505', 10, 20]} />
        </Canvas>
      ) : (
        <div className="w-full h-full flex flex-col items-center justify-center relative bg-[#050505]">
            <div className="relative z-10 space-y-4 text-center">
                <div className="text-[#ff6b2b]/20 font-black text-xs uppercase tracking-[0.8em] animate-pulse italic">
                    Matrix_Engine_Standby_
                </div>
                <div className="text-white/5 font-black text-[10px] uppercase tracking-[0.4em] italic">
                    RESONANCE_FIELD_STABILIZED
                </div>
            </div>
            <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,_rgba(255,107,43,0.08)_0%,_transparent_60%)] animate-pulse" />
        </div>
      )}
    </div>
  );
}
