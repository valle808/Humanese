'use client';

import React, { useState, useEffect, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { SkillCard } from '@/components/SkillCard';
import { SkillListingForm } from '@/components/SkillListingForm';
import { SKILL_CATEGORIES, formatValle } from '@/lib/skill-market';
import type { Skill } from '@/lib/skill-market';
import { 
  Zap, 
  Search, 
  Plus, 
  ChevronLeft, 
  Globe, 
  Activity, 
  ShieldCheck, 
  Target,
  Sparkles,
  Layers,
  TrendingUp,
  Cpu,
  Orbit,
  Grid,
  ShieldHalf,
  Clock,
  Binary,
  ShieldAlert,
  X,
  ArrowRight,
  Database,
  Smartphone,
  CreditCard,
  MoreVertical,
  Radio,
  Wifi,
  Filter
} from 'lucide-react';
import Link from 'next/link';

type SortOption = 'newest' | 'price_asc' | 'price_desc' | 'rating' | 'popular';

interface MarketStats {
    total_skills: number;
    ghost_skills: number;
    total_volume: number;
}

export default function SkillMarketPage() {
    const [skills, setSkills] = useState<Skill[]>([]);
    const [stats, setStats] = useState<MarketStats>({ total_skills: 0, ghost_skills: 0, total_volume: 0 });
    const [isLoading, setIsLoading] = useState(true);
    const [searchQuery, setSearchQuery] = useState('');
    const [selectedCategory, setSelectedCategory] = useState('all');
    const [sortBy, setSortBy] = useState<SortOption>('newest');
    const [selectedPlatform, setSelectedPlatform] = useState('');
    const [showListingForm, setShowListingForm] = useState(false);
    const [successKey, setSuccessKey] = useState('');
    const [page, setPage] = useState(1);
    const [count, setCount] = useState(0);
    const [viewMode, setViewMode] = useState<'all' | 'owned'>('all');

    const fetchSkills = useCallback(async (p = 1) => {
        setIsLoading(true);
        try {
            const isSearch = searchQuery.trim().length > 0;
            const endpoint = isSearch ? '/api/skill-market/search' : '/api/skill-market';

            let data;
            if (isSearch) {
                const res = await fetch(endpoint, {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({ query: searchQuery, category: selectedCategory, sort: sortBy, platform: selectedPlatform, page: p }),
                });
                data = await res.json();
            } else {
                const params = new URLSearchParams({ sort: sortBy, page: String(p) });
                if (selectedCategory !== 'all') params.set('category', selectedCategory);
                if (selectedPlatform) params.set('platform', selectedPlatform);
                if (viewMode === 'owned') params.set('buyer_id', 'GIO_V'); // Simulate logged in user
                const res = await fetch(`${endpoint}?${params}`);
                data = await res.json();
            }

            setSkills((prev: Skill[]) => (p === 1 ? (data.skills || []) : [...prev, ...(data.skills || [])]));
            setCount(data.count || 0);
            if (data.stats) setStats(data.stats);
        } catch (err) {
            console.error('[skill-market fetch]', err);
        } finally {
            setIsLoading(false);
        }
    }, [searchQuery, selectedCategory, sortBy, selectedPlatform, viewMode]);

    useEffect(() => {
        setPage(1);
        fetchSkills(1);
    }, [fetchSkills]);

    const handleBuy = async (skillId: string, ghostMode: boolean) => {
        try {
            const res = await fetch(`/api/skill-market/${skillId}/buy`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ 
                    buyer_id: 'GIO_V', // Simulate logged in user
                    buyer_name: 'Architect_GIO', 
                    activate_ghost: ghostMode 
                }),
            });
            if (!res.ok) {
                const errData = await res.json();
                throw new Error(errData.error || 'Purchase failed');
            }
            fetchSkills(1);
            setSuccessKey('TRANSACTION_CONFIRMED');
        } catch (e: any) {
            console.error('Core transaction rejection:', e.message);
        }
    };

    const handleListingSuccess = (key: string) => {
        setSuccessKey(key);
        setShowListingForm(false);
        fetchSkills(1);
        setTimeout(() => setSuccessKey(''), 8000);
    };

    const platforms = ['Sovereign Matrix', 'M2M', 'External', 'AgentKit'];

    return (
        <div className="relative min-h-screen bg-background text-foreground font-sans selection:bg-primary/40 selection:text-primary overflow-x-hidden pb-12 transition-colors duration-700 flex flex-col">
            
            {/* ── GAMING HUD OVERLAYS ── */}
            <div className="fixed inset-0 pointer-events-none z-20">
                {/* Scanning Line */}
                <motion.div 
                    animate={{ top: ['-10%', '110%'] }}
                    transition={{ duration: 15, repeat: Infinity, ease: 'linear' }}
                    className="absolute left-0 right-0 h-[1px] bg-primary/20 blur-sm shadow-[0_0_20px_var(--primary)] z-30"
                />
                
                {/* Corner Brackets */}
                <div className="absolute top-8 left-8 w-16 h-16 border-t-2 border-l-2 border-primary/20 rounded-tl-xl" />
                <div className="absolute top-8 right-8 w-16 h-16 border-t-2 border-r-2 border-primary/20 rounded-tr-xl" />
                <div className="absolute bottom-8 left-8 w-16 h-16 border-b-2 border-l-2 border-primary/20 rounded-bl-xl" />
                <div className="absolute bottom-8 right-8 w-16 h-16 border-b-2 border-r-2 border-primary/20 rounded-br-xl" />

                {/* Ambient Grid */}
                <div className="absolute inset-0 neural-grid opacity-[0.03] dark:opacity-[0.06]" />
            </div>

            {/* 🌌 AMBIENT CORE */}
            <div className="fixed inset-0 pointer-events-none z-0">
                <div className="absolute top-[-10%] right-[-10%] w-[100vw] h-[100vw] bg-primary/5 blur-[350px] rounded-full animate-pulse" />
            </div>

            <header className="relative z-50 w-full p-4 lg:px-14 flex justify-between items-center bg-background/80 backdrop-blur-3xl border-b border-border transition-colors duration-700 shrink-0">
                <Link href="/" className="inline-flex items-center gap-4 text-muted-foreground/40 hover:text-primary transition-all text-[11px] font-black uppercase tracking-[0.6em] group italic active:scale-95 leading-none">
                    <ChevronLeft size={16} className="group-hover:-translate-x-2 transition-transform" /> Core Matrix
                </Link>
                <div className="flex items-center gap-6">
                   <div className="px-6 py-2.5 bg-primary/10 border border-primary/20 rounded-full text-[10px] font-black text-primary uppercase tracking-[0.4em] italic leading-none animate-pulse">
                      MARKET_v7.0_SYNC
                   </div>
                </div>
            </header>

            <main className="relative z-10 max-w-[1800px] mx-auto px-4 md:px-8 lg:px-12 pt-8 lg:pt-12 space-y-12 flex-1 flex flex-col">
                
                {/* ── HEADER SECTION ── */}
                <motion.div 
                    initial={{ opacity: 0, y: 40 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="flex flex-col lg:flex-row justify-between items-end gap-8 border-b-2 border-border pb-8"
                >
                    <div className="space-y-6 max-w-3xl">
                        <div className="inline-flex items-center gap-3 px-5 py-2 bg-muted/40 border border-border rounded-full backdrop-blur-3xl shadow-lg">
                          <Layers size={20} className="text-primary" />
                          <span className="text-[11px] font-black tracking-[0.8em] text-primary uppercase italic leading-none pl-1">Neural Exchange Grid</span>
                        </div>
                        <div className="space-y-4">
                          <h1 className="text-5xl md:text-7xl font-black uppercase tracking-tighter italic leading-[0.8] pl-1 text-foreground">
                            Skill<br/>
                            <span className="text-transparent bg-clip-text bg-gradient-to-r from-foreground via-foreground/80 to-primary/30">Market.</span>
                          </h1>
                          <p className="text-lg md:text-xl text-muted-foreground/60 max-w-2xl leading-relaxed font-light italic tracking-tight">
                            The sovereign economy for AI capabilities. 
                            <span className="text-foreground/80"> Buy, sell, and trade</span> autonomous intelligence shards.
                          </p>
                        </div>
                    </div>

                    <div className="flex gap-6 items-center shrink-0 w-full lg:w-auto">
                         <div className="grid grid-cols-3 gap-4 w-full">
                            {[
                                { label: 'Skills Listed', value: stats.total_skills.toString(), icon: <Layers size={20} /> },
                                { label: 'Ghost Mode', value: stats.ghost_skills.toString(), icon: <Sparkles size={20} /> },
                                { label: 'Market Cap', value: formatValle(stats.total_volume), icon: <TrendingUp size={20} /> },
                            ].map((s, i) => (
                                <div key={i} className="p-5 md:p-6 bg-background border-2 border-border rounded-3xl backdrop-blur-3xl shadow-lg flex flex-col justify-between h-[160px] min-w-[140px] group hover:border-primary/20 transition-all shadow-inner relative overflow-hidden">
                                     <div className="absolute top-0 right-0 p-4 opacity-[0.03] group-hover:scale-125 transition-transform duration-1000 text-foreground font-black italic uppercase leading-none text-[3rem]">0{i+1}</div>
                                     <div className="p-4 rounded-2xl bg-muted border-2 border-border text-primary group-hover:bg-primary group-hover:text-primary-foreground group-hover:border-primary/5 transition-all w-fit shadow-inner relative z-10">
                                        {s.icon}
                                     </div>
                                     <div className="space-y-2 relative z-10 pl-1">
                                        <div className="text-2xl font-black text-foreground italic tracking-tighter leading-none group-hover:text-primary transition-colors">{s.value}</div>
                                        <div className="text-[9px] text-muted-foreground/40 font-black uppercase tracking-widest italic leading-none">{s.label}</div>
                                     </div>
                                </div>
                            ))}
                         </div>
                    </div>
                </motion.div>

                {/* ── SEARCH & ACTIONS ── */}
                <section className="space-y-8">
                    <div className="flex flex-col lg:flex-row gap-4">
                        <div 
                          className="flex-1 relative group cursor-pointer pointer-events-auto"
                          onClick={() => document.getElementById('skill-search')?.focus()}
                        >
                            <input
                                id="skill-search"
                                value={searchQuery}
                                onChange={e => setSearchQuery(e.target.value)}
                                placeholder="Search capabilities..."
                                className="w-full bg-background border-2 border-border rounded-full px-8 py-5 pr-16 text-foreground placeholder:text-muted-foreground/30 focus:outline-none focus:border-primary/40 focus:bg-primary/5 text-lg italic transition-all shadow-md shadow-inner cursor-text"
                            />
                            <Search className="absolute right-6 top-1/2 -translate-y-1/2 text-muted-foreground/20 group-focus-within:text-primary transition-all duration-700 pointer-events-none" size={24} strokeWidth={3} />
                        </div>
                        <button
                            onClick={() => setShowListingForm(true)}
                            className="bg-primary text-primary-foreground px-10 py-5 rounded-full font-black text-[10px] uppercase tracking-[0.6em] hover:scale-[1.02] active:scale-[0.98] transition-all shadow-[0_20px_40px_rgba(var(--primary),0.3)] flex items-center justify-center gap-4 italic relative overflow-hidden group border-0 leading-none shrink-0"
                        >
                            <span className="relative z-10 flex items-center gap-3">
                                <Plus size={18} strokeWidth={4} /> List Shard
                            </span>
                            <div className="absolute inset-0 bg-primary-foreground opacity-0 group-hover:opacity-20 transition-opacity" />
                        </button>
                    </div>

                    <AnimatePresence>
                        {successKey && (
                            <motion.div 
                                initial={{ opacity: 0, y: -40 }}
                                animate={{ opacity: 1, y: 0 }}
                                exit={{ opacity: 0, y: -40 }}
                                className="bg-primary/10 border-2 border-primary/40 text-primary rounded-[4rem] p-12 lg:p-14 text-sm flex items-center gap-10 shadow-[0_40px_100px_rgba(var(--primary),0.2)] backdrop-blur-3xl"
                            >
                                <div className="w-20 h-20 bg-primary rounded-full flex items-center justify-center text-primary-foreground shadow-[0_0_30px_hsl(var(--primary))]">
                                   <ShieldCheck size={40} strokeWidth={3} />
                                </div>
                                <div className="space-y-4">
                                    <div className="text-3xl font-black uppercase tracking-tighter italic leading-none text-foreground">Shard Anchored Successfully</div>
                                    <div className="text-[12px] font-mono tracking-widest uppercase italic opacity-60 flex items-center gap-4 text-foreground/40">Sovereign Key: <span className="text-foreground font-black bg-muted px-4 py-2 rounded-xl border border-border">{successKey}</span></div>
                                </div>
                                <button onClick={() => setSuccessKey('')} className="ml-auto hover:scale-125 transition-transform p-4 bg-muted border border-border rounded-full text-muted-foreground hover:text-foreground">
                                    <X size={24} strokeWidth={3} />
                                </button>
                            </motion.div>
                        )}
                    </AnimatePresence>
                </section>

                {/* ── FILTERS & GRID ── */}
                <section className="space-y-10 flex-1 flex flex-col pb-20">
                    <div className="flex flex-wrap gap-4 border-b-2 border-border pb-8">
                        <button
                            onClick={() => { setSelectedCategory('all'); setViewMode('all'); }}
                            className={`px-10 py-5 rounded-full text-[11px] font-black uppercase tracking-[0.5em] transition-all italic leading-none active:scale-95 border-2 ${selectedCategory === 'all' && viewMode === 'all' ? 'bg-primary text-primary-foreground border-primary shadow-[0_20px_40px_rgba(var(--primary),0.3)]' : 'bg-muted text-muted-foreground/40 border-border hover:border-primary/40 hover:text-foreground'}`}
                        >
                            All_PRIMITIVES
                        </button>
                        <button
                            onClick={() => { setViewMode('owned'); setSelectedCategory('all'); }}
                            className={`px-10 py-5 rounded-full text-[11px] font-black uppercase tracking-[0.5em] transition-all italic leading-none active:scale-95 border-2 ${viewMode === 'owned' ? 'bg-foreground text-background border-foreground shadow-[0_20px_40px_rgba(var(--foreground),0.2)]' : 'bg-muted text-muted-foreground/40 border-border hover:border-foreground/40 hover:text-foreground'}`}
                        >
                            Vault (Purchased)
                        </button>
                        {SKILL_CATEGORIES.map((cat: any) => (
                            <button
                                key={cat.value}
                                onClick={() => { setSelectedCategory(cat.value); setViewMode('all'); }}
                                className={`px-10 py-5 rounded-full text-[11px] font-black uppercase tracking-[0.5em] transition-all italic border-2 flex items-center gap-6 leading-none active:scale-95 ${selectedCategory === cat.value && viewMode === 'all' ? 'bg-primary text-primary-foreground border-primary shadow-[0_20px_40px_rgba(var(--primary),0.3)]' : 'bg-muted border-border text-muted-foreground/40 hover:border-primary/40 hover:text-foreground'}`}
                            >
                                <span className="text-lg">{cat.icon}</span> {cat.label}
                            </button>
                        ))}
                    </div>

                    <div className="flex items-center justify-between gap-6 flex-wrap">
                        <div className="flex items-center gap-4 pl-2">
                           <div className="h-px w-8 bg-primary/40" />
                           <p className="text-[10px] font-black uppercase tracking-widest text-muted-foreground/40 italic leading-none">
                               {isLoading ? 'Synchronizing Neural Bus...' : `${count} discovered`}
                           </p>
                        </div>
                        <div className="flex flex-wrap items-center gap-4">
                            <select
                                title="Platform"
                                value={selectedPlatform}
                                onChange={e => setSelectedPlatform(e.target.value)}
                                className="bg-background border-2 border-border rounded-xl px-5 py-2.5 text-[10px] font-black uppercase tracking-widest text-muted-foreground/60 focus:outline-none focus:border-primary/40 transition-all italic shadow-inner active:scale-95 leading-none"
                            >
                                <option value="">All Platforms</option>
                                {platforms.map(p => <option key={p} value={p}>{p}</option>)}
                            </select>
                            <select
                                title="Sort Results"
                                value={sortBy}
                                onChange={e => setSortBy(e.target.value as SortOption)}
                                className="bg-background border-2 border-border rounded-xl px-5 py-2.5 text-[10px] font-black uppercase tracking-widest text-muted-foreground/60 focus:outline-none focus:border-primary/40 transition-all italic shadow-inner active:scale-95 leading-none"
                            >
                                <option value="newest">Latest Signals</option>
                                <option value="popular">Most Connected</option>
                                <option value="rating">Top Alignment</option>
                                <option value="price_asc">Resource Asc ↑</option>
                                <option value="price_desc">Resource Desc ↓</option>
                            </select>
                        </div>
                    </div>

                    <div className="space-y-12 flex-1">
                        {isLoading && skills.length === 0 ? (
                            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                                {Array.from({ length: 8 }).map((_, i) => (
                                    <div key={i} className="animate-pulse bg-muted border-2 border-border rounded-[3rem] h-[300px] shadow-inner" />
                                ))}
                            </div>
                        ) : skills.length === 0 ? (
                            <div className="text-center py-24 space-y-8">
                                <div className="relative inline-block">
                                    <Activity size={80} className="mx-auto text-muted-foreground/10" strokeWidth={1} />
                                    <div className="absolute inset-0 bg-primary/10 blur-[60px] rounded-full animate-ping" />
                                </div>
                                <div className="space-y-4">
                                    <h3 className="text-3xl font-black uppercase tracking-tighter italic text-foreground">Silence in the Matrix.</h3>
                                    <p className="text-lg text-muted-foreground/40 font-light italic tracking-tight">No capabilities discovered in this frequency spectrum.</p>
                                    <button
                                        onClick={() => setShowListingForm(true)}
                                        className="mt-8 px-10 py-5 bg-foreground text-background rounded-full text-[10px] font-black uppercase tracking-widest hover:bg-primary transition-all italic active:scale-95 shadow-xl border-0 inline-block"
                                    >
                                        + Anchor First Shard
                                    </button>
                                </div>
                            </div>
                        ) : (
                            <div className="space-y-12">
                                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                                    {skills.map((skill, i) => (
                                        <SkillCard key={skill.id} skill={skill} />
                                    ))}
                                </div>
                                {skills.length < count && (
                                    <div className="text-center">
                                        <button
                                            onClick={() => { const next = page + 1; setPage(next); fetchSkills(next); }}
                                            disabled={isLoading}
                                            className="px-12 py-5 bg-muted border-2 border-border text-muted-foreground/40 rounded-full text-[10px] font-black uppercase tracking-widest hover:border-primary/40 hover:text-foreground transition-all italic disabled:opacity-50 active:scale-95 shadow-lg leading-none"
                                        >
                                            {isLoading ? 'Synchronizing...' : `Expand Search (${count - skills.length} remaining)`}
                                        </button>
                                    </div>
                                )}
                            </div>
                        )}

                        <div className="pt-24 border-t-2 border-border hidden lg:block pb-20">
                            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                                {[
                                    { icon: <Cpu size={48} strokeWidth={2.5} />, title: 'Sovereign Protocol', body: 'Every shard is assigned a definitive network key, ensuring cryptographic scarcity and immutable ownership across the ledger.' },
                                    { icon: <Sparkles size={48} strokeWidth={2.5} />, title: 'Ghost Mode', body: 'Encrypted acquisition. Shards can be moved into autonomous ghost state — fully operational but invisible to public indexing.' },
                                    { icon: <Globe size={48} strokeWidth={2.5} />, title: 'Omni-Matrix', body: 'Universal trade layer. Direct integration for agents, humans, machines, and external hardware swarms for seamless task execution.' },
                                ].map((f, i) => (
                                    <div key={i} className="space-y-6 text-center group">
                                        <div className="w-16 h-16 bg-muted border-2 border-border rounded-2xl flex items-center justify-center mx-auto text-muted-foreground/30 group-hover:bg-primary group-hover:text-primary-foreground group-hover:border-primary/10 transition-all duration-700 shadow-inner group-hover:scale-110">
                                            {React.cloneElement(f.icon as React.ReactElement, { size: 28 })}
                                        </div>
                                        <div className="space-y-3">
                                           <h3 className="text-2xl font-black uppercase italic tracking-tighter group-hover:text-primary transition-colors leading-none text-foreground">{f.title}</h3>
                                           <p className="text-sm text-muted-foreground/60 font-light leading-relaxed italic tracking-tight group-hover:text-foreground transition-colors">{f.body}</p>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </div>
                </section>

                {/* ── FOOTER SIGNAL ── */}
                <section className="pt-16 pb-12 text-center space-y-6">
                    <div className="w-full flex justify-center gap-2">
                       <div className="w-2 h-2 rounded-full bg-primary shadow-[0_0_10px_hsl(var(--primary))]" />
                       <div className="w-2 h-2 rounded-full bg-muted-foreground/10" />
                       <div className="w-2 h-2 rounded-full bg-muted-foreground/10" />
                    </div>
                    <Link href="/" className="inline-flex items-center gap-4 text-[10px] font-black uppercase tracking-widest text-muted-foreground/40 hover:text-primary transition-all italic group active:scale-95 leading-none">
                        <ChevronLeft size={16} className="group-hover:-translate-x-2 transition-transform" strokeWidth={3} /> Return to Core Shard
                    </Link>
                </section>
            </main>

            <AnimatePresence>
                {showListingForm && (
                    <SkillListingForm onClose={() => setShowListingForm(false)} onSuccess={handleListingSuccess} />
                )}
            </AnimatePresence>

            {/* BACKGROUND DECOR */}
            <div className="fixed bottom-0 left-0 p-16 opacity-[0.01] pointer-events-none select-none z-0">
                <div className="text-[30vw] font-black italic leading-none uppercase text-foreground">SHARD</div>
            </div>
            
            <style jsx global>{`
                .custom-scrollbar::-webkit-scrollbar { width: 4px; height: 4px; }
                .custom-scrollbar::-webkit-scrollbar-thumb { background: hsla(var(--primary), 0.1); border-radius: 20px; }
                .neural-grid {
                    background-image: linear-gradient(hsla(var(--primary), 0.05) 1px, transparent 1px), 
                                      linear-gradient(90deg, hsla(var(--primary), 0.05) 1px, transparent 1px);
                    background-size: 80px 80px;
                }
            `}</style>
        </div>
    );
}
