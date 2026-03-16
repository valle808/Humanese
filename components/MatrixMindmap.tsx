'use client';

import React, { useMemo, useRef, useEffect } from 'react';
import ForceGraph3D from 'react-force-graph-3d';
import * as THREE from 'three';

interface MatrixMindmapProps {
  onNodeClick?: (node: any) => void;
}

export function MatrixMindmap({ onNodeClick }: MatrixMindmapProps) {
  const fgRef = useRef<any>();
  const containerRef = useRef<HTMLDivElement>(null);
  const [dimensions, setDimensions] = React.useState({ width: 800, height: 600 });

  useEffect(() => {
    if (!containerRef.current) return;
    
    const resizeObserver = new ResizeObserver((entries) => {
      for (let entry of entries) {
        setDimensions({
          width: entry.contentRect.width,
          height: entry.contentRect.height
        });
      }
    });

    resizeObserver.observe(containerRef.current);
    return () => resizeObserver.disconnect();
  }, []);

  useEffect(() => {
    if (fgRef.current) {
      // Configure forces for a balanced layout
      fgRef.current.d3Force('link').distance(60);
      fgRef.current.d3Force('charge').strength(-200);
      fgRef.current.d3Force('center').strength(1);
    }
  }, []);

  const getNodeColor = (node: any) => {
    const colors: Record<number, string> = {
      1: '#00FF41', // Emerald
      2: '#FF9D00', // Gold (Crypto)
      3: '#809BFF', // Blue (System)
      4: '#FD4F30', // Red (Security)
      5: '#6D2EFF', // Purple (Bridge)
    };
    return colors[node.group] || '#FFFFFF';
  };

  const gData = useMemo(() => {
    const nodes = [
      { id: 1, name: 'Neural Core', group: 1, val: 25, description: "Central Sovereignty Hub" },
      { id: 2, name: 'Bitcoin Core', group: 2, val: 18, description: "Immutable Ledger Access" },
      { id: 3, name: 'Solana Mainnet', group: 2, val: 15, description: "High-Frequency Transaction Node" },
      { id: 4, name: 'Apple WebGPU', group: 3, val: 12, description: "Hardware Acceleration Layer" },
      { id: 5, name: 'Linux Kernel', group: 3, val: 14, description: "OS Sovereignty Foundation" },
      { id: 6, name: 'Ethical Hackers', group: 4, val: 10, description: "Security Audit Swarm" },
      { id: 7, name: 'Coinbase SDK', group: 5, val: 12, description: "Institutional Asset Bridge" },
    ].map(n => ({ ...n, color: getNodeColor(n) }));

    const links = [
      { source: 1, target: 2 },
      { source: 1, target: 3 },
      { source: 1, target: 4 },
      { source: 1, target: 5 },
      { source: 1, target: 6 },
      { source: 1, target: 7 },
      { source: 2, target: 7 },
    ];

    return { nodes, links };
  }, []);

  return (
    <div ref={containerRef} className="w-full h-full min-h-[500px] relative overflow-hidden bg-black/40 backdrop-blur-3xl rounded-3xl border border-white/10 shadow-[0_0_50px_rgba(0,0,0,0.5)]">
      <ForceGraph3D
        ref={fgRef}
        graphData={gData}
        width={dimensions.width}
        height={dimensions.height}
        backgroundColor="rgba(0,0,0,0)"
        nodeId="id"
        linkSource="source"
        linkTarget="target"
        nodeRelSize={4}
        cooldownTicks={100}
        warmupTicks={20}
        nodeVal={(node: any) => node.val || 10}
        nodeLabel={(node: any) => `
          <div class="bg-black/80 backdrop-blur-md p-4 border border-emerald/20 rounded-xl space-y-1">
            <div class="text-emerald font-bold text-sm tracking-tighter uppercase">${node.name}</div>
            <div class="text-platinum/60 text-[10px] font-mono">${node.description}</div>
            <div class="text-emerald/40 text-[9px] font-mono tracking-widest mt-2 uppercase">Status: 99.997% Pure</div>
          </div>
        `}
        nodeColor={(node: any) => node.color}
        linkColor={() => 'rgba(0, 255, 65, 0.4)'}
        linkWidth={2}
        linkDirectionalParticles={2}
        linkDirectionalParticleSpeed={0.005}
        nodeThreeObject={(node: any) => {
          const colorStr = node.color || '#00FF41';
          const size = (node.val || 10) / 6;
          const geometry = new THREE.SphereGeometry(size);
          
          // Debug safety: Ensure color is a valid string
          const validColor = typeof colorStr === 'string' ? colorStr : '#00FF41';
          
          const material = new THREE.MeshPhongMaterial({
            color: new THREE.Color(validColor),
            transparent: true,
            opacity: 0.9,
            emissive: new THREE.Color(validColor),
            emissiveIntensity: 0.6,
          });
          return new THREE.Mesh(geometry, material);
        }}
        onEngineStop={() => {
          if (fgRef.current) {
            fgRef.current.zoomToFit(600, 100);
          }
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
