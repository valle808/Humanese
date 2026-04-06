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
  Filter 
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
      color: n.type === 'PREDICTION' ? '#00ffc3' : n.type === 'CONVERSATION' ? '#7000ff' : '#444444',
      size: n.type === 'THEME' ? 4 : 8
    })),
    links: graphData.links.map(l => ({
      ...l,
      color: 'rgba(255,255,255,0.06)',
      width: 1
    }))
  }), [graphData]);

  return (
    <div className="relative min-h-screen bg-[#050505] text-white selection:bg-[#00ffc3]/30 selection:text-white font-sans overflow-hidden flex flex-col">
      
      {/* ATLAS BACKGROUND DEPTH */}
      <div className="fixed inset-0 pointer-events-none z-0">
        <div className="absolute top-[-10%] left-[-10%] w-[80vw] h-[80vw] bg-[#00ffc3]/3 blur-[200px] rounded-full" />
        <div className="absolute bottom-[-10%] right-[-10%] w-[80vw] h-[80vw] bg-[#7000ff]/3 blur-[200px] rounded-full" />
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
                onEngineStop={() => fgRef.current?.zoomToFit(400, 50)}
             />
           )}
        </div>

        {/* ATLAS OVERLAY UI */}
        <div className="relative z-10 p-8 lg:p-12 h-screen flex flex-col pointer-events-none">
          
          {/* HEADER NAV */}
          <div className="flex-none flex justify-between items-start pointer-events-auto">
             <div className="flex gap-4">
                <Link href="/admin" className="p-4 bg-white/5 border border-white/10 hover:bg-white/10 rounded-2xl backdrop-blur-3xl shadow-xl transition-all group flex items-center justify-center">
                   <ChevronLeft className="text-[#00ffc3] group-hover:-translate-x-1 transition-transform" />
                </Link>
                <div className="bg-white/5 border border-white/10 p-5 rounded-2xl backdrop-blur-3xl space-y-1">
                   <h1 className="text-2xl font-black uppercase tracking-tighter italic leading-none whitespace-nowrap">
                      The Cognitive <span className="text-[#00ffc3]">Atlas.</span>
                   </h1>
                   <p className="text-[10px] text-white/20 uppercase tracking-[0.4em] font-mono">Neural Cartography / Phase III</p>
                </div>
             </div>
             
             <div className="flex gap-4">
                <div className="bg-black/60 border border-white/5 rounded-2xl p-5 backdrop-blur-3xl space-y-1 text-right min-w-[150px]">
                   <div className="text-[9px] text-white/20 uppercase tracking-widest font-black">Active Shards</div>
                   <div className="text-xl font-black text-[#00ffc3]">{graphData.nodes.length || '0'}</div>
                </div>
                <button className="h-16 w-16 bg-white/5 border border-white/10 hover:bg-white/10 rounded-2xl flex items-center justify-center transition-all group">
                   <Maximize className="text-white/20 group-hover:text-white transition-colors" />
                </button>
             </div>
          </div>

          {/* CENTRE-RIGHT SEARCH */}
          <div className="mt-8 pointer-events-auto">
             <div className="max-w-md bg-black/60 border border-white/5 rounded-[2rem] p-3 backdrop-blur-3xl shadow-2xl flex items-center gap-3">
                <div className="p-3 bg-white/5 rounded-full text-[#7000ff]">
                   <Search size={18} />
                </div>
                <input 
                  type="text"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  onKeyDown={(e) => e.key === 'Enter' && handleSearch()}
                  placeholder="Query cognitive shards..."
                  className="bg-transparent border-none outline-none text-white text-xs w-full font-mono placeholder:text-white/10"
                />
                <button
                  onClick={handleSearch}
                  className="bg-[#00ffc3] text-black px-6 py-2.5 rounded-full font-black uppercase text-[10px] tracking-widest hover:scale-105 transition-all shadow-[0_0_30px_rgba(0,255,195,0.2)]"
                >
                  {isSearching ? '...' : 'Query'}
                </button>
             </div>
          </div>

          {/* BOTTOM FILTERS BAR */}
          <div className="mt-auto flex justify-between items-end pointer-events-auto">
             <div className="bg-black/60 border border-white/10 p-6 rounded-[2.5rem] backdrop-blur-3xl flex gap-12 shadow-2xl">
                {[
                  { label: 'Conversations', color: 'bg-[#7000ff]', icon: BrainCircuit },
                  { label: 'Predictions', color: 'bg-[#00ffc3]', icon: Zap },
                  { label: 'Entities', color: 'bg-white/30', icon: Database }
                ].map((type, i) => (
                  <div key={i} className="flex items-center gap-4 group cursor-pointer">
                     <div className={`h-1.5 w-1.5 rounded-full ${type.color} group-hover:scale-150 transition-transform`} />
                     <div className="space-y-1">
                        <div className="text-[10px] text-white/60 font-black uppercase tracking-widest leading-none">{type.label}</div>
                        <div className="text-[8px] text-white/20 font-mono italic">ACTIVE NODE</div>
                     </div>
                  </div>
                ))}
             </div>
             
             <div className="flex gap-4">
                <button className="h-14 w-14 bg-white/5 border border-white/10 rounded-2xl flex items-center justify-center transition-all hover:bg-white/10">
                   <Filter className="text-white/40" />
                </button>
                <button className="px-8 h-14 bg-white text-black font-black uppercase text-[10px] tracking-[0.2em] rounded-2xl hover:scale-105 transition-all">
                   Sync Abyssal Mesh
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

    </div>
  );
}
