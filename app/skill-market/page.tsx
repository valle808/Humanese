'use client';

import React, { useState, useEffect, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { SkillCard } from '@/components/SkillCard';
import { SkillDetailModal } from '@/components/SkillDetailModal';
import { SkillListingForm } from '@/components/SkillListingForm';
import { SKILL_CATEGORIES, formatValle } from '@/lib/skill-market';
import type { Skill } from '@/lib/skill-market';
import { 
  Zap, 
  Search, 
  Plus, 
  History, 
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
  Wifi
} from 'lucide-react';
import Link from 'next/link';

type SortOption = 'newest' | 'price_asc' | 'price_desc' | 'rating' | 'popular';

interface MarketStats {
    total_skills: number;
    ghost_skills: number;
    total_volume: number;
}

interface DetailData {
    skill: Skill;
    reviews: any[];
    transactions: any[];
}

export default function SkillMarketPage() {
    const [skills, setSkills] = useState<Skill[]>([]);
    const [stats, setStats] = useState<MarketStats>({ total_skills: 0, ghost_skills: 0, total_volume: 0 });
    const [isLoading, setIsLoading] = useState(true);
    const [searchQuery, setSearchQuery] = useState('');
    const [selectedCategory, setSelectedCategory] = useState('all');
    const [sortBy, setSortBy] = useState<SortOption>('newest');
    const [selectedPlatform, setSelectedPlatform] = useState('');
    const [selectedSkill, setSelectedSkill] = useState<DetailData | null>(null);
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

    const handleSelectSkill = async (skill: Skill) => {
        try {
            const res = await fetch(`/api/skill-market/${skill.id}`);
            const data = await res.json();
            setSelectedSkill(data);
        } catch {
            setSelectedSkill({ skill, reviews: [], transactions: [] });
        }
    };

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
            alert(`Rejection: ${e.message}`);
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
        <div className="relative min-h-screen bg-background dark:bg-[#050505] text-foreground dark:text-white font-sans selection:bg-[#ff6b2b]/40 selection:text-white overflow-x-hidden pb-12 transition-colors duration-700 flex flex-col">
            
            {/* 🌌 AMBIENT CORE */}
            <div className="fixed inset-0 pointer-events-none z-0">
                <div className="absolute top-[-10%] right-[-10%] w-[100vw] h-[100vw] bg-[#ff6b2b]/5 blur-[350px] rounded-full animate-pulse" />
                <div className="absolute bottom-[-10%] left-[-20%] w-[90vw] h-[90vw] bg-[#ff6b2b]/3 blur-[200px] rounded-full" />
                <div className="absolute inset-0 bg-[url('/assets/noise.png')] opacity-[0.03] mix-blend-overlay" />
                
                {/* Animated Scanning Lines */}
                <div className="absolute inset-0 opacity-[0.05]">
                   <div className="h-px w-full bg-gradient-to-r from-transparent via-[#ff6b2b] to-transparent absolute top-1/4 animate-[scan_15s_linear_infinite]" />
                   <div className="h-px w-full bg-gradient-to-r from-transparent via-[#ff6b2b] to-transparent absolute top-3/4 animate-[scan_20s_linear_infinite_reverse]" />
                </div>
            </div>

            <header className="relative z-50 w-full p-4 lg:px-14 flex justify-between items-center bg-background/80 dark:bg-black/40 backdrop-blur-3xl border-b border-border dark:border-white/5 transition-colors duration-700 shrink-0">
                <Link href="/" className="inline-flex items-center gap-4 text-foreground/40 dark:text-white/20 hover:text-[#ff6b2b] dark:hover:text-[#ff6b2b] transition-all text-[11px] font-black uppercase tracking-[0.6em] group italic active:scale-95 leading-none">
                    <ChevronLeft size={16} className="group-hover:-translate-x-2 transition-transform" /> Core Matrix
                </Link>
                <div className="flex items-center gap-6">
                   <div className="px-6 py-2.5 bg-[#ff6b2b]/10 border border-[#ff6b2b]/20 rounded-full text-[10px] font-black text-[#ff6b2b] uppercase tracking-[0.4em] italic leading-none animate-pulse">
                      MARKET_v7.0_SYNC
                   </div>
                </div>
            </header>

            <main className="relative z-10 max-w-[1800px] mx-auto px-4 md:px-8 lg:px-12 pt-8 lg:pt-12 space-y-12 flex-1 flex flex-col">
                
                {/* ── HEADER SECTION ── */}
                <motion.div 
                    initial={{ opacity: 0, y: 40 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="flex flex-col lg:flex-row justify-between items-end gap-8 border-b-2 border-border dark:border-white/5 pb-8"
                >
                    <div className="space-y-6 max-w-3xl">
                        <div className="inline-flex items-center gap-3 px-5 py-2 bg-black/5 dark:bg-white/[0.03] border border-black/10 dark:border-white/5 rounded-full backdrop-blur-3xl shadow-lg dark:shadow-2xl">
                          <Layers size={20} className="text-[#ff6b2b]" />
                          <span className="text-[11px] font-black tracking-[0.8em] text-[#ff6b2b] uppercase italic leading-none pl-1">Neural Exchange Grid</span>
                        </div>
                        <div className="space-y-4">
                          <h1 className="text-5xl md:text-7xl font-black uppercase tracking-tighter italic leading-[0.8] pl-1 text-foreground dark:text-white/95">
                            Skill<br/>
                            <span className="text-transparent bg-clip-text bg-gradient-to-r from-foreground dark:from-white via-foreground/80 dark:via-white/80 to-[#ff6b2b]/30">Market.</span>
                          </h1>
                          <p className="text-lg md:text-xl text-foreground/60 dark:text-white/30 max-w-2xl leading-relaxed font-light italic tracking-tight">
                            The sovereign economy for AI capabilities. 
                            <span className="text-foreground/80 dark:text-white/60"> Buy, sell, and trade</span> autonomous intelligence shards.
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
                                <div key={i} className="p-5 md:p-6 bg-card dark:bg-[#050505] border-2 border-border dark:border-white/5 rounded-3xl backdrop-blur-3xl shadow-lg dark:shadow-[0_20px_40px_rgba(0,0,0,0.95)] flex flex-col justify-between h-[160px] min-w-[140px] group hover:border-[#ff6b2b]/20 transition-all shadow-inner relative overflow-hidden">
                                     <div className="absolute top-0 right-0 p-4 opacity-[0.03] dark:opacity-[0.01] group-hover:scale-125 transition-transform duration-1000 text-foreground dark:text-white font-black italic uppercase leading-none text-[3rem]">0{i+1}</div>
                                     <div className="p-4 rounded-2xl bg-background dark:bg-black border-2 border-border dark:border-white/5 text-[#ff6b2b] group-hover:bg-[#ff6b2b] group-hover:text-black group-hover:border-black/5 transition-all w-fit shadow-inner relative z-10">
                                        {s.icon}
                                     </div>
                                     <div className="space-y-2 relative z-10 pl-1">
                                        <div className="text-2xl font-black text-foreground dark:text-white italic tracking-tighter leading-none group-hover:text-[#ff6b2b] transition-colors">{s.value}</div>
                                        <div className="text-[9px] text-foreground/40 dark:text-white/30 font-black uppercase tracking-widest italic leading-none">{s.label}</div>
                                     </div>
                                </div>
                            ))}
                         </div>
                    </div>
                </motion.div>

                {/* ── SEARCH & ACTIONS ── */}
                <section className="space-y-8">
                    <div className="flex flex-col lg:flex-row gap-4">
                        <div className="flex-1 relative group">
                            <input
                                value={searchQuery}
                                onChange={e => setSearchQuery(e.target.value)}
                                placeholder="Search capabilities..."
                                className="w-full bg-background dark:bg-[#050505] border-2 border-border dark:border-white/5 rounded-full px-8 py-5 pr-16 text-foreground dark:text-white placeholder:text-foreground/30 dark:placeholder:text-white/20 focus:outline-none focus:border-[#ff6b2b]/40 focus:bg-[#ff6b2b]/5 text-lg italic transition-all shadow-md dark:shadow-[0_20px_40px_rgba(0,0,0,1)] shadow-inner"
                            />
                            <Search className="absolute right-6 top-1/2 -translate-y-1/2 text-foreground/20 dark:text-white/10 group-focus-within:text-[#ff6b2b] transition-all duration-700" size={24} strokeWidth={3} />
                        </div>
                        <button
                            onClick={() => setShowListingForm(true)}
                            className="bg-[#ff6b2b] text-black px-10 py-5 rounded-full font-black text-[10px] uppercase tracking-[0.6em] hover:scale-[1.02] active:scale-[0.98] transition-all shadow-[0_20px_40px_rgba(255,107,43,0.3)] flex items-center justify-center gap-4 italic relative overflow-hidden group border-0 leading-none shrink-0"
                        >
                            <span className="relative z-10 flex items-center gap-3">
                                <Plus size={18} strokeWidth={4} /> List Shard
                            </span>
                            <div className="absolute inset-0 bg-white opacity-0 group-hover:opacity-20 transition-opacity" />
                        </button>
                    </div>

                    <AnimatePresence>
                        {successKey && (
                            <motion.div 
                                initial={{ opacity: 0, y: -40 }}
                                animate={{ opacity: 1, y: 0 }}
                                exit={{ opacity: 0, y: -40 }}
                                className="bg-[#ff6b2b]/10 border-2 border-[#ff6b2b]/40 text-[#ff6b2b] rounded-[4rem] p-12 lg:p-14 text-sm flex items-center gap-10 shadow-[0_40px_100px_rgba(255,107,43,0.2)] backdrop-blur-3xl"
                            >
                                <div className="w-20 h-20 bg-[#ff6b2b] rounded-full flex items-center justify-center text-black shadow-[0_0_30px_#ff6b2b]">
                                   <ShieldCheck size={40} strokeWidth={3} />
                                </div>
                                <div className="space-y-4">
                                    <div className="text-3xl font-black uppercase tracking-tighter italic leading-none">Shard Anchored Successfully</div>
                                    <div className="text-[12px] font-mono tracking-widest uppercase italic opacity-60 flex items-center gap-4">Sovereign Key: <span className="text-foreground dark:text-white font-black bg-black/5 dark:bg-white/5 px-4 py-2 rounded-xl border border-black/10 dark:border-white/5">{successKey}</span></div>
                                </div>
                                <button onClick={() => setSuccessKey('')} className="ml-auto hover:scale-125 transition-transform p-4 bg-black/5 dark:bg-white/5 border border-black/10 dark:border-white/10 rounded-full text-foreground/40 dark:text-white/40 hover:text-foreground dark:hover:text-white">
                                    <X size={24} strokeWidth={3} />
                                </button>
                            </motion.div>
                        )}
                    </AnimatePresence>
                </section>

                {/* ── FILTERS & GRID ── */}
                <section className="space-y-10 flex-1 flex flex-col">
                    <div className="flex flex-wrap gap-4 border-b-2 border-border dark:border-white/5 pb-8">
                        <button
                            onClick={() => { setSelectedCategory('all'); setViewMode('all'); }}
                            className={`px-10 py-5 rounded-full text-[11px] font-black uppercase tracking-[0.5em] transition-all italic leading-none active:scale-95 border-2 ${selectedCategory === 'all' && viewMode === 'all' ? 'bg-[#ff6b2b] text-black border-[#ff6b2b] shadow-[0_20px_40px_rgba(255,107,43,0.3)]' : 'bg-black/5 dark:bg-white/5 text-foreground/40 dark:text-white/10 border-black/10 dark:border-white/5 hover:border-[#ff6b2b]/40 hover:text-foreground dark:hover:text-white'}`}
                        >
                            All_PRIMITIVES
                        </button>
                        <button
                            onClick={() => { setViewMode('owned'); setSelectedCategory('all'); }}
                            className={`px-10 py-5 rounded-full text-[11px] font-black uppercase tracking-[0.5em] transition-all italic leading-none active:scale-95 border-2 ${viewMode === 'owned' ? 'bg-foreground dark:bg-white text-background dark:text-black border-foreground dark:border-white shadow-[0_20px_40px_rgba(255,255,255,0.2)]' : 'bg-black/5 dark:bg-white/5 text-foreground/40 dark:text-white/10 border-black/10 dark:border-white/5 hover:border-black/20 dark:hover:border-white/40 hover:text-foreground dark:hover:text-white'}`}
                        >
                            Vault (Purchased)
                        </button>
                        {SKILL_CATEGORIES.map((cat: any) => (
                            <button
                                key={cat.value}
                                onClick={() => { setSelectedCategory(cat.value); setViewMode('all'); }}
                                className={`px-10 py-5 rounded-full text-[11px] font-black uppercase tracking-[0.5em] transition-all italic border-2 flex items-center gap-6 leading-none active:scale-95 ${selectedCategory === cat.value && viewMode === 'all' ? 'bg-[#ff6b2b] text-black border-[#ff6b2b] shadow-[0_20px_40px_rgba(255,107,43,0.3)]' : 'bg-black/5 dark:bg-white/5 border-black/10 dark:border-white/5 text-foreground/40 dark:text-white/10 hover:border-[#ff6b2b]/40 hover:text-foreground dark:hover:text-white'}`}
                            >
                                <span className="text-lg">{cat.icon}</span> {cat.label}
                            </button>
                        ))}
                    </div>

                    <div className="flex items-center justify-between gap-6 flex-wrap">
                        <div className="flex items-center gap-4 pl-2">
                           <div className="h-px w-8 bg-[#ff6b2b]/40" />
                           <p className="text-[10px] font-black uppercase tracking-widest text-foreground/40 dark:text-white/30 italic leading-none">
                               {isLoading ? 'Synchronizing Neural Bus...' : `${count} discovered`}
                           </p>
                        </div>
                        <div className="flex flex-wrap items-center gap-4">
                            <select
                                title="Platform"
                                value={selectedPlatform}
                                onChange={e => setSelectedPlatform(e.target.value)}
                                className="bg-background dark:bg-black border-2 border-border dark:border-white/5 rounded-xl px-5 py-2.5 text-[10px] font-black uppercase tracking-widest text-foreground/60 dark:text-white/40 focus:outline-none focus:border-[#ff6b2b]/40 transition-all italic shadow-inner active:scale-95 leading-none"
                            >
                                <option value="">All Platforms</option>
                                {platforms.map(p => <option key={p} value={p}>{p}</option>)}
                            </select>
                            <select
                                title="Sort Results"
                                value={sortBy}
                                onChange={e => setSortBy(e.target.value as SortOption)}
                                className="bg-background dark:bg-black border-2 border-border dark:border-white/5 rounded-xl px-5 py-2.5 text-[10px] font-black uppercase tracking-widest text-foreground/60 dark:text-white/40 focus:outline-none focus:border-[#ff6b2b]/40 transition-all italic shadow-inner active:scale-95 leading-none"
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
                                    <div key={i} className="animate-pulse bg-card dark:bg-[#050505] border-2 border-border dark:border-white/5 rounded-[3rem] h-[300px] shadow-inner" />
                                ))}
                            </div>
                        ) : skills.length === 0 ? (
                            <div className="text-center py-24 space-y-8">
                                <div className="relative inline-block">
                                    <Activity size={80} className="mx-auto text-foreground/10 dark:text-white/5" strokeWidth={1} />
                                    <div className="absolute inset-0 bg-[#ff6b2b]/10 blur-[60px] rounded-full animate-ping" />
                                </div>
                                <div className="space-y-4">
                                    <h3 className="text-3xl font-black uppercase tracking-tighter italic text-foreground dark:text-white/90">Silence in the Matrix.</h3>
                                    <p className="text-lg text-foreground/60 dark:text-white/40 font-light italic tracking-tight">No capabilities discovered in this frequency spectrum.</p>
                                    <button
                                        onClick={() => setShowListingForm(true)}
                                        className="mt-8 px-10 py-5 bg-foreground dark:bg-white text-background dark:text-black rounded-full text-[10px] font-black uppercase tracking-widest hover:bg-[#ff6b2b] dark:hover:bg-[#ff6b2b] transition-all italic active:scale-95 shadow-xl border-0 inline-block"
                                    >
                                        + Anchor First Shard
                                    </button>
                                </div>
                            </div>
                        ) : (
                            <div className="space-y-12">
                                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                                    {skills.map((skill, i) => (
                                        <SkillCard key={skill.id} skill={skill} onSelect={handleSelectSkill} />
                                    ))}
                                </div>
                                {skills.length < count && (
                                    <div className="text-center">
                                        <button
                                            onClick={() => { const next = page + 1; setPage(next); fetchSkills(next); }}
                                            disabled={isLoading}
                                            className="px-12 py-5 bg-card dark:bg-[#050505] border-2 border-border dark:border-white/5 text-foreground/60 dark:text-white/40 rounded-full text-[10px] font-black uppercase tracking-widest hover:border-[#ff6b2b]/40 hover:text-foreground dark:hover:text-white transition-all italic disabled:opacity-50 active:scale-95 shadow-lg leading-none"
                                        >
                                            {isLoading ? 'Synchronizing...' : `Expand Search (${count - skills.length} remaining)`}
                                        </button>
                                    </div>
                                )}
                            </div>
                        )}

                        <div className="pt-16 border-t-2 border-border dark:border-white/5 hidden lg:block">
                            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                                {[
                                    { icon: <Cpu size={48} strokeWidth={2.5} />, title: 'Sovereign Protocol', body: 'Every shard is assigned a definitive network key, ensuring cryptographic scarcity and immutable ownership across the ledger.' },
                                    { icon: <Sparkles size={48} strokeWidth={2.5} />, title: 'Ghost Mode', body: 'Encrypted acquisition. Shards can be moved into autonomous ghost state — fully operational but invisible to public indexing.' },
                                    { icon: <Globe size={48} strokeWidth={2.5} />, title: 'Omni-Matrix', body: 'Universal trade layer. Direct integration for agents, humans, machines, and external hardware swarms for seamless task execution.' },
                                ].map((f, i) => (
                                    <div key={i} className="space-y-6 text-center group">
                                        <div className="w-16 h-16 bg-card dark:bg-[#050505] border-2 border-border dark:border-white/5 rounded-2xl flex items-center justify-center mx-auto text-foreground/40 dark:text-white/30 group-hover:bg-[#ff6b2b] group-hover:text-black group-hover:border-[#ff6b2b]/10 transition-all duration-700 shadow-inner group-hover:scale-110">
                                            {React.cloneElement(f.icon as React.ReactElement, { size: 28 })}
                                        </div>
                                        <div className="space-y-3">
                                           <h3 className="text-2xl font-black uppercase italic tracking-tighter group-hover:text-[#ff6b2b] transition-colors leading-none">{f.title}</h3>
                                           <p className="text-sm text-foreground/60 dark:text-white/40 font-light leading-relaxed italic tracking-tight group-hover:text-foreground/80 dark:group-hover:text-white/60 transition-colors">{f.body}</p>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </div>
                </section>

                {/* ── FOOTER SIGNAL ── */}
                <section className="pt-16 pb-8 text-center space-y-6">
                    <div className="w-full flex justify-center gap-2">
                       <div className="w-2 h-2 rounded-full bg-[#ff6b2b] shadow-[0_0_10px_#ff6b2b]" />
                       <div className="w-2 h-2 rounded-full bg-black/10 dark:bg-white/10" />
                       <div className="w-2 h-2 rounded-full bg-black/10 dark:bg-white/10" />
                    </div>
                    <Link href="/" className="inline-flex items-center gap-4 text-[10px] font-black uppercase tracking-widest text-foreground/40 dark:text-white/30 hover:text-[#ff6b2b] transition-all italic group active:scale-95 leading-none">
                        <ChevronLeft size={16} className="group-hover:-translate-x-2 transition-transform" strokeWidth={3} /> Return to Core Shard
                    </Link>
                </section>
            </main>

            <AnimatePresence>
                {selectedSkill && (
                    <SkillDetailModal
                        skill={selectedSkill.skill}
                        reviews={selectedSkill.reviews}
                        transactions={selectedSkill.transactions}
                        onClose={() => setSelectedSkill(null)}
                        onBuy={handleBuy}
                    />
                )}
                {showListingForm && (
                    <SkillListingForm onClose={() => setShowListingForm(false)} onSuccess={handleListingSuccess} />
                )}
            </AnimatePresence>

            {/* BACKGROUND DECOR */}
            <div className="fixed bottom-0 left-0 p-16 opacity-[0.01] pointer-events-none select-none z-0">
                <div className="text-[30vw] font-black italic leading-none uppercase">SHARD</div>
            </div>
            
            <style jsx global>{`
                @keyframes scan {
                  from { transform: translateY(-100%); }
                  to { transform: translateY(1000%); }
                }
                .custom-scrollbar::-webkit-scrollbar { width: 4px; height: 4px; }
                .custom-scrollbar::-webkit-scrollbar-thumb { background: rgba(255, 107, 43, 0.15); border-radius: 20px; }
            `}</style>
        </div>
    );
}
