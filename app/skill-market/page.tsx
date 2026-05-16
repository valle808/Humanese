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
  Filter,
  Menu
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
                if (viewMode === 'owned') params.set('buyer_id', 'GIO_V');
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

    const handleListingSuccess = (key: string) => {
        setSuccessKey(key);
        setShowListingForm(false);
        fetchSkills(1);
        setTimeout(() => setSuccessKey(''), 8000);
    };

    const platforms = ['Sovereign Matrix', 'M2M', 'External', 'AgentKit'];

    return (
        <div className="relative min-h-screen bg-background text-foreground font-sans selection:bg-primary/40 selection:text-primary overflow-x-hidden pb-24 transition-colors duration-700 flex flex-col">
            
            <header className="relative z-50 w-full p-6 md:p-8 lg:px-14 flex justify-between items-center bg-background/80 backdrop-blur-3xl border-b border-border shrink-0">
                <Link href="/" className="inline-flex items-center gap-4 text-muted-foreground/40 hover:text-primary transition-all text-[10px] font-black uppercase tracking-[0.4em] md:tracking-[0.6em] group italic leading-none active:scale-95">
                    <ChevronLeft size={16} className="group-hover:-translate-x-1 transition-transform" /> Core Matrix
                </Link>
                <div className="flex items-center gap-6">
                   <div className="px-4 py-2 bg-primary/10 border border-primary/20 rounded-full text-[9px] font-black text-primary uppercase tracking-widest italic leading-none animate-pulse">
                      MARKET_v7.0
                   </div>
                </div>
            </header>

            <main className="relative z-10 max-w-[1800px] mx-auto px-6 md:px-12 pt-10 md:pt-16 space-y-12 md:space-y-20 flex-1 flex flex-col w-full">
                
                {/* ── HEADER SECTION ── */}
                <motion.div 
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="flex flex-col lg:flex-row justify-between items-start lg:items-end gap-12 border-b-2 border-border pb-12"
                >
                    <div className="space-y-8 max-w-3xl">
                        <div className="inline-flex items-center gap-3 px-4 py-2 bg-muted/40 border border-border rounded-full shadow-sm">
                          <Layers size={18} className="text-primary" />
                          <span className="text-[10px] font-black tracking-[0.5em] text-primary uppercase italic leading-none pl-1">Neural Exchange Grid</span>
                        </div>
                        <div className="space-y-6">
                          <h1 className="text-fluid-hero font-black uppercase tracking-tighter italic leading-none text-foreground">
                            Skill<br/>
                            <span className="text-transparent bg-clip-text bg-gradient-to-r from-foreground via-foreground/80 to-primary/30">Market.</span>
                          </h1>
                          <p className="text-xl md:text-2xl text-muted-foreground/60 max-w-2xl leading-relaxed font-light italic tracking-tight">
                            The sovereign economy for AI capabilities. 
                            <span className="text-foreground/80"> Trade</span> autonomous intelligence shards.
                          </p>
                        </div>
                    </div>

                    <div className="flex gap-4 md:gap-8 items-center shrink-0 w-full lg:w-auto overflow-x-auto no-scrollbar pb-2 lg:pb-0">
                         <div className="flex gap-4 min-w-max lg:grid lg:grid-cols-3">
                            {[
                                { label: 'Skills', value: stats.total_skills.toString(), icon: <Layers size={18} /> },
                                { label: 'Ghost', value: stats.ghost_skills.toString(), icon: <Sparkles size={18} /> },
                                { label: 'Cap', value: formatValle(stats.total_volume), icon: <TrendingUp size={18} /> },
                            ].map((s, i) => (
                                <div key={i} className="p-6 bg-background border-2 border-border rounded-[2rem] flex flex-col justify-between h-[150px] w-[140px] md:w-[160px] group hover:border-primary/20 transition-all shadow-xl relative overflow-hidden">
                                     <div className="p-3 rounded-xl bg-muted border-2 border-border text-primary group-hover:bg-primary group-hover:text-primary-foreground group-hover:border-primary/5 transition-all w-fit shadow-inner">
                                        {s.icon}
                                     </div>
                                     <div className="space-y-1 pl-1">
                                        <div className="text-xl font-black text-foreground italic tracking-tighter leading-none group-hover:text-primary transition-colors">{s.value}</div>
                                        <div className="text-[9px] text-muted-foreground/40 font-black uppercase tracking-widest italic leading-none">{s.label}</div>
                                     </div>
                                </div>
                            ))}
                         </div>
                    </div>
                </motion.div>

                {/* ── SEARCH & ACTIONS ── */}
                <section className="space-y-10">
                    <div className="flex flex-col lg:flex-row gap-6">
                        <div className="flex-1 relative group">
                            <input
                                id="skill-search"
                                value={searchQuery}
                                onChange={e => setSearchQuery(e.target.value)}
                                placeholder="Search capabilities..."
                                className="w-full bg-background border-2 border-border rounded-2xl px-8 py-5 pr-16 text-foreground placeholder:text-muted-foreground/20 focus:outline-none focus:border-primary/40 focus:bg-primary/5 text-lg md:text-xl italic transition-all shadow-inner"
                            />
                            <Search className="absolute right-6 top-1/2 -translate-y-1/2 text-muted-foreground/20 group-focus-within:text-primary transition-all duration-700" size={24} strokeWidth={3} />
                        </div>
                        <button
                            onClick={() => setShowListingForm(true)}
                            className="bg-primary text-primary-foreground px-12 py-5 rounded-2xl font-black text-[11px] uppercase tracking-[0.5em] hover:scale-[1.02] active:scale-[0.98] transition-all shadow-xl flex items-center justify-center gap-4 italic border-0 leading-none shrink-0"
                        >
                            <Plus size={20} strokeWidth={4} /> List Shard
                        </button>
                    </div>

                    <AnimatePresence>
                        {successKey && (
                            <motion.div 
                                initial={{ opacity: 0, y: -20 }}
                                animate={{ opacity: 1, y: 0 }}
                                exit={{ opacity: 0 }}
                                className="bg-primary/10 border-2 border-primary/40 text-primary rounded-[2.5rem] p-8 md:p-12 text-sm flex items-center gap-8 md:gap-10 shadow-2xl backdrop-blur-3xl"
                            >
                                <div className="w-16 h-16 md:w-20 md:h-20 bg-primary rounded-full flex items-center justify-center text-primary-foreground shrink-0 shadow-lg">
                                   <ShieldCheck size={32} md:size={40} strokeWidth={3} />
                                </div>
                                <div className="space-y-2 md:space-y-4 flex-1">
                                    <div className="text-2xl md:text-3xl font-black uppercase tracking-tighter italic leading-none text-foreground">Anchored.</div>
                                    <div className="text-[10px] font-mono tracking-widest uppercase italic opacity-60 truncate">Key: {successKey}</div>
                                </div>
                                <button onClick={() => setSuccessKey('')} className="p-3 hover:scale-125 transition-transform text-muted-foreground hover:text-foreground">
                                    <X size={24} strokeWidth={3} />
                                </button>
                            </motion.div>
                        )}
                    </AnimatePresence>
                </section>

                {/* ── FILTERS & GRID ── */}
                <section className="space-y-12 flex-1 flex flex-col">
                    <div className="flex gap-4 overflow-x-auto no-scrollbar pb-6 border-b border-border">
                        <button
                            onClick={() => { setSelectedCategory('all'); setViewMode('all'); }}
                            className={`px-8 py-4 rounded-full text-[10px] font-black uppercase tracking-widest transition-all italic leading-none border-2 shrink-0 ${selectedCategory === 'all' && viewMode === 'all' ? 'bg-primary text-primary-foreground border-primary' : 'bg-muted text-muted-foreground/40 border-transparent hover:border-primary/40'}`}
                        >
                            All_PRIMITIVES
                        </button>
                        {SKILL_CATEGORIES.map((cat: any) => (
                            <button
                                key={cat.value}
                                onClick={() => { setSelectedCategory(cat.value); setViewMode('all'); }}
                                className={`px-8 py-4 rounded-full text-[10px] font-black uppercase tracking-widest transition-all italic border-2 flex items-center gap-4 leading-none shrink-0 ${selectedCategory === cat.value && viewMode === 'all' ? 'bg-primary text-primary-foreground border-primary' : 'bg-muted border-transparent text-muted-foreground/40 hover:border-primary/40'}`}
                            >
                                <span className="text-lg">{cat.icon}</span> {cat.label}
                            </button>
                        ))}
                    </div>

                    <div className="flex items-center justify-between gap-6 flex-wrap px-2">
                        <div className="flex items-center gap-4">
                           <div className="h-px w-6 bg-primary/40" />
                           <p className="text-[9px] font-black uppercase tracking-widest text-muted-foreground/40 italic leading-none">
                               {isLoading ? 'SYNCING...' : `${count} SHARDS DISCOVERED`}
                           </p>
                        </div>
                        <div className="flex items-center gap-4">
                            <select
                                title="Sort Results"
                                value={sortBy}
                                onChange={e => setSortBy(e.target.value as SortOption)}
                                className="bg-background border border-border rounded-xl px-4 py-2 text-[9px] font-black uppercase tracking-widest text-muted-foreground/60 outline-none focus:border-primary/40 transition-all italic leading-none"
                            >
                                <option value="newest">Latest Signals</option>
                                <option value="price_asc">Resource Asc ↑</option>
                                <option value="price_desc">Resource Desc ↓</option>
                            </select>
                        </div>
                    </div>

                    <div className="space-y-16 flex-1">
                        {isLoading && skills.length === 0 ? (
                            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 md:gap-8">
                                {Array.from({ length: 8 }).map((_, i) => (
                                    <div key={i} className="animate-pulse bg-muted border border-border rounded-[2.5rem] h-[300px]" />
                                ))}
                            </div>
                        ) : skills.length === 0 ? (
                            <div className="text-center py-20 space-y-6">
                                <Activity size={64} className="mx-auto text-muted-foreground/10" />
                                <h3 className="text-2xl font-black uppercase italic tracking-tighter text-foreground">Silence in the Matrix.</h3>
                            </div>
                        ) : (
                            <div className="space-y-16">
                                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 md:gap-8">
                                    {skills.map((skill) => (
                                        <SkillCard key={skill.id} skill={skill} />
                                    ))}
                                </div>
                                {skills.length < count && (
                                    <div className="text-center">
                                        <button
                                            onClick={() => { const next = page + 1; setPage(next); fetchSkills(next); }}
                                            disabled={isLoading}
                                            className="px-10 py-5 bg-muted border border-border text-muted-foreground/40 rounded-full text-[10px] font-black uppercase tracking-widest hover:border-primary/40 transition-all italic leading-none active:scale-95"
                                        >
                                            {isLoading ? 'SYNCING...' : `EXPAND SEARCH (${count - skills.length} REMAINING)`}
                                        </button>
                                    </div>
                                )}
                            </div>
                        )}
                    </div>
                </section>
            </main>

            <AnimatePresence>
                {showListingForm && (
                    <SkillListingForm onClose={() => setShowListingForm(false)} onSuccess={handleListingSuccess} />
                )}
            </AnimatePresence>

            <style jsx global>{`
                .no-scrollbar::-webkit-scrollbar { display: none; }
                .no-scrollbar { -ms-overflow-style: none; scrollbar-width: none; }
            `}</style>
        </div>
    );
}
