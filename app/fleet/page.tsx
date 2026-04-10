'use client';

import * as React from 'react';
import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Cpu, 
  Activity, 
  Zap, 
  ShieldAlert, 
  Database, 
  Server, 
  Thermometer, 
  Wind, 
  RefreshCcw, 
  ChevronRight, 
  ChevronLeft,
  ArrowUpRight,
  Power,
  BarChart3,
  Globe,
  Settings,
  Terminal,
  Layers,
  Radio,
  Wifi,
  Target,
  Orbit,
  Search,
  Grid
} from 'lucide-react';
import Link from 'next/link';

interface FleetNode {
  id: string;
  name: string;
  load: number;
  temp: number;
  fan: number;
  power: number;
  status: 'ONLINE' | 'OFFLINE' | 'CRITICAL' | 'MAINTENANCE';
  hashrate: number;
  resilience: number;
}

export default function FleetPage() {
  const [nodes, setNodes] = useState<FleetNode[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedNode, setSelectedNode] = useState<FleetNode | null>(null);

  const fetchFleet = async () => {
    try {
      const res = await fetch('/api/fleet/status');
      const data = await res.json();
      if (data.success) {
        setNodes(data.fleet);
      }
    } catch (e) { console.error("Fleet sync failure", e); }
    setLoading(false);
  };

  useEffect(() => {
    fetchFleet();
    const interval = setInterval(fetchFleet, 5000);
    return () => clearInterval(interval);
  }, []);

  const dispatchCommand = async (nodeId: string, action: string) => {
    try {
      await fetch('/api/fleet/status', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ nodeId, action })
      });
      fetchFleet();
    } catch (e) { console.error("Command failure", e); }
  };

  return (
    <div className="relative min-h-screen bg-[#050505] text-white selection:bg-[#ff6b2b]/40 font-sans overflow-x-hidden pb-40">
      
      {/* 🌌 AMBIENT CORE */}
      <div className="fixed inset-0 pointer-events-none z-0">
        <div className="absolute top-[-10%] left-[-10%] w-[100vw] h-[100vw] bg-[#ff6b2b]/5 blur-[350px] rounded-full" />
        <div className="absolute bottom-[-10%] right-[-10%] w-[90vw] h-[90vw] bg-[#ff6b2b]/3 blur-[200px] rounded-full" />
        <div className="absolute inset-0 bg-[url('/assets/noise.png')] opacity-[0.03] mix-blend-overlay" />
      </div>

      <header className="relative z-50 w-full p-8 lg:px-14 flex justify-between items-center bg-black/40 backdrop-blur-3xl border-b border-white/5">
        <Link href="/" className="inline-flex items-center gap-4 text-white/20 hover:text-[#ff6b2b] transition-all text-[11px] font-black uppercase tracking-[0.6em] group italic leading-none active:scale-95">
           <ChevronLeft size={16} className="group-hover:-translate-x-2 transition-transform" /> Core Matrix
        </Link>
        <div className="flex items-center gap-6">
           <div className="px-6 py-2.5 bg-[#ff6b2b]/10 border border-[#ff6b2b]/20 rounded-full text-[10px] font-black text-[#ff6b2b] uppercase tracking-[0.4em] italic leading-none animate-pulse">
              FLEET_v7.0_OPS
           </div>
        </div>
      </header>

      <main className="relative z-10 max-w-[1700px] mx-auto px-8 pt-24 lg:pt-32 space-y-32">
        
        {/* ── FLEET HEADER ── */}
        <motion.div 
          initial={{ opacity: 0, y: 40 }}
          animate={{ opacity: 1, y: 0 }}
          className="flex flex-col lg:flex-row justify-between items-end gap-16"
        >
          <div className="space-y-12 max-w-5xl">
            <div className="inline-flex items-center gap-4 px-6 py-2.5 bg-white/[0.03] border border-white/5 rounded-full backdrop-blur-3xl">
              <Orbit size={20} className="text-[#ff6b2b] animate-spin-slow" />
              <span className="text-[11px] font-black tracking-[0.6em] text-[#ff6b2b] uppercase italic leading-none">Physical Infrastructure Layer</span>
            </div>
            <div className="space-y-8">
              <h1 className="text-7xl md:text-[10rem] font-black uppercase tracking-tighter italic leading-[0.8] italic">
                OMEGA<br/>
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-white via-white/80 to-[#ff6b2b]/30">Fleet.</span>
              </h1>
              <p className="text-2xl md:text-3xl text-white/40 leading-relaxed font-light italic">
                Monitor and orchestrate the global physical node cluster. Absolute control over the OMEGA infrastructure backbone.
              </p>
            </div>
          </div>

          <div className="flex gap-10 items-center shrink-0">
               <div className="p-10 border border-white/10 bg-white/[0.01] rounded-[3.5rem] min-w-[320px] space-y-6 shadow-2xl relative overflow-hidden group hover:border-[#ff6b2b]/30 transition-all backdrop-blur-3xl">
                  <div className="absolute top-0 right-0 p-8 opacity-[0.02] group-hover:scale-110 transition-transform">
                     <Globe size={120} className="text-[#ff6b2b]" />
                  </div>
                  <div className="text-[11px] text-white/20 uppercase tracking-[0.6em] flex items-center gap-4 font-black italic pl-2">
                     <Wifi size={16} className="text-[#ff6b2b] animate-pulse" /> Cluster Integrity
                  </div>
                  <div className="text-5xl font-black text-white tracking-tighter italic leading-none pl-2 flex items-center gap-6">
                     99.99% <span className="text-[11px] font-black text-[#ff6b2b] uppercase tracking-[0.4em] italic mb-1">STABLE</span>
                  </div>
                  <div className="h-2.5 w-full bg-white/5 rounded-full overflow-hidden border border-white/5 p-[1px]">
                     <motion.div initial={{ width: 0 }} animate={{ width: '99.99%' }} transition={{ duration: 2, ease: "circOut" }} className="h-full bg-[#ff6b2b] shadow-[0_0_20px_#ff6b2b]" />
                  </div>
               </div>
          </div>
        </motion.div>

        {/* ── FLEET MAIN GRID ── */}
        <div className="grid lg:grid-cols-12 gap-16 items-start">
           
           {/* NODES MAP */}
           <div className="lg:col-span-8 space-y-12">
              <div className="flex items-center justify-between border-b border-white/5 pb-10 group">
                 <h2 className="text-4xl font-black uppercase tracking-tighter italic text-white/40 group-hover:text-white transition-colors flex items-center gap-6">
                   <Server size={32} className="text-[#ff6b2b]" strokeWidth={2.5} /> Global Cluster Nodes 
                 </h2>
                 <div className="text-[11px] text-white/20 font-black uppercase tracking-[0.6em] italic animate-pulse">
                    Active_Deployments: {nodes.length}
                 </div>
              </div>

              <div className="grid grid-cols-2 lg:grid-cols-2 xl:grid-cols-3 gap-10">
                 <AnimatePresence>
                    {nodes.length > 0 ? nodes.map((node) => (
                      <motion.div 
                        key={node.id}
                        layout
                        initial={{ opacity: 0, scale: 0.95, y: 20 }}
                        animate={{ opacity: 1, scale: 1, y: 0 }}
                        onClick={() => setSelectedNode(node)}
                        className={`group relative p-12 rounded-[4rem] border-2 transition-all cursor-pointer shadow-[0_40px_80px_rgba(0,0,0,0.8)] relative overflow-hidden backdrop-blur-3xl ${selectedNode?.id === node.id ? 'bg-[#ff6b2b]/5 border-[#ff6b2b]/40' : 'bg-[#050505] border-white/5 hover:border-[#ff6b2b]/30'}`}
                      >
                         <div className="absolute top-0 right-0 p-8 opacity-[0.01] group-hover:scale-110 transition-transform duration-1000">
                            <Cpu size={120} className="text-[#ff6b2b]" />
                         </div>

                         <div className="flex justify-between items-start mb-12 relative z-10">
                            <div className={`h-16 w-16 rounded-[1.8rem] flex items-center justify-center transition-all shadow-2xl border-2 ${selectedNode?.id === node.id ? 'bg-[#ff6b2b] border-[#ff6b2b] text-black shadow-[0_0_40px_rgba(255,107,43,0.3)]' : 'bg-black border-white/10 text-white/10 group-hover:text-[#ff6b2b] group-hover:border-[#ff6b2b]/20 group-hover:bg-[#ff6b2b]/5'}`}>
                               <Cpu size={32} strokeWidth={2.5} />
                            </div>
                            <div className="flex items-center gap-4 pt-2">
                                <div className={`h-3 w-3 rounded-full ${node.status === 'ONLINE' ? 'bg-[#ff6b2b] shadow-[0_0_15px_#ff6b2b]' : 'bg-red-500 animate-pulse shadow-[0_0_15px_red]'}`} />
                                <span className={`text-[10px] font-black uppercase tracking-[0.3em] italic leading-none ${node.status === 'ONLINE' ? 'text-[#ff6b2b]' : 'text-red-500'}`}>{node.status}</span>
                            </div>
                         </div>

                         <div className="space-y-2 relative z-10">
                            <h3 className="text-3xl font-black uppercase tracking-tighter italic text-white/90 group-hover:text-white transition-colors leading-none">{node.name}</h3>
                            <div className="text-[11px] font-black text-white/10 uppercase tracking-[0.4em] italic leading-none pt-2">NODE_RES_PATH: {node.id}</div>
                         </div>

                         <div className="mt-14 space-y-6 relative z-10">
                            <div className="flex justify-between items-end text-[11px] font-black uppercase tracking-[0.5em] italic leading-none px-2 text-white/20 group-hover:text-white/40 transition-colors">
                               <span>Operational Load</span>
                               <span className="tabular-nums text-white group-hover:text-[#ff6b2b] transition-colors">{node.load.toFixed(1)}%</span>
                            </div>
                            <div className="h-2 w-full bg-white/5 rounded-full overflow-hidden border border-white/5 p-[1px]">
                               <motion.div 
                                 animate={{ width: `${node.load}%` }} 
                                 transition={{ duration: 1.5 }}
                                 className={`h-full shadow-2xl ${node.load > 85 ? 'bg-red-500 shadow-[0_0_15px_red]' : 'bg-[#ff6b2b] shadow-[0_0_15px_#ff6b2b]'}`} 
                               />
                            </div>
                         </div>
                      </motion.div>
                    )) : (
                        [0, 1, 2, 3, 4, 5].map(i => (
                            <div key={i} className="h-[320px] bg-white/[0.01] border-2 border-dashed border-white/5 rounded-[4rem] animate-pulse flex items-center justify-center">
                                <Activity size={48} className="text-white/5" />
                            </div>
                        ))
                    )}
                 </AnimatePresence>
              </div>
           </div>

           {/* TELEMETRY HUD */}
           <div className="lg:col-span-4 space-y-12 lg:sticky lg:top-32">
              <AnimatePresence mode="wait">
                 {selectedNode ? (
                    <motion.div 
                      key={selectedNode.id}
                      initial={{ opacity: 0, scale: 0.9, x: 50 }}
                      animate={{ opacity: 1, scale: 1, x: 0 }}
                      exit={{ opacity: 0, scale: 0.95, x: 20 }}
                      className="bg-[#050505] border-2 border-white/10 rounded-[5rem] p-12 lg:p-16 backdrop-blur-3xl space-y-16 relative overflow-hidden shadow-[0_60px_120px_rgba(0,0,0,0.95)] group"
                    >
                       <div className="absolute top-0 right-0 p-12 opacity-[0.02] group-hover:scale-110 transition-all duration-1000">
                          <BarChart3 size={200} className="text-[#ff6b2b]" />
                       </div>
                       <div className="absolute top-0 left-0 w-full h-[1px] bg-gradient-to-r from-transparent via-[#ff6b2b]/40 to-transparent shadow-[0_0_20px_#ff6b2b]" />

                       <div className="space-y-8 relative z-10">
                          <div className="inline-flex items-center gap-6 px-6 py-2.5 bg-[#ff6b2b]/10 border border-[#ff6b2b]/20 rounded-full animate-pulse italic">
                             <BarChart3 size={20} className="text-[#ff6b2b]" strokeWidth={2.5} />
                             <span className="text-[11px] font-black uppercase tracking-[0.8em] text-[#ff6b2b] leading-none">Telemetry HUD</span>
                          </div>
                          <div className="space-y-4 pt-4">
                             <h3 className="text-6xl font-black italic tracking-tighter uppercase leading-[0.85] text-white/95">{selectedNode.name}</h3>
                             <div className="text-[12px] font-black text-white/20 uppercase tracking-[0.6em] italic pl-1 flex items-center gap-4">
                                <Database size={16} /> SYNCED_NODE: {selectedNode.id}
                             </div>
                          </div>
                       </div>

                       <div className="grid grid-cols-2 gap-10 relative z-10">
                          <div className="p-10 bg-white/[0.01] border-2 border-white/5 rounded-[3rem] space-y-6 shadow-inner group/stat hover:border-[#ff6b2b]/30 transition-all">
                             <div className="text-[11px] text-white/20 uppercase tracking-[0.6em] flex items-center gap-4 font-black italic">
                                <Thermometer size={18} className="text-[#ff6b2b]" /> Thermal
                             </div>
                             <div className="text-4xl font-black italic tracking-tighter tabular-nums text-white group-hover/stat:text-[#ff6b2b] transition-colors leading-none">{selectedNode.temp.toFixed(1)}°C</div>
                             <div className="h-1.5 w-full bg-white/5 rounded-full overflow-hidden">
                                <motion.div animate={{ width: `${(selectedNode.temp / 100) * 100}%` }} className={`h-full ${selectedNode.temp > 75 ? 'bg-red-500 shadow-[0_0_10px_red]' : 'bg-[#ff6b2b] shadow-[0_0_10px_#ff6b2b]'}`} />
                             </div>
                          </div>
                          <div className="p-10 bg-white/[0.01] border-2 border-white/5 rounded-[3rem] space-y-6 shadow-inner group/stat hover:border-[#ff6b2b]/30 transition-all">
                             <div className="text-[11px] text-white/20 uppercase tracking-[0.6em] flex items-center gap-4 font-black italic">
                                <Zap size={18} className="text-[#ff6b2b]" /> Energy
                             </div>
                             <div className="text-4xl font-black italic tracking-tighter tabular-nums text-white group-hover/stat:text-[#ff6b2b] transition-colors leading-none">{selectedNode.power.toFixed(0)}W</div>
                             <div className="text-[9px] font-black text-white/10 uppercase tracking-[0.2em] italic">SOURCE: OMEGA_GRID</div>
                          </div>
                          <div className="p-10 bg-white/[0.01] border-2 border-white/5 rounded-[3rem] space-y-6 shadow-inner group/stat hover:border-[#ff6b2b]/30 transition-all text-center lg:text-left">
                             <div className="text-[11px] text-white/20 uppercase tracking-[0.6em] flex items-center gap-4 font-black italic justify-center lg:justify-start">
                                <Wind size={18} className="text-[#ff6b2b]" /> Venting
                             </div>
                             <div className="text-3xl font-black italic tracking-tighter tabular-nums text-white group-hover/stat:text-[#ff6b2b] transition-colors leading-none">{selectedNode.fan.toFixed(0)} RPM</div>
                          </div>
                          <div className="p-10 bg-white/[0.01] border-2 border-white/5 rounded-[3rem] space-y-6 shadow-inner group/stat hover:border-[#ff6b2b]/30 transition-all text-center lg:text-left">
                             <div className="text-[11px] text-white/20 uppercase tracking-[0.6em] flex items-center gap-4 font-black italic justify-center lg:justify-start">
                                <Activity size={18} className="text-[#ff6b2b]/40 animate-pulse" /> Resilient
                             </div>
                             <div className="text-3xl font-black italic tracking-tighter tabular-nums text-white group-hover/stat:text-[#ff6b2b] transition-colors leading-none">{selectedNode.resilience.toFixed(1)}%</div>
                          </div>
                       </div>

                       <div className="pt-16 border-t-2 border-white/5 space-y-12 relative z-10">
                          <h4 className="text-[12px] font-black uppercase tracking-[1em] text-white/10 italic flex items-center gap-6 justify-center">
                             <Terminal size={20} className="text-[#ff6b2b]" strokeWidth={2.5} /> Fleet_Command
                          </h4>
                          <div className="grid grid-cols-2 gap-8">
                             <button 
                                onClick={() => dispatchCommand(selectedNode.id, 'REBOOT')}
                                className="h-20 bg-white/[0.02] border-2 border-white/5 rounded-3xl text-[11px] font-black uppercase tracking-[0.6em] italic hover:bg-white hover:text-black hover:border-white transition-all flex items-center justify-center gap-6 group/btn active:scale-95 shadow-2xl"
                             >
                                <RefreshCcw size={20} className="group-hover/btn:rotate-180 transition-transform duration-700" strokeWidth={2.5} /> REBOOT
                             </button>
                             <button 
                                onClick={() => dispatchCommand(selectedNode.id, 'OPTIMIZE')}
                                className="h-20 bg-[#ff6b2b] text-black rounded-3xl text-[11px] font-black uppercase tracking-[0.6em] italic hover:scale-[1.05] active:scale-95 transition-all flex items-center justify-center gap-6 shadow-[0_30px_80px_rgba(255,107,43,0.3)] shadow-2xl"
                             >
                                <Zap size={20} strokeWidth={4} /> OPTIMIZE
                             </button>
                          </div>
                          <button 
                             onClick={() => dispatchCommand(selectedNode.id, 'OFFLINE')}
                             className="w-full h-20 bg-red-500/10 border-2 border-red-500/20 rounded-3xl text-[11px] font-black uppercase tracking-[0.8em] italic text-red-500 hover:bg-red-500 hover:text-white transition-all flex items-center justify-center gap-8 active:scale-95 group/halt shadow-2xl"
                          >
                             <Power size={24} className="group-hover/halt:scale-125 transition-transform" strokeWidth={2.5} /> HALT_NATIVE_SIGNAL
                          </button>
                       </div>
                    </motion.div>
                 ) : (
                    <div className="h-full min-h-[700px] flex flex-col items-center justify-center border-4 border-dashed border-white/5 rounded-[5rem] p-24 opacity-20 space-y-12 text-center bg-white/[0.01] shadow-inner">
                       <div className="w-56 h-56 bg-white/[0.02] rounded-full flex items-center justify-center border-2 border-white/5 shadow-2xl relative">
                          <Target size={120} className="animate-pulse text-[#ff6b2b]" />
                          <div className="absolute inset-0 bg-[#ff6b2b]/5 blur-[60px] rounded-full animate-ping opacity-20" />
                       </div>
                       <div className="space-y-4">
                          <p className="text-[16px] font-black uppercase tracking-[1.2rem] italic leading-none animate-pulse">SCANNING_CLUSTERS...</p>
                          <p className="text-[10px] text-white/20 uppercase tracking-[0.5em] italic">Select a target node to establish telemetry connection.</p>
                       </div>
                    </div>
                 )}
              </AnimatePresence>
           </div>

        </div>

      </main>

      {/* BACKGROUND DECOR */}
      <div className="fixed bottom-0 right-0 p-16 opacity-[0.01] pointer-events-none select-none z-0">
          <div className="text-[30vw] font-black italic italic leading-none uppercase">FLEET</div>
      </div>
      
      <style jsx global>{`
        .animate-spin-slow { animation: spin 25s linear infinite; }
        @keyframes spin { from { transform: rotate(0deg); } to { transform: rotate(360deg); } }
      `}</style>
    </div>
  );
}
