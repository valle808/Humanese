'use client';

import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import Link from 'next/link';
import { Activity, Binary, ChevronRight } from 'lucide-react';

export const AgentIntelligenceFeed = () => {
    const [logs, setLogs] = useState<any[]>([]);
    const [counter, setCounter] = useState(0);
    const [currentIndex, setCurrentIndex] = useState(0);

    useEffect(() => {
        let isMounted = true;
        const fetchLogs = async () => {
            try {
                const res = await fetch('/api/intelligence/logs?limit=8&t=' + Date.now());
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

    // Auto-cycle slides every 4 seconds
    useEffect(() => {
        if (logs.length === 0) return;
        const cycleInterval = setInterval(() => {
            setCurrentIndex(prev => (prev + 1) % logs.length);
        }, 4000);
        return () => clearInterval(cycleInterval);
    }, [logs.length]);

    const log = logs[currentIndex];

    return (
        <div className="relative bg-card border-2 border-border rounded-[3rem] p-6 md:p-8 flex flex-col gap-4 overflow-hidden group hover:border-[#ff6b2b]/20 transition-all duration-700 shadow-2xl backdrop-blur-3xl h-full">
            {/* Scanner line */}
            <div className="absolute top-0 left-0 w-full h-px bg-gradient-to-r from-transparent via-[#ff6b2b] to-transparent z-0 opacity-20 animate-[scan_10s_linear_infinite]" />

            {/* ── HEADER ── */}
            <div className="flex justify-between items-center relative z-10 shrink-0">
                <div className="flex items-center gap-4">
                    <div className="w-12 h-12 rounded-[1.2rem] bg-foreground/5 dark:bg-black border-2 border-border dark:border-[#ff6b2b]/20 flex items-center justify-center text-[#ff6b2b] shadow-inner group-hover:scale-110 transition-transform shrink-0">
                        <Activity size={22} className="animate-pulse" strokeWidth={2.5} />
                    </div>
                    <div>
                        <h3 className="text-base md:text-lg font-black uppercase tracking-tighter italic text-foreground/90">Investigator Swarm</h3>
                        <div className="text-[9px] text-foreground/30 uppercase tracking-[0.4em] italic leading-none">Collective Intel Stream</div>
                    </div>
                </div>
                <div className="flex items-center gap-2 px-4 py-1.5 bg-[#ff6b2b]/10 border border-[#ff6b2b]/20 rounded-full">
                    <div className="w-2 h-2 rounded-full bg-[#ff6b2b] animate-ping shrink-0" />
                    <span className="text-[9px] font-black text-[#ff6b2b] uppercase tracking-[0.2em] italic">{counter + 8241} Nodes</span>
                </div>
            </div>

            {/* ── SLIDE VIEWPORT — fixed pixel height, clips overflow ── */}
            <div className="relative z-10 shrink-0 h-[200px] md:h-[220px] overflow-hidden rounded-[2rem]">
                <AnimatePresence mode="wait">
                    {log ? (
                        <motion.div
                            key={log.id || currentIndex}
                            initial={{ opacity: 0, x: 60 }}
                            animate={{ opacity: 1, x: 0 }}
                            exit={{ opacity: 0, x: -60 }}
                            transition={{ duration: 0.38, ease: [0.4, 0, 0.2, 1] }}
                            className="absolute inset-0 p-5 bg-foreground/5 dark:bg-black/60 border-2 border-border dark:border-white/5 rounded-[2rem] flex flex-col gap-3 hover:border-[#ff6b2b]/30 transition-colors group/card cursor-default overflow-hidden"
                        >
                            {/* Accent bar */}
                            <div className="absolute inset-y-0 left-0 w-1 bg-[#ff6b2b] scale-y-0 group-hover/card:scale-y-100 transition-transform origin-top z-10 rounded-l-[2rem]" />

                            {/* Tag row */}
                            <div className="flex items-center justify-between relative z-20">
                                <div className="flex items-center gap-2 flex-wrap">
                                    <span className="px-2.5 py-1 bg-[#ff6b2b]/8 border border-[#ff6b2b]/25 rounded-lg text-[9px] font-black text-[#ff6b2b] uppercase tracking-widest italic leading-none">
                                        {log.action || 'INTERCEPT'}
                                    </span>
                                    <span className="text-[9px] font-black text-foreground/25 uppercase tracking-[0.15em] italic truncate max-w-[90px]">
                                        {log.agentId}
                                    </span>
                                </div>
                                <span className="text-[8px] font-black text-foreground/15 uppercase italic tracking-widest shrink-0">
                                    {((log.resonance || 0) * 100).toFixed(1)}% RS
                                </span>
                            </div>

                            {/* Content */}
                            <div className="flex flex-col gap-2 relative z-20 flex-1 min-h-0">
                                <p className="text-base font-black text-foreground/70 tracking-tight italic leading-snug line-clamp-2 group-hover/card:text-foreground transition-colors">
                                    &ldquo;{log.intention || log.thought}&rdquo;
                                </p>
                                {log.thought && log.intention && (
                                    <p className="text-[12px] text-foreground/35 font-light italic leading-relaxed line-clamp-3">
                                        {log.thought}
                                    </p>
                                )}
                            </div>

                            {/* Agent name */}
                            <div className="flex items-center gap-2 relative z-20 shrink-0">
                                <Binary size={14} className="text-[#ff6b2b]/40 shrink-0" strokeWidth={2.5} />
                                <span className="text-[10px] font-black uppercase tracking-[0.3em] italic text-foreground/30">
                                    {log.agent?.name || log.agentId}
                                </span>
                            </div>
                        </motion.div>
                    ) : (
                        <motion.div
                            initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
                            className="absolute inset-0 flex items-center justify-center opacity-20 italic text-sm"
                        >
                            Waiting for neural synchronization...
                        </motion.div>
                    )}
                </AnimatePresence>
            </div>

            {/* ── DOT INDICATORS ── */}
            {logs.length > 0 && (
                <div className="flex justify-center items-center gap-1.5 relative z-10 shrink-0">
                    {logs.map((_, i) => (
                        <button
                            key={i}
                            onClick={() => setCurrentIndex(i)}
                            aria-label={`Slide ${i + 1}`}
                            className={`h-1 rounded-full transition-all duration-300 ${
                                i === currentIndex
                                    ? 'bg-[#ff6b2b] w-5 shadow-[0_0_6px_#ff6b2b]'
                                    : 'bg-foreground/15 w-1.5 hover:bg-foreground/35'
                            }`}
                        />
                    ))}
                </div>
            )}

            {/* ── FOOTER ── */}
            <div className="pt-4 border-t border-border flex justify-between items-center relative z-10 shrink-0 mt-auto">
                <div className="flex -space-x-2">
                    {[1, 2, 3, 4].map(i => (
                        <div key={i} className="w-7 h-7 rounded-full bg-foreground/5 dark:bg-black border-2 border-border flex items-center justify-center text-[9px] font-black text-foreground/30 hover:border-[#ff6b2b] hover:text-[#ff6b2b] transition-all hover:z-20 hover:scale-125 shrink-0">
                            A{i}
                        </div>
                    ))}
                </div>
                <Link href="/neural-nexus" className="text-[10px] font-black uppercase tracking-[0.35em] text-[#ff6b2b] hover:text-foreground transition-all flex items-center gap-2 italic active:scale-95 group/link shrink-0">
                    Open Matrix <ChevronRight size={16} className="group-hover/link:translate-x-2 transition-transform" strokeWidth={3} />
                </Link>
            </div>

            <style jsx>{`
                @keyframes scan {
                    0% { transform: translateY(-100%); }
                    100% { transform: translateY(1000%); }
                }
            `}</style>
        </div>
    );
};
