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
    Draft:     'border-border text-muted-foreground',
    Active:    'border-[#ff6b2b]/40 text-[#ff6b2b] animate-pulse shadow-[0_0_20px_rgba(255,107,43,0.3)]',
    Accepted:  'border-green-500/30 text-green-500',
    Rejected:  'border-red-500/30 text-red-500',
    Deferred:  'border-yellow-500/30 text-yellow-500',
    Withdrawn: 'border-border text-muted-foreground/50',
    Final:     'border-blue-500/30 text-blue-500',
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
            fetchProposals();
            setLiveActivity(prev => [
                `Telemetry sync @ ${new Date(data.timestamp).toLocaleTimeString()}`,
                ...prev.slice(0, 4)
            ]);
        });

        es.addEventListener('error', () => setStreamStatus('error'));

        es.onerror = () => {
            setStreamStatus('error');
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
        <div className="relative min-h-screen bg-background text-foreground selection:bg-[#ff6b2b]/40 font-sans overflow-x-hidden pb-40">
            
            {/* 🌌 AMBIENT CORE */}
            <div className="fixed inset-0 pointer-events-none z-0">
                <div className="absolute top-0 right-[-10%] w-[100vw] h-[100vw] bg-[#ff6b2b]/5 blur-[350px] rounded-full" />
                <div className="absolute bottom-[-10%] left-[-10%] w-[90vw] h-[90vw] bg-[#ff6b2b]/3 blur-[200px] rounded-full" />
            </div>

            {/* ── HEADER ── */}
            <header className="relative z-50 w-full px-8 lg:px-14 py-6 flex justify-between items-center bg-background/80 backdrop-blur-3xl border-b border-border">
                <Link href="/" className="inline-flex items-center gap-4 text-muted-foreground hover:text-[#ff6b2b] transition-all text-[11px] font-black uppercase tracking-[0.6em] group italic active:scale-95 leading-none">
                    <ChevronLeft size={16} className="group-hover:-translate-x-2 transition-transform" /> Core Matrix
                </Link>
                <div className="flex items-center gap-6">
                    {/* Live stream indicator */}
                    <div className={`flex items-center gap-3 px-5 py-2 rounded-full border text-[9px] font-black uppercase tracking-[0.4em] italic leading-none ${
                        streamStatus === 'live'
                            ? 'bg-[#ff6b2b]/10 border-[#ff6b2b]/20 text-[#ff6b2b]'
                            : streamStatus === 'error'
                            ? 'bg-red-500/10 border-red-500/20 text-red-500'
                            : 'bg-secondary/50 border-border text-muted-foreground animate-pulse'
                    }`}>
                        <span className={`w-1.5 h-1.5 rounded-full ${streamStatus === 'live' ? 'bg-[#ff6b2b] animate-ping' : streamStatus === 'error' ? 'bg-red-500' : 'bg-muted-foreground/50'}`} />
                        {streamStatus === 'live' ? 'STREAM_LIVE' : streamStatus === 'error' ? 'STREAM_ERR' : 'CONNECTING...'}
                    </div>
                    <div className="px-5 py-2 bg-[#ff6b2b]/10 border border-[#ff6b2b]/20 rounded-full text-[9px] font-black text-[#ff6b2b] uppercase tracking-[0.4em] italic leading-none hidden sm:block">
                        GOV_PROX_v7.0
                    </div>
                </div>
            </header>

            <main className="relative z-10 max-w-[1600px] mx-auto px-6 md:px-12 lg:px-20 pt-16 md:pt-24 space-y-16 md:space-y-24">
                
                {/* ── HERO HEADER ── */}
                <motion.section 
                    initial={{ opacity: 0, y: 30 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="flex flex-col lg:flex-row justify-between items-end gap-12"
                >
                    <div className="space-y-8 max-w-4xl">
                        <div className="inline-flex items-center gap-3 px-5 py-2 bg-secondary border border-border rounded-full backdrop-blur-xl shadow-sm">
                            <ShieldCheck size={18} className="text-[#ff6b2b]" />
                            <span className="text-[10px] font-black tracking-[0.6em] text-[#ff6b2b] uppercase italic leading-none pl-1">Decentralized Consensus Engine</span>
                        </div>
                        <div className="space-y-6">
                            <h1 className="text-6xl md:text-8xl font-black uppercase tracking-tighter italic leading-[0.85] text-foreground">
                                Sovereign<br/>
                                <span className="text-transparent bg-clip-text bg-gradient-to-r from-foreground via-foreground/80 to-[#ff6b2b]/40">Governance.</span>
                            </h1>
                            <p className="text-xl md:text-2xl text-muted-foreground max-w-3xl leading-relaxed font-light italic tracking-tight">
                                Direct orchestration of the OMEGA improvement protocols. 
                                <span className="text-foreground/70"> Shape the architecture</span> of the world's most advanced autonomous system.
                            </p>
                        </div>
                    </div>

                    <div className="flex flex-col gap-8 shrink-0">
                         <button 
                            onClick={() => setIsDrafting(true)}
                            className="px-12 py-6 bg-[#ff6b2b] text-black font-black uppercase tracking-[0.6em] rounded-full shadow-[0_20px_40px_rgba(255,107,43,0.2)] hover:scale-[1.02] active:scale-95 transition-all text-[10px] flex items-center justify-center gap-4 italic leading-none relative group/btn"
                         >
                             <Plus size={16} strokeWidth={3} />
                             <span className="relative z-10">Initiate HIP Draft</span>
                             <div className="absolute inset-0 bg-white opacity-0 group-hover/btn:opacity-10 transition-opacity rounded-full" />
                         </button>
                    </div>
                </motion.section>

                {/* ── LIVE TELEMETRY STATS ── */}
                <section className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
                    {[
                        { label: 'Total Proposals', value: String(totalProposals), icon: Activity,      color: 'text-[#ff6b2b]' },
                        { label: 'Total Resonance', value: totalResonance.toLocaleString(undefined, { maximumFractionDigits: 1 }), icon: TrendingUp, color: 'text-foreground' },
                        { label: 'Accepted HIPs',   value: String(acceptedCount), icon: ShieldCheck,    color: 'text-[#ff6b2b]' },
                        { label: 'Unique Voters',   value: String(uniqueVoters),  icon: Users,          color: 'text-foreground' },
                    ].map((stat, i) => (
                        <motion.div
                            key={i}
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: i * 0.08 }}
                            className="bg-secondary/30 border border-border p-8 md:p-10 rounded-[2.5rem] group hover:border-[#ff6b2b]/40 transition-all flex flex-col gap-5 relative overflow-hidden backdrop-blur-xl shadow-sm"
                        >
                            <stat.icon className="absolute right-[-10px] top-[-10px] w-32 h-32 text-foreground opacity-[0.02] group-hover:scale-110 transition-transform group-hover:rotate-12 duration-1000" />
                            <div className={`flex items-center gap-3 text-[9px] font-black uppercase tracking-[0.4em] text-muted-foreground italic pl-1 group-hover:text-[#ff6b2b]/60 transition-colors`}>
                                <stat.icon size={14} strokeWidth={2.5} className={stat.color} /> {stat.label}
                            </div>
                            <span className={`text-5xl font-black italic tracking-tighter leading-none pl-1 transition-all ${stat.color}`}>
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
                        className="grid grid-cols-1 lg:grid-cols-3 gap-8"
                    >
                        {/* Status Breakdown */}
                        <div className="lg:col-span-1 bg-secondary/10 border border-border rounded-[3rem] p-8 md:p-10 space-y-8 backdrop-blur-xl relative overflow-hidden shadow-sm">
                            <div className="text-[10px] font-black uppercase tracking-[0.6em] text-muted-foreground italic flex items-center gap-3 pl-1">
                                <Activity size={14} className="text-[#ff6b2b]" /> Protocol Status Index
                            </div>
                            <div className="space-y-5">
                                {[
                                    { status: 'Draft',    icon: Clock,        color: 'text-muted-foreground' },
                                    { status: 'Active',   icon: Radio,        color: 'text-[#ff6b2b]' },
                                    { status: 'Accepted', icon: CheckCircle,  color: 'text-green-500' },
                                    { status: 'Rejected', icon: XCircle,      color: 'text-red-500' },
                                ].map(({ status, icon: Icon, color }) => {
                                    const count = telemetry.statusCounts[status] || 0;
                                    const total = totalProposals || 1;
                                    const pct = Math.round((count / total) * 100);
                                    return (
                                        <div key={status} className="space-y-2">
                                            <div className="flex justify-between items-center">
                                                <div className={`flex items-center gap-2 text-[10px] font-black uppercase tracking-[0.3em] italic leading-none ${color}`}>
                                                    <Icon size={12} strokeWidth={2.5} /> {status}
                                                </div>
                                                <span className="text-[10px] font-black text-muted-foreground/80 italic">{count}</span>
                                            </div>
                                            <div className="h-1.5 bg-background border border-border rounded-full overflow-hidden p-[1px]">
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
                        <div className="lg:col-span-2 bg-secondary/10 border border-border rounded-[3rem] p-8 md:p-10 space-y-8 backdrop-blur-xl relative overflow-hidden shadow-sm">
                            <div className="flex items-center justify-between pl-1">
                                <div className="text-[10px] font-black uppercase tracking-[0.6em] text-muted-foreground italic flex items-center gap-3">
                                    <Zap size={14} className="text-[#ff6b2b]" /> Live Resonance Matrix
                                </div>
                                <div className="text-[9px] font-black text-[#ff6b2b] uppercase tracking-[0.3em] animate-pulse flex items-center gap-2 italic">
                                    <span className="w-1.5 h-1.5 rounded-full bg-[#ff6b2b] inline-block animate-ping" />
                                    STREAMING
                                </div>
                            </div>
                            <div className="space-y-5">
                                {(telemetry.topProposals.length > 0 ? telemetry.topProposals : proposals.slice(0,5)).map((p: any, i: number) => {
                                    const maxResonance = 1000;
                                    const pct = Math.min(100, ((p.resonance ?? p.resonanceThreshold ?? 0) / maxResonance) * 100);
                                    return (
                                        <Link href={`/governance/hip/${p.id}`} key={p.id} className="block group">
                                            <div className="space-y-2 hover:opacity-80 transition-opacity">
                                                <div className="flex justify-between items-center">
                                                    <div className="text-[10px] font-black uppercase tracking-[0.2em] text-muted-foreground group-hover:text-foreground transition-colors italic leading-none truncate max-w-[70%]">
                                                        HIP-{String(p.hipNumber).padStart(4,'0')} · {p.title}
                                                    </div>
                                                    <span className="text-[10px] font-black text-[#ff6b2b] italic tabular-nums">
                                                        {(p.resonance ?? p.resonanceThreshold ?? 0).toFixed(1)}
                                                    </span>
                                                </div>
                                                <div className="h-1.5 bg-background border border-border rounded-full overflow-hidden p-[1px]">
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
                                    <p className="text-muted-foreground/60 text-center italic font-black uppercase tracking-[0.4em] text-[9px]">No proposals in ledger yet.</p>
                                )}
                            </div>
                            {/* Activity log */}
                            {liveActivity.length > 0 && (
                                <div className="pt-5 border-t border-border space-y-2">
                                    {liveActivity.map((entry, i) => (
                                        <div key={i} className={`text-[9px] font-black uppercase tracking-[0.3em] italic leading-none transition-colors ${i === 0 ? 'text-[#ff6b2b]/80' : 'text-muted-foreground/40'}`}>
                                            <Terminal size={10} className="inline mr-2" />{entry}
                                        </div>
                                    ))}
                                </div>
                            )}
                        </div>
                    </motion.section>
                )}

                {/* ── HIP DIRECTORY ── */}
                <section className="space-y-12">
                    <div className="flex items-center justify-between border-b border-border pb-8 group">
                        <h2 className="text-3xl font-black uppercase tracking-tight italic text-muted-foreground group-hover:text-foreground transition-colors flex items-center gap-4">
                            <FileText size={28} className="text-[#ff6b2b]" strokeWidth={2.5} /> Improvement Index_
                        </h2>
                        <div className="flex items-center gap-6 hidden sm:flex">
                             <div className="text-[9px] text-muted-foreground/80 font-black uppercase tracking-[0.4em] italic">Epoch: 07</div>
                             <div className={`text-[9px] font-black uppercase tracking-[0.4em] italic ${streamStatus === 'live' ? 'text-[#ff6b2b] animate-pulse' : 'text-muted-foreground/40'}`}>
                                 {streamStatus === 'live' ? 'LIVE_SYNC' : 'OFFLINE'}
                             </div>
                        </div>
                    </div>
                    
                    <div className="space-y-6 mb-40">
                        {loading ? (
                            <div className="space-y-6">
                                {[1,2,3].map(i => (
                                    <div key={i} className="h-32 bg-secondary/20 border border-border rounded-[2.5rem] animate-pulse" />
                                ))}
                            </div>
                        ) : proposals.length === 0 ? (
                            <div className="p-24 border-2 border-dashed border-border rounded-[4rem] text-center flex flex-col items-center gap-8 opacity-40">
                                <Gavel size={64} className="text-[#ff6b2b] animate-bounce" />
                                <p className="text-xl font-black uppercase tracking-[0.6em] italic text-muted-foreground">No active proposals in matrix.</p>
                            </div>
                        ) : (
                            <div className="space-y-6">
                                {proposals.map((hip, i) => (
                                    <motion.div
                                        key={hip.id}
                                        initial={{ opacity: 0, x: -10 }}
                                        animate={{ opacity: 1, x: 0 }}
                                        transition={{ delay: i * 0.05 }}
                                    >
                                        <Link href={`/governance/hip/${hip.id}`} className="block group">
                                            <div className="p-8 lg:p-10 bg-background border border-border rounded-[2.5rem] flex flex-col md:flex-row items-center justify-between gap-8 hover:border-[#ff6b2b]/40 hover:bg-[#ff6b2b]/5 transition-all shadow-sm relative overflow-hidden group-hover:scale-[1.01]">
                                                <div className="absolute top-0 left-0 w-1.5 h-full bg-[#ff6b2b] scale-y-0 group-hover:scale-y-100 transition-transform origin-top" />
                                                
                                                <div className="space-y-4 flex-1 text-center md:text-left overflow-hidden">
                                                    <div className="flex items-center justify-center md:justify-start gap-4">
                                                        <span className="px-5 py-1.5 bg-[#ff6b2b]/10 border border-[#ff6b2b]/20 text-[#ff6b2b] text-[9px] font-black tracking-[0.4em] uppercase rounded-full italic leading-none">
                                                            HIP-{hip.hipNumber.toString().padStart(4, '0')}
                                                        </span>
                                                        <span className={`px-4 py-1.5 text-[9px] font-black uppercase tracking-[0.4em] rounded-full italic leading-none border ${STATUS_STYLES[hip.status] || STATUS_STYLES['Draft']}`}>
                                                            {hip.status}
                                                        </span>
                                                        {hip.type && (
                                                            <span className="px-4 py-1.5 text-[9px] font-black uppercase tracking-[0.3em] rounded-full italic leading-none border border-border text-muted-foreground hidden lg:inline">
                                                                {hip.type}
                                                            </span>
                                                        )}
                                                    </div>
                                                    <h3 className="text-3xl lg:text-4xl font-black text-foreground italic group-hover:text-[#ff6b2b] transition-colors tracking-tight leading-tight pr-2 truncate">{hip.title}</h3>
                                                    <div className="text-[10px] text-muted-foreground/80 font-black uppercase tracking-[0.4em] italic leading-none pt-1 flex items-center justify-center md:justify-start gap-3 truncate">
                                                        <Users size={12} /> Author: <span className="text-[#ff6b2b]/80">{hip.authorId}</span>
                                                    </div>
                                                </div>

                                                <div className="flex flex-col items-end gap-6 shrink-0">
                                                    <div className="text-right space-y-2 w-32">
                                                        <div className="text-[9px] text-muted-foreground/60 uppercase tracking-[0.4em] font-black italic leading-none">Resonance</div>
                                                        <div className="text-2xl font-black italic text-foreground group-hover:text-[#ff6b2b] transition-colors tracking-tighter leading-none">
                                                            {(hip.resonanceThreshold || 0).toFixed(1)}
                                                        </div>
                                                        <div className="h-1.5 bg-background border border-border rounded-full overflow-hidden p-[1px]">
                                                            <div
                                                                className="h-full bg-[#ff6b2b] rounded-full transition-all duration-1000"
                                                                style={{ width: `${Math.min(100, ((hip.resonanceThreshold || 0) / 1000) * 100)}%` }}
                                                            />
                                                        </div>
                                                    </div>
                                                    <div className="h-14 w-14 rounded-2xl bg-secondary border border-border flex items-center justify-center text-muted-foreground group-hover:bg-[#ff6b2b] group-hover:text-black group-hover:border-[#ff6b2b] transition-all duration-300 shadow-sm">
                                                        <ChevronRight size={24} strokeWidth={2.5} className="group-hover:translate-x-1 transition-transform" />
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
            
            {/* ── DRAFTING MODAL ── */}
            <AnimatePresence>
                {isDrafting && (
                    <motion.div 
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        className="fixed inset-0 z-[100] flex items-center justify-center p-6 lg:p-12 bg-background/90 backdrop-blur-xl"
                    >
                        <motion.div 
                            initial={{ scale: 0.95, opacity: 0, y: 20 }}
                            animate={{ scale: 1, opacity: 1, y: 0 }}
                            exit={{ scale: 0.95, opacity: 0, y: 20 }}
                            className="relative w-full max-w-5xl bg-background border border-border rounded-[2.5rem] overflow-hidden shadow-2xl flex flex-col max-h-[90vh]"
                        >
                            <div className="absolute top-0 left-0 w-full h-[1px] bg-gradient-to-r from-transparent via-[#ff6b2b]/40 to-transparent" />
                            
                            <header className="p-8 border-b border-border flex justify-between items-center shrink-0 bg-secondary/30">
                                <div className="space-y-1">
                                    <div className="text-[9px] text-[#ff6b2b] font-black uppercase tracking-[0.6em] italic leading-none">Protocol_Drafting_v7</div>
                                    <h2 className="text-2xl font-black text-foreground italic tracking-tight uppercase leading-none">Initiate New HIP</h2>
                                </div>
                                <button 
                                    onClick={() => setIsDrafting(false)}
                                    className="h-10 w-10 bg-background border border-border rounded-xl flex items-center justify-center text-muted-foreground hover:text-foreground hover:bg-secondary transition-all"
                                >
                                    <X size={20} />
                                </button>
                            </header>

                            <div className="flex-1 overflow-y-auto p-8 lg:p-10 space-y-8 custom-scrollbar">
                                {draftError && (
                                    <div className="p-6 bg-red-500/10 border border-red-500/20 rounded-2xl text-[10px] text-red-500 font-black uppercase tracking-[0.3em] italic leading-none text-center">
                                        Error: {draftError}
                                    </div>
                                )}

                                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                                    <div className="space-y-3">
                                        <label className="text-[9px] text-muted-foreground font-black uppercase tracking-[0.4em] italic leading-none pl-1">Proposal Title_</label>
                                        <input 
                                            type="text" 
                                            value={newHip.title}
                                            onChange={(e) => setNewHip({...newHip, title: e.target.value})}
                                            placeholder="Sovereign Expansion Protocol..."
                                            className="w-full p-6 bg-secondary/50 border border-border rounded-2xl text-foreground font-black italic tracking-tight focus:border-[#ff6b2b]/40 focus:bg-[#ff6b2b]/5 transition-all outline-none text-sm"
                                        />
                                    </div>
                                    <div className="space-y-3">
                                        <label className="text-[9px] text-muted-foreground font-black uppercase tracking-[0.4em] italic leading-none pl-1">Classification_</label>
                                        <select 
                                            value={newHip.type}
                                            onChange={(e) => setNewHip({...newHip, type: e.target.value})}
                                            className="w-full p-6 bg-secondary/50 border border-border rounded-2xl text-foreground font-black italic tracking-tight focus:border-[#ff6b2b]/40 focus:bg-[#ff6b2b]/5 transition-all outline-none appearance-none text-sm"
                                        >
                                            <option>Standards Track</option>
                                            <option>Informational</option>
                                            <option>Process</option>
                                        </select>
                                    </div>
                                    <div className="space-y-3">
                                        <label className="text-[9px] text-muted-foreground font-black uppercase tracking-[0.4em] italic leading-none pl-1">Network Layer_</label>
                                        <input 
                                            type="text" 
                                            value={newHip.layer}
                                            onChange={(e) => setNewHip({...newHip, layer: e.target.value})}
                                            placeholder="Consensus / API / UX"
                                            className="w-full p-6 bg-secondary/50 border border-border rounded-2xl text-foreground font-black italic tracking-tight focus:border-[#ff6b2b]/40 focus:bg-[#ff6b2b]/5 transition-all outline-none text-sm"
                                        />
                                    </div>
                                </div>

                                <div className="space-y-3">
                                    <label className="text-[9px] text-muted-foreground font-black uppercase tracking-[0.4em] italic leading-none pl-1">Protocol Specification (Markdown)_</label>
                                    <textarea 
                                        rows={8}
                                        value={newHip.content}
                                        onChange={(e) => setNewHip({...newHip, content: e.target.value})}
                                        placeholder={"## Abstract\nDescribe the systemic intent...\n\n## Motivation\n\n## Specification\n\n## Rationale"}
                                        className="w-full p-8 bg-secondary/50 border border-border rounded-[2rem] text-foreground font-mono text-sm leading-relaxed focus:border-[#ff6b2b]/40 focus:bg-[#ff6b2b]/5 transition-all outline-none"
                                    />
                                </div>
                            </div>

                            <footer className="p-8 border-t border-border bg-secondary/30 flex justify-end shrink-0">
                                 <button 
                                    disabled={isSubmitting || !newHip.title || !newHip.content}
                                    onClick={handleInitiateDraft}
                                    className="px-10 py-5 bg-[#ff6b2b] text-black font-black uppercase tracking-[0.4em] rounded-full shadow-[0_10px_20px_rgba(255,107,43,0.2)] hover:scale-[1.02] active:scale-95 transition-all text-[10px] flex items-center justify-center gap-4 italic leading-none disabled:opacity-30 disabled:grayscale"
                                 >
                                     {isSubmitting ? (
                                         <span className="animate-pulse">Anchoring Protocol...</span>
                                     ) : (
                                         <>Anchor to Sovereign Ledger <ArrowUpRight size={16} strokeWidth={3} /></>
                                     )}
                                 </button>
                            </footer>
                        </motion.div>
                    </motion.div>
                )}
            </AnimatePresence>

            <style jsx global>{`
                .custom-scrollbar::-webkit-scrollbar { width: 4px; height: 4px; }
                .custom-scrollbar::-webkit-scrollbar-thumb { background: rgba(255, 107, 43, 0.2); border-radius: 20px; }
            `}</style>
        </div>
    );
}
