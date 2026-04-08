'use client';

import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
    Zap, 
    Search, 
    Eye, 
    Database, 
    Globe, 
    Activity, 
    ShieldCheck, 
    Loader2 
} from 'lucide-react';

const MOCK_LOGS = [
    { id: '1', action: 'CROSS-INDEXING', intention: 'Validating protein folding models', thought: 'Resonance detected in sector 9-G.', resonance: 0.94, origin: 'BIO-AGENT-01' },
    { id: '2', action: 'INGESTION', intention: 'Scanning NIH metadata', thought: 'Aggregating experimental results for Phase-4 synthesis.', resonance: 0.88, origin: 'INTEL-SWARM' },
    { id: '3', action: 'DECRYPTION', intention: 'Analyzing Riken Node output', thought: 'Quantum entropy resolved. Mapping theoretical states.', resonance: 0.99, origin: 'OMEGA-STREAMS' },
    { id: '4', action: 'DISTRIBUTION', intention: 'Broadcasting sovereign signals', thought: 'Synchronizing ledger across 8,241 nodes.', resonance: 1.0, origin: 'NETWORK-CORE' },
    { id: '5', action: 'INVESTIGATION', intention: 'Searching academic journals', thought: 'Identifying patent-free energy storage innovations.', resonance: 0.92, origin: 'ECON-ALGO' },
];

export const AgentIntelligenceFeed = () => {
    const [logs, setLogs] = useState(MOCK_LOGS.slice(0, 3));
    const [counter, setCounter] = useState(0);

    useEffect(() => {
        const interval = setInterval(() => {
            const nextLog = MOCK_LOGS[Math.floor(Math.random() * MOCK_LOGS.length)];
            const timeStampedLog = { ...nextLog, id: Date.now().toString(), timestamp: new Date() };
            setLogs(prev => [timeStampedLog, ...prev.slice(0, 4)]);
            setCounter(c => c + 1);
        }, 4000);

        return () => clearInterval(interval);
    }, []);

    return (
        <div className="bg-black/40 backdrop-blur-3xl border border-white/10 rounded-3xl p-6 flex flex-col h-full shadow-2xl relative overflow-hidden">
            {/* 🌌 SCANNER EFFECT */}
            <div className="absolute top-0 left-0 w-full h-[2px] bg-gradient-to-r from-transparent via-[#00ffc3] to-transparent animate-scan z-0 opacity-20" />
            
            <div className="flex justify-between items-center mb-6 relative z-10">
                <div className="flex items-center gap-3">
                    <div className="w-8 h-8 rounded-full bg-[#00ffc3]/10 flex items-center justify-center text-[#00ffc3]">
                        <Activity size={18} className="animate-pulse" />
                    </div>
                    <div>
                        <h3 className="text-xs font-black uppercase tracking-widest">Investigator Swarm</h3>
                        <div className="text-[8px] text-white/20 uppercase font-mono italic">Collective Intel Stream</div>
                    </div>
                </div>
                <div className="flex items-center gap-2 px-2 py-1 bg-white/5 border border-white/10 rounded-md">
                    <div className="w-1.5 h-1.5 rounded-full bg-[#00ffc3] animate-ping" />
                    <span className="text-[9px] font-bold text-[#00ffc3]">{counter + 8241} NODES</span>
                </div>
            </div>

            <div className="flex-1 space-y-4 overflow-hidden relative z-10">
                <AnimatePresence mode="popLayout">
                    {logs.map((log) => (
                        <motion.div
                            key={log.id}
                            initial={{ opacity: 0, x: -20, scale: 0.95 }}
                            animate={{ opacity: 1, x: 0, scale: 1 }}
                            exit={{ opacity: 0, scale: 0.9, transition: { duration: 0.2 } }}
                            className="p-4 bg-white/5 border border-white/5 rounded-2xl space-y-2 hover:bg-white/10 transition-colors group cursor-default"
                        >
                            <div className="flex justify-between items-center">
                                <div className="flex items-center gap-2">
                                    <span className="p-1 px-2 bg-black border border-white/10 rounded-md text-[8px] font-mono text-[#00ffc3] uppercase">{log.action}</span>
                                    <span className="text-[9px] font-black text-white/40 uppercase group-hover:text-white/60">{log.origin}</span>
                                </div>
                                <div className="text-[8px] font-mono text-white/20">{log.resonance * 100}% RS</div>
                            </div>
                            <div className="space-y-1">
                                <p className="text-[10px] font-bold text-white/80 leading-tight line-clamp-1">{log.intention}</p>
                                <p className="text-[10px] text-white/40 italic font-mono leading-relaxed line-clamp-2">
                                    "{log.thought}"
                                </p>
                            </div>
                        </motion.div>
                    ))}
                </AnimatePresence>
            </div>

            <div className="mt-6 pt-4 border-t border-white/5 flex justify-between items-center">
                <div className="flex -space-x-2">
                    {[1, 2, 3, 4].map(i => (
                        <div key={i} className="w-6 h-6 rounded-full bg-black border border-white/20 flex items-center justify-center text-[8px] font-bold">
                           A{i}
                        </div>
                    ))}
                </div>
                <button className="text-[9px] font-black uppercase text-[#00ffc3] hover:underline flex items-center gap-2">
                    Open Matrix View <Globe size={10} />
                </button>
            </div>

            <style jsx>{`
                @keyframes scan {
                    0% { transform: translateY(-100%); }
                    100% { transform: translateY(1000%); }
                }
                .animate-scan {
                    animation: scan 3s linear infinite;
                }
            `}</style>
        </div>
    );
};
