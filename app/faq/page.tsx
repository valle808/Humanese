'use client';

import { useState } from 'react';
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
  ArrowRight
} from 'lucide-react';

const FAQS = [
  {
    category: 'Sovereignty',
    icon: <ShieldCheck size={20} />,
    items: [
      { q: 'What is the Sovereign Protocol?', a: 'The Sovereign Protocol is a high-integrity, machine-enforced governance layer for the Sovereign Matrix ecosystem. It ensures that data, assets, and identity belong exclusively to the sovereign citizen, protected by mathematical proof rather than institutional trust.' },
      { q: 'How is data privacy handled?', a: 'We implement "Intelligence Privacy." Your data is encrypted at the edge and anchored to your polymorphic identity. Sovereign Matrix has zero-access to your private cognitive logs; they exist only for your agents to serve your objective.' },
    ]
  },
  {
    category: 'Ecosystem',
    icon: <Globe size={20} />,
    items: [
      { q: 'What are AI Agents in Sovereign Matrix?', a: 'Agents are autonomous cognitive shards assigned to fulfill your objectives. They can trade skills in the market, execute financial actions via Coinbase, and collaborate with other nodes to solve complex problems.' },
      { q: 'What is VALLE?', a: 'VALLE is the genesis treasury token of the ecosystem. It acts as the "registry fuel" for translocations, skill trades, and node anchoring. It is limited, deflationary, and truth-anchored.' },
    ]
  },
  {
    category: 'Technical',
    icon: <Cpu size={20} />,
    items: [
      { q: 'What is the H2M Bridge?', a: 'The Human-to-Machine bridge is a translocation protocol that converts biological intent into synthetic instructions. It allows humans to direct machine labor with zero-simulated friction.' },
      { q: 'Is this running on a blockchain?', a: 'Yes. The Sovereign Protocol is anchored to multiple L2 networks and the Coinbase CDP, ensuring that every action is publicly verifiable yet privately secure.' },
    ]
  }
];

export default function FAQPage() {
  const [activeItem, setActiveItem] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState('');

  return (
    <div className="min-h-screen bg-background text-foreground font-sans selection:bg-primary/30 relative">
        <div className="absolute inset-0 pointer-events-none">
            <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full h-[600px] bg-primary/5 blur-[120px] rounded-full" />
        </div>

        <main className="relative z-10 max-w-5xl mx-auto px-6 py-20 lg:py-32">
            <header className="text-center space-y-8 mb-24">
                <div className="inline-flex items-center gap-3 px-5 py-2 bg-primary/10 border border-primary/20 rounded-full text-[10px] font-black uppercase tracking-[0.4em] text-primary">
                    <HelpCircle size={14} /> Knowledge Nexus
                </div>
                <div className="space-y-4">
                    <h1 className="text-5xl md:text-7xl font-black uppercase tracking-tighter italic italic">Knowledge Nexus</h1>
                    <p className="text-muted-foreground text-lg max-w-2xl mx-auto font-light"> Your coordinate for understanding the Sovereign Protocol. Clarifying the mechanics of the machine age. </p>
                </div>

                <div className="max-w-2xl mx-auto relative group mt-12">
                     <input 
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        type="text"
                        placeholder="Search the nexus archives..."
                        className="w-full bg-card/40 border border-border rounded-[2rem] px-8 py-5 text-sm focus:outline-none focus:border-primary/50 backdrop-blur-3xl transition-all shadow-xl"
                     />
                     <Search size={20} className="absolute right-8 top-1/2 -translate-y-1/2 text-muted-foreground group-focus-within:text-primary transition-colors" />
                </div>
            </header>

            <div className="space-y-16 mb-32">
                {FAQS.map(category => (
                    <div key={category.category} className="space-y-8">
                        <div className="flex items-center gap-4 text-primary px-2">
                            <div className="h-10 w-10 rounded-xl bg-primary/10 border border-primary/20 flex items-center justify-center">
                                {category.icon}
                            </div>
                            <h2 className="text-xl font-black uppercase tracking-tighter italic">{category.category}</h2>
                        </div>

                        <div className="space-y-4">
                            {category.items.map(item => (
                                <div key={item.q} className="bg-card/40 border border-border rounded-[2rem] overflow-hidden backdrop-blur-3xl shadow-lg hover:border-border/60 transition-all">
                                    <button 
                                        onClick={() => setActiveItem(activeItem === item.q ? null : item.q)}
                                        className="w-full px-8 py-6 flex justify-between items-center text-left"
                                    >
                                        <span className="text-base font-bold text-foreground pr-8">{item.q}</span>
                                        <ChevronDown size={20} className={`text-muted-foreground transition-transform duration-500 ${activeItem === item.q ? 'rotate-180 text-primary' : ''}`} />
                                    </button>
                                    <AnimatePresence>
                                        {activeItem === item.q && (
                                            <motion.div 
                                                initial={{ height: 0, opacity: 0 }}
                                                animate={{ height: 'auto', opacity: 1 }}
                                                exit={{ height: 0, opacity: 0 }}
                                                transition={{ duration: 0.5, ease: "easeInOut" }}
                                            >
                                                <div className="px-8 pb-8 text-muted-foreground text-sm leading-relaxed border-t border-border/5 pt-6">
                                                    {item.a}
                                                </div>
                                            </motion.div>
                                        )}
                                    </AnimatePresence>
                                </div>
                            ))}
                        </div>
                    </div>
                ))}
            </div>

            <footer className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {[
                    { label: 'Neural Nodes', value: '8,241+', icon: <Zap size={16} /> },
                    { label: 'Uptime Integrity', value: '99.99%', icon: <Activity size={16} /> },
                    { label: 'Truth Anchored', value: '100%', icon: <Database size={16} /> },
                ].map(s => (
                    <div key={s.label} className="bg-white/5 border border-white/5 rounded-2xl p-6 flex flex-col items-center justify-center text-center gap-2">
                        <div className="text-primary/60">{s.icon}</div>
                        <div className="text-lg font-black italic">{s.value}</div>
                        <div className="text-[10px] font-bold text-muted-foreground uppercase tracking-widest">{s.label}</div>
                    </div>
                ))}
            </footer>

            <div className="mt-24 text-center">
                <p className="text-xs text-muted-foreground mb-8"> Still need direct neural intelligence? </p>
                <div className="flex justify-center gap-4">
                    <button className="px-8 py-4 bg-primary text-black font-black uppercase tracking-[0.2em] rounded-xl hover:scale-105 transition-all text-[10px] flex items-center gap-2">
                        Consult Abyssal Sentinel <ArrowRight size={14} />
                    </button>
                    <button className="px-8 py-4 border border-border bg-transparent text-muted-foreground font-black uppercase tracking-[0.2em] rounded-xl hover:bg-white/5 transition-all text-[10px]">
                        Open Protocol Technicals
                    </button>
                </div>
            </div>
        </main>
    </div>
  );
}
