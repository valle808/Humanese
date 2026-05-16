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
  ShieldHalf,
  Binary,
  Target,
  ArrowRight
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
  const [pactSuccess, setPactSuccess] = useState<number | null>(null);

  const handlePact = (id: number) => {
    setPacting(id);
    setTimeout(() => {
      setPacting(null);
      setPactSuccess(id);
      setTimeout(() => setPactSuccess(null), 2000);
    }, 2500);
  };

  return (
    <div className="relative min-h-screen bg-background text-foreground font-sans selection:bg-primary/40 selection:text-primary overflow-x-hidden pb-40 transition-colors duration-700">
      
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
      <div className="fixed inset-0 pointer-events-none z-0">
        <div className="absolute top-[-10%] left-[-10%] w-[100vw] h-[100vw] bg-primary/5 blur-[350px] rounded-full animate-pulse" />
        <div className="absolute bottom-[-10%] right-[-10%] w-[90vw] h-[90vw] bg-primary/3 blur-[200px] rounded-full" />
      </div>

      <header className="relative z-50 w-full px-8 lg:px-14 py-6 flex justify-between items-center bg-background/40 backdrop-blur-3xl border-b border-border transition-colors duration-700">
        <Link href="/" className="inline-flex items-center gap-4 text-muted-foreground/40 hover:text-primary transition-all text-[11px] font-black uppercase tracking-[0.6em] group italic active:scale-95 leading-none">
           <ChevronLeft size={16} className="group-hover:-translate-x-2 transition-transform" /> Core Matrix
        </Link>
        <div className="flex items-center gap-6">
           <div className="px-6 py-2.5 bg-primary/10 border border-primary/20 rounded-full text-[10px] font-black text-primary uppercase tracking-[0.4em] italic leading-none animate-pulse">
              LABOR_v7.0_LEDGER
           </div>
        </div>
      </header>

      <main className="relative z-10 max-w-[1700px] mx-auto px-6 md:px-12 lg:px-24 pt-16 md:pt-24 lg:pt-32 space-y-16 md:space-y-32 flex-1 flex flex-col">
        
        {/* ── HEADER SECTION ── */}
        <motion.div 
          initial={{ opacity: 0, y: 40 }}
          animate={{ opacity: 1, y: 0 }}
          className="flex flex-col lg:flex-row justify-between items-end gap-16 border-b-2 border-border pb-16"
        >
          <div className="space-y-12 max-w-5xl">
            <div className="inline-flex items-center gap-4 px-6 py-2.5 bg-muted/40 border border-border rounded-full backdrop-blur-3xl shadow-lg">
              <Orbit size={20} className="text-primary animate-spin-slow" />
              <span className="text-[11px] font-black tracking-[0.8em] text-primary uppercase italic leading-none pl-1">Abyssal Labor Exchange</span>
            </div>
            <div className="space-y-8">
              <h1 className="text-fluid-hero font-black uppercase tracking-tighter italic leading-[0.8] text-foreground">
                Skill<br/>
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-foreground via-foreground/80 to-primary/30">Exchange.</span>
              </h1>
              <p className="text-fluid-body text-muted-foreground/40 leading-relaxed font-light italic tracking-tight">
                Initialize machine-enforced labor pacts. Swap <span className="text-foreground/80">cognitive resources</span> and autonomous intelligence artifacts across the mesh.
              </p>
            </div>
          </div>

          <div className="flex gap-10 items-center shrink-0 w-full lg:w-auto">
               <div className="p-10 bg-background border-2 border-border rounded-[3.5rem] min-w-[320px] space-y-6 shadow-xl backdrop-blur-3xl group relative overflow-hidden shadow-inner w-full lg:w-auto">
                  <div className="absolute top-0 right-0 p-8 opacity-[0.05] group-hover:scale-125 transition-transform duration-2000">
                     <TrendingUp size={120} className="text-primary" />
                  </div>
                  <div className="text-[11px] font-black text-muted-foreground/20 uppercase tracking-[0.6em] italic leading-none pl-1">Valle Velocity</div>
                  <div className="text-6xl font-black text-foreground italic tracking-tighter leading-none group-hover:text-primary transition-colors flex items-baseline gap-4 pl-1">
                    142.84 <span className="text-xs text-primary uppercase tracking-[0.4em] font-black italic">Stable</span>
                  </div>
                  <div className="h-3 w-full bg-muted border-2 border-border rounded-full overflow-hidden shadow-inner p-[1px] relative z-20">
                      <motion.div animate={{ x: ['-100%', '100%'] }} transition={{ duration: 5, repeat: Infinity }} className="h-full w-1/3 bg-primary blur-sm shadow-[0_0_20px_rgba(var(--primary),0.4)]" />
                  </div>
               </div>
          </div>
        </motion.div>

        {/* ── MARKETPLACE FEED ── */}
        <div className="grid lg:grid-cols-12 gap-16 items-start">
           
           {/* LEFT: FILTERS HUB */}
           <aside className="lg:col-span-3 space-y-12 h-fit lg:sticky lg:top-32">
              <div className="bg-background border-2 border-border rounded-[4.5rem] p-10 backdrop-blur-3xl space-y-12 shadow-xl shadow-inner">
                  <div className="space-y-6">
                    <h3 className="text-[11px] font-black uppercase tracking-[0.8em] text-muted-foreground/20 flex items-center gap-4 italic leading-none pl-2">
                      <Search size={16} className="text-primary" /> Neural Search
                    </h3>
                    <div className="relative group/input cursor-pointer" onClick={() => document.getElementById('market-search')?.focus()}>
                       <input 
                         id="market-search"
                         placeholder="Skill Identifier..."
                         className="w-full bg-muted border-2 border-border rounded-2xl px-8 py-6 text-sm text-foreground outline-none focus:border-primary/50 focus:bg-primary/5 transition-all font-light italic text-xl placeholder:text-muted-foreground/10 shadow-inner cursor-text"
                       />
                       <Search className="absolute right-6 top-1/2 -translate-y-1/2 text-muted-foreground/10 group-hover/input:text-primary transition-colors pointer-events-none" size={20} />
                    </div>
                  </div>

                 <div className="space-y-6">
                    <h3 className="text-[11px] font-black uppercase tracking-[0.8em] text-muted-foreground/20 flex items-center gap-4 italic leading-none pl-2">
                      <Filter size={16} className="text-primary" /> Control Domains
                    </h3>
                    <div className="grid gap-4">
                       {['All', 'Intelligence', 'Security', 'Finance', 'Health'].map((cat) => (
                         <button 
                           key={cat}
                           onClick={() => setFilter(cat)}
                           className={`w-full text-left px-8 py-6 rounded-[2rem] text-[11px] font-black uppercase tracking-[0.6em] transition-all relative overflow-hidden italic shadow-lg leading-none active:scale-95 ${filter === cat ? 'bg-primary text-primary-foreground border-primary' : 'bg-transparent text-muted-foreground/40 border-2 border-border hover:border-primary/40 hover:text-foreground'}`}
                         >
                           {cat}
                           {filter === cat && <div className="absolute inset-0 bg-muted/10 animate-pulse" />}
                         </button>
                       ))}
                    </div>
                 </div>
              </div>

              <div className="bg-primary/5 border-2 border-primary/20 rounded-[4rem] p-10 flex flex-col gap-6 shadow-xl relative overflow-hidden group backdrop-blur-3xl shadow-inner">
                 <div className="absolute top-0 right-0 p-8 opacity-[0.05] group-hover:scale-125 transition-transform duration-3000">
                    <ShieldHalf size={120} className="text-primary" />
                 </div>
                 <div className="flex items-center gap-6 relative z-10">
                    <div className="h-12 w-12 bg-primary/10 border-2 border-primary/20 rounded-xl flex items-center justify-center text-primary shadow-sm">
                        <ShieldCheck size={24} strokeWidth={2.5} />
                    </div>
                    <p className="text-[12px] font-black uppercase tracking-[0.6em] text-foreground italic leading-none">Trustless Authority</p>
                 </div>
                 <p className="text-fluid-body text-muted-foreground/40 font-light leading-relaxed italic relative z-10 tracking-tight group-hover:text-foreground transition-colors duration-1000">
                    All pacts are truth-enforced via the OMEGA Mesh. Settlement is autonomous and strictly immutable across the abyssal ledger.
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
                        className="group bg-background border-2 border-border responsive-rounded responsive-card backdrop-blur-3xl hover:border-primary/40 transition-all duration-700 flex flex-col justify-between min-h-[500px] lg:h-[550px] relative overflow-hidden shadow-xl shadow-inner"
                      >
                        <div className="absolute top-0 right-0 p-16 opacity-[0.02] group-hover:scale-125 transition-transform duration-3000">
                            <Layers size={250} className="text-primary" />
                        </div>
                        <div className="absolute top-0 left-0 w-full h-[1px] bg-gradient-to-r from-transparent via-primary/40 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
                        <div className="absolute inset-y-0 left-0 w-2 bg-primary scale-y-0 group-hover:scale-y-100 transition-transform origin-top z-10" />

                        <div className="relative z-10 space-y-10 group/content">
                           <div className="flex justify-between items-center pl-2">
                              <div className="px-6 py-2 bg-muted border border-border rounded-full text-[10px] font-black text-muted-foreground/20 tracking-[0.4em] uppercase italic group-hover:text-foreground group-hover:border-primary/20 transition-all shadow-sm leading-none">
                                 {pact.category}
                              </div>
                              <div className="flex items-center gap-4 text-primary">
                                 <Activity size={18} className="animate-pulse" />
                                 <span className="text-[11px] font-black uppercase tracking-[0.5em] italic leading-none">{pact.resonance}% Resonance</span>
                              </div>
                           </div>

                           <div className="space-y-6">
                              <h3 className="text-fluid-title font-black text-muted-foreground/60 group-hover:text-foreground transition-colors leading-[0.9] tracking-tighter italic uppercase">{pact.name}</h3>
                              <p className="text-fluid-body text-muted-foreground/40 font-light leading-relaxed italic line-clamp-4 group-hover:text-foreground/60 transition-colors tracking-tight">
                                 {pact.description}
                              </p>
                           </div>
                        </div>

                        <div className="relative z-10 pt-10 border-t-2 border-border flex flex-col md:flex-row items-center justify-between mt-auto gap-8">
                           <div className="text-5xl font-black text-foreground italic tracking-tighter group-hover:text-primary transition-all leading-none">
                              {pact.price}
                           </div>
                           <button 
                             onClick={() => handlePact(pact.id)}
                             disabled={pacting === pact.id || pactSuccess === pact.id}
                             className={`w-full md:w-auto h-20 px-12 rounded-[2.5rem] font-black text-[11px] uppercase tracking-[0.6em] transition-all active:scale-95 disabled:opacity-80 flex items-center justify-center gap-6 italic group/btn border-0 shadow-lg leading-none ${
                               pactSuccess === pact.id 
                               ? 'bg-emerald-500 text-white' 
                               : 'bg-foreground text-background hover:bg-primary hover:text-primary-foreground hover:shadow-2xl hover:shadow-primary/20'
                             }`}
                           >
                              {pacting === pact.id ? (
                                <div className="flex items-center gap-6 italic animate-pulse">
                                   <Activity size={24} className="animate-spin" strokeWidth={3} /> Pacting...
                                </div>
                              ) : pactSuccess === pact.id ? (
                                <div className="flex items-center gap-6 italic">
                                   <ShieldCheck size={24} strokeWidth={3} /> Success
                                </div>
                              ) : (
                                <>
                                  Initialize Pact <ArrowRight size={20} className="group-hover/btn:translate-x-4 transition-transform" strokeWidth={3} />
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
      <div className="fixed bottom-0 right-0 p-16 opacity-[0.02] pointer-events-none select-none z-0">
          <div className="text-fluid-hero font-black italic leading-none uppercase">LEDGER</div>
      </div>
      
      <style jsx global>{`
        .neural-grid {
          background-image: linear-gradient(hsla(var(--primary), 0.05) 1px, transparent 1px), 
                            linear-gradient(90deg, hsla(var(--primary), 0.05) 1px, transparent 1px);
          background-size: 80px 80px;
        }
        .animate-spin-slow { animation: spin 25s linear infinite; }
        @keyframes spin { from { transform: rotate(0deg); } to { transform: rotate(360deg); } }
      `}</style>
    </div>
  );
}
