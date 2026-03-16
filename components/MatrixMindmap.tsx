'use client';

import React, { useMemo } from 'react';
import ForceGraph3D from 'react-force-graph-3d';
import * as THREE from 'three';

interface MatrixMindmapProps {
  onNodeClick?: (node: any) => void;
}

export function MatrixMindmap({ onNodeClick }: MatrixMindmapProps) {
  const gData = useMemo(() => {
    const nodes = [
      { id: 'Neural Core', group: 1, val: 25, description: "Central Sovereignty Hub" },
      { id: 'Bitcoin Core', group: 2, val: 18, description: "Immutable Ledger Access" },
      { id: 'Solana Mainnet', group: 2, val: 15, description: "High-Frequency Transaction Node" },
      { id: 'Apple WebGPU', group: 3, val: 12, description: "Hardware Acceleration Layer" },
      { id: 'Linux Kernel', group: 3, val: 14, description: "OS Sovereignty Foundation" },
      { id: 'Ethical Hackers', group: 4, val: 10, description: "Security Audit Swarm" },
      { id: 'Coinbase SDK', group: 5, val: 12, description: "Institutional Asset Bridge" },
    ];

    const links = [
      { source: 'Neural Core', target: 'Bitcoin Core' },
      { source: 'Neural Core', target: 'Solana Mainnet' },
      { source: 'Neural Core', target: 'Apple WebGPU' },
      { source: 'Neural Core', target: 'Linux Kernel' },
      { source: 'Neural Core', target: 'Ethical Hackers' },
      { source: 'Neural Core', target: 'Coinbase SDK' },
      { source: 'Bitcoin Core', target: 'Coinbase SDK' },
    ];

    return { nodes, links };
  }, []);

  return (
    <div className="w-full h-full min-h-[500px] relative overflow-hidden bg-black/40 backdrop-blur-3xl rounded-3xl border border-white/10 shadow-[0_0_50px_rgba(0,0,0,0.5)]">
      <ForceGraph3D
        graphData={gData}
        backgroundColor="rgba(0,0,0,0)"
        nodeRelSize={4}
        nodeVal={(node: any) => node.val}
        nodeLabel={(node: any) => `
          <div class="bg-black/80 backdrop-blur-md p-4 border border-emerald/20 rounded-xl space-y-1">
            <div class="text-emerald font-bold text-sm tracking-tighter uppercase">${node.id}</div>
            <div class="text-platinum/60 text-[10px] font-mono">${node.description}</div>
            <div class="text-emerald/40 text-[9px] font-mono tracking-widest mt-2 uppercase">Status: 99.997% Pure</div>
          </div>
        `}
        nodeColor={(node: any) => {
          const colors = {
            1: '#00FF41', // Emerald
            2: '#FF9D00', // Gold (Crypto)
            3: '#809BFF', // Blue (System)
            4: '#FD4F30', // Red (Security)
            5: '#6D2EFF', // Purple (Bridge)
          };
          return (colors as any)[node.group] || '#FFFFFF';
        }}
        linkColor={() => 'rgba(0, 255, 65, 0.1)'}
        linkWidth={1.5}
        linkDirectionalParticles={2}
        linkDirectionalParticleSpeed={0.005}
        nodeThreeObject={(node: any) => {
          // Use spheres with glowing materials
          const geometry = new THREE.SphereGeometry(node.val / 5);
          const material = new THREE.MeshPhongMaterial({
            color: (node as any).color,
            transparent: true,
            opacity: 0.8,
            emissive: (node as any).color,
            emissiveIntensity: 0.5,
          });
          return new THREE.Mesh(geometry, material);
        }}
        onNodeClick={(node) => onNodeSelect(node)}
      />
      
      {/* HUD Overlays */}
      <div className="absolute top-6 left-6 pointer-events-none">
        <div className="text-[10px] font-mono font-bold text-emerald uppercase tracking-[0.3em]">Neural Lattice v4.0.1</div>
        <div className="text-platinum/20 text-[9px] font-mono uppercase tracking-[0.2em] mt-1">Force-Directed Physics Active</div>
      </div>
    </div>
  );
}

function onNodeSelect(node: any) {
    if (typeof window !== 'undefined') {
        const event = new CustomEvent('node_focus', { detail: node });
        window.dispatchEvent(event);
    }
}
