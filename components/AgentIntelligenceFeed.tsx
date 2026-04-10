'use client';

import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import Link from 'next/link';
import { 
    Zap, 
    Search, 
    Eye, 
    Database, 
    Globe, 
    Activity, 
    ShieldCheck, 
    Loader2,
    Radio,
    Wifi,
    Terminal,
    Target,
    Orbit,
    Binary,
    ChevronRight
} from 'lucide-react';

export const AgentIntelligenceFeed = () => {
    const [logs, setLogs] = useState<any[]>([]);
    const [counter, setCounter] = useState(0);

    const fetchLogs = async () => {
        try {
            const res = await fetch('/api/intelligence/logs?limit=4');
            const data = await res.json();
            if (res.ok && data.logs) {
                setLogs(data.logs);
            }
        } catch (e) {
            console.error('Core link error', e);
        }
    };

    useEffect(() => {
        fetchLogs();
        const interval = setInterval(() => {
            fetchLogs();
            setCounter(c => c + 1);
        }, 8000); 

        return () => clearInterval(interval);
    }, []);

    return (
        <div className="relative bg-[#050505] border-2 border-white/5 rounded-[3rem] p-10 flex flex-col h-full shadow-[0_40px_80px_rgba(0,0,0,0.95)] shadow-inner backdrop-blur-3xl overflow-hidden group hover:border-[#ff6b2b]/20 transition-all duration-700">
            {/* ── SCANNER EFFECT ── */}
            <div className="absolute top-0 left-0 w-full h-px bg-gradient-to-r from-transparent via-[#ff6b2b] to-transparent animate-scan z-0 opacity-20" />
            <div className="absolute inset-0 bg-[url('/assets/noise.png')] opacity-[0.02] mix-blend-overlay pointer-events-none" />
            
            <div className="flex justify-between items-center mb-10 relative z-10">
                <div className="flex items-center gap-6">
                    <div className="w-16 h-16 rounded-[1.5rem] bg-black border-2 border-[#ff6b2b]/20 flex items-center justify-center text-[#ff6b2b] shadow-inner group-hover:scale-110 transition-transform">
                        <Activity size={32} className="animate-pulse" strokeWidth={2.5} />
                    </div>
                    <div className="space-y-1">
                        <h3 className="text-xl font-black uppercase tracking-tighter italic text-white/90">Investigator Swarm</h3>
                        <div className="text-[10px] text-white/5 uppercase tracking-[0.4em] italic leading-none pl-1">Collective Intel Stream</div>
                    </div>
                </div>
                <div className="flex items-center gap-4 px-6 py-2.5 bg-[#ff6b2b]/10 border border-[#ff6b2b]/20 rounded-full shadow-2xl">
                    <div className="w-2.5 h-2.5 rounded-full bg-[#ff6b2b] animate-ping" />
                    <span className="text-[10px] font-black text-[#ff6b2b] uppercase tracking-[0.2em] italic">{counter + 8241} NODES</span>
                </div>
            </div>

            <div className="flex-1 space-y-6 overflow-hidden relative z-10">
                <AnimatePresence mode="popLayout">
                    {logs.map((log, i) => (
                        <motion.div
                            key={log.id}
                            initial={{ opacity: 0, x: -40 }}
                            animate={{ opacity: 1, x: 0 }}
                            exit={{ opacity: 0, scale: 0.9, transition: { duration: 0.3 } }}
                            transition={{ delay: i * 0.1 }}
                            className="p-8 bg-black border-2 border-white/5 rounded-[2.5rem] space-y-4 hover:border-[#ff6b2b]/40 transition-all duration-500 group/card cursor-default shadow-inner relative overflow-hidden"
                        >
                            <div className="absolute inset-y-0 left-0 w-1 bg-[#ff6b2b] scale-y-0 group-hover/card:scale-y-100 transition-transform origin-top z-10" />
                            
                            <div className="flex justify-between items-center relative z-20">
                                <div className="flex items-center gap-4">
                                    <span className="px-4 py-2 bg-[#ff6b2b]/5 border border-[#ff6b2b]/20 rounded-xl text-[10px] font-black text-[#ff6b2b] uppercase tracking-widest italic leading-none">{log.action || 'INTERCEPT'}</span>
                                    <span className="text-[10px] font-black text-white/10 uppercase tracking-[0.2em] italic group-hover/card:text-white/40 transition-colors">{log.agentId}</span>
                                </div>
                                <div className="text-[9px] font-black text-white/5 uppercase italic tracking-widest">{(log.resonance * 100).toFixed(1)}% RS</div>
                            </div>
                            
                            <div className="space-y-3 relative z-20">
                                <p className="text-lg font-black text-white/60 tracking-tight italic leading-tight group-hover/card:text-white transition-colors">"{log.intention}"</p>
                                <p className="text-[14px] text-white/10 font-light italic leading-relaxed tracking-tight line-clamp-2">
                                    {log.thought}
                                </p>
                            </div>
                        </motion.div>
                    ))}
                </AnimatePresence>
            </div>

            <div className="mt-10 pt-10 border-t-2 border-white/5 flex justify-between items-center relative z-10">
                <div className="flex -space-x-4">
                    {[1, 2, 3, 4].map(i => (
                        <div key={i} className="w-10 h-10 rounded-full bg-black border-2 border-white/20 flex items-center justify-center text-[10px] font-black text-white/20 hover:border-[#ff6b2b] hover:text-[#ff6b2b] transition-all hover:z-20 hover:scale-125">
                           A{i}
                        </div>
                    ))}
                </div>
                <Link href="/neural-nexus" className="text-[11px] font-black uppercase tracking-[0.4em] text-[#ff6b2b] hover:text-white transition-all flex items-center gap-4 italic active:scale-95 group/link">
                    Open Matrix View <ChevronRight size={18} className="group-hover/link:translate-x-3 transition-transform" strokeWidth={3} />
                </Link>
            </div>

            <style jsx>{`
                @keyframes scan {
                    0% { transform: translateY(-100%); }
                    100% { transform: translateY(1000%); }
                }
                .animate-scan {
                    animation: scan 10s linear infinite;
                }
            `}</style>
        </div>
    );
};
