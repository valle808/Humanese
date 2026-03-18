'use client';

import React, { useRef, useMemo } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import { Points, PointMaterial } from '@react-three/drei';
import * as THREE from 'three';

function ReactorParticles({ count = 4000, color = "#00FF41", size = 0.05, speed = 0.05 }) {
  const points = useRef<THREE.Points>(null!);
  
  const positions = useMemo(() => {
    const pos = new Float32Array(count * 3);
    for (let i = 0; i < count; i++) {
      const theta = THREE.MathUtils.randFloatSpread(360); 
      const phi = THREE.MathUtils.randFloatSpread(360); 
      const distance = 8 + Math.random() * 8;
      
      pos[i * 3] = distance * Math.sin(theta) * Math.cos(phi);
      pos[i * 3 + 1] = distance * Math.sin(theta) * Math.sin(phi);
      pos[i * 3 + 2] = distance * Math.cos(theta);
    }
    return pos;
  }, [count]);

  useFrame((state) => {
    const time = state.clock.getElapsedTime();
    points.current.rotation.y = time * speed;
    points.current.rotation.x = time * (speed * 0.4);
    
    const pulse = Math.sin(time * 0.5) * 0.2 + 1;
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
        opacity={0.6}
      />
    </Points>
  );
}

export function SovereignReactor() {
  return (
    <div className="webgl-container">
      <Canvas camera={{ position: [0, 0, 20], fov: 60 }}>
        <color attach="background" args={['#050505']} />
        <ReactorParticles count={3000} color="#00FF41" size={0.06} speed={0.03} />
        <ReactorParticles count={1500} color="#E5E5E5" size={0.03} speed={-0.02} />
        <ambientLight intensity={0.5} />
      </Canvas>
    </div>
  );
}
