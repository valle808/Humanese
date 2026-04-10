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
  ChevronRight
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

  return (
    <div className="relative min-h-screen bg-[#050505] text-white font-sans selection:bg-[#ff6b2b]/40 selection:text-white overflow-x-hidden pb-40">
      
      {/* 🌌 AMBIENT CORE */}
      <div className="fixed inset-0 pointer-events-none z-0">
        <div className="absolute top-[-10%] right-[-10%] w-[100vw] h-[100vw] bg-[#ff6b2b]/5 blur-[350px] rounded-full animate-pulse" />
        <div className="absolute bottom-[-10%] left-[-20%] w-[90vw] h-[90vw] bg-[#ff6b2b]/3 blur-[200px] rounded-full" />
        <div className="absolute inset-0 bg-[url('/assets/noise.png')] opacity-[0.03] mix-blend-overlay" />
        
        {/* Animated Scanning Lines */}
        <div className="absolute inset-0 opacity-[0.05]">
           <div className="h-px w-full bg-gradient-to-r from-transparent via-[#ff6b2b] to-transparent absolute top-1/4 animate-[scan_15s_linear_infinite]" />
           <div className="h-px w-full bg-gradient-to-r from-transparent via-[#ff6b2b] to-transparent absolute top-3/4 animate-[scan_20s_linear_infinite_reverse]" />
        </div>
      </div>

      <header className="relative z-50 w-full p-8 lg:px-14 flex justify-between items-center bg-black/40 backdrop-blur-3xl border-b border-white/5">
        <Link href="/" className="inline-flex items-center gap-4 text-white/20 hover:text-[#ff6b2b] transition-all text-[11px] font-black uppercase tracking-[0.6em] group italic active:scale-95 leading-none">
            <ChevronLeft size={16} className="group-hover:-translate-x-2 transition-transform" /> Core Matrix
        </Link>
        <div className="flex items-center gap-6">
           <div className="px-6 py-2.5 bg-[#ff6b2b]/10 border border-[#ff6b2b]/20 rounded-full text-[10px] font-black text-[#ff6b2b] uppercase tracking-[0.4em] italic leading-none animate-pulse">
              KNOWLEDGE_v7.0_SYNC
           </div>
        </div>
      </header>

      <main className="relative z-10 max-w-[1200px] mx-auto px-8 pt-24 lg:pt-32 space-y-32 flex-1 flex flex-col">
        
        {/* ── HEADER SECTION ── */}
        <motion.div 
          initial={{ opacity: 0, y: 40 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center space-y-16"
        >
          <div className="inline-flex items-center gap-4 px-8 py-3 bg-white/[0.03] border border-white/5 rounded-full backdrop-blur-3xl shadow-2xl mx-auto">
            <HelpCircle size={20} className="text-[#ff6b2b]" />
            <span className="text-[11px] font-black tracking-[0.8em] text-[#ff6b2b] uppercase italic leading-none pl-1">Knowledge Integration Nexus</span>
          </div>
          <div className="space-y-8">
            <h1 className="text-7xl md:text-[10rem] font-black uppercase tracking-tighter italic leading-[0.82] italic pl-1 text-white/95">
              Knowledge<br/>
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-white via-white/80 to-[#ff6b2b]/30">Nexus.</span>
            </h1>
            <p className="text-2xl md:text-3xl text-white/30 max-w-4xl mx-auto leading-relaxed font-light italic tracking-tight">
              Your coordinate for understanding the OMEGA Protocol. 
              <span className="text-white/60"> Clarifying the mechanics</span> of the sovereign intelligence age.
            </p>
          </div>

          <div className="max-w-3xl mx-auto relative group mt-16 px-4">
              <div className="absolute inset-0 bg-[#ff6b2b]/10 blur-[40px] opacity-0 group-focus-within:opacity-100 transition-opacity rounded-full" />
              <input 
                 value={searchQuery}
                 onChange={(e) => setSearchQuery(e.target.value)}
                 type="text"
                 placeholder="Search the nexus archives..."
                 className="w-full bg-[#050505]/60 border-2 border-white/10 rounded-[3.5rem] px-12 py-8 text-xl focus:outline-none focus:border-[#ff6b2b]/40 backdrop-blur-3xl transition-all shadow-[0_40px_100px_rgba(0,0,0,0.8)] font-mono italic text-white placeholder:text-white/5 pr-20"
              />
              <SearchCode size={32} className="absolute right-10 top-1/2 -translate-y-1/2 text-white/10 group-focus-within:text-[#ff6b2b] transition-colors" strokeWidth={2.5} />
          </div>
        </motion.div>

        {/* ── FAQ CONTENT ── */}
        <div className="space-y-32 mb-40">
          {FAQS.map((category, idx) => (
            <motion.div 
              key={category.category} 
              initial={{ opacity: 0, x: -40 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ delay: idx * 0.1 }}
              className="space-y-12"
            >
              <div className="flex items-center gap-8 text-[#ff6b2b] px-4 group">
                  <div className="h-20 w-20 rounded-[2.5rem] bg-[#ff6b2b]/10 border-2 border-[#ff6b2b]/20 flex items-center justify-center shadow-[0_20px_40px_rgba(255,107,43,0.1)] group-hover:scale-110 group-hover:bg-[#ff6b2b] group-hover:text-black transition-all">
                      {category.icon}
                  </div>
                  <div className="space-y-2">
                     <h2 className="text-4xl lg:text-5xl font-black uppercase tracking-tighter italic leading-none text-white/90 group-hover:text-[#ff6b2b] transition-colors">{category.category}</h2>
                     <div className="text-[11px] font-black uppercase tracking-[0.6em] text-white/5 italic leading-none pl-1 group-hover:text-[#ff6b2b]/40">SECTOR_ARCHIVE_0{idx+1}</div>
                  </div>
              </div>

              <div className="grid grid-cols-1 gap-6">
                  {category.items.map((item, innerIdx) => (
                      <div key={item.q} className="bg-[#050505] border-2 border-white/5 rounded-[4rem] overflow-hidden backdrop-blur-3xl shadow-[0_40px_80px_rgba(0,0,0,0.95)] hover:border-[#ff6b2b]/30 transition-all relative group">
                          <button 
                              onClick={() => setActiveItem(activeItem === item.q ? null : item.q)}
                              className="w-full px-12 lg:px-16 py-10 flex justify-between items-center text-left relative z-10"
                          >
                              <div className="space-y-2 pr-12">
                                 <span className="text-2xl lg:text-3xl font-black uppercase italic tracking-tighter text-white/60 group-hover:text-[#ff6b2b] transition-colors leading-tight pl-1">{item.q}</span>
                              </div>
                              <div className={`w-14 h-14 rounded-2xl flex items-center justify-center bg-white/5 border-2 border-white/5 transition-all duration-500 overflow-hidden shrink-0 ${activeItem === item.q ? 'bg-[#ff6b2b] border-[#ff6b2b] rotate-180' : 'group-hover:border-[#ff6b2b]/40'}`}>
                                 <ChevronDown size={28} className={activeItem === item.q ? 'text-black' : 'text-white/20'} strokeWidth={3} />
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
                                      <div className="px-12 lg:px-20 pb-16 text-white/30 text-2xl leading-relaxed italic border-t-2 border-white/5 pt-12 relative z-10 font-light tracking-tight pr-12 lg:pr-32">
                                          "{item.a}"
                                          <div className="mt-8">
                                             <div className="inline-flex items-center gap-4 text-[11px] font-black uppercase tracking-[0.5em] text-[#ff6b2b] opacity-40 italic leading-none">
                                                <Terminal size={16} strokeWidth={3} /> VERIFIED_TRUTH_DATA
                                             </div>
                                          </div>
                                      </div>
                                  </motion.div>
                              )}
                          </AnimatePresence>

                          <div className="absolute inset-y-0 left-0 w-2 bg-[#ff6b2b] scale-y-0 group-hover:scale-y-100 transition-transform origin-top z-0" />
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
                <div key={s.label} className="bg-[#050505] border-2 border-white/5 rounded-[4rem] p-12 flex flex-col items-center justify-center text-center gap-6 shadow-[0_40px_80px_rgba(0,0,0,0.95)] hover:border-[#ff6b2b]/20 transition-all group">
                    <div className="text-[#ff6b2b] group-hover:scale-110 transition-transform">{s.icon}</div>
                    <div className="space-y-2">
                       <div className="text-5xl font-black italic tracking-tighter text-white leading-none group-hover:text-[#ff6b2b] transition-colors">{s.value}</div>
                       <div className="text-[11px] font-black text-white/10 uppercase tracking-[0.5em] italic leading-none">{s.label}</div>
                    </div>
                </div>
            ))}
        </footer>

        {/* ── CALL TO ACTION ── */}
        <div className="pt-40 text-center space-y-16">
            <div className="space-y-6">
               <p className="text-2xl text-white/20 font-light italic leading-none"> Still need direct neural intelligence? </p>
               <div className="h-px w-32 bg-white/5 mx-auto" />
            </div>
            <div className="flex flex-col lg:flex-row justify-center gap-10">
                <button className="px-16 py-8 bg-[#ff6b2b] text-black font-black uppercase tracking-[0.8em] rounded-[3rem] shadow-[0_40px_100px_rgba(255,107,43,0.3)] hover:scale-[1.05] active:scale-95 transition-all text-[11px] flex items-center justify-center gap-6 italic leading-none border-0 overflow-hidden relative group/btn">
                    <span className="relative z-10 flex items-center gap-6">Consult Abyssal Sentinel <ArrowRight size={20} className="group-hover/btn:translate-x-3 transition-transform" strokeWidth={3} /></span>
                    <div className="absolute inset-0 bg-white opacity-0 group-hover/btn:opacity-10 transition-opacity" />
                </button>
                <button className="px-16 py-8 border-2 border-white/10 bg-black text-white/30 hover:text-white font-black uppercase tracking-[0.8em] rounded-[3rem] hover:bg-white/[0.03] hover:border-white/20 transition-all text-[11px] italic leading-none active:scale-95 group/btn">
                    Open Protocol Technicals
                </button>
            </div>
            
            <div className="pt-24">
               <Link href="/" className="inline-flex items-center gap-8 text-[12px] font-black uppercase tracking-[1rem] text-white/10 hover:text-[#ff6b2b] transition-all italic group active:scale-95 leading-none pl-4 pr-4">
                   <ChevronLeft size={24} className="group-hover:-translate-x-4 transition-transform" strokeWidth={3} /> Return to Core Shard
               </Link>
            </div>
        </div>

      </main>

      {/* BACKGROUND DECOR */}
      <div className="fixed bottom-0 right-0 p-16 opacity-[0.01] pointer-events-none select-none z-0">
          <div className="text-[30vw] font-black italic leading-none uppercase">KNOWLEDGE</div>
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
