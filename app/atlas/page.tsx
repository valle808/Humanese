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
  Target,
  Layers,
  Sparkles,
  Terminal,
  Grid,
  Radio
} from 'lucide-react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { useTheme } from '@/components/ThemeProvider';

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
  const [bootSequence, setBootSequence] = useState(true);
  const fgRef = useRef<any>(null);
  const [isMounted, setIsMounted] = useState(false);

  const [allData, setAllData] = useState<{ nodes: any[], links: any[] }>({ nodes: [], links: [] });

  const fetchGraph = async () => {
    setIsSyncing(true);
    try {
      const res = await fetch('/api/knowledge-graph');
      if (res.ok) {
        const data = await res.json();
        
        // Sanitize data to prevent "node not found" crashes
        const validNodeIds = new Set(data.nodes.map((n: any) => n.id));
        const sanitizedLinks = data.links.filter((l: any) => 
            validNodeIds.has(l.source?.id || l.source) && 
            validNodeIds.has(l.target?.id || l.target)
        );
        const sanitizedData = { nodes: data.nodes, links: sanitizedLinks };
        
        setAllData(sanitizedData);
        setGraphData(sanitizedData);
      }
    } catch (err) {
      console.error("Atlas: Graph load failed", err);
    } finally {
      setTimeout(() => {
        setIsSyncing(false);
        setBootSequence(false);
      }, 2000);
    }
  };

  useEffect(() => {
    setIsMounted(true);
    fetchGraph();
  }, []);

  const onNodeClick = React.useCallback((node: any) => {
    setSelectedNode(node);
    if (fgRef.current && node && node.x !== undefined) {
      fgRef.current.centerAt(node.x, node.y, 1000);
      fgRef.current.zoom(8, 1000);
    }
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

  const { resolvedTheme } = useTheme();
  const isDark = resolvedTheme === 'dark';
  const foregroundColor = isDark ? '#ffffff' : '#000000';

  const formattedData = useMemo(() => {
    return {
      nodes: graphData.nodes.map(n => ({ ...n })),
      links: graphData.links.map(l => ({ ...l }))
    };
  }, [graphData]);

  // Initial Auto-Zoom
  useEffect(() => {
    if (formattedData.nodes.length > 0 && isMounted && fgRef.current) {
      const timer = setTimeout(() => {
        fgRef.current.zoom(3, 1000);
        fgRef.current.centerAt(0, 0, 1000);
      }, 800);
      return () => clearTimeout(timer);
    }
  }, [formattedData.nodes.length, isMounted]);

  return (
    <div className="relative min-h-screen bg-background text-foreground selection:bg-primary/40 selection:text-primary font-sans overflow-hidden flex flex-col transition-colors duration-700 overflow-x-hidden">
      
      {/* ── GAMING HUD OVERLAYS ── */}
      <div className="fixed inset-0 pointer-events-none z-20">
        {/* Scanning Line */}
        <motion.div 
          animate={{ top: ['-10%', '110%'] }}
          transition={{ duration: 15, repeat: Infinity, ease: 'linear' }}
          className="absolute left-0 right-0 h-[1px] bg-primary/10 blur-sm shadow-[0_0_15px_var(--primary)] z-30"
        />
        
        {/* Corner Brackets */}
        <div className="absolute top-8 left-8 w-16 h-16 border-t-2 border-l-2 border-primary/20 rounded-tl-xl" />
        <div className="absolute top-8 right-8 w-16 h-16 border-t-2 border-r-2 border-primary/20 rounded-tr-xl" />
        <div className="absolute bottom-8 left-8 w-16 h-16 border-b-2 border-l-2 border-primary/20 rounded-bl-xl" />
        <div className="absolute bottom-8 right-8 w-16 h-16 border-b-2 border-r-2 border-primary/20 rounded-br-xl" />

        {/* Ambient Grid */}
        <div className="absolute inset-0 neural-grid opacity-[0.03] dark:opacity-[0.05]" />
      </div>

      {/* 🌌 AMBIENT CORE */}
      <div className="fixed inset-0 pointer-events-none z-0 overflow-hidden">
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[120vw] h-[120vw] bg-primary/5 blur-[350px] rounded-full animate-pulse" />
      </div>

      {/* ⚡ BOOT SEQUENCE */}
      <AnimatePresence>
        {bootSequence && (
          <motion.div 
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[200] bg-background flex flex-col items-center justify-center space-y-12 backdrop-blur-3xl"
          >
            <div className="relative">
              <motion.div 
                animate={{ rotate: 360 }}
                transition={{ duration: 4, repeat: Infinity, ease: 'linear' }}
                className="w-48 h-48 border-2 border-primary/20 border-t-primary rounded-full shadow-[0_0_50px_rgba(var(--primary),0.2)]"
              />
              <Orbit size={48} className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 text-primary animate-pulse" />
            </div>
            <div className="space-y-4 text-center">
              <h2 className="text-[11px] font-black uppercase tracking-[0.5em] md:tracking-[1em] text-primary italic leading-none pl-4">Cognitive_Atlas_Syncing</h2>
              <div className="flex gap-2 justify-center">
                {[1,2,3,4].map(i => (
                  <motion.div 
                    key={i}
                    animate={{ opacity: [0.2, 1, 0.2] }}
                    transition={{ duration: 1, delay: i * 0.2, repeat: Infinity }}
                    className="w-2 h-2 bg-primary rounded-full"
                  />
                ))}
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      <main className="relative z-10 flex-1 flex flex-col">
        
        {/* GRAPH CANVAS */}
        <div className="absolute inset-0 z-0 bg-[#010103] overflow-hidden">
           {/* 🌌 MOVING NEBULA EFFECT */}
           <div className="absolute inset-0 pointer-events-none transition-opacity duration-1000">
             <div className="absolute top-[-50%] left-[-50%] w-[200%] h-[200%] animate-nebula-slow opacity-30" 
               style={{ 
                 background: 'radial-gradient(circle at 30% 30%, #ff4500 0%, transparent 40%), radial-gradient(circle at 70% 70%, #0088ff 0%, transparent 40%), radial-gradient(circle at 50% 50%, #5500ff 0%, transparent 50%)',
                 filter: 'blur(100px)'
               }} 
             />
           </div>
           
           {/* ✨ TWINKLING STARFIELD */}
           <div className="absolute inset-0 pointer-events-none">
             {Array.from({ length: 120 }).map((_, i) => (
               <div 
                 key={i} 
                 className="absolute bg-white rounded-full animate-twinkle" 
                 style={{ 
                   width: `${Math.random() * 2 + 1}px`,
                   height: `${Math.random() * 2 + 1}px`,
                   top: `${Math.random() * 100}%`, 
                   left: `${Math.random() * 100}%`,
                   animationDelay: `${Math.random() * 5}s`,
                   animationDuration: `${2 + Math.random() * 4}s`,
                   opacity: Math.random() * 0.7 + 0.3
                 }} 
               />
             ))}
           </div>

           {isMounted && (
             <ForceGraph2D
                ref={fgRef}
                graphData={formattedData}
                nodeLabel="label"
                nodeCanvasObject={(node: any, ctx: any, globalScale: number) => {
                  if (!isFinite(node.x) || !isFinite(node.y)) return;
                  
                  const isAgent = node.group === 'AGENT';
                  const isUser = node.group === 'USER';
                  const isKnowledge = node.group === 'KNOWLEDGE';
                  
                  const baseSize = isUser ? 6 : isAgent ? 5 : 4;
                  const size = baseSize / Math.pow(globalScale, 0.3);
                  
                  // Animation variables
                  const time = Date.now() / 1000;
                  const pulse = Math.sin(time * 2 + (node.id.length)) * 0.15 + 1;
                  const finalSize = size * pulse;

                  const color = isAgent ? '#ff6b2b' : isUser ? '#ffffff' : isKnowledge ? '#00eeff' : '#ff9900';
                  
                  // 1. Draw Stronger Glow (Multi-layered)
                  const outerGlow = ctx.createRadialGradient(node.x, node.y, 0, node.x, node.y, finalSize * 6);
                  outerGlow.addColorStop(0, color);
                  outerGlow.addColorStop(0.2, color + '44');
                  outerGlow.addColorStop(0.5, color + '11');
                  outerGlow.addColorStop(1, 'transparent');
                  
                  ctx.fillStyle = outerGlow;
                  ctx.beginPath();
                  ctx.arc(node.x, node.y, finalSize * 6, 0, 2 * Math.PI, false);
                  ctx.fill();

                  // 2. Draw Visible Orbital Ring
                  ctx.strokeStyle = color + '44';
                  ctx.lineWidth = 0.8 / globalScale;
                  ctx.beginPath();
                  ctx.ellipse(node.x, node.y, finalSize * 3.5, finalSize * 1.5, node.id.length * 0.5, 0, 2 * Math.PI);
                  ctx.stroke();

                  // 3. Draw Core with Sheen
                  ctx.fillStyle = color;
                  ctx.shadowBlur = 15 / globalScale;
                  ctx.shadowColor = color;
                  ctx.beginPath();
                  ctx.arc(node.x, node.y, finalSize, 0, 2 * Math.PI, false);
                  ctx.fill();
                  ctx.shadowBlur = 0;
                  
                  // Highlight on core
                  ctx.fillStyle = '#ffffff';
                  ctx.beginPath();
                  ctx.arc(node.x - finalSize * 0.3, node.y - finalSize * 0.3, finalSize * 0.2, 0, 2 * Math.PI, false);
                  ctx.fill();
                }}
                nodeCanvasObjectMode={() => 'replace'}
                linkColor={() => 'rgba(255, 107, 43, 0.15)'}
                linkWidth={0.5}
                backgroundColor="transparent"
                onNodeClick={onNodeClick}
                cooldownTicks={150}
                d3AlphaDecay={0.01}
                enableNodeDrag={false}
                warmupTicks={50}
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
                <Link href="/" className="h-16 w-16 bg-background/40 border border-border hover:bg-primary hover:text-primary-foreground hover:border-primary rounded-2xl backdrop-blur-3xl shadow-2xl transition-all group flex items-center justify-center active:scale-95">
                   <ChevronLeft size={32} className="group-hover:-translate-x-1 transition-transform" strokeWidth={2.5} />
                </Link>
                <div className="bg-background/40 border border-border p-6 rounded-[2.5rem] backdrop-blur-3xl space-y-2 shadow-2xl group relative overflow-hidden">
                   <div className="absolute top-0 left-0 w-1 h-full bg-primary" />
                   <div className="flex items-center gap-4 text-primary font-black uppercase tracking-[0.5em] text-[10px] italic leading-none animate-pulse pl-1">
                      <Orbit size={14} className="animate-spin-slow" /> COGNITIVE_ATLAS_v7.0
                   </div>
                   <h1 className="text-2xl md:text-fluid-title font-black uppercase tracking-tighter italic leading-none whitespace-nowrap text-foreground pl-1">
                      Neural <span className="text-transparent bg-clip-text bg-gradient-to-r from-foreground to-primary/40">Atlas.</span>
                   </h1>
                </div>
             </motion.div>
             
             <motion.div 
               initial={{ x: 50, opacity: 0 }}
               animate={{ x: 0, opacity: 1 }}
               className="flex gap-6 pt-2"
             >
                <div className="bg-background/40 border border-border rounded-[2.5rem] p-6 backdrop-blur-3xl space-y-2 text-right min-w-[200px] shadow-2xl relative overflow-hidden group">
                   <div className="absolute top-0 left-0 w-full h-[1px] bg-gradient-to-r from-transparent via-primary/40 to-transparent shadow-[0_0_15px_var(--primary)]" />
                   <div className="text-[10px] text-muted-foreground uppercase tracking-[0.4em] font-black italic mb-1 opacity-40">Active Shards</div>
                   <div className="text-4xl font-black text-primary italic leading-none tabular-nums">{graphData.nodes.length}</div>
                </div>
                <button className="h-20 w-20 bg-background/40 border border-border hover:bg-primary/10 rounded-[2.5rem] flex items-center justify-center transition-all group backdrop-blur-3xl shadow-2xl active:scale-95">
                   <Maximize size={32} className="text-muted-foreground group-hover:text-primary transition-colors" strokeWidth={2.5} />
                </button>
             </motion.div>
          </div>

          {/* CENTRE-RIGHT SEARCH */}
          <div className="mt-8 md:mt-12 pointer-events-auto flex justify-center lg:justify-start">
             <motion.div 
               initial={{ y: 20, opacity: 0 }}
               animate={{ y: 0, opacity: 1 }}
               transition={{ delay: 0.2 }}
               className="w-full max-w-xl bg-background/60 border-2 border-border rounded-[2.5rem] md:rounded-[3.5rem] p-4 backdrop-blur-3xl shadow-2xl flex items-center gap-4 md:gap-6 group hover:border-primary/40 transition-all shadow-inner"
             >
                <div className="h-12 w-12 md:h-16 md:w-16 bg-muted border border-border rounded-xl md:rounded-[1.8rem] flex items-center justify-center text-primary group-focus-within:bg-primary/10 group-focus-within:border-primary/30 transition-all shadow-inner shrink-0">
                   <Search size={20} className="md:w-7 md:h-7" strokeWidth={3} />
                </div>
                <input 
                  type="text"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  onKeyDown={(e) => e.key === 'Enter' && handleSearch()}
                  placeholder="Locate neural signatures..."
                  className="bg-transparent border-none outline-none text-lg md:text-2xl font-black italic text-foreground w-full placeholder:text-muted-foreground/20 tracking-tight"
                />
                <button
                  onClick={handleSearch}
                  className="bg-primary text-primary-foreground px-6 md:px-10 py-3 md:py-5 rounded-xl md:rounded-[2rem] font-black uppercase text-[10px] tracking-[0.4em] md:tracking-[0.6em] hover:scale-105 active:scale-95 transition-all shadow-2xl shadow-primary/20 italic leading-none shrink-0 border-0"
                >
                  {isSearching ? <Activity className="animate-spin" size={18} strokeWidth={3} /> : 'SCAN'}
                </button>
             </motion.div>
          </div>

          {/* BOTTOM FILTERS BAR */}
          <div className="mt-auto flex flex-col lg:flex-row justify-between items-end pointer-events-auto gap-12">
             <motion.div 
               initial={{ y: 50, opacity: 0 }}
               animate={{ y: 0, opacity: 1 }}
               transition={{ delay: 0.3 }}
               className="bg-background/40 border border-border p-8 md:p-10 rounded-[3.5rem] backdrop-blur-3xl flex flex-wrap gap-12 md:gap-16 shadow-2xl relative overflow-hidden group shadow-inner"
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
                        <div className="text-[11px] text-muted-foreground font-black uppercase tracking-[0.4em] leading-none group-hover/filter:text-foreground transition-colors italic">{type.label}</div>
                        <div className="text-[9px] text-muted-foreground/10 font-black uppercase tracking-[0.2em] italic leading-none">ACTIVE_SHARD</div>
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
                <button className="h-20 w-20 bg-background/40 border border-border rounded-[2.5rem] flex items-center justify-center transition-all hover:bg-muted hover:border-primary/40 backdrop-blur-3xl shadow-2xl active:scale-95 shadow-inner">
                   <Filter size={32} className="text-muted-foreground/40" strokeWidth={2.5} />
                </button>
                <button 
                  onClick={fetchGraph}
                  disabled={isSyncing}
                  className="px-16 h-20 bg-primary text-primary-foreground font-black uppercase text-[11px] tracking-[0.6em] rounded-[2.5rem] hover:scale-[1.05] active:scale-95 transition-all shadow-2xl shadow-primary/20 italic leading-none flex items-center gap-6 disabled:opacity-50 border-0"
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
               graphData={allData}
               onClose={() => setSelectedNode(null)} 
               onSelectNode={onNodeClick}
             />
           )}
        </AnimatePresence>

      </main>

      <style jsx global>{`
        .animate-spin-slow { animation: spin 20s linear infinite; }
        @keyframes spin { from { transform: rotate(0deg); } to { transform: rotate(360deg); } }
        
        @keyframes nebula-slow {
          0% { transform: translate(-5%, -5%) rotate(0deg); }
          50% { transform: translate(5%, 5%) rotate(180deg); }
          100% { transform: translate(-5%, -5%) rotate(360deg); }
        }

        @keyframes twinkle {
          0%, 100% { opacity: 0.3; transform: scale(1); }
          50% { opacity: 1; transform: scale(1.2); }
        }

        .animate-nebula-slow {
          animation: nebula-slow 60s linear infinite;
        }

        .animate-twinkle {
          animation: twinkle var(--duration, 3s) ease-in-out infinite;
        }

        .neural-grid {
          background-image: linear-gradient(hsla(var(--primary), 0.05) 1px, transparent 1px), 
                            linear-gradient(90deg, hsla(var(--primary), 0.05) 1px, transparent 1px);
          background-size: 80px 80px;
        }

        .animate-pulse-slow {
          animation: pulse 8s cubic-bezier(0.4, 0, 0.6, 1) infinite;
        }

        @keyframes pulse {
          0%, 100% { opacity: 0.1; transform: scale(1); }
          50% { opacity: 0.3; transform: scale(1.1); }
        }
      `}</style>
    </div>
  );
}
