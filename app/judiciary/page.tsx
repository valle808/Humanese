'use client';

import React, { useState, useEffect, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  ShieldCheck, Users, FileText, Vote, Globe, Zap, 
  ChevronRight, Lock, Activity, ArrowRight, TrendingUp,
  Gavel, Scale, Cpu, Terminal, ChevronLeft, Radio,
  Wifi, Target, Plus, Orbit, Grid, ShieldHalf, Clock,
  Binary, Layers, Sparkles, Search, MoreVertical,
  ArrowUpRight
} from 'lucide-react';
import Link from 'next/link';

import { HistoricVerdictMap } from '@/components/HistoricVerdictMap';

export default function JudicialOversightPage() {
  const [proposals, setProposals] = useState<any[]>([]);
  const [stats, setStats] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState('ALL_DIRECTIVES');

  const fetchData = useCallback(async () => {
    try {
      const [govRes, statsRes] = await Promise.all([
        fetch('/api/governance/list'),
        fetch('/api/judiciary/stats')
      ]);
      const govData = await govRes.json();
      const statsData = await statsRes.json();

      if (govData.success) setProposals(govData.proposals);
      if (statsData.success) setStats(statsData.stats);
    } catch (e) {
      console.error("Legislative sync failure", e);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchData();
    const interval = setInterval(fetchData, 10000);
    return () => clearInterval(interval);
  }, [fetchData]);

  const filteredProposals = proposals.filter(p => {
    if (filter === 'ALL_DIRECTIVES') return true;
    if (filter === 'VOTING_ACTIVE') return p.status === 'Active' || p.status === 'Draft';
    if (filter === 'PASSED') return p.status === 'Accepted';
    return true;
  });

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
        <div className="absolute top-[-10%] right-[-10%] w-[100vw] h-[100vw] bg-primary/5 blur-[350px] rounded-full animate-pulse" />
        <div className="absolute bottom-[-10%] left-[-20%] w-[90vw] h-[90vw] bg-primary/3 blur-[200px] rounded-full" />
      </div>

      <header className="relative z-50 w-full px-8 lg:px-14 py-6 flex justify-between items-center bg-background/40 backdrop-blur-3xl border-b border-border transition-colors duration-700">
        <Link href="/" className="inline-flex items-center gap-4 text-muted-foreground/40 hover:text-primary transition-all text-[11px] font-black uppercase tracking-[0.6em] group italic active:scale-95 leading-none">
            <ChevronLeft size={16} className="group-hover:-translate-x-2 transition-transform" /> Core Matrix
        </Link>
        <div className="flex items-center gap-6">
           <div className="px-6 py-2.5 bg-primary/10 border border-primary/20 rounded-full text-[10px] font-black text-primary uppercase tracking-[0.4em] italic leading-none animate-pulse">
              LEGISLATIVE_v7.0_SYNC
           </div>
        </div>
      </header>

      <main className="relative z-10 max-w-[1600px] mx-auto px-6 md:px-12 lg:px-20 pt-16 md:pt-24 lg:pt-32 space-y-16 md:space-y-32 flex-1 flex flex-col">
        
        {/* ── HEADER SECTION ── */}
        <motion.div 
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          className="flex flex-col lg:flex-row justify-between items-end gap-16 border-b-2 border-border pb-16"
        >
          <div className="space-y-12 max-w-4xl">
            <div className="inline-flex items-center gap-4 px-6 py-2.5 bg-muted/40 border border-border rounded-full backdrop-blur-3xl shadow-lg">
              <Gavel size={20} className="text-primary" />
              <span className="text-[11px] font-black tracking-[0.4em] md:tracking-[0.8em] text-primary uppercase italic leading-none pl-1">Sovereign Legislative Oversight</span>
            </div>
            <div className="space-y-8">
              <h1 className="text-fluid-hero font-black uppercase tracking-tighter italic leading-[0.9] md:leading-[0.8] text-foreground">
                Judiciary<br/>
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-foreground via-foreground/80 to-primary/30">Oversight.</span>
              </h1>
              <p className="text-fluid-title text-muted-foreground/40 max-w-3xl leading-relaxed font-light italic tracking-tight">
                The autonomous legislative branch of the OMEGA Intelligence. 
                <span className="text-foreground/80"> Directing the evolution</span> of machine law through human-verified protocol amendments.
              </p>
            </div>
          </div>

          <div className="flex gap-10 items-center shrink-0 w-full lg:w-auto">
               <div className="p-10 bg-background border-2 border-border rounded-[3.5rem] min-w-[320px] space-y-6 shadow-xl backdrop-blur-3xl group relative overflow-hidden shadow-inner w-full lg:w-auto">
                  <div className="absolute top-0 right-0 p-8 opacity-[0.05] group-hover:scale-125 transition-transform duration-2000">
                     <Scale size={120} className="text-primary" />
                  </div>
                  <div className="text-[11px] font-black text-muted-foreground/20 uppercase tracking-[0.6em] italic leading-none pl-1">Network Consensus Integrity</div>
                  <div className="text-6xl font-black text-foreground italic tracking-tighter leading-none group-hover:text-primary transition-colors flex items-baseline gap-4 pl-1">
                    {stats?.integrityRating || 99.98}% <span className="text-xs text-primary uppercase tracking-[0.4em] font-black italic">Stable</span>
                  </div>
                  <div className="h-3 w-full bg-muted border-2 border-border rounded-full overflow-hidden shadow-inner p-[1px] relative z-20">
                      <div className="h-full bg-primary shadow-[0_0_20px_rgba(var(--primary),0.4)] rounded-full transition-all duration-1500" style={{ width: `${stats?.integrityRating || 99.98}%` }} />
                  </div>
               </div>
          </div>
        </motion.div>

        {/* ── HISTORIC VERDICT MAP ── */}
        <section>
          <HistoricVerdictMap />
        </section>

        {/* ── CORE METRICS ── */}
        <section className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-10">
            {[
                { title: 'Governance Power', value: stats ? `${(stats.totalVotes / 1000).toFixed(1)}K` : '...', icon: <Vote size={24} />, detail: 'RESONANCE_TRANS' },
                { title: 'Active Proposals', value: stats?.totalProposals || '...', icon: <FileText size={24} />, detail: 'QUEUE_DIRECTIVES' },
                { title: 'Council Members', value: stats?.uniqueVoters || '...', icon: <Users size={24} />, detail: 'VERIFIED_NODES' },
                { title: 'Protocol Version', value: stats?.protocolVersion || '...', icon: <ShieldCheck size={24} />, detail: 'OMEGA_CORE_OS' },
            ].map((stat, i) => (
                <div key={stat.title} className="p-10 bg-background border-2 border-border rounded-[3rem] backdrop-blur-3xl space-y-10 group hover:border-primary/40 transition-all relative overflow-hidden flex flex-col justify-between h-[280px] shadow-xl shadow-inner">
                     <div className="absolute top-0 right-0 p-8 opacity-[0.03] group-hover:scale-125 transition-transform duration-1000 text-foreground font-black italic uppercase leading-none text-fluid-hero">0{i+1}</div>
                     <div className={`p-6 rounded-2xl bg-muted border-2 border-border w-fit group-hover:bg-primary group-hover:text-primary-foreground group-hover:border-primary/10 transition-all relative z-10 shadow-lg`}>
                         {React.cloneElement(stat.icon as React.ReactElement, { size: 28, strokeWidth: 2.5 })}
                     </div>
                     <div className="space-y-4 relative z-10 pl-1">
                         <div className="text-[11px] font-black text-muted-foreground/30 uppercase tracking-[0.6em] italic leading-none group-hover:text-foreground transition-colors">{stat.title}</div>
                         <div className="text-5xl font-black text-foreground italic tracking-tighter leading-none group-hover:text-primary transition-colors truncate">{stat.value}</div>
                         <div className="text-[10px] text-muted-foreground/10 font-black uppercase italic tracking-[0.4em] leading-none">{stat.detail}</div>
                     </div>
                </div>
            ))}
        </section>

        <div className="grid lg:grid-cols-12 gap-16 items-start">
            
            {/* LEFT: AMENDMENTS GRID */}
            <div className="lg:col-span-8 space-y-16">
                <div className="flex flex-col md:flex-row md:items-center justify-between gap-12 border-b-2 border-border pb-12">
                    <h2 className="text-4xl lg:text-5xl font-black uppercase tracking-tight italic flex items-center gap-8 text-muted-foreground/40 leading-none pl-4">
                        <Activity size={40} className="text-primary animate-pulse" strokeWidth={2.5} /> Active Amendments
                    </h2>
                    <div className="flex flex-wrap gap-4">
                        {['ALL_DIRECTIVES', 'VOTING_ACTIVE', 'PASSED'].map(f => (
                            <button 
                                key={f}
                                onClick={() => setFilter(f)}
                                className={`px-8 py-3 rounded-full text-[10px] font-black uppercase tracking-[0.4em] italic transition-all border-2 leading-none active:scale-95 ${filter === f ? 'bg-primary text-primary-foreground border-primary shadow-xl shadow-primary/20' : 'bg-transparent text-muted-foreground/40 border-border hover:border-primary/40 hover:text-foreground'}`}
                            >
                                {f.replace('_', ' ')}
                            </button>
                        ))}
                    </div>
                </div>
                
                <div className="space-y-10">
                    <AnimatePresence mode="popLayout">
                    {filteredProposals.map((proposal, i) => (
                        <motion.div 
                            layout
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            exit={{ opacity: 0, scale: 0.98 }}
                            transition={{ duration: 0.6, ease: "circOut" }}
                            key={proposal.id} 
                            className="bg-background border-2 border-border rounded-[4rem] p-10 lg:p-14 backdrop-blur-3xl relative overflow-hidden group hover:border-primary/40 transition-all flex flex-col gap-12 shadow-xl shadow-inner"
                        >
                             <div className="absolute inset-y-0 left-0 w-2 bg-primary scale-y-0 group-hover:scale-y-100 transition-transform origin-top z-10" />
                             <div className="absolute top-0 right-0 p-12 opacity-[0.02] group-hover:scale-125 transition-transform duration-3000">
                                <Binary size={250} className="text-primary" />
                             </div>

                             <div className="flex flex-col xl:flex-row justify-between items-start xl:items-center gap-12 relative z-20">
                                <div className="space-y-6 flex-1">
                                    <div className="flex items-center gap-6">
                                        <span className="text-[11px] font-mono font-black text-primary bg-primary/10 border-2 border-primary/20 px-6 py-2 rounded-full uppercase tracking-[0.5em] italic leading-none shadow-sm">HIP-{proposal.hipNumber.toString().padStart(4, '0')}</span>
                                        {(proposal.status === 'Active' || proposal.status === 'Draft') && (
                                            <div className="flex items-center gap-4">
                                               <span className="h-2 w-2 rounded-full bg-primary animate-ping shadow-[0_0_10px_hsl(var(--primary))]" />
                                               <span className="text-[10px] font-black text-primary uppercase tracking-[0.6em] italic animate-pulse leading-none">RESONATING</span>
                                            </div>
                                        )}
                                    </div>
                                    <h3 className="text-4xl lg:text-5xl font-black text-muted-foreground/60 group-hover:text-foreground transition-colors italic tracking-tighter leading-none line-clamp-2 uppercase">&quot;{proposal.title}&quot;</h3>
                                    <div className="flex items-center gap-4 text-[11px] font-black text-muted-foreground/20 uppercase tracking-[0.4em] italic leading-none pl-1">
                                       <Terminal size={16} strokeWidth={3} className="text-primary/40" /> Proposed_by: <span className="text-primary">{proposal.authorId.slice(0, 8)}...{proposal.authorId.slice(-4)}</span>
                                    </div>
                                </div>
                                <div className="text-left xl:text-right space-y-4 shrink-0 pr-6">
                                    <div className="text-[11px] text-muted-foreground/10 uppercase tracking-[0.4em] md:tracking-[0.8em] font-black italic leading-none mb-1">Consensus_Status</div>
                                    <div className={`text-4xl font-black uppercase tracking-tighter italic leading-none ${proposal.status === 'Accepted' ? 'text-green-500' : 'text-primary animate-pulse'}`}>{proposal.status}</div>
                                </div>
                             </div>

                             <div className="space-y-6 relative z-20">
                                 <div className="flex justify-between items-end text-[11px] font-black uppercase tracking-[0.5em] italic leading-none px-2">
                                     <span className="text-muted-foreground/20 flex items-center gap-4"><Layers size={20} className="text-primary/40" strokeWidth={2.5} /> Sync Progress</span>
                                     <span className="text-foreground flex items-center gap-4"><Activity size={20} className="text-primary" strokeWidth={2.5} /> {Math.min((proposal.resonance / 10), 100).toFixed(1)}% ({proposal.voteCount} Votes)</span>
                                 </div>
                                 <div className="h-4 w-full bg-muted border-2 border-border rounded-full overflow-hidden p-[1px] shadow-inner">
                                     <motion.div 
                                        initial={{ width: 0 }}
                                        animate={{ width: `${Math.min((proposal.resonance / 10), 100)}%` }}
                                        transition={{ duration: 1.5, ease: "circOut" }}
                                        className={`h-full rounded-full shadow-lg ${proposal.status === 'Accepted' ? 'bg-green-500' : 'bg-primary'}`}
                                     />
                                 </div>
                             </div>
                        </motion.div>
                    ))}
                    </AnimatePresence>
                </div>

                <div className="p-16 lg:p-24 border-2 border-dashed border-border rounded-[4rem] bg-foreground/[0.01] text-center space-y-10 group hover:border-primary/40 transition-all shadow-inner relative overflow-hidden">
                     <div className="absolute top-0 right-0 p-12 opacity-[0.01] group-hover:scale-110 transition-transform duration-2000">
                        <Plus size={200} className="text-primary" />
                     </div>
                     <div className="w-24 h-24 bg-background border-2 border-border rounded-[2.5rem] flex items-center justify-center mx-auto group-hover:scale-110 group-hover:bg-primary/5 group-hover:border-primary/40 transition-all shadow-xl">
                        <Plus size={48} className="text-muted-foreground/20 group-hover:text-primary" strokeWidth={3} />
                     </div>
                     <div className="space-y-6 relative z-10">
                        <h3 className="text-4xl font-black uppercase italic tracking-tighter leading-none text-muted-foreground/40 group-hover:text-foreground transition-colors">Draft Amendment</h3>
                        <p className="text-muted-foreground/40 text-2xl font-light leading-relaxed italic max-w-2xl mx-auto tracking-tight">
                           Initialize a new protocol directive for the OMEGA ecosystem. 
                           <span className="text-primary/60"> Security deposit</span> of 1,000 $VALLE required.
                        </p>
                        <Link href="/governance" className="inline-flex mt-10 px-16 py-6 bg-foreground text-background font-black uppercase tracking-[0.6em] text-[11px] rounded-full hover:bg-primary hover:text-primary-foreground hover:scale-[1.05] active:scale-[0.95] transition-all italic leading-none group/draft border-0 shadow-2xl items-center gap-6">
                           Construct Directive <ArrowRight size={20} className="group-hover/draft:translate-x-4 transition-transform" strokeWidth={3} />
                        </Link>
                     </div>
                </div>
            </div>

            {/* RIGHT: COUNCIL CHAMBER */}
            <div className="lg:col-span-4 space-y-16 lg:sticky lg:top-32 h-fit pb-40">
                
                {/* COUNCIL CHAMBER SHARD */}
                <div className="bg-primary/5 border-2 border-primary/20 rounded-[4rem] p-12 space-y-12 relative overflow-hidden group shadow-xl shadow-inner backdrop-blur-3xl">
                    <div className="absolute top-0 right-0 p-10 opacity-[0.03] group-hover:scale-125 transition-transform duration-3000">
                        <Lock size={150} className="text-primary" />
                    </div>
                    <div className="absolute top-0 left-0 w-full h-[2px] bg-gradient-to-r from-transparent via-primary/50 to-transparent" />
                    
                    <div className="space-y-6 relative z-10">
                        <h2 className="text-4xl font-black uppercase tracking-tight italic text-foreground group-hover:text-primary transition-colors leading-none pr-4">Council Chamber</h2>
                        <div className="h-[2px] w-24 bg-primary/40" />
                        <p className="text-2xl text-muted-foreground/40 font-light leading-relaxed italic tracking-tight"> 
                           &quot;The architect&apos;s voice is the foundation of the protocol. Access limited to verified sovereign nodes with level 4 clearance.&quot; 
                        </p>
                    </div>
                    
                    <div className="space-y-6 relative z-10">
                        <button className="w-full py-8 bg-primary text-primary-foreground font-black uppercase tracking-[0.4em] md:tracking-[0.8em] rounded-[2rem] hover:scale-[1.03] active:scale-[0.97] transition-all text-[11px] shadow-[0_20px_40px_rgba(var(--primary),0.3)] italic leading-none flex items-center justify-center gap-6 border-0 group/btn">
                            Connect Delegate Shard <Radio size={20} className="animate-pulse" strokeWidth={3} />
                        </button>
                        <Link href="/governance" className="w-full py-8 border-2 border-border bg-background text-muted-foreground/40 hover:text-foreground hover:border-primary/40 font-black uppercase tracking-[0.6em] rounded-[2rem] hover:bg-primary/5 transition-all text-[11px] italic leading-none active:scale-95 flex items-center justify-center shadow-inner">
                            View Voting Ledger
                        </Link>
                    </div>
                </div>

                {/* NEURAL CONSENSUS PANEL */}
                <div className="bg-background border-2 border-border rounded-[4rem] p-12 space-y-10 backdrop-blur-3xl relative overflow-hidden group shadow-xl shadow-inner">
                     <div className="absolute top-0 right-0 p-12 opacity-[0.02] group-hover:scale-125 transition-transform duration-3000">
                        <Orbit size={200} className="text-primary" />
                     </div>
                     <div className="flex items-center gap-8 text-muted-foreground/40 relative z-10 border-b-2 border-border pb-10">
                         <div className="p-6 bg-muted border-2 border-border rounded-2xl text-primary group-hover:scale-110 group-hover:border-primary/40 transition-all shadow-inner shadow-lg">
                            <Cpu size={32} strokeWidth={2.5} />
                         </div>
                         <div className="space-y-2">
                           <h3 className="text-[12px] font-black uppercase tracking-[0.4em] md:tracking-[0.8em] italic leading-none text-foreground">Neural Consensus</h3>
                           <div className="text-[10px] text-muted-foreground/10 font-black uppercase italic tracking-[0.4em] leading-none">HIVE_MIND_SYNC</div>
                         </div>
                     </div>
                     <p className="text-2xl text-muted-foreground/40 leading-relaxed italic font-light relative z-10 tracking-tight group-hover:text-foreground transition-colors duration-1000"> 
                        Real-time neural consensus is achieved through the entanglement of 58,000+ individual cognitive shards, ensuring the protocol remains immutable yet adaptive. 
                     </p>
                     <div className="flex items-center gap-6 pt-4 text-[11px] font-black uppercase tracking-[0.6em] text-primary italic relative z-10 animate-pulse leading-none">
                         <Wifi size={20} strokeWidth={3} /> ENTANGLEMENT_ACTIVE_v7.0.4
                     </div>
                </div>

                {/* SECURITY PROTOCOL BANNER */}
                <div className="p-8 bg-background border-2 border-border rounded-[3rem] flex items-center gap-10 group hover:border-primary/40 transition-all shadow-xl shadow-inner">
                   <div className="w-20 h-20 bg-primary/10 border-2 border-primary/20 rounded-[1.5rem] flex items-center justify-center text-primary shrink-0 group-hover:bg-primary group-hover:text-primary-foreground transition-all group-hover:scale-110 shadow-lg">
                      <ShieldCheck size={32} strokeWidth={3} className="animate-pulse" />
                   </div>
                   <div className="space-y-3">
                      <div className="text-[11px] font-black uppercase tracking-[0.4em] md:tracking-[0.8em] italic text-muted-foreground/20 leading-none group-hover:text-primary transition-colors">LegislativePrimes_H1</div>
                      <p className="text-[11px] text-muted-foreground/40 italic leading-relaxed group-hover:text-foreground transition-colors font-light">Hard-locked primitives. Amendments require 75% multi-sig verification.</p>
                   </div>
                </div>
            </div>
        </div>

        {/* ── FOOTER SIGNAL ── */}
        <section className="pt-20 pb-12 text-center space-y-16">
            <div className="w-full flex justify-center gap-4">
               <div className="w-4 h-4 rounded-full bg-primary shadow-[0_0_20px_hsl(var(--primary))]" />
               <div className="w-4 h-4 rounded-full bg-muted/20" />
               <div className="w-4 h-4 rounded-full bg-muted/20" />
            </div>
            <Link href="/" className="inline-flex items-center gap-10 text-[12px] font-black uppercase tracking-[1rem] text-muted-foreground/10 hover:text-primary transition-all italic group active:scale-95 leading-none pl-4 pr-4">
                <ChevronLeft size={28} className="group-hover:-translate-x-6 transition-transform" strokeWidth={3} /> Return to Core Shard
            </Link>
        </section>

      </main>

      <style jsx global>{`
        .neural-grid {
          background-image: linear-gradient(hsla(var(--primary), 0.05) 1px, transparent 1px), 
                            linear-gradient(90deg, hsla(var(--primary), 0.05) 1px, transparent 1px);
          background-size: 80px 80px;
        }
        .scrollbar-hide::-webkit-scrollbar { display: none; }
      `}</style>
    </div>
  );
}
