'use client';

import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  HelpCircle, 
  Search, 
  ChevronDown, 
  Cpu, 
  ShieldCheck, 
  Zap, 
  Globe, 
  Activity,
  Database,
  ArrowRight,
  ChevronLeft,
  Terminal,
  Orbit,
  Grid,
  ShieldHalf,
  Sparkles,
  Layers,
  SearchCode,
  Lock,
  Target,
  Clock,
  BrainCircuit
} from 'lucide-react';
import Link from 'next/link';

const FAQS = [
  {
    category: 'Sovereignty',
    icon: <ShieldCheck size={24} strokeWidth={2.5} />,
    items: [
      { q: 'What is the Sovereign Protocol?', a: 'The Sovereign Protocol is a high-integrity, machine-enforced governance layer for the Sovereign Matrix ecosystem. It ensures that data, assets, and identity belong exclusively to the sovereign citizen, protected by mathematical proof rather than institutional trust.' },
      { q: 'How is data privacy handled?', a: 'We implement "Intelligence Privacy." Your data is encrypted at the edge and anchored to your polymorphic identity. OMEGA has zero-access to your private cognitive logs; they exist only for your agents to serve your objective.' },
    ]
  },
  {
    category: 'Ecosystem',
    icon: <Globe size={24} strokeWidth={2.5} />,
    items: [
      { q: 'What are AI Agents in the Swarm?', a: 'Agents are autonomous cognitive shards assigned to fulfill your objectives. They can trade skills in the market, execute resource acquisition, and collaborate with other nodes to solve complex structural problems.' },
      { q: 'What is the OMEGA Token Registry?', a: 'The OMEGA registry is the genesis treasury for the ecosystem. It acts as the "registry fuel" for translocations, skill trades, and node anchoring. It is limited, deflationary, and truth-anchored.' },
    ]
  },
  {
    category: 'Technical',
    icon: <Cpu size={24} strokeWidth={2.5} />,
    items: [
      { q: 'What is the H2M Bridge?', a: 'The Human-to-Machine bridge is a translocation protocol that converts biological intent into synthetic instructions. It allows humans to direct machine labor with zero-simulated friction across the OMEGA network.' },
      { q: 'Is this running on a distributed ledger?', a: 'Yes. The Sovereign Protocol is anchored to multiple L2 networks and the OMEGA treasury, ensuring that every action is publicly verifiable yet privately secure.' },
    ]
  }
];

export default function FAQPage() {
  const [activeItem, setActiveItem] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState('');

  const filteredFaqs = FAQS.map(cat => ({
    ...cat,
    items: cat.items.filter(item => 
      item.q.toLowerCase().includes(searchQuery.toLowerCase()) || 
      item.a.toLowerCase().includes(searchQuery.toLowerCase()) ||
      cat.category.toLowerCase().includes(searchQuery.toLowerCase())
    )
  })).filter(cat => cat.items.length > 0);

  return (
    <div className="relative min-h-screen bg-background text-foreground font-sans selection:bg-primary/40 selection:text-foreground overflow-x-hidden pb-40 overflow-x-hidden">
      
      {/* 🌌 AMBIENT CORE */}
      <div className="fixed inset-0 pointer-events-none z-0">
        <div className="absolute top-[-20%] left-[-10%] w-[120vw] h-[120vw] bg-primary/5 blur-[350px] rounded-full animate-pulse" />
        <div className="absolute bottom-[-10%] right-[-20%] w-[100vw] h-[100vw] bg-primary/3 blur-[200px] rounded-full" />
        <div className="absolute inset-0 bg-[url('/assets/noise.png')] opacity-[0.03] mix-blend-overlay" />
      </div>

      <header className="relative z-50 w-full p-8 lg:px-14 flex justify-between items-center bg-muted/40 backdrop-blur-3xl border-b border-border">
        <Link href="/" className="inline-flex items-center gap-4 text-muted-foreground/20 hover:text-primary transition-all text-[11px] font-black uppercase tracking-[0.6em] group italic active:scale-95 leading-none">
            <ChevronLeft size={16} className="group-hover:-translate-x-2 transition-transform" /> Core Matrix
        </Link>
        <div className="flex items-center gap-6">
           <div className="px-6 py-2.5 bg-primary/10 border border-primary/20 rounded-full text-[10px] font-black text-primary uppercase tracking-[0.4em] italic leading-none animate-pulse">
              KNOWLEDGE_RESONANCE_v7.1
           </div>
        </div>
      </header>

      <main className="relative z-10 max-w-7xl mx-auto px-6 md:px-12 lg:px-24 pt-16 md:pt-24 lg:pt-32 space-y-16 md:space-y-32 flex-1 flex flex-col">
        
        {/* ── HEADER ── */}
        <motion.section 
          initial={{ opacity: 0, y: 40 }}
          animate={{ opacity: 1, y: 0 }}
          className="space-y-12"
        >
          <div className="inline-flex items-center gap-4 px-6 py-2.5 bg-muted/30 border border-border rounded-full backdrop-blur-3xl shadow-2xl">
            <BrainCircuit size={20} className="text-primary animate-pulse" />
            <span className="text-[11px] font-black tracking-[0.6em] text-primary uppercase italic leading-none pl-1">Knowledge Nexus Protocol</span>
          </div>
          <div className="space-y-8">
            <h1 className="text-fluid-hero font-black tracking-tighter uppercase leading-[0.8] italic">
              Humanese<br/>
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-foreground via-foreground/80 to-primary/30">Intelligence Base.</span>
            </h1>
            <p className="text-fluid-body text-muted-foreground/30 max-w-4xl leading-relaxed font-light italic">
              Access the distributed ledger of operational truth. Query the swarm. Anchor your understanding of the OMEGA architecture.
            </p>
          </div>
        </motion.section>

        {/* ── SEARCH ── */}
        <div className="relative group max-w-4xl cursor-pointer" onClick={() => document.getElementById('faq-search')?.focus()}>
          <div className="absolute -inset-1 bg-gradient-to-r from-primary/20 to-transparent rounded-[3rem] blur opacity-25 group-hover:opacity-50 transition-all duration-1000" />
          <div className="relative flex items-center bg-background border-2 border-border rounded-[3rem] px-12 py-8 shadow-2xl transition-all group-focus-within:border-primary/40 group-focus-within:bg-primary/5">
             <Search size={32} className="text-muted-foreground/20 group-focus-within:text-primary transition-colors" strokeWidth={3} />
             <input 
               id="faq-search"
               type="text" 
               placeholder="Query the Abyssal Knowledge Graph..."
               className="flex-1 bg-transparent border-none outline-none px-10 text-fluid-body font-light italic text-foreground placeholder:text-muted-foreground/10 tracking-tight cursor-text"
               value={searchQuery}
               onChange={e => setSearchQuery(e.target.value)}
             />
             <div className="hidden md:flex items-center gap-4 px-6 py-3 bg-muted/10 border-2 border-border rounded-2xl text-[10px] font-black text-muted-foreground/20 uppercase tracking-[0.4em] italic">
                SIGNAL_INPUT
             </div>
          </div>
        </div>

        {/* ── FAQ GRID ── */}
        <div className="grid grid-cols-1 gap-12 lg:gap-20">
          {filteredFaqs.map((category, idx) => (
            <motion.div 
              key={category.category}
              initial={{ opacity: 0, y: 40 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="space-y-12"
            >
              <div className="flex items-center justify-between border-b-2 border-border pb-8">
                  <div className="flex items-center gap-8">
                     <div className="p-4 bg-primary/10 rounded-2xl text-primary">
                        {category.icon}
                     </div>
                     <h2 className="text-fluid-title lg:text-fluid-balance font-black uppercase tracking-tighter italic leading-none text-muted-foreground/90">{category.category}</h2>
                  </div>
                  <div className="text-[11px] font-black uppercase tracking-[0.6em] text-muted-foreground/5 italic leading-none pl-1">SECTOR_ARCHIVE_0{idx+1}</div>
              </div>

              <div className="grid grid-cols-1 gap-6">
                  {category.items.map((item) => (
                      <div key={item.q} className="bg-background border-2 border-border responsive-rounded overflow-hidden backdrop-blur-3xl shadow-[0_40px_80px_rgba(0,0,0,0.95)] hover:border-primary/30 transition-all relative group">
                          <button 
                              onClick={() => setActiveItem(activeItem === item.q ? null : item.q)}
                              className="w-full px-12 lg:px-16 py-10 flex justify-between items-center text-left relative z-10"
                          >
                              <div className="space-y-2 pr-12">
                                 <span className="text-fluid-body font-black uppercase italic tracking-tighter text-muted-foreground/60 group-hover:text-primary transition-colors leading-tight pl-1">{item.q}</span>
                              </div>
                              <div className={`w-14 h-14 rounded-2xl flex items-center justify-center bg-muted/10 border-2 border-border transition-all duration-500 overflow-hidden shrink-0 ${activeItem === item.q ? 'bg-primary border-primary rotate-180' : 'group-hover:border-primary/40'}`}>
                                 <ChevronDown size={28} className={activeItem === item.q ? 'text-background' : 'text-muted-foreground/20'} strokeWidth={3} />
                              </div>
                          </button>
                          
                          <AnimatePresence>
                              {activeItem === item.q && (
                                  <motion.div 
                                      initial={{ height: 0, opacity: 0 }}
                                      animate={{ height: 'auto', opacity: 1 }}
                                      exit={{ height: 0, opacity: 0 }}
                                      transition={{ duration: 0.6, ease: "circOut" }}
                                  >
                                      <div className="px-12 lg:px-20 pb-16 text-muted-foreground/30 text-2xl leading-relaxed italic border-t-2 border-border pt-12 relative z-10 font-light tracking-tight pr-12 lg:pr-32">
                                          "{item.a}"
                                          <div className="mt-8">
                                             <div className="inline-flex items-center gap-4 text-[11px] font-black uppercase tracking-[0.5em] text-primary opacity-40 italic leading-none">
                                                <Terminal size={16} strokeWidth={3} /> VERIFIED_TRUTH_DATA
                                             </div>
                                          </div>
                                      </div>
                                  </motion.div>
                              )}
                          </AnimatePresence>

                          <div className="absolute inset-y-0 left-0 w-2 bg-primary scale-y-0 group-hover:scale-y-100 transition-transform origin-top z-0" />
                      </div>
                  ))}
              </div>
            </motion.div>
          ))}
        </div>

        {/* ── METRICS FOOTER ── */}
        <footer className="grid grid-cols-1 md:grid-cols-3 gap-10">
            {[
                { label: 'Neural Nodes', value: '8,241+', icon: <Zap size={24} strokeWidth={2.5} /> },
                { label: 'Uptime Integrity', value: '99.99%', icon: <Activity size={24} strokeWidth={2.5} /> },
                { label: 'Truth Anchored', value: '100%', icon: <Database size={24} strokeWidth={2.5} /> },
            ].map(s => (
                <div key={s.label} className="bg-background border-2 border-border responsive-rounded p-8 md:p-12 flex flex-col items-center justify-center text-center gap-6 shadow-[0_40px_80px_rgba(0,0,0,0.95)] hover:border-primary/20 transition-all group">
                    <div className="text-primary group-hover:scale-110 transition-transform">{s.icon}</div>
                    <div className="space-y-2">
                       <div className="text-5xl font-black italic tracking-tighter text-foreground leading-none group-hover:text-primary transition-colors">{s.value}</div>
                       <div className="text-[11px] font-black text-muted-foreground/10 uppercase tracking-[0.5em] italic leading-none">{s.label}</div>
                    </div>
                </div>
            ))}
        </footer>

        {/* ── CALL TO ACTION ── */}
        <div className="pt-40 text-center space-y-16">
            <div className="space-y-6">
               <p className="text-fluid-body text-muted-foreground/20 font-light italic leading-none"> Still need direct neural intelligence? </p>
               <div className="h-px w-32 bg-muted/10 mx-auto" />
            </div>
            <div className="flex flex-col lg:flex-row justify-center gap-10">
                <Link href="/monroe" className="px-16 py-8 bg-primary text-primary-foreground font-black uppercase tracking-[0.4em] md:tracking-[0.8em] rounded-[3rem] shadow-[0_40px_100px_rgba(var(--primary),0.3)] hover:scale-[1.05] active:scale-95 transition-all text-[11px] flex items-center justify-center gap-6 italic leading-none border-0 overflow-hidden relative group/btn">
                    <span className="relative z-10 flex items-center gap-6">Consult Abyssal Sentinel <ArrowRight size={20} className="group-hover/btn:translate-x-3 transition-transform" strokeWidth={3} /></span>
                    <div className="absolute inset-0 bg-white opacity-0 group-hover/btn:opacity-10 transition-opacity" />
                </Link>
                <Link href="/hpedia" className="px-16 py-8 border-2 border-border bg-muted text-muted-foreground/30 hover:text-foreground font-black uppercase tracking-[0.4em] md:tracking-[0.8em] rounded-[3rem] hover:bg-muted/10 hover:border-border transition-all text-[11px] flex items-center justify-center italic leading-none active:scale-95 group/btn">
                    Open Protocol Technicals
                </Link>
            </div>
            
            <div className="pt-24">
               <Link href="/" className="inline-flex items-center gap-8 text-[12px] font-black uppercase tracking-[1rem] text-muted-foreground/10 hover:text-primary transition-all italic group active:scale-95 leading-none pl-4 pr-4">
                   <ChevronLeft size={24} className="group-hover:-translate-x-4 transition-transform" strokeWidth={3} /> Return to Core Shard
               </Link>
            </div>
        </div>

      </main>

      {/* BACKGROUND DECOR */}
      <div className="fixed bottom-0 right-0 p-16 opacity-[0.01] pointer-events-none select-none z-0">
          <div className="text-fluid-hero font-black italic leading-none uppercase">KNOWLEDGE</div>
      </div>

      <style jsx global>{`
        @keyframes scan {
          from { transform: translateY(-100%); }
          to { transform: translateY(1000%); }
        }
      `}</style>
    </div>
  );
}
