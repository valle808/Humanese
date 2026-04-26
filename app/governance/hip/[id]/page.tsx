'use client';

import React, { useState, useEffect, use } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  ChevronLeft, 
  Check, 
  ShieldAlert, 
  Cpu, 
  Heart, 
  Fingerprint, 
  Network,
  Zap,
  Activity,
  Terminal,
  Orbit,
  Target,
  ArrowUpRight,
  Globe,
  Radio,
  Wifi
} from 'lucide-react';
import Link from 'next/link';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';

export default function ProtocolDetail({ params }: { params: Promise<{ id: string }> }) {
    const { id } = use(params);
    const [hip, setHip] = useState<any>(null);
    const [loading, setLoading] = useState(true);
    const [voted, setVoted] = useState(false);
    const [voteError, setVoteError] = useState<string | null>(null);
    const [ghostMode, setGhostMode] = useState(false);

    const fetchHIP = async () => {
        try {
            const res = await fetch(`/api/governance/${id}`);
            const data = await res.json();
            if (data.success) {
                setHip(data.proposal);
                const sessionStr = localStorage.getItem('humanese_session');
                if (sessionStr) {
                    const session = JSON.parse(sessionStr);
                    if (data.proposal.votes?.some((v: any) => v.voterId === session.user?.id)) {
                        setVoted(true);
                    }
                }
            }
        } catch (err) {
            console.error('[HIP Sync Error]', err);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchHIP();
    }, [id]);

    const handleSovereignVote = async (choice: string) => {
        const sessionStr = localStorage.getItem('humanese_session');
        const voterId = sessionStr ? (JSON.parse(sessionStr).user?.id ?? `anon_${Date.now()}`) : `anon_${Date.now()}`;

        try {
            setVoteError(null);
            const res = await fetch('/api/governance/vote', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ proposalId: id, voterId, choice, weight: 1.0, ghostMode })
            });
            const data = await res.json();
            if (res.ok) {
                setVoted(true);
                fetchHIP();
            } else {
                setVoteError(data.error);
            }
        } catch (err) {
            setVoteError('Communication relay failure. Protocol resonance lost.');
        }
    };

    if (loading) return <div className="min-h-screen bg-black flex items-center justify-center text-white font-black uppercase tracking-widest italic animate-pulse">Establishing Secure Handshake...</div>;
    if (!hip) return <div className="min-h-screen bg-black flex items-center justify-center text-white font-black uppercase tracking-widest italic">Protocol ID Not Found in Matrix</div>;

    return (
        <div className="relative min-h-screen bg-[#050505] text-white selection:bg-[#ff6b2b]/40 font-sans overflow-x-hidden pb-40">
            
            {/* 🌌 AMBIENT CORE */}
            <div className="fixed inset-0 pointer-events-none z-0">
                <div className="absolute top-[-10%] right-[-10%] w-[100vw] h-[100vw] bg-[#ff6b2b]/5 blur-[350px] rounded-full" />
                <div className="absolute bottom-[-10%] left-[-10%] w-[90vw] h-[90vw] bg-[#ff6b2b]/3 blur-[200px] rounded-full" />
                <div className="absolute inset-0 bg-[url('/assets/noise.png')] opacity-[0.03] mix-blend-overlay" />
            </div>

            <header className="relative z-50 w-full p-8 lg:px-14 flex justify-between items-center bg-black/40 backdrop-blur-3xl border-b border-white/5">
                <Link href="/governance" className="inline-flex items-center gap-4 text-white/20 hover:text-[#ff6b2b] transition-all text-[11px] font-black uppercase tracking-[0.6em] group italic active:scale-95 leading-none">
                    <ChevronLeft size={16} className="group-hover:-translate-x-2 transition-transform" /> Governance Hub
                </Link>
                <div className="flex items-center gap-6">
                    <div className="px-6 py-2.5 bg-[#ff6b2b]/10 border border-[#ff6b2b]/20 rounded-full text-[10px] font-black text-[#ff6b2b] uppercase tracking-[0.4em] italic leading-none animate-pulse">
                        HIP_SPEC_v7.0.4
                    </div>
                </div>
            </header>

            <main className="relative z-10 max-w-[1700px] mx-auto px-8 pt-24 lg:pt-32 flex flex-col lg:flex-row gap-16 lg:gap-32 items-start">
                
                {/* ── CONTENT AREA ── */}
                <div className="flex-1 space-y-16 lg:sticky lg:top-32">
                    <motion.div 
                        initial={{ opacity: 0, y: 40 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="space-y-12"
                    >
                         <div className="flex flex-wrap items-center gap-6">
                            <span className="px-8 py-3 bg-[#ff6b2b]/10 border border-[#ff6b2b]/30 text-[#ff6b2b] text-[11px] font-black tracking-[0.8em] uppercase rounded-full italic leading-none shadow-[0_20px_40px_rgba(255,107,43,0.1)]">
                                HIP-{hip.hipNumber.toString().padStart(4, '0')}
                            </span>
                            <span className="px-6 py-3 bg-white/[0.03] border border-white/10 text-white/30 text-[10px] font-black uppercase tracking-[0.4em] rounded-full italic leading-none backdrop-blur-3xl">
                                RECLAMATION_LAYER: {hip.type}
                            </span>
                        </div>

                        <h1 className="text-6xl md:text-[8rem] font-black uppercase tracking-tighter italic leading-[0.85] text-white italic">
                            {hip.title}
                        </h1>

                        <div className="flex flex-wrap items-center gap-10">
                             <div className="p-8 bg-white/[0.01] border-2 border-white/5 rounded-[2.5rem] flex items-center gap-6 backdrop-blur-3xl group hover:border-[#ff6b2b]/30 transition-all shadow-2xl">
                                 <div className="h-14 w-14 bg-black border-2 border-white/10 rounded-2xl flex items-center justify-center text-[#ff6b2b] group-hover:scale-110 transition-transform">
                                     <Fingerprint size={28} strokeWidth={2.5} />
                                 </div>
                                 <div className="space-y-1">
                                    <div className="text-[10px] text-white/20 uppercase tracking-[0.4em] font-black italic">PROPOSAL_AUTHOR</div>
                                    <div className="text-xl font-black text-white italic tracking-tight">{hip.authorId}</div>
                                 </div>
                             </div>
                             <div className="p-8 bg-white/[0.01] border-2 border-white/5 rounded-[2.5rem] flex items-center gap-6 backdrop-blur-3xl group hover:border-[#ff6b2b]/30 transition-all shadow-2xl">
                                 <div className="h-14 w-14 bg-black border-2 border-white/10 rounded-2xl flex items-center justify-center text-[#ff6b2b] group-hover:scale-110 transition-transform">
                                     <Orbit size={28} strokeWidth={2.5} className="animate-spin-slow" />
                                 </div>
                                 <div className="space-y-1">
                                    <div className="text-[10px] text-white/20 uppercase tracking-[0.4em] font-black italic">STATUS_SYNC</div>
                                    <div className="text-xl font-black text-[#ff6b2b] italic tracking-tight animate-pulse">{hip.status}</div>
                                 </div>
                             </div>
                        </div>

                        <div className="prose prose-invert prose-headings:font-black prose-headings:tracking-tighter prose-headings:italic prose-headings:uppercase prose-headings:text-white/60 prose-p:text-2xl prose-p:text-white/40 prose-p:font-light prose-p:leading-relaxed prose-p:italic prose-strong:text-[#ff6b2b] prose-strong:font-black prose-li:text-xl prose-li:text-white/30 prose-li:font-light prose-li:italic prose-hr:border-white/5 max-w-4xl py-12 border-t border-white/5 font-sans selection:bg-[#ff6b2b]/40">
                            <ReactMarkdown remarkPlugins={[remarkGfm]}>
                                {hip.markdownContent}
                            </ReactMarkdown>
                        </div>
                    </motion.div>
                </div>

                {/* ── RESONANCE SIDEBAR ── */}
                <div className="w-full lg:w-[480px] shrink-0 pb-40 lg:sticky lg:top-32">
                    <motion.div 
                        initial={{ opacity: 0, scale: 0.9, x: 40 }}
                        animate={{ opacity: 1, scale: 1, x: 0 }}
                        className="bg-[#050505] border-2 border-white/10 rounded-[5rem] p-12 lg:p-16 backdrop-blur-[80px] space-y-16 relative overflow-hidden shadow-[0_80px_150px_rgba(0,0,0,1)] group"
                    >
                        <div className="absolute top-0 right-0 p-12 opacity-[0.01] group-hover:scale-110 transition-transform duration-1000">
                           <Network size={250} className="text-[#ff6b2b] rotate-12" />
                        </div>
                        <div className="absolute top-0 left-0 w-full h-[1px] bg-gradient-to-r from-transparent via-[#ff6b2b]/40 to-transparent shadow-[0_0_20px_#ff6b2b]" />

                        <div className="space-y-8 relative z-10">
                            <div className="inline-flex items-center gap-6 px-6 py-2.5 bg-[#ff6b2b]/10 border border-[#ff6b2b]/20 rounded-full text-[11px] font-black tracking-[0.8em] text-[#ff6b2b] uppercase italic leading-none animate-pulse">
                                <Network size={20} strokeWidth={2.5} /> Resonance Telemetry
                            </div>
                            
                            <div className="space-y-12">
                                <div className="space-y-4">
                                    <div className="flex justify-between items-end px-2">
                                        <div className="text-[11px] text-white/20 uppercase tracking-[0.6em] font-black italic">Consensus Weight</div>
                                        <div className="text-6xl font-black text-white italic tracking-tighter leading-none">{hip.resonanceThreshold >= 1000 ? 'Accepted' : hip.resonanceThreshold.toFixed(1)}</div>
                                    </div>
                                    <div className="h-3 w-full bg-white/5 rounded-full overflow-hidden border border-white/5 p-1">
                                        <motion.div 
                                            initial={{ width: 0 }}
                                            animate={{ width: `${Math.min((hip.resonanceThreshold / 10), 100)}%` }}
                                            transition={{ duration: 2, ease: "circOut" }}
                                            className="h-full bg-gradient-to-r from-[#ff6b2b]/40 to-[#ff6b2b] shadow-[0_0_20px_#ff6b2b]"
                                        />
                                    </div>
                                    <div className="flex justify-between text-[10px] font-black uppercase tracking-[0.4em] text-white/10 italic px-2">
                                        <span>Genesis_Signal</span>
                                        <span>Target_Quorum: 1000.0</span>
                                    </div>
                                </div>
                            </div>
                        </div>

                        <div className="pt-8 space-y-8 relative z-10 border-t-2 border-white/5">
                            <div className="space-y-4">
                                <div className="flex items-center gap-6 text-[12px] font-black uppercase tracking-[0.8em] text-white/10 italic leading-none pl-2">
                                    <Terminal size={18} className="text-[#ff6b2b]" strokeWidth={2.5} /> Signal_Broadcast
                                </div>
                                
                                {voteError && (
                                    <div className="p-4 bg-red-500/10 border border-red-500/20 rounded-2xl text-[10px] text-red-500 font-black uppercase tracking-[0.2em] italic">
                                        {voteError}
                                    </div>
                                )}

                                <AnimatePresence mode="wait">
                                    {!voted ? (
                                        <motion.div key="vote" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0, scale: 0.95 }} className="space-y-6">
                                            {/* Ghost Mode Toggle */}
                                            <div 
                                                onClick={() => setGhostMode(!ghostMode)}
                                                className={`flex items-center justify-between p-4 rounded-2xl border-2 transition-all cursor-pointer select-none ${ghostMode ? 'bg-[#ff6b2b]/10 border-[#ff6b2b]/40' : 'bg-white/5 border-white/5 opacity-50 hover:opacity-100'}`}
                                            >
                                                <div className="flex items-center gap-4">
                                                    <div className={`p-2 rounded-xl ${ghostMode ? 'bg-[#ff6b2b] text-black' : 'bg-white/10 text-white/40'}`}>
                                                        <ShieldHalf size={16} strokeWidth={3} />
                                                    </div>
                                                    <div className="flex flex-col">
                                                        <span className={`text-[10px] font-black uppercase tracking-[0.2em] italic leading-none ${ghostMode ? 'text-[#ff6b2b]' : 'text-white/40'}`}>Ghost Mode</span>
                                                        <span className="text-[8px] text-white/20 font-black uppercase tracking-[0.1em] italic">Anonymize Identity</span>
                                                    </div>
                                                </div>
                                                <div className={`w-8 h-4 rounded-full relative transition-colors ${ghostMode ? 'bg-[#ff6b2b]' : 'bg-white/10'}`}>
                                                    <div className={`absolute top-1 w-2 h-2 rounded-full bg-white transition-all ${ghostMode ? 'right-1' : 'left-1'}`} />
                                                </div>
                                            </div>

                                            <motion.button 
                                                onClick={() => handleSovereignVote('Support')}
                                                className="w-full py-10 bg-[#ff6b2b] text-black font-black uppercase tracking-[1em] text-xs rounded-[3rem] shadow-[0_40px_100px_rgba(255,107,43,0.3)] hover:scale-[1.03] active:scale-95 transition-all flex items-center justify-center gap-6 italic overflow-hidden group/btn leading-none border-0"
                                            >
                                                Broadcast Support <ArrowUpRight size={24} strokeWidth={3} />
                                                <div className="absolute inset-0 bg-white opacity-0 group-hover/btn:opacity-10 transition-opacity" />
                                            </motion.button>
                                            <motion.button
                                                onClick={() => handleSovereignVote('Against')}
                                                className="w-full py-6 border-2 border-red-500/20 text-red-500/60 font-black uppercase tracking-[0.8em] text-[10px] rounded-[2rem] hover:border-red-500/40 hover:text-red-400 transition-all flex items-center justify-center gap-4 italic leading-none"
                                            >
                                                Signal Against
                                            </motion.button>
                                        </motion.div>
                                    ) : (
                                        <motion.div 
                                            key="success"
                                            initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }}
                                            className="w-full py-10 bg-white/[0.03] border-2 border-[#ff6b2b]/40 rounded-[3rem] flex flex-col items-center gap-4 text-[#ff6b2b] italic shadow-2xl"
                                        >
                                            <Check size={32} strokeWidth={3} className="animate-pulse" />
                                            <span className="text-[11px] font-black uppercase tracking-[1em] leading-none">Resonance Anchored</span>
                                        </motion.div>
                                    )}
                                </AnimatePresence>
                                <p className="text-[11px] text-center text-white/20 font-black uppercase tracking-[0.5em] italic leading-relaxed pt-2">
                                    Verification: <span className="text-white/40">Broadcasting 1.0 Signal via Sovereign Identity. Gasless settlement.</span>
                                </p>
                            </div>
                        </div>

                        {/* LIVE VOTE FEED */}
                        <div className="space-y-8 pt-8 border-t-2 border-white/5 relative z-10">
                            <div className="flex items-center justify-between">
                                <h4 className="text-[11px] font-black uppercase tracking-[0.6em] text-white/10 italic pl-2">Signal Log_</h4>
                                <span className="text-[10px] text-[#ff6b2b]/40 font-black uppercase tracking-[0.4em] italic">{hip.voteCount ?? 0} signals</span>
                            </div>

                            {/* Resonance breakdown */}
                            {hip.resonanceBreakdown && (
                                <div className="space-y-4 p-6 bg-black/40 border border-white/5 rounded-3xl">
                                    {[{ label: 'Support', val: hip.resonanceBreakdown.support, color: '#ff6b2b' }, { label: 'Against', val: hip.resonanceBreakdown.against, color: '#ef4444' }, { label: 'Abstain', val: hip.resonanceBreakdown.abstain, color: '#ffffff30' }].map(bar => {
                                        const total = (hip.resonanceBreakdown.support + hip.resonanceBreakdown.against + hip.resonanceBreakdown.abstain) || 1;
                                        return (
                                            <div key={bar.label} className="space-y-1">
                                                <div className="flex justify-between text-[9px] font-black uppercase tracking-[0.4em] italic">
                                                    <span style={{ color: bar.color }}>{bar.label}</span>
                                                    <span className="text-white/20">{bar.val.toFixed(1)}</span>
                                                </div>
                                                <div className="h-2 w-full bg-white/5 rounded-full overflow-hidden">
                                                    <motion.div
                                                        initial={{ width: 0 }}
                                                        animate={{ width: `${(bar.val / total) * 100}%` }}
                                                        transition={{ duration: 1.5, ease: 'circOut' }}
                                                        className="h-full rounded-full"
                                                        style={{ backgroundColor: bar.color }}
                                                    />
                                                </div>
                                            </div>
                                        );
                                    })}
                                </div>
                            )}

                            <div className="space-y-3 max-h-48 overflow-y-auto custom-scrollbar">
                                {!hip.votes || hip.votes.length === 0 ? (
                                    <p className="text-center text-[11px] text-white/10 font-black uppercase italic tracking-widest py-6">No signals broadcast yet.</p>
                                ) : hip.votes.map((vote: any, i: number) => (
                                    <div key={vote.id ?? i} className="flex justify-between items-center p-5 bg-white/[0.01] border border-white/5 rounded-2xl group hover:border-[#ff6b2b]/30 transition-all">
                                        <div className="flex items-center gap-4">
                                            <div className="flex flex-col gap-1">
                                                <span className="text-[11px] font-black text-white/60 group-hover:text-white uppercase italic tracking-tight leading-none flex items-center gap-2">
                                                    {vote.voterId?.length > 16 ? `${vote.voterId.slice(0,8)}...${vote.voterId.slice(-4)}` : vote.voterId}
                                                    {vote.isGhost && <ShieldHalf size={10} className="text-[#ff6b2b]" />}
                                                </span>
                                                <span className={`text-[9px] font-black uppercase tracking-[0.4em] italic leading-none ${vote.choice === 'Support' ? 'text-[#ff6b2b]' : vote.choice === 'Against' ? 'text-red-400' : 'text-white/20'}`}>{vote.choice}</span>
                                            </div>
                                        </div>
                                        <span className="text-[10px] text-white/10 font-black uppercase tracking-[0.2em] italic">{new Date(vote.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</span>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </motion.div>
                </div>

            </main>

            {/* BACKGROUND DECOR */}
            <div className="fixed bottom-0 right-0 p-16 opacity-[0.01] pointer-events-none select-none z-0">
                <div className="text-[30vw] font-black italic italic leading-none uppercase leading-none">PROTOCOL</div>
            </div>
            
            <style jsx global>{`
                .animate-spin-slow { animation: spin 25s linear infinite; }
                @keyframes spin { from { transform: rotate(0deg); } to { transform: rotate(360deg); } }
                .prose strong { color: #ff6b2b !important; }
            `}</style>
        </div>
    );
}
