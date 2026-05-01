'use client';

import React, { useState, useEffect, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  ShieldCheck, Users, FileText, Vote, Globe, Zap, 
  ChevronRight, Lock, Activity, ArrowRight, TrendingUp,
  Gavel, Scale, Cpu, Terminal, ChevronLeft, Radio,
  Wifi, Target, Plus, Orbit, Grid, ShieldHalf, Clock,
  Binary, Layers, Sparkles, Search, MoreVertical
} from 'lucide-react';
import Link from 'next/link';

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
    <div className="relative min-h-screen bg-background text-foreground font-sans overflow-x-hidden pb-40">
      
      {/* 🌌 AMBIENT CORE */}
      <div className="fixed inset-0 pointer-events-none z-0">
        <div className="absolute top-[-10%] right-[-10%] w-[100vw] h-[100vw] bg-[#ff6b2b]/5 blur-[350px] rounded-full animate-pulse" />
        <div className="absolute bottom-[-10%] left-[-20%] w-[90vw] h-[90vw] bg-[#ff6b2b]/3 blur-[200px] rounded-full" />
        
        {/* Animated Scanning Lines */}
        <div className="absolute inset-0 opacity-[0.05]">
           <div className="h-px w-full bg-gradient-to-r from-transparent via-[#ff6b2b] to-transparent absolute top-1/4 animate-[scan_15s_linear_infinite]" />
           <div className="h-px w-full bg-gradient-to-r from-transparent via-[#ff6b2b] to-transparent absolute top-3/4 animate-[scan_20s_linear_infinite_reverse]" />
        </div>
      </div>

      <header className="relative z-50 w-full px-8 lg:px-14 py-6 flex justify-between items-center bg-background/80 backdrop-blur-3xl border-b border-border">
        <Link href="/" className="inline-flex items-center gap-3 text-muted-foreground hover:text-[#ff6b2b] transition-all text-[11px] font-black uppercase tracking-[0.5em] group italic leading-none active:scale-95">
            <ChevronLeft size={16} className="group-hover:-translate-x-2 transition-transform" /> Core Matrix
        </Link>
        <div className="flex items-center gap-6">
           <div className="px-5 py-2 bg-[#ff6b2b]/10 border border-[#ff6b2b]/20 rounded-full text-[10px] font-black text-[#ff6b2b] uppercase tracking-[0.4em] italic leading-none animate-pulse">
              LEGISLATIVE_v7.0_SYNC
           </div>
        </div>
      </header>

      <main className="relative z-10 max-w-[1600px] mx-auto px-6 md:px-12 lg:px-20 pt-16 md:pt-24 space-y-16 flex-1 flex flex-col">
        
        {/* ── HEADER SECTION ── */}
        <motion.div 
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          className="flex flex-col lg:flex-row justify-between items-end gap-12 border-b border-border pb-12"
        >
          <div className="space-y-8 max-w-4xl">
            <div className="inline-flex items-center gap-3 px-5 py-2 bg-secondary border border-border rounded-full shadow-sm">
              <Gavel size={18} className="text-[#ff6b2b]" />
              <span className="text-[10px] font-black tracking-[0.6em] text-[#ff6b2b] uppercase italic leading-none">Sovereign Legislative Oversight</span>
            </div>
            <div className="space-y-6">
              <h1 className="text-6xl md:text-8xl font-black uppercase tracking-tighter italic leading-[0.85] text-foreground">
                Judiciary<br/>
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-foreground via-foreground/80 to-[#ff6b2b]/40">Oversight.</span>
              </h1>
              <p className="text-xl md:text-2xl text-muted-foreground max-w-3xl leading-relaxed font-light italic tracking-tight">
                The autonomous legislative branch of the OMEGA Intelligence. 
                <span className="text-foreground/70"> Directing the evolution</span> of machine law through human-verified protocol amendments.
              </p>
            </div>
          </div>

          <div className="flex gap-8 items-center shrink-0">
               <div className="p-8 bg-secondary/30 border border-border rounded-[3rem] min-w-[280px] space-y-4 shadow-sm backdrop-blur-xl group relative overflow-hidden">
                  <div className="absolute top-0 right-0 p-6 opacity-[0.05] group-hover:scale-125 transition-transform duration-2000">
                     <Scale size={120} className="text-[#ff6b2b]" />
                  </div>
                  <div className="text-[10px] font-black text-muted-foreground uppercase tracking-[0.4em] italic leading-none">Network Consensus Integrity</div>
                  <div className="text-6xl font-black text-foreground italic tracking-tighter leading-none group-hover:text-[#ff6b2b] transition-colors flex items-baseline gap-2">
                    {stats?.integrityRating || 99.98}% <span className="text-xs text-[#ff6b2b] uppercase tracking-widest font-black">Stable</span>
                  </div>
                  <div className="h-3 w-full bg-background border border-border rounded-full overflow-hidden shadow-inner p-[1px] relative z-20">
                      <div className="h-full bg-[#ff6b2b] shadow-[0_0_20px_rgba(255,107,43,0.4)] rounded-full transition-all duration-1000" style={{ width: `${stats?.integrityRating || 99.98}%` }} />
                  </div>
               </div>
          </div>
        </motion.div>

        {/* ── CORE METRICS ── */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {[
                { title: 'Governance Power', value: stats ? `${(stats.totalVotes / 1000).toFixed(1)}K` : '...', icon: <Vote size={24} />, detail: 'RESONANCE_TRANS' },
                { title: 'Active Proposals', value: stats?.totalProposals || '...', icon: <FileText size={24} />, detail: 'QUEUE_DIRECTIVES' },
                { title: 'Council Members', value: stats?.uniqueVoters || '...', icon: <Users size={24} />, detail: 'VERIFIED_NODES' },
                { title: 'Protocol Version', value: stats?.protocolVersion || '...', icon: <ShieldCheck size={24} />, detail: 'OMEGA_CORE_OS' },
            ].map((stat, i) => (
                <div key={stat.title} className="p-8 bg-secondary/20 border-2 border-border rounded-[2.5rem] backdrop-blur-xl space-y-8 group hover:border-[#ff6b2b]/30 transition-all relative overflow-hidden flex flex-col justify-between h-[260px]">
                     <div className="absolute top-0 right-0 p-8 opacity-[0.03] group-hover:scale-125 transition-transform duration-1000 text-foreground font-black italic uppercase leading-none text-[6rem]">0{i+1}</div>
                     <div className={`p-6 rounded-2xl bg-background border border-border w-fit group-hover:bg-[#ff6b2b] group-hover:text-background group-hover:border-[#ff6b2b]/10 transition-all relative z-10`}>
                         {stat.icon}
                     </div>
                     <div className="space-y-3 relative z-10">
                         <div className="text-[10px] font-black text-muted-foreground uppercase tracking-[0.4em] italic leading-none group-hover:text-foreground transition-colors">{stat.title}</div>
                         <div className="text-4xl font-black text-foreground italic tracking-tighter leading-none group-hover:text-[#ff6b2b] transition-colors truncate">{stat.value}</div>
                         <div className="text-[9px] text-muted-foreground/60 font-black uppercase italic tracking-[0.3em]">{stat.detail}</div>
                     </div>
                </div>
            ))}
        </div>

        <div className="grid lg:grid-cols-12 gap-12 items-start">
            
            {/* LEFT: AMENDMENTS GRID */}
            <div className="lg:col-span-8 space-y-16">
                <div className="flex flex-col md:flex-row md:items-center justify-between gap-8 border-b border-border pb-8">
                    <h2 className="text-3xl font-black uppercase tracking-tight italic flex items-center gap-4 text-muted-foreground leading-none">
                        <Activity size={32} className="text-[#ff6b2b] animate-pulse" strokeWidth={2.5} /> Active Amendments
                    </h2>
                    <div className="flex gap-3">
                        {['ALL_DIRECTIVES', 'VOTING_ACTIVE', 'PASSED'].map(f => (
                            <button 
                                key={f}
                                onClick={() => setFilter(f)}
                                className={`px-5 py-2 rounded-full text-[9px] font-black uppercase tracking-[0.3em] italic transition-all border ${filter === f ? 'bg-[#ff6b2b] text-background border-[#ff6b2b]' : 'bg-transparent text-muted-foreground border-border hover:border-foreground/20'}`}
                            >
                                {f.replace('_', ' ')}
                            </button>
                        ))}
                    </div>
                </div>
                
                <div className="space-y-8">
                    <AnimatePresence mode="popLayout">
                    {filteredProposals.map((proposal, i) => (
                        <motion.div 
                            layout
                            initial={{ opacity: 0, y: 15 }}
                            animate={{ opacity: 1, y: 0 }}
                            exit={{ opacity: 0, scale: 0.98 }}
                            key={proposal.id} 
                            className="bg-secondary/20 border-2 border-border rounded-[2.5rem] p-8 md:p-10 backdrop-blur-xl relative overflow-hidden group hover:border-[#ff6b2b]/40 transition-all flex flex-col gap-10"
                        >
                             <div className="absolute inset-y-0 left-0 w-1.5 bg-[#ff6b2b] scale-y-0 group-hover:scale-y-100 transition-transform origin-top z-10" />
                             <div className="absolute top-0 right-0 p-8 opacity-[0.02] group-hover:scale-125 transition-transform duration-3000">
                                <Binary size={200} className="text-[#ff6b2b]" />
                             </div>

                             <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-8 relative z-20">
                                <div className="space-y-4">
                                    <div className="flex items-center gap-4">
                                        <span className="text-[10px] font-mono font-black text-[#ff6b2b] bg-[#ff6b2b]/10 border border-[#ff6b2b]/20 px-4 py-1.5 rounded-full uppercase tracking-[0.4em] italic leading-none">HIP-{proposal.hipNumber.toString().padStart(4, '0')}</span>
                                        {(proposal.status === 'Active' || proposal.status === 'Draft') && (
                                            <div className="flex items-center gap-2">
                                               <span className="h-2 w-2 rounded-full bg-[#ff6b2b] animate-ping shadow-[0_0_10px_#ff6b2b]" />
                                               <span className="text-[9px] font-black text-[#ff6b2b] uppercase tracking-[0.5em] italic animate-pulse leading-none">RESONATING</span>
                                            </div>
                                        )}
                                    </div>
                                    {/* Truncate line clamp applied here */}
                                    <h3 className="text-3xl font-black text-muted-foreground group-hover:text-foreground transition-colors italic tracking-tight leading-tight line-clamp-2">"{proposal.title}"</h3>
                                    <div className="flex items-center gap-3 text-[10px] font-black text-muted-foreground/60 uppercase tracking-[0.3em] italic leading-none">
                                       <Terminal size={14} strokeWidth={2.5} className="text-[#ff6b2b]/60" /> Proposed_by: {proposal.authorId.slice(0, 8)}...{proposal.authorId.slice(-4)}
                                    </div>
                                </div>
                                <div className="text-left md:text-right space-y-3 shrink-0">
                                    <div className="text-[9px] text-muted-foreground/60 uppercase tracking-[0.6em] font-black italic leading-none">Consensus_Status</div>
                                    <div className={`text-2xl font-black uppercase tracking-wider italic leading-none ${proposal.status === 'Accepted' ? 'text-green-500' : 'text-[#ff6b2b] animate-pulse'}`}>{proposal.status}</div>
                                </div>
                             </div>

                             <div className="space-y-4 relative z-20">
                                 <div className="flex justify-between items-end text-[10px] font-black uppercase tracking-[0.4em] italic leading-none">
                                     <span className="text-muted-foreground flex items-center gap-3"><Layers size={16} className="text-[#ff6b2b]/40" /> Sync Progress</span>
                                     <span className="text-foreground flex items-center gap-3"><Activity size={16} className="text-[#ff6b2b]" /> {Math.min((proposal.resonance / 10), 100).toFixed(1)}% ({proposal.voteCount} Votes)</span>
                                 </div>
                                 <div className="h-3 w-full bg-background border border-border rounded-full overflow-hidden p-[1px]">
                                     <motion.div 
                                        initial={{ width: 0 }}
                                        animate={{ width: `${Math.min((proposal.resonance / 10), 100)}%` }}
                                        transition={{ duration: 1.5, ease: "circOut" }}
                                        className={`h-full rounded-full ${proposal.status === 'Accepted' ? 'bg-green-500' : 'bg-[#ff6b2b]'}`}
                                     />
                                 </div>
                             </div>
                        </motion.div>
                    ))}
                    </AnimatePresence>
                </div>

                <div className="p-10 lg:p-14 border-2 border-dashed border-border rounded-[3rem] bg-secondary/10 text-center space-y-8 group hover:border-[#ff6b2b]/30 transition-all">
                     <div className="w-16 h-16 bg-background border border-border rounded-2xl flex items-center justify-center mx-auto group-hover:scale-110 group-hover:bg-[#ff6b2b]/10 group-hover:border-[#ff6b2b]/40 transition-all">
                        <Plus size={32} className="text-muted-foreground group-hover:text-[#ff6b2b]" strokeWidth={2.5} />
                     </div>
                     <div className="space-y-4">
                        <h3 className="text-3xl font-black uppercase italic tracking-tight leading-none text-muted-foreground group-hover:text-foreground transition-colors">Draft Amendment</h3>
                        <p className="text-muted-foreground text-lg font-light leading-relaxed italic max-w-xl mx-auto">
                           Initialize a new protocol directive for the OMEGA ecosystem. 
                           <span className="text-[#ff6b2b]/80"> Security deposit</span> of 1,000 $VALLE required.
                        </p>
                        <Link href="/governance" className="inline-block mt-6 px-12 py-4 bg-foreground text-background font-black uppercase tracking-[0.4em] text-[10px] rounded-full hover:bg-[#ff6b2b] hover:text-black hover:scale-[1.02] active:scale-[0.98] transition-all italic leading-none group/draft">
                           Construct Directive <ArrowRight size={16} className="inline ml-2 group-hover/draft:translate-x-2 transition-transform" strokeWidth={2.5} />
                        </Link>
                     </div>
                </div>
            </div>

            {/* RIGHT: COUNCIL CHAMBER */}
            <div className="lg:col-span-4 space-y-10 lg:sticky lg:top-28">
                
                {/* COUNCIL CHAMBER SHARD */}
                <div className="bg-[#ff6b2b]/5 border-2 border-[#ff6b2b]/20 rounded-[2.5rem] p-8 space-y-10 relative overflow-hidden group">
                    <div className="absolute top-0 right-0 p-8 opacity-[0.05] group-hover:scale-125 transition-transform duration-3000">
                        <Lock size={120} className="text-[#ff6b2b]" />
                    </div>
                    <div className="space-y-4 relative z-10">
                        <h2 className="text-3xl font-black uppercase tracking-tight italic text-foreground group-hover:text-[#ff6b2b] transition-colors leading-none">Council Chamber</h2>
                        <div className="h-px w-20 bg-[#ff6b2b]/40" />
                        <p className="text-lg text-muted-foreground font-light leading-relaxed italic tracking-tight"> 
                           "The architect's voice is the foundation of the protocol. Access limited to verified sovereign nodes with level 4 clearance." 
                        </p>
                    </div>
                    
                    <div className="space-y-4 relative z-10">
                        <button className="w-full py-6 bg-[#ff6b2b] text-black font-black uppercase tracking-[0.5em] rounded-2xl hover:opacity-90 active:scale-[0.98] transition-all text-[10px] shadow-[0_0_20px_rgba(255,107,43,0.2)] italic leading-none flex items-center justify-center gap-4">
                            Connect Delegate Shard <Radio size={16} className="animate-pulse" strokeWidth={2.5} />
                        </button>
                        <Link href="/governance" className="w-full py-6 border-2 border-border bg-background text-muted-foreground hover:text-foreground hover:border-[#ff6b2b]/30 font-black uppercase tracking-[0.4em] rounded-2xl hover:bg-secondary/50 transition-all text-[10px] italic leading-none active:scale-95 flex items-center justify-center">
                            View Voting Ledger
                        </Link>
                    </div>
                </div>

                {/* NEURAL CONSENSUS PANEL */}
                <div className="bg-secondary/20 border-2 border-border rounded-[2.5rem] p-8 space-y-8 backdrop-blur-xl relative overflow-hidden group">
                     <div className="absolute top-0 right-0 p-8 opacity-[0.03] group-hover:scale-125 transition-transform duration-3000">
                        <Orbit size={150} className="text-[#ff6b2b]" />
                     </div>
                     <div className="flex items-center gap-6 text-muted-foreground relative z-10 border-b border-border pb-6">
                         <div className="p-4 bg-background border border-border rounded-xl text-[#ff6b2b] group-hover:scale-110 group-hover:border-[#ff6b2b]/30 transition-all">
                            <Cpu size={24} />
                         </div>
                         <div className="space-y-1">
                           <h3 className="text-[10px] font-black uppercase tracking-[0.5em] italic leading-none">Neural Consensus</h3>
                           <div className="text-[9px] text-muted-foreground/60 font-black uppercase italic tracking-[0.2em] leading-none">HIVE_MIND_SYNC</div>
                         </div>
                     </div>
                     <p className="text-lg text-muted-foreground leading-relaxed italic font-light relative z-10 tracking-tight group-hover:text-foreground transition-colors duration-700"> 
                        Real-time neural consensus is achieved through the entanglement of 58,000+ individual cognitive shards, ensuring the protocol remains immutable yet adaptive. 
                     </p>
                     <div className="flex items-center gap-4 pt-2 text-[9px] font-black uppercase tracking-[0.3em] text-[#ff6b2b] italic relative z-10 animate-pulse leading-none">
                         <Wifi size={16} strokeWidth={2.5} /> ENTANGLEMENT_ACTIVE_v7.0.4
                     </div>
                </div>

                {/* SECURITY PROTOCOL BANNER */}
                <div className="p-6 bg-background border-2 border-border rounded-[2.5rem] flex items-center gap-6 group hover:border-[#ff6b2b]/30 transition-all">
                   <div className="w-14 h-14 bg-[#ff6b2b]/10 border border-[#ff6b2b]/20 rounded-2xl flex items-center justify-center text-[#ff6b2b] shrink-0 group-hover:bg-[#ff6b2b] group-hover:text-black transition-all group-hover:scale-105">
                      <ShieldCheck size={24} className="animate-pulse" />
                   </div>
                   <div className="space-y-2">
                      <div className="text-[10px] font-black uppercase tracking-[0.4em] italic text-muted-foreground leading-none group-hover:text-[#ff6b2b] transition-colors">LegislativePrimes_H1</div>
                      <p className="text-[10px] text-muted-foreground/60 italic leading-snug group-hover:text-muted-foreground transition-colors">Hard-locked primitives. Amendments require 75% multi-sig verification.</p>
                   </div>
                </div>
            </div>
        </div>

        {/* ── FOOTER SIGNAL ── */}
        <section className="pt-20 pb-10 text-center space-y-10">
            <div className="w-full flex justify-center gap-3">
               <div className="w-3 h-3 rounded-full bg-[#ff6b2b] shadow-[0_0_10px_#ff6b2b]" />
               <div className="w-3 h-3 rounded-full bg-border" />
               <div className="w-3 h-3 rounded-full bg-border" />
            </div>
            <Link href="/" className="inline-flex items-center gap-4 text-[10px] font-black uppercase tracking-[0.6em] text-muted-foreground hover:text-[#ff6b2b] transition-all italic group active:scale-95 leading-none">
                <ChevronLeft size={18} className="group-hover:-translate-x-2 transition-transform" strokeWidth={2.5} /> Return to Core Shard
            </Link>
        </section>

      </main>
    </div>
  );
}
