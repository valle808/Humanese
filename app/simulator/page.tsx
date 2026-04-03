'use client';

import * as React from 'react';
import { useState, useCallback, useRef, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Cpu, Terminal, Sparkles, Network, Fingerprint, Activity, ChevronLeft } from 'lucide-react';
import Link from 'next/link';
import dynamic from 'next/dynamic';

// Next.js needs dynamic import for react-force-graph because it uses window
const ForceGraph3D = dynamic(() => import('react-force-graph-3d').then(mod => mod.default), { ssr: false });

export default function SimulatorPage() {
  const [input, setInput] = useState('');
  const [statusText, setStatusText] = useState('SIMULATOR ONLINE: AWAITING NEURAL SEED');
  const [isInjecting, setIsInjecting] = useState(false);
  const fgRef = useRef<any>(null);

  // Initial Semantic Universe
  const [graphData, setGraphData] = useState({
    nodes: [
      { id: 'Monroe', group: 1, val: 20, color: '#00ffc3' },
      { id: 'Swarm', group: 2, val: 10, color: '#7000ff' },
      { id: 'User', group: 3, val: 5, color: '#ffffff' }
    ],
    links: [
      { source: 'Monroe', target: 'Swarm' },
      { source: 'Swarm', target: 'User' },
      { source: 'User', target: 'Monroe' }
    ]
  });

  const handleInject = async () => {
    if (!input.trim() || isInjecting) return;
    
    setIsInjecting(true);
    setStatusText('COMPUTING TOPOLOGICAL VECTORS...');
    
    // Simulate generation of node connections based on the prompt
    setTimeout(() => {
      const newNodeId = `Node_${Math.floor(Math.random() * 1000)}`;
      const randomTarget = graphData.nodes[Math.floor(Math.random() * graphData.nodes.length)].id;
      
      setGraphData(prev => ({
        nodes: [...prev.nodes, { id: newNodeId, group: Math.floor(Math.random()*5), val: Math.random() * 10 + 2, color: Math.random() > 0.5 ? '#00ffc3' : '#ff0055' }],
        links: [...prev.links, { source: newNodeId, target: randomTarget }]
      }));
      
      setStatusText(`INJECTED: NEW CONSCIOUSNESS SHARD [${newNodeId}] LINKED.`);
      setInput('');
      setIsInjecting(false);
      
      // Auto-spin logic for effect
      if (fgRef.current) {
        const distance = 200;
        const distRatio = 1 + distance/Math.hypot(fgRef.current.cameraPosition().x, fgRef.current.cameraPosition().y, fgRef.current.cameraPosition().z);
        fgRef.current.cameraPosition(
          { x: fgRef.current.cameraPosition().x * distRatio, y: fgRef.current.cameraPosition().y * distRatio, z: fgRef.current.cameraPosition().z * distRatio }, 
          { x: 0, y: 0, z: 0 }, 
          2000
        );
      }
    }, 1500);
  };

  return (
    <div className="relative min-h-screen bg-black font-sans overflow-hidden flex flex-col">
      {/* 3D GRAPH CANVAS BACKGROUND */}
      <div className="absolute inset-0 z-0">
        <ForceGraph3D
          ref={fgRef}
          graphData={graphData}
          nodeLabel="id"
          nodeColor="color"
          nodeResolution={16}
          linkWidth={2}
          linkColor={() => 'rgba(255,255,255,0.1)'}
          backgroundColor="#0a0a0a"
          showNavInfo={false}
          nodeAutoColorBy="group"
          d3AlphaDecay={0.01}
        />
        {/* Holographic overlay */}
        <div className="absolute inset-0 pointer-events-none bg-[url('/assets/noise.png')] opacity-[0.03] mix-blend-overlay" />
        <div className="absolute inset-0 pointer-events-none bg-gradient-to-b from-black/80 via-transparent to-black/80" />
      </div>

      {/* FOREGROUND HIGH-END UI */}
      <div className="relative z-10 flex flex-col h-screen pointer-events-none p-4 lg:p-8">
        
        {/* HEADER */}
        <header className="flex-none flex justify-between items-start">
          <Link href="/" className="pointer-events-auto bg-white/5 border border-white/10 hover:bg-white/10 p-3 rounded-2xl backdrop-blur-3xl shadow-xl transition-all group flex items-center justify-center">
             <ChevronLeft className="text-[#00ffc3] group-hover:-translate-x-1 transition-transform" />
          </Link>
          <div className="bg-black/60 border border-white/10 px-6 py-4 rounded-3xl backdrop-blur-3xl flex flex-col items-end">
            <h1 className="text-2xl font-black uppercase tracking-tighter text-white/90 italic flex items-center gap-2">
              The Sovereign <span className="text-[#00ffc3]">Simulator</span> <Fingerprint size={20} className="text-[#00ffc3]" />
            </h1>
            <p className="text-[10px] text-white/40 font-mono uppercase tracking-[0.3em] flex items-center gap-2">
              <span className="relative flex h-1.5 w-1.5">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-[#00ffc3] opacity-75"></span>
                <span className="relative inline-flex rounded-full h-1.5 w-1.5 bg-[#00ffc3]"></span>
              </span>
              Neural Matrix Instantiated
            </p>
          </div>
        </header>

        {/* SIDEBAR HUD */}
        <div className="flex-1 flex flex-col justify-center w-64 space-y-4">
           {/* Mock Data Panel */}
           <div className="bg-black/40 border border-white/5 p-4 rounded-2xl backdrop-blur-md">
             <h3 className="text-[9px] font-black uppercase tracking-[0.4em] text-white/30 mb-4 flex items-center gap-2">
               <Activity size={12} /> Live Topology
             </h3>
             <ul className="space-y-3 font-mono text-[10px] text-[#00ffc3]/80 uppercase">
               <li className="flex justify-between"><span>Global Nodes:</span> <span className="text-white">{graphData.nodes.length}</span></li>
               <li className="flex justify-between"><span>Synaptic Links:</span> <span className="text-white">{graphData.links.length}</span></li>
               <li className="flex justify-between"><span>Render Engine:</span> <span className="text-white">WebGL</span></li>
             </ul>
           </div>
           
           <div className="bg-black/40 border border-white/5 p-4 rounded-2xl backdrop-blur-md">
             <h3 className="text-[9px] font-black uppercase tracking-[0.4em] text-white/30 mb-2 flex items-center gap-2">
               <Network size={12} /> Interaction Method
             </h3>
             <p className="text-xs text-white/50 leading-relaxed">
               Click and drag to physically rotate the semantic universe. Scroll to dive deeper into the neural clusters.
             </p>
           </div>
        </div>

        {/* BOTTOM PROMPT INJECTOR */}
        <div className="flex-none pb-4 pt-8 pointer-events-auto flex justify-center">
          <div className="w-full max-w-2xl bg-black/80 shadow-[0_-20px_50px_rgba(0,255,195,0.1)] border border-[#00ffc3]/20 rounded-3xl p-6 backdrop-blur-3xl overflow-hidden relative">
            <div className="absolute top-0 left-0 w-full h-[1px] bg-gradient-to-r from-transparent via-[#00ffc3] to-transparent opacity-50" />
            
            <div className="flex flex-col gap-3">
              <div className="text-[10px] font-mono uppercase tracking-[0.2em] text-[#00ffc3]/80 flex items-center gap-2">
                 <Terminal size={12} /> {statusText}
              </div>
              
              <div className="relative flex items-center group">
                <input
                   type="text"
                   value={input}
                   onChange={e => setInput(e.target.value)}
                   onKeyPress={e => e.key === 'Enter' && handleInject()}
                   placeholder="Prompt the Simulator (e.g. 'Generate a new cognitive defense mechanism')"
                   className="w-full bg-white/[0.03] border border-white/10 rounded-2xl py-4 px-5 pr-14 text-sm text-white focus:outline-none focus:border-[#00ffc3]/50 focus:bg-[#00ffc3]/5 transition-all outline-none"
                   disabled={isInjecting}
                />
                <button
                   onClick={handleInject}
                   disabled={!input.trim() || isInjecting}
                   className="absolute right-2 bg-[#00ffc3] text-black h-10 w-10 flex items-center justify-center rounded-xl shadow-[0_0_15px_rgba(0,255,195,0.3)] hover:scale-105 active:scale-95 transition-all disabled:opacity-50 disabled:grayscale"
                >
                   <Sparkles size={18} />
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
