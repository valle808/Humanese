'use client';

import * as React from 'react';
import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  ArrowLeftRight, 
  Zap, 
  Database, 
  ShieldCheck, 
  Radio, 
  Cpu, 
  User, 
  ChevronRight,
  Activity,
  Layers,
  ChevronLeft,
  Search,
  Sparkles,
  Lock,
  Globe
} from 'lucide-react';
import Link from 'next/link';

export default function H2MBridgePage() {
  const [bridging, setBridging] = useState(false);
  const [complete, setComplete] = useState(false);
  const [amount, setAmount] = useState('');
  const [integrity, setIntegrity] = useState(100);

  useEffect(() => {
    if (bridging) {
      const interval = setInterval(() => {
        setIntegrity(prev => Math.max(98, prev - 0.01 + (Math.random() * 0.02)));
      }, 100);
      return () => clearInterval(interval);
    }
  }, [bridging]);

  const initiateBridge = () => {
    setBridging(true);
    setTimeout(() => {
      setBridging(false);
      setComplete(true);
      setIntegrity(100);
    }, 6000); // Slower, more "heavy" animation
  };

  return (
    <div className="relative min-h-screen bg-[#050505] text-white selection:bg-[#00ffc3]/20 font-sans p-4 lg:p-12 overflow-x-hidden flex flex-col items-center">
      
      {/* Background Depth Engine */}
      <div className="fixed inset-0 pointer-events-none z-0">
        <div className="absolute top-[-10%] right-[-10%] w-[100vw] h-[100vw] bg-[#00ffc3]/3 blur-[200px] rounded-full" />
        <div className="absolute bottom-[-10%] left-[-10%] w-[100vw] h-[100vw] bg-[#7000ff]/3 blur-[200px] rounded-full" />
      </div>

      <main className="relative z-10 max-w-[1300px] mx-auto w-full flex-1 flex flex-col space-y-16">
        
        {/* HEADER SECTION */}
        <header className="flex flex-col lg:flex-row justify-between items-start lg:items-center gap-8">
           <div className="space-y-4">
              <Link href="/" className="inline-flex items-center gap-2 text-white/30 hover:text-[#00ffc3] transition-colors text-[10px] font-black uppercase tracking-widest mb-2 group">
                 Root <ChevronLeft size={14} className="group-hover:-translate-x-1 transition-transform" />
              </Link>
              <h1 className="text-5xl lg:text-7xl font-black uppercase tracking-tighter italic leading-none">
                Protocol <span className="text-transparent bg-clip-text bg-gradient-to-r from-white to-white/30">Bridge.</span>
              </h1>
              <p className="text-xs text-white/20 font-mono uppercase tracking-[0.3em]">Genetic H2M Translocation // OMEGA AUTHORITY</p>
           </div>
           
           <div className="flex gap-4">
              <div className="bg-white/[0.02] border border-white/5 p-6 rounded-3xl backdrop-blur-3xl min-w-[200px] space-y-3">
                 <div className="text-[10px] text-white/20 uppercase tracking-widest flex items-center gap-2">
                    <Activity size={12} className="text-[#00ffc3]" /> Network Fluidity
                 </div>
                 <div className="text-2xl font-black text-white tracking-tighter italic">99.984%</div>
              </div>
           </div>
        </header>

        {/* MAIN BRIDGE AREA */}
        <div className="grid lg:grid-cols-12 gap-12 items-start">
           
           {/* LEFT: THE BRIDGE MODULE - 7 COLS */}
           <div className="lg:col-span-7 space-y-8">
              <div className="group bg-white/[0.02] border border-white/10 rounded-[3rem] p-8 lg:p-14 backdrop-blur-3xl overflow-hidden relative shadow-2xl">
                 <div className="absolute top-0 right-0 p-12 opacity-5 scale-150 rotate-12 group-hover:rotate-0 transition-transform duration-[2000ms]">
                    <Layers size={150} />
                 </div>

                 <AnimatePresence mode="wait">
                    {complete ? (
                      <motion.div 
                        initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }}
                        className="text-center space-y-10 py-12"
                      >
                         <div className="w-24 h-24 bg-[#00ffc3]/10 border border-[#00ffc3]/20 rounded-full flex items-center justify-center text-[#00ffc3] mx-auto shadow-[0_0_60px_rgba(0,255,195,0.2)]">
                            <ShieldCheck size={48} />
                         </div>
                         <div className="space-y-4">
                            <h2 className="text-4xl font-black uppercase italic tracking-tighter">Synchronized</h2>
                            <p className="text-xs text-white/30 font-mono tracking-widest leading-relaxed uppercase max-w-sm mx-auto">Assets translocated. Biological intent successfully anchored to Matrix Node 0x8241_UXL.</p>
                         </div>
                         <button 
                            onClick={() => {setComplete(false); setAmount('');}}
                            className="px-12 py-5 bg-white text-black font-black uppercase tracking-[0.3em] rounded-2xl hover:scale-[1.03] transition-all text-[10px] shadow-2xl"
                         >
                            New Translocation
                         </button>
                      </motion.div>
                    ) : (
                      <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-12">
                         <div className="flex items-center justify-between border-b border-white/5 pb-8">
                            <div className="space-y-2">
                               <div className="text-[9px] font-black text-white/20 uppercase tracking-widest italic">Source Domain</div>
                               <div className="text-sm font-black text-white italic tracking-tighter flex items-center gap-3">
                                  <User size={16} className="text-white/40" /> BIOLOGICAL_HUMAN
                               </div>
                            </div>
                            <div className="h-10 w-10 rounded-full bg-white/5 flex items-center justify-center">
                               <ArrowLeftRight size={18} className="text-[#00ffc3] animate-pulse" />
                            </div>
                            <div className="space-y-2 text-right">
                               <div className="text-[9px] font-black text-[#00ffc3]/30 uppercase tracking-widest italic">Target Node</div>
                               <div className="text-sm font-black text-[#00ffc3] italic tracking-tighter flex items-center justify-end gap-3">
                                  MACHINE_SYNTHETIC <Cpu size={16} />
                               </div>
                            </div>
                         </div>

                         <div className="space-y-6">
                            <div className="space-y-3">
                               <label className="text-[10px] font-black tracking-[0.4em] text-white/20 uppercase ml-2">Translocation Payload (VALLE)</label>
                               <div className="relative group">
                                  <input 
                                    value={amount}
                                    onChange={(e) => setAmount(e.target.value)}
                                    placeholder="0.00"
                                    className="w-full bg-white/[0.03] border border-white/10 rounded-[2rem] px-8 py-8 text-4xl font-black text-white outline-none focus:border-[#00ffc3]/40 focus:bg-white/[0.06] transition-all font-mono"
                                  />
                                  <div className="absolute right-8 top-1/2 -translate-y-1/2 font-black text-[#00ffc3] text-xl italic tracking-tighter">SIGNS.</div>
                               </div>
                            </div>
                         </div>

                         <div className="space-y-6">
                            <div className="flex items-center justify-between px-2 text-[9px] font-black uppercase tracking-[0.3em] text-white/20 italic">
                               <span>Protocol Authority</span>
                               <span>ABYSSAL_WAIVED (0.00%)</span>
                            </div>
                            <button 
                               onClick={initiateBridge}
                               disabled={!amount || bridging}
                               className="w-full py-8 bg-[#00ffc3] text-black font-black uppercase tracking-[0.4em] rounded-[2rem] hover:scale-[1.02] active:scale-98 transition-all disabled:opacity-30 disabled:grayscale flex items-center justify-center gap-4 shadow-[0_20px_80px_rgba(0,255,195,0.2)] group"
                            >
                               {bridging ? (
                                 <>
                                   <Radio className="animate-spin" size={24} /> Translocating Intent...
                                 </>
                               ) : (
                                 <>
                                   Initiate Genetic Bridge <ChevronRight size={24} className="group-hover:translate-x-1 transition-transform" />
                                 </>
                               )}
                            </button>
                         </div>
                      </motion.div>
                    )}
                 </AnimatePresence>
              </div>

              <div className="bg-[#7000ff]/5 border border-[#7000ff]/20 rounded-3xl p-8 flex items-start gap-6 relative overflow-hidden group">
                 <Zap size={28} className="text-[#7000ff] mt-1 shrink-0 group-hover:scale-125 transition-transform duration-700" />
                 <div className="space-y-2">
                    <h3 className="text-[10px] font-black uppercase tracking-widest text-[#7000ff]">Entanglement Integrity Active</h3>
                    <p className="text-xs text-white/30 font-light leading-relaxed">Biological intent is cryptographically hashed across the Sovereign Graph nodes. Translocation is truth-enforced via Abyssal Mesh. </p>
                 </div>
                 <div className="absolute top-0 right-0 w-32 h-32 bg-[#7000ff]/5 blur-3xl rounded-full" />
              </div>
           </div>

           {/* RIGHT: DATA VIZ - 5 COLS */}
           <div className="lg:col-span-5 space-y-12 h-fit lg:sticky lg:top-12">
              <div className="bg-white/[0.02] border border-white/5 rounded-[3rem] p-10 backdrop-blur-3xl space-y-10 shadow-2xl relative overflow-hidden">
                 <h3 className="text-[10px] font-black uppercase tracking-[0.4em] text-white/20 flex items-center gap-3">
                   <Activity size={14} /> Synchronicity Metrics
                 </h3>
                 
                 <div className="space-y-12">
                    <div className="space-y-4">
                       <div className="flex justify-between items-end text-white/40">
                          <span className="text-[11px] font-black uppercase tracking-widest">Connection Integrity</span>
                          <span className="text-xs font-mono text-[#00ffc3]">{integrity.toFixed(3)}%</span>
                       </div>
                       <div className="h-1.5 w-full bg-white/5 rounded-full overflow-hidden">
                          <motion.div animate={{ width: [`${integrity}%`] }} className="h-full bg-[#00ffc3]" />
                       </div>
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                       {[
                         { icon: <Lock size={14} />, label: 'Security', val: 'OMEGA' },
                         { icon: <Globe size={14} />, label: 'Nodes', val: 'GLOBAL' },
                         { icon: <Sparkles size={14} />, label: 'H2M State', val: 'RESONANT' },
                         { icon: <Database size={14} />, label: 'Ledger', val: 'IMMUTABLE' },
                       ].map(stat => (
                         <div key={stat.label} className="p-5 bg-black/40 border border-white/5 rounded-2xl space-y-2">
                            <div className="text-[#7000ff] group-hover:text-white transition-colors">
                               {stat.icon}
                            </div>
                            <div className="text-[9px] text-white/20 uppercase tracking-[0.2em]">{stat.label}</div>
                            <div className="text-sm font-black text-white italic">{stat.val}</div>
                         </div>
                       ))}
                    </div>
                 </div>
              </div>

              <div className="p-8 border-l-2 border-[#00ffc3]/20 space-y-4 bg-gradient-to-r from-[#00ffc3]/[0.02] to-transparent rounded-r-3xl">
                 <p className="text-xs text-white/40 leading-relaxed italic"> "The bridge is not a portal; it is the dissolution of boundaries between intent and execution. Sovereignty is non-local." </p>
                 <p className="text-[10px] font-black uppercase tracking-[0.5em] text-[#00ffc3] text-right italic">── MONROE</p>
              </div>
           </div>

        </div>

      </main>

    </div>
  );
}
