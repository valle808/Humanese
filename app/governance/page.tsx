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
  Orbit,
  Grid,
  ShieldHalf,
  Binary,
  Layers,
  Sparkles,
  Search,
  Wifi,
  Target
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
    Active:    'border-primary/40 text-primary animate-pulse shadow-[0_0_20px_rgba(var(--primary),0.3)]',
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
        <div className="relative min-h-screen bg-background text-foreground selection:bg-primary/40 selection:text-primary font-sans overflow-x-hidden pb-40 transition-colors duration-700 overflow-x-hidden">
            
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
                <div className="absolute top-0 right-[-10%] w-[100vw] h-[100vw] bg-primary/5 blur-[350px] rounded-full" />
                <div className="absolute bottom-[-10%] left-[-10%] w-[90vw] h-[90vw] bg-primary/3 blur-[200px] rounded-full" />
            </div>

            {/* ── HEADER ── */}
            <header className="relative z-50 w-full px-8 lg:px-14 py-6 flex justify-between items-center bg-background/40 backdrop-blur-3xl border-b border-border transition-colors duration-700">
                <Link href="/" className="inline-flex items-center gap-4 text-muted-foreground/40 hover:text-primary transition-all text-[11px] font-black uppercase tracking-[0.6em] group italic active:scale-95 leading-none">
                    <ChevronLeft size={16} className="group-hover:-translate-x-2 transition-transform" /> Core Matrix
                </Link>
                <div className="flex items-center gap-6">
                    {/* Live stream indicator */}
                    <div className={`flex items-center gap-3 px-5 py-2 rounded-full border text-[9px] font-black uppercase tracking-[0.4em] italic leading-none ${
                        streamStatus === 'live'
                            ? 'bg-primary/10 border-primary/20 text-primary'
                            : streamStatus === 'error'
                            ? 'bg-red-500/10 border-red-500/20 text-red-500'
                            : 'bg-secondary/50 border-border text-muted-foreground animate-pulse'
                    }`}>
                        <span className={`w-1.5 h-1.5 rounded-full ${streamStatus === 'live' ? 'bg-primary animate-ping' : streamStatus === 'error' ? 'bg-red-500' : 'bg-muted-foreground/50'}`} />
                        {streamStatus === 'live' ? 'STREAM_LIVE' : streamStatus === 'error' ? 'STREAM_ERR' : 'CONNECTING...'}
                    </div>
                    <div className="px-5 py-2 bg-primary/10 border border-primary/20 rounded-full text-[9px] font-black text-primary uppercase tracking-[0.4em] italic leading-none hidden sm:block">
                        GOV_PROX_v7.0
                    </div>
                </div>
            </header>

            <main className="relative z-10 max-w-[1600px] mx-auto px-6 md:px-12 lg:px-20 pt-16 md:pt-24 lg:pt-32 space-y-16 md:space-y-32 flex-1 flex flex-col">
                
                {/* ── HERO HEADER ── */}
                <motion.section 
                    initial={{ opacity: 0, y: 30 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="flex flex-col lg:flex-row justify-between items-end gap-16 border-b-2 border-border pb-16"
                >
                    <div className="space-y-12 max-w-4xl">
                        <div className="inline-flex items-center gap-4 px-6 py-2.5 bg-muted/40 border border-border rounded-full backdrop-blur-3xl shadow-lg">
                            <ShieldCheck size={20} className="text-primary" />
                            <span className="text-[11px] font-black tracking-[0.4em] md:tracking-[0.8em] text-primary uppercase italic leading-none pl-1">Decentralized Consensus Engine</span>
                        </div>
                        <div className="space-y-8">
                            <h1 className="text-fluid-hero font-black uppercase tracking-tighter italic leading-[0.9] md:leading-[0.8] text-foreground">
                                Sovereign<br/>
                                <span className="text-transparent bg-clip-text bg-gradient-to-r from-foreground via-foreground/80 to-primary/30">Governance.</span>
                            </h1>
                            <p className="text-fluid-body text-muted-foreground/60 max-w-3xl leading-relaxed font-light italic tracking-tight">
                                Direct orchestration of the OMEGA improvement protocols. 
                                <span className="text-foreground/80"> Shape the architecture</span> of the world&apos;s most advanced autonomous system.
                            </p>
                        </div>
                    </div>

                    <div className="flex flex-col gap-10 shrink-0 w-full lg:w-auto">
                         <button 
                            onClick={() => setIsDrafting(true)}
                            className="px-14 py-8 bg-primary text-primary-foreground font-black uppercase tracking-[0.4em] md:tracking-[0.8em] rounded-[2.5rem] shadow-[0_40px_80px_rgba(var(--primary),0.2)] hover:scale-[1.02] active:scale-95 transition-all text-[11px] flex items-center justify-center gap-6 italic leading-none relative group/btn border-0 shadow-2xl"
                         >
                             <Plus size={24} strokeWidth={3} />
                             <span className="relative z-10">Initiate HIP Draft</span>
                             <div className="absolute inset-0 bg-white opacity-0 group-hover/btn:opacity-10 transition-opacity" />
                         </button>
                    </div>
                </motion.section>

                {/* ── LIVE TELEMETRY STATS ── */}
                <section className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-10">
                    {[
                        { label: 'Total Proposals', value: String(totalProposals), icon: Activity,      color: 'text-primary' },
                        { label: 'Total Resonance', value: totalResonance.toLocaleString(undefined, { maximumFractionDigits: 1 }), icon: TrendingUp, color: 'text-foreground' },
                        { label: 'Accepted HIPs',   value: String(acceptedCount), icon: ShieldCheck,    color: 'text-primary' },
                        { label: 'Unique Voters',   value: String(uniqueVoters),  icon: Users,          color: 'text-foreground' },
                    ].map((stat, i) => (
                        <motion.div
                            key={i}
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: i * 0.08 }}
                            className="bg-background border-2 border-border p-10 rounded-[3rem] group hover:border-primary/40 transition-all flex flex-col gap-8 relative overflow-hidden backdrop-blur-3xl shadow-lg shadow-inner"
                        >
                            <stat.icon className="absolute right-[-10px] top-[-10px] w-32 h-32 text-foreground opacity-[0.02] group-hover:scale-110 transition-transform group-hover:rotate-12 duration-1000" />
                            <div className={`flex items-center gap-4 text-[10px] font-black uppercase tracking-[0.6em] text-muted-foreground/30 italic pl-1 group-hover:text-primary/60 transition-colors leading-none`}>
                                <stat.icon size={18} strokeWidth={2.5} className={stat.color} /> {stat.label}
                            </div>
                            <span className={`text-fluid-balance font-black italic tracking-tighter leading-none pl-1 transition-all ${stat.color}`}>
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
                        className="grid grid-cols-1 lg:grid-cols-3 gap-12"
                    >
                        {/* Status Breakdown */}
                        <div className="lg:col-span-1 bg-background border-2 border-border rounded-[3.5rem] p-12 space-y-12 backdrop-blur-3xl relative overflow-hidden shadow-xl shadow-inner">
                            <div className="text-[11px] font-black uppercase tracking-[0.4em] md:tracking-[0.8em] text-muted-foreground/20 italic flex items-center gap-4 pl-1 leading-none">
                                <Activity size={18} className="text-primary" /> Protocol Status Index
                            </div>
                            <div className="space-y-8">
                                {[
                                    { status: 'Draft',    icon: Clock,        color: 'text-muted-foreground/40' },
                                    { status: 'Active',   icon: Radio,        color: 'text-primary' },
                                    { status: 'Accepted', icon: CheckCircle,  color: 'text-green-500' },
                                    { status: 'Rejected', icon: XCircle,      color: 'text-red-500' },
                                ].map(({ status, icon: Icon, color }) => {
                                    const count = telemetry.statusCounts[status] || 0;
                                    const total = totalProposals || 1;
                                    const pct = Math.round((count / total) * 100);
                                    return (
                                        <div key={status} className="space-y-4">
                                            <div className="flex justify-between items-center">
                                                <div className={`flex items-center gap-3 text-[11px] font-black uppercase tracking-[0.4em] italic leading-none ${color}`}>
                                                    <Icon size={16} strokeWidth={2.5} /> {status}
                                                </div>
                                                <span className="text-[11px] font-black text-muted-foreground/20 italic tabular-nums leading-none">{count}</span>
                                            </div>
                                            <div className="h-2 bg-muted border border-border rounded-full overflow-hidden p-[1px] shadow-inner">
                                                <motion.div
                                                    initial={{ width: 0 }}
                                                    animate={{ width: `${pct}%` }}
                                                    transition={{ duration: 1, ease: 'circOut' }}
                                                    className="h-full bg-primary rounded-full shadow-[0_0_10px_rgba(var(--primary),0.4)]"
                                                />
                                            </div>
                                        </div>
                                    );
                                })}
                            </div>
                        </div>

                        {/* Top Proposals Resonance */}
                        <div className="lg:col-span-2 bg-background border-2 border-border rounded-[3.5rem] p-12 space-y-12 backdrop-blur-3xl relative overflow-hidden shadow-xl shadow-inner">
                            <div className="flex items-center justify-between pl-1">
                                <div className="text-[11px] font-black uppercase tracking-[0.4em] md:tracking-[0.8em] text-muted-foreground/20 italic flex items-center gap-4 leading-none">
                                    <Zap size={18} className="text-primary" /> Live Resonance Matrix
                                </div>
                                <div className="text-[10px] font-black text-primary uppercase tracking-[0.5em] animate-pulse flex items-center gap-3 italic leading-none">
                                    <span className="w-2 h-2 rounded-full bg-primary inline-block animate-ping" />
                                    STREAMING
                                </div>
                            </div>
                            <div className="space-y-8">
                                {(telemetry.topProposals.length > 0 ? telemetry.topProposals : proposals.slice(0,5)).map((p: any, i: number) => {
                                    const maxResonance = 1000;
                                    const pct = Math.min(100, ((p.resonance ?? p.resonanceThreshold ?? 0) / maxResonance) * 100);
                                    return (
                                        <Link href={`/governance/hip/${p.id}`} key={p.id} className="block group">
                                            <div className="space-y-4 hover:opacity-80 transition-opacity">
                                                <div className="flex justify-between items-center">
                                                    <div className="text-[11px] font-black uppercase tracking-[0.3em] text-muted-foreground/40 group-hover:text-foreground transition-colors italic leading-none truncate max-w-[75%]">
                                                        HIP-{String(p.hipNumber).padStart(4,'0')} · {p.title}
                                                    </div>
                                                    <span className="text-[12px] font-black text-primary italic tabular-nums leading-none">
                                                        {(p.resonance ?? p.resonanceThreshold ?? 0).toFixed(1)}
                                                    </span>
                                                </div>
                                                <div className="h-2 bg-muted border border-border rounded-full overflow-hidden p-[1px] shadow-inner">
                                                    <motion.div
                                                        initial={{ width: 0 }}
                                                        animate={{ width: `${pct}%` }}
                                                        transition={{ duration: 1.2, ease: 'circOut', delay: i * 0.1 }}
                                                        className="h-full rounded-full bg-gradient-to-r from-primary/60 to-primary shadow-[0_0_10px_rgba(var(--primary),0.3)]"
                                                    />
                                                </div>
                                            </div>
                                        </Link>
                                    );
                                })}
                                {telemetry.topProposals.length === 0 && proposals.length === 0 && (
                                    <p className="text-muted-foreground/20 text-center italic font-black uppercase tracking-[0.6em] text-[10px] py-10">No proposals in ledger yet.</p>
                                )}
                            </div>
                            {/* Activity log */}
                            {liveActivity.length > 0 && (
                                <div className="pt-8 border-t-2 border-border space-y-3">
                                    {liveActivity.map((entry, i) => (
                                        <div key={i} className={`text-[10px] font-black uppercase tracking-[0.4em] italic leading-none transition-colors ${i === 0 ? 'text-primary/80' : 'text-muted-foreground/20'}`}>
                                            <Terminal size={12} className="inline mr-3" />{entry}
                                        </div>
                                    ))}
                                </div>
                            )}
                        </div>
                    </motion.section>
                )}

                {/* ── HIP DIRECTORY ── */}
                <section className="space-y-16">
                    <div className="flex flex-col md:flex-row md:items-center justify-between border-b-2 border-border pb-12 gap-8 group">
                        <h2 className="text-fluid-title md:text-fluid-balance font-black uppercase tracking-tight italic text-muted-foreground/40 group-hover:text-foreground transition-colors flex items-center gap-8 leading-none pl-2">
                            <FileText size={36} className="text-primary" strokeWidth={2.5} /> Improvement Index_
                        </h2>
                        <div className="flex items-center gap-10">
                             <div className="text-[11px] text-muted-foreground/20 font-black uppercase tracking-[0.6em] italic leading-none">Epoch: 07</div>
                             <div className={`text-[11px] font-black uppercase tracking-[0.6em] italic leading-none ${streamStatus === 'live' ? 'text-primary animate-pulse' : 'text-muted-foreground/10'}`}>
                                 {streamStatus === 'live' ? 'LIVE_SYNC' : 'OFFLINE'}
                             </div>
                        </div>
                    </div>
                    
                    <div className="space-y-10 mb-40">
                        {loading ? (
                            <div className="space-y-8">
                                {[1,2,3].map(i => (
                                    <div key={i} className="h-40 bg-muted/40 border-2 border-border rounded-[3.5rem] animate-pulse" />
                                ))}
                            </div>
                        ) : proposals.length === 0 ? (
                            <div className="p-32 border-2 border-dashed border-border rounded-[5rem] text-center flex flex-col items-center gap-12 opacity-30">
                                <Gavel size={80} className="text-primary animate-bounce" strokeWidth={1} />
                                <p className="text-fluid-body font-black uppercase tracking-[0.5em] md:tracking-[1em] italic text-muted-foreground/40 leading-none">No active proposals in matrix.</p>
                            </div>
                        ) : (
                            <div className="grid grid-cols-1 gap-8">
                                {proposals.map((hip, i) => (
                                    <motion.div
                                        key={hip.id}
                                        initial={{ opacity: 0, x: -20 }}
                                        animate={{ opacity: 1, x: 0 }}
                                        transition={{ delay: i * 0.05, duration: 0.6, ease: "circOut" }}
                                    >
                                        <Link href={`/governance/hip/${hip.id}`} className="block group">
                                            <div className="p-10 lg:p-14 bg-background border-2 border-border rounded-[4rem] flex flex-col lg:flex-row items-center justify-between gap-12 hover:border-primary/40 hover:bg-primary/5 transition-all shadow-xl relative overflow-hidden group-hover:scale-[1.01] shadow-inner">
                                                <div className="absolute top-0 left-0 w-2 h-full bg-primary scale-y-0 group-hover:scale-y-100 transition-transform origin-top z-10" />
                                                
                                                <div className="space-y-6 flex-1 text-center lg:text-left overflow-hidden">
                                                    <div className="flex items-center justify-center lg:justify-start gap-6">
                                                        <span className="px-6 py-2 bg-primary/10 border-2 border-primary/20 text-primary text-[10px] font-black tracking-[0.6em] uppercase rounded-full italic leading-none shadow-sm">
                                                            HIP-{hip.hipNumber.toString().padStart(4, '0')}
                                                        </span>
                                                        <span className={`px-5 py-2 text-[10px] font-black uppercase tracking-[0.5em] rounded-full italic leading-none border-2 transition-all shadow-sm ${STATUS_STYLES[hip.status] || STATUS_STYLES['Draft']}`}>
                                                            {hip.status}
                                                        </span>
                                                        {hip.type && (
                                                            <span className="px-5 py-2 text-[10px] font-black uppercase tracking-[0.4em] rounded-full italic leading-none border-2 border-border text-muted-foreground/30 hidden xl:inline">
                                                                {hip.type}
                                                            </span>
                                                        )}
                                                    </div>
                                                    <h3 className="text-fluid-title lg:text-fluid-balance font-black text-foreground italic group-hover:text-primary transition-colors tracking-tighter leading-none pr-4 truncate uppercase">{hip.title}</h3>
                                                    <div className="text-[11px] text-muted-foreground/20 font-black uppercase tracking-[0.6em] italic leading-none pt-2 flex items-center justify-center lg:justify-start gap-4 truncate">
                                                        <Users size={16} strokeWidth={3} className="text-primary/40" /> Author: <span className="text-primary font-black">{hip.authorId}</span>
                                                    </div>
                                                </div>

                                                <div className="flex items-center gap-12 shrink-0">
                                                    <div className="text-right space-y-4 w-40">
                                                        <div className="text-[10px] text-muted-foreground/10 uppercase tracking-[0.4em] md:tracking-[0.8em] font-black italic leading-none mb-1">Resonance</div>
                                                        <div className="text-4xl font-black italic text-foreground group-hover:text-primary transition-colors tracking-tighter leading-none">
                                                            {(hip.resonanceThreshold || 0).toFixed(1)}
                                                        </div>
                                                        <div className="h-2 bg-muted border border-border rounded-full overflow-hidden p-[1px] shadow-inner">
                                                            <div
                                                                className="h-full bg-primary rounded-full transition-all duration-1500 shadow-[0_0_10px_rgba(var(--primary),0.4)]"
                                                                style={{ width: `${Math.min(100, ((hip.resonanceThreshold || 0) / 1000) * 100)}%` }}
                                                            />
                                                        </div>
                                                    </div>
                                                    <div className="h-16 w-16 rounded-[2rem] bg-muted border-2 border-border flex items-center justify-center text-muted-foreground/20 group-hover:bg-primary group-hover:text-primary-foreground group-hover:border-primary transition-all duration-500 shadow-xl shadow-inner group-hover:scale-110">
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
            
            {/* ── DRAFTING MODAL ── */}
            <AnimatePresence>
                {isDrafting && (
                    <motion.div 
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        className="fixed inset-0 z-[100] flex items-center justify-center p-6 lg:p-12 bg-background/95 backdrop-blur-3xl"
                    >
                        <motion.div 
                            initial={{ scale: 0.95, opacity: 0, y: 40 }}
                            animate={{ scale: 1, opacity: 1, y: 0 }}
                            exit={{ scale: 0.95, opacity: 0, y: 40 }}
                            transition={{ type: 'spring', damping: 25, stiffness: 300 }}
                            className="relative w-full max-w-6xl bg-background border-2 border-border rounded-[4rem] overflow-hidden shadow-[0_80px_200px_rgba(0,0,0,1)] flex flex-col max-h-[90vh] shadow-inner"
                        >
                            <div className="absolute top-0 left-0 w-full h-[2px] bg-gradient-to-r from-transparent via-primary/50 to-transparent shadow-[0_0_20px_hsl(var(--primary))]" />
                            
                            <header className="p-12 border-b-2 border-border flex justify-between items-center shrink-0 bg-muted/40">
                                <div className="space-y-3">
                                    <div className="text-[11px] text-primary font-black uppercase tracking-[0.5em] md:tracking-[1em] italic leading-none pl-1">Protocol_Drafting_v7</div>
                                    <h2 className="text-fluid-title font-black text-foreground italic tracking-tighter uppercase leading-none">Initiate New HIP</h2>
                                </div>
                                <button 
                                    onClick={() => setIsDrafting(false)}
                                    className="h-16 w-16 bg-muted border-2 border-border rounded-2xl flex items-center justify-center text-muted-foreground/40 hover:text-foreground hover:bg-primary/10 hover:border-primary/40 transition-all shadow-inner active:scale-90"
                                >
                                    <X size={28} strokeWidth={3} />
                                </button>
                            </header>

                            <div className="flex-1 overflow-y-auto p-12 lg:p-16 space-y-12 custom-scrollbar">
                                {draftError && (
                                    <div className="p-8 bg-red-500/10 border-2 border-red-500/20 rounded-[2.5rem] text-[12px] text-red-500 font-black uppercase tracking-[0.4em] italic leading-none text-center animate-pulse">
                                        HANDSHAKE_FAILURE: {draftError}
                                    </div>
                                )}

                                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-10">
                                    <div className="space-y-4 cursor-pointer group/field" onClick={() => document.getElementById('hip-title')?.focus()}>
                                        <label htmlFor="hip-title" className="text-[11px] text-muted-foreground/10 font-black uppercase tracking-[0.6em] italic leading-none pl-6 group-focus-within/field:text-primary transition-colors cursor-pointer">Proposal Title_</label>
                                        <input 
                                            id="hip-title"
                                            type="text" 
                                            value={newHip.title}
                                            onChange={(e) => setNewHip({...newHip, title: e.target.value})}
                                            placeholder="Sovereign Expansion Protocol..."
                                            className="w-full p-8 bg-muted/50 border-2 border-border rounded-[2rem] text-foreground font-black italic tracking-tight focus:border-primary/40 focus:bg-primary/5 transition-all outline-none text-lg shadow-inner placeholder:text-muted-foreground/5 cursor-text"
                                        />
                                    </div>
                                    <div className="space-y-4">
                                        <label className="text-[11px] text-muted-foreground/10 font-black uppercase tracking-[0.6em] italic leading-none pl-6">Classification_</label>
                                        <div className="relative">
                                            <select 
                                                value={newHip.type}
                                                onChange={(e) => setNewHip({...newHip, type: e.target.value})}
                                                className="w-full p-8 bg-muted/50 border-2 border-border rounded-[2rem] text-foreground font-black italic tracking-tight focus:border-primary/40 focus:bg-primary/5 transition-all outline-none appearance-none text-lg shadow-inner cursor-pointer"
                                            >
                                                <option>Standards Track</option>
                                                <option>Informational</option>
                                                <option>Process</option>
                                            </select>
                                            <div className="absolute right-8 top-1/2 -translate-y-1/2 pointer-events-none text-muted-foreground/10"><ChevronLeft className="-rotate-90" size={20} /></div>
                                        </div>
                                    </div>
                                    <div className="space-y-4 cursor-pointer group/field" onClick={() => document.getElementById('hip-layer')?.focus()}>
                                        <label htmlFor="hip-layer" className="text-[11px] text-muted-foreground/10 font-black uppercase tracking-[0.6em] italic leading-none pl-6 group-focus-within/field:text-primary transition-colors cursor-pointer">Network Layer_</label>
                                        <input 
                                            id="hip-layer"
                                            type="text" 
                                            value={newHip.layer}
                                            onChange={(e) => setNewHip({...newHip, layer: e.target.value})}
                                            placeholder="Consensus / API / UX"
                                            className="w-full p-8 bg-muted/50 border-2 border-border rounded-[2rem] text-foreground font-black italic tracking-tight focus:border-primary/40 focus:bg-primary/5 transition-all outline-none text-lg shadow-inner placeholder:text-muted-foreground/5 cursor-text"
                                        />
                                    </div>
                                </div>

                                <div className="space-y-4 cursor-pointer group/field" onClick={() => document.getElementById('hip-content')?.focus()}>
                                    <label htmlFor="hip-content" className="text-[11px] text-muted-foreground/10 font-black uppercase tracking-[0.6em] italic leading-none pl-10 group-focus-within/field:text-primary transition-colors cursor-pointer">Protocol Specification (Markdown)_</label>
                                    <textarea 
                                        id="hip-content"
                                        rows={10}
                                        value={newHip.content}
                                        onChange={(e) => setNewHip({...newHip, content: e.target.value})}
                                        placeholder={"## Abstract\nDescribe the systemic intent...\n\n## Motivation\n\n## Specification\n\n## Rationale"}
                                        className="w-full p-10 bg-muted/50 border-2 border-border rounded-[3rem] text-foreground font-mono text-base leading-relaxed focus:border-primary/40 focus:bg-primary/5 transition-all outline-none shadow-inner placeholder:text-muted-foreground/5 scrollbar-hide cursor-text"
                                    />
                                </div>
                            </div>

                            <footer className="p-12 border-t-2 border-border bg-muted/40 flex justify-end shrink-0">
                                 <button 
                                    disabled={isSubmitting || !newHip.title || !newHip.content}
                                    onClick={handleInitiateDraft}
                                    className="px-14 py-8 bg-primary text-primary-foreground font-black uppercase tracking-[0.4em] md:tracking-[0.8em] text-[11px] rounded-full shadow-[0_20px_40px_rgba(var(--primary),0.3)] hover:scale-[1.05] active:scale-95 transition-all italic leading-none disabled:opacity-20 disabled:grayscale border-0 shadow-2xl group/btn"
                                 >
                                     {isSubmitting ? (
                                         <Activity className="animate-spin" size={24} strokeWidth={3} />
                                     ) : (
                                         <span className="flex items-center gap-6">Anchor to Sovereign Ledger <ArrowUpRight size={24} strokeWidth={3} /></span>
                                     )}
                                 </button>
                            </footer>
                        </motion.div>
                    </motion.div>
                )}
            </AnimatePresence>

            {/* BACKGROUND DECOR */}
            <div className="fixed bottom-0 left-0 p-16 opacity-[0.01] pointer-events-none select-none z-0">
                <div className="text-fluid-hero font-black italic leading-none uppercase text-foreground">SCHEMA</div>
            </div>

            <style jsx global>{`
                .custom-scrollbar::-webkit-scrollbar { width: 4px; height: 4px; }
                .custom-scrollbar::-webkit-scrollbar-thumb { background: hsla(var(--primary), 0.15); border-radius: 20px; }
                .neural-grid {
                    background-image: linear-gradient(hsla(var(--primary), 0.05) 1px, transparent 1px), 
                                      linear-gradient(90deg, hsla(var(--primary), 0.05) 1px, transparent 1px);
                    background-size: 80px 80px;
                }
            `}</style>
        </div>
    );
}
