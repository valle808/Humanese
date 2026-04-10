'use client';

import React, { useRef, useMemo } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import { Points, PointMaterial } from '@react-three/drei';
import * as THREE from 'three';

function ReactorParticles({ count = 5000, color = "#ff6b2b", size = 0.08, speed = 0.06 }) {
  const points = useRef<THREE.Points>(null!);
  
  const positions = useMemo(() => {
    const pos = new Float32Array(count * 3);
    for (let i = 0; i < count; i++) {
      const theta = THREE.MathUtils.randFloatSpread(360); 
      const phi = THREE.MathUtils.randFloatSpread(360); 
      const distance = 6 + Math.random() * 10;
      
      pos[i * 3] = distance * Math.sin(theta) * Math.cos(phi);
      pos[i * 3 + 1] = distance * Math.sin(theta) * Math.sin(phi);
      pos[i * 3 + 2] = distance * Math.cos(theta);
    }
    return pos;
  }, [count]);

  useFrame((state) => {
    const time = state.clock.getElapsedTime();
    points.current.rotation.y = time * speed;
    points.current.rotation.x = time * (speed * 0.3);
    
    const pulse = Math.sin(time * 0.4) * 0.15 + 1;
    points.current.scale.setScalar(pulse);
  });

  return (
    <Points ref={points} positions={positions} stride={3} frustumCulled={false}>
      <PointMaterial
        transparent
        color={color}
        size={size}
        sizeAttenuation={true}
        depthWrite={false}
        blending={THREE.AdditiveBlending}
        opacity={0.7}
      />
    </Points>
  );
}

export function SovereignReactor() {
  return (
    <div className="w-full h-full bg-[#050505] relative overflow-hidden">
        <div className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-[#ff6b2b]/40 to-transparent z-10" />
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,_rgba(255,107,43,0.05)_0%,_transparent_75%)] pointer-events-none" />
        
        <Canvas camera={{ position: [0, 0, 18], fov: 55 }} gl={{ antialias: false, powerPreference: "high-performance" }}>
            <color attach="background" args={['#050505']} />
            {/* FLAGSHIP ORANGE PARTICLES */}
            <ReactorParticles count={4000} color="#ff6b2b" size={0.08} speed={0.04} />
            {/* AMBER ACCENT PARTICLES */}
            <ReactorParticles count={2000} color="#ff8c00" size={0.04} speed={-0.03} />
            {/* STARK WHITE CORE PARTICLES */}
            <ReactorParticles count={800} color="#ffffff" size={0.02} speed={0.01} />
            
            <ambientLight intensity={0.4} />
            <pointLight position={[0, 0, 0]} intensity={2} color="#ff6b2b" />
            
            <fog attach="fog" args={['#050505', 10, 25]} />
        </Canvas>
    </div>
  );
}
