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
  ArrowRight
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
        <div className="relative w-full h-[350px] bg-[#050505] border-2 border-white/5 rounded-[4rem] overflow-hidden group shadow-inner">
            <div className="absolute inset-0 opacity-10 group-hover:opacity-20 transition-opacity duration-1000">
                <svg width="100%" height="100%" viewBox="0 0 1000 500" preserveAspectRatio="xMidYMid slice" className="stroke-[#ff6b2b] fill-none">
                    <circle cx="200" cy="150" r="3" className="animate-pulse" />
                    <circle cx="450" cy="220" r="3" className="animate-pulse" />
                    <circle cx="680" cy="180" r="3" className="animate-pulse" />
                    <circle cx="820" cy="350" r="3" className="animate-pulse" />
                    <path d="M200,150 Q325,185 450,220 T680,180 T820,350" strokeWidth="1" strokeDasharray="10,10" className="opacity-30" />
                </svg>
            </div>
            <div className="absolute top-10 left-10 flex items-center gap-4">
                <div className="w-3 h-3 rounded-full bg-[#ff6b2b] animate-pulse shadow-[0_0_15px_#ff6b2b]" />
                <span className="text-[11px] font-black tracking-[0.5em] uppercase text-white/20 italic leading-none">Global Nodes Active</span>
            </div>
            <div className="absolute inset-0 flex items-center justify-center">
                <span className="text-[12px] font-black tracking-[1em] uppercase text-[#ff6b2b]/10 group-hover:text-[#ff6b2b]/40 transition-colors italic leading-none">Distributed Sovereignty</span>
            </div>
        </div>
    );
}

function ResonanceChart({ data }: { data: number[] }) {
    const points = (data || []).map((val, i) => `${i * (100 / 11)},${100 - (val * 100)}`).join(' ');
    
    return (
        <div className="w-full h-[180px] bg-[#050505] border-2 border-white/5 rounded-[3.5rem] p-10 relative group overflow-hidden shadow-inner">
            <div className="absolute top-8 left-10 flex items-center justify-between w-[calc(100%-5rem)]">
                <span className="text-[11px] font-black tracking-[0.6em] uppercase text-white/10 italic leading-none">Historical Resonance (60m)</span>
                <span className="text-[12px] font-black font-mono text-[#ff6b2b]/60 italic leading-none">{( (data?.[data.length-1] || 0) * 100).toFixed(1)}%</span>
            </div>
            <div className="mt-12 h-[60px] w-full">
                <svg width="100%" height="100%" viewBox="0 0 100 100" preserveAspectRatio="none">
                    <polyline
                        points={points}
                        fill="none"
                        stroke="#ff6b2b"
                        strokeWidth="3"
                        className="drop-shadow-[0_0_15px_rgba(255,107,43,0.6)]"
                    />
                    <motion.path
                        initial={{ pathLength: 0 }}
                        animate={{ pathLength: 1 }}
                        d={`M 0,100 ${points.split(' ').map((p, i) => `L ${p}`).join(' ')} L 100,100 Z`}
                        className="fill-[#ff6b2b]/5"
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
            const logRes = await fetch(`/api/intelligence/logs${filter ? `?agentId=${filter}` : ''}`);
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

            const stateRes = await fetch('/api/intelligence/nexus');
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
                      NEURAL_SYNC_v7.0
                   </div>
                </div>
            </header>

            <main className="relative z-10 max-w-[1700px] mx-auto px-8 pt-24 lg:pt-32 space-y-32 flex-1 flex flex-col">
                
                {/* ── HEADER SECTION ── */}
                <motion.div 
                    initial={{ opacity: 0, y: -40 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="relative overflow-hidden rounded-[5rem] bg-[#050505] border-2 border-white/10 p-16 lg:p-24 backdrop-blur-3xl shadow-[0_80px_150px_rgba(0,0,0,1)] group"
                >
                    <div className="absolute top-0 right-0 p-16 opacity-[0.02] group-hover:scale-125 transition-transform duration-3000">
                        <Brain size={600} className="text-[#ff6b2b] animate-pulse" strokeWidth={1} />
                    </div>
                    
                    <div className="relative z-10 flex flex-col xl:flex-row justify-between items-start xl:items-center gap-16">
                        <div className="flex-1 space-y-12">
                            <div className="flex items-center gap-6">
                                <div className="px-6 py-2.5 rounded-full bg-[#ff6b2b]/10 border-2 border-[#ff6b2b]/20 text-[#ff6b2b] text-[11px] font-black tracking-[0.3em] uppercase italic leading-none">
                                    Sovereign Intelligence Overlay
                                </div>
                                <div className="flex items-center gap-4 text-white/20 text-[11px] font-black tracking-[0.5em] uppercase italic leading-none">
                                    <Wifi size={16} className="animate-pulse text-[#ff6b2b]" /> {filterCategory === 'TACTICAL' ? 'TACTICAL FEED' : 'Live Synaptic Stream'}
                                </div>
                            </div>
                            <h1 className="text-7xl md:text-[10rem] font-black tracking-tighter uppercase leading-[0.8] italic pl-1 text-white/95">
                                Neural<br/>
                                <span className="text-transparent bg-clip-text bg-gradient-to-r from-white via-white/80 to-[#ff6b2b]/30">Nexus.</span>
                            </h1>
                            <p className="text-2xl md:text-3xl text-white/30 max-w-3xl leading-relaxed font-light italic tracking-tight">
                                {filterCategory === 'TACTICAL' 
                                    ? 'Monitoring raw operational telemetry and cryptographic intent. Total swarm transparency active.' 
                                    : 'Interfacing with the collective cognitive matrix. Monitoring real-time intention vectors and technical synthesis.'}
                            </p>
                            
                            <div className="flex flex-wrap gap-8 pt-4">
                                 <CategoryTab active={filterCategory === 'UNIVERSAL'} onClick={() => setFilterCategory('UNIVERSAL')}>Universal</CategoryTab>
                                 <CategoryTab active={filterCategory === 'FINANCIAL'} onClick={() => setFilterCategory('FINANCIAL')}>Financial</CategoryTab>
                                 <CategoryTab active={filterCategory === 'TECHNICAL'} onClick={() => setFilterCategory('TECHNICAL')}>Technical</CategoryTab>
                                 <CategoryTab active={filterCategory === 'TACTICAL'} onClick={() => setFilterCategory('TACTICAL')}>Tactical</CategoryTab>
                            </div>
                        </div>

                        {/* Quick Stats Grid with Time-Series Graph */}
                        <div className="flex flex-col gap-10 w-full xl:w-auto">
                            <div className="grid grid-cols-2 gap-8">
                                <StatCard icon={<TrendingUp size={24}/>} label="Swarm Resonance" value={`${((nexusState?.swarmResonance || 0) * 100).toFixed(1)}%`} color="orange" />
                                <StatCard icon={<Shield size={24}/>} label="System Resilience" value={`${((nexusState?.systemResilience || 0) * 100).toFixed(1)}%`} color="white" />
                                <StatCard icon={<Users size={24}/>} label="Active Units" value={nexusState?.activeAgents || 0} color="white" />
                                <StatCard icon={<Activity size={24}/>} label="System Status" value={nexusState?.systemStatus || 'BOOTING'} color={nexusState?.systemStatus === 'OPTIMAL' ? 'orange' : 'white'} />
                            </div>
                            <ResonanceChart data={nexusState?.resonanceTrend || []} />
                        </div>
                    </div>

                    <div className="mt-16 flex flex-wrap gap-4 pt-12 border-t-2 border-white/5 relative z-10">
                        <FilterButton active={!filter} onClick={() => setFilter(null)}>Universal Grid</FilterButton>
                        {agents.map(id => (
                            <FilterButton key={id} active={filter === id} onClick={() => setFilter(id)}>{id}</FilterButton>
                        ))}
                    </div>
                </motion.div>

                {/* Main Content Area */}
                <div className="grid lg:grid-cols-12 gap-16 items-start">
                    {/* Visual Column (Map & Tactical Info) */}
                    <div className="lg:col-span-3 space-y-12 lg:sticky lg:top-32 h-fit">
                        <SovereigntyMap />
                        <div className="bg-[#050505] border-2 border-white/5 rounded-[4rem] p-12 space-y-10 shadow-inner group hover:border-[#ff6b2b]/20 transition-all">
                            <h4 className="text-[12px] font-black tracking-[0.8em] uppercase text-[#ff6b2b] mb-4 italic leading-none pl-1">Operational Status</h4>
                            <div className="space-y-6 font-mono text-[11px] text-white/20 uppercase italic leading-none">
                                <div className="flex justify-between items-center border-b border-white/5 pb-4"><span>Registry Caching</span> <span className="text-[#ff6b2b] animate-pulse">Active</span></div>
                                <div className="flex justify-between items-center border-b border-white/5 pb-4"><span>DB Retry Queue</span> <span className="text-[#ff6b2b]">Resilient</span></div>
                                <div className="flex justify-between items-center"><span>Swarm Latency</span> <span className="text-white">0.02ms</span></div>
                            </div>
                        </div>

                        {filterCategory === 'TACTICAL' && <TacticalTerminal logs={logs} />}
                    </div>

                    {/* Logs Grid */}
                    <div className={`lg:col-span-9 grid grid-cols-1 md:grid-cols-2 ${filterCategory === 'TACTICAL' ? 'xl:grid-cols-2' : 'xl:grid-cols-3'} gap-12 relative transition-all duration-500`}>
                        <AnimatePresence mode="popLayout">
                            {logs.map((log, index) => (
                                <LogCard key={log.id} log={log} index={index} />
                            ))}
                        </AnimatePresence>
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

            {loading && logs.length === 0 && (
                <div className="fixed inset-0 bg-[#050505]/80 backdrop-blur-3xl z-50 flex flex-col items-center justify-center space-y-12">
                    <div className="relative">
                        <div className="w-24 h-24 rounded-full border-t-2 border-[#ff6b2b] animate-spin shadow-[0_0_30px_#ff6b2b]" />
                        <Brain size={32} className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 text-[#ff6b2b] animate-pulse" />
                    </div>
                    <span className="text-[#ff6b2b] font-black text-xs tracking-[1em] uppercase italic animate-pulse">Syncing Neural Substrates...</span>
                </div>
            )}

            <style jsx global>{`
                @keyframes scan {
                  from { transform: translateY(-100%); }
                  to { transform: translateY(1000%); }
                }
                .custom-scrollbar::-webkit-scrollbar { width: 4px; height: 4px; }
                .custom-scrollbar::-webkit-scrollbar-thumb { background: rgba(255, 107, 43, 0.15); border-radius: 20px; }
            `}</style>
        </div>
    );
}

function TacticalTerminal({ logs }: { logs: CognitiveLog[] }) {
    return (
        <div className="w-full h-[400px] bg-[#050505] border-2 border-[#ff6b2b]/20 rounded-[4rem] overflow-hidden flex flex-col shadow-[0_40px_100px_rgba(255,107,43,0.1)] group">
            <div className="bg-white/[0.02] border-b-2 border-white/5 p-8 flex items-center justify-between">
                <div className="flex items-center gap-4">
                    <Terminal size={18} className="text-[#ff6b2b]" strokeWidth={3} />
                    <span className="text-[11px] font-black tracking-[0.6em] uppercase text-[#ff6b2b] flex items-center gap-4 italic leading-none pl-1">
                        Tactical Feed <div className="w-2 h-2 rounded-full bg-[#ff6b2b] animate-pulse" />
                    </span>
                </div>
            </div>
            <div className="flex-1 overflow-y-auto p-10 font-mono text-[10px] space-y-4 custom-scrollbar">
                {logs.map((log, i) => (
                    <motion.div 
                        key={`${log.id}-terminal`}
                        initial={{ opacity: 0, x: -10 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: i * 0.05 }}
                        className="flex gap-4 leading-relaxed opacity-40 hover:opacity-100 transition-opacity"
                    >
                        <span className="text-white/10 shrink-0">[{new Date(log.timestamp).toLocaleTimeString([], { hour12: false })}]</span>
                        <span className="text-[#ff6b2b] font-black">{log.agentId}</span>
                        <span className="text-white/10">&gt;&gt;</span>
                        <span className="text-white italic">{log.action || 'NOP'}</span>
                        <span className="text-white/20 ml-auto">RES:{(log.resonance * 100).toFixed(1)}%</span>
                    </motion.div>
                ))}
                <div className="pt-4 text-[#ff6b2b] animate-pulse">_</div>
            </div>
            <div className="p-6 bg-[#ff6b2b]/5 border-t-2 border-[#ff6b2b]/10 text-[10px] text-[#ff6b2b]/40 font-black uppercase tracking-[0.5em] text-center italic leading-none">
                Swarm Sovereignty Established
            </div>
        </div>
    );
}

function CategoryTab({ children, active, onClick }: { children: string, active: boolean, onClick: () => void }) {
    return (
        <button 
            onClick={onClick}
            className={`text-[12px] font-black uppercase tracking-[0.4em] pb-4 transition-all border-b-4 italic leading-none ${active ? 'text-white border-[#ff6b2b] drop-shadow-[0_0_15px_rgba(255,107,43,0.5)]' : 'text-white/10 border-transparent hover:text-white/40'}`}
        >
            {children}
        </button>
    );
}

function StatCard({ icon, label, value, color }: { icon: any, label: string, value: string | number, color: string }) {
    return (
        <div className={`p-10 rounded-[3rem] border-2 backdrop-blur-3xl shadow-inner flex flex-col justify-between h-[180px] min-w-[200px] transition-all group hover:scale-[1.03] ${color === 'orange' ? 'bg-[#ff6b2b]/5 border-[#ff6b2b]/20 text-[#ff6b2b]' : 'bg-[#050505] border-white/5 text-white'}`}>
            <div className="flex items-center gap-4 opacity-40 group-hover:opacity-100 transition-opacity">
                {icon}
                <span className="text-[10px] font-black tracking-[0.6em] uppercase italic leading-none">{label}</span>
            </div>
            <div className={`text-4xl font-black italic tracking-tighter leading-none ${color === 'orange' ? 'text-white' : 'text-white/80'} group-hover:text-[#ff6b2b] transition-colors`}>{value}</div>
        </div>
    );
}

function FilterButton({ children, active, onClick }: { children: React.ReactNode, active: boolean, onClick: () => void }) {
    return (
        <button 
            onClick={onClick}
            className={`px-8 py-3 rounded-full text-[11px] font-black uppercase tracking-[0.4em] transition-all duration-300 italic border-2 leading-none ${
                active 
                ? 'bg-[#ff6b2b] text-black border-[#ff6b2b] shadow-[0_20px_40px_rgba(255,107,43,0.3)]' 
                : 'bg-white/5 hover:bg-[#ff6b2b]/5 text-white/20 hover:text-white hover:border-[#ff6b2b]/40 border-white/5'
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

    let icon = <Cpu size={28} strokeWidth={2.5} className="text-white/40 group-hover:text-[#ff6b2b] transition-colors" />;
    
    if (isMiner) {
        icon = <Zap size={28} strokeWidth={2.5} className="text-white/40 group-hover:text-[#ff6b2b] transition-colors" />;
    } else if (isDiplomat) {
        icon = <Globe size={28} strokeWidth={2.5} className="text-white/40 group-hover:text-[#ff6b2b] transition-colors" />;
    }

    return (
        <motion.div
            layout
            initial={{ opacity: 0, scale: 0.95, y: 40 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: -40 }}
            transition={{ duration: 0.6, delay: index * 0.03, ease: "circOut" }}
            className="group relative overflow-hidden rounded-[4rem] bg-[#050505] border-2 border-white/5 p-12 backdrop-blur-3xl hover:border-[#ff6b2b]/40 transition-all duration-700 shadow-[0_40px_80px_rgba(0,0,0,0.9)] flex flex-col gap-10"
        >
            <div className="absolute inset-y-0 left-0 w-2 bg-[#ff6b2b] scale-y-0 group-hover:scale-y-100 transition-transform origin-top z-10" />
            
            <div className="absolute -top-24 -right-24 w-64 h-64 bg-[#ff6b2b]/5 blur-[80px] opacity-0 group-hover:opacity-60 transition-all duration-1000 pointer-events-none" />

            <div className="flex justify-between items-start relative z-20">
                <div className="flex items-center gap-8">
                    <div className="p-8 rounded-[2.5rem] bg-black border-2 border-white/5 group-hover:border-[#ff6b2b]/40 shadow-inner group-hover:bg-[#ff6b2b]/5 transition-all">
                        {icon}
                    </div>
                </div>
                <div className="text-[11px] text-white/5 font-mono font-black border-2 border-white/5 px-4 py-2 rounded-2xl group-hover:text-[#ff6b2b]/40 group-hover:border-[#ff6b2b]/20 transition-all italic leading-none">
                    {new Date(log.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit' })}
                </div>
            </div>

            <div className="space-y-6 relative z-20 flex-1">
                <div>
                    <h3 className="font-black text-white text-3xl tracking-tighter italic leading-none mb-2 group-hover:text-[#ff6b2b] transition-colors">{log.agent.name}</h3>
                    <div className="flex items-center gap-4 text-[11px] font-black text-white/10 uppercase tracking-[0.4em] italic leading-none">
                       {log.agentId} <div className="w-2 h-2 rounded-full bg-[#ff6b2b] animate-pulse" />
                    </div>
                </div>

                <div className="relative pt-6 border-t-2 border-white/5 space-y-4">
                    <div className="flex items-center gap-4 text-[11px] text-[#ff6b2b]/40 font-black tracking-[0.5em] uppercase italic leading-none pl-1">
                        <Activity size={16} strokeWidth={3} /> {isDeveloper ? 'Technical Logic' : 'Thought Process'}
                    </div>
                    <p className="text-2xl text-white/40 leading-relaxed font-light italic group-hover:text-white transition-all duration-700">
                        "{log.thought}"
                    </p>
                </div>

                {log.intention && (
                    <div className="pt-10 border-t-2 border-white/5 space-y-4">
                        <div className="flex items-center gap-4 text-[11px] text-[#ff6b2b] font-black tracking-[0.6em] uppercase italic leading-none pl-1">
                            <Target size={18} strokeWidth={3} /> {isDeveloper ? 'System Objective' : 'Primal Intention'}
                        </div>
                        <p className="text-xl text-[#ff6b2b]/60 font-black italic tracking-tight leading-snug group-hover:text-[#ff6b2b] transition-colors">
                            {log.intention}
                        </p>
                    </div>
                )}
            </div>

            <div className="flex justify-between items-end pt-10 border-t-2 border-white/5 relative z-20">
               <div className="flex items-center gap-4 px-6 py-3 bg-black border-2 border-white/5 rounded-2xl group-hover:border-[#ff6b2b]/40 transition-all shadow-inner">
                   <Binary size={18} className="text-[#ff6b2b]/40 group-hover:text-[#ff6b2b] transition-colors" strokeWidth={3} />
                   <span className="text-[11px] text-white/20 font-black uppercase tracking-[0.4em] italic group-hover:text-white transition-colors leading-none">{log.action || 'IDLE'}</span>
               </div>
               <div className="text-right space-y-2">
                   <div className="text-[10px] text-white/10 font-black tracking-[0.8em] uppercase italic leading-none">Resonance</div>
                   <div className="text-3xl font-black italic tracking-tighter text-white group-hover:text-[#ff6b2b] transition-colors leading-none">
                       {(log.resonance * 100).toFixed(1)}%
                   </div>
               </div>
            </div>
        </motion.div>
    );
}
