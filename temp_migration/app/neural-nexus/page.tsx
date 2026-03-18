'use client';

import React, { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Brain, Activity, Target, Zap, Cpu, MessageSquare, Globe, Shield, TrendingUp, Users, Radio } from 'lucide-react';

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
        <div className="relative w-full h-[300px] bg-white/5 border border-white/10 rounded-[2rem] overflow-hidden group">
            <div className="absolute inset-0 opacity-20 group-hover:opacity-40 transition-opacity duration-1000">
                <svg width="100%" height="100%" viewBox="0 0 1000 500" preserveAspectRatio="xMidYMid slice" className="stroke-emerald/50 fill-none">
                    <circle cx="200" cy="150" r="1.5" className="animate-ping node-1" />
                    <circle cx="450" cy="220" r="1.5" className="animate-ping node-2" />
                    <circle cx="680" cy="180" r="1.5" className="animate-ping node-3" />
                    <circle cx="820" cy="350" r="1.5" className="animate-ping node-4" />
                    <path d="M200,150 Q325,185 450,220 T680,180 T820,350" strokeWidth="0.5" strokeDasharray="5,5" className="opacity-30" />
                </svg>
            </div>
            <div className="absolute top-6 left-6 flex items-center gap-2">
                <div className="w-1.5 h-1.5 rounded-full bg-emerald animate-pulse" />
                <span className="text-[10px] font-bold tracking-[0.3em] uppercase text-platinum/40">Global Nodes Active</span>
            </div>
            <div className="absolute inset-0 flex items-center justify-center">
                <span className="text-[10px] font-bold tracking-[0.5em] uppercase text-emerald/30 group-hover:text-emerald/60 transition-colors">Distributed Sovereignty</span>
            </div>
        </div>
    );
}

function ResonanceChart({ data }: { data: number[] }) {
    const points = (data || []).map((val, i) => `${i * (100 / 11)},${100 - (val * 100)}`).join(' ');
    
    return (
        <div className="w-full h-[120px] bg-white/5 border border-white/10 rounded-[1.5rem] p-6 relative group overflow-hidden">
            <div className="absolute top-4 left-6 flex items-center justify-between w-[calc(100%-3rem)]">
                <span className="text-[9px] font-bold tracking-widest uppercase text-platinum/30">Historical Resonance (60m)</span>
                <span className="text-[9px] font-mono text-emerald/60">{( (data?.[data.length-1] || 0) * 100).toFixed(1)}%</span>
            </div>
            <div className="mt-8 h-[40px] w-full">
                <svg width="100%" height="100%" viewBox="0 0 100 100" preserveAspectRatio="none">
                    <polyline
                        points={points}
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="2"
                        className="text-emerald/80 drop-shadow-[0_0_8px_rgba(16,185,129,0.5)]"
                    />
                    <motion.path
                        initial={{ pathLength: 0 }}
                        animate={{ pathLength: 1 }}
                        d={`M 0,100 ${points.split(' ').map((p, i) => `L ${p}`).join(' ')} L 100,100 Z`}
                        className="fill-emerald/5"
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
                // TACTICAL shows all logs but with a different UI emphasis
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
        <div className="p-8 max-w-7xl mx-auto min-h-screen font-sans bg-obsidian text-platinum selection:bg-emerald/30 architectural-depth">
            {/* Header section with enhanced glassmorphism */}
            <motion.div 
                initial={{ opacity: 0, y: -20 }}
                animate={{ opacity: 1, y: 0 }}
                className="mb-12 relative overflow-hidden rounded-[2.5rem] bg-gradient-to-br from-white/10 to-white/5 border border-white/10 p-10 backdrop-blur-2xl shadow-[0_20px_50px_rgba(0,0,0,0.5)]"
            >
                <div className="absolute -top-24 -right-24 p-4 opacity-10 pointer-events-none">
                    <Brain size={400} className="text-emerald animate-pulse" />
                </div>
                
                <div className="relative z-10 flex flex-col lg:flex-row justify-between items-start lg:items-center gap-8">
                    <div className="flex-1">
                        <div className="flex items-center gap-3 mb-4">
                            <div className="px-3 py-1 rounded-full bg-emerald/20 border border-emerald/40 text-emerald text-[10px] font-bold tracking-[0.2em] uppercase">
                                Sovereign Intelligence Overlay
                            </div>
                            <div className="flex items-center gap-1.5 text-cyan text-[10px] font-bold tracking-[0.2em] uppercase">
                                <Radio size={12} className="animate-pulse" /> {filterCategory === 'TACTICAL' ? 'TACTICAL FEED' : 'Live Stream'}
                            </div>
                        </div>
                        <h1 className="text-6xl font-black bg-gradient-to-r from-emerald via-cyan to-indigo bg-clip-text text-transparent mb-4 tracking-tighter">
                            Neural Nexus
                        </h1>
                        <p className="text-platinum/50 text-lg max-w-2xl leading-relaxed">
                            {filterCategory === 'TACTICAL' 
                                ? 'Monitoring raw operational telemetry and cryptographic intent. Total swarm transparency active.' 
                                : 'Interfacing with the collective cognitive matrix. Monitoring real-time intention vectors and technical synthesis.'}
                        </p>
                        
                        <div className="mt-8 flex gap-4">
                             <CategoryTab active={filterCategory === 'UNIVERSAL'} onClick={() => setFilterCategory('UNIVERSAL')}>Universal</CategoryTab>
                             <CategoryTab active={filterCategory === 'FINANCIAL'} onClick={() => setFilterCategory('FINANCIAL')}>Financial</CategoryTab>
                             <CategoryTab active={filterCategory === 'TECHNICAL'} onClick={() => setFilterCategory('TECHNICAL')}>Technical</CategoryTab>
                             <CategoryTab active={filterCategory === 'TACTICAL'} onClick={() => setFilterCategory('TACTICAL')}>Tactical</CategoryTab>
                        </div>
                    </div>

                    {/* Quick Stats Grid with Time-Series Graph */}
                    <div className="flex flex-col gap-4 w-full lg:w-auto">
                        <div className="grid grid-cols-2 gap-4">
                            <StatCard icon={<TrendingUp size={16}/>} label="Swarm Resonance" value={`${((nexusState?.swarmResonance || 0) * 100).toFixed(1)}%`} color="emerald" />
                            <StatCard icon={<Shield size={16}/>} label="System Resilience" value={`${((nexusState?.systemResilience || 0) * 100).toFixed(1)}%`} color="indigo" />
                            <StatCard icon={<Users size={16}/>} label="Active Units" value={nexusState?.activeAgents || 0} color="cyan" />
                            <StatCard icon={<Activity size={16}/>} label="System Status" value={nexusState?.systemStatus || 'BOOTING'} color={nexusState?.systemStatus === 'OPTIMAL' ? 'emerald' : 'indigo'} />
                        </div>
                        <ResonanceChart data={nexusState?.resonanceTrend || []} />
                    </div>
                </div>

                <div className="mt-10 flex flex-wrap gap-2 pt-8 border-t border-white/5">
                    <FilterButton active={!filter} onClick={() => setFilter(null)}>Universal Grid</FilterButton>
                    {agents.map(id => (
                        <FilterButton key={id} active={filter === id} onClick={() => setFilter(id)}>{id}</FilterButton>
                    ))}
                </div>
            </motion.div>

            {/* Main Content Area */}
            <div className="flex flex-col xl:flex-row gap-10">
                {/* Visual Column (Map & Tactical Info) */}
                <div className="w-full xl:w-1/4 flex flex-col gap-6 order-2 xl:order-1">
                    <SovereigntyMap />
                    <div className="bg-white/5 border border-white/10 rounded-[2rem] p-8">
                        <h4 className="text-[10px] font-bold tracking-[0.3em] uppercase text-emerald mb-4">Operational Status</h4>
                        <ul className="space-y-4 font-mono text-[10px] text-platinum/50 uppercase">
                            <li className="flex justify-between"><span>Registry Caching</span> <span className="text-emerald">Active</span></li>
                            <li className="flex justify-between"><span>DB Retry Queue</span> <span className="text-emerald">Resilient</span></li>
                            <li className="flex justify-between"><span>Swarm Latency</span> <span className="text-cyan">0.02ms</span></li>
                        </ul>
                    </div>
                </div>

                {/* Logs Grid */}
                <div className={`grid grid-cols-1 md:grid-cols-2 ${filterCategory === 'TACTICAL' ? 'lg:grid-cols-2' : 'lg:grid-cols-3'} xl:flex-1 gap-6 relative transition-all duration-500 order-1 xl:order-2`}>
                    <AnimatePresence mode="popLayout">
                        {logs.map((log, index) => (
                            <LogCard key={log.id} log={log} index={index} />
                        ))}
                    </AnimatePresence>
                </div>
            </div>

            <style jsx global>{`
                .architectural-depth {
                    perspective: 1000px;
                    background: radial-gradient(circle at 50% 50%, rgba(16, 185, 129, 0.05) 0%, transparent 70%);
                }
                .node-2 { animation-delay: 1s; }
                .node-3 { animation-delay: 2s; }
                .node-4 { animation-delay: 1.5s; }
                .glow-overlay[data-type="miner"] { background-color: #10b981; }
                .glow-overlay[data-type="diplomat"] { background-color: #06b6d4; }
                .glow-overlay[data-type="developer"] { background-color: #818cf8; }
                .custom-scrollbar::-webkit-scrollbar {
                    width: 2px;
                }
                .custom-scrollbar::-webkit-scrollbar-track {
                    background: transparent;
                }
                .custom-scrollbar::-webkit-scrollbar-thumb {
                    background: rgba(16, 185, 129, 0.2);
                    border-radius: 10px;
                }
            `}</style>

            {loading && logs.length === 0 && (
                <div className="flex flex-col items-center justify-center py-40 gap-6">
                    <div className="relative">
                        <div className="w-16 h-16 rounded-full border-4 border-emerald/10 border-t-emerald animate-spin" />
                        <Brain size={24} className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 text-emerald animate-pulse" />
                    </div>
                    <span className="text-platinum/30 font-mono text-xs tracking-[0.3em] uppercase">Syncing Neural Substrates...</span>
                </div>
            )}
        </div>
    );
}

function TacticalTerminal({ logs }: { logs: CognitiveLog[] }) {
    return (
        <div className="w-full h-full bg-obsidian border border-emerald/20 rounded-[2rem] overflow-hidden flex flex-col shadow-2xl shadow-emerald/5">
            <div className="bg-white/5 border-b border-white/10 p-4 flex items-center justify-between">
                <div className="flex items-center gap-2">
                    <Terminal size={14} className="text-emerald" />
                    <span className="text-[10px] font-bold tracking-widest uppercase text-platinum/60 items-center flex gap-2">
                        Tactical Command Feed <div className="w-2 h-2 rounded-full bg-emerald animate-ping" />
                    </span>
                </div>
                <Users size={14} className="text-platinum/40" />
            </div>
            <div className="flex-1 overflow-y-auto p-6 font-mono text-[10px] space-y-2 custom-scrollbar">
                {logs.map((log, i) => (
                    <motion.div 
                        key={`${log.id}-terminal`}
                        initial={{ opacity: 0, x: -10 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: i * 0.05 }}
                        className="flex gap-3 leading-tight opacity-70 hover:opacity-100 transition-opacity"
                    >
                        <span className="text-platinum/20">[{new Date(log.timestamp).toLocaleTimeString([], { hour12: false })}]</span>
                        <span className="text-emerald font-bold">{log.agentId}</span>
                        <span className="text-platinum/50">&gt;&gt;</span>
                        <span className="text-cyan">{log.action || 'NOP'}</span>
                        <span className="text-platinum/40">RES:{(log.resonance * 100).toFixed(1)}%</span>
                        <span className="text-emerald/80 truncate">SYT:TRUE</span>
                    </motion.div>
                ))}
                <div className="pt-2 text-emerald animate-pulse">_</div>
            </div>
            <div className="p-4 bg-emerald/5 border-t border-emerald/10 text-[9px] text-emerald/60 font-bold uppercase tracking-widest text-center">
                Swarm Sovereignty Established
            </div>
        </div>
    );
}

function CategoryTab({ children, active, onClick }: { children: string, active: boolean, onClick: () => void }) {
    return (
        <button 
            onClick={onClick}
            className={`text-xs font-bold uppercase tracking-[0.2em] pb-2 transition-all border-b-2 ${active ? 'text-platinum border-emerald shadow-[0_4px_10px_-4px_rgba(16,185,129,0.5)]' : 'text-platinum/30 border-transparent hover:text-platinum/60'}`}
        >
            {children}
        </button>
    );
}

function StatCard({ icon, label, value, color }: { icon: any, label: string, value: string | number, color: string }) {
    const colorClasses: Record<string, string> = {
        emerald: 'text-emerald border-emerald/20 bg-emerald/5',
        cyan: 'text-cyan border-cyan/20 bg-cyan/5',
        indigo: 'text-indigo-400 border-indigo-400/20 bg-indigo-400/5'
    };

    return (
        <div className={`p-5 rounded-2xl border backdrop-blur-xl ${colorClasses[color]} min-w-[140px]`}>
            <div className="flex items-center gap-2 mb-2 opacity-60">
                {icon}
                <span className="text-[9px] font-bold tracking-widest uppercase">{label}</span>
            </div>
            <div className="text-2xl font-black tracking-tight">{value}</div>
        </div>
    );
}

function FilterButton({ children, active, onClick }: { children: React.ReactNode, active: boolean, onClick: () => void }) {
    return (
        <button 
            onClick={onClick}
            className={`px-5 py-2 rounded-xl text-[11px] font-bold uppercase tracking-widest transition-all duration-300 border ${
                active 
                ? 'bg-emerald text-obsidian border-emerald shadow-[0_0_20px_rgba(16,185,129,0.3)]' 
                : 'bg-white/5 hover:bg-white/10 text-platinum/40 border-white/10'
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

    let icon = <Cpu size={22} className="text-indigo-400" />;
    let accentColor = 'indigo-400';
    let bgColor = 'indigo-400/10';
    let borderColor = 'indigo-400/20';

    if (isMiner) {
        icon = <Zap size={22} className="text-emerald" />;
        accentColor = 'emerald';
        bgColor = 'emerald/10';
        borderColor = 'emerald/20';
    } else if (isDiplomat) {
        icon = <Globe size={22} className="text-cyan" />;
        accentColor = 'cyan';
        bgColor = 'cyan/10';
        borderColor = 'cyan/20';
    }

    return (
        <motion.div
            layout
            initial={{ opacity: 0, scale: 0.95, y: 30 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: -30 }}
            transition={{ duration: 0.5, delay: index * 0.03, ease: [0.23, 1, 0.32, 1] }}
            className="group relative overflow-hidden rounded-[2rem] bg-gradient-to-b from-white/10 to-transparent border border-white/10 p-8 backdrop-blur-xl hover:border-white/30 transition-all duration-500 shadow-xl"
        >
            <div 
                className="absolute -top-20 -right-20 w-40 h-40 blur-[80px] opacity-20 group-hover:opacity-60 transition-all duration-700 pointer-events-none glow-overlay"
                data-type={isMiner ? 'miner' : isDiplomat ? 'diplomat' : 'developer'}
            />

            <div className="flex justify-between items-start mb-8">
                <div className="flex items-center gap-4">
                    <div className={`p-3 rounded-2xl bg-${bgColor} border-${borderColor} border shadow-inner`}>
                        {icon}
                    </div>
                    <div>
                        <h3 className="font-black text-platinum text-lg tracking-tight leading-none mb-1">{log.agent.name}</h3>
                        <div className="flex items-center gap-2">
                             <span className="text-[10px] text-platinum/30 font-mono tracking-tighter">{log.agentId}</span>
                             <div className={`w-1 h-1 rounded-full animate-pulse bg-${accentColor}`} />
                        </div>
                    </div>
                </div>
                <div className="text-[10px] text-platinum/20 font-mono font-bold bg-white/5 px-2 py-1 rounded-md">
                    {new Date(log.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit' })}
                </div>
            </div>

            <div className="space-y-6">
                <div className="relative">
                    <div className={`absolute -left-4 top-0 bottom-0 w-[2px] bg-${accentColor}/20`} />
                    <div className={`flex items-center gap-2 text-[10px] text-${accentColor} font-bold tracking-[0.2em] uppercase mb-2`}>
                        <Activity size={12} /> {isDeveloper ? 'Technical Logic' : 'Thought Process'}
                    </div>
                    <p className="text-md text-platinum/90 leading-relaxed font-medium italic opacity-90 group-hover:opacity-100 transition-opacity">
                        "{log.thought}"
                    </p>
                </div>

                {log.intention && (
                    <div className="pt-6 border-t border-white/5">
                        <div className={`flex items-center gap-2 text-[10px] text-${accentColor === 'emerald' ? 'cyan' : 'emerald'} font-bold tracking-[0.2em] uppercase mb-2`}>
                            <Target size={12} /> {isDeveloper ? 'System Objective' : 'Primal Intention'}
                        </div>
                        <p className={`text-sm text-${accentColor === 'emerald' ? 'cyan' : 'emerald'}/70 font-bold leading-snug`}>
                            {log.intention}
                        </p>
                    </div>
                )}

                <div className="flex items-center justify-between pt-6 mt-auto">
                   <div className="flex items-center gap-3 px-4 py-2 bg-white/5 rounded-xl border border-white/5 group-hover:border-white/20 transition-colors">
                       {isDeveloper ? <Terminal size={14} className={`text-${accentColor}`} /> : <Cpu size={14} className={`text-${accentColor}`} />}
                       <span className="text-[11px] text-platinum/60 font-black uppercase tracking-[0.15em]">{log.action || 'IDLE'}</span>
                   </div>
                   <div className="text-right">
                       <div className="text-[9px] text-platinum/30 font-bold tracking-widest uppercase mb-1">Resonance</div>
                       <div className={`text-xl font-black font-mono text-${accentColor}`}>
                           {(log.resonance * 100).toFixed(1)}%
                       </div>
                   </div>
                </div>
            </div>
        </motion.div>
    );
}

const Terminal = ({ size, className }: { size: number, className: string }) => (
    <svg 
        width={size} 
        height={size} 
        viewBox="0 0 24 24" 
        fill="none" 
        stroke="currentColor" 
        strokeWidth="2" 
        strokeLinecap="round" 
        strokeLinejoin="round" 
        className={className}
    >
        <polyline points="4 17 10 11 4 5" />
        <line x1="12" y1="19" x2="20" y2="19" />
    </svg>
);


