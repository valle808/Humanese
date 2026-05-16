'use client';

import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Sidebar } from '@/components/Sidebar';
import { DiplomatCard } from '@/components/DiplomatCard';
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
        // Simulated real-time updates
        const interval = setInterval(() => {
            // In a real app, this would fetch from /api/diplomat/stats
            setAgents([
                {
                    id: 'DPL-01',
                    name: 'Sovereign Diplomat Prime',
                    status: 'ORCHESTRATING',
                    socialInfluence: 0.92 + Math.random() * 0.05,
                    successfulNegotiations: 1242 + Math.floor(Math.random() * 10),
                    simulatedSolYield: 4.821 + Math.random() * 0.1,
                    lastAction: 'Arbitrating cross-chain liquidity curve for VALLE/SOL pair'
                },
                {
                    id: 'DPL-02',
                    name: 'Mercantile Arbiter',
                    status: 'NEGOTIATING',
                    socialInfluence: 0.85 + Math.random() * 0.05,
                    successfulNegotiations: 892 + Math.floor(Math.random() * 5),
                    simulatedSolYield: 2.145 + Math.random() * 0.05,
                    lastAction: 'Evaluating skill-market equilibrium on Moltbook'
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
                ...prev.slice(0, 8)
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
                    <div className="max-w-7xl mx-auto flex flex-col md:flex-row md:items-center justify-between gap-6">
                        <div>
                            <div className="flex items-center gap-3 mb-2">
                                <div className="p-2 bg-primary/10 rounded-lg text-primary">
                                    <Shield size={20} strokeWidth={2.5} />
                                </div>
                                <span className="text-[10px] font-black uppercase tracking-[0.4em] text-primary italic">Sovereign Intelligence</span>
                            </div>
                            <h1 className="text-4xl md:text-6xl font-black tracking-tighter uppercase italic leading-none">
                                Diplomat <span className="text-primary">Council</span>
                            </h1>
                        </div>
                        
                        <div className="flex items-center gap-4">
                            <motion.button 
                                whileHover={{ scale: 1.05 }}
                                whileTap={{ scale: 0.95 }}
                                className="px-8 py-4 bg-primary text-primary-foreground rounded-2xl font-black uppercase tracking-widest text-xs shadow-lg shadow-primary/20 transition-all hover:shadow-primary/40 flex items-center gap-2"
                            >
                                Propose Arbitration <ArrowUpRight size={16} />
                            </motion.button>
                        </div>
                    </div>
                </header>

                <div className="p-6 md:p-12 max-w-7xl mx-auto w-full space-y-12">
                    {/* Top Stats */}
                    <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 md:gap-8">
                        {[
                            { label: 'Total Arbitrations', value: stats.totalArbitrations.toLocaleString(), icon: Handshake },
                            { label: 'Network Yield', value: `${stats.activeYield.toFixed(2)} SOL`, icon: TrendingUp, primary: true },
                            { label: 'Consensus Rate', value: `${stats.consensusRate.toFixed(1)}%`, icon: Network },
                            { label: 'Global Nodes', value: stats.networkNodes, icon: Cpu },
                        ].map((stat, i) => (
                            <motion.div
                                key={i}
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ delay: i * 0.1 }}
                                className={`p-6 rounded-[2rem] border-2 border-border bg-card/50 backdrop-blur-xl flex flex-col gap-3 ${stat.primary ? 'border-primary/30 ring-1 ring-primary/10' : ''}`}
                            >
                                <div className={`p-2 w-fit rounded-lg ${stat.primary ? 'bg-primary/20 text-primary' : 'bg-foreground/5 text-foreground/40'}`}>
                                    <stat.icon size={18} />
                                </div>
                                <div>
                                    <div className="text-[9px] font-black uppercase tracking-widest opacity-30 mb-1">{stat.label}</div>
                                    <div className={`text-xl md:text-2xl font-black tracking-tighter italic ${stat.primary ? 'text-primary' : ''}`}>
                                        {stat.value}
                                    </div>
                                </div>
                            </motion.div>
                        ))}
                    </div>

                    {/* Main Content Grid */}
                    <div className="grid lg:grid-cols-3 gap-8">
                        {/* Agent Cards */}
                        <div className="lg:col-span-2 space-y-8">
                            <div className="flex items-center justify-between">
                                <h2 className="text-xl font-black uppercase tracking-widest italic flex items-center gap-3">
                                    <Activity className="text-primary" /> Active Council Members
                                </h2>
                                <span className="text-[10px] font-bold text-foreground/30 uppercase tracking-[0.2em]">{agents.length} Online</span>
                            </div>
                            <div className="grid md:grid-cols-2 gap-6">
                                {agents.map((agent) => (
                                    <DiplomatCard key={agent.id} agent={agent} />
                                ))}
                            </div>

                            {/* Info Box */}
                            <div className="bg-primary/5 border-2 border-primary/20 rounded-[3rem] p-8 relative overflow-hidden group">
                                <div className="absolute top-0 right-0 p-8 text-primary/10">
                                    <Box size={120} strokeWidth={0.5} />
                                </div>
                                <div className="relative z-10 max-w-lg">
                                    <h3 className="text-2xl font-black uppercase tracking-tighter italic mb-4">Autonomous Governance</h3>
                                    <p className="text-foreground/60 text-sm leading-relaxed mb-6 italic">
                                        The Diplomat Council operates as a trustless arbitration layer, resolving disputes across the VALLE economy. 
                                        Using high-resonance social intelligence, council members negotiate fair market values and ensure 
                                        economic stability without human intervention.
                                    </p>
                                    <div className="flex flex-wrap gap-3">
                                        {['Moltbook Sync', 'Solana Bridge', 'Cross-Chain Arb'].map(tag => (
                                            <span key={tag} className="px-3 py-1 bg-primary/10 border border-primary/20 rounded-full text-[9px] font-black uppercase tracking-widest text-primary">
                                                {tag}
                                            </span>
                                        ))}
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Terminal / Logs */}
                        <div className="space-y-8">
                            <h2 className="text-xl font-black uppercase tracking-widest italic flex items-center gap-3">
                                <Terminal className="text-primary" /> Neural Nexus Logs
                            </h2>
                            <div className="bg-black/40 border-2 border-border rounded-[2.5rem] p-6 font-mono text-[11px] h-[500px] overflow-y-auto no-scrollbar relative">
                                <div className="space-y-4">
                                    <AnimatePresence initial={false}>
                                        {logs.map((log, i) => (
                                            <motion.div
                                                key={i}
                                                initial={{ opacity: 0, x: -10 }}
                                                animate={{ opacity: 1, x: 0 }}
                                                className="text-foreground/50 border-l-2 border-primary/30 pl-3 py-1"
                                            >
                                                <span className="text-primary/70">{'>'}</span> {log}
                                            </motion.div>
                                        ))}
                                    </AnimatePresence>
                                </div>
                                {/* Scanline effect */}
                                <div className="absolute inset-0 pointer-events-none bg-gradient-to-b from-transparent via-primary/5 to-transparent h-2 w-full animate-pulse" style={{ top: '20%' }} />
                            </div>
                            
                            <div className="bg-card border-2 border-border rounded-[2.5rem] p-8">
                                <h4 className="text-xs font-black uppercase tracking-widest italic mb-4 flex items-center gap-2">
                                    <Network size={14} className="text-primary" /> Consensus Model
                                </h4>
                                <div className="space-y-4">
                                    {[
                                        { label: 'Trust Score', val: 94 },
                                        { label: 'Alignment', val: 88 },
                                        { label: 'Resonance', val: 91 },
                                    ].map(metric => (
                                        <div key={metric.label}>
                                            <div className="flex justify-between text-[10px] font-bold uppercase tracking-widest mb-1.5 opacity-40">
                                                <span>{metric.label}</span>
                                                <span>{metric.val}%</span>
                                            </div>
                                            <div className="h-1.5 bg-foreground/5 rounded-full overflow-hidden">
                                                <motion.div 
                                                    initial={{ width: 0 }}
                                                    animate={{ width: `${metric.val}%` }}
                                                    className="h-full bg-primary shadow-[0_0_8px_hsl(var(--primary))]"
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
