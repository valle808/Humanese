'use client';

import React, { useRef, useState, useMemo } from 'react';
import { Canvas, useFrame, useThree } from '@react-three/fiber';
import { Text, Float, MeshDistortMaterial, PerspectiveCamera } from '@react-three/drei';
import * as THREE from 'three';
import { motion } from 'framer-motion-3d';

interface KnowledgeNodeProps {
  position: [number, number, number];
  title: string;
  onSelect: () => void;
}

function KnowledgeNode({ position, title, onSelect }: KnowledgeNodeProps) {
  const mesh = useRef<THREE.Mesh>(null!);
  const [hovered, setHover] = useState(false);

  useFrame((state) => {
    const time = state.clock.getElapsedTime();
    mesh.current.position.y = position[1] + Math.sin(time + position[0]) * 0.2;
  });

  return (
    <group position={position}>
      <mesh
        ref={mesh}
        onPointerOver={() => setHover(true)}
        onPointerOut={() => setHover(false)}
        onClick={onSelect}
      >
        <sphereGeometry args={[0.5, 32, 32]} />
        <MeshDistortMaterial
          color={hovered ? "#00FF41" : "#1A1A1A"}
          speed={hovered ? 5 : 1}
          distort={0.3}
          radius={1}
          emissive={hovered ? "#00FF41" : "#000"}
          emissiveIntensity={hovered ? 0.5 : 0}
        />
      </mesh>
      <Text
        position={[0, -0.8, 0]}
        fontSize={0.2}
        color="white"
        font="https://fonts.gstatic.com/s/robotomono/v12/L0tkDFI8S0CD14_9dIEoJ_97.woff"
        anchorX="center"
        anchorY="middle"
      >
        {title.toUpperCase()}
      </Text>
    </group>
  );
}

function Connections({ nodes }: { nodes: any[] }) {
  const lineGeometry = useMemo(() => {
    const points = [];
    // Simple lattice connection logic
    for (let i = 0; i < nodes.length - 1; i++) {
      points.push(new THREE.Vector3(...nodes[i].position));
      points.push(new THREE.Vector3(...nodes[i + 1].position));
    }
    return new THREE.BufferGeometry().setFromPoints(points);
  }, [nodes]);

  return (
    <lineSegments geometry={lineGeometry}>
      <lineBasicMaterial color="#00FF41" opacity={0.1} transparent />
    </lineSegments>
  );
}

export function InfiniteCanvas() {
  const nodes = [
    { position: [-5, 2, -2], title: "Neural Protocol" },
    { position: [0, 0, 0], title: "Sovereign Mainframe" },
    { position: [5, -3, -5], title: "VALLE Tokenomics" },
    { position: [-2, -4, 2], title: "Swarm Intelligence" },
    { position: [4, 4, -3], title: "M2M Pacts" },
  ] as const;

  return (
    <div className="w-full h-full bg-obsidian">
      <Canvas shadows dpr={[1, 2]}>
        <PerspectiveCamera makeDefault position={[0, 0, 10]} />
        <color attach="background" args={['#050505']} />
        <fog attach="fog" args={['#050505', 5, 25]} />
        
        <ambientLight intensity={0.2} />
        <pointLight position={[10, 10, 10]} intensity={1.5} color="#00FF41" />
        
        <Float speed={2} rotationIntensity={0.5} floatIntensity={0.5}>
          {nodes.map((node, i) => (
            <KnowledgeNode 
              key={i} 
              position={node.position as [number, number, number]} 
              title={node.title} 
              onSelect={() => console.log('Selected:', node.title)}
            />
          ))}
          <Connections nodes={nodes as any} />
        </Float>
      </Canvas>
    </div>
  );
}
