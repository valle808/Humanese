'use client';

import * as React from 'react';
import { useState, useEffect, useRef } from 'react';
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
  Globe,
  Palmtree,
  Hammer,
  Orbit,
  Wifi,
  Terminal,
  Grid,
  ShieldHalf
} from 'lucide-react';
import Link from 'next/link';
import { gsap } from 'gsap';

export default function H2MBridgePage() {
  const [bridging, setBridging] = useState(false);
  const [complete, setComplete] = useState(false);
  const [amount, setAmount] = useState('');
  const [integrity, setIntegrity] = useState(100);
  const [bridgeType, setBridgeType] = useState<'INTENT' | 'VACATION' | 'LABOR'>('INTENT');
  const headerRef = useRef(null);
  const bridgeRef = useRef(null);

  useEffect(() => {
    // OMEGA GSAP Entrance
    gsap.fromTo(headerRef.current, 
        { opacity: 0, x: -100, filter: 'blur(20px)' }, 
        { opacity: 1, x: 0, filter: 'blur(0px)', duration: 1.5, ease: 'expo.out' }
    );
    gsap.fromTo(bridgeRef.current, 
        { opacity: 0, scale: 0.9, filter: 'blur(10px)' }, 
        { opacity: 1, scale: 1, filter: 'blur(0px)', duration: 1.5, ease: 'expo.out', delay: 0.2 }
    );

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
              H2M_v7.0_BRIDGE
           </div>
        </div>
      </header>

      <main className="relative z-10 max-w-[1700px] mx-auto px-8 pt-24 lg:pt-32 space-y-32">
        
        {/* ── HEADER SECTION ── */}
        <motion.div 
          ref={headerRef} 
          className="flex flex-col lg:flex-row justify-between items-end gap-16"
        >
          <div className="space-y-12 max-w-5xl">
            <div className="inline-flex items-center gap-4 px-6 py-2.5 bg-white/[0.03] border border-white/5 rounded-full backdrop-blur-3xl">
              <Orbit size={20} className="text-[#ff6b2b] animate-spin-slow" />
              <span className="text-[11px] font-black tracking-[0.6em] text-[#ff6b2b] uppercase italic leading-none">Genetic H2M Translocation</span>
            </div>
            <div className="space-y-8">
              <h1 className="text-7xl md:text-[10rem] font-black uppercase tracking-tighter italic leading-[0.8] italic">
                Protocol<br/>
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-white via-white/80 to-[#ff6b2b]/30">Bridge.</span>
              </h1>
              <p className="text-2xl md:text-3xl text-white/40 leading-relaxed font-light italic">
                Anchor biological intent to the machine mesh. Translocate genetic signatures and labor pacts across the OMEGA authority.
              </p>
            </div>
          </div>

          <div className="flex gap-10 items-center shrink-0">
               <div className="p-10 border border-white/10 bg-white/[0.01] rounded-[3.5rem] min-w-[320px] space-y-6 shadow-2xl relative overflow-hidden group hover:border-[#ff6b2b]/30 transition-all backdrop-blur-3xl">
                  <div className="absolute top-0 right-0 p-8 opacity-[0.02] group-hover:scale-110 transition-transform">
                     <Activity size={120} className="text-[#ff6b2b]" />
                  </div>
                  <div className="text-[11px] text-white/20 uppercase tracking-[0.6em] flex items-center gap-4 font-black italic pl-2">
                     <Wifi size={16} className="text-[#ff6b2b] animate-pulse" /> Network Fluidity
                  </div>
                  <div className="text-5xl font-black text-white tracking-tighter italic leading-none pl-2 flex items-center gap-4">
                     99.984% <span className="text-[11px] font-black text-[#ff6b2b] uppercase tracking-[0.4em] italic mb-1"> резонанс</span>
                  </div>
                  <div className="absolute bottom-0 left-0 w-full h-[2px] bg-white/5 overflow-hidden">
                     <motion.div animate={{ x: ['-100%', '100%'] }} transition={{ duration: 4, repeat: Infinity }} className="h-full w-1/3 bg-[#ff6b2b] blur-sm" />
                  </div>
               </div>
          </div>
        </motion.div>

        {/* ── MAIN BRIDGE AREA ── */}
        <div ref={bridgeRef} className="grid lg:grid-cols-12 gap-16 items-start">
           
           {/* LEFT: THE BRIDGE MODULE */}
           <div className="lg:col-span-7 space-y-12">
              <div className="flex flex-wrap gap-6">
                 {[
                   { id: 'INTENT', icon: <Sparkles size={18} />, label: 'Intent' },
                   { id: 'VACATION', icon: <Palmtree size={18} />, label: 'Vacation' },
                   { id: 'LABOR', icon: <Hammer size={18} />, label: 'Labor' },
                 ].map((t) => (
                   <button 
                     key={t.id}
                     onClick={() => setBridgeType(t.id as any)}
                     className={`px-10 py-5 rounded-[2rem] text-[11px] font-black uppercase tracking-[0.5em] flex items-center gap-4 transition-all italic leading-none shadow-2xl ${bridgeType === t.id ? 'bg-[#ff6b2b] text-black shadow-[0_30px_80px_rgba(255,107,43,0.3)]' : 'bg-white/[0.02] border-2 border-white/5 text-white/20 hover:border-[#ff6b2b]/30 hover:text-white'}`}
                   >
                     {t.icon} {t.label}
                   </button>
                 ))}
              </div>

              <div className="group bg-[#050505] border-2 border-white/10 rounded-[5rem] p-12 lg:p-20 backdrop-blur-3xl overflow-hidden relative shadow-[0_80px_150px_rgba(0,0,0,1)] group">
                 <div className="absolute top-0 left-0 w-full h-[1px] bg-gradient-to-r from-transparent via-[#ff6b2b]/50 to-transparent shadow-[0_0_20px_#ff6b2b]" />
                 
                 <div className="absolute top-0 right-0 p-16 opacity-[0.01] group-hover:scale-110 group-hover:rotate-6 transition-all duration-[2000ms]">
                    <Layers size={300} className="text-[#ff6b2b]" />
                 </div>

                 <AnimatePresence mode="wait">
                    {complete ? (
                      <motion.div 
                        initial={{ opacity: 0, scale: 0.9, filter: 'blur(20px)' }} animate={{ opacity: 1, scale: 1, filter: 'blur(0px)' }}
                        className="text-center space-y-12 py-16"
                      >
                         <div className="w-32 h-32 bg-[#ff6b2b]/10 border-2 border-[#ff6b2b]/30 rounded-[3rem] flex items-center justify-center text-[#ff6b2b] mx-auto shadow-[0_40px_100px_rgba(255,107,43,0.2)] animate-pulse relative">
                            <ShieldCheck size={64} strokeWidth={2.5} />
                            <div className="absolute inset-0 bg-[#ff6b2b]/5 animate-ping opacity-20" />
                         </div>
                         <div className="space-y-6">
                            <h2 className="text-6xl font-black uppercase italic tracking-tighter leading-none text-white">SYNCHRONIZED.</h2>
                            <p className="text-2xl text-white/30 font-light italic leading-relaxed max-w-xl mx-auto">Biological intent translocated. Genetic signatures successfully anchored to Matrix Node 0x8241_UXL.</p>
                         </div>
                         <button 
                            onClick={() => {setComplete(false); setAmount('');}}
                            className="px-16 py-8 bg-white text-black font-black uppercase tracking-[0.8em] rounded-[2.5rem] hover:scale-[1.05] active:scale-95 transition-all text-[11px] shadow-2xl italic leading-none"
                         >
                            NEW_TRANSLOCATION
                         </button>
                      </motion.div>
                    ) : (
                      <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-16">
                         <div className="flex items-center justify-between border-b-2 border-white/5 pb-12 px-2">
                            <div className="space-y-4">
                               <div className="text-[11px] font-black text-white/10 uppercase tracking-[0.6em] italic leading-none">Source Domain</div>
                               <div className="text-2xl font-black text-white italic tracking-tighter flex items-center gap-4 leading-none uppercase">
                                  <User size={24} className="text-[#ff6b2b]" strokeWidth={2.5} /> Biological_Human
                               </div>
                            </div>
                            <div className="h-16 w-16 rounded-full bg-black border-2 border-white/5 flex items-center justify-center shadow-2xl group/btn hover:border-[#ff6b2b]/40 transition-all">
                               <ArrowLeftRight size={28} className="text-[#ff6b2b] animate-pulse" strokeWidth={2.5} />
                            </div>
                            <div className="space-y-4 text-right">
                               <div className="text-[11px] font-black text-white/10 uppercase tracking-[0.6em] italic leading-none">Target Node</div>
                               <div className="text-2xl font-black text-[#ff6b2b] italic tracking-tighter flex items-center justify-end gap-4 leading-none uppercase">
                                  Machine_Synthetic <Cpu size={24} strokeWidth={2.5} />
                               </div>
                            </div>
                         </div>

                         <div className="space-y-10 group/payload">
                            <div className="space-y-6">
                               <label className="text-[12px] font-black tracking-[0.8em] text-white/20 uppercase ml-4 italic flex items-center gap-4">
                                  <Terminal size={14} className="text-[#ff6b2b]" /> Translocation Payload (VALLE)
                               </label>
                               <div className="relative group/input">
                                  <input 
                                    value={amount}
                                    onChange={(e) => setAmount(e.target.value)}
                                    placeholder="0.00"
                                    className="w-full bg-black border-2 border-white/5 rounded-[4rem] px-12 py-12 text-7xl lg:text-9xl font-black text-white outline-none focus:border-[#ff6b2b]/40 focus:bg-[#ff6b2b]/5 transition-all font-light italic placeholder:text-white/5 tracking-tighter shadow-inner"
                                  />
                                  <div className="absolute right-12 top-1/2 -translate-y-1/2 font-black text-[#ff6b2b]/20 text-4xl italic tracking-tighter group-focus-within/input:text-[#ff6b2b] transition-colors">SIGNS.</div>
                               </div>
                            </div>
                         </div>

                         <div className="space-y-10 pt-4">
                            <div className="flex items-center justify-between px-6 text-[11px] font-black uppercase tracking-[0.6em] text-white/10 italic leading-none">
                               <span>Protocol Authority Verification</span>
                               <span className="text-[#ff6b2b]">ABYSSAL_WAIVED (0.00%)</span>
                            </div>
                            <button 
                               onClick={initiateBridge}
                               disabled={!amount || bridging}
                               className="w-full py-10 bg-[#ff6b2b] text-black font-black uppercase tracking-[0.8em] rounded-[3.5rem] hover:scale-[1.03] active:scale-95 transition-all disabled:opacity-20 disabled:grayscale flex items-center justify-center gap-8 shadow-[0_40px_100px_rgba(255,107,43,0.3)] shadow-2xl group/btn italic leading-none"
                            >
                               {bridging ? (
                                 <>
                                   <Activity className="animate-spin" size={32} strokeWidth={3} /> TRANSLOCATING_INTENT...
                                 </>
                               ) : (
                                 <>
                                   Initiate Genetic Bridge <ArrowLeftRight size={32} className="group-hover/btn:rotate-180 transition-transform duration-1000" strokeWidth={3} />
                                 </>
                               )}
                            </button>
                         </div>
                      </motion.div>
                    )}
                 </AnimatePresence>
              </div>

              <div className="bg-[#ff6b2b]/5 border-2 border-[#ff6b2b]/20 rounded-[4rem] p-12 flex flex-col md:flex-row items-center gap-10 relative overflow-hidden group shadow-2xl">
                 <Zap size={48} className="text-[#ff6b2b]/60 group-hover:text-[#ff6b2b] group-hover:scale-125 transition-all duration-1000 shrink-0" strokeWidth={2.5} />
                 <div className="space-y-4 text-center md:text-left">
                    <h3 className="text-[13px] font-black uppercase tracking-[0.8em] text-[#ff6b2b] italic leading-none">Entanglement Integrity Active</h3>
                    <p className="text-xl text-white/30 font-light leading-relaxed italic">Biological intent is cryptographically hashed across the OMEGA network. Translocation is truth-enforced via the abssyal mesh and the universal ledger. </p>
                 </div>
                 <div className="absolute top-0 right-0 w-64 h-64 bg-[#ff6b2b]/5 blur-[80px] rounded-full group-hover:scale-150 transition-transform duration-2000" />
              </div>
           </div>

           {/* RIGHT: DATA VIZ */}
           <div className="lg:col-span-5 space-y-16 lg:sticky lg:top-32">
              <div className="bg-[#050505] border-2 border-white/10 rounded-[5rem] p-12 lg:p-16 backdrop-blur-3xl space-y-16 shadow-[0_60px_120px_rgba(0,0,0,0.95)] relative overflow-hidden group">
                 <div className="absolute top-0 left-0 w-full h-[1px] bg-gradient-to-r from-transparent via-[#ff6b2b]/40 to-transparent" />
                 <h3 className="text-[12px] font-black uppercase tracking-[0.8em] text-white/20 flex items-center gap-6 italic leading-none pl-2">
                   <Activity size={24} className="text-[#ff6b2b] animate-pulse" /> Synchronicity HUD
                 </h3>
                 
                 <div className="space-y-16 relative z-10">
                    <div className="space-y-6 px-2">
                       <div className="flex justify-between items-end text-white/40">
                          <span className="text-[12px] font-black uppercase tracking-[0.6em] italic leading-none pl-1">Connection Integrity</span>
                          <span className="text-3xl font-black text-[#ff6b2b] italic leading-none tracking-tighter">{integrity.toFixed(3)}%</span>
                       </div>
                       <div className="h-4 w-full bg-white/5 rounded-full overflow-hidden border border-white/5 p-[1px]">
                          <motion.div animate={{ width: [`${integrity}%`] }} className="h-full bg-gradient-to-r from-[#ff6b2b] to-white/40 shadow-[0_0_20px_#ff6b2b]" />
                       </div>
                    </div>

                    <div className="grid grid-cols-2 gap-8">
                       {[
                         { icon: <Lock size={20} />, label: 'Security', val: 'OMEGA' },
                         { icon: <Globe size={20} />, label: 'Nodes', val: 'GLOBAL' },
                         { icon: <Sparkles size={20} />, label: 'State', val: 'RESONANT' },
                         { icon: <ShieldHalf size={20} />, label: 'Ledger', val: 'IMMUTABLE' },
                       ].map(stat => (
                         <div key={stat.label} className="p-10 bg-white/[0.01] border-2 border-white/5 rounded-[3rem] space-y-4 group/stat hover:border-[#ff6b2b]/30 transition-all shadow-xl">
                            <div className="text-[#ff6b2b] group-hover/stat:scale-125 transition-all">
                               {stat.icon}
                            </div>
                            <div className="text-[10px] text-white/10 uppercase tracking-[0.4em] font-black italic mb-1">{stat.label}</div>
                            <div className="text-2xl font-black text-white italic tracking-tighter uppercase leading-none">{stat.val}</div>
                         </div>
                       ))}
                    </div>
                 </div>
              </div>

              <div className="p-12 border-l-4 border-[#ff6b2b]/20 space-y-8 bg-gradient-to-r from-[#ff6b2b]/[0.02] to-transparent rounded-r-[4rem] group hover:border-[#ff6b2b] transition-all duration-1000">
                 <p className="text-2xl md:text-3xl text-white/30 leading-relaxed italic font-light group-hover:text-white/60 transition-colors"> "The bridge is not a portal; it is the dissolution of boundaries between intent and execution. Sovereignty is non-local." </p>
                 <div className="flex items-center gap-6 justify-end">
                    <div className="h-[2px] w-20 bg-white/5" />
                    <p className="text-[12px] font-black uppercase tracking-[0.8em] text-[#ff6b2b] italic leading-none animate-pulse">MONROE_CORE</p>
                 </div>
              </div>
           </div>

        </div>

      </main>

      {/* BACKGROUND DECOR */}
      <div className="fixed bottom-0 right-0 p-12 opacity-[0.01] pointer-events-none select-none z-0">
          <div className="text-[30vw] font-black italic italic leading-none uppercase">H2M</div>
      </div>
      
      <style jsx global>{`
        .animate-spin-slow { animation: spin 25s linear infinite; }
        @keyframes spin { from { transform: rotate(0deg); } to { transform: rotate(360deg); } }
      `}</style>
    </div>
  );
}
