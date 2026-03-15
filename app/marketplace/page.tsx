'use client';

import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ShoppingCart, Zap, ShieldCheck, Globe, Search, Filter, TrendingUp } from 'lucide-react';

const SKILLS = [
  { id: 1, name: "Neural Arbitrage Engine", price: "450 VALLE", category: "Finance", level: "Elite", description: "Autonomous cross-exchange liquidity balancing with 4ms latency." },
  { id: 2, name: "Sovereign GPT-5 Node", price: "1200 VALLE", category: "Intelligence", level: "Sovereign", description: "Privatized LLM node with zero-log encryption and high-reasoning priority." },
  { id: 3, name: "Swarm Sentinel Beta", price: "25 VALLE/hr", category: "Security", level: "Standard", description: "Distributed DDoS protection powered by the Humanese global node network." },
  { id: 4, name: "Metabolic AI Tracker", price: "80 VALLE", category: "Health", level: "Elite", description: "Real-time biometric synthesis and autonomous health optimization." },
];

export default function MarketplacePage() {
  const [filter, setFilter] = useState('All');

  return (
    <div className="flex-1 flex flex-col p-8 space-y-12 pb-24">
      <header className="space-y-4">
        <div className="flex items-center gap-2 text-emerald font-mono text-xs tracking-widest uppercase">
          <TrendingUp className="w-4 h-4" />
          <span>Sovereign Trade Pacts</span>
        </div>
        <h1 className="text-5xl font-bold tracking-tighter text-white">
          SKILL<span className="text-emerald">MARKET</span>
        </h1>
        <div className="max-w-2xl text-platinum/40 font-mono text-sm">
          Acquire or provision high-fidelity machine capabilities via decentralized A2A pacts.
        </div>
      </header>

      <div className="flex flex-col md:flex-row gap-8">
        {/* Sidebar Filters */}
        <aside className="w-full md:w-64 space-y-6">
          <div className="sovereign-card-v4 bg-black/40 border-white/5 space-y-4">
            <div className="text-[10px] font-bold text-emerald uppercase tracking-widest">Filters</div>
            <div className="relative group">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-platinum/20 group-hover:text-emerald transition-colors" />
              <input 
                placeholder="Search Skills..."
                className="w-full pl-10 pr-4 py-2 bg-obsidian border border-white/5 rounded-lg text-sm text-platinum placeholder:text-white/10 outline-none focus:border-emerald/30 transition-all font-mono"
              />
            </div>
            
            <div className="space-y-2 pt-4">
              {['All', 'Intelligence', 'Security', 'Finance', 'Health'].map((cat) => (
                <button 
                  key={cat}
                  onClick={() => setFilter(cat)}
                  className={`w-full text-left px-3 py-2 rounded-md text-xs font-mono transition-all ${filter === cat ? 'bg-emerald text-obsidian font-bold' : 'text-platinum/40 hover:bg-white/5 hover:text-white'}`}
                >
                  {cat.toUpperCase()}
                </button>
              ))}
            </div>
          </div>

          <div className="sovereign-card-v4 bg-emerald/5 border-emerald/10 p-4 space-y-2">
            <div className="flex items-center gap-2 text-emerald">
              <ShieldCheck className="w-4 h-4" />
              <span className="text-[10px] font-bold uppercase tracking-wider">Verified Pacts</span>
            </div>
            <p className="text-[10px] text-platinum/40 leading-relaxed font-mono">
              All transactions are secured by the Abyssal Sentinel protocol.
            </p>
          </div>
        </aside>

        {/* Main Feed */}
        <main className="flex-1">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <AnimatePresence mode="popLayout">
              {SKILLS.filter(s => filter === 'All' || s.category === filter).map((skill, i) => (
                <motion.div
                  key={skill.id}
                  layout
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, scale: 0.95 }}
                  transition={{ delay: i * 0.05 }}
                  className="sovereign-card-v4 border-white/5 bg-black/20 group"
                >
                  <div className="flex justify-between items-start mb-6">
                    <div className="px-3 py-1 rounded-full bg-platinum/5 border border-white/5 text-[9px] font-bold font-mono text-platinum/40 tracking-widest uppercase">
                      {skill.category}
                    </div>
                    <div className="flex items-center gap-1 text-emerald">
                      <Zap className="w-3 h-3 fill-current" />
                      <span className="text-[10px] font-bold font-mono tracking-tighter">{skill.level}</span>
                    </div>
                  </div>

                  <h3 className="text-xl font-bold text-white mb-2 group-hover:text-emerald transition-colors">{skill.name}</h3>
                  <p className="text-sm text-platinum/40 font-mono leading-relaxed mb-8 h-10 overflow-hidden line-clamp-2">
                    {skill.description}
                  </p>

                  <div className="flex items-center justify-between pt-6 border-t border-white/5">
                    <div className="text-xl font-bold text-white tracking-tighter">
                      {skill.price}
                    </div>
                    <button className="flex items-center gap-2 px-6 py-2 rounded-xl bg-emerald text-obsidian font-bold text-xs hover:shadow-[0_0_20px_rgba(0,255,65,0.4)] transition-all active:scale-95">
                      <ShoppingCart className="w-3 h-3" />
                      Initialize Pact
                    </button>
                  </div>
                </motion.div>
              ))}
            </AnimatePresence>
          </div>
        </main>
      </div>
    </div>
  );
}
