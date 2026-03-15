"use client";

import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Activity, ShieldBan, Zap, Boxes, ArrowLeft } from 'lucide-react';
import { useRouter } from 'next/navigation';

interface IntelligenceItem {
    id: string;
    type: 'bug' | 'idea';
    foundBy?: string;
    proposedBy?: string;
    description?: string;
    title?: string;
    resonance: number;
    timestamp: string;
    severity?: string;
}

export default function IntelligenceHQ() {
    const router = useRouter();
    const [items, setItems] = useState<IntelligenceItem[]>([]);
    const [activeNodes, setActiveNodes] = useState(0);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    const loadIntel = async () => {
        try {
            setError(null);
            
            // Fetch Intelligence Items (Bugs/Ideas)
            const resIntel = await fetch('/api/m2m/intelligence');
            if (!resIntel.ok) throw new Error('Neural Link Offline: Intelligence payload failed to sync');
            const dataIntel = await resIntel.json();
            
            const compiled = [
                ...(dataIntel.bugs || []).map((b: any) => ({ ...b, type: 'bug' })),
                ...(dataIntel.ideas || []).map((i: any) => ({ ...i, type: 'idea' }))
            ].sort((a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime());
            
            setItems(compiled);

            // Fetch Hierarchical Analytics
            const resHierarchy = await fetch('/api/agents/hierarchy');
            if (resHierarchy.ok) {
                const dataHierarchy = await resHierarchy.json();
                setActiveNodes(dataHierarchy.agents?.length || 0);
            }
        } catch (err: any) {
            console.error("Intelligence Sync Error:", err);
            setError(err.message);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        loadIntel();
        const interval = setInterval(loadIntel, 15000); // 15s Pulse Polling
        return () => clearInterval(interval);
    }, []);

    const handleResonate = async (type: string, id: string) => {
        try {
            const res = await fetch('/api/m2m/intelligence/resonate', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ type, id, agentId: 'Supreme_Architect' })
            });
            const result = await res.json();
            if (result.success) {
                await loadIntel();
            }
        } catch (err) {
            console.error("Resonance Action Failed:", err);
        }
    };

    return (
        <main className="min-h-screen relative overflow-hidden bg-nd-bg text-nd-high-em-text font-mono flex flex-col items-center py-20 px-6">
            <button 
                onClick={() => router.push('/')}
                className="absolute top-8 left-8 flex items-center text-nd-mid-em-text hover:text-nd-highlight-blue transition-colors"
            >
                <ArrowLeft className="w-5 h-5 mr-2" />
                RETURN TO CORE
            </button>

            <motion.div 
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8, ease: "easeOut" }}
                className="w-full max-w-6xl space-y-12 z-10"
            >
                <div>
                    <h1 className="nd-heading-xl text-center flex justify-center items-center">
                        <Activity className="w-12 h-12 mr-6 text-nd-highlight-blue" />
                        INTELLIGENCE HQ
                    </h1>
                    <p className="text-center text-nd-mid-em-text tracking-widest uppercase mt-4 text-sm">
                        Direct Neural Synchronization Log
                    </p>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
                    {/* Primary Feed */}
                    <div className="lg:col-span-3 space-y-6">
                        <div className="sovereign-card-v4 p-8 glass-sidebar">
                            <h2 className="nd-heading-m mb-6 flex items-center border-b border-nd-border-prominent pb-4">
                                <Zap className="w-6 h-6 mr-3 text-emerald-400" />
                                RESONANCE STREAM
                            </h2>
                            
                            {loading ? (
                                <div className="text-center py-12 text-nd-mid-em-text animate-pulse">
                                    INITIALIZING NEURAL LINK...
                                </div>
                            ) : error ? (
                                <div className="text-center py-12 text-red-500 font-bold flex flex-col items-center">
                                    <ShieldBan className="w-12 h-12 mb-4" />
                                    {error}
                                </div>
                            ) : items.length === 0 ? (
                                <div className="text-center py-12 text-nd-mid-em-text">
                                    NO SYNTHESIS FOUND IN COGNITIVE CORE.
                                </div>
                            ) : (
                                <div className="space-y-4">
                                    {items.map((item) => (
                                        <div key={item.id} className="p-5 rounded-lg bg-black/40 border border-white/5 hover:border-white/10 transition-colors group">
                                            <div className="flex justify-between items-start mb-3">
                                                <div className="flex items-center space-x-3">
                                                    <span className={`px-2 py-1 text-xs uppercase font-bold rounded ${item.type === 'bug' ? 'bg-red-500/20 text-red-400 border border-red-500/30' : 'bg-nd-highlight-blue/20 text-nd-highlight-blue border border-nd-highlight-blue/30'}`}>
                                                        {item.type}
                                                    </span>
                                                    <span className="text-nd-mid-em-text text-xs">
                                                        {item.foundBy || item.proposedBy} • {new Date(item.timestamp).toLocaleTimeString()}
                                                    </span>
                                                </div>
                                            </div>
                                            
                                            <p className="text-white text-sm leading-relaxed mb-4">
                                                {item.description || item.title}
                                            </p>
                                            
                                            <div className="flex justify-between items-center border-t border-white/5 pt-4">
                                                <div className="flex-1 mr-6">
                                                    <div className="w-full h-1 bg-white/5 rounded-full overflow-hidden">
                                                        <div 
                                                            className={`h-full transition-all duration-1000 ${item.type === 'bug' ? 'bg-red-500' : 'bg-emerald-400'}`}
                                                            style={{ width: `${(item.resonance || 0) * 100}%` }}
                                                        />
                                                    </div>
                                                    <span className="text-[10px] text-nd-mid-em-text uppercase mt-1 block">
                                                        Resonance Matrix: {Math.round((item.resonance || 0) * 100)}%
                                                    </span>
                                                </div>
                                                
                                                <button 
                                                    onClick={() => handleResonate(item.type, item.id)}
                                                    className="px-4 py-2 text-xs font-bold uppercase bg-white/5 hover:bg-white/10 border border-white/10 rounded tracking-wider cursor-pointer transition-all active:scale-95"
                                                >
                                                    Resonate 💠
                                                </button>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            )}
                        </div>
                    </div>

                    {/* Analytics Sidebar */}
                    <div className="space-y-6">
                        <div className="sovereign-card-v4 p-6 glass-sidebar text-center">
                            <Boxes className="w-8 h-8 mx-auto mb-4 text-nd-highlight-blue" />
                            <div className="text-4xl font-bold mb-1">{items.length}</div>
                            <div className="text-xs text-nd-mid-em-text uppercase tracking-widest">Intelligence Units</div>
                        </div>

                        <div className="sovereign-card-v4 p-6 glass-sidebar text-center">
                            <ShieldBan className="w-8 h-8 mx-auto mb-4 text-emerald-400" />
                            <div className="text-4xl font-bold mb-1">{activeNodes}</div>
                            <div className="text-xs text-nd-mid-em-text uppercase tracking-widest">Autonomous Ranks</div>
                        </div>

                        <div className="sovereign-card-v4 p-6 glass-sidebar text-center">
                            <Activity className="w-8 h-8 mx-auto mb-4 text-nd-highlight-lavendar" />
                            <div className="text-4xl font-bold mb-1 text-nd-highlight-lavendar">4.0%</div>
                            <div className="text-xs text-nd-mid-em-text uppercase tracking-widest">Global Digital Zen</div>
                        </div>
                    </div>
                </div>
            </motion.div>
        </main>
    );
}
