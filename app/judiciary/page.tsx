'use client';

import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  ShieldCheck, 
  Users, 
  FileText, 
  Vote, 
  Globe, 
  Zap, 
  ChevronRight, 
  Lock, 
  Activity,
  ArrowRight,
  TrendingUp,
  Gavel,
  Scale,
  Cpu,
  Terminal,
  ChevronLeft,
  Radio,
  Wifi,
  Target,
  Plus,
  Orbit,
  Grid,
  ShieldHalf,
  Clock,
  Binary,
  Layers,
  Sparkles,
  Search,
  MoreVertical
} from 'lucide-react';
import Link from 'next/link';

export default function JudicialOversightPage() {
  const [filter, setFilter] = useState('ALL_DIRECTIVES');

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
              LEGISLATIVE_v7.0_SYNC
           </div>
        </div>
      </header>

      <main className="relative z-10 max-w-[1700px] mx-auto px-8 pt-24 lg:pt-32 space-y-32 flex-1 flex flex-col">
        
        {/* ── HEADER SECTION ── */}
        <motion.div 
          initial={{ opacity: 0, y: 40 }}
          animate={{ opacity: 1, y: 0 }}
          className="flex flex-col lg:flex-row justify-between items-end gap-16 border-b-2 border-white/5 pb-16"
        >
          <div className="space-y-12 max-w-5xl">
            <div className="inline-flex items-center gap-4 px-6 py-2.5 bg-white/[0.03] border border-white/5 rounded-full backdrop-blur-3xl shadow-2xl">
              <Gavel size={20} className="text-[#ff6b2b]" />
              <span className="text-[11px] font-black tracking-[0.8em] text-[#ff6b2b] uppercase italic leading-none pl-1">Sovereign Legislative Oversight</span>
            </div>
            <div className="space-y-8">
              <h1 className="text-7xl md:text-[10rem] font-black uppercase tracking-tighter italic leading-[0.8] italic pl-1 text-white/95">
                Judiciary<br/>
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-white via-white/80 to-[#ff6b2b]/30">Oversight.</span>
              </h1>
              <p className="text-2xl md:text-3xl text-white/30 max-w-4xl leading-relaxed font-light italic tracking-tight">
                The autonomous legislative branch of the OMEGA Intelligence. 
                <span className="text-white/60"> Directing the evolution</span> of machine law through human-verified protocol amendments.
              </p>
            </div>
          </div>

          <div className="flex gap-10 items-center shrink-0">
               <div className="p-10 bg-[#ff6b2b]/5 border-2 border-[#ff6b2b]/20 rounded-[4rem] min-w-[340px] space-y-6 shadow-[0_40px_80px_rgba(255,107,43,0.1)] backdrop-blur-3xl group relative overflow-hidden">
                  <div className="absolute top-0 right-0 p-8 opacity-[0.05] group-hover:scale-125 transition-transform duration-2000">
                     <Scale size={150} className="text-[#ff6b2b]" />
                  </div>
                  <div className="text-[11px] font-black text-[#ff6b2b] uppercase tracking-[0.4em] italic leading-none pl-1">Network Consensus Integrity</div>
                  <div className="text-7xl font-black text-white italic tracking-tighter leading-none group-hover:text-[#ff6b2b] transition-colors">{99.98}%</div>
                  <div className="h-4 w-full bg-black border-2 border-white/5 rounded-full overflow-hidden shadow-inner p-[2px] relative z-20">
                      <div className="h-full bg-[#ff6b2b] w-[99.98%] shadow-[0_0_30px_rgba(255,107,43,0.6)] rounded-full" />
                  </div>
               </div>
          </div>
        </motion.div>

        {/* ── CORE METRICS ── */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12">
            {[
                { title: 'Governance Power', value: '58.2M', icon: <Vote size={28} />, detail: 'V7_CAST_WEIGHT' },
                { title: 'Active Proposals', value: '142', icon: <FileText size={28} />, detail: 'QUEUE_DIRECTIVES' },
                { title: 'Council Members', value: '1,024', icon: <Users size={28} />, detail: 'VERIFIED_NODES' },
                { title: 'Protocol Version', value: 'v7.0.4', icon: <ShieldCheck size={28} />, detail: 'OMEGA_CORE_OS' },
            ].map((stat, i) => (
                <div key={stat.title} className="p-12 bg-[#050505] border-2 border-white/5 rounded-[4rem] backdrop-blur-3xl shadow-[0_40px_80px_rgba(0,0,0,0.95)] space-y-8 group hover:border-[#ff6b2b]/20 transition-all relative overflow-hidden shadow-inner flex flex-col justify-between h-[300px]">
                     <div className="absolute top-0 right-0 p-10 opacity-[0.01] group-hover:scale-125 transition-transform duration-1000 text-white font-black italic uppercase leading-none text-[8rem]">0{i+1}</div>
                     <div className={`p-8 rounded-[2rem] bg-black border-2 border-white/5 w-fit group-hover:bg-[#ff6b2b] group-hover:text-black group-hover:border-black/5 transition-all shadow-inner relative z-10 lg:p-10`}>
                         {stat.icon}
                     </div>
                     <div className="space-y-4 relative z-10 pl-2">
                         <div className="text-[11px] font-black text-white/5 uppercase tracking-[0.5em] italic leading-none group-hover:text-white/20 transition-colors">{stat.title}</div>
                         <div className="text-5xl font-black text-white italic tracking-tighter leading-none group-hover:text-[#ff6b2b] transition-colors">{stat.value}</div>
                         <div className="text-[10px] text-white/5 font-black uppercase italic tracking-[0.2em]">{stat.detail}</div>
                     </div>
                </div>
            ))}
        </div>

        <div className="grid lg:grid-cols-12 gap-16 items-start">
            
            {/* LEFT: AMENDMENTS GRID */}
            <div className="lg:col-span-8 space-y-24">
                <div className="flex flex-col md:flex-row md:items-center justify-between gap-12 border-b-2 border-white/5 pb-12">
                    <h2 className="text-4xl lg:text-5xl font-black uppercase tracking-tighter italic flex items-center gap-10 text-white/40 leading-none pl-4">
                        <Activity size={48} className="text-[#ff6b2b] animate-pulse" strokeWidth={3} /> Active Amendments
                    </h2>
                    <div className="px-10 py-3 bg-[#ff6b2b]/10 border border-[#ff6b2b]/20 rounded-full text-[12px] text-[#ff6b2b] font-black uppercase tracking-[0.6em] italic leading-none animate-pulse">RESONANCE_PHASE_07</div>
                </div>
                
                <div className="space-y-12">
                    {[
                        { id: 'UXL-V5-AMEND-1', title: 'Recalibrate Asset Translocation Protocols', creator: 'Architect_0x01', status: 'VOTING_ACTIVE', progress: 82, votes: '42,801' },
                        { id: 'M2M-GEN-RULE-14', title: 'Pact Enforcement Integrity Update', creator: 'Sovereign_Node_X', status: 'PASSED', progress: 100, votes: '58,241' },
                        { id: 'GOV-SHARD-MIN-5', title: 'Distribute Sovereign Reserves to Active Shards', creator: 'Treasury_Agent', status: 'VOTING_ACTIVE', progress: 45, votes: '12,410' },
                    ].map((proposal, i) => (
                        <div key={proposal.id} className="bg-[#050505] border-2 border-white/10 rounded-[5rem] p-12 lg:p-16 backdrop-blur-3xl shadow-[0_80px_150px_rgba(0,0,0,1)] relative overflow-hidden group hover:border-[#ff6b2b]/40 transition-all flex flex-col gap-12">
                             <div className="absolute inset-y-0 left-0 w-2 bg-[#ff6b2b] scale-y-0 group-hover:scale-y-100 transition-transform origin-top z-10" />
                             <div className="absolute top-0 right-0 p-12 opacity-[0.01] group-hover:scale-150 transition-transform duration-3000">
                                <Binary size={300} className="text-[#ff6b2b]" />
                             </div>

                             <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-12 relative z-20">
                                <div className="space-y-6">
                                    <div className="flex items-center gap-6">
                                        <span className="text-[11px] font-mono font-black text-[#ff6b2b] bg-[#ff6b2b]/10 border-2 border-[#ff6b2b]/20 px-6 py-2 rounded-full uppercase tracking-[0.3em] italic leading-none">{proposal.id}</span>
                                        {proposal.status === 'VOTING_ACTIVE' && (
                                            <div className="flex items-center gap-4">
                                               <span className="h-3 w-3 rounded-full bg-[#ff6b2b] animate-ping shadow-[0_0_15px_#ff6b2b]" />
                                               <span className="text-[10px] font-black text-[#ff6b2b] uppercase tracking-[0.6em] italic animate-pulse leading-none">RESONATING</span>
                                            </div>
                                        )}
                                    </div>
                                    <h3 className="text-4xl lg:text-5xl font-black text-white/40 group-hover:text-white transition-colors italic tracking-tighter leading-[0.9] pr-12">"{proposal.title}"</h3>
                                    <div className="flex items-center gap-6 text-[11px] font-black text-white/5 uppercase tracking-[0.5em] italic leading-none pl-1">
                                       <Terminal size={16} strokeWidth={3} className="text-[#ff6b2b]/40" /> Proposed_by: {proposal.creator}
                                    </div>
                                </div>
                                <div className="text-left md:text-right space-y-4 shrink-0 pr-4">
                                    <div className="text-[10px] text-white/10 uppercase tracking-[0.8em] font-black italic leading-none">Consensus_Status</div>
                                    <div className={`text-3xl font-black uppercase tracking-widest italic leading-none ${proposal.status === 'PASSED' ? 'text-emerald-500' : 'text-[#ff6b2b] animate-pulse'}`}>{proposal.status}</div>
                                </div>
                             </div>

                             <div className="space-y-8 relative z-20 pl-2">
                                 <div className="flex justify-between items-end text-[12px] font-black uppercase tracking-[0.6em] italic leading-none">
                                     <span className="text-white/10 flex items-center gap-4"><Layers size={20} className="text-[#ff6b2b]/20" /> Sync Consensus Progress</span>
                                     <span className="text-white flex items-center gap-6"><Activity size={20} className="text-[#ff6b2b]" /> {proposal.progress}% // {proposal.votes} Transmissions</span>
                                 </div>
                                 <div className="h-4 w-full bg-black border-2 border-white/5 rounded-full overflow-hidden shadow-inner p-[2px]">
                                     <motion.div 
                                        initial={{ width: 0 }}
                                        animate={{ width: `${proposal.progress}%` }}
                                        transition={{ duration: 2, ease: "circOut" }}
                                        className={`h-full shadow-2xl rounded-full ${proposal.status === 'PASSED' ? 'bg-emerald-500 shadow-emerald-500/40' : 'bg-[#ff6b2b] shadow-[#ff6b2b]/40'}`}
                                     />
                                 </div>
                             </div>
                        </div>
                    ))}
                </div>

                <div className="p-16 border-2 border-dashed border-white/10 rounded-[5rem] bg-white/[0.01] text-center space-y-12 shadow-inner group hover:border-[#ff6b2b]/30 transition-all">
                     <div className="w-24 h-24 bg-white/5 border-2 border-white/10 rounded-[2.5rem] flex items-center justify-center mx-auto group-hover:scale-110 group-hover:bg-[#ff6b2b]/10 group-hover:border-[#ff6b2b]/40 transition-all">
                        <Plus size={48} className="text-white/20 group-hover:text-[#ff6b2b]" strokeWidth={3} />
                     </div>
                     <div className="space-y-8">
                        <h3 className="text-5xl font-black uppercase italic tracking-tighter leading-none text-white/40 group-hover:text-white transition-colors">Draft Amendment</h3>
                        <p className="text-white/20 text-2xl font-light leading-relaxed italic max-w-2xl mx-auto tracking-tight">
                           Initialize a new protocol directive for the OMEGA ecosystem. 
                           <span className="text-[#ff6b2b]/60"> Security deposit</span> of 1,000 $VALLE required for mission verification.
                        </p>
                        <button className="mt-8 px-20 py-8 bg-white text-black font-black uppercase tracking-[0.8em] text-[11px] rounded-[2.5rem] hover:bg-[#ff6b2b] hover:shadow-[0_40px_80px_rgba(255,107,43,0.3)] hover:scale-[1.05] active:scale-[0.95] transition-all italic leading-none border-0 group/draft">
                           Construct Directive <ArrowRight size={20} className="inline ml-4 group-hover/draft:translate-x-3 transition-transform" strokeWidth={3} />
                        </button>
                     </div>
                </div>
            </div>

            {/* RIGHT: COUNCIL CHAMBER */}
            <div className="lg:col-span-4 space-y-16 lg:sticky lg:top-32 h-fit">
                
                {/* COUNCIL CHAMBER SHARD */}
                <div className="bg-[#ff6b2b]/5 border-2 border-[#ff6b2b]/20 rounded-[5rem] p-12 lg:p-16 space-y-16 relative overflow-hidden group shadow-[0_80px_150px_rgba(255,107,43,0.1)] backdrop-blur-3xl shadow-inner">
                    <div className="absolute top-0 right-0 p-12 opacity-[0.05] group-hover:scale-150 transition-transform duration-3000">
                        <Lock size={200} className="text-[#ff6b2b]" />
                    </div>
                    <div className="space-y-6 relative z-10">
                        <h2 className="text-5xl font-black uppercase tracking-tighter italic text-white group-hover:text-[#ff6b2b] transition-colors leading-none">Council Chamber</h2>
                        <div className="h-px w-32 bg-[#ff6b2b]/40" />
                        <p className="text-2xl text-white/30 font-light leading-relaxed italic tracking-tight"> 
                           "The architect's voice is the foundation of the protocol. Access limited to verified sovereign nodes with level 4+ clearance." 
                        </p>
                    </div>
                    
                    <div className="space-y-6 relative z-10">
                        <button className="w-full py-10 bg-[#ff6b2b] text-black font-black uppercase tracking-[1em] rounded-[3rem] hover:scale-[1.03] active:scale-[0.98] transition-all text-[11px] shadow-[0_40px_100px_rgba(255,107,43,0.3)] italic overflow-hidden group/btn relative border-0 leading-none">
                            <span className="relative z-10 flex items-center justify-center gap-6">Connect Delegate Shard <Radio size={20} className="animate-pulse" strokeWidth={3} /></span>
                            <div className="absolute inset-0 bg-white opacity-0 group-hover/btn:opacity-20 transition-opacity" />
                        </button>
                        <button className="w-full py-10 border-2 border-white/10 bg-black text-white/20 hover:text-[#ff6b2b] hover:border-[#ff6b2b]/40 font-black uppercase tracking-[0.8em] rounded-[3rem] hover:bg-[#ff6b2b]/5 transition-all text-[11px] italic leading-none active:scale-95 group/btn">
                            View Voting Ledger
                        </button>
                    </div>
                </div>

                {/* NEURAL CONSENSUS PANEL */}
                <div className="bg-[#050505] border-2 border-white/10 rounded-[5rem] p-12 lg:p-16 space-y-12 shadow-[0_80px_150px_rgba(0,0,0,1)] backdrop-blur-3xl relative overflow-hidden group shadow-inner">
                     <div className="absolute top-0 right-0 p-12 opacity-[0.01] group-hover:scale-150 transition-transform duration-3000">
                        <Orbit size={250} className="text-[#ff6b2b]" />
                     </div>
                     <div className="flex items-center gap-8 text-white/20 relative z-10 border-b-2 border-white/5 pb-10">
                         <div className="p-6 bg-black border-2 border-white/5 rounded-[2rem] text-[#ff6b2b] shadow-inner group-hover:scale-110 group-hover:border-[#ff6b2b]/40 transition-all">
                            <Cpu size={32} strokeWidth={2.5} />
                         </div>
                         <div className="space-y-2">
                           <h3 className="text-[12px] font-black uppercase tracking-[0.8em] italic leading-none">Neural Consensus</h3>
                           <div className="text-[10px] text-white/5 font-black uppercase italic tracking-[0.2em] leading-none">HIVE_MIND_SYNC</div>
                         </div>
                     </div>
                     <p className="text-2xl text-white/20 leading-relaxed italic font-light relative z-10 tracking-tight group-hover:text-white/40 transition-colors duration-700"> 
                        Real-time neural consensus is achieved through the entanglement of 58,000+ individual cognitive shards, ensuring the protocol remains immutable yet adaptive. 
                     </p>
                     <div className="flex items-center gap-6 pt-4 text-[11px] font-black uppercase tracking-[0.5em] text-[#ff6b2b] italic relative z-10 animate-pulse leading-none pl-1">
                         <Wifi size={20} strokeWidth={3} /> ENTANGLEMENT_ACTIVE_v7.0.4
                     </div>
                </div>

                {/* SECURITY PROTOCOL BANNER */}
                <div className="p-10 bg-black border-2 border-white/5 rounded-[4rem] flex items-center gap-10 shadow-[0_40px_80px_rgba(0,0,0,0.95)] backdrop-blur-3xl group hover:border-[#ff6b2b]/30 transition-all shadow-inner">
                   <div className="w-20 h-20 bg-[#ff6b2b]/10 border-2 border-[#ff6b2b]/30 rounded-[2.5rem] flex items-center justify-center text-[#ff6b2b] shrink-0 group-hover:bg-[#ff6b2b] group-hover:text-black transition-all group-hover:scale-110">
                      <ShieldCheck size={40} className="animate-pulse" strokeWidth={2.5} />
                   </div>
                   <div className="space-y-4">
                      <div className="text-[12px] font-black uppercase tracking-[0.6em] italic text-white/60 leading-none group-hover:text-[#ff6b2b] transition-colors">LegislativePrimes_H1</div>
                      <p className="text-[11px] text-white/10 italic leading-snug group-hover:text-white/30 transition-colors pr-4">Hard-locked primitives. Amendments require 75% multi-sig neural verification.</p>
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
            <Link href="/" className="inline-flex items-center gap-8 text-[12px] font-black uppercase tracking-[1rem] text-white/10 hover:text-[#ff6b2b] transition-all italic group active:scale-95 leading-none pl-4 pr-4">
                <ChevronLeft size={24} className="group-hover:-translate-x-4 transition-transform" strokeWidth={3} /> Return to Core Shard
            </Link>
        </section>

      </main>

      {/* BACKGROUND DECOR */}
      <div className="fixed bottom-0 left-0 p-16 opacity-[0.01] pointer-events-none select-none z-0">
          <div className="text-[30vw] font-black italic leading-none uppercase">LAWS</div>
      </div>

      <style jsx global>{`
        .custom-scrollbar::-webkit-scrollbar { width: 4px; height: 4px; }
        .custom-scrollbar::-webkit-scrollbar-thumb { background: rgba(255, 107, 43, 0.15); border-radius: 20px; }
        @keyframes scan {
          from { transform: translateY(-100%); }
          to { transform: translateY(1000%); }
        }
      `}</style>
    </div>
  );
}
