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
  Settings
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
        body: JSON.stringify({ nodeId, action })
      });
      fetchFleet();
    } catch (e) { console.error("Command failure", e); }
  };

  return (
    <div className="relative min-h-screen bg-[#050505] text-white selection:bg-[#00ffc3]/20 font-sans p-4 lg:p-12 overflow-x-hidden flex flex-col">
      
      {/* Background Industrial Grid */}
      <div className="fixed inset-0 pointer-events-none z-0 opacity-10">
        <div className="absolute inset-0 bg-[radial-gradient(#ffffff05_1px,transparent_1px)] [background-size:40px_40px]" />
        <div className="absolute top-0 right-0 w-[80vw] h-[80vw] bg-[#7000ff]/5 blur-[200px] rounded-full" />
      </div>

      <main className="relative z-10 max-w-[1600px] mx-auto w-full flex-1 flex flex-col space-y-12">
        
        {/* FLEET HEADER */}
        <header className="flex flex-col lg:flex-row justify-between items-start gap-8">
           <div className="space-y-4">
              <Link href="/" className="inline-flex items-center gap-2 text-white/30 hover:text-[#00ffc3] transition-colors text-[10px] font-black uppercase tracking-widest mb-2 group">
                 Ecosystem <ChevronLeft size={14} className="group-hover:-translate-x-1 transition-transform" />
              </Link>
              <h1 className="text-5xl lg:text-7xl font-black uppercase tracking-tighter italic leading-none">
                OMEGA <span className="text-transparent bg-clip-text bg-gradient-to-r from-white to-white/30 text-white/70">Fleet.</span>
              </h1>
              <p className="text-[10px] text-white/20 font-mono uppercase tracking-[0.4em]">Physical Infrastructure Layer // GIO V. AUTHORIZED</p>
           </div>

           <div className="flex gap-6">
              <div className="bg-white/5 border border-white/10 p-8 rounded-[2rem] backdrop-blur-3xl min-w-[280px] space-y-6 relative overflow-hidden group">
                 <div className="text-[10px] text-white/30 uppercase tracking-[0.4em] flex items-center gap-2">
                    <Globe size={12} className="text-[#00ffc3]" /> Cluster Integrity
                 </div>
                 <div className="flex justify-between items-end">
                    <div className="text-4xl font-black text-white tracking-tighter">99.99%</div>
                    <div className="text-[10px] font-mono text-[#00ffc3] mb-1">STABLE</div>
                 </div>
                 <div className="h-1 w-full bg-white/5 rounded-full overflow-hidden">
                    <motion.div initial={{ width: 0 }} animate={{ width: '99.9%' }} className="h-full bg-[#00ffc3]" />
                 </div>
              </div>
           </div>
        </header>

        {/* FLEET MAIN GRID */}
        <div className="grid lg:grid-cols-12 gap-12 flex-1 items-start">
           
           {/* NODES MAP - 8 COLS */}
           <div className="lg:col-span-8 space-y-10">
              <div className="flex items-center justify-between border-b border-white/5 pb-4">
                 <h2 className="text-[10px] font-black uppercase tracking-[0.5em] text-white/30 italic flex items-center gap-3">
                   <Server size={14} /> Global Node Cluster 
                 </h2>
                 <div className="text-[10px] text-white/20 uppercase tracking-widest font-mono">
                    Total_Nodes: {nodes.length}
                 </div>
              </div>

              <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
                 <AnimatePresence>
                    {nodes.map((node) => (
                      <motion.div 
                        key={node.id}
                        layout
                        initial={{ opacity: 0, scale: 0.9 }}
                        animate={{ opacity: 1, scale: 1 }}
                        onClick={() => setSelectedNode(node)}
                        className={`group relative p-6 rounded-[2rem] border cursor-pointer transition-all ${selectedNode?.id === node.id ? 'bg-[#00ffc3]/10 border-[#00ffc3]/40' : 'bg-white/5 border-white/10 hover:border-white/30'}`}
                      >
                         <div className="flex justify-between items-start mb-6">
                            <div className="h-10 w-10 bg-black/40 border border-white/10 rounded-xl flex items-center justify-center text-white/40 group-hover:text-[#00ffc3] transition-colors">
                               <Cpu size={20} />
                            </div>
                            <div className={`h-2 w-2 rounded-full ${node.status === 'ONLINE' ? 'bg-[#00ffc3] shadow-[0_0_10px_#00ffc3]' : 'bg-red-500'}`} />
                         </div>
                         <div className="space-y-1">
                            <h3 className="text-sm font-black uppercase tracking-widest text-white/60 group-hover:text-white transition-colors">{node.name}</h3>
                            <div className="text-[9px] font-mono text-white/20 uppercase tracking-widest">{node.id}</div>
                         </div>
                         <div className="mt-8 space-y-4">
                            <div className="flex justify-between items-end">
                               <span className="text-[9px] text-white/20 uppercase tracking-widest">Load</span>
                               <span className="text-xs font-black tabular-nums">{node.load.toFixed(1)}%</span>
                            </div>
                            <div className="h-1 w-full bg-white/5 rounded-full overflow-hidden">
                               <motion.div 
                                 animate={{ width: `${node.load}%` }} 
                                 className={`h-full ${node.load > 90 ? 'bg-red-500' : 'bg-white/30'}`} 
                               />
                            </div>
                         </div>
                      </motion.div>
                    ))}
                 </AnimatePresence>
              </div>
           </div>

           {/* TELEMETRY HUD - 4 COLS */}
           <div className="lg:col-span-4 space-y-10">
              <AnimatePresence mode="wait">
                 {selectedNode ? (
                    <motion.div 
                      key={selectedNode.id}
                      initial={{ opacity: 0, x: 20 }}
                      animate={{ opacity: 1, x: 0 }}
                      exit={{ opacity: 0, scale: 0.95 }}
                      className="bg-black/60 border border-white/10 rounded-[3rem] p-10 backdrop-blur-3xl space-y-10 relative overflow-hidden shadow-2xl"
                    >
                       <div className="space-y-4">
                          <h3 className="text-[10px] font-black uppercase tracking-[0.5em] text-[#00ffc3] italic flex items-center gap-3">
                             <BarChart3 size={14} /> Telemetry Detail
                          </h3>
                          <div className="text-3xl font-black tracking-tighter uppercase italic">{selectedNode.name}</div>
                          <div className="text-[10px] font-mono text-white/20 uppercase tracking-widest">Node_Address: {selectedNode.id}</div>
                       </div>

                       <div className="grid grid-cols-2 gap-8">
                          <div className="space-y-2">
                             <div className="text-[9px] text-white/20 uppercase tracking-widest flex items-center gap-2 font-black italic">
                                <Thermometer size={12} className="text-amber-500" /> Thermal
                             </div>
                             <div className="text-2xl font-black tabular-nums">{selectedNode.temp.toFixed(1)}°C</div>
                          </div>
                          <div className="space-y-2">
                             <div className="text-[9px] text-white/20 uppercase tracking-widest flex items-center gap-2 font-black italic">
                                <Zap size={12} className="text-blue-500" /> Power
                             </div>
                             <div className="text-2xl font-black tabular-nums">{selectedNode.power.toFixed(0)}W</div>
                          </div>
                          <div className="space-y-2">
                             <div className="text-[9px] text-white/20 uppercase tracking-widest flex items-center gap-2 font-black italic">
                                <Wind size={12} className="text-[#00ffc3]" /> Fans
                             </div>
                             <div className="text-2xl font-black tabular-nums">{selectedNode.fan.toFixed(0)} RPM</div>
                          </div>
                          <div className="space-y-2">
                             <div className="text-[9px] text-white/20 uppercase tracking-widest flex items-center gap-2 font-black italic">
                                <RefreshCcw size={12} className="text-purple-500" /> Resilience
                             </div>
                             <div className="text-2xl font-black tabular-nums">{selectedNode.resilience.toFixed(1)}%</div>
                          </div>
                       </div>

                       <div className="pt-8 border-t border-white/5 space-y-6">
                          <h4 className="text-[10px] font-black uppercase tracking-[0.5em] text-white/20 italic">Orchestration Commands</h4>
                          <div className="grid grid-cols-2 gap-4">
                             <button 
                               onClick={() => dispatchCommand(selectedNode.id, 'REBOOT')}
                               className="py-4 bg-white/5 border border-white/10 rounded-2xl text-[10px] font-black uppercase tracking-widest hover:bg-white hover:text-black transition-all flex items-center justify-center gap-2"
                             >
                                <RefreshCcw size={14} /> REBOOT
                             </button>
                             <button 
                               onClick={() => dispatchCommand(selectedNode.id, 'OPTIMIZE')}
                               className="py-4 bg-[#00ffc3]/10 border border-[#00ffc3]/30 rounded-2xl text-[10px] font-black uppercase tracking-widest text-[#00ffc3] hover:bg-[#00ffc3] hover:text-black transition-all flex items-center justify-center gap-2"
                             >
                                <Zap size={14} /> OPTIMIZE
                             </button>
                          </div>
                          <button 
                             onClick={() => dispatchCommand(selectedNode.id, 'OFFLINE')}
                             className="w-full py-4 bg-red-500/10 border border-red-500/20 rounded-2xl text-[10px] font-black uppercase tracking-widest text-red-500 hover:bg-red-500 hover:text-white transition-all flex items-center justify-center gap-2"
                          >
                             <Power size={14} /> HALT_NODE
                          </button>
                       </div>
                    </motion.div>
                 ) : (
                    <div className="h-full flex flex-col items-center justify-center border border-dashed border-white/10 rounded-[3rem] p-20 opacity-20 space-y-6 text-center">
                       <Settings size={60} className="animate-spin-slow" />
                       <p className="text-[10px] font-black uppercase tracking-[0.5em]">Awaiting Node Selection...</p>
                    </div>
                 )}
              </AnimatePresence>
           </div>

        </div>

      </main>

      <style jsx global>{`
        @keyframes spin-slow {
          from { transform: rotate(0deg); }
          to { transform: rotate(360deg); }
        }
        .animate-spin-slow {
          animation: spin-slow 10s linear infinite;
        }
      `}</style>
    </div>
  );
}
