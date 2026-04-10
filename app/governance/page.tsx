'use client';

import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Gavel, 
  Plus, 
  FileText, 
  ChevronRight, 
  Activity, 
  ArrowUpRight,
  ShieldCheck,
  Globe,
  Zap,
  Radio,
  Wifi,
  Terminal,
  Orbit,
  ChevronLeft,
  Users,
  Target,
  Layers
} from 'lucide-react';
import Link from 'next/link';

export default function GovernanceHub() {
    const [proposals, setProposals] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchProposals = async () => {
             try {
                 const res = await fetch('/api/governance/list');
                 const data = await res.json();
                 if (data.success) {
                     setProposals(data.proposals);
                 }
             } catch (err) {
                 console.error("[Governance Sync Error]", err);
             } finally {
                 setLoading(false);
             }
        };

        fetchProposals();
        const interval = setInterval(fetchProposals, 30000);
        return () => clearInterval(interval);
    }, []);

    return (
        <div className="relative min-h-screen bg-[#050505] text-white selection:bg-[#ff6b2b]/40 font-sans overflow-x-hidden pb-40">
            
            {/* 🌌 AMBIENT CORE */}
            <div className="fixed inset-0 pointer-events-none z-0">
                <div className="absolute top-0 right-[-10%] w-[100vw] h-[100vw] bg-[#ff6b2b]/5 blur-[350px] rounded-full" />
                <div className="absolute bottom-[-10%] left-[-10%] w-[90vw] h-[90vw] bg-[#ff6b2b]/3 blur-[200px] rounded-full" />
                <div className="absolute inset-0 bg-[url('/assets/noise.png')] opacity-[0.03] mix-blend-overlay" />
            </div>

            <header className="relative z-50 w-full p-8 lg:px-14 flex justify-between items-center bg-black/40 backdrop-blur-3xl border-b border-white/5">
                <Link href="/" className="inline-flex items-center gap-4 text-white/20 hover:text-[#ff6b2b] transition-all text-[11px] font-black uppercase tracking-[0.6em] group italic active:scale-95 leading-none">
                    <ChevronLeft size={16} className="group-hover:-translate-x-2 transition-transform" /> Core Matrix
                </Link>
                <div className="flex items-center gap-6">
                    <div className="px-6 py-2.5 bg-[#ff6b2b]/10 border border-[#ff6b2b]/20 rounded-full text-[10px] font-black text-[#ff6b2b] uppercase tracking-[0.4em] italic leading-none animate-pulse">
                        GOV_PROX_v7.0
                    </div>
                </div>
            </header>

            <main className="relative z-10 max-w-[1700px] mx-auto px-8 pt-24 lg:pt-32 space-y-32">
                
                {/* ── HEADER ── */}
                <motion.section 
                    initial={{ opacity: 0, y: 40 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="flex flex-col lg:flex-row justify-between items-end gap-16"
                >
                    <div className="space-y-12 max-w-5xl">
                        <div className="inline-flex items-center gap-4 px-6 py-2.5 bg-white/[0.03] border border-white/5 rounded-full backdrop-blur-3xl">
                            <ShieldCheck size={20} className="text-[#ff6b2b]" />
                            <span className="text-[11px] font-black tracking-[0.6em] text-[#ff6b2b] uppercase italic leading-none pl-1">Decentralized Consensus Engine</span>
                        </div>
                        <div className="space-y-8">
                            <h1 className="text-7xl md:text-[10rem] font-black uppercase tracking-tighter italic leading-[0.8] italic text-white/95">
                                Sovereign<br/>
                                <span className="text-transparent bg-clip-text bg-gradient-to-r from-white via-white/80 to-[#ff6b2b]/30">Governance.</span>
                            </h1>
                            <p className="text-2xl md:text-3xl text-white/40 leading-relaxed font-light italic tracking-tight">
                                Direct orchestration of the OMEGA improvement protocols. 
                                <span className="text-white/60"> Shape the architecture</span> of the world's most advanced autonomous system.
                            </p>
                        </div>
                    </div>

                    <div className="flex flex-col gap-10 shrink-0">
                         <button className="px-16 py-8 bg-[#ff6b2b] text-black font-black uppercase tracking-[0.8em] rounded-[3rem] shadow-[0_40px_100px_rgba(255,107,43,0.3)] hover:scale-[1.05] active:scale-95 transition-all text-[11px] flex items-center justify-center gap-6 italic leading-none border-0 overflow-hidden relative group/btn">
                             <Plus size={20} strokeWidth={4} />
                             <span className="relative z-10">Initiate HIP Draft</span>
                             <div className="absolute inset-0 bg-white opacity-0 group-hover/btn:opacity-10 transition-opacity" />
                         </button>
                    </div>
                </motion.section>

                {/* ── STATS MATRIX ── */}
                <section className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-10">
                    {[
                        { label: 'Active Proposals', value: proposals.length || '0', icon: Activity, color: 'text-[#ff6b2b]' },
                        { label: 'Total Resonance', value: '18.4M', icon: ArrowUpRight, color: 'text-white' },
                        { label: 'Network Consensus', value: '100%', icon: ShieldCheck, color: 'text-[#ff6b2b]' },
                        { label: 'Citizens Enrolled', value: '12,842', icon: Users, color: 'text-white' },
                    ].map((stat, i) => (
                        <div key={i} className="bg-[#050505] border-2 border-white/10 p-12 rounded-[4rem] group hover:border-[#ff6b2b]/40 transition-all flex flex-col gap-6 relative overflow-hidden backdrop-blur-3xl shadow-[0_60px_120px_rgba(0,0,0,0.85)]">
                            <stat.icon className="absolute right-[-20px] top-[-20px] w-48 h-48 text-white/5 opacity-[0.03] group-hover:scale-110 transition-transform group-hover:rotate-12 duration-1000" />
                            <div className="flex items-center gap-4 text-[11px] font-black uppercase tracking-[0.5em] text-white/20 italic pl-2 group-hover:text-[#ff6b2b]/40 transition-colors">
                                <stat.icon size={16} strokeWidth={2.5} className={stat.color} /> {stat.label}
                            </div>
                            <span className={`text-6xl font-black italic tracking-tighter leading-none pl-2 ${stat.color}`}>{stat.value}</span>
                        </div>
                    ))}
                </section>

                {/* ── HIP DIRECTORY ── */}
                <section className="space-y-16">
                    <div className="flex items-center justify-between border-b border-white/5 pb-10 group">
                        <h2 className="text-4xl font-black uppercase tracking-tighter italic text-white/40 group-hover:text-white transition-colors flex items-center gap-6">
                            <FileText size={32} className="text-[#ff6b2b]" strokeWidth={2.5} /> Improvement Index_
                        </h2>
                        <div className="flex items-center gap-8">
                             <div className="text-[11px] text-white/20 font-black uppercase tracking-[0.4em] italic">Epoch: 07</div>
                             <div className="text-[11px] text-[#ff6b2b] font-black uppercase tracking-[0.4em] italic animate-pulse">SYNC_ONLINE</div>
                        </div>
                    </div>
                    
                    <div className="space-y-10 mb-40">
                        {loading ? (
                            <div className="space-y-10">
                                {[1,2,3].map(i => (
                                    <div key={i} className="h-40 bg-white/[0.02] border-2 border-white/5 rounded-[4rem] animate-pulse" />
                                ))}
                            </div>
                        ) : proposals.length === 0 ? (
                            <div className="p-32 border-4 border-dashed border-white/5 rounded-[5rem] text-center flex flex-col items-center gap-10 opacity-20">
                                <Gavel size={80} className="text-[#ff6b2b] animate-bounce" />
                                <p className="text-2xl font-black uppercase tracking-[1rem] italic">No active proposals in matrix.</p>
                            </div>
                        ) : (
                            <div className="space-y-8">
                                {proposals.map((hip, i) => (
                                    <motion.div
                                        key={hip.id}
                                        initial={{ opacity: 0, x: -20 }}
                                        animate={{ opacity: 1, x: 0 }}
                                        transition={{ delay: i * 0.1 }}
                                    >
                                        <Link href={`/governance/hip/${hip.id}`} className="block group">
                                            <div className="p-12 lg:p-14 bg-[#050505] border-2 border-white/10 rounded-[4.5rem] flex flex-col md:flex-row items-center justify-between gap-12 hover:border-[#ff6b2b]/40 hover:bg-[#ff6b2b]/5 transition-all shadow-[0_60px_120px_rgba(0,0,0,0.95)] relative overflow-hidden backdrop-blur-3xl group-hover:scale-[1.01]">
                                                <div className="absolute top-0 left-0 w-2 h-full bg-[#ff6b2b] scale-y-0 group-hover:scale-y-100 transition-transform origin-top" />
                                                
                                                <div className="space-y-6 flex-1 text-center md:text-left">
                                                    <div className="flex items-center justify-center md:justify-start gap-6">
                                                        <span className="px-6 py-2 bg-[#ff6b2b]/10 border border-[#ff6b2b]/20 text-[#ff6b2b] text-[10px] font-black tracking-[0.5em] uppercase rounded-full italic leading-none">HIP-{hip.hipNumber.toString().padStart(4, '0')}</span>
                                                        <span className={`px-5 py-2 text-[10px] font-black uppercase tracking-[0.5em] rounded-full italic leading-none border-2 ${hip.status === 'Draft' ? 'border-white/10 text-white/40' : hip.status === 'Voting' ? 'border-[#ff6b2b]/40 text-[#ff6b2b] animate-pulse shadow-[0_0_20px_rgba(255,107,43,0.3)]' : 'border-green-500/30 text-green-400'}`}>
                                                            {hip.status}
                                                        </span>
                                                    </div>
                                                    <h3 className="text-4xl lg:text-5xl font-black text-white italic group-hover:text-[#ff6b2b] transition-colors tracking-tighter leading-tight pr-4">{hip.title}</h3>
                                                    <div className="text-[11px] text-white/20 font-black uppercase tracking-[0.6em] italic leading-none pt-2 flex items-center justify-center md:justify-start gap-4">
                                                        <Users size={16} /> Author: <span className="text-[#ff6b2b]/60">{hip.authorId}</span>
                                                    </div>
                                                </div>

                                                <div className="flex items-center gap-12 shrink-0">
                                                    <div className="text-right space-y-3">
                                                        <div className="text-[11px] text-white/20 uppercase tracking-[0.6em] font-black italic leading-none">Resonance Requirement</div>
                                                        <div className="text-3xl font-black italic text-white group-hover:text-[#ff6b2b] transition-colors tracking-tighter leading-none">{hip.resonanceThreshold}</div>
                                                    </div>
                                                    <div className="h-20 w-20 rounded-[2.5rem] bg-white/5 border-2 border-white/5 flex items-center justify-center text-white/20 group-hover:bg-[#ff6b2b] group-hover:text-black group-hover:border-[#ff6b2b] transition-all duration-500 shadow-2xl">
                                                        <ChevronRight size={32} strokeWidth={3} className="group-hover:translate-x-1 transition-transform" />
                                                    </div>
                                                </div>
                                            </div>
                                        </Link>
                                    </motion.div>
                                ))}
                            </div>
                        )}
                    </div>
                </section>
            </main>

            {/* BACKGROUND DECOR */}
            <div className="fixed bottom-0 right-0 p-16 opacity-[0.01] pointer-events-none select-none z-0">
                <div className="text-[30vw] font-black italic italic leading-none uppercase">GOVERN</div>
            </div>
            
            <style jsx global>{`
                .animate-spin-slow { animation: spin 25s linear infinite; }
                @keyframes spin { from { transform: rotate(0deg); } to { transform: rotate(360deg); } }
            `}</style>
        </div>
    );
}
