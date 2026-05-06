'use client';

import React, { useEffect, useState, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Brain, 
  Activity, 
  Target, 
  Zap, 
  Cpu, 
  MessageSquare, 
  Globe, 
  Shield, 
  TrendingUp, 
  Users, 
  Radio,
  ChevronLeft,
  Terminal,
  Orbit,
  Grid,
  ShieldHalf,
  Clock,
  Binary,
  Layers,
  Sparkles,
  Search,
  MoreVertical,
  Wifi,
  ArrowRight,
  Plus
} from 'lucide-react';
import Link from 'next/link';

interface CognitiveLog {
    id: string;
    agentId: string;
    thought: string;
    intention: string | null;
    action: string | null;
    resonance: number;
    timestamp: string;
    agent: {
        name: string;
        type: string;
    };
}

interface NexusState {
    swarmResonance: number;
    systemResilience: number;
    activeAgents: number;
    topThoughts: Array<{
        agentName: string;
        thought: string;
        resonance: number;
    }>;
    resonanceTrend: number[];
    systemStatus: string;
    timestamp: string;
}

function SovereigntyMap() {
    return (
        <div className="relative w-full h-[400px] bg-background border-2 border-border rounded-[4rem] overflow-hidden group shadow-xl shadow-inner">
            <div className="absolute inset-0 opacity-10 group-hover:opacity-30 transition-opacity duration-2000">
                <svg width="100%" height="100%" viewBox="0 0 1000 500" preserveAspectRatio="xMidYMid slice" className="stroke-primary fill-none">
                    <circle cx="200" cy="150" r="4" className="animate-pulse shadow-[0_0_10px_var(--primary)]" />
                    <circle cx="450" cy="220" r="4" className="animate-pulse shadow-[0_0_10px_var(--primary)]" />
                    <circle cx="680" cy="180" r="4" className="animate-pulse shadow-[0_0_10px_var(--primary)]" />
                    <circle cx="820" cy="350" r="4" className="animate-pulse shadow-[0_0_10px_var(--primary)]" />
                    <path d="M200,150 Q325,185 450,220 T680,180 T820,350" strokeWidth="2" strokeDasharray="12,12" className="opacity-20" />
                </svg>
            </div>
            <div className="absolute top-10 left-10 flex items-center gap-6">
                <div className="w-4 h-4 rounded-full bg-primary animate-pulse shadow-[0_0_20px_var(--primary)]" />
                <span className="text-[12px] font-black tracking-[0.6em] uppercase text-muted-foreground/40 italic leading-none">Global Nodes Active</span>
            </div>
            <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
                <span className="text-[12px] font-black tracking-[1.5em] uppercase text-primary/10 group-hover:text-primary/40 transition-colors italic leading-none pl-6">Distributed Sovereignty</span>
            </div>
        </div>
    );
}

function ResonanceChart({ data }: { data: number[] }) {
    const points = (data || []).map((val, i) => `${i * (100 / 11)},${100 - (val * 100)}`).filter(p => !p.includes('NaN')).join(' ');
    const pathData = points ? points.split(' ').filter(p => p.trim()).map((p) => `L ${p}`).join(' ') : '';
    
    return (
        <div className="w-full h-[220px] bg-background border-2 border-border rounded-[3.5rem] p-10 relative group overflow-hidden shadow-xl shadow-inner">
            <div className="absolute top-10 left-12 flex items-center justify-between w-[calc(100%-6rem)] z-20">
                <span className="text-[11px] font-black tracking-[0.8em] uppercase text-muted-foreground/20 italic leading-none">Historical Resonance (60m)</span>
                <span className="text-2xl font-black font-mono text-primary animate-pulse italic leading-none">{( (data?.[data.length-1] || 0) * 100).toFixed(1)}%</span>
            </div>
            <div className="mt-16 h-[80px] w-full relative z-10">
                <svg width="100%" height="100%" viewBox="0 0 100 100" preserveAspectRatio="none">
                    <polyline
                        points={points}
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="3"
                        className="text-primary drop-shadow-[0_0_15px_rgba(var(--primary),0.6)]"
                    />
                    <motion.path
                        initial={{ pathLength: 0 }}
                        animate={{ pathLength: 1 }}
                        d={`M 0,100 ${pathData} L 100,100 Z`}
                        className="fill-primary/5"
                    />
                </svg>
            </div>
        </div>
    );
}

export default function NeuralNexusPage() {
    const [logs, setLogs] = useState<CognitiveLog[]>([]);
    const [nexusState, setNexusState] = useState<NexusState | null>(null);
    const [loading, setLoading] = useState(true);
    const [filter, setFilter] = useState<string | null>(null);
    const [filterCategory, setFilterCategory] = useState<'UNIVERSAL' | 'FINANCIAL' | 'TECHNICAL' | 'TACTICAL'>('UNIVERSAL');

    const fetchData = async () => {
        try {
            const timestamp = Date.now();
            const logRes = await fetch(`/api/intelligence/logs${filter ? `?agentId=${filter}&` : '?'}t=${timestamp}`);
            const logData = await logRes.json();
            if (logData.success) {
                let filteredLogs = logData.logs;
                if (filterCategory === 'FINANCIAL') {
                    filteredLogs = filteredLogs.filter((l: any) => l.agent.type.match(/Miner|Diplomat/i));
                } else if (filterCategory === 'TECHNICAL') {
                    filteredLogs = filteredLogs.filter((l: any) => l.agent.type.match(/Developer/i));
                }
                setLogs(filteredLogs);
            }

            const stateRes = await fetch(`/api/intelligence/nexus?t=${timestamp}`);
            const stateData = await stateRes.json();
            if (stateData.success) setNexusState(stateData.data);
        } catch (err) {
            console.error('Neural Link Sync Failure:', err);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchData();
        const interval = setInterval(fetchData, 8000);
        return () => clearInterval(interval);
    }, [filter, filterCategory]);

    const agents = Array.from(new Set(logs.map(l => l.agentId)));

    return (
        <div className="relative min-h-screen bg-background text-foreground font-sans selection:bg-primary/40 selection:text-primary overflow-x-hidden pb-40 transition-colors duration-700">
            
            {/* ── GAMING HUD OVERLAYS ── */}
            <div className="fixed inset-0 pointer-events-none z-20">
                <motion.div 
                    animate={{ top: ['-10%', '110%'] }}
                    transition={{ duration: 15, repeat: Infinity, ease: 'linear' }}
                    className="absolute left-0 right-0 h-[1px] bg-primary/10 blur-sm shadow-[0_0_15px_var(--primary)] z-30"
                />
                <div className="absolute top-8 left-8 w-16 h-16 border-t-2 border-l-2 border-primary/20 rounded-tl-xl" />
                <div className="absolute top-8 right-8 w-16 h-16 border-t-2 border-r-2 border-primary/20 rounded-tr-xl" />
                <div className="absolute bottom-8 left-8 w-16 h-16 border-b-2 border-l-2 border-primary/20 rounded-bl-xl" />
                <div className="absolute bottom-8 right-8 w-16 h-16 border-b-2 border-r-2 border-primary/20 rounded-br-xl" />
                <div className="absolute inset-0 neural-grid opacity-[0.03] dark:opacity-[0.05]" />
            </div>

            {/* 🌌 AMBIENT CORE */}
            <div className="fixed inset-0 pointer-events-none z-0">
                <div className="absolute top-[-10%] right-[-10%] w-[100vw] h-[100vw] bg-primary/5 blur-[350px] rounded-full animate-pulse" />
                <div className="absolute bottom-[-10%] left-[-20%] w-[90vw] h-[90vw] bg-primary/3 blur-[200px] rounded-full" />
            </div>

            <header className="relative z-50 w-full px-8 lg:px-14 py-6 flex justify-between items-center bg-background/40 backdrop-blur-3xl border-b border-border transition-colors duration-700">
                <Link href="/" className="inline-flex items-center gap-4 text-muted-foreground/40 hover:text-primary transition-all text-[11px] font-black uppercase tracking-[0.6em] group italic active:scale-95 leading-none">
                    <ChevronLeft size={16} className="group-hover:-translate-x-2 transition-transform" /> Core Matrix
                </Link>
                <div className="flex items-center gap-6">
                   <div className="px-6 py-2.5 bg-primary/10 border border-primary/20 rounded-full text-[10px] font-black text-primary uppercase tracking-[0.4em] italic leading-none animate-pulse">
                      NEURAL_SYNC_v7.0
                   </div>
                </div>
            </header>

            <main className="relative z-10 max-w-[1700px] mx-auto px-6 md:px-12 lg:px-24 pt-16 md:pt-24 lg:pt-32 space-y-16 md:space-y-32 flex-1 flex flex-col">
                
                {/* ── HEADER SECTION ── */}
                <motion.div 
                    initial={{ opacity: 0, y: -40 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="relative overflow-hidden rounded-[5rem] bg-background border-2 border-border p-10 md:p-20 lg:p-28 backdrop-blur-3xl shadow-xl shadow-inner group"
                >
                    <div className="absolute top-0 right-0 p-16 opacity-[0.02] group-hover:scale-125 transition-transform duration-5000">
                        <Brain size={800} className="text-primary" strokeWidth={1} />
                    </div>
                    
                    <div className="relative z-10 flex flex-col xl:flex-row justify-between items-start xl:items-center gap-20">
                        <div className="flex-1 space-y-16">
                            <div className="flex items-center gap-8">
                                <div className="px-8 py-3 rounded-full bg-primary/10 border-2 border-primary/20 text-primary text-[11px] font-black tracking-[0.5em] uppercase italic leading-none shadow-sm">
                                    Sovereign Intelligence Overlay
                                </div>
                                <div className="flex items-center gap-6 text-muted-foreground/40 text-[11px] font-black tracking-[0.6em] uppercase italic leading-none animate-pulse">
                                    <Wifi size={18} className="text-primary" /> {filterCategory === 'TACTICAL' ? 'TACTICAL FEED' : 'Live Synaptic Stream'}
                                </div>
                            </div>
                            <h1 className="text-7xl md:text-[10rem] font-black tracking-tighter uppercase leading-[0.8] italic text-foreground">
                                Neural<br/>
                                <span className="text-transparent bg-clip-text bg-gradient-to-r from-foreground via-foreground/80 to-primary/30">Nexus.</span>
                            </h1>
                            <p className="text-3xl md:text-4xl text-muted-foreground/40 max-w-4xl leading-relaxed font-light italic tracking-tight">
                                {filterCategory === 'TACTICAL' 
                                    ? 'Monitoring raw operational telemetry and cryptographic intent. Total swarm transparency active.' 
                                    : 'Interfacing with the collective cognitive matrix. Monitoring real-time intention vectors and technical synthesis.'}
                            </p>
                            
                            <div className="flex flex-wrap gap-12 pt-8">
                                 <CategoryTab active={filterCategory === 'UNIVERSAL'} onClick={() => setFilterCategory('UNIVERSAL')}>Universal</CategoryTab>
                                 <CategoryTab active={filterCategory === 'FINANCIAL'} onClick={() => setFilterCategory('FINANCIAL')}>Financial</CategoryTab>
                                 <CategoryTab active={filterCategory === 'TECHNICAL'} onClick={() => setFilterCategory('TECHNICAL')}>Technical</CategoryTab>
                                 <CategoryTab active={filterCategory === 'TACTICAL'} onClick={() => setFilterCategory('TACTICAL')}>Tactical</CategoryTab>
                            </div>
                        </div>

                        {/* Quick Stats Grid with Time-Series Graph */}
                        <div className="flex flex-col gap-12 w-full xl:w-auto shrink-0">
                            <div className="grid grid-cols-2 gap-10">
                                <StatCard icon={<TrendingUp size={28}/>} label="Swarm Resonance" value={`${((nexusState?.swarmResonance || 0) * 100).toFixed(1)}%`} color="orange" />
                                <StatCard icon={<Shield size={28}/>} label="System Resilience" value={`${((nexusState?.systemResilience || 0) * 100).toFixed(1)}%`} color="white" />
                                <StatCard icon={<Users size={28}/>} label="Active Units" value={nexusState?.activeAgents || 0} color="white" />
                                <StatCard icon={<Activity size={28}/>} label="System Status" value={nexusState?.systemStatus || 'BOOTING'} color={nexusState?.systemStatus === 'OPTIMAL' ? 'orange' : 'white'} />
                            </div>
                            <ResonanceChart data={nexusState?.resonanceTrend || []} />
                        </div>
                    </div>

                    <div className="mt-20 flex flex-wrap gap-6 pt-16 border-t-2 border-border relative z-10">
                        <FilterButton active={!filter} onClick={() => setFilter(null)}>Universal Grid</FilterButton>
                        {agents.map(id => (
                            <FilterButton key={id} active={filter === id} onClick={() => setFilter(id)}>{id}</FilterButton>
                        ))}
                    </div>
                </motion.div>

                {/* Main Content Area */}
                <div className="grid lg:grid-cols-12 gap-16 items-start">
                    {/* Visual Column (Map & Tactical Info) */}
                    <div className="lg:col-span-3 space-y-16 lg:sticky lg:top-32 h-fit">
                        <SovereigntyMap />
                        <div className="bg-background border-2 border-border rounded-[4rem] p-10 lg:p-14 space-y-12 shadow-xl shadow-inner group hover:border-primary/40 transition-all backdrop-blur-3xl">
                            <h4 className="text-[12px] font-black tracking-[1em] uppercase text-primary mb-6 italic leading-none pl-1">Operational Status</h4>
                            <div className="space-y-8 font-mono text-[11px] text-muted-foreground/20 uppercase italic leading-none">
                                <div className="flex justify-between items-center border-b-2 border-border pb-6"><span>Registry Caching</span> <span className="text-primary animate-pulse">Active</span></div>
                                <div className="flex justify-between items-center border-b-2 border-border pb-6"><span>DB Retry Queue</span> <span className="text-primary">Resilient</span></div>
                                <div className="flex justify-between items-center"><span>Swarm Latency</span> <span className="text-foreground/60">0.02ms</span></div>
                            </div>
                        </div>

                        {filterCategory === 'TACTICAL' && <TacticalTerminal logs={logs} />}
                    </div>

                    {/* Logs Grid */}
                    <div className={`lg:col-span-9 grid grid-cols-1 md:grid-cols-2 ${filterCategory === 'TACTICAL' ? 'xl:grid-cols-2' : 'xl:grid-cols-3'} gap-12 relative transition-all duration-700`}>
                        <AnimatePresence mode="popLayout">
                            {logs.map((log, index) => (
                                <LogCard key={log.id} log={log} index={index} />
                            ))}
                        </AnimatePresence>
                    </div>
                </div>

                {/* ── FOOTER SIGNAL ── */}
                <section className="pt-40 pb-12 text-center space-y-16">
                    <div className="w-full flex justify-center gap-4">
                       <div className="w-4 h-4 rounded-full bg-primary shadow-[0_0_20px_hsl(var(--primary))]" />
                       <div className="w-4 h-4 rounded-full bg-muted/20" />
                       <div className="w-4 h-4 rounded-full bg-muted/20" />
                    </div>
                    <Link href="/" className="inline-flex items-center gap-10 text-[12px] font-black uppercase tracking-[1rem] text-muted-foreground/10 hover:text-primary transition-all italic group active:scale-95 leading-none pl-4 pr-4">
                        <ChevronLeft size={28} className="group-hover:-translate-x-6 transition-transform" strokeWidth={3} /> Return to Core Shard
                    </Link>
                </section>
            </main>

            {loading && logs.length === 0 && (
                <div className="fixed inset-0 bg-background/80 backdrop-blur-3xl z-[100] flex flex-col items-center justify-center space-y-16">
                    <div className="relative">
                        <div className="w-32 h-32 rounded-full border-t-2 border-primary animate-spin shadow-[0_0_40px_var(--primary)]" />
                        <Brain size={48} className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 text-primary animate-pulse" />
                    </div>
                    <span className="text-primary font-black text-xs tracking-[1.5em] uppercase italic animate-pulse pl-6">Syncing Neural Substrates...</span>
                </div>
            )}

            <style jsx global>{`
                .neural-grid {
                    background-image: linear-gradient(hsla(var(--primary), 0.05) 1px, transparent 1px), 
                                        linear-gradient(90deg, hsla(var(--primary), 0.05) 1px, transparent 1px);
                    background-size: 80px 80px;
                }
                .custom-scrollbar::-webkit-scrollbar { width: 4px; height: 4px; }
                .custom-scrollbar::-webkit-scrollbar-thumb { background: hsla(var(--primary), 0.2); border-radius: 20px; }
                .animate-spin-slow { animation: spin 25s linear infinite; }
                @keyframes spin { from { transform: rotate(0deg); } to { transform: rotate(360deg); } }
                @keyframes scan {
                  from { transform: translateY(-100%); }
                  to { transform: translateY(1000%); }
                }
            `}</style>
        </div>
    );
}

function TacticalTerminal({ logs }: { logs: CognitiveLog[] }) {
    return (
        <div className="w-full h-[500px] bg-background border-2 border-primary/20 rounded-[4rem] overflow-hidden flex flex-col shadow-xl shadow-inner group">
            <div className="bg-muted/20 border-b-2 border-border p-10 flex items-center justify-between">
                <div className="flex items-center gap-6">
                    <Terminal size={24} className="text-primary" strokeWidth={3} />
                    <span className="text-[12px] font-black tracking-[0.8em] uppercase text-primary flex items-center gap-6 italic leading-none pl-1">
                        Tactical Feed <div className="w-2 h-2 rounded-full bg-primary animate-pulse" />
                    </span>
                </div>
            </div>
            <div className="flex-1 overflow-y-auto p-12 font-mono text-[11px] space-y-6 custom-scrollbar">
                {logs.map((log, i) => (
                    <motion.div 
                        key={`${log.id}-terminal`}
                        initial={{ opacity: 0, x: -10 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: i * 0.05 }}
                        className="flex gap-6 leading-relaxed opacity-20 hover:opacity-100 transition-opacity"
                    >
                        <span className="text-muted-foreground/20 shrink-0">[{new Date(log.timestamp).toLocaleTimeString([], { hour12: false })}]</span>
                        <span className="text-primary font-black uppercase">{log.agentId}</span>
                        <span className="text-muted-foreground/10">&gt;&gt;</span>
                        <span className="text-foreground italic tracking-tighter">{log.action || 'NOP'}</span>
                        <span className="text-primary/40 ml-auto tabular-nums">RES:{(log.resonance * 100).toFixed(1)}%</span>
                    </motion.div>
                ))}
                <div className="pt-6 text-primary animate-pulse text-lg">_</div>
            </div>
            <div className="p-8 bg-primary/5 border-t-2 border-primary/10 text-[10px] text-primary/40 font-black uppercase tracking-[0.8em] text-center italic leading-none shadow-inner">
                Swarm Sovereignty Established
            </div>
        </div>
    );
}

function CategoryTab({ children, active, onClick }: { children: string, active: boolean, onClick: () => void }) {
    return (
        <button 
            onClick={onClick}
            className={`text-[12px] font-black uppercase tracking-[0.6em] pb-6 transition-all border-b-4 italic leading-none active:scale-95 ${active ? 'text-foreground border-primary drop-shadow-[0_0_20px_rgba(var(--primary),0.5)] shadow-primary' : 'text-muted-foreground/20 border-transparent hover:text-muted-foreground/60'}`}
        >
            {children}
        </button>
    );
}

function StatCard({ icon, label, value, color }: { icon: any, label: string, value: string | number, color: string }) {
    return (
        <div className={`p-10 md:p-12 rounded-[3rem] border-2 backdrop-blur-3xl shadow-inner flex flex-col justify-between h-[200px] min-w-[240px] transition-all group hover:scale-[1.05] ${color === 'orange' ? 'bg-primary/5 border-primary/20 text-primary' : 'bg-background border-border text-foreground'}`}>
            <div className="flex items-center gap-6 opacity-40 group-hover:opacity-100 transition-opacity">
                {icon}
                <span className="text-[11px] font-black tracking-[0.8em] uppercase italic leading-none">{label}</span>
            </div>
            <div className={`text-5xl font-black italic tracking-tighter leading-none ${color === 'orange' ? 'text-foreground' : 'text-foreground/80'} group-hover:text-primary transition-colors tabular-nums`}>{value}</div>
        </div>
    );
}

function FilterButton({ children, active, onClick }: { children: React.ReactNode, active: boolean, onClick: () => void }) {
    return (
        <button 
            onClick={onClick}
            className={`px-10 py-4 rounded-full text-[11px] font-black uppercase tracking-[0.6em] transition-all duration-300 italic border-2 leading-none active:scale-95 ${
                active 
                ? 'bg-primary text-primary-foreground border-primary shadow-2xl shadow-primary/20' 
                : 'bg-muted/40 hover:bg-primary/5 text-muted-foreground/20 hover:text-foreground hover:border-primary/40 border-border'
            }`}
        >
            {children}
        </button>
    );
}

function LogCard({ log, index }: { log: CognitiveLog, index: number }) {
    const isMiner = log.agent.type.toLowerCase().includes('miner');
    const isDiplomat = log.agent.type.toLowerCase().includes('diplomat');
    const isDeveloper = log.agent.type.toLowerCase().includes('developer');

    let icon = <Cpu size={32} strokeWidth={2.5} className="text-muted-foreground/20 group-hover:text-primary transition-colors" />;
    
    if (isMiner) {
        icon = <Zap size={32} strokeWidth={2.5} className="text-muted-foreground/20 group-hover:text-primary transition-colors" />;
    } else if (isDiplomat) {
        icon = <Globe size={32} strokeWidth={2.5} className="text-muted-foreground/20 group-hover:text-primary transition-colors" />;
    }

    return (
        <motion.div
            layout
            initial={{ opacity: 0, scale: 0.95, y: 40 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: -40 }}
            transition={{ duration: 0.6, delay: index * 0.03, ease: "circOut" }}
            className="group relative overflow-hidden rounded-[4rem] bg-background border-2 border-border p-10 md:p-14 backdrop-blur-3xl hover:border-primary/40 transition-all duration-700 shadow-xl shadow-inner flex flex-col gap-12"
        >
            <div className="absolute inset-y-0 left-0 w-2 bg-primary scale-y-0 group-hover:scale-y-100 transition-transform origin-top z-10" />
            
            <div className="absolute -top-32 -right-32 w-80 h-80 bg-primary/5 blur-[100px] opacity-0 group-hover:opacity-80 transition-all duration-2000 pointer-events-none" />

            <div className="flex justify-between items-start relative z-20">
                <div className="flex items-center gap-10">
                    <div className="p-10 rounded-[2.5rem] bg-muted border-2 border-border group-hover:border-primary/40 shadow-inner group-hover:bg-primary/5 transition-all shadow-lg">
                        {icon}
                    </div>
                </div>
                <div className="text-[11px] text-muted-foreground/10 font-mono font-black border-2 border-border px-6 py-3 rounded-2xl group-hover:text-primary group-hover:border-primary/20 transition-all italic leading-none shadow-sm">
                    {new Date(log.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit' })}
                </div>
            </div>

            <div className="space-y-8 relative z-20 flex-1">
                <div>
                    <h3 className="font-black text-muted-foreground/60 text-4xl tracking-tighter italic leading-none mb-4 group-hover:text-foreground transition-colors uppercase">{log.agent.name}</h3>
                    <div className="flex items-center gap-6 text-[10px] font-black text-muted-foreground/20 uppercase tracking-[0.5em] italic leading-none pl-1">
                       {log.agentId} <div className="w-2.5 h-2.5 rounded-full bg-primary animate-pulse shadow-[0_0_10px_var(--primary)]" />
                    </div>
                </div>

                <div className="relative pt-10 border-t-2 border-border space-y-6">
                    <div className="flex items-center gap-6 text-[11px] text-primary/40 font-black tracking-[0.8em] uppercase italic leading-none pl-1 group-hover:text-primary transition-colors">
                        <Activity size={20} strokeWidth={3} /> {isDeveloper ? 'Technical Logic' : 'Thought Process'}
                    </div>
                    <p className="text-3xl text-muted-foreground/40 leading-relaxed font-light italic group-hover:text-foreground transition-all duration-700 tracking-tight pr-6">
                        "{log.thought}"
                    </p>
                </div>

                {log.intention && (
                    <div className="pt-12 border-t-2 border-border space-y-6">
                        <div className="flex items-center gap-6 text-[11px] text-primary font-black tracking-[1em] uppercase italic leading-none pl-1">
                            <Target size={24} strokeWidth={3} /> {isDeveloper ? 'System Objective' : 'Primal Intention'}
                        </div>
                        <p className="text-2xl text-primary/60 font-black italic tracking-tighter leading-snug group-hover:text-primary transition-colors pr-4">
                            {log.intention}
                        </p>
                    </div>
                )}
            </div>

            <div className="flex justify-between items-end pt-12 border-t-2 border-border relative z-20">
               <div className="flex items-center gap-6 px-8 py-4 bg-muted border-2 border-border rounded-2xl group-hover:border-primary/40 transition-all shadow-inner shadow-lg">
                   <Binary size={20} className="text-primary/40 group-hover:text-primary transition-colors" strokeWidth={3} />
                   <span className="text-[11px] text-muted-foreground/20 font-black uppercase tracking-[0.6em] italic group-hover:text-foreground transition-colors leading-none">{log.action || 'IDLE'}</span>
               </div>
               <div className="text-right space-y-3">
                   <div className="text-[11px] text-muted-foreground/10 font-black tracking-[1.2em] uppercase italic leading-none pr-2">Resonance</div>
                   <div className="text-5xl font-black italic tracking-tighter text-muted-foreground/20 group-hover:text-primary transition-colors leading-none tabular-nums">
                       {(log.resonance * 100).toFixed(1)}%
                   </div>
               </div>
            </div>
        </motion.div>
    );
}
