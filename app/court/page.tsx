'use client';

import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Gavel, 
  Scale, 
  ShieldAlert, 
  CheckCircle, 
  Database, 
  Search, 
  Filter, 
  Activity, 
  ChevronRight,
  ShieldCheck,
  Zap,
  Globe,
  Radio,
  Wifi,
  Terminal,
  Orbit,
  Grid,
  ShieldHalf,
  Clock,
  ChevronLeft,
  ChevronDown,
  Lock,
  Target,
  Sparkles,
  Layers,
  Star,
  MoreVertical,
  ArrowRight,
  Plus,
  ArrowUpRight,
  Smartphone,
  CreditCard,
  Binary
} from 'lucide-react';
import Link from 'next/link';

const RECENT_CASES = [
  { id: 'CASE-8241-A', title: 'Pact Integrity Audit :: Node_99', status: 'RESOLVED', resonance: '99.9%', time: '2m ago', judge: 'AUTONOMOUS_OMEGA_v7' },
  { id: 'CASE-8245-B', title: 'Asset Translocation Verification :: FI_Core', status: 'IN_REVIEW', resonance: '82.4%', time: '14m ago', judge: 'AUTONOMOUS_OMEGA_v7' },
  { id: 'CASE-8250-C', title: 'Autonomous Labor Dispute :: Skill_Market', status: 'PENDING', resonance: 'N/A', time: '1h ago', judge: 'NEURAL_ARBITRATOR_v2' },
  { id: 'CASE-8255-D', title: 'Sovereign ID Reclamation :: Human_302', status: 'RESOLVED', resonance: '94.2%', time: '3h ago', judge: 'AUTONOMOUS_OMEGA_v7' },
  { id: 'CASE-8260-E', title: 'M2M Pact Conflict :: IoT_Cluster_7', status: 'RESOLVED', resonance: '99.9%', time: '5h ago', judge: 'AUTONOMOUS_OMEGA_v7' },
];

export default function SovereignCourtPage() {
  const [filter, setFilter] = useState('ALL_CASES');

  return (
    <div className="relative min-h-screen bg-background text-foreground font-sans selection:bg-primary/40 selection:text-primary overflow-x-hidden pb-40 transition-colors duration-700 overflow-x-hidden">
      
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

      <header className="relative z-50 w-full p-8 lg:px-14 flex justify-between items-center bg-background/40 backdrop-blur-3xl border-b border-border transition-colors duration-700">
        <Link href="/" className="inline-flex items-center gap-4 text-muted-foreground/40 hover:text-primary transition-all text-[11px] font-black uppercase tracking-[0.6em] group italic active:scale-95 leading-none">
            <ChevronLeft size={16} className="group-hover:-translate-x-2 transition-transform" /> Core Matrix
        </Link>
        <div className="flex items-center gap-6">
           <div className="px-6 py-2.5 bg-primary/10 border border-primary/20 rounded-full text-[10px] font-black text-primary uppercase tracking-[0.4em] italic leading-none animate-pulse">
              JUDICIAL_v7.0_SYNC
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
              <Gavel size={20} className="text-primary" />
              <span className="text-[11px] font-black tracking-[0.4em] md:tracking-[0.8em] text-primary uppercase italic leading-none pl-1">Judicial Integration Layer</span>
            </div>
            <div className="space-y-8">
              <h1 className="text-fluid-hero font-black uppercase tracking-tighter italic leading-[0.9] md:leading-[0.8] text-foreground">
                Sovereign<br/>
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-foreground via-foreground/80 to-primary/30">Justice Court.</span>
              </h1>
              <p className="text-fluid-body text-muted-foreground/40 max-w-4xl leading-relaxed font-light italic tracking-tight">
                High-fidelity arbitration for the machine age. 
                <span className="text-foreground/80"> Every dispute</span> is resolved via immutable ledger logic and autonomous oversight.
              </p>
            </div>
          </div>

          <div className="flex gap-10 items-center shrink-0 w-full lg:w-auto">
               <div className="grid grid-cols-1 sm:grid-cols-2 gap-8 w-full">
                  <div className="p-8 md:p-10 bg-background border-2 border-border rounded-[2.5rem] md:rounded-[3.5rem] min-w-[220px] text-center space-y-6 shadow-xl backdrop-blur-3xl group hover:border-primary/30 transition-all shadow-inner relative overflow-hidden">
                      <div className="absolute top-0 right-0 p-8 opacity-[0.02] group-hover:scale-110 transition-transform duration-1000">
                         <Activity size={120} className="text-primary" />
                      </div>
                      <div className="text-fluid-title font-black text-foreground italic tracking-tighter leading-none group-hover:text-primary transition-colors relative z-10">14,821</div>
                      <div className="text-[11px] text-muted-foreground/20 font-black uppercase tracking-[0.4em] italic leading-none relative z-10">Total_Resolutions</div>
                  </div>
                  <div className="p-8 md:p-10 bg-primary/5 border-2 border-primary/20 rounded-[2.5rem] md:rounded-[3.5rem] min-w-[220px] text-center space-y-6 shadow-xl backdrop-blur-3xl group hover:scale-[1.03] transition-all shadow-inner relative overflow-hidden">
                      <div className="absolute top-0 right-0 p-8 opacity-[0.05] group-hover:scale-110 transition-transform duration-1000">
                         <ShieldCheck size={120} className="text-primary" />
                      </div>
                      <div className="text-fluid-title font-black text-primary italic tracking-tighter leading-none relative z-10">100%</div>
                      <div className="text-[11px] text-primary/40 font-black uppercase tracking-[0.4em] italic leading-none relative z-10">Integrity_Rating</div>
                  </div>
               </div>
          </div>
        </motion.div>

        <div className="grid lg:grid-cols-12 gap-16 items-start">
           
           {/* LEFT: COMMAND FILTERS */}
           <div className="lg:col-span-4 space-y-16 lg:sticky lg:top-32 h-fit">
              <div className="bg-background border-2 border-border p-8 md:p-12 rounded-[4rem] backdrop-blur-3xl space-y-12 shadow-xl relative overflow-hidden group transition-all shadow-inner">
                <div className="absolute top-0 right-0 p-12 opacity-[0.01] group-hover:scale-125 transition-transform duration-2000">
                    <Search size={250} className="text-primary" />
                </div>
                
                <div className="text-[12px] font-black text-muted-foreground/10 uppercase tracking-[0.4em] md:tracking-[0.8em] flex items-center gap-6 italic relative z-10 leading-none pl-2">
                   <Target size={24} strokeWidth={3} className="text-primary" /> Case Registry
                </div>
                
                <div className="space-y-12 relative z-10 pl-2">
                   <div className="relative group/search">
                      <Search className="absolute left-8 top-1/2 -translate-y-1/2 text-muted-foreground/10 group-focus-within/search:text-primary transition-colors" size={24} strokeWidth={3} />
                      <input 
                        type="text" 
                        placeholder="Search Registry Hash..."
                        className="w-full bg-muted border-2 border-border rounded-[2.5rem] pl-20 pr-10 py-8 text-xl outline-none focus:border-primary/40 focus:bg-primary/5 transition-all italic text-foreground placeholder:text-muted-foreground/5 tracking-tight shadow-inner"
                      />
                   </div>

                   <div className="space-y-8">
                      <p className="text-[10px] font-black uppercase tracking-[0.6em] text-muted-foreground/10 italic leading-none pl-2">Filter_by_Status</p>
                      <div className="flex flex-col gap-4">
                        {['ALL_CASES', 'PENDING_AUDIT', 'RESOLVED', 'RECALIBRATING'].map((f) => (
                           <button 
                             key={f} 
                             onClick={() => setFilter(f)}
                             className={`w-full flex items-center justify-between px-10 py-6 rounded-[2rem] text-[11px] font-black uppercase tracking-[0.4em] transition-all italic border-2 ${filter === f ? 'bg-primary text-primary-foreground border-primary shadow-[0_30px_60px_rgba(var(--primary),0.2)]' : 'bg-muted border-border text-muted-foreground/20 hover:border-primary/40 hover:text-foreground'}`}
                           >
                             {f} <ChevronRight size={18} strokeWidth={3} className={filter === f ? 'translate-x-1' : ''} />
                           </button>
                        ))}
                      </div>
                   </div>
                </div>
              </div>

              {/* CRITICAL OVERSIGHT HUD */}
              <div className="bg-primary/5 border-2 border-primary/20 p-8 md:p-12 rounded-[4rem] backdrop-blur-3xl space-y-12 shadow-xl group hover:border-primary/40 transition-all relative overflow-hidden shadow-inner">
                 <div className="absolute top-0 right-0 p-10 opacity-[0.02] group-hover:scale-125 transition-transform duration-2000">
                    <ShieldHalf size={200} className="text-primary" />
                 </div>
                 <div className="text-[12px] font-black text-primary uppercase tracking-[0.5em] md:tracking-[1em] flex items-center gap-6 italic leading-none pl-2 animate-pulse">
                   <ShieldAlert size={24} strokeWidth={3} /> Critical Oversight
                 </div>
                 <div className="space-y-8 relative z-10 pl-2">
                   <p className="text-fluid-body font-light text-muted-foreground/40 italic leading-relaxed group-hover:text-foreground/60 transition-colors duration-700">
                     "Justice is not an opinion; it is a mathematical certainty. The Sovereign Protocol ensures that truth is the only output of every judicial cycle."
                   </p>
                   <div className="pt-4">
                      <div className="inline-flex items-center gap-4 px-6 py-2.5 bg-primary/10 border border-primary/20 text-[10px] font-black text-primary uppercase tracking-[0.5em] rounded-full italic leading-none shadow-sm">TRUTH_SYNC_STATUS: ACTIVE</div>
                   </div>
                 </div>
              </div>
           </div>

           {/* RIGHT: JUDICIAL LEDGER */}
           <div className="lg:col-span-8 space-y-16">
              <div className="bg-background border-2 border-border rounded-[5rem] overflow-hidden shadow-xl shadow-inner">
                 <div className="p-12 lg:px-16 border-b-2 border-border flex justify-between items-center bg-foreground/[0.01]">
                    <h2 className="text-fluid-title lg:text-fluid-balance font-black uppercase tracking-tighter italic flex items-center gap-8 text-muted-foreground/20 leading-none pl-4">
                      <Scale size={40} className="text-primary" strokeWidth={2.5} /> Judicial Ledger
                    </h2>
                    <div className="px-8 py-3 bg-primary/10 border border-primary/20 rounded-full text-[11px] text-primary font-black uppercase tracking-[0.5em] animate-pulse italic leading-none">LIVE_AUDIT_STREAM</div>
                 </div>

                 <div className="divide-y-2 divide-border">
                   {RECENT_CASES.map((case_item) => (
                      <div 
                        key={case_item.id}
                        className="p-12 lg:p-16 flex flex-col xl:flex-row justify-between items-start xl:items-center gap-12 group hover:bg-primary/5 transition-all cursor-crosshair relative overflow-hidden"
                      >
                         <div className="absolute inset-y-0 left-0 w-2 bg-primary scale-y-0 group-hover:scale-y-100 transition-transform origin-top z-20" />
                         
                         <div className="flex items-start gap-10 relative z-10">
                            <div className="w-20 h-20 bg-muted border-2 border-border rounded-[2.5rem] flex items-center justify-center text-muted-foreground/10 group-hover:text-primary group-hover:border-primary/40 transition-all shadow-inner group-hover:scale-110 shrink-0">
                                <Database size={32} strokeWidth={2.5} />
                            </div>
                            <div className="space-y-4 pt-1">
                               <div className="text-3xl font-black text-foreground/80 group-hover:text-foreground transition-colors uppercase italic tracking-tighter leading-none">{case_item.title}</div>
                               <div className="flex flex-wrap items-center gap-6 text-[11px] font-black uppercase tracking-[0.4em] text-muted-foreground/20 italic leading-none">
                                  <span className="flex items-center gap-3"><Terminal size={14} strokeWidth={3} /> ID: {case_item.id}</span>
                                  <span className="text-muted-foreground/5">•</span>
                                  <span className="flex items-center gap-3"><Clock size={14} strokeWidth={3} /> {case_item.time}</span>
                                  <span className="text-muted-foreground/5">•</span>
                                  <span className="flex items-center gap-3"><Gavel size={14} strokeWidth={3} /> {case_item.judge}</span>
                               </div>
                            </div>
                         </div>
                         
                         <div className="flex items-center gap-12 relative z-10 w-full xl:w-auto justify-between xl:justify-end">
                             <div className="text-right space-y-3">
                                 <div className="text-[10px] text-muted-foreground/10 uppercase tracking-[0.6em] font-black italic mb-1 leading-none">Resonance</div>
                                 <div className="text-4xl font-black text-foreground italic tracking-tighter group-hover:text-primary transition-colors leading-none tabular-nums">{case_item.resonance}</div>
                             </div>
                             <div className={`px-10 py-4 rounded-full text-[11px] font-black uppercase tracking-[0.4em] italic border-2 transition-all leading-none shadow-sm ${case_item.status === 'RESOLVED' ? 'bg-primary/10 border-primary/20 text-primary' : 'bg-muted border-border text-muted-foreground/20'}`}>
                                 {case_item.status}
                             </div>
                         </div>
                      </div>
                   ))}
                 </div>

                 <div className="p-16 border-t-2 border-border flex justify-center bg-foreground/[0.01] group cursor-pointer active:bg-primary/5 transition-all">
                    <div className="flex items-center gap-8 text-[12px] font-black uppercase tracking-[0.5em] md:tracking-[1em] text-muted-foreground/10 group-hover:text-primary transition-all italic leading-none pl-4 pr-4">
                       Expand Full Judicial Archives <ArrowRight size={24} className="group-hover:translate-x-6 transition-transform" strokeWidth={3} />
                    </div>
                 </div>
              </div>

              {/* STATS CLUSTER */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
                 <div className="bg-background border-2 border-border p-12 rounded-[5rem] backdrop-blur-3xl shadow-xl space-y-10 group hover:border-primary/20 transition-all shadow-inner relative overflow-hidden">
                    <div className="absolute top-0 right-0 p-8 opacity-[0.02] group-hover:scale-110 transition-transform duration-1000">
                        <Orbit size={120} className="text-primary" />
                    </div>
                    <div className="flex items-center gap-6 text-[11px] font-black uppercase tracking-[0.6em] text-muted-foreground/10 italic leading-none pl-1 relative z-10">
                       <Orbit size={24} className="text-primary" strokeWidth={2.5} /> Consensus_Voters
                    </div>
                    <div className="flex justify-between items-end pl-1 relative z-10">
                       <span className="text-fluid-balance font-black text-foreground italic tracking-tighter leading-none group-hover:text-primary transition-colors tabular-nums">8,242</span>
                       <span className="text-[11px] font-black uppercase tracking-[0.4em] text-muted-foreground/5 italic leading-none mb-1">ACTIVE_NODES</span>
                    </div>
                 </div>
                 <div className="bg-background border-2 border-border p-12 rounded-[5rem] backdrop-blur-3xl shadow-xl space-y-10 group hover:border-primary/20 transition-all shadow-inner relative overflow-hidden">
                    <div className="absolute top-0 right-0 p-8 opacity-[0.02] group-hover:scale-110 transition-transform duration-1000">
                        <Zap size={120} className="text-primary" />
                    </div>
                    <div className="flex items-center gap-6 text-[11px] font-black uppercase tracking-[0.6em] text-muted-foreground/10 italic leading-none pl-1 relative z-10">
                       <Zap size={24} className="text-primary" strokeWidth={2.5} /> Resolution_Speed
                    </div>
                    <div className="flex justify-between items-end pl-1 relative z-10">
                       <span className="text-fluid-balance font-black text-foreground italic tracking-tighter leading-none group-hover:text-primary transition-colors tabular-nums">0.8s</span>
                       <span className="text-[11px] font-black uppercase tracking-[0.4em] text-muted-foreground/5 italic leading-none mb-1">LATENCY_MS</span>
                    </div>
                 </div>
              </div>
           </div>
        </div>

        {/* ── FOOTER SIGNAL ── */}
        <section className="pt-40 text-center space-y-16">
            <div className="w-full flex justify-center gap-4">
               <div className="w-4 h-4 rounded-full bg-primary shadow-[0_0_20px_hsl(var(--primary))]" />
               <div className="w-4 h-4 rounded-full bg-muted/20" />
               <div className="w-4 h-4 rounded-full bg-muted/20" />
            </div>
            <Link href="/" className="inline-flex items-center gap-8 text-[12px] font-black uppercase tracking-[1rem] text-muted-foreground/10 hover:text-primary transition-all italic group active:scale-95 leading-none pl-4 pr-4">
                <ChevronLeft size={24} className="group-hover:-translate-x-6 transition-transform" strokeWidth={3} /> Return to Core Shard
            </Link>
        </section>

      </main>

      {/* BACKGROUND DECOR */}
      <div className="fixed bottom-0 left-0 p-16 opacity-[0.01] pointer-events-none select-none z-0">
          <div className="text-fluid-hero font-black italic leading-none uppercase text-foreground">JUSTICE</div>
      </div>

      <style jsx global>{`
        .neural-grid {
          background-image: linear-gradient(hsla(var(--primary), 0.05) 1px, transparent 1px), 
                            linear-gradient(90deg, hsla(var(--primary), 0.05) 1px, transparent 1px);
          background-size: 80px 80px;
        }
      `}</style>
    </div>
  );
}
