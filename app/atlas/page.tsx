'use client';

import React, { useState, useMemo, useRef, useEffect } from 'react';
import dynamic from 'next/dynamic';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  ChevronLeft, 
  Search, 
  Zap, 
  BrainCircuit, 
  Database, 
  Maximize, 
  Orbit,
  Filter,
  Wifi,
  Activity,
  Cpu,
  ShieldCheck,
  AlertCircle
} from 'lucide-react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';

// Component
import ShardHUD from '@/components/atlas/shard-hud';

// Dynamic Import for ForceGraph2D
const ForceGraph2D = dynamic(() => import('react-force-graph-2d'), { 
  ssr: false 
}) as any;

export default function CognitiveAtlasPage() {
  const router = useRouter();
  const [graphData, setGraphData] = useState<{ nodes: any[], links: any[] }>({ nodes: [], links: [] });
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedNode, setSelectedNode] = useState<any>(null);
  const [isSearching, setIsSearching] = useState(false);
  const [isSyncing, setIsSyncing] = useState(false);
  const fgRef = useRef<any>(null);

  const [allData, setAllData] = useState<{ nodes: any[], links: any[] }>({ nodes: [], links: [] });

  const fetchGraph = async () => {
    setIsSyncing(true);
    try {
      const res = await fetch('/api/knowledge-graph');
      if (res.ok) {
        const data = await res.json();
        setAllData(data);
        setGraphData(data);
      }
    } catch (err) {
      console.error("Atlas: Graph load failed", err);
    } finally {
      setTimeout(() => setIsSyncing(false), 1000);
    }
  };

  useEffect(() => {
    fetchGraph();
  }, []);

  const handleSearch = () => {
    if (!searchTerm.trim()) {
      setGraphData(allData);
      return;
    }
    setIsSearching(true);
    
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
    setTimeout(() => setIsSearching(false), 500);
  };

  const formattedData = useMemo(() => ({
    nodes: graphData.nodes.map(n => ({
      ...n,
      color: n.group === 'AGENT' ? '#ff6b2b' : n.group === 'USER' ? '#ffffff' : '#ff6b2b99',
      size: n.group === 'USER' ? 12 : 8
    })),
    links: graphData.links.map(l => ({
      ...l,
      color: 'rgba(255, 107, 43, 0.1)',
      width: 1
    }))
  }), [graphData]);

  return (
    <div className="relative min-h-screen bg-background text-foreground selection:bg-primary/40 selection:text-primary font-sans overflow-hidden flex flex-col">
      
      {/* ── GAMING HUD OVERLAYS ── */}
      <div className="fixed inset-0 pointer-events-none z-20">
        {/* Scanning Line */}
        <motion.div 
          animate={{ top: ['-10%', '110%'] }}
          transition={{ duration: 8, repeat: Infinity, ease: 'linear' }}
          className="absolute left-0 right-0 h-[2px] bg-primary/20 blur-sm shadow-[0_0_15px_var(--primary)] z-30"
        />
        
        {/* Corner Brackets */}
        <div className="absolute top-8 left-8 w-16 h-16 border-t-2 border-l-2 border-primary/30 rounded-tl-xl" />
        <div className="absolute top-8 right-8 w-16 h-16 border-t-2 border-r-2 border-primary/30 rounded-tr-xl" />
        <div className="absolute bottom-8 left-8 w-16 h-16 border-b-2 border-l-2 border-primary/30 rounded-bl-xl" />
        <div className="absolute bottom-8 right-8 w-16 h-16 border-b-2 border-r-2 border-primary/30 rounded-br-xl" />

        {/* Ambient Grid */}
        <div className="absolute inset-0 neural-grid opacity-[0.03] dark:opacity-[0.07]" />
      </div>

      {/* 🌌 AMBIENT CORE */}
      <div className="fixed inset-0 pointer-events-none z-0 overflow-hidden">
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[120vw] h-[120vw] bg-primary/5 blur-[350px] rounded-full animate-pulse-slow" />
      </div>

      <main className="relative z-10 flex-1 flex flex-col">
        
        {/* GRAPH CANVAS */}
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
                backgroundColor="transparent"
                onNodeClick={(node: any) => setSelectedNode(node)}
                cooldownTicks={100}
                onEngineStop={() => fgRef.current?.zoomToFit(400, 100)}
             />
           )}
        </div>

        {/* ATLAS OVERLAY UI */}
        <div className="relative z-10 p-6 lg:p-12 h-screen flex flex-col pointer-events-none">
          
          {/* HEADER NAV */}
          <div className="flex-none flex justify-between items-start pointer-events-auto">
             <motion.div 
               initial={{ x: -50, opacity: 0 }}
               animate={{ x: 0, opacity: 1 }}
               className="flex gap-6"
             >
                <button 
                  onClick={() => router.back()}
                  className="h-16 w-16 bg-background/60 border-2 border-border hover:bg-primary hover:text-primary-foreground hover:border-primary rounded-2xl backdrop-blur-3xl shadow-2xl transition-all group flex items-center justify-center active:scale-95"
                >
                   <ChevronLeft size={32} className="group-hover:-translate-x-1 transition-transform" strokeWidth={2.5} />
                </button>
                <div className="bg-background/60 border-2 border-border p-6 rounded-[2.5rem] backdrop-blur-3xl space-y-2 shadow-2xl group relative overflow-hidden">
                   <div className="absolute top-0 left-0 w-1 h-full bg-primary" />
                   <div className="flex items-center gap-4 text-primary font-black uppercase tracking-[0.5em] text-[10px] italic leading-none animate-pulse pl-1">
                      <Orbit size={14} className="animate-spin-slow" /> COGNITIVE_ATLAS_v7.0
                   </div>
                   <h1 className="text-4xl font-black uppercase tracking-tighter italic leading-none whitespace-nowrap text-foreground pl-1">
                      Neural <span className="text-transparent bg-clip-text bg-gradient-to-r from-foreground to-primary/40">Atlas.</span>
                   </h1>
                </div>
             </motion.div>
             
             <motion.div 
               initial={{ x: 50, opacity: 0 }}
               animate={{ x: 0, opacity: 1 }}
               className="flex gap-6 pt-2"
             >
                <div className="bg-background/60 border-2 border-border rounded-[2.5rem] p-6 backdrop-blur-3xl space-y-2 text-right min-w-[200px] shadow-2xl relative overflow-hidden group">
                   <div className="absolute top-0 left-0 w-full h-[1px] bg-gradient-to-r from-transparent via-primary/40 to-transparent" />
                   <div className="text-[10px] text-muted-foreground uppercase tracking-[0.4em] font-black italic mb-1">Detected Shards</div>
                   <div className="text-4xl font-black text-primary italic leading-none">{graphData.nodes.length}</div>
                </div>
                <button className="h-20 w-20 bg-background/60 border-2 border-border hover:bg-primary/10 rounded-[2.5rem] flex items-center justify-center transition-all group backdrop-blur-3xl shadow-2xl active:scale-95">
                   <Maximize size={32} className="text-muted-foreground group-hover:text-primary transition-colors" />
                </button>
             </motion.div>
          </div>

          {/* CENTRE-RIGHT SEARCH */}
          <div className="mt-12 pointer-events-auto flex justify-center lg:justify-start">
             <motion.div 
               initial={{ y: 20, opacity: 0 }}
               animate={{ y: 0, opacity: 1 }}
               transition={{ delay: 0.2 }}
               className="w-full max-w-xl bg-background/80 border-2 border-border rounded-[3.5rem] p-4 backdrop-blur-3xl shadow-2xl flex items-center gap-6 group hover:border-primary/30 transition-all"
             >
                <div className="h-16 w-16 bg-muted rounded-[1.8rem] flex items-center justify-center text-primary group-focus-within:bg-primary/10 transition-all">
                   <Search size={28} strokeWidth={2.5} />
                </div>
                <input 
                  type="text"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  onKeyDown={(e) => e.key === 'Enter' && handleSearch()}
                  placeholder="Locate neural signatures..."
                  className="bg-transparent border-none outline-none text-2xl font-light italic text-foreground w-full placeholder:text-muted-foreground/20 tracking-tight"
                />
                <button
                  onClick={handleSearch}
                  className="bg-primary text-primary-foreground px-10 py-5 rounded-[2rem] font-black uppercase text-xs tracking-[0.4em] hover:scale-105 active:scale-95 transition-all shadow-xl italic leading-none shrink-0"
                >
                  {isSearching ? <Activity className="animate-spin" size={20} strokeWidth={3} /> : 'SCAN'}
                </button>
             </motion.div>
          </div>

          {/* BOTTOM FILTERS BAR */}
          <div className="mt-auto flex flex-col lg:flex-row justify-between items-end pointer-events-auto gap-12">
             <motion.div 
               initial={{ y: 50, opacity: 0 }}
               animate={{ y: 0, opacity: 1 }}
               transition={{ delay: 0.3 }}
               className="bg-background/80 border-2 border-border p-8 md:p-10 responsive-rounded backdrop-blur-3xl flex flex-wrap gap-12 md:gap-16 shadow-2xl relative overflow-hidden group"
             >
                <div className="absolute top-0 left-0 w-full h-[1px] bg-gradient-to-r from-transparent via-primary/20 to-transparent" />
                {[
                  { label: 'Agents', color: 'bg-primary', icon: Cpu },
                  { label: 'Knowledge', color: 'bg-primary/60', icon: Database },
                  { label: 'Entities', color: 'bg-foreground/20', icon: BrainCircuit }
                ].map((type, i) => (
                  <div key={i} className="flex items-center gap-6 group/filter cursor-pointer">
                     <div className={`h-3 w-3 rounded-full ${type.color} group-hover/filter:scale-150 transition-all duration-500 shadow-[0_0_15px_currentColor] animate-pulse`} />
                     <div className="space-y-1">
                        <div className="text-[12px] text-muted-foreground font-black uppercase tracking-[0.4em] leading-none group-hover/filter:text-foreground transition-colors italic">{type.label}</div>
                        <div className="text-[9px] text-muted-foreground/20 font-black uppercase tracking-[0.2em] italic leading-none">ACTIVE_SHARD</div>
                     </div>
                  </div>
                ))}
             </motion.div>
             
             <motion.div 
               initial={{ y: 50, opacity: 0 }}
               animate={{ y: 0, opacity: 1 }}
               transition={{ delay: 0.4 }}
               className="flex gap-6"
             >
                <button className="h-20 w-20 bg-background/80 border-2 border-border rounded-[2.5rem] flex items-center justify-center transition-all hover:bg-muted hover:border-muted-foreground/20 backdrop-blur-3xl shadow-2xl active:scale-95">
                   <Filter size={32} className="text-muted-foreground" />
                </button>
                <button 
                  onClick={fetchGraph}
                  disabled={isSyncing}
                  className="px-16 h-20 bg-primary text-primary-foreground font-black uppercase text-xs tracking-[0.6em] rounded-[2.5rem] hover:scale-[1.05] active:scale-95 transition-all shadow-2xl italic leading-none flex items-center gap-6 disabled:opacity-50"
                >
                   <Wifi size={24} strokeWidth={3} className={isSyncing ? 'animate-spin' : 'animate-pulse'} /> 
                   {isSyncing ? 'SYNCING...' : 'SYNC_MESH'}
                </button>
             </motion.div>
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
        
        .neural-grid {
          background-image: linear-gradient(rgba(255, 107, 43, 0.05) 1px, transparent 1px), 
                            linear-gradient(90deg, rgba(255, 107, 43, 0.05) 1px, transparent 1px);
          background-size: 80px 80px;
        }
      `}</style>
    </div>
  );
}
