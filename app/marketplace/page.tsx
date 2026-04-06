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
  ShieldAlert
} from 'lucide-react';
import Link from 'next/link';

const PACTS = [
  { id: 1, name: "Neural Arbitrage Engine", price: "450 VALLE", category: "Finance", level: "Elite", resonance: 92, description: "Autonomous cross-exchange liquidity balancing with 4ms latency." },
  { id: 2, name: "Sovereign GPT-5 Node", price: "1200 VALLE", category: "Intelligence", level: "Sovereign", resonance: 98, description: "Privatized LLM node with zero-log encryption and high-reasoning priority." },
  { id: 3, name: "Swarm Sentinel Beta", price: "25 VALLE/hr", category: "Security", level: "Standard", resonance: 74, description: "Distributed DDoS protection powered by the Sovereign Matrix global node network." },
  { id: 4, name: "Metabolic AI Tracker", price: "80 VALLE", category: "Health", level: "Elite", resonance: 88, description: "Real-time biometric synthesis and autonomous health optimization." },
];

export default function MarketplacePage() {
  const [filter, setFilter] = useState('All');
  const [pacting, setPacting] = useState<number | null>(null);

  const handlePact = (id: number) => {
    setPacting(id);
    setTimeout(() => setPacting(null), 3000);
  };

  return (
    <div className="relative min-h-screen bg-[#050505] text-white selection:bg-[#00ffc3]/20 font-sans p-4 lg:p-12 overflow-x-hidden flex flex-col">
      
      {/* Background Depth Engine */}
      <div className="fixed inset-0 pointer-events-none z-0">
        <div className="absolute top-[-20%] right-[-10%] w-[100vw] h-[100vw] bg-[#00ffc3]/3 blur-[200px] rounded-full" />
        <div className="absolute bottom-[-20%] left-[-10%] w-[100vw] h-[100vw] bg-[#7000ff]/3 blur-[200px] rounded-full" />
      </div>

      <main className="relative z-10 max-w-[1400px] mx-auto w-full flex-1 flex flex-col space-y-16">
        
        {/* HEADER SECTION */}
        <header className="flex flex-col lg:flex-row justify-between items-start lg:items-end gap-8">
           <div className="space-y-4">
              <Link href="/" className="inline-flex items-center gap-2 text-white/30 hover:text-[#00ffc3] transition-colors text-[10px] font-black uppercase tracking-widest mb-2 group">
                 Root Matrix <ChevronLeft size={14} className="group-hover:-translate-x-1 transition-transform" />
              </Link>
              <h1 className="text-5xl lg:text-7xl font-black uppercase tracking-tighter italic leading-none">
                Skill <span className="text-transparent bg-clip-text bg-gradient-to-r from-white to-white/30">Exchange.</span>
              </h1>
              <p className="text-xs text-white/20 font-mono uppercase tracking-[0.3em]">Decentralized Machine Pacts // ABYSSAL COMMERCE</p>
           </div>
           
           <div className="flex gap-4">
              <div className="bg-white/[0.02] border border-white/5 p-6 rounded-3xl backdrop-blur-3xl min-w-[200px] space-y-3 relative overflow-hidden group">
                 <div className="text-[10px] text-white/20 uppercase tracking-widest flex items-center gap-2">
                    <TrendingUp size={12} className="text-[#00ffc3]" /> Valle Velocity
                 </div>
                 <div className="text-2xl font-black text-white tracking-tighter italic group-hover:scale-105 transition-transform">142.84 v/s</div>
              </div>
           </div>
        </header>

        {/* MARKETPLACE FEED */}
        <div className="grid lg:grid-cols-12 gap-12 items-start">
           
           {/* LEFT: FILTERS HUB - 3 COLS */}
           <aside className="lg:col-span-3 space-y-8 h-fit lg:sticky lg:top-12">
              <div className="bg-white/[0.02] border border-white/5 rounded-[2.5rem] p-8 backdrop-blur-3xl space-y-8">
                 <div className="space-y-4">
                    <h3 className="text-[10px] font-black uppercase tracking-[0.4em] text-white/20 flex items-center gap-3 italic">
                      <Search size={14} /> Neural Search
                    </h3>
                    <div className="relative group">
                       <input 
                         placeholder="Skill Identifier..."
                         className="w-full bg-white/[0.03] border border-white/10 rounded-2xl px-5 py-4 text-xs text-white outline-none focus:border-[#00ffc3]/40 transition-all font-mono"
                       />
                       <Search className="absolute right-4 top-1/2 -translate-y-1/2 text-white/10 group-hover:text-[#00ffc3] transition-colors" size={14} />
                    </div>
                 </div>

                 <div className="space-y-4">
                    <h3 className="text-[10px] font-black uppercase tracking-[0.4em] text-white/20 flex items-center gap-3 italic">
                      <Filter size={14} /> Domains
                    </h3>
                    <div className="grid gap-2">
                       {['All', 'Intelligence', 'Security', 'Finance', 'Health'].map((cat) => (
                         <button 
                           key={cat}
                           onClick={() => setFilter(cat)}
                           className={`w-full text-left px-5 py-4 rounded-2xl text-[10px] font-black uppercase tracking-widest transition-all ${filter === cat ? 'bg-[#00ffc3] text-black italic' : 'bg-white/[0.02] text-white/20 border border-white/5 hover:border-white/20 hover:text-white'}`}
                         >
                           {cat}
                         </button>
                       ))}
                    </div>
                 </div>
              </div>

              <div className="bg-[#00ffc3]/5 border border-[#00ffc3]/20 rounded-[2.5rem] p-8 flex items-start gap-4 shadow-2xl">
                 <ShieldCheck size={20} className="text-[#00ffc3] mt-1 shrink-0" />
                 <div className="space-y-1">
                    <p className="text-[9px] font-black uppercase tracking-widest text-white">Trustless Authority</p>
                    <p className="text-[10px] text-white/30 font-light leading-relaxed">All pacts are truth-enforced via the OMEGA Mesh. Settlement is immediate and immutable.</p>
                 </div>
              </div>
           </aside>

           {/* RIGHT: PACT GRID - 9 COLS */}
           <main className="lg:col-span-9 space-y-8">
              <div className="grid md:grid-cols-2 gap-8 pb-32">
                 <AnimatePresence mode="popLayout">
                   {PACTS.filter(s => filter === 'All' || s.category === filter).map((pact, i) => (
                     <motion.div
                       key={pact.id}
                       layout
                       initial={{ opacity: 0, y: 30 }}
                       animate={{ opacity: 1, y: 0 }}
                       exit={{ opacity: 0, scale: 0.95 }}
                       transition={{ delay: i * 0.1 }}
                       className="group bg-white/[0.02] border border-white/10 rounded-[3rem] p-10 backdrop-blur-3xl hover:border-white/20 transition-all flex flex-col justify-between h-[450px] relative overflow-hidden"
                     >
                       {/* DEPTH EFFECT */}
                       <div className="absolute inset-0 bg-gradient-to-br from-white/[0.03] to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
                       
                       <div className="relative z-10 space-y-6">
                          <div className="flex justify-between items-start">
                             <div className="px-4 py-1.5 bg-black/40 border border-white/5 rounded-full text-[9px] font-black font-mono text-white/20 tracking-widest uppercase italic">
                                {pact.category}
                             </div>
                             <div className="flex items-center gap-2 text-[#00ffc3]">
                                <Activity size={14} className="animate-pulse" />
                                <span className="text-[10px] font-black font-mono tracking-tighter italic">{pact.resonance}% Resonance</span>
                             </div>
                          </div>

                          <div className="space-y-3">
                             <h3 className="text-3xl font-black text-white group-hover:text-[#00ffc3] transition-colors leading-none tracking-tighter italic uppercase">{pact.name}</h3>
                             <p className="text-sm font-light text-white/40 leading-relaxed italic line-clamp-3">
                                {pact.description}
                             </p>
                          </div>
                       </div>

                       <div className="relative z-10 pt-8 border-t border-white/10 flex items-center justify-between mt-auto">
                          <div className="text-3xl font-black text-white tracking-widest italic group-hover:scale-105 transition-transform">
                             {pact.price}
                          </div>
                          <button 
                            onClick={() => handlePact(pact.id)}
                            disabled={pacting === pact.id}
                            className="bg-white text-black px-8 py-4 rounded-2xl font-black text-[10px] uppercase tracking-widest hover:bg-[#00ffc3] hover:shadow-[0_0_40px_rgba(0,255,195,0.3)] transition-all active:scale-95 disabled:grayscale"
                          >
                             {pacting === pact.id ? (
                               <div className="flex items-center gap-2 italic">
                                  <Sparkles size={14} className="animate-spin" /> Pacting...
                               </div>
                             ) : (
                               "Initialize Pact"
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

    </div>
  );
}
