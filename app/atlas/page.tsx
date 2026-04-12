'use client';

import React, { useState, useMemo, useRef, useEffect } from 'react';
import dynamic from 'next/dynamic';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  ChevronLeft, 
  Search, 
  Target, 
  Zap, 
  BrainCircuit, 
  Database, 
  Maximize, 
  Map as MapIcon, 
  Filter,
  Orbit,
  Wifi,
  Terminal,
  Layers,
  Sparkles,
  Grid
} from 'lucide-react';
import Link from 'next/link';
import type { SovereignKnowledge } from '@/lib/sovereign-graph';

// Component
import ShardHUD from '@/components/atlas/shard-hud';

// Dynamic Import for ForceGraph2D
const ForceGraph2D = dynamic(() => import('react-force-graph-2d'), { 
  ssr: false 
}) as any;

export default function CognitiveAtlasPage() {
  const [graphData, setGraphData] = useState<SovereignKnowledge>({ nodes: [], links: [] });
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedNode, setSelectedNode] = useState<any>(null);
  const [isSearching, setIsSearching] = useState(false);
  const fgRef = useRef<any>(null);

  const [allData, setAllData] = useState<SovereignKnowledge>({ nodes: [], links: [] });

  useEffect(() => {
    const fetchGraph = async () => {
      try {
        const res = await fetch('/api/knowledge-graph');
        if (res.ok) {
          const data = await res.json();
          setAllData(data);
          setGraphData(data);
        }
      } catch (err) {
        console.error("Atlas: Graph load failed", err);
      }
    };
    fetchGraph();
  }, []);

  const handleSearch = () => {
    if (!searchTerm.trim()) {
      setGraphData(allData);
      return;
    }
    setIsSearching(true);
    
    // Client-side filtering mechanism
    const term = searchTerm.toLowerCase();
    const matchedNodes = allData.nodes.filter((n: any) => 
      n.id.toLowerCase().includes(term) || 
      n.label.toLowerCase().includes(term)
    );
    const matchedIds = new Set(matchedNodes.map((n: any) => n.id));
    const matchedLinks = allData.links.filter((l: any) => 
      matchedIds.has(l.source) || matchedIds.has(l.target)
    );

    setGraphData({ nodes: matchedNodes, links: matchedLinks });
    setTimeout(() => setIsSearching(false), 300);
  };

  const formattedData = useMemo(() => ({
    nodes: graphData.nodes.map(n => ({
      ...n,
      color: n.type === 'PREDICTION' ? '#ff6b2b' : n.type === 'CONVERSATION' ? '#ff6b2b' : '#333333',
      size: n.type === 'THEME' ? 4 : 8
    })),
    links: graphData.links.map(l => ({
      ...l,
      color: 'rgba(255,255,255,0.06)',
      width: 1
    }))
  }), [graphData]);

  return (
    <div className="relative min-h-screen bg-[#050505] text-white selection:bg-[#ff6b2b]/40 selection:text-white font-sans overflow-hidden flex flex-col">
      
      {/* 🌌 AMBIENT CORE */}
      <div className="fixed inset-0 pointer-events-none z-0">
        <div className="absolute top-[-10%] left-[-10%] w-[100vw] h-[100vw] bg-[#ff6b2b]/5 blur-[350px] rounded-full" />
        <div className="absolute bottom-[-10%] right-[-10%] w-[90vw] h-[90vw] bg-[#ff6b2b]/2 blur-[250px] rounded-full" />
        <div className="absolute inset-0 bg-[url('/assets/noise.png')] opacity-[0.03] mix-blend-overlay" />
      </div>

      <main className="relative z-10 flex-1 flex flex-col">
        
        {/* GRAPH CANVAS - ABSOLUTE BACKGROUND LAYER */}
        <div className="absolute inset-0 z-0">
           {typeof window !== 'undefined' && (
             <ForceGraph2D
                ref={fgRef}
                graphData={formattedData}
                nodeLabel="label"
                nodeColor="color"
                nodeRelSize={1}
                nodeVal="size"
                linkColor="color"
                linkWidth="width"
                backgroundColor="#05050500"
                onNodeClick={(node: any) => setSelectedNode(node)}
                cooldownTicks={100}
                onEngineStop={() => fgRef.current?.zoomToFit(400, 100)}
             />
           )}
        </div>

        {/* ATLAS OVERLAY UI */}
        <div className="relative z-10 p-8 lg:p-16 h-screen flex flex-col pointer-events-none">
          
          {/* HEADER NAV */}
          <div className="flex-none flex justify-between items-start pointer-events-auto">
             <div className="flex gap-6">
                <Link href="/" className="h-16 w-16 bg-[#050505]/60 border-2 border-white/10 hover:bg-[#ff6b2b] hover:text-black hover:border-[#ff6b2b] rounded-2xl backdrop-blur-3xl shadow-2xl transition-all group flex items-center justify-center active:scale-95">
                   <ChevronLeft size={32} className="group-hover:-translate-x-1 transition-transform" strokeWidth={2.5} />
                </Link>
                <div className="bg-[#050505]/60 border-2 border-white/10 p-6 rounded-[2.5rem] backdrop-blur-3xl space-y-2 shadow-2xl group">
                   <div className="flex items-center gap-4 text-[#ff6b2b] font-black uppercase tracking-[0.5em] text-[10px] italic leading-none animate-pulse pl-1">
                      <Orbit size={14} className="animate-spin-slow" /> OMEGA_v7.0_CARTOGRAPHY
                   </div>
                   <h1 className="text-4xl font-black uppercase tracking-tighter italic leading-none whitespace-nowrap text-white pl-1">
                      The Cognitive <span className="text-transparent bg-clip-text bg-gradient-to-r from-white to-[#ff6b2b]/40">Atlas.</span>
                   </h1>
                </div>
             </div>
             
             <div className="flex gap-6 pt-2">
                <div className="bg-[#050505]/60 border-2 border-white/5 rounded-[2.5rem] p-6 backdrop-blur-3xl space-y-2 text-right min-w-[180px] shadow-2xl relative overflow-hidden group">
                   <div className="absolute top-0 left-0 w-full h-[1px] bg-gradient-to-r from-transparent via-[#ff6b2b]/40 to-transparent" />
                   <div className="text-[10px] text-white/20 uppercase tracking-[0.4em] font-black italic mb-1">Active Shards</div>
                   <div className="text-4xl font-black text-[#ff6b2b] italic leading-none">{graphData.nodes.length || '0'}</div>
                </div>
                <button className="h-20 w-20 bg-[#050505]/60 border-2 border-white/10 hover:bg-white/10 rounded-[2.5rem] flex items-center justify-center transition-all group backdrop-blur-3xl shadow-2xl active:scale-95">
                   <Maximize size={32} className="text-white/20 group-hover:text-white transition-colors" />
                </button>
             </div>
          </div>

          {/* CENTRE-RIGHT SEARCH */}
          <div className="mt-12 pointer-events-auto flex justify-center lg:justify-start">
             <div className="w-full max-w-xl bg-[#050505]/80 border-2 border-white/10 rounded-[3.5rem] p-4 backdrop-blur-3xl shadow-[0_50px_100px_rgba(0,0,0,0.8)] flex items-center gap-6 group hover:border-[#ff6b2b]/30 transition-all">
                <div className="h-16 w-16 bg-white/[0.03] rounded-[1.8rem] flex items-center justify-center text-[#ff6b2b] group-focus-within:bg-[#ff6b2b]/10 transition-all">
                   <Search size={28} strokeWidth={2.5} />
                </div>
                <input 
                  type="text"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  onKeyDown={(e) => e.key === 'Enter' && handleSearch()}
                  placeholder="Query cognitive shards..."
                  className="bg-transparent border-none outline-none text-2xl font-light italic text-white w-full placeholder:text-white/5 tracking-tight"
                />
                <button
                  onClick={handleSearch}
                  className="bg-[#ff6b2b] text-black px-10 py-5 rounded-[2rem] font-black uppercase text-xs tracking-[0.4em] hover:scale-105 active:scale-95 transition-all shadow-[0_20px_50px_rgba(255,107,43,0.3)] italic leading-none shrink-0"
                >
                  {isSearching ? <Activity className="animate-spin" size={20} strokeWidth={3} /> : 'QUERY'}
                </button>
             </div>
          </div>

          {/* BOTTOM FILTERS BAR */}
          <div className="mt-auto flex flex-col lg:flex-row justify-between items-end pointer-events-auto gap-12">
             <div className="bg-[#050505]/80 border-2 border-white/10 p-10 rounded-[4rem] backdrop-blur-3xl flex flex-wrap gap-16 shadow-[0_80px_150px_rgba(0,0,0,0.9)] relative overflow-hidden group">
                <div className="absolute top-0 left-0 w-full h-[1px] bg-gradient-to-r from-transparent via-[#ff6b2b]/20 to-transparent" />
                {[
                  { label: 'Conversations', color: 'bg-[#ff6b2b]', icon: BrainCircuit },
                  { label: 'Predictions', color: 'bg-[#ff6b2b]/60', icon: Zap },
                  { label: 'Entities', color: 'bg-white/20', icon: Database }
                ].map((type, i) => (
                  <div key={i} className="flex items-center gap-6 group/filter cursor-pointer">
                     <div className={`h-3 w-3 rounded-full ${type.color} group-hover/filter:scale-150 transition-all duration-500 shadow-[0_0_15px_currentColor] animate-pulse`} />
                     <div className="space-y-1">
                        <div className="text-[12px] text-white/40 font-black uppercase tracking-[0.4em] leading-none group-hover/filter:text-white transition-colors italic">{type.label}</div>
                        <div className="text-[9px] text-white/5 font-black uppercase tracking-[0.2em] italic leading-none">PRIMARY_NODE</div>
                     </div>
                  </div>
                ))}
             </div>
             
             <div className="flex gap-6">
                <button className="h-20 w-20 bg-[#050505]/80 border-2 border-white/10 rounded-[2.5rem] flex items-center justify-center transition-all hover:bg-white/5 hover:border-white/20 backdrop-blur-3xl shadow-2xl active:scale-95">
                   <Filter size={32} className="text-white/20" />
                </button>
                <button className="px-16 h-20 bg-[#ff6b2b] text-black font-black uppercase text-xs tracking-[0.6em] rounded-[2.5rem] hover:scale-[1.05] active:scale-95 transition-all shadow-[0_30px_80px_rgba(255,107,43,0.3)] italic leading-none flex items-center gap-6">
                   <Wifi size={24} strokeWidth={3} className="animate-pulse" /> SYNC_MESH
                </button>
             </div>
          </div>

        </div>

        {/* SHARD INSPECTOR HUD */}
        <AnimatePresence>
           {selectedNode && (
             <ShardHUD 
               node={selectedNode} 
               onClose={() => setSelectedNode(null)} 
             />
           )}
        </AnimatePresence>

      </main>

      <style jsx global>{`
        .animate-spin-slow { animation: spin 20s linear infinite; }
        @keyframes spin { from { transform: rotate(0deg); } to { transform: rotate(360deg); } }
      `}</style>
    </div>
  );
}
