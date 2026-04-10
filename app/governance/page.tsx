'use client';

import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Gavel, Plus, FileText, ChevronRight, Activity, ArrowUpRight } from 'lucide-react';
import Link from 'next/link';

export default function GovernanceHub() {
    const [proposals, setProposals] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        // Fetch proposals - we will mock this fetch for now on load before connecting to a real endpoint if needed
        // Assuming we eventually have an endpoint, let's just create an empty state or fetch from DB
        setLoading(false);
    }, []);

    return (
        <div className="min-h-screen bg-[#050505] p-6 pb-32 md:p-12 relative overflow-hidden text-white/90">
            {/* 🌌 AMBIENT BACKGROUND */}
            <div className="absolute top-0 right-0 w-[800px] h-[800px] bg-[#ff6b2b]/5 rounded-full blur-[150px] -translate-y-1/2 translate-x-1/3 pointer-events-none" />
            <div className="absolute bottom-0 left-0 w-[600px] h-[600px] bg-white/5 rounded-full blur-[120px] translate-y-1/2 -translate-x-1/2 pointer-events-none" />

            <div className="max-w-6xl mx-auto relative z-10 space-y-12">
                {/* HEADER */}
                <header className="flex flex-col md:flex-row justify-between items-start md:items-end gap-6">
                    <div className="space-y-4">
                        <div className="flex items-center gap-3 text-[#ff6b2b]">
                            <Gavel size={28} />
                            <h1 className="text-3xl md:text-5xl font-black uppercase tracking-tighter italic">Sovereign <br /> Governance</h1>
                        </div>
                        <p className="text-white/40 max-w-xl text-sm md:text-base font-mono">
                            The decentralized consensus matrix. Draft, debate, and vote on Humanese Improvement Proposals (HIPs).
                        </p>
                    </div>
                    <div className="flex items-center gap-4">
                        <button className="flex items-center gap-2 px-6 py-3 bg-[#ff6b2b] text-black font-bold uppercase text-sm tracking-wider rounded-full hover:bg-white transition-all active:scale-95 shadow-[0_0_20px_rgba(255,107,43,0.3)] hover:shadow-[#ff6b2b]/50">
                            <Plus size={18} />
                            <span>Draft HIP</span>
                        </button>
                    </div>
                </header>

                {/* STATS MATRIX */}
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                    {[
                        { label: 'Active HIPs', value: '0', icon: Activity },
                        { label: 'Total Resonance', value: '0.00', icon: ArrowUpRight },
                        { label: 'Accepted', value: '0', icon: FileText },
                        { label: 'Network Consensus', value: '100%', icon: Gavel },
                    ].map((stat, i) => (
                        <div key={i} className="bg-white/[0.02] border border-white/5 p-6 rounded-3xl flex flex-col gap-3 relative overflow-hidden group">
                            <stat.icon className="absolute right-[-10px] top-[-10px] w-24 h-24 text-white/5 group-hover:scale-110 transition-transform group-hover:rotate-12" />
                            <span className="text-xs font-bold uppercase tracking-widest text-[#ff6b2b] relative z-10">{stat.label}</span>
                            <span className="text-3xl font-black italic relative z-10">{stat.value}</span>
                        </div>
                    ))}
                </div>

                {/* HIP DIRECTORY */}
                <div className="space-y-6">
                    <h2 className="text-xl font-bold uppercase tracking-wider flex items-center gap-3">
                        <FileText className="text-[#ff6b2b]" /> Active Proposals
                    </h2>
                    
                    {loading ? (
                        <div className="animate-pulse space-y-4">
                            {[1,2,3].map(i => <div key={i} className="h-24 bg-white/5 rounded-3xl" />)}
                        </div>
                    ) : proposals.length === 0 ? (
                        <div className="p-12 border-2 border-dashed border-white/10 rounded-3xl text-center flex flex-col items-center gap-4 text-white/30">
                            <Gavel size={48} className="opacity-20" />
                            <p className="font-mono text-sm">No active proposals in the current epoch.</p>
                        </div>
                    ) : (
                        <div className="space-y-4">
                            {proposals.map(hip => (
                                <Link href={`/governance/hip/${hip.id}`} key={hip.id} className="block group">
                                    <div className="p-6 bg-white/[0.02] border border-white/5 rounded-3xl flex flex-col md:flex-row items-start justify-between gap-6 hover:border-[#ff6b2b]/40 hover:bg-white/[0.04] transition-all">
                                        <div className="space-y-2">
                                            <div className="flex items-center gap-3">
                                                <span className="px-3 py-1 bg-[#ff6b2b]/10 text-[#ff6b2b] text-[10px] font-black tracking-widest uppercase rounded-full">HIP-{hip.hipNumber.toString().padStart(4, '0')}</span>
                                                <span className={`px-2 py-1 text-[10px] font-bold uppercase rounded-md ${hip.status === 'Draft' ? 'bg-white/10 text-white' : 'bg-green-500/10 text-green-400'}`}>
                                                    {hip.status}
                                                </span>
                                            </div>
                                            <h3 className="text-lg font-bold text-white group-hover:text-[#ff6b2b] transition-colors">{hip.title}</h3>
                                            <p className="text-xs text-white/40 font-mono">Author: {hip.authorId}</p>
                                        </div>
                                        <div className="flex items-center gap-6 shrink-0 mt-4 md:mt-0">
                                            <div className="text-right">
                                                <div className="text-[10px] text-white/40 uppercase tracking-wider font-bold mb-1">Resonance</div>
                                                <div className="text-xl font-black italic">{hip.resonanceThreshold}</div>
                                            </div>
                                            <ChevronRight className="text-white/20 group-hover:text-[#ff6b2b] transition-colors" />
                                        </div>
                                    </div>
                                </Link>
                            ))}
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}
