"use client";

import { useEffect, useState } from "react";
import { Shield, Database, ChevronRight } from "lucide-react";

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

    if (loading) return <div className="text-white/40 text-xs animate-pulse">Accessing Abyssal Vault...</div>;
    if (shards.length === 0) return null;

    return (
        <div className="mt-12 w-full max-w-4xl px-6">
            <div className="flex items-center gap-2 mb-6 border-b border-white/10 pb-2">
                <Shield className="w-5 h-5 text-[#00ffcc]" />
                <h2 className="text-xl font-bold tracking-tight text-white uppercase">Sovereign Knowledge Vault</h2>
                <span className="text-[10px] text-white/40 ml-auto flex items-center gap-1">
                    <Database className="w-3 h-3" /> VERIFIED SHARDS
                </span>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {shards.map((shard, idx) => (
                    <div
                        key={idx}
                        className="group relative flex flex-col p-4 bg-white/5 border border-white/10 rounded-xl hover:border-[#00ffcc]/50 transition-all cursor-pointer overflow-hidden"
                    >
                        {/* Background Accent */}
                        <div className="absolute top-0 right-0 w-32 h-32 bg-[#00ffcc]/5 rounded-full blur-3xl -mr-16 -mt-16 group-hover:bg-[#00ffcc]/10 transition-colors" />

                        <div className="relative z-10 flex items-start justify-between">
                            <div className="flex flex-col gap-1 overflow-hidden">
                                <h3 className="text-sm font-semibold text-white/90 truncate group-hover:text-[#00ffcc] transition-colors">
                                    {shard.title}
                                </h3>
                                <span className="text-[10px] text-white/40 font-mono truncate uppercase">
                                    {new URL(shard.url).hostname}
                                </span>
                            </div>
                            <ChevronRight className="w-4 h-4 text-white/20 group-hover:text-[#00ffcc] transition-colors" />
                        </div>

                        <div className="mt-3 flex items-center gap-2">
                            <div className="h-1 flex-1 bg-white/5 rounded-full overflow-hidden">
                                <div className="h-full bg-[#00ffcc]/30 w-full" />
                            </div>
                            <span className="text-[9px] font-mono text-white/30 whitespace-nowrap">
                                ARCHIVED: {new Date(shard.cached_at).toLocaleDateString()}
                            </span>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
}
