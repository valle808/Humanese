'use client';

import { motion } from 'framer-motion';
import { Gavel, Scale, ShieldAlert, CheckCircle, Database, Search, Filter, Activity, ChevronRight } from 'lucide-react';

const RECENT_CASES = [
  { id: 'CASE-8241-A', title: 'Pact Integrity Audit :: Node_99', status: 'RESOLVED', resonance: '99.9%', time: '2m ago' },
  { id: 'CASE-8245-B', title: 'Asset Translocation Verification :: FI_Core', status: 'IN_REVIEW', resonance: '82.4%', time: '14m ago' },
  { id: 'CASE-8250-C', title: 'Autonomous Labor Dispute :: Skill_Market', status: 'PENDING', resonance: 'N/A', time: '1h ago' },
];

export default function SovereignCourtPage() {
  return (
    <div className="min-h-screen bg-background text-foreground font-sans selection:bg-primary/30">
        <div className="fixed inset-0 pointer-events-none">
            <div className="absolute top-0 right-0 w-[800px] h-[800px] bg-primary/5 blur-[120px] rounded-full" />
            <div className="absolute inset-0 bg-[url('/assets/noise.png')] opacity-[0.02] mix-blend-overlay" />
        </div>

        <main className="relative z-10 max-w-7xl mx-auto px-6 py-20 lg:py-32">
            <header className="flex flex-col md:flex-row justify-between items-end gap-12 mb-20 border-b border-border pb-12">
                <div className="space-y-6">
                    <div className="flex items-center gap-3 text-primary">
                        <Gavel size={32} className="drop-shadow-[0_0_10px_rgba(0,255,65,0.4)]" />
                        <span className="text-xs font-black uppercase tracking-[0.4em]">Judicial Branch</span>
                    </div>
                    <h1 className="text-5xl md:text-7xl font-black uppercase tracking-tighter italic">Sovereign Justice Court</h1>
                    <p className="text-muted-foreground text-lg max-w-2xl font-light"> High-fidelity arbitration for the machine age. Every dispute is resolved via immutable ledger logic and autonomous judicial oversight. Zero simulation. </p>
                </div>

                <div className="flex gap-4">
                    <div className="bg-card/40 border border-border rounded-2xl px-8 py-6 backdrop-blur-3xl text-center">
                        <div className="text-[10px] font-bold text-muted-foreground uppercase tracking-widest mb-1">Total Resolutions</div>
                        <div className="text-3xl font-black text-foreground">14,821</div>
                    </div>
                    <div className="bg-primary/10 border border-primary/20 rounded-2xl px-8 py-6 backdrop-blur-3xl text-center">
                        <div className="text-[10px] font-bold text-primary uppercase tracking-widest mb-1">Integrity Rating</div>
                        <div className="text-3xl font-black text-primary">100%</div>
                    </div>
                </div>
            </header>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mb-12">
                {/* 🔎 SEARCH AND FILTER */}
                <div className="lg:col-span-1 space-y-6">
                    <div className="bg-card/40 border border-border rounded-3xl p-6 space-y-6">
                        <div className="relative">
                            <input 
                                type="text"
                                placeholder="Search Case ID or Registry Hash..."
                                className="w-full bg-black/40 border border-border rounded-xl px-4 py-3 text-sm focus:border-primary/50 outline-none transition-all font-mono"
                            />
                            <Search size={18} className="absolute right-4 top-1/2 -translate-y-1/2 text-muted-foreground" />
                        </div>
                        <div className="space-y-3">
                            <p className="text-[10px] font-black uppercase tracking-widest text-muted-foreground ml-1">Filter by Status</p>
                            <div className="flex flex-col gap-2">
                                {['ALL_CASES', 'PENDING_AUDIT', 'RESOLVED', 'RECALIBRATING'].map(f => (
                                    <button key={f} className="flex items-center justify-between p-3 bg-white/5 border border-white/5 rounded-xl hover:border-primary/40 transition-all text-[10px] font-bold tracking-widest uppercase">
                                        {f} <ChevronRight size={12} />
                                    </button>
                                ))}
                            </div>
                        </div>
                    </div>

                    <div className="bg-primary/5 border border-primary/20 rounded-3xl p-6 space-y-4">
                        <div className="flex items-center gap-2 text-primary font-black uppercase tracking-widest text-[10px]">
                            <ShieldAlert size={14} /> Critical Oversight
                        </div>
                        <p className="text-[11px] text-muted-foreground leading-relaxed italic"> "Justice is not an opinion; it is a mathematical certainty. The Sovereign Protocol ensures that truth is the only output of every judicial cycle." </p>
                    </div>
                </div>

                {/* ⚖️ ACTIVE LEDGER FEED */}
                <div className="lg:col-span-2 space-y-8">
                    <div className="bg-card/40 border border-border rounded-[2.5rem] overflow-hidden shadow-2xl backdrop-blur-3xl">
                        <div className="p-8 border-b border-border flex justify-between items-center bg-white/5">
                            <div className="flex items-center gap-3">
                                <Scale size={20} className="text-primary" />
                                <h2 className="text-lg font-black uppercase tracking-tighter">Active Judicial Ledger</h2>
                            </div>
                            <div className="flex items-center gap-2 px-3 py-1.5 rounded-full bg-primary/10 border border-primary/20 text-[9px] font-bold text-primary uppercase tracking-widest">
                                <div className="h-1.5 w-1.5 rounded-full bg-primary animate-pulse" /> Live Audit Stream
                            </div>
                        </div>

                        <div className="divide-y divide-border">
                            {RECENT_CASES.map(case_item => (
                                <div key={case_item.id} className="p-8 flex flex-col md:flex-row justify-between items-start md:items-center gap-6 group hover:bg-white/[0.02] transition-all cursor-default relative overflow-hidden">
                                     <div className="flex items-start gap-6 relative z-10">
                                        <div className="w-12 h-12 bg-black border border-border rounded-2xl flex items-center justify-center text-muted-foreground group-hover:text-primary group-hover:border-primary/40 transition-all">
                                            <Database size={24} />
                                        </div>
                                        <div className="space-y-1">
                                            <div className="text-sm font-bold text-foreground group-hover:text-primary transition-colors uppercase">{case_item.title}</div>
                                            <div className="flex items-center gap-3 text-[10px] font-mono text-muted-foreground uppercase tracking-widest">
                                                <span>ID: {case_item.id}</span>
                                                <span>•</span>
                                                <span>TIMESTAMP: {case_item.time}</span>
                                            </div>
                                        </div>
                                     </div>
                                     
                                     <div className="flex items-center gap-8 relative z-10">
                                         <div className="text-right">
                                             <div className="text-[10px] text-muted-foreground uppercase tracking-widest font-bold mb-1">Resonance</div>
                                             <div className="text-lg font-black text-foreground italic">{case_item.resonance}</div>
                                         </div>
                                         <div className={`px-4 py-1.5 rounded-full text-[9px] font-black uppercase tracking-[0.2em] border ${case_item.status === 'RESOLVED' ? 'bg-primary/10 border-primary/20 text-primary' : 'bg-white/5 border-border text-muted-foreground'}`}>
                                             {case_item.status}
                                         </div>
                                     </div>

                                     <div className="absolute inset-y-0 left-0 w-1 bg-primary scale-y-0 group-hover:scale-y-100 transition-transform origin-top" />
                                </div>
                            ))}
                        </div>

                        <div className="p-8 border-t border-border flex justify-center bg-white/5 group cursor-pointer">
                             <div className="flex items-center gap-2 text-xs font-black uppercase tracking-[0.3em] text-muted-foreground group-hover:text-primary transition-colors">
                                 Expand Full Judicial Archives <Activity size={16} />
                             </div>
                        </div>
                    </div>
                </div>
            </div>
        </main>
    </div>
  );
}
