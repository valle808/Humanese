'use client';

import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Gavel, 
  Plus, 
  FileText, 
  ChevronRight, 
  Activity, 
  ArrowUpRight,
  ShieldCheck,
  Zap,
  Radio,
  Terminal,
  ChevronLeft,
  Users,
  X,
  TrendingUp,
  CheckCircle,
  Clock,
  XCircle,
} from 'lucide-react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';

type GovTelemetry = {
    timestamp: string;
    totalResonance: number;
    uniqueVoters: number;
    statusCounts: Record<string, number>;
    topProposals: any[];
    totalProposals: number;
};

const STATUS_STYLES: Record<string, string> = {
    Draft:     'border-white/10 text-white/40',
    Active:    'border-[#ff6b2b]/40 text-[#ff6b2b] animate-pulse shadow-[0_0_20px_rgba(255,107,43,0.3)]',
    Accepted:  'border-green-500/30 text-green-400',
    Rejected:  'border-red-500/30 text-red-400',
    Deferred:  'border-yellow-500/30 text-yellow-400',
    Withdrawn: 'border-white/10 text-white/20',
    Final:     'border-blue-500/30 text-blue-400',
};

export default function GovernanceHub() {
    const router = useRouter();
    const sseRef = useRef<EventSource | null>(null);
    
    const [proposals, setProposals] = useState<any[]>([]);
    const [telemetry, setTelemetry] = useState<GovTelemetry | null>(null);
    const [streamStatus, setStreamStatus] = useState<'connecting' | 'live' | 'error'>('connecting');
    const [loading, setLoading] = useState(true);
    const [liveActivity, setLiveActivity] = useState<string[]>([]);

    // Drafting State
    const [isDrafting, setIsDrafting] = useState(false);
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [draftError, setDraftError] = useState<string | null>(null);
    const [newHip, setNewHip] = useState({
        title: '',
        type: 'Standards Track',
        layer: 'Consensus',
        category: 'Core',
        content: ''
    });

    // ── FETCH PROPOSAL LIST ──
    const fetchProposals = async () => {
        try {
            const res = await fetch('/api/governance/list');
            const data = await res.json();
            if (data.success) {
                setProposals(data.proposals);
            }
        } catch (err) {
            console.error('[Governance Sync Error]', err);
        } finally {
            setLoading(false);
        }
    };

    // ── SSE TELEMETRY STREAM ──
    useEffect(() => {
        fetchProposals();

        const es = new EventSource('/api/governance/stream');
        sseRef.current = es;

        es.addEventListener('telemetry', (e) => {
            const data: GovTelemetry = JSON.parse(e.data);
            setTelemetry(data);
            setStreamStatus('live');
            // Refresh proposal list whenever telemetry changes
            fetchProposals();
            // Log activity pulse
            setLiveActivity(prev => [
                `Telemetry sync @ ${new Date(data.timestamp).toLocaleTimeString()}`,
                ...prev.slice(0, 4)
            ]);
        });

        es.addEventListener('error', () => setStreamStatus('error'));

        es.onerror = () => {
            setStreamStatus('error');
            // Retry after 8 seconds
            setTimeout(() => {
                if (sseRef.current) sseRef.current.close();
                sseRef.current = new EventSource('/api/governance/stream');
            }, 8000);
        };

        return () => {
            es.close();
        };
    }, []);

    const handleInitiateDraft = async () => {
        setDraftError(null);
        setIsSubmitting(true);

        const sessionStr = localStorage.getItem('humanese_session');
        if (!sessionStr) {
            setDraftError("Identity anchor missing. Connect to Sovereign Portal first.");
            setIsSubmitting(false);
            return;
        }

        const session = JSON.parse(sessionStr);
        const authorId = session.user?.id || 'GIO_V';

        try {
            const res = await fetch('/api/governance/submit', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    title: newHip.title,
                    type: newHip.type,
                    layer: newHip.layer,
                    category: newHip.category,
                    content: newHip.content,
                    authorId
                })
            });

            const data = await res.json();
            if (res.ok) {
                router.push(`/governance/hip/${data.proposal.id}`);
            } else {
                setDraftError(data.error);
            }
        } catch {
            setDraftError("Matrix handshake failed. Unable to anchor protocol.");
        } finally {
            setIsSubmitting(false);
        }
    };

    const totalProposals = telemetry?.totalProposals ?? proposals.length;
    const totalResonance = telemetry?.totalResonance ?? 0;
    const uniqueVoters   = telemetry?.uniqueVoters   ?? 0;
    const acceptedCount  = telemetry?.statusCounts?.['Accepted'] ?? 0;

    return (
        <div className="relative min-h-screen bg-[#050505] text-white selection:bg-[#ff6b2b]/40 font-sans overflow-x-hidden pb-40">
            
            {/* 🌌 AMBIENT CORE */}
            <div className="fixed inset-0 pointer-events-none z-0">
                <div className="absolute top-0 right-[-10%] w-[100vw] h-[100vw] bg-[#ff6b2b]/5 blur-[350px] rounded-full" />
                <div className="absolute bottom-[-10%] left-[-10%] w-[90vw] h-[90vw] bg-[#ff6b2b]/3 blur-[200px] rounded-full" />
                <div className="absolute inset-0 bg-[url('/assets/noise.png')] opacity-[0.03] mix-blend-overlay" />
            </div>

            {/* ── HEADER ── */}
            <header className="relative z-50 w-full p-8 lg:px-14 flex justify-between items-center bg-black/40 backdrop-blur-3xl border-b border-white/5">
                <Link href="/" className="inline-flex items-center gap-4 text-white/20 hover:text-[#ff6b2b] transition-all text-[11px] font-black uppercase tracking-[0.6em] group italic active:scale-95 leading-none">
                    <ChevronLeft size={16} className="group-hover:-translate-x-2 transition-transform" /> Core Matrix
                </Link>
                <div className="flex items-center gap-6">
                    {/* Live stream indicator */}
                    <div className={`flex items-center gap-3 px-6 py-2.5 rounded-full border text-[10px] font-black uppercase tracking-[0.4em] italic leading-none ${
                        streamStatus === 'live'
                            ? 'bg-[#ff6b2b]/10 border-[#ff6b2b]/20 text-[#ff6b2b]'
                            : streamStatus === 'error'
                            ? 'bg-red-500/10 border-red-500/20 text-red-400'
                            : 'bg-white/5 border-white/10 text-white/20 animate-pulse'
                    }`}>
                        <span className={`w-2 h-2 rounded-full ${streamStatus === 'live' ? 'bg-[#ff6b2b] animate-ping' : streamStatus === 'error' ? 'bg-red-500' : 'bg-white/20'}`} />
                        {streamStatus === 'live' ? 'STREAM_LIVE' : streamStatus === 'error' ? 'STREAM_ERR' : 'CONNECTING...'}
                    </div>
                    <div className="px-6 py-2.5 bg-[#ff6b2b]/10 border border-[#ff6b2b]/20 rounded-full text-[10px] font-black text-[#ff6b2b] uppercase tracking-[0.4em] italic leading-none">
                        GOV_PROX_v7.0
                    </div>
                </div>
            </header>

            <main className="relative z-10 max-w-[1700px] mx-auto px-8 pt-24 lg:pt-32 space-y-32">
                
                {/* ── HERO HEADER ── */}
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
                            <h1 className="text-7xl md:text-[10rem] font-black uppercase tracking-tighter italic leading-[0.8] text-white/95">
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
                         <button 
                            onClick={() => setIsDrafting(true)}
                            className="px-16 py-8 bg-[#ff6b2b] text-black font-black uppercase tracking-[0.8em] rounded-[3rem] shadow-[0_40px_100px_rgba(255,107,43,0.3)] hover:scale-[1.05] active:scale-95 transition-all text-[11px] flex items-center justify-center gap-6 italic leading-none border-0 overflow-hidden relative group/btn"
                         >
                             <Plus size={20} strokeWidth={4} />
                             <span className="relative z-10">Initiate HIP Draft</span>
                             <div className="absolute inset-0 bg-white opacity-0 group-hover/btn:opacity-10 transition-opacity" />
                         </button>
                    </div>
                </motion.section>

                {/* ── LIVE TELEMETRY STATS ── */}
                <section className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-10">
                    {[
                        { label: 'Total Proposals', value: String(totalProposals), icon: Activity,      color: 'text-[#ff6b2b]' },
                        { label: 'Total Resonance', value: totalResonance.toLocaleString(undefined, { maximumFractionDigits: 1 }), icon: TrendingUp, color: 'text-white' },
                        { label: 'Accepted HIPs',   value: String(acceptedCount), icon: ShieldCheck,    color: 'text-[#ff6b2b]' },
                        { label: 'Unique Voters',   value: String(uniqueVoters),  icon: Users,          color: 'text-white' },
                    ].map((stat, i) => (
                        <motion.div
                            key={i}
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: i * 0.08 }}
                            className="bg-[#050505] border-2 border-white/10 p-12 rounded-[4rem] group hover:border-[#ff6b2b]/40 transition-all flex flex-col gap-6 relative overflow-hidden backdrop-blur-3xl shadow-[0_60px_120px_rgba(0,0,0,0.85)]"
                        >
                            <stat.icon className="absolute right-[-20px] top-[-20px] w-48 h-48 text-white/5 opacity-[0.03] group-hover:scale-110 transition-transform group-hover:rotate-12 duration-1000" />
                            <div className={`flex items-center gap-4 text-[11px] font-black uppercase tracking-[0.5em] text-white/20 italic pl-2 group-hover:text-[#ff6b2b]/40 transition-colors`}>
                                <stat.icon size={16} strokeWidth={2.5} className={stat.color} /> {stat.label}
                            </div>
                            <span className={`text-6xl font-black italic tracking-tighter leading-none pl-2 transition-all ${stat.color}`}>
                                {stat.value}
                            </span>
                        </motion.div>
                    ))}
                </section>

                {/* ── REAL-TIME TELEMETRY PANEL ── */}
                {telemetry && (
                    <motion.section
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="grid grid-cols-1 lg:grid-cols-3 gap-10"
                    >
                        {/* Status Breakdown */}
                        <div className="lg:col-span-1 bg-[#050505] border-2 border-white/10 rounded-[3.5rem] p-12 space-y-10 backdrop-blur-3xl relative overflow-hidden">
                            <div className="text-[11px] font-black uppercase tracking-[0.8em] text-white/20 italic flex items-center gap-4">
                                <Activity size={16} className="text-[#ff6b2b]" /> Protocol Status Index
                            </div>
                            <div className="space-y-6">
                                {[
                                    { status: 'Draft',    icon: Clock,        color: 'text-white/40' },
                                    { status: 'Active',   icon: Radio,        color: 'text-[#ff6b2b]' },
                                    { status: 'Accepted', icon: CheckCircle,  color: 'text-green-400' },
                                    { status: 'Rejected', icon: XCircle,      color: 'text-red-400' },
                                ].map(({ status, icon: Icon, color }) => {
                                    const count = telemetry.statusCounts[status] || 0;
                                    const total = totalProposals || 1;
                                    const pct = Math.round((count / total) * 100);
                                    return (
                                        <div key={status} className="space-y-3">
                                            <div className="flex justify-between items-center">
                                                <div className={`flex items-center gap-3 text-[12px] font-black uppercase tracking-[0.4em] italic leading-none ${color}`}>
                                                    <Icon size={14} strokeWidth={2.5} /> {status}
                                                </div>
                                                <span className="text-[12px] font-black text-white/40 italic">{count}</span>
                                            </div>
                                            <div className="h-1.5 bg-white/5 rounded-full overflow-hidden">
                                                <motion.div
                                                    initial={{ width: 0 }}
                                                    animate={{ width: `${pct}%` }}
                                                    transition={{ duration: 0.8, ease: 'easeOut' }}
                                                    className="h-full bg-[#ff6b2b] rounded-full"
                                                />
                                            </div>
                                        </div>
                                    );
                                })}
                            </div>
                        </div>

                        {/* Top Proposals Resonance */}
                        <div className="lg:col-span-2 bg-[#050505] border-2 border-white/10 rounded-[3.5rem] p-12 space-y-10 backdrop-blur-3xl relative overflow-hidden">
                            <div className="flex items-center justify-between">
                                <div className="text-[11px] font-black uppercase tracking-[0.8em] text-white/20 italic flex items-center gap-4">
                                    <Zap size={16} className="text-[#ff6b2b]" /> Live Resonance Matrix
                                </div>
                                <div className="text-[10px] font-black text-[#ff6b2b] uppercase tracking-[0.4em] animate-pulse flex items-center gap-2 italic">
                                    <span className="w-1.5 h-1.5 rounded-full bg-[#ff6b2b] inline-block animate-ping" />
                                    STREAMING
                                </div>
                            </div>
                            <div className="space-y-6">
                                {(telemetry.topProposals.length > 0 ? telemetry.topProposals : proposals.slice(0,5)).map((p: any, i: number) => {
                                    const maxResonance = 1000;
                                    const pct = Math.min(100, ((p.resonance ?? p.resonanceThreshold ?? 0) / maxResonance) * 100);
                                    return (
                                        <Link href={`/governance/hip/${p.id}`} key={p.id} className="block group">
                                            <div className="space-y-3 hover:opacity-80 transition-opacity">
                                                <div className="flex justify-between items-center">
                                                    <div className="text-[12px] font-black uppercase tracking-[0.3em] text-white/60 group-hover:text-white transition-colors italic leading-none truncate max-w-[70%]">
                                                        HIP-{String(p.hipNumber).padStart(4,'0')} · {p.title}
                                                    </div>
                                                    <span className="text-[12px] font-black text-[#ff6b2b] italic tabular-nums">
                                                        {(p.resonance ?? p.resonanceThreshold ?? 0).toFixed(1)}
                                                    </span>
                                                </div>
                                                <div className="h-2 bg-white/5 rounded-full overflow-hidden">
                                                    <motion.div
                                                        initial={{ width: 0 }}
                                                        animate={{ width: `${pct}%` }}
                                                        transition={{ duration: 1, ease: 'easeOut', delay: i * 0.1 }}
                                                        className="h-full rounded-full bg-gradient-to-r from-[#ff6b2b]/60 to-[#ff6b2b]"
                                                    />
                                                </div>
                                            </div>
                                        </Link>
                                    );
                                })}
                                {telemetry.topProposals.length === 0 && proposals.length === 0 && (
                                    <p className="text-white/20 text-center italic font-black uppercase tracking-[0.5em] text-[11px]">No proposals in ledger yet.</p>
                                )}
                            </div>
                            {/* Activity log */}
                            {liveActivity.length > 0 && (
                                <div className="pt-6 border-t border-white/5 space-y-2">
                                    {liveActivity.map((entry, i) => (
                                        <div key={i} className={`text-[10px] font-black uppercase tracking-[0.4em] italic leading-none transition-colors ${i === 0 ? 'text-[#ff6b2b]/60' : 'text-white/10'}`}>
                                            <Terminal size={10} className="inline mr-2" />{entry}
                                        </div>
                                    ))}
                                </div>
                            )}
                        </div>
                    </motion.section>
                )}

                {/* ── HIP DIRECTORY ── */}
                <section className="space-y-16">
                    <div className="flex items-center justify-between border-b border-white/5 pb-10 group">
                        <h2 className="text-4xl font-black uppercase tracking-tighter italic text-white/40 group-hover:text-white transition-colors flex items-center gap-6">
                            <FileText size={32} className="text-[#ff6b2b]" strokeWidth={2.5} /> Improvement Index_
                        </h2>
                        <div className="flex items-center gap-8">
                             <div className="text-[11px] text-white/20 font-black uppercase tracking-[0.4em] italic">Epoch: 07</div>
                             <div className={`text-[11px] font-black uppercase tracking-[0.4em] italic ${streamStatus === 'live' ? 'text-[#ff6b2b] animate-pulse' : 'text-white/20'}`}>
                                 {streamStatus === 'live' ? 'LIVE_SYNC' : 'OFFLINE'}
                             </div>
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
                                        transition={{ delay: i * 0.07 }}
                                    >
                                        <Link href={`/governance/hip/${hip.id}`} className="block group">
                                            <div className="p-12 lg:p-14 bg-[#050505] border-2 border-white/10 rounded-[4.5rem] flex flex-col md:flex-row items-center justify-between gap-12 hover:border-[#ff6b2b]/40 hover:bg-[#ff6b2b]/5 transition-all shadow-[0_60px_120px_rgba(0,0,0,0.95)] relative overflow-hidden backdrop-blur-3xl group-hover:scale-[1.01]">
                                                <div className="absolute top-0 left-0 w-2 h-full bg-[#ff6b2b] scale-y-0 group-hover:scale-y-100 transition-transform origin-top" />
                                                
                                                <div className="space-y-6 flex-1 text-center md:text-left">
                                                    <div className="flex items-center justify-center md:justify-start gap-6">
                                                        <span className="px-6 py-2 bg-[#ff6b2b]/10 border border-[#ff6b2b]/20 text-[#ff6b2b] text-[10px] font-black tracking-[0.5em] uppercase rounded-full italic leading-none">
                                                            HIP-{hip.hipNumber.toString().padStart(4, '0')}
                                                        </span>
                                                        <span className={`px-5 py-2 text-[10px] font-black uppercase tracking-[0.5em] rounded-full italic leading-none border-2 ${STATUS_STYLES[hip.status] || STATUS_STYLES['Draft']}`}>
                                                            {hip.status}
                                                        </span>
                                                        {hip.type && (
                                                            <span className="px-5 py-2 text-[10px] font-black uppercase tracking-[0.4em] rounded-full italic leading-none border-2 border-white/5 text-white/20 hidden lg:inline">
                                                                {hip.type}
                                                            </span>
                                                        )}
                                                    </div>
                                                    <h3 className="text-4xl lg:text-5xl font-black text-white italic group-hover:text-[#ff6b2b] transition-colors tracking-tighter leading-tight pr-4">{hip.title}</h3>
                                                    <div className="text-[11px] text-white/20 font-black uppercase tracking-[0.6em] italic leading-none pt-2 flex items-center justify-center md:justify-start gap-4">
                                                        <Users size={14} /> Author: <span className="text-[#ff6b2b]/60">{hip.authorId}</span>
                                                    </div>
                                                </div>

                                                <div className="flex flex-col items-end gap-6 shrink-0">
                                                    {/* Mini resonance bar */}
                                                    <div className="text-right space-y-2 w-40">
                                                        <div className="text-[11px] text-white/20 uppercase tracking-[0.5em] font-black italic leading-none">Resonance</div>
                                                        <div className="text-3xl font-black italic text-white group-hover:text-[#ff6b2b] transition-colors tracking-tighter leading-none">
                                                            {(hip.resonanceThreshold || 0).toFixed(1)}
                                                        </div>
                                                        <div className="h-1 bg-white/5 rounded-full overflow-hidden">
                                                            <div
                                                                className="h-full bg-[#ff6b2b] rounded-full transition-all duration-1000"
                                                                style={{ width: `${Math.min(100, ((hip.resonanceThreshold || 0) / 1000) * 100)}%` }}
                                                            />
                                                        </div>
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
                <div className="text-[30vw] font-black italic leading-none uppercase">GOVERN</div>
            </div>
            
            {/* ── DRAFTING MODAL ── */}
            <AnimatePresence>
                {isDrafting && (
                    <motion.div 
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        className="fixed inset-0 z-[100] flex items-center justify-center p-8 lg:p-24 bg-black/80 backdrop-blur-2xl"
                    >
                        <motion.div 
                            initial={{ scale: 0.9, opacity: 0, y: 40 }}
                            animate={{ scale: 1, opacity: 1, y: 0 }}
                            exit={{ scale: 0.9, opacity: 0, y: 40 }}
                            className="relative w-full max-w-6xl bg-[#0a0a0a] border-2 border-white/10 rounded-[4rem] overflow-hidden shadow-[0_80px_150px_rgba(0,0,0,1)] flex flex-col max-h-[90vh]"
                        >
                            <div className="absolute top-0 left-0 w-full h-[1px] bg-gradient-to-r from-transparent via-[#ff6b2b]/40 to-transparent" />
                            
                            <header className="p-10 border-b border-white/5 flex justify-between items-center shrink-0">
                                <div className="space-y-1">
                                    <div className="text-[10px] text-[#ff6b2b] font-black uppercase tracking-[0.8em] italic leading-none">Protocol_Drafting_v7</div>
                                    <h2 className="text-3xl font-black text-white italic tracking-tighter uppercase leading-none">Initiate New HIP</h2>
                                </div>
                                <button 
                                    onClick={() => setIsDrafting(false)}
                                    className="h-14 w-14 bg-white/5 border border-white/10 rounded-2xl flex items-center justify-center text-white/40 hover:text-white hover:bg-white/10 transition-all"
                                >
                                    <X size={24} />
                                </button>
                            </header>

                            <div className="flex-1 overflow-y-auto p-12 space-y-12">
                                {draftError && (
                                    <div className="p-8 bg-red-500/10 border-2 border-red-500/20 rounded-3xl text-[11px] text-red-500 font-black uppercase tracking-[0.4em] italic leading-none text-center">
                                        Error: {draftError}
                                    </div>
                                )}

                                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-10">
                                    <div className="space-y-4">
                                        <label className="text-[10px] text-white/20 font-black uppercase tracking-[0.6em] italic leading-none pl-2">Proposal Title_</label>
                                        <input 
                                            type="text" 
                                            value={newHip.title}
                                            onChange={(e) => setNewHip({...newHip, title: e.target.value})}
                                            placeholder="Sovereign Expansion Protocol..."
                                            className="w-full p-8 bg-white/[0.02] border-2 border-white/5 rounded-3xl text-white font-black italic tracking-tight focus:border-[#ff6b2b]/40 focus:bg-[#ff6b2b]/5 transition-all outline-none"
                                        />
                                    </div>
                                    <div className="space-y-4">
                                        <label className="text-[10px] text-white/20 font-black uppercase tracking-[0.6em] italic leading-none pl-2">Classification_</label>
                                        <select 
                                            value={newHip.type}
                                            onChange={(e) => setNewHip({...newHip, type: e.target.value})}
                                            className="w-full p-8 bg-white/[0.02] border-2 border-white/5 rounded-3xl text-white font-black italic tracking-tight focus:border-[#ff6b2b]/40 focus:bg-[#ff6b2b]/5 transition-all outline-none appearance-none"
                                        >
                                            <option>Standards Track</option>
                                            <option>Informational</option>
                                            <option>Process</option>
                                        </select>
                                    </div>
                                    <div className="space-y-4">
                                        <label className="text-[10px] text-white/20 font-black uppercase tracking-[0.6em] italic leading-none pl-2">Network Layer_</label>
                                        <input 
                                            type="text" 
                                            value={newHip.layer}
                                            onChange={(e) => setNewHip({...newHip, layer: e.target.value})}
                                            placeholder="Consensus / API / UX"
                                            className="w-full p-8 bg-white/[0.02] border-2 border-white/5 rounded-3xl text-white font-black italic tracking-tight focus:border-[#ff6b2b]/40 focus:bg-[#ff6b2b]/5 transition-all outline-none"
                                        />
                                    </div>
                                </div>

                                <div className="space-y-4">
                                    <label className="text-[10px] text-white/20 font-black uppercase tracking-[0.6em] italic leading-none pl-2">Protocol Specification (Markdown)_</label>
                                    <textarea 
                                        rows={10}
                                        value={newHip.content}
                                        onChange={(e) => setNewHip({...newHip, content: e.target.value})}
                                        placeholder={"## Abstract\nDescribe the systemic intent...\n\n## Motivation\n\n## Specification\n\n## Rationale"}
                                        className="w-full p-10 bg-white/[0.02] border-2 border-white/5 rounded-[3rem] text-white font-mono text-xl leading-relaxed focus:border-[#ff6b2b]/40 focus:bg-[#ff6b2b]/5 transition-all outline-none"
                                    />
                                </div>
                            </div>

                            <footer className="p-10 border-t border-white/5 bg-black/40 backdrop-blur-3xl flex justify-end shrink-0">
                                 <button 
                                    disabled={isSubmitting || !newHip.title || !newHip.content}
                                    onClick={handleInitiateDraft}
                                    className="px-16 py-8 bg-[#ff6b2b] text-black font-black uppercase tracking-[0.6em] rounded-[2.5rem] shadow-[0_40px_100px_rgba(255,107,43,0.3)] hover:scale-[1.05] active:scale-95 transition-all text-xs flex items-center justify-center gap-6 italic leading-none disabled:opacity-30 disabled:grayscale"
                                 >
                                     {isSubmitting ? (
                                         <span className="animate-pulse">Anchoring Protocol...</span>
                                     ) : (
                                         <>Anchor to Sovereign Ledger <ArrowUpRight size={20} strokeWidth={4} /></>
                                     )}
                                 </button>
                            </footer>
                        </motion.div>
                    </motion.div>
                )}
            </AnimatePresence>

            <style jsx global>{`
                .animate-spin-slow { animation: spin 25s linear infinite; }
                @keyframes spin { from { transform: rotate(0deg); } to { transform: rotate(360deg); } }
            `}</style>
        </div>
    );
}
