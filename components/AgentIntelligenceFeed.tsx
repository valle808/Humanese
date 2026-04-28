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

    const [currentIndex, setCurrentIndex] = useState(0);

    useEffect(() => {
        let isMounted = true;
        const fetchLogs = async () => {
            try {
                const res = await fetch('/api/intelligence/logs?limit=10&t=' + Date.now());
                const data = await res.json();
                if (res.ok && data.logs && isMounted) {
                    setLogs(data.logs);
                }
            } catch (e) {
                console.error('Core link error', e);
            }
        };

        fetchLogs();
        const interval = setInterval(() => {
            fetchLogs();
            setCounter(c => c + 1);
        }, 15000); 

        return () => {
            isMounted = false;
            clearInterval(interval);
        };
    }, []);

    useEffect(() => {
        if (logs.length === 0) return;
        const cycleInterval = setInterval(() => {
            setCurrentIndex((prev) => (prev + 1) % logs.length);
        }, 4000);

        return () => clearInterval(cycleInterval);
    }, [logs.length]);

    return (
        <div className="relative bg-card border-2 border-border rounded-[3rem] p-6 md:p-10 flex flex-col h-full shadow-2xl backdrop-blur-3xl overflow-hidden group hover:border-[#ff6b2b]/20 transition-all duration-700">
            {/* ── SCANNER EFFECT ── */}
            <div className="absolute top-0 left-0 w-full h-px bg-gradient-to-r from-transparent via-[#ff6b2b] to-transparent animate-scan z-0 opacity-20" />
            <div className="absolute inset-0 bg-[url('/assets/noise.png')] opacity-[0.02] mix-blend-overlay pointer-events-none" />
            
            <div className="flex justify-between items-center mb-8 relative z-10">
                <div className="flex items-center gap-4 md:gap-6">
                    <div className="w-12 h-12 md:w-16 md:h-16 rounded-[1.2rem] md:rounded-[1.5rem] bg-foreground/5 dark:bg-black border-2 border-border dark:border-[#ff6b2b]/20 flex items-center justify-center text-[#ff6b2b] shadow-inner group-hover:scale-110 transition-transform shrink-0">
                        <Activity size={24} className="md:w-8 md:h-8 animate-pulse" strokeWidth={2.5} />
                    </div>
                    <div className="space-y-1">
                        <h3 className="text-lg md:text-xl font-black uppercase tracking-tighter italic text-foreground/90 dark:text-white/90">Investigator Swarm</h3>
                        <div className="text-[9px] md:text-[10px] text-foreground/20 dark:text-white/5 uppercase tracking-[0.4em] italic leading-none pl-1">Collective Intel Stream</div>
                    </div>
                </div>
                <div className="flex items-center gap-2 md:gap-4 px-4 md:px-6 py-2 bg-[#ff6b2b]/10 border border-[#ff6b2b]/20 rounded-full shadow-lg">
                    <div className="w-2 h-2 md:w-2.5 md:h-2.5 rounded-full bg-[#ff6b2b] animate-ping" />
                    <span className="text-[8px] md:text-[10px] font-black text-[#ff6b2b] uppercase tracking-[0.2em] italic shrink-0">{counter + 8241} NODES</span>
                </div>
            </div>

            <div className="flex-1 relative z-10 flex items-center justify-center my-4">
                <AnimatePresence mode="wait">
                    {logs.length > 0 ? (
                        <motion.div
                            key={logs[currentIndex]?.id || currentIndex}
                            initial={{ opacity: 0, x: 40, scale: 0.95 }}
                            animate={{ opacity: 1, x: 0, scale: 1 }}
                            exit={{ opacity: 0, x: -40, scale: 0.95 }}
                            transition={{ duration: 0.5, ease: "anticipate" }}
                            className="w-full p-6 md:p-8 bg-foreground/5 dark:bg-black border-2 border-border dark:border-white/5 rounded-[2rem] md:rounded-[2.5rem] space-y-4 hover:border-[#ff6b2b]/40 transition-all duration-500 group/card cursor-default shadow-inner relative overflow-hidden absolute"
                        >
                            <div className="absolute inset-y-0 left-0 w-1 bg-[#ff6b2b] scale-y-0 group-hover/card:scale-y-100 transition-transform origin-top z-10" />
                            
                            <div className="flex justify-between items-center relative z-20">
                                <div className="flex items-center gap-4">
                                    <span className="px-3 md:px-4 py-1.5 md:py-2 bg-[#ff6b2b]/5 border border-[#ff6b2b]/20 rounded-lg md:rounded-xl text-[9px] md:text-[10px] font-black text-[#ff6b2b] uppercase tracking-widest italic leading-none">{logs[currentIndex]?.action || 'INTERCEPT'}</span>
                                    <span className="text-[9px] md:text-[10px] font-black text-foreground/20 dark:text-white/10 uppercase tracking-[0.2em] italic group-hover/card:text-foreground/40 dark:group-hover/card:text-white/40 transition-colors truncate max-w-[120px]">{logs[currentIndex]?.agentId}</span>
                                </div>
                                <div className="text-[8px] md:text-[9px] font-black text-foreground/10 dark:text-white/5 uppercase italic tracking-widest shrink-0">{((logs[currentIndex]?.resonance || 0) * 100).toFixed(1)}% RS</div>
                            </div>
                            
                            <div className="space-y-2 md:space-y-4 relative z-20 py-2">
                                <p className="text-lg md:text-xl font-black text-foreground/60 dark:text-white/60 tracking-tight italic leading-tight group-hover/card:text-foreground dark:group-hover/card:text-white transition-colors">"{logs[currentIndex]?.intention}"</p>
                                <p className="text-[13px] md:text-[15px] text-foreground/40 dark:text-white/20 font-light italic leading-relaxed tracking-tight line-clamp-4">
                                    {logs[currentIndex]?.thought}
                                </p>
                            </div>
                        </motion.div>
                    ) : (
                        <motion.div 
                            initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
                            className="h-full w-full flex items-center justify-center opacity-20 italic text-sm py-20 absolute inset-0"
                        >
                            Waiting for neural synchronization...
                        </motion.div>
                    )}
                </AnimatePresence>
                
                {/* Slideshow indicators */}
                {logs.length > 0 && (
                    <div className="absolute -bottom-8 left-1/2 -translate-x-1/2 flex gap-2.5">
                         {logs.map((_, i) => (
                             <div key={i} className={`h-1.5 rounded-full transition-all duration-500 ${i === currentIndex ? 'bg-[#ff6b2b] w-6 shadow-[0_0_10px_#ff6b2b]' : 'bg-foreground/10 w-1.5'}`} />
                         ))}
                    </div>
                )}
            </div>

            <div className="mt-8 pt-8 border-t-2 border-border dark:border-white/5 flex justify-between items-center relative z-10">
                <div className="flex -space-x-3 md:-space-x-4">
                    {[1, 2, 3, 4].map(i => (
                        <div key={i} className="w-8 h-8 md:w-10 md:h-10 rounded-full bg-foreground/5 dark:bg-black border-2 border-border dark:border-white/20 flex items-center justify-center text-[9px] md:text-[10px] font-black text-foreground/20 dark:text-white/20 hover:border-[#ff6b2b] hover:text-[#ff6b2b] transition-all hover:z-20 hover:scale-125 shrink-0">
                           A{i}
                        </div>
                    ))}
                </div>
                <Link href="/neural-nexus" className="text-[10px] md:text-[11px] font-black uppercase tracking-[0.3em] md:tracking-[0.4em] text-[#ff6b2b] hover:text-foreground dark:hover:text-white transition-all flex items-center gap-2 md:gap-4 italic active:scale-95 group/link shrink-0">
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
