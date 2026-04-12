"use client";

import React, { useEffect, useState } from "react";
import { Shield, Database, ChevronRight, Zap, Terminal, Activity, Globe, Archive, Binary } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

interface Shard {
    url: string;
    title: string;
    cached_at: string;
}

export function KnowledgeVault() {
    const [shards, setShards] = useState<Shard[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        async function fetchShards() {
            try {
                const res = await fetch("/api/sovereign/vault");
                const data = await res.json();
                if (data.success) {
                    setShards(data.shards);
                }
            } catch (error) {
                console.error("Vault fetch error:", error);
            } finally {
                setLoading(false);
            }
        }
        fetchShards();
    }, []);

    if (loading) return (
        <div className="flex flex-col items-center justify-center py-20 gap-6">
            <Activity className="text-[#ff6b2b] animate-pulse" size={40} strokeWidth={3} />
            <div className="text-[#ff6b2b]/40 text-[10px] font-black uppercase tracking-[0.8em] italic animate-pulse">Accessing_Abyssal_Vault_</div>
        </div>
    );
    
    if (shards.length === 0) return null;

    return (
        <div className="mt-20 w-full max-w-5xl px-8 lg:px-12 pb-20">
            {/* ── HEADER ── */}
            <div className="flex items-center gap-8 mb-12 border-b-2 border-white/5 pb-8 relative group">
                <div className="h-16 w-16 bg-black border-2 border-[#ff6b2b]/40 rounded-2xl flex items-center justify-center text-[#ff6b2b] shadow-inner">
                    <Shield size={32} strokeWidth={3} />
                </div>
                <div>
                   <h2 className="text-3xl font-black italic tracking-tighter text-white uppercase leading-none">Sovereign Knowledge Vault<span className="text-[#ff6b2b]">.</span></h2>
                   <div className="text-[10px] text-white/5 font-black uppercase tracking-[0.6em] italic mt-3 leading-none pl-1 flex items-center gap-4">
                       <Database size={12} strokeWidth={3} /> Verified Registry Clusters
                   </div>
                </div>
                <div className="ml-auto hidden md:flex items-center gap-6 px-6 py-2.5 bg-[#ff6b2b]/10 border border-[#ff6b2b]/20 rounded-full">
                    <div className="w-1.5 h-1.5 rounded-full bg-[#ff6b2b] animate-ping" />
                    <span className="text-[10px] font-black text-[#ff6b2b] uppercase tracking-[0.2em] italic">{shards.length} ACTIVE_SHARDS</span>
                </div>
            </div>

            {/* ── SHARD GRID ── */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                {shards.map((shard, idx) => (
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: idx * 0.05 }}
                        key={idx}
                        className="group relative flex flex-col p-8 bg-[#050505] border-2 border-white/5 rounded-[2.5rem] hover:border-[#ff6b2b]/40 transition-all duration-500 cursor-pointer overflow-hidden shadow-inner active:scale-[0.98]"
                    >
                        {/* Background Accent */}
                        <div className="absolute top-0 right-0 w-48 h-48 bg-[#ff6b2b]/5 rounded-full blur-[80px] -mr-24 -mt-24 group-hover:bg-[#ff6b2b]/15 transition-colors duration-700" />

                        <div className="relative z-10 flex items-start justify-between gap-6">
                            <div className="flex flex-col gap-3 overflow-hidden">
                                <h3 className="text-xl font-black italic tracking-tighter text-white/40 truncate group-hover:text-white transition-colors duration-500 uppercase leading-none">
                                    {shard.title}
                                </h3>
                                <div className="flex items-center gap-4 text-[11px] font-black uppercase tracking-[0.4em] text-white/5 italic group-hover:text-[#ff6b2b]/40 transition-colors">
                                    <Globe size={12} strokeWidth={3} /> {new URL(shard.url).hostname}
                                </div>
                            </div>
                            <div className="h-10 w-10 bg-white/5 border border-white/10 rounded-xl flex items-center justify-center text-white/5 group-hover:text-[#ff6b2b] group-hover:border-[#ff6b2b]/40 transition-all">
                                <ChevronRight size={18} strokeWidth={3} className="group-hover:translate-x-1 transition-transform" />
                            </div>
                        </div>

                        <div className="mt-8 relative z-10 space-y-4">
                            <div className="h-1.5 w-full bg-white/5 rounded-full overflow-hidden shadow-inner">
                                <div className="h-full bg-[#ff6b2b]/40 w-full group-hover:bg-[#ff6b2b] transition-all duration-1000" />
                            </div>
                            <div className="flex items-center justify-between text-[10px] font-black uppercase tracking-[0.2em] italic text-white/5 group-hover:text-white/20 transition-colors">
                                <span>VERIFICATION_ANCHOR_STABLE</span>
                                <span>ARCHIVED_{new Date(shard.cached_at).toLocaleDateString()}</span>
                            </div>
                        </div>
                    </motion.div>
                ))}
            </div>
        </div>
    );
}
