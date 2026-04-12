'use client';

import React, { useMemo, useRef, useEffect, useState } from 'react';
import ForceGraph3D from 'react-force-graph-3d';
import * as THREE from 'three';
import { motion, AnimatePresence } from 'framer-motion';
import { Activity, Globe, Zap, Shield, Database, Cpu, Target, Network } from 'lucide-react';

interface MatrixMindmapProps {
  onNodeClick?: (node: any) => void;
}

export function MatrixMindmap({ onNodeClick }: MatrixMindmapProps) {
  const fgRef = useRef<any>();
  const containerRef = useRef<HTMLDivElement>(null);
  const [dimensions, setDimensions] = useState({ width: 800, height: 600 });

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
      fgRef.current.d3Force('link').distance(80);
      fgRef.current.d3Force('charge').strength(-300);
      fgRef.current.d3Force('center').strength(1.2);
    }
  }, []);

  const getNodeColor = (node: any) => {
    const colors: Record<number, string> = {
      1: '#ff6b2b', // Flagship Intense Orange
      2: '#ff8c00', // Deep Orange
      3: '#ff4500', // Flame
      4: '#7f2c14', // Burnt Amber
      5: '#ffffff', // Stark White
    };
    return colors[node.group] || '#ff6b2b';
  };

  const gData = useMemo(() => {
    const nodes = [
      { id: 1, name: 'Neural Core', group: 1, val: 35, description: "Central Sovereignty Hub" },
      { id: 2, name: 'Bitcoin Core', group: 2, val: 22, description: "Immutable Ledger Access" },
      { id: 3, name: 'Solana Mainnet', group: 2, val: 20, description: "High-Frequency Transaction Node" },
      { id: 4, name: 'Neural Nexus', group: 3, val: 18, description: "Cognitive Processing Swarm" },
      { id: 5, name: 'Linux Kernel', group: 3, val: 17, description: "OS Sovereignty Foundation" },
      { id: 6, name: 'Security Swarm', group: 4, val: 14, description: "Encryption Oversight Layer" },
      { id: 7, name: 'Asset Bridge', group: 5, val: 16, description: "Cross-Chain Liquidity Sink" },
    ].map(n => ({ ...n, color: getNodeColor(n) }));

    const links = [
      { source: 1, target: 2 },
      { source: 1, target: 3 },
      { source: 1, target: 4 },
      { source: 1, target: 5 },
      { source: 1, target: 6 },
      { source: 1, target: 7 },
      { source: 2, target: 7 },
      { source: 3, target: 4 },
      { source: 5, target: 6 },
    ];

    return { nodes, links };
  }, []);

  return (
    <div ref={containerRef} className="w-full h-full min-h-[600px] relative overflow-hidden bg-[#050505]/40 backdrop-blur-3xl rounded-[3rem] border-2 border-white/5 shadow-[0_80px_150px_rgba(0,0,0,1)] shadow-inner group">
      <div className="absolute inset-0 bg-[url('/assets/noise.png')] opacity-[0.02] mix-blend-overlay pointer-events-none" />
      
      <ForceGraph3D
        ref={fgRef}
        graphData={gData}
        width={dimensions.width}
        height={dimensions.height}
        backgroundColor="rgba(0,0,0,0)"
        nodeId="id"
        linkSource="source"
        linkTarget="target"
        nodeRelSize={5}
        cooldownTicks={120}
        warmupTicks={30}
        nodeVal={(node: any) => node.val || 12}
        nodeLabel={(node: any) => `
          <div class="bg-[#050505] p-6 border-2 border-[#ff6b2b]/40 rounded-[2rem] space-y-3 shadow-2xl backdrop-blur-3xl min-w-[200px]">
            <div class="flex items-center gap-4">
                <div class="w-2 h-2 rounded-full bg-[#ff6b2b] animate-ping"></div>
                <div class="text-white font-black text-xl italic tracking-tighter uppercase whitespace-nowrap leading-none pt-1">${node.name}.</div>
            </div>
            <div class="text-white/20 text-[10px] font-black uppercase tracking-[0.4em] italic leading-relaxed">${node.description}</div>
            <div class="pt-2 mt-4 border-t border-white/5 flex justify-between items-center">
                <span class="text-[#ff6b2b]/40 text-[9px] font-black uppercase tracking-widest italic">Node Status_</span>
                <span class="text-white/40 text-[9px] font-black uppercase italic">99.997% Pure</span>
            </div>
          </div>
        `}
        nodeColor={(node: any) => node.color}
        linkColor={() => 'rgba(255, 107, 43, 0.4)'}
        linkWidth={1.5}
        linkDirectionalParticles={4}
        linkDirectionalParticleSpeed={0.008}
        nodeThreeObject={(node: any) => {
          const colorStr = node.color || '#ff6b2b';
          const size = (node.val || 12) / 4;
          const geometry = new THREE.SphereGeometry(size);
          const material = new THREE.MeshPhongMaterial({
            color: new THREE.Color(colorStr),
            transparent: true,
            opacity: 0.8,
            emissive: new THREE.Color(colorStr),
            emissiveIntensity: 1.5,
          });
          return new THREE.Mesh(geometry, material);
        }}
        onEngineStop={() => {
          if (fgRef.current) {
            fgRef.current.zoomToFit(800, 100);
          }
        }}
        onNodeClick={(node) => onNodeSelect(node, onNodeClick)}
      />
      
      {/* ── HUD OVERLAYS ── */}
      <div className="absolute top-10 left-10 pointer-events-none space-y-4">
        <div className="flex items-center gap-4">
           <Activity className="h-4 w-4 text-[#ff6b2b] animate-pulse" strokeWidth={3} />
           <div className="text-[12px] font-black uppercase tracking-[0.8em] text-[#ff6b2b] italic leading-none pl-1">Neural Lattice v7.0.4</div>
        </div>
        <div className="text-white/5 text-[10px] font-black uppercase tracking-[0.4em] italic leading-none pl-8 group-hover:text-white/10 transition-colors">Force-Directed Physics Active_</div>
      </div>
      
      <div className="absolute bottom-10 right-10 pointer-events-none flex items-center gap-6">
          <div className="flex items-center gap-4">
              <Database className="h-4 w-4 text-white/5" />
              <span className="text-[9px] font-black uppercase tracking-[0.6em] text-white/5 italic">Cluster_Sync_Locked</span>
          </div>
          <div className="flex items-center gap-4">
              <Zap className="h-4 w-4 text-[#ff6b2b]/40" strokeWidth={3} />
              <span className="text-[9px] font-black uppercase tracking-[0.6em] text-white/10 italic">10K Nodes Active</span>
          </div>
      </div>
    </div>
  );
}

function onNodeSelect(node: any, onNodeClick?: (node: any) => void) {
    if (typeof window !== 'undefined') {
        const event = new CustomEvent('node_focus', { detail: node });
        window.dispatchEvent(event);
    }
    onNodeClick?.(node);
}
