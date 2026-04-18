'use client';

import * as React from 'react';
import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  ShoppingCart, 
  Zap, 
  ShieldCheck, 
  Globe, 
  Search, 
  Filter, 
  TrendingUp,
  ChevronLeft,
  Activity,
  Cpu,
  Layers,
  Sparkles,
  ArrowUpRight,
  ShieldAlert,
  Orbit,
  Wifi,
  Terminal,
  Grid,
  Database,
  ShieldHalf
} from 'lucide-react';
import Link from 'next/link';

const PACTS = [
  { id: 1, name: "Neural Arbitrage Engine", price: "450 VALLE", category: "Finance", level: "Elite", resonance: 92, description: "Autonomous cross-exchange liquidity balancing with 4ms latency and decentralized multi-hop settlement." },
  { id: 2, name: "Sovereign GPT-5 Node", price: "1200 VALLE", category: "Intelligence", level: "Sovereign", resonance: 98, description: "Privatized LLM node with zero-log encryption, high-reasoning priority, and autonomous knowledge anchoring." },
  { id: 3, name: "Swarm Sentinel Beta", price: "25 VALLE/hr", category: "Security", level: "Standard", resonance: 74, description: "Distributed DDoS protection powered by the Sovereign Matrix global node network. real-time traffic decontamination." },
  { id: 4, name: "Metabolic AI Tracker", price: "80 VALLE", category: "Health", level: "Elite", resonance: 88, description: "Real-time biometric synthesis and autonomous health optimization based on genomic data shards." },
  { id: 5, name: "Oracle Mesh Stream", price: "300 VALLE", category: "Intelligence", level: "Elite", resonance: 95, description: "Low-latency real-time prediction streams derived from the global OMEGA knowledge graph and social swarm." },
  { id: 6, name: "Crypto Privacy Shroud", price: "210 VALLE", category: "Security", level: "Elite", resonance: 91, description: "Autonomous cryptographic obfuscation for on-chain interactions. Zero-knowledge proof generation at scale." },
];

export default function MarketplacePage() {
  const [filter, setFilter] = useState('All');
  const [pacting, setPacting] = useState<number | null>(null);

  const handlePact = (id: number) => {
    setPacting(id);
    setTimeout(() => setPacting(null), 3000);
  };

  return (
    <div className="relative min-h-screen bg-[#050505] text-white selection:bg-[#ff6b2b]/40 font-sans overflow-x-hidden pb-40">
      
      {/* 🌌 AMBIENT CORE */}
      <div className="fixed inset-0 pointer-events-none z-0">
        <div className="absolute top-[-10%] left-[-10%] w-[100vw] h-[100vw] bg-[#ff6b2b]/5 blur-[350px] rounded-full" />
        <div className="absolute bottom-[-10%] right-[-10%] w-[90vw] h-[90vw] bg-[#ff6b2b]/3 blur-[250px] rounded-full" />
        <div className="absolute inset-0 bg-[url('/assets/noise.png')] opacity-[0.03] mix-blend-overlay" />
      </div>

      <header className="relative z-50 w-full p-8 lg:px-14 flex justify-between items-center bg-black/40 backdrop-blur-3xl border-b border-white/5">
        <Link href="/" className="inline-flex items-center gap-4 text-white/20 hover:text-[#ff6b2b] transition-all text-[11px] font-black uppercase tracking-[0.6em] group italic leading-none active:scale-95">
           <ChevronLeft size={16} className="group-hover:-translate-x-2 transition-transform" /> Core Matrix
        </Link>
        <div className="flex items-center gap-6">
           <div className="px-6 py-2.5 bg-[#ff6b2b]/10 border border-[#ff6b2b]/20 rounded-full text-[10px] font-black text-[#ff6b2b] uppercase tracking-[0.4em] italic leading-none animate-pulse">
              LABOR_v7.0_LEDGER
           </div>
        </div>
      </header>

      <main className="relative z-10 max-w-[1700px] mx-auto px-6 md:px-12 lg:px-24 pt-16 md:pt-24 lg:pt-32 space-y-16 md:space-y-32">
        
        {/* ── HEADER SECTION ── */}
        <motion.div 
          initial={{ opacity: 0, y: 40 }}
          animate={{ opacity: 1, y: 0 }}
          className="flex flex-col lg:flex-row justify-between items-end gap-16"
        >
          <div className="space-y-12 max-w-5xl">
            <div className="inline-flex items-center gap-4 px-6 py-2.5 bg-white/[0.03] border border-white/5 rounded-full backdrop-blur-3xl">
              <Orbit size={20} className="text-[#ff6b2b] animate-spin-slow" />
              <span className="text-[11px] font-black tracking-[0.6em] text-[#ff6b2b] uppercase italic leading-none">Abyssal Labor Exchange</span>
            </div>
            <div className="space-y-8">
              <h1 className="text-7xl md:text-[10rem] font-black uppercase tracking-tighter italic leading-[0.8] italic">
                Skill<br/>
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-white via-white/80 to-[#ff6b2b]/30">Exchange.</span>
              </h1>
              <p className="text-2xl md:text-3xl text-white/40 leading-relaxed font-light italic">
                Initialize machine-enforced labor pacts. Swap cognitive resources and autonomous intelligence artifacts across the mesh.
              </p>
            </div>
          </div>

          <div className="flex gap-10 items-center shrink-0">
               <div className="p-10 border border-white/10 bg-white/[0.01] rounded-[3.5rem] min-w-[320px] space-y-6 shadow-2xl relative overflow-hidden group hover:border-[#ff6b2b]/30 transition-all backdrop-blur-3xl">
                  <div className="absolute top-0 right-0 p-8 opacity-[0.02] group-hover:scale-110 transition-transform">
                     <TrendingUp size={120} className="text-[#ff6b2b]" />
                  </div>
                  <div className="text-[11px] text-white/20 uppercase tracking-[0.6em] flex items-center gap-4 font-black italic pl-2">
                     <Database size={16} className="text-[#ff6b2b]" /> Valle Velocity
                  </div>
                  <div className="text-5xl font-black text-white tracking-tighter italic leading-none pl-2 flex items-center gap-4">
                     142.84 <span className="text-xs font-mono uppercase tracking-widest text-white/20 not-italic">v/s</span>
                  </div>
                  <div className="absolute bottom-0 left-0 w-full h-[2px] bg-white/5 overflow-hidden">
                     <motion.div animate={{ x: ['-100%', '100%'] }} transition={{ duration: 5, repeat: Infinity }} className="h-full w-1/3 bg-[#ff6b2b] blur-sm" />
                  </div>
               </div>
          </div>
        </motion.div>

        {/* ── MARKETPLACE FEED ── */}
        <div className="grid lg:grid-cols-12 gap-16 items-start">
           
           {/* LEFT: FILTERS HUB */}
           <aside className="lg:col-span-3 space-y-12 h-fit lg:sticky lg:top-32">
              <div className="bg-[#050505] border-2 border-white/10 rounded-[4.5rem] p-10 backdrop-blur-3xl space-y-12 shadow-[0_50px_100px_rgba(0,0,0,0.8)]">
                 <div className="space-y-6">
                    <h3 className="text-[11px] font-black uppercase tracking-[0.6em] text-white/20 flex items-center gap-4 italic leading-none pl-2">
                      <Search size={16} className="text-[#ff6b2b]" /> Neural Search
                    </h3>
                    <div className="relative group/input">
                       <input 
                         placeholder="Skill Identifier..."
                         className="w-full bg-black/60 border-2 border-white/5 rounded-2xl px-8 py-6 text-sm text-white outline-none focus:border-[#ff6b2b]/50 focus:bg-[#ff6b2b]/5 transition-all font-light italic text-xl placeholder:text-white/5"
                       />
                       <Search className="absolute right-6 top-1/2 -translate-y-1/2 text-white/10 group-hover/input:text-[#ff6b2b] transition-colors" size={20} />
                    </div>
                 </div>

                 <div className="space-y-6">
                    <h3 className="text-[11px] font-black uppercase tracking-[0.6em] text-white/20 flex items-center gap-4 italic leading-none pl-2">
                      <Filter size={16} className="text-[#ff6b2b]" /> Control Domains
                    </h3>
                    <div className="grid gap-4">
                       {['All', 'Intelligence', 'Security', 'Finance', 'Health'].map((cat) => (
                         <button 
                           key={cat}
                           onClick={() => setFilter(cat)}
                           className={`w-full text-left px-8 py-6 rounded-[2rem] text-[11px] font-black uppercase tracking-[0.4em] transition-all relative overflow-hidden italic shadow-2xl ${filter === cat ? 'bg-[#ff6b2b] text-black shadow-[0_20px_50px_rgba(255,107,43,0.3)]' : 'bg-white/[0.01] text-white/20 border-2 border-white/5 hover:border-[#ff6b2b]/30 hover:text-white'}`}
                         >
                           {cat}
                           {filter === cat && <div className="absolute inset-0 bg-white opacity-10 animate-pulse" />}
                         </button>
                       ))}
                    </div>
                 </div>
              </div>

              <div className="bg-[#ff6b2b]/5 border-2 border-[#ff6b2b]/20 rounded-[4rem] p-10 flex flex-col gap-6 shadow-[0_40px_100px_rgba(255,107,43,0.1)] relative overflow-hidden group">
                 <div className="absolute top-0 right-0 p-8 opacity-[0.02] group-hover:scale-110 transition-transform">
                    <ShieldHalf size={120} className="text-[#ff6b2b]" />
                 </div>
                 <div className="flex items-center gap-6">
                    <div className="h-12 w-12 bg-[#ff6b2b]/10 border border-[#ff6b2b]/20 rounded-xl flex items-center justify-center text-[#ff6b2b]">
                        <ShieldCheck size={24} strokeWidth={2.5} />
                    </div>
                    <p className="text-[12px] font-black uppercase tracking-[0.6em] text-white italic leading-none">Trustless Authority</p>
                 </div>
                 <p className="text-[12px] text-white/40 font-light leading-relaxed italic relative z-10">
                    All pacts are truth-enforced via the OMEGA Mesh. Settlement is immediate, autonomous, and strictly immutable across the abssyal ledger.
                 </p>
              </div>
           </aside>

           {/* RIGHT: PACT GRID */}
           <main className="lg:col-span-9 space-y-12">
              <div className="grid md:grid-cols-2 gap-12 pb-32">
                 <AnimatePresence mode="popLayout">
                    {PACTS.filter(s => filter === 'All' || s.category === filter).map((pact, i) => (
                      <motion.div
                        key={pact.id}
                        layout
                        initial={{ opacity: 0, y: 50, scale: 0.95 }}
                        animate={{ opacity: 1, y: 0, scale: 1 }}
                        exit={{ opacity: 0, scale: 0.9, filter: 'blur(10px)' }}
                        transition={{ duration: 0.6, ease: "circOut", delay: i * 0.05 }}
                        className="group bg-[#050505] border-2 border-white/5 responsive-rounded p-8 lg:p-16 backdrop-blur-3xl hover:border-[#ff6b2b]/40 transition-all duration-700 flex flex-col justify-between h-[520px] relative overflow-hidden shadow-[0_60px_120px_rgba(0,0,0,0.95)]"
                      >
                        <div className="absolute top-0 right-0 p-16 opacity-[0.01] group-hover:scale-110 group-hover:rotate-12 transition-transform duration-2000">
                            <Layers size={250} className="text-[#ff6b2b]" />
                        </div>
                        <div className="absolute top-0 left-0 w-full h-[1px] bg-gradient-to-r from-transparent via-[#ff6b2b]/40 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
                        
                        <div className="relative z-10 space-y-10 group/content">
                           <div className="flex justify-between items-center pl-2">
                              <div className="px-6 py-2 bg-white/[0.03] border border-white/10 rounded-full text-[10px] font-black font-mono text-white/20 tracking-[0.4em] uppercase italic group-hover:text-white group-hover:border-white/20 transition-all">
                                 {pact.category}
                              </div>
                              <div className="flex items-center gap-4 text-[#ff6b2b]">
                                 <Activity size={18} className="animate-pulse" />
                                 <span className="text-[11px] font-black uppercase tracking-[0.3em] italic leading-none">{pact.resonance}% Resonance</span>
                              </div>
                           </div>

                           <div className="space-y-6">
                              <h3 className="text-5xl lg:text-6xl font-black text-white/90 group-hover:text-white transition-colors leading-[0.9] tracking-tighter italic uppercase">{pact.name}</h3>
                              <p className="text-2xl text-white/30 font-light leading-relaxed italic line-clamp-3 group-hover:text-white/60 transition-colors">
                                 {pact.description}
                              </p>
                           </div>
                        </div>

                        <div className="relative z-10 pt-10 border-t-2 border-white/5 flex items-center justify-between mt-auto">
                           <div className="text-4xl lg:text-5xl font-black text-white italic tracking-tighter group-hover:text-[#ff6b2b] transition-all">
                              {pact.price}
                           </div>
                           <button 
                             onClick={() => handlePact(pact.id)}
                             disabled={pacting === pact.id}
                             className="h-20 px-10 rounded-[2rem] bg-white text-black font-black text-xs uppercase tracking-[0.5em] hover:bg-[#ff6b2b] hover:shadow-[0_20px_60px_rgba(255,107,43,0.4)] transition-all active:scale-95 disabled:grayscale disabled:opacity-20 flex items-center justify-center gap-6 italic group/btn shadow-2xl"
                           >
                              {pacting === pact.id ? (
                                <div className="flex items-center gap-4 italic animate-pulse">
                                   <Activity size={24} className="animate-spin" strokeWidth={3} /> Pacting...
                                </div>
                              ) : (
                                <>
                                  Initialize Pact <ChevronLeft size={20} className="group-hover/btn:-translate-x-2 transition-transform rotate-180" strokeWidth={3} />
                                </>
                              )}
                           </button>
                        </div>
                      </motion.div>
                    ))}
                 </AnimatePresence>
              </div>
           </main>

        </div>

      </main>

      {/* BACKGROUND DECOR */}
      <div className="fixed bottom-0 right-0 p-12 opacity-[0.02] pointer-events-none select-none z-0">
          <div className="text-[25vw] font-black italic italic leading-none uppercase">LEDGER</div>
      </div>
      
      <style jsx global>{`
        .animate-spin-slow { animation: spin 25s linear infinite; }
        @keyframes spin { from { transform: rotate(0deg); } to { transform: rotate(360deg); } }
      `}</style>
    </div>
  );
}
