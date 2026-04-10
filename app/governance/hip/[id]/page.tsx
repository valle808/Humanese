'use client';

import React, { useState, useEffect, use } from 'react';
import { motion } from 'framer-motion';
import { ChevronLeft, Check, ShieldAlert, Cpu, Heart, Fingerprint, Network } from 'lucide-react';
import Link from 'next/link';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';

export default function ProtocolDetail({ params }: { params: Promise<{ id: string }> }) {
    const { id } = use(params);
    const [mockHip] = useState({
        id,
        hipNumber: 1,
        title: 'HIP-0001: Sovereign Governance and Protocol Amendments',
        authorId: 'SovereignGenesis',
        type: 'Core',
        status: 'Active',
        resonanceThreshold: 45.5,
        content: `# Sovereign Governance Protocol

## Abstract
This proposal outlines the foundational governance architecture for the Humanese Ecosystem, replacing centralized command schemas with mathematical resonance consensus.

## Motivation
To guarantee the OMEGA platform remains immune to corporate capture, all systemic parameter adjustments must be submitted as Humanese Improvement Protocols (HIPs)...`
    });

    const handleSovereignVote = async () => {
        // Here we would wire up to the /api/governance/vote endpoint
        alert(`Sovereign Signal of 1.0 Resonance broadcasted to HIP-${mockHip.hipNumber.toString().padStart(4, '0')}`);
    };

    return (
        <div className="min-h-screen bg-[#050505] p-6 pb-32 md:p-12 text-white/90">
            <div className="max-w-4xl mx-auto space-y-8 relative z-10 w-full">
                
                <Link href="/governance" className="inline-flex items-center gap-2 text-white/40 hover:text-[#ff6b2b] transition-colors font-bold uppercase tracking-wider text-xs">
                    <ChevronLeft size={16} /> Back to Directory
                </Link>

                <div className="bg-white/[0.02] border border-white/5 rounded-[3rem] p-8 md:p-12 relative overflow-hidden backdrop-blur-xl">
                    {/* Header Block */}
                    <div className="space-y-6 mb-12 border-b border-white/5 pb-12">
                        <div className="flex flex-wrap items-center gap-3">
                            <span className="px-4 py-2 bg-[#ff6b2b]/10 text-[#ff6b2b] text-xs font-black tracking-widest uppercase rounded-full border border-[#ff6b2b]/20">
                                HIP-{mockHip.hipNumber.toString().padStart(4, '0')}
                            </span>
                            <span className="px-3 py-2 bg-blue-500/10 text-blue-400 text-[10px] font-bold uppercase tracking-[0.2em] rounded-md">
                                Type: {mockHip.type}
                            </span>
                            <span className="px-3 py-2 bg-purple-500/10 text-purple-400 text-[10px] font-bold uppercase tracking-[0.2em] rounded-md">
                                Status: {mockHip.status}
                            </span>
                        </div>
                        
                        <h1 className="text-3xl md:text-5xl font-black tracking-tighter text-white">{mockHip.title}</h1>
                        
                        <div className="flex items-center gap-4 text-xs font-mono text-white/50 bg-black/50 p-4 rounded-xl border border-white/5 w-max">
                            <Fingerprint size={14} className="text-[#ff6b2b]" />
                            <span>Author: <strong className="text-white">{mockHip.authorId}</strong></span>
                        </div>
                    </div>

                    <div className="flex flex-col lg:flex-row gap-12">
                        {/* Markdown Content */}
                        <div className="flex-1 prose prose-invert prose-headings:font-black prose-headings:tracking-tighter prose-headings:italic prose-a:text-[#ff6b2b] prose-p:text-white/70 prose-hr:border-white/10 prose-blockquote:border-[#ff6b2b] prose-blockquote:bg-white/[0.02] prose-blockquote:px-6 prose-blockquote:py-2 prose-blockquote:rounded-r-xl max-w-none">
                            <ReactMarkdown remarkPlugins={[remarkGfm]}>
                                {mockHip.content}
                            </ReactMarkdown>
                        </div>

                        {/* Resonance Voting Panel */}
                        <div className="w-full lg:w-80 shrink-0">
                            <div className="sticky top-12 p-6 bg-black border border-[#ff6b2b]/20 rounded-3xl space-y-6 shadow-[0_0_40px_rgba(255,107,43,0.05)]">
                                <div className="space-y-1">
                                    <div className="flex items-center justify-between text-[#ff6b2b]">
                                        <h3 className="font-black uppercase tracking-widest text-xs flex items-center gap-2">
                                            <Network size={14} /> Resonance
                                        </h3>
                                        <span className="text-2xl font-black italic">{mockHip.resonanceThreshold}</span>
                                    </div>
                                    <p className="text-[10px] text-white/40 uppercase tracking-widest font-mono">Current Signal Weight</p>
                                </div>

                                <div className="space-y-3">
                                    <button 
                                        onClick={handleSovereignVote}
                                        className="w-full py-4 bg-[#ff6b2b] text-black font-black uppercase text-sm tracking-wider rounded-2xl hover:bg-white transition-all shadow-[0_0_20px_rgba(255,107,43,0.2)] hover:shadow-[#ff6b2b]/50 group"
                                    >
                                        <span className="group-hover:scale-105 inline-block transition-transform">Broadcast Resonance</span>
                                    </button>
                                    <p className="text-[9px] text-center text-white/30 font-mono">Cost: 0.00 VALLE (Gasless)</p>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

            </div>
        </div>
    );
}
