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
  ArrowRight
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
              JUDICIAL_v7.0_SYNC
           </div>
        </div>
      </header>

      <main className="relative z-10 max-w-[1700px] mx-auto px-6 md:px-12 lg:px-24 pt-16 md:pt-24 lg:pt-32 space-y-16 md:space-y-32 flex-1 flex flex-col">
        
        {/* ── HEADER SECTION ── */}
        <motion.div 
          initial={{ opacity: 0, y: 40 }}
          animate={{ opacity: 1, y: 0 }}
          className="flex flex-col lg:flex-row justify-between items-end gap-16 border-b-2 border-white/5 pb-16"
        >
          <div className="space-y-12 max-w-5xl">
            <div className="inline-flex items-center gap-4 px-6 py-2.5 bg-white/[0.03] border border-white/5 rounded-full backdrop-blur-3xl shadow-2xl">
              <Gavel size={20} className="text-[#ff6b2b]" />
              <span className="text-[11px] font-black tracking-[0.8em] text-[#ff6b2b] uppercase italic leading-none pl-1">Judicial Integration Layer</span>
            </div>
            <div className="space-y-8">
              <h1 className="text-7xl md:text-[10rem] font-black uppercase tracking-tighter italic leading-[0.8] italic pl-1 text-white/95">
                Sovereign<br/>
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-white via-white/80 to-[#ff6b2b]/30">Justice Court.</span>
              </h1>
              <p className="text-2xl md:text-3xl text-white/30 max-w-4xl leading-relaxed font-light italic tracking-tight">
                High-fidelity arbitration for the machine age. 
                <span className="text-white/60"> Every dispute</span> is resolved via immutable ledger logic and autonomous oversight.
              </p>
            </div>
          </div>

          <div className="flex gap-10 items-center shrink-0">
               <div className="grid grid-cols-1 sm:grid-cols-2 gap-8">
                  <div className="p-8 md:p-10 bg-[#050505] border-2 border-white/10 rounded-[2.5rem] md:rounded-[3.5rem] min-w-[220px] text-center space-y-4 shadow-[0_40px_80px_rgba(0,0,0,0.8)] backdrop-blur-3xl group hover:border-[#ff6b2b]/30 transition-all">
                      <div className="text-6xl font-black text-white italic tracking-tighter leading-none group-hover:text-[#ff6b2b] transition-colors">14,821</div>
                      <div className="text-[11px] text-white/20 font-black uppercase tracking-[0.4em] italic leading-none">Total_Resolutions</div>
                  </div>
                  <div className="p-8 md:p-10 bg-[#ff6b2b]/5 border-2 border-[#ff6b2b]/20 rounded-[2.5rem] md:rounded-[3.5rem] min-w-[220px] text-center space-y-4 shadow-[0_40px_80px_rgba(255,107,43,0.1)] backdrop-blur-3xl group hover:scale-[1.03] transition-all">
                      <div className="text-6xl font-black text-[#ff6b2b] italic tracking-tighter leading-none">100%</div>
                      <div className="text-[11px] text-[#ff6b2b]/40 font-black uppercase tracking-[0.4em] italic leading-none">Integrity_Rating</div>
                  </div>
               </div>
          </div>
        </motion.div>

        <div className="grid lg:grid-cols-12 gap-16 items-start">
           
           {/* LEFT: COMMAND FILTERS */}
           <div className="lg:col-span-4 space-y-12 lg:sticky lg:top-32 h-fit">
              <div className="bg-[#050505] border-2 border-white/10 p-8 md:p-12 responsive-rounded backdrop-blur-3xl space-y-12 shadow-[0_60px_120px_rgba(0,0,0,0.95)] relative overflow-hidden group transition-all">
                <div className="absolute top-0 right-0 p-12 opacity-[0.01] group-hover:scale-125 transition-transform duration-2000">
                    <Search size={250} className="text-[#ff6b2b]" />
                </div>
                
                <div className="text-[12px] font-black text-white/20 uppercase tracking-[0.8em] flex items-center gap-6 italic relative z-10 leading-none pl-2">
                   <Target size={24} strokeWidth={3} className="text-[#ff6b2b]" /> Case Registry
                </div>
                
                <div className="space-y-10 relative z-10 pl-2">
                   <div className="relative group/search">
                      <Search className="absolute left-8 top-1/2 -translate-y-1/2 text-white/10 group-focus-within/search:text-[#ff6b2b] transition-colors" size={24} strokeWidth={2.5} />
                      <input 
                        type="text" 
                        placeholder="Search Registry Hash..."
                        className="w-full bg-black border-2 border-white/5 rounded-[2.5rem] pl-20 pr-10 py-8 text-xl outline-none focus:border-[#ff6b2b]/40 focus:bg-[#ff6b2b]/5 transition-all italic text-white placeholder:text-white/5 tracking-tight shadow-inner"
                      />
                   </div>

                   <div className="space-y-6">
                      <p className="text-[10px] font-black uppercase tracking-[0.6em] text-white/10 italic leading-none pl-2">Filter_by_Status</p>
                      <div className="flex flex-col gap-4">
                        {['ALL_CASES', 'PENDING_AUDIT', 'RESOLVED', 'RECALIBRATING'].map((f) => (
                           <button 
                             key={f} 
                             onClick={() => setFilter(f)}
                             className={`w-full flex items-center justify-between px-10 py-6 rounded-[2rem] text-[11px] font-black uppercase tracking-[0.4em] transition-all italic border-2 ${filter === f ? 'bg-[#ff6b2b] text-black border-[#ff6b2b] shadow-[0_30px_60px_rgba(255,107,43,0.2)]' : 'bg-black border-white/5 text-white/20 hover:border-white/20 hover:text-white'}`}
                           >
                             {f} <ChevronRight size={18} strokeWidth={3} className={filter === f ? 'translate-x-1' : ''} />
                           </button>
                        ))}
                      </div>
                   </div>
                </div>
              </div>

              {/* CRITICAL OVERSIGHT HUD */}
              <div className="bg-[#ff6b2b]/5 border-2 border-[#ff6b2b]/20 p-8 md:p-12 responsive-rounded backdrop-blur-3xl space-y-12 shadow-[0_60px_120px_rgba(255,107,43,0.1)] group hover:border-[#ff6b2b]/40 transition-all relative overflow-hidden shadow-inner">
                 <div className="absolute top-0 right-0 p-10 opacity-[0.02] group-hover:scale-125 transition-transform duration-1000">
                    <ShieldHalf size={200} className="text-[#ff6b2b]" />
                 </div>
                 <div className="text-[12px] font-black text-[#ff6b2b] uppercase tracking-[1em] flex items-center gap-6 italic leading-none pl-2 animate-pulse">
                   <ShieldAlert size={24} strokeWidth={3} /> Critical Oversight
                 </div>
                 <div className="space-y-8 relative z-10 pl-2">
                   <p className="text-2xl font-light text-white/40 italic leading-relaxed group-hover:text-white/60 transition-colors duration-700">
                     "Justice is not an opinion; it is a mathematical certainty. The Sovereign Protocol ensures that truth is the only output of every judicial cycle."
                   </p>
                   <div className="pt-4">
                      <div className="inline-flex items-center gap-4 px-6 py-2.5 bg-[#ff6b2b]/10 border border-[#ff6b2b]/20 text-[10px] font-black text-[#ff6b2b] uppercase tracking-[0.5em] rounded-full italic leading-none">TRUTH_SYNC_STATUS: ACTIVE</div>
                   </div>
                 </div>
              </div>
           </div>

           {/* RIGHT: JUDICIAL LEDGER */}
           <div className="lg:col-span-8 space-y-16">
              <div className="bg-[#050505] border-2 border-white/10 rounded-[5rem] overflow-hidden shadow-[0_80px_150px_rgba(0,0,0,1)]">
                 <div className="p-12 lg:px-16 border-b-2 border-white/5 flex justify-between items-center bg-white/[0.01]">
                    <h2 className="text-4xl lg:text-5xl font-black uppercase tracking-tighter italic flex items-center gap-8 text-white/40 leading-none pl-4">
                      <Scale size={40} className="text-[#ff6b2b]" strokeWidth={2.5} /> Judicial Ledger
                    </h2>
                    <div className="px-8 py-3 bg-[#ff6b2b]/10 border border-[#ff6b2b]/20 rounded-full text-[11px] text-[#ff6b2b] font-black uppercase tracking-[0.5em] animate-pulse italic leading-none">LIVE_AUDIT_STREAM</div>
                 </div>

                 <div className="divide-y-2 divide-white/5">
                   {RECENT_CASES.map((case_item) => (
                      <div 
                        key={case_item.id}
                        className="p-12 lg:p-16 flex flex-col md:flex-row justify-between items-start md:items-center gap-12 group hover:bg-[#ff6b2b]/5 transition-all cursor-crosshair relative overflow-hidden"
                      >
                         <div className="absolute inset-y-0 left-0 w-2 bg-[#ff6b2b] scale-y-0 group-hover:scale-y-100 transition-transform origin-top" />
                         
                         <div className="flex items-start gap-10 relative z-10">
                            <div className="w-20 h-20 bg-black border-2 border-white/5 rounded-[2.5rem] flex items-center justify-center text-white/10 group-hover:text-[#ff6b2b] group-hover:border-[#ff6b2b]/40 transition-all shadow-inner group-hover:scale-110">
                                <Database size={32} strokeWidth={2.5} />
                            </div>
                            <div className="space-y-4 pt-1">
                               <div className="text-3xl font-black text-white/80 group-hover:text-white transition-colors uppercase italic tracking-tighter leading-none">{case_item.title}</div>
                               <div className="flex flex-wrap items-center gap-6 text-[11px] font-black uppercase tracking-[0.4em] text-white/10 italic leading-none">
                                  <span className="flex items-center gap-3"><Terminal size={14} strokeWidth={3} /> ID: {case_item.id}</span>
                                  <span className="text-white/5">•</span>
                                  <span className="flex items-center gap-3"><Clock size={14} strokeWidth={3} /> {case_item.time}</span>
                                  <span className="text-white/5">•</span>
                                  <span className="flex items-center gap-3"><Gavel size={14} strokeWidth={3} /> {case_item.judge}</span>
                               </div>
                            </div>
                         </div>
                         
                         <div className="flex items-center gap-12 relative z-10 w-full md:w-auto justify-between md:justify-end">
                             <div className="text-right space-y-2">
                                 <div className="text-[10px] text-white/10 uppercase tracking-[0.5em] font-black italic mb-1 leading-none">Resonance</div>
                                 <div className="text-4xl font-black text-white italic tracking-tighter group-hover:text-[#ff6b2b] transition-colors leading-none">{case_item.resonance}</div>
                             </div>
                             <div className={`px-8 py-3 rounded-full text-[11px] font-black uppercase tracking-[0.4em] italic border-2 transition-all leading-none ${case_item.status === 'RESOLVED' ? 'bg-[#ff6b2b]/10 border-[#ff6b2b]/20 text-[#ff6b2b] shadow-2xl' : 'bg-white/5 border-white/10 text-white/20'}`}>
                                 {case_item.status}
                             </div>
                         </div>
                      </div>
                   ))}
                 </div>

                 <div className="p-16 border-t-2 border-white/5 flex justify-center bg-white/[0.01] group cursor-pointer active:bg-[#ff6b2b]/5 transition-all">
                    <div className="flex items-center gap-6 text-[12px] font-black uppercase tracking-[0.8em] text-white/10 group-hover:text-[#ff6b2b] transition-all italic leading-none pl-4">
                       Expand Full Judicial Archives <ArrowRight size={24} className="group-hover:translate-x-4 transition-transform" strokeWidth={3} />
                    </div>
                 </div>
              </div>

              {/* STATS CLUSTER */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
                 <div className="bg-[#050505] border-2 border-white/5 p-12 rounded-[5rem] backdrop-blur-3xl shadow-[0_40px_80px_rgba(0,0,0,0.8)] space-y-8 group hover:border-[#ff6b2b]/20 transition-all shadow-inner">
                    <div className="flex items-center gap-6 text-[11px] font-black uppercase tracking-[0.6em] text-white/10 italic leading-none pl-1">
                       <Orbit size={24} className="text-[#ff6b2b]" /> Consensus_Voters
                    </div>
                    <div className="flex justify-between items-end pl-1">
                       <span className="text-6xl font-black text-white italic tracking-tighter leading-none group-hover:text-[#ff6b2b] transition-colors">8,242</span>
                       <span className="text-[11px] font-black uppercase tracking-[0.4em] text-white/5 italic">ACTIVE_NODES</span>
                    </div>
                 </div>
                 <div className="bg-[#050505] border-2 border-white/5 p-12 rounded-[5rem] backdrop-blur-3xl shadow-[0_40px_80px_rgba(0,0,0,0.8)] space-y-8 group hover:border-[#ff6b2b]/20 transition-all shadow-inner">
                    <div className="flex items-center gap-6 text-[11px] font-black uppercase tracking-[0.6em] text-white/10 italic leading-none pl-1">
                       <Zap size={24} className="text-[#ff6b2b]" /> Resolution_Speed
                    </div>
                    <div className="flex justify-between items-end pl-1">
                       <span className="text-6xl font-black text-white italic tracking-tighter leading-none group-hover:text-[#ff6b2b] transition-colors">0.8s</span>
                       <span className="text-[11px] font-black uppercase tracking-[0.4em] text-white/5 italic">LATENCY_MS</span>
                    </div>
                 </div>
              </div>
           </div>
        </div>

        {/* ── FOOTER SIGNAL ── */}
        <section className="pt-40 text-center space-y-16">
            <div className="w-full flex justify-center gap-4">
               <div className="w-4 h-4 rounded-full bg-[#ff6b2b] shadow-[0_0_20px_#ff6b2b]" />
               <div className="w-4 h-4 rounded-full bg-white/10" />
               <div className="w-4 h-4 rounded-full bg-white/10" />
            </div>
            <Link href="/" className="inline-flex items-center gap-8 text-[12px] font-black uppercase tracking-[1rem] text-white/10 hover:text-[#ff6b2b] transition-all italic group active:scale-95 leading-none pl-4">
                <ChevronLeft size={24} className="group-hover:-translate-x-4 transition-transform" strokeWidth={3} /> Return to Core Shard
            </Link>
        </section>

      </main>

      {/* BACKGROUND DECOR */}
      <div className="fixed bottom-0 left-0 p-16 opacity-[0.01] pointer-events-none select-none z-0">
          <div className="text-[30vw] font-black italic leading-none uppercase">JUSTICE</div>
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
