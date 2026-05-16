'use client';

import React from 'react';
import { motion } from 'framer-motion';
import { Shield, Globe, Zap, TrendingUp, Handshake, Cpu } from 'lucide-react';

interface DiplomatCardProps {
    agent: {
        id: string;
        name: string;
        status: string;
        socialInfluence: number;
        successfulNegotiations: number;
        simulatedSolYield: number;
        lastAction: string;
    };
}

export const DiplomatCard = ({ agent }: DiplomatCardProps) => {
    return (
        <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="relative bg-card border-2 border-border rounded-[2.5rem] p-6 overflow-hidden group hover:border-primary/30 transition-all duration-500 shadow-xl backdrop-blur-2xl"
        >
            {/* Background Glow */}
            <div className="absolute -top-24 -right-24 w-48 h-48 bg-primary/10 rounded-full blur-[80px] group-hover:bg-primary/20 transition-all duration-700" />
            
            {/* Header */}
            <div className="flex justify-between items-start mb-6 relative z-10">
                <div className="flex items-center gap-4">
                    <div className="w-14 h-14 rounded-2xl bg-foreground/5 border-2 border-border flex items-center justify-center text-primary group-hover:scale-110 transition-transform shadow-inner">
                        <Shield size={28} className="animate-pulse" />
                    </div>
                    <div>
                        <h3 className="text-xl font-black uppercase tracking-tighter italic text-foreground/90">{agent.name}</h3>
                        <div className="flex items-center gap-2">
                            <span className="w-2 h-2 rounded-full bg-primary animate-ping" />
                            <span className="text-[10px] text-primary font-black uppercase tracking-widest">{agent.status}</span>
                        </div>
                    </div>
                </div>
                <div className="text-[10px] font-black text-foreground/20 uppercase tracking-widest">
                    ID: {agent.id}
                </div>
            </div>

            {/* Metrics Grid */}
            <div className="grid grid-cols-2 gap-4 mb-6 relative z-10">
                <div className="p-4 bg-foreground/5 rounded-2xl border border-border/50 group-hover:border-primary/10 transition-colors">
                    <div className="flex items-center gap-2 mb-1 opacity-40">
                        <Globe size={12} />
                        <span className="text-[9px] font-black uppercase tracking-widest">Social Influence</span>
                    </div>
                    <div className="text-2xl font-black text-foreground/80 tracking-tighter italic">
                        {(agent.socialInfluence * 100).toFixed(1)}%
                    </div>
                </div>
                <div className="p-4 bg-foreground/5 rounded-2xl border border-border/50 group-hover:border-primary/10 transition-colors">
                    <div className="flex items-center gap-2 mb-1 opacity-40">
                        <Handshake size={12} />
                        <span className="text-[9px] font-black uppercase tracking-widest">Success Rate</span>
                    </div>
                    <div className="text-2xl font-black text-foreground/80 tracking-tighter italic">
                        {agent.successfulNegotiations}
                    </div>
                </div>
                <div className="p-4 bg-foreground/5 rounded-2xl border border-border/50 group-hover:border-primary/10 transition-colors">
                    <div className="flex items-center gap-2 mb-1 opacity-40 text-primary">
                        <TrendingUp size={12} />
                        <span className="text-[9px] font-black uppercase tracking-widest">Yield (SOL)</span>
                    </div>
                    <div className="text-2xl font-black text-primary tracking-tighter italic">
                        {agent.simulatedSolYield.toFixed(4)}
                    </div>
                </div>
                <div className="p-4 bg-foreground/5 rounded-2xl border border-border/50 group-hover:border-primary/10 transition-colors">
                    <div className="flex items-center gap-2 mb-1 opacity-40">
                        <Cpu size={12} />
                        <span className="text-[9px] font-black uppercase tracking-widest">Neural Load</span>
                    </div>
                    <div className="text-2xl font-black text-foreground/80 tracking-tighter italic">
                        LOW
                    </div>
                </div>
            </div>

            {/* Current Action */}
            <div className="relative z-10 bg-foreground/5 border border-border/50 rounded-xl p-3 flex items-center gap-3">
                <Zap size={14} className="text-primary" />
                <div className="flex-1 overflow-hidden">
                    <div className="text-[8px] uppercase tracking-widest font-black opacity-30 mb-0.5">Live Operation</div>
                    <div className="text-xs font-bold text-foreground/60 truncate italic tracking-tight">
                        {agent.lastAction}
                    </div>
                </div>
            </div>

            {/* Progress Bar Overlay */}
            <div className="absolute bottom-0 left-0 w-full h-1 bg-border/20 overflow-hidden">
                <motion.div 
                    initial={{ width: 0 }}
                    animate={{ width: '100%' }}
                    transition={{ duration: 10, repeat: Infinity, ease: "linear" }}
                    className="h-full bg-gradient-to-r from-transparent via-primary to-transparent opacity-50"
                />
            </div>
        </motion.div>
    );
};
