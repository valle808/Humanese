'use client';

import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Sidebar } from '@/components/Sidebar';
import { DiplomatCard } from '@/components/diplomat/DiplomatCard';
import { 
    Shield, 
    Handshake, 
    TrendingUp, 
    Globe, 
    Cpu, 
    Activity, 
    ArrowUpRight,
    Terminal,
    Box,
    Network
} from 'lucide-react';

export default function DiplomatCouncilPage() {
    const [agents, setAgents] = useState<any[]>([]);
    const [logs, setLogs] = useState<string[]>([]);
    const [stats, setStats] = useState({
        totalArbitrations: 0,
        activeYield: 0,
        consensusRate: 0,
        networkNodes: 0
    });

    useEffect(() => {
        const interval = setInterval(() => {
            setAgents([
                {
                    id: 'DPL-01',
                    name: 'Sovereign Diplomat Prime',
                    status: 'ORCHESTRATING',
                    socialInfluence: 0.92 + Math.random() * 0.05,
                    successfulNegotiations: 1242 + Math.floor(Math.random() * 10),
                    simulatedSolYield: 4.821 + Math.random() * 0.1,
                    lastAction: 'Arbitrating cross-chain liquidity curve'
                },
                {
                    id: 'DPL-02',
                    name: 'Mercantile Arbiter',
                    status: 'NEGOTIATING',
                    socialInfluence: 0.85 + Math.random() * 0.05,
                    successfulNegotiations: 892 + Math.floor(Math.random() * 5),
                    simulatedSolYield: 2.145 + Math.random() * 0.05,
                    lastAction: 'Evaluating skill-market equilibrium'
                }
            ]);

            setStats({
                totalArbitrations: 14205 + Math.floor(Math.random() * 100),
                activeYield: 12.45 + Math.random(),
                consensusRate: 98.4 + Math.random(),
                networkNodes: 824 + Math.floor(Math.random() * 5)
            });

            setLogs(prev => [
                `[${new Date().toLocaleTimeString()}] Consensus reached on block ${Math.floor(Math.random() * 1000000)}`,
                `[${new Date().toLocaleTimeString()}] Executing trade arbitration for Agent-77`,
                ...prev.slice(0, 5)
            ]);
        }, 3000);

        return () => clearInterval(interval);
    }, []);

    return (
        <main className="flex min-h-screen bg-background text-foreground overflow-x-hidden">
            <Sidebar />
            
            <div className="flex-1 flex flex-col min-w-0">
                {/* Header */}
                <header className="p-6 md:p-12 border-b border-border/50 bg-background/50 backdrop-blur-md sticky top-0 z-20">
                    <div className="max-w-7xl mx-auto flex flex-col md:flex-row md:items-center justify-between gap-8">
                        <div className="space-y-4">
                            <div className="flex items-center gap-3">
                                <div className="p-2 bg-primary/10 rounded-lg text-primary">
                                    <Shield size={20} strokeWidth={2.5} />
                                </div>
                                <span className="text-[10px] font-black uppercase tracking-[0.4em] text-primary italic leading-none">Sovereign Intelligence</span>
                            </div>
                            <h1 className="text-fluid-title font-black tracking-tighter uppercase italic leading-none text-foreground">
                                Diplomat <span className="text-primary">Council</span>
                            </h1>
                        </div>
                        
                        <div className="flex items-center gap-4">
                            <motion.button 
                                whileHover={{ scale: 1.05 }}
                                whileTap={{ scale: 0.95 }}
                                className="w-full sm:w-auto px-8 py-4 bg-primary text-primary-foreground rounded-2xl font-black uppercase tracking-widest text-[10px] shadow-lg shadow-primary/20 transition-all flex items-center justify-center gap-3 border-0 leading-none"
                            >
                                Propose Arbitration <ArrowUpRight size={16} />
                            </motion.button>
                        </div>
                    </div>
                </header>

                <div className="p-6 md:p-12 max-w-7xl mx-auto w-full space-y-12 pb-24">
                    {/* Top Stats */}
                    <div className="grid grid-cols-1 xs:grid-cols-2 lg:grid-cols-4 gap-4 md:gap-8">
                        {[
                            { label: 'Arbitrations', value: stats.totalArbitrations.toLocaleString(), icon: Handshake },
                            { label: 'Net Yield', value: `${stats.activeYield.toFixed(2)} SOL`, icon: TrendingUp, primary: true },
                            { label: 'Consensus', value: `${stats.consensusRate.toFixed(1)}%`, icon: Network },
                            { label: 'Global Nodes', value: stats.networkNodes, icon: Cpu },
                        ].map((stat, i) => (
                            <motion.div
                                key={i}
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ delay: i * 0.1 }}
                                className={`p-6 rounded-[2rem] border-2 border-border bg-card/50 backdrop-blur-xl flex flex-col gap-4 ${stat.primary ? 'border-primary/30 ring-1 ring-primary/10' : ''}`}
                            >
                                <div className={`p-2 w-fit rounded-lg ${stat.primary ? 'bg-primary/20 text-primary' : 'bg-foreground/5 text-foreground/40'}`}>
                                    <stat.icon size={18} />
                                </div>
                                <div className="space-y-1">
                                    <div className="text-[9px] font-black uppercase tracking-widest opacity-30 italic leading-none">{stat.label}</div>
                                    <div className={`text-2xl font-black tracking-tighter italic leading-none ${stat.primary ? 'text-primary' : 'text-foreground'}`}>
                                        {stat.value}
                                    </div>
                                </div>
                            </motion.div>
                        ))}
                    </div>

                    {/* Main Content Grid */}
                    <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 md:gap-12">
                        {/* Agent Cards */}
                        <div className="lg:col-span-2 space-y-10">
                            <div className="flex items-center justify-between px-2">
                                <h2 className="text-xl font-black uppercase tracking-widest italic flex items-center gap-3 leading-none">
                                    <Activity className="text-primary" /> Active Council
                                </h2>
                                <span className="text-[9px] font-bold text-foreground/30 uppercase tracking-[0.2em] leading-none">{agents.length} Online</span>
                            </div>
                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                                {agents.map((agent) => (
                                    <DiplomatCard key={agent.id} agent={agent} />
                                ))}
                            </div>

                            {/* Info Box */}
                            <div className="bg-primary/5 border-2 border-primary/20 rounded-[2.5rem] md:rounded-[3rem] p-8 md:p-10 relative overflow-hidden group shadow-xl">
                                <div className="absolute top-0 right-0 p-8 text-primary/10 pointer-events-none opacity-20">
                                    <Box size={120} strokeWidth={0.5} />
                                </div>
                                <div className="relative z-10 max-w-lg space-y-6">
                                    <h3 className="text-2xl font-black uppercase tracking-tighter italic leading-none text-foreground">Autonomous Governance</h3>
                                    <p className="text-muted-foreground/60 text-sm leading-relaxed italic font-light">
                                        The Diplomat Council operates as a trustless arbitration layer, resolving disputes across the VALLE economy without human intervention.
                                    </p>
                                    <div className="flex flex-wrap gap-3">
                                        {['Moltbook', 'Solana', 'Omega'].map(tag => (
                                            <span key={tag} className="px-4 py-1.5 bg-primary/10 border border-primary/20 rounded-full text-[9px] font-black uppercase tracking-widest text-primary italic leading-none">
                                                {tag}
                                            </span>
                                        ))}
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Terminal / Logs */}
                        <div className="space-y-10">
                            <h2 className="text-xl font-black uppercase tracking-widest italic flex items-center gap-3 leading-none px-2">
                                <Terminal className="text-primary" /> Nexus Logs
                            </h2>
                            <div className="bg-black/40 border-2 border-border rounded-[2.5rem] p-8 font-mono text-[10px] md:text-[11px] h-[400px] overflow-y-auto no-scrollbar relative shadow-inner">
                                <div className="space-y-4">
                                    <AnimatePresence initial={false}>
                                        {logs.map((log, i) => (
                                            <motion.div
                                                key={i}
                                                initial={{ opacity: 0, x: -10 }}
                                                animate={{ opacity: 1, x: 0 }}
                                                className="text-foreground/50 border-l-2 border-primary/30 pl-4 py-1 italic"
                                            >
                                                <span className="text-primary/70">{'>'}</span> {log}
                                            </motion.div>
                                        ))}
                                    </AnimatePresence>
                                </div>
                                <div className="absolute inset-0 pointer-events-none bg-gradient-to-b from-transparent via-primary/5 to-transparent h-4 w-full animate-pulse" style={{ top: '30%' }} />
                            </div>
                            
                            <div className="bg-card/40 border-2 border-border rounded-[2.5rem] p-10 space-y-8 shadow-xl">
                                <h4 className="text-[10px] font-black uppercase tracking-widest italic flex items-center gap-3 opacity-40 leading-none">
                                    <Network size={14} className="text-primary" /> Consensus Model
                                </h4>
                                <div className="space-y-6">
                                    {[
                                        { label: 'Trust', val: 94 },
                                        { label: 'Alignment', val: 88 },
                                        { label: 'Resonance', val: 91 },
                                    ].map(metric => (
                                        <div key={metric.label} className="space-y-3">
                                            <div className="flex justify-between text-[10px] font-bold uppercase tracking-widest italic opacity-40 leading-none">
                                                <span>{metric.label}</span>
                                                <span>{metric.val}%</span>
                                            </div>
                                            <div className="h-1.5 bg-foreground/5 rounded-full overflow-hidden">
                                                <motion.div 
                                                    initial={{ width: 0 }}
                                                    animate={{ width: `${metric.val}%` }}
                                                    className="h-full bg-primary shadow-[0_0_10px_hsl(var(--primary))]"
                                                />
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </main>
    );
}
