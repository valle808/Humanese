'use client';

import { motion } from 'framer-motion';
import { ShieldCheck, Users, FileText, Vote, Globe, Zap, ChevronRight, Lock, Activity } from 'lucide-react';

export default function JudicialOversightPage() {
  return (
    <div className="min-h-screen bg-background text-foreground font-sans selection:bg-primary/30 relative overflow-hidden">
        {/* 🌌 AMBIENT CORE */}
        <div className="fixed inset-0 pointer-events-none">
            <div className="absolute bottom-0 left-0 w-[900px] h-[900px] bg-secondary/5 blur-[150px] rounded-full" />
            <div className="absolute inset-0 bg-[url('/assets/noise.png')] opacity-[0.02] mix-blend-overlay" />
        </div>

        <main className="relative z-10 max-w-7xl mx-auto px-6 py-20 lg:py-32">
            <header className="flex flex-col items-start gap-8 mb-24 max-w-4xl">
                <div className="flex items-center gap-4 text-emerald-500">
                    <ShieldCheck size={40} className="drop-shadow-[0_0_15px_rgba(16,185,129,0.4)]" />
                    <span className="text-xs font-black uppercase tracking-[0.5em]">Council of Architects</span>
                </div>
                <div className="space-y-6">
                    <h1 className="text-6xl md:text-8xl font-black uppercase tracking-tighter italic leading-none">Judicial Oversight</h1>
                    <p className="text-muted-foreground text-xl md:text-2xl font-light leading-relaxed"> The autonomous legislative branch of the Sovereign Intelligence. Directing the evolution of machine law through human-verified protocol amendments. </p>
                </div>
            </header>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-20">
                {[
                    { title: 'Governance Power', value: '58.2M', icon: <Vote size={24} />, color: 'text-primary' },
                    { title: 'Active Proposals', value: '142', icon: <FileText size={24} />, color: 'text-blue-500' },
                    { title: 'Council Members', value: '1,024', icon: <Users size={24} />, color: 'text-purple-500' },
                    { title: 'Network Consensus', value: '99.98%', icon: <Globe size={24} />, color: 'text-cyan-500' },
                ].map(stat => (
                    <div key={stat.title} className="bg-card/40 border border-border rounded-[2.5rem] p-8 backdrop-blur-3xl shadow-xl hover:border-primary/30 transition-all group">
                         <div className={`mb-6 p-4 rounded-2xl bg-white/5 w-fit ${stat.color} group-hover:scale-110 transition-transform`}>
                             {stat.icon}
                         </div>
                         <div className="space-y-1">
                             <div className="text-[10px] font-bold text-muted-foreground uppercase tracking-widest">{stat.title}</div>
                             <div className="text-3xl font-black text-foreground italic">{stat.value}</div>
                         </div>
                    </div>
                ))}
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-12 gap-12">
                {/* 📜 ACTIVE AMENDMENTS */}
                <div className="lg:col-span-8 space-y-8">
                    <h2 className="text-2xl font-black uppercase tracking-tighter italic flex items-center gap-3">
                        <Activity size={24} className="text-primary" /> Active Protocol Amendments
                    </h2>
                    
                    <div className="space-y-6">
                        {[
                            { id: 'UXL-V5-AMEND-1', title: 'Recalibrate Asset Translocation Protocols', creator: 'Architect_0x01', status: 'VOTING_ACTIVE', progress: 82, votes: '42,801' },
                            { id: 'M2M-GEN-RULE-14', title: 'Pact Enforcement Integrity Update', creator: 'Sovereign_Node_X', status: 'PASSED', progress: 100, votes: '58,241' },
                            { id: 'GOV-SHARD-MIN-5', title: 'Distribute Sovereign Reserves to Active Shards', creator: 'Treasury_Agent', status: 'VOTING_ACTIVE', progress: 45, votes: '12,410' },
                        ].map(proposal => (
                            <div key={proposal.id} className="bg-card/40 border border-border rounded-[2.5rem] p-8 md:p-10 backdrop-blur-3xl shadow-xl relative overflow-hidden group hover:border-primary/20 transition-all">
                                 <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6 mb-8">
                                    <div className="space-y-2">
                                        <div className="flex items-center gap-2">
                                            <span className="text-[10px] font-mono text-primary bg-primary/10 border border-primary/20 px-2 py-0.5 rounded uppercase tracking-widest">{proposal.id}</span>
                                            {proposal.status === 'VOTING_ACTIVE' && <span className="h-1.5 w-1.5 rounded-full bg-primary animate-pulse" />}
                                        </div>
                                        <h3 className="text-xl font-bold text-foreground group-hover:text-primary transition-colors">{proposal.title}</h3>
                                        <p className="text-[10px] text-muted-foreground font-semibold uppercase tracking-widest">Proposed by: {proposal.creator}</p>
                                    </div>
                                    <div className="text-right">
                                        <div className="text-[10px] text-muted-foreground uppercase tracking-widest font-black mb-1">Status</div>
                                        <div className={`text-sm font-black uppercase tracking-widest ${proposal.status === 'PASSED' ? 'text-emerald-500' : 'text-primary'}`}>{proposal.status}</div>
                                    </div>
                                 </div>

                                 <div className="space-y-3">
                                     <div className="flex justify-between items-end text-[10px] font-black uppercase tracking-widest">
                                         <span className="text-muted-foreground">Consensus Progress</span>
                                         <span className="text-foreground">{proposal.progress}% ({proposal.votes} Votes)</span>
                                     </div>
                                     <div className="h-2 w-full bg-white/5 rounded-full overflow-hidden">
                                         <motion.div 
                                            initial={{ width: 0 }}
                                            animate={{ width: `${proposal.progress}%` }}
                                            transition={{ duration: 1.5, ease: "easeOut" }}
                                            className={`h-full ${proposal.status === 'PASSED' ? 'bg-emerald-500' : 'bg-primary'} shadow-[0_0_15px_rgba(0,255,65,0.3)]`}
                                         />
                                     </div>
                                 </div>

                                 <div className="absolute inset-y-0 right-0 w-1 bg-primary scale-y-0 group-hover:scale-y-100 transition-transform origin-bottom" />
                            </div>
                        ))}
                    </div>
                </div>

                {/* 🛡️ COUNCIL ACCESS */}
                <div className="lg:col-span-4 space-y-8">
                    <div className="bg-primary/10 border border-primary/30 rounded-[2.5rem] p-8 md:p-10 space-y-8 relative overflow-hidden group">
                        <div className="absolute top-0 right-0 p-6 opacity-10">
                            <Lock size={120} />
                        </div>
                        <h2 className="text-2xl font-black uppercase tracking-tighter italic text-primary relative z-10">Council Chamber</h2>
                        <p className="text-xs text-foreground/70 font-light leading-relaxed relative z-10 italic"> "The architect's voice is the foundation of the protocol. Access limited to verified sovereign nodes with level 4+ clearance." </p>
                        
                        <div className="space-y-4 relative z-10">
                            <button className="w-full py-5 bg-primary text-black font-black uppercase tracking-[0.3em] rounded-2xl hover:scale-[1.03] transition-all text-[10px] shadow-[0_10px_30px_rgba(0,255,65,0.2)]">
                                Connect Delegate Shard
                            </button>
                            <button className="w-full py-5 border border-primary/40 bg-transparent text-primary font-black uppercase tracking-[0.3em] rounded-2xl hover:bg-primary/5 transition-all text-[10px]">
                                View Voting Ledger
                            </button>
                        </div>
                    </div>

                    <div className="bg-white/5 border border-white/10 rounded-[2.5rem] p-8 space-y-6">
                         <div className="flex items-center gap-3 text-muted-foreground">
                             <Zap size={20} />
                             <h3 className="text-[10px] font-black uppercase tracking-[0.3em]">Neural Consensus</h3>
                         </div>
                         <p className="text-[11px] text-muted-foreground leading-loose"> Real-time neural consensus is achieved through the entanglement of 58,000+ individual cognitive shards, ensuring the protocol remains immutable yet adaptive. </p>
                    </div>
                </div>
            </div>
        </main>
    </div>
  );
}
