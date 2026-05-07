'use client';

import React, { useState, useMemo, useRef, useEffect, useCallback } from 'react';
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
  Radio,
  Fingerprint,
  RefreshCw,
  Scan,
  Maximize2,
  Box,
  Eye,
  Lock,
  Compass
} from 'lucide-react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import * as THREE from 'three';

// Component
import ShardHUD from '@/components/atlas/shard-hud';

// Dynamic Import for ForceGraph3D
const ForceGraph3D = dynamic(() => import('react-force-graph-3d'), { 
  ssr: false 
}) as any;

export default function CognitiveAtlasPage() {
  const router = useRouter();
  const [allData, setAllData] = useState<{ nodes: any[], links: any[] }>({ nodes: [], links: [] });
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedNode, setSelectedNode] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [bootSequence, setBootSequence] = useState(true);
  const [bootProgress, setBootProgress] = useState(0);
  const [viewAngle, setViewAngle] = useState('ORBITAL');
  const fgRef = useRef<any>(null);

  const fetchGraph = useCallback(async () => {
    setIsLoading(true);
    try {
      const res = await fetch('/api/knowledge-graph');
      const data = await res.json();
      if (res.ok) {
        setAllData(data);
      }
    } catch (err) {
      console.error('Atlas sync failure', err);
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    if (bootSequence) {
      const interval = setInterval(() => {
        setBootProgress(prev => {
          if (prev >= 100) {
            clearInterval(interval);
            setTimeout(() => setBootSequence(false), 800);
            return 100;
          }
          return prev + 4;
        });
      }, 40);
      return () => clearInterval(interval);
    }
  }, [bootSequence]);

  useEffect(() => {
    fetchGraph();
  }, [fetchGraph]);

  const onNodeClick = useCallback((node: any) => {
    setSelectedNode(node);
    
    // Smoothly focus camera on the node
    const distance = 180;
    const distRatio = 1 + distance / Math.hypot(node.x, node.y, node.z);
    
    if (fgRef.current) {
      fgRef.current.cameraPosition(
        { x: node.x * distRatio, y: node.y * distRatio, z: node.z * distRatio }, 
        node, 
        2500 
      );
    }
  }, []);

  const filteredGraphData = useMemo(() => {
    if (!searchTerm.trim()) return allData;
    const term = searchTerm.toLowerCase();
    const matchedNodes = allData.nodes.filter((n: any) => 
      n.id.toLowerCase().includes(term) || 
      n.label.toLowerCase().includes(term)
    );
    const matchedIds = new Set(matchedNodes.map((n: any) => n.id));
    const matchedLinks = allData.links.filter((l: any) => {
      const sourceId = typeof l.source === 'object' ? l.source.id : l.source;
      const targetId = typeof l.target === 'object' ? l.target.id : l.target;
      return matchedIds.has(sourceId) || matchedIds.has(targetId);
    });
    return { nodes: matchedNodes, links: matchedLinks };
  }, [allData, searchTerm]);

  const formattedData = useMemo(() => ({
    nodes: filteredGraphData.nodes.map(n => ({
      ...n,
      color: n.group === 'AGENT' ? '#ff6b2b' : n.group === 'USER' ? '#ffffff' : '#ff6b2b88',
      size: n.group === 'USER' ? 10 : 6
    })),
    links: filteredGraphData.links.map(l => ({
      ...l,
      color: 'rgba(255, 107, 43, 0.2)',
      width: 0.8
    }))
  }), [filteredGraphData]);

  // Cinematic Node Rendering
  const nodeObject = useCallback((node: any) => {
    const geometry = new THREE.SphereGeometry(node.size || 6, 32, 32);
    const material = new THREE.MeshStandardMaterial({
      color: node.color,
      emissive: node.color,
      emissiveIntensity: 4,
      transparent: true,
      opacity: 0.95,
      roughness: 0,
      metalness: 1
    });
    const sphere = new THREE.Mesh(geometry, material);
    
    // Glowing Halo
    const glowGeo = new THREE.SphereGeometry((node.size || 6) * 1.8, 32, 32);
    const glowMat = new THREE.MeshBasicMaterial({
      color: node.color,
      transparent: true,
      opacity: 0.1,
      side: THREE.BackSide
    });
    const glow = new THREE.Mesh(glowGeo, glowMat);
    
    // Core Pulse Dot
    const coreGeo = new THREE.SphereGeometry((node.size || 6) * 0.4, 16, 16);
    const coreMat = new THREE.MeshBasicMaterial({ color: '#fff' });
    const core = new THREE.Mesh(coreGeo, coreMat);
    
    const group = new THREE.Group();
    group.add(sphere);
    group.add(glow);
    group.add(core);
    return group;
  }, []);

  return (
    <div className="h-screen w-full bg-[#030303] overflow-hidden relative font-sans text-foreground select-none transition-colors duration-1000">
      
      {/* ── CINEMATIC BOOT SEQUENCE ── */}
      <AnimatePresence>
        {bootSequence && (
          <motion.div 
            exit={{ opacity: 0, scale: 1.05, filter: 'blur(40px)' }}
            transition={{ duration: 1.2, ease: "circOut" }}
            className="fixed inset-0 z-[500] bg-black flex flex-col items-center justify-center p-12 lg:p-24 overflow-hidden"
          >
             {/* Scanning Line in Boot */}
             <motion.div 
                animate={{ top: ['-10%', '110%'] }}
                transition={{ duration: 2, repeat: Infinity, ease: 'linear' }}
                className="absolute left-0 right-0 h-[1px] bg-[#ff6b2b]/20 blur-sm z-50"
             />
             <div className="absolute inset-0 neural-grid opacity-[0.05]" />
             
             <div className="space-y-16 max-w-4xl w-full text-center relative z-10">
                <div className="flex flex-col items-center gap-8">
                   <div className="relative">
                      <div className="absolute inset-0 bg-[#ff6b2b]/20 blur-[60px] rounded-full animate-pulse" />
                      <motion.div 
                         animate={{ rotate: 360 }}
                         transition={{ duration: 20, repeat: Infinity, ease: 'linear' }}
                         className="relative w-32 h-32 border-2 border-[#ff6b2b]/20 border-t-[#ff6b2b] rounded-full flex items-center justify-center"
                      >
                         <Orbit size={48} className="text-[#ff6b2b] animate-pulse" />
                      </motion.div>
                   </div>
                   <div className="space-y-4">
                      <h1 className="text-8xl lg:text-[10rem] font-black italic uppercase tracking-tighter text-white leading-none">
                         NEURAL<br/>
                         <span className="text-[#ff6b2b] text-shadow-orange">ATLAS.</span>
                      </h1>
                      <p className="text-[10px] font-black text-[#ff6b2b]/40 uppercase tracking-[1em] italic leading-none pl-2">Sovereign_Network_Calibration</p>
                   </div>
                </div>
                
                <div className="space-y-8 pt-12 max-w-md mx-auto">
                   <div className="flex justify-between text-[10px] font-black uppercase tracking-[0.5em] text-white/40 italic">
                      <span>Synchronizing_Mesh</span>
                      <span className="text-[#ff6b2b]">{bootProgress}%</span>
                   </div>
                   <div className="h-1.5 w-full bg-white/5 rounded-full overflow-hidden p-[1px] shadow-inner">
                      <motion.div 
                        initial={{ width: 0 }}
                        animate={{ width: `${bootProgress}%` }}
                        className="h-full bg-[#ff6b2b] shadow-[0_0_30px_#ff6b2b]"
                      />
                   </div>
                   <div className="grid grid-cols-3 gap-4">
                      {[0,1,2].map(i => (
                        <div key={i} className={`h-1 rounded-full transition-colors duration-500 ${bootProgress > (i+1)*30 ? 'bg-[#ff6b2b]' : 'bg-white/5'}`} />
                      ))}
                   </div>
                </div>
             </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* 🌌 CINEMATIC BACKGROUND */}
      <div className="fixed inset-0 pointer-events-none z-0">
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[100vw] h-[100vw] bg-[#ff6b2b]/5 blur-[250px] rounded-full animate-pulse-slow" />
        <div className="absolute inset-0 bg-[url('/assets/noise.png')] opacity-[0.04] mix-blend-overlay" />
        {/* Dynamic Scan Line */}
        <motion.div 
          animate={{ top: ['-10%', '110%'] }}
          transition={{ duration: 15, repeat: Infinity, ease: 'linear' }}
          className="absolute left-0 right-0 h-[1px] bg-[#ff6b2b]/10 blur-[1px] z-10"
        />
        {/* Corner Accents */}
        <div className="absolute top-10 left-10 w-24 h-24 border-t-2 border-l-2 border-white/5 rounded-tl-3xl" />
        <div className="absolute top-10 right-10 w-24 h-24 border-t-2 border-r-2 border-white/5 rounded-tr-3xl" />
        <div className="absolute bottom-10 left-10 w-24 h-24 border-b-2 border-l-2 border-white/5 rounded-bl-3xl" />
        <div className="absolute bottom-10 right-10 w-24 h-24 border-b-2 border-r-2 border-white/5 rounded-br-3xl" />
      </div>

      <main className="relative z-10 h-full w-full flex flex-col">
        
        {/* GRAPH CANVAS */}
        <div className="absolute inset-0 z-0 overflow-hidden">
           {typeof window !== 'undefined' && (
             <ForceGraph3D
                ref={fgRef}
                graphData={formattedData}
                backgroundColor="rgba(0, 0, 0, 0)"
                showNavInfo={false}
                nodeThreeObject={nodeObject}
                nodeThreeObjectExtend={false}
                nodeLabel="label"
                nodeColor={(d: any) => d.color}
                linkColor={(l: any) => l.color}
                linkWidth={0.8}
                linkDirectionalParticles={4}
                linkDirectionalParticleSpeed={0.004}
                linkDirectionalParticleWidth={1.5}
                onNodeClick={onNodeClick}
                cooldownTicks={120}
                onEngineStop={() => {
                   if (formattedData.nodes.length > 0) {
                      fgRef.current?.zoomToFit(1000, 200);
                   }
                }}
             />
           )}
        </div>

        {/* ── SCI-FI HUD OVERLAY ── */}
        <div className="absolute inset-0 pointer-events-none p-8 lg:p-14 flex flex-col z-20">
          
          {/* TOP HUD BAR */}
          <div className="flex justify-between items-start pointer-events-auto w-full">
             <motion.div 
               initial={{ x: -100, opacity: 0 }} 
               animate={{ x: 0, opacity: 1 }}
               className="flex items-center gap-8"
             >
                <Link href="/" className="h-16 w-16 bg-black/80 border-2 border-white/10 hover:bg-[#ff6b2b] hover:text-black hover:border-[#ff6b2b] rounded-2xl backdrop-blur-3xl transition-all flex items-center justify-center active:scale-90 group shadow-2xl">
                   <ChevronLeft size={32} className="group-hover:-translate-x-1 transition-transform" strokeWidth={3} />
                </Link>
                <div className="px-8 py-5 bg-black/80 border-2 border-white/10 rounded-2xl backdrop-blur-3xl flex flex-col justify-center gap-1 shadow-2xl relative overflow-hidden group">
                   <div className="absolute top-0 right-0 p-3 opacity-[0.05] group-hover:rotate-12 transition-transform">
                      <Terminal size={40} className="text-[#ff6b2b]" />
                   </div>
                   <div className="text-[9px] font-black uppercase tracking-[0.6em] text-[#ff6b2b] italic leading-none">NEURAL. ARCHIVE. V7.0</div>
                   <div className="text-3xl font-black uppercase tracking-tighter text-white italic leading-none">Neural Atlas<span className="text-[#ff6b2b]">.</span></div>
                </div>
             </motion.div>

             <motion.div 
               initial={{ x: 100, opacity: 0 }} 
               animate={{ x: 0, opacity: 1 }}
               className="flex gap-6 items-start"
             >
                <div className="px-10 py-5 bg-black/80 border-2 border-white/10 rounded-2xl backdrop-blur-3xl flex flex-col items-end gap-2 shadow-2xl relative group">
                   <div className="absolute top-0 left-0 p-3 opacity-[0.05] group-hover:-rotate-12 transition-transform">
                      <Database size={40} className="text-[#ff6b2b]" />
                   </div>
                   <div className="text-[9px] font-black uppercase tracking-[0.5em] text-white/20 italic leading-none">ACTIVE_NEURAL_SHARDS</div>
                   <div className="text-5xl font-black text-[#ff6b2b] italic leading-none tabular-nums drop-shadow-[0_0_20px_#ff6b2b88]">
                      {allData.nodes.length || 'CALC'}
                   </div>
                </div>
                <div className="flex flex-col gap-4">
                   <button className="h-14 w-14 bg-black/80 border-2 border-white/10 hover:border-[#ff6b2b]/40 rounded-xl backdrop-blur-3xl flex items-center justify-center text-white/20 hover:text-[#ff6b2b] transition-all active:scale-90 shadow-xl">
                      <Maximize2 size={24} />
                   </button>
                   <button className="h-14 w-14 bg-black/80 border-2 border-white/10 hover:border-[#ff6b2b]/40 rounded-xl backdrop-blur-3xl flex items-center justify-center text-white/20 hover:text-[#ff6b2b] transition-all active:scale-90 shadow-xl">
                      <Eye size={24} />
                   </button>
                </div>
             </motion.div>
          </div>

          {/* LEFT TELEMETRY READOUT */}
          <div className="mt-20 flex-1 hidden lg:block pointer-events-none">
             <motion.div 
                initial={{ opacity: 0, x: -50 }}
                animate={{ opacity: 1, x: 0 }}
                className="w-80 space-y-12"
             >
                <div className="space-y-6">
                   <div className="flex items-center gap-4 text-[10px] font-black uppercase tracking-[0.6em] text-[#ff6b2b] italic leading-none">
                      <Wifi size={14} className="animate-pulse" /> Uplink_Status
                   </div>
                   <div className="h-1.5 w-full bg-white/5 rounded-full overflow-hidden p-[1px] border border-white/5">
                      <motion.div animate={{ x: ['-100%', '100%'] }} transition={{ duration: 4, repeat: Infinity, ease: 'linear' }} className="h-full w-1/4 bg-[#ff6b2b] shadow-[0_0_20px_#ff6b2b]" />
                   </div>
                </div>
                <div className="space-y-4 font-mono text-[9px] text-white/20 uppercase tracking-[0.2em] leading-relaxed">
                   <div className="flex justify-between border-b border-white/5 pb-2"><span>Latency:</span> <span className="text-[#ff6b2b]">0.04ms</span></div>
                   <div className="flex justify-between border-b border-white/5 pb-2"><span>Resonance:</span> <span className="text-[#ff6b2b]">99.82%</span></div>
                   <div className="flex justify-between border-b border-white/5 pb-2"><span>Auth_Level:</span> <span className="text-[#ff6b2b]">OMEGA_7</span></div>
                   <div className="flex justify-between border-b border-white/5 pb-2"><span>Enc_Key:</span> <span className="text-[#ff6b2b]">0x7F2C...14B</span></div>
                </div>
                <div className="p-6 bg-white/[0.02] border-2 border-white/5 rounded-2xl italic text-[11px] text-white/40 leading-relaxed shadow-inner">
                   Scanning neural topologies for emergent singularities. Consensus protocol active.
                </div>
             </motion.div>
          </div>

          {/* BOTTOM CONTROLS & SEARCH */}
          <div className="mt-auto flex flex-col md:flex-row items-end justify-between gap-12 pointer-events-auto">
             
             {/* LEGEND / FILTERS */}
             <motion.div 
               initial={{ y: 50, opacity: 0 }} 
               animate={{ y: 0, opacity: 1 }}
               className="flex gap-10 bg-black/80 border-2 border-white/10 rounded-[2.5rem] px-10 py-6 backdrop-blur-3xl shadow-[0_40px_100px_rgba(0,0,0,0.8)] border-b-[#ff6b2b]/30"
             >
                {[
                  { label: 'Agents', color: 'bg-[#ff6b2b]', icon: <Cpu size={14} /> },
                  { label: 'Knowledge', color: 'bg-[#ff6b2b]/50', icon: <Database size={14} /> },
                  { label: 'Entities', color: 'bg-white', icon: <Fingerprint size={14} /> }
                ].map(l => (
                  <div key={l.label} className="flex items-center gap-4 group cursor-help">
                     <div className={`h-4 w-4 rounded-lg ${l.color} shadow-[0_0_15px_currentColor] group-hover:scale-125 transition-transform`} />
                     <span className="text-[10px] font-black uppercase tracking-[0.4em] text-white/40 italic group-hover:text-white transition-colors">{l.label}</span>
                  </div>
                ))}
             </motion.div>

             {/* MAIN SEARCH BAR */}
             <motion.div 
                initial={{ y: 50, opacity: 0 }} 
                animate={{ y: 0, opacity: 1 }}
                className="relative group w-full max-w-3xl"
             >
                <div className="absolute inset-0 bg-[#ff6b2b]/15 blur-3xl opacity-0 group-focus-within:opacity-100 transition-opacity duration-1000" />
                <div className="relative bg-black/90 border-2 border-white/10 group-focus-within:border-[#ff6b2b]/40 rounded-[3.5rem] p-4 pl-12 flex items-center gap-8 backdrop-blur-3xl shadow-[0_60px_120px_rgba(0,0,0,0.9)] transition-all duration-700">
                   <Search className="text-white/20 group-focus-within:text-[#ff6b2b] transition-all" size={32} />
                   <input 
                      type="text" 
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                      placeholder="Locate neural signatures..."
                      className="bg-transparent border-none outline-none text-3xl font-light w-full text-white placeholder:text-white/10 placeholder:italic italic tracking-tight"
                   />
                   <button className="h-16 px-12 bg-[#ff6b2b] text-black rounded-[2.5rem] font-black uppercase tracking-[0.6em] text-[12px] italic hover:scale-[1.05] active:scale-95 transition-all flex items-center gap-4 shadow-2xl shadow-[#ff6b2b]/20">
                      <Scan size={20} strokeWidth={4} /> Scan
                   </button>
                </div>
             </motion.div>

             {/* SYNC & ACTION CLUSTER */}
             <div className="flex items-center gap-6">
                <motion.button 
                   initial={{ y: 50, opacity: 0 }} 
                   animate={{ y: 0, opacity: 1 }}
                   onClick={fetchGraph}
                   disabled={isLoading}
                   className="h-24 px-12 bg-white/5 border-2 border-white/10 hover:border-[#ff6b2b]/40 text-white/40 hover:text-[#ff6b2b] rounded-[3rem] font-black uppercase tracking-[0.6em] text-[11px] italic backdrop-blur-3xl transition-all flex items-center gap-6 active:scale-95 disabled:opacity-50 group"
                >
                   <RefreshCw size={24} className={isLoading ? 'animate-spin' : 'group-hover:rotate-180 transition-transform duration-1000'} strokeWidth={3} />
                   {isLoading ? 'Syncing...' : 'Sync_Mesh'}
                </motion.button>
             </div>
          </div>
        </div>

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

      {/* ── CINEMATIC DECOR OVERLAYS ── */}
      <div className="fixed inset-0 pointer-events-none border-[30px] border-black/40 z-10" />
      <div className="fixed top-0 left-0 w-full h-full pointer-events-none opacity-[0.02] neural-grid z-0" />
      
      {/* HUD WATERMARK */}
      <div className="fixed bottom-10 right-10 opacity-[0.03] text-white pointer-events-none select-none z-0">
          <div className="text-[12vw] font-black italic italic leading-none uppercase text-right tracking-tighter">ARCHIVE<br/>OMEGA</div>
      </div>

      <style jsx global>{`
        .neural-grid {
          background-image: linear-gradient(rgba(255, 107, 43, 0.1) 1px, transparent 1px), 
                            linear-gradient(90deg, rgba(255, 107, 43, 0.1) 1px, transparent 1px);
          background-size: 80px 80px;
        }
        .text-shadow-orange {
          text-shadow: 0 0 30px rgba(255, 107, 43, 0.6);
        }
        @keyframes pulse-slow {
          0%, 100% { opacity: 0.2; transform: translate(-50%, -50%) scale(1); }
          50% { opacity: 0.5; transform: translate(-50%, -50%) scale(1.05); }
        }
        .animate-pulse-slow {
          animation: pulse-slow 12s ease-in-out infinite;
        }
        canvas {
          cursor: crosshair !important;
          opacity: 0.9;
        }
        .custom-scrollbar::-webkit-scrollbar { width: 4px; }
        .custom-scrollbar::-webkit-scrollbar-thumb { background: rgba(255, 107, 43, 0.2); border-radius: 10px; }
      `}</style>
    </div>
  );
}
